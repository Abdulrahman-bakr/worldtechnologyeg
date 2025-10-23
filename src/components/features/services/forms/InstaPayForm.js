import React, { useState, useMemo } from 'react';
import { PhoneIcon, AtSymbolIcon, BuildingLibraryIcon } from '../../../icons/index.js';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';
import { INSTAPAY_BANKS } from '../../../../constants/index.js';

const BeneficiaryTypeCard = ({ type, label, icon: Icon, selectedType, onSelect }) => {
    const isSelected = selectedType === type;
    return React.createElement("button", {
        type: "button",
        onClick: () => onSelect(type),
        className: `flex flex-col items-center justify-center p-4 text-center rounded-xl border-2 transition-all duration-200 transform hover:-translate-y-1 space-y-2 ${isSelected ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-primary/30 shadow-md' : 'border-light-300 dark:border-dark-600 bg-white dark:bg-dark-800 hover:border-primary/50'}`
    },
        React.createElement(Icon, { className: `w-8 h-8 mb-2 transition-colors ${isSelected ? 'text-primary' : 'text-dark-600 dark:text-dark-300'}` }),
        React.createElement("span", { className: `font-semibold text-sm transition-colors ${isSelected ? 'text-primary' : 'text-dark-900 dark:text-dark-50'}` }, label)
    );
  };

