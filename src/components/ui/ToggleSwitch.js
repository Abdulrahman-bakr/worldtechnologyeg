import React from 'react';

const ToggleSwitch = ({ enabled, onChange, srLabel = 'Toggle', disabled = false }) => {
    return (
        React.createElement("button", {
            type: "button",
            onClick: onChange,
            disabled: disabled,
            className: `
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                dark:focus:ring-offset-dark-800
                ${enabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `,
            role: "switch",
            "aria-checked": enabled
        },
            React.createElement("span", { className: "sr-only" }, srLabel),
            React.createElement("span", {
                "aria-hidden": "true",
                className: `
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${enabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'}
                `
            })
        )
    );
};

export { ToggleSwitch };