import { useCallback } from 'react';
import { auth, db } from '../services/firebase/config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';

export const useAuthHandlers = ({ onLoginSuccess, setError, setSuccessMessage, setIsLoading }) => {

    const handleAuthError = useCallback((err) => {
        if (err.message) {
            if(err.message.includes('auth/invalid-credential')) {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
                return;
            }
             if(err.message.includes('auth/wrong-password')) {
                setError('كلمة المرور الحالية غير صحيحة.');
                return;
            }
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
          case 'auth/wrong-password':
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
            break;
          case 'auth/invalid-email':
            setError('البريد الإلكتروني الذي أدخلته غير صالح.');
            break;
           case 'auth/popup-closed-by-user':
            setError('تم إلغاء تسجيل الدخول.');
            break;
          case 'auth/requires-recent-login':
            setError('تتطلب هذه العملية إعادة تسجيل الدخول. يرجى تسجيل الخروج ثم الدخول مرة أخرى.');
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

    const handleChangePassword = useCallback(async (currentPassword, newPassword) => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("المستخدم غير مسجل دخوله.");
            }

            if (user.providerData?.some(p => p.providerId === 'google.com')) {
                throw new Error("لا يمكن تغيير كلمة المرور للحسابات المرتبطة بجوجل. يرجى تغييرها من إعدادات حساب جوجل الخاص بك.");
            }

            if (!user.email) {
                throw new Error("لا يوجد بريد إلكتروني مرتبط بهذا الحساب لتغيير كلمة المرور.");
            }

            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            
            return { success: true };
        } catch (err) {
            console.error("Change Password Error:", err);
            
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                setError('كلمة المرور الحالية التي أدخلتها غير صحيحة.');
                return { success: false, error: 'كلمة المرور الحالية التي أدخلتها غير صحيحة.' };
            }

            if (err.message && !err.code) { // Handle custom thrown errors
              setError(err.message);
              return { success: false, error: err.message };
            }
            
            handleAuthError(err); // Fallback for other Firebase errors
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    }, [setError, setSuccessMessage, setIsLoading, handleAuthError]);


    return { handleEmailSignup, handleEmailLogin, handleGoogleSignIn, handleForgotPassword, handleChangePassword };
};