import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCartIcon, InfoIcon, birthdateIcon, MapPinIcon, ClipboardDocumentIcon, UserIcon, DocumentTextIcon, ShieldCheckIcon, ArrowUturnLeftIcon } from '../../../icons/index.js';
import { COUNTRIES } from '../../../../constants/countries.js';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';
import { EGYPT_GOVERNORATES_DATA } from '../../../../constants/governorates.js';

const TRAVEL_PURPOSES = ["تدريب", "حج", "عمرة", "بعثة", "عمل", "سياحة", "زيارة", "العمل على السفن", "العمل على الطائرات", "الدراسة", "بعثة رياضية", "أجازة دراسية", "زيارة عمل"];

export const MilitaryTravelPermitForm = ({ product, onInitiateDirectCheckout, onVariantChange }) => {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [formData, setFormData] = useState({
        travelDate: '',
        destination: '',
        travelPurpose: '',
        fullName: '',
        militaryNumber: '',
        tripartiteNumber: '',
        birthDate: '',
        nationalId: '',
        governorate: '',
        city: ''
    });
    const [formStep, setFormStep] = useState('packageSelection');
    const [formError, setFormError] = useState('');
    const [availableCities, setAvailableCities] = useState([]);

    const packages = useMemo(() => product.variants || [], [product]);

    useEffect(() => {
        if (onVariantChange) {
            onVariantChange(selectedPackage);
        }
    }, [selectedPackage, onVariantChange]);

    useEffect(() => {
        if (formData.governorate && EGYPT_GOVERNORATES_DATA[formData.governorate]) {
            const newCities = EGYPT_GOVERNORATES_DATA[formData.governorate];
            setAvailableCities(newCities);
            if (!newCities.includes(formData.city)) {
                setFormData(p => ({ ...p, city: '' }));
            }
        } else {
            setAvailableCities([]);
            setFormData(p => ({ ...p, city: '' }));
        }
    }, [formData.governorate]);
    
    const requiredDocumentNote = useMemo(() => {
        if (!selectedPackage) return '';
        const name = selectedPackage.name || '';
        const specialCases = [
            'إعفاء',
            'طالب خارج الجمهورية',
            'إعفاء (طائرات/سفن)',
            'أدى الخدمة (طائرات/سفن)'
        ];

        if (specialCases.includes(name)) {
            return 'شهادة الميلاد تكون حديثة';
        }
        
        if (name.includes('أدى الخدمة')) return 'شهادة الجيش';
        if (name.includes('طالب')) return 'خطاب تأجيل الدراسة أو إثبات قيد';
        return 'المستند الدال على موقفك من التجنيد';
    }, [selectedPackage]);

    const handleProceedToDetails = () => {
        if (selectedPackage) {
            setFormStep('details');
            setFormError('');
        } else {
            setFormError('يرجى اختيار موقفك من التجنيد أولاً.');
        }
    };
    
    const isCompletedService = useMemo(() => {
        if (!selectedPackage) return false;
        return selectedPackage.id === 'completed';
    }, [selectedPackage]);

    const isCheckoutDisabled = useMemo(() => {
        if (formStep !== 'details' || !selectedPackage) return true;
        const commonFields = !formData.fullName || !formData.birthDate || !formData.nationalId || formData.nationalId.length !== 14 || !formData.governorate || !formData.city;
        const travelFields = !formData.travelDate || !formData.destination || !formData.travelPurpose;
        if (isCompletedService) {
            return commonFields || travelFields || !formData.militaryNumber;
        } else {
            return commonFields || travelFields || !formData.tripartiteNumber;
        }
    }, [formStep, selectedPackage, formData, isCompletedService]);

    const handleCheckout = () => {
        if (isCheckoutDisabled) {
            setFormError('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.');
            return;
        }
        setFormError('');
        let detailsFields = [
            { label: 'الاسم بالكامل', value: formData.fullName },
            { label: 'تاريخ الميلاد', value: formData.birthDate },
            { label: 'الرقم القومي', value: formData.nationalId },
            { label: 'المحافظة', value: formData.governorate },
            { label: 'المركز', value: formData.city },
        ];
        if (isCompletedService) {
            detailsFields.splice(1, 0, { label: 'الرقم العسكري', value: formData.militaryNumber });
        } else {
            detailsFields.splice(1, 0, { label: 'الرقم الثلاثي', value: formData.tripartiteNumber });
        }
        onInitiateDirectCheckout(product, {
            finalPrice: selectedPackage.price,
            packageName: selectedPackage.name,
            formData: [
                { label: 'موقف التجنيد', value: selectedPackage.name },
                ...detailsFields,
                { label: 'تاريخ السفر', value: formData.travelDate },
                { label: 'وجهة السفر', value: formData.destination },
                { label: 'الغرض من السفر', value: formData.travelPurpose },
            ]
        });
    };

    const today = new Date().toISOString().split('T')[0];
    
    const labelClass = "block text-sm font-semibold mb-2 text-dark-800 dark:text-dark-100";
    const selectClass = "w-full p-3.5 rounded-xl border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M3%204l3%203%203-3z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px] bg-[right:1rem_center] pr-10";
    const inputClass = "w-full p-3.5 rounded-xl border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200";

    return React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "text-center" },
            React.createElement("div", { className: "flex items-center justify-center mb-3" },
                React.createElement("div", { className: "flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg" },
                    React.createElement(ShieldCheckIcon, { className: "w-7 h-7 text-white" })
                )
            ),
            React.createElement("h3", { className: "text-xl font-bold text-dark-900 dark:text-white mb-2" }, product.arabicName),
            React.createElement("p", { className: "text-dark-600 dark:text-dark-300 max-w-sm mx-auto text-sm leading-relaxed" }, "املأ بياناتك للحصول على تصريح سفر عسكري معتمد")
        ),
        React.createElement("div", { className: "flex items-center justify-center" },
            React.createElement("div", { className: "flex items-center" },
                React.createElement("div", { className: "flex items-center" },
                    React.createElement("div", { className: `flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm transition-all duration-300 ${formStep === 'packageSelection' ? 'bg-primary border-primary text-white shadow-md' : 'bg-primary/20 border-primary text-primary'}` }, "1"),
                    React.createElement("div", { className: `w-16 h-1 mx-2 transition-all duration-300 ${formStep === 'details' ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-light-300 dark:bg-dark-600'}` })
                ),
                React.createElement("div", { className: `flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm transition-all duration-300 ${formStep === 'details' ? 'bg-primary border-primary text-white shadow-md' : 'bg-light-100 dark:bg-dark-700 border-light-300 dark:border-dark-600 text-dark-500 dark:text-dark-400'}` }, "2")
            )
        ),
        React.createElement("div", { className: `${formStep === 'packageSelection' ? 'block' : 'hidden'} space-y-5` },
            React.createElement("div", { className: "bg-white dark:bg-dark-700 rounded-2xl p-5 border border-light-200 dark:border-dark-600 shadow-sm" },
                React.createElement("div", { className: "flex items-center gap-3 mb-5" },
                    React.createElement("div", { className: "flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl" }, React.createElement(ClipboardDocumentIcon, { className: "w-5 h-5 text-primary" })),
                    React.createElement("div", null,
                        React.createElement("h4", { className: "text-lg font-bold text-dark-900 dark:text-white" }, product.packageSelectionStepTitle || 'حدد موقفك من التجنيد'),
                        React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300" }, "اختر الفئة المناسبة لموقفك")
                    )
                ),
                React.createElement("div", { className: "space-y-3" },
                    packages.map(pkg => {
                        const isSelected = selectedPackage?.id === pkg.id;
                        return React.createElement("button", { key: pkg.id, type: "button", onClick: () => setSelectedPackage(pkg), className: `w-full text-right p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] group ${isSelected ? 'border-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-md' : 'border-light-300 dark:border-dark-600 hover:border-primary/50 hover:bg-light-50 dark:hover:bg-dark-600/50'}` },
                            React.createElement("div", { className: "flex items-center justify-between" },
                                React.createElement("div", { className: "flex items-center gap-3" },
                                    React.createElement("div", { className: `flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${isSelected ? 'border-primary bg-primary text-white' : 'border-light-400 dark:border-dark-500 group-hover:border-primary'}` },
                                        React.createElement("div", { className: `w-1.5 h-1.5 rounded-full transition-colors ${isSelected ? 'bg-white' : 'bg-transparent group-hover:bg-primary'}` })
                                    ),
                                    React.createElement("p", { className: `font-semibold text-base ${isSelected ? 'text-primary' : 'text-dark-800 dark:text-dark-100'}` }, pkg.name)
                                ),
                                React.createElement("span", { className: `font-bold text-base ${isSelected ? 'text-primary' : 'text-dark-600 dark:text-dark-400'}` }, `${pkg.price.toFixed(2)} ج.م`)
                            )
                        );
                    })
                )
            ),
            formError && React.createElement("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl" },
                React.createElement("p", { className: "text-red-700 dark:text-red-300 text-sm text-center font-medium" }, formError)
            ),
            React.createElement("button", { onClick: handleProceedToDetails, disabled: !selectedPackage, className: "w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-bold py-3.5 px-6 rounded-xl text-base transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-md hover:shadow-lg flex items-center justify-center gap-2" },
                React.createElement("span", null, "متابعة إلى بيانات السفر"),
                React.createElement("div", { className: "w-4 h-4 border-t-2 border-r-2 border-white transform -rotate-45" })
            )
        ),
        React.createElement("div", { className: `${formStep === 'details' ? 'block' : 'hidden'} space-y-5` },
            React.createElement("div", { className: "bg-white dark:bg-dark-700 rounded-2xl p-5 border border-light-200 dark:border-dark-600 shadow-sm" },
                React.createElement("div", { className: "flex items-center gap-3 mb-5" },
                    React.createElement("div", { className: "flex items-center justify-center w-10 h-10 bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-xl" }, React.createElement(UserIcon, { className: "w-5 h-5 text-secondary" })),
                    React.createElement("div", null,
                        React.createElement("h4", { className: "text-lg font-bold text-dark-900 dark:text-white" }, "البيانات الشخصية"),
                        React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300" }, "املأ بياناتك الشخصية بدقة")
                    )
                ),
                React.createElement("div", { className: "space-y-4" },
                    React.createElement(FloatingInput, { id: "fullName", value: formData.fullName || '', onChange: e => setFormData(p => ({...p, fullName: e.target.value})), placeholder: "الاسم الرباعي بالكامل *", icon: DocumentTextIcon }),
                    isCompletedService ?
                        React.createElement(FloatingInput, { id: "militaryNumber", value: formData.militaryNumber || '', onChange: e => setFormData(p => ({...p, militaryNumber: e.target.value.replace(/\D/g, '')})), placeholder: "الرقم العسكري *", type: "tel", icon: ShieldCheckIcon }) :
                        React.createElement(FloatingInput, { id: "tripartiteNumber", value: formData.tripartiteNumber || '', onChange: e => setFormData(p => ({...p, tripartiteNumber: e.target.value.replace(/\D/g, '')})), placeholder: "الرقم الثلاثي *", type: "tel", icon: ShieldCheckIcon }),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement("div", null,
                            React.createElement("label", { htmlFor: "birthDate", className: `${labelClass} flex items-center gap-2` }, React.createElement(birthdateIcon, { className: "w-4 h-4 text-primary" }), "تاريخ الميلاد *"),
                            React.createElement("input", { type: "date", id: "birthDate", value: formData.birthDate || '', onChange: e => setFormData(p => ({...p, birthDate: e.target.value})), className: inputClass, max: today })
                        ),
                        React.createElement(FloatingInput, { id: "nationalId", value: formData.nationalId || '', onChange: e => setFormData(p => ({...p, nationalId: e.target.value.replace(/\D/g, '')})), placeholder: "الرقم القومي (14 رقم) *", type: "tel", maxLength: 14, icon: DocumentTextIcon })
                    ),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement("div", null,
                            React.createElement("label", { htmlFor: "governorate", className: `${labelClass} flex items-center gap-2` }, React.createElement(MapPinIcon, { className: "w-4 h-4 text-primary" }), "المحافظة *"),
                            React.createElement("select", { id: "governorate", value: formData.governorate || '', onChange: e => setFormData(p => ({...p, governorate: e.target.value})), className: selectClass }, React.createElement("option", { value: "" }, "اختر المحافظة..."), Object.keys(EGYPT_GOVERNORATES_DATA).map(gov => React.createElement("option", { key: gov, value: gov }, gov)))
                        ),
                        React.createElement("div", null,
                            React.createElement("label", { htmlFor: "city", className: `${labelClass} flex items-center gap-2` }, React.createElement(MapPinIcon, { className: "w-4 h-4 text-primary" }), "المركز / المدينة *"),
                            React.createElement("select", { id: "city", value: formData.city || '', onChange: e => setFormData(p => ({...p, city: e.target.value})), className: selectClass, disabled: !formData.governorate }, React.createElement("option", { value: "" }, "اختر المركز..."), availableCities.map(c => React.createElement("option", { key: c, value: c }, c)))
                        )
                    )
                )
            ),
            React.createElement("div", { className: "bg-white dark:bg-dark-700 rounded-2xl p-5 border border-light-200 dark:border-dark-600 shadow-sm" },
                React.createElement("div", { className: "flex items-center gap-3 mb-5" },
                    React.createElement("div", { className: "flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-xl" }, React.createElement(MapPinIcon, { className: "w-5 h-5 text-purple-500" })),
                    React.createElement("div", null,
                        React.createElement("h4", { className: "text-lg font-bold text-dark-900 dark:text-white" }, product.detailsStepTitle || 'بيانات السفر'),
                        React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300" }, "حدد تفاصيل رحلتك")
                    )
                ),
                React.createElement("div", { className: "space-y-4" },
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "travelDate", className: `${labelClass} flex items-center gap-2` }, React.createElement(birthdateIcon, { className: "w-4 h-4 text-primary" }), "تاريخ السفر المتوقع *"),
                        React.createElement("input", { type: "date", id: "travelDate", min: today, value: formData.travelDate || '', onChange: e => setFormData(p => ({...p, travelDate: e.target.value})), className: inputClass })
                    ),
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "destination", className: `${labelClass} flex items-center gap-2` }, React.createElement(MapPinIcon, { className: "w-4 h-4 text-primary" }), "دولة الوجهة *"),
                        React.createElement("select", { id: "destination", value: formData.destination || '', onChange: e => setFormData(p => ({...p, destination: e.target.value})), className: selectClass }, React.createElement("option", { value: "" }, "اختر الدولة..."), COUNTRIES.map(c => React.createElement("option", { key: c, value: c }, c)))
                    ),
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "travelPurpose", className: `${labelClass} flex items-center gap-2` }, React.createElement(ClipboardDocumentIcon, { className: "w-4 h-4 text-primary" }), "الغرض من السفر *"),
                        React.createElement("select", { id: "travelPurpose", value: formData.travelPurpose || '', onChange: e => setFormData(p => ({...p, travelPurpose: e.target.value})), className: selectClass }, React.createElement("option", { value: "" }, "اختر الغرض..."), TRAVEL_PURPOSES.map(p => React.createElement("option", { key: p, value: p }, p)))
                    )
                )
            ),
            React.createElement("div", { className: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700/50" },
                React.createElement("div", { className: "flex gap-3" },
                    React.createElement("div", { className: "flex-shrink-0" }, React.createElement("div", { className: "flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg" }, React.createElement(InfoIcon, { className: "w-5 h-5 text-white" }))),
                    React.createElement("div", null,
                        React.createElement("h5", { className: "font-bold text-blue-800 dark:text-blue-200 mb-1 text-base" }, "معلومة مهمة"),
                        React.createElement("p", { className: "text-blue-700 dark:text-blue-300 text-sm leading-relaxed" }, `مطلوب إرسال صورة واضحة من *${requiredDocumentNote}* عبر واتساب بعد تأكيد الطلب مباشرة لمعالجة طلبك.`)
                    )
                )
            ),
            formError && React.createElement("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl" },
                React.createElement("p", { className: "text-red-700 dark:text-red-300 text-sm text-center font-medium" }, formError)
            ),
            React.createElement("div", { className: "flex gap-3 pt-1" },
                React.createElement("button", { type: "button", onClick: () => setFormStep('packageSelection'), className: "flex-1 bg-transparent hover:bg-light-100 dark:hover:bg-dark-600 text-dark-700 dark:text-dark-200 font-bold py-3.5 px-6 rounded-xl text-base transition-all duration-300 flex items-center justify-center gap-2 border border-light-300 dark:border-dark-500" },
                    React.createElement(ArrowUturnLeftIcon, { className: "w-4 h-4" }), "رجوع"
                ),
                React.createElement("button", { onClick: handleCheckout, disabled: isCheckoutDisabled, className: "flex-[2] bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-bold py-3.5 px-6 rounded-xl text-base transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-md hover:shadow-lg flex items-center justify-center gap-2" },
                    React.createElement(ShoppingCartIcon, { className: "w-5 h-5" }),
                    React.createElement("span", null, `اطلب الخدمة (${selectedPackage?.price.toFixed(2) || '0.00'} ج.م)`)
                )
            )
        )
    );
};