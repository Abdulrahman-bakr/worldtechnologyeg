import React from 'react';

export const WhatsAppIcon = ({ className }) => {
  const NEW_WHATSAPP_ICON_URL = "https://i.postimg.cc/1RGDJKJC/icons8-whatsapp-96.png";
  return React.createElement("img", { src: NEW_WHATSAPP_ICON_URL, alt: "WhatsApp", className: className || "w-6 h-6", loading: "lazy" });
};