import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../contexts/AppContext.js';
import { CloseIcon, ShoppingCartIcon } from '../../icons/index.js';
import { getImageUrl } from '../../../utils/imageUrl.js';
import { formatPrice } from '../../../utils/productUtils.js';

const ComparisonModal = ({ isOpen, onClose }) => {
    const { comparisonProducts, handleAddToCart } = useApp();
    const [isRendered, setIsRendered] = useState(isOpen);
    const [contentAnimation, setContentAnimation] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => {
                setContentAnimation('');
            });
        } else if (isRendered) {
            document.body.style.overflow = '';
            setContentAnimation('');
            const timer = setTimeout(() => setIsRendered(false), 300);
            return () => clearTimeout(timer);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, isRendered]);

    const allSpecKeys = useMemo(() => {
        const keys = new Set();
        comparisonProducts.forEach(p => {
            if (p.specifications) {
                Object.keys(p.specifications).forEach(key => keys.add(key));
            }
        });
        return Array.from(keys).sort();
    }, [comparisonProducts]);

    if (!isRendered) return null;

    return (
        React.createElement("div", {
            className: `fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4`,
            role: "dialog", "aria-modal": "true"
        },
        React.createElement("div", { className: `modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`, onClick: onClose }),
        React.createElement("div", { className: `modal-content comparison-modal-content bg-white dark:bg-dark-800 rounded-xl shadow-2xl w-full max-w-4xl relative ${contentAnimation} border border-light-200 dark:border-dark-700 flex flex-col` },
            React.createElement("div", { className: "flex items-center justify-between p-4 border-b border-light-300 dark:border-dark-600 flex-shrink-0" },
                React.createElement("h2", { className: "text-lg font-bold text-primary" }, "مقارنة المنتجات"),
                React.createElement("button", { onClick: onClose, className: "p-1.5 rounded-full hover:bg-light-100 dark:hover:bg-dark-700", "aria-label": "إغلاق" },
                  React.createElement(CloseIcon, { className: "w-5 h-5" })
                )
            ),
            React.createElement("div", { className: "flex-grow overflow-auto" },
                React.createElement("table", { className: "w-full min-w-[600px] text-sm text-left text-dark-800 dark:text-dark-100" },
                    React.createElement("thead", { className: "text-xs uppercase bg-light-100 dark:bg-dark-700 sticky top-0" },
                        React.createElement("tr", null,
                            React.createElement("th", { scope: "col", className: "px-6 py-3" }, "المواصفات"),
                            comparisonProducts.map(p => (
                                React.createElement("th", { key: p.id, scope: "col", className: "px-6 py-3 text-center" },
                                    React.createElement("img", { src: getImageUrl(p.imageUrl), alt: p.arabicName, className: "w-20 h-20 object-contain mx-auto mb-2", loading: "lazy" }),
                                    React.createElement("p", { className: "font-semibold" }, p.arabicName),
                                    React.createElement("p", { className: "font-bold text-primary" }, `${formatPrice(p.discountPrice || p.price)} ج.م`),
                                    React.createElement("button", { 
                                        onClick: () => handleAddToCart(p, null),
                                        className: "mt-2 bg-primary text-white px-3 py-1 text-xs rounded-md flex items-center gap-1 mx-auto"
                                    }, React.createElement(ShoppingCartIcon, { className: "w-4 h-4" }), "أضف للسلة")
                                )
                            ))
                        )
                    ),
                    React.createElement("tbody", null,
                        allSpecKeys.map((key, index) => (
                            React.createElement("tr", { key: key, className: `${index % 2 === 0 ? 'bg-white dark:bg-dark-800' : 'bg-light-50 dark:bg-dark-700/50'} border-b dark:border-dark-600` },
                                React.createElement("th", { scope: "row", className: "px-6 py-4 font-medium whitespace-nowrap" }, key),
                                comparisonProducts.map(p => (
                                    React.createElement("td", { key: p.id, className: "px-6 py-4 text-center" },
                                        p.specifications?.[key] || '—'
                                    )
                                ))
                            )
                        ))
                    )
                )
            )
        )
    ));
};

export { ComparisonModal };