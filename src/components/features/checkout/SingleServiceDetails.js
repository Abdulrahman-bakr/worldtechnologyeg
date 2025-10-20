import React from 'react';

const SingleServiceDetails = ({ item }) => {
    if (!item || !item.serviceDetails) {
        return null;
    }

    const { product, serviceDetails } = item;
    const { formData, finalPrice } = serviceDetails;

    return (
        React.createElement("div", { className: "bg-light-100 dark:bg-dark-700 p-4 rounded-lg mb-4 border border-light-200 dark:border-dark-600" },
            React.createElement("h3", { className: "text-lg font-bold text-dark-800 dark:text-dark-100 mb-3" }, `تفاصيل خدمة: ${product.arabicName}`),
            React.createElement("div", { className: "space-y-2 text-sm" },
                formData && formData.map((field) => (
                    // ✅ FIX: Added the unique "key" prop here
                    React.createElement("p", { key: field.label, className: "flex justify-between" },
                        React.createElement("span", { className: "text-dark-600 dark:text-dark-300" }, `${field.label}:`),
                        React.createElement("span", { className: "font-semibold text-dark-800 dark:text-dark-100" }, field.value)
                    )
                )),
                React.createElement("p", { className: "flex justify-between text-md font-bold pt-2 border-t border-light-300 dark:border-dark-500 mt-2" },
                    React.createElement("span", { className: "text-primary" }, "التكلفة النهائية:"),
                    React.createElement("span", { className: "text-primary tabular-nums" }, `${(finalPrice || 0).toFixed(2)} ج.م`)
                )
            )
        )
    );
};

export { SingleServiceDetails };