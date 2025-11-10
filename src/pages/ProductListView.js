import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.js';
import { CategoryTabs } from '../components/features/products/CategoryTabs.js';
import { ProductGrid } from '../components/features/products/product-grid/ProductGrid.js';
import { CATEGORIES, ProductCategory } from '../constants/index.js';
import { FiltersPanel } from '../components/features/products/filters/index.js';
import { FilterIcon } from '../components/icons/index.js';
import { SortOptions, ViewModeToggle } from '../components/features/products/product-grid/index.js';

export const ProductListView = ({ showAllOffersView: showAllOffersViewProp, isSearchPage: isSearchPageProp }) => {
  const {
    products, handleAddToCart,
    viewMode, handleViewModeChange, sortOption, handleSortChange, isLoading,
    handleToggleWishlist, wishlistItems, currentUser, setIsLoginModalOpen,
    handleInitiateDirectCheckout,
    brands, availableSpecFilters, activeFilters, handleFilterChange,
    priceRange, handlePriceRangeChange, initialMaxPrice, handleResetFilters, filterCounts,
    selectedCategory, handleSelectCategory, searchTerm, setSearchTerm, showAllOffersView, setShowAllOffersView
  } = useApp();

  const { categoryId } = useParams();
  const location = useLocation();
  
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  useEffect(() => {
    handleSelectCategory(categoryId);
  }, [categoryId, handleSelectCategory]);
  
  useEffect(() => {
    setShowAllOffersView(showAllOffersViewProp || false);
    if (showAllOffersViewProp) handleSelectCategory(null);
  }, [showAllOffersViewProp, setShowAllOffersView, handleSelectCategory]);
  
  useEffect(() => {
    if (isSearchPageProp) {
      const searchParams = new URLSearchParams(location.search);
      setSearchTerm(searchParams.get('q') || '');
    } else if (!location.pathname.startsWith('/search') && searchTerm !== '') {
      setSearchTerm('');
    }
  }, [isSearchPageProp, location.search, location.pathname, setSearchTerm, searchTerm]);
  
  const getProductGridTitle = () => {
    if (searchTerm.trim()) return `نتائج البحث عن: "${searchTerm}"`;
    if (showAllOffersView) return "جميع العروض الخاصة";
    if (selectedCategory && selectedCategory !== ProductCategory.All) {
      const category = CATEGORIES.find(c => c.id === selectedCategory);
      const categoryName = category?.arabicName || "المحدد";
      return `منتجات قسم ${categoryName}`;
    }
    return "جميع منتجاتنا";
  };
  
  const currentGridTitle = getProductGridTitle();
  const categoryForTabs = (searchTerm.trim() || showAllOffersView) ? ProductCategory.All : selectedCategory;

  const filterPanelProps = {
    brands, availableSpecFilters, activeFilters, onFilterChange: handleFilterChange,
    priceRange, onPriceRangeChange: handlePriceRangeChange, maxPricePossible: initialMaxPrice,
    onResetFilters: handleResetFilters, filterCounts
  };

  const handleShowFilters = () => setIsFiltersVisible(true);
  const handleHideFilters = () => setIsFiltersVisible(false);

  return (
    <>
      <CategoryTabs categories={CATEGORIES} selectedCategory={categoryForTabs} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* فلتر الديسكتوب */}
          <aside className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FiltersPanel {...filterPanelProps} />
            </div>
          </aside>

          {/* منطقة المنتجات */}
          <main className="w-full lg:flex-grow">
            {/* ✅ تم التعديل هنا: تم تغيير طريقة العرض لحل مشكلة المساحة الكبيرة في الموبايل */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-dark-900 dark:text-dark-50">
                {currentGridTitle}
              </h2>

              {/* أدوات التحكم */}
              <div className="flex items-center justify-end gap-3">
                {!isFiltersVisible && (
                  <button
                    onClick={handleShowFilters}
                    // ✅ تم التعديل هنا: تم تصغير حجم الزر
                    className="lg:hidden flex items-center gap-2 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 px-3 py-1.5 text-sm font-medium text-dark-800 dark:text-dark-100 shadow-sm hover:bg-light-100 dark:hover:bg-dark-600"
                  >
                    <FilterIcon className="h-5 w-5" />
                    <span>الفلاتر</span>
                  </button>
                )}
                <SortOptions sortOption={sortOption} onSortChange={handleSortChange} />
                <ViewModeToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              </div>
            </div>

            {isFiltersVisible && (
              <div className="block lg:hidden mb-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-light-200 dark:border-dark-700 p-4">
                {/* ✅ تم التعديل هنا: تم إزالة عنوان الفلاتر المكرر وترك زر الإخفاء فقط */}
                <div className="flex justify-end mb-2">
                  <button
                    onClick={handleHideFilters}
                    className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    إخفاء
                  </button>
                </div>
                <FiltersPanel {...filterPanelProps} />
              </div>
            )}

            <ProductGrid
              products={products}
              onAddToCart={handleAddToCart}
              viewMode={viewMode}
              isLoading={isLoading}
              searchTerm={searchTerm}
              onToggleWishlist={handleToggleWishlist}
              wishlistItems={wishlistItems}
              currentUser={currentUser}
              onLoginRequest={() => setIsLoginModalOpen(true)}
              onInitiateDirectCheckout={handleInitiateDirectCheckout}
            />
          </main>
        </div>
      </div>
    </>
  );
};