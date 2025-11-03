
import { useState, useMemo, useEffect } from 'react';
import { z } from 'zod';

// 1. تعريف مخطط التحقق من الصحة باستخدام Zod
const formSchema = z.object({
  profileLink: z.string().url({ message: 'يرجى إدخال رابط حساب صحيح.' }),
  contactNumber: z.string().regex(/^\d{11}$/, { message: 'رقم الواتساب يجب أن يكون 11 رقمًا.' }),
  // نتأكد أن الخيار المحدد ليس فارغًا
  selectedVariant: z.any().refine(val => val !== null, { message: 'يرجى اختيار منصة.' })
});

export const useVerificationForm = (product, onInitiateDirectCheckout, onVariantChange) => {
  const variants = useMemo(() => product?.variants || [], [product]);
  
  // 2. تجميع كل حالات الفورم في كائن واحد
  const [formData, setFormData] = useState({
    profileLink: '',
    contactNumber: '',
    selectedVariant: variants[0] || null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 3. This useEffect syncs the parent component with the initial variant.
  useEffect(() => {
    if (variants.length > 0) {
        const initialVariant = variants[0];
        setFormData(prev => ({ ...prev, selectedVariant: initialVariant }));
        if (onVariantChange) {
            onVariantChange(initialVariant);
        }
    }
    // This should only run when the product itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const price = useMemo(() => formData.selectedVariant?.price || 0, [formData.selectedVariant]);

  // 4. دوال معالجة التغييرات
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // إزالة الخطأ عند بدء الكتابة في الحقل
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
  };
  
  const handleVariantChange = (variant) => {
    setFormData(prev => ({ ...prev, selectedVariant: variant }));
    if (errors.selectedVariant) {
        setErrors(prev => ({ ...prev, selectedVariant: null }));
    }
    // Inform parent about the change
    if (onVariantChange) {
        onVariantChange(variant);
    }
  };

  // 5. دالة الإرسال الرئيسية مع التحقق من الصحة
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // مسح الأخطاء القديمة

    // التحقق من البيانات باستخدام Zod
    const validationResult = formSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors = {};
      // تحويل أخطاء Zod إلى كائن يسهل عرضه
      validationResult.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setIsLoading(true);
    try {
      await onInitiateDirectCheckout(product, {
        finalPrice: price,
        formData: [
          { label: 'المنصة', value: formData.selectedVariant.name, id: 'platform' },
          { label: 'رابط الحساب', value: formData.profileLink.trim(), id: 'profileLink' },
          { label: 'رقم واتساب للتواصل', value: formData.contactNumber.trim(), id: 'contact_number' },
          { label: 'السعر', value: `${price.toFixed(2)} ج.م`, id: 'price' },
        ],
      });
    } catch (err) {
      console.error('Checkout failed:', err);
      // خطأ عام يظهر للمستخدم
      setErrors({ form: 'حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 6. إرجاع كل ما يحتاجه المكون
  return {
    formData,
    errors,
    isLoading,
    price,
    variants,
    handleInputChange,
    handleVariantChange,
    handleSubmit,
  };
};
