import React from 'react';
import { Link } from 'react-router-dom';
import { StarRating } from '../../../ui/feedback/StarRating.js';
import { ShoppingCartIcon } from '../../../icons/index.js';
import { getImageUrl } from '../../../../utils/imageUrl.js';

const ProductListItem = ({ product, onAddToCart }) => {
  const isDynamicService = product.isDynamicElectronicPayments;

  const handleActionClick = () => {
    if (!isDynamicService && product.stock > 0) {
      onAddToCart(product, null);
    }
  };

  const itemClasses = [
    "bg-white dark:bg-dark-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-primary/10 flex flex-col sm:flex-row border border-light-200 dark:border-dark-700 hover:border-primary/30",
    (product.discountPrice && product.discountPrice > 0 && !isDynamicService) ? 'ring-1 ring-red-500 ring-offset-1 ring-offset-white dark:ring-offset-dark-800' : ''
  ].join(' ');

  let discountPercentageText = "";
  if (!isDynamicService && product.discountPrice > 0 && product.price > 0) {
      const percentage = Math.round(((product.price - product.discountPrice) / product.price) * 100);
      discountPercentageText = ` (خصم ${percentage}%)`;
  }
  
  const stockStatusText = isDynamicService ? "خدمة متاحة" : (product.stock > 0 ? "متوفر" : product.stock > 0 ? "كمية محدودة" : "نفذ المخزون");
  const stockStatusColor = isDynamicService ? "text-blue-600 dark:text-blue-400" : (product.stock > 0 ? "text-green-600 dark:text-green-400" : product.stock > 0 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400");
  const actionButtonText = isDynamicService ? "اطلب الخدمة" : (product.stock > 0 ? "أضف للسلة" : "نفذ المخزون");

  return React.createElement("div", {
      className: itemClasses,
    },
    React.createElement(Link, { to: `/product/${product.id}`, className: "w-full sm:w-1/3 md:w-1/4 h-48 sm:h-auto cursor-pointer flex-shrink-0" },
        React.createElement("img", {
            src: getImageUrl(product.imageUrl),
            alt: product.arabicName,
            loading: "lazy",
            className: "w-full h-full object-cover",
        })
    ),
    React.createElement("div", { className: "p-5 flex flex-col flex-grow justify-between" },
      React.createElement("div", null,
        React.createElement(Link, { to: `/product/${product.id}` },
            React.createElement("h3", { 
                className: "text-xl sm:text-2xl font-semibold text-dark-900 dark:text-dark-50 mb-1 hover:text-primary transition-colors cursor-pointer" 
            }, product.arabicName)
        ),
        product.brand && React.createElement("p", {className: "text-sm text-dark-700 dark:text-dark-300 mb-2"}, product.brand),
        !isDynamicService && React.createElement(React.Fragment, null,
            React.createElement("div", { className: "flex items-center mb-1" },
              React.createElement(StarRating, { rating: product.rating, className: "" }),
            )
        ),
        React.createElement("p", {className: `text-sm font-semibold mb-2 ${stockStatusColor}`}, stockStatusText),
        React.createElement("p", { className: "text-sm text-dark-700 dark:text-dark-100 mb-3 line-clamp-2" }, product.description || "وصف المنتج غير متوفر حاليا.")
      ),
      React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4" },
        isDynamicService ? (
            React.createElement(Link, { to: `/product/${product.id}`, className: "text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-0" }, "خدمة حسب الطلب")
        ) : (product.discountPrice && product.discountPrice > 0) ? (
          React.createElement("div", { className: "flex items-baseline space-x-2 space-x-reverse mb-3 sm:mb-0" },
            React.createElement("p", { className: "text-2xl sm:text-3xl font-bold text-primary" }, `${product.discountPrice.toFixed(2)} ج.م`),
            React.createElement("p", { className: "text-md text-dark-600 dark:text-dark-300 line-through" }, `${(product.price || 0).toFixed(2)} ج.م`),
            discountPercentageText && React.createElement("span", {className: "text-sm text-red-600 font-semibold"}, discountPercentageText)
          )
        ) : (
          React.createElement("p", { className: "text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-0" }, `${(product.price || 0).toFixed(2)} ج.م`)
        ),
        React.createElement(Link, {
            to: isDynamicService ? `/product/${product.id}` : '#',
            onClick: (e) => { if (!isDynamicService) { e.preventDefault(); handleActionClick(); } },
            className: `w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse ${(!isDynamicService && product.stock === 0) ? 'opacity-50 cursor-not-allowed bg-dark-500 hover:bg-dark-500 pointer-events-none' : ''}`,
            "aria-label": isDynamicService ? `اطلب خدمة ${product.arabicName}` : (product.stock > 0 ? `أضف ${product.arabicName} إلى السلة` : `${product.arabicName} نفذ المخزون`)
        }, React.createElement(ShoppingCartIcon, { className: "w-5 h-5" }), React.createElement("span", null, actionButtonText))
      )
    )
  );
};
export { ProductListItem };