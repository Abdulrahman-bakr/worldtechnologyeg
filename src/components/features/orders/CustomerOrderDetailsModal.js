import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CloseIcon, 
    CalendarDaysIcon, // Use CalendarDaysIcon instead of CalendarIcon
    ArchiveBoxIcon,   // Use ArchiveBoxIcon instead of PackageIcon
    TruckIcon, 
    CheckIcon,        // Use CheckIcon instead of CheckCircleIcon
    ClockIcon, 
    InfoIcon 
} from '../../icons/index.js';
import { getStatusDisplayInfo } from './ordersUtils.js';

const CustomerOrderDetailsModal = ({ isOpen, onClose, order }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const getJsDate = (timestamp) => {
        if (!timestamp) return null;
        if (typeof timestamp.toDate === 'function') return timestamp.toDate();
        if (timestamp instanceof Date) return timestamp;
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? null : date;
    };

    const orderDateObj = getJsDate(order?.createdAt);
    const orderDate = orderDateObj ? orderDateObj.toLocaleDateString('ar-EG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
    }) : 'غير متوفر';

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return ClockIcon;
            case 'confirmed': return CheckIcon;        // Changed to CheckIcon
            case 'shipped': return TruckIcon;
            case 'delivered': return ArchiveBoxIcon;  // Changed to ArchiveBoxIcon
            default: return InfoIcon;
        }
    };

    const calculateTotal = () => {
        return order?.items?.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0) || 0;
    };

    const totalAmount = calculateTotal();

    return (
        <AnimatePresence>
            {isOpen && order && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Enhanced Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={onClose}
                    />
                    
                    {/* Main Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ 
                            type: "spring", 
                            damping: 25, 
                            stiffness: 300,
                            duration: 0.3
                        }}
                        className="relative bg-white dark:bg-dark-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col border border-white/20 dark:border-dark-600/30 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Enhanced Header */}
                        <div className="relative bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 p-6 border-b border-light-200/50 dark:border-dark-600/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
                                        <ArchiveBoxIcon className="w-6 h-6 text-white" /> {/* Changed to ArchiveBoxIcon */}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-dark-900 dark:text-white">
                                            الطلب #{order.displayOrderId}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <CalendarDaysIcon className="w-4 h-4 text-dark-600 dark:text-dark-400" /> {/* Changed to CalendarDaysIcon */}
                                            <p className="text-sm text-dark-600 dark:text-dark-200">{orderDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-2 bg-white/80 dark:bg-dark-700/80 backdrop-blur-sm rounded-xl text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white border border-light-300 dark:border-dark-600 transition-all"
                                    aria-label="إغلاق"
                                >
                                    <CloseIcon className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {/* Order Summary Card */}
                            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-dark-700 dark:to-dark-700 rounded-2xl p-5 border border-primary/10 dark:border-dark-600">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-light-200 dark:border-dark-600">
                                        <p className="text-sm text-dark-600 dark:text-dark-200 mb-1">عدد المنتجات</p>
                                        <p className="text-2xl font-bold text-primary">{order.items.length}</p>
                                    </div>
                                    <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-light-200 dark:border-dark-600">
                                        <p className="text-sm text-dark-600 dark:text-dark-200 mb-1">المبلغ الإجمالي</p>
                                        <p className="text-2xl font-bold text-secondary">{totalAmount.toFixed(2)} ج.م</p>
                                    </div>
                                    <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-light-200 dark:border-dark-600">
                                        <p className="text-sm text-dark-600 dark:text-dark-200 mb-1">الحالة الحالية</p>
                                        {(() => {
                                            const currentStatus = order.statusHistory?.[order.statusHistory.length - 1]?.status || order.status;
                                            const statusInfo = getStatusDisplayInfo(currentStatus);
                                            const StatusIcon = getStatusIcon(currentStatus);
                                            return (
                                                <div className="flex items-center justify-center gap-2">
                                                    <StatusIcon className={`w-5 h-5 ${statusInfo.colorClass.replace('text-', 'text-')}`} />
                                                    <span className={`font-semibold ${statusInfo.colorClass}`}>{statusInfo.text}</span>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items Section */}
                            <div className="bg-white dark:bg-dark-700 rounded-2xl p-6 border border-light-200 dark:border-dark-600 shadow-soft">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl">
                                        <ArchiveBoxIcon className="w-5 h-5 text-primary" /> {/* Changed to ArchiveBoxIcon */}
                                    </div>
                                    <h3 className="text-lg font-bold text-dark-800 dark:text-dark-100">محتويات الطلب</h3>
                                </div>
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-4 p-4 bg-light-50 dark:bg-dark-600 rounded-xl border border-light-200 dark:border-dark-500 hover:shadow-md transition-all"
                                        >
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.name}
                                                className="w-20 h-20 object-contain rounded-lg bg-white dark:bg-dark-700 p-2 flex-shrink-0 border border-light-200 dark:border-dark-600"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-semibold text-dark-800 dark:text-dark-100 text-base leading-relaxed">{item.name}</h4>
                                                    <p className="text-lg font-bold text-primary text-left whitespace-nowrap">{item.price.toFixed(2)} ج.م</p>
                                                </div>
                                                
                                                {item.serviceDetails && Array.isArray(item.serviceDetails.formData) && item.serviceDetails.formData.length > 0 ? (
                                                    <div className="mt-3 space-y-2">
                                                        {item.serviceDetails.formData.map((field, fieldIndex) => (
                                                            <div key={field.id || fieldIndex} className="flex items-start gap-2 text-sm">
                                                                <span className="font-semibold text-dark-700 dark:text-dark-300 bg-light-100 dark:bg-dark-500 px-2 py-1 rounded-md min-w-24 flex-shrink-0">
                                                                    {field.label}:
                                                                </span>
                                                                <span className="text-dark-600 dark:text-dark-100 bg-white dark:bg-dark-700 px-3 py-1 rounded-md flex-1 break-words">
                                                                    {field.value}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-dark-600 dark:text-dark-200 bg-light-100 dark:bg-dark-500 px-3 py-1 rounded-md inline-block">
                                                        الكمية: {item.quantity || 1}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Status History Section */}
                            <div className="bg-white dark:bg-dark-700 rounded-2xl p-6 border border-light-200 dark:border-dark-600 shadow-soft">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-xl">
                                        <ClockIcon className="w-5 h-5 text-secondary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-dark-800 dark:text-dark-100">سجل حالة الطلب</h3>
                                </div>
                                <div className="space-y-4">
                                    {(order.statusHistory || [])
                                        .sort((a, b) => (getJsDate(b.timestamp)?.getTime() || 0) - (getJsDate(a.timestamp)?.getTime() || 0))
                                        .map((historyItem, index) => {
                                            const statusInfo = getStatusDisplayInfo(historyItem.status);
                                            const StatusIcon = getStatusIcon(historyItem.status);
                                            const historyDate = getJsDate(historyItem.timestamp)?.toLocaleString('ar-EG', { 
                                                dateStyle: 'short', 
                                                timeStyle: 'short' 
                                            }) || '...';
                                            
                                            return (
                                                <motion.div 
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-start gap-4 p-4 bg-light-50 dark:bg-dark-600 rounded-xl border border-light-200 dark:border-dark-500"
                                                >
                                                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${statusInfo.colorClass.replace('text-', 'bg-')} bg-opacity-20 flex-shrink-0`}>
                                                        <StatusIcon className={`w-5 h-5 ${statusInfo.colorClass}`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusInfo.colorClass} bg-opacity-20`}>
                                                                {statusInfo.text}
                                                            </span>
                                                            <span className="text-xs text-dark-600 dark:text-dark-200 bg-white dark:bg-dark-700 px-2 py-1 rounded-md">
                                                                {historyDate}
                                                            </span>
                                                        </div>
                                                        {historyItem.notes && (
                                                            <div className="mt-2 pt-2 border-t border-light-200 dark:border-dark-500">
                                                                <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed whitespace-pre-wrap">
                                                                    {historyItem.notes}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Footer */}
                        <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm border-t border-light-200 dark:border-dark-600 p-6">
                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="flex-1 bg-light-200 dark:bg-dark-600 hover:bg-light-300 dark:hover:bg-dark-500 text-dark-800 dark:text-dark-100 font-semibold py-3.5 rounded-xl transition-all duration-200 border border-light-300 dark:border-dark-500"
                                >
                                    إغلاق التفاصيل
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg"
                                >
                                    التواصل بالدعم
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { CustomerOrderDetailsModal };