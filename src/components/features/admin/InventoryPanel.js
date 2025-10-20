import React, { useState, useMemo, useEffect } from 'react';

const InventoryPanel = ({ products, isLoading, handleStockUpdate }) => {
    const [stockLevels, setStockLevels] = useState({});
    const [updatingItems, setUpdatingItems] = useState({});

    const lowStockItems = useMemo(() => {
        const items = [];
        products.forEach(p => {
            if (p.isDynamicElectronicPayments) return;
            const threshold = p.lowStockThreshold ?? 10;
            if (p.variants && p.variants.length > 0) {
                p.variants.forEach(v => {
                    if (v.stock <= threshold) {
                        items.push({ product: p, variant: v, id: `${p.id}-${v.colorName}` });
                    }
                });
            } else {
                if (p.stock <= threshold) {
                    items.push({ product: p, variant: null, id: p.id });
                }
            }
        });
        return items.sort((a,b) => (a.variant ? a.variant.stock : a.product.stock) - (b.variant ? b.variant.stock : b.product.stock));
    }, [products]);

    const handleStockChange = (id, value) => {
        setStockLevels(prev => ({ ...prev, [id]: value }));
    };

    const onUpdate = async (item) => {
        const newStock = stockLevels[item.id];
        if (newStock === undefined || newStock === '' || Number(newStock) < 0) return;
        
        setUpdatingItems(prev => ({ ...prev, [item.id]: true }));
        const result = await handleStockUpdate(item.product.id, newStock, item.variant ? item.variant.colorName : null);
        if(result.success) {
            // Data will be refetched by useAdminData, no need to update local state here
        }
        setUpdatingItems(prev => ({ ...prev, [item.id]: false }));
    };

    return (
        React.createElement("div", null,
            React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6" }, "إدارة المخزون (تنبيهات المخزون المنخفض)"),
            isLoading ? React.createElement("p", null, "جاري تحميل المخزون...") :
            lowStockItems.length === 0 ? 
                React.createElement("div", { className: "p-6 bg-white dark:bg-dark-800 rounded-lg border" }, "لا توجد منتجات مخزونها منخفض حاليًا.") :
                React.createElement("div", { className: "admin-table-container" },
                    React.createElement("table", { className: "admin-table" },
                        React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "المنتج"), React.createElement("th", null, "المخزون الحالي"), React.createElement("th", null, "المخزون الجديد"), React.createElement("th", null, "إجراء"))),
                        React.createElement("tbody", null,
                            lowStockItems.map(item => {
                                const currentStock = item.variant ? item.variant.stock : item.product.stock;
                                return React.createElement("tr", { key: item.id, className: currentStock <= 5 ? 'bg-red-500/10' : '' },
                                    React.createElement("td", { className: "font-semibold" }, item.product.arabicName, item.variant ? ` (${item.variant.colorName})` : ''),
                                    React.createElement("td", { className: `font-bold ${currentStock <= 5 ? 'text-red-500' : 'text-yellow-600'}` }, currentStock),
                                    React.createElement("td", null, React.createElement("input", { type: "number", value: stockLevels[item.id] ?? '', onChange: e => handleStockChange(item.id, e.target.value), className: "w-24 p-1 rounded-md border bg-white dark:bg-dark-700" })),
                                    React.createElement("td", null, React.createElement("button", { onClick: () => onUpdate(item), disabled: updatingItems[item.id], className: "admin-btn text-sm bg-primary/20 text-primary disabled:opacity-50" }, updatingItems[item.id] ? "جاري..." : "تحديث"))
                                )
                            })
                        )
                    )
                )
        )
    );
};

export { InventoryPanel };