import React, { useState, useEffect, useMemo } from 'react';
import { CloseIcon } from '../../icons/index.js';
import { CheckoutProgressBar } from './CheckoutProgressBar.js';
import { SingleServiceDetails } from './SingleServiceDetails.js';
import { CustomerDetailsForm } from './CustomerDetailsForm.js';
import { ShippingForm } from './ShippingForm.js';
import { OrderSummary } from './OrderSummary.js';
import { PaymentForm } from './PaymentForm.js';
import { useCheckoutForm } from '../../../hooks/useCheckoutForm.js';
import { useCheckoutProgress } from './useCheckoutProgress.js';

const CheckoutModal = ({ 
    isOpen, onClose, onClosed, cartItems, itemToCheckout,
    onCompleteOrder, currentUser, onUpdateCurrentUserAddress, checkoutPayload, loyaltySettings
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [contentAnimation, setContentAnimation] = useState('');
  
  const itemsForCheckout = itemToCheckout ? [itemToCheckout] : (cartItems || []);
  const isDirectSingleServiceCheckout = !!itemToCheckout;
  
  // Animation and visibility effect
  useEffect(() => {
    if (isOpen) {
        setIsRendered(true);
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            setContentAnimation();
        });
    } else if (isRendered) {
        document.body.style.overflow = '';
        setContentAnimation();
        const timer = setTimeout(() => {
            setIsRendered(false);
            if (onClosed) onClosed();
        }, 300);
        return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, isRendered, onClosed]);

  const amountForCalculation = useMemo(() => {
    return checkoutPayload?.amount || 0;
  }, [checkoutPayload]);

  const form = useCheckoutForm({
      isOpen, currentUser, itemToCheckout, cartItems, onCompleteOrder, onUpdateCurrentUserAddress,
      amountForCalculation,
      couponInfo: checkoutPayload?.couponInfo,
      loyaltySettings: loyaltySettings,
  });

  const { roundedFinalAmount, summaryProps, applyPoints, setApplyPoints } = form;

  const checkoutSteps = useMemo(() => {
    const steps = [{ id: 1, title: isDirectSingleServiceCheckout ? "تفاصيل الخدمة" : "بيانات العميل" }];
    if (form.requiresPhysicalShipping) {
      steps.push({ id: 2, title: "بيانات الشحن" });
    }
    steps.push({ id: steps.length + 1, title: "تفاصيل الدفع" });
    return steps;
  }, [isDirectSingleServiceCheckout, form.requiresPhysicalShipping]);

  const progress = useCheckoutProgress({
      checkoutSteps,
      customerName: form.customerName, customerPhone: form.customerPhone,
      requiresPhysicalShipping: form.requiresPhysicalShipping,
      selectedGovernorate: form.selectedGovernorate, selectedCity: form.selectedCity, addressDetails: form.addressDetails,
      selectedPaymentMethod: form.selectedPaymentMethod, paymentTransactionInfo: form.paymentTransactionInfo,
      isDirectSingleServiceCheckout, itemToCheckout,
      containsOnlyDigitalServices: form.containsOnlyDigitalServices,
  });

  const handleOverlayClick = (e) => { if (e.target === e.currentTarget) onClose(); };

  if (!isRendered || !isOpen) return null;

  return React.createElement("div", {
      className: `fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 ${isRendered ? '' : 'hidden'}`,
      role: "dialog", "aria-modal": "true", "aria-labelledby": "checkout-title"
    },
    React.createElement("div", { className: `modal-overlay absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`, onClick: handleOverlayClick, "aria-hidden": "true" }),
    React.createElement("div", { className: `modal-content bg-white dark:bg-dark-800 rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-xl relative ${contentAnimation} border border-light-200 dark:border-dark-700 max-h-[90vh] flex flex-col` },
      React.createElement("button", { onClick: onClose, "aria-label": "إغلاق", className: "absolute top-3 left-3 sm:top-4 sm:left-4 text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-dark-50 p-1" }, React.createElement(CloseIcon, {className: "w-5 h-5 sm:w-6 sm:h-6"})),
      React.createElement("h2", { id: "checkout-title", className: "text-xl sm:text-2xl font-bold text-center text-primary mb-4 sm:mb-6" }, "إكمال عملية الشراء"),
      React.createElement(CheckoutProgressBar, { steps: checkoutSteps, currentStep: progress.currentStep, progressBarWidth: progress.progressBarLineWidth }),
      React.createElement("div", { className: "overflow-y-auto pr-1 sm:pr-2 flex-grow space-y-4" },
        isDirectSingleServiceCheckout && itemToCheckout && React.createElement(SingleServiceDetails, { item: itemToCheckout }),
        !isDirectSingleServiceCheckout && React.createElement(CustomerDetailsForm, {
            customerName: form.customerName, setCustomerName: form.setCustomerName,
            customerPhone: form.customerPhone, setCustomerPhone: form.setCustomerPhone,
            customerAltPhone: form.customerAltPhone, setCustomerAltPhone: form.setCustomerAltPhone,
            renderError: form.renderError
        }),
        form.requiresPhysicalShipping && React.createElement(ShippingForm, {
            selectedGovernorate: form.selectedGovernorate, setSelectedGovernorate: form.setSelectedGovernorate,
            selectedCity: form.selectedCity, setSelectedCity: form.setSelectedCity,
            availableCities: form.availableCities,
            addressDetails: form.addressDetails, setAddressDetails: form.setAddressDetails,
            renderError: form.renderError
        }),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "order-notes", className: "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100" }, "ملاحظات الطلب (اختياري)"),
            React.createElement("textarea", { id: "order-notes", value: form.orderNotes, onChange: (e) => form.setOrderNotes(e.target.value), className: `w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base min-h-[60px]`, placeholder: "أي تعليمات إضافية..." })
        ),
        React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 border-b border-light-300 dark:border-dark-600 pb-2 mb-3 pt-3" }, "2. تفاصيل الدفع"),
        React.createElement(OrderSummary, {
            ...summaryProps,
            roundedFinalAmount: roundedFinalAmount,
            applyPoints, setApplyPoints,
            totalAmount: amountForCalculation,
            couponInfo: checkoutPayload?.couponInfo,
            isWEBillCheckout: isDirectSingleServiceCheckout && itemToCheckout.product.dynamicServiceId === 'we-internet-billing',
            itemToCheckout
        }),
        React.createElement(PaymentForm, {
            selectedPaymentMethod: form.selectedPaymentMethod, setSelectedPaymentMethod: form.setSelectedPaymentMethod,
            paymentTransactionInfo: form.paymentTransactionInfo, setPaymentTransactionInfo: form.setPaymentTransactionInfo,
            containsOnlyDigitalServices: form.containsOnlyDigitalServices,
            renderError: form.renderError
        }),
      ),
      form.submissionError && React.createElement("p", { className: "text-red-500 text-sm text-center mt-2" }, form.submissionError),
      React.createElement("div", { className: "flex flex-col sm:flex-row-reverse gap-2 sm:gap-3 pt-4 border-t border-light-200 dark:border-dark-600 mt-auto" },
        React.createElement("button", { onClick: form.handleConfirmOrder, disabled: form.isSubmitting, className: "w-full sm:flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors disabled:opacity-70" }, 
            form.isSubmitting ? "جاري التأكيد..." : "تأكيد الطلب وإرسال عبر واتساب"
        ),
        React.createElement("button", { onClick: onClose, disabled: form.isSubmitting, className: "w-full sm:flex-1 bg-light-200 dark:bg-dark-600 hover:bg-light-300 dark:hover:bg-dark-500 text-dark-800 dark:text-dark-100 font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors border border-light-300 dark:border-dark-500 disabled:opacity-70" }, "إلغاء")
      )
    )
  );
};

export { CheckoutModal };