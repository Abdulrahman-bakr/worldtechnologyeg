
import React from 'react';

const ProductListItemSkeleton = () => {
    return React.createElement("div", { 
        className: "bg-white dark:bg-dark-800 rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row border border-light-200 dark:border-dark-700", 
        "aria-hidden": "true" 
      },
        React.createElement("div", { className: "skeleton-image w-full sm:w-1/3 md:w-1/4 h-48 sm:h-auto" }),
        React.createElement("div", { className: "p-5 flex flex-col flex-grow justify-between" },
            React.createElement("div", null,
                React.createElement("div", { className: "skeleton-text w-3/4 h-6 mb-3" }), 
                React.createElement("div", { className: "skeleton-text w-1/2 h-4 mb-2" }), 
                React.createElement("div", { className: "skeleton-text w-full h-4 mb-1" }), 
                React.createElement("div", { className: "skeleton-text w-5/6 h-4 mb-4" })  
            ),
            React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4" },
                React.createElement("div", { className: "skeleton-text w-1/3 h-8 mb-3 sm:mb-0" }), 
                React.createElement("div", { className: "skeleton-text w-full sm:w-auto h-10 rounded-lg px-6" }) 
            )
        )
    );
};
export { ProductListItemSkeleton };
