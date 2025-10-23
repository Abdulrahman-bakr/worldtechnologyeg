
import React from 'react';
import { FooterAbout } from './FooterAbout.js';
import { FooterLinks } from './FooterLinks.js';
import { FooterContact } from './FooterContact.js';
import { FooterPayments } from './FooterPayments.js';

const Footer = ({ storeSettings }) => {
    const currentYear = new Date().getFullYear();

    return (
        React.createElement("footer", { id: "footer", className: "bg-light-100 dark:bg-dark-800 py-12 sm:py-16 border-t border-light-200 dark:border-dark-700" },
            React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8" },
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8" },
                    React.createElement(FooterAbout, null),
                    React.createElement(FooterLinks, null),
                    React.createElement(FooterContact, { storeSettings: storeSettings }),
                    React.createElement(FooterPayments, null)
                ),
                React.createElement("div", { className: "border-t border-light-300 dark:border-dark-600 mt-8 pt-8 text-center text-sm text-dark-700 dark:text-dark-100" },
                    React.createElement("p", null, `© ${currentYear} World Technology. جميع الحقوق محفوظة.`)
                )
            )
        )
    );
};

export { Footer };