import React, { useState } from 'react';
import { useApp } from '../../../contexts/AppContext.js';
import { PaperAirplaneIcon } from '../../icons/index.js';

const NotificationManagementPanel = ({ users, handleSendNotification }) => {
    const { setToastMessage } = useApp();
    const [targetType, setTargetType] = useState('all');
    const [userIdentifier, setUserIdentifier] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [icon, setIcon] = useState('MegaphoneIcon');
    const [linkAction, setLinkAction] = useState('');
    const [linkParams, setLinkParams] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !message) {
            setToastMessage({ text: 'العنوان والرسالة مطلوبان.', type: 'error' });
            return;
        }
        if (targetType === 'user' && !userIdentifier) {
            setToastMessage({ text: 'يرجى إدخال البريد الإلكتروني أو ID للمستخدم المحدد.', type: 'error' });
            return;
        }

        let parsedParams = {};
        if (linkParams) {
            try {
                parsedParams = JSON.parse(linkParams);
            } catch (err) {
                setToastMessage({ text: 'خطأ في تنسيق JSON في حقل البارامترات.', type: 'error' });
                return;
            }
        }
        
        setIsSending(true);
        const notificationData = {
            title,
            message,
            icon,
            link: linkAction ? { action: linkAction, params: parsedParams } : null,
        };
        
        const target = targetType === 'all' 
            ? { type: 'all' } 
            : { type: 'user', identifier: userIdentifier.trim() };
            
        const result = await handleSendNotification(target, notificationData);

        if (result.success) {
            setToastMessage({ text: `تم إرسال الإشعار بنجاح إلى ${result.sentTo} مستخدم.`, type: 'success' });
            // Reset form
            setTitle('');
            setMessage('');
            setUserIdentifier('');
            setLinkAction('');
            setLinkParams('');
        } else {
            setToastMessage({ text: result.error || 'فشل إرسال الإشعار.', type: 'error' });
        }
        setIsSending(false);
    };

    const inputClass = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50";
    const labelClass = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";
    
    return (
        React.createElement("div", { className: "max-w-4xl mx-auto" },
            React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6" }, "إرسال إشعارات للمستخدمين"),
            React.createElement("form", { onSubmit: handleSubmit, className: "p-6 bg-white dark:bg-dark-800 rounded-lg border border-light-200 dark:border-dark-700 space-y-6" },
                React.createElement("fieldset", null,
                    React.createElement("legend", { className: labelClass }, "الجمهور المستهدف"),
                    React.createElement("div", { className: "flex flex-wrap gap-4" },
                        React.createElement("label", { className: "flex items-center gap-2 cursor-pointer" }, React.createElement("input", { type: "radio", name: "targetType", value: "all", checked: targetType === 'all', onChange: () => setTargetType('all'), className: "form-radio" }), `كل المستخدمين (${users.length})`),
                        React.createElement("label", { className: "flex items-center gap-2 cursor-pointer" }, React.createElement("input", { type: "radio", name: "targetType", value: "user", checked: targetType === 'user', onChange: () => setTargetType('user'), className: "form-radio" }), "مستخدم محدد")
                    )
                ),
                targetType === 'user' && React.createElement("div", null,
                    React.createElement("label", { htmlFor: "user-identifier", className: labelClass }, "البريد الإلكتروني أو ID للمستخدم"),
                    React.createElement("input", { id: "user-identifier", value: userIdentifier, onChange: (e) => setUserIdentifier(e.target.value), className: inputClass, placeholder: "e.g., user@example.com" })
                ),
                React.createElement("div", null, React.createElement("label", { htmlFor: "notif-title", className: labelClass }, "العنوان *"), React.createElement("input", { id: "notif-title", value: title, onChange: (e) => setTitle(e.target.value), className: inputClass, required: true })),
                React.createElement("div", null, React.createElement("label", { htmlFor: "notif-message", className: labelClass }, "الرسالة *"), React.createElement("textarea", { id: "notif-message", value: message, onChange: (e) => setMessage(e.target.value), className: `${inputClass} min-h-[100px]`, required: true })),
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" },
                    React.createElement("div", null, React.createElement("label", { htmlFor: "notif-icon", className: labelClass }, "الأيقونة"), 
                        React.createElement("select", { id: "notif-icon", value: icon, onChange: (e) => setIcon(e.target.value), className: inputClass },
                            React.createElement("option", { value: "MegaphoneIcon" }, "إعلان"),
                            React.createElement("option", { value: "StarIcon" }, "مكافأة"),
                            React.createElement("option", { value: "ShoppingBagIcon" }, "منتج"),
                            React.createElement("option", { value: "PhoneIcon" }, "تواصل")
                        )
                    ),
                    React.createElement("div", null, React.createElement("label", { htmlFor: "notif-link-action", className: labelClass }, "إجراء الرابط (اختياري)"), React.createElement("input", { id: "notif-link-action", value: linkAction, onChange: (e) => setLinkAction(e.target.value), className: inputClass, placeholder: "e.g., navigateToSpecialOffers" })),
                    React.createElement("div", null, React.createElement("label", { htmlFor: "notif-link-params", className: labelClass }, "بارامترات الرابط (JSON)"), React.createElement("input", { id: "notif-link-params", value: linkParams, onChange: (e) => setLinkParams(e.target.value), className: inputClass, placeholder: '{"category": "Chargers"}' }))
                ),
                React.createElement("div", { className: "pt-4 border-t border-light-300 dark:border-dark-600" },
                    React.createElement("button", { type: "submit", disabled: isSending, className: "admin-btn admin-btn-primary w-full sm:w-auto" },
                        React.createElement(PaperAirplaneIcon, { className: "w-5 h-5" }),
                        isSending ? "جاري الإرسال..." : "إرسال الإشعار"
                    )
                )
            )
        )
    );
};

export { NotificationManagementPanel };