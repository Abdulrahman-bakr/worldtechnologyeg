import React from 'react';
import { EGYPT_GOVERNORATES_DATA } from '../../../constants/governorates.js';

const ShippingForm = ({
    selectedGovernorate,
    setSelectedGovernorate,
    selectedCity,
    setSelectedCity,
    availableCities,
    addressDetails,
    setAddressDetails,
    renderError
}) => {
    const inputClassName = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base";
    const labelClassName = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";

    return (
        React.createElement(React.Fragment, null,
            React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 border-b border-light-300 dark:border-dark-600 pb-2 mb-3 pt-2" }, "بيانات الشحن (للمنتجات المادية)"),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4" },
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "governorate-select", className: labelClassName }, "* المحافظة"),
                    React.createElement("select", { id: "governorate-select", value: selectedGovernorate, onChange: (e) => setSelectedGovernorate(e.target.value), className: inputClassName },
                        React.createElement("option", { value: "" }, "اختر المحافظة..."),
                        Object.keys(EGYPT_GOVERNORATES_DATA).map(gov => React.createElement("option", { key: gov, value: gov }, gov))
                    ),
                    renderError('selectedGovernorate')
                ),
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "city-select", className: labelClassName }, "* المركز / المدينة"),
                    React.createElement("select", { id: "city-select", value: selectedCity, onChange: (e) => setSelectedCity(e.target.value), className: inputClassName, disabled: availableCities.length === 0 },
                        React.createElement("option", { value: "" }, "اختر المركز أو المدينة..."),
                        availableCities.map(city => React.createElement("option", { key: city, value: city }, city))
                    ),
                    renderError('selectedCity')
                )
            ),
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "address-details", className: labelClassName }, "* العنوان بالتفصيل"),
                React.createElement("textarea", { id: "address-details", value: addressDetails, onChange: (e) => setAddressDetails(e.target.value), className: `${inputClassName} min-h-[80px]`, placeholder: "مثال: 10 شارع النصر، بجوار مسجد السلام، الدور الثالث شقة 5" }),
                renderError('addressDetails')
            )
        )
    );
};

export { ShippingForm };