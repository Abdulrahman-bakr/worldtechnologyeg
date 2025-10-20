import React from 'react';

const PromoBanner = ({ onNavigate }) => {
  return React.createElement("section", { id: "promo-banner", className: "py-16 sm:py-20 bg-gradient-to-r from-primary to-secondary text-white" },
    React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 text-center" },
      React.createElement("h2", { className: "text-3xl sm:text-4xl font-bold mb-4 animate-fade-in-up", style: { animationDelay: '0.2s' } }, "تخفيضات !"),
      React.createElement("p", { className: "text-lg sm:text-xl mb-8 max-w-2xl mx-auto animate-fade-in-up", style: { animationDelay: '0.4s' } }, "لا تفوت فرصة الحصول على  منتجاتنا بأسعار لا تقبل المنافسة. الكمية محدودة!"),
      React.createElement("div", { className: "animate-fade-in-up", style: { animationDelay: '0.6s' } },
        React.createElement("button", {
             onClick: () => onNavigate('navigateToSpecialOffers'),
            className: "bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-lg text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          },
          "اكتشف العروض الآن"
        )
      )
    )
  );
};
export { PromoBanner };
