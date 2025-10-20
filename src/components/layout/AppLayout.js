

import React from 'react';
import { useApp } from '../../contexts/AppContext.js';
import { Header } from './Header/Header.js';
import { Footer } from './Footer/Footer.js';
import { Router } from './Router.js';
import { Modals } from './Modals.js';
import { BannerRotator } from './BannerRotator.js';
import { AIChatFAB } from '../features/ai-chat/AIChatFAB.js';
import { ComparisonBar } from '../features/comparison/ComparisonBar.js'; // Import new component

export const AppLayout = () => {
    const {
        setIsCartOpen, cartItems, cartItemCount, headerCartTotalPrice, currentUser,
        setIsLoginModalOpen, handleLogout, searchTerm, handleSearchTermChange,
        handleSearchSubmit, handleToggleTheme, currentTheme, handleNavigation,
        currentView, selectedCategory, showAllOffersView, miniCartTriggerTimestamp,
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
                onNavigate: handleNavigation,
                currentView: currentView,
                selectedCategory: selectedCategory,
                showAllOffersView: showAllOffersView,
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
                React.createElement(BannerRotator, null),
                React.createElement(Router, null)
            ),
            React.createElement(Footer, { onNavigate: handleNavigation, storeSettings: storeSettings }),
            !isChatOpen && React.createElement(AIChatFAB, { onOpen: () => setIsChatOpen(true) }),
            React.createElement(Modals, null),
            comparisonList.length > 0 && React.createElement(ComparisonBar, null)
        )
    );
};