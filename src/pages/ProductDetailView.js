import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.js';
import { ProductDetailView as ProductDetailOrchestrator } from '../components/features/products/product-detail/ProductDetailView.js';

const ProductDetailView = () => {
    const app = useApp();
    const navigate = useNavigate();
    const { productId } = useParams();

    const product = app.allProducts.find(p => p.id === productId);

    useEffect(() => {
        if (product) {
            app.addRecentlyViewed(product.id);
        }
    }, [product, app]);

    if (app.productsLoading) {
        return React.createElement("div", { className: "w-full min-h-[calc(100vh-200px)] flex items-center justify-center" },
            React.createElement("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" })
        );
    }
    
    if (!product) {
        return React.createElement("div", {className: "container mx-auto px-4 py-12 pt-24 sm:pt-32 text-center bg-light-50 dark:bg-dark-900 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center"}, 
            React.createElement("svg", { xmlns:"http://www.w3.org/2000/svg", fill:"none", viewBox:"0 0 24 24", strokeWidth:"1.5", stroke:"currentColor", className:"w-16 h-16 text-red-400 mb-4"}, React.createElement("path", {strokeLinecap:"round", strokeLinejoin:"round", d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"})),
            React.createElement("h2", {className: "text-2xl font-semibold text-red-500 mb-3"}, "عفواً، المنتج غير متوفر"),
            React.createElement("p", {className: "text-md text-dark-700 dark:text-dark-100 mb-6"}, "قد يكون المنتج الذي تبحث عنه قد تم إزالته أو أن الرابط غير صحيح."),
            React.createElement("button", {
                onClick: () => navigate('/'),
                className: "mt-4 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-8 rounded-lg transition-colors"
            }, "العودة إلى الصفحة الرئيسية")
        );
    }
    
    // Explicitly map handleAddToCart and handleToggleWishlist to the expected prop names.
    return React.createElement(ProductDetailOrchestrator, { 
        ...app,
        product: product,
        onBack: () => navigate(-1),
        onViewDetails: (p) => navigate(`/product/${p.id}`),
        // Pass the correct functions for adding to cart and toggling wishlist
        onAddToCart: app.handleAddToCart,
        onToggleWishlist: app.handleToggleWishlist,
        isInWishlist: (app.wishlistItems || []).includes(product.id),
        onLoginRequest: () => app.setIsLoginModalOpen(true),
        onInitiateDirectCheckout: app.handleInitiateDirectCheckout,
        onPendingReviewLogin: (productId) => { 
            app.setPendingActionAfterLogin({ type: 'submitReview', payload: { productId }});
            app.setIsLoginModalOpen(true);
            app.setToastMessage({ text: "يرجى تسجيل الدخول أولاً لإضافة تقييم.", type: 'info' });
        }
    });
};

export { ProductDetailView };