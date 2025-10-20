import React from 'react';

const VariantsSelector = ({ product, selectedVariant, setSelectedVariant }) => {
    if (!product.variants || product.variants.length === 0) return null;

    return (
        React.createElement("div", { className: "pt-2" },
            React.createElement("h3", { className: "text-sm font-medium text-dark-800 dark:text-dark-100 mb-2" },
                "اللون المحدد: ", React.createElement("span", { className: "font-bold text-primary" }, selectedVariant?.colorName)
            ),
            React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
                product.variants.map(variant => (
                    React.createElement("button", {
                        key: variant.colorName,
                        onClick: () => setSelectedVariant(variant),
                        title: `${variant.colorName} (${variant.stock > 0 ? 'متوفر' : 'نفذ'})`,
                        "aria-label": `اختر اللون ${variant.colorName}`,
                        className: `w-8 h-8 rounded-full border-2 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-800 focus:ring-primary ${selectedVariant?.colorName === variant.colorName ? 'border-primary scale-110 shadow-lg' : 'border-white dark:border-dark-800 hover:border-primary/50'}`,
                        style: { backgroundColor: variant.colorHex },
                        disabled: variant.stock === 0
                    },
                        variant.stock === 0 && (
                            React.createElement("div", { className: "w-full h-full bg-black/60 flex items-center justify-center rounded-full" },
                                React.createElement("span", { className: "text-white text-xs font-bold transform rotate-45" }, "+")
                            )
                        )
                    )
                ))
            )
        )
    );
};
export { VariantsSelector };
