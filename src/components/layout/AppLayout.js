import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext.js';
import { Header } from './Header/Header.js';
import { Footer } from './Footer/Footer.js';
import { Modals } from './Modals.js';
import { BannerRotator } from './BannerRotator.js';
import { AIChatFAB } from '../features/ai-chat/AIChatFAB.js';
import { ComparisonBar } from '../features/comparison/ComparisonBar.js'; // Import new component

export const AppLayout = () => {
    const {
        setIsCartOpen, cartItems, cartItemCount, headerCartTotalPrice, currentUser,
        setIsLoginModalOpen, handleLogout, searchTerm, handleSearchTermChange,
        handleSearchSubmit, handleToggleTheme, currentTheme,
        products, allNotifications, totalUnreadCount, handleMarkNotificationAsRead,
        isChatOpen, setIsChatOpen, storeSettings,
        // New popover state and handlers
        activePopover,
        handleToggleMiniCart,
        handleToggleNotificationsPopover,
        handleToggleUserMenu,
        closeAllPopovers,
        autocompleteSuggestions,
        comparisonList, // Get comparison list
        loyaltySettings,
    } = useApp();
    const location = useLocation();

    return (
        React.createElement("div", { className: `flex flex-col min-h-screen bg-light-50 dark:bg-dark-900` },
            React.createElement(Header, {
                onOpenCartPanel: () => setIsCartOpen(true),
                cartItems: cartItems,
                cartItemCount: cartItemCount,
                cartTotalPrice: headerCartTotalPrice,
                currentUser: currentUser,
                onLoginClick: () => setIsLoginModalOpen(true),
                onLogout: handleLogout,
                searchTerm: searchTerm,
                onSearchTermChange: handleSearchTermChange,
                onSearchSubmit: handleSearchSubmit,
                onToggleTheme: handleToggleTheme,
                currentTheme: currentTheme,
                products: products,
                notifications: allNotifications,
                unreadNotificationsCount: totalUnreadCount,
                onMarkNotificationAsRead: handleMarkNotificationAsRead,
                // Pass new popover props
                activePopover: activePopover,
                onToggleMiniCart: handleToggleMiniCart,
                onToggleNotifications: handleToggleNotificationsPopover,
                onToggleUserMenu: handleToggleUserMenu,
                onCloseAllPopovers: closeAllPopovers,
                autocompleteSuggestions: autocompleteSuggestions,
                loyaltySettings: loyaltySettings,
            }),
            React.createElement("main", { className: "flex-grow pt-16 sm:pt-20 w-full" },
                !location.pathname.startsWith('/product/') && React.createElement(BannerRotator, null),
                React.createElement(Outlet, null)
            ),
            React.createElement(Footer, { storeSettings: storeSettings }),
            !isChatOpen && React.createElement(AIChatFAB, { onOpen: () => setIsChatOpen(true) }),
            React.createElement(Modals, null),
            comparisonList.length > 0 && React.createElement(ComparisonBar, null)
        )
    );
};