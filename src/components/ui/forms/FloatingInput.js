import React from 'react';

const FloatingInput = ({ id, value, onChange, placeholder, type = 'text', required = false }) => {
    return React.createElement("div", { className: "relative" },
        React.createElement("input", {
            id: id,
            type: type,
            value: value,
            onChange: onChange,
            required: required,
            className: "block px-3.5 pb-2.5 pt-4 w-full text-md text-dark-900 dark:text-white bg-light-100 dark:bg-dark-700 rounded-lg border border-light-300 dark:border-dark-600 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer",
            placeholder: " " 
        }),
        React.createElement("label", {
            htmlFor: id,
            className: "absolute text-md text-dark-600 dark:text-dark-300 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] right-2.5 rtl:origin-[100] rtl:left-2.5 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 transition-all ease-out"
        }, placeholder)
    );
};

export { FloatingInput };