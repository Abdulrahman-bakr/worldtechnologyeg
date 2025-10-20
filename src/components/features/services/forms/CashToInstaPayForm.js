import React, { useState, useMemo } from 'react';
import { ShoppingCartIcon, StarIcon, PhoneIcon, AtSymbolIcon, BuildingLibraryIcon, CreditCardIcon } from '../../../icons/index.js';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';
import { INSTAPAY_BANKS } from '../../../../constants/index.js';

const getCashToInstaPayFee = (amount) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 100) return null;
    if (numAmount <= 300) return 7;
    if (numAmount <= 600) return 10;
    if (numAmount <= 1000) return 15;
    if (numAmount <= 1500) return 20;
    if (numAmount <= 1700) return 25;
    if (numAmount <= 2000) return 28;
    if (numAmount <= 2500) return 35;
    if (numAmount <= 3000) return 40;
    if (numAmount <= 3500) return 45;
    if (numAmount <= 4000) return 50;
    if (numAmount <= 4500) return 55;
    if (numAmount <= 5000) return 65;
    if (numAmount <= 5500) return 70;
    if (numAmount <= 6000) return 75;
    if (numAmount <= 6500) return 80;
    if (numAmount <= 7000) return 85;
    if (numAmount <= 7500) return 92;
    if (numAmount <= 8000) return 97;
    if (numAmount <= 8500) return 105;
    if (numAmount <= 9000) return 110;
    if (numAmount <= 9500) return 115;
    if (numAmount <= 10000) return 125;
    return null; // Amount is over 10,000
};

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

