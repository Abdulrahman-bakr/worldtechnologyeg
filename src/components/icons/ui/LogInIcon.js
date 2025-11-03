import React from 'react';

// أيقونة تسجيل الدخول
export const LogInIcon = ({ className, size = 24, style, ...restProps }) => {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    viewBox: "0 0 512 512",
    width: size,
    height: size,
    className: className,
    style: style,
    ...restProps
  },
    React.createElement("g", null,
      React.createElement("g", { "data-name": "ARROW 48" },
        React.createElement("path", {
          d: "M400.14.16H181.35a82 82 0 0 0-81.9 81.9v50.54a24 24 0 1 0 48 0V82.06a33.94 33.94 0 0 1 33.9-33.9h218.79A33.93 33.93 0 0 1 434 82.06v347.88a33.93 33.93 0 0 1-33.89 33.9H181.35a33.94 33.94 0 0 1-33.9-33.9v-58.47a24 24 0 0 0-48 0v58.47a82 82 0 0 0 81.9 81.9h218.79a82 82 0 0 0 81.86-81.9V82.06A82 82 0 0 0 400.14.16z",
          fill: "currentColor",
          opacity: "1"
        }),
        React.createElement("path", {
          d: "m364.64 238.53-85.4-85.35a24 24 0 0 0-33.61-.33c-9.7 9.33-9.47 25.13.05 34.65l44.47 44.5H54a24 24 0 0 0-24 24 24 24 0 0 0 24 24h236.16l-44.9 44.9a24 24 0 0 0 33.94 33.95l85.44-85.41a24.66 24.66 0 0 0 0-34.91z",
          fill: "currentColor",
          opacity: "1"
        })
      )
    )
  );
};
