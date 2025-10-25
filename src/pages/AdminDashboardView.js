import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAdminData } from '../hooks/useAdminData.js';
import { AdminLayout } from '../components/features/admin/AdminLayout.js';
import { AdminHeader } from '../components/features/admin/AdminHeader.js';
import {
    DashboardHomePanel,
    ProductManagementPanel,
    OrderManagementPanel,
    UserManagementPanel,
    DiscountManagementPanel,
    BannerManagementPanel,
    InventoryPanel,
    ServiceManagementPanel,
    FeeRuleManagementPanel,
    ReviewManagementPanel,
    ReportsPanel,
    PopupBannerManagementPanel,
    StoreSettingsPanel,
    LoyaltyManagementPanel,
    NotificationManagementPanel,
} from '../components/features/admin/index.js';
import { useApp } from '../contexts/AppContext.js';

const AdminDashboardView = () => {
    const { currentUser, fetchInitialData } = useApp();
    const navigate = useNavigate();
    const adminData = useAdminData(currentUser, fetchInitialData);
    const [activePanel, setActivePanel] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const panelComponents = useMemo(() => ({
        home: React.createElement(DashboardHomePanel, { ...adminData, setActivePanel: setActivePanel }),
        products: React.createElement(ProductManagementPanel, { ...adminData }),
        orders: React.createElement(OrderManagementPanel, { ...adminData }),
        users: React.createElement(UserManagementPanel, { ...adminData }),
        discounts: React.createElement(DiscountManagementPanel, { ...adminData }),
        banners: React.createElement(BannerManagementPanel, { ...adminData }),
        popups: React.createElement(PopupBannerManagementPanel, { ...adminData }),
        inventory: React.createElement(InventoryPanel, { ...adminData }),
        services: React.createElement(ServiceManagementPanel, { ...adminData }),
        fees: React.createElement(FeeRuleManagementPanel, { ...adminData }),
        reviews: React.createElement(ReviewManagementPanel, { ...adminData }),
        reports: React.createElement(ReportsPanel, { ...adminData }),
        'store-settings': React.createElement(StoreSettingsPanel, { ...adminData }),
        loyalty: React.createElement(LoyaltyManagementPanel, { ...adminData }),
        notifications: React.createElement(NotificationManagementPanel, { ...adminData }),
    }), [adminData]);
    
    const panelTitles = {
        home: 'الرئيسية',
        products: 'إدارة المنتجات',
        orders: 'إدارة الطلبات',
        users: 'إدارة المستخدمين',
        discounts: 'إدارة الكوبونات',
        banners: 'الإعلانات الرئيسية',
        popups: 'الإعلانات المنبثقة',
        inventory: 'المخزون',
        reviews: 'إدارة المراجعات',
        services: 'الخدمات الرقمية',
        fees: 'قواعد الرسوم',
        reports: 'التقارير',
        'store-settings': 'إعدادات المتجر',
        loyalty: 'إدارة برنامج الولاء',
        notifications: 'إرسال الإشعارات'
    };

    if (!currentUser || currentUser.role !== 'admin') {
        return React.createElement("div", { className: "container mx-auto px-4 py-12 pt-24 text-center min-h-[calc(100vh-16rem)]" }, 
            React.createElement(Helmet, null, React.createElement("title", null, "غير مصرح به - World Technology")),
            React.createElement("p", null, "ليس لديك صلاحية الوصول لهذه الصفحة.")
        );
    }

    return (
        React.createElement(React.Fragment, null,
            React.createElement(Helmet, null, 
                React.createElement("title", null, `لوحة التحكم: ${panelTitles[activePanel]} - World Technology`)
            ),
            React.createElement(AdminLayout, { 
                activePanel: activePanel, 
                setActivePanel: setActivePanel,
                onBack: () => navigate('/'),
                isSidebarOpen: isSidebarOpen,
                setIsSidebarOpen: setIsSidebarOpen
            },
                React.createElement(AdminHeader, { 
                    title: panelTitles[activePanel] || 'لوحة التحكم',
                    notifications: adminData.adminNotifications,
                    setActivePanel: setActivePanel,
                    onToggleSidebar: () => setIsSidebarOpen(prev => !prev),
                    onBack: () => navigate('/')
                }),
                React.createElement("div", { className: "p-4 sm:p-6 w-full" },
                    panelComponents[activePanel] || React.createElement("div", null, "لوحة غير معروفة.")
                )
            )
        )
    );
};

export { AdminDashboardView };