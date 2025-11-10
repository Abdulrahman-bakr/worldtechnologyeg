import React, { useState } from 'react';
import { 
    GridViewIcon, ShoppingBagIcon, ShoppingCartIcon, UserIcon, 
    DocumentTextIcon, ChevronDownIcon,
    DocumentChartBarIcon, LogOutIcon, ViewfinderCircleIcon,
    WrenchScrewdriverIcon, StarIcon, MegaphoneIcon,
    CloseIcon, TagIcon, ShieldCheckIcon
} from '../../icons/index.js';

const navItems = [
    { id: 'home', label: 'الرئيسية', icon: GridViewIcon },
    {
        id: 'catalog', label: 'الكتالوج', icon: ShoppingBagIcon, children: [
            { id: 'products', label: 'إدارة المنتجات', icon: ShoppingBagIcon },
            { id: 'categories', label: 'إدارة الفئات', icon: TagIcon },
            { id: 'inventory', label: 'المخزون', icon: ViewfinderCircleIcon },
            { id: 'reviews', label: 'إدارة المراجعات', icon: DocumentTextIcon },
        ]
    },
    {
        id: 'sales', label: 'المبيعات', icon: ShoppingCartIcon, children: [
            { id: 'orders', label: 'إدارة الطلبات', icon: ShoppingCartIcon },
            { id: 'users', label: 'إدارة العملاء', icon: UserIcon },
        ]
    },
    {
        id: 'marketing', label: 'التسويق', icon: MegaphoneIcon, children: [
            { id: 'discounts', label: 'الكوبونات', icon: TagIcon },
            { id: 'banners', label: 'الإعلانات الرئيسية', icon: ViewfinderCircleIcon },
            { id: 'popups', label: 'الإعلانات المنبثقة', icon: ViewfinderCircleIcon },
            { id: 'notifications', label: 'إرسال إشعارات', icon: MegaphoneIcon },
        ]
    },
    { id: 'reports', label: 'التقارير', icon: DocumentChartBarIcon },
    { id: 'loyalty', label: 'برنامج الولاء', icon: StarIcon },
     {
        id: 'access-control', label: 'الصلاحيات والأدوار', icon: ShieldCheckIcon, children: [
             { id: 'roles', label: 'إدارة الأدوار', icon: ShieldCheckIcon },
        ]
    },
    {
        id: 'settings', label: 'الإعدادات', icon: WrenchScrewdriverIcon, children: [
             { id: 'store-settings', label: 'إعدادات المتجر', icon: WrenchScrewdriverIcon },
             { id: 'services', label: 'الخدمات الرقمية', icon: WrenchScrewdriverIcon },
             { id: 'fees', label: 'قواعد الرسوم', icon: WrenchScrewdriverIcon },
        ]
    },
];

const NavItem = ({ item, activePanel, setActivePanel, openSections, setOpenSections }) => {
    const isParent = item.children && item.children.length > 0;
    const isActive = !isParent && activePanel === item.id;
    const isParentActive = isParent && item.children.some(child => child.id === activePanel);
    const isOpen = isParent && openSections.includes(item.id);

    const handleClick = () => {
        if (isParent) {
            setOpenSections(prev => 
                prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
            );
        } else {
            setActivePanel(item.id);
        }
    };

    return (
        React.createElement(React.Fragment, null,
            React.createElement("button", { 
                onClick: handleClick,
                className: `admin-nav-link ${isActive || isParentActive ? 'active' : ''}` 
            },
                item.icon && React.createElement(item.icon, { className: "w-5 h-5" }),
                React.createElement("span", { className: "flex-grow" }, item.label),
                isParent && React.createElement(ChevronDownIcon, { className: `w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}` })
            ),
            isParent && isOpen && (
                React.createElement("div", { className: "pl-4 mt-1 space-y-1" },
                    item.children.map(child => (
                         React.createElement("button", { 
                            key: child.id,
                            onClick: () => setActivePanel(child.id),
                            className: `admin-nav-link text-sm ${activePanel === child.id ? 'active font-semibold' : 'font-normal'}` 
                        },
                            child.icon && React.createElement(child.icon, { className: "w-4 h-4" }),
                            React.createElement("span", { className: "flex-grow" }, child.label)
                        )
                    ))
                )
            )
        )
    );
};


const AdminLayout = ({ children, activePanel, setActivePanel, onBack, isSidebarOpen, setIsSidebarOpen }) => {
    
    const [openSections, setOpenSections] = useState(['catalog', 'sales', 'marketing', 'settings', 'access-control']);

    const sidebarContent = (
        React.createElement("div", { className: "flex flex-col h-full" },
            React.createElement("div", { className: "flex justify-between items-center mb-6 md:mb-8 md:justify-center flex-shrink-0" },
                React.createElement("h2", { className: "font-bold text-lg text-primary" }, "لوحة التحكم"),
                React.createElement("button", { onClick: () => setIsSidebarOpen(false), className: "p-2 md:hidden" }, React.createElement(CloseIcon, { className: "w-6 h-6" }))
            ),
            React.createElement("div", { className: "flex-grow overflow-y-auto" },
                React.createElement("nav", { className: "flex flex-col gap-2" },
                    navItems.map(item => (
                        React.createElement(NavItem, { 
                            key: item.id,
                            item: item,
                            activePanel: activePanel, 
                            setActivePanel: (panelId) => {
                                setActivePanel(panelId);
                                if (window.innerWidth < 768) { // Close on mobile
                                    setIsSidebarOpen(false);
                                }
                            },
                            openSections: openSections,
                            setOpenSections: setOpenSections
                        })
                    ))
                )
            )
        )
    );

    return (
        React.createElement("div", { className: "flex h-screen bg-light-50 dark:bg-dark-900 text-dark-900 dark:text-dark-50 overflow-hidden" },
            isSidebarOpen && React.createElement("div", { 
                className: "fixed inset-0 bg-black/85 z-30 md:hidden",
                onClick: () => setIsSidebarOpen(false) 
            }),
            React.createElement("aside", { 
                className: `fixed inset-y-0 right-0 z-40 w-64 bg-white dark:bg-dark-800 border-l border-light-200 dark:border-dark-700 p-4 transition-transform duration-300 ease-in-out md:relative md:flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`
            }, sidebarContent),
            React.createElement("main", { className: "flex-1 overflow-y-auto" },
                children
            )
        )
    );
};

export { AdminLayout };