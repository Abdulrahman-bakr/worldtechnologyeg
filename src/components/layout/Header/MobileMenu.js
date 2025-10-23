

import React from 'react';
import { NavLink } from 'react-router-dom';
import { SearchIcon } from '../../icons/index.js';

export const MobileMenu = ({ 
    handleSearchFormSubmit, 
    searchTerm, 
    onSearchTermChange, 
    navLinks, 
    currentUser 
}) => {
    const linkClasses = ({ isActive }) => 
        `block px-3 py-2 rounded-md font-medium text-base transition-colors ${
            isActive
            ? 'bg-primary/10 text-primary'
            : 'text-dark-800 dark:text-dark-100 hover:bg-primary/10 hover:text-primary'
        }`;

    return (
        React.createElement("div", { className: "md:hidden pt-2 pb-4 border-t border-light-200/50 dark:border-dark-700/50 mobile-menu-bg" },
            React.createElement("nav", { className: "flex flex-col space-y-2 px-2" },
                React.createElement("form", { onSubmit: handleSearchFormSubmit, className: "relative mb-2", role: "search" },
                    React.createElement("input", {
                        type: "search",
                        placeholder: "ابحث...",
                        value: searchTerm,
                        onChange: (e) => onSearchTermChange(e.target.value),
                        className: "w-full py-2 px-4 pr-10 rounded-lg border border-light-300 dark:border-dark-600 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm text-dark-800 dark:text-dark-50 placeholder-dark-500 dark:placeholder-dark-400 bg-white/80 dark:bg-dark-700/80"
                    }),
                    React.createElement("button", { type: "submit", className: "absolute right-0 top-0 bottom-0 px-3 text-dark-600 dark:text-dark-300", "aria-label": "Search" },
                        React.createElement(SearchIcon, { className: "w-5 h-5" })
                    )
                ),
                navLinks.map((link) => {
                    if (link.requiresLogin && !currentUser) return null;
                    return React.createElement(NavLink, {
                        key: link.name,
                        to: link.to,
                        className: linkClasses
                    }, link.name);
                }),
                currentUser && React.createElement(NavLink, {
                    to: "/orders",
                    className: linkClasses
                }, "طلباتي")
            )
        )
    );
};