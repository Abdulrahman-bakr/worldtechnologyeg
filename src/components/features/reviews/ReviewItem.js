

import React, { useState } from 'react';
import { StarRating } from '../../ui/feedback/StarRating.js';
import { formatTimeAgo } from '../../../utils/helpers/formatters.js';
import { CloseIcon } from '../../icons/index.js';

const ReviewImageLightbox = ({ src, onClose }) => {
    return React.createElement("div", { className: "review-image-lightbox", onClick: onClose },
        React.createElement("img", { src: src, alt: "Review image" }),
        React.createElement("button", { onClick: onClose, className: "close-btn" }, 
            React.createElement(CloseIcon, { className: "w-6 h-6" })
        )
    );
};

const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    const names = name.trim().split(/\s+/);
    if (names.length > 1 && names[0].length > 0 && names[names.length - 1].length > 0) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    if (names.length > 0 && names[0].length > 0) {
        return names[0].substring(0, 2).toUpperCase();
    }
    return '?';
};

const ReviewItem = ({ review }) => {
    const [lightboxImage, setLightboxImage] = useState(null);

    return React.createElement("div", { className: "border-b border-light-200 dark:border-dark-700 pb-6" },
        React.createElement("div", { className: "flex items-start gap-4" },
            React.createElement("div", { className: "flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold" },
                getInitials(review.userName)
            ),
            React.createElement("div", { className: "flex-grow" },
                React.createElement("div", { className: "flex items-center justify-between mb-1" },
                    React.createElement("p", { className: "font-semibold text-dark-900 dark:text-dark-50" }, review.userName),
                    review.createdAt && React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300" }, formatTimeAgo(review.createdAt))
                ),
                React.createElement(StarRating, { rating: review.rating, className: "mb-2" }),
                review.comment && React.createElement("p", { className: "text-dark-800 dark:text-dark-100 whitespace-pre-wrap" }, review.comment),
                review.images && review.images.length > 0 && React.createElement("div", { className: "review-images-container" },
                    review.images.map((imgUrl, index) => (
                        React.createElement("div", { key: index, className: "review-image-wrapper", onClick: () => setLightboxImage(imgUrl) },
                            React.createElement("img", { src: imgUrl, alt: `Review image ${index + 1}`, loading: "lazy", decoding: "async" })
                        )
                    ))
                )
            )
        ),
        lightboxImage && React.createElement(ReviewImageLightbox, { src: lightboxImage, onClose: () => setLightboxImage(null) })
    );
};

export { ReviewItem };