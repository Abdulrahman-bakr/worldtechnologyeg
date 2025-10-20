
import React from 'react';

export const Logo = ({ onNavLinkClick, isScrolled, mobileMenuOpen }) => {
    return (
        React.createElement("a", {
            href: "#home",
            onClick: (e) => onNavLinkClick(e, { action: 'navigateToHome' }),
            className: `font-bold text-primary ${(isScrolled || mobileMenuOpen) ? '' : 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]'}`
        }, React.createElement("div", { className: "flex flex-col items-center sm:flex-row-reverse sm:gap-1.5 text-xl sm:text-3xl leading-tight sm:leading-normal" },
            React.createElement("span", null, "World"),
            React.createElement("span", null, "Technology")
        ))
    );
};