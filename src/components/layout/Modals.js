import React from 'react';
import { useApp } from '../../contexts/AppContext.js';
import { LoginModal } from '../features/auth/LoginModal.js';
import { CheckoutModal } from '../features/checkout/CheckoutModal.js';
import { CartView } from '../features/cart/CartView.js';
import { AIChatModal } from '../features/ai-chat/AIChatModal.js';
import { ToastNotification } from '../ui/feedback/ToastNotification.js';
import { ComparisonModal } from '../features/comparison/ComparisonModal.js';
import { PopupBanner } from '../ui/PopupBanner.js';
import { CATEGORIES } from '../../constants/index.js';

export const Modals = () => {
    const {
        isLoginModalOpen, setIsLoginModalOpen, pendingActionAfterLogin, setPendingActionAfterLogin, handleLoginSuccess,
        isCheckoutModalOpen, handleCloseCheckoutModal, handleCheckoutModalDataReset, checkoutPayload, cartItems,
        handleOrderCompletion, currentUser, handleUpdateCurrentUserAddress, attemptCheckout,
        isCartOpen, setIsCartOpen, handleUpdateQuantity, handleRemoveFromCart,
        isChatOpen, setIsChatOpen, products, handleNavigation, recentlyViewedIds,
        toastMessage, setToastMessage,
        isComparisonModalOpen, setIsComparisonModalOpen,
        recentlyViewedProducts, handleViewProductDetail,
        activePopup,
        // Coupon props
        cartSubtotal,
        totalSavedFromProductDiscounts,
        couponDiscount,
        cartGrandTotal,
        appliedCoupon,
        couponCodeInput,
        setCouponCodeInput,
        handleApplyCoupon,
        handleRemoveCoupon,
        loyaltySettings,
    } = useApp();

    return (
        React.createElement(React.Fragment, null,
            isLoginModalOpen && React.createElement(LoginModal, {
                isOpen: isLoginModalOpen,
                onClose: () => {
                    setIsLoginModalOpen(false);
                    if (pendingActionAfterLogin) setPendingActionAfterLogin(null);
                },
                onLoginSuccess: handleLoginSuccess
            }),
            isCheckoutModalOpen && React.createElement(CheckoutModal, {
                isOpen: isCheckoutModalOpen,
                onClose: handleCloseCheckoutModal,
                onClosed: handleCheckoutModalDataReset,
                checkoutPayload: checkoutPayload,
                cartItems: cartItems,
                itemToCheckout: checkoutPayload.item,
                onCompleteOrder: handleOrderCompletion,
                currentUser: currentUser,
                onUpdateCurrentUserAddress: handleUpdateCurrentUserAddress,
                loyaltySettings: loyaltySettings
            }),
            React.createElement(CartView, {
                isOpen: isCartOpen,
                onClose: () => setIsCartOpen(false),
                cartItems: cartItems,
                onUpdateQuantity: handleUpdateQuantity,
                onRemoveItem: handleRemoveFromCart,
                onCheckoutRequest: attemptCheckout,
                recentlyViewedProducts: recentlyViewedProducts.slice(0, 4),
                onViewDetails: handleViewProductDetail,
                // Pass coupon props
                cartSubtotal: cartSubtotal,
                totalSavedFromProductDiscounts: totalSavedFromProductDiscounts,
                couponDiscount: couponDiscount,
                cartGrandTotal: cartGrandTotal,
                appliedCoupon: appliedCoupon,
                couponCodeInput: couponCodeInput,
                setCouponCodeInput: setCouponCodeInput,
                handleApplyCoupon: handleApplyCoupon,
                handleRemoveCoupon: handleRemoveCoupon
            }),
            React.createElement(AIChatModal, {
                isOpen: isChatOpen,
                onClose: () => setIsChatOpen(false),
                products: products,
                categories: CATEGORIES,
                onNavigate: handleNavigation,
                recentlyViewedIds: recentlyViewedIds,
            }),
            React.createElement(ToastNotification, {
                message: toastMessage.text,
                type: toastMessage.type,
                onClose: () => setToastMessage({ text: null, type: 'success' })
            }),
            isComparisonModalOpen && React.createElement(ComparisonModal, {
                isOpen: isComparisonModalOpen,
                onClose: () => setIsComparisonModalOpen(false)
            }),
            activePopup && React.createElement(PopupBanner, {
                popupConfig: activePopup
            })
        )
    );
};