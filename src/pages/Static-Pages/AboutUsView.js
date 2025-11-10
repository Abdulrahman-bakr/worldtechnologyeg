

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { StaticPageView } from './StaticPageView.js';

// --- START OF AboutUsView.tsx ---
const AboutUsView = () => {
  const navigate = useNavigate();
  return React.createElement(StaticPageView, { title: "من نحن", onBack: () => navigate(-1) },
    React.createElement(Helmet, null, 
        React.createElement("title", null, "من نحن - World Technology"),
        React.createElement("meta", { name: "description", content: "تعرف على قصة World Technology، متجرك الأول لأفضل اكسسوارات الموبايل والأجهزة الإلكترونية." })
    ),
    React.createElement("p", { className: "text-lg text-dark-800 dark:text-dark-100" }, "مرحبًا بك في World Technology، وجهتك الأولى لكل ما هو جديد ومبتكر في عالم الإكسسوارات الإلكترونية والخدمات الرقمية في مصر. نحن أكثر من مجرد متجر؛ نحن شريكك التقني الذي يمكنك الوثوق به."),

    React.createElement("h3", { className: "text-xl font-bold mt-8 mb-4 text-primary" }, "قصتنا: من فكرة إلى واقع"),
    React.createElement("p", null, "انطلقنا من شغف عميق بالتكنولوجيا ورغبة حقيقية في سد فجوة لاحظناها في السوق المحلي. كان من الصعب العثور على منتجات عالية الجودة بأسعار معقولة، مدعومة بخدمة عملاء تهتم حقًا بتجربة المستخدم. من هذا المنطلق، تأسست World Technology لتكون الحل: منصة تجمع بين الابتكار، الموثوقية، والأسعار التنافسية."),

    React.createElement("h3", { className: "text-xl font-bold mt-8 mb-4 text-primary" }, "رؤيتنا ورسالتنا"),
    React.createElement("p", null, React.createElement("strong", null, "رؤيتنا:"), " أن نكون الخيار الأول والأكثر ثقة لكل محبي التكنولوجيا في مصر والشرق الأوسط، من خلال بناء مجتمع رقمي يثق في جودتنا ويستفيد من خدماتنا المبتكرة."),
    React.createElement("p", {className: "mt-2"}, React.createElement("strong", null, "رسالتنا:"), " تمكين كل فرد من الاستفادة القصوى من أجهزته الرقمية عبر توفير مجموعة منتقاة من الإكسسوارات والخدمات التي تجمع بين الأداء الرفيع، التصميم الأنيق، والسعر المنافس، مع تقديم تجربة تسوق استثنائية."),

    React.createElement("h3", { className: "text-xl font-bold mt-8 mb-4 text-primary" }, "قيمنا الأساسية"),
        React.createElement("ul", { className: "list-disc list-inside space-y-3" },
          React.createElement("li", null, React.createElement("strong", null, "العميل أولاً:"), " أنت في قلب كل ما نقوم به. نسعى جاهدين لفهم احتياجاتك وتجاوز توقعاتك."),
          React.createElement("li", null, React.createElement("strong", null, "الجودة والابتكار:"), " لا نساوم على الجودة. نبحث باستمرار عن أحدث المنتجات والحلول التقنية المبتكرة."),
          React.createElement("li", null, React.createElement("strong", null, "النزاهة والشفافية:"), " نتعامل بوضوح وصدق في جميع تعاملاتنا، من الأسعار إلى سياسات الضمان."),
          React.createElement("li", null, React.createElement("strong", null, "الثقة والموثوقية:"), " نبني علاقات طويلة الأمد مع عملائنا من خلال تقديم منتجات وخدمات يمكن الاعتماد عليها.")
        ),

    React.createElement("h3", { className: "text-xl font-bold mt-8 mb-4 text-primary" }, "لماذا تختار World Technology؟"),
    React.createElement("ul", { className: "list-disc list-inside space-y-4" },
      React.createElement("li", null, React.createElement("strong", null, "تشكيلة واسعة ومنتقاة:"), " نختار منتجاتنا بعناية فائقة من أفضل العلامات التجارية العالمية والمحلية لضمان حصولك على أداء ومتانة تدوم."),
      React.createElement("li", null, React.createElement("strong", null, "أسعار لا تقبل المنافسة:"), " نؤمن بأن التكنولوجيا المتقدمة يجب أن تكون في متناول الجميع. نعمل بجد لتقديم أفضل قيمة مقابل أموالك."),
      React.createElement("li", null, React.createElement("strong", null, "خدمات رقمية متكاملة:"), " لسنا مجرد متجر للمنتجات. نقدم خدمات رقمية مبتكرة مثل شحن الرصيد، دفع الفواتير، وشحن الألعاب لتسهيل حياتك اليومية."),
      React.createElement("li", null, React.createElement("strong", null, "تجربة تسوق سلسة:"), " من التصفح السهل على موقعنا إلى عملية الدفع الآمنة والتوصيل السريع، نهتم بكل تفصيلة في رحلتك معنا."),
      React.createElement("li", null, React.createElement("strong", null, "دعم فني استثنائي:"), " فريقنا ليس مجرد فريق مبيعات، بل هم خبراء تقنيون جاهزون لمساعدتك في كل خطوة، من اختيار المنتج المناسب إلى دعم ما بعد البيع.")
    ),

    React.createElement("p", { className: "mt-10 font-semibold text-lg" }, "شكرًا لكونك جزءًا من مجتمع World Technology. نتطلع لخدمتك وتلبية جميع احتياجاتك التقنية!")
  );
};
// --- END OF AboutUsView.tsx ---
export { AboutUsView };