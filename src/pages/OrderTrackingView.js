import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { StaticPageView } from './Static-Pages/StaticPageView.js';
import { db } from '../services/firebase/config.js';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { getStatusDisplayInfo } from '../components/features/orders/ordersUtils.js';
import { useNavigate } from 'react-router-dom';

const OrderTrackingView = () => {
    const [orderId, setOrderId] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderResult, setOrderResult] = useState(null);
    const navigate = useNavigate();

    const handleTrackOrder = async (e) => {
        e.preventDefault();
        setError(null);
        setOrderResult(null);
        if (!orderId.trim() || !phone.trim()) {
            setError("يرجى إدخال رقم الطلب ورقم الهاتف.");
            return;
        }
        setIsLoading(true);

        try {
            const ordersRef = collection(db, "orders");
            // Step 1: Query by Order ID first.
            const q = query(
                ordersRef,
                where("displayOrderId", "==", orderId.trim()),
                limit(1)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError("لم يتم العثور على طلب مطابق لرقم الطلب المدخل. يرجى التأكد من الرقم والمحاولة مرة أخرى.");
            } else {
                const orderDoc = querySnapshot.docs[0];
                const orderData = orderDoc.data();
                const userPhoneInput = phone.trim();

                // Step 2: Verify the phone number against multiple fields in the found order.
                const phoneInOrder = orderData.customerDetails?.phone;
                const altPhoneInOrder = orderData.customerDetails?.altPhone;
                
                let userAccountPhone = null;
                if (orderData.userId) {
                    try {
                        const userDocRef = doc(db, "users", orderData.userId);
                        const userDocSnap = await getDoc(userDocRef);
                        if (userDocSnap.exists()) {
                            userAccountPhone = userDocSnap.data().phone;
                        }
                    } catch (userFetchError) {
                        console.error("Could not fetch user data for phone verification:", userFetchError);
                        // Non-fatal error, continue without the account phone.
                    }
                }
                
                // Check if input phone matches any of the potential numbers.
                if (phoneInOrder === userPhoneInput || altPhoneInOrder === userPhoneInput || (userAccountPhone && userAccountPhone === userPhoneInput)) {
                    setOrderResult({
                        id: orderDoc.id,
                        ...orderData,
                        createdAt: orderData.createdAt, // Keep as Timestamp for now, will be processed in OrderResult
                    });
                } else {
                    setError("رقم الهاتف لا يتطابق مع الطلب. يرجى استخدام رقم الهاتف المرتبط بالطلب (سواء رقم الحساب أو الرقم المستخدم في تفاصيل الشحن/الخدمة).");
                }
            }
        } catch (err) {
            console.error("Error tracking order:", err);
            setError("حدث خطأ أثناء البحث عن طلبك. يرجى المحاولة مرة أخرى لاحقًا.");
        } finally {
            setIsLoading(false);
        }
    };

    const OrderResult = () => {
        if (!orderResult) return null;

        // Helper to safely convert Firestore Timestamps or JS Dates to a JS Date object
        const getJsDate = (timestamp) => {
            if (!timestamp) return null;
            if (typeof timestamp.toDate === 'function') { // Firestore Timestamp
                return timestamp.toDate();
            }
            if (timestamp instanceof Date) { // JS Date
                return timestamp;
            }
            // As a fallback for other potential formats (like string from old data)
            const date = new Date(timestamp);
            return isNaN(date.getTime()) ? null : date;
        };
        
        const statusInfo = getStatusDisplayInfo(orderResult.status);
        const orderDateObj = getJsDate(orderResult.createdAt);
        const orderDate = orderDateObj ? orderDateObj.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'تاريخ غير متوفر';

        const orderSummary = orderResult.items && orderResult.items.length > 0
            ? orderResult.items.map(item => `${item.name}${item.quantity > 1 ? ` (×${item.quantity})` : ''}`).join(', ')
            : 'لا توجد محتويات';

        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mt-8 p-8 bg-white/80 dark:bg-gray-800/80 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-sm"
            >
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-6 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-4 mb-4 lg:mb-0">
                        <div className="bg-gradient-to-br from-primary/20 to-blue-500/20 p-3 rounded-2xl">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                طلب رقم: #{orderResult.displayOrderId}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">{orderDate}</p>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl font-semibold text-sm bg-gradient-to-r ${statusInfo.colorClass} text-white shadow-lg`}>
                        {statusInfo.icon} {statusInfo.text}
                    </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-700/50 dark:to-blue-900/20 rounded-2xl">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">معلومات الطلب</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">الإجمالي:</span>
                                    <span className="font-bold text-primary text-lg">
                                        {(orderResult.totalAmount || 0).toFixed(2)} ج.م
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">طريقة الدفع:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                        {orderResult.paymentDetails?.method || 'غير محدد'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50/30 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            محتويات الطلب
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {orderSummary}
                        </p>
                    </div>
                </div>

                {/* Order Timeline */}
                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-3">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        سجل تحديثات الطلب
                    </h4>
                    
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-blue-500 transform -translate-x-1/2"></div>
                        
                        <div className="space-y-8">
                            {(orderResult.statusHistory || [])
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
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="relative flex items-center"
                                        >
                                            {/* Timeline dot */}
                                            <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-gray-800 shadow-lg transform -translate-x-1/2 z-10 ${historyStatusInfo.colorClass.replace('bg-', 'bg-')}`}></div>
                                            
                                            {/* Content */}
                                            <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8">
                                                <div className="bg-white dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 shadow-lg backdrop-blur-sm">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="text-2xl">{historyStatusInfo.icon}</span>
                                                        <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                            {historyStatusInfo.text}
                                                        </h5>
                                                    </div>
                                                    <time className="block text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">
                                                        {historyDate}
                                                    </time>
                                                    {historyItem.notes && (
                                                        <motion.p
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            className="text-sm text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-600/30 rounded-xl border-r-4 border-primary leading-relaxed"
                                                        >
                                                            {historyItem.notes}
                                                        </motion.p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <StaticPageView title="تتبع طلبك" onBack={() => navigate(-1)}>
            <Helmet>
                <title>تتبع طلبك - World Technology</title>
                <meta name="description" content="تتبع حالة طلبك في World Technology باستخدام رقم الطلب ورقم الهاتف" />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="bg-gradient-to-br from-primary/20 to-blue-500/20 p-6 rounded-3xl inline-block mb-6 shadow-2xl">
                        <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
                        تتبع طلبك
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                        أدخل رقم الطلب ورقم الهاتف الذي استخدمته في الطلب لمتابعة حالته وتفاصيل التحديثات
                    </p>
                </motion.div>

                {/* Search Form */}
                <motion.form
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onSubmit={handleTrackOrder}
                    className="max-w-2xl mx-auto space-y-6 mb-12"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="orderId" className="block text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
                                رقم الطلب
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.02 }}
                                type="text"
                                id="orderId"
                                value={orderId}
                                onChange={e => setOrderId(e.target.value)}
                                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg backdrop-blur-sm transition-all duration-300"
                                placeholder="مثال: 171091631"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
                                رقم الهاتف
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.02 }}
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg backdrop-blur-sm transition-all duration-300"
                                placeholder="01xxxxxxxxx"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-2xl shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-3">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                                />
                                جاري البحث عن طلبك...
                            </div>
                        ) : (
                            'تتبع الطلب'
                        )}
                    </motion.button>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center shadow-lg"
                        >
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-600 dark:text-red-400 font-semibold text-lg">{error}</span>
                            </div>
                        </motion.div>
                    )}
                </motion.form>

                {/* Order Result */}
                <OrderResult />
            </motion.div>
        </StaticPageView>
    );
};

export { OrderTrackingView };