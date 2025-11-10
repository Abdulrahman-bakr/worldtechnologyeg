import React, { useState, useMemo } from 'react';
import { SearchIcon, ViewfinderCircleIcon } from '../../icons/index.js';

const InventoryPanel = ({ products, isLoading, handleStockUpdate }) => {
    const [stockLevels, setStockLevels] = useState({});
    const [updatingItems, setUpdatingItems] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);

    const inventoryItems = useMemo(() => {
        let items = [];
        if (!products) return items;

        products.forEach(p => {
            if (p.isDynamicElectronicPayments) return;
            
            const threshold = p.lowStockThreshold ?? 10;
            const isLowStock = (stock) => stock <= threshold;

            if (p.variants && p.variants.length > 0) {
                p.variants.forEach(v => {
                    const shouldShow = !showLowStockOnly || isLowStock(v.stock);
                    if (shouldShow) {
                        items.push({ product: p, variant: v, id: `${p.id}-${v.colorName}` });
                    }
                });
            } else {
                const shouldShow = !showLowStockOnly || isLowStock(p.stock);
                if (shouldShow) {
                    items.push({ product: p, variant: null, id: p.id });
                }
            }
        });
        
        items.sort((a,b) => (a.variant ? a.variant.stock : a.product.stock) - (b.variant ? b.variant.stock : b.product.stock));

        if (searchTerm) {
            const lowercasedSearch = searchTerm.toLowerCase();
            return items.filter(item => 
                item.product.arabicName.toLowerCase().includes(lowercasedSearch)
            );
        }
        
        return items;
    }, [products, showLowStockOnly, searchTerm]);

    const handleStockChange = (id, value) => {
        setStockLevels(prev => ({ ...prev, [id]: value }));
    };

    const onUpdate = async (item) => {
        const newStock = stockLevels[item.id];
        if (newStock === undefined || newStock === '' || Number(newStock) < 0) return;
        
        setUpdatingItems(prev => ({ ...prev, [item.id]: true }));
        await handleStockUpdate(item.product.id, newStock, item.variant ? item.variant.colorName : null);
        setUpdatingItems(prev => ({ ...prev, [item.id]: false }));
        setStockLevels(prev => {
            const newLevels = {...prev};
            delete newLevels[item.id];
            return newLevels;
        });
    };

    return (
        React.createElement("div", null,
            React.createElement("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6" },
                React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50" }, "إدارة المخزون"),
                React.createElement("div", { className: "flex items-center gap-4" },
                    React.createElement("div", { className: "relative" },
                        React.createElement(SearchIcon, { className: "w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" }),
                        React.createElement("input", { 
                            type: "text", 
                            placeholder: "ابحث عن منتج...", 
                            value: searchTerm, 
                            onChange: e => setSearchTerm(e.target.value), 
                            className: "w-full sm:w-64 p-2 pr-10 rounded-md border bg-white dark:bg-dark-700 border-light-300 dark:border-dark-600" 
                        })
                    ),
                    React.createElement("label", { className: "flex items-center gap-2 text-sm whitespace-nowrap" },
                        React.createElement("input", { 
                            type: "checkbox", 
                            checked: showLowStockOnly, 
                            onChange: e => setShowLowStockOnly(e.target.checked),
                            className: "form-checkbox"
                        }),
                        "عرض المخزون المنخفض فقط"
                    )
                )
            ),
            isLoading ? React.createElement("p", null, "جاري تحميل المخزون...") :
            inventoryItems.length === 0 ? 
                React.createElement("div", { className: "p-8 bg-white dark:bg-dark-800 rounded-lg border text-center" }, 
                     React.createElement(ViewfinderCircleIcon, { className: "w-12 h-12 text-dark-400 mx-auto mb-3" }),
                    React.createElement("p", { className: "font-semibold" }, 
                        showLowStockOnly 
                            ? "رائع! لا توجد منتجات مخزونها منخفض حاليًا." 
                            : (searchTerm ? `لا توجد منتجات تطابق البحث "${searchTerm}".` : "لا توجد منتجات لعرضها.")
                    )
                ) :
                React.createElement("div", { className: "admin-table-container" },
                    React.createElement("table", { className: "admin-table" },
                        React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "المنتج"), React.createElement("th", null, "المخزون الحالي"), React.createElement("th", null, "المخزون الجديد"), React.createElement("th", null, "إجراء"))),
                        React.createElement("tbody", null,
                            inventoryItems.map(item => {
                                const currentStock = item.variant ? item.variant.stock : item.product.stock;
                                const threshold = item.product.lowStockThreshold ?? 10;
                                const isLow = currentStock <= threshold;
                                return React.createElement("tr", { key: item.id, className: isLow ? 'bg-red-500/10' : '' },
                                    React.createElement("td", { className: "font-semibold" }, item.product.arabicName, item.variant ? ` (${item.variant.colorName})` : ''),
                                    React.createElement("td", { className: `font-bold ${isLow ? 'text-red-500' : 'text-green-600'}` }, currentStock),
                                    React.createElement("td", null, React.createElement("input", { type: "number", value: stockLevels[item.id] ?? '', onChange: e => handleStockChange(item.id, e.target.value), className: "w-24 p-1 rounded-md border bg-white dark:bg-dark-700 text-center" })),
                                    React.createElement("td", null, React.createElement("button", { onClick: () => onUpdate(item), disabled: updatingItems[item.id] || stockLevels[item.id] === undefined, className: "admin-btn text-sm bg-primary/20 text-primary disabled:opacity-50" }, updatingItems[item.id] ? "جاري..." : "تحديث"))
                                )
                            })
                        )
                    )
                )
        )
    );
};

export { InventoryPanel };