import React from 'react';
import { getDiscountPercentage, formatPrice } from '../../../../utils/productUtils.js';

const PriceDisplay = ({ product }) => {
    const discountPercentage = getDiscountPercentage(product.price, product.discountPrice);
    
    return (
        React.createElement("div", { className: "pt-2" },
            product.discountPrice ? (
                React.createElement("div", { className: "flex items-baseline space-x-3 space-x-reverse" },
                    React.createElement("p", { className: "text-3xl sm:text-4xl font-bold text-primary tabular-nums" },
                        `${formatPrice(product.discountPrice)} ج.م`
                    ),
                    React.createElement("p", { className: "text-xl text-dark-600 dark:text-dark-300 line-through tabular-nums" },
                        `${formatPrice(product.price)} ج.م`
                    ),
                    discountPercentage > 0 && (
                         React.createElement("span", { className: "bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full animate-badge-pulse" },
                            `خصم ${discountPercentage}%`
                         )
                    )
                )
            ) : (
                React.createElement("p", { className: "text-3xl sm:text-4xl font-bold text-primary tabular-nums" },
                    `${formatPrice(product.price)} ج.م`
                )
            )
        )
    );
};
export { PriceDisplay };
