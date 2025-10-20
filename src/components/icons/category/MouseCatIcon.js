
import React from 'react';

export const MouseCatIcon = ({ className }) => (
  React.createElement("img", {
    src: "/assets/icons/mouse.png",
    alt: "Mouse Icon",
    className: className || "w-6 h-6",
    loading: "lazy"
  })
);