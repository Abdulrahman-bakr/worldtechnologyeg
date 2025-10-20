import React from 'react';

// --- START OF StaticPageView.tsx ---
const StaticPageView = ({ title, onBack, children, icon: PageIcon }) => {
    return React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-32 min-h-[calc(100vh-16rem)]" },
        React.createElement("button", {
            onClick: onBack,
            className: "mb-8 text-primary hover:text-primary-hover font-semibold flex items-center space-x-2 space-x-reverse transition-colors"
        },
            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5 transform rtl:rotate-180" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" })
            ),
            React.createElement("span", null, "العودة")
        ),
        React.createElement("div", { className: "flex flex-col items-center text-center mb-6 sm:mb-8" },
            PageIcon && React.createElement(PageIcon, { className: "w-12 h-12 sm:w-16 sm:h-16 text-primary mb-3" }),
            React.createElement("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-900 dark:text-dark-50" }, title)
        ),
        React.createElement("div", { className: "bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 sm:p-8" },
            React.createElement("article", { className: "prose prose-sm sm:prose-base lg:prose-lg max-w-none leading-relaxed text-dark-900 dark:text-dark-50 dark:prose-invert" }, 
                children
            )
        )
    );
};
// --- END OF StaticPageView.tsx ---
export { StaticPageView };