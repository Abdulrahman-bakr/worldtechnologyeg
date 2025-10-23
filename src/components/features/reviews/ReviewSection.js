


import React from 'react';
import { useReviews } from '../../../hooks/useReviews.js';
import { ReviewSummary } from './ReviewSummary.js';
import { ReviewForm } from './ReviewForm.js';
import { ReviewList } from './ReviewList.js';

const ReviewSection = ({ product, currentUser, onPendingReviewLogin, setToastMessage }) => {
    const {
        reviews,
        isLoading,
        error,
        ratingCounts,
        averageRating,
        totalReviews,
        userHasReviewed,
        handleReviewSubmit,
    } = useReviews(product, currentUser, setToastMessage);

    return React.createElement("div", { className: "space-y-8" },
        React.createElement(ReviewSummary, {
            averageRating,
            totalReviews,
            ratingCounts,
            isLoading
        }),
        !userHasReviewed && React.createElement(ReviewForm, {
            product: product,
            productId: product.id,
            currentUser: currentUser,
            onPendingReviewLogin: onPendingReviewLogin,
            onSubmit: handleReviewSubmit
        }),
        isLoading && !reviews.length && React.createElement("p", { className: "text-center py-4" }, "جاري تحميل المراجعات..."),
        error && React.createElement("p", { className: "text-red-500 text-center py-4" }, error),
        !isLoading && reviews.length === 0 && React.createElement("p", { className: "text-center text-dark-600 dark:text-dark-300 py-4" }, "لا توجد مراجعات لهذا المنتج حتى الآن. كن أول من يضيف مراجعة!"),
        reviews.length > 0 && React.createElement(ReviewList, { reviews })
    );
};

export { ReviewSection };
