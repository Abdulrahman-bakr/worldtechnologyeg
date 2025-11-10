import React from 'react';
import { PRODUCT_BENEFITS_LIST } from '../../../../constants/index.js';

const BenefitItem = ({ icon: Icon, title, description }) => (
    React.createElement("div", { className: "flex items-center gap-4 p-4 bg-light-100 dark:bg-dark-700 rounded-lg border border-light-200 dark:border-dark-600" },
        React.createElement(Icon, { className: "w-8 h-8 text-primary flex-shrink-0" }),
        React.createElement("div", null,
            React.createElement("h4", { className: "font-semibold text-dark-900 dark:text-dark-50" }, title),
            React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, description)
        )
    )
);

const ProductBenefits = ({ benefitIds, title }) => {
    if (!benefitIds || benefitIds.length === 0) {
        return null;
    }

    const benefitsToDisplay = PRODUCT_BENEFITS_LIST.filter(benefit => benefitIds.includes(benefit.id));

    if (benefitsToDisplay.length === 0) {
        return null;
    }

    return (
        React.createElement("div", { className: "my-6 pt-6 border-t border-light-200 dark:border-dark-700" },
            title && React.createElement("h3", { className: "text-xl font-semibold mb-4 text-dark-900 dark:text-dark-50" }, title),
            React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" },
                benefitsToDisplay.map(benefit => React.createElement(BenefitItem, { key: benefit.id, ...benefit }))
            )
        )
    );
};

export { ProductBenefits };