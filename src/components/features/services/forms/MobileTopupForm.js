import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { StarIcon } from '../../../icons/index.js';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';
import { MOBILE_OPERATOR_CONFIG, MOBILE_TOPUP_AMOUNTS, CUSTOM_AMOUNT_VALUE, MIN_CUSTOM_TOPUP_AMOUNT } from '../../../../constants/index.js';

const MobileTopupForm = ({ product, onInitiateDirectCheckout }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedAmount, setSelectedAmount] = useState(MOBILE_TOPUP_AMOUNTS[0]);
    const [isCustomAmount, setIsCustomAmount] = useState(false);
    const [customAmount, setCustomAmount] = useState('');
    const [manualOperatorKey, setManualOperatorKey] = useState('');
    const [detectedOperator, setDetectedOperator] = useState(null);
    const [finalPrice, setFinalPrice] = useState(0);
    const [formError, setFormError] = useState('');
    
    const pointsToEarn = useMemo(() => Math.floor(finalPrice || 0), [finalPrice]);

    const updateOperatorAndPrice = useCallback(() => {
        setFormError('');
        let currentOperatorConfig = null;
        let operatorSource = 'none';

        if (manualOperatorKey && MOBILE_OPERATOR_CONFIG[manualOperatorKey]) {
            currentOperatorConfig = MOBILE_OPERATOR_CONFIG[manualOperatorKey];
            operatorSource = 'manual';
        } else if (phoneNumber.length >= 3) {
            const prefix = phoneNumber.substring(0, 3);
            if (MOBILE_OPERATOR_CONFIG[prefix]) {
                currentOperatorConfig = MOBILE_OPERATOR_CONFIG[prefix];
                operatorSource = 'auto';
            }
        }

        if (currentOperatorConfig) {
            if (operatorSource === 'auto' && !manualOperatorKey) {
                setManualOperatorKey(Object.keys(MOBILE_OPERATOR_CONFIG).find(key => MOBILE_OPERATOR_CONFIG[key].name === currentOperatorConfig.name) || '');
            }
            setDetectedOperator(currentOperatorConfig);
            const amountToCharge = isCustomAmount ? (Number(customAmount) || 0) : selectedAmount;
            const price = amountToCharge * currentOperatorConfig.multiplier;
            setFinalPrice(price);
        } else {
            setDetectedOperator(null);
            setFinalPrice(0);
        }
    }, [phoneNumber, manualOperatorKey, isCustomAmount, customAmount, selectedAmount]);
    
    useEffect(() => {
        updateOperatorAndPrice();
    }, [updateOperatorAndPrice]);

    const handleMobileTopupCheckout = () => {
        setFormError('');
        if (!phoneNumber || phoneNumber.length !== 11 || !/^\d{11}$/.test(phoneNumber)) {
            setFormError('يرجى إدخال رقم هاتف صحيح مكون من 11 رقمًا.');
            return;
        }
        if (!detectedOperator) {
            setFormError('لا يمكن تحديد شركة الاتصالات. يرجى التأكد من رقم الهاتف أو اختر الشبكة.');
            return;
        }
        const amountToCharge = isCustomAmount ? (Number(customAmount) || 0) : selectedAmount;
        if (amountToCharge < MIN_CUSTOM_TOPUP_AMOUNT) {
            setFormError(`يجب أن يكون مبلغ الشحن ${MIN_CUSTOM_TOPUP_AMOUNT} جنيه أو أكثر.`);
            return;
        }

        // FIX: Recalculate price directly inside the handler to ensure the latest value is used,
        // preventing potential stale state issues from the useEffect/useState pattern.
        const calculatedFinalPrice = amountToCharge * detectedOperator.multiplier;

        onInitiateDirectCheckout(product, {
            finalPrice: calculatedFinalPrice,
            formData: [
                { label: 'رقم الهاتف', value: phoneNumber, id: 'phoneNumber' },
                { label: 'الشبكة', value: detectedOperator.arabicName, id: 'operatorName' },
                { label: 'مبلغ الشحن الصافي', value: `${amountToCharge} ج.م`, id: 'topupAmount' }
            ],
            operatorLogoUrl: detectedOperator.logoUrl,
            operatorName: detectedOperator.arabicName,
            phoneNumber: phoneNumber,
            topupAmount: amountToCharge,
        });
    };

    const isCheckoutDisabled = !detectedOperator || finalPrice <= 0 || phoneNumber.length !== 11 || (isCustomAmount && (Number(customAmount) < MIN_CUSTOM_TOPUP_AMOUNT));
    const OperatorLogo = detectedOperator ? detectedOperator.logo : null;

    return React.createElement("form", {
        onSubmit: (e) => { e.preventDefault(); handleMobileTopupCheckout(); },
        className: "mt-4 space-y-4"
    },
        React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3 text-center" }, "تفاصيل شحن الرصيد"),
        React.createElement(FloatingInput, {
            id: "mobile-topup-phone", value: phoneNumber,
            onChange: (e) => setPhoneNumber(e.target.value.replace(/\D/g, '')),
            placeholder: "رقم الهاتف *", type: "tel", required: true
        }),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "operator-select", className: "block text-sm font-medium mb-1" }, "اختر الشبكة *"),
            React.createElement("select", {
                id: "operator-select", value: manualOperatorKey, onChange: (e) => setManualOperatorKey(e.target.value),
                className: "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary"
            },
                React.createElement("option", { value: "" }, "اختر الشبكة (أو سيتم تحديدها تلقائياً)"),
                Object.entries(MOBILE_OPERATOR_CONFIG).map(([key, op]) => React.createElement("option", { key: key, value: key }, op.arabicName))
            )
        ),
        detectedOperator && React.createElement("div", { className: "flex items-center space-x-2 p-2.5 rounded-md bg-light-100 dark:bg-dark-700 border" },
            OperatorLogo && React.createElement(OperatorLogo, { alt: detectedOperator.arabicName, className: "w-8 h-8" }),
            React.createElement("span", {className: "text-sm"}, `الشبكة المحددة: ${detectedOperator.arabicName}`)
        ),
        React.createElement("div", null,
            React.createElement("label", { className: "block text-sm font-medium mb-1" }, "مبلغ الشحن (رصيد صافي) *"),
            React.createElement("select", {
                value: isCustomAmount ? CUSTOM_AMOUNT_VALUE : selectedAmount,
                onChange: (e) => {
                    const value = e.target.value;
                    setIsCustomAmount(value === CUSTOM_AMOUNT_VALUE);
                    if (value !== CUSTOM_AMOUNT_VALUE) setSelectedAmount(Number(value));
                },
                className: "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50"
            },
                MOBILE_TOPUP_AMOUNTS.map(amount => React.createElement("option", { key: amount, value: amount }, `${amount} ج.م`)),
                React.createElement("option", { value: CUSTOM_AMOUNT_VALUE }, "مبلغ آخر...")
            )
        ),
        isCustomAmount && React.createElement("div", null,
            React.createElement(FloatingInput, {
                id: "custom-amount", value: customAmount,
                onChange: (e) => setCustomAmount(e.target.value.replace(/\D/g, '')),
                placeholder: `أقل حد ${MIN_CUSTOM_TOPUP_AMOUNT} ج.م`, type: "tel", required: true
            })
        ),
        (finalPrice > 0 && detectedOperator) && React.createElement("div", { className: "p-3 bg-primary/10 rounded-lg text-center" },
            React.createElement("p", { className: "text-md font-semibold text-primary" }, "التكلفة الإجمالية: ", 
                React.createElement("span", {className: "tabular-nums"}, `${finalPrice.toFixed(2)} جنيه`)
            ),
            (pointsToEarn > 0) && React.createElement("p", { className: "mt-1 flex items-center justify-center gap-1 text-xs text-yellow-700 font-medium" },
                React.createElement(StarIcon, { filled: true, className: "w-3.5 h-3.5" }), `ستحصل على ${pointsToEarn} نقطة`)
        ),
        formError && React.createElement("p", { className: "text-red-500 text-xs mt-1 text-center" }, formError),
        React.createElement("div", { className: "pt-4 border-t mt-auto" },
            React.createElement("button", {
                type: "submit", disabled: isCheckoutDisabled,
                className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg disabled:opacity-60"
            }, "إتمام الشراء الآن")
        )
    );
};

export { MobileTopupForm };