import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCartIcon, StarIcon, InfoIcon } from '../../../icons/index.js';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';

const getFeeForAmount = (amount, rule) => {
    if (!rule || !Array.isArray(rule.tiers)) return null;
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount < 5) return null;

    const tier = rule.tiers.find(t => numericAmount >= Number(t.minAmount) && numericAmount <= Number(t.maxAmount));
    
    if (tier && tier.fee !== undefined) {
        return Number(tier.fee);
    }
    return null; 
};

const InternetBillForm = ({ product, onInitiateDirectCheckout, allDigitalPackages, allFeeRules }) => {
    const [formError, setFormError] = useState('');
    const [formData, setFormData] = useState({});
    const [finalSelectedPackage, setFinalSelectedPackage] = useState(null);
    const [customInternetAmount, setCustomInternetAmount] = useState('');
    const [isCustomInternetAmount, setIsCustomInternetAmount] = useState(false);
    const [selectedQuota, setSelectedQuota] = useState(null);
    const [servicePackages, setServicePackages] = useState([]);

    useEffect(() => {
        if (product && allDigitalPackages) {
            const packageDoc = allDigitalPackages.find(doc => doc.serviceId === product.dynamicServiceId && Array.isArray(doc.packages));
            if (packageDoc) {
                setServicePackages(packageDoc.packages);
            }
        }
    }, [product, allDigitalPackages]);

    const fieldsForService = useMemo(() => product?.requiredFields || [], [product]);
    
    const feeRule = useMemo(() => {
        if (product?.feeRuleId && allFeeRules) {
            return allFeeRules.find(rule => rule.id === product.feeRuleId);
        }
        return null;
    }, [product?.feeRuleId, allFeeRules]);

    const pointsToEarn = useMemo(() => {
        const billAmount = Number(customInternetAmount);
        if (billAmount > 0) {
            const weTax = billAmount * 0.14;
            const grossAmount = billAmount + weTax;
            const serviceFee = getFeeForAmount(billAmount, feeRule);
            if (serviceFee !== null) {
                const totalCost = grossAmount + serviceFee;
                return Math.floor(totalCost);
            }
        }
        return 0;
    }, [customInternetAmount, feeRule]);

    const internetQuotas = useMemo(() => {
        if (!servicePackages || servicePackages.length === 0) return {};
        const quotas = {};
        servicePackages.forEach(pkg => {
            if (pkg.quotaName && Array.isArray(pkg.speeds)) {
                if (!quotas[pkg.quotaName]) quotas[pkg.quotaName] = new Set();
                quotas[pkg.quotaName].add(...pkg.speeds);
            }
        });
        const sortedQuotaKeys = Object.keys(quotas).sort((a, b) => parseInt(a.match(/\d+/)?.[0] || 0) - parseInt(b.match(/\d+/)?.[0] || 0));
        const sortedQuotas = {};
        sortedQuotaKeys.forEach(key => {
            const speeds = Array.from(quotas[key]);
            speeds.sort((a, b) => parseInt(a.speedName.match(/\d+/)?.[0] || 0) - parseInt(b.speedName.match(/\d+/)?.[0] || 0));
            sortedQuotas[key] = speeds;
        });
        return sortedQuotas;
    }, [servicePackages]);
    
    const handleSelectQuota = (quotaName) => {
        setSelectedQuota(selectedQuota === quotaName ? null : quotaName);
        setFinalSelectedPackage(null);
        setCustomInternetAmount('');
        setIsCustomInternetAmount(false);
    };

    const handleSelectSpeed = (pkg) => {
        setFinalSelectedPackage(pkg);
        setCustomInternetAmount(String(pkg.price || ''));
    };

    const handleSelectCustom = () => {
        setIsCustomInternetAmount(true);
        setSelectedQuota(null);
        setFinalSelectedPackage(null);
        setCustomInternetAmount('');
    };
    
    const handleInternetBillCheckout = () => {
        setFormError('');
        const landlineField = fieldsForService.find(f => f.id.includes('landline')) || { id: 'landline_number', label: 'رقم الخط الأرضي'};
        const landlineNumber = formData[landlineField.id] || '';

        if (!landlineNumber.trim() || !/^\d{8,}$/.test(landlineNumber.trim())) {
            setFormError(`يرجى إدخال ${landlineField.label} صحيح.`);
            return;
        }
        const billAmount = Number(customInternetAmount);
        if ((!isCustomInternetAmount && !finalSelectedPackage) || (isCustomInternetAmount && billAmount < 5)) {
            setFormError('يرجى اختيار باقة أو تحديد مبلغ صحيح (5 جنيه أو أكثر).');
            return;
        }
        if (billAmount > 3000) {
            setFormError('المبلغ المدخل خارج النطاق المسموح به (أقل من 3000 جنيه).');
            return;
        }
        
        const weTax = billAmount * 0.14;
        const grossAmount = billAmount + weTax;
        const serviceFee = getFeeForAmount(billAmount, feeRule);

        if (serviceFee === null) {
            setFormError('لا يمكن حساب رسوم الخدمة للمبلغ المدخل.');
            return;
        }
        
        const totalCost = grossAmount + serviceFee;
        
        onInitiateDirectCheckout(product, {
            finalPrice: totalCost,
            formData: [
                { label: landlineField.label, value: landlineNumber.trim(), id: landlineField.id },
                { label: 'صافي الرصيد المشحون', value: `${billAmount.toFixed(2)} ج.م`, id: 'billAmount' },
                { label: 'ضريبة القيمة المضافة (14%)', value: `+${weTax.toFixed(2)} ج.م`, id: 'weTax' },
                { label: 'رسوم الخدمة', value: `+${serviceFee.toFixed(2)} ج.م`, id: 'serviceFee' },
            ],
            packageName: finalSelectedPackage ? `${selectedQuota} ${finalSelectedPackage.speedName}` : `سداد فاتورة بصافي رصيد ${billAmount} ج.م`,
            package: { imageUrl: product.imageUrl },
            isCustomAmount: !finalSelectedPackage,
        });
    };

    if (product.feeRuleId && !feeRule && allFeeRules && allFeeRules.length > 0) {
        return React.createElement("div", { className: "text-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg" },
            React.createElement("p", { className: "text-red-600 dark:text-red-300 font-semibold" }, "خطأ في الإعدادات: لم يتم العثور على هيكل الرسوم المحدد لهذا المنتج.")
        );
    }
    
    const landlineField = fieldsForService.find(f => f.id.includes('landline')) || { id: 'landline_number', label: 'رقم الخط الأرضي (بكود المحافظة)' };
    const landlineNumber = formData[landlineField.id] || '';
    const billAmount = Number(customInternetAmount);
    const weTax = billAmount > 0 ? billAmount * 0.14 : 0;
    const grossAmount = billAmount + weTax;
    const serviceFee = getFeeForAmount(billAmount, feeRule);
    const totalCost = (billAmount > 0 && serviceFee !== null) ? grossAmount + serviceFee : null;
    const isCheckoutDisabled = totalCost === null || !landlineNumber.trim() || !/^\d{8,}$/.test(landlineNumber.trim());

    return React.createElement("form", {
        onSubmit: (e) => { e.preventDefault(); handleInternetBillCheckout(); },
        className: "space-y-4"
    },
        React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3 text-center" }, `دفع فاتورة ${product.brand}`),
        React.createElement(FloatingInput, {
            id: landlineField.id,
            value: formData[landlineField.id] || '',
            onChange: (e) => setFormData(prev => ({ ...prev, [landlineField.id]: e.target.value.replace(/\D/g, '') })),
            placeholder: `${landlineField.label} *`,
            type: "tel",
            required: true
        }),
        React.createElement("div", null,
            React.createElement("label", { className: "block text-sm font-medium mb-2 text-dark-800 dark:text-dark-100" }, "1. اختر حجم الباقة *"),
            React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3" },
                Object.keys(internetQuotas).map(quotaName => (
                    React.createElement("button", {
                        key: quotaName, type: "button", onClick: () => handleSelectQuota(quotaName),
                        className: `text-center p-3 rounded-xl border-2 transition-all duration-200 transform hover:-translate-y-1 ${selectedQuota === quotaName ? 'border-primary bg-primary/5' : 'border-light-300 dark:border-dark-600 bg-white dark:bg-dark-800'}`
                    }, React.createElement("p", { className: "text-dark-800 dark:text-dark-100 font-semibold text-sm" }, quotaName))
                )),
                React.createElement("button", {
                    type: "button", onClick: handleSelectCustom,
                    className: `text-center p-3 rounded-xl border-2 transition-all duration-200 transform hover:-translate-y-1 ${isCustomInternetAmount ? 'border-primary bg-primary/5' : 'border-light-300 dark:border-dark-600 bg-white dark:bg-dark-800'}`
                }, React.createElement("p", { className: "text-dark-800 dark:text-dark-100 font-semibold text-sm" }, "مبلغ آخر"))
            )
        ),
        selectedQuota && React.createElement("div", { className: "mt-4" },
            React.createElement("label", { className: "block text-sm font-medium mb-2 text-dark-800 dark:text-dark-100" }, "2. اختر السرعة *"),
            React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3" },
                internetQuotas[selectedQuota].map(pkg => (
                    React.createElement("button", {
                        key: pkg.speedName, type: "button", onClick: () => handleSelectSpeed(pkg),
                        className: `text-center p-3 rounded-xl border-2 transition-all duration-200 transform hover:-translate-y-1 ${finalSelectedPackage?.speedName === pkg.speedName ? 'border-primary bg-primary/5' : 'border-light-300 dark:border-dark-600 bg-white dark:bg-dark-800'}`
                    },
                        React.createElement("p", { className: "text-dark-800 dark:text-dark-100 font-semibold text-sm" }, pkg.speedName),
                        React.createElement("div", { className: "text-xs text-dark-600 dark:text-dark-300 mt-1" }, `صافي رصيد: ${(pkg.price || 0)} ج.م`)
                    )
                ))
            )
        ),
        isCustomInternetAmount && React.createElement("div", { className: "mt-4" },
            React.createElement(FloatingInput, {
                id: "custom-internet-amount", value: customInternetAmount,
                onChange: (e) => setCustomInternetAmount(e.target.value.replace(/\D/g, '')),
                placeholder: "أدخل صافي الرصيد المطلوب (5 - 3000 جنيه)", type: "tel", required: true
            })
        ),
        (totalCost !== null && totalCost > 0) && React.createElement("div", { className: "p-3 bg-light-100 dark:bg-dark-700 rounded-lg border border-light-200 dark:border-dark-600 text-center space-y-2" },
            React.createElement("div", { className: "space-y-1" },
                React.createElement("p", { className: "text-sm flex justify-between items-center text-dark-800 dark:text-dark-100" }, React.createElement("span", null, "صافي الرصيد المطلوب:"), React.createElement("span", { className: "font-semibold tabular-nums" }, `${billAmount.toFixed(2)} ج.م`)),
                React.createElement("p", { className: "text-sm flex justify-between items-center text-dark-800 dark:text-dark-100" }, React.createElement("span", null, "ضريبة القيمة المضافة (14%):"), React.createElement("span", { className: "font-semibold tabular-nums" }, `+${weTax.toFixed(2)} ج.م`)),
                serviceFee !== null && React.createElement("p", { className: "text-sm flex justify-between items-center text-dark-800 dark:text-dark-100" }, React.createElement("span", null, "رسوم الخدمة:"), React.createElement("span", { className: "font-semibold tabular-nums" }, `+${serviceFee.toFixed(2)} ج.م`)),
                React.createElement("hr", { className: "border-light-300 dark:border-dark-600 my-1" }),
                React.createElement("p", { className: "text-md font-bold flex justify-between items-center text-primary" }, React.createElement("span", null, "الإجمالي للدفع:"), React.createElement("span", { className: "tabular-nums text-lg" }, `${totalCost.toFixed(2)} ج.م`))
            ),
            (pointsToEarn > 0) && React.createElement("p", { className: "mt-2 pt-2 border-t border-light-200 dark:border-dark-600 flex items-center justify-center gap-1 text-xs text-yellow-700 dark:text-yellow-300 font-medium" },
                React.createElement(StarIcon, { filled: true, className: "w-3.5 h-3.5" }),
                React.createElement("span", null, `ستحصل على ${pointsToEarn} نقطة`)
            )
        ),
        (billAmount > 0) && React.createElement("div", { className: "mt-4 bg-orange-100 dark:bg-orange-700/20 p-3 rounded-md border border-orange-300 dark:border-orange-700/50 flex gap-3" },
            React.createElement("div", { className: "flex-shrink-0 pt-0.5" }, React.createElement(InfoIcon, { className: "w-5 h-5 text-orange-600 dark:text-orange-300" })),
            React.createElement("div", { className: "text-xs text-orange-700 dark:text-orange-300 space-y-2" },
                React.createElement("p", { className: "font-bold text-sm" }, "ملاحظة هامة حول الرسوم وضريبة القيمة المضافة:"),
                React.createElement("p", null, "يرجى العلم، ضريبة القيمة المضافة هي ضريبة حكومية مفروضة من قبل الحكومة المصرية على خدمة الإنترنت الأرضي. تُطبق هذه الضريبة على جميع شركات الإنترنت في مصر (مثل WE وغيرها) ويتحملها المستهلك النهائي. يتم خصمها تلقائيًا من المبلغ المدفوع عبر أي وسيلة أو خدمة شحن، وهذا يعني أنها إلزامية ومُطبقة على الجميع، وليس لها علاقة بخدمتنا بشكل خاص.")
            )
        ),
        formError && React.createElement("p", { className: "text-red-500 text-sm mt-1 text-center" }, formError),
        React.createElement("div", { className: "pt-4 border-t border-light-200 dark:border-dark-600 mt-auto" },
            React.createElement("button", {
                type: "submit", disabled: isCheckoutDisabled,
                className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            },
                React.createElement(ShoppingCartIcon, { className: "w-5 h-5" }),
                "إتمام الدفع الآن"
            )
        )
    );
};

export { InternetBillForm };