import React from 'react';

const QuickNavLink = ({ targetId, children, onNavClick, isActive }) => {
    const handleClick = (e) => {
        e.preventDefault();
        onNavClick(targetId);
    };
    return (
        React.createElement("a", {
            href: `#${targetId}`,
            onClick: handleClick,
            className: `quick-nav-link px-3 py-2 text-sm font-medium text-dark-700 dark:text-dark-200 rounded-md hover:bg-light-100 dark:hover:bg-dark-700 hover:text-primary transition-colors ${isActive ? 'quick-nav-link-active' : ''}`
        }, children)
    );
};

export { QuickNavLink };
