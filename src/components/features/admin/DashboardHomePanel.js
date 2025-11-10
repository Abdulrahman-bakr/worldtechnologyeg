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

const Chart = ({ data, isLoading, title, totalLabel, totalValue, colorClass = 'bg-primary' }) => {
    const maxDataValue = Math.max(...(data?.data || []), 1);

    return (
        React.createElement("div", { className: "p-4 sm:p-6 bg-white dark:bg-dark-800 rounded-lg border border-light-200 dark:border-dark-700" },
            React.createElement("div", { className: "flex justify-between items-start mb-4" },
                React.createElement("div", null,
                    React.createElement("h3", { className: "font-semibold text-dark-900 dark:text-dark-50" }, title),
                    React.createElement("p", { className: `text-2xl font-bold ${colorClass.replace('bg-', 'text-')}` }, totalLabel)
                )
            ),
            isLoading ? React.createElement("div", { className: "h-48 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" }) :
            React.createElement("div", { className: "h-48 flex items-end gap-2" },
                data?.data?.map((value, index) => (
                    React.createElement("div", { key: index, className: "flex-1 flex flex-col items-center gap-1 group" },
                        React.createElement("div", { className: "relative w-full h-full flex items-end" },
                            React.createElement("div", { 
                                className: `w-full ${colorClass} rounded-t-md transition-all duration-300 ease-in-out group-hover:bg-opacity-80`,
                                style: { height: `${(value / maxDataValue) * 100}%` },
                                title: `${new Intl.NumberFormat('ar-EG').format(value)} ${totalValue}`
                            })
                        ),
                        React.createElement("span", { className: "text-xs text-dark-600 dark:text-dark-300" }, data.labels[index])
                    )
                ))
            )
        )
    );
};

const SalesChart = ({ orders, isLoading }) => {
    const [timePeriod, setTimePeriod] = useState('7days');

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
            const key = date.toLocaleDateString('en-CA');
            salesByDay[key] = 0;
            labels.push(date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }));
        }

        let total = 0;
        orders.forEach(order => {
            if (['delivered', 'shipped'].includes(order.status)) {
                const orderDate = order.createdAt;
                if (orderDate && !isNaN(orderDate.getTime()) && orderDate >= startDate && orderDate <= endDate) {
                    const key = orderDate.toLocaleDateString('en-CA');
                    salesByDay[key] = (salesByDay[key] || 0) + order.totalAmount;
                    total += order.totalAmount;
                }
            }
        });

        return { labels, data: Object.values(salesByDay), total };
    }, [orders, timePeriod]);

    return (
        React.createElement("div", { className: "col-span-1 md:col-span-2" },
            React.createElement("div", { className: "flex justify-between items-center mb-2" },
                 React.createElement("h2", { className: "text-xl font-semibold" }, "ملخص المبيعات"),
                React.createElement("div", { className: "flex gap-1 p-1 bg-light-100 dark:bg-dark-700 rounded-lg" },
                    React.createElement("button", { onClick: () => setTimePeriod('7days'), className: `px-3 py-1 text-xs font-semibold rounded-md ${timePeriod === '7days' ? 'bg-white dark:bg-dark-600 shadow-sm' : ''}` }, "7 أيام"),
                    React.createElement("button", { onClick: () => setTimePeriod('30days'), className: `px-3 py-1 text-xs font-semibold rounded-md ${timePeriod === '30days' ? 'bg-white dark:bg-dark-600 shadow-sm' : ''}` }, "30 يوم")
                )
            ),
            React.createElement(Chart, { 
                data: chartData, 
                isLoading: isLoading, 
                title: `آخر ${timePeriod === '7days' ? '7 أيام' : '30 يوم'}`, 
                totalLabel: new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(chartData.total),
                totalValue: "ج.م",
                colorClass: "bg-primary" 
            })
        )
    );
};

const UserRegistrationsChart = ({ users, isLoading }) => {
    const [timePeriod, setTimePeriod] = useState('30days');

    const chartData = useMemo(() => {
        if (!users || users.length === 0) return { labels: [], data: [], total: 0 };
        
        const days = timePeriod === '30days' ? 30 : 90;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days + 1);
        startDate.setHours(0, 0, 0, 0);

        const usersByDay = {};
        const labels = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const key = date.toLocaleDateString('en-CA');
            usersByDay[key] = 0;
            labels.push(date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }));
        }

        let totalInPeriod = 0;
        users.forEach(user => {
            const userDate = user.createdAt;
            if (userDate && !isNaN(userDate.getTime()) && userDate >= startDate && userDate <= endDate) {
                const key = userDate.toLocaleDateString('en-CA');
                usersByDay[key] = (usersByDay[key] || 0) + 1;
                totalInPeriod++;
            }
        });

        return { labels, data: Object.values(usersByDay), total: totalInPeriod };
    }, [users, timePeriod]);
    
    return (
         React.createElement("div", { className: "col-span-1 md:col-span-2" },
            React.createElement("div", { className: "flex justify-between items-center mb-2" },
                React.createElement("h2", { className: "text-xl font-semibold" }, "تسجيل المستخدمين الجدد"),
                 React.createElement("div", { className: "flex gap-1 p-1 bg-light-100 dark:bg-dark-700 rounded-lg" },
                    React.createElement("button", { onClick: () => setTimePeriod('30days'), className: `px-3 py-1 text-xs font-semibold rounded-md ${timePeriod === '30days' ? 'bg-white dark:bg-dark-600 shadow-sm' : ''}` }, "30 يوم"),
                    React.createElement("button", { onClick: () => setTimePeriod('90days'), className: `px-3 py-1 text-xs font-semibold rounded-md ${timePeriod === '90days' ? 'bg-white dark:bg-dark-600 shadow-sm' : ''}` }, "90 يوم")
                )
            ),
            React.createElement(Chart, { 
                data: chartData, 
                isLoading: isLoading, 
                title: `آخر ${timePeriod === '30days' ? '30 يوم' : '90 يوم'}`, 
                totalLabel: `${chartData.total} مستخدم`,
                totalValue: "مستخدم",
                colorClass: "bg-secondary" 
            })
        )
    );
};

const DashboardHomePanel = ({ currentUser, stats, isLoading, products, setActivePanel, orders, users }) => {

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
        React.createElement("div", { className: "space-y-8" },
            React.createElement("div", null,
                React.createElement("h1", { className: "text-2xl sm:text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2" }, "لوحة تحكم الإدارة"),
                React.createElement("p", { className: "text-md text-dark-700 dark:text-dark-100" }, `أهلاً بك مجدداً، ${currentUser.name}!`)
            ),
            
            React.createElement("div", { className: "p-4 bg-white dark:bg-dark-800 rounded-lg border border-light-200 dark:border-dark-700" },
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

            React.createElement("div", { className: "space-y-8" },
                React.createElement("div", null,
                    React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "ملخص الإحصائيات"),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
                        React.createElement(StatCard, { title: "إجمالي المنتجات", value: stats?.totalProducts, icon: ShoppingBagIcon, isLoading: isLoading }),
                        React.createElement(StatCard, { title: "الطلبات الجديدة", value: stats?.newOrdersCount, icon: ShoppingCartIcon, isLoading: isLoading }),
                        React.createElement(StatCard, { title: "إجمالي المستخدمين", value: stats?.totalUsers, icon: UserIcon, isLoading: isLoading })
                    )
                ),
                 React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8" },
                    React.createElement(SalesChart, { orders: orders, isLoading: isLoading }),
                    React.createElement(UserRegistrationsChart, { users: users, isLoading: isLoading })
                 )
            )
        )
    );
};

export { DashboardHomePanel };