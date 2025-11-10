import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../contexts/AppContext.js';

const FooterLinks = () => {
    const { currentUser } = useApp();

    // Reordered links into logical groups for better UX
    const links = [
        // Shopping & Core Navigation
        { label: "الرئيسية", to: '/' },
        { label: "جميع الفئات", to: '/products' },
        
        // Customer Account & Orders
        { label: "حسابي", to: '/profile', requiresLogin: true },
        { label: "طلباتي", to: '/orders', requiresLogin: true },
        { label: "تتبع طلبك", to: '/track-order' },

        // Information & Support
        { label: "من نحن", to: '/about-us' },
        { label: "الأسئلة الشائعة", to: '/faq' },
        { label: "الشروط والأحكام", to: '/terms' },
    ];

    return (
        React.createElement("div", { className: "space-y-1.5" },
            React.createElement("h4", { 
                className: "text-lg font-semibold text-dark-900 dark:text-white mb-4 relative pb-2 " +
                           "after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-12 after:h-1 " +
                           "after:bg-gradient-to-r after:from-primary after:to-secondary after:rounded-full"
            }, "روابط سريعة"),
            
            React.createElement("ul", { className: "space-y-1.5" },
                links.map((item) => {
                    if (item.requiresLogin && !currentUser) return null;
                    
                    return React.createElement("li", { 
                        key: item.to,
                        className: "group border-r-2 border-transparent hover:border-primary " +
                                  "transition-all duration-250 pr-3"
                    },
                        React.createElement(Link, {
                            to: item.to,
                            className: "block text-dark-700 dark:text-dark-200 text-[13px] " +
                                       "transition-all duration-250 ease-out " +
                                       "hover:text-primary hover:translate-x-1.5 " +
                                       "py-2 font-medium"
                        }, item.label)
                    );
                })
            )
        )
    );
};

export { FooterLinks };
