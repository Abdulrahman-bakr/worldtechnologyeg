


import React from 'react';
import { useApp } from '../contexts/AppContext.js';
import { HomeView } from './HomeView.js';
import { ProductListView } from './ProductListView.js';
import { ProductDetailView } from './ProductDetailView.js';
import { TermsView } from './Static-Pages/TermsOfServiceView.js';
import { FAQView } from './Static-Pages/FAQView.js';
import { AboutUsView } from './Static-Pages/AboutUsView.js';
import { WishlistView } from './WishlistView.js';
import { UserProfileView } from './UserProfileView.js';
import { OrdersView } from './OrdersView.js';
import { OrderTrackingView } from './OrderTrackingView.js';
import { AdminDashboardView } from './AdminDashboardView.js';

export const Router = () => {
    const {
        productsLoading, currentView, detailedProduct, products, handleAddToCart,
        handleViewProductDetail, handleBackFromSubView, handleToggleWishlist,
        wishlistItems, currentUser, setIsLoginModalOpen, handleInitiateDirectCheckout,
        setPendingActionAfterLogin, setToastMessage, allDigitalPackages, allFeeRules,
        handleNavigation, handleUpdateUserProfileData
    } = useApp();

    // Prevent global loading from unmounting the admin dashboard, which has its own loading states.
    if (productsLoading && currentView !== 'adminDashboard') {
        return React.createElement("div", { className: "flex justify-center items-center min-h-[calc(100vh-200px)]" },
            React.createElement("p", { className: "text-lg text-dark-700 dark:text-dark-100" }, "جاري تحميل المنتجات...")
        );
    }
    
    const mainContent = (() => {
        switch (currentView) {
            case 'productDetail':
                return React.createElement(ProductDetailView, { 
                    product: detailedProduct, 
                    allProducts: products, 
                    onAddToCart: handleAddToCart, 
                    onViewDetails: handleViewProductDetail, 
                    onBack: handleBackFromSubView,
                    onToggleWishlist: handleToggleWishlist, 
                    isInWishlist: detailedProduct ? (wishlistItems || []).includes(detailedProduct.id) : false,
                    wishlistItems: wishlistItems, 
                    currentUser: currentUser, 
                    onLoginRequest: () => setIsLoginModalOpen(true),
                    onInitiateDirectCheckout: handleInitiateDirectCheckout,
                    onPendingReviewLogin: (productId) => { 
                        setPendingActionAfterLogin({ type: 'submitReview', payload: { productId }});
                        setIsLoginModalOpen(true);
                        setToastMessage({ text: "يرجى تسجيل الدخول أولاً لإضافة تقييم.", type: 'info' });
                    },
                    allDigitalPackages: allDigitalPackages,
                    allFeeRules: allFeeRules,
                    setToastMessage: setToastMessage
                });
            case 'terms':
                return React.createElement(TermsView, { onBack: handleBackFromSubView });
            case 'faq':
                return React.createElement(FAQView, { onBack: handleBackFromSubView });
            case 'aboutUs':
                return React.createElement(AboutUsView, { onBack: handleBackFromSubView });
            case 'wishlist':
                return React.createElement(WishlistView, {
                    wishlistProducts: products.filter(p => (wishlistItems || []).includes(p.id)),
                    onAddToCart: handleAddToCart, onViewDetails: handleViewProductDetail,
                    onBack: handleBackFromSubView, currentUser: currentUser, onLoginRequest: () => setIsLoginModalOpen(true),
                    onToggleWishlist: handleToggleWishlist, wishlistItems: wishlistItems,
                    onNavigate: handleNavigation
                });
            case 'userProfile':
                return React.createElement(UserProfileView, { 
                    currentUser: currentUser, 
                    onBack: handleBackFromSubView,
                    onNavigate: handleNavigation,
                    onUpdateProfile: handleUpdateUserProfileData
                });
            case 'ordersHistory':
                return React.createElement(OrdersView, {
                    currentUser: currentUser,
                    onBack: handleBackFromSubView,
                    onNavigate: handleNavigation 
                });
            case 'orderTracking':
                return React.createElement(OrderTrackingView, {
                    onBack: handleBackFromSubView,
                });
            case 'adminDashboard':
                return React.createElement(AdminDashboardView, {
                    onBack: handleBackFromSubView,
                });
            case 'productList':
                return React.createElement(ProductListView, null);
            case 'home':
            default:
                return React.createElement(HomeView, null);
        }
    })();
    
    return mainContent;
};
