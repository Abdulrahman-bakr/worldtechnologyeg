

import React from 'react';
import { SearchIcon } from '../../icons/index.js';

export const SearchBar = ({ 
    handleSearchFormSubmit, 
    searchTerm, 
    onSearchTermChange, 
    isAutocompleteVisible, 
    setIsAutocompleteVisible, 
    autocompleteSuggestions, 
    handleSuggestionClick, 
    searchContainerRef 
}) => {
    return (
        React.createElement("div", { className: "hidden md:flex items-center relative flex-grow max-w-md mx-4", ref: searchContainerRef },
            React.createElement("form", { onSubmit: handleSearchFormSubmit, className: "w-full", role: "search" },
                React.createElement("input", {
                    type: "search",
                    placeholder: "ابحث عن منتجات...",
                    value: searchTerm,
                    onChange: (e) => onSearchTermChange(e.target.value),
                    onFocus: () => { if (searchTerm) setIsAutocompleteVisible(true); },
                    className: "w-full py-2 px-4 pr-10 rounded-lg border border-light-300 dark:border-dark-600 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm text-dark-800 dark:text-dark-50 placeholder-dark-500 dark:placeholder-dark-400 bg-white/80 dark:bg-dark-700/80"
                }),
                React.createElement("button", { type: "submit", className: "absolute right-0 top-0 bottom-0 px-3 text-dark-600 dark:text-dark-300 hover:text-primary", "aria-label": "Search" },
                    React.createElement(SearchIcon, { className: "w-5 h-5" })
                )
            ),
            isAutocompleteVisible && React.createElement("div", {
                id: "autocomplete-dropdown",
                className: "absolute top-full mt-2 w-full bg-white dark:bg-dark-700 border border-light-300 dark:border-dark-600 rounded-lg shadow-xl overflow-hidden z-10 max-h-80 overflow-y-auto"
            },
                autocompleteSuggestions.length > 0 ? (
                    autocompleteSuggestions.map((suggestion, index) =>
                        React.createElement("div", {
                            key: `${suggestion.type}-${suggestion.id}-${index}`,
                            onClick: () => handleSuggestionClick(suggestion),
                            className: "p-3 hover:bg-light-100 dark:hover:bg-dark-600 cursor-pointer flex items-center space-x-3 space-x-reverse border-b border-light-200 dark:border-dark-600 last:border-b-0"
                        },
                            suggestion.imageUrl && React.createElement("img", { src: suggestion.imageUrl, alt: suggestion.name, className: "w-10 h-10 object-contain rounded" }),
                            React.createElement("div", { className: "flex-grow" },
                                React.createElement("p", { className: "text-sm font-medium text-dark-800 dark:text-dark-100" }, suggestion.name),
                                (suggestion.type === 'product' && suggestion.price !== null) && React.createElement("p", { className: "text-xs text-primary" }, `${suggestion.price.toFixed(2)} ج.م`)
                            ),
                            suggestion.type === 'category' && React.createElement("span", { className: "text-xs text-dark-500 dark:text-dark-400" }, "فئة")
                        )
                    )
                ) : (
                    React.createElement("div", { className: "p-3 text-center text-sm text-dark-600 dark:text-dark-300" }, "لا توجد نتائج")
                )
            )
        )
    );
};