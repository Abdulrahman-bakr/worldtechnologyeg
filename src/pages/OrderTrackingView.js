import React, { useState } from 'react';
import { StaticPageView } from './Static-Pages/StaticPageView.js';
import { db } from '../services/firebase/config.js';
import { collection, query, where, getDocs, limit, Timestamp, doc, getDoc } from 'firebase/firestore';
import { getStatusDisplayInfo } from '../components/features/orders/ordersUtils.js';


const OrderTrackingView = ({ onBack }) => {
    const [orderId, setOrderId] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderResult, setOrderResult] = useState(null);

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

        return React.createElement("div", { className: "mt-8 p-6 bg-light-100 dark:bg-dark-700 rounded-lg border border-light-200 dark:border-dark-600" },
            React.createElement("div", { className: "flex justify-between items-start mb-4 pb-4 border-b border-light-300 dark:border-dark-600" },
                React.createElement("h3", { className: "text-xl font-bold text-dark-900 dark:text-dark-50" }, `طلب رقم: ${orderResult.displayOrderId}`),
                React.createElement("span", { className: `px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.colorClass}` }, `${statusInfo.icon} ${statusInfo.text}`)
            ),
            React.createElement("div", { className: "space-y-2 text-md text-dark-800 dark:text-dark-100" },
                React.createElement("p", null, React.createElement("strong", { className: "w-32 inline-block"}, "تاريخ الطلب:"), orderDate),
                React.createElement("p", null, React.createElement("strong", { className: "w-32 inline-block"}, "الإجمالي:"), `${(orderResult.totalAmount || 0).toFixed(2)} ج.م`),
                React.createElement("p", null, React.createElement("strong", { className: "w-32 inline-block"}, "محتويات الطلب:"), orderSummary),
                React.createElement("p", null, React.createElement("strong", { className: "w-32 inline-block"}, "طريقة الدفع:"), orderResult.paymentDetails?.method || 'غير محدد')
            ),
             React.createElement("div", { className: "mt-6 pt-4 border-t border-light-300 dark:border-dark-600" },
                React.createElement("h4", { className: "text-lg font-semibold mb-4" }, "سجل تحديثات الطلب"),
                React.createElement("ol", { className: "relative border-r border-gray-200 dark:border-gray-600 mr-1.5" },                  
                    (orderResult.statusHistory || [])
                        .sort((a, b) => {
                            const timeB = getJsDate(b.timestamp)?.getTime() || 0;
                            const timeA = getJsDate(a.timestamp)?.getTime() || 0;
                            return timeB - timeA;
                        })
                        .map((historyItem, index) => {
                        const historyStatusInfo = getStatusDisplayInfo(historyItem.status);
                        const historyDateObj = getJsDate(historyItem.timestamp);
                        const historyDate = historyDateObj ? historyDateObj.toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }) : '...';
                        return React.createElement("li", { key: index, className: "mb-6 mr-6" },            
                            React.createElement("span", { className: `absolute flex items-center justify-center w-6 h-6 rounded-full -right-3.5 ring-8 ring-light-100 dark:ring-dark-700 ${statusInfo.colorClass}` }, 
                                React.createElement("span", { className: "text-lg" }, historyStatusInfo.icon)
                            ),
                            React.createElement("div", { className: "p-3 bg-white dark:bg-dark-800 rounded-lg border border-light-200 dark:border-dark-600" },
                                React.createElement("h5", { className: "flex items-center mb-1 text-base font-semibold text-gray-900 dark:text-white" }, historyStatusInfo.text),
                                React.createElement("time", { className: "block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500" }, historyDate),
                                historyItem.notes && React.createElement("p", { className: "text-sm text-gray-600 dark:text-gray-400" }, historyItem.notes)
                            )
                        );
                    })
                )
            )
        );
    };

    return React.createElement(StaticPageView, { title: "تتبع طلبك", onBack: onBack },
        React.createElement("p", { className: "text-center text-dark-700 dark:text-dark-100 mb-6" }, "أدخل رقم الطلب ورقم الهاتف الذي استخدمته في الطلب لمتابعة حالته."),
        React.createElement("form", { onSubmit: handleTrackOrder, className: "max-w-2xl mx-auto space-y-4" },
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "orderId", className: "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100" }, "رقم الطلب"),
                React.createElement("input", {
                    type: "text", id: "orderId", value: orderId,
                    onChange: e => setOrderId(e.target.value),
                    className: "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary",
                    placeholder: "مثال: 171091631"
                })
            ),
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "phone", className: "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100" }, "رقم الهاتف"),
                React.createElement("input", {
                    type: "tel", id: "phone", value: phone,
                    onChange: e => setPhone(e.target.value),
                    className: "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary",
                    placeholder: "01xxxxxxxxx"
                })
            ),
            React.createElement("button", {
                type: "submit",
                disabled: isLoading,
                className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-70"
            }, isLoading ? "جاري البحث..." : "تتبع الطلب"),
            error && React.createElement("p", { className: "text-red-500 text-center mt-4" }, error)
        ),
        React.createElement(OrderResult, null)
    );
};

export { OrderTrackingView };
