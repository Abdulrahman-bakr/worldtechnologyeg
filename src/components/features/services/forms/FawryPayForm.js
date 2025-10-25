import React, { useState, useMemo } from 'react';
import { ShoppingCartIcon, StarIcon } from '../../../icons/index.js';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';

const getFawryPayFee = (amount) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 1) return null;
    if (numAmount <= 300) return 5;
    if (numAmount <= 600) return 10;
    if (numAmount <= 1000) return 15;
    if (numAmount <= 1500) return 20;
    if (numAmount <= 2000) return 25;
    if (numAmount <= 2500) return 32.5;
    if (numAmount <= 3000) return 40;
    if (numAmount <= 3500) return 47.5;
    if (numAmount <= 4000) return 55;
    if (numAmount <= 4500) return 62.5;
    if (numAmount <= 5000) return 70;
    if (numAmount <= 5500) return 77.5;
    if (numAmount <= 6000) return 85;
    if (numAmount <= 6500) return 92.5;
    if (numAmount <= 7000) return 100;
    if (numAmount <= 7500) return 107.5;
    if (numAmount <= 8000) return 115;
    if (numAmount <= 8500) return 122.5;
    if (numAmount <= 9000) return 110;
    if (numAmount <= 9500) return 115;
    if (numAmount <= 10000) return 125;
    if (numAmount <= 10500) return 152.5;
    if (numAmount <= 11000) return 160;
    if (numAmount <= 11500) return 167.5;
    if (numAmount <= 12000) return 175;
    if (numAmount <= 12500) return 182.5;
    if (numAmount <= 13000) return 190;
    if (numAmount <= 13500) return 197.5;
    if (numAmount <= 14000) return 205;
    if (numAmount <= 14500) return 212.5;
    if (numAmount <= 15000) return 220;
    if (numAmount <= 15500) return 227.5;
    if (numAmount <= 16000) return 235;
    if (numAmount <= 16500) return 242.5;
    if (numAmount <= 17000) return 250;
    if (numAmount <= 17500) return 257.5;
    if (numAmount <= 18000) return 265;
    if (numAmount <= 18500) return 272.5;
    if (numAmount <= 19000) return 280;
    if (numAmount <= 19500) return 287.5;
    if (numAmount <= 20000) return 295;
    if (numAmount <= 20500) return 302.5;
    if (numAmount <= 21000) return 310;
    if (numAmount <= 21500) return 317.5;
    if (numAmount <= 22000) return 325;
    if (numAmount <= 22500) return 332.5;
    if (numAmount <= 23000) return 340;
    if (numAmount <= 23500) return 347.5;
    if (numAmount <= 24000) return 355;
    if (numAmount <= 24500) return 362.5;
    if (numAmount <= 25000) return 370;
    if (numAmount <= 25500) return 377.5;
    if (numAmount <= 26000) return 385;
    if (numAmount <= 26500) return 392.5;
    if (numAmount <= 27000) return 400;
    if (numAmount <= 27500) return 407.5;
    if (numAmount <= 28000) return 415;
    if (numAmount <= 28500) return 422.5;
    if (numAmount <= 29000) return 430;
    if (numAmount <= 29500) return 437.5;
    if (numAmount <= 30000) return 445;
    if (numAmount <= 30500) return 452.5;
    if (numAmount <= 31000) return 460;
    if (numAmount <= 31500) return 467.5;
    if (numAmount <= 32000) return 475;
    if (numAmount <= 32500) return 482.5;
    if (numAmount <= 33000) return 490;
    if (numAmount <= 33500) return 497.5;
    if (numAmount <= 34000) return 505;
    if (numAmount <= 34500) return 512.5;
    if (numAmount <= 35000) return 520;
    if (numAmount <= 35500) return 527.5;
    if (numAmount <= 36000) return 535;
    if (numAmount <= 36500) return 542.5;
    if (numAmount <= 37000) return 550;
    if (numAmount <= 37500) return 557.5;
    if (numAmount <= 38000) return 565;
    if (numAmount <= 38500) return 572.5;
    if (numAmount <= 39000) return 580;
    if (numAmount <= 39500) return 587.5;
    if (numAmount <= 40000) return 595;
    if (numAmount <= 40500) return 602.5;
    if (numAmount <= 41000) return 610;
    if (numAmount <= 41500) return 617.5;
    if (numAmount <= 42000) return 625;
    if (numAmount <= 42500) return 632.5;
    if (numAmount <= 43000) return 640;
    if (numAmount <= 43500) return 647.5;
    if (numAmount <= 44000) return 655;
    if (numAmount <= 44500) return 662.5;
    if (numAmount <= 45000) return 670;
    if (numAmount <= 45500) return 677.5;
    if (numAmount <= 46000) return 685;
    if (numAmount <= 46500) return 692.5;
    if (numAmount <= 47000) return 700;
    if (numAmount <= 47500) return 707.5;
    if (numAmount <= 48000) return 715;
    if (numAmount <= 48500) return 722.5;
    if (numAmount <= 49000) return 730;
    if (numAmount <= 49500) return 737.5;
    if (numAmount <= 50000) return 745;
    if (numAmount <= 50500) return 752.5;
    if (numAmount <= 51000) return 760;
    if (numAmount <= 51500) return 767.5;
    if (numAmount <= 52000) return 775;
    if (numAmount <= 52500) return 782.5;
    if (numAmount <= 53000) return 790;
    if (numAmount <= 53500) return 797.5;
    if (numAmount <= 54000) return 805;
    if (numAmount <= 54500) return 812.5;
    if (numAmount <= 55000) return 820;
    if (numAmount <= 55500) return 827.5;
    if (numAmount <= 56000) return 835;
    if (numAmount <= 56500) return 842.5;
    if (numAmount <= 60000) return 850;
    return null; // Amount is out of range
};

