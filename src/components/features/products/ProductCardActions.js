import React from 'react';
import { ShoppingCartIcon } from '../../icons/index.js';

export const ProductCardActions = ({ product, onAddToCart, onViewDetails, onInitiateDirectCheckout }) => {
    const { dynamicServiceType, isDynamicElectronicPayments: isDynamicService } = product;
    const normalizedServiceType = (dynamicServiceType || '').replace(/_/g, '-');

    const isTopupService = isDynamicService && ['mobile-credit', 'game-topup', 'mobile-card-topup'].includes(normalizedServiceType);
    
    const isBillPaymentService = isDynamicService && (
        normalizedServiceType === 'bill-payment' || 
        ['fawry-pay', 'internet-bill'].includes(normalizedServiceType)
    );
    
    const isBookingService = isDynamicService && normalizedServiceType === 'train-ticket-booking';
    const isTransferService = isDynamicService && ['cash-to-instapay', 'instapay-transfer'].includes(normalizedServiceType);
    const isDirectPurchase = product.allowDirectPurchase;

    const handleActionClick = () => {
        if (isBillPaymentService || isBookingService || isTopupService || isTransferService || isDirectPurchase) {
            onViewDetails(product);
        } 
        else if (product.stock > 0 && !isDynamicService) {
            onAddToCart(product, null);
        }
    };
    
    const actionButtonText = isBillPaymentService ? "ادفع الآن" 
        : isBookingService ? "حجز الآن" 
        : isTransferService ? "طلب تحويل الآن"
        : isTopupService ? "اشحن الآن" 
        : isDirectPurchase ? "شراء الآن"
        : (product.stock > 0 ? "أضف للسلة" : "نفذ المخزون");


    return React.createElement(React.Fragment, null,
        React.createElement("button", {
            onClick: (e) => { e.stopPropagation(); handleActionClick(); },
            disabled: product.stock === 0 && !isDynamicService,
            className: `w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-3.5 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse transform opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 text-sm hidden md:flex ${(product.stock === 0 && !isDynamicService) ? 'cursor-not-allowed group-hover:bg-dark-500 group-hover:opacity-75' : ''}`,
            "aria-label": actionButtonText
        },
            React.createElement(ShoppingCartIcon, { className: "w-4 h-4" }),
            React.createElement("span", null, actionButtonText)
        ),
        React.createElement("button", {
            onClick: (e) => { e.stopPropagation(); handleActionClick(); },
            disabled: product.stock === 0 && !isDynamicService,
            className: `w-full mt-2 bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600 text-dark-700 dark:text-dark-200 font-semibold py-2 px-3.5 rounded-lg transition-all duration-300 md:hidden flex items-center justify-center space-x-2 space-x-reverse text-sm border border-light-300 dark:border-dark-600 ${(product.stock === 0 && !isDynamicService) ? 'opacity-50 cursor-not-allowed' : 'active:!bg-primary-hover active:!text-white dark:active:bg-primary-hover dark:active:text-white active:transition-none'}`,
            "aria-label": actionButtonText
        },
            React.createElement(ShoppingCartIcon, { className: "w-4 h-4" }),
            React.createElement("span", null, actionButtonText)
        )
    );
};