import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCartIcon, CloseIcon } from '../../icons/index.js';

const MiniCartPopover = ({
    isVisible,
    cartItems,
    cartTotalPrice,
    onClose,
    onViewFullCart,
    onNavigateToAllProducts,
    triggerRef
}) => {
    const popoverRef = useRef(null);
    const [isRendered, setIsRendered] = useState(isVisible);
    const [miniCartPage, setMiniCartPage] = useState(0);

    const itemsPerPage = 2;

    const chevronLeftPath = "M15.75 19.5L8.25 12l7.5-7.5"; 
    const chevronRightPath = "M8.25 4.5l7.5 7.5-7.5 7.5";   

    useEffect(() => {
        if (isVisible) {
            setIsRendered(true);
        } else if (isRendered) {
            const timer = setTimeout(() => setIsRendered(false), 300); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [isVisible, isRendered]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                onClose();
            }
        };
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isVisible, onClose, triggerRef]);
    
    useEffect(() => {
        const newTotalPages = Math.ceil(cartItems.length / itemsPerPage);
        if (cartItems.length === 0) {
            setMiniCartPage(0);
        } else if (miniCartPage >= newTotalPages && newTotalPages > 0) {
            setMiniCartPage(newTotalPages - 1);
        } else if (miniCartPage < 0 && newTotalPages > 0) {
            setMiniCartPage(0);
        }
    }, [cartItems, miniCartPage, itemsPerPage]);


    if (!isRendered) return null;

    const startIndex = miniCartPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedItems = cartItems.slice(startIndex, endIndex);
    const totalPages = Math.ceil(cartItems.length / itemsPerPage);

    return React.createElement("div", {
        ref: popoverRef,
        className: `absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[180px] sm:w-80 max-w-[90vw] bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-light-200 dark:border-dark-700 z-40 transform transition-all duration-300 ease-out origin-top ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "mini-cart-title"
    },
        React.createElement("div", { className: "flex items-center justify-between p-3 border-b border-light-300 dark:border-dark-600" },
            React.createElement("h3", { id: "mini-cart-title", className: "text-md font-semibold text-primary" }, "سلة التسوق"),
            React.createElement("button", { onClick: onClose, "aria-label": "إغلاق", className: "p-1 text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-dark-50" },
                React.createElement(CloseIcon, { className: "w-5 h-5" })
            )
        ),
        cartItems.length === 0 ? (
            React.createElement("div", { className: "p-6 text-center" },
                React.createElement(ShoppingCartIcon, { className: "w-12 h-12 text-dark-500 dark:text-dark-400 mx-auto mb-3" }),
                React.createElement("p", { className: "text-dark-700 dark:text-dark-200 mb-4" }, "سلتك فارغة حالياً."),
                React.createElement("button", {
                    onClick: () => { onNavigateToAllProducts(); onClose(); },
                    className: "bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                }, "ابدأ التسوق")
            )
        ) : (
            React.createElement(React.Fragment, null,
                React.createElement("div", { className: "p-3 space-y-3 max-h-60 overflow-y-auto" }, 
                    displayedItems.map(item => {
                        const displayName = item.variant ? `${item.product.arabicName} (${item.variant.colorName})` : item.product.arabicName;
                        return React.createElement("div", { key: item.id, className: "flex items-center space-x-2 space-x-reverse" },
                            React.createElement("img", { 
                                src: item.variant?.imageUrl || (item.serviceDetails?.package?.imageUrl) || (item.serviceDetails?.operatorLogo) || item.product.imageUrl, 
                                alt: displayName, 
                                loading: "lazy",
                                className: "w-12 h-12 object-contain rounded flex-shrink-0 bg-white p-0.5" 
                            }),
                            React.createElement("div", { className: "flex-grow overflow-hidden" },
                                React.createElement("p", { className: "text-sm font-medium text-dark-800 dark:text-dark-100 truncate" }, displayName),
                                item.serviceDetails ? (
                                    React.createElement(React.Fragment, null,
                                        React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300 truncate" }, 
                                            `${item.serviceDetails.operatorName} - ${item.serviceDetails.phoneNumber}`
                                        ),
                                        React.createElement("p", { className: "text-xs text-primary font-semibold" }, 
                                            `تكلفة: ${item.serviceDetails.finalPrice.toFixed(2)} ج.م (شحن ${item.serviceDetails.topupAmount} ج.م)`
                                        )
                                    )
                                ) : (
                                    React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300" }, 
                                        `${item.quantity} × ${(item.product.discountPrice || item.product.price || 0).toFixed(2)} ج.م`
                                    )
                                )
                            )
                        );
                    })
                ),
                totalPages > 1 && React.createElement("div", { className: "flex items-center justify-between px-3 pt-2 pb-1 border-t border-light-200 dark:border-dark-600" },
                    React.createElement("button", { 
                        onClick: () => setMiniCartPage(prev => Math.max(0, prev - 1)),
                        disabled: miniCartPage === 0,
                        className: "p-1 text-primary disabled:text-dark-400 dark:disabled:text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed",
                        "aria-label": "الصفحة السابقة"
                    }, 
                        React.createElement("svg", {xmlns:"http://www.w3.org/2000/svg", fill:"none", viewBox:"0 0 24 24", strokeWidth:2, stroke:"currentColor", className:"w-5 h-5 transform rtl:rotate-180"}, React.createElement("path", {strokeLinecap:"round", strokeLinejoin:"round", d: chevronLeftPath }))
                    ),
                    React.createElement("span", { className: "text-xs text-dark-600 dark:text-dark-300 tabular-nums" }, 
                        `صفحة ${miniCartPage + 1} من ${totalPages}`
                    ),
                    React.createElement("button", { 
                        onClick: () => setMiniCartPage(prev => Math.min(totalPages - 1, prev + 1)),
                        disabled: miniCartPage >= totalPages - 1,
                        className: "p-1 text-primary disabled:text-dark-400 dark:disabled:text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed",
                        "aria-label": "الصفحة التالية"
                    }, 
                         React.createElement("svg", {xmlns:"http://www.w3.org/2000/svg", fill:"none", viewBox:"0 0 24 24", strokeWidth:2, stroke:"currentColor", className:"w-5 h-5 transform rtl:rotate-180"}, React.createElement("path", {strokeLinecap:"round", strokeLinejoin:"round", d: chevronRightPath }))
                    )
                ),
                React.createElement("div", { className: "p-3 border-t border-light-300 dark:border-dark-600" },
                    React.createElement("div", { className: "flex justify-between items-center mb-3" },
                        React.createElement("span", { className: "text-sm text-dark-700 dark:text-dark-200" }, "المجموع الفرعي:"),
                        React.createElement("span", { className: "text-md font-bold text-primary tabular-nums" }, `${cartTotalPrice.toFixed(2)} ج.م`)
                    ),
                    React.createElement("button", {
                        onClick: () => { onViewFullCart(); onClose(); },
                        className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                    }, "عرض السلة والدفع")
                )
            )
        )
    );
};

export { MiniCartPopover };