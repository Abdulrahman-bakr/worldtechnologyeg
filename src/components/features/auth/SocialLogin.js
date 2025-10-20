

import React from 'react';
import { GoogleIcon } from '../../icons/index.js';

export const SocialLogin = ({ onGoogleSignIn, isLoading }) => {
    return (
        React.createElement("div", { className: "flex justify-center" },
            React.createElement("button", {
                onClick: onGoogleSignIn,
                disabled: isLoading,
                className: "flex items-center justify-center space-x-2 space-x-reverse w-full border border-light-300 dark:border-dark-600 rounded-lg px-4 py-2 text-sm font-medium text-dark-800 dark:text-dark-100 hover:bg-light-100 dark:hover:bg-dark-700 transition-colors disabled:opacity-70"
            },
                React.createElement(GoogleIcon, { className: "w-5 h-5" }),
                React.createElement("span", null, "المتابعة باستخدام جوجل")
            )
        )
    );
};