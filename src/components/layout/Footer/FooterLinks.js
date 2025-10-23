import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../contexts/AppContext.js';

const FooterLinks = () => {
    const { currentUser } = useApp();

    const links = [
        { label: "الرئيسية", to: '/' },
        { label: "جميع الفئات", to: '/products' },
        { label: "طلباتي", to: '/orders', requiresLogin: true },
        { label: "تتبع طلبك", to: '/track-order' },
        { label: "النسخ الصوتي", to: '/transcribe' },
        { label: "الشروط والأحكام", to: '/terms' },
        { label: "الأسئلة الشائعة", to: '/faq' },
        { label: "من نحن", to: '/about-us' },
        { label: "حسابي", to: '/profile', requiresLogin: true }
    ];

    return (
        React.createElement("div", null,
            React.createElement("h4", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4" }, "روابط سريعة"),
            React.createElement("ul", { className: "space-y-2.5" },
                links.map((item) => {
                    if (item.requiresLogin && !currentUser) return null;
                    return React.createElement("li", { key: item.to },
                        React.createElement(Link, {
                            to: item.to,
                            className:
                                "block text-dark-700 dark:text-dark-100 text-sm rounded-md transition-all duration-200 " +
                                "hover:text-primary hover:bg-light-200/60 dark:hover:bg-dark-700/50 px-2 py-1"
                        }, item.label)
                    )
                })
            )
        )
    );
};

export { FooterLinks };