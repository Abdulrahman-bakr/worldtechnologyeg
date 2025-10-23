import React from 'react'; // يجب استدعاء React لاستخدام JSX وإنشاء المكون

// يتم تجميع بيانات الأيقونة (لجعل الكود أنظف)
const iconData = {
    src: "/assets/Advantages-icons/new.png",
    alt: "New Icon" // يُنصح دائماً بإضافة نص بديل للصور (alt text)
};

// يتم تعريف SparklesIcon كمكون وظيفي في React
// يستقبل هذا المكون جميع الخصائص (props) التي يمكن تمريرها لوسم <img>
export const SparklesIcon = (props) => {
    return (
        <img
            src={iconData.src}
            alt={iconData.alt}
            // توزيع باقي الخصائص (مثل className, style, onClick) على وسم <img>
            {...props} 
        />
    );
};