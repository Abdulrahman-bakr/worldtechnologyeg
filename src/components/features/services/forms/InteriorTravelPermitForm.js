import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ShoppingCartIcon, InfoIcon, UserIcon, ShieldCheckIcon, AtSymbolIcon, MapPinIcon, CalendarDaysIcon, ClipboardDocumentIcon, EyeIcon, EyeSlashIcon } from '../../../icons/index.js';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';
import { EGYPT_GOVERNORATES_DATA } from '../../../../constants/governorates.js';

const TRAVEL_PORTS = [
    "مطار القاهرة الجوى",
    "مطار برج العرب الجوى",
    "مطار الأقصر الجوى",
    "مطار سوهاج الجوى",
    "ميناء سفاجا البحرى",
    "ميناء نويبع البحرى",
    "ميناء السلوم البرى",
    "منفذ أرقين البرى",
    "منفذ قسطل البرى",
    "مطار أسيوط الجوى",
    "مطار أسوان الجوى",
    "ميناء الغردقة البحري",
    "مطار الغردقة الجوي",
    "مطار شرم الشيخ الجوي",
    "منفذ رفح البري",
    "ميناء أسوان النهري",
    "ميناء الإسكندرية البحري",
    "مطار مرسي علم الجوي",
    "مطار العلمين الجوي",
    "منفذ طابا البري",
    "مارينا طابا",
    "ميناء شرم الشيخ البحري",
    "مارينا مرسي غالب",
    "مطار سفنكس"
];

