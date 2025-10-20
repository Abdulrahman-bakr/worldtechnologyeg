import React, { useState } from 'react';
import { StarIcon } from '../../icons/index.js';

const StarRating = ({ rating, totalStars = 5, className, showHalfStars = true, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseMove = (index) => {
    if (onRatingChange) {
      setHoverRating(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (onRatingChange) {
      setHoverRating(0);
    }
  };

  const handleClick = (index) => {
    if (onRatingChange) {
      onRatingChange(index + 1);
    }
  };
  
  const ratingToDisplay = hoverRating > 0 ? hoverRating : rating;
  const isInteractive = !!onRatingChange;

  return React.createElement("div", { 
      className: `flex items-center ${className || ''} ${isInteractive ? 'star-rating-interactive' : ''}`,
      onMouseLeave: handleMouseLeave,
      role: isInteractive ? "radiogroup" : "img",
      "aria-label": isInteractive ? "تقييم المنتج" : `التقييم: ${rating} من ${totalStars} نجوم`
    },
    [...Array(totalStars)].map((_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= ratingToDisplay;
      // Only show half stars for display-only ratings. Interactive ratings should be whole numbers.
      const isHalfFilled = showHalfStars && !isInteractive && rating > index && rating < starValue;

      const starItemClass = [
        'star-item',
        isHalfFilled ? 'half-filled' : '',
        // Don't apply 'filled' class if it's a half-filled star to allow specific half-fill styling
        isFilled && !isHalfFilled ? 'filled' : '',
      ].join(' ').trim();

      return React.createElement("div", {
        key: index,
        className: starItemClass,
        onMouseEnter: () => handleMouseMove(index),
        onClick: () => handleClick(index),
        "aria-label": isInteractive ? `تقييم ${starValue} ${starValue === 1 ? 'نجمة' : 'نجوم'}` : undefined,
        role: isInteractive ? "radio" : undefined,
        "aria-checked": isInteractive ? rating === starValue : undefined
      }, React.createElement(StarIcon, {
          halfFilled: isHalfFilled,
          // No 'filled' prop here, CSS will handle it via parent class
          className: "w-4 h-4 sm:w-5 sm:h-5"
        })
      );
    })
  );
};
export { StarRating };
