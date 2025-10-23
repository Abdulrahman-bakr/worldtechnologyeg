import { useCallback } from 'react';
import { auth, db } from '../services/firebase/config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';

export const useAuthHandlers = ({ onLoginSuccess, setError, setSuccessMessage, setIsLoading }) => {

    const handleAuthError = useCallback((err) => {
        if (err.message) {
            setError(err.message);
            return;
        }
        switch (err.code) {
          case 'auth/weak-password':
            setError('كلمة المرور ضعيفة جداً. يجب أن تتكون من 6 أحرف على الأقل.');
            break;
          case 'auth/email-already-in-use':
            setError('هذا البريد الإلكتروني مسجل بالفعل. هل تريد تسجيل الدخول بدلاً من ذلك؟');
            break;
          case 'auth/invalid-credential':
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
            break;
          case 'auth/invalid-email':
            setError('البريد الإلكتروني الذي أدخلته غير صالح.');
            break;
           case 'auth/popup-closed-by-user':
            setError('تم إلغاء تسجيل الدخول.');
            break;
          default:
            setError('حدث خطأ. يرجى المحاولة مرة أخرى.');
            break;
        }
    }, [setError]);

    const processLogin = useCallback(async (firebaseUser, signupData = null) => {
        await onLoginSuccess(firebaseUser, signupData);
    }, [onLoginSuccess]);
    
    const handleEmailSignup = useCallback(async (name, email, phone, password, confirmPassword) => {
        setError('');
        setSuccessMessage('');
        setIsLoading(true);
        const normalizedEmail = email.toLowerCase().trim();
        try {
            if (password !== confirmPassword) throw new Error('كلمتا المرور غير متطابقتين.');
            if (!/^\d{11}$/.test(phone)) throw new Error('رقم الهاتف يجب أن يتكون من 11 رقمًا.');

            const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
            await processLogin(userCredential.user, { name, phone });
        } catch (err) {
            console.error("Signup Error:", err);
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    }, [processLogin, setError, setSuccessMessage, setIsLoading, handleAuthError]);

    const handleEmailLogin = useCallback(async (email, password) => {
        setError('');
        setSuccessMessage('');
        setIsLoading(true);
        const normalizedEmail = email.toLowerCase().trim();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
            await processLogin(userCredential.user);
        } catch (err) {
            console.error("Login Error:", err);
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    }, [processLogin, setError, setSuccessMessage, setIsLoading, handleAuthError]);

    const handleGoogleSignIn = useCallback(async () => {
        setIsLoading(true);
        setError('');
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await processLogin(result.user);
        } catch (err) {
            console.error("Google Sign-In Error:", err);
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    }, [processLogin, setError, setIsLoading, handleAuthError]);

    const handleForgotPassword = useCallback(async (email, phone) => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        const normalizedEmail = email.toLowerCase().trim();
        const normalizedPhone = phone.trim();

        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", normalizedEmail), where("phone", "==", normalizedPhone));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error("البيانات غير متطابقة. يرجى التأكد من البريد الإلكتروني ورقم الهاتف المسجلين بالحساب.");
            }
            const userDocData = querySnapshot.docs[0].data();

            if (userDocData.authProvider === 'password') {
                await sendPasswordResetEmail(auth, normalizedEmail);
                setSuccessMessage("تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح.");
            } else if (userDocData.authProvider === 'google.com') {
                throw new Error("هذا الحساب مرتبط بجوجل. يرجى تسجيل الدخول باستخدام جوجل.");
            } else {
                throw new Error("لا يمكن استعادة كلمة المرور لهذا الحساب.");
            }
        } catch (err) {
            console.error("Forgot Password Error:", err);
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    }, [setError, setSuccessMessage, setIsLoading, handleAuthError]);

    return { handleEmailSignup, handleEmailLogin, handleGoogleSignIn, handleForgotPassword };
};