const InstaPayForm = ({ product, onInitiateDirectCheckout }) => {
    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState('');
    const [instapayBeneficiaryType, setInstapayBeneficiaryType] = useState(null);

    const pointsToEarn = useMemo(() => {
        return Math.floor(Number(formData.paymentAmount) || 0);
    }, [formData.paymentAmount]);

    const isCheckoutDisabled = !instapayBeneficiaryType || !formData.beneficiaryName || !formData.paymentAmount || Number(formData.paymentAmount) <= 0 ||
        (instapayBeneficiaryType === 'phone' && (!formData.beneficiaryPhone || formData.beneficiaryPhone.length < 11)) ||
        (instapayBeneficiaryType === 'ipa' && (!formData.beneficiaryIpa || formData.beneficiaryIpa.trim() === '')) ||
        (instapayBeneficiaryType === 'bank' && (!formData.beneficiaryBank || !formData.beneficiaryAccount));

    const handleTypeSelect = (type) => {
        if (instapayBeneficiaryType === type) {
            setInstapayBeneficiaryType(null);
            setFormData({});
        } else {
            setInstapayBeneficiaryType(type);
            setFormData({});
        }
        setFormError('');
    };
    
    const handleCheckout = () => {
        setFormError('');
        let beneficiaryDetails = [];
        if (instapayBeneficiaryType === 'phone') beneficiaryDetails.push({ label: 'رقم هاتف المستفيد', value: formData.beneficiaryPhone });
        if (instapayBeneficiaryType === 'ipa') beneficiaryDetails.push({ label: 'عنوان الدفع (IPA)', value: formData.beneficiaryIpa });
        if (instapayBeneficiaryType === 'bank') {
            beneficiaryDetails.push({ label: 'البنك', value: formData.beneficiaryBank });
            beneficiaryDetails.push({ label: 'رقم الحساب', value: formData.beneficiaryAccount });
        }

        onInitiateDirectCheckout(product, {
            finalPrice: Number(formData.paymentAmount),
            formData: [
                { label: 'اسم المستفيد', value: formData.beneficiaryName },
                ...beneficiaryDetails,
                { label: 'المبلغ المحول', value: `${Number(formData.paymentAmount).toFixed(2)} ج.م` },
            ]
        });
    };

    return React.createElement("form", {
        onSubmit: (e) => { e.preventDefault(); handleCheckout(); },
        className: "space-y-4"
    },
        React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3 text-center" }, product.arabicName),
        React.createElement("fieldset", null,
            React.createElement("legend", { className: "block text-sm font-medium mb-2 text-dark-800 dark:text-dark-100" }, "1. اختر طريقة التحويل"),
            React.createElement("div", {className: "grid grid-cols-3 gap-3"},
                React.createElement(BeneficiaryTypeCard, { type: 'phone', label: 'رقم الهاتف', icon: PhoneIcon, selectedType: instapayBeneficiaryType, onSelect: handleTypeSelect }),
                React.createElement(BeneficiaryTypeCard, { type: 'ipa', label: 'عنوان الدفع', icon: AtSymbolIcon, selectedType: instapayBeneficiaryType, onSelect: handleTypeSelect }),
                React.createElement(BeneficiaryTypeCard, { type: 'bank', label: 'حساب بنكي', icon: BuildingLibraryIcon, selectedType: instapayBeneficiaryType, onSelect: handleTypeSelect })
            )
        ),
        
        instapayBeneficiaryType && React.createElement("div", { className: "space-y-4 mt-4 pt-4 border-t border-light-200 dark:border-dark-700" },
            React.createElement("h3", { className: "text-sm font-medium mb-2 text-dark-800 dark:text-dark-100" }, "2. أدخل التفاصيل"),
            instapayBeneficiaryType === 'phone' && React.createElement("div", {className: ""}, React.createElement(FloatingInput, { id: "beneficiaryPhone", value: formData.beneficiaryPhone || '', onChange: e => setFormData(p => ({...p, beneficiaryPhone: e.target.value.replace(/\D/g, '')})), placeholder: "رقم الهاتف المرتبط بحساب إنستاباي", type: "tel" })),
            instapayBeneficiaryType === 'ipa' && React.createElement("div", {className: ""}, React.createElement(FloatingInput, { id: "beneficiaryIpa", value: formData.beneficiaryIpa || '', onChange: e => setFormData(p => ({...p, beneficiaryIpa: e.target.value})), placeholder: "عنوان الدفع (IPA) *" })),
            instapayBeneficiaryType === 'bank' && React.createElement("div", {className: "space-y-4"},
                React.createElement("div", null,
                     React.createElement("label", {className: "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100"}, "اختر البنك *"),
                     React.createElement("select", { value: formData.beneficiaryBank || '', onChange: e => setFormData(p => ({...p, beneficiaryBank: e.target.value})), className: "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary" }, 
                        React.createElement("option", {value: ""}, "اختر البنك..."),
                        INSTAPAY_BANKS.map(b => React.createElement("option", {key: b, value: b}, b)))
                ),
                React.createElement(FloatingInput, { id: "beneficiaryAccount", value: formData.beneficiaryAccount || '', onChange: e => setFormData(p => ({...p, beneficiaryAccount: e.target.value.replace(/\D/g, '')})), placeholder: "رقم الحساب البنكي *", type: "tel" })
            ),
            
            React.createElement(FloatingInput, { id: "beneficiaryName", value: formData.beneficiaryName || '', onChange: e => setFormData(p => ({...p, beneficiaryName: e.target.value})), placeholder: "اسم مالك حساب " }),
            React.createElement(FloatingInput, { id: "paymentAmount", value: formData.paymentAmount || '', onChange: e => setFormData(p => ({...p, paymentAmount: e.target.value.replace(/[^0-9.]/g, '')})), placeholder: "المبلغ", type: "number" }),

            formError && React.createElement("p", { className: "text-red-500 text-sm mt-1 text-center" }, formError),
            
            React.createElement("div", { className: "pt-4 border-t border-light-200 dark:border-dark-600 mt-auto" },
                 (pointsToEarn > 0) && React.createElement("p", { className: "mb-3 text-center text-sm text-yellow-600 dark:text-yellow-400" }, `ستربح ${pointsToEarn} نقطة`),
                React.createElement("button", {
                    type: "submit", disabled: isCheckoutDisabled,
                    className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60"
                }, "إتمام التحويل")
            )
        )
    );
};

export { InstaPayForm };