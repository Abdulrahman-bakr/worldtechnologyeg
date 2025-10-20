

import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../../icons/index.js';

const UserFormModal = ({ isOpen, onClose, onSave, user }) => {
    const [formData, setFormData] = useState({ role: 'user', loyaltyPoints: 0 });

    useEffect(() => {
        if (user) {
            setFormData({
                role: user.role || 'user',
                loyaltyPoints: user.loyaltyPoints || 0
            });
        }
    }, [user, isOpen]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, loyaltyPoints: Number(formData.loyaltyPoints) });
    };
    
    if (!isOpen) return null;

    const inputClass = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50";
    const labelClass = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";
    const btnClass = "py-2 px-4 rounded-lg font-semibold";

    return (
        React.createElement("div", { className: "fixed inset-0 z-[110] flex items-center justify-center p-4" },
            React.createElement("div", { className: "modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: onClose }),
            React.createElement("div", { className: "modal-content bg-light-50 dark:bg-dark-800 rounded-xl shadow-2xl p-6 w-full max-w-lg relative" },
                React.createElement("button", { onClick: onClose, className: "absolute top-4 left-4 p-1" }, React.createElement(CloseIcon, { className: "w-6 h-6" })),
                React.createElement("h2", { className: "text-xl font-bold mb-4" }, `تعديل المستخدم: ${user.name}`),
                React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
                    React.createElement("div", null, 
                        React.createElement("label", { htmlFor:"user-role", className: labelClass }, "الدور"),
                        React.createElement("select", { id:"user-role", value: formData.role, onChange: e => setFormData({...formData, role: e.target.value}), className: inputClass },
                            React.createElement("option", { value: "user" }, "مستخدم"),
                            React.createElement("option", { value: "admin" }, "مسؤول")
                        )
                    ),
                    React.createElement("div", null,
                         React.createElement("label", { htmlFor:"user-points", className: labelClass }, "نقاط الولاء"),
                        React.createElement("input", { id:"user-points", value: formData.loyaltyPoints, onChange: e => setFormData({...formData, loyaltyPoints: e.target.value}), type: "number", className: inputClass })
                    ),
                    React.createElement("div", { className: "pt-4 border-t border-light-300 dark:border-dark-600 flex justify-end gap-2" },
                        React.createElement("button", { type: "button", onClick: onClose, className: `${btnClass} bg-light-200 dark:bg-dark-600` }, "إلغاء"),
                        React.createElement("button", { type: "submit", className: `${btnClass} bg-primary text-white` }, "حفظ التغييرات")
                    )
                )
            )
        )
    );
};

export { UserFormModal };