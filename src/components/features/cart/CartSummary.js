import React from 'react';
import { TrashIcon } from '../../icons/index.js';

const CouponInput = ({ onApply, couponCode, setCouponCode, appliedCoupon, onRemove }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onApply(couponCode);
    };

    if (appliedCoupon) {
        return (
            React.createElement("div", { className: "p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600 rounded-lg flex justify-between items-center" },
                React.createElement("p", { className: "text-sm text-green-800 dark:text-green-200" }, `تم تطبيق كوبون: `, React.createElement("strong", null, appliedCoupon.code)),
                React.createElement("button", { onClick: onRemove, className: "p-1 text-green-700 dark:text-green-300 hover:text-red-500" }, React.createElement(TrashIcon, { className: "w-4 h-4" }))
            )
        );
    }
    
    return (
        React.createElement("form", { onSubmit: handleSubmit, className: "flex gap-2" },
            React.createElement("input", {
                type: "text",
                value: couponCode,
                onChange: (e) => setCouponCode(e.target.value.toUpperCase()),
                placeholder: "أدخل كود الخصم",
                className: "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700"
            }),
            React.createElement("button", { type: "submit", className: "bg-secondary hover:bg-secondary-hover text-white font-semibold py-2.5 px-5 rounded-lg" }, "تطبيق")
        )
    );
};


const CartSummary = ({
    subtotal, totalSaved, grandTotal, totalItemCount, onCheckoutRequest, onClose,
    couponCode, setCouponCode, onApplyCoupon, appliedCoupon, onRemoveCoupon, couponDiscount,
}) => (
    React.createElement("div", { className: "p-5 sm:p-6 border-t border-light-300 dark:border-dark-600" },
        React.createElement("div", { className: "mb-4" },
            React.createElement(CouponInput, {
                couponCode: couponCode,
                setCouponCode: setCouponCode,
                onApply: onApplyCoupon,
                appliedCoupon: appliedCoupon,
                onRemove: onRemoveCoupon
            })
        ),
        React.createElement("div", { className: "space-y-2 mb-4 text-sm" },
            React.createElement("p", { className: "flex justify-between items-center text-dark-700 dark:text-dark-200" }, `المجموع الفرعي:`, React.createElement("span", { className: "font-semibold tabular-nums" }, `${subtotal.toFixed(2)} ج.م`)),
            totalSaved > 0 && React.createElement("p", { className: "flex justify-between items-center text-green-600 dark:text-green-400" },
                `خصومات المنتجات:`, React.createElement("span", { className: "font-semibold tabular-nums" }, `-${totalSaved.toFixed(2)} ج.م`)
            ),
            couponDiscount > 0 && React.createElement("p", { className: "flex justify-between items-center text-green-600 dark:text-green-400" },
                `خصم الكوبون:`, React.createElement("span", { className: "font-semibold tabular-nums" }, `-${couponDiscount.toFixed(2)} ج.م`)
            ),
            React.createElement("div", { className: "flex justify-between items-center text-lg pt-2 border-t border-light-200 dark:border-dark-500 mt-2" },
                React.createElement("span", { className: "text-dark-800 dark:text-dark-100 font-bold" }, "الإجمالي الكلي:"),
                React.createElement("span", { className: "text-primary font-bold tabular-nums" }, `${grandTotal.toFixed(2)} ج.م`)
            ),
        ),
        React.createElement("button", {
            onClick: () => onCheckoutRequest(grandTotal),
            className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition-colors mb-2"
        }, "إتمام الشراء"),
        React.createElement("button", {
            onClick: onClose,
            className: "w-full bg-light-200 dark:bg-dark-600 hover:bg-light-300 dark:hover:bg-dark-500 text-dark-800 dark:text-dark-100 font-semibold py-3 rounded-lg transition-colors border border-light-300 dark:border-dark-500"
        }, "متابعة التسوق")
    )
);

export { CartSummary };