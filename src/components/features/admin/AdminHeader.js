import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, ShoppingCartIcon, ExclamationTriangleIcon, DocumentTextIcon, Bars3Icon } from '../../icons/index.js';

const AdminHeader = ({ title, notifications, setActivePanel, onToggleSidebar }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const triggerRef = useRef(null);
    const popoverRef = useRef(null);

    const unreadCount = notifications.reduce((sum, notif) => sum + notif.count, 0);
    
    const iconMap = {
        ShoppingCartIcon,
        ExclamationTriangleIcon,
        DocumentTextIcon
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                setPopoverOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (panel) => {
        setActivePanel(panel);
        setPopoverOpen(false);
    };

    return (
        React.createElement("header", { className: "sticky top-0 z-20 flex items-center justify-between h-20 px-4 sm:px-6 bg-white dark:bg-dark-800 border-b border-light-200 dark:border-dark-700" },
            React.createElement("div", { className: "flex items-center gap-4" },
                React.createElement("button", { 
                    onClick: onToggleSidebar,
                    className: "p-2 rounded-full text-dark-700 dark:text-dark-200 hover:bg-light-100 dark:hover:bg-dark-700 md:hidden",
                    "aria-label": "Open sidebar"
                },
                    React.createElement(Bars3Icon, { className: "w-6 h-6" })
                ),
                React.createElement("h1", { className: "text-xl font-bold text-dark-900 dark:text-dark-50" }, title)
            ),
            React.createElement("div", { className: "relative", ref: triggerRef },
                React.createElement("button", {
                    onClick: () => setPopoverOpen(prev => !prev),
                    className: "relative p-2 rounded-full text-dark-700 dark:text-dark-200 hover:bg-light-100 dark:hover:bg-dark-700"
                },
                    React.createElement(BellIcon, { className: "w-6 h-6" }),
                    unreadCount > 0 && React.createElement("span", { className: "absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-dark-800" })
                ),
                popoverOpen && React.createElement("div", {
                    ref: popoverRef,
                    className: "absolute left-0 mt-2 w-72 bg-white dark:bg-dark-700 rounded-lg shadow-xl border border-light-200 dark:border-dark-600 z-30 "
                },
                    React.createElement("div", { className: "p-3 font-semibold border-b border-light-200 dark:border-dark-600" }, "الإشعارات العاجلة"),
                    React.createElement("div", { className: "p-2" },
                        notifications.length > 0 ? (
                            notifications.map(notif => {
                                const Icon = iconMap[notif.icon];
                                return React.createElement("button", {
                                    key: notif.id,
                                    onClick: () => handleNotificationClick(notif.panel),
                                    className: "w-full text-right flex items-center gap-3 p-2 rounded-md hover:bg-light-100 dark:hover:bg-dark-600"
                                },
                                    Icon && React.createElement(Icon, { className: "w-5 h-5 text-primary" }),
                                    React.createElement("span", { className: "text-sm" }, `${notif.count} ${notif.text}`)
                                )
                            })
                        ) : (
                            React.createElement("p", { className: "text-center text-sm text-dark-600 p-4" }, "لا توجد إشعارات جديدة.")
                        )
                    )
                )
            )
        )
    );
};

export { AdminHeader };