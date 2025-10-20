

import React from 'react';
import { StaticPageView } from './StaticPageView.js';
import { PhoneIcon, AtSymbolIcon } from '../../components/icons/index.js';

const ContactUsView = ({ onBack }) => {
    const email = "abdobakrmohamed@gmail.com";
    const phone = "01026146714"; 
    const whatsappNumberForLink = "201026146714"; 
    const whatsappLink = `https://wa.me/${whatsappNumberForLink}`;

  return React.createElement(StaticPageView, { title: "اتصل بنا", onBack: onBack },
    React.createElement("p", { className: "text-center mb-6" }, "نحن هنا لمساعدتك! إذا كان لديك أي أسئلة أو استفسارات، فلا تتردد في التواصل معنا عبر إحدى القنوات التالية:"),
    React.createElement("div", { className: "max-w-lg mx-auto space-y-4" },
        React.createElement("div", { className: "p-4 bg-light-100 dark:bg-dark-700 rounded-lg flex items-center space-x-4 space-x-reverse" },
            React.createElement(PhoneIcon, { className: "w-8 h-8 text-primary" }),
            React.createElement("div", null, 
                React.createElement("p", { className: "font-semibold" }, "الهاتف وواتساب"),
                React.createElement("a", { href: whatsappLink, target: "_blank", rel: "noopener noreferrer", className: "text-secondary hover:underline" }, phone)
            )
        ),
        React.createElement("div", { className: "p-4 bg-light-100 dark:bg-dark-700 rounded-lg flex items-center space-x-4 space-x-reverse" },
            React.createElement(AtSymbolIcon, { className: "w-8 h-8 text-primary" }),
            React.createElement("div", null, 
                React.createElement("p", { className: "font-semibold" }, "البريد الإلكتروني"),
                React.createElement("a", { href: `mailto:${email}`, className: "text-secondary hover:underline" }, email)
            )
        )
    ),
    React.createElement("p", { className: "text-center mt-8 text-dark-700 dark:text-dark-100" }, "ساعات العمل: من السبت إلى الخميس، من الساعة 12 ظهرًا حتى 12 ليلًا.")
  );
};

export { ContactUsView };