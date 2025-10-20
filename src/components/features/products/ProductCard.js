import React from 'react';
import { useApp } from '../../../contexts/AppContext.js';
import { StarRating } from '../../ui/feedback/StarRating.js';
import { HeartIcon, ScaleIcon } from '../../icons/index.js';
import { getImageUrl } from '../../../utils/imageUrl.js';
import { ProductStatusBadge } from './ProductStatusBadge.js';
import { ProductPriceSection } from './ProductPriceSection.js';
import { ProductCardActions } from './ProductCardActions.js';

const ProductCard = ({ product, onAddToCart, onViewDetails, onToggleWishlist, isInWishlist, currentUser, onLoginRequest, onInitiateDirectCheckout }) => {
  const { comparisonList, handleToggleCompare } = useApp();
  const isDynamicService = product.isDynamicElectronicPayments;
  
  const handleViewDetailsClick = () => {
    onViewDetails(product);
  };

  const handleWishlistClick = () => {
    if (!currentUser) {
        onLoginRequest();
        return;
    }
    onToggleWishlist(product.id);
  };

  const handleCompareClick = () => {
    handleToggleCompare(product.id);
  };

  const isInCompareList = comparisonList.includes(product.id);

  const cardClasses = [
    "bg-white text-dark-900 dark:bg-dark-800 dark:text-dark-50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:transform hover:-translate-y-1 group flex flex-col h-full border border-light-200 dark:border-dark-700 hover:border-primary/50",
    (product.discountPrice && !product.isDynamicElectronicPayments) ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-white dark:ring-offset-dark-800' : ''
  ].join(' ');

  return React.createElement("div", {
      className: cardClasses
    },
    React.createElement("div", { className: "relative" },
      React.createElement("div", { onClick: handleViewDetailsClick, className: "cursor-pointer" },
        React.createElement("img", {
          src: getImageUrl(product.imageUrl),
          alt: product.arabicName,
          loading: "lazy",
          className: "w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        })
      ),
      React.createElement(ProductStatusBadge, { product: product, mode: "corner" }),
      React.createElement("div", {className: "absolute top-2.5 right-2.5 flex flex-col gap-2"},
        React.createElement("button", {
            onClick: handleWishlistClick,
            "aria-label": isInWishlist ? "إزالة من قائمة الرغبات" : "إضافة إلى قائمة الرغبات",
            className: `p-1.5 rounded-full bg-white/70 dark:bg-dark-700/70 hover:bg-white dark:hover:bg-dark-600 backdrop-blur-sm transition-colors text-red-500 z-10`
        }, React.createElement(HeartIcon, { filled: isInWishlist, className: "w-5 h-5" })),
        !isDynamicService && React.createElement("button", {
            onClick: handleCompareClick,
            "aria-label": isInCompareList ? "إزالة من المقارنة" : "إضافة للمقارنة",
            className: `p-1.5 rounded-full bg-white/70 dark:bg-dark-700/70 hover:bg-white dark:hover:bg-dark-600 backdrop-blur-sm transition-all z-10 ${isInCompareList ? 'text-primary' : 'text-dark-600 dark:text-dark-300'}`
        }, React.createElement(ScaleIcon, { className: "w-5 h-5" }))
      )
    ),
    React.createElement("div", { className: "py-5 px-5 sm:px-4 sm:py-4 flex flex-col flex-grow" },
      React.createElement("h3", { 
          onClick: handleViewDetailsClick,
          className: "text-md sm:text-lg font-semibold text-dark-900 dark:text-dark-50 mb-1.5 truncate group-hover:text-primary transition-colors cursor-pointer" 
      }, product.arabicName),
      product.brand && React.createElement("p", {className: "text-xs text-dark-600 dark:text-dark-300 mb-1"}, product.brand),
      !isDynamicService && React.createElement("div", { className: "flex items-center mb-2.5" },
        React.createElement(StarRating, { rating: product.rating || 0, className: "", showHalfStars: true }),
      ),
      React.createElement(ProductStatusBadge, { product: product, mode: "text" }),
      React.createElement(ProductPriceSection, { product: product }),
      React.createElement(ProductCardActions, { product: product, onAddToCart: onAddToCart, onViewDetails: onViewDetails, onInitiateDirectCheckout: onInitiateDirectCheckout })
    )
  );
};

export { ProductCard };