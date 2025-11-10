import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { CloseIcon } from '../../icons/index.js';
import { CheckoutProgressBar } from './CheckoutProgressBar.js';
import { SingleServiceDetails } from './SingleServiceDetails.js';
import { useCheckoutForm } from '../../../hooks/useCheckoutForm.js';
import { useCheckoutProgress } from './useCheckoutProgress.js';

const CustomerDetailsForm = lazy(() => import('./CustomerDetailsForm.js').then(module => ({ default: module.CustomerDetailsForm })));
const ShippingForm = lazy(() => import('./ShippingForm.js').then(module => ({ default: module.ShippingForm })));
const OrderSummary = lazy(() => import('./OrderSummary.js').then(module => ({ default: module.OrderSummary })));
const PaymentForm = lazy(() => import('./PaymentForm.js').then(module => ({ default: module.PaymentForm })));

const ModalSpinner = () => (
  <div className="text-center p-8 text-dark-700 dark:text-dark-200 animate-pulse">جاري التحميل...</div>
);

const FooterActions = ({ onConfirm, onCancel, submitting }) => (
  <div className="flex flex-col sm:flex-row-reverse gap-2 sm:gap-3 pt-4 border-t border-light-200 dark:border-dark-600 mt-auto bg-white/60 dark:bg-dark-800/60 backdrop-blur-sm sticky bottom-0 pb-2">
    <button
      onClick={onConfirm}
      disabled={submitting}
      className="w-full sm:flex-1 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-semibold py-2.5 sm:py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
    >
      {submitting ? 'جاري التأكيد...' : 'تأكيد الطلب وإرسال عبر واتساب'}
    </button>
    <button
      onClick={onCancel}
      disabled={submitting}
      className="w-full sm:flex-1 bg-light-200 dark:bg-dark-600 hover:bg-light-300 dark:hover:bg-dark-500 text-dark-800 dark:text-dark-100 font-semibold py-2.5 sm:py-3 px-4 rounded-xl border border-light-300 dark:border-dark-500 transition-all duration-300 disabled:opacity-70"
    >
      إلغاء
    </button>
  </div>
);

