import React from 'react';

const CustomerDetailsForm = ({ 
    customerName, setCustomerName, 
    customerPhone, setCustomerPhone, 
    customerAltPhone, setCustomerAltPhone, 
    renderError,
    currentUser,
    applySavedCustomerData
}) => {
    const inputClassName = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base";
    const labelClassName = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";

    return (
        React.createElement(React.Fragment, null,
            React.createElement("div", { className: "flex justify-between items-center mb-3 border-b border-light-300 dark:border-dark-600 pb-2" },
                React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50" }, "1. بيانات العميل"),
                currentUser && (
                    React.createElement("button", {
                        type: "button",
                        onClick: applySavedCustomerData,
                        className: "text-sm font-semibold text-primary hover:underline flex-shrink-0"
                    }, "استخدام بياناتي المحفوظة")
                )
            ),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4" },
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "customer-name", className: labelClassName }, "* الاسم بالكامل"),
                    React.createElement("input", { type: "text", id: "customer-name", value: customerName, onChange: (e) => setCustomerName(e.target.value), className: inputClassName, placeholder: "مثال: محمد أحمد علي" }),
                    renderError('customerName')
                ),
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "customer-phone", className: labelClassName }, "* رقم الموبايل"),
                    React.createElement("input", { type: "tel", id: "customer-phone", value: customerPhone, onChange: (e) => setCustomerPhone(e.target.value), className: inputClassName, placeholder: "01xxxxxxxxx", maxLength: 11 }),
                    renderError('customerPhone')
                )
            ),
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "customer-phone-alt", className: labelClassName }, "رقم موبايل إضافي (اختياري)"),
                React.createElement("input", { type: "tel", id: "customer-phone-alt", value: customerAltPhone, onChange: (e) => setCustomerAltPhone(e.target.value), className: inputClassName, placeholder: "01xxxxxxxxx", maxLength: 11 }),
                renderError('customerAltPhone')
            )
        )
    );
};

export { CustomerDetailsForm };