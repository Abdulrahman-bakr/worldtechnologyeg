import React, { useState, useEffect } from 'react';
import { useApp } from '../../../contexts/AppContext.js';

const StoreSettingsPanel = ({ storeSettings, handleStoreSettingsSave, isLoading }) => {
    const { setToastMessage } = useApp();
    const [formData, setFormData] = useState({
        contactEmail: '',
        contactPhone: '',
        whatsappNumber: '',
        facebookUrl: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (storeSettings) {
            setFormData({
                contactEmail: storeSettings.contactEmail || '',
                contactPhone: storeSettings.contactPhone || '',
                whatsappNumber: storeSettings.whatsappNumber || '',
                facebookUrl: storeSettings.facebookUrl || '',
            });
        }
    }, [storeSettings]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const result = await handleStoreSettingsSave(formData);
        if (result.success) {
            setToastMessage({ text: 'تم حفظ الإعدادات بنجاح!', type: 'success' });
        } else {
            setToastMessage({ text: 'حدث خطأ أثناء حفظ الإعدادات.', type: 'error' });
        }
        setIsSaving(false);
    };

    const inputClass = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:border-primary focus:ring-primary transition-colors";
    const labelClass = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";

    if (isLoading) {
        return React.createElement("p", null, "جاري تحميل الإعدادات...");
    }

    return (
        React.createElement("div", null,
            React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6" }, "إعدادات المتجر الرئيسية"),
            React.createElement("div", { className: "max-w-4xl" },
                React.createElement("form", { onSubmit: handleSubmit, className: "space-y-6 p-6 bg-white dark:bg-dark-800 rounded-lg border border-light-200 dark:border-dark-700" },
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "contactEmail", className: labelClass }, "البريد الإلكتروني للتواصل"),
                        React.createElement("input", { type: "email", id: "contactEmail", value: formData.contactEmail, onChange: (e) => setFormData({ ...formData, contactEmail: e.target.value }), className: inputClass, placeholder: "example@email.com" })
                    ),
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "contactPhone", className: labelClass }, "رقم الهاتف (للاتصال)"),
                        React.createElement("input", { type: "tel", id: "contactPhone", value: formData.contactPhone, onChange: (e) => setFormData({ ...formData, contactPhone: e.target.value }), className: inputClass, placeholder: "01xxxxxxxxx" })
                    ),
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "whatsappNumber", className: labelClass }, "رقم واتساب (مع كود الدولة)"),
                        React.createElement("input", { type: "tel", id: "whatsappNumber", value: formData.whatsappNumber, onChange: (e) => setFormData({ ...formData, whatsappNumber: e.target.value }), className: inputClass, placeholder: "201xxxxxxxxx" })
                    ),
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "facebookUrl", className: labelClass }, "رابط صفحة فيسبوك"),
                        React.createElement("input", { type: "url", id: "facebookUrl", value: formData.facebookUrl, onChange: (e) => setFormData({ ...formData, facebookUrl: e.target.value }), className: inputClass, placeholder: "https://facebook.com/yourpage" })
                    ),
                    React.createElement("div", { className: "pt-4 border-t border-light-300 dark:border-dark-600" },
                        React.createElement("button", { type: "submit", disabled: isSaving, className: "admin-btn admin-btn-primary w-full sm:w-auto" },
                            isSaving ? "جاري الحفظ..." : "حفظ التغييرات"
                        )
                    )
                )
            )
        )
    );
};

export { StoreSettingsPanel };