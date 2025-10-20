

import React from 'react';
import { useApp } from '../contexts/AppContext.js';
import { HeroSection } from '../components/ui/HeroSection.js';
import { RecentlyViewedSection } from '../components/features/products/RecentlyViewedSection.js';
import { SpecialOffersPreviewSection } from '../components/features/products/SpecialOffersPreviewSection.js';
import { FeaturedProductCategorySection } from '../components/features/products/FeaturedProductCategorySection.js';
import { PromoBanner } from '../components/ui/PromoBanner.js';
import { FEATURED_CATEGORIES_ON_HOME, ProductCategory } from '../constants/index.js';

export const HomeView = () => {
    const {
        recentlyViewedProducts, handleAddToCart, handleViewProductDetail,
        handleToggleWishlist, wishlistItems, currentUser, setIsLoginModalOpen,
        products, handleNavigation, getProductsForCategory
    } = useApp();

    return (
        React.createElement(React.Fragment, null,
            React.createElement(HeroSection, { onShopNow: () => handleNavigation('navigateToAllProducts', { category: ProductCategory.All }) }),
            recentlyViewedProducts.length > 0 && React.createElement(RecentlyViewedSection, {
                products: recentlyViewedProducts, onAddToCart: handleAddToCart, onViewDetails: handleViewProductDetail,
                onToggleWishlist: handleToggleWishlist, wishlistItems: wishlistItems,
                currentUser: currentUser, onLoginRequest: () => setIsLoginModalOpen(true)
            }),
            React.createElement(SpecialOffersPreviewSection, {
                title: "عروض خاصة لا تفوت!",
                offerProducts: products.filter(p => p.discountPrice).sort((a,b) => (b.isNew ? 1:0) - (a.isNew ? 1:0) || a.arabicName.localeCompare(b.arabicName, 'ar')).slice(0, 8),
                onAddToCart: handleAddToCart, 
                onViewDetails: handleViewProductDetail,
                onViewAllOffersClick: () => handleNavigation('navigateToSpecialOffers'),
                onToggleWishlist: handleToggleWishlist, 
                wishlistItems: wishlistItems,
                currentUser: currentUser, 
                onLoginRequest: () => setIsLoginModalOpen(true)
            }),
            FEATURED_CATEGORIES_ON_HOME.map(fc =>
                React.createElement(FeaturedProductCategorySection, {
                    key: fc.title, title: fc.title,
                    categoryProducts: getProductsForCategory(fc.categoryIds, fc.limit),
                    onAddToCart: handleAddToCart, 
                    onViewDetails: handleViewProductDetail,
                    onViewAllClick: () => handleNavigation('navigateToAllCategories', { category: fc.displayCategoryIdForViewAll }),
                    onToggleWishlist: handleToggleWishlist, 
                    wishlistItems: wishlistItems,
                    currentUser: currentUser, 
                    onLoginRequest: () => setIsLoginModalOpen(true)
                })
            ),
            React.createElement(PromoBanner, { onNavigate: handleNavigation })
        )
    );
};
