import React from 'react';
import { GridViewIcon, ListViewIcon } from '../../../icons/index.js';

const ViewModeToggle = ({ viewMode, onViewModeChange }) => {
    return (
        React.createElement("div", { className: "flex items-center space-x-2 space-x-reverse" },
            React.createElement("button", {
                onClick: () => onViewModeChange('grid'),
                title: "عرض شبكي",
                "aria-pressed": viewMode === 'grid',
                className: `p-2 rounded-md shadow-sm ${viewMode === 'grid' ? "bg-primary text-white" : "bg-white dark:bg-dark-700 text-dark-700 dark:text-dark-200 hover:bg-light-100 dark:hover:bg-dark-600 border border-light-300 dark:border-dark-600"}`
                }, React.createElement(GridViewIcon, { className: "w-5 h-5" })
            ),
            React.createElement("button", {
                onClick: () => onViewModeChange('list'),
                title: "عرض قائمة",
                "aria-pressed": viewMode === 'list',
                className: `p-2 rounded-md shadow-sm ${viewMode === 'list' ? "bg-primary text-white" : "bg-white dark:bg-dark-700 text-dark-700 dark:text-dark-200 hover:bg-light-100 dark:hover:bg-dark-600 border border-light-300 dark:border-dark-600"}`
                }, React.createElement(ListViewIcon, { className: "w-5 h-5" })
            )
        )
    );
};

export { ViewModeToggle };
