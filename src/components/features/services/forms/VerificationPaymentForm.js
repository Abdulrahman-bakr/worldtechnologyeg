import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVerificationForm } from '../../../../hooks/useVerificationForm.js';
import { 
  ShoppingCartIcon, 
  InfoIcon,
  ShieldCheckIcon,
  WhatsAppIcon,
  LinkIcon,
  GlobeAltIcon
} from '../../../icons/index.js';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';

const VerificationPaymentForm = ({ product, onInitiateDirectCheckout, onVariantChange }) => {
  const {
    formData,
    errors,
    isLoading,
    price,
    variants,
    handleInputChange,
    handleVariantChange,
    handleSubmit,
  } = useVerificationForm(product, onInitiateDirectCheckout, onVariantChange);

  const [expandedNote, setExpandedNote] = useState(false);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const formRef = useRef(null);

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 bg-light-50 dark:bg-dark-800 rounded-xl border border-light-200 dark:border-dark-600"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-light-200 dark:bg-dark-600 rounded-full flex items-center justify-center">
          <InfoIcon className="w-8 h-8 text-dark-400 dark:text-dark-300" />
        </div>
        <p className="text-lg font-medium text-dark-700 dark:text-dark-200 mb-2">
          لا يوجد منتج محدد
        </p>
        <p className="text-dark-500 dark:text-dark-400 text-sm">
          يرجى اختيار خدمة للاستمرار
        </p>
      </motion.div>
    );
  }

  const isCheckoutDisabled =
    !formData.profileLink ||
    !formData.contactNumber ||
    !formData.selectedVariant ||
    isLoading;

  const labelClass = 'block text-sm font-medium mb-2 text-dark-800 dark:text-dark-100';

  // حساب تفاصيل السعر (افتراضي)
  const serviceFee = price * 0.1; // 10% رسوم خدمة
  const subscriptionCost = price - serviceFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg dark:shadow-dark-900/30 overflow-hidden border border-light-200 dark:border-dark-600"
    >
      {/* الهيدر */}
      <div className="bg-gradient-to-r from-primary to-primary-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">طلب خدمة التحقق</h2>
            <p className="text-primary-100 text-sm opacity-90">
              املأ البيانات التالية لاستكمال الطلب
            </p>
          </div>
          <div className="bg-white/20 p-2 rounded-lg">
            <ShieldCheckIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* معلومات المنتج */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center p-4 bg-light-50 dark:bg-dark-700 rounded-xl border border-light-200 dark:border-dark-600"
        >
          <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-1">
            {product.arabicName}
          </h3>
          {/* 🔹 تم إخفاء النص الوصفي (نظرة عامة) بناءً على طلبك */}
        </motion.div>

        {/* 🔹 اختيار المنصة */}
        {variants.length > 0 && (
          <motion.fieldset
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <legend className={labelClass}>
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="w-4 h-4 text-primary" />
                <span>اختر المنصة *</span>
              </div>
            </legend>
            
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence>
                {variants.map((variant, index) => {
                  const isSelected = formData.selectedVariant?.name === variant.name;
                  return (
                    <motion.button
                      key={variant.name}
                      type="button"
                      onClick={() => handleVariantChange(variant)}
                      disabled={isLoading}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: 'easeOut',
                      }}
                      whileHover={{ 
                        scale: isLoading ? 1 : 1.02,
                        y: -2
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative group p-4 text-center rounded-xl border-2 transition-all duration-300 space-y-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSelected
                          ? 'border-primary bg-primary/10 dark:bg-primary/20 shadow-lg ring-2 ring-primary/20'
                          : 'border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      {variant.imageUrl && (
                        <motion.img
                          src={variant.imageUrl}
                          alt={variant.name}
                          className="w-12 h-12 mx-auto object-contain relative z-10"
                          animate={{
                            scale: isSelected ? 1.1 : 1,
                          }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        />
                      )}
                      <span
                        className={`block text-sm font-semibold z-10 relative ${
                          isSelected
                            ? 'text-primary'
                            : 'text-dark-800 dark:text-dark-100'
                        }`}
                      >
                        {variant.name}
                      </span>
                      <motion.span 
                        className="block text-sm font-bold text-primary z-10 relative"
                        animate={{ 
                          color: isSelected ? '#3B82F6' : '#EF4444'
                        }}
                      >
                        {variant.price.toFixed(2)} ج.م
                      </motion.span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.fieldset>
        )}

        {/* 🔹 رابط الحساب */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon className="w-4 h-4 text-primary" />
            <label htmlFor="profileLink" className={labelClass}>
              رابط الحساب *
            </label>
          </div>
          
          <FloatingInput
            id="profileLink"
            value={formData.profileLink}
            onChange={handleInputChange}
            placeholder="https://example.com/profile"
            type="url"
            required
            disabled={isLoading}
            className={
              errors.profileLink
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 pr-10'
                : 'pr-10'
            }
          />
          
          {errors.profileLink && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-xs mt-2 flex items-center gap-1"
            >
              <InfoIcon className="w-3 h-3" />
              {errors.profileLink}
            </motion.p>
          )}
        </motion.div>

        {/* 🔹 رقم واتساب */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <WhatsAppIcon className="w-4 h-4 text-green-500" />
            <label htmlFor="contactNumber" className={labelClass}>
              رقم واتساب للتواصل *
            </label>
          </div>
          
          <FloatingInput
            id="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            placeholder="+20 123 456 7890"
            type="tel"
            required
            disabled={isLoading}
            className={
              errors.contactNumber
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 pr-10'
                : 'pr-10'
            }
          />
        </motion.div>

        {/* 🔹 السعر الإجمالي */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-light-100 dark:bg-dark-700 rounded-xl border border-light-200 dark:border-dark-600"
        >
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
          >
            <p className="text-md font-bold text-primary">الإجمالي للدفع:</p>
            <div className="flex items-center gap-2">
              <span className="tabular-nums text-lg font-bold text-primary">
                {price.toFixed(2)} ج.م
              </span>
              <motion.svg
                animate={{ rotate: showPriceBreakdown ? 180 : 0 }}
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </div>
          </div>
        </motion.div>

        {/* 🔹 ملاحظة */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setExpandedNote(!expandedNote)}
            className="w-full p-4 text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <InfoIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                ملاحظة هامة
              </span>
            </div>
            <motion.svg
              animate={{ rotate: expandedNote ? 180 : 0 }}
              className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
          
          <AnimatePresence>
            {expandedNote && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-4 text-sm text-yellow-700 dark:text-yellow-300 space-y-2"
              >
                <p>أنت تدفع مقابل رسوم الاشتراك الشهرية الرسمية بالإضافة إلى رسوم خدمتنا.</p>
                <p>بعد الدفع، سنتواصل معك عبر واتساب لبدء عملية الدفع للاشتراك.</p>
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                  لن نطلب منك كلمة المرور أبدًا.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 🔹 زر الإرسال */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="pt-4 border-t border-light-200 dark:border-dark-600"
        >
          <motion.button
            type="submit"
            disabled={isCheckoutDisabled}
            whileHover={!isCheckoutDisabled ? { scale: 1.02 } : {}}
            whileTap={!isCheckoutDisabled ? { scale: 0.98 } : {}}
            className="w-full bg-gradient-to-r from-primary to-primary-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>جارٍ المعالجة...</span>
              </>
            ) : (
              <>
                <ShoppingCartIcon className="w-5 h-5" />
                <span>اطلب الخدمة الآن</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export { VerificationPaymentForm };
