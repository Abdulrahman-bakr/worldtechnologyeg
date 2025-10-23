import React, { useState, useMemo } from 'react';
import { OrderDetailsModal } from './OrderDetailsModal.js';
import { getStatusDisplayInfo } from '../orders/ordersUtils.js';
import { EGYPT_GOVERNORATES_DATA } from '../../../constants/governorates.js';
import { ExclamationTriangleIcon, TrashIcon } from '../../icons/index.js';

const allStatuses = [
    "pending_payment_confirmation", "processing", "failed_payment",
    "pending_fulfillment", "pending_delivery", "shipped",
    "delivered", "cancelled"
];

const OrderManagementPanel = ({ orders, isLoading, handleOrderStatusUpdate, handleOrderShippingUpdate, handleOrderDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };
    
    const onDeleteOrder = (orderId, displayOrderId) => {
        if (window.confirm(`هل أنت متأكد من حذف الطلب ${displayOrderId}؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
            handleOrderDelete(orderId);
        }
    };

    const inputClass = "w-full p-2 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm";

    return React.createElement("div", null,
        React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6" }, "إدارة الطلبات"),
        
        // Search & Quick Filters
        React.createElement("div", { className: "flex flex-col sm:flex-row gap-4 mb-4" },
            React.createElement("input", { 
                type: "text", 
                placeholder: "ابحث برقم الطلب أو اسم العميل...", 
                value: searchTerm, 
                onChange: e => setSearchTerm(e.target.value), 
                className: `${inputClass} max-w-sm`
            }),
            React.createElement("div", { className: "flex flex-wrap gap-2" },
                React.createElement("button", { onClick: () => setDateFilter(1), className: "admin-btn text-sm bg-light-200 dark:bg-dark-600" }, "طلبات اليوم"),
                React.createElement("button", { onClick: () => setDateFilter(7), className: "admin-btn text-sm bg-light-200 dark:bg-dark-600" }, "طلبات آخر 7 أيام")
            )
        ),
        
        // Filters Section
        React.createElement("div", { className: "p-4 bg-light-100 dark:bg-dark-700 rounded-lg mb-6 border border-light-200 dark:border-dark-600" },
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
                // Date From
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium mb-1" }, "من تاريخ"),
                    React.createElement("input", { type: "date", name: "dateFrom", value: filters.dateFrom, onChange: handleFilterChange, className: inputClass })
                ),
                // Date To
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium mb-1" }, "إلى تاريخ"),
                    React.createElement("input", { type: "date", name: "dateTo", value: filters.dateTo, onChange: handleFilterChange, className: inputClass })
                ),
                // Payment Method
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium mb-1" }, "طريقة الدفع"),
                    React.createElement("select", { name: "paymentMethod", value: filters.paymentMethod, onChange: handleFilterChange, className: inputClass },
                        React.createElement("option", { value: "" }, "الكل"),
                        uniquePaymentMethods.map(method => React.createElement("option", { key: method, value: method }, method))
                    )
                ),
                // Governorate
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium mb-1" }, "المحافظة"),
                    React.createElement("select", { name: "governorate", value: filters.governorate, onChange: handleFilterChange, className: inputClass },
                        React.createElement("option", { value: "" }, "الكل"),
                        Object.keys(EGYPT_GOVERNORATES_DATA).map(gov => React.createElement("option", { key: gov, value: gov }, gov))
                    )
                ),
                // City
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium mb-1" }, "المدينة"),
                    React.createElement("select", { name: "city", value: filters.city, onChange: handleFilterChange, className: inputClass, disabled: !filters.governorate },
                        React.createElement("option", { value: "" }, "الكل"),
                        availableCities.map(city => React.createElement("option", { key: city, value: city }, city))
                    )
                ),
                 React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium mb-1" }, "نوع الطلب"),
                    React.createElement("select", { name: "orderType", value: filters.orderType, onChange: handleFilterChange, className: inputClass },
                        React.createElement("option", { value: "" }, "الكل"),
                        React.createElement("option", { value: "digital" }, "طلبات رقمية فقط"),
                        React.createElement("option", { value: "physical" }, "طلبات مادية")
                    )
                ),
                 React.createElement("div", { className: "flex items-end col-span-full md:col-span-2 lg:col-span-2" },
                    React.createElement("button", { onClick: resetFilters, className: "w-full admin-btn bg-gray-200 dark:bg-dark-600" }, "مسح الفلاتر")
                )
            )
        ),

        isLoading
            ? React.createElement("p", null, "جاري تحميل الطلبات...")
            : React.createElement("div", { className: "admin-table-container" },
                React.createElement("table", { className: "admin-table" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "رقم الطلب"),
                            React.createElement("th", null, "العميل"),
                            React.createElement("th", null, "التاريخ"),
                            React.createElement("th", null, "الإجمالي"),
                            React.createElement("th", null, "الحالة"),
                            React.createElement("th", null, "إجراءات")
                        )
                    ),
                    React.createElement("tbody", null,
                        filteredOrders.length === 0 
                        ? React.createElement("tr", null, React.createElement("td", { colSpan: "6", className: "text-center py-8 text-dark-600" }, "لا توجد طلبات تطابق معايير البحث."))
                        : filteredOrders.map(order => {
                            const orderDate = order.createdAt; // Already a Date object from useAdminData
                            const needsAttention = order.status === 'pending_payment_confirmation';
                            const statusInfo = getStatusDisplayInfo(order.status);
                            const textColorClass = (statusInfo.colorClass.match(/(text-\S+)/) || [''])[0];
                            const darkTextColorClass = (statusInfo.colorClass.match(/(dark:text-\S+)/) || [''])[0];
                            
                            return React.createElement("tr", { key: order.id, className: needsAttention ? 'bg-yellow-500/10' : '' },
                                React.createElement("td", { className: "font-semibold" }, order.displayOrderId),
                                React.createElement("td", null, order.customerDetails?.name),
                                React.createElement("td", null, orderDate ? orderDate.toLocaleDateString('ar-EG') : 'غير متوفر'),
                                React.createElement("td", null, `${order.totalAmount?.toFixed(2)} ج.م`),
                                React.createElement("td", null, 
                                    React.createElement("div", { className: "flex items-center gap-2" },
                                        React.createElement("select", {
                                            value: order.status,
                                            onChange: (e) => handleOrderStatusUpdate(order.id, e.target.value),
                                            className: `p-1 rounded-md border text-xs bg-white dark:bg-dark-700 border-light-300 dark:border-dark-600 ${textColorClass} ${darkTextColorClass} font-semibold`
                                        },
                                            allStatuses.map(statusKey =>
                                                React.createElement("option", { key: statusKey, value: statusKey, className: "text-dark-900 dark:text-dark-50 bg-white dark:bg-dark-700" }, getStatusDisplayInfo(statusKey).text)
                                            )
                                        ),
                                        needsAttention && React.createElement(ExclamationTriangleIcon, { className: "w-5 h-5 text-yellow-500", title: "يحتاج تأكيد دفع" })
                                    )
                                ),
                                React.createElement("td", { className: "space-x-1 space-x-reverse" },
                                    React.createElement("button", { onClick: () => handleViewDetails(order), className: "text-sm text-primary hover:underline" }, "عرض التفاصيل"),
                                    React.createElement("button", { 
                                        onClick: () => onDeleteOrder(order.id, order.displayOrderId), 
                                        className: "p-2 text-dark-600 hover:text-red-500",
                                        title: "حذف الطلب"
                                    }, React.createElement(TrashIcon, { className: "w-5 h-5" }))
                                )
                            );
                        })
                    )
                )
            ),
        isModalOpen && React.createElement(OrderDetailsModal, {
            isOpen: isModalOpen,
            onClose: () => setIsModalOpen(false),
            order: selectedOrder,
            onShippingUpdate: handleOrderShippingUpdate
        })
    );
};

export { OrderManagementPanel };