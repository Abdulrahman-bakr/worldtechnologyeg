// world-technology-store/src/components/features/admin/ReportsPanel.js

import React, { useMemo, useState } from 'react';
import { CurrencyDollarIcon, ShoppingCartIcon, UserIcon, ChartPieIcon, ChartBarIcon } from '../../icons/index.js';

const ReportCard = ({ children, className = '' }) => (
    React.createElement("div", { className: `bg-white dark:bg-dark-800 p-4 sm:p-6 rounded-xl border border-light-200 dark:border-dark-700 print-card ${className}` },
        children
    )
);

const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
    React.createElement(ReportCard, null,
        React.createElement("div", { className: "flex items-center" },
            React.createElement("div", { className: "p-3 rounded-full bg-primary/10 text-primary mr-4" }, 
                Icon && React.createElement(Icon, { className: "w-6 h-6" })
            ),
            React.createElement("div", null,
                React.createElement("p", { className: "text-sm font-medium text-dark-600 dark:text-dark-300" }, title),
                React.createElement("p", { className: "text-2xl font-semibold text-dark-900 dark:text-dark-50" }, value)
            )
        )
    )
);

const PieChart = ({ data }) => {
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return React.createElement("div", { className: "flex items-center justify-center h-48 text-dark-600" }, "لا توجد بيانات");

    let cumulativePercentage = 0;
    const gradients = data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const color = colors[index % colors.length];
        const start = cumulativePercentage;
        cumulativePercentage += percentage;
        return `${color} ${start}% ${cumulativePercentage}%`;
    }).join(', ');

    return React.createElement("div", { className: "flex flex-col md:flex-row items-center gap-6" },
        React.createElement("div", { className: "w-32 h-32 rounded-full", style: { background: `conic-gradient(${gradients})` } }),
        React.createElement("div", { className: "space-y-2" },
            data.map((item, index) => (
                React.createElement("div", { key: item.name, className: "flex items-center gap-2 text-sm" },
                    React.createElement("span", { className: "w-3 h-3 rounded-full", style: { backgroundColor: colors[index % colors.length] } }),
                    React.createElement("span", null, item.name),
                    React.createElement("span", { className: "font-semibold" }, `(${(item.value / total * 100).toFixed(1)}%)`)
                )
            ))
        )
    );
};

const HorizontalBarChart = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        React.createElement("div", { className: "space-y-3" },
            data.map(item => (
                React.createElement("div", { key: item.name },
                    React.createElement("div", { className: "flex justify-between text-sm mb-1" },
                        React.createElement("span", { className: "font-medium" }, item.name),
                        React.createElement("span", { className: "font-semibold" }, item.value)
                    ),
                    React.createElement("div", { className: "w-full bg-light-200 dark:bg-dark-700 rounded-full h-2.5" },
                        React.createElement("div", { className: "bg-primary h-2.5 rounded-full", style: { width: `${(item.value / maxValue) * 100}%` } })
                    )
                )
            ))
        )
    );
};


const ReportsPanel = ({ orders = [], products = [], users = [], isLoading }) => {
    const [period, setPeriod] = useState('30days');

    const reportData = useMemo(() => {
        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case 'today': startDate.setHours(0, 0, 0, 0); break;
            case '7days': startDate.setDate(now.getDate() - 7); break;
            case '30days': startDate.setDate(now.getDate() - 30); break;
            case 'all': startDate = new Date(0); break;
            default: startDate.setDate(now.getDate() - 30);
        }

        const filteredOrders = orders.filter(o => {
            const orderDate = o.createdAt; // Already a Date object from useAdminData
            if (!orderDate || isNaN(orderDate.getTime())) return false;
            
            // A sale is any order that is not cancelled or has a failed payment.
            const isSale = !['cancelled', 'failed_payment'].includes(o.status);

            if (period === 'all') {
                return isSale;
            }
            
            return orderDate >= startDate && isSale;
        });
        
        const filteredUsers = users.filter(u => {
            const userDate = u.createdAt; // Already a Date object from useAdminData
            if (!userDate || isNaN(userDate.getTime())) return false;
            
            if (period === 'all') {
                return true;
            }

            return userDate >= startDate;
        });

        const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const totalOrders = filteredOrders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        const salesByCategory = {};
        filteredOrders.forEach(order => {
            (order.items || []).forEach(item => {
                const category = item.category || 'غير مصنف';
                salesByCategory[category] = (salesByCategory[category] || 0) + (item.price * item.quantity);
            });
        });

        const topProducts = {};
        filteredOrders.forEach(order => {
            (order.items || []).forEach(item => {
                topProducts[item.name] = (topProducts[item.name] || 0) + item.quantity;
            });
        });

        return {
            totalRevenue,
            totalOrders,
            newCustomers: filteredUsers.length,
            averageOrderValue,
            salesByCategory: Object.entries(salesByCategory).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value),
            topProducts: Object.entries(topProducts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5)
        };
    }, [orders, users, period]);

    if (isLoading) {
        return React.createElement("p", null, "جاري تحميل التقارير...");
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        React.createElement("div", { id: "reports-panel", className: "space-y-8" },
            React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-center gap-4 no-print" },
                React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50" }, "التقارير والتحليلات"),
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("div", { className: "flex gap-1 p-1 bg-light-100 dark:bg-dark-700 rounded-lg" },
                        ['today', '7days', '30days', 'all'].map(p => {
                            const labels = { today: 'اليوم', '7days': '7 أيام', '30days': '30 يوم', 'all': 'الكل' };
                            return React.createElement("button", { key: p, onClick: () => setPeriod(p), className: `px-3 py-1 text-xs font-semibold rounded-md ${period === p ? 'bg-white dark:bg-dark-600 shadow-sm' : 'hover:bg-white/50'}` }, labels[p]);
                        })
                    ),
                    React.createElement("button", { onClick: handlePrint, className: "admin-btn text-sm bg-secondary" }, "طباعة")
                )
            ),
            
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print-grid" },
                React.createElement(StatCard, { title: "إجمالي الإيرادات", value: `${reportData.totalRevenue.toFixed(2)} ج.م`, icon: CurrencyDollarIcon }),
                React.createElement(StatCard, { title: "إجمالي الطلبات", value: reportData.totalOrders, icon: ShoppingCartIcon }),
                React.createElement(StatCard, { title: "عملاء جدد", value: reportData.newCustomers, icon: UserIcon }),
                React.createElement(StatCard, { title: "متوسط قيمة الطلب", value: `${reportData.averageOrderValue.toFixed(2)} ج.م`, icon: CurrencyDollarIcon })
            ),

            React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 print-grid" },
                React.createElement(ReportCard, null,
                    React.createElement("h3", { className: "text-lg font-semibold flex items-center gap-2 mb-4" }, React.createElement(ChartPieIcon, { className: "w-5 h-5" }), "المبيعات حسب الفئة"),
                    React.createElement(PieChart, { data: reportData.salesByCategory })
                ),
                React.createElement(ReportCard, null,
                    React.createElement("h3", { className: "text-lg font-semibold flex items-center gap-2 mb-4" }, React.createElement(ChartBarIcon, { className: "w-5 h-5" }), "أفضل المنتجات مبيعًا (حسب الكمية)"),
                    React.createElement(HorizontalBarChart, { data: reportData.topProducts })
                )
            )
        )
    );
};

export { ReportsPanel };