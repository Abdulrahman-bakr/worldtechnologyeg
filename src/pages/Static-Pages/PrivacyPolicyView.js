

import React from 'react';
import { StaticPageView } from './StaticPageView.js';

const PrivacyPolicyView = ({ onBack }) => {
  return React.createElement(StaticPageView, { title: "سياسة الخصوصية", onBack: onBack },
    React.createElement("p", null, "خصوصيتك مهمة بالنسبة لنا في World Technology. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية."),
    React.createElement("h3", { className: "text-lg font-semibold mt-4 mb-2" }, "المعلومات التي نجمعها"),
    React.createElement("p", null, "نقوم بجمع المعلومات التي تقدمها لنا عند إنشاء حساب أو إجراء عملية شراء، مثل الاسم والبريد الإلكتروني ورقم الهاتف وعنوان الشحن."),
    React.createElement("h3", { className: "text-lg font-semibold mt-4 mb-2" }, "كيف نستخدم معلوماتك"),
    React.createElement("p", null, "نستخدم معلوماتك لمعالجة طلباتك، وتحسين خدماتنا، والتواصل معك بشأن العروض والتحديثات."),
    React.createElement("h3", { className: "text-lg font-semibold mt-4 mb-2" }, "مشاركة المعلومات"),
    React.createElement("p", null, "نحن لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا للأغراض الضرورية لإتمام خدمتك (مثل شركات الشحن)."),
    React.createElement("p", { className: "mt-6 text-sm text-dark-600 dark:text-dark-300" }, "آخر تحديث: ", new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }))
  );
};

export { PrivacyPolicyView };