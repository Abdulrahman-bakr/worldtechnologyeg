import React from 'react';
import { OrderCard } from './OrderCard.js';

const OrderList = ({ orders, fetchOrders, hasMore, isFetchingMore }) => {
    return (
        React.createElement("div", { className: "space-y-6" },
            orders.map(order => React.createElement(OrderCard, { key: order.id, order: order })),
            hasMore && React.createElement("div", { className: "text-center mt-8" },
                React.createElement("button", {
                    onClick: () => fetchOrders(false),
                    disabled: isFetchingMore,
                    className: "bg-secondary hover:bg-secondary-hover text-white font-semibold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50"
                }, isFetchingMore ? "جاري التحميل..." : "عرض المزيد من الطلبات")
            )
        )
    );
};

export { OrderList };