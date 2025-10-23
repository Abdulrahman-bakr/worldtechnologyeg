import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../../icons/index.js';
import { useApp } from '../../../contexts/AppContext.js';
import { getStatusDisplayInfo } from '../orders/ordersUtils.js';

const OrderDetailsModal = ({ isOpen, onClose, order, onShippingUpdate }) => {
    const { setToastMessage } = useApp();
    const [shippingCompany, setShippingCompany] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');

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


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen || !order) return null;
    
    // Helper to safely convert Firestore Timestamps or JS Dates to a JS Date object
    const getJsDate = (timestamp) => {
        if (!timestamp) return null;
        if (typeof timestamp.toDate === 'function') return timestamp.toDate(); // Firestore Timestamp
        if (timestamp instanceof Date) return timestamp; // JS Date
        const date = new Date(timestamp); // Fallback for strings/numbers
        return isNaN(date.getTime()) ? null : date;
    };

    const inputClass = "w-full p-2 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm";
    const orderDateObj = getJsDate(order.createdAt);
    const orderDate = orderDateObj ? orderDateObj.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'غير متوفر';


    return (
        React.createElement("div", { className: "fixed inset-0 z-[110] flex items-center justify-center p-4", role: "dialog", "aria-modal": "true" },
            React.createElement("div", { className: `modal-overlay absolute inset-0 bg-black/85 backdrop-blur-sm`, onClick: handleOverlayClick }),
            React.createElement("div", { className: `modal-content relative bg-light-50 dark:bg-dark-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col` },
                React.createElement("button", { onClick: onClose, className: "absolute top-4 left-4 text-dark-600 dark:text-dark-300 p-1", "aria-label": "إغلاق" }, React.createElement(CloseIcon, { className: "w-5 h-5 sm:w-6 sm:h-6" })),
                React.createElement("h2", { className: "text-xl font-bold mb-4 flex-shrink-0" }, `تفاصيل الطلب: ${order.displayOrderId}`),
                React.createElement("div", { className: "flex-grow overflow-y-auto pr-2 space-y-6 text-sm" },
                    React.createElement("div", null,
                        React.createElement("h3", { className: "font-semibold mb-2" }, "بيانات العميل"),
                        React.createElement("p", null, React.createElement("strong", null, "الاسم: "), order.customerDetails.name),
                        React.createElement("p", null, React.createElement("strong", null, "الهاتف: "), order.customerDetails.phone),
                        order.customerDetails.address && React.createElement("p", null, React.createElement("strong", null, "العنوان: "), `${order.customerDetails.address}, ${order.customerDetails.city}, ${order.customerDetails.governorate}`)
                    ),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "font-semibold mb-2" }, "بيانات الدفع"),
                        React.createElement("p", null, React.createElement("strong", null, "تاريخ الطلب: "), orderDate),
                        React.createElement("p", null, React.createElement("strong", null, "الطريقة: "), order.paymentDetails.method),
                        React.createElement("p", null, React.createElement("strong", null, "الإجمالي: "), `${order.totalAmount.toFixed(2)} ج.م`),
                        order.pointsToEarn > 0 && React.createElement("p", null, React.createElement("strong", null, "النقاط المكتسبة: "), `${order.pointsToEarn} نقطة`),
                        order.paymentDetails.transactionInfo && (
                            order.paymentDetails.method !== 'الدفع عند الاستلام'
                            ? React.createElement("div", { className: "mt-2 p-2 rounded-md bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-600" },
                                React.createElement("p", { className: "font-semibold text-blue-800 dark:text-blue-200" }, "معلومات التحويل (للتأكيد):"),
                                React.createElement("p", { className: "text-blue-700 dark:text-blue-300" }, order.paymentDetails.transactionInfo)
                              )
                            : React.createElement("p", null, React.createElement("strong", null, "معلومات التحويل: "), order.paymentDetails.transactionInfo)
                        )
                    ),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "font-semibold mb-2" }, "محتويات الطلب"),
                        React.createElement("ul", { className: "space-y-2" },
                            order.items.map((item, index) =>
                                React.createElement("li", { key: index, className: "flex items-center gap-4" },
                                    React.createElement("img", { src: item.imageUrl, className: "w-12 h-12 object-contain rounded bg-white" }),
                                    React.createElement("div", null,
                                        React.createElement("p", { className: "font-semibold" }, item.name),
                                        React.createElement("p", null, `الكمية: ${item.quantity}, السعر: ${item.price.toFixed(2)} ج.م`)
                                    )
                                )
                            )
                        )
                    ),
                     React.createElement("div", null,
                        React.createElement("h3", { className: "font-semibold mb-2" }, "سجل حالة الطلب"),
                        React.createElement("ul", { className: "space-y-3" },
                            (order.statusHistory || []).sort((a, b) => {
                                const timeB = getJsDate(b.timestamp)?.getTime() || 0;
                                const timeA = getJsDate(a.timestamp)?.getTime() || 0;
                                return timeB - timeA;
                            }).map((historyItem, index) => {
                                const historyStatusInfo = getStatusDisplayInfo(historyItem.status);
                                const historyDateObj = getJsDate(historyItem.timestamp);
                                const historyDate = historyDateObj ? historyDateObj.toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }) : '...';
                                return React.createElement("li", { key: index, className: "flex items-start gap-3" },
                                    React.createElement("div", { className: `mt-1 flex items-center justify-center w-5 h-5 rounded-full ${historyStatusInfo.colorClass.replace('text-', 'dark:text-').replace('bg-', 'dark:bg-opacity-20 bg-opacity-80 border-opacity-50 ')} border border-current` },
                                        React.createElement("span", { className: "text-lg" }, historyStatusInfo.icon)
                                    ),
                                    React.createElement("div", null,
                                        React.createElement("p", { className: "font-semibold text-dark-900 dark:text-dark-50" }, historyStatusInfo.text),
                                        React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300" }, `${historyDate} بواسطة: ${historyItem.updatedBy}`),
                                        historyItem.notes && React.createElement("p", { className: "text-xs text-dark-700 dark:text-dark-200 mt-1" }, historyItem.notes)
                                    )
                                );
                            })
                        )
                    ),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "font-semibold mb-2" }, "بيانات الشحن والتتبع"),
                        React.createElement("div", { className: "space-y-3" },
                            React.createElement("div", null,
                                React.createElement("label", { className: "block text-xs font-medium mb-1" }, "شركة الشحن"),
                                React.createElement("input", { value: shippingCompany, onChange: e => setShippingCompany(e.target.value), className: inputClass, placeholder: "مثال: Bosta" })
                            ),
                            React.createElement("div", null,
                                React.createElement("label", { className: "block text-xs font-medium mb-1" }, "رقم التتبع"),
                                React.createElement("input", { value: trackingNumber, onChange: e => setTrackingNumber(e.target.value), className: inputClass, placeholder: "مثال: 123456789" })
                            ),
                            onShippingUpdate && React.createElement("button", { onClick: handleSaveShipping, className: "admin-btn text-sm bg-primary/20 text-primary hover:bg-primary/30" }, "حفظ بيانات الشحن وتحديث الحالة إلى 'تم الشحن'")
                        )
                    )
                ),
                React.createElement("div", { className: "pt-4 border-t flex justify-end flex-shrink-0" },
                    React.createElement("button", { onClick: onClose, className: "admin-btn bg-gray-200 dark:bg-dark-600" }, "إغلاق")
                )
            )
        )
    );
};

export { OrderDetailsModal };