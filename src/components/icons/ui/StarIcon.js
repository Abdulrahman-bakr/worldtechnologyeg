
import React from 'react';

// This implementation is preserved from the original StarIcon.js as it's more advanced
// than the simple createSolidIcon version, supporting half-filled states.

export const StarIcon = ({ filled, className, halfFilled }) => {
      const starPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
      // To fix the conditional hook call error, we call useId at the top level.
      // It will be used only when halfFilled is true. The React version used (18+) ensures it exists.
      const clipPathId = React.useId();
    
      if (halfFilled) {
        return React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", className: className || "w-5 h-5", "aria-hidden": "true" },
          React.createElement("defs", null,
            React.createElement("clipPath", { id: clipPathId },
              React.createElement("rect", { x: "12", y: "0", width: "12", height: "24" })
            )
          ),
          React.createElement("path", { 
            className: "star-icon-background",
            d: starPath 
          }),
          React.createElement("path", { 
            className: "star-icon-foreground",
            d: starPath, 
            clipPath: `url(#${clipPathId})` 
          })
        );
      }
    
      return React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", className: className || "w-5 h-5", "aria-hidden": "true" },
          React.createElement("path", { className: filled ? 'star-icon-foreground' : 'star-icon-background', d: starPath })
      );
};
