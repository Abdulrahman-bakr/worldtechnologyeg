
import React from 'react';

export const ChargerCatIcon = ({ className }) => (
  React.createElement("img", {
    src: "/assets/icons/charger.png",
    alt: "Charger Icon",
    className: className || "w-6 h-6",
    loading: "lazy"
  })
);