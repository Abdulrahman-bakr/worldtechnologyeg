import React from 'react';
import { getImageUrl } from '../../../../utils/imageUrl.js';
import { formatPrice } from '../../../../utils/productUtils.js';

const StickyBar = ({ product, selectedVariant, handleActionClick }) => {
    const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
    
    return (
        React.createElement("div", { className: "sticky-add-to-cart-bar" },
            React.createElement("div", { className: "flex items-center justify-between gap-4 w-full" },
                React.createElement("div", { className: "flex items-center gap-3 overflow-hidden" },
                    React.createElement("img", { src: getImageUrl(selectedVariant?.imageUrl || product.imageUrl), alt: product.arabicName, className: "w-10 h-10 object-contain rounded-md flex-shrink-0" }),
                    React.createElement("div", { className: "flex-grow" },
                        React.createElement("p", { className: "text-sm font-semibold text-dark-900 dark:text-dark-50 truncate" }, product.arabicName),
                        product.discountPrice ? (
                            React.createElement("div", { className: "flex items-baseline space-x-1 space-x-reverse" },
                                React.createElement("p", { className: "text-sm font-bold text-primary tabular-nums" }, `${formatPrice(product.discountPrice)} ج.م`),
                                React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300 line-through tabular-nums" }, `${formatPrice(product.price)} ج.م`)
                            )
                        ) : (
                            React.createElement("p", { className: "text-sm font-bold text-primary tabular-nums" }, `${formatPrice(product.price)} ج.م`)
                        )
                    )
                ),
                React.createElement("button", {
                    onClick: handleActionClick,
                    disabled: currentStock === 0,
                    className: "bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors flex-shrink-0 disabled:opacity-50 disabled:bg-dark-500"
                },
                    currentStock === 0 ? "نفذ المخزون" : (product.allowDirectPurchase ? "شراء الآن" : "أضف إلى السلة")
                )
            )
        )
    );
};
export { StickyBar };
