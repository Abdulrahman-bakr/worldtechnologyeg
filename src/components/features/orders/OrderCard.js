// src/components/features/orders/OrderCard.js

import React from 'react';
import { getOrderSummary } from './ordersUtils.js';
import { OrderStatusBadge } from './OrderStatusBadge.js';
import { generateWhatsAppMessage } from '../../../utils/checkoutUtils.js';
import { WhatsAppIcon } from '../../icons/index.js';

const OrderCard = ({ order }) => {
    const orderDate = order.createdAt || order.clientCreatedAt;

    const formattedDate = orderDate instanceof Date && !isNaN(orderDate)
        ? orderDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'جاري تحديد الوقت...';

    const hasDiscount = (order.tierDiscount > 0 || order.pointsDiscount > 0 || order.couponDiscount > 0);
    const originalTotal = order.subtotal || (order.totalAmount + (order.tierDiscount || 0) + (order.pointsDiscount || 0) + (order.couponDiscount || 0));

    const isActionable = !['shipped', 'delivered', 'cancelled'].includes(order.status);

    const handleConfirmOnWhatsApp = () => {
        let message;

        if (isActionable) {
            const paymentMethodKey = (() => {
                const method = order.paymentDetails.method;
                if (method === 'الدفع عند الاستلام') return 'cash_on_delivery';
                if (method === 'فودافون كاش') return 'vodafone_cash';
                if (method === 'إنستاباي') return 'instapay';
                return 'other';
            })();
            
            message = generateWhatsAppMessage({
                displayOrderId: order.displayOrderId,
                customerShippingDetails: order.customerDetails,
                requiresPhysicalShipping: order.containsPhysicalServices,
                isDirectSingleServiceCheckout: order.isDirectServiceCheckout,
                orderNotes: order.customerDetails.notes,
                paymentMethodDisplay: order.paymentDetails.method,
                selectedPaymentMethod: paymentMethodKey,
                paymentTransactionInfo: order.paymentDetails.transactionInfo,
                itemsForCheckout: order.items,
                totalAmount: order.totalAmount,
                originalAmount: originalTotal,
                tierDiscountAmount: order.tierDiscount,
                discountApplied: order.pointsDiscount,
                finalAmountBeforeRounding: null,
                isRounded: false,
                couponCode: order.couponCode,
                couponDiscountValue: order.couponDiscount,
            });
        } else {
            message = `مرحباً World Technology، لدي استفسار بخصوص طلبي رقم: ${order.displayOrderId}`;
        }

        const whatsappUrl = `https://api.whatsapp.com/send/?phone=201026146714&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    const buttonText = isActionable ? 'تأكيد الطلب عبر واتساب' : 'تواصل بخصوص الطلب';
    const buttonClass = `w-full mt-4 font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
        isActionable
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-light-200 dark:bg-dark-600 text-dark-800 dark:text-dark-100 hover:bg-light-300 dark:hover:bg-dark-500'
    }`;


    return (
        React.createElement("div", { 
            key: order.id, 
            className: "bg-light-100 dark:bg-dark-700 p-5 sm:p-6 rounded-lg border border-light-200 dark:border-dark-600 shadow-md transition-shadow hover:shadow-lg" 
        },
            React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4" },
                React.createElement("h2", { className: "text-lg sm:text-xl font-bold text-primary mb-1 sm:mb-0" }, `رقم الطلب: ${order.displayOrderId}`),
                React.createElement(OrderStatusBadge, { statusKey: order.status })
            ),
            React.createElement("div", { className: "space-y-3 text-sm text-dark-700 dark:text-dark-200" },
                React.createElement("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center" },
                    React.createElement("p", null, React.createElement("strong", {className: "text-dark-800 dark:text-dark-100"}, "تاريخ الطلب: "), formattedDate),
                    React.createElement("p", { className: "mt-1 sm:mt-0" }, 
                        React.createElement("strong", {className: "text-dark-800 dark:text-dark-100"}, "الإجمالي: "), 
                        hasDiscount ? (
                            React.createElement(React.Fragment, null,
                                React.createElement("span", { className: "text-md text-dark-600 dark:text-dark-300 line-through mr-2 tabular-nums" }, `${originalTotal.toFixed(2)} ج.م`),
                                React.createElement("span", { className: "font-bold text-lg text-primary tabular-nums" }, `${order.totalAmount.toFixed(2)} ج.م`)
                            )
                        ) : (
                            React.createElement("span", { className: "font-bold text-lg text-primary tabular-nums" }, `${order.totalAmount != null ? order.totalAmount.toFixed(2) : '0.00'} ج.م`)
                        )
                    )
                ),
                (order.items && order.items.length > 0) && React.createElement("div", { className: "pt-3 border-t border-light-300 dark:border-dark-600 mt-3" },
                    React.createElement("p", null, React.createElement("strong", {className: "text-dark-800 dark:text-dark-100"}, "محتويات الطلب: "), getOrderSummary(order.items))
                ),
                (order.paymentDetails && order.paymentDetails.method) && React.createElement("div", { className: "pt-3 border-t border-light-300 dark:border-dark-600 mt-3" },
                   React.createElement("p", null, React.createElement("strong", {className: "text-dark-800 dark:text-dark-100"}, "طريقة الدفع: "), order.paymentDetails.method)
                ),
                React.createElement("div", { className: "pt-3 border-t border-light-300 dark:border-dark-600 mt-3" },
                   React.createElement("button", { onClick: handleConfirmOnWhatsApp, className: buttonClass },
                        React.createElement(WhatsAppIcon, { className: "w-5 h-5" }),
                        React.createElement("span", null, buttonText)
                   )
                )
            )
        )
    );
};

export { OrderCard };