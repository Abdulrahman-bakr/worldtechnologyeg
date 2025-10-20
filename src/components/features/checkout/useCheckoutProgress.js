
import { useState, useEffect } from 'react';

export const useCheckoutProgress = ({
    checkoutSteps,
    customerName,
    customerPhone,
    requiresPhysicalShipping,
    selectedGovernorate,
    selectedCity,
    addressDetails,
    selectedPaymentMethod,
    paymentTransactionInfo,
    isDirectSingleServiceCheckout,
    itemToCheckout,
    containsOnlyDigitalServices,
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [progressBarLineWidth, setProgressBarLineWidth] = useState(0);

    useEffect(() => {
        const paymentStepId = checkoutSteps.find(step => step.title === "تفاصيل الدفع")?.id || 3;
        const totalActualStepsForLineCalc = checkoutSteps.length;

        let newHighlightStep = 1;
        let newProgressBarPercentage = 0;

        const customerFieldsFilled = customerName.trim() && customerPhone.trim() && /^\d{11}$/.test(customerPhone.trim());
        const shippingFieldsFilled = requiresPhysicalShipping ? (selectedGovernorate && selectedCity && addressDetails.trim()) : true;
        let paymentDetailsFilled = selectedPaymentMethod &&
            (selectedPaymentMethod === 'cash_on_delivery' ||
                (paymentTransactionInfo.trim() && (selectedPaymentMethod === 'vodafone_cash' || selectedPaymentMethod === 'instapay')));
        
        if (selectedPaymentMethod === 'cash_on_delivery' && containsOnlyDigitalServices) {
            paymentDetailsFilled = false; // Invalid state, so payment is not considered filled.
        }

        if (customerFieldsFilled) {
            newHighlightStep = 2;
        }
        if (customerFieldsFilled && shippingFieldsFilled) {
            newHighlightStep = paymentStepId;
        }

        if (customerFieldsFilled) {
            newProgressBarPercentage = (1 / totalActualStepsForLineCalc) * 100;
        }
        if (customerFieldsFilled && shippingFieldsFilled) {
            newProgressBarPercentage = (2 / totalActualStepsForLineCalc) * 100;
        }
        if (customerFieldsFilled && shippingFieldsFilled && paymentDetailsFilled) {
            newProgressBarPercentage = 100;
        }

        if (isDirectSingleServiceCheckout) {
            newHighlightStep = paymentStepId;
            if (checkoutSteps.length === 1) {
                newProgressBarPercentage = paymentDetailsFilled ? 100 : 0;
            } else {
                if (newHighlightStep === paymentStepId) {
                    newProgressBarPercentage = paymentDetailsFilled ? 100 : 50;
                } else {
                    newProgressBarPercentage = 0;
                }
            }
        }

        setCurrentStep(newHighlightStep);
        setProgressBarLineWidth(newProgressBarPercentage);

    }, [
        checkoutSteps,
        customerName,
        customerPhone,
        requiresPhysicalShipping,
        selectedGovernorate,
        selectedCity,
        addressDetails,
        selectedPaymentMethod,
        paymentTransactionInfo,
        isDirectSingleServiceCheckout,
        itemToCheckout,
        containsOnlyDigitalServices,
    ]);

    return { currentStep, progressBarLineWidth };
};
