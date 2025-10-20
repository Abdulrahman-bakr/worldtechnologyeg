import React from 'react';
import { useApp } from '../../../contexts/AppContext.js';
import { getImageUrl } from '../../../utils/imageUrl.js';
import { CloseIcon, ScaleIcon } from '../../icons/index.js';

const ComparisonBar = () => {
    const { 
        comparisonProducts, 
        handleClearCompare, 
        handleToggleCompare,
        setIsComparisonModalOpen
    } = useApp();

    const canCompare = comparisonProducts.length >= 2;

    return (
        React.createElement("div", { className: "comparison-bar" },
            React.createElement("div", { className: "comparison-bar-info" },
                React.createElement(ScaleIcon, { className: "w-6 h-6 text-primary flex-shrink-0" }),
                React.createElement("span", { className: "font-semibold hidden sm:inline" }, "قائمة المقارنة"),
                React.createElement("div", { className: "comparison-bar-items" },
                    comparisonProducts.map(product => (
                        React.createElement("div", { key: product.id, className: "comparison-bar-item" },
                            React.createElement("img", { src: getImageUrl(product.imageUrl), alt: product.arabicName, loading: "lazy" }),
                            React.createElement("button", { 
                                onClick: () => handleToggleCompare(product.id),
                                className: "comparison-bar-item-remove"
                            }, React.createElement(CloseIcon, { className: "w-3 h-3" }))
                        )
                    )),
                    [...Array(3 - comparisonProducts.length)].map((_, i) => 
                        React.createElement("div", { key: `placeholder-${i}`, className: "comparison-bar-item-placeholder" })
                    )
                )
            ),
            React.createElement("div", { className: "comparison-bar-actions" },
                React.createElement("button", { 
                    onClick: () => setIsComparisonModalOpen(true),
                    disabled: !canCompare,
                    className: "comparison-bar-compare-btn"
                }, `قارن الآن (${comparisonProducts.length})`),
                React.createElement("button", { 
                    onClick: handleClearCompare,
                    className: "comparison-bar-clear-btn"
                }, "مسح الكل")
            )
        )
    );
};

export { ComparisonBar };