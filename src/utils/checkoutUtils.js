/**
 * Generates a user-friendly 9-digit custom order ID.
 * Format: DDMMXXXXX (e.g., 171091631)
 * @returns {string} The custom order ID.
 */
export const generateCustomDisplayOrderId = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  // 5-digit random number to make the total length 9 digits (DD + MM + XXXXX)
  const randomPart = String(Math.floor(Math.random() * 90000) + 10000); 
  return `${day}${month}${randomPart}`;
};


/**
 * Recursively removes properties with `undefined` values from an object or array.
 * This is useful for cleaning data before sending it to Firestore.
 * @param {any} obj The object or array to clean.
 * @returns {any} The cleaned object or array.
 */
export const removeUndefinedProperties = (obj) => {
    if (obj instanceof Date || obj === null || obj === undefined) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(removeUndefinedProperties);
    }
    if (typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (value !== undefined) {
                    newObj[key] = removeUndefinedProperties(value);
                }
            }
        }
        return newObj;
    }
    return obj;
};


/**
 * Generates a pre-formatted WhatsApp message for order confirmation.
 * @param {object} orderDetails - The details of the order.
 * @returns {string} The formatted WhatsApp message.
 */
export const generateWhatsAppMessage = ({
    displayOrderId,
    customerShippingDetails,
    requiresPhysicalShipping,
    isDirectSingleServiceCheckout,
    orderNotes,
    paymentMethodDisplay,
    selectedPaymentMethod,
    paymentTransactionInfo,
    itemsForCheckout,
    totalAmount, // Final rounded amount
    originalAmount,
    tierDiscountAmount,
    discountApplied,
    finalAmountBeforeRounding,
    isRounded,
    couponCode,
    couponDiscountValue
}) => {
    let message = `*🎉 طلب جديد من World Technology 🎉*\n`;
    message += `-----------------------------------\n`;
    message += `*رقم الطلب:* ${displayOrderId}\n\n`;

    // --- Customer & Shipping Details ---
    if (requiresPhysicalShipping && !isDirectSingleServiceCheckout) {
        message += `*👤 بيانات العميل والشحن:*\n`;
        message += `*الاسم:* ${customerShippingDetails.name}\n`;
        message += `*رقم الموبايل:* ${customerShippingDetails.phone}\n`;
        if (customerShippingDetails.altPhone) {
            message += `*رقم إضافي:* ${customerShippingDetails.altPhone}\n`;
        }
        message += `*العنوان:* ${customerShippingDetails.address}, ${customerShippingDetails.city}, ${customerShippingDetails.governorate}\n\n`;
    }

    // --- Order Items ---
    message += `*🛍️ تفاصيل الطلب:*\n`;
    itemsForCheckout.forEach(item => {
        if (item.serviceDetails) {
            // Detailed view for services
            message += `• *خدمة:* ${item.product.arabicName}\n`;
            if (item.serviceDetails.packageName) {
                message += `  - *الباقة/النوع:* ${item.serviceDetails.packageName}\n`;
            }
            if (item.serviceDetails.formData) {
                item.serviceDetails.formData.forEach(field => {
                    if (field.value) { // Only show fields with a value
                      message += `  - *${field.label}:* ${field.value}\n`;
                    }
                });
            }
             message += `  - *التكلفة:* ${(item.serviceDetails.finalPrice || 0).toFixed(2)} ج.م\n`;

        } else {
            // Standard product view
            const displayName = item.variant ? `${item.product.arabicName} (${item.variant.colorName})` : item.product.arabicName;
            const price = item.product.discountPrice || item.product.price || 0;
            message += `• ${displayName} (×${item.quantity}) - ${price.toFixed(2)} ج.م\n`;
        }
    });
    message += `\n`;

    // --- Order Notes ---
    if (orderNotes) {
        message += `*📝 ملاحظات الطلب:*\n${orderNotes}\n\n`;
    }

    // --- Payment Summary ---
    message += `*💰 ملخص الدفع:*\n`;
    if (tierDiscountAmount > 0 || discountApplied > 0 || couponDiscountValue > 0) {
        message += `- الإجمالي الأصلي: ${originalAmount.toFixed(2)} ج.م\n`;
        if (couponDiscountValue > 0) {
            message += `- خصم كوبون (${couponCode}): -${couponDiscountValue.toFixed(2)} ج.م\n`;
        }
        if (tierDiscountAmount > 0) {
            message += `- خصم المستوى: -${tierDiscountAmount.toFixed(2)} ج.م\n`;
        }
        if (discountApplied > 0) {
            message += `- خصم النقاط: -${discountApplied.toFixed(2)} ج.م\n`;
        }
        if (isRounded) {
            message += `- (تم التقريب من ${finalAmountBeforeRounding.toFixed(2)} ج.م)\n`;
        }
    }
    message += `*الإجمالي النهائي للدفع: ${totalAmount.toFixed(2)} ج.م*\n\n`;

    // --- Payment Method ---
    message += `*💳 طريقة الدفع:*\n`;
    message += `*${paymentMethodDisplay}*\n`;
    if (selectedPaymentMethod !== 'cash_on_delivery' && paymentTransactionInfo) {
        if (selectedPaymentMethod === 'vodafone_cash') {
            message += `*تأكيد الدفع (رقم الكاش):* ${paymentTransactionInfo}\n`;
        } else if (selectedPaymentMethod === 'instapay') {
            message += `*تأكيد الدفع (حساب إنستاباي):* ${paymentTransactionInfo}\n`;
        }
    }
    message += `-----------------------------------\n`;
    message += `شكراً لثقتكم في World Technology! ✨\nسيتم مراجعة طلبك والتواصل معك في أقرب وقت للتأكيد.`;

    return message;
};