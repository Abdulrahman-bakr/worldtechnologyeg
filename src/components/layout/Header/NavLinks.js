import React from 'react';

export const NavLinks = ({ navLinks, handleNavLinkClick, isLinkActive }) => {
    return (
        React.createElement("nav", { className: "hidden md:flex items-center gap-x-4 lg:gap-x-7", "aria-label": "Main navigation" },
            navLinks.map((link) =>
                React.createElement("a", {
                    key: link.name,
                    href: '#',
                    onClick: (e) => handleNavLinkClick(e, link),
                    className: `transition-colors duration-200 text-sm lg:text-base font-medium 
                    ${isLinkActive(link)
                            ? 'text-primary dark:text-primary font-semibold'
                            : 'text-dark-800 dark:text-dark-100 hover:text-primary dark:hover:text-primary'}`
                }, link.name)
            )
        )
    );
};
