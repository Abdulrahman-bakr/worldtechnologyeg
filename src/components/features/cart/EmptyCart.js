

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon } from '../../icons/index.js';
import { getImageUrl } from '../../../utils/imageUrl.js';
import { formatPrice } from '../../../utils/productUtils.js';

const EmptyCart = ({ onClose, recentlyViewedProducts, onViewDetails }) => {
    const navigate = useNavigate();
    const hasRecentlyViewed = recentlyViewedProducts && recentlyViewedProducts.length > 0;

    const handleViewProduct = (product) => {
        if (onViewDetails) {
            onViewDetails(product);
        }
        onClose();
    };

    const handleShopNow = () => {
        navigate('/products');
        onClose();
    };

    return React.createElement("div", { className: "flex-grow flex flex-col p-6" },
        React.createElement("div", { className: "text-center" },
            React.createElement(ShoppingCartIcon, { className: "w-16 h-16 text-dark-500 dark:text-dark-400 mx-auto mb-4" }),
            React.createElement("p", { className: "text-xl text-dark-600 dark:text-dark-300 mb-6" }, "سلتك فارغة حالياً."),
            React.createElement("button", {
                onClick: handleShopNow,
                className: "bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            }, "ابدأ التسوق")
        ),
        hasRecentlyViewed && React.createElement("div", { className: "mt-10 pt-6 border-t border-light-300 dark:border-dark-600" },
            React.createElement("h3", { className: "text-lg font-semibold text-dark-800 dark:text-dark-100 mb-4" }, "منتجات شوهدت مؤخراً"),
            React.createElement("div", { className: "featured-products-scrollable flex overflow-x-auto py-2 -mx-2 px-2 space-x-4 space-x-reverse rounded" },
                recentlyViewedProducts.map(product => (
                    React.createElement("div", {
                        key: product.id,
                        onClick: () => handleViewProduct(product),
                        className: "flex-shrink-0 w-32 cursor-pointer group"
                    },
                        React.createElement("div", { className: "bg-light-100 dark:bg-dark-700 rounded-lg overflow-hidden p-2" },
                            React.createElement("img", {
                                src: getImageUrl(product.imageUrl),
                                alt: product.arabicName,
                                className: "w-full h-24 object-contain"
                            })
                        ),
                        React.createElement("p", { className: "mt-2 text-sm font-medium text-dark-800 dark:text-dark-100 truncate group-hover:text-primary" }, product.arabicName),
                        React.createElement("p", { className: "text-xs text-primary font-semibold" }, `${formatPrice(product.discountPrice || product.price)} ج.م`)
                    )
                ))
            )
        )
    );
};

export { EmptyCart };