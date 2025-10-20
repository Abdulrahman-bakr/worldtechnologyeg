

import React from 'react';
import { ReviewSection } from '../../reviews/index.js';

const ReviewsAccordion = ({ product, isReviewsAccordionOpen, setIsReviewsAccordionOpen, sectionsRef, currentUser, onPendingReviewLogin }) => {
    return (
        React.createElement("div", { id: "reviews-accordion", ref: el => sectionsRef.current.reviews = el, "data-section": "reviews", className: "mt-6 bg-white dark:bg-dark-800 rounded-lg shadow-md border border-light-200 dark:border-dark-700 scroll-mt-24" },
            React.createElement("button", {
                id: "reviews-accordion-header",
                "aria-expanded": isReviewsAccordionOpen,
                "aria-controls": "reviews-accordion-content",
                onClick: () => setIsReviewsAccordionOpen(!isReviewsAccordionOpen),
                className: "reviews-accordion-header w-full flex justify-between items-center p-4 sm:p-6 text-xl font-semibold text-dark-900 dark:text-dark-50"
            },
                "الآراء والتقييمات",
                React.createElement("svg", { "aria-hidden": "true", className: "w-6 h-6 reviews-accordion-arrow", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 8.25l-7.5 7.5-7.5-7.5" })
                )
            ),
            isReviewsAccordionOpen &&
                React.createElement("div", { id: "reviews-accordion-content", className: "p-4 sm:p-6 border-t border-light-200 dark:border-dark-700" },
                    React.createElement(ReviewSection, {
                        productId: product.id,
                        currentUser: currentUser,
                        onPendingReviewLogin: () => onPendingReviewLogin(product.id)
                    })
                )
        )
    );
};
export { ReviewsAccordion };