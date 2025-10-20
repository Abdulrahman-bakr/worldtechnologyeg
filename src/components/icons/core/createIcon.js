import React from 'react';

export const createIcon = (paths, viewBox = "0 0 24 24") => ({
  className,
  size = 24,
  color = "currentColor",
}) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox,
      strokeWidth: 1.5,
      stroke: color,
      width: size,
      height: size,
      className: className || "w-6 h-6",
    },
    paths.map((d, i) =>
      React.createElement("path", {
        key: i,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d,
      })
    )
  );
