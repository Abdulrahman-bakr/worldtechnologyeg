

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon, BellIcon, ShoppingCartIcon, UserIcon, LogInIcon } from '../../icons/index.js';
import { NotificationsPopover } from '../../features/notifications/NotificationsPopover.js';
import { MiniCartPopover } from '../../features/cart/MiniCartPopover.js';

export const HeaderActions = ({
    onToggleTheme, currentTheme,
    notificationsIconRef, onToggleNotifications, activePopover, unreadNotificationsCount, notifications, onCloseAllPopovers, handleNotificationNavigate, onMarkNotificationAsRead,
    cartIconRef, onToggleMiniCart, cartItemCount, cartTotalPrice, cartItems, onOpenCartPanel, handleNavigateToAllProductsFromMiniCart,
    currentUser, onLoginClick, onLogout, onUserIconClick,
    loyaltySettings
}) => {
    const [isCartAnimating, setIsCartAnimating] = useState(false);
    const prevCartItemCount = useRef(cartItemCount);

    useEffect(() => {
        if (cartItemCount > prevCartItemCount.current) {
            setIsCartAnimating(true);
            const timer = setTimeout(() => setIsCartAnimating(false), 820);
            return () => clearTimeout(timer);
        }
        prevCartItemCount.current = cartItemCount;
    }, [cartItemCount]);


    return (
        React.createElement("div", { className: "flex items-center space-x-1 sm:space-x-2" },
            React.createElement("button", {
                onClick: onToggleTheme,
                "aria-label": currentTheme === 'dark' ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن",
                className: "p-1.5 rounded-md text-dark-800 dark:text-dark-100 hover:text-primary hover:bg-light-100/50 dark:hover:bg-dark-700/50 transition-colors"
            },
                currentTheme === 'dark' ? React.createElement(SunIcon, { className: "w-5 h-5 sm:w-6 sm:h-6" }) : React.createElement(MoonIcon, { className: "w-5 h-5 sm:w-6 sm:h-6" })
            ),
            React.createElement("div", { className: "relative", ref: notificationsIconRef },
                React.createElement("button", {
                    onClick: onToggleNotifications,
                    "aria-label": "عرض الإشعارات",
                    "aria-expanded": activePopover === 'notifications',
                    className: "relative flex items-center transition-colors duration-200 p-1.5 rounded-md text-dark-800 dark:text-dark-100 hover:text-primary hover:bg-light-100/50 dark:hover:bg-dark-700/50"
                },
                    React.createElement(BellIcon, { className: "w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" }),
                    unreadNotificationsCount > 0 && (
                        React.createElement("span", { className: "absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center" }, unreadNotificationsCount)
                    )
                ),
                React.createElement(NotificationsPopover, {
                    isVisible: activePopover === 'notifications',
                    notifications: notifications,
                    onClose: onCloseAllPopovers,
                    onNavigate: handleNotificationNavigate,
                    triggerRef: notificationsIconRef,
                    onMarkAsRead: onMarkNotificationAsRead
                })
            ),
            React.createElement("div", { className: "relative", ref: cartIconRef },
                React.createElement("button", {
                    onClick: onToggleMiniCart,
                    "aria-label": "عرض سلة التسوق المصغرة",
                    "aria-expanded": activePopover === 'cart',
                    className: `relative flex items-center transition-colors duration-200 p-1.5 rounded-md text-dark-800 dark:text-dark-100 hover:text-primary hover:bg-light-100/50 dark:hover:bg-dark-700/50 ${isCartAnimating ? 'animate-cart-shake' : ''}`
                },
                    cartItemCount > 0 && cartTotalPrice > 0 && React.createElement("span", {
                        className: "hidden sm:inline-block text-xs sm:text-sm text-primary font-semibold sm:ml-1.5 tabular-nums"
                    }, `${cartTotalPrice.toFixed(2)} ج.م`),
                    React.createElement(ShoppingCartIcon, { className: "w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" }),
                    cartItemCount > 0 && (
                        React.createElement("span", { className: "absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center" }, cartItemCount)
                    )
                ),
                React.createElement(MiniCartPopover, {
                    isVisible: activePopover === 'cart',
                    cartItems: cartItems,
                    cartTotalPrice: cartTotalPrice,
                    onClose: onCloseAllPopovers,
                    onViewFullCart: onOpenCartPanel,
                    onNavigateToAllProducts: handleNavigateToAllProductsFromMiniCart,
                    triggerRef: cartIconRef
                })
            ),
            React.createElement("div", { className: "relative" },
                React.createElement("button", { 
                    onClick: onUserIconClick,
                    className: `flex items-center p-1.5 rounded-md text-dark-800 dark:text-dark-100 hover:text-primary hover:bg-light-100/50 dark:hover:bg-dark-700/50 transition-colors`, 
                    "aria-label": currentUser ? "عرض الحساب" : "تسجيل الدخول" 
                },
                    currentUser 
                        ? React.createElement(UserIcon, { className: "w-5 h-5 sm:w-6 sm:h-6" })
                        : React.createElement(LogInIcon, { className: "w-5 h-5 sm:w-6 sm:h-6" })
                )
            )
        )
    );
};