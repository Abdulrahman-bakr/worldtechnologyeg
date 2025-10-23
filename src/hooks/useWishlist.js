import { useState, useEffect, useCallback } from 'react';

export const useWishlist = (currentUser, setIsLoginModalOpen, setPendingActionAfterLogin, setToastMessage) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        try {
            if (typeof localStorage !== 'undefined') {
                const storedWishlist = localStorage.getItem('wishlistItems');
                return storedWishlist ? JSON.parse(storedWishlist) : [];
            }
        } catch (e) { console.error("Error loading wishlist from localStorage:", e); }
        return [];
    });

    useEffect(() => {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
            }
        } catch (e) { console.error("Error saving wishlist to localStorage:", e); }
    }, [wishlistItems]);

    const handleToggleWishlist = useCallback((productId) => {
        if (!currentUser) {
            setPendingActionAfterLogin({ type: 'toggleWishlist', payload: { productId } });
            setIsLoginModalOpen(true);
            setToastMessage({ text: "يرجى تسجيل الدخول أولاً لإضافة منتجات لقائمة الرغبات.", type: 'info' });
            return;
        }

        setWishlistItems(prev => {
            if (prev.includes(productId)) {
                setToastMessage({ text: "تمت الإزالة من قائمة الرغبات.", type: 'info' });
                return prev.filter(id => id !== productId);
            } else {
                setToastMessage({ text: "تمت الإضافة إلى قائمة الرغبات!", type: 'success' });
                return [...prev, productId];
            }
        });
    }, [currentUser, setToastMessage, setIsLoginModalOpen, setPendingActionAfterLogin]);

    return { wishlistItems, handleToggleWishlist };
};