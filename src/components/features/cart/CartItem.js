
import React from 'react';
import { TrashIcon } from '../../icons/index.js';
import { QuantityControls } from './QuantityControls.js';

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const originalItemPrice = item.product.price || 0;
  const discountedItemPrice = item.product.discountPrice;
  
  // FIX: Ensure hasValidDiscount is always a boolean to prevent React from rendering a '0'.
  const hasValidDiscount = typeof discountedItemPrice === 'number' && discountedItemPrice > 0 && discountedItemPrice < originalItemPrice;
  
  const currentItemPrice = item.serviceDetails?.finalPrice 
    ? Number(item.serviceDetails.finalPrice) 
    : (hasValidDiscount ? discountedItemPrice : originalItemPrice);
    
  const displayName = item.variant ? `${item.product.arabicName} (${item.variant.colorName})` : item.product.arabicName;

  return React.createElement("div", { className: "flex items-start space-x-4 space-x-reverse bg-light-100 dark:bg-dark-700 p-3 sm:p-4 rounded-lg border border-light-200 dark:border-dark-600" },
    React.createElement("img", {
      src: item.variant?.imageUrl || (item.serviceDetails?.package?.imageUrl) || (item.serviceDetails?.operatorLogo) || item.product.imageUrl,
      alt: displayName,
      loading: "lazy",
      className: "w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-md flex-shrink-0 bg-white p-1"
    }),
    React.createElement("div", { className: "flex-grow" },
      React.createElement("h3", { className: "text-md sm:text-lg font-semibold text-dark-900 dark:text-dark-50 mb-1" }, displayName),
      item.serviceDetails ? (
        React.createElement(React.Fragment, null,
          React.createElement("p", { className: "text-xs text-dark-700 dark:text-dark-200" }, `شحن لـ: ${item.serviceDetails.operatorName}`),
          React.createElement("p", { className: "text-xs text-dark-700 dark:text-dark-200" }, `رقم: ${item.serviceDetails.phoneNumber}`),
          React.createElement("p", { className: "text-xs text-dark-700 dark:text-dark-200" }, `مبلغ الشحن: ${item.serviceDetails.topupAmount} ج.م`),
          React.createElement("p", { className: "text-sm text-primary font-bold mt-1" }, `التكلفة: ${currentItemPrice.toFixed(2)} ج.م`)
        )
      ) : (
        React.createElement(React.Fragment, null,
          hasValidDiscount &&
          React.createElement("p", { className: "text-sm text-dark-500 dark:text-dark-300 line-through mb-1" }, 
            `${originalItemPrice.toFixed(2)} ج.م`
          ),
          React.createElement("p", { className: "text-sm text-primary font-bold mb-2" },
            `${currentItemPrice.toFixed(2)} ج.م`
          )
        )
      ),
      !item.serviceDetails && React.createElement(QuantityControls, { item, onUpdateQuantity })
    ),
    React.createElement("button", {
      onClick: () => onRemoveItem(item.id),
      "aria-label": "إزالة المنتج",
      className: "text-dark-600 dark:text-dark-300 hover:text-red-500 self-start pt-1"
    }, React.createElement(TrashIcon, { className: "w-5 h-5" }))
  );
};

export { CartItem };
