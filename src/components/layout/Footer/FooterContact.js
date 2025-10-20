
import React from 'react';
import { FacebookIcon } from '../../icons/index.js';

const FooterContact = ({ storeSettings }) => {
    const settings = storeSettings || {};
    const email = settings.contactEmail || "abdobakrmohamed@gmail.com";
    const phone = settings.contactPhone || "01026146714";
    const whatsappNumber = settings.whatsappNumber || "201026146714";
    const facebookUrl = settings.facebookUrl || "https://www.facebook.com/abdobakrmohamed";
    const whatsappLink = `https://wa.me/${whatsappNumber}`;
    const NEW_WHATSAPP_ICON_URL = "https://i.postimg.cc/1RGDJKJC/icons8-whatsapp-96.png";

    return (
        React.createElement("div", null,
            React.createElement("h4", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4" }, "تواصل معنا"),
            React.createElement("ul", { className: "space-y-2.5 text-sm" },
                React.createElement("li", { className: "flex items-center space-x-2 space-x-reverse" }, 
                  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-4 h-4 text-primary" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"}) ),
                  React.createElement("a", { href: `mailto:${email}`, className: "text-dark-700 dark:text-dark-100 hover:text-primary transition-colors" }, email)
                ),
                React.createElement("li", { className: "flex items-center space-x-2 space-x-reverse" }, 
                  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-4 h-4 text-primary" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"}) ),
                  React.createElement("a", { href: `tel:${phone}`, className: "text-dark-700 dark:text-dark-100 hover:text-primary transition-colors" }, phone)
                )
              ),
              React.createElement("div", { className: "flex space-x-4 mt-6 space-x-reverse" },
                React.createElement("a", { href: facebookUrl, target:"_blank", rel:"noopener noreferrer", "aria-label": "Facebook", className: "text-dark-600 dark:text-dark-300 hover:text-primary transition-colors" },
                  React.createElement(FacebookIcon, {className:"w-8 h-8"})
                ),
                React.createElement("a", { href: whatsappLink, target:"_blank", rel:"noopener noreferrer", "aria-label": "WhatsApp", className: "transition-opacity hover:opacity-80" },
                    React.createElement("img", {src: NEW_WHATSAPP_ICON_URL, alt: "WhatsApp", className:"w-8 h-8"})
                )
              )
        )
    );
};

export { FooterContact };