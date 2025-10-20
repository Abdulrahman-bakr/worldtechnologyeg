import React, { useState, useEffect } from 'react';

const ToastNotification = ({ message, type = 'success', onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        // This effect is specifically designed to run ONLY when the message content changes.
        if (message) {
            // A new message has arrived.
            setIsVisible(true);
            setAnimationClass('animate-toast-in');

            // Set a timer to automatically call the parent's onClose handler.
            // This will set the `message` prop to null, triggering the effect again.
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            // Cleanup function for this effect run.
            return () => clearTimeout(timer);
        } else {
            // The `message` prop is now null. If the toast was previously visible,
            // start the fade-out process.
            if (isVisible) {
                setAnimationClass('animate-toast-out');

                // After the fade-out animation, set visibility to false to unmount the component.
                const visibilityTimer = setTimeout(() => {
                    setIsVisible(false);
                }, 300); // This duration should match the toast-out animation time.

                // Cleanup for this effect run.
                return () => clearTimeout(visibilityTimer);
            }
        }
    // The dependency array intentionally only includes `message`. This prevents an infinite loop
    // that would occur if it depended on the `onClose` function (which changes on every parent render)
    // or the internal `isVisible` state. The logic is structured to flow correctly with this constraint.
    }, [message]);

    // Do not render the component if it's not supposed to be visible.
    if (!isVisible) return null;


    let bgColor, textColor, icon;
    switch (type) {
        case 'error':
            bgColor = 'bg-red-500';
            textColor = 'text-white';
            icon = React.createElement("svg", {xmlns:"http://www.w3.org/2000/svg", fill:"none", viewBox:"0 0 24 24", strokeWidth:"1.5", stroke:"currentColor", className:"w-6 h-6"}, React.createElement("path", {strokeLinecap:"round", strokeLinejoin:"round", d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"}));
            break;
        case 'warning':
            bgColor = 'bg-yellow-400';
            textColor = 'text-dark-900';
            icon = React.createElement("svg", {xmlns:"http://www.w3.org/2000/svg", fill:"none", viewBox:"0 0 24 24", strokeWidth:"1.5", stroke:"currentColor", className:"w-6 h-6"}, React.createElement("path", {strokeLinecap:"round", strokeLinejoin:"round", d:"M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"}));
            break;
        case 'info': // Added info type for wishlist removal
            bgColor = 'bg-blue-500'; // secondary color
            textColor = 'text-white';
            icon = React.createElement("svg", {xmlns:"http://www.w3.org/2000/svg", fill:"none", viewBox:"0 0 24 24", strokeWidth:"1.5", stroke:"currentColor", className:"w-6 h-6"}, React.createElement("path", {strokeLinecap:"round", strokeLinejoin:"round", d:"M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"}));
            break;
        default: // success
            bgColor = 'bg-primary';
            textColor = 'text-white';
            icon = React.createElement("svg", {xmlns:"http://www.w3.org/2000/svg", fill:"none", viewBox:"0 0 24 24", strokeWidth:"1.5", stroke:"currentColor", className:"w-6 h-6"}, React.createElement("path", {strokeLinecap:"round", strokeLinejoin:"round", d:"M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"}));
    }

    return React.createElement("div", {
        className: `fixed bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-[200] p-4 rounded-lg shadow-xl flex items-center space-x-3 space-x-reverse ${bgColor} ${textColor} ${animationClass}`,
        role: "alert",
        "aria-live": "assertive"
    },
        icon,
        React.createElement("span", { className: "text-sm font-medium" }, message)
    );
};
export { ToastNotification };
