import React, { useState, useEffect } from 'react';
import { CloseIcon, ArrowUpOnSquareIcon } from '../../icons/index.js';
import { useApp } from '../../../contexts/AppContext.js';

const AnnouncementFormModal = ({ isOpen, onClose, onSave, announcement, onImageUpload }) => {
    const [isUploading, setIsUploading] = useState(false);
    const { setToastMessage } = useApp();
    const [formData, setFormData] = useState({
        title: '', message: '', icon: 'MegaphoneIcon', isActive: true, 
        imageUrl: '', link: { action: '', params: '' }
    });

    useEffect(() => {
        if (announcement) {
            setFormData({
                title: announcement.title || '',
                message: announcement.message || '',
                icon: announcement.icon || 'MegaphoneIcon',
                isActive: announcement.isActive !== false,
                imageUrl: announcement.imageUrl || '',
                link: announcement.link ? {
                    action: announcement.link.action || '',
                    params: typeof announcement.link.params === 'object' ? JSON.stringify(announcement.link.params, null, 2) : announcement.link.params || ''
                } : { action: '', params: '' }
            });
        } else {
            setFormData({
                title: '', message: '', icon: 'MegaphoneIcon', isActive: true, 
                imageUrl: '', link: { action: '', params: '' }
            });
        }
    }, [announcement, isOpen]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const url = await onImageUpload(file);
        if (url) {
            setFormData(prev => ({ ...prev, imageUrl: url }));
        }
        setIsUploading(false);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        let paramsObject = {};
        try {
            if (formData.link.params) {
                paramsObject = JSON.parse(formData.link.params);
            }
        } catch (error) {
            setToastMessage({ text: "خطأ في تنسيق JSON في حقل البارامترات.", type: 'error' });
            return;
        }

        const dataToSave = {
            id: announcement?.id,
            ...formData,
            link: {
                action: formData.link.action,
                params: paramsObject
            }
        };
        onSave(dataToSave);
    };
    
    if (!isOpen) return null;

    const inputClass = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50";
    const labelClass = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";
    const btnClass = "py-2 px-4 rounded-lg font-semibold";

    return (
        React.createElement("div", { className: "fixed inset-0 z-[110] flex items-center justify-center p-4" },
            React.createElement("div", { className: "modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: onClose }),
            React.createElement("div", { className: "modal-content bg-light-50 dark:bg-dark-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col relative" },
                React.createElement("button", { onClick: onClose, className: "absolute top-4 left-4 p-1" }, React.createElement(CloseIcon, { className: "w-6 h-6" })),
                React.createElement("h2", { className: "text-xl font-bold mb-4" }, announcement ? 'تعديل الإعلان' : 'إضافة إعلان جديد'),
                React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4 flex-grow overflow-y-auto pr-2" },
                    React.createElement("div", null, React.createElement("label", {className: labelClass}, "العنوان *"), React.createElement("input", { value: formData.title, onChange: e => setFormData({...formData, title: e.target.value}), placeholder: "العنوان", className: inputClass, required: true })),
                    React.createElement("div", null, React.createElement("label", {className: labelClass}, "الرسالة *"), React.createElement("textarea", { value: formData.message, onChange: e => setFormData({...formData, message: e.target.value}), placeholder: "الرسالة", className: `${inputClass} min-h-[80px]`, required: true })),
                    React.createElement("div", null, 
                        React.createElement("label", {className: labelClass}, "رابط صورة (اختياري)"), 
                        React.createElement("div", {className: "flex gap-2"},
                            React.createElement("input", { value: formData.imageUrl, onChange: e => setFormData({...formData, imageUrl: e.target.value}), placeholder: "https://example.com/image.png", className: inputClass }),
                            React.createElement("label", { className: `${btnClass} bg-light-200 dark:bg-dark-600 text-sm cursor-pointer`}, isUploading ? '...' : React.createElement(ArrowUpOnSquareIcon, {className: "w-5 h-5"}), React.createElement("input",{type: "file", className: "hidden", onChange: handleFileChange}))
                        )
                    ),
                    React.createElement("h3", { className: "text-lg font-semibold border-t pt-4 mt-4" }, "الرابط (اختياري)"),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement("div", null, React.createElement("label", {className: labelClass}, "Action"), React.createElement("input", { value: formData.link.action, onChange: e => setFormData({...formData, link: {...formData.link, action: e.target.value}}), placeholder: "e.g., selectProductSuggestion", className: inputClass })),
                        React.createElement("div", null, React.createElement("label", {className: labelClass}, "Parameters (JSON)"), React.createElement("textarea", { value: formData.link.params, onChange: e => setFormData({...formData, link: {...formData.link, params: e.target.value}}), placeholder: `{"productId": "prod_1"}`, className: `${inputClass} h-24` }))
                    ),
                    React.createElement("label", { className: "flex items-center gap-2 pt-4" },
                        React.createElement("input", { type: "checkbox", checked: formData.isActive, onChange: e => setFormData({...formData, isActive: e.target.checked}), className: "form-checkbox" }),
                        "فعال؟"
                    ),
                    React.createElement("div", { className: "pt-4 flex justify-end gap-2" },
                        React.createElement("button", { type: "button", onClick: onClose, className: `${btnClass} bg-light-200 dark:bg-dark-600` }, "إلغاء"),
                        React.createElement("button", { type: "submit", className: `${btnClass} bg-primary text-white` }, "حفظ")
                    )
                )
            )
        )
    );
};

export { AnnouncementFormModal };