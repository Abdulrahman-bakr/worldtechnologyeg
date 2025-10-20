
import React from 'react';

export const CableCatIcon = ({ className }) => (
  React.createElement("img", {
    src: "/assets/icons/cable.png",
    alt: "Cable Icon",
    className: className || "w-6 h-6",
    loading: "lazy"
  })
);