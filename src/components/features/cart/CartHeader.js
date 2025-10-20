

import React from 'react';
import { CloseIcon } from '../../icons/index.js';

const CartHeader = ({ onClose }) => (
  React.createElement("div", { className: "flex items-center justify-between p-5 sm:p-6 border-b border-light-300 dark:border-dark-600" },
    React.createElement("h2", { id: "cart-title", className: "text-xl sm:text-2xl font-semibold text-primary" }, "عربة التسوق الخاصة بك"),
    React.createElement("button", { onClick: onClose, "aria-label": "إغلاق السلة", className: "text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-dark-50" },
      React.createElement(CloseIcon, { className: "w-6 h-6" })
    )
  )
);

export { CartHeader };