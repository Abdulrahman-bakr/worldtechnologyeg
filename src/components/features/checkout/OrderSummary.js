import React from 'react';

const OrderSummary = ({
    totalAmount = 0,
    tierInfo = { name: "برونزي", discount: 0, color: "text-orange-400" },
    tierDiscountAmount = 0,
    subtotalAfterTierDiscount = 0,
    pointsToApply, setPointsToApply,
    pointsAvailable = 0,
    discountToApply = 0,
    pointsToRedeem = 0,
    roundedFinalAmount = 0,
    finalAmountBeforeRounding = 0,
    roundingDifference = 0,
    couponInfo,
    isWEBillCheckout,
    itemToCheckout
}) => {
    
    let weBillDetails = null;
    if (isWEBillCheckout && itemToCheckout) {
        const findField = (id) => itemToCheckout.serviceDetails.formData.find(f => f.id === id);
        weBillDetails = {
            netCredit: findField('billAmount')?.value,
            vat: findField('weTax')?.value,
            serviceFee: findField('serviceFee')?.value,
        };
    }

    const handlePointsInputChange = (e) => {
        const value = e.target.value;
        if (value === '') {
            setPointsToApply('');
        } else {
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue) && numValue >= 0) {
                const maxPointsForSubtotal = Math.floor(subtotalAfterTierDiscount * 100);
                setPointsToApply(Math.min(numValue, pointsAvailable, maxPointsForSubtotal));
            }
        }
    };
    
    const handleMaxPoints = () => {
        const maxPointsForSubtotal = Math.floor(subtotalAfterTierDiscount * 100);
        setPointsToApply(Math.min(pointsAvailable, maxPointsForSubtotal));
    };


    if (isWEBillCheckout && weBillDetails) {
        return (
            React.createElement("div", { className: "p-3 mb-4 bg-light-100 dark:bg-dark-700/50 rounded-lg space-y-2 text-sm" },
                React.createElement("h3", { className: "text-md font-semibold text-dark-900 dark:text-dark-50 mb-2 border-b border-light-300 dark:border-dark-600 pb-1" }, "ملخص دفع فاتورة الإنترنت"),
                React.createElement("p", {className: "flex justify-between"}, React.createElement("span", null, "الرصيد الذي سيصلك في الحساب:"), React.createElement("span", {className: "font-semibold tabular-nums"}, weBillDetails.netCredit)),
                React.createElement("p", {className: "flex justify-between"}, React.createElement("span", null, "ضريبة القيمة المضافة (14%):"), React.createElement("span", {className: "font-semibold tabular-nums"}, weBillDetails.vat)),
                React.createElement("p", {className: "flex justify-between"}, React.createElement("span", null, "رسوم الخدمة:"), React.createElement("span", {className: "font-semibold tabular-nums"}, weBillDetails.serviceFee)),
                (discountToApply > 0) && React.createElement("p", { className: "flex justify-between text-green-600 dark:text-green-400" }, `خصم النقاط (${pointsToRedeem} نقطة):`, React.createElement("span", { className: "font-semibold tabular-nums" }, `-${discountToApply.toFixed(2)} ج.م`)),
                React.createElement("hr", {className: "border-light-300 dark:border-dark-600 my-1"}),
                React.createElement("p", {className: "flex justify-between text-lg font-bold text-primary"}, React.createElement("span", null, "الإجمالي للدفع:"), React.createElement("span", {className: "tabular-nums text-2xl"}, `${roundedFinalAmount.toFixed(2)} ج.م`)),
                (roundingDifference !== 0) && React.createElement("p", { className: "text-xs text-center text-dark-600 dark:text-dark-300 mt-1" }, `(تم تقريب المبلغ من ${finalAmountBeforeRounding.toFixed(2)} ج.م لتسهيل عملية الدفع)`)
            )
        );
    }

    const subtotalBeforeDiscounts = totalAmount;

    return (
        React.createElement(React.Fragment, null,
            (pointsAvailable > 0) && React.createElement("div", { className: "p-3 mb-3 bg-yellow-100 dark:bg-yellow-800/50 border border-yellow-300 dark:border-yellow-600 rounded-lg space-y-2" },
                React.createElement("label", { className: "font-semibold text-yellow-800 dark:text-yellow-100" }, `استخدم نقاطك (لديك ${pointsAvailable} نقطة)`),
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("input", {
                        type: "number",
                        value: pointsToApply,
                        onChange: handlePointsInputChange,
                        placeholder: "أدخل النقاط",
                        className: "w-full p-2 rounded-md border border-yellow-300 dark:border-yellow-600 bg-white dark:bg-dark-700"
                    }),
                    React.createElement("button", {
                        type: "button",
                        onClick: handleMaxPoints,
                        className: "flex-shrink-0 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-md font-semibold text-sm hover:bg-yellow-500"
                    }, "الحد الأقصى")
                )
            ),
            React.createElement("div", { className: "p-3 mb-4 bg-light-100 dark:bg-dark-700/50 rounded-lg space-y-2" },
                (tierDiscountAmount > 0 || discountToApply > 0 || couponInfo?.couponDiscount > 0) && React.createElement("div", { className: "flex justify-between items-center text-sm" },
                    React.createElement("span", { className: "text-dark-700 dark:text-dark-200" }, "المجموع الفرعي:"),
                    React.createElement("span", { className: "text-dark-700 dark:text-dark-200 tabular-nums" }, `${subtotalBeforeDiscounts.toFixed(2)} ج.م`)
                ),
                 (couponInfo?.couponDiscount > 0) && React.createElement("div", { className: "flex justify-between items-center text-sm" },
                    React.createElement("span", { className: "text-green-600 dark:text-green-400" }, `خصم كوبون (${couponInfo.appliedCoupon.code}):`),
                    React.createElement("span", { className: "text-green-600 dark:text-green-400 font-semibold tabular-nums" }, `-${couponInfo.couponDiscount.toFixed(2)} ج.م`)
                ),
                (tierDiscountAmount > 0) && React.createElement("div", { className: "flex justify-between items-center text-sm" },
                    React.createElement("span", { className: `font-semibold ${tierInfo.color}` }, `خصم المستوى ${tierInfo.name} (${tierInfo.discount * 100}%):`),
                    React.createElement("span", { className: `font-semibold tabular-nums ${tierInfo.color}` }, `-${tierDiscountAmount.toFixed(2)} ج.م`)
                ),
                (discountToApply > 0) && React.createElement("div", { className: "flex justify-between items-center text-sm" },
                    React.createElement("span", { className: "text-green-600 dark:text-green-400" }, `خصم النقاط (${pointsToRedeem} نقطة):`),
                    React.createElement("span", { className: "text-green-600 dark:text-green-400 font-semibold tabular-nums" }, `-${discountToApply.toFixed(2)} ج.م`)
                ),
                React.createElement("div", { className: `flex justify-between items-center ${(tierDiscountAmount > 0 || discountToApply > 0 || couponInfo?.couponDiscount > 0) ? 'border-t border-light-300 dark:border-dark-600 pt-2 mt-2' : ''}` },
                    React.createElement("span", { className: "text-lg font-bold text-dark-900 dark:text-dark-50" }, "الإجمالي المطلوب:"),
                    React.createElement("span", { className: "text-2xl font-bold text-primary tabular-nums" }, `${roundedFinalAmount.toFixed(2)} ج.م`)
                ),
                (roundingDifference !== 0) && React.createElement("p", { className: "text-xs text-center text-dark-600 dark:text-dark-300 mt-1" }, `(تم تقريب المبلغ من ${finalAmountBeforeRounding.toFixed(2)} ج.م لتسهيل عملية الدفع)`)
            )
        )
    );
};

export { OrderSummary };