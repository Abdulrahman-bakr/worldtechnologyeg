
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { EGYPT_GOVERNORATES_DATA } from '../constants/governorates.js';
import { db } from '../services/firebase/config.js';
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { generateCustomDisplayOrderId, removeUndefinedProperties, generateWhatsAppMessage } from '../utils/checkoutUtils.js';
import { LOYALTY_TIERS as LOYALTY_TIERS_FALLBACK } from '../constants/loyaltyTiers.js';

export const useCheckoutForm = ({
    isOpen,
    currentUser,
    itemToCheckout,
    cartItems,
    onCompleteOrder,
    onUpdateCurrentUserAddress,
    amountForCalculation,
    couponInfo,
    loyaltySettings
}) => {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAltPhone, setCustomerAltPhone] = useState('');
    const [selectedGovernorate, setSelectedGovernorate] = useState('');
    const [availableCities, setAvailableCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [addressDetails, setAddressDetails] = useState('');
    const [orderNotes, setOrderNotes] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [paymentTransactionInfo, setPaymentTransactionInfo] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState('');
    const [applyPoints, setApplyPoints] = useState(false);


    const itemsForCheckout = itemToCheckout ? [itemToCheckout] : (cartItems || []);
    const isDirectSingleServiceCheckout = !!itemToCheckout;
    const containsOnlyDigitalServices = itemsForCheckout.length > 0 && itemsForCheckout.every(item => item.product.isDynamicElectronicPayments);
    const requiresPhysicalShipping = itemsForCheckout.some(item => !item.product.isDynamicElectronicPayments);

    const prevIsOpen = useRef(isOpen);

    const resetForm = useCallback(() => {
        if (isDirectSingleServiceCheckout) {
            setCustomerName(currentUser?.name || '');
            setCustomerPhone('');
            setCustomerAltPhone('');
            setSelectedGovernorate('');
            setAvailableCities([]);
            setSelectedCity('');
            setAddressDetails('');
        } else {
            const addr = currentUser?.defaultShippingAddress;
            setCustomerName(addr?.name || currentUser?.name || '');
            setCustomerPhone(addr?.phone || currentUser?.phone || '');
            setCustomerAltPhone(addr?.altPhone || '');
            setSelectedGovernorate(addr?.governorate || '');
            setAddressDetails(addr?.address || '');
            if (addr?.governorate && EGYPT_GOVERNORATES_DATA[addr.governorate]) {
                const citiesForGov = EGYPT_GOVERNORATES_DATA[addr.governorate];
                setAvailableCities(citiesForGov);
                setSelectedCity(citiesForGov.includes(addr.city) ? addr.city : '');
            } else {
                setAvailableCities([]);
                setSelectedCity('');
            }
        }
        setOrderNotes('');
        setPaymentTransactionInfo('');
        if (containsOnlyDigitalServices) {
            setSelectedPaymentMethod('');
        }
        setFormErrors({});
        setSubmissionError('');
        setIsSubmitting(false);
        setApplyPoints(false);
    }, [currentUser, isDirectSingleServiceCheckout, containsOnlyDigitalServices]);

    useEffect(() => {
        if (isOpen && !prevIsOpen.current) {
            resetForm();
        }
        prevIsOpen.current = isOpen;
    }, [isOpen, resetForm]);
    
    const { roundedFinalAmount, summaryProps } = useMemo(() => {
        const Tiers = loyaltySettings || LOYALTY_TIERS_FALLBACK;
        const getTier = (points) => {
            if (points >= Tiers.GOLD.minPoints) return { ...Tiers.GOLD };
            if (points >= Tiers.SILVER.minPoints) return { ...Tiers.SILVER };
            return { ...Tiers.BRONZE };
        };
        const currentTier = currentUser ? getTier(currentUser.loyaltyPoints || 0) : { name: "برونزي", discount: 0, color: "text-orange-400" };
        const tierDiscountValue = amountForCalculation * currentTier.discount;
        const subtotalAfterDiscount = amountForCalculation - tierDiscountValue;
        const available = currentUser?.loyaltyPoints || 0;
        const discountFromPoints = Math.floor(available / 100);
        const shouldApplyPoints = applyPoints && discountFromPoints > 0;
        const appliedDiscountFromPoints = shouldApplyPoints ? Math.min(discountFromPoints, subtotalAfterDiscount) : 0;
        const redeemedPoints = shouldApplyPoints ? appliedDiscountFromPoints * 100 : 0;
        const finalBeforeRounding = subtotalAfterDiscount - appliedDiscountFromPoints;
        const rounded = Math.round(finalBeforeRounding);
        return {
            roundedFinalAmount: rounded,
            summaryProps: {
                tierInfo: currentTier, tierDiscountAmount: tierDiscountValue, subtotalAfterTierDiscount: subtotalAfterDiscount,
                pointsAvailable: available, discountAvailable: discountFromPoints, discountToApply: appliedDiscountFromPoints,
                pointsToRedeem: redeemedPoints, finalAmountBeforeRounding: finalBeforeRounding, 
                roundingDifference: rounded - finalBeforeRounding,
            }
        };
      }, [currentUser, amountForCalculation, applyPoints, loyaltySettings]);

    useEffect(() => {
        if (!requiresPhysicalShipping) return;
        if (selectedGovernorate && EGYPT_GOVERNORATES_DATA[selectedGovernorate]) {
            const newCities = EGYPT_GOVERNORATES_DATA[selectedGovernorate];
            setAvailableCities(newCities);
            if (!newCities.includes(selectedCity)) setSelectedCity('');
        } else {
            setAvailableCities([]);
            setSelectedCity('');
        }
    }, [selectedGovernorate, selectedCity, requiresPhysicalShipping]);

    useEffect(() => {
        if (containsOnlyDigitalServices && selectedPaymentMethod === 'cash_on_delivery') {
            setSelectedPaymentMethod('');
        }
    }, [containsOnlyDigitalServices, selectedPaymentMethod]);
    
    useEffect(() => {
        if (selectedPaymentMethod === 'cash_on_delivery' || (containsOnlyDigitalServices && selectedPaymentMethod !== 'vodafone_cash' && selectedPaymentMethod !== 'instapay')) {
            setPaymentTransactionInfo('');
            setFormErrors(prev => ({ ...prev, paymentTransactionInfo: undefined }));
        }
    }, [selectedPaymentMethod, containsOnlyDigitalServices]);

    useEffect(() => { if (customerName.trim()) setFormErrors(prev => ({ ...prev, customerName: undefined })); }, [customerName]);
    useEffect(() => { if (customerPhone.trim()) setFormErrors(prev => ({ ...prev, customerPhone: undefined })); }, [customerPhone]);
    useEffect(() => { if (selectedGovernorate) setFormErrors(prev => ({ ...prev, selectedGovernorate: undefined })); }, [selectedGovernorate]);
    useEffect(() => { if (selectedCity) setFormErrors(prev => ({ ...prev, selectedCity: undefined })); }, [selectedCity]);
    useEffect(() => { if (addressDetails.trim()) setFormErrors(prev => ({ ...prev, addressDetails: undefined })); }, [addressDetails]);
    useEffect(() => { if (selectedPaymentMethod) setFormErrors(prev => ({ ...prev, selectedPaymentMethod: undefined })); }, [selectedPaymentMethod]);
    useEffect(() => { if (paymentTransactionInfo.trim()) setFormErrors(prev => ({ ...prev, paymentTransactionInfo: undefined })); }, [paymentTransactionInfo]);

    const validateForm = useCallback(() => {
        const errors = {};
        if (!isDirectSingleServiceCheckout) {
            if (!customerName.trim()) errors.customerName = "الاسم بالكامل مطلوب.";
            if (!customerPhone.trim()) errors.customerPhone = "رقم الموبايل مطلوب.";
            else if (!/^\d{11}$/.test(customerPhone.trim())) errors.customerPhone = "رقم الموبايل يجب أن يكون 11 رقمًا.";
            if (customerAltPhone.trim() && !/^\d{11}$/.test(customerAltPhone.trim())) errors.customerAltPhone = "رقم الموبايل الإضافي يجب أن يكون 11 رقمًا إذا تم إدخاله.";
        }
        if (requiresPhysicalShipping) {
            if (!selectedGovernorate) errors.selectedGovernorate = "اختر المحافظة.";
            if (!selectedCity) errors.selectedCity = "اختر المركز أو المدينة.";
            if (!addressDetails.trim()) errors.addressDetails = "العنوان بالتفصيل مطلوب.";
        }
        if (!selectedPaymentMethod) {
            errors.selectedPaymentMethod = "اختر طريقة الدفع.";
        } else if (selectedPaymentMethod === 'cash_on_delivery' && containsOnlyDigitalServices) {
            errors.selectedPaymentMethod = "الدفع عند الاستلام غير متاح للخدمات الرقمية.";
        } else if (selectedPaymentMethod !== 'cash_on_delivery' && !paymentTransactionInfo.trim()) {
            if (selectedPaymentMethod === 'vodafone_cash') errors.paymentTransactionInfo = "أدخل رقم عملية تحويل فودافون كاش أو آخر 4 أرقام.";
            else if (selectedPaymentMethod === 'instapay') errors.paymentTransactionInfo = "أدخل اسم الحساب المحول منه في إنستاباي.";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [isDirectSingleServiceCheckout, requiresPhysicalShipping, customerName, customerPhone, customerAltPhone, selectedGovernorate, selectedCity, addressDetails, selectedPaymentMethod, containsOnlyDigitalServices, paymentTransactionInfo]);
    
    const handleConfirmOrder = useCallback(async () => {
        if (!currentUser?.uid) {
            setSubmissionError("خطأ: لا يوجد مستخدم مسجل للدخول. يرجى تسجيل الدخول وإعادة المحاولة.");
            setIsSubmitting(false);
            return;
        }
        if (!validateForm()) return;
        setIsSubmitting(true);
        setSubmissionError('');
        
        const displayOrderId = generateCustomDisplayOrderId();
        let customerShippingDetails;

        if (isDirectSingleServiceCheckout) {
            let servicePhoneNumber = null;
            const item = itemsForCheckout[0];
            if (item && item.serviceDetails && Array.isArray(item.serviceDetails.formData)) {
                const phoneField = item.serviceDetails.formData.find(f => f.id && (f.id.toLowerCase().includes('phone') || f.id.toLowerCase().includes('landline')));
                if (phoneField) {
                    servicePhoneNumber = phoneField.value;
                }
            }
            customerShippingDetails = { name: currentUser.name, phone: servicePhoneNumber, altPhone: null, governorate: null, city: null, address: null };
        } else {
            customerShippingDetails = { name: customerName, phone: customerPhone, altPhone: customerAltPhone, governorate: requiresPhysicalShipping ? selectedGovernorate : null, city: requiresPhysicalShipping ? selectedCity : null, address: requiresPhysicalShipping ? addressDetails : null };
        }

        let paymentMethodDisplay = '';
        let paymentStatus = "pending_payment_confirmation";

        if (selectedPaymentMethod === 'cash_on_delivery') {
            paymentMethodDisplay = 'الدفع عند الاستلام';
            paymentStatus = 'pending_fulfillment';
        } else if (selectedPaymentMethod === 'instapay') {
            paymentMethodDisplay = 'إنستاباي';
        } else if (selectedPaymentMethod === 'vodafone_cash') {
            paymentMethodDisplay = 'فودافون كاش';
        }

        if (containsOnlyDigitalServices || selectedPaymentMethod === 'vodafone_cash' || selectedPaymentMethod === 'instapay') {
            paymentStatus = 'pending_payment_confirmation';
        }
        
        const orderItemsPayload = itemsForCheckout.map(item => {
            const { operatorLogo, ...serializableServiceDetails } = item.serviceDetails || {};
            return {
                id: item.product.id,
                product: item.product, 
                name: item.variant ? `${item.product.arabicName} (${item.variant.colorName})` : (item.product.arabicName || 'اسم غير متوفر'), 
                quantity: item.quantity, 
                price: Number((item.serviceDetails?.finalPrice) ?? (item.product.discountPrice || item.product.price || 0)), 
                imageUrl: item.variant?.imageUrl || (item.serviceDetails?.package?.imageUrl) || (item.serviceDetails?.operatorLogoUrl) || item.product.imageUrl || null, 
                category: item.product.category || 'uncategorized', 
                serviceDetails: item.serviceDetails ? serializableServiceDetails : null, 
                variant: item.variant,
                variantDetails: item.variant ? { colorName: item.variant.colorName, colorHex: item.variant.colorHex } : null 
            };
        });
        
        const pointsToEarn = Math.floor(summaryProps.finalAmountBeforeRounding);
        
        const orderData = {
            displayOrderId,
            customerDetails: { ...customerShippingDetails, notes: orderNotes },
            paymentDetails: { method: paymentMethodDisplay, transactionInfo: (selectedPaymentMethod === 'cash_on_delivery') ? null : paymentTransactionInfo },
            items: orderItemsPayload,
            subtotal: Number(amountForCalculation) + (couponInfo?.couponDiscount || 0),
            tierDiscount: Number(summaryProps.tierDiscountAmount),
            pointsDiscount: Number(summaryProps.discountToApply),
            couponCode: couponInfo?.appliedCoupon?.code || null,
            couponDiscount: couponInfo?.couponDiscount || 0,
            totalAmount: Number(roundedFinalAmount),
            pointsRedeemed: Number(summaryProps.pointsToRedeem),
            pointsToEarn: pointsToEarn,
            pointsAwarded: false,
            status: paymentStatus,
            clientCreatedAt: new Date(),
            userId: currentUser.uid,
            containsElectronicPayments: itemsForCheckout.some(item => item.product.isDynamicElectronicPayments),
            containsPhysicalServices: itemsForCheckout.some(item => !item.product.isDynamicElectronicPayments),
            isDirectServiceCheckout: isDirectSingleServiceCheckout,
        };

        try {
            const response = await fetch('/api/createOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    orderData: orderData,
                    clientTotalAmount: roundedFinalAmount
                }),
            });
            
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.details || result.error || 'Failed to create order from server.');
            }
            
            if (currentUser.uid && requiresPhysicalShipping && !isDirectSingleServiceCheckout) {
                try {
                    await setDoc(doc(db, "users", currentUser.uid), { defaultShippingAddress: customerShippingDetails }, { merge: true });
                    onUpdateCurrentUserAddress(customerShippingDetails);
                } catch (userSaveError) { console.error("Error saving user's default address (client-side): ", userSaveError); }
            }
            
            const message = generateWhatsAppMessage({
                displayOrderId: result.orderId,
                itemToCheckout, 
                customerShippingDetails, 
                requiresPhysicalShipping, 
                isDirectSingleServiceCheckout, 
                orderNotes, 
                paymentMethodDisplay, 
                selectedPaymentMethod, 
                paymentTransactionInfo, 
                itemsForCheckout, 
                totalAmount: roundedFinalAmount, 
                originalAmount: Number(amountForCalculation) + (couponInfo?.couponDiscount || 0), 
                tierDiscountAmount: summaryProps.tierDiscountAmount, 
                discountApplied: summaryProps.discountToApply, 
                finalAmountBeforeRounding: summaryProps.finalAmountBeforeRounding, 
                isRounded: summaryProps.roundingDifference !== 0,
                couponCode: couponInfo?.appliedCoupon?.code,
                couponDiscountValue: couponInfo?.couponDiscount,
            });

            const whatsappUrl = `https://api.whatsapp.com/send/?phone=201026146714&text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            onCompleteOrder({ isDirectCheckout: isDirectSingleServiceCheckout, pointsRedeemed: summaryProps.pointsToRedeem });
        } catch (e) {
            console.error("Error during order confirmation process:", e);
            setSubmissionError(e.message || "حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.");
        } finally {
            setIsSubmitting(false);
        }
    }, [currentUser, validateForm, isDirectSingleServiceCheckout, customerName, customerPhone, customerAltPhone, requiresPhysicalShipping, selectedGovernorate, selectedCity, addressDetails, selectedPaymentMethod, paymentTransactionInfo, orderNotes, itemsForCheckout, amountForCalculation, summaryProps, roundedFinalAmount, onCompleteOrder, onUpdateCurrentUserAddress, containsOnlyDigitalServices, couponInfo]);

    const renderError = useCallback((fieldName) => {
        if (formErrors[fieldName]) {
            return React.createElement("p", { className: "text-red-500 text-xs mt-1" }, formErrors[fieldName]);
        }
        return null;
    }, [formErrors]);

    return {
        customerName, setCustomerName,
        customerPhone, setCustomerPhone,
        customerAltPhone, setCustomerAltPhone,
        selectedGovernorate, setSelectedGovernorate,
        availableCities,
        selectedCity, setSelectedCity,
        addressDetails, setAddressDetails,
        orderNotes, setOrderNotes,
        selectedPaymentMethod, setSelectedPaymentMethod,
        paymentTransactionInfo, setPaymentTransactionInfo,
        formErrors,
        isSubmitting,
        submissionError,
        requiresPhysicalShipping,
        containsOnlyDigitalServices,
        handleConfirmOrder,
        renderError,
        applyPoints, setApplyPoints,
        roundedFinalAmount, summaryProps
    };
};
