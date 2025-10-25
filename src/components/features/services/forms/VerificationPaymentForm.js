import React, { useState, useMemo } from 'react';
import { ShoppingCartIcon } from '../../../icons/index.js';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';

const VerificationPaymentForm = ({ product, onInitiateDirectCheckout }) => {
    const [platform, setPlatform] = useState('facebook');
    const [profileLink, setProfileLink] = useState('');
    const [formError, setFormError] = useState('');

    const price = useMemo(() => product.discountPrice || product.price || 0, [product]);

    const handleCheckout = () => {
        if (!profileLink.trim().startsWith('https://')) {
            setFormError('يرجى إدخال رابط حساب صحيح يبدأ بـ https://');
            return;
        }
        setFormError('');
        onInitiateDirectCheckout(product, {
            finalPrice: price,
            formData: [
                { label: 'المنصة', value: platform === 'facebook' ? 'فيسبوك' : 'انستجرام', id: 'platform' },
                { label: 'رابط الحساب', value: profileLink.trim(), id: 'profileLink' },
                { label: 'السعر', value: `${price.toFixed(2)} ج.م`, id: 'price' },
            ]
        });
    };

    const isCheckoutDisabled = !profileLink.trim();

    const selectClass = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary transition-colors";
    const labelClass = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";

    return (
        React.createElement("form", { onSubmit: (e) => { e.preventDefault(); handleCheckout(); }, className: "space-y-4" },
            React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3 text-center" }, product.arabicName),
            
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "platform-select", className: labelClass }, "اختر المنصة *"),
                React.createElement("select", { id: "platform-select", value: platform, onChange: (e) => setPlatform(e.target.value), className: selectClass },
                    React.createElement("option", { value: "facebook" }, "فيسبوك"),
                    React.createElement("option", { value: "instagram" }, "انستجرام")
                )
            ),

            React.createElement(FloatingInput, { 
                id: "profileLink", 
                value: profileLink, 
                onChange: e => setProfileLink(e.target.value), 
                placeholder: "رابط الحساب (Profile Link) *", 
                type: "url",
                required: true 
            }),

            React.createElement("div", { className: "p-3 bg-light-100 dark:bg-dark-700 rounded-lg border border-light-200 dark:border-dark-600 text-center space-y-2" },
                React.createElement("p", { className: "text-md font-bold flex justify-between items-center text-primary" },
                    React.createElement("span", null, "الإجمالي للدفع:"),
                    React.createElement("span", { className: "tabular-nums text-lg" }, `${price.toFixed(2)} ج.م`)
                )
            ),

            React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300 text-center p-2 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-md" },
                React.createElement("strong", null, "ملاحظة هامة:"), " أنت تدفع مقابل رسوم الاشتراك الشهرية الرسمية بالإضافة إلى رسوم خدمتنا. بعد الدفع، سنتواصل معك عبر واتساب لبدء عملية الدفع للاشتراك. ", React.createElement("strong", null, "لن نطلب منك كلمة المرور أبدًا.")
            ),

            formError && React.createElement("p", { className: "text-red-500 text-sm mt-1 text-center" }, formError),

            React.createElement("div", { className: "pt-4 border-t border-light-200 dark:border-dark-600 mt-auto" },
                React.createElement("button", {
                    type: "submit",
                    disabled: isCheckoutDisabled,
                    className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                },
                    React.createElement(ShoppingCartIcon, { className: "w-5 h-5" }),
                    "اطلب الخدمة الآن"
                )
            )
        )
    );
};

export { VerificationPaymentForm };