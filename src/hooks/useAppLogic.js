import React, { useState, useMemo, useCallback } from 'react';
import { useProducts } from './useProducts.js';
import { useCart } from './useCart.js';
import { useAuth } from './useAuth.js';
import { useUI } from './useUI.js';
import { useNotificationsAndBanners } from './useNotificationsAndBanners.js';
import { useCheckout } from './useCheckout.js';
import { useWishlist } from './useWishlist.js';
import { ProductCategory } from '../constants/index.js';

export const useAppLogic = () => {
    const uiState = useUI();
    const { setToastMessage, setRecentlyViewedIds, setActivePopover } = uiState;
    
    const { 
        currentUser, isLoginModalOpen, setIsLoginModalOpen, 
        pendingActionAfterLogin, setPendingActionAfterLogin,
        handleLoginSuccess, handleLogout, handleUpdateCurrentUserAddress,
        handleUpdateUserProfileData
    } = useAuth(setToastMessage);

    const { wishlistItems, handleToggleWishlist } = useWishlist(currentUser, setIsLoginModalOpen, setPendingActionAfterLogin, setToastMessage);

    const { 
        products: allProducts,
        productsLoading, 
        initialMaxPrice, 
        allDigitalPackages, 
        allFeeRules,
        activePopup,
        storeSettings,
        loyaltySettings,
        filteredAndSortedProducts, 
        sortOption, 
        setSortOption, 
        searchTerm, 
        setSearchTerm,
        getProductsForCategory, 
        fetchInitialData: fetchProductsData,
        brands,
        availableSpecFilters,
        activeFilters,
        setActiveFilters,
        priceRange,
        setPriceRange,
        handleFilterChange,
        handlePriceRangeChange,
        handleResetFilters,
        filterCounts,
        discounts,
    } = useProducts(setToastMessage, uiState.selectedCategory, uiState.showAllOffersView);
    
    const [comparisonList, setComparisonList] = useState([]);

    const handleToggleCompare = useCallback((productId) => {
        setComparisonList(prev => {
            if (prev.includes(productId)) {
                setToastMessage({ text: "تمت الإزالة من قائمة المقارنة.", type: 'info' });
                return prev.filter(id => id !== productId);
            }
            if (prev.length >= 3) {
                setToastMessage({ text: "يمكنك مقارنة 3 منتجات بحد أقصى.", type: 'warning' });
                return prev;
            }
            setToastMessage({ text: "تمت الإضافة إلى قائمة المقارنة!", type: 'success' });
            return [...prev, productId];
        });
    }, [setToastMessage]);

    const handleClearCompare = useCallback(() => {
        setComparisonList([]);
    }, []);
    
    const comparisonProducts = useMemo(() => 
        allProducts.filter(p => comparisonList.includes(p.id)),
        [allProducts, comparisonList]
    );

    const addRecentlyViewed = useCallback((id) => {
        setRecentlyViewedIds(prev => [id, ...prev.filter(pId => pId !== id)].slice(0, 15));
    }, [setRecentlyViewedIds]);
    
    const recentlyViewedProducts = React.useMemo(() => {
        return (uiState.recentlyViewedIds || [])
            .map(id => allProducts.find(p => p.id === id))
            .filter(Boolean);
    }, [uiState.recentlyViewedIds, allProducts]);

    const {
        cartItems, setCartItems, isCartOpen, setIsCartOpen,
        handleAddToCart, handleUpdateQuantity, handleRemoveFromCart,
        cartItemCount
    } = useCart(setToastMessage, setActivePopover);
    
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const { cartSubtotal, totalSavedFromProductDiscounts, subtotalAfterProductDiscounts } = useMemo(() => {
        const result = cartItems.reduce((acc, item) => {
            let itemSubtotal = 0;
            let itemGrandTotal = 0;

            if (item.serviceDetails?.finalPrice) {
                const servicePrice = Number(item.serviceDetails.finalPrice);
                itemSubtotal = servicePrice * item.quantity;
                itemGrandTotal = servicePrice * item.quantity;
            } else {
                const originalPrice = item.product.price || 0;
                const discountPrice = item.product.discountPrice;
                itemSubtotal = originalPrice * item.quantity;
                itemGrandTotal = (discountPrice ?? originalPrice) * item.quantity;
            }
            acc.cartSubtotal += itemSubtotal;
            acc.subtotalAfterProductDiscounts += itemGrandTotal;
            return acc;
        }, { cartSubtotal: 0, subtotalAfterProductDiscounts: 0 });

        result.totalSavedFromProductDiscounts = result.cartSubtotal - result.subtotalAfterProductDiscounts;
        return result;
    }, [cartItems]);

    const couponDiscount = useMemo(() => {
        if (!appliedCoupon) return 0;

        let applicableAmount = 0;
        const cartValueForCoupon = subtotalAfterProductDiscounts;

        if (appliedCoupon.minPurchase && cartValueForCoupon < appliedCoupon.minPurchase) {
            return 0;
        }

        if (appliedCoupon.applicableCategories && appliedCoupon.applicableCategories.length > 0) {
            applicableAmount = cartItems.reduce((sum, item) => {
                if (appliedCoupon.applicableCategories.includes(item.product.category)) {
                    const price = item.product.discountPrice || item.product.price || 0;
                    return sum + price * item.quantity;
                }
                return sum;
            }, 0);
        } else if (appliedCoupon.applicableProducts && appliedCoupon.applicableProducts.length > 0) {
            applicableAmount = cartItems.reduce((sum, item) => {
                if (appliedCoupon.applicableProducts.includes(item.product.id)) {
                    const price = item.product.discountPrice || item.product.price || 0;
                    return sum + price * item.quantity;
                }
                return sum;
            }, 0);
        } else {
            applicableAmount = cartValueForCoupon;
        }

        if (appliedCoupon.type === 'percentage') {
            return (applicableAmount * appliedCoupon.value) / 100;
        } else if (appliedCoupon.type === 'fixed') {
            return Math.min(appliedCoupon.value, applicableAmount);
        }
        return 0;
    }, [appliedCoupon, cartItems, subtotalAfterProductDiscounts]);

    const cartGrandTotal = useMemo(() => {
        return Math.max(0, subtotalAfterProductDiscounts - couponDiscount);
    }, [subtotalAfterProductDiscounts, couponDiscount]);

    const handleApplyCoupon = useCallback((code) => {
        const coupon = discounts.find(d => d.code.toUpperCase() === code.toUpperCase());

        if (!coupon) {
            setToastMessage({ text: "كود الخصم غير صالح.", type: 'error' });
            return;
        }
        if (coupon.expiryDate && coupon.expiryDate.toDate() < new Date()) {
            setToastMessage({ text: "هذا الكوبون منتهي الصلاحية.", type: 'error' });
            return;
        }
        if (coupon.minPurchase && subtotalAfterProductDiscounts < coupon.minPurchase) {
            setToastMessage({ text: `يجب أن تكون قيمة المشتريات ${coupon.minPurchase} ج.م على الأقل لتطبيق هذا الكوبون.`, type: 'warning' });
            return;
        }
        let isApplicable = false;
        if ((!coupon.applicableCategories || coupon.applicableCategories.length === 0) && (!coupon.applicableProducts || coupon.applicableProducts.length === 0)) {
            isApplicable = cartItems.some(item => !item.serviceDetails);
        } else {
            isApplicable = cartItems.some(item => 
                (coupon.applicableCategories && coupon.applicableCategories.includes(item.product.category)) ||
                (coupon.applicableProducts && coupon.applicableProducts.includes(item.product.id))
            );
        }
        if (!isApplicable) {
            setToastMessage({ text: "لا يمكن تطبيق هذا الكوبون على المنتجات الموجودة في سلتك.", type: 'warning' });
            return;
        }
        setAppliedCoupon(coupon);
        setToastMessage({ text: "تم تطبيق الخصم بنجاح!", type: 'success' });
    }, [discounts, cartItems, subtotalAfterProductDiscounts, setToastMessage]);

    const handleRemoveCoupon = useCallback(() => {
        setAppliedCoupon(null);
        setCouponCodeInput('');
        setToastMessage({ text: "تم إزالة الخصم.", type: 'info' });
    }, [setToastMessage]);
    
    const handleCartAndCheckoutReset = useCallback(() => {
        setCartItems([]);
        setAppliedCoupon(null);
        setCouponCodeInput('');
    }, [setCartItems]);

    const {
        isCheckoutModalOpen, checkoutPayload,
        handleCloseCheckoutModal, handleCheckoutModalDataReset, handleOrderCompletion,
        attemptCheckout, handleInitiateDirectCheckout
    } = useCheckout({
        currentUser, cartItems, setIsCartOpen, setCartItems: handleCartAndCheckoutReset, 
        setToastMessage: setToastMessage, setIsLoginModalOpen, 
        setPendingActionAfterLogin, handleUpdateCurrentUserAddress,
    });
    
    const attemptCheckoutWithCoupon = useCallback(() => {
        const couponInfo = { appliedCoupon, couponDiscount };
        attemptCheckout(cartGrandTotal, null, couponInfo);
    }, [attemptCheckout, cartGrandTotal, appliedCoupon, couponDiscount]);

    const notificationState = useNotificationsAndBanners({
        products: allProducts, 
        setToastMessage: setToastMessage,
        currentUser
    });
    
    const { setupUserNotificationsListener, fetchAnnouncements } = notificationState;

    const fetchInitialData = useCallback(() => {
        fetchProductsData();
        if(fetchAnnouncements) fetchAnnouncements();
    }, [fetchProductsData, fetchAnnouncements]);


    React.useEffect(() => {
        let unsubscribe = () => {};
        if (currentUser && setupUserNotificationsListener) {
            unsubscribe = setupUserNotificationsListener(currentUser);
        }
        return () => unsubscribe();
    }, [currentUser, setupUserNotificationsListener]);
    
    const handleSelectCategory = useCallback((categoryId) => {
        uiState.setSelectedCategory(categoryId || ProductCategory.All);
        if (categoryId) { // If a specific category is chosen, turn off the offers view.
             uiState.setShowAllOffersView(false);
        }
    }, [uiState.setSelectedCategory, uiState.setShowAllOffersView]);

    return {
        products: filteredAndSortedProducts, allProducts, productsLoading, initialMaxPrice,
        allDigitalPackages, allFeeRules, activePopup, storeSettings,
        loyaltySettings,
        sortOption, handleSortChange: setSortOption, searchTerm, setSearchTerm,
        getProductsForCategory, fetchInitialData, handleSearchTermChange: setSearchTerm,
        handleSelectCategory,
        viewMode: uiState.viewMode, handleViewModeChange: uiState.setViewMode, 
        ...uiState,
        recentlyViewedProducts, addRecentlyViewed, cartItems, handleAddToCart, handleUpdateQuantity, handleRemoveFromCart,
        cartItemCount, headerCartTotalPrice: cartGrandTotal, isCartOpen, setIsCartOpen,
        isCheckoutModalOpen, handleCloseCheckoutModal, attemptCheckout: attemptCheckoutWithCoupon,
        handleInitiateDirectCheckout, currentUser, isLoginModalOpen, setIsLoginModalOpen,
        handleLoginSuccess, handleLogout, ...notificationState, wishlistItems, handleToggleWishlist,
        brands, availableSpecFilters, activeFilters, priceRange,
        handleFilterChange, handlePriceRangeChange, handleResetFilters,
        filterCounts, checkoutPayload, handleCheckoutModalDataReset, handleOrderCompletion, 
        pendingActionAfterLogin, setPendingActionAfterLogin, handleUpdateCurrentUserAddress,
        handleUpdateUserProfileData, comparisonList, comparisonProducts, handleToggleCompare, handleClearCompare,
        cartSubtotal, totalSavedFromProductDiscounts, couponDiscount, cartGrandTotal,
        appliedCoupon, couponCodeInput, setCouponCodeInput, handleApplyCoupon, handleRemoveCoupon,
    };
};