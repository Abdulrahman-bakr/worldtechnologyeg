
import React from 'react';
import { StarRating } from '../../ui/feedback/StarRating.js';

const RatingBar = ({ percentage, ratingLabel }) => (
    React.createElement("div", { className: "flex items-center gap-2" },
        React.createElement("span", { className: "text-sm font-medium text-dark-700 dark:text-dark-200 w-12" }, ratingLabel),
        React.createElement("div", { className: "w-full bg-light-200 dark:bg-dark-600 rounded-full h-2.5" },
            React.createElement("div", { className: "bg-yellow-400 h-2.5 rounded-full", style: { width: `${percentage}%` } })
        ),
        React.createElement("span", { className: "text-sm font-medium text-dark-700 dark:text-dark-200 w-10 text-right" }, `${Math.round(percentage)}%`)
    )
);

const ReviewSummary = ({ averageRating, totalReviews, ratingCounts, isLoading }) => {
    if (isLoading) {
        return React.createElement("div", { className: "animate-pulse space-y-2 p-4" },
            React.createElement("div", { className: "h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto" }),
            React.createElement("div", { className: "h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mx-auto" })
        );
    }
    
    if (totalReviews === 0) return null;

    const percentages = {
        5: totalReviews > 0 ? (ratingCounts[5] / totalReviews) * 100 : 0,
        4: totalReviews > 0 ? (ratingCounts[4] / totalReviews) * 100 : 0,
        3: totalReviews > 0 ? (ratingCounts[3] / totalReviews) * 100 : 0,
        2: totalReviews > 0 ? (ratingCounts[2] / totalReviews) * 100 : 0,
        1: totalReviews > 0 ? (ratingCounts[1] / totalReviews) * 100 : 0,
    };

    return React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 items-center" },
        React.createElement("div", { className: "flex flex-col items-center justify-center p-4" },
            React.createElement("p", { className: "text-5xl font-bold text-dark-900 dark:text-dark-50" }, averageRating.toFixed(1)),
            React.createElement(StarRating, { rating: averageRating, className: "text-2xl my-2", showHalfStars: true }),
            React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, `بناءً على ${totalReviews} مراجعة`)
        ),
        React.createElement("div", { className: "md:col-span-2 space-y-2" },
            React.createElement(RatingBar, { ratingLabel: "5 نجوم", percentage: percentages[5] }),
            React.createElement(RatingBar, { ratingLabel: "4 نجوم", percentage: percentages[4] }),
            React.createElement(RatingBar, { ratingLabel: "3 نجوم", percentage: percentages[3] }),
            React.createElement(RatingBar, { ratingLabel: "2 نجوم", percentage: percentages[2] }),
            React.createElement(RatingBar, { ratingLabel: "1 نجوم", percentage: percentages[1] })
        )
    );
};

export { ReviewSummary };
