import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo.js';
import { SearchBar } from './SearchBar.js';
import { NavLinks as DesktopNavLinks } from './NavLinks.js';
import { HeaderActions } from './HeaderActions.js';
import { MobileMenu } from './MobileMenu.js';
import { NotificationsPopover } from '../../features/notifications/NotificationsPopover.js';
import { MiniCartPopover } from '../../features/cart/MiniCartPopover.js';

const navLinks = [
    { name: 'الرئيسية', to: '/' },
    { name: 'جميع المنتجات', to: '/products' },
    { name: 'العروض', to: '/offers' },
    { name: 'قائمة الرغبات', to: '/wishlist', requiresLogin: true },
];

export const Header = ({
    onOpenCartPanel, cartItems, cartItemCount, cartTotalPrice,
    currentUser, onLoginClick, onLogout,
    searchTerm, onSearchTermChange,
    onToggleTheme, currentTheme,
    notifications, unreadNotificationsCount, onMarkNotificationAsRead,
    activePopover,
    onToggleMiniCart,
    onToggleNotifications,
    onCloseAllPopovers,
    autocompleteSuggestions,
    loyaltySettings
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAutocompleteVisible, setIsAutocompleteVisible] = useState(false);
    
    const searchContainerRef = useRef(null);
    const cartIconRef = useRef(null); 
    const notificationsIconRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsAutocompleteVisible(searchTerm.length > 1);
    }, [searchTerm]);

    useEffect(() => {
        setMobileMenuOpen(false); // Close mobile menu on navigation
        onCloseAllPopovers(); // Close popovers on navigation
    }, [location.pathname, onCloseAllPopovers]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setIsAutocompleteVisible(false);
                onCloseAllPopovers();
            }
        };
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsAutocompleteVisible(false);
            }
        };

        if (isAutocompleteVisible || activePopover) {
            window.addEventListener('keydown', handleEsc);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAutocompleteVisible, activePopover, onCloseAllPopovers]);

    const handleUserIconClick = useCallback(() => {
        if (currentUser) {
            navigate('/profile');
            onCloseAllPopovers();
        } else {
            onLoginClick();
        }
    }, [currentUser, navigate, onLoginClick, onCloseAllPopovers]);

    const handleSearchFormSubmit = useCallback((e) => {
        e.preventDefault();
        onCloseAllPopovers();
        setMobileMenuOpen(false);
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }, [searchTerm, onCloseAllPopovers, navigate]);

    const handleSuggestionClick = useCallback((suggestion) => {
        setIsAutocompleteVisible(false);
        if (suggestion.type === 'product') {
            navigate(`/product/${suggestion.id}`);
        } else if (suggestion.type === 'category') {
            navigate(`/category/${suggestion.id}`);
        }
    }, [navigate]);

    const handleNotificationNavigate = (action, params) => {
        if (action === 'selectProductSuggestion' && params.productId) {
            navigate(`/product/${params.productId}`);
        } else if (action === 'navigateToUserProfile') {
            navigate('/profile');
        } else if (action === 'navigateToOrdersHistory') {
            navigate('/orders');
        }
        onCloseAllPopovers();
    };

    const headerBaseClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out";
    const headerDynamicClasses = isScrolled || mobileMenuOpen
        ? 'bg-white/95 dark:bg-dark-800/95 shadow-lg backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-700/50'
        : 'bg-transparent';

    return (
        <header
            id="main-header"
            className={`${headerBaseClasses} ${headerDynamicClasses}`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo - Enhanced with better spacing */}
                    <div className="flex-shrink-0 z-50">
                        <Logo isScrolled={isScrolled} mobileMenuOpen={mobileMenuOpen} />
                    </div>

                    {/* Desktop Navigation Links - Hidden on mobile and tablet */}
                    <div className="hidden xl:block flex-1 max-w-3xl mx-8">
                        <DesktopNavLinks navLinks={navLinks} currentUser={currentUser} />
                    </div>

                    {/* Search Bar - Enhanced for different screen sizes */}
                    <div className="hidden md:block flex-1 max-w-2xl mx-4">
                        <SearchBar
                            handleSearchFormSubmit={handleSearchFormSubmit}
                            searchTerm={searchTerm}
                            onSearchTermChange={onSearchTermChange}
                            isAutocompleteVisible={isAutocompleteVisible}
                            setIsAutocompleteVisible={setIsAutocompleteVisible}
                            autocompleteSuggestions={autocompleteSuggestions}
                            searchContainerRef={searchContainerRef}
                            handleSuggestionClick={handleSuggestionClick}
                        />
                    </div>

                    {/* Header Actions - Enhanced spacing and layout */}
                    <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
                        <HeaderActions
                            onToggleTheme={onToggleTheme}
                            currentTheme={currentTheme}
                            notificationsIconRef={notificationsIconRef}
                            onToggleNotifications={onToggleNotifications}
                            activePopover={activePopover}
                            unreadNotificationsCount={unreadNotificationsCount}
                            notifications={notifications}
                            onCloseAllPopovers={onCloseAllPopovers}
                            onMarkNotificationAsRead={onMarkNotificationAsRead}
                            cartIconRef={cartIconRef}
                            onToggleMiniCart={onToggleMiniCart}
                            cartItemCount={cartItemCount}
                            cartTotalPrice={cartTotalPrice}
                            cartItems={cartItems}
                            onOpenCartPanel={onOpenCartPanel}
                            handleNavigateToAllProductsFromMiniCart={() => navigate('/products')}
                            currentUser={currentUser}
                            onLoginClick={onLoginClick}
                            onLogout={onLogout}
                            onUserIconClick={handleUserIconClick}
                            NotificationsPopover={NotificationsPopover}
                            MiniCartPopover={MiniCartPopover}
                            handleNotificationNavigate={handleNotificationNavigate}
                            loyaltySettings={loyaltySettings}
                        />

                        {/* Mobile Menu Button - Enhanced design */}
                        <div className="xl:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`
                                    relative p-2 rounded-xl transition-all duration-300 
                                    ${mobileMenuOpen 
                                        ? 'bg-primary text-white' 
                                        : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white'
                                    }
                                `}
                                aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
                                aria-expanded={mobileMenuOpen}
                            >
                                <div className="w-6 h-6 relative">
                                    <span className={`
                                        absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                        w-4 h-0.5 bg-current transition-all duration-300
                                        ${mobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}
                                    `} />
                                    <span className={`
                                        absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                        w-4 h-0.5 bg-current transition-all duration-300
                                        ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}
                                    `} />
                                    <span className={`
                                        absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                        w-4 h-0.5 bg-current transition-all duration-300
                                        ${mobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}
                                    `} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Search Bar for Tablets - Shows below header on medium screens */}
                <div className="md:hidden pb-3 border-b border-gray-200 dark:border-dark-600 mt-2">
                    <SearchBar
                        handleSearchFormSubmit={handleSearchFormSubmit}
                        searchTerm={searchTerm}
                        onSearchTermChange={onSearchTermChange}
                        isAutocompleteVisible={isAutocompleteVisible}
                        setIsAutocompleteVisible={setIsAutocompleteVisible}
                        autocompleteSuggestions={autocompleteSuggestions}
                        searchContainerRef={searchContainerRef}
                        handleSuggestionClick={handleSuggestionClick}
                        compact={true}
                    />
                </div>
            </div>

            {/* Enhanced Mobile Menu with better animations */}
            {mobileMenuOpen && (
                <div className="xl:hidden">
                    <MobileMenu
                        handleSearchFormSubmit={handleSearchFormSubmit}
                        searchTerm={searchTerm}
                        onSearchTermChange={onSearchTermChange}
                        navLinks={navLinks}
                        currentUser={currentUser}
                        isMediumScreen={true}
                        onClose={() => setMobileMenuOpen(false)}
                    />
                </div>
            )}
        </header>
    );
};