import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CATEGORIES, ProductCategory } from '../../../constants/index.js';

export const NavLinks = ({ navLinks, currentUser }) => {
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

    const allProductsLink = navLinks.find(link => link.to === '/products');

    const linkClassName = ({ isActive }) => 
        `transition-colors duration-200 text-sm lg:text-base font-medium flex items-center gap-1 px-2 py-1 rounded-md ${
            isActive
                ? 'text-primary dark:text-primary font-semibold'
                : 'text-dark-800 dark:text-dark-100 hover:text-primary dark:hover:text-primary hover:bg-light-100 dark:hover:bg-dark-700/60'
        }`;

    return (
        <nav
            className="hidden md:flex items-center gap-x-4 lg:gap-x-7"
            aria-label="Main navigation"
        >
            {navLinks.map((link) => {
                if (link.requiresLogin && !currentUser) {
                    return null;
                }
                if (link === allProductsLink) {
                    return (
                        <div
                            key={link.name}
                            className="relative"
                            onMouseEnter={() => setIsMegaMenuOpen(true)}
                            onMouseLeave={() => setIsMegaMenuOpen(false)}
                        >
                            <NavLink
                                to={link.to}
                                className={linkClassName}
                            >
                                {link.name}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className={`w-4 h-4 transition-transform ${
                                        isMegaMenuOpen ? 'rotate-180' : ''
                                    }`}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </NavLink>

                            {isMegaMenuOpen && (
                                <div
                                    className="absolute top-full right-0 mt-2 w-80 bg-white/95 dark:bg-dark-800/95 
                                               rounded-xl shadow-xl border border-light-200 dark:border-dark-700 
                                               z-50 p-4 grid grid-cols-2 gap-x-4 gap-y-3 backdrop-blur-md animate-fade-in-up"
                                >
                                    {CATEGORIES.filter(
                                        c => c.id !== ProductCategory.All
                                    ).map((category) => (
                                        <NavLink
                                            key={category.id}
                                            to={`/category/${category.id}`}
                                            onClick={() => setIsMegaMenuOpen(false)}
                                            className="text-sm text-dark-700 dark:text-dark-200 hover:text-primary dark:hover:text-primary 
                                                       transition-colors p-1.5 rounded-md hover:bg-light-100 dark:hover:bg-dark-700/70"
                                        >
                                            {category.arabicName}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <NavLink
                        key={link.name}
                        to={link.to}
                        className={linkClassName}
                    >
                        {link.name}
                    </NavLink>
                );
            })}
        </nav>
    );
};