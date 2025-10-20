import React, { useState, useEffect } from 'react';
import { CloseIcon, ArrowUpOnSquareIcon } from '../../icons/index.js';
import { ToggleSwitch } from '../../ui/ToggleSwitch.js';

const PopupBannerFormModal = ({ isOpen, onClose, onSave, banner, onImageUpload }) => {
    const initialFormState = {
        title: '',
        isActive: true,
        trigger: 'timed', // 'entry', 'timed'
        triggerValue: 5, // seconds for 'timed'
        frequency: 'once', // 'once', 'every'
        type: 'image', // 'image', 'newsletter'
        // Image type fields
        imageUrl: '',
        headline: '',
        buttonText: 'تسوق الآن',
        buttonLink: '',
        // Newsletter type fields
        newsletterHeadline: 'انضم وكن أول من يعرف!',
        newsletterSubheadline: 'احصل على خصم 10% على طلبك الأول.',
    };
    const [formData, setFormData] = useState(initialFormState);
    const [isUploading, setIsUploading] = useState(false);
    
    useEffect(() => {
        if (banner) {
            setFormData({ ...initialFormState, ...banner });
        } else {
            setFormData(initialFormState);
        }
    }, [banner, isOpen]);

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
        onSave({ id: banner?.id, ...formData });
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
                React.createElement("h2", { className: "text-xl font-bold mb-4" }, banner ? 'تعديل الإعلان المنبثق' : 'إضافة إعلان منبثق جديد'),
                React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4 flex-grow overflow-y-auto pr-2" },
                    // --- General Settings ---
                    React.createElement("div", null, React.createElement("label", {className: labelClass}, "العنوان الداخلي (للإدارة) *"), React.createElement("input", { value: formData.title, onChange: e => setFormData({...formData, title: e.target.value}), className: inputClass, required: true })),
                    React.createElement("div", { className: "flex items-center gap-4" },
                        React.createElement("label", {className: labelClass}, "الحالة:"),
                        React.createElement(ToggleSwitch, { enabled: formData.isActive, onChange: () => setFormData(p => ({...p, isActive: !p.isActive})) })
                    ),
                    
                    // --- Display Rules ---
                    React.createElement("h3", { className: "text-lg font-semibold border-t pt-4 mt-4" }, "قواعد الظهور"),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement("div", null, 
                            React.createElement("label", {className: labelClass}, "متى يظهر الإعلان؟"),
                            React.createElement("select", { value: formData.trigger, onChange: e => setFormData({...formData, trigger: e.target.value}), className: inputClass },
                                React.createElement("option", {value: "entry"}, "فور دخول الموقع"),
                                React.createElement("option", {value: "timed"}, "بعد مرور مدة")
                            )
                        ),
                        formData.trigger === 'timed' && React.createElement("div", { className: "" },
                            React.createElement("label", {className: labelClass}, "المدة (بالثواني)"),
                            React.createElement("input", { type: "number", value: formData.triggerValue, onChange: e => setFormData({...formData, triggerValue: Number(e.target.value) || 0}), className: inputClass })
                        ),
                        React.createElement("div", null, 
                            React.createElement("label", {className: labelClass}, "تكرار الظهور"),
                            React.createElement("select", { value: formData.frequency, onChange: e => setFormData({...formData, frequency: e.target.value}), className: inputClass },
                                React.createElement("option", {value: "once"}, "مرة واحدة لكل زائر"),
                                React.createElement("option", {value: "every"}, "في كل زيارة")
                            )
                        )
                    ),
                    
                    // --- Content Settings ---
                    React.createElement("h3", { className: "text-lg font-semibold border-t pt-4 mt-4" }, "محتوى الإعلان"),
                    React.createElement("div", { className: "p-2 bg-light-100 dark:bg-dark-700 rounded-md" },
                        React.createElement("label", {className: labelClass}, "نوع المحتوى"),
                        React.createElement("select", { value: formData.type, onChange: e => setFormData({...formData, type: e.target.value}), className: inputClass },
                            React.createElement("option", {value: "image"}, "صورة إعلانية"),
                            React.createElement("option", {value: "newsletter"}, "اشتراك في النشرة البريدية")
                        )
                    ),
                    
                    formData.type === 'image' && React.createElement("div", { className: "space-y-4 p-4 border rounded-md" },
                        React.createElement("div", null, React.createElement("label", {className: labelClass}, "العنوان الرئيسي (اختياري)"), React.createElement("input", { value: formData.headline, onChange: e => setFormData({...formData, headline: e.target.value}), className: inputClass })),
                        React.createElement("div", null, 
                            React.createElement("label", {className: labelClass}, "صورة الإعلان *"),
                            React.createElement("div", {className: "flex gap-2"},
                                React.createElement("input", { value: formData.imageUrl, onChange: e => setFormData({...formData, imageUrl: e.target.value}), placeholder: "https://example.com/image.png", className: inputClass, required: true }),
                                React.createElement("label", { className: `${btnClass} bg-light-200 dark:bg-dark-600 text-sm cursor-pointer`}, isUploading ? '...' : React.createElement(ArrowUpOnSquareIcon, {className: "w-5 h-5"}), React.createElement("input",{type: "file", className: "hidden", onChange: handleFileChange}))
                            )
                        ),
                        React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                            React.createElement("div", null, React.createElement("label", {className: labelClass}, "نص الزر"), React.createElement("input", { value: formData.buttonText, onChange: e => setFormData({...formData, buttonText: e.target.value}), className: inputClass })),
                            React.createElement("div", null, React.createElement("label", {className: labelClass}, "رابط الزر *"), React.createElement("input", { value: formData.buttonLink, onChange: e => setFormData({...formData, buttonLink: e.target.value}), className: inputClass, required: true, placeholder: "/products" }))
                        )
                    ),

                    formData.type === 'newsletter' && React.createElement("div", { className: "space-y-4 p-4 border rounded-md" },
                        React.createElement("div", null, React.createElement("label", {className: labelClass}, "العنوان الرئيسي *"), React.createElement("input", { value: formData.newsletterHeadline, onChange: e => setFormData({...formData, newsletterHeadline: e.target.value}), className: inputClass, required: true })),
                        React.createElement("div", null, React.createElement("label", {className: labelClass}, "العنوان الفرعي *"), React.createElement("input", { value: formData.newsletterSubheadline, onChange: e => setFormData({...formData, newsletterSubheadline: e.target.value}), className: inputClass, required: true }))
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

export { PopupBannerFormModal };