const CheckoutModal = ({
  isOpen, onClose, onClosed, cartItems, itemToCheckout,
  onCompleteOrder, currentUser, onUpdateCurrentUserAddress, checkoutPayload, loyaltySettings,
  setToastMessage
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [contentAnimation, setContentAnimation] = useState('');

  const isDirectSingleServiceCheckout = !!itemToCheckout;

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setContentAnimation('animate-fade-in-up'));
      const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', onEsc);
      return () => window.removeEventListener('keydown', onEsc);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen && isRendered) {
      document.body.style.overflow = '';
      setContentAnimation('animate-fade-out-up');
      const timer = setTimeout(() => {
        setIsRendered(false);
        if (onClosed) onClosed();
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, isRendered, onClosed]);

  const amountForCalculation = useMemo(() => checkoutPayload?.amount || 0, [checkoutPayload]);

  const form = useCheckoutForm({
    isOpen, currentUser, itemToCheckout, cartItems, onCompleteOrder, onUpdateCurrentUserAddress,
    amountForCalculation,
    couponInfo: checkoutPayload?.couponInfo,
    loyaltySettings,
    setToastMessage
  });

  const { roundedFinalAmount, summaryProps, pointsToApply, setPointsToApply } = form;

  const checkoutSteps = useMemo(() => {
    const steps = [{ id: 1, title: isDirectSingleServiceCheckout ? 'تفاصيل الخدمة' : 'بيانات العميل' }];
    if (form.requiresPhysicalShipping) steps.push({ id: 2, title: 'بيانات الشحن' });
    steps.push({ id: steps.length + 1, title: 'تفاصيل الدفع' });
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

  const handleOverlayClick = useCallback((e) => { if (e.target === e.currentTarget) onClose(); }, [onClose]);

  const customerFormProps = useMemo(() => ({
    customerName: form.customerName, setCustomerName: form.setCustomerName,
    customerPhone: form.customerPhone, setCustomerPhone: form.setCustomerPhone,
    customerAltPhone: form.customerAltPhone, setCustomerAltPhone: form.setCustomerAltPhone,
    renderError: form.renderError, currentUser, applySavedCustomerData: form.applySavedCustomerData
  }), [form.customerName, form.customerPhone, form.customerAltPhone, form.renderError, currentUser, form.applySavedCustomerData]);

  const shippingFormProps = useMemo(() => ({
    selectedGovernorate: form.selectedGovernorate, setSelectedGovernorate: form.setSelectedGovernorate,
    selectedCity: form.selectedCity, setSelectedCity: form.setSelectedCity,
    availableCities: form.availableCities, addressDetails: form.addressDetails, setAddressDetails: form.setAddressDetails,
    renderError: form.renderError, currentUser, applySavedAddress: form.applySavedAddress
  }), [form.selectedGovernorate, form.selectedCity, form.availableCities, form.addressDetails, form.renderError, currentUser, form.applySavedAddress]);

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center sm:p-4 p-0" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={handleOverlayClick} aria-hidden="true" />

      <div className={`modal-content bg-white dark:bg-dark-800 rounded-t-2xl sm:rounded-2xl shadow-3xl w-full sm:max-w-xl relative ${contentAnimation} border border-light-200 dark:border-dark-700 max-h-[92vh] flex flex-col overflow-hidden transition-all duration-300 sm:translate-y-0 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>

        <button onClick={onClose} aria-label="إغلاق" className="absolute top-3 left-3 sm:top-4 sm:left-4 text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-dark-50 p-1">
          <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <h2 id="checkout-title" className="text-xl sm:text-2xl font-bold text-center text-primary mb-3 sm:mb-4 border-b border-light-300 dark:border-dark-600 pb-2">
          إكمال عملية الشراء
        </h2>

        <CheckoutProgressBar steps={checkoutSteps} currentStep={progress.currentStep} progressBarWidth={progress.progressBarLineWidth} />

        <div className="overflow-y-auto pr-1 sm:pr-2 flex-grow space-y-4 pb-3 sm:pb-6">
          <Suspense fallback={<ModalSpinner />}>
            {isDirectSingleServiceCheckout && itemToCheckout ? (
              <SingleServiceDetails item={itemToCheckout} />
            ) : (
              <CustomerDetailsForm {...customerFormProps} />
            )}

            {form.requiresPhysicalShipping && (
              <div className="bg-light-100 dark:bg-dark-700 p-3 rounded-xl border border-light-300 dark:border-dark-600">
                <ShippingForm {...shippingFormProps} />
              </div>
            )}

            <div className="bg-light-50 dark:bg-dark-700/70 rounded-xl p-3 border border-light-200 dark:border-dark-600">
              <label htmlFor="order-notes" className="block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100">ملاحظات الطلب (اختياري)</label>
              <textarea
                id="order-notes"
                value={form.orderNotes}
                onChange={(e) => form.setOrderNotes(e.target.value)}
                className="w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base min-h-[60px]"
                placeholder="أي تعليمات إضافية..."
              />
            </div>

            <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 border-b border-light-300 dark:border-dark-600 pb-2 mb-3 pt-3">2. تفاصيل الدفع</h3>

            <div className="bg-light-50 dark:bg-dark-700/70 rounded-xl p-3 border border-light-200 dark:border-dark-600">
              <OrderSummary
                {...summaryProps}
                roundedFinalAmount={roundedFinalAmount}
                pointsToApply={pointsToApply}
                setPointsToApply={setPointsToApply}
                totalAmount={amountForCalculation}
                couponInfo={checkoutPayload?.couponInfo}
                isWEBillCheckout={isDirectSingleServiceCheckout && itemToCheckout?.product?.dynamicServiceId === 'we-internet-billing'}
                itemToCheckout={itemToCheckout}
              />
            </div>

            <PaymentForm
              selectedPaymentMethod={form.selectedPaymentMethod}
              setSelectedPaymentMethod={form.setSelectedPaymentMethod}
              paymentTransactionInfo={form.paymentTransactionInfo}
              setPaymentTransactionInfo={form.setPaymentTransactionInfo}
              containsOnlyDigitalServices={form.containsOnlyDigitalServices}
              renderError={form.renderError}
            />
          </Suspense>
        </div>

        {form.submissionError && <p className="text-red-500 text-sm text-center mt-2">{form.submissionError}</p>}

        <FooterActions onConfirm={form.handleConfirmOrder} onCancel={onClose} submitting={form.isSubmitting} />
      </div>
    </div>
  );
};

export { CheckoutModal };
