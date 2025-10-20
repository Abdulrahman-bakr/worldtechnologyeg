import React from 'react';
import { getStatusDisplayInfo, ORDER_STATUS_GROUPS } from './ordersUtils.js';

const OrdersTabs = ({
    selectedStatusTab,
    selectedGroupTitle,
    handleAllSelect,
    handleGroupSelect,
    handleStatusSelect
}) => {
    return (
        React.createElement("div", { className: "mb-6 sm:mb-8" },
            React.createElement("div", { role: "tablist", "aria-label": "فئات الطلبات", className: "flex flex-wrap justify-center gap-2 sm:gap-4 mb-4" },
                React.createElement("button", {
                    key: "all", id: "tab-all", role: "tab",
                    "aria-selected": selectedStatusTab === "all",
                    onClick: handleAllSelect,
                    className: `px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${selectedStatusTab === "all" ? 'bg-primary text-white' : 'bg-white dark:bg-dark-700 text-dark-700 dark:text-dark-100 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary border border-light-300 dark:border-dark-600'}`
                }, "الكل"),
                ORDER_STATUS_GROUPS.map(group => {
                    const isGroupActive = selectedGroupTitle === group.title;
                    const isGroupSelectedForFilter = selectedStatusTab === `group:${group.title}`;
                    return React.createElement("button", {
                        key: group.title,
                        id: `tab-group-${group.title.replace(/\s/g, '-')}`,
                        role: "tab",
                        "aria-selected": isGroupActive,
                        onClick: () => handleGroupSelect(group),
                        className: `px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${isGroupActive || isGroupSelectedForFilter ? 'bg-primary text-white' : 'bg-white dark:bg-dark-700 text-dark-700 dark:text-dark-100 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary border border-light-300 dark:border-dark-600'}`
                    }, group.title);
                })
            ),
            selectedGroupTitle && React.createElement("div", {
                id: "sub-tabs-panel",
                className: "flex flex-wrap justify-center gap-2 sm:gap-3 p-4 mt-4 bg-light-50 dark:bg-dark-700/50 rounded-lg border border-light-200 dark:border-dark-600 "
            },
                (ORDER_STATUS_GROUPS.find(g => g.title === selectedGroupTitle)?.statuses || []).map(statusKey => {
                    const statusInfo = getStatusDisplayInfo(statusKey);
                    const isActive = selectedStatusTab === statusKey;
                    return React.createElement("button", {
                        key: statusKey,
                        id: `tab-${statusKey}`,
                        role: "tab",
                        "aria-selected": isActive,
                        onClick: () => handleStatusSelect(statusKey),
                        className: `px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md ${isActive ? 'bg-primary text-white' : 'bg-white dark:bg-dark-600 text-dark-700 dark:text-dark-100 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary border border-light-200 dark:border-dark-500'}`
                    }, statusInfo.text);
                })
            )
        )
    );
};

export { OrdersTabs };