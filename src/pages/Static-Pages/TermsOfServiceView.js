

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { StaticPageView } from './StaticPageView.js';

// --- START OF TermsAndConditionsView.tsx ---
const TermsView = () => {
  const navigate = useNavigate();
  return React.createElement(StaticPageView, { title: "الشروط والأحكام", onBack: () => navigate(-1) },
        React.createElement(Helmet, null, 
            React.createElement("title", null, "الشروط والأحكام - World Technology")
        ),
        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "1. القبول والتعريفات"),
        React.createElement("p", null, "مرحبًا بك في متجر World Technology. باستخدامك لموقعنا الإلكتروني وتطبيقاتنا ('الخدمة')، فإنك توافق على الالتزام بهذه الشروط والأحكام ('الشروط') بالكامل. إذا كنت لا توافق على أي جزء من هذه الشروط، فيجب عليك عدم استخدام خدمتنا. المصطلحات 'نحن'، 'المتجر'، أو 'World Technology' تشير إلى مالك الخدمة. 'أنت'، 'المستخدم'، أو 'العميل' تشير إلى أي شخص يستخدم الخدمة."),

        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "2. حساب المستخدم"),
        React.createElement("ul", { className: "list-disc list-inside space-y-2" },
          React.createElement("li", null, "لإتمام عمليات الشراء، يجب عليك إنشاء حساب وتقديم معلومات دقيقة وكاملة وحديثة."),
          React.createElement("li", null, "أنت المسؤول الوحيد عن الحفاظ على سرية معلومات حسابك وكلمة المرور، وعن جميع الأنشطة التي تحدث تحت حسابك."),
          React.createElement("li", null, "يجب عليك إخطارنا فورًا بأي خرق للأمان أو استخدام غير مصرح به لحسابك."),
          React.createElement("li", null, "نحتفظ بالحق في تعليق أو إنهاء حسابك في أي وقت ولأي سبب، بما في ذلك تقديم معلومات غير صحيحة أو انتهاك هذه الشروط.")
        ),

        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "3. الطلبات، الأسعار، والدفع"),
        React.createElement("ul", { className: "list-disc list-inside space-y-2" },
          React.createElement("li", null, "يعتبر تقديمك لطلب شراء عرضًا منك لشراء المنتجات أو الخدمات. نحتفظ بالحق في قبول أو رفض أي طلب لأي سبب، بما في ذلك عدم توفر المنتج أو وجود خطأ في السعر أو وصف المنتج."),
          React.createElement("li", null, "نسعى جاهدين لضمان دقة جميع الأسعار المعروضة، ولكن قد تحدث أخطاء. في حالة اكتشاف خطأ في سعر منتج طلبته، سنتصل بك في أقرب وقت ممكن لإبلاغك وإعطائك خيار إعادة تأكيد طلبك بالسعر الصحيح أو إلغائه."),
          React.createElement("li", null, "طرق الدفع المتاحة هي: الدفع عند الاستلام (للمنتجات المادية فقط)، فودافون كاش، وإنستاباي. يجب تأكيد الدفع المسبق قبل شحن الطلبات المدفوعة إلكترونيًا. أنت توافق على تقديم معلومات دفع صحيحة وكاملة.")
        ),
        
        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "4. الشحن والتوصيل"),
        React.createElement("ul", { className: "list-disc list-inside space-y-2" },
          React.createElement("li", null, "نقوم بالشحن داخل حدود جمهورية مصر العربية فقط. يتم تقدير أوقات التسليم وهي ليست مضمونة وقد تتأثر بعوامل خارجة عن سيطرتنا."),
          React.createElement("li", null, "أنت مسؤول عن تقديم عنوان شحن صحيح وكامل. في حالة تقديم عنوان غير صحيح، قد تتحمل تكاليف إضافية لإعادة الشحن أو قد يتم إلغاء الطلب."),
          React.createElement("li", null, "تنتقل ملكية ومخاطر فقدان المنتجات إليك عند تسليمها إلى شركة الشحن.")
        ),

        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "5. سياسة الاستبدال والاسترجاع"),
        React.createElement("ul", { className: "list-disc list-inside space-y-2" },
          React.createElement("li", null, "وفقًا لقانون حماية المستهلك المصري، يحق لك استبدال أو إرجاع المنتجات المادية خلال 14 يومًا من تاريخ الاستلام."),
          React.createElement("li", null, "لإتمام عملية الإرجاع، يجب أن يكون المنتج غير مستخدم، في حالته الأصلية، وفي عبوته الأصلية مع جميع الملحقات والملصقات."),
          React.createElement("li", null, "يتحمل العميل تكاليف شحن الإرجاع أو الاستبدال ما لم يكن المنتج به عيب صناعة مؤكد من قبلنا."),
          React.createElement("li", null, React.createElement("strong", null, "المنتجات غير القابلة للاسترداد:"), " الخدمات الرقمية (مثل شحن الرصيد، شحن الألعاب، دفع الفواتير، والأكواد الرقمية) غير قابلة للاسترداد بمجرد تنفيذ الخدمة أو إرسال الكود بنجاح. أنت مسؤول عن صحة البيانات المقدمة لهذه الخدمات (مثل رقم الهاتف أو ID اللاعب).")
        ),
        
        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "6. الملكية الفكرية"),
        React.createElement("p", null, "الخدمة وجميع محتوياتها الأصلية، بما في ذلك النصوص والرسومات والشعارات والصور والبرمجيات، هي ملك حصري لـ World Technology ومحمية بموجب قوانين حقوق النشر والعلامات التجارية الدولية. لا يجوز لك استخدام أي من محتوياتنا دون إذن كتابي مسبق."),

        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "7. سلوك المستخدم"),
        React.createElement("p", null, "أنت توافق على عدم استخدام الخدمة لأي غرض غير قانوني أو محظور بموجب هذه الشروط. يتضمن ذلك، على سبيل المثال لا الحصر: الاحتيال، انتحال شخصية، نشر محتوى ضار، أو التدخل في عمل الخدمة."),

        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "8. حدود المسؤولية"),
        React.createElement("p", null, "يتم توفير الخدمة 'كما هي' و 'كما هي متاحة'. إلى أقصى حد يسمح به القانون، لن نكون مسؤولين عن أي أضرار غير مباشرة أو تبعية أو عرضية تنشأ عن استخدامك للخدمة أو عدم قدرتك على استخدامها. مسؤوليتنا القصوى تجاهك عن أي أضرار مباشرة تقتصر على المبلغ الذي دفعته مقابل المنتج أو الخدمة المعنية."),
        
        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "9. التعديلات على الشروط"),
        React.createElement("p", null, "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإخطارك بأي تغييرات عن طريق نشر الشروط الجديدة على هذه الصفحة. استمرارك في استخدام الخدمة بعد نشر التغييرات يشكل موافقتك على الشروط المعدلة."),
        
        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "10. القانون الحاكم"),
        React.createElement("p", null, "تخضع هذه الشروط والأحكام وتُفسر وفقًا لقوانين جمهورية مصر العربية، وأنت توافق على الاختصاص القضائي الحصري للمحاكم المصرية."),
        
        React.createElement("p", { className: "mt-10 text-sm text-dark-600 dark:text-dark-300" }, "آخر تحديث: ", new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }))
  );
};
// --- END OF TermsAndConditionsView.tsx ---
export { TermsView };