const FawryPayForm = ({ product, onInitiateDirectCheckout }) => {
    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState('');

    const fields = useMemo(() => product.requiredFields || [], [product]);
    const amountField = useMemo(() => fields.find(f => f.id.toLowerCase().includes('amount')) || { id: 'paymentAmount', label: 'المبلغ' }, [fields]);
    const codeField = useMemo(() => fields.find(f => f.id.toLowerCase().includes('code')) || { id: 'fawryCode', label: 'كود الدفع' }, [fields]);
    
    const amount = Number(formData[amountField.id]) || 0;
    const code = formData[codeField.id] || '';

    const fee = getFawryPayFee(amount);
    const total = fee !== null ? amount + fee : null;

    const isCheckoutDisabled = total === null || !code.trim();

    const pointsToEarn = useMemo(() => {
        const feeVal = getFawryPayFee(amount);
        return feeVal ? Math.floor(feeVal) : 0;
    }, [amount]);
    
    const handleCheckout = () => {
        if (isCheckoutDisabled) {
            setFormError("يرجى ملء جميع الحقول المطلوبة بمبلغ صحيح.");
            return;
        }
        setFormError('');
        onInitiateDirectCheckout(product, {
            finalPrice: total,
            formData: [
                { label: codeField.label, value: code, id: codeField.id },
                { label: 'المبلغ المدفوع', value: `${amount.toFixed(2)} ج.م`, id: amountField.id },
                { label: 'رسوم الخدمة', value: `${fee.toFixed(2)} ج.م`, id: 'serviceFee' },
            ]
        });
    };

    return React.createElement("form", {
        onSubmit: (e) => { e.preventDefault(); handleCheckout(); },
        className: "space-y-4"
    },
        React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3 text-center" }, product.arabicName),
        React.createElement(FloatingInput, { 
            id: codeField.id, 
            value: formData[codeField.id] || '', 
            onChange: e => setFormData(p => ({...p, [codeField.id]: e.target.value})), 
            placeholder: `${codeField.label} *`, 
            required: true 
        }),
        React.createElement(FloatingInput, { 
            id: amountField.id, 
            value: formData[amountField.id] || '', 
            onChange: e => setFormData(p => ({...p, [amountField.id]: e.target.value.replace(/[^0-9.]/g, '')})), 
            placeholder: `${amountField.label} *`, 
            type: "number",
            required: true
        }),
        
        (total !== null && total > 0) && React.createElement("div", { className: "p-3 bg-light-100 dark:bg-dark-700 rounded-lg border border-light-200 dark:border-dark-600 text-center space-y-2" },
            React.createElement("div", { className: "space-y-1" },
                React.createElement("p", { className: "text-sm flex justify-between items-center text-dark-800 dark:text-dark-100" }, React.createElement("span", null, "المبلغ المدفوع:"), React.createElement("span", { className: "font-semibold tabular-nums" }, `${amount.toFixed(2)} ج.م`)),
                React.createElement("p", { className: "text-sm flex justify-between items-center text-dark-800 dark:text-dark-100" }, React.createElement("span", null, "رسوم الخدمة:"), React.createElement("span", { className: "font-semibold tabular-nums" }, `+${fee.toFixed(2)} ج.م`)),
                React.createElement("hr", { className: "border-light-300 dark:border-dark-600 my-1" }),
                React.createElement("p", { className: "text-md font-bold flex justify-between items-center text-primary" }, React.createElement("span", null, "الإجمالي للدفع:"), React.createElement("span", { className: "tabular-nums text-lg" }, `${total.toFixed(2)} ج.م`))
            ),
            (pointsToEarn > 0) && React.createElement("p", { className: "mt-2 pt-2 border-t border-light-200 dark:border-dark-600 flex items-center justify-center gap-1 text-xs text-yellow-700 dark:text-yellow-300 font-medium" }, 
                React.createElement(StarIcon, { filled: true, className: "w-3.5 h-3.5" }),
                React.createElement("span", null, `ستربح ${pointsToEarn} نقطة على رسوم الخدمة`)
            )
        ),
        
        formError && React.createElement("p", { className: "text-red-500 text-sm mt-1 text-center" }, formError),

        React.createElement("div", { className: "pt-4 border-t border-light-200 dark:border-dark-600 mt-auto" },
            React.createElement("button", {
                type: "submit",
                disabled: isCheckoutDisabled,
                className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            }, 
                React.createElement(ShoppingCartIcon, { className: "w-5 h-5" }),
                "إتمام الدفع"
            )
        )
    );
};

export { FawryPayForm };