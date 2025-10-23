import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ProductCard } from '../components/features/products/ProductCard.js';
import { HeartIcon } from '../components/icons/index.js';
import { useApp } from '../contexts/AppContext.js';

const WishlistUI = ({ wishlistProducts, onAddToCart, onToggleWishlist, currentUser, onLoginRequest }) => {
    const navigate = useNavigate();

    if (!currentUser) { 
        return React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-32 min-h-[calc(100vh-16rem)] text-center" },
            React.createElement(Helmet, null, React.createElement("title", null, "قائمة الرغبات - World Technology")),
            React.createElement("p", {className: "text-xl mb-4 text-dark-700 dark:text-dark-100"}, "يرجى تسجيل الدخول لعرض قائمة الرغبات."),
            React.createElement("button", { onClick: onLoginRequest, className: "bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-6 rounded-lg" }, "تسجيل الدخول")
        );
    }
    return React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-32 min-h-[calc(100vh-16rem)]" },
        React.createElement(Helmet, null, 
            React.createElement("title", null, "قائمة الرغبات - World Technology")
        ),
        React.createElement("button", {
            onClick: () => navigate(-1),
            className: "mb-8 text-primary hover:text-primary-hover font-semibold flex items-center space-x-2 space-x-reverse transition-colors"
        },
            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5 transform rtl:rotate-180" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" })
            ),
            React.createElement("span", null, "العودة")
        ),
        React.createElement("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-900 dark:text-dark-50 mb-8 text-center" }, "قائمة الرغبات"),
        wishlistProducts.length === 0 ? (
            React.createElement("div", { className: "text-center py-10" },
                React.createElement(HeartIcon, { className: "w-16 h-16 text-dark-500 dark:text-dark-400 mx-auto mb-4" }),
                React.createElement("p", { className: "text-xl text-dark-700 dark:text-dark-100" }, "قائمة رغباتك فارغة."),
                React.createElement("p", { className: "text-dark-600 dark:text-dark-300 mt-2 mb-6" }, "أضف المنتجات التي تعجبك لتجدها بسهولة لاحقًا."),
                React.createElement("button", {
                    onClick: () => navigate('/products'),
                    className: "bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
                }, "اكتشف منتجاتنا")
            )
        ) : (
            React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" },
                wishlistProducts.map(product =>
                    React.createElement(ProductCard, {
                        key: product.id,
                        product: product,
                        onAddToCart: onAddToCart,
                        onToggleWishlist: onToggleWishlist, 
                        isInWishlist: true,
                        currentUser: currentUser,
                        onLoginRequest: onLoginRequest
                    })
                )
            )
        )
    );
};


const WishlistView = () => {
    const { 
        products, 
        wishlistItems, 
        handleAddToCart, 
        handleToggleWishlist,
        currentUser, 
        setIsLoginModalOpen
    } = useApp();

    const wishlistProducts = products.filter(p => (wishlistItems || []).includes(p.id));

    return React.createElement(WishlistUI, {
        wishlistProducts: wishlistProducts,
        onAddToCart: handleAddToCart,
        onToggleWishlist: handleToggleWishlist,
        currentUser: currentUser,
        onLoginRequest: () => setIsLoginModalOpen(true),
    });
};

export { WishlistView };