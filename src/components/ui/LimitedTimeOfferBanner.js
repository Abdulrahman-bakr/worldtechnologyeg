import React, { useState, useEffect, useMemo } from 'react';
import { CloseIcon, TimerIcon } from '../icons/index.js';

const CountdownUnit = ({ value, label }) => (
    React.createElement("div", { className: "countdown-unit" },
        React.createElement("span", { className: "countdown-value" }, String(value).padStart(2, '0')),
        React.createElement("span", { className: "countdown-label" }, label)
    )
);

const LimitedTimeOfferBanner = ({ product, onDismiss, onNavigate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(product.offerEndTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            if (Object.keys(newTimeLeft).length === 0) {
                clearInterval(timer);
                onDismiss();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [product.offerEndTime, onDismiss]);

    const handleNavigate = () => {
        onNavigate('selectProductSuggestion', { productId: product.id });
    };
    
    const handleDismiss = (e) => {
        e.stopPropagation(); // Prevent banner click from firing
        onDismiss();
    };

    const hasTime = timeLeft.days !== undefined;
    const discountPrice = product.discountPrice || product.price;

    return React.createElement("div", {
        className: "relative bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 text-white p-3 sm:p-4 mb-4 sm:mb-6",
        role: "alert",
        "aria-live": "assertive"
    },
        React.createElement("div", { className: "container mx-auto" },
            React.createElement("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4" },
                React.createElement("div", { 
                    onClick: handleNavigate,
                    className: "flex items-center space-x-3 space-x-reverse cursor-pointer flex-grow" 
                },
                    React.createElement(TimerIcon, { className: "w-8 h-8 flex-shrink-0 animate-pulse" }),
                    React.createElement("img", {
                        src: product.imageUrl,
                        alt: product.arabicName,
                        className: "hidden md:block w-12 h-12 object-contain rounded-md bg-white/20 p-1 flex-shrink-0",
                        loading: "lazy"
                    }),
                    React.createElement("div", { className: "flex-grow" },
                        React.createElement("h3", { className: "font-bold text-sm sm:text-base" }, "عرض خاص سينتهي قريباً!"),
                        React.createElement("p", { className: "text-xs sm:text-sm opacity-90 truncate" }, 
                            `${product.arabicName} - بسعر ${discountPrice} ج.م فقط!`
                        )
                    )
                ),
                
                hasTime && (
                    React.createElement("div", { className: "countdown-container" },
                        React.createElement(CountdownUnit, { value: timeLeft.days, label: "أيام" }),
                        React.createElement("span", {className:"countdown-separator"}, ":"),
                        React.createElement(CountdownUnit, { value: timeLeft.hours, label: "ساعات" }),
                        React.createElement("span", {className:"countdown-separator"}, ":"),
                        React.createElement(CountdownUnit, { value: timeLeft.minutes, label: "دقائق" }),
                        React.createElement("span", {className:"countdown-separator"}, ":"),
                        React.createElement(CountdownUnit, { value: timeLeft.seconds, label: "ثواني" })
                    )
                ),
                 React.createElement("button", {
                    onClick: handleNavigate,
                    className: "hidden lg:inline-block bg-white/90 text-red-600 hover:bg-white font-bold py-2 px-5 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex-shrink-0"
                }, "تسوق الآن"),
                React.createElement("button", {
                    onClick: handleDismiss,
                    "aria-label": "إغلاق العرض",
                    className: "absolute top-1 right-1 sm:static p-1.5 rounded-full hover:bg-black/20 transition-colors flex-shrink-0 ml-2"
                },
                    React.createElement(CloseIcon, { className: "w-5 h-5" })
                )
            )
        )
    );
};

export { LimitedTimeOfferBanner };