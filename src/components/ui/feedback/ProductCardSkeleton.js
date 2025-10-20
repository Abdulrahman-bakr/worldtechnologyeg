
import React from 'react';

const ProductCardSkeleton = () => {
    return React.createElement("div", { className: "skeleton-card", "aria-hidden": "true" },
        React.createElement("div", { className: "skeleton-image" }),
        React.createElement("div", { className: "p-4" },
            React.createElement("div", { className: "skeleton-text w-3/4 mb-2" }),
            React.createElement("div", { className: "skeleton-text w-1/2 mb-4" }),
            React.createElement("div", { className: "skeleton-text w-1/3" })
        )
    );
};
export { ProductCardSkeleton };
