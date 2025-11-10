
import React from 'react';

export const PlayStationIcon = ({ className }) => (
  React.createElement("img", {
    src: "/assets/logos/PlayStationIcon.png", // Change the path to the correct icon
    alt: "PlayStation Icon",
    className: className || "w-6 h-6",
    loading: "lazy"
  })
);