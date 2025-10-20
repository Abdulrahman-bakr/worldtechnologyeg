

import React from 'react';
import { FloatingInput } from '../../ui/forms/FloatingInput.js';
import { EyeIcon, EyeSlashIcon } from '../../icons/index.js';

export const SignupForm = ({
  name, setName, email, setEmail, phone, setPhone, password, setPassword,
  confirmPassword, setConfirmPassword, isPasswordVisible, setIsPasswordVisible,
  isConfirmPasswordVisible, setIsConfirmPasswordVisible,
  handleAuthAction, isLoading, isFormValid
}) => {
    return (
        React.createElement("form", { onSubmit: handleAuthAction, className: "space-y-4" },
            React.createElement(FloatingInput, { id: "signup-name", type: "text", value: name, onChange: e => setName(e.target.value), placeholder: "الاسم بالكامل *" }),
            React.createElement(FloatingInput, { id: "signup-email", type: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: "البريد الإلكتروني *" }),
            React.createElement(FloatingInput, { id: "signup-phone", type: "tel", value: phone, onChange: e => setPhone(e.target.value), placeholder: "رقم الهاتف *", maxLength: 11 }),
            React.createElement("div", { className: "relative" },
                React.createElement(FloatingInput, { id: "signup-password", type: isPasswordVisible ? "text" : "password", value: password, onChange: e => setPassword(e.target.value), placeholder: "كلمة المرور (6 أحرف على الأقل) *" }),
                React.createElement("button", { type: "button", onClick: () => setIsPasswordVisible(!isPasswordVisible), className: "absolute top-1/2 -translate-y-1/2 left-3 text-dark-600 dark:text-dark-300", "aria-label": "Toggle password visibility" },
                    isPasswordVisible ? React.createElement(EyeSlashIcon, { className: "w-5 h-5" }) : React.createElement(EyeIcon, { className: "w-5 h-5" })
                )
            ),
            React.createElement("div", { className: "relative" },
                React.createElement(FloatingInput, { id: "confirm-password", type: isConfirmPasswordVisible ? "text" : "password", value: confirmPassword, onChange: e => setConfirmPassword(e.target.value), placeholder: "تأكيد كلمة المرور *" }),
                 React.createElement("button", { type: "button", onClick: () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible), className: "absolute top-1/2 -translate-y-1/2 left-3 text-dark-600 dark:text-dark-300", "aria-label": "Toggle confirm password visibility" },
                    isConfirmPasswordVisible ? React.createElement(EyeSlashIcon, { className: "w-5 h-5" }) : React.createElement(EyeIcon, { className: "w-5 h-5" })
                )
            ),
            React.createElement("button", { type: "submit", disabled: isLoading || !isFormValid, className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70 mt-2" },
                isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"
            )
        )
    );
};