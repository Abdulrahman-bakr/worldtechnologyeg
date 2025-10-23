
import React from 'react';
import { ShoppingCartIcon, HeartIcon } from '../../../icons/index.js';
import { SocialShareButtons } from './SocialShareButtons.js';

const ActionButtons = ({ product, currentStock, handleActionClick, handleWishlistToggle, isInWishlist }) => {
    const isDynamicService = product.isDynamicElectronicPayments;
    const actionButtonText = isDynamicService ? "اطلب الخدمة الآن" : (product.allowDirectPurchase ? "شراء الآن" : "أضف إلى السلة");

    return (
        React.createElement("div", { className: "pt-4" },
            React.createElement("div", { className: "flex items-center space-x-3 space-x-reverse" },
                React.createElement("button", {
                    onClick: handleActionClick,
                    disabled: !isDynamicService && currentStock === 0,
                    className: "flex-grow sm:flex-grow-0 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-dark-500",
                    "aria-label": isDynamicService ? `اطلب خدمة ${product.arabicName}` : (currentStock > 0 ? `أضف ${product.arabicName} إلى السلة` : `${product.arabicName} نفذ من المخزون`)
                }, React.createElement(ShoppingCartIcon, { className: "w-6 h-6" }), React.createElement("span", null, currentStock === 0 && !isDynamicService ? "نفذ المخزون" : actionButtonText)),
                React.createElement("button", {
                    onClick: handleWishlistToggle,
                    "aria-label": isInWishlist ? "إزالة من قائمة الرغبات" : "إضافة إلى قائمة الرغبات",
                    className: "p-3 rounded-lg bg-light-200 dark:bg-dark-700 hover:bg-light-300 dark:hover:bg-dark-600 transition-colors text-red-500 border border-light-300 dark:border-dark-600"
                }, React.createElement(HeartIcon, { filled: isInWishlist, className: "w-6 h-6" }))
            ),
            React.createElement(SocialShareButtons, { product: product })
        )
    );
};

export { ActionButtons };
