

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { GridViewIcon, HeartIcon, UserIcon } from '../icons/index.js';
import { HomeIcon } from '../icons/navigation/HomeIcon.js';

// أيقونة تسجيل الدخول الجديدة
const LogInIcon = ({ className, size = 24, style, ...restProps }) => {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    viewBox: "0 0 512 512",
    width: size,
    height: size,
    className: className,
    style: style,
    ...restProps
  },
    React.createElement("g", null,
      React.createElement("g", { "data-name": "ARROW 48" },
        React.createElement("path", {
          d: "M400.14.16H181.35a82 82 0 0 0-81.9 81.9v50.54a24 24 0 1 0 48 0V82.06a33.94 33.94 0 0 1 33.9-33.9h218.79A33.93 33.93 0 0 1 434 82.06v347.88a33.93 33.93 0 0 1-33.89 33.9H181.35a33.94 33.94 0 0 1-33.9-33.9v-58.47a24 24 0 0 0-48 0v58.47a82 82 0 0 0 81.9 81.9h218.79a82 82 0 0 0 81.86-81.9V82.06A82 82 0 0 0 400.14.16z",
          fill: "currentColor",
          opacity: "1"
        }),
        React.createElement("path", {
          d: "m364.64 238.53-85.4-85.35a24 24 0 0 0-33.61-.33c-9.7 9.33-9.47 25.13.05 34.65l44.47 44.5H54a24 24 0 0 0-24 24 24 24 0 0 0 24 24h236.16l-44.9 44.9a24 24 0 0 0 33.94 33.95l85.44-85.41a24.66 24.66 0 0 0 0-34.91z",
          fill: "currentColor",
          opacity: "1"
        })
      )
    )
  );
};


const navItems = [
    { to: "/", label: "الرئيسية", icon: HomeIcon },
    { to: "/products", label: "المنتجات", icon: GridViewIcon },
    { to: "/wishlist", label: "المفضلة", icon: HeartIcon, requiresLogin: true },
    { to: "/profile", label: "حسابي", icon: UserIcon, requiresLogin: true }
];

const BottomNavBar = ({ currentUser, onLoginClick }) => {
    const navigate = useNavigate();
    
    const navLinkClass = ({ isActive }) =>
        `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ${
            isActive ? 'text-primary' : 'text-dark-600 dark:text-dark-300 hover:text-primary'
        }`;

    return (
        React.createElement("nav", {
            className: "fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm border-t border-light-200 dark:border-dark-700 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 md:hidden"
        },
            React.createElement("div", { className: "flex justify-around items-center h-full" },
                navItems.map(item => {
                    const requiresLogin = item.requiresLogin;
                    
                    if (requiresLogin && !currentUser) {
                        const isProfile = item.to === '/profile';
                        const label = isProfile ? 'تسجيل الدخول' : item.label;
                        const IconComponent = isProfile ? LogInIcon : item.icon;
                        const iconClassName = `w-6 h-6`;
                        
                        return React.createElement("button", {
                            key: item.to,
                            onClick: onLoginClick,
                            className: "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 text-dark-600 dark:text-dark-300 hover:text-primary"
                        },
                            React.createElement(IconComponent, { className: iconClassName }),
                            React.createElement("span", { className: "text-xs font-medium" }, label)
                        );
                    }
                    
                    return React.createElement(NavLink, {
                        key: item.to,
                        to: item.to,
                        end: item.to === "/",
                        className: navLinkClass
                    },
                        React.createElement(item.icon, { className: "w-6 h-6" }),
                        React.createElement("span", { className: "text-xs font-medium" }, item.label)
                    )
                })
            )
        )
    );
};

export { BottomNavBar };