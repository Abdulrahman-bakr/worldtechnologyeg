import React from 'react';
import { SORT_OPTIONS } from '../../../../constants/index.js';

const SortOptions = ({ sortOption, onSortChange }) => {
    return (
        React.createElement("select", {
            value: sortOption,
            onChange: (e) => onSortChange(e.target.value),
            className: "bg-white dark:bg-dark-700 text-dark-800 dark:text-dark-100 border border-light-300 dark:border-dark-600 rounded-md p-2 focus:ring-primary focus:border-primary text-sm font-medium shadow-sm",
            "aria-label": "فرز المنتجات"
            },
            SORT_OPTIONS.map(option => React.createElement("option", { key: option.value, value: option.value }, option.label))
        )
    );
};

export { SortOptions };
