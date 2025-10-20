import React from 'react';

const PaymentForm = ({
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentTransactionInfo,
    setPaymentTransactionInfo,
    containsOnlyDigitalServices,
    renderError
}) => {
    const radioLabelBaseClassName = "flex items-center space-x-2 space-x-reverse p-3 rounded-lg border border-light-300 dark:border-dark-600 cursor-pointer hover:border-primary transition-colors";
    const radioInputClassName = "form-radio h-4 w-4 text-primary focus:ring-primary";
    const inputClassName = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base";
    const labelClassName = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";

    const importantNoteText = (() => {
        if (containsOnlyDigitalServices) {
            return "الخدمات الرقمية تتطلب الدفع المسبق. يرجى اختيار فودافون كاش أو إنستاباي. بعد إدخال تفاصيل عملية الدفع ، سيتم توجيهك إلى واتساب لإرسال تفاصيل طلبك تلقائياً.";
        }
        switch (selectedPaymentMethod) {
            case 'cash_on_delivery':
                return "بعد إدخال بياناتك واختيار الدفع عند الاستلام، سيتم توجيهك إلى واتساب لإرسال تفاصيل طلبك. سيتم تأكيد الطلب وتحصيل المبلغ عند استلامك للمنتجات.";
            case 'vodafone_cash':
            case 'instapay':
                return "بعد إدخال بياناتك واختيار طريقة الدفع التي استخدمتها وإدخال تفاصيل العملية ، سيتم توجيهك إلى واتساب لإرسال تفاصيل طلبك تلقائياً.";
            default:
                return "يرجى اختيار طريقة الدفع أولاً. إذا اخترت الدفع عبر الإنترنت، يرجى التحويل ثم إدخال تفاصيل العملية . سيتم توجيهك إلى واتساب لإرسال تفاصيل طلبك.";
        }
    })();

    return (
        React.createElement(React.Fragment, null,
            React.createElement("div", {className: "space-y-3 mt-4"},
                React.createElement("label", { className: labelClassName }, "* اختر طريقة الدفع"),
                React.createElement("div", {className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"},
                    React.createElement("label", { 
                        className: `${radioLabelBaseClassName} 
                                    ${selectedPaymentMethod === 'cash_on_delivery' ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-dark-700'}
                                    ${containsOnlyDigitalServices ? 'opacity-50 cursor-not-allowed' : ''}` 
                    },
                        React.createElement("input", { 
                            type: "radio", name: "paymentMethod", value: "cash_on_delivery", 
                            checked: selectedPaymentMethod === 'cash_on_delivery', 
                            onChange: (e) => setSelectedPaymentMethod(e.target.value), 
                            className: radioInputClassName,
                            disabled: containsOnlyDigitalServices
                        }),
                        React.createElement("span", { className: "text-sm text-dark-900 dark:text-dark-50" }, "الدفع عند الاستلام")
                    ),
                    React.createElement("label", { className: `${radioLabelBaseClassName} ${selectedPaymentMethod === 'vodafone_cash' ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-dark-700'}` },
                        React.createElement("input", { type: "radio", name: "paymentMethod", value: "vodafone_cash", checked: selectedPaymentMethod === 'vodafone_cash', onChange: (e) => setSelectedPaymentMethod(e.target.value), className: radioInputClassName }),
                        React.createElement("span", { className: "text-sm text-dark-900 dark:text-dark-50" }, "فودافون كاش")
                    ),
                    React.createElement("label", { className: `${radioLabelBaseClassName} ${selectedPaymentMethod === 'instapay' ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-dark-700'}` },
                        React.createElement("input", { type: "radio", name: "paymentMethod", value: "instapay", checked: selectedPaymentMethod === 'instapay', onChange: (e) => setSelectedPaymentMethod(e.target.value), className: radioInputClassName }),
                        React.createElement("span", { className: "text-sm text-dark-900 dark:text-dark-50" }, "إنستاباي")
                    )
                ),
                renderError('selectedPaymentMethod'),
                containsOnlyDigitalServices && React.createElement("p", {className: "text-xs text-orange-600 dark:text-orange-400 mt-1"}, "الدفع عند الاستلام غير متاح للطلبات التي تحتوي على خدمات رقمية فقط.")
            ),
            (selectedPaymentMethod === 'vodafone_cash' || selectedPaymentMethod === 'instapay') && React.createElement("div", {className: "mt-3"},
                selectedPaymentMethod === 'vodafone_cash' && React.createElement("div", { className: "mb-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md text-sm text-blue-700 dark:text-blue-200" },
                    React.createElement("strong", null, "تعليمات فودافون كاش: "), "يرجى تحويل المبلغ المطلوب إلى الرقم التالي ثم إدخال رقم كاش أو آخر 4 أرقام من الرقم الذي حولت منه."
                ),
                selectedPaymentMethod === 'instapay' && React.createElement("div", { className: "mb-3 p-3 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 rounded-md text-sm text-teal-700 dark:text-teal-200" },
                    React.createElement("strong", null, "تعليمات إنستاباي: "), "يرجى تحويل المبلغ المطلوب الي عنوان الدفع التالي ثم إدخال اسم حسابك الذي حولت منه او عنوان الدفع ."
                ),
                React.createElement("div", { className: "my-3 p-3 bg-yellow-100 dark:bg-yellow-800/50 border-2 border-yellow-400 dark:border-yellow-500 rounded-lg text-center shadow" },
                    React.createElement("p", {className: "text-sm text-yellow-700 dark:text-yellow-200 mb-1"},
                        selectedPaymentMethod === 'vodafone_cash' ? " رقم الكاش الخاص بنا : " : "عنوان الدفع عبر إنستاباي الخاص بنا : "
                    ),
                    React.createElement("p", {className: "text-xl font-extrabold text-yellow-800 dark:text-yellow-100 tracking-wider"},
                        selectedPaymentMethod === 'vodafone_cash' ? "01026146714" : "abdo-bakr@instapay"
                    )
                ),
                React.createElement("label", { htmlFor: "payment-transaction-info", className: labelClassName }, 
                    selectedPaymentMethod === 'vodafone_cash' ?  "لتأكيد استلام المبلغ ، يرجي تزويدنا برقم الكاش الذي تم التحويل منه او (آخر 4 أرقام على الأقل) " : "لتأكيد استلام المبلغ، يرجى كتابة اسم الحساب المحول منه او عنوان الدفع (كما هو مسجل في إنستاباي)"
                ),
                React.createElement("input", { 
                    type: "text", 
                    id: "payment-transaction-info", 
                    value: paymentTransactionInfo, 
                    onChange: (e) => setPaymentTransactionInfo(e.target.value), 
                    className: inputClassName,
                    placeholder: selectedPaymentMethod === 'vodafone_cash' ? "مثال: 6714 أو رقم الكاش" : "مثال: abdo-bakr أو اسم الحساب",
                }),
                renderError('paymentTransactionInfo')
            ),
            React.createElement("p", { className: "text-xs text-orange-700 dark:text-orange-300 text-center mb-4 mt-4 bg-orange-100 dark:bg-orange-700/20 p-2 sm:p-3 rounded-md border border-orange-300 dark:border-orange-700/50" },
                React.createElement("strong", null, "ملاحظة هامة: "),
                importantNoteText
            )
        )
    );
};

export { PaymentForm };