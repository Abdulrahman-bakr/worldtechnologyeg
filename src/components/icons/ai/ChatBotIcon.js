import React from 'react';

/**
 * أيقونة Chat Bot محدثة، تم إنشاؤها باستخدام React.createElement
 * لتعمل داخل ملف .js بدون أخطاء.
 */
export const ChatBotIcon = (props) => {
  // دمج الخصائص (props) التي يتم تمريرها مع الخصائص الافتراضية للأيقونة
  const allProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props // يسمح بإضافة className, style, etc.
  };

  return React.createElement('svg', allProps,
    // Child element 1: الإطار الخفي للأيقونة (من مصدر Tabler Icons)
    React.createElement('path', {
      stroke: "none",
      d: "M0 0h24v24H0z",
      fill: "none"
    }),
    // Child element 2: المسار الرئيسي لشكل الأيقونة
    React.createElement('path', {
      d: "M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"
    }),
    // Child element 3: العين اليسرى
    React.createElement('path', {
      d: "M9.5 9h.01"
    }),
    // Child element 4: العين اليمنى
    React.createElement('path', {
      d: "M14.5 9h.01"
    }),
    // Child element 5: الفم المبتسم
    React.createElement('path', {
      d: "M9.5 13a3.5 3.5 0 0 0 5 0"
    })
  );
};