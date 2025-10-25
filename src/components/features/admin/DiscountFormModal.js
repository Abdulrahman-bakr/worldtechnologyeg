import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../../icons/index.js';

const DiscountFormModal = ({ isOpen, onClose, onSave, discount, products }) => {
    const [formData, setFormData] = useState({
        code: '', type: 'percentage', value: 0, expiryDate: '',
        minPurchase: 0, usageLimit: 0, applicableCategories: '', applicableProducts: ''
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
        if (discount) {
            setFormData({
                ...discount,
                minPurchase: discount.minPurchase || 0,
                usageLimit: discount.usageLimit || 0,
                applicableCategories: Array.isArray(discount.applicableCategories) ? discount.applicableCategories.join(',') : '',
                applicableProducts: Array.isArray(discount.applicableProducts) ? discount.applicableProducts.join(',') : '',
                expiryDate: discount.expiryDate?.toDate ? discount.expiryDate.toDate().toISOString().slice(0, 10) : ''
            });
        } else {
            setFormData({
                code: '', type: 'percentage', value: 0, expiryDate: '',
                minPurchase: 0, usageLimit: 0, applicableCategories: '', applicableProducts: ''
            });
        }
    }, [discount, isOpen]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            id: discount?.id,
            value: Number(formData.value) || 0,
            minPurchase: Number(formData.minPurchase) || 0,
            usageLimit: Number(formData.usageLimit) || 0,
            applicableCategories: formData.applicableCategories.split(',').map(s => s.trim()).filter(Boolean),
            applicableProducts: formData.applicableProducts.split(',').map(s => s.trim()).filter(Boolean),
        };
        onSave(dataToSave);
    };
    
    if (!isOpen) return null;

    const inputClass = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50";
    const labelClass = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";
    const btnClass = "py-2 px-4 rounded-lg font-semibold";

    return (
        React.createElement("div", { className: "fixed inset-0 z-[110] flex items-center justify-center p-4" },
            React.createElement("div", { className: "modal-overlay absolute inset-0 bg-black/85" }),
            React.createElement("div", { className: "modal-content bg-light-50 dark:bg-dark-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col relative" },
                React.createElement("button", { onClick: onClose, className: "absolute top-4 left-4 p-1" }, React.createElement(CloseIcon, { className: "w-6 h-6" })),
                React.createElement("h2", { className: "text-xl font-bold mb-4" }, discount ? 'تعديل الكوبون' : 'إضافة كوبون جديد'),
                React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4 flex-grow overflow-y-auto pr-2" },
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement("div", null, React.createElement("label", {className: labelClass}, "كود الخصم"), React.createElement("input", { value: formData.code, onChange: e => setFormData({...formData, code: e.target.value.toUpperCase()}), placeholder: "e.g., RAMADAN25", className: inputClass, required: true })),
                        React.createElement("div", null, React.createElement("label", {className: labelClass}, "نوع الخصم"), React.createElement("select", { value: formData.type, onChange: e => setFormData({...formData, type: e.target.value}), className: inputClass }, React.createElement("option", { value: "percentage" }, "نسبة مئوية"), React.createElement("option", { value: "fixed" }, "مبلغ ثابت"))),
                        React.createElement("div", null, React.createElement("label", {className: labelClass}, "قيمة الخصم"), React.createElement("input", { value: formData.value, onChange: e => setFormData({...formData, value: e.target.value}), placeholder: "القيمة", type: "number", step: "0.01", className: inputClass, required: true })),
                        React.createElement("div", null, React.createElement("label", {className: labelClass}, "تاريخ الانتهاء (اختياري)"), React.createElement("input", { value: formData.expiryDate, onChange: e => setFormData({...formData, expiryDate: e.target.value}), type: "date", className: inputClass })),
                    ),
                    React.createElement("h3", { className: "text-lg font-semibold border-t pt-4 mt-4" }, "شروط متقدمة (اختياري)"),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement("div", null, React.createElement("label", {className: labelClass}, "الحد الأدنى للشراء (ج.م)"), React.createElement("input", { value: formData.minPurchase, onChange: e => setFormData({...formData, minPurchase: e.target.value}), placeholder: "0", type: "number", step: "0.01", className: inputClass })),
                        React.createElement("div", null, React.createElement("label", {className: labelClass}, "حد الاستخدام الأقصى"), React.createElement("input", { value: formData.usageLimit, onChange: e => setFormData({...formData, usageLimit: e.target.value}), placeholder: "0 (غير محدود)", type: "number", className: inputClass }))
                    ),
                     React.createElement("div", null, React.createElement("label", {className: labelClass}, "تطبيق على فئات محددة (افصل بينها بفاصلة)"), React.createElement("textarea", { value: formData.applicableCategories, onChange: e => setFormData({...formData, applicableCategories: e.target.value}), placeholder: "e.g., Chargers,Cables", className: `${inputClass} h-20` })),
                     React.createElement("div", null, React.createElement("label", {className: labelClass}, "تطبيق على منتجات محددة (افصل بينها بفاصلة)"), React.createElement("textarea", { value: formData.applicableProducts, onChange: e => setFormData({...formData, applicableProducts: e.target.value}), placeholder: "e.g., prod_1,prod_2", className: `${inputClass} h-20` })),

                    React.createElement("div", { className: "pt-4 flex justify-end gap-2" },
                        React.createElement("button", { type: "button", onClick: onClose, className: `${btnClass} bg-light-200 dark:bg-dark-600` }, "إلغاء"),
                        React.createElement("button", { type: "submit", className: `${btnClass} bg-primary text-white` }, "حفظ")
                    )
                )
            )
        )
    );
};

export { DiscountFormModal };