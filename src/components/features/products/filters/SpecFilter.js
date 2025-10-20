import React from 'react';

export const SpecFilter = ({ availableSpecFilters, localFilters, handleSpecChange, filterCounts }) => {
    if (Object.keys(availableSpecFilters).length === 0) return null;

    return (
        React.createElement("div", { className: "mb-6" },
            React.createElement("h4", { className: "font-medium mb-4 text-dark-800 dark:text-dark-100" }, "المواصفات الفنية"),
            React.createElement("div", { className: "space-y-4" },
                Object.entries(availableSpecFilters).map(([specName, specValues]) => (
                    React.createElement("div", { key: specName },
                        React.createElement("h5", { className: "font-medium text-sm mb-2 text-dark-800 dark:text-dark-100" }, specName),
                        React.createElement("div", { className: "space-y-1.5 max-h-48 overflow-y-auto pr-1" },
                            specValues.map(value => React.createElement("label", { key: value, className: "flex items-center justify-between space-x-2 space-x-reverse text-sm text-dark-700 dark:text-dark-100 cursor-pointer" },
                                React.createElement("div", { className: "flex items-center space-x-2 space-x-reverse" },
                                    React.createElement("input", { 
                                        type: "checkbox", 
                                        checked: (localFilters.specs[specName] || []).includes(value),
                                        onChange: () => handleSpecChange(specName, value),
                                        className: "form-checkbox rounded text-primary focus:ring-primary"
                                    }),
                                    React.createElement("span", null, value)
                                ),
                                filterCounts?.specs?.[specName]?.[value] > 0 && React.createElement("span", { className: "text-xs bg-light-200 dark:bg-dark-600 px-1.5 py-0.5 rounded-full tabular-nums" }, filterCounts.specs[specName][value])
                            ))
                        )
                    )
                ))
            )
        )
    );
};