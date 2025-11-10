
import React from 'react';

export const RazerGoldIcon = ({ className }) => (
  React.createElement("img", {
    src: "/assets/logos/RazerGold.png", // Change the path to the correct icon
    alt: "Razer Gold Icon",
    className: className || "w-6 h-6",
    loading: "lazy"
  })
);