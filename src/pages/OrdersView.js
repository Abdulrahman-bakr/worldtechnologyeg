import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBagIcon } from '../components/icons/index.js';
import { useOrdersData } from '../hooks/useOrders.js';
import { OrderList } from '../components/features/orders/OrderList.js';
import { OrdersTabs } from '../components/features/orders/OrdersTabs.js';
import { EmptyOrders } from '../components/features/orders/EmptyOrders.js';
import { LoadingOrders } from '../components/features/orders/LoadingOrders.js';
import { ORDER_STATUS_GROUPS } from '../components/features/orders/ordersUtils.js';

const OrdersView = ({ currentUser }) => {
    const navigate = useNavigate();
    const { orders, isLoading, error, fetchMoreOrders, hasMore, isFetchingMore } = useOrdersData(currentUser);
    const [selectedStatusTab, setSelectedStatusTab] = useState("all");
    const [selectedGroupTitle, setSelectedGroupTitle] = useState(null);

    const handleAllSelect = () => {
        setSelectedStatusTab('all');
        setSelectedGroupTitle(null);
    };
    
    const handleGroupSelect = (group) => {
        setSelectedGroupTitle(group.title);
        setSelectedStatusTab(`group:${group.title}`); 
    };
    
    const handleStatusSelect = (statusKey) => {
        const group = ORDER_STATUS_GROUPS.find(g => g.statuses.includes(statusKey));
        setSelectedGroupTitle(group ? group.title : null);
        setSelectedStatusTab(statusKey);
    };

    const filteredOrders = useMemo(() => {
        if (selectedStatusTab === "all") {
            return orders;
        }
        if (selectedStatusTab.startsWith('group:')) {
            const groupTitle = selectedStatusTab.split(':')[1];
            const group = ORDER_STATUS_GROUPS.find(g => g.title === groupTitle);
            if (group) {
                return orders.filter(order => group.statuses.includes(order.status));
            }
            return orders; // Fallback
        }
        return orders.filter(order => order.status === selectedStatusTab);
    }, [orders, selectedStatusTab]);

    return React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-32 min-h-[calc(100vh-16rem)]" },
        React.createElement(Helmet, null, 
            React.createElement("title", null, "طلباتي - World Technology")
        ),
        React.createElement("button", {
            onClick: () => navigate(-1),
            className: "mb-8 text-primary hover:text-primary-hover font-semibold flex items-center space-x-2 space-x-reverse transition-colors"
        },
            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5 transform rtl:rotate-180" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" })
            ),
            React.createElement("span", null, "العودة")
        ),
        React.createElement("div", { className: "flex flex-col items-center text-center mb-6 sm:mb-8" },
            React.createElement(ShoppingBagIcon, { className: "w-12 h-12 sm:w-16 sm:h-16 text-primary mb-3" }),
            React.createElement("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-900 dark:text-dark-50" }, "سجل طلباتي")
        ),
        React.createElement(OrdersTabs, {
            selectedStatusTab, selectedGroupTitle,
            handleAllSelect, handleGroupSelect, handleStatusSelect
        }),
        React.createElement("div", { id: "orders-panel", role: "tabpanel", "aria-labelledby": `tab-${selectedStatusTab}`},
            isLoading ? React.createElement(LoadingOrders, null)
            : error ? React.createElement("p", { className: "text-center text-red-500 py-10" }, error)
            : filteredOrders.length === 0 ? React.createElement(EmptyOrders, { selectedStatusTab, onNavigate: (path) => navigate(path) })
            : React.createElement(OrderList, { orders: filteredOrders, fetchOrders: fetchMoreOrders, hasMore, isFetchingMore })
        )
    );
};

export { OrdersView };