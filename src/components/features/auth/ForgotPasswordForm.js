

import React from 'react';
import { FloatingInput } from '../../ui/forms/FloatingInput.js';

export const ForgotPasswordForm = ({ email, setEmail, phone, setPhone, handleForgotPassword, isLoading, isFormValid, error, successMessage, switchMode }) => {
    return (
        React.createElement("form", { onSubmit: handleForgotPassword, className: "space-y-4" },
            React.createElement("h2", { className: "text-xl font-bold text-center text-dark-900 dark:text-dark-50 mb-4" }, "استعادة كلمة المرور"),
            React.createElement("p", { className: "text-sm text-center text-dark-700 dark:text-dark-100 mb-4" }, "أدخل بريدك الإلكتروني ورقم الهاتف المسجلين لدينا لإرسال رابط استعادة كلمة المرور."),
            error && React.createElement("p", { className: "text-sm text-red-500 text-center" }, error),
            successMessage && React.createElement("p", { className: "text-sm text-green-600 text-center" }, successMessage),
            React.createElement(FloatingInput, { id: "forgot-email", type: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: "البريد الإلكتروني *" }),
            React.createElement(FloatingInput, { id: "forgot-phone", type: "tel", value: phone, onChange: e => setPhone(e.target.value), placeholder: "رقم الهاتف *", maxLength: 11 }),
            React.createElement("div", { className: "space-y-3 pt-4" },
                React.createElement("button", { type: "submit", disabled: isLoading || !isFormValid, className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70" },
                    isLoading ? "جاري الإرسال..." : "إرسال رابط الاستعادة"
                ),
                React.createElement("button", { type: "button", onClick: () => switchMode('login'), className: "w-full text-sm text-primary hover:underline" }, "العودة لتسجيل الدخول")
            )
        )
    );
};