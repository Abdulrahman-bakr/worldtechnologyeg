
import React from 'react';
import { ReviewItem } from './ReviewItem.js';

const ReviewList = ({ reviews }) => {
    return React.createElement("div", { className: "space-y-6" },
        reviews.map(review => React.createElement(ReviewItem, { key: review.id, review: review }))
    );
};

export { ReviewList };