export const InteriorTravelPermitForm = ({ product, onInitiateDirectCheckout }) => {
    const [hasPreviousPermit, setHasPreviousPermit] = useState(null);
    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isCheckoutDisabled = useMemo(() => {
        if (hasPreviousPermit === null || !formData.travelDate || !formData.travelPort) {
            return true;
        }
        if (hasPreviousPermit === 'yes') {
            return !formData.identifier || !formData.password;
        }
        if (hasPreviousPermit === 'no') {
            return !formData.fullName || !formData.email || !formData.address || !formData.job || !formData.mobile || !formData.nationalId || formData.nationalId.length !== 14 || !formData.motherName || !formData.factoryNumber || !formData.governorate;
        }
        return true;
    }, [hasPreviousPermit, formData]);

    const handleCheckout = () => {
        if (isCheckoutDisabled) {
            setFormError("يرجى ملء جميع الحقول المطلوبة بشكل صحيح.");
            return;
        }
        setFormError('');

        let finalFormData = [];
        if (hasPreviousPermit === 'yes') {
            finalFormData = [
                { label: 'سبق له التقديم', value: 'نعم' },
                { label: 'البريد الإلكتروني أو الرقم القومي', value: formData.identifier },
                { label: 'كلمة المرور', value: formData.password },
            ];
        } else {
            finalFormData = [
                { label: 'سبق له التقديم', value: 'لا (أول مرة)' },
                { label: 'الاسم بالكامل', value: formData.fullName },
                { label: 'البريد الإلكتروني', value: formData.email },
                { label: 'العنوان', value: formData.address },
                { label: 'الوظيفة', value: formData.job },
                { label: 'رقم المحمول', value: formData.mobile },
                { label: 'الرقم القومي', value: formData.nationalId },
                { label: 'اسم الأم (المقطع الأول)', value: formData.motherName },
                { label: 'رقم المصنع', value: formData.factoryNumber },
                { label: 'المحافظة', value: formData.governorate },
            ];
        }

        finalFormData.push({ label: 'تاريخ السفر', value: formData.travelDate });
        finalFormData.push({ label: 'منفذ السفر', value: formData.travelPort });
        
        onInitiateDirectCheckout(product, {
            finalPrice: product.price,
            formData: finalFormData
        });
    };
    
    const labelClass = "block text-sm font-semibold mb-2 text-dark-800 dark:text-dark-100";
    const selectClass = "w-full p-3.5 rounded-xl border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 4 5\"><path fill=\"%236B7280\" d=\"M2 0L0 2h4zm0 5L0 3h4z\"/></svg>')] bg-no-repeat bg-[length:12px] bg-[right:1rem_center] pr-10";
    const inputClass = "w-full p-3.5 rounded-xl border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200";
    const today = new Date().toISOString().split('T')[0];

    return React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "text-center mb-2" },
            React.createElement("h3", { 
                className: "text-xl font-bold text-dark-900 dark:text-white mb-2" 
            }, product.arabicName),
            React.createElement("p", { 
                className: "text-sm text-dark-600 dark:text-dark-300" 
            }, "املأ بياناتك للحصول على تصريح سفر")
        ),
        React.createElement("div", { className: "flex items-center justify-center mb-6" },
            React.createElement("div", { className: "flex items-center" },
                React.createElement("div", { 
                    className: `flex items-center justify-center w-8 h-8 rounded-full ${hasPreviousPermit !== null ? 'bg-primary text-white' : 'bg-light-200 dark:bg-dark-700 text-dark-500 dark:text-dark-400'} font-semibold text-sm` 
                }, "1"),
                React.createElement("div", { 
                    className: `w-16 h-1 mx-2 ${hasPreviousPermit !== null && !isCheckoutDisabled ? 'bg-primary' : 'bg-light-300 dark:bg-dark-600'}` 
                }),
                React.createElement("div", { 
                    className: `flex items-center justify-center w-8 h-8 rounded-full ${isCheckoutDisabled ? 'bg-light-200 dark:bg-dark-700 text-dark-500 dark:text-dark-400' : 'bg-primary text-white'} font-semibold text-sm` 
                }, "2")
            )
        ),
        React.createElement("div", { className: "bg-white dark:bg-dark-700 rounded-2xl p-6 border border-light-200 dark:border-dark-600 shadow-soft" },
            React.createElement("form", { 
                onSubmit: (e) => { e.preventDefault(); handleCheckout(); }, 
                className: "space-y-6" 
            },
                React.createElement("div", null,
                    React.createElement("div", { className: "flex items-center gap-3 mb-4" },
                        React.createElement("div", { 
                            className: "flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl" 
                        },
                            React.createElement(ShieldCheckIcon, { className: "w-5 h-5 text-primary" })
                        ),
                        React.createElement("h4", { 
                            className: "text-lg font-semibold text-dark-900 dark:text-white" 
                        }, "هل سبق لك استخراج تصريح سفر من قبل؟ *")
                    ),
                    React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                        React.createElement("button", { 
                            type: "button", 
                            onClick: () => setHasPreviousPermit('yes'),
                            className: `p-4 text-center rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] ${
                                hasPreviousPermit === 'yes' 
                                    ? 'border-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-md' 
                                    : 'border-light-300 dark:border-dark-600 hover:border-primary/50 hover:bg-light-50 dark:hover:bg-dark-600'
                            }` 
                        }, "نعم، لدي حساب"),
                        React.createElement("button", { 
                            type: "button", 
                            onClick: () => setHasPreviousPermit('no'),
                            className: `p-4 text-center rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] ${
                                hasPreviousPermit === 'no' 
                                    ? 'border-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-md' 
                                    : 'border-light-300 dark:border-dark-600 hover:border-primary/50 hover:bg-light-50 dark:hover:bg-dark-600'
                            }` 
                        }, "لا، هذه أول مرة")
                    )
                ),
                hasPreviousPermit === 'yes' && React.createElement("div", { className: "space-y-4 pt-4 border-t border-light-200 dark:border-dark-600" },
                    React.createElement("div", { className: "flex items-center gap-3 mb-4" },
                        React.createElement("div", { 
                            className: "flex items-center justify-center w-8 h-8 bg-secondary/10 rounded-lg" 
                        },
                            React.createElement(UserIcon, { className: "w-4 h-4 text-secondary" })
                        ),
                        React.createElement("h5", { 
                            className: "text-md font-semibold text-dark-900 dark:text-white" 
                        }, "بيانات الحساب الحالي")
                    ),
                    React.createElement(FloatingInput, { 
                        id: "identifier", 
                        value: formData.identifier || '', 
                        onChange: e => setFormData(p => ({...p, identifier: e.target.value})), 
                        placeholder: "البريد الإلكتروني أو الرقم القومي *"
                    }),
                    React.createElement("div", { className: "relative" },
                        React.createElement(FloatingInput, { 
                            id: "password", 
                            value: formData.password || '', 
                            onChange: e => setFormData(p => ({...p, password: e.target.value})), 
                            placeholder: "كلمة المرور *", 
                            type: isPasswordVisible ? 'text' : 'password'
                        }),
                        React.createElement("button", {
                            type: "button",
                            onClick: () => setIsPasswordVisible(prev => !prev),
                            className: "absolute top-1/2 -translate-y-1/2 left-3 text-dark-600 dark:text-dark-300", "aria-label": "Toggle password visibility"
                        }, isPasswordVisible ? React.createElement(EyeSlashIcon, { className: "w-5 h-5" }) : React.createElement(EyeIcon, { className: "w-5 h-5" }))
                    )
                ),
                hasPreviousPermit === 'no' && React.createElement("div", { className: "space-y-5 pt-4 border-t border-light-200 dark:border-dark-600" },
                    React.createElement("div", { className: "flex items-center gap-3 mb-4" },
                        React.createElement("div", { 
                            className: "flex items-center justify-center w-8 h-8 bg-green-500/10 rounded-lg" 
                        },
                            React.createElement(UserIcon, { className: "w-4 h-4 text-green-500" })
                        ),
                        React.createElement("h5", { 
                            className: "text-md font-semibold text-dark-900 dark:text-white" 
                        }, "بيانات المستخدم الجديد")
                    ),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement(FloatingInput, { id: "fullName", value: formData.fullName || '', onChange: e => setFormData(p => ({...p, fullName: e.target.value})), placeholder: "الاسم (من بطاقة الرقم القومي) *" }),
                        React.createElement(FloatingInput, { id: "email", value: formData.email || '', onChange: e => setFormData(p => ({...p, email: e.target.value})), placeholder: "البريد الإلكتروني *", type: "email" })
                    ),
                    React.createElement(FloatingInput, { id: "address", value: formData.address || '', onChange: e => setFormData(p => ({...p, address: e.target.value})), placeholder: "العنوان *" }),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement(FloatingInput, { id: "job", value: formData.job || '', onChange: e => setFormData(p => ({...p, job: e.target.value})), placeholder: "الوظيفة *" }),
                        React.createElement(FloatingInput, { id: "mobile", value: formData.mobile || '', onChange: e => setFormData(p => ({...p, mobile: e.target.value.replace(/\D/g, '')})), placeholder: "رقم المحمول *", type: "tel", maxLength: 11 })
                    ),
                    React.createElement(FloatingInput, { id: "nationalId", value: formData.nationalId || '', onChange: e => setFormData(p => ({...p, nationalId: e.target.value.replace(/\D/g, '')})), placeholder: "الرقم القومي (14 رقم) *", type: "tel", maxLength: 14 }),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement(FloatingInput, { id: "motherName", value: formData.motherName || '', onChange: e => setFormData(p => ({...p, motherName: e.target.value})), placeholder: "المقطع الأول من اسم الأم *" }),
                        React.createElement("div", null,
                            React.createElement(FloatingInput, { id: "factoryNumber", value: formData.factoryNumber || '', onChange: e => setFormData(p => ({...p, factoryNumber: e.target.value})), placeholder: "رقم المصنع *" }),
                            React.createElement("p", { className: "text-xs text-dark-500 dark:text-dark-400 mt-2 px-1 flex items-center gap-1" }, React.createElement(InfoIcon, { className: "w-3 h-3 flex-shrink-0" }), "موجود في بطاقتك أسفل تاريخ الميلاد")
                        )
                    ),
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "governorate", className: labelClass }, "المحافظة *"),
                        React.createElement("select", { id: "governorate", value: formData.governorate || '', onChange: e => setFormData(p => ({...p, governorate: e.target.value})), className: selectClass },
                            React.createElement("option", { value: "" }, "اختر المحافظة..."),
                            Object.keys(EGYPT_GOVERNORATES_DATA).map(gov => React.createElement("option", { key: gov, value: gov }, gov))
                        )
                    )
                ),
                
                hasPreviousPermit && React.createElement("div", { className: "space-y-5 pt-4 border-t border-light-200 dark:border-dark-600" },
                     React.createElement("div", { className: "flex items-center gap-3" },
                        React.createElement("div", { className: "flex items-center justify-center w-8 h-8 bg-purple-500/10 rounded-lg" }, React.createElement(MapPinIcon, { className: "w-4 h-4 text-purple-500" })),
                        React.createElement("h5", { className: "text-md font-semibold text-dark-900 dark:text-white" }, "بيانات السفر")
                    ),
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "travelDate", className: `${labelClass} flex items-center gap-2` }, React.createElement(CalendarDaysIcon, { className: "w-4 h-4 text-primary" }), "تاريخ السفر *"),
                        React.createElement("input", { type: "date", id: "travelDate", min: today, value: formData.travelDate || '', onChange: e => setFormData(p => ({...p, travelDate: e.target.value})), className: inputClass })
                    ),
                     React.createElement("div", null,
                        React.createElement("label", { htmlFor: "travelPort", className: `${labelClass} flex items-center gap-2` }, React.createElement(MapPinIcon, { className: "w-4 h-4 text-primary" }), "منفذ السفر *"),
                        React.createElement("select", { id: "travelPort", value: formData.travelPort || '', onChange: e => setFormData(p => ({...p, travelPort: e.target.value})), className: selectClass },
                            React.createElement("option", { value: "" }, "-- اختر ---"),
                            TRAVEL_PORTS.map(port => React.createElement("option", { key: port, value: port }, port))
                        )
                    )
                ),

                formError && React.createElement("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg" },
                    React.createElement("p", { className: "text-red-700 dark:text-red-300 text-sm text-center" }, formError)
                ),
                
                React.createElement("div", { className: "pt-6 border-t border-light-200 dark:border-dark-600" },
                    React.createElement("div", { className: "text-center mb-4" },
                        React.createElement("p", { className: "text-lg font-bold text-primary mb-1" }, `تكلفة الخدمة: ${product.price.toFixed(2)} ج.م`),
                        React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, "سيتم إرسال الطلب للمتابعة عبر واتساب.")
                    ),
                    React.createElement("button", { 
                        type: "submit", 
                        disabled: isCheckoutDisabled,
                        className: "w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-3" 
                    },
                        React.createElement(ShoppingCartIcon, { className: "w-6 h-6" }),
                        "اطلب الخدمة الآن"
                    )
                )
            )
        )
    );
};