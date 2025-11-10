import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderDetailsModal } from './OrderDetailsModal.js';
import { getStatusDisplayInfo } from '../orders/ordersUtils.js';
import { EGYPT_GOVERNORATES_DATA } from '../../../constants/governorates.js';
import {
    ExclamationTriangleIcon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    SearchIcon,
    FilterIcon,
    CalendarDaysIcon,
    CloseIcon
} from '../../icons/index.js';

const allStatuses = [
    "pending_payment_confirmation", "processing", "failed_payment",
    "pending_fulfillment", "pending_delivery", "shipped",
    "delivered", "cancelled"
];

const OrderManagementPanel = ({ orders, isLoading, handleOrderStatusUpdate, handleOrderShippingUpdate, handleOrderDelete, handleOrderNoteAdd }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        paymentMethod: '',
        governorate: '',
        city: '',
        orderType: '',
    });
    const [availableCities, setAvailableCities] = useState([]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };
            if (name === 'governorate') {
                newFilters.city = ''; // Reset city when governorate changes
                setAvailableCities(value ? EGYPT_GOVERNORATES_DATA[value] || [] : []);
            }
            return newFilters;
        });
    };

    const resetFilters = () => {
        setFilters({
            dateFrom: '',
            dateTo: '',
            paymentMethod: '',
            governorate: '',
            city: '',
            orderType: '',
        });
        setSearchTerm('');
        setAvailableCities([]);
    };

    const setDateFilter = (days) => {
        const to = new Date();
        const from = new Date();
        
        if (days === 1) { // Today
            from.setHours(0, 0, 0, 0);
        } else { // Last 7 days, etc.
            from.setDate(to.getDate() - days + 1);
            from.setHours(0, 0, 0, 0);
        }

        const toDateString = to.toISOString().split('T')[0];
        const fromDateString = from.toISOString().split('T')[0];

        setFilters(prev => ({ ...prev, dateFrom: fromDateString, dateTo: toDateString }));
    };

    const uniquePaymentMethods = useMemo(() => {
        const methods = new Set(orders.map(o => o.paymentDetails?.method).filter(Boolean));
        return Array.from(methods);
    }, [orders]);

    const filteredOrders = useMemo(() => {
        // Use replace to parse date strings in local time zone, avoiding UTC issues.
        const fromDateFilter = filters.dateFrom ? new Date(filters.dateFrom.replace(/-/g, '/')) : null;
        if (fromDateFilter) fromDateFilter.setHours(0, 0, 0, 0);
    
        const toDateFilter = filters.dateTo ? new Date(filters.dateTo.replace(/-/g, '/')) : null;
        if (toDateFilter) toDateFilter.setHours(23, 59, 59, 999);

        return orders.filter(order => {
            const orderDate = order.createdAt;
            const isDateValid = orderDate instanceof Date && !isNaN(orderDate.getTime());

            if (searchTerm) {
                const lowerSearchTerm = searchTerm.toLowerCase();
                const nameMatch = order.customerDetails?.name?.toLowerCase().includes(lowerSearchTerm);
                const idMatch = order.displayOrderId?.toLowerCase().includes(lowerSearchTerm);
                if (!nameMatch && !idMatch) return false;
            }
    
            if (fromDateFilter && (!isDateValid || orderDate < fromDateFilter)) return false;
            if (toDateFilter && (!isDateValid || orderDate > toDateFilter)) return false;
            
            if (filters.paymentMethod && order.paymentDetails?.method !== filters.paymentMethod) return false;
            if (filters.governorate && order.customerDetails?.governorate !== filters.governorate) return false;
            if (filters.city && order.customerDetails?.city !== filters.city) return false;
            if (filters.orderType === 'digital' && (!order.containsElectronicPayments || order.containsPhysicalServices)) return false;
            if (filters.orderType === 'physical' && !order.containsPhysicalServices) return false;
            
            return true;
        });
    }, [orders, filters, searchTerm]);
    
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const sortedOrders = useMemo(() => {
        let sortableItems = [...filteredOrders];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue, bValue;
    
                if (sortConfig.key === 'customerDetails.name') {
                    aValue = a.customerDetails?.name || '';
                    bValue = b.customerDetails?.name || '';
                } else {
                    aValue = a[sortConfig.key];
                    bValue = b[sortConfig.key];
                }
                
                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;
                
                if (aValue instanceof Date && bValue instanceof Date) {
                     aValue = aValue.getTime();
                     bValue = bValue.getTime();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredOrders, sortConfig]);

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };
    
    const onDeleteOrder = (orderId, displayOrderId) => {
        if (window.confirm(`هل أنت متأكد من حذف الطلب ${displayOrderId}؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
            handleOrderDelete(orderId);
        }
    };

    // Enhanced input styling
    const inputClass = "w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm placeholder-gray-500/70 dark:placeholder-gray-400/70";
    
    // START: MODIFIED SortableHeader component
    const SortableHeader = ({ children, sortKey }) => (
        <th className="px-4 py-3 text-right"> {/* Added text-right here */}
            <button 
                onClick={() => requestSort(sortKey)} 
                // Added justify-start to align content to the right (RTL context)
                className="flex items-center justify-start gap-2 group w-full hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded-lg transition-colors"
            >
                <span className="font-semibold text-gray-700 dark:text-gray-300">{children}</span>
                <span className="flex flex-col">
                    <ChevronUpIcon 
                        className={`w-3 h-3 transition-all ${
                            sortConfig.key === sortKey && sortConfig.direction === 'ascending' 
                                ? 'text-primary' 
                                : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                        }`} 
                    />
                    <ChevronDownIcon 
                        className={`w-3 h-3 -mt-1 transition-all ${
                            sortConfig.key === sortKey && sortConfig.direction === 'descending' 
                                ? 'text-primary' 
                                : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                        }`} 
                    />
                </span>
            </button>
        </th>
    );
    // END: MODIFIED SortableHeader component

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-4 sm:p-6">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            إدارة الطلبات
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            إدارة وتتبع جميع طلبات العملاء في مكان واحد
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-2 border border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">إجمالي الطلبات:</span>
                            <span className="font-bold text-primary text-lg mr-2">{orders.length}</span>
                        </div>
                    </div>
                </div>

                {/* Search & Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Search Box */}
                        <div className="relative flex-1 w-full lg:max-w-md">
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <SearchIcon className="w-5 h-5" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="ابحث برقم الطلب أو اسم العميل..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                            <button 
                                onClick={() => setDateFilter(1)} 
                                className="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 font-medium"
                            >
                                <CalendarDaysIcon className="w-4 h-4" />
                                طلبات اليوم
                            </button>
                            <button 
                                onClick={() => setDateFilter(7)} 
                                className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 font-medium"
                            >
                                <CalendarDaysIcon className="w-4 h-4" />
                                آخر 7 أيام
                            </button>
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-xl border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-300 font-medium"
                            >
                                <FilterIcon className="w-4 h-4" />
                                الفلاتر المتقدمة
                            </button>
                        </div>
                    </div>

                    {/* Advanced Filters - Collapsible */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    {/* Date From */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">من تاريخ</label>
                                        <input 
                                            type="date" 
                                            name="dateFrom" 
                                            value={filters.dateFrom} 
                                            onChange={handleFilterChange} 
                                            className={inputClass}
                                        />
                                    </div>
                                    {/* Date To */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">إلى تاريخ</label>
                                        <input 
                                            type="date" 
                                            name="dateTo" 
                                            value={filters.dateTo} 
                                            onChange={handleFilterChange} 
                                            className={inputClass}
                                        />
                                    </div>
                                    {/* Payment Method */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">طريقة الدفع</label>
                                        <select 
                                            name="paymentMethod" 
                                            value={filters.paymentMethod} 
                                            onChange={handleFilterChange} 
                                            className={inputClass}
                                        >
                                            <option value="">الكل</option>
                                            {uniquePaymentMethods.map(method => (
                                                <option key={method} value={method}>{method}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Governorate */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">المحافظة</label>
                                        <select 
                                            name="governorate" 
                                            value={filters.governorate} 
                                            onChange={handleFilterChange} 
                                            className={inputClass}
                                        >
                                            <option value="">الكل</option>
                                            {Object.keys(EGYPT_GOVERNORATES_DATA).map(gov => (
                                                <option key={gov} value={gov}>{gov}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">المدينة</label>
                                        <select 
                                            name="city" 
                                            value={filters.city} 
                                            onChange={handleFilterChange} 
                                            className={inputClass}
                                            disabled={!filters.governorate}
                                        >
                                            <option value="">الكل</option>
                                            {availableCities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Order Type */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">نوع الطلب</label>
                                        <select 
                                            name="orderType" 
                                            value={filters.orderType} 
                                            onChange={handleFilterChange} 
                                            className={inputClass}
                                        >
                                            <option value="">الكل</option>
                                            <option value="digital">طلبات رقمية فقط</option>
                                            <option value="physical">طلبات مادية</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        onClick={resetFilters}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-medium"
                                    >
                                        <CloseIcon className="w-4 h-4" />
                                        مسح الفلاتر
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-600 dark:text-gray-400">جاري تحميل الطلبات...</span>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <SortableHeader sortKey="displayOrderId">رقم الطلب</SortableHeader>
                                    <SortableHeader sortKey="customerDetails.name">العميل</SortableHeader>
                                    <SortableHeader sortKey="createdAt">التاريخ</SortableHeader>
                                    <SortableHeader sortKey="totalAmount">الإجمالي</SortableHeader>
                                    <SortableHeader sortKey="status">الحالة</SortableHeader>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {sortedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                                    <SearchIcon className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-lg font-medium mb-2">لا توجد طلبات</p>
                                                <p className="text-sm">لم يتم العثور على طلبات تطابق معايير البحث.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    sortedOrders.map(order => {
                                        const orderDate = order.createdAt;
                                        const needsAttention = order.status === 'pending_payment_confirmation';
                                        const statusInfo = getStatusDisplayInfo(order.status);
                                        const textColorClass = (statusInfo.colorClass.match(/(text-\S+)/) || [''])[0];
                                        const darkTextColorClass = (statusInfo.colorClass.match(/(dark:text-\S+)/) || [''])[0];
                                        
                                        return (
                                            <tr 
                                                key={order.id} 
                                                className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                                    needsAttention ? 'bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400' : ''
                                                }`}
                                            >
                                                <td className="px-4 py-4 text-right">
                                                    <div className="font-bold text-gray-900 dark:text-white text-lg">
                                                        #{order.displayOrderId}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="font-semibold text-gray-900 dark:text-white">
                                                        {order.customerDetails?.name}
                                                    </div>
                                                    {order.customerDetails?.phone && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            {order.customerDetails.phone}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="text-gray-900 dark:text-white font-medium">
                                                        {orderDate ? orderDate.toLocaleDateString('ar-EG') : 'غير متوفر'}
                                                    </div>
                                                    {orderDate && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {orderDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="font-bold text-primary text-lg">
                                                        {order.totalAmount?.toFixed(2)} ج.م
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex items-center gap-3 justify-start">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                                                            className={`px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-300 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 ${textColorClass} ${darkTextColorClass}`}
                                                        >
                                                            {allStatuses.map(statusKey => (
                                                                <option 
                                                                    key={statusKey} 
                                                                    value={statusKey}
                                                                    className="text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                                                                >
                                                                    {getStatusDisplayInfo(statusKey).text}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {needsAttention && (
                                                            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-lg text-xs font-medium">
                                                                <ExclamationTriangleIcon className="w-3 h-3" />
                                                                يحتاج تأكيد
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2 justify-start">
                                                        <button 
                                                            onClick={() => handleViewDetails(order)}
                                                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium text-sm"
                                                        >
                                                            عرض التفاصيل
                                                        </button>
                                                        <button 
                                                            onClick={() => onDeleteOrder(order.id, order.displayOrderId)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                                                            title="حذف الطلب"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {isModalOpen && (
                <OrderDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    order={selectedOrder}
                    onShippingUpdate={handleOrderShippingUpdate}
                    onOrderNoteAdd={handleOrderNoteAdd}
                />
            )}
        </div>
    );
};

export { OrderManagementPanel };