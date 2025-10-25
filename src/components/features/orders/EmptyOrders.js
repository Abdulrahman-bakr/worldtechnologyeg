import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBagIcon } from '../../icons/index.js';
import { getStatusDisplayInfo } from './ordersUtils.js';

const EmptyOrders = ({ selectedStatusTab, totalOrderCount }) => {
    const navigate = useNavigate();
    const getNoOrdersMessage = () => {
        if (selectedStatusTab === "all") {
            return "ليس لديك أي طلبات سابقة.";
        }
        if (selectedStatusTab.startsWith('group:')) {
            const groupTitle = selectedStatusTab.split(':')[1];
            return `لا توجد طلبات في فئة "${groupTitle}".`;
        }
        const statusInfo = getStatusDisplayInfo(selectedStatusTab);
        return `لا توجد طلبات في فئة "${statusInfo.text || 'المحددة'}".`;
    };
    
    const showSuggestion = selectedStatusTab !== 'all' && totalOrderCount > 0;

    return (
        React.createElement("div", { className: "text-center py-10" },
            React.createElement(ShoppingBagIcon, { className: "w-16 h-16 text-dark-500 dark:text-dark-400 mx-auto mb-4" }),
            React.createElement("p", { className: "text-xl text-dark-700 dark:text-dark-100 mb-4" }, getNoOrdersMessage()),
            showSuggestion && React.createElement("p", { className: "text-md text-dark-600 dark:text-dark-300 mb-6" }, "جرب اختيار فلتر 'الكل' لعرض جميع طلباتك."),
            React.createElement("button", {
                onClick: () => navigate('/products'),
                className: "bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            }, "ابدأ التسوق")
        )
    );
};

export { EmptyOrders };