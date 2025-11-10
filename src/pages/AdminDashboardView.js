import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAdminData } from '../hooks/useAdminData.js';
import { AdminLayout } from '../components/features/admin/AdminLayout.js';
import { AdminHeader } from '../components/features/admin/AdminHeader.js';
import { useApp } from '../contexts/AppContext.js';

// Lazy load panel components with better error handling
const lazyLoad = (importFunc) => lazy(() => importFunc().catch(() => ({ 
    default: () => React.createElement("div", { className: "p-6 text-red-600" }, "خطأ في تحميل المكون")
})));

const DashboardHomePanel = lazyLoad(() => import('../components/features/admin/DashboardHomePanel.js').then(module => ({ default: module.DashboardHomePanel })));
const ProductManagementPanel = lazyLoad(() => import('../components/features/admin/ProductManagementPanel.js').then(module => ({ default: module.ProductManagementPanel })));
const OrderManagementPanel = lazyLoad(() => import('../components/features/admin/OrderManagementPanel.js').then(module => ({ default: module.OrderManagementPanel })));
const UserManagementPanel = lazyLoad(() => import('../components/features/admin/UserManagementPanel.js').then(module => ({ default: module.UserManagementPanel })));
const DiscountManagementPanel = lazyLoad(() => import('../components/features/admin/DiscountManagementPanel.js').then(module => ({ default: module.DiscountManagementPanel })));
const BannerManagementPanel = lazyLoad(() => import('../components/features/admin/BannerManagementPanel.js').then(module => ({ default: module.BannerManagementPanel })));
const InventoryPanel = lazyLoad(() => import('../components/features/admin/InventoryPanel.js').then(module => ({ default: module.InventoryPanel })));
const ServiceManagementPanel = lazyLoad(() => import('../components/features/admin/ServiceManagementPanel.js').then(module => ({ default: module.ServiceManagementPanel })));
const FeeRuleManagementPanel = lazyLoad(() => import('../components/features/admin/FeeRuleManagementPanel.js').then(module => ({ default: module.FeeRuleManagementPanel })));
const ReviewManagementPanel = lazyLoad(() => import('../components/features/admin/ReviewManagementPanel.js').then(module => ({ default: module.ReviewManagementPanel })));
const ReportsPanel = lazyLoad(() => import('../components/features/admin/ReportsPanel.js').then(module => ({ default: module.ReportsPanel })));
const PopupBannerManagementPanel = lazyLoad(() => import('../components/features/admin/PopupBannerManagementPanel.js').then(module => ({ default: module.PopupBannerManagementPanel })));
const StoreSettingsPanel = lazyLoad(() => import('../components/features/admin/StoreSettingsPanel.js').then(module => ({ default: module.StoreSettingsPanel })));
const LoyaltyManagementPanel = lazyLoad(() => import('../components/features/admin/LoyaltyManagementPanel.js').then(module => ({ default: module.LoyaltyManagementPanel })));
const NotificationManagementPanel = lazyLoad(() => import('../components/features/admin/NotificationManagementPanel.js').then(module => ({ default: module.NotificationManagementPanel })));
const CategoryManagementPanel = lazyLoad(() => import('../components/features/admin/CategoryManagementPanel.js').then(module => ({ default: module.CategoryManagementPanel })));
const RolesManagementPanel = lazyLoad(() => import('../components/features/admin/RolesManagementPanel.js').then(module => ({ default: module.RolesManagementPanel })));


// Enhanced loading component
const AdminPanelLoadingFallback = () => (
    React.createElement("div", { 
        className: "w-full h-64 flex flex-col items-center justify-center space-y-4" 
    },
        React.createElement("div", { 
            className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" 
        }),
        React.createElement("p", { 
            className: "text-dark-600 dark:text-dark-300 text-sm font-medium" 
        }, "جاري تحميل لوحة التحكم...")
    )
);

// Error boundary component for better error handling
class PanelErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Admin Panel Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return React.createElement("div", { 
                className: "p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center" 
            },
                React.createElement("h3", { 
                    className: "text-lg font-semibold text-red-800 dark:text-red-200 mb-2" 
                }, "حدث خطأ"),
                React.createElement("p", { 
                    className: "text-red-700 dark:text-red-300 text-sm mb-4" 
                }, "عذراً، حدث خطأ في تحميل هذه اللوحة."),
                React.createElement("button", {
                    onClick: () => this.setState({ hasError: false }),
                    className: "px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm"
                }, "إعادة المحاولة")
            );
        }

        return this.props.children;
    }
}

