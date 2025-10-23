import React, { useState, useMemo } from 'react';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';
import { LANDLINE_BILL_PACKAGES } from '../../../../constants/index.js';

const LandlineBillForm = ({ product, onInitiateDirectCheckout }) => {
    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState('');
    const [landlinePaymentType, setLandlinePaymentType] = useState('package');
    const [selectedLandlinePackageOption, setSelectedLandlinePackageOption] = useState(null);
    const [customLandlineAmount, setCustomLandlineAmount] = useState('');

    const landlineNumber = formData.landlineNumber || '';
    const price = landlinePaymentType === 'package' ? selectedLandlinePackageOption?.price : Number(customLandlineAmount);
    const isCheckoutDisabled = !landlineNumber.trim() || landlineNumber.length < 8 || !price || price <= 0;
    
    const pointsToEarn = useMemo(() => {
        const landlinePrice = landlinePaymentType === 'package' ? selectedLandlinePackageOption?.price : Number(customLandlineAmount);
        return Math.floor(landlinePrice || 0);
    }, [landlinePaymentType, selectedLandlinePackageOption, customLandlineAmount]);
    
    const handleCheckout = () => {
        if(isCheckoutDisabled) {
            setFormError("يرجى ملء جميع الحقول المطلوبة.");
            return;
        }
        setFormError('');
        const isPackage = landlinePaymentType === 'package';
        const packageName = isPackage ? `${selectedLandlinePackageOption.name} (${selectedLandlinePackageOption.term})` : 'مبلغ مخصص';

        onInitiateDirectCheckout(product, {
            finalPrice: price,
            formData: [
                { label: 'رقم التليفون الأرضي', value: landlineNumber },
                { label: 'نوع الدفع', value: packageName },
                { label: 'المبلغ', value: `${price.toFixed(2)} ج.م` },
            ]
        });
    };

    return React.createElement("form", {
        onSubmit: (e) => { e.preventDefault(); handleCheckout(); },
        className: "space-y-4"
    },
        React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3 text-center" }, product.arabicName),
        React.createElement(FloatingInput, { id: "landlineNumber", value: landlineNumber, onChange: e => setFormData(p => ({...p, landlineNumber: e.target.value.replace(/\D/g, '')})), placeholder: "رقم التليفون الأرضي (بكود المحافظة) *" , type: "tel"}),
        
        React.createElement("fieldset", null,
            React.createElement("legend", { className: "block text-sm font-medium mb-2 text-dark-800 dark:text-dark-100" }, "اختر نوع الدفع"),
            React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                React.createElement("button", { type: "button", onClick: () => setLandlinePaymentType('package'), className: `p-3 text-center rounded-xl border-2 ${landlinePaymentType === 'package' ? 'border-primary bg-primary/5' : 'border-light-300 dark:border-dark-600'}` }, "اختيار باقة"),
                React.createElement("button", { type: "button", onClick: () => setLandlinePaymentType('custom'), className: `p-3 text-center rounded-xl border-2 ${landlinePaymentType === 'custom' ? 'border-primary bg-primary/5' : 'border-light-300 dark:border-dark-600'}` }, "مبلغ مخصص")
            )
        ),
        
        landlinePaymentType === 'package' && React.createElement("div", { className: "space-y-3" },
            LANDLINE_BILL_PACKAGES.map(pkg => (
                React.createElement("div", { key: pkg.name, className: "p-3 rounded-lg border border-light-200 dark:border-dark-600" },
                    React.createElement("h4", { className: "font-semibold text-dark-800 dark:text-dark-100 mb-2" }, pkg.name),
                    React.createElement("div", { className: "flex flex-wrap gap-2" },
                        pkg.options.map(opt => (
                            React.createElement("button", {
                                key: opt.id,
                                type: "button",
                                onClick: () => setSelectedLandlinePackageOption(opt),
                                className: `px-3 py-1.5 rounded-md border text-sm ${selectedLandlinePackageOption?.id === opt.id ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-dark-700 border-light-300 dark:border-dark-500 hover:border-primary'}`
                            }, `${opt.term}: ${opt.price} ج.م`)
                        ))
                    )
                )
            ))
        ),

        landlinePaymentType === 'custom' && React.createElement("div", null,
            React.createElement(FloatingInput, { id: "customLandlineAmount", value: customLandlineAmount, onChange: e => setCustomLandlineAmount(e.target.value.replace(/[^0-9.]/g, '')), placeholder: "أدخل قيمة الفاتورة *", type: "number" })
        ),
        
        formError && React.createElement("p", { className: "text-red-500 text-sm mt-1 text-center" }, formError),

        React.createElement("div", { className: "pt-4 border-t border-light-200 dark:border-dark-600 mt-auto" },
            price > 0 && React.createElement("p", { className: "mb-3 text-center text-lg font-bold text-primary" }, `الإجمالي: ${price.toFixed(2)} ج.م`),
            (pointsToEarn > 0) && React.createElement("p", { className: "mb-3 text-center text-sm text-yellow-600 dark:text-yellow-400" }, `ستربح ${pointsToEarn} نقطة`),
            React.createElement("button", {
                type: "submit", disabled: isCheckoutDisabled,
                className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60"
            }, "إتمام الدفع")
        )
    );
};

export { LandlineBillForm };