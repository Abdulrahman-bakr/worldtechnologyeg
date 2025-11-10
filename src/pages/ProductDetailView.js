

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../contexts/AppContext.js';
import { ProductDetailView as ProductDetailOrchestrator } from '../components/features/products/product-detail/ProductDetailView.js';
import { getImageUrl } from '../utils/imageUrl.js';

const ProductDetailView = () => {
    const app = useApp();
    const navigate = useNavigate();
    const { productId } = useParams();

    const product = app.allProducts.find(p => p.id === productId);
    
    const { addRecentlyViewed } = app;
    useEffect(() => {
        if (product) {
            addRecentlyViewed(product.id);
        }
    }, [product, addRecentlyViewed]);

    if (app.productsLoading) {
        return React.createElement("div", { className: "w-full min-h-[calc(100vh-200px)] flex items-center justify-center" },
            React.createElement("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" })
        );
    }
    
    if (!product) {
        return React.createElement("div", {className: "container mx-auto px-4 py-12 pt-24 sm:pt-32 text-center bg-light-50 dark:bg-dark-900 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center"}, 
            React.createElement(Helmet, null,
                React.createElement("title", null, "المنتج غير موجود - World Technology")
            ),
            React.createElement("svg", { xmlns:"http://www.w3.org/2000/svg", fill:"none", viewBox:"0 0 24 24", strokeWidth:"1.5", stroke:"currentColor", className:"w-16 h-16 text-red-400 mb-4"}, React.createElement("path", {strokeLinecap:"round", strokeLinejoin:"round", d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"})),
            React.createElement("h2", {className: "text-2xl font-semibold text-red-500 mb-3"}, "عفواً، المنتج غير متوفر"),
            React.createElement("p", {className: "text-md text-dark-700 dark:text-dark-100 mb-6"}, "قد يكون المنتج الذي تبحث عنه قد تم إزالته أو أن الرابط غير صحيح."),
            React.createElement("button", {
                onClick: () => navigate('/'),
                className: "mt-4 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-8 rounded-lg transition-colors"
            }, "العودة إلى الصفحة الرئيسية")
        );
    }
    
    const pageTitle = `${product.arabicName} - World Technology`;
    const pageDescription = product.description
        ? product.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
        : `اشترِ ${product.arabicName} بأفضل سعر من متجر World Technology.`;
    const imageUrl = getImageUrl(product.imageUrl);
    const productUrl = window.location.href;


    return React.createElement(React.Fragment, null,
        React.createElement(Helmet, null,
            React.createElement("title", null, pageTitle),
            React.createElement("meta", { name: "description", content: pageDescription }),
            React.createElement("link", { rel: "canonical", href: productUrl }),

            /* Open Graph / Facebook / WhatsApp */
            React.createElement("meta", { property: "og:type", content: "product" }),
            React.createElement("meta", { property: "og:url", content: productUrl }),
            React.createElement("meta", { property: "og:title", content: pageTitle }),
            React.createElement("meta", { property: "og:description", content: pageDescription }),
            React.createElement("meta", { property: "og:image", content: imageUrl }),
            React.createElement("meta", { property: "og:site_name", content: "World Technology Store" }),

            /* Twitter */
            React.createElement("meta", { name: "twitter:card", content: "summary_large_image" }),
            React.createElement("meta", { name: "twitter:url", content: productUrl }),
            React.createElement("meta", { name: "twitter:title", content: pageTitle }),
            React.createElement("meta", { name: "twitter:description", content: pageDescription }),
            React.createElement("meta", { name: "twitter:image", content: imageUrl })
        ),
        React.createElement(ProductDetailOrchestrator, { 
            ...app,
            product: product,
            onBack: () => navigate(-1),
            onViewDetails: (p) => navigate(`/product/${p.id}`),
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
        })
    );
};

export { ProductDetailView };