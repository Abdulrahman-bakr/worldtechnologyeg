
import React from 'react';
import { StaticPageView } from './StaticPageView.js';

// --- START OF AboutUsView.tsx ---
const AboutUsView = ({ onBack }) => {
  return React.createElement(StaticPageView, { title: "من نحن", onBack: onBack },
    React.createElement("p", null, "مرحبًا بك في World Technology! نحن فريق شغوف بالتكنولوجيا ونهدف إلى توفير أحدث وأفضل الإكسسوارات الإلكترونية لعملائنا الكرام في جميع أنحاء مصر."),
    React.createElement("p", null, "تأسست World Technology على مبدأ تقديم منتجات عالية الجودة بأسعار تنافسية، مع التركيز على خدمة عملاء استثنائية. نحن نؤمن بأن التكنولوجيا يجب أن تكون متاحة للجميع، ونسعى جاهدين لجعل تجربتك في التسوق معنا سهلة وممتعة."),
    React.createElement("h3", { className: "text-lg font-semibold mt-4 mb-2" }, "مهمتنا"),
    React.createElement("p", null, "توفير مجموعة واسعة من الإكسسوارات الإلكترونية المبتكرة التي تلبي احتياجات عملائنا المتطورة، مع ضمان رضاهم التام من خلال الجودة والخدمة."),
    React.createElement("h3", { className: "text-lg font-semibold mt-4 mb-2" }, "رؤيتنا"),
    React.createElement("p", null, "أن نصبح المتجر الرائد للإكسسوارات الإلكترونية في مصر، والمعروف بموثوقيته، وتنوع منتجاته، والتزامه بالتميز."),
    React.createElement("p", { className: "mt-6" }, "شكرًا لثقتكم في World Technology. نتطلع لخدمتكم!")
  );
};
// --- END OF AboutUsView.tsx ---
export { AboutUsView };