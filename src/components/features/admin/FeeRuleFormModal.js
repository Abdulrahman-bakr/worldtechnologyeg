

import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../../icons/index.js';

const FeeRuleFormModal = ({ isOpen, onClose, onSave }) => {
    const [ruleId, setRuleId] = useState('');
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ruleId });
    };
    
    if (!isOpen) return null;
    
    const inputClass = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:border-primary focus:ring-primary transition-colors";
    const btnClass = "py-2 px-4 rounded-lg font-semibold transition-colors shadow-md";

    return (
        React.createElement("div", { className: "fixed inset-0 z-[110] flex items-center justify-center p-4", role: "dialog", "aria-modal": "true" },
            React.createElement("div", { className: "modal-overlay absolute inset-0 bg-black/85" }),
            React.createElement("div", { className: "modal-content bg-light-50 dark:bg-dark-800 rounded-xl shadow-2xl p-6 w-full max-w-lg relative" },
                React.createElement("button", { onClick: onClose, className: "absolute top-4 left-4 text-dark-600 dark:text-dark-300 hover:text-red-500 p-1 transition-colors", "aria-label": "إغلاق" }, React.createElement(CloseIcon, { className: "w-6 h-6" })),
                
                React.createElement("h2", { className: "text-xl font-bold mb-4 border-b pb-2 text-dark-900 dark:text-light-50" }, 'إضافة قاعدة رسوم جديدة'),
                
                React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
                    React.createElement("input", { 
                        value: ruleId, 
                        onChange: e => setRuleId(e.target.value.toLowerCase().replace(/\s/g, '_')), 
                        placeholder: "معرّف القاعدة (e.g., we_internet_v2)", 
                        className: inputClass, 
                        required: true 
                    }),

                    React.createElement("div", { className: "pt-4 border-t border-light-300 dark:border-dark-600 flex justify-end gap-2" },
                        React.createElement("button", { type: "button", onClick: onClose, className: `${btnClass} bg-light-200 dark:bg-dark-600` }, "إلغاء"),
                        React.createElement("button", { type: "submit", className: `${btnClass} bg-primary text-white` }, "حفظ القاعدة")
                    )
                )
            )
        )
    );
};

export { FeeRuleFormModal };