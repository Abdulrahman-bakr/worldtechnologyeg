import React from 'react';
import { useApp } from '../contexts/AppContext.js';
import { CategoryTabs } from '../components/features/products/CategoryTabs.js';
import { ProductGrid } from '../components/features/products/product-grid/ProductGrid.js';
import { CATEGORIES, ProductCategory } from '../constants/index.js';
import { FiltersPanel } from '../components/features/products/filters/index.js';

export const ProductListView = () => {
    const {
        searchTerm, showAllOffersView, selectedCategory, handleSelectCategory,
        products, 
        handleAddToCart, handleViewProductDetail,
        viewMode, handleViewModeChange, sortOption, handleSortChange, isLoading,
        handleToggleWishlist, wishlistItems, currentUser, setIsLoginModalOpen,
        handleInitiateDirectCheckout,
        // Filter props
        brands, availableSpecFilters, activeFilters, handleFilterChange,
        priceRange, handlePriceRangeChange, initialMaxPrice, handleResetFilters, filterCounts
    } = useApp();
    
    const getProductGridTitle = () => {
        if (searchTerm.trim()) return `نتائج البحث عن: "${searchTerm}"`;
        if (showAllOffersView) return "جميع العروض الخاصة";
        if (selectedCategory !== ProductCategory.All) {
            const category = CATEGORIES.find(c => c.id === selectedCategory);
            const categoryName = category && category.arabicName ? category.arabicName : "المحدد";
            return `منتجات قسم ${categoryName}`;
        }
        return "جميع منتجاتنا";
    };
    
    const currentGridTitle = getProductGridTitle();

    return (
        React.createElement(React.Fragment, null,
            React.createElement(CategoryTabs, {
                categories: CATEGORIES,
                selectedCategory: (searchTerm.trim() || showAllOffersView) ? ProductCategory.All : selectedCategory,
                onSelectCategory: handleSelectCategory
            }),
            React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-8" },
                React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8" },
                    React.createElement(FiltersPanel, {
                        brands,
                        availableSpecFilters,
                        activeFilters,
                        onFilterChange: handleFilterChange,
                        priceRange,
                        onPriceRangeChange: handlePriceRangeChange,
                        maxPricePossible: initialMaxPrice,
                        onResetFilters: handleResetFilters,
                        filterCounts
                    }),
                    React.createElement("div", { className: "lg:col-span-3" },
                        React.createElement(ProductGrid, {
                            products: products, 
                            title: currentGridTitle,
                            onAddToCart: handleAddToCart,
                            onViewDetails: handleViewProductDetail,
                            viewMode: viewMode, 
                            onViewModeChange: handleViewModeChange,
                            sortOption: sortOption, 
                            onSortChange: handleSortChange, 
                            isLoading: isLoading,
                            onToggleWishlist: handleToggleWishlist, 
                            wishlistItems: wishlistItems,
                            currentUser: currentUser, 
                            onLoginRequest: () => setIsLoginModalOpen(true),
                            onInitiateDirectCheckout: handleInitiateDirectCheckout
                        })
                    )
                )
            )
        )
    );
};