import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../contexts/AppContext.js';
import { StarRating } from '../../ui/feedback/StarRating.js';
import { HeartIcon, ScaleIcon, EyeIcon } from '../../icons/index.js';
import { getImageUrl } from '../../../utils/imageUrl.js';
import { ProductStatusBadge } from './ProductStatusBadge.js';
import { ProductPriceSection } from './ProductPriceSection.js';
import { ProductCardActions } from './ProductCardActions.js';
import { getDiscountPercentage } from '../../../utils/productUtils.js';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isInWishlist, currentUser, onLoginRequest, onInitiateDirectCheckout }) => {
  const { comparisonList, handleToggleCompare } = useApp();
  const isDynamicService = product.isDynamicElectronicPayments;
  
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
        onLoginRequest();
        return;
    }
    onToggleWishlist(product.id);
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleToggleCompare(product.id);
  };

  const isInCompareList = comparisonList.includes(product.id);
  const hasValidDiscount = getDiscountPercentage(product.price, product.discountPrice) > 0 && !isDynamicService;

  const cardClasses = [
    "group bg-white dark:bg-dark-800",
    "rounded-xl shadow-soft hover:shadow-elevated dark:shadow-dark-soft dark:hover:shadow-dark-elevated",
    "border border-gray-100 dark:border-dark-700",
    "overflow-hidden",
    "hover:-translate-y-1 flex flex-col h-full relative",
  ].join(' ');

  return React.createElement("div", {
      className: cardClasses
    },
    React.createElement("div", { className: "relative flex-1 flex flex-col" },
      
      // Image Section - More Compact
      React.createElement("div", { className: "relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-900" },
        React.createElement(Link, { 
          to: `/product/${product.id}`, 
          className: "block cursor-pointer relative aspect-[4/3]" 
        },
          React.createElement("img", {
            src: getImageUrl(product.imageUrl),
            alt: product.arabicName,
            loading: "lazy",
            className: "w-full h-52 object-cover transition-all duration-300 group-hover:scale-105"
          }),
          // Gradient Overlay on Hover
          React.createElement("div", {
            className: "absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          })
        ),
        
        // Quick View Button - More Compact
        React.createElement(Link, {
          to: `/product/${product.id}`,
          className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-95"
        },
          React.createElement("div", {
            className: "bg-white/90 dark:bg-dark-600/90 backdrop-blur-md rounded-lg px-2 py-1 shadow-lg"
          },
            React.createElement("div", { className: "flex items-center gap-1 text-xs font-medium text-dark-900 dark:text-white" },
              React.createElement(EyeIcon, { className: "w-3 h-3" }),
              "عرض سريع"
            )
          )
        ),

        // Status Badge - TOP LEFT
        React.createElement("div", { className: "absolute top-2 left-2 z-20" },
          React.createElement(ProductStatusBadge, { product: product, mode: "corner" })
        ),

        // Action Buttons - More Compact
        React.createElement("div", {
          className: "absolute bottom-2 right-2 flex flex-col gap-1"
        },
          React.createElement("button", {
              onClick: handleWishlistClick,
              "aria-label": isInWishlist ? "إزالة من قائمة الرغبات" : "إضافة إلى قائمة الرغبات",
              className: `p-1.5 rounded-lg backdrop-blur-md transition-all duration-300 transform hover:scale-105 hover:rotate-12 ${
                isInWishlist 
                  ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-md' 
                  : 'bg-white/80 dark:bg-dark-700/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-dark-600 shadow-soft'
              }`
          }, React.createElement(HeartIcon, { 
            filled: isInWishlist, 
            className: "w-3.5 h-3.5" 
          })),
          !isDynamicService && React.createElement("button", {
              onClick: handleCompareClick,
              "aria-label": isInCompareList ? "إزالة من المقارنة" : "إضافة للمقارنة",
              className: `p-1.5 rounded-lg backdrop-blur-md transition-all duration-300 transform hover:scale-105 hover:-rotate-12 ${
                isInCompareList 
                  ? 'bg-gradient-to-br from-primary to-blue-500 text-white shadow-md' 
                  : 'bg-white/80 dark:bg-dark-700/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-dark-600 shadow-soft'
              }`
          }, React.createElement(ScaleIcon, { className: "w-3.5 h-3.5" }))
        )
      ),
      
      // Content Section - More Compact
      React.createElement("div", { className: "p-3 flex flex-col flex-grow" },
        
        // Category Tag - More Compact
        product.category && React.createElement("div", { className: "mb-1" },
          React.createElement("span", {
            className: "inline-block px-2 py-0.5 bg-gray-100 dark:bg-dark-700 text-xs text-gray-600 dark:text-gray-300 rounded-full font-medium"
          }, product.category)
        ),

        // Product Name and Brand - More Compact
        React.createElement("div", { className: "mb-2" },
          React.createElement(Link, { 
            to: `/product/${product.id}`,
            className: "block group/title"
          },
            React.createElement("h3", { 
                className: "text-sm font-semibold text-dark-900 dark:text-white mb-1 line-clamp-2 leading-tight group-hover/title:text-primary transition-colors duration-200" 
            }, product.arabicName)
          ),
          product.brand && React.createElement("div", { className: "flex items-center gap-1 mt-1" },
            React.createElement("span", {
              className: "text-xs text-primary font-medium"
            }, "العلامة:"),
            React.createElement("span", {
              className: "text-xs text-dark-500 dark:text-dark-300"
            }, product.brand)
          )
        ),

        // Rating and Reviews - More Compact
        !isDynamicService && React.createElement("div", { className: "mb-2 flex items-center justify-between" },
          React.createElement(StarRating, { 
            rating: product.rating || 0, 
            size: "xs",
            showHalfStars: true 
          }),
          product.reviewCount && React.createElement("span", {
            className: "text-xs text-gray-500 dark:text-gray-400"
          }, `(${product.reviewCount})`)
        ),

        // Status Badge (Text) - More Compact
        React.createElement("div", { className: "mb-2" },
          React.createElement(ProductStatusBadge, { product: product, mode: "text" })
        ),

        // Price Section - More Compact
        React.createElement("div", { className: "mb-2" },
          React.createElement(ProductPriceSection, { product: product })
        ),

        // Actions - More Compact
        React.createElement("div", { className: "mt-auto" },
          React.createElement(ProductCardActions, { 
            product: product, 
            onAddToCart: onAddToCart, 
            onInitiateDirectCheckout: onInitiateDirectCheckout 
          })
        )
      ),

      // Border Effect - Subtle
      React.createElement("div", {
        className: "absolute inset-0 rounded-xl border border-transparent group-hover:border-primary/10 transition-all duration-300 pointer-events-none"
      })
    )
  );
};

export { ProductCard };