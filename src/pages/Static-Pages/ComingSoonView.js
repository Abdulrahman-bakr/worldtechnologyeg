import React from 'react';
import { StaticPageView } from './StaticPageView.js';
import { BrainCircuitIcon } from '../../components/icons/index.js';

const ComingSoonView = ({ onBack }) => {
  return React.createElement(StaticPageView, { 
      title: "قريباً...", 
      onBack: onBack,
      icon: BrainCircuitIcon
    },
    React.createElement("div", { className: "text-center" },
      React.createElement("p", { className: "text-lg" }, "نحن نعمل حاليًا على تطوير هذه الميزة لجعل تجربتك أفضل."),
      React.createElement("p", { className: "mt-2 text-dark-700 dark:text-dark-100" }, "ترقبوا التحديثات القادمة! شكراً لصبركم.")
    )
  );
};

export { ComingSoonView };