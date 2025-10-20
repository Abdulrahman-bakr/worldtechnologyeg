
import React from 'react';

export const BluetoothHeadphonesCatIcon = ({ className }) => (
  React.createElement("img", {
    src: "/assets/icons/bluetooth_headphones.png", // Change the path to the correct icon
    alt: "Bluetooth Headphones Icon",
    className: className || "w-6 h-6",
    loading: "lazy"
  })
);