const AdminDashboardView = () => {
    const { currentUser, fetchInitialData } = useApp();
    const navigate = useNavigate();
    const adminData = useAdminData(currentUser, fetchInitialData);
    const [activePanel, setActivePanel] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Memoized panel configuration
    const panelConfig = useMemo(() => ({
        home: { component: DashboardHomePanel, title: 'الرئيسية' },
        products: { component: ProductManagementPanel, title: 'إدارة المنتجات' },
        categories: { component: CategoryManagementPanel, title: 'إدارة الفئات' },
        orders: { component: OrderManagementPanel, title: 'إدارة الطلبات' },
        users: { component: UserManagementPanel, title: 'إدارة المستخدمين' },
        discounts: { component: DiscountManagementPanel, title: 'إدارة الكوبونات' },
        banners: { component: BannerManagementPanel, title: 'الإعلانات الرئيسية' },
        popups: { component: PopupBannerManagementPanel, title: 'الإعلانات المنبثقة' },
        inventory: { component: InventoryPanel, title: 'المخزون' },
        reviews: { component: ReviewManagementPanel, title: 'إدارة المراجعات' },
        services: { component: ServiceManagementPanel, title: 'الخدمات الرقمية' },
        fees: { component: FeeRuleManagementPanel, title: 'قواعد الرسوم' },
        reports: { component: ReportsPanel, title: 'التقارير' },
        'store-settings': { component: StoreSettingsPanel, title: 'إعدادات المتجر' },
        loyalty: { component: LoyaltyManagementPanel, title: 'إدارة برنامج الولاء' },
        notifications: { component: NotificationManagementPanel, title: 'إرسال الإشعارات' },
        roles: { component: RolesManagementPanel, title: 'إدارة الأدوار' }
    }), []);

    const currentPanel = panelConfig[activePanel] || panelConfig.home;
    const PanelComponent = currentPanel.component;

    // Redirect non-admin users
    if (!currentUser || currentUser.role !== 'admin') {
        return React.createElement("div", { 
            className: "container mx-auto px-4 py-12 pt-24 text-center min-h-[calc(100vh-16rem)] flex items-center justify-center" 
        }, 
            React.createElement(Helmet, null, 
                React.createElement("title", null, "غير مصرح به - World Technology")
            ),
            React.createElement("div", { className: "max-w-md mx-auto" },
                React.createElement("div", { 
                    className: "w-20 h-20 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center" 
                },
                    React.createElement("svg", { 
                        xmlns: "http://www.w3.org/2000/svg", 
                        fill: "none", 
                        viewBox: "0 0 24 24", 
                        strokeWidth: "1.5", 
                        stroke: "currentColor", 
                        className: "w-10 h-10 text-red-600 dark:text-red-400" 
                    },
                        React.createElement("path", { 
                            strokeLinecap: "round", 
                            strokeLinejoin: "round", 
                            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
                        })
                    )
                ),
                React.createElement("h2", { 
                    className: "text-2xl font-bold text-dark-900 dark:text-white mb-2" 
                }, "غير مصرح بالوصول"),
                React.createElement("p", { 
                    className: "text-dark-600 dark:text-dark-300 mb-6" 
                }, "ليس لديك صلاحية الوصول إلى لوحة التحكم."),
                React.createElement("button", {
                    onClick: () => navigate('/'),
                    className: "px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
                }, "العودة للرئيسية")
            )
        );
    }

    return (
        React.createElement(React.Fragment, null,
            React.createElement(Helmet, null, 
                React.createElement("title", null, `لوحة التحكم: ${currentPanel.title} - World Technology`)
            ),
            React.createElement(AdminLayout, { 
                activePanel: activePanel, 
                setActivePanel: setActivePanel,
                onBack: () => navigate('/'),
                isSidebarOpen: isSidebarOpen,
                setIsSidebarOpen: setIsSidebarOpen,
                panelConfig: panelConfig
            },
                React.createElement(AdminHeader, { 
                    title: currentPanel.title,
                    notifications: adminData.adminNotifications,
                    setActivePanel: setActivePanel,
                    onToggleSidebar: () => setIsSidebarOpen(prev => !prev),
                    onBack: () => navigate('/'),
                    currentPanel: activePanel
                }),
                React.createElement("main", { 
                    className: "p-4 sm:p-6 w-full flex-1 overflow-auto" 
                },
                    React.createElement(PanelErrorBoundary, null,
                        React.createElement(Suspense, { 
                            fallback: React.createElement(AdminPanelLoadingFallback, null) 
                        },
                            React.createElement(PanelComponent, { 
                                ...adminData, 
                                setActivePanel: setActivePanel,
                                key: activePanel // Force re-render on panel change
                            })
                        )
                    )
                )
            )
        )
    );
};

export { AdminDashboardView };