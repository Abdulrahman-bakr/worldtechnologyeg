import React from 'react';
import { VodafoneLogoIcon, InstapayLogoIcon } from '../../icons/logo/index.js';

const PaymentIcon = ({ title, children }) => (
    React.createElement("div", { className: "flex flex-col items-center gap-2 text-center" },
        React.createElement("div", { className: "flex items-center justify-center w-14 h-14 bg-white dark:bg-dark-700 rounded-lg shadow-md border border-light-200 dark:border-dark-600" },
            children
        ),
        React.createElement("span", { className: "text-xs font-medium text-dark-800 dark:text-dark-100" }, title)
    )
);


const FooterPayments = () => {
    return (
        React.createElement("div", null,
            React.createElement("h4", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4" }, "طرق الدفع المتاحة"),
            React.createElement("div", { className: "flex justify-start items-center gap-4" },
                React.createElement(PaymentIcon, { title: "عند الاستلام" },
                    React.createElement("svg", { xmlns:"http://www.w3.org/2000/svg", fill:"none", viewBox:"0 0 24 24", strokeWidth:"1.5", stroke:"currentColor", className:"w-8 h-8 text-primary" },
                        React.createElement("path", { strokeLinecap:"round", strokeLinejoin:"round", d: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m18 0h-4.5M3.75 18h4.5" }),
                        React.createElement("path", {strokeLinecap:"round", strokeLinejoin:"round", d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
                    )
                ),
                React.createElement(PaymentIcon, { title: "فودافون كاش" },
                    React.createElement(VodafoneLogoIcon, { className:"w-9 h-9 object-contain" })
                ),
                React.createElement(PaymentIcon, { title: "إنستا باي" },
                     React.createElement(InstapayLogoIcon, { className:"w-9 h-9 object-contain" })
                )
            )
        )
    );
};

export { FooterPayments };
