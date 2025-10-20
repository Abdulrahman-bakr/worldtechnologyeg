
import React from 'react';

export const KeyboardCatIcon = ({ className }) => (
  React.createElement("img", {
    src: "/assets/icons/keyboard.png",
    alt: "Keyboard Icon",
    className: className || "w-6 h-6",
    loading: "lazy"
  })
);