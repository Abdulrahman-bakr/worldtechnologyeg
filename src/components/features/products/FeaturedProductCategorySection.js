import React from 'react';
import { ProductCard } from './ProductCard.js';

// --- START OF FeaturedProductCategorySection.tsx ---
const FeaturedProductCategorySection = ({ title, categoryProducts, onAddToCart, onViewDetails, onViewAllClick, onToggleWishlist, wishlistItems = [], currentUser, onLoginRequest }) => {
    if (!categoryProducts || categoryProducts.length === 0) return null;
    const isProductInWishlist = (productId) => (wishlistItems || []).includes(productId);

    return React.createElement("section", { className: "py-10 sm:py-12 bg-light-100 dark:bg-dark-800" },
        React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8" },
            React.createElement("div", { className: "flex justify-between items-center mb-6 sm:mb-8" },
                React.createElement("h2", { className: "text-2xl sm:text-3xl font-bold text-dark-900 dark:text-dark-50" }, title),
                onViewAllClick && React.createElement("button", {
                    onClick: onViewAllClick,
                    className: "text-primary hover:text-primary-hover font-semibold text-sm sm:text-base transition-colors"
                }, "عرض الكل")
            ),
            categoryProducts.length > 0 ? (
                React.createElement("div", { className: "featured-products-scrollable flex overflow-x-auto py-2 -mx-2 px-2 space-x-4 space-x-reverse rounded" },
                    categoryProducts.map((product, index) =>
                        React.createElement("div", {
                            key: product.id,
                            className: "w-60 sm:w-64 md:w-72 flex-shrink-0 animate-fade-in-up",
                            style: { animationDelay: `${index * 0.05}s` }
                        }, React.createElement(ProductCard, { 
                            product: product, 
                            onAddToCart: onAddToCart, 
                            onViewDetails: onViewDetails,
                            onToggleWishlist: onToggleWishlist,
                            isInWishlist: isProductInWishlist(product.id),
                            currentUser: currentUser,
                            onLoginRequest: onLoginRequest
                        }))
                    )
                )
            ) : (
               React.createElement("p", {className: "text-center text-dark-600 dark:text-dark-300 py-4"}, "لا توجد منتجات في هذا القسم حالياً.")
            )
        )
    );
};
// --- END OF FeaturedProductCategorySection.tsx ---
export { FeaturedProductCategorySection };