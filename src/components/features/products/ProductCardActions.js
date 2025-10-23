import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon } from '../../icons/index.js';

export const ProductCardActions = ({ product, onAddToCart }) => {
    const navigate = useNavigate();
    const { isDynamicElectronicPayments: isDynamicService } = product;
    
    const handleActionClick = () => {
        if (isDynamicService) {
            navigate(`/product/${product.id}`);
        } 
        else if (product.stock > 0) {
            onAddToCart(product, null);
        }
    };
    
    const actionButtonText = isDynamicService ? "اطلب الخدمة الآن" 
        : (product.stock > 0 ? "أضف للسلة" : "نفذ المخزون");


    return React.createElement(React.Fragment, null,
        React.createElement("button", {
            onClick: (e) => { e.stopPropagation(); handleActionClick(); },
            disabled: product.stock === 0 && !isDynamicService,
            className: `w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-3.5 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse text-sm mt-3 ${(product.stock === 0 && !isDynamicService) ? 'opacity-50 cursor-not-allowed bg-dark-500 hover:bg-dark-500' : ''}`,
            "aria-label": actionButtonText
        },
            React.createElement(ShoppingCartIcon, { className: "w-4 h-4" }),
            React.createElement("span", null, actionButtonText)
        )
    );
};