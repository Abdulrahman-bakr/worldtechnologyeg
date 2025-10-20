import React, { useState, useEffect } from 'react';
import { FilterIcon } from '../../../icons/index.js';
import { BrandFilter } from './BrandFilter.js';
import { SpecFilter } from './SpecFilter.js';

export const FiltersPanel = ({
    brands,
    availableSpecFilters,
    activeFilters,
    onFilterChange,
    priceRange,
    onPriceRangeChange,
    maxPricePossible,
    onResetFilters,
    filterCounts
}) => {
    const [showFilters, setShowFilters] = useState(false); 
    const [localFilters, setLocalFilters] = useState(activeFilters);
    const [localPriceRange, setLocalPriceRange] = useState(priceRange);

    useEffect(() => { setLocalFilters(activeFilters); }, [activeFilters]);
    useEffect(() => { setLocalPriceRange(priceRange); }, [priceRange]);

    const handleFilterChangeAndNotify = (updatedFilters) => {
        setLocalFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    const handleBrandChange = (brand) => {
        const newBrands = localFilters.brands.includes(brand) ? localFilters.brands.filter(b => b !== brand) : [...localFilters.brands, brand];
        handleFilterChangeAndNotify({ ...localFilters, brands: newBrands });
    };
    
    const handleSpecChange = (specName, value) => {
        const currentValues = localFilters.specs[specName] || [];
        const newValues = currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value];
        const newSpecs = { ...localFilters.specs, [specName]: newValues.length > 0 ? newValues : undefined };
        handleFilterChangeAndNotify({ ...localFilters, specs: newSpecs });
    };

    const handleDiscountChange = (e) => {
        handleFilterChangeAndNotify({ ...localFilters, discountedOnly: e.target.checked });
    };
    
    const handlePriceRangeUIChange = (type, value) => {
        const numValue = Number(value);
        if (type === 'min') {
             setLocalPriceRange(prev => ({ ...prev, min: Math.min(numValue, prev.max - 10) }));
        } else {
             setLocalPriceRange(prev => ({ ...prev, max: Math.max(numValue, prev.min + 10) }));
        }
    };
    
    return React.createElement("aside", { className: "w-full lg:w-72 xl:w-80 lg:pr-8 space-y-6 mb-8 lg:mb-0" },
        React.createElement("div", { className: "lg:hidden mb-4" },
            React.createElement("button", { onClick: () => setShowFilters(!showFilters), className: "w-full flex justify-between items-center p-3 bg-light-100 dark:bg-dark-700 rounded-lg border border-light-300 dark:border-dark-600 text-dark-900 dark:text-dark-50 font-semibold" },
                "الفلاتر", React.createElement(FilterIcon, { className: "w-5 h-5" })
            )
        ),
        React.createElement("div", { className: `${showFilters ? 'block' : 'hidden'} lg:block` },
            React.createElement("div", { className: "p-5 bg-white dark:bg-dark-800 rounded-xl shadow-md border border-light-200 dark:border-dark-700" },
                React.createElement("h3", { className: "text-lg font-semibold mb-4 text-dark-900 dark:text-dark-50 border-b pb-2 border-light-300 dark:border-dark-600" }, "الفلاتر"),
                React.createElement("div", { className: "mb-6" },
                    React.createElement("h4", { className: "font-medium mb-2 text-dark-800 dark:text-dark-100" }, "نطاق السعر"),
                    React.createElement("div", { className: "flex justify-between items-center text-sm text-dark-600 dark:text-dark-300 mb-2 tabular-nums" },
                        React.createElement("span", null, `${localPriceRange.min} ج.م`),
                        React.createElement("span", null, `${localPriceRange.max === maxPricePossible ? '+' : ''}${localPriceRange.max} ج.م`)
                    ),
                    React.createElement("input", { type: "range", min: 0, max: maxPricePossible, value: localPriceRange.min, onChange: (e) => handlePriceRangeUIChange('min', e.target.value), onMouseUp: () => onPriceRangeChange(localPriceRange), onTouchEnd: () => onPriceRangeChange(localPriceRange), className: "mb-2", "aria-label": "Minimum Price" }),
                    React.createElement("input", { type: "range", min: 0, max: maxPricePossible, value: localPriceRange.max, onChange: (e) => handlePriceRangeUIChange('max', e.target.value), onMouseUp: () => onPriceRangeChange(localPriceRange), onTouchEnd: () => onPriceRangeChange(localPriceRange), "aria-label": "Maximum Price" })
                ),
                React.createElement(BrandFilter, { brands: brands, localFilters: localFilters, handleBrandChange: handleBrandChange, filterCounts: filterCounts }),
                React.createElement(SpecFilter, { availableSpecFilters: availableSpecFilters, localFilters: localFilters, handleSpecChange: handleSpecChange, filterCounts: filterCounts }),
                React.createElement("div", { className: "mb-6" },
                    React.createElement("label", { className: "flex items-center space-x-2 space-x-reverse text-sm text-dark-700 dark:text-dark-100 cursor-pointer" },
                        React.createElement("input", { type: "checkbox", checked: localFilters.discountedOnly, onChange: handleDiscountChange, className: "form-checkbox rounded text-primary focus:ring-primary" }),
                        React.createElement("span", { className: "font-medium" }, "عرض المنتجات المخفضة فقط")
                    )
                ),
                React.createElement("div", { className: "flex flex-col space-y-2" },
                    React.createElement("button", { onClick: onResetFilters, className: "w-full bg-light-200 dark:bg-dark-600 hover:bg-light-300 dark:hover:bg-dark-500 text-dark-800 dark:text-dark-100 font-semibold py-2 px-4 rounded-md transition-colors border border-light-300 dark:border-dark-500" }, "إعادة تعيين")
                )
            )
        )
    );
};