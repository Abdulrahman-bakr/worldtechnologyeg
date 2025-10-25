import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../services/firebase/config.js';
import { updateProfile, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export const useAuth = (setToastMessage) => {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            if (typeof localStorage !== 'undefined') {
                const storedUser = localStorage.getItem('currentUser');
                return storedUser ? JSON.parse(storedUser) : null;
            }
        } catch (e) { console.error("Error reading user from localStorage:", e); }
        return null;
    });

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [pendingActionAfterLogin, setPendingActionAfterLogin] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                let userDataFromFirestore = userDocSnap.exists() ? userDocSnap.data() : {};
                
                const freshAppUser = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || userDataFromFirestore.name || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'مستخدم'),
                    phone: userDataFromFirestore.phone || null,
                    defaultShippingAddress: userDataFromFirestore.defaultShippingAddress || null,
                    loyaltyPoints: userDataFromFirestore.loyaltyPoints || 0,
                    role: userDataFromFirestore.role || null,
                    createdAt: userDataFromFirestore.createdAt || null,
                };
                
                setCurrentUser(freshAppUser);
                try {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('currentUser', JSON.stringify(freshAppUser));
                    }
                } catch (e) { console.error("Error syncing fresh user to localStorage:", e); }
            } else {
                setCurrentUser(null);
                try {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.removeItem('currentUser');
                    }
                } catch (e) { console.error("Error removing user from localStorage:", e); }
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLoginSuccess = useCallback(async (firebaseUser, signupData = null) => {
        let nameToUse = (signupData && signupData.name) || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'مستخدم');

        if (signupData && signupData.name && firebaseUser.displayName !== signupData.name) {
            await updateProfile(firebaseUser, { displayName: signupData.name });
            nameToUse = signupData.name;
        }

        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        let existingData = userDocSnap.exists() ? userDocSnap.data() : {};
        
        const providerId = firebaseUser.providerData[0]?.providerId || 'password';

        const dataToSet = {
            name: nameToUse,
            email: firebaseUser.email.toLowerCase().trim(),
            phone: (signupData && signupData.phone) || existingData.phone || null,
            defaultShippingAddress: existingData.defaultShippingAddress === undefined ? null : existingData.defaultShippingAddress,
            authProvider: providerId,
            loyaltyPoints: existingData.loyaltyPoints === undefined ? 0 : existingData.loyaltyPoints,
            createdAt: existingData.createdAt || serverTimestamp(),
        };

        await setDoc(userDocRef, dataToSet, { merge: true });

        // Re-fetch to get merged data including the role and resolved timestamp
        const updatedUserDocSnap = await getDoc(userDocRef);
        const finalFirestoreData = updatedUserDocSnap.data() || {};

        const finalUserObject = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: nameToUse,
            phone: finalFirestoreData.phone,
            defaultShippingAddress: finalFirestoreData.defaultShippingAddress,
            loyaltyPoints: finalFirestoreData.loyaltyPoints,
            role: finalFirestoreData.role || null,
            createdAt: finalFirestoreData.createdAt || null,
        };

        setCurrentUser(finalUserObject);
        setIsLoginModalOpen(false);
        // Returns the final user object to be used by the pending action logic
        return finalUserObject;

    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await signOut(auth);
            setToastMessage({text: "تم تسجيل الخروج بنجاح.", type: 'info'});
        } catch (error) { 
            console.error("Failed to sign out", error); 
            setToastMessage({text: "حدث خطأ أثناء تسجيل الخروج.", type: 'error'});
        }
    }, [setToastMessage]);

    const handleUpdateCurrentUserAddress = useCallback((addressDetails) => {
        setCurrentUser(prevUser => {
            if (!prevUser) return null;
            const updatedUser = { ...prevUser, defaultShippingAddress: addressDetails };
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                }
            } catch(e) { console.error("Error setting currentUser in localStorage from address update:", e); }
            return updatedUser;
        });
        setToastMessage({ text: "تم حفظ العنوان كعنوان شحن افتراضي للطلبات القادمة.", type: 'info' });
    }, [setToastMessage]);

    const handleUpdateUserProfileData = useCallback(async (dataToUpdate) => {
        if (!currentUser?.uid) {
            setToastMessage({ text: "يجب تسجيل الدخول لتحديث البيانات.", type: 'error' });
            return false;
        }
        try {
            const userDocRef = doc(db, "users", currentUser.uid);
            await setDoc(userDocRef, dataToUpdate, { merge: true });

            const updatedUser = { ...currentUser, ...dataToUpdate };
            setCurrentUser(updatedUser);
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            }
            setToastMessage({ text: "تم تحديث الملف الشخصي بنجاح.", type: 'success' });
            return true;
        } catch (error) {
            console.error("Error updating user profile:", error);
            setToastMessage({ text: "حدث خطأ أثناء تحديث الملف الشخصي.", type: 'error' });
            return false;
        }
    }, [currentUser, setToastMessage]);

    return {
        currentUser,
        isLoginModalOpen, setIsLoginModalOpen,
        pendingActionAfterLogin, setPendingActionAfterLogin,
        handleLoginSuccess,
        handleLogout,
        handleUpdateCurrentUserAddress,
        handleUpdateUserProfileData,
    };
};