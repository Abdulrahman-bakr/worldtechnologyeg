import React, { useState, useEffect } from 'react';
import { CloseIcon, PaperAirplaneIcon } from '../icons/index.js';

const PopupBanner = ({ popupConfig }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (!popupConfig) return;

        const popupId = `popup_${popupConfig.id}`;
        const hasBeenSeen = localStorage.getItem(popupId);

        if (popupConfig.frequency === 'once' && hasBeenSeen) {
            return; // Don't show if it's a "once" popup that's been seen
        }

        const showPopup = () => setIsVisible(true);

        let timer;
        if (popupConfig.trigger === 'timed') {
            timer = setTimeout(showPopup, (popupConfig.triggerValue || 5) * 1000);
        } else if (popupConfig.trigger === 'entry') {
            // Show almost immediately to allow for page render
            timer = setTimeout(showPopup, 500);
        }
        
        return () => clearTimeout(timer);

    }, [popupConfig]);

    const handleClose = () => {
        setIsVisible(false);
        if (popupConfig.frequency === 'once') {
            localStorage.setItem(`popup_${popupConfig.id}`, 'true');
        }
    };
    
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle the email submission (e.g., API call)
        console.log("Newsletter signup:", email);
        handleClose();
    };

    if (!isVisible || !popupConfig) return null;

    const isImageType = popupConfig.type === 'image';

    return (
        React.createElement("div", { className: "fixed inset-0 z-[150] flex items-center justify-center p-4" },
            React.createElement("div", { className: "modal-overlay absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-100", onClick: handleClose }),
            React.createElement("div", { className: "modal-content bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-sm relative animate-fade-in-up border border-light-200 dark:border-dark-700 overflow-hidden" },
                React.createElement("button", { onClick: handleClose, className: "absolute top-2 right-2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 z-10" }, 
                    React.createElement(CloseIcon, { className: "w-5 h-5" })
                ),
                isImageType ? (
                    React.createElement("a", { href: popupConfig.buttonLink || '#', target: "_self", rel: "noopener noreferrer" },
                        popupConfig.imageUrl && React.createElement("img", { src: popupConfig.imageUrl, alt: popupConfig.headline || 'Promotion', className: "w-full h-auto object-cover" }),
                        React.createElement("div", { className: "p-6 text-center" },
                            popupConfig.headline && React.createElement("h3", { className: "text-xl font-bold mb-4 text-dark-900 dark:text-dark-50" }, popupConfig.headline),
                            popupConfig.buttonText && React.createElement("span", { className: "inline-block bg-primary text-white font-semibold py-2 px-6 rounded-lg" }, popupConfig.buttonText)
                        )
                    )
                ) : (
                    React.createElement("div", { className: "p-8 text-center" },
                        React.createElement("h3", { className: "text-2xl font-bold mb-2 text-dark-900 dark:text-dark-50" }, popupConfig.newsletterHeadline),
                        React.createElement("p", { className: "text-dark-600 dark:text-dark-300 mb-6" }, popupConfig.newsletterSubheadline),
                        React.createElement("form", { onSubmit: handleNewsletterSubmit, className: "relative" },
                            React.createElement("input", { 
                                type: "email", 
                                value: email,
                                onChange: e => setEmail(e.target.value),
                                placeholder: "أدخل بريدك الإلكتروني",
                                required: true,
                                className: "w-full p-3 pl-12 rounded-lg border border-light-300 dark:border-dark-600 bg-light-100 dark:bg-dark-700 text-dark-900 dark:text-dark-50"
                            }),
                            React.createElement("button", { type: "submit", className: "absolute top-1/2 -translate-y-1/2 left-1.5 p-2 rounded-md bg-primary text-white" }, 
                                React.createElement(PaperAirplaneIcon, { className: "w-5 h-5" })
                            )
                        )
                    )
                )
            )
        )
    );
};

export { PopupBanner };