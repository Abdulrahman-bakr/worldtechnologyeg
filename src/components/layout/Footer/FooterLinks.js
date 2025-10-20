

import React from 'react';

const FooterLinks = ({ onNavigate }) => {
    const handleNav = (e, action, params = {}) => {
        e.preventDefault();
        onNavigate(action, params);
    };

    return (
        React.createElement("div", null,
            React.createElement("h4", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4" }, "روابط سريعة"),
            React.createElement("ul", { className: "space-y-2.5" },
                React.createElement("li", null, React.createElement("a", { href: "#", onClick: (e) => handleNav(e, 'navigateToHome'), className: "text-dark-700 dark:text-dark-100 hover:text-primary transition-colors text-sm" }, "الرئيسية")),
                React.createElement("li", null, React.createElement("a", { href: "#", onClick: (e) => handleNav(e, 'navigateToAllCategories'), className: "text-dark-700 dark:text-dark-100 hover:text-primary transition-colors text-sm" }, "جميع الفئات")),
                React.createElement("li", null, React.createElement("a", { href: "#", onClick: (e) => handleNav(e, 'navigateToOrdersHistory'), className: "text-dark-700 dark:text-dark-100 hover:text-primary transition-colors text-sm" }, "طلباتي")),
                React.createElement("li", null, React.createElement("a", { href: "#", onClick: (e) => handleNav(e, 'navigateToOrderTracking'), className: "text-dark-700 dark:text-dark-100 hover:text-primary transition-colors text-sm" }, "تتبع طلبك")),
                React.createElement("li", null, React.createElement("a", { href: "#", onClick: (e) => handleNav(e, 'navigateToTerms'), className: "text-dark-700 dark:text-dark-100 hover:text-primary transition-colors text-sm" }, "الشروط والأحكام")),
                React.createElement("li", null, React.createElement("a", { href: "#", onClick: (e) => handleNav(e, 'navigateToFAQ'), className: "text-dark-700 dark:text-dark-100 hover:text-primary transition-colors text-sm" }, "الأسئلة الشائعة")),
                React.createElement("li", null, React.createElement("a", { href: "#", onClick: (e) => handleNav(e, 'navigateToAboutUs'), className: "text-dark-700 dark:text-dark-100 hover:text-primary transition-colors text-sm" }, "من نحن")),
                React.createElement("li", null, React.createElement("a", { href: "#", onClick: (e) => handleNav(e, 'navigateToUserProfile'), className: "text-dark-700 dark:text-dark-100 hover:text-primary transition-colors text-sm" }, "حسابي"))
            )
        )
    );
};

export { FooterLinks };