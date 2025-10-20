

import React from 'react';
import { ProductDetailView as ProductDetailOrchestrator } from '../components/features/products/product-detail/ProductDetailView.js';

// This component acts as a bridge for the router.
// All the logic and UI is now in the new orchestrator component.
const ProductDetailView = (props) => {
    if (!props.product) {
        // Render a placeholder or error if the product isn't ready,
        // mirroring the logic in the main component.
        return React.createElement("div", {className: "container mx-auto px-4 py-12 pt-24 sm:pt-32 text-center bg-light-50 dark:bg-dark-900 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center"}, 
            React.createElement("svg", { xmlns:"http://www.w3.org/2000/svg", fill:"none", viewBox:"0 0 24 24", strokeWidth:"1.5", stroke:"currentColor", className:"w-16 h-16 text-red-400 mb-4"}, React.createElement("path", {strokeLinecap:"round", strokeLinejoin:"round", d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"})),
            React.createElement("h2", {className: "text-2xl font-semibold text-red-500 mb-3"}, "عفواً، المنتج غير متوفر"),
            React.createElement("p", {className: "text-md text-dark-700 dark:text-dark-100 mb-6"}, "قد يكون المنتج الذي تبحث عنه قد تم إزالته أو أن الرابط غير صحيح."),
            React.createElement("button", {
                onClick: props.onBack,
                className: "mt-4 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-8 rounded-lg transition-colors"
            }, "العودة إلى الصفحة السابقة")
        );
    }
    return React.createElement(ProductDetailOrchestrator, { ...props });
};

export { ProductDetailView };