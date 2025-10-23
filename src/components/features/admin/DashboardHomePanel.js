// world-technology-store/src/components/features/admin/DashboardHomePanel.js

import React, { useMemo, useState } from 'react';
import { ShoppingBagIcon, ShoppingCartIcon, UserIcon, ExclamationTriangleIcon } from '../../icons/index.js';

const StatCard = ({ title, value, icon: Icon, isLoading }) => (
    React.createElement("div", { className: "admin-stat-card" },
        React.createElement("div", { className: "flex items-center" },
            React.createElement("div", { className: "p-3 rounded-full bg-primary/10 text-primary mr-4" }, 
                React.createElement(Icon, { className: "w-6 h-6" })
            ),
            React.createElement("div", null,
                React.createElement("p", { className: "text-sm font-medium text-dark-600 dark:text-dark-300" }, title),
                isLoading ? (
                    React.createElement("div", { className: "h-8 w-24 mt-1 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" })
                ) : (
                    React.createElement("p", { className: "text-2xl font-semibold text-dark-900 dark:text-dark-50" }, value)
                )
            )
        )
    )
);

const UrgentActionCard = ({ title, value, icon: Icon, onClick }) => (
    React.createElement("div", { onClick: onClick, className: `p-4 rounded-lg flex items-center gap-4 transition-all ${onClick ? 'cursor-pointer hover:bg-light-100 dark:hover:bg-dark-700' : ''}` },
        React.createElement("div", { className: "p-3 rounded-full bg-yellow-500/10 text-yellow-500" },
            React.createElement(Icon, { className: "w-6 h-6" })
        ),
        React.createElement("div", null,
             React.createElement("p", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50" }, value),
             React.createElement("p", { className: "text-sm font-medium text-dark-600 dark:text-dark-300" }, title)
        )
    )
);

const SalesChart = ({ orders, isLoading }) => {
    const [timePeriod, setTimePeriod] = useState('7days'); // '7days' or '30days'

    const chartData = useMemo(() => {
        if (!orders || orders.length === 0) return { labels: [], data: [], total: 0 };
        
        const days = timePeriod === '7days' ? 7 : 30;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days + 1);
        startDate.setHours(0, 0, 0, 0);

        const salesByDay = {};
        const labels = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const key = date.toLocaleDateString('en-CA'); // YYYY-MM-DD
            salesByDay[key] = 0;
            labels.push(date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }));
        }

        let total = 0;
        orders.forEach(order => {
            if (['delivered', 'shipped'].includes(order.status)) {
                const orderDate = order.createdAt; // Already a Date object from useAdminData
                if (orderDate && !isNaN(orderDate.getTime()) && orderDate >= startDate && orderDate <= endDate) {
                    const key = orderDate.toLocaleDateString('en-CA');
                    salesByDay[key] = (salesByDay[key] || 0) + order.totalAmount;
                    total += order.totalAmount;
                }
            }
        });

        const data = Object.values(salesByDay);
        return { labels, data, total };

    }, [orders, timePeriod]);

    const maxSale = Math.max(...chartData.data, 1); // Avoid division by zero

    return (
        React.createElement("div", { className: "chart-card col-span-1 md:col-span-2 lg:col-span-3" },
            React.createElement("div", { className: "flex justify-between items-center mb-4" },
                React.createElement("div", null,
                    React.createElement("h3", { className: "font-semibold text-dark-900 dark:text-dark-50" }, "ملخص المبيعات"),
                    React.createElement("p", { className: "text-2xl font-bold text-primary" }, 
                        new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(chartData.total)
                    )
                ),
                React.createElement("div", { className: "flex gap-1 p-1 bg-light-100 dark:bg-dark-700 rounded-lg" },
                    React.createElement("button", { onClick: () => setTimePeriod('7days'), className: `px-3 py-1 text-xs font-semibold rounded-md ${timePeriod === '7days' ? 'bg-white dark:bg-dark-600' : ''}` }, "آخر 7 أيام"),
                    React.createElement("button", { onClick: () => setTimePeriod('30days'), className: `px-3 py-1 text-xs font-semibold rounded-md ${timePeriod === '30days' ? 'bg-white dark:bg-dark-600' : ''}` }, "آخر 30 يوم")
                )
            ),
            isLoading ? React.createElement("div", { className: "h-48 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" }) :
            React.createElement("div", { className: "h-48 flex items-end gap-2" },
                chartData.data.map((value, index) => (
                    React.createElement("div", { key: index, className: "flex-1 flex flex-col items-center gap-1 group" },
                        React.createElement("div", { className: "relative w-full h-full flex items-end" },
                            React.createElement("div", { 
                                className: "bar-chart-bar w-full bg-primary/20 hover:bg-primary/40 rounded-t-md",
                                style: { height: `${(value / maxSale) * 100}%` },
                                title: `${new Intl.NumberFormat('ar-EG').format(value)} ج.م`
                            })
                        ),
                        React.createElement("span", { className: "text-xs text-dark-600 dark:text-dark-300" }, chartData.labels[index])
                    )
                ))
            )
        )
    );
};


const DashboardHomePanel = ({ currentUser, stats, isLoading, products, setActivePanel, orders }) => {

    const lowStockCount = useMemo(() => {
        if (!products || products.length === 0) return 0;
        return products.reduce((count, p) => {
            if (p.isDynamicElectronicPayments) return count;
            const threshold = p.lowStockThreshold ?? 10;
            if (p.variants && p.variants.length > 0) {
                if (p.variants.some(v => v.stock <= threshold)) {
                    return count + 1;
                }
            } else if (p.stock <= threshold) {
                return count + 1;
            }
            return count;
        }, 0);
    }, [products]);


    return (
        React.createElement("div", null,
            React.createElement("h1", { className: "text-2xl sm:text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2" }, "لوحة تحكم الإدارة"),
            React.createElement("p", { className: "text-md text-dark-700 dark:text-dark-100 mb-8" }, `أهلاً بك مجدداً، ${currentUser.name}!`),
            
            React.createElement("div", { className: "p-4 bg-white dark:bg-dark-800 rounded-lg border border-light-200 dark:border-dark-700 mb-8" },
                React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "إجراءات عاجلة"),
                 React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
                    React.createElement(UrgentActionCard, {
                        title: "طلبات جديدة تحتاج للمراجعة",
                        value: stats?.newOrdersCount || 0,
                        icon: ShoppingCartIcon,
                        onClick: () => setActivePanel('orders')
                    }),
                    React.createElement(UrgentActionCard, {
                        title: "منتجات مخزونها منخفض",
                        value: lowStockCount,
                        icon: ExclamationTriangleIcon,
                        onClick: () => setActivePanel('inventory')
                    })
                )
            ),

            React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "ملخص الإحصائيات"),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" },
                React.createElement(SalesChart, { orders: orders, isLoading: isLoading }),
                React.createElement(StatCard, { 
                    title: "إجمالي المنتجات", 
                    value: stats?.totalProducts, 
                    icon: ShoppingBagIcon, 
                    isLoading: isLoading 
                }),
                React.createElement(StatCard, { 
                    title: "الطلبات الجديدة", 
                    value: stats?.newOrdersCount, 
                    icon: ShoppingCartIcon, 
                    isLoading: isLoading 
                }),
                React.createElement(StatCard, { 
                    title: "إجمالي المستخدمين", 
                    value: stats?.totalUsers, 
                    icon: UserIcon, 
                    isLoading: isLoading 
                })
            )
        )
    );
};

export { DashboardHomePanel };