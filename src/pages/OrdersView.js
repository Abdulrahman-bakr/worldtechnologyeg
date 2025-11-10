import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShoppingBagIcon } from '../components/icons/index.js';
import { useOrdersData } from '../hooks/useOrders.js';
import { OrderList, OrdersTabs, EmptyOrders, LoadingOrders, CustomerOrderDetailsModal } from '../components/features/orders/index.js';
import { getStatusDisplayInfo, ORDER_STATUS_GROUPS } from '../components/features/orders/ordersUtils.js';
import { useApp } from '../contexts/AppContext.js';

const OrdersView = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const { orders, isLoading, error, fetchMoreOrders, hasMore, isFetchingMore } = useOrdersData(currentUser);

  const [selectedStatusTab, setSelectedStatusTab] = useState('all');
  const [selectedGroupTitle, setSelectedGroupTitle] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const filteredOrders = useMemo(() => {
    if (selectedStatusTab === 'all') return orders;
    if (selectedStatusTab.startsWith('group:')) {
      const groupTitle = selectedStatusTab.split(':')[1];
      const group = ORDER_STATUS_GROUPS.find(g => g.title === groupTitle);
      return group ? orders.filter(order => group.statuses.includes(order.status)) : orders;
    }
    return orders.filter(order => order.status === selectedStatusTab);
  }, [orders, selectedStatusTab]);

  const ordersStats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter(order => order.status === 'delivered').length;
    const pending = orders.filter(order => ['pending', 'confirmed', 'processing'].includes(order.status)).length;
    const cancelled = orders.filter(order => order.status === 'cancelled').length;
    return { total, delivered, pending, cancelled };
  }, [orders]);

  if (!currentUser && isLoading) {
    return (
      React.createElement("div", { className: "container mx-auto flex items-center justify-center min-h-[calc(100vh-16rem)]" },
        React.createElement("div", { className: "text-center" },
          React.createElement(motion.div,
            {
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.5 },
              className: "animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"
            }
          ),
          React.createElement(motion.p,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.2 },
              className: "text-lg text-gray-600 dark:text-gray-300"
            },
            "يتم التحقق من تسجيل الدخول..."
          )
        )
      )
    );
  }

  const handleAllSelect = () => {
    setSelectedStatusTab('all');
    setSelectedGroupTitle(null);
  };

  const handleGroupSelect = group => {
    setSelectedGroupTitle(group.title);
    setSelectedStatusTab(`group:${group.title}`);
  };

  const handleStatusSelect = statusKey => {
    const group = ORDER_STATUS_GROUPS.find(g => g.statuses.includes(statusKey));
    setSelectedGroupTitle(group ? group.title : null);
    setSelectedStatusTab(statusKey);
  };

  return (
    React.createElement("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 transition-all duration-500" },
      React.createElement(Helmet, null,
        React.createElement("title", null, "طلباتي - World Technology"),
        React.createElement("meta", { name: "description", content: "إدارة ومتابعة طلباتك الشرائية في مكان واحد" })
      ),

      /* Enhanced Header */
      React.createElement(motion.div, 
        { 
          initial: { opacity: 0, y: -30 }, 
          animate: { opacity: 1, y: 0 }, 
          transition: { duration: 0.6, ease: "easeOut" },
          className: "sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-gray-900/95 shadow-lg border-b border-gray-200/80 dark:border-gray-700/80"
        },
        React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8" },
          React.createElement("div", { className: "flex items-center justify-between py-6" },
            React.createElement(motion.button, 
              { 
                whileHover: { scale: 1.05, x: -5 },
                whileTap: { scale: 0.95 },
                onClick: () => navigate(-1),
                className: "flex items-center space-x-3 space-x-reverse text-gray-700 dark:text-gray-200 hover:text-primary transition-all duration-300 group bg-white/50 dark:bg-gray-800/50 px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
              },
              React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2.5, stroke: "currentColor", 
                className: "w-5 h-5 transform rtl:rotate-180 group-hover:-translate-x-1 transition-transform duration-300"
              },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" })
              ),
              React.createElement("span", { className: "font-semibold text-sm" }, "العودة")
            ),

            React.createElement(motion.div, 
              { 
                initial: { opacity: 0, scale: 0.9 }, 
                animate: { opacity: 1, scale: 1 }, 
                transition: { delay: 0.3, duration: 0.5 },
                className: "text-center flex-1"
              },
              React.createElement("h1", { className: "text-4xl font-bold bg-gradient-to-l from-primary to-blue-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-blue-400" },
                "طلباتي"
              ),
              !isLoading && !error && (
                React.createElement(motion.p, 
                  { 
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { delay: 0.5 },
                    className: "text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium"
                  },
                  `${ordersStats.total} طلباً في حسابك`
                )
              )
            ),

            React.createElement("div", { className: "w-20" })
          )
        )
      ),

      /* Enhanced Stats Section */
      !isLoading && !error && orders.length > 0 && (
        React.createElement(motion.div, 
          { 
            initial: { opacity: 0, y: 30 }, 
            animate: { opacity: 1, y: 0 }, 
            transition: { duration: 0.7, delay: 0.2 },
            className: "container mx-auto px-4 sm:px-6 lg:px-8 mt-8"
          },
          React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8" },
            [
              {
                label: 'إجمالي الطلبات',
                value: ordersStats.total,
                color: 'from-purple-500 to-indigo-600',
                icon: '📦',
                bgColor: 'bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20'
              },
              {
                label: 'تم التوصيل',
                value: ordersStats.delivered,
                color: 'from-green-500 to-emerald-600',
                icon: '✅',
                bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20'
              },
              {
                label: 'قيد التنفيذ',
                value: ordersStats.pending,
                color: 'from-blue-500 to-cyan-600',
                icon: '⏳',
                bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20'
              },
              {
                label: 'ملغية',
                value: ordersStats.cancelled,
                color: 'from-red-500 to-orange-600',
                icon: '❌',
                bgColor: 'bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20'
              }
            ].map((stat, i) => (
              React.createElement(motion.div, 
                { 
                  key: i, 
                  whileHover: { 
                    scale: 1.05, 
                    y: -5,
                    transition: { duration: 0.3 }
                  },
                  className: `${stat.bgColor} rounded-3xl p-6 shadow-xl border border-white/50 dark:border-gray-700/50 backdrop-blur-sm`
                },
                React.createElement("div", { className: "flex items-center justify-between" },
                  React.createElement("div", null,
                    React.createElement("p", { className: `text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent` },
                      stat.value
                    ),
                    React.createElement("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-300 mt-2 tracking-wide" },
                      stat.label
                    )
                  ),
                  React.createElement("div", { className: "text-2xl" }, stat.icon)
                )
              )
            ))
          )
        )
      ),

      /* Main Content */
      React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-8" },
        /* Enhanced Empty State */
        !isLoading && !error && orders.length === 0 && (
          React.createElement(motion.div, 
            { 
              initial: { opacity: 0, y: 40, scale: 0.95 }, 
              animate: { opacity: 1, y: 0, scale: 1 }, 
              transition: { duration: 0.8, ease: "easeOut" },
              className: "flex flex-col items-center text-center mb-12 mt-8"
            },
            React.createElement(motion.div, 
              { 
                animate: { 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                },
                transition: { 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                className: "bg-gradient-to-br from-primary/20 to-blue-500/20 p-8 rounded-3xl shadow-2xl mb-6 border border-white/50"
              },
              React.createElement(ShoppingBagIcon, { className: "w-24 h-24 text-primary drop-shadow-lg" })
            ),
            React.createElement("h2", { className: "text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4" },
              "سجل طلباتي"
            ),
            React.createElement("p", { className: "text-gray-600 dark:text-gray-400 max-w-md leading-relaxed text-lg font-medium mb-8" },
              "لم تقم بأي طلبات بعد. ابدأ رحلة التسوق لاكتشاف منتجاتنا المميزة واستمتع بتجربة شراء فريدة."
            ),
            React.createElement(motion.button,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: () => navigate('/products'),
                className: "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl shadow-primary/25 transition-all duration-300"
              },
              "ابدأ التسوق الآن"
            )
          )
        ),

        /* Enhanced Tabs Section */
        !isLoading && !error && orders.length > 0 && (
          React.createElement(motion.div, 
            { 
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, delay: 0.3 },
              className: "mb-10"
            },
            React.createElement(OrdersTabs,
              {
                selectedStatusTab: selectedStatusTab,
                selectedGroupTitle: selectedGroupTitle,
                handleAllSelect: handleAllSelect,
                handleGroupSelect: handleGroupSelect,
                handleStatusSelect: handleStatusSelect,
              }
            )
          )
        ),

        /* Enhanced Orders Panel */
        React.createElement(motion.div, 
          { 
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.8, delay: 0.4 },
            id: "orders-panel", 
            role: "tabpanel", 
            "aria-labelledby": `tab-${selectedStatusTab}`, 
            className: "transition-all duration-500"
          },
          isLoading ? (
            React.createElement(LoadingOrders, null)
          ) : error ? (
            React.createElement(motion.div, 
              { 
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                className: "text-center py-16"
              },
              React.createElement("div", { className: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-3xl p-10 max-w-md mx-auto shadow-2xl" },
                React.createElement(motion.svg, 
                  { 
                    animate: { 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0]
                    },
                    transition: { duration: 2, repeat: Infinity },
                    className: "w-16 h-16 text-red-500 mx-auto mb-6", 
                    fill: "none", 
                    stroke: "currentColor", 
                    viewBox: "0 0 24 24"
                  },
                  React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
                ),
                React.createElement("h3", { className: "text-xl font-bold text-red-800 dark:text-red-200 mb-3" }, "حدث خطأ"),
                React.createElement("p", { className: "text-red-600 dark:text-red-300 mb-6 font-medium" }, error),
                React.createElement(motion.button, 
                  { 
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    onClick: () => window.location.reload(), 
                    className: "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
                  },
                  "إعادة المحاولة"
                )
              )
            )
          ) : filteredOrders.length === 0 ? (
            React.createElement(EmptyOrders, { selectedStatusTab: selectedStatusTab, onNavigate: navigate, totalOrderCount: orders.length })
          ) : (
            React.createElement(OrderList, 
              { 
                orders: filteredOrders, 
                fetchOrders: fetchMoreOrders, 
                hasMore: hasMore, 
                isFetchingMore: isFetchingMore,
                onViewDetails: handleViewDetails, 
              }
            )
          )
        )
      ),
      React.createElement(CustomerOrderDetailsModal,
          {
              isOpen: isDetailsModalOpen,
              onClose: () => setIsDetailsModalOpen(false),
              order: selectedOrder,
          }
      )
    )
  );
};

export { OrdersView };
