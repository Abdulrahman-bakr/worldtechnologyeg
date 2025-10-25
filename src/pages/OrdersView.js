import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBagIcon } from '../components/icons/index.js';
import { useOrdersData } from '../hooks/useOrders.js';
import { OrderList } from '../components/features/orders/OrderList.js';
import { OrdersTabs } from '../components/features/orders/OrdersTabs.js';
import { EmptyOrders } from '../components/features/orders/EmptyOrders.js';
import { LoadingOrders } from '../components/features/orders/LoadingOrders.js';
import { ORDER_STATUS_GROUPS } from '../components/features/orders/ordersUtils.js';
import { useApp } from '../contexts/AppContext.js';

const OrdersView = () => {
    const navigate = useNavigate();
    const { currentUser } = useApp();
    const { orders, isLoading, error, fetchMoreOrders, hasMore, isFetchingMore } = useOrdersData(currentUser);

    const [selectedStatusTab, setSelectedStatusTab] = useState("all");
    const [selectedGroupTitle, setSelectedGroupTitle] = useState(null);

    const filteredOrders = useMemo(() => {
        if (selectedStatusTab === "all") {
            return orders;
        }
        if (selectedStatusTab.startsWith('group:')) {
            const groupTitle = selectedStatusTab.split(':')[1];
            const group = ORDER_STATUS_GROUPS.find(g => g.title === groupTitle);
            if (group) {
                return orders.filter(order => group.statuses.includes(order.status));
            }
            return orders; // Fallback
        }
        return orders.filter(order => order.status === selectedStatusTab);
    }, [orders, selectedStatusTab]);

    // إذا كان التطبيق لا يزال يتحقق من هوية المستخدم، اعرض شاشة تحميل
    // هذا يمنع الكود من محاولة جلب الطلبات بـ ID فارغ
    if (!currentUser && isLoading) {
        return (
            <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-16rem)]">
                <p className="text-lg text-gray-500">يتم التحقق من تسجيل الدخول...</p>
            </div>
        );
    }

    const handleAllSelect = () => {
        setSelectedStatusTab('all');
        setSelectedGroupTitle(null);
    };

    const handleGroupSelect = (group) => {
        setSelectedGroupTitle(group.title);
        setSelectedStatusTab(`group:${group.title}`);
    };

    const handleStatusSelect = (statusKey) => {
        const group = ORDER_STATUS_GROUPS.find(g => g.statuses.includes(statusKey));
        setSelectedGroupTitle(group ? group.title : null);
        setSelectedStatusTab(statusKey);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-32 min-h-[calc(100vh-16rem)]">
            <Helmet>
                <title>طلباتي - World Technology</title>
            </Helmet>

            <button
                onClick={() => navigate(-1)}
                className="mb-8 text-primary hover:text-primary-hover font-semibold flex items-center space-x-2 space-x-reverse transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 transform rtl:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span>العودة</span>
            </button>

            <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                <ShoppingBagIcon className="w-12 h-12 sm:w-16 sm:h-16 text-primary mb-3" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-900 dark:text-dark-50">سجل طلباتي</h1>
            </div>

            <OrdersTabs
                selectedStatusTab={selectedStatusTab}
                selectedGroupTitle={selectedGroupTitle}
                handleAllSelect={handleAllSelect}
                handleGroupSelect={handleGroupSelect}
                handleStatusSelect={handleStatusSelect}
            />

            <div id="orders-panel" role="tabpanel" aria-labelledby={`tab-${selectedStatusTab}`}>
                {isLoading ? (
                    <LoadingOrders />
                ) : error ? (
                    <p className="text-center text-red-500 py-10">{error}</p>
                ) : filteredOrders.length === 0 ? (
                    <EmptyOrders
                        selectedStatusTab={selectedStatusTab}
                        onNavigate={(path) => navigate(path)}
                        totalOrderCount={orders.length}
                    />
                ) : (
                    <OrderList
                        orders={filteredOrders}
                        fetchOrders={fetchMoreOrders}
                        hasMore={hasMore}
                        isFetchingMore={isFetchingMore}
                    />
                )}
            </div>
        </div>
    );
};

export { OrdersView };
