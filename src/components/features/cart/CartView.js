

import React, { useState, useEffect, useMemo } from 'react';
import { CartHeader } from './CartHeader.js';
import { EmptyCart } from './EmptyCart.js';
import { CartItem } from './CartItem.js';
import { CartSummary } from './CartSummary.js';

const CartView = ({ 
    isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckoutRequest, 
    recentlyViewedProducts, onViewDetails,
    // New props from useApp
    cartSubtotal,
    totalSavedFromProductDiscounts,
    couponDiscount,
    cartGrandTotal,
    appliedCoupon,
    couponCodeInput,
    setCouponCodeInput,
    handleApplyCoupon,
    handleRemoveCoupon
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [animationClass, setAnimationClass] = useState('');
  const [showItems, setShowItems] = useState(false); // For delayed rendering

  useEffect(() => {
    let itemsTimer;
    if (isOpen) {
      setIsRendered(true);
      // Delay showing content to allow animation to start smoothly
      itemsTimer = setTimeout(() => setShowItems(true), 80);
      requestAnimationFrame(() => {
        setAnimationClass('animate-slide-in-right');
      });
    } else if (isRendered) {
      setShowItems(false);
      setAnimationClass('animate-slide-out-right');
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 250); // Match new animation duration
      return () => clearTimeout(timer);
    }
    return () => {
        if (itemsTimer) clearTimeout(itemsTimer);
    };
  }, [isOpen, isRendered]);

  const totalItemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isRendered && !isOpen) {
    return null;
  }

  return React.createElement("div", {
    className: `fixed inset-0 z-[100] flex justify-end overflow-hidden ${isRendered ? '' : 'hidden'}`,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "cart-title"
  },
    React.createElement("div", {
      className: `absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen && animationClass === 'animate-slide-in-right' ? "opacity-100" : "opacity-0"}`,
      onClick: handleOverlayClick,
      "aria-hidden": "true"
    }),
    React.createElement("div", {
      className: `cart-panel fixed top-0 bottom-0 right-0 w-full max-w-md bg-white dark:bg-dark-800 shadow-xl flex flex-col text-dark-900 dark:text-dark-50 ${animationClass}`
    },
      React.createElement(CartHeader, { onClose: onClose }),
      showItems && (cartItems.length === 0 ? (
        React.createElement(EmptyCart, { 
            onClose: onClose, 
            recentlyViewedProducts: recentlyViewedProducts, 
            onViewDetails: onViewDetails 
        })
      ) : (
        React.createElement(React.Fragment, null,
          React.createElement("div", { className: "flex-grow overflow-y-auto p-5 sm:p-6 space-y-4" },
            cartItems.map(item => React.createElement(CartItem, { key: item.id, item: item, onUpdateQuantity: onUpdateQuantity, onRemoveItem: onRemoveItem }))
          ),
          React.createElement(CartSummary, { 
              subtotal: cartSubtotal, 
              totalSaved: totalSavedFromProductDiscounts,
              grandTotal: cartGrandTotal, 
              totalItemCount, 
              onCheckoutRequest, 
              onClose,
              couponCode: couponCodeInput,
              setCouponCode: setCouponCodeInput,
              onApplyCoupon: handleApplyCoupon,
              appliedCoupon: appliedCoupon,
              onRemoveCoupon: handleRemoveCoupon,
              couponDiscount: couponDiscount
          })
        )
      ))
    )
  );
};

export { CartView };