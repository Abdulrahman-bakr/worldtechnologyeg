import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.js';
import { CategoryTabs } from '../components/features/products/CategoryTabs.js';
import { ProductGrid } from '../components/features/products/product-grid/ProductGrid.js';
import { CATEGORIES, ProductCategory } from '../constants/index.js';
import { FiltersPanel } from '../components/features/products/filters/index.js';

export const ProductListView = ({ showAllOffersView: showAllOffersViewProp, isSearchPage: isSearchPageProp }) => {
    const {
        products, handleAddToCart,
        viewMode, handleViewModeChange, sortOption, handleSortChange, isLoading,
        handleToggleWishlist, wishlistItems, currentUser, setIsLoginModalOpen,
        handleInitiateDirectCheckout,
        // Filter props and setters
        brands, availableSpecFilters, activeFilters, handleFilterChange,
        priceRange, handlePriceRangeChange, initialMaxPrice, handleResetFilters, filterCounts,
        // Context setters
        selectedCategory, handleSelectCategory, searchTerm, setSearchTerm, showAllOffersView, setShowAllOffersView
    } = useApp();

    const { categoryId } = useParams();
    const location = useLocation();

    useEffect(() => {
        handleSelectCategory(categoryId);
    }, [categoryId, handleSelectCategory]);
    
    useEffect(() => {
        setShowAllOffersView(showAllOffersViewProp || false);
        if (showAllOffersViewProp) {
            handleSelectCategory(null); // Reset category when viewing all offers
        }
    }, [showAllOffersViewProp, setShowAllOffersView, handleSelectCategory]);
    
    useEffect(() => {
        if (isSearchPageProp) {
            const searchParams = new URLSearchParams(location.search);
            setSearchTerm(searchParams.get('q') || '');
        } else if (!location.pathname.startsWith('/search')) {
             if (searchTerm !== '') {
                setSearchTerm('');
            }
        }
    }, [isSearchPageProp, location.search, location.pathname, setSearchTerm, searchTerm]);
    
    const getProductGridTitle = () => {
        if (searchTerm.trim()) return `نتائج البحث عن: "${searchTerm}"`;
        if (showAllOffersView) return "جميع العروض الخاصة";
        if (selectedCategory && selectedCategory !== ProductCategory.All) {
            const category = CATEGORIES.find(c => c.id === selectedCategory);
            const categoryName = category && category.arabicName ? category.arabicName : "المحدد";
            return `منتجات قسم ${categoryName}`;
        }
        return "جميع منتجاتنا";
    };
    
    const currentGridTitle = getProductGridTitle();
    const categoryForTabs = (searchTerm.trim() || showAllOffersView) ? ProductCategory.All : selectedCategory;

    return (
        React.createElement(React.Fragment, null,
            React.createElement(CategoryTabs, {
                categories: CATEGORIES,
                selectedCategory: categoryForTabs
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