import React from 'react';
import { StarIcon } from '../../icons/index.js';

export const ProductPriceSection = ({ product }) => {
    const isDynamicService = product.isDynamicElectronicPayments;
    const pointsToEarn = !isDynamicService ? Math.floor(product.discountPrice || product.price || 0) : 0;

    return React.createElement("div", { className: "mb-3.5 mt-auto" },
        isDynamicService ? (
            React.createElement("p", { className: "text-md sm:text-lg font-semibold text-primary" }, "خدمة حسب الطلب")
        ) : product.discountPrice ? (
            React.createElement("div", { className: "flex items-baseline space-x-2 space-x-reverse" },
                React.createElement("p", { className: "text-lg sm:text-xl font-bold text-primary" }, `${product.discountPrice.toFixed(2)} ج.م`),
                React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300 line-through" }, `${(product.price || 0).toFixed(2)} ج.م`)
            )
        ) : (
            React.createElement("p", { className: "text-lg sm:text-xl font-bold text-primary" }, `${(product.price || 0).toFixed(2)} ج.م`)
        ),
        pointsToEarn > 0 && (
            React.createElement("div", { className: "mt-2 flex items-center gap-1.5 text-xs text-yellow-600 dark:text-yellow-400 font-medium" },
                React.createElement(StarIcon, { filled: true, className: "w-3.5 h-3.5" }),
                React.createElement("span", null, `ستربح ${pointsToEarn} نقطة`)
            )
        )
    );
};