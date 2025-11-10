import React from 'react';
import { ProductCard } from '../ProductCard.js';
import { ProductListItem } from './ProductListItem.js';
import { ProductCardSkeleton } from '../../../ui/feedback/ProductCardSkeleton.js';
import { ProductListItemSkeleton } from '../../../ui/feedback/ProductListItemSkeleton.js';

const ProductList = ({ products, viewMode, isLoading, searchTerm, onAddToCart, onViewDetails, onToggleWishlist, wishlistItems = [], currentUser, onLoginRequest, onInitiateDirectCheckout }) => {
  const isProductInWishlist = (productId) => (wishlistItems || []).includes(productId);

  if (isLoading) {
    return viewMode === 'grid' ? (
      React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7" },
        [...Array(8)].map((_, index) => React.createElement(ProductCardSkeleton, { key: `skeleton-card-${index}` }))
      )
    ) : (
      React.createElement("div", { className: "space-y-6 sm:space-y-8" },
        [...Array(4)].map((_, index) => React.createElement(ProductListItemSkeleton, { key: `skeleton-list-item-${index}` }))
      )
    );
  }

  if (!products || products.length === 0) {
    const message = searchTerm
      ? `لم يتم العثور على منتجات تطابق البحث: "${searchTerm}"`
      : "لا توجد منتجات تطابق هذا الفلتر أو خيار الفرز.";
    return (
      React.createElement("div", { className: "text-center py-12 col-span-full" },
        React.createElement("p", { className: "text-xl text-dark-600 dark:text-dark-300" }, message)
      )
    );
  }

  return viewMode === 'grid' ? (
    React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7" },
      products.map((product, index) =>
        React.createElement("div", {
            key: product.id,
            className: "animate-fade-in-up",
            style: { animationDelay: `${index * 0.05}s` }
        }, React.createElement(ProductCard, { 
            product: product, 
            onAddToCart: onAddToCart, 
            onToggleWishlist: onToggleWishlist,
            isInWishlist: isProductInWishlist(product.id),
            currentUser: currentUser,
            onLoginRequest: onLoginRequest,
            onInitiateDirectCheckout: onInitiateDirectCheckout
        }))
      )
    )
  ) : (
    React.createElement("div", { className: "space-y-6 sm:space-y-8" },
      products.map((product, index) =>
        React.createElement("div", {
            key: product.id,
            className: "animate-fade-in-up",
            style: { animationDelay: `${index * 0.05}s` }
        }, React.createElement(ProductListItem, { 
            product: product, 
            onAddToCart: onAddToCart, 
            onViewDetails: onViewDetails 
        }))
      )
    )
  );
};

export { ProductList };