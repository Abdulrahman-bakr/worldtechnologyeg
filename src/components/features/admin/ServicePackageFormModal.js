import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../../icons/index.js';
import { useApp } from '../../../contexts/AppContext.js';

const ServicePackageFormModal = ({ isOpen, onClose, onSave, packageData }) => {
    const { setToastMessage } = useApp();
    const [formData, setFormData] = useState({
        name: '', price: 0, imageUrl: '', cardValue: 0, validity: '',
        showOnCode: true, showOnDirect: true, benefits: '{}'
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

    useEffect(() => {
        if (packageData) {
            setFormData({
                name: packageData.name || (packageData.price ? `كارت ${packageData.price}` : ''),
                price: packageData.price || 0,
                imageUrl: packageData.imageUrl || '',
                cardValue: packageData.cardValue || 0,
                validity: packageData.validity || '',
                showOnCode: packageData.showOnCode !== false,
                showOnDirect: packageData.showOnDirect !== false,
                benefits: packageData.benefits ? JSON.stringify(packageData.benefits, null, 2) : '{}'
            });
        } else {
            setFormData({
                name: '', price: 0, imageUrl: '', cardValue: 0, validity: '',
                showOnCode: true, showOnDirect: true, benefits: '{}'
            });
        }
    }, [packageData, isOpen]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        let benefitsObject = {};
        try {
            if (formData.benefits) {
                benefitsObject = JSON.parse(formData.benefits);
            }
        } catch (error) {
            setToastMessage({ text: "خطأ في تنسيق JSON في حقل المميزات.", type: 'error' });
            return;
        }

        const dataToSave = {
            ...formData,
            price: Number(formData.price) || 0,
            cardValue: Number(formData.cardValue) || 0,
            benefits: benefitsObject,
        };
        onSave(dataToSave);
    };
    
    if (!isOpen) return null;
    
    const inputClass = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:border-primary focus:ring-primary transition-colors";
    const btnClass = "py-2 px-4 rounded-lg font-semibold transition-colors shadow-md";
    const labelClass = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";

    return (
        React.createElement("div", { className: "fixed inset-0 z-[110] flex items-center justify-center p-4", role: "dialog", "aria-modal": "true" },
            React.createElement("div", { className: "modal-overlay absolute inset-0 bg-black/85" }),
            React.createElement("div", { className: "modal-content bg-light-50 dark:bg-dark-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col relative" },
                React.createElement("button", { onClick: onClose, className: "absolute top-4 left-4 text-dark-600 dark:text-dark-300 hover:text-red-500 p-1 transition-colors", "aria-label": "إغلاق" }, React.createElement(CloseIcon, { className: "w-6 h-6" })),
                
                React.createElement("h2", { className: "text-xl font-bold mb-4 border-b pb-2 text-dark-900 dark:text-light-50" }, packageData ? 'تعديل الباقة' : 'إضافة باقة جديدة'),
                
                React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4 flex-grow overflow-y-auto pr-2" },
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement("div", null, React.createElement("label", { className: labelClass }, "اسم الباقة (اختياري)"), React.createElement("input", { value: formData.name || '', onChange: e => setFormData({...formData, name: e.target.value}), placeholder: "e.g., كارت فكة 15", className: inputClass })),
                        React.createElement("div", null, React.createElement("label", { className: labelClass }, "السعر *"), React.createElement("input", { value: formData.price || '', onChange: e => setFormData({...formData, price: e.target.value}), placeholder: "السعر", type: "number", step: "0.01", className: inputClass, required: true })),
                        React.createElement("div", null, React.createElement("label", { className: labelClass }, "قيمة الرصيد"), React.createElement("input", { value: formData.cardValue || '', onChange: e => setFormData({...formData, cardValue: e.target.value}), placeholder: "قيمة الرصيد الصافي", type: "number", step: "0.01", className: inputClass })),
                        React.createElement("div", null, React.createElement("label", { className: labelClass }, "الصلاحية"), React.createElement("input", { value: formData.validity || '', onChange: e => setFormData({...formData, validity: e.target.value}), placeholder: "e.g., 7 أيام", className: inputClass })),
                    ),
                    React.createElement("div", null, React.createElement("label", { className: labelClass }, "رابط الصورة (اختياري)"), React.createElement("input", { value: formData.imageUrl || '', onChange: e => setFormData({...formData, imageUrl: e.target.value}), placeholder: "https://example.com/image.png", className: inputClass })),
                    
                    React.createElement("div", null, 
                        React.createElement("label", { className: labelClass }, "المميزات (بتنسيق JSON)"),
                        React.createElement("textarea", { value: formData.benefits, onChange: e => setFormData({...formData, benefits: e.target.value}), className: `${inputClass} min-h-[120px] font-mono text-sm`, dir: "ltr" })
                    ),
                    
                    React.createElement("div", { className: "flex items-center gap-6 pt-4" },
                        React.createElement("label", { className: "flex items-center gap-2" },
                            React.createElement("input", { type: "checkbox", checked: formData.showOnCode, onChange: e => setFormData({...formData, showOnCode: e.target.checked}), className: "form-checkbox" }),
                            "عرض في شحن الأكواد؟"
                        ),
                        React.createElement("label", { className: "flex items-center gap-2" },
                            React.createElement("input", { type: "checkbox", checked: formData.showOnDirect, onChange: e => setFormData({...formData, showOnDirect: e.target.checked}), className: "form-checkbox" }),
                            "عرض في الشحن المباشر؟"
                        )
                    ),

                    React.createElement("div", { className: "pt-4 border-t border-light-300 dark:border-dark-600 flex justify-end gap-2" },
                        React.createElement("button", { type: "button", onClick: onClose, className: `${btnClass} bg-light-200 dark:bg-dark-600` }, "إلغاء"),
                        React.createElement("button", { type: "submit", className: `${btnClass} bg-primary text-white` }, "حفظ")
                    )
                )
            )
        )
    );
};

export { ServicePackageFormModal };