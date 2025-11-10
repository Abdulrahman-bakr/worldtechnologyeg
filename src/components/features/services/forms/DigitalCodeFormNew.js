import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCartIcon,
  StarIcon,
  ArrowUturnLeftIcon,
  PlayStationIcon,
} from '../../../icons/index.js';

export default function DigitalCodeFormNew({ product, onInitiateDirectCheckout }) {
  const [step, setStep] = useState('country');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  
  const countries = useMemo(
    () => product?.variants?.filter((v) => v.country && v.cards) || [],
    [product]
  );
    
  useEffect(() => {
    // If there is only one country, auto-select it.
    if (countries.length === 1) {
      handleCountrySelect(countries[0]);
    }
  }, [countries]);


  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCountrySelect = (country) => {
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }
    setLoading(true);
    timeoutRef.current = setTimeout(() => {
      setSelectedCountry(country);
      setSelectedCard(null);
      setFormError('');
      setStep('cards');
      setLoading(false);
      timeoutRef.current = null;
    }, 400);
  };

  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setFormError('');
  };

  const handleBack = () => {
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
    }
    setLoading(false);
    // If only one country, no back step is logical
    if (countries.length <= 1) return;
    setStep('country');
    setSelectedCountry(null);
    setSelectedCard(null);
    setFormError('');
  };

  const pointsToEarn = useMemo(() => {
    return selectedCard ? Math.floor(selectedCard.price || 0) : 0;
  }, [selectedCard]);

  const handleCheckout = () => {
    if (!selectedCountry || !selectedCard) {
      setFormError('يرجى اختيار المنطقة والقيمة.');
      return;
    }
    onInitiateDirectCheckout(product, {
      finalPrice: Number(selectedCard.price || 0),
      formData: [
        { label: 'المنطقة', value: selectedCountry.country, id: 'region' },
        { label: 'البطاقة', value: selectedCard.name, id: 'card_name' },
        {
          label: 'السعر',
          value: `${Number(selectedCard.price).toFixed(2)} ج.م`,
          id: 'price',
        },
      ],
      packageName: `${selectedCard.name} - ${selectedCountry.country}`,
    });
  };

  const stepVariants = {
    hidden: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 30 : -30,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction < 0 ? 30 : -30,
      transition: { duration: 0.15 },
    }),
  };

  return (
    React.createElement("form", {
        onSubmit: (e) => { e.preventDefault(); handleCheckout(); },
        className: "relative rounded-2xl p-6 bg-gradient-to-b from-white/6 via-white/4 to-white/2 dark:from-dark-900 dark:via-dark-900 dark:to-dark-950 border border-white/6 backdrop-blur-sm"
    },
        React.createElement("div", { className: "flex items-center justify-center gap-3 mb-5" },
            React.createElement("div", { className: "p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10" },
                React.createElement(PlayStationIcon, { className: "w-8 h-8" })
            ),
            React.createElement("div", { className: "text-center" },
                React.createElement("h3", { className: "text-xl font-extrabold text-dark-900 dark:text-dark-50" }, product?.arabicName),
                React.createElement("p", { className: "text-xs text-dark-500 dark:text-dark-300" }, "بطاقات رقمية - اختر منطقتك وقيمة البطاقة")
            )
        ),
        React.createElement("div", { className: "flex items-center justify-between mb-6" },
            React.createElement("div", { className: "flex-1 h-1 rounded-full bg-light-200 dark:bg-dark-700 mr-3" },
                React.createElement("div", { className: "h-1 rounded-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-500", style: { width: step === 'country' ? '45%' : '95%' } })
            ),
            React.createElement("div", { className: "flex gap-2 text-xs items-center" },
                React.createElement("div", { className: `flex items-center gap-2 px-2 py-1 rounded-full ${step === 'country' ? 'bg-primary/10' : 'bg-transparent'}` },
                    React.createElement("span", { className: "font-semibold" }, "1"),
                    React.createElement("span", { className: "hidden sm:inline" }, "المنطقة")
                ),
                React.createElement("div", { className: `flex items-center gap-2 px-2 py-1 rounded-full ${step === 'cards' ? 'bg-primary/10' : 'bg-transparent'}` },
                    React.createElement("span", { className: "font-semibold" }, "2"),
                    React.createElement("span", { className: "hidden sm:inline" }, "القيمة")
                )
            )
        ),
        loading && React.createElement("div", { className: "text-center text-primary animate-pulse mb-4" }, "جارٍ التحميل..."),
        React.createElement("div", null,
            React.createElement(AnimatePresence, { mode: "wait", initial: false, custom: step === 'country' ? 1 : -1 },
                step === 'country' && React.createElement("motion.fieldset", { key: "country-step", variants: stepVariants, initial: "hidden", animate: "visible", exit: "exit" },
                    React.createElement("legend", { className: "block text-md font-semibold mb-3 text-dark-800 dark:text-dark-100" }, "1. اختر منطقة الحساب"),
                    React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[21rem] overflow-y-auto" },
                        countries.map((country) => {
                            const isImageFlag = country.flag && (country.flag.startsWith('http') || country.flag.startsWith('/'));
                            return React.createElement("motion.button", {
                                key: country.countryCode,
                                type: "button",
                                whileHover: { scale: 1.03, y: -4 },
                                whileTap: { scale: 0.98 },
                                onClick: () => handleCountrySelect(country),
                                className: "relative h-40 p-3 text-center rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center bg-white/5 dark:bg-dark-800 border-white/6 hover:shadow-xl hover:-translate-y-1"
                            },
                                React.createElement("div", { className: "w-20 h-20 mb-2 flex items-center justify-center" },
                                    isImageFlag ? React.createElement("img", { src: country.flag, alt: country.country, className: "w-full h-full object-contain drop-shadow-lg" }) : 
                                    React.createElement("div", { className: "w-16 h-16 flex items-center justify-center bg-white/10 dark:bg-dark-700 rounded-full text-4xl" }, country.flag || '🏳️')
                                ),
                                React.createElement("span", { className: "font-semibold text-sm text-dark-900 dark:text-dark-50" }, country.country)
                            );
                        }),
                        countries.length === 0 && React.createElement("div", { className: "col-span-full text-center text-sm text-dark-500" }, "لا توجد مناطق متاحة لهذه السلعة")
                    )
                ),
                step === 'cards' && selectedCountry && React.createElement("motion.fieldset", { key: "cards-step", variants: stepVariants, initial: "hidden", animate: "visible", exit: "exit" },
                    React.createElement("div", { className: "flex items-center justify-between mb-3" },
                        React.createElement("legend", { className: "block text-md font-semibold text-dark-800 dark:text-dark-100" }, `2. اختر قيمة البطاقة (${selectedCountry.country})`),
                        countries.length > 1 && React.createElement("button", { type: "button", onClick: handleBack, className: "flex items-center gap-1 text-sm text-primary hover:underline" }, React.createElement(ArrowUturnLeftIcon, { className: "w-4 h-4" }), "تغيير المنطقة")
                    ),
                    React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[21rem] overflow-y-auto" },
                        selectedCountry.cards.map((card, index) => {
                            const isSelected = selectedCard?.id === card.id;
                            return React.createElement("motion.button", {
                                key: card.id || index,
                                type: "button",
                                whileHover: { scale: 1.02, y: -2 },
                                whileTap: { scale: 0.98 },
                                onClick: () => handleCardSelect(card),
                                className: `relative h-40 p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center ${isSelected ? 'border-primary bg-primary/10 shadow-xl ring-2 ring-primary/20' : 'border-white/6 bg-white/3 hover:border-primary/50'}`
                            },
                                isSelected && React.createElement(motion.div, { className: "absolute inset-0 rounded-2xl ring-2 ring-primary/50 animate-pulse", layoutId: "selected-card" }),
                                card.popular && React.createElement("div", { className: "absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full z-20" }, "الأكثر طلباً"),
                                React.createElement("div", { className: "relative z-10 flex flex-col items-center justify-center w-full" },
                                    React.createElement("p", { className: `font-extrabold tracking-wide leading-tight break-words w-full ${isSelected ? 'text-primary drop-shadow-sm' : 'text-dark-900 dark:text-dark-50'} text-xl sm:text-2xl`, style: { fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' } }, card.name),
                                    React.createElement("p", { className: `font-semibold mt-2 ${isSelected ? 'text-primary/90' : 'text-dark-600 dark:text-dark-300'} text-base` }, `${Number(card.price).toFixed(2)} ج.م`)
                                )
                            );
                        }),
                        selectedCountry.cards.length === 0 && React.createElement("div", { className: "col-span-full text-center text-sm text-dark-500" }, "لا توجد قيم متاحة لهذه المنطقة")
                    )
                )
            )
        ),
        React.createElement("div", { className: "-mx-6 -mb-6 mt-6 px-6 pt-4 pb-6 bg-light-100 dark:bg-dark-800 rounded-b-2xl border-t border-light-200 dark:border-dark-700" },
            formError && React.createElement("p", { className: "text-red-500 text-sm text-center mb-2" }, formError),
            React.createElement(AnimatePresence, null,
                selectedCard && React.createElement("motion.div", { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 }, className: "text-center mb-3" },
                    React.createElement("p", { className: "text-lg font-bold text-primary" }, `الإجمالي: ${Number(selectedCard.price).toFixed(2)} ج.م`),
                    pointsToEarn > 0 && React.createElement("p", { className: "mt-1 flex items-center justify-center gap-2 text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 font-medium" }, React.createElement(StarIcon, { filled: true, className: "w-4 h-4" }), React.createElement("span", null, `ستحصل على ${pointsToEarn} نقطة`))
                )
            ),
            React.createElement("div", { className: "flex flex-col sm:flex-row gap-3" },
                countries.length > 1 && React.createElement("button", { type: "button", onClick: handleBack, className: "flex-1 py-2.5 rounded-lg border border-light-300 dark:border-dark-600 bg-transparent text-sm font-semibold hover:bg-light-100/50 dark:hover:bg-dark-700 transition-colors" }, "رجوع"),
                React.createElement("button", {
                    type: "submit",
                    disabled: !selectedCard,
                    className: `flex-1 py-2.5 rounded-lg text-white font-semibold transition-all ${selectedCard ? 'bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 shadow-lg' : 'opacity-60 cursor-not-allowed bg-gradient-to-r from-primary/40 to-blue-400'}`
                },
                    React.createElement("div", { className: "flex items-center justify-center gap-2" },
                        React.createElement(ShoppingCartIcon, { className: "w-5 h-5" }),
                        React.createElement("span", null, "شراء الآن")
                    )
                )
            )
        )
    ));
}
