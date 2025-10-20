// src/components/features/orders/OrderCard.js

import React from 'react';
import { getOrderSummary } from './ordersUtils.js';
import { OrderStatusBadge } from './OrderStatusBadge.js';

const OrderCard = ({ order }) => {
    const orderDate = order.createdAt || order.clientCreatedAt;

    const formattedDate = orderDate instanceof Date && !isNaN(orderDate)
        ? orderDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'جاري تحديد الوقت...';

    const hasDiscount = order.discountApplied && order.discountApplied > 0;
    const originalTotal = (order.totalAmount || 0) + (order.discountApplied || 0);

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
                )
            )
        )
    );
};

export { OrderCard };