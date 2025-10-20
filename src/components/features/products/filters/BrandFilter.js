import React from 'react';

export const BrandFilter = ({ brands, localFilters, handleBrandChange, filterCounts }) => {
    if (brands.length === 0) return null;

    return (
        React.createElement("div", { className: "mb-6" },
            React.createElement("h4", { className: "font-medium mb-2 text-dark-800 dark:text-dark-100" }, "العلامة التجارية"),
            React.createElement("div", { className: "space-y-1.5 max-h-48 overflow-y-auto pr-1" },
                brands.map(brand => React.createElement("label", { key: brand, className: "flex items-center justify-between space-x-2 space-x-reverse text-sm text-dark-700 dark:text-dark-100 cursor-pointer" },
                   React.createElement("div", { className: "flex items-center space-x-2 space-x-reverse" },
                        React.createElement("input", { type: "checkbox", checked: localFilters.brands.includes(brand), onChange: () => handleBrandChange(brand), className: "form-checkbox rounded text-primary focus:ring-primary" }),
                        React.createElement("span", null, brand)
                    ),
                    filterCounts?.brands?.[brand] > 0 && React.createElement("span", { className: "text-xs bg-light-200 dark:bg-dark-600 px-1.5 py-0.5 rounded-full tabular-nums" }, filterCounts.brands[brand])
                ))
            )
        )
    );
};