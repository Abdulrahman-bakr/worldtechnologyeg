import React from 'react';

export const ProductStatusBadge = ({ product, mode }) => {
    if (mode === 'corner') {
        let discountPercentage = 0;
        if (product.discountPrice && product.price > product.discountPrice && !product.isDynamicElectronicPayments) {
            discountPercentage = Math.round(((product.price - product.discountPrice) / product.price) * 100);
        }
        
        if (discountPercentage > 0) {
            return React.createElement("span", { className: "absolute top-2.5 left-2.5 bg-gradient-to-br from-red-500 to-red-700 text-white text-xs sm:text-sm font-bold px-2.5 py-1.5 rounded-full shadow-lg animate-badge-pulse z-[20]" },
                `خصم ${discountPercentage}%`
            );
        }
        if (product.isNew) {
            return React.createElement("span", { className: "absolute top-2.5 left-2.5 bg-secondary text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md z-[20]" }, "جديد");
        }
        return null;
    }

    if (mode === 'text') {
        const stockStatusText = product.isDynamicElectronicPayments ? "خدمة متاحة" : (product.stock > 0 ? "متوفر" : "نفذ المخزون");
        const stockStatusColor = product.isDynamicElectronicPayments ? "text-blue-600 dark:text-blue-400" : (product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400");
        return React.createElement("p", { className: `text-sm font-semibold mb-1 ${stockStatusColor}` }, stockStatusText);
    }
    
    return null;
};