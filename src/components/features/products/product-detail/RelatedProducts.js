import React from 'react';
import { ProductCard } from '../ProductCard.js';

const RelatedProducts = ({ relatedProducts, onAddToCart, onViewDetails, onToggleWishlist, wishlistItems, currentUser, onLoginRequest, onInitiateDirectCheckout }) => {
    const isProductInWishlist = (productId) => wishlistItems ? wishlistItems.includes(productId) : false;

    if (!relatedProducts || relatedProducts.length === 0) return null;

    return (
        React.createElement("div", { className: "mt-16 sm:mt-20" },
            React.createElement("h2", { className: "text-2xl sm:text-3xl font-bold text-dark-900 dark:text-dark-50 mb-6 sm:mb-8 text-center sm:text-right" },
                "منتجات مشابهة قد تعجبك"
            ),
            React.createElement("div", { className: "featured-products-scrollable flex overflow-x-auto py-2 -mx-2 px-2 space-x-4 space-x-reverse rounded" },
                relatedProducts.map((relatedProd, index) => (
                    React.createElement("div", {
                        key: relatedProd.id,
                        className: "w-60 sm:w-64 md:w-72 flex-shrink-0 animate-fade-in-up",
                        style: { animationDelay: `${index * 0.05}s` }
                    },
                        React.createElement(ProductCard, {
                            product: relatedProd,
                            onAddToCart: onAddToCart,
                            onViewDetails: onViewDetails,
                            onToggleWishlist: onToggleWishlist,
                            isInWishlist: isProductInWishlist(relatedProd.id),
                            currentUser: currentUser,
                            onLoginRequest: onLoginRequest,
                            onInitiateDirectCheckout: onInitiateDirectCheckout
                        })
                    )
                ))
            )
        )
    );
};

export { RelatedProducts };
