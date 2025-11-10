import React from 'react';

// ❌ تم إزالة سطر الاستيراد الذي يسبب خطأ 404:
// import HeroWallpaper from '../../../assets/Payments/Web wallpaper.webp'; 

const HeroSection = ({ onShopNow }) => {
  return React.createElement("section", {
      className: "min-h-[65vh] flex items-center justify-center bg-gradient-to-br from-light-100 via-light-200 to-white dark:from-dark-800 dark:via-dark-700 dark:to-dark-900 text-dark-900 dark:text-dark-50 py-16 pt-24 sm:pt-28 relative overflow-hidden"
    },
    React.createElement("div", { className: "absolute inset-0 opacity-5 dark:opacity-[0.03]" }, 
      React.createElement("img", { 
        // ✅ استخدام المسار المطلق للجذر (يفترض أن مجلد assets قابل للوصول):
        src: "/assets/wallpaper/Web-wallpaper.webp", 
        alt: "Background Pattern", 
        className: "w-full h-full object-cover",
        loading: "lazy",
        decoding: "async"
      })
    ),
    React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10" },
      React.createElement("h1", {
          className: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-up",
          style: { animationDelay: '0.2s' }
        },
        React.createElement("span", { className: "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary" }, "عالم التكنولوجيا"), " معاك في كل مكان"
      ),
      React.createElement("p", {
          className: "text-base sm:text-lg md:text-xl text-dark-700 dark:text-dark-100 max-w-xl mx-auto mb-8 animate-fade-in-up",
          style: { animationDelay: '0.4s' }
        },
        "استكشف مجموعة مميزة من أحدث الإكسسوارات والأجهزة الإلكترونية — من شواحن، سماعات، جرابات، بطاريات، وصلات،  شاشات، كيبوردات، ماوسات، دراعات ألعاب والمزيد. كل ما تحتاجه لجهازك في مكان واحد... بأفضل جودة وأقل سعر."
      ),
      React.createElement("div", {
          className: "animate-fade-in-up",
          style: { animationDelay: '0.6s' }
        },
        React.createElement("button", {
            onClick: onShopNow,
            className: "bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-lg text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          },
          "تسوق الآن"
        )
      )
    ),
    React.createElement("div", { className: "absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-light-50 dark:from-dark-900 to-transparent z-0" }),
    React.createElement("div", { className: "absolute -bottom-12 -left-12 w-56 h-56 bg-secondary/5 rounded-full filter blur-3xl animate-subtle-pulse" }),
    React.createElement("div", { className: "absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl animate-subtle-pulse animation-delay-1000" })
  );
};
export { HeroSection };