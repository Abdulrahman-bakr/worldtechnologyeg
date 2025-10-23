import React from 'react';
import { markdownToHtml } from '../../../../utils/helpers/formatters.js';

const TabButton = ({ id, activeTab, setActiveTab, children }) => {
    const isActive = activeTab === id;
    return (
        React.createElement("button", {
            onClick: () => setActiveTab(id),
            role: "tab",
            "aria-selected": isActive,
            "aria-controls": `tab-panel-${id}`,
            id: `tab-button-${id}`,
            className: `px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold transition-all duration-300 border-b-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-t-md ${isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-dark-600 dark:text-dark-300 hover:text-primary hover:bg-black/5'
                }`
        }, children)
    );
};

const TabsSection = ({ product, activeTab, setActiveTab, sectionsRef }) => {
    const hasTabsContent = product.description || (product.features && product.features.length > 0) || (product.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0);

    if (!hasTabsContent) return null;

    return (
        React.createElement("div", { id: "product-details-tabs", ref: el => sectionsRef.current.overview = sectionsRef.current.features = sectionsRef.current.specs = el, className: "mt-10 bg-white dark:bg-dark-800 rounded-lg shadow-md border border-light-200 dark:border-dark-700 scroll-mt-24" },
            React.createElement("div", { role: "tablist", "aria-label": "تفاصيل المنتج", className: "flex flex-wrap border-b border-light-200 dark:border-dark-700" },
                (product.description && React.createElement(TabButton, { id: "overview", activeTab: activeTab, setActiveTab: setActiveTab }, "نظرة عامة")),
                (product.features && product.features.length > 0 && React.createElement(TabButton, { id: "features", activeTab: activeTab, setActiveTab: setActiveTab }, "الميزات")),
                (product.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0 && React.createElement(TabButton, { id: "specs", activeTab: activeTab, setActiveTab: setActiveTab }, "المواصفات"))
            ),
            React.createElement("div", { className: "p-4 sm:p-6" },
                React.createElement("div", { role: "tabpanel", id: "tab-panel-overview", hidden: activeTab !== 'overview' },
                    product.description && React.createElement("div", { className: "prose prose-sm sm:prose-base max-w-none text-dark-800 dark:text-dark-100 dark:prose-invert", dangerouslySetInnerHTML: { __html: markdownToHtml(product.description) } })
                ),
                React.createElement("div", { role: "tabpanel", id: "tab-panel-features", hidden: activeTab !== 'features' },
                    (product.features && product.features.length > 0) &&
                        React.createElement("ul", { className: "list-disc list-inside space-y-2 text-dark-800 dark:text-dark-100" },
                            product.features.map((feature, index) => React.createElement("li", { key: index }, feature))
                        )
                    
                ),
                React.createElement("div", { role: "tabpanel", id: "tab-panel-specs", hidden: activeTab !== 'specs' },
                    (product.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0) &&
                        React.createElement("dl", { className: "space-y-2" },
                            Object.entries(product.specifications).map(([key, value]) => (
                                React.createElement("div", { key: key, className: "flex justify-between p-2 odd:bg-light-100 dark:odd:bg-dark-700/50 rounded-md text-sm" },
                                    React.createElement("dt", { className: "font-semibold text-dark-800 dark:text-dark-100" }, key),
                                    React.createElement("dd", { className: "text-dark-700 dark:text-dark-200" }, value)
                                )
                            ))
                        )
                    
                )
            )
        )
    );
};
export { TabsSection };