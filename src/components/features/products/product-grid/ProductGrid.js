

import React from 'react';
import { ProductList } from './ProductList.js';

export const ProductGrid = ({
    products, 
    onAddToCart, 
    viewMode, 
    isLoading, 
    onToggleWishlist, 
    wishlistItems,
    currentUser, 
    onLoginRequest, 
    onInitiateDirectCheckout,
    searchTerm
}) => {
    return React.createElement(ProductList, {
        products,
        viewMode,
        isLoading,
        searchTerm,
        onAddToCart,
        onToggleWishlist,
        wishlistItems,
        currentUser,
        onLoginRequest,
        onInitiateDirectCheckout
    });
};