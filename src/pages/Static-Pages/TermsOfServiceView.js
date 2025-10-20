

import React from 'react';
import { StaticPageView } from './StaticPageView.js';

// --- START OF TermsAndConditionsView.tsx ---
const TermsView = ({ onBack }) => {
  return React.createElement(StaticPageView, { title: "الشروط والأحكام", onBack: onBack },
        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "1. مقدمة"),
        React.createElement("p", null, "مرحبًا بك في متجر World Technology. تحكم هذه الشروط والأحكام استخدامك لموقعنا الإلكتروني وتطبيق الهاتف المحمول (يشار إليهما إجمالاً باسم \"الخدمة\"). باستخدامك للخدمة، فإنك توافق على هذه الشروط بالكامل. إذا كنت لا توافق على أي جزء من هذه الشروط، يجب ألا تستخدم خدمتنا."),
        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "2. حقوق الملكية الفكرية"),
        React.createElement("p", null, "جميع حقوق الملكية الفكرية محفوظة."),
        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "3. الاستخدام المقبول"),
        React.createElement("p", null, "يجب ألا تستخدم خدمتنا بأي طريقة تسبب ضررًا."),
        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "4. حساب المستخدم"),
        React.createElement("p", null, "أنت مسؤول عن الحفاظ على سرية حسابك."),
        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "5. المنتجات والأسعار"),
        React.createElement("p", null, "نسعى لعرض الأوصاف بدقة. الأسعار قابلة للتغيير."),
        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "6. حدود المسؤولية"),
        React.createElement("p", null, "لن نكون مسؤولين عن أي خسارة غير مباشرة."),
        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "7. التعديلات"),
        React.createElement("p", null, "يجوز لنا مراجعة هذه الشروط."),
        React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold mt-6 mb-3" }, "8. القانون الحاكم"),
        React.createElement("p", null, "تخضع للقوانين المصرية."),
        React.createElement("p", { className: "mt-10 text-sm text-dark-600 dark:text-dark-300" }, "آخر تحديث: ", new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }))
  );
};
// --- END OF TermsAndConditionsView.tsx ---
export { TermsView };