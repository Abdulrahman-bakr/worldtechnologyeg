import React from 'react';

const CheckoutProgressBar = ({ steps, currentStep, progressBarWidth }) => {
    return (
        React.createElement("div", { className: "mb-6" },
            React.createElement("div", { className: "flex justify-between items-center relative mb-2" },
                React.createElement("div", {
                    className: "absolute top-4 left-0 right-0 h-0.5 bg-dark-300 dark:bg-dark-600 mx-auto w-full",
                    style: { transform: 'translateX(0%)' }
                }),
                React.createElement("div", {
                    className: `absolute top-4 right-0 h-0.5 bg-primary transition-all duration-500 ease-in-out`,
                    style: { width: `${progressBarWidth}%` }
                }),
                steps.map((step) =>
                    React.createElement("div", { key: step.id, className: `flex-1 flex flex-col items-center z-10 ${currentStep >= step.id ? 'text-primary' : 'text-dark-500 dark:text-dark-400'}` },
                        React.createElement("div", { className: `w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold text-sm ${currentStep >= step.id ? 'bg-primary text-white border-primary' : 'bg-light-200 dark:bg-dark-600 border-dark-300 dark:border-dark-500'}` },
                            step.id
                        ),
                        React.createElement("span", { className: "mt-1 text-sm text-center" }, step.title)
                    )
                )
            )
        )
    );
};

export { CheckoutProgressBar };