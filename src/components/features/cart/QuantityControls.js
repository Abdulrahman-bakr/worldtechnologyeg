

import React from 'react';
import { PlusIcon, MinusIcon } from '../../icons/index.js';

const QuantityControls = ({ item, onUpdateQuantity }) => (
    React.createElement("div", { className: "flex items-center mt-2" },
        React.createElement("button", {
            onClick: () => onUpdateQuantity(item.id, item.quantity - 1),
            "aria-label": "تقليل الكمية",
            className: "p-1.5 text-dark-700 dark:text-dark-200 hover:text-dark-900 dark:hover:text-dark-50 bg-light-200 dark:bg-dark-600 rounded-md disabled:opacity-50 border border-light-300 dark:border-dark-500",
            disabled: item.quantity <= 1
        }, React.createElement(MinusIcon, { className: "w-4 h-4" })),
        React.createElement("span", { className: "px-3 text-sm font-medium w-10 text-center tabular-nums text-dark-900 dark:text-dark-50" }, item.quantity),
        React.createElement("button", {
            onClick: () => onUpdateQuantity(item.id, item.quantity + 1),
            "aria-label": "زيادة الكمية",
            className: "p-1.5 text-dark-700 dark:text-dark-200 hover:text-dark-900 dark:hover:text-dark-50 bg-light-200 dark:bg-dark-600 rounded-md border border-light-300 dark:border-dark-500"
        }, React.createElement(PlusIcon, { className: "w-4 h-4" }))
    )
);

export { QuantityControls };