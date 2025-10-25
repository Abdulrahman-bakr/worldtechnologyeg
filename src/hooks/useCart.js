import { useState, useEffect, useMemo, useCallback } from 'react';

export const useCart = (setToastMessage, setActivePopover) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            if (typeof localStorage !== 'undefined') {
                const storedCart = localStorage.getItem('cartItems');
                // Basic validation to ensure it's an array
                const parsed = storedCart ? JSON.parse(storedCart) : [];
                return Array.isArray(parsed) ? parsed : [];
            }
        } catch (error) { console.error("Error loading cart from localStorage:", error); }
        return [];
    });
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [miniCartTriggerTimestamp, setMiniCartTriggerTimestamp] = useState(null);

    useEffect(() => {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            }
        } catch (e) { console.error("Error saving cart to localStorage:", e); }
    }, [cartItems]);

    const handleAddToCart = useCallback((productToAdd, variantDetails = null) => {
        if (productToAdd.isDynamicElectronicPayments) {
            return;
        }
        
        setCartItems(prevItems => {
            const cartId = (variantDetails && variantDetails.colorHex) 
                ? `${productToAdd.id}_${variantDetails.colorHex.replace('#', '')}` 
                : productToAdd.id;
            
            const existingItem = prevItems.find(item => item.id === cartId && !item.serviceDetails);
            
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === cartId && !item.serviceDetails
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                const newItem = {
                    id: cartId,
                    productId: productToAdd.id,
                    quantity: 1,
                    variant: variantDetails,
                    serviceDetails: null
                };
                return [...prevItems, newItem];
            }
        });
        
        const toastName = variantDetails 
            ? `${productToAdd.arabicName} (${variantDetails.colorName})` 
            : productToAdd.arabicName;

        setToastMessage({ text: `${toastName} أضيف إلى السلة!`, type: 'success' });
        setMiniCartTriggerTimestamp(Date.now());
    }, [setToastMessage]);

    const handleUpdateQuantity = useCallback((cartId, quantity) => {
        setCartItems(prevItems => {
            const itemToUpdate = prevItems.find(item => item.id === cartId);
            if (itemToUpdate && itemToUpdate.serviceDetails) { 
                if (quantity <= 0) return prevItems.filter(item => item.id !== cartId); 
                return prevItems; 
            }

            if (quantity <= 0) {
                return prevItems.filter(item => item.id !== cartId);
            }
            return prevItems.map(item =>
                item.id === cartId
                    ? { ...item, quantity: quantity }
                    : item
            );
        });
    }, []);

    const handleRemoveFromCart = useCallback((cartId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== cartId));
    }, []);

    const cartItemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

    return {
        cartItems, setCartItems,
        isCartOpen, setIsCartOpen,
        handleAddToCart,
        handleUpdateQuantity,
        handleRemoveFromCart,
        cartItemCount,
        miniCartTriggerTimestamp, setMiniCartTriggerTimestamp
    };
};
