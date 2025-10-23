

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo.js';
import { SearchBar } from './SearchBar.js';
import { NavLinks as DesktopNavLinks } from './NavLinks.js';
import { HeaderActions } from './HeaderActions.js';
import { MobileMenu } from './MobileMenu.js';
import { NotificationsPopover } from '../../features/notifications/NotificationsPopover.js';
import { MiniCartPopover } from '../../features/cart/MiniCartPopover.js';
import { UserMenuPopover } from '../../features/auth/UserMenuPopover.js';

const navLinks = [
    { name: 'الرئيسية', to: '/' },
    { name: 'جميع المنتجات', to: '/products' },
    { name: 'العروض', to: '/offers' },
    { name: 'قائمة الرغبات', to: '/wishlist', requiresLogin: true },
];

export const Header = ({
    onOpenCartPanel, cartItems, cartItemCount, cartTotalPrice,
    currentUser, onLoginClick, onLogout,
    searchTerm, onSearchTermChange, onSearchSubmit,
    onToggleTheme, currentTheme,
    notifications, unreadNotificationsCount, onMarkNotificationAsRead,
    activePopover,
    onToggleMiniCart,
    onToggleNotifications,
    onToggleUserMenu,
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
    const userIconRef = useRef(null);
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

    const handleLogoutClick = useCallback(() => {
        onCloseAllPopovers();
        onLogout();
    }, [onLogout, onCloseAllPopovers]);

    const handleSearchFormSubmit = useCallback((e) => {
        e.preventDefault();
        onCloseAllPopovers();
        onSearchSubmit(searchTerm);
        setMobileMenuOpen(false);
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }, [onSearchSubmit, searchTerm, onCloseAllPopovers, navigate]);

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
        }
        if (action === 'navigateToUserProfile') {
            navigate('/profile');
        }
        onCloseAllPopovers();
    };


    const headerBaseClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out";
    const headerDynamicClasses = isScrolled || mobileMenuOpen
        ? 'bg-white/90 dark:bg-dark-800/90 shadow-md backdrop-blur-sm border-b border-light-200 dark:border-dark-700 header-scrolled'
        : 'bg-transparent header-transparent';

    return (
        React.createElement("header", {
            id: "main-header",
            className: `${headerBaseClasses} ${headerDynamicClasses}`
        },
            React.createElement("div", { className: "container mx-auto px-2 sm:px-6 lg:px-8" },
                React.createElement("div", { className: "flex items-center justify-between h-16 sm:h-20" },
                    React.createElement(Logo, { isScrolled: isScrolled, mobileMenuOpen: mobileMenuOpen }),
                    React.createElement(SearchBar, {
                        handleSearchFormSubmit, searchTerm, onSearchTermChange,
                        isAutocompleteVisible, setIsAutocompleteVisible,
                        autocompleteSuggestions, searchContainerRef,
                        handleSuggestionClick: handleSuggestionClick
                    }),
                    React.createElement(DesktopNavLinks, { navLinks: navLinks, currentUser: currentUser }),
                    React.createElement("div", { className: "flex items-center space-x-1 sm:space-x-2" },
                        React.createElement(HeaderActions, {
                            onToggleTheme, currentTheme,
                            notificationsIconRef, onToggleNotifications, activePopover, unreadNotificationsCount, notifications, onCloseAllPopovers, onMarkNotificationAsRead,
                            cartIconRef, onToggleMiniCart, cartItemCount, cartTotalPrice, cartItems, onOpenCartPanel, handleNavigateToAllProductsFromMiniCart: () => navigate('/products'),
                            userIconRef, currentUser, onToggleUserMenu, handleLogoutClick, onLoginClick,
                            NotificationsPopover, MiniCartPopover, UserMenuPopover,
                            handleNotificationNavigate: handleNotificationNavigate,
                            loyaltySettings: loyaltySettings,
                        }),
                        React.createElement("div", { className: "md:hidden" },
                            React.createElement("button", {
                                onClick: () => setMobileMenuOpen(!mobileMenuOpen),
                                className: "transition-colors duration-200 p-1.5 rounded-md text-dark-800 dark:text-dark-100 hover:text-primary",
                                "aria-label": mobileMenuOpen ? "Close menu" : "Open menu",
                                "aria-expanded": mobileMenuOpen
                            },
                                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
                                    mobileMenuOpen
                                        ? React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" })
                                        : React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" })
                                )
                            )
                        )
                    )
                )
            ),
            mobileMenuOpen && React.createElement(MobileMenu, {
                handleSearchFormSubmit, searchTerm, onSearchTermChange,
                navLinks, currentUser
            })
        )
    );
};