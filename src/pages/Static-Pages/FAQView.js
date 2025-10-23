

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { StaticPageView } from './StaticPageView.js';

// --- START OF FAQView.tsx ---
const FAQView = () => {
  const navigate = useNavigate();
  const faqs = [
    { q: "ما هي طرق الدفع المتاحة؟", a: "حاليًا، ندعم الدفع عبر فودافون كاش وإنستاباي. سيتم توضيح التفاصيل عند إتمام الشراء." },
    { q: "هل يوجد شحن لجميع المحافظات؟", a: "نعم، نقوم بالشحن إلى جميع محافظات جمهورية مصر العربية. قد تختلف رسوم الشحن حسب المنطقة." },
    { q: "كم يستغرق وصول الطلب؟", a: "عادةً ما يستغرق الشحن من 2 إلى 5 أيام عمل، حسب عنوان التوصيل." },
    { q: "هل يمكنني إرجاع أو استبدال المنتج؟", a: "نعم، يمكنك إرجاع أو استبدال المنتج خلال 14 يومًا من تاريخ الاستلام، بشرط أن يكون المنتج في حالته الأصلية وغير مستخدم. يرجى مراجعة صفحة الشروط والأحكام لمزيد من التفاصيل." },
    { q: "كيف يمكنني تتبع طلبي؟", a: "بعد شحن طلبك، ستتلقى رسالة تحتوي على معلومات التتبع (إذا كانت متاحة من شركة الشحن)." },
    { q: "كيف يتم حساب تكلفة دفع فاتورة الإنترنت WE؟", a: "عند شحن رصيد فاتورة الإنترنت، يتم إضافة ضريبة القيمة المضافة (14%) ورسوم الخدمة على صافي الرصيد الذي ترغب في شحنه، وذلك وفقًا للقوانين المصرية. يعرض لك متجرنا التكلفة الإجمالية بوضوح قبل إتمام عملية الدفع." }
  ];

  return React.createElement(StaticPageView, { title: "الأسئلة الشائعة", onBack: () => navigate(-1) },
    React.createElement(Helmet, null, 
        React.createElement("title", null, "الأسئلة الشائعة - World Technology"),
        React.createElement("meta", { name: "description", content: "ابحث عن إجابات لأسئلتك الأكثر شيوعًا حول الدفع، الشحن، الإرجاع، وتتبع الطلبات في متجر World Technology." })
    ),
    React.createElement("div", { className: "space-y-6" },
      faqs.map((faq, index) =>
        React.createElement("details", { key: index, className: "group bg-light-100 dark:bg-dark-700 p-4 rounded-lg border border-light-200 dark:border-dark-600" },
          React.createElement("summary", { className: "font-semibold cursor-pointer list-none flex justify-between items-center text-dark-900 dark:text-dark-50 group-open:text-primary" },
            faq.q,
            React.createElement("span", {className: "transform transition-transform duration-200 group-open:rotate-180"}, "▼")
          ),
          React.createElement("p", { className: "mt-3 text-dark-700 dark:text-dark-100" }, faq.a)
        )
      )
    )
  );
};
// --- END OF FAQView.tsx ---
export { FAQView };