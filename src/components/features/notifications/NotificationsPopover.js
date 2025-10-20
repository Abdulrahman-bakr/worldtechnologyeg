import React, { useState, useEffect, useRef } from 'react';
import { MegaphoneIcon, StarIcon, ShoppingBagIcon, CloseIcon, PhoneIcon } from '../../icons/index.js';
import { formatTimeAgo } from '../../../utils/helpers/formatters.js';

const NotificationsPopover = ({ notifications, isVisible, onClose, onNavigate, triggerRef, onMarkAsRead }) => {
    const popoverRef = useRef(null);
    const [isRendered, setIsRendered] = useState(isVisible);

    const iconMap = {
        MegaphoneIcon: MegaphoneIcon,
        StarIcon: StarIcon,
        ShoppingBagIcon: ShoppingBagIcon,
        PhoneIcon: PhoneIcon,
    };

    useEffect(() => {
        if (isVisible) {
            setIsRendered(true);
        } else if (isRendered) {
            const timer = setTimeout(() => setIsRendered(false), 300); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [isVisible, isRendered]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                onClose();
            }
        };
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isVisible, onClose, triggerRef]);

    if (!isRendered) return null;
    
    const handleItemClick = (notification) => {
        if (!notification.isRead) {
            onMarkAsRead(notification.id, notification.notificationType);
        }
        if (notification.link && onNavigate) {
            onNavigate(notification.link.action, notification.link.params || {});
        }
    };

    return React.createElement("div", {
        ref: popoverRef,
        className: `absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 max-w-[90vw] bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-light-200 dark:border-dark-700 z-40 transform transition-all duration-300 ease-out origin-top ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "notifications-title"
    },
        React.createElement("div", { className: "flex items-center justify-between p-3 border-b border-light-300 dark:border-dark-600" },
            React.createElement("h3", { id: "notifications-title", className: "text-md font-semibold text-primary" }, "الإشعارات"),
            React.createElement("button", { onClick: onClose, "aria-label": "إغلاق", className: "p-1 text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-dark-50" },
                React.createElement(CloseIcon, { className: "w-5 h-5" })
            )
        ),
        notifications.length === 0 ? (
            React.createElement("div", { className: "p-6 text-center" },
                React.createElement(MegaphoneIcon, { className: "w-12 h-12 text-dark-500 dark:text-dark-400 mx-auto mb-3" }),
                React.createElement("p", { className: "text-dark-700 dark:text-dark-200" }, "لا توجد إشعارات حالياً.")
            )
        ) : (
             React.createElement("div", { className: "p-2 space-y-1 max-h-80 overflow-y-auto" },
                notifications.map(notification => {
                    const IconComponent = iconMap[notification.icon] || MegaphoneIcon;
                    const isUnread = !notification.isRead;
                    const notificationDate = notification.createdAt?.toDate ? notification.createdAt.toDate() : new Date(notification.createdAt);
                    
                    return React.createElement("div", { 
                        key: notification.id, 
                        onClick: () => handleItemClick(notification),
                        className: `flex items-start space-x-3 space-x-reverse p-3 rounded-lg transition-colors ${notification.link ? 'cursor-pointer' : ''} ${isUnread ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-light-100 dark:hover:bg-dark-700'}`
                    },
                        React.createElement("div", { className: "flex-shrink-0 relative pt-1" },
                           notification.productImageUrl ? (
                               React.createElement("img", {
                                   src: notification.productImageUrl,
                                   alt: notification.title,
                                   className: "w-10 h-10 object-cover rounded-md bg-light-100 dark:bg-dark-700"
                               })
                           ) : (
                               React.createElement("div", { className: "w-10 h-10 flex items-center justify-center bg-light-100 dark:bg-dark-700 rounded-full" },
                                   React.createElement(IconComponent, { className: "w-5 h-5 text-primary" })
                               )
                           ),
                           isUnread && React.createElement("span", { 
                               className: "absolute top-0 -left-0.5 block h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-dark-800",
                               title: "إشعار جديد"
                            })
                        ),
                        React.createElement("div", { className: "flex-grow" },
                            React.createElement("p", { className: `text-sm font-semibold ${isUnread ? 'text-dark-900 dark:text-dark-50' : 'text-dark-700 dark:text-dark-200'}` }, notification.title),
                            React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300" }, notification.message),
                            notification.createdAt && React.createElement("time", {
                                dateTime: notificationDate.toISOString(),
                                className: "text-xs text-dark-500 dark:text-dark-400 mt-1 block"
                            },
                                formatTimeAgo(notificationDate)
                            )
                        )
                    );
                })
             )
        )
    );
};

export { NotificationsPopover };