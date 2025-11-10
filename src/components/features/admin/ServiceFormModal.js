import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../../icons/index.js';
import { SERVICE_TYPES } from '../../../constants/serviceConfigs.js';

const ServiceFormModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        id: '', name: '', operator: '', serviceId: '', packageBaseName: ''
    });
    
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
        onSave(formData);
    };
    
    if (!isOpen) return null;
    
    const inputClass = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:border-primary focus:ring-primary transition-colors";
    const btnClass = "py-2 px-4 rounded-lg font-semibold transition-colors shadow-md";
    const labelClass = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";

    return (
        React.createElement("div", { className: "fixed inset-0 z-[110] flex items-center justify-center p-4", role: "dialog", "aria-modal": "true" },
            React.createElement("div", { className: "modal-overlay absolute inset-0 bg-black/85" }),
            React.createElement("div", { className: "modal-content bg-light-50 dark:bg-dark-800 rounded-xl shadow-2xl p-6 w-full max-w-lg relative flex flex-col" },
                React.createElement("button", { onClick: onClose, className: "absolute top-4 left-4 text-dark-600 dark:text-dark-300 hover:text-red-500 p-1 transition-colors", "aria-label": "إغلاق" }, React.createElement(CloseIcon, { className: "w-6 h-6" })),
                
                React.createElement("h2", { className: "text-xl font-bold mb-4 border-b pb-2 text-dark-900 dark:text-light-50" }, 'إضافة مجموعة خدمة جديدة'),
                
                React.createElement("form", { id: "service-form", onSubmit: handleSubmit, className: "space-y-4 flex-grow overflow-y-auto pr-2" },
                    React.createElement("input", { 
                        value: formData.id, 
                        onChange: e => setFormData(p => ({...p, id: e.target.value.toLowerCase().replace(/\s/g, '_')})),
                        placeholder: "المعرّف الفريد (e.g., vodafone_cards)", 
                        className: inputClass, 
                        required: true 
                    }),
                    React.createElement("input", { 
                        value: formData.name, 
                        onChange: e => setFormData(p => ({...p, name: e.target.value})),
                        placeholder: "الاسم المعروض (e.g., كروت شحن فودافون)", 
                        className: inputClass, 
                        required: true 
                    }),
                    React.createElement("input", { 
                        value: formData.operator || '', 
                        onChange: e => setFormData(p => ({...p, operator: e.target.value})),
                        placeholder: "اسم المشغل (e.g., Vodafone) - اختياري", 
                        className: inputClass,
                    }),
                    React.createElement("input", { 
                        value: formData.packageBaseName || '', 
                        onChange: e => setFormData(p => ({...p, packageBaseName: e.target.value})),
                        placeholder: "الاسم الأساسي للباقة (مثل: كارت) - اختياري", 
                        className: inputClass,
                    }),
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "service-id-select", className: labelClass }, "نوع الخدمة الرئيسي *"),
                        React.createElement("select", {
                            id: "service-id-select",
                            value: formData.serviceId,
                            onChange: e => setFormData(p => ({ ...p, serviceId: e.target.value })),
                            className: inputClass,
                            required: true
                        },
                            React.createElement("option", { value: "" }, "اختر نوع الخدمة..."),
                            SERVICE_TYPES.map(type => 
                                React.createElement("option", { key: type.id, value: type.id }, type.label)
                            )
                        )
                    )
                ),

                React.createElement("div", { className: "pt-4 border-t border-light-300 dark:border-dark-600 mt-auto flex justify-end gap-2" },
                    React.createElement("button", { type: "button", onClick: onClose, className: `${btnClass} bg-light-200 dark:bg-dark-600` }, "إلغاء"),
                    React.createElement("button", { type: "submit", form: "service-form", className: `${btnClass} bg-primary text-white` }, "حفظ الخدمة")
                )
            )
        )
    );
};

export { ServiceFormModal };