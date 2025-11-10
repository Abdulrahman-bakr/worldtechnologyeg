// src/components/features/orders/OrderCard.js

import React from 'react';
import { motion } from 'framer-motion';
import { getOrderSummary } from './ordersUtils.js';
import { OrderStatusBadge } from './OrderStatusBadge.js';
import { generateWhatsAppMessage } from '../../../utils/checkoutUtils.js';
import { WhatsAppIcon, ChatBubbleBottomCenterTextIcon } from '../../icons/index.js';

const OrderCard = ({ order, onViewDetails }) => {
    const orderDate = order.createdAt || order.clientCreatedAt;

    const formattedDate = orderDate instanceof Date && !isNaN(orderDate)
        ? orderDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'جاري تحديد الوقت...';

    const hasDiscount = (order.tierDiscount > 0 || order.pointsDiscount > 0 || order.couponDiscount > 0);
    const originalTotal = order.subtotal || (order.totalAmount + (order.tierDiscount || 0) + (order.pointsDiscount || 0) + (order.couponDiscount || 0));

    const requiresConfirmation = order.requiresWhatsappConfirmation !== false; // Default to true for older orders without this flag
    const isActionable = requiresConfirmation && !['shipped', 'delivered', 'cancelled'].includes(order.status);
    
    // Find the most recent note in the history
    const latestNote = (order.statusHistory || []).sort((a, b) => {
        const timeA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0;
        const timeB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0;
        return timeB - timeA;
    }).find(h => h.notes && h.notes.trim() !== '');

    const handleConfirmOnWhatsApp = () => {
        let message;

        if (isActionable) {
            const paymentMethodKey = (() => {
                const method = order.paymentDetails.method;
                if (method === 'الدفع عند الاستلام') return 'cash_on_delivery';
                if (method === 'فودافون كاش') return 'vodafone_cash';
                if (method === 'إنستاباي') return 'instapay';
                return 'other';
            })();
            
            message = generateWhatsAppMessage({
                displayOrderId: order.displayOrderId,
                customerShippingDetails: order.customerDetails,
                requiresPhysicalShipping: order.containsPhysicalServices,
                isDirectSingleServiceCheckout: order.isDirectServiceCheckout,
                orderNotes: order.customerDetails.notes,
                paymentMethodDisplay: order.paymentDetails.method,
                selectedPaymentMethod: paymentMethodKey,
                paymentTransactionInfo: order.paymentDetails.transactionInfo,
                itemsForCheckout: order.items,
                totalAmount: order.totalAmount,
                originalAmount: originalTotal,
                tierDiscountAmount: order.tierDiscount,
                discountApplied: order.pointsDiscount,
                finalAmountBeforeRounding: null,
                isRounded: false,
                couponCode: order.couponCode,
                couponDiscountValue: order.couponDiscount,
            });
        } else {
            message = `مرحباً World Technology، لدي استفسار بخصوص طلبي رقم: ${order.displayOrderId}`;
        }

        const whatsappUrl = `https://api.whatsapp.com/send/?phone=201026146714&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    const buttonText = isActionable ? 'تأكيد عبر واتساب' : 'تواصل بخصوص الطلب';
    const whatsappButtonClass = `w-full font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
        isActionable
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/25'
            : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-gray-500/10'
    }`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
            key={order.id}
            className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-500"
        >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <div className="bg-gradient-to-br from-primary/20 to-blue-500/20 p-2 rounded-2xl">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            #{order.displayOrderId}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formattedDate}</p>
                    </div>
                </div>
                <OrderStatusBadge statusKey={order.status} />
            </div>

            {/* Order Details */}
            <div className="space-y-4">
                {/* Price Section */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-700/50 dark:to-blue-900/20 rounded-2xl">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">الإجمالي:</span>
                    <div className="text-right">
                        {hasDiscount ? (
                            <div className="flex flex-col items-end">
                                <span className="text-lg font-bold text-primary tabular-nums">
                                    {order.totalAmount.toFixed(2)} ج.م
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through tabular-nums">
                                    {originalTotal.toFixed(2)} ج.م
                                </span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-primary tabular-nums">
                                {order.totalAmount != null ? order.totalAmount.toFixed(2) : '0.00'} ج.م
                            </span>
                        )}
                    </div>
                </div>

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                    <div className="p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            محتويات الطلب
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {getOrderSummary(order.items)}
                        </p>
                    </div>
                )}

                {/* Payment Method */}
                {order.paymentDetails && order.paymentDetails.method && (
                    <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-700/30 rounded-xl">
                        <span className="font-medium text-gray-600 dark:text-gray-400">طريقة الدفع:</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{order.paymentDetails.method}</span>
                    </div>
                )}

                {/* Latest Note */}
                {latestNote && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/30"
                    >
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            آخر تحديث من المتجر:
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 bg-white/50 dark:bg-blue-900/20 p-3 rounded-lg whitespace-pre-wrap leading-relaxed">
                            {latestNote.notes}
                        </p>
                    </motion.div>
                )}
                
                <div className="flex items-stretch gap-2 mt-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onViewDetails(order)}
                        className="flex-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 font-semibold py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-300"
                    >
                        عرض التفاصيل
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirmOnWhatsApp}
                        className={`flex-[2] ${whatsappButtonClass}`}
                    >
                        <WhatsAppIcon className="w-5 h-5" />
                        <span>{buttonText}</span>
                    </motion.button>
                </div>

            </div>
        </motion.div>
    );
};

export { OrderCard };
