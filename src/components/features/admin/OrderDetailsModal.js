import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon } from '../../icons/index.js';
import { useApp } from '../../../contexts/AppContext.js';
import { getStatusDisplayInfo } from '../orders/ordersUtils.js';

const OrderDetailsModal = ({ isOpen, onClose, order, onShippingUpdate, onOrderNoteAdd }) => {
    const { setToastMessage } = useApp();
    const [shippingCompany, setShippingCompany] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [note, setNote] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);

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
    
    useEffect(() => {
        if (order) {
            setShippingCompany(order.shippingDetails?.company || '');
            setTrackingNumber(order.shippingDetails?.trackingNumber || '');
            setNote('');
        }
    }, [order]);

    const handleSaveShipping = () => {
        if (!shippingCompany || !trackingNumber) {
            setToastMessage({ text: "يرجى إدخال شركة الشحن ورقم التتبع.", type: 'error' });
            return;
        }
        if (onShippingUpdate) {
            onShippingUpdate(order.id, { company: shippingCompany, trackingNumber: trackingNumber });
        }
    };

    const handleAddNote = async () => {
        if (!note.trim()) {
            setToastMessage({ text: "الملاحظة لا يمكن أن تكون فارغة.", type: 'error'});
            return;
        }
        setIsAddingNote(true);
        const result = await onOrderNoteAdd(order.id, note);
        if (result.success) {
            setNote('');
            setToastMessage({ text: 'تمت إضافة الملاحظة بنجاح.', type: 'success'});
        } else {
            setToastMessage({ text: result.error || 'فشل إضافة الملاحظة.', type: 'error' });
        }
        setIsAddingNote(false);
    };

    const getJsDate = (timestamp) => {
        if (!timestamp) return null;
        if (typeof timestamp.toDate === 'function') return timestamp.toDate();
        if (timestamp instanceof Date) return timestamp;
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? null : date;
    };

    // Enhanced input styling
    const inputClass = "w-full p-3.5 rounded-xl border-2 border-gray-200/80 dark:border-gray-600/80 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 shadow-lg backdrop-blur-sm transition-all duration-300 text-sm sm:text-base placeholder-gray-500/70 dark:placeholder-gray-400/70";

    // Enhanced button styling
    const buttonClass = "w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base";

    const orderDateObj = getJsDate(order?.createdAt);
    const orderDate = orderDateObj ? orderDateObj.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'غير متوفر';

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
                    {/* Enhanced Overlay with better blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/20 to-black/80 backdrop-blur-xl"
                        onClick={onClose}
                    />
                    
                    {/* Enhanced Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ 
                            type: "spring", 
                            damping: 25, 
                            stiffness: 300,
                            duration: 0.4
                        }}
                        className="relative bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 rounded-3xl shadow-2xl w-full max-w-full sm:max-w-4xl h-[95vh] sm:h-[95vh] flex flex-col backdrop-blur-xl border border-white/30 dark:border-gray-700/30 mx-2 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Enhanced Header with better gradient */}
                        <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-6 border-b border-white/30 dark:border-gray-700/30 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/30">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                            الطلب #{order.displayOrderId}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{orderDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-3 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-600 transition-all shadow-sm"
                                    aria-label="إغلاق"
                                >
                                    <CloseIcon className="w-6 h-6" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Enhanced Scrollable Content */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {/* Customer & Payment Grid - Enhanced */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Customer Card - Enhanced */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white dark:bg-gray-700 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-600/80 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">بيانات العميل</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-600/50 rounded-xl">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">الاسم:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{order.customerDetails.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-600/50 rounded-xl">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">الهاتف:</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200 dir-ltr ltr">{order.customerDetails.phone || 'غير متوفر'}</span>
                                        </div>
                                        {order.customerDetails.address && (
                                            <div className="p-3 bg-gray-50 dark:bg-gray-600/50 rounded-xl">
                                                <span className="font-medium text-gray-600 dark:text-gray-300 block mb-2">العنوان:</span>
                                                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                                                    {order.customerDetails.address}, {order.customerDetails.city}, {order.customerDetails.governorate}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Payment Card - Enhanced */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white dark:bg-gray-700 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-600/80 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">ملخص الدفع</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-2">
                                            <span className="text-gray-600 dark:text-gray-300">المجموع الفرعي:</span>
                                            <span className="font-semibold tabular-nums">{order.subtotal?.toFixed(2) || 'N/A'} ج.م</span>
                                        </div>
                                        {order.couponDiscount > 0 && (
                                            <div className="flex justify-between items-center p-2 text-green-600 dark:text-green-400">
                                                <span>خصم الكوبون ({order.couponCode}):</span>
                                                <span className="font-semibold tabular-nums">-{order.couponDiscount.toFixed(2)} ج.م</span>
                                            </div>
                                        )}
                                        {order.tierDiscount > 0 && (
                                            <div className="flex justify-between items-center p-2 text-green-600 dark:text-green-400">
                                                <span>خصم المستوى:</span>
                                                <span className="font-semibold tabular-nums">-{order.tierDiscount.toFixed(2)} ج.م</span>
                                            </div>
                                        )}
                                        {order.pointsDiscount > 0 && (
                                            <div className="flex justify-between items-center p-2 text-green-600 dark:text-green-400">
                                                <span>خصم النقاط ({order.pointsRedeemed} نقطة):</span>
                                                <span className="font-semibold tabular-nums">-{order.pointsDiscount.toFixed(2)} ج.م</span>
                                            </div>
                                        )}
                                        <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-2">
                                            <div className="flex justify-between items-center p-2">
                                                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">الإجمالي:</span>
                                                <span className="font-bold text-primary text-xl tabular-nums">{order.totalAmount.toFixed(2)} ج.م</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-2 mt-2">
                                            <span className="text-gray-600 dark:text-gray-300">طريقة الدفع:</span>
                                            <span className="font-semibold">{order.paymentDetails.method}</span>
                                        </div>
                                        {order.paymentDetails.transactionInfo && (
                                            <div className="p-3 bg-gray-50 dark:bg-gray-600/50 rounded-xl mt-3">
                                                <span className="font-semibold text-gray-600 dark:text-gray-300 block mb-2">معلومات التحويل:</span>
                                                <p className="text-gray-700 dark:text-gray-200 break-all bg-white dark:bg-gray-700 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                                    {order.paymentDetails.transactionInfo}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Order Items - Enhanced with better responsive design */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white dark:bg-gray-700 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-600/80 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">محتويات الطلب</h3>
                                </div>
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gray-50 dark:bg-gray-600/50 rounded-xl border border-gray-200/50 dark:border-gray-500/50 hover:bg-white dark:hover:bg-gray-600 transition-all duration-300"
                                        >
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.name}
                                                className="w-full sm:w-16 h-16 object-contain rounded-xl bg-white dark:bg-gray-700 p-2 shadow-sm border border-gray-200 dark:border-gray-600 flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0 w-full">
                                                {/* Enhanced header with better responsive behavior */}
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg leading-relaxed break-words flex-1">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-lg font-bold text-primary whitespace-nowrap flex-shrink-0 sm:text-right">
                                                        {item.price.toFixed(2)} ج.م
                                                    </p>
                                                </div>
                                                
                                                {item.serviceDetails && Array.isArray(item.serviceDetails.formData) && item.serviceDetails.formData.length > 0 ? (
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {item.serviceDetails.formData.map((field, fieldIndex) => (
                                                                <div key={field.id || fieldIndex} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                                                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm min-w-20">
                                                                        {field.label}:
                                                                    </span>
                                                                    <span className="text-gray-600 dark:text-gray-400 text-sm break-words flex-1">
                                                                        {field.value}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t border-gray-200 dark:border-gray-600 gap-2">
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">الكمية: {item.quantity}</span>
                                                            <span className="font-bold text-primary">المجموع: {(item.price * item.quantity).toFixed(2)} ج.م</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 gap-2">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">الكمية: {item.quantity}</span>
                                                        <span className="font-bold text-primary">المجموع: {(item.price * item.quantity).toFixed(2)} ج.م</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Order Status Timeline - Fixed timeline dots */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white dark:bg-gray-700 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-600/80 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                                        <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">سجل حالة الطلب</h3>
                                </div>
                                <div className="space-y-4 relative">
                                    {/* Timeline line - Fixed positioning */}
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-secondary/30 z-0"></div>
                                    
                                    {(order.statusHistory || [])
                                        .sort((a, b) => {
                                            const timeB = getJsDate(b.timestamp)?.getTime() || 0;
                                            const timeA = getJsDate(a.timestamp)?.getTime() || 0;
                                            return timeB - timeA;
                                        })
                                        .map((historyItem, index) => {
                                            const historyStatusInfo = getStatusDisplayInfo(historyItem.status);
                                            const historyDateObj = getJsDate(historyItem.timestamp);
                                            const historyDate = historyDateObj ? historyDateObj.toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }) : '...';
                                            
                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.6 + index * 0.1 }}
                                                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-600/50 rounded-xl border border-gray-200/50 dark:border-gray-500/50 relative z-10 hover:bg-white dark:hover:bg-gray-600 transition-all duration-300"
                                                >
                                                    {/* Fixed timeline dot - Better positioning */}
                                                    <div className="absolute left-0 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-gray-700 border-2 border-primary shadow-sm z-20"></div>
                                                    
                                                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${historyStatusInfo.colorClass} text-white shadow-lg flex-shrink-0 ml-2`}>
                                                        <span className="text-lg">{historyStatusInfo.icon}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                                                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{historyStatusInfo.text}</h4>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 flex-shrink-0">
                                                                {historyDate}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                                            بواسطة: {historyItem.updatedBy}
                                                        </p>
                                                        {historyItem.notes && (
                                                            <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border-l-4 border-primary">
                                                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                                                                    {historyItem.notes}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                </div>
                            </motion.div>

                            {/* Add Note Section - Enhanced */}
                            {onOrderNoteAdd && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="bg-white dark:bg-gray-700 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-600/80 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
                                            <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">إضافة ملاحظة للعميل</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <textarea 
                                            value={note} 
                                            onChange={e => setNote(e.target.value)}
                                            className={`${inputClass} min-h-[120px] resize-none`}
                                            placeholder="اكتب ملاحظة هنا (مثال: كود الشحن، تحديث عن الطلب...)"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleAddNote}
                                            disabled={isAddingNote}
                                            className={buttonClass}
                                        >
                                            {isAddingNote ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                    جاري الإضافة...
                                                </div>
                                            ) : (
                                                'إضافة ملاحظة'
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Shipping Section - Enhanced */}
                            {onShippingUpdate && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="bg-white dark:bg-gray-700 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-600/80 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h1m8-2l2-2v10a1 1 0 01-1 1h-2.5" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">بيانات الشحن والتتبع</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">شركة الشحن</label>
                                            <input 
                                                value={shippingCompany} 
                                                onChange={e => setShippingCompany(e.target.value)}
                                                className={inputClass}
                                                placeholder="مثال: Bosta"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">رقم التتبع</label>
                                            <input 
                                                value={trackingNumber} 
                                                onChange={e => setTrackingNumber(e.target.value)}
                                                className={inputClass}
                                                placeholder="مثال: 123456789"
                                            />
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSaveShipping}
                                            className={buttonClass}
                                        >
                                            حفظ بيانات الشحن
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Enhanced Footer */}
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    إغلاق
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { OrderDetailsModal };