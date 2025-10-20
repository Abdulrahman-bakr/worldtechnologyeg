import React, { useState, useMemo } from 'react';
import { ShoppingCartIcon, StarIcon } from '../../../icons/index.js';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';
import { MOBILE_OPERATOR_CONFIG } from '../../../../constants/index.js';

const MobileBillForm = ({ product, onInitiateDirectCheckout }) => {
    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState('');
    const [mobileBillOperator, setMobileBillOperator] = useState('');

    const pointsToEarn = useMemo(() => {
        return Math.floor(Number(formData.paymentAmount) || 0);
    }, [formData.paymentAmount]);

    const isCheckoutDisabled = !mobileBillOperator || !formData.phoneNumber || formData.phoneNumber.length < 11 || !formData.paymentAmount || Number(formData.paymentAmount) <= 0;

    const handleCheckout = () => {
        onInitiateDirectCheckout(product, {
            finalPrice: Number(formData.paymentAmount),
            formData: [
                { label: 'الشبكة', value: MOBILE_OPERATOR_CONFIG[mobileBillOperator]?.arabicName },
                { label: 'رقم الهاتف', value: formData.phoneNumber },
                { label: 'قيمة الفاتورة', value: `${Number(formData.paymentAmount).toFixed(2)} ج.م` },
            ]
        });
    };

    return React.createElement("form", {
        onSubmit: (e) => { e.preventDefault(); handleCheckout(); },
        className: "space-y-4"
    },
        React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3 text-center" }, product.arabicName),
        React.createElement("div", null,
            React.createElement("label", { className: "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100" }, "اختر الشبكة *"),
            React.createElement("select", {
                value: mobileBillOperator,
                onChange: (e) => setMobileBillOperator(e.target.value),
                className: "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary"
            },
                React.createElement("option", { value: "" }, "اختر..."),
                Object.entries(MOBILE_OPERATOR_CONFIG).map(([key, op]) => React.createElement("option", { key: key, value: key }, op.arabicName))
            )
        ),
        React.createElement(FloatingInput, { id: "phoneNumber", value: formData.phoneNumber || '', onChange: e => setFormData(p => ({...p, phoneNumber: e.target.value.replace(/\D/g, '')})), placeholder: "رقم الهاتف *", type: "tel" }),
        React.createElement(FloatingInput, { id: "paymentAmount", value: formData.paymentAmount || '', onChange: e => setFormData(p => ({...p, paymentAmount: e.target.value.replace(/[^0-9.]/g, '')})), placeholder: "قيمة الفاتورة *", type: "number" }),
        formError && React.createElement("p", { className: "text-red-500 text-sm mt-1 text-center" }, formError),
        React.createElement("div", { className: "pt-4 border-t border-light-200 dark:border-dark-600 mt-auto" },
            (pointsToEarn > 0) && React.createElement("p", { className: "mb-3 text-center text-sm text-yellow-600 dark:text-yellow-400" }, `ستربح ${pointsToEarn} نقطة`),
            React.createElement("button", {
                type: "submit", disabled: isCheckoutDisabled,
                className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60"
            }, "إتمام الدفع")
        )
    );
};

export { MobileBillForm };