import React from 'react';
import { ProductCard } from './ProductCard.js';

// --- START OF RecentlyViewedSection.tsx ---
const RecentlyViewedSection = ({ products, onAddToCart, onToggleWishlist, wishlistItems = [], currentUser, onLoginRequest }) => {
    if (!products || products.length === 0) return null;
    const isProductInWishlist = (productId) => (wishlistItems || []).includes(productId);

    return React.createElement("section", { className: "py-10 sm:py-12 bg-light-50 dark:bg-dark-900" },
        React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8" },
            React.createElement("h2", { className: "text-2xl sm:text-3xl font-bold text-dark-900 dark:text-dark-50 mb-6 sm:mb-8" }, "شوهدت مؤخراً"),
            React.createElement("div", { className: "featured-products-scrollable flex overflow-x-auto py-2 -mx-2 px-2 space-x-4 space-x-reverse rounded" },
                products.map((product, index) =>
                    React.createElement("div", {
                        key: product.id,
                        className: "w-48 sm:w-52 md:w-56 flex-shrink-0 animate-fade-in-up", /* Reduced width */
                        style: { animationDelay: `${index * 0.05}s` }
                    }, React.createElement(ProductCard, {
                        product: product,
                        onAddToCart: onAddToCart,
                        onToggleWishlist: onToggleWishlist,
                        isInWishlist: isProductInWishlist(product.id),
                        currentUser: currentUser,
                        onLoginRequest: onLoginRequest
                    }))
                )
            )
        )
    );
};
// --- END OF RecentlyViewedSection.tsx ---
export { RecentlyViewedSection };