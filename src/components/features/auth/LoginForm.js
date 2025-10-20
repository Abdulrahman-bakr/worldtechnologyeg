

import React from 'react';
import { FloatingInput } from '../../ui/forms/FloatingInput.js';
import { EyeIcon, EyeSlashIcon } from '../../icons/index.js';

export const LoginForm = ({ email, setEmail, password, setPassword, isPasswordVisible, setIsPasswordVisible, handleAuthAction, isLoading, isFormValid, switchMode }) => {
    return (
        React.createElement("form", { onSubmit: handleAuthAction, className: "space-y-4" },
            React.createElement(FloatingInput, { id: "login-email", type: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: "البريد الإلكتروني *" }),
            React.createElement("div", { className: "relative" },
                React.createElement(FloatingInput, { id: "login-password", type: isPasswordVisible ? "text" : "password", value: password, onChange: e => setPassword(e.target.value), placeholder: "كلمة المرور *" }),
                React.createElement("button", { type: "button", onClick: () => setIsPasswordVisible(!isPasswordVisible), className: "absolute top-1/2 -translate-y-1/2 left-3 text-dark-600 dark:text-dark-300", "aria-label": "Toggle password visibility" },
                    isPasswordVisible ? React.createElement(EyeSlashIcon, { className: "w-5 h-5" }) : React.createElement(EyeIcon, { className: "w-5 h-5" })
                )
            ),
            React.createElement("div", { className: "text-left mt-2" },
                React.createElement("button", { type: "button", onClick: () => switchMode('forgot'), className: "text-sm text-primary hover:underline" }, "نسيت كلمة المرور؟")
            ),
            React.createElement("button", { type: "submit", disabled: isLoading || !isFormValid, className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70" },
                isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"
            )
        )
    );
};