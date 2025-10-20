import React, { useState, useCallback } from 'react';
import { db } from '../services/firebase/config.js';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const useCheckout = ({ currentUser, cartItems, setIsCartOpen, setCartItems, setToastMessage, setIsLoginModalOpen, setPendingActionAfterLogin, handleUpdateCurrentUserAddress }) => {
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [checkoutPayload, setCheckoutPayload] = useState({ amount: 0, item: null, couponInfo: null });

    const attemptCheckout = useCallback((amount, item = null, couponInfo = {}) => {
        if (!currentUser) {
            setPendingActionAfterLogin({ type: 'checkout', payload: { amount, item, couponInfo } });
            setIsLoginModalOpen(true);
            setToastMessage({ text: "يرجى تسجيل الدخول أولاً لإتمام عملية الشراء.", type: 'info' });
            return;
        }
        setCheckoutPayload({ amount, item, couponInfo });
        setIsCheckoutModalOpen(true);
        setIsCartOpen(false);
    }, [currentUser, setIsLoginModalOpen, setToastMessage, setPendingActionAfterLogin, setIsCartOpen]);

    const handleInitiateDirectCheckout = useCallback((product, serviceDetails, userForCheck = currentUser) => {
        if (!userForCheck) {
            const actionType = 'directCheckout';
            setPendingActionAfterLogin({ type: actionType, payload: { product, serviceDetails } });
            setIsLoginModalOpen(true);
            setToastMessage({ text: "يرجى تسجيل الدخول أولاً لإتمام هذه الخدمة.", type: 'info' });
            return;
        }

        const itemToCheckout = {
            id: `${product.id}_direct_${Date.now()}`,
            product: product,
            quantity: 1,
            variant: null,
            serviceDetails: serviceDetails,
        };

        setCheckoutPayload({ amount: serviceDetails.finalPrice, item: itemToCheckout, couponInfo: null });
        setIsCheckoutModalOpen(true);
    }, [currentUser, setIsLoginModalOpen, setToastMessage, setPendingActionAfterLogin]);

    const handleCloseCheckoutModal = useCallback(() => {
        setIsCheckoutModalOpen(false);
    }, []);

    const handleCheckoutModalDataReset = useCallback(() => {
        setCheckoutPayload({ amount: 0, item: null, couponInfo: null });
    }, []);

    const handleOrderCompletion = useCallback(async (completionDetails) => {
        const { isDirectCheckout, pointsRedeemed } = completionDetails;
        if (!isDirectCheckout) {
            setCartItems([]);
        }
        setIsCheckoutModalOpen(false);
        setCheckoutPayload({ amount: 0, item: null, couponInfo: null });

        if (currentUser && currentUser.uid && pointsRedeemed > 0) {
            try {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const currentPoints = userDocSnap.data().loyaltyPoints || 0;
                    const newTotalPoints = Math.max(0, currentPoints - (pointsRedeemed || 0));
                    await updateDoc(userDocRef, { loyaltyPoints: newTotalPoints });
                    // The user object will update automatically via the onAuthStateChanged listener in useAuth
                }
            } catch (error) {
                console.error("Error updating loyalty points on checkout:", error);
            }
        }
        
        setToastMessage({ text: "تم إرسال طلبك بنجاح! سيتم التواصل معك للتأكيد.", type: "success" });
    }, [currentUser, setCartItems, setToastMessage, handleUpdateCurrentUserAddress]);

    return {
        isCheckoutModalOpen, setIsCheckoutModalOpen,
        checkoutPayload, setCheckoutPayload,
        handleCloseCheckoutModal,
        handleCheckoutModalDataReset,
        handleOrderCompletion,
        attemptCheckout,
        handleInitiateDirectCheckout
    };
};