import React from 'react';
import { ProductList } from './ProductList.js';
import { SortOptions } from './SortOptions.js';
import { ViewModeToggle } from './ViewModeToggle.js';

export const ProductGrid = ({
    products, title, onAddToCart, onViewDetails, viewMode, onViewModeChange,
    sortOption, onSortChange, isLoading, onToggleWishlist, wishlistItems,
    currentUser, onLoginRequest, onInitiateDirectCheckout
}) => {
    const showNoResultsMessage = !isLoading && products.length === 0;

    return React.createElement('div', null,
        React.createElement('div', { className: 'flex flex-col md:flex-row justify-between items-center mb-6 gap-4' },
            React.createElement('h2', { className: 'text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200' }, title),
            React.createElement('div', { className: 'flex items-center gap-4' },
                React.createElement(SortOptions, { sortOption, onSortChange }),
                React.createElement(ViewModeToggle, { viewMode, onViewModeChange })
            )
        ),
        showNoResultsMessage
            ? React.createElement('div', { className: 'text-center py-20' },
                React.createElement('p', { className: 'text-lg text-gray-600 dark:text-gray-400' },
                    'لا توجد منتجات تطابق هذا الفلتر أو خيار الفرز.'
                )
            )
            : React.createElement(ProductList, {
                products,
                viewMode,
                isLoading,
                onAddToCart,
                onViewDetails,
                onToggleWishlist,
                wishlistItems,
                currentUser,
                onLoginRequest,
                onInitiateDirectCheckout
            })
    );
};