const CashToInstaPayForm = ({ product, onInitiateDirectCheckout }) => {
    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState('');
    const [instapayBeneficiaryType, setInstapayBeneficiaryType] = useState(null);

    const transferAmount = Number(formData.transferAmount) || 0;
    const serviceFee = getCashToInstaPayFee(transferAmount);
    const totalCost = serviceFee !== null ? transferAmount + serviceFee : null;
    
    const pointsToEarn = useMemo(() => {
        const fee = getCashToInstaPayFee(Number(formData.transferAmount));
        return fee ? Math.floor(fee) : 0;
    }, [formData.transferAmount]);
    
    const handleTypeSelect = (type) => {
        setInstapayBeneficiaryType(type === instapayBeneficiaryType ? null : type);
        setFormError('');
    };

    const isCheckoutDisabled = totalCost === null || !instapayBeneficiaryType || !formData.beneficiaryName || !formData.senderWalletNumber ||
        (instapayBeneficiaryType === 'phone' && !formData.beneficiaryPhone) ||
        (instapayBeneficiaryType === 'ipa' && !formData.beneficiaryIpa) ||
        (instapayBeneficiaryType === 'bank' && (!formData.beneficiaryBank || !formData.beneficiaryAccount)) ||
        (instapayBeneficiaryType === 'card' && !formData.beneficiaryCardNumber);

    return React.createElement("form", {
        onSubmit: (e) => { 
            e.preventDefault(); 
            if (isCheckoutDisabled) {
                setFormError("يرجى ملء جميع الحقول المطلوبة بمبلغ صحيح (100 - 10,000).");
                return;
            }
            
            let beneficiaryDetails = [];
            let typeLabel = '';
            if (instapayBeneficiaryType === 'phone') {
                typeLabel = 'رقم الهاتف';
                beneficiaryDetails.push({ label: 'رقم هاتف المستفيد', value: formData.beneficiaryPhone });
            }
            if (instapayBeneficiaryType === 'ipa') {
                typeLabel = 'عنوان الدفع (IPA)';
                beneficiaryDetails.push({ label: 'عنوان الدفع (IPA) للمستفيد', value: formData.beneficiaryIpa });
            }
            if (instapayBeneficiaryType === 'bank') {
                typeLabel = 'حساب بنكي';
                beneficiaryDetails.push({ label: 'بنك المستفيد', value: formData.beneficiaryBank });
                beneficiaryDetails.push({ label: 'رقم حساب المستفيد', value: formData.beneficiaryAccount });
            }
             if (instapayBeneficiaryType === 'card') {
                typeLabel = 'بطاقة';
                beneficiaryDetails.push({ label: 'رقم بطاقة المستفيد', value: formData.beneficiaryCardNumber });
            }

            onInitiateDirectCheckout(product, {
                finalPrice: totalCost,
                formData: [
                    { label: 'المبلغ المحول', value: `${transferAmount.toFixed(2)} ج.م` },
                    { label: 'رسوم الخدمة', value: `${serviceFee.toFixed(2)} ج.م` },
                    { label: 'نوع التحويل', value: typeLabel },
                    ...beneficiaryDetails,
                    { label: 'اسم المستفيد', value: formData.beneficiaryName },
                    { label: 'رقم محفظة الكاش الخاصة بالمرسل', value: formData.senderWalletNumber },
                ]
            });
        },
        className: "space-y-4"
    },
        React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3 text-center" }, product.arabicName),
        React.createElement("fieldset", null,
            React.createElement("legend", { className: "block text-sm font-medium mb-2 text-dark-800 dark:text-dark-100" }, "1. اختر طريقة التحويل إلى المستفيد"),
            React.createElement("div", {className: "grid grid-cols-2 md:grid-cols-4 gap-3"},
                React.createElement(BeneficiaryTypeCard, { type: 'phone', label: 'رقم الهاتف', icon: PhoneIcon, selectedType: instapayBeneficiaryType, onSelect: handleTypeSelect }),
                React.createElement(BeneficiaryTypeCard, { type: 'ipa', label: 'عنوان الدفع', icon: AtSymbolIcon, selectedType: instapayBeneficiaryType, onSelect: handleTypeSelect }),
                React.createElement(BeneficiaryTypeCard, { type: 'bank', label: 'حساب بنكي', icon: BuildingLibraryIcon, selectedType: instapayBeneficiaryType, onSelect: handleTypeSelect }),
                React.createElement(BeneficiaryTypeCard, { type: 'card', label: 'بطاقة', icon: CreditCardIcon, selectedType: instapayBeneficiaryType, onSelect: handleTypeSelect })
            )
        ),

        instapayBeneficiaryType && React.createElement("div", { className: "space-y-4 mt-4 pt-4 border-t border-light-200 dark:border-dark-700" },
            React.createElement("h3", { className: "text-sm font-medium mb-2 text-dark-800 dark:text-dark-100" }, "2. أدخل مبلغ التحويل وبيانات المستفيد"),
            React.createElement(FloatingInput, { id: "transferAmount", value: formData.transferAmount || '', onChange: e => setFormData(p => ({...p, transferAmount: e.target.value.replace(/[^0-9.]/g, '')})), placeholder: "المبلغ المراد تحويله (100 - 10,000) *", type: "number" }),
            
            instapayBeneficiaryType === 'phone' && React.createElement("div", {className: ""}, React.createElement(FloatingInput, { id: "beneficiaryPhone", value: formData.beneficiaryPhone || '', onChange: e => setFormData(p => ({...p, beneficiaryPhone: e.target.value.replace(/\D/g, '')})), placeholder: "رقم هاتف المستفيد *", type: "tel" })),
            instapayBeneficiaryType === 'ipa' && React.createElement("div", {className: ""}, React.createElement(FloatingInput, { id: "beneficiaryIpa", value: formData.beneficiaryIpa || '', onChange: e => setFormData(p => ({...p, beneficiaryIpa: e.target.value})), placeholder: "عنوان الدفع (IPA) للمستفيد *" })),
            instapayBeneficiaryType === 'bank' && React.createElement("div", {className: "space-y-4"},
                React.createElement("select", { value: formData.beneficiaryBank || '', onChange: e => setFormData(p => ({...p, beneficiaryBank: e.target.value})), className: "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary" }, 
                    React.createElement("option", {value: ""}, "اختر بنك المستفيد..."),
                    INSTAPAY_BANKS.map(b => React.createElement("option", {key: b, value: b}, b))
                ),
                React.createElement(FloatingInput, { id: "beneficiaryAccount", value: formData.beneficiaryAccount || '', onChange: e => setFormData(p => ({...p, beneficiaryAccount: e.target.value.replace(/\D/g, '')})), placeholder: "رقم حساب المستفيد *", type: "tel" })
            ),
             instapayBeneficiaryType === 'card' && React.createElement("div", {className: ""}, React.createElement(FloatingInput, { id: "beneficiaryCardNumber", value: formData.beneficiaryCardNumber || '', onChange: e => setFormData(p => ({...p, beneficiaryCardNumber: e.target.value.replace(/\D/g, '')})), placeholder: "رقم بطاقة المستفيد *", type: "tel" })),

            React.createElement(FloatingInput, { id: "beneficiaryName", value: formData.beneficiaryName || '', onChange: e => setFormData(p => ({...p, beneficiaryName: e.target.value})), placeholder: "اسم المستفيد (بالكامل) *" }),
            
            React.createElement("h3", { className: "text-sm font-medium pt-4 border-t border-light-200 dark:border-dark-700 text-dark-800 dark:text-dark-100" }, "3. أدخل بياناتك للدفع"),
            React.createElement(FloatingInput, { id: "senderWalletNumber", value: formData.senderWalletNumber || '', onChange: e => setFormData(p => ({...p, senderWalletNumber: e.target.value.replace(/\D/g, '')})), placeholder: "رقم محفظة الكاش الخاصة بك *" , type: "tel"}),

        ),

        (totalCost !== null) && React.createElement("div", { className: "p-3 bg-light-100 dark:bg-dark-700 rounded-lg border border-light-200 dark:border-dark-600 text-center space-y-2" },
            React.createElement("p", { className: "text-sm flex justify-between items-center text-dark-800 dark:text-dark-100" }, React.createElement("span", null, "المبلغ المحول:"), React.createElement("span", { className: "font-semibold tabular-nums" }, `${transferAmount.toFixed(2)} ج.م`)),
            React.createElement("p", { className: "text-sm flex justify-between items-center text-dark-800 dark:text-dark-100" }, React.createElement("span", null, "رسوم الخدمة:"), React.createElement("span", { className: "font-semibold tabular-nums" }, `+${serviceFee.toFixed(2)} ج.م`)),
            React.createElement("hr", { className: "border-light-300 dark:border-dark-600 my-1" }),
            React.createElement("p", { className: "text-md font-bold flex justify-between items-center text-primary" }, React.createElement("span", null, "الإجمالي للدفع:"), React.createElement("span", { className: "tabular-nums text-lg" }, `${totalCost.toFixed(2)} ج.م`))
        ),
        formError && React.createElement("p", { className: "text-red-500 text-sm mt-1 text-center" }, formError),
        React.createElement("div", { className: "pt-4 border-t border-light-200 dark:border-dark-600 mt-auto" },
            (pointsToEarn > 0) && React.createElement("p", { className: "mb-3 text-center text-sm text-yellow-600 dark:text-yellow-400 font-medium flex items-center justify-center gap-1" }, 
                React.createElement(StarIcon, { filled: true, className: "w-4 h-4" }),
                `ستربح ${pointsToEarn} نقطة على رسوم الخدمة`
            ),
            React.createElement("button", {
                type: "submit",
                disabled: isCheckoutDisabled,
                className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            },
                React.createElement(ShoppingCartIcon, { className: "w-5 h-5" }),
                "إتمام التحويل الآن"
            )
        )
    );
};

export { CashToInstaPayForm };