import React from 'react';
import { createIcon } from './createIcon.js';

export const createSolidIcon = (
  paths,
  filledPath = null,
  viewBox = "0 0 24 24"
) => ({ className, size = 24, color = "currentColor", filled, halfFilled }) => {
  if (halfFilled) {
    return React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox,
        width: size,
        height: size,
        className: className || "w-6 h-6",
      },
      React.createElement("path", {
        d: filledPath || paths[0],
        fill: color,
        clipPath: "inset(0 50% 0 0)",
      }),
      paths.map((d, i) =>
        React.createElement("path", {
          key: i,
          d,
          stroke: color,
          strokeWidth: 1.5,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "none",
        })
      )
    );
  }

  if (filled) {
    return React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox,
        width: size,
        height: size,
        className: className || "w-6 h-6",
        fill: color,
      },
      React.createElement("path", { d: filledPath || paths[0] })
    );
  }

  return createIcon(paths, viewBox)({ className, size, color });
};
