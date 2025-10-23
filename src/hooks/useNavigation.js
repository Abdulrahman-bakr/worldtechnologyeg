

import { useCallback, useEffect, useMemo } from 'react';
import { ProductCategory, SortOption } from '../constants/index.js';

export const useNavigation = ({
    currentUser,
    products,
    initialMaxPrice,
    addRecentlyViewed,
    setIsLoginModalOpen,
    setPendingActionAfterLogin,
    currentView, setCurrentView,
    detailedProduct, setDetailedProduct,
    selectedCategory, setSelectedCategory,
    showAllOffersView, setShowAllOffersView,
    sortOption, setSortOption,
    viewMode, setViewMode,
    searchTerm, setSearchTerm,
    setToastMessage,
    // New setters for filters
    setActiveFilters,
    setPriceRange,
}) => {

    const initialState = useMemo(() => ({
        view: 'home',
        category: ProductCategory.All,
        sort: SortOption.Default,
        viewMode: 'grid',
        searchTerm: "",
        showAllOffers: false,
        productDetailId: null,
    }), []);

    const applyStateFromHistory = useCallback((state) => {
        if (!state) return;
        
        const newView = state.view || 'home';

        setCurrentView(prevView => {
            if (newView !== prevView) {
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            }
            return newView;
        });
        
        setSelectedCategory(state.category || ProductCategory.All);
        setSortOption(state.sort || SortOption.Default);
        setViewMode(state.viewMode || 'grid');
        setSearchTerm(state.searchTerm || "");
        setShowAllOffersView(state.showAllOffers || false);
        
        if (newView === 'productDetail' && state.productDetailId) {
            const product = products.find(p => p.id === state.productDetailId);
            setDetailedProduct(product || null);
            if (product) addRecentlyViewed(product.id);
        } else {
            setDetailedProduct(null);
        }

    }, [
        products, addRecentlyViewed,
        setCurrentView, setSelectedCategory, setSortOption,
        setViewMode, setSearchTerm, setShowAllOffersView,
        setDetailedProduct
    ]);

    const updateHistory = useCallback((newStateChanges, replace = false) => {
        const currentHistoryState = window.history.state || initialState;
        
        const newState = {
            ...currentHistoryState,
            ...newStateChanges,
        };
        
        const path = (() => {
            switch (newState.view) {
                case 'wishlist': return '/wishlist';
                case 'userProfile': return '/profile';
                case 'ordersHistory': return '/orders';
                case 'adminDashboard': return '/admin';
                case 'productDetail': return `/product/${newState.productDetailId}`;
                case 'terms': return '/terms';
                case 'faq': return '/faq';
                case 'about-us': return '/about-us';
                case 'orderTracking': return '/track-order';
                default: return '/';
            }
        })();

        if (JSON.stringify(window.history.state) !== JSON.stringify(newState)) {
            if (replace) {
                window.history.replaceState(newState, '', path);
            } else {
                window.history.pushState(newState, '', path);
            }
        }
    }, [initialState]);

    useEffect(() => {
        const handlePopState = (event) => {
            const state = event.state || initialState;
            applyStateFromHistory(state);
            if (state.view !== 'productDetail') {
                setActiveFilters({ brands: [], specs: {}, discountedOnly: false });
                setPriceRange({ min: 0, max: initialMaxPrice });
            }
        };
        window.addEventListener('popstate', handlePopState);

        let stateToApply;
        if (window.history.state) {
            stateToApply = window.history.state;
        } else {
            const path = window.location.pathname;
            let initialView = 'home';
            let productDetailId = null;

            if (path.startsWith('/product/')) {
                initialView = 'productDetail';
                productDetailId = path.substring('/product/'.length);
            } else {
                const viewMap = {
                    '/wishlist': 'wishlist',
                    '/profile': 'userProfile',
                    '/orders': 'ordersHistory',
                    '/admin': 'adminDashboard',
                    '/terms': 'terms',
                    '/faq': 'faq',
                    '/about-us': 'aboutUs',
                    '/track-order': 'orderTracking',
                };
                initialView = viewMap[path] || 'home';
            }
            
            stateToApply = { ...initialState, view: initialView, productDetailId: productDetailId };
            window.history.replaceState(stateToApply, '', path);
        }

        applyStateFromHistory(stateToApply);

        return () => window.removeEventListener('popstate', handlePopState);
    }, [applyStateFromHistory, initialState, setActiveFilters, setPriceRange, initialMaxPrice]);

    const handleNavigation = (action, params = {}, userForCheck = currentUser) => {
        if (['navigateToWishlist', 'navigateToUserProfile', 'navigateToOrdersHistory', 'navigateToAdminDashboard'].includes(action) && !userForCheck) {
            setPendingActionAfterLogin({ type: action, payload: params });
            setIsLoginModalOpen(true);
            setToastMessage({ text: "يرجى تسجيل الدخول أولاً لعرض هذه الصفحة.", type: 'info' });
            return;
        }

        const createNavState = (viewName, defaults = {}) => ({
            view: viewName,
            productDetailId: null,
            category: ProductCategory.All,
            sort: SortOption.Default,
            searchTerm: "",
            showAllOffers: false,
            ...defaults,
            ...params
        });

        let newState = null;
        switch (action) {
            case 'navigateToHome': newState = createNavState('home'); break;
            case 'navigateToAllCategories': newState = createNavState('productList', { category: 'All' }); break;
            case 'navigateToAllProducts': newState = createNavState('productList', { category: 'All' }); break;
            case 'navigateToSpecialOffers': newState = createNavState('productList', { showAllOffers: true }); break;
            case 'navigateToTerms': newState = createNavState('terms'); break;
            case 'navigateToFAQ': newState = createNavState('faq'); break;
            case 'navigateToAboutUs': newState = createNavState('aboutUs'); break;
            case 'navigateToWishlist': newState = createNavState('wishlist'); break;
            case 'navigateToUserProfile': newState = createNavState('userProfile'); break;
            case 'navigateToOrdersHistory': newState = createNavState('ordersHistory'); break;
            case 'navigateToOrderTracking': newState = createNavState('orderTracking'); break;
            case 'navigateToAdminDashboard': newState = createNavState('adminDashboard'); break;
            case 'selectProductSuggestion':
                const productToView = products.find(p => p.id === params.productId);
                if (productToView) addRecentlyViewed(productToView.id);
                newState = { view: 'productDetail', productDetailId: params.productId };
                break;
            case 'selectCategorySuggestion':
                newState = createNavState('productList', { category: params.categoryId });
                break;
            case 'scrollToFooter':
                document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth' });
                return;
            default:
                console.warn(`[useNavigation] No handler for action: ${action}`);
                return;
        }

        if (newState) {
            if (newState.view === 'productList' && (currentView !== 'productList' || (newState.category && newState.category !== selectedCategory))) {
                setActiveFilters({ brands: [], specs: {}, discountedOnly: false });
                setPriceRange({ min: 0, max: initialMaxPrice });
            }
            applyStateFromHistory(newState);
            updateHistory(newState);
        }
    };

    const handleBackFromSubView = () => window.history.back();

    const handleViewProductDetail = useCallback((productOrId) => {
        const productId = typeof productOrId === 'string' ? productOrId : productOrId?.id;
        const product = products.find(p => p.id === productId);
        if (product) addRecentlyViewed(product.id);
        const newState = { view: 'productDetail', productDetailId: productId };
        applyStateFromHistory(newState);
        updateHistory(newState);
    }, [updateHistory, applyStateFromHistory, addRecentlyViewed, products]);
    
    const handleSelectCategory = (categoryId) => {
        handleNavigation('navigateToAllCategories', { category: categoryId });
    };

    const handleSearchSubmit = useCallback((query) => {
        const newState = {
            view: 'productList',
            searchTerm: query,
            category: ProductCategory.All,
            showAllOffers: false,
        };
        applyStateFromHistory(newState);
        updateHistory(newState);
    }, [applyStateFromHistory, updateHistory]);
    
    const handleSearchTermChange = useCallback((value) => {
        setSearchTerm(value);
    }, [setSearchTerm]);


    return {
        applyStateFromHistory,
        updateHistory,
        handleNavigation,
        handleBackFromSubView,
        handleViewProductDetail,
        handleSelectCategory,
        handleSearchSubmit,
        handleSearchTermChange,
    };
};