import React from 'react';
import { StarRating } from '../../../ui/feedback/StarRating.js';

const ProductInfo = ({ product, isLoadingReviewStats, liveRating, liveReviewCount, setIsReviewsAccordionOpen }) => {
    return (
        React.createElement(React.Fragment, null,
            React.createElement("h1", { className: "text-3xl sm:text-4xl font-bold text-dark-900 dark:text-dark-50" }, product.arabicName),
            product.brand && React.createElement("p", { className: "text-md text-dark-700 dark:text-dark-300" }, `العلامة التجارية: ${product.brand}`),
            React.createElement("div", { className: "flex items-center space-x-4 space-x-reverse" },
                isLoadingReviewStats ? (
                    React.createElement("span", { className: "text-sm text-dark-600 dark:text-dark-300" }, "جاري تحميل التقييم...")
                ) : (
                    React.createElement(React.Fragment, null,
                        React.createElement(StarRating, { rating: liveRating, className: "text-xl", showHalfStars: true }),
                        liveReviewCount > 0 && (
                            React.createElement("button", {
                                onClick: () => {
                                    const el = document.getElementById('reviews-accordion');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    setIsReviewsAccordionOpen(true);
                                },
                                className: "text-dark-600 dark:text-dark-300 tabular-nums hover:text-primary"
                            }, `(${liveReviewCount} مراجعات)`)
                        )
                    )
                )
            )
        )
    );
};

export { ProductInfo };
