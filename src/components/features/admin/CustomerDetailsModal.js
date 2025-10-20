import React, { useState, useEffect } from 'react';
import { CloseIcon, CurrencyDollarIcon, ShoppingCartIcon, CalendarDaysIcon, PencilSquareIcon } from '../../icons/index.js';
import { getStatusDisplayInfo } from '../orders/ordersUtils.js';
import { FloatingInput } from '../../ui/forms/FloatingInput.js';
import { useApp } from '../../../contexts/AppContext.js';


const StatCard = ({ title, value, icon: Icon }) => (
    React.createElement("div", { className: "p-4 rounded-lg bg-light-100 dark:bg-dark-700" },
        React.createElement("div", { className: "flex items-center" },
            React.createElement(Icon, { className: "w-6 h-6 text-primary" }),
            React.createElement("div", { className: "mr-3" },
                React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, title),
                React.createElement("p", { className: "text-lg font-bold text-dark-900 dark:text-dark-50" }, value)
            )
        )
    )
);

const CustomerDetailsModal = ({ isOpen, onClose, customer, onUserUpdate }) => {
    const { setToastMessage } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('user');
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (customer) {
            setName(customer.name || '');
            setPhone(customer.phone || '');
            setRole(customer.role || 'user');
            setLoyaltyPoints(customer.loyaltyPoints || 0);
            setIsEditing(false);
        }
    }, [customer]);

    if (!isOpen || !customer) return null;

    const handleSave = async () => {
        if (!onUserUpdate) return;
        setIsSaving(true);
        const result = await onUserUpdate(customer.id, { 
            name: name.trim(), 
            phone: phone.trim(),
            role: role,
            loyaltyPoints: Number(loyaltyPoints) || 0,
        });
        if (result.success) {
            setIsEditing(false);
            setToastMessage({ text: "تم تحديث بيانات العميل بنجاح.", type: "success" });
        } else {
            setToastMessage({ text: "فشل تحديث البيانات.", type: "error" });
        }
        setIsSaving(false);
    };

    const joinedDate = customer.createdAt?.toDate ? customer.createdAt.toDate().toLocaleDateString('ar-EG') : 'غير معروف';
    const averageOrderValue = customer.totalOrders > 0 ? (customer.totalSpent / customer.totalOrders) : 0;

    const labelClass = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";
    const inputClass = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:border-primary focus:ring-primary transition-colors";

    return (
        React.createElement("div", { className: "fixed inset-0 z-[110] flex items-center justify-center p-4" },
            React.createElement("div", { className: "modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: onClose }),
            React.createElement("div", { className: "modal-content bg-light-50 dark:bg-dark-800 rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col relative" },
                React.createElement("button", { onClick: onClose, className: "absolute top-4 left-4 p-1" }, React.createElement(CloseIcon, { className: "w-6 h-6" })),
                
                React.createElement("div", { className: "flex justify-between items-center mb-4 pb-4 border-b border-light-300 dark:border-dark-600" },
                    React.createElement("h2", { className: "text-xl font-bold" }, `تفاصيل العميل: ${customer.name}`),
                    !isEditing && React.createElement("button", { onClick: () => setIsEditing(true), className: "admin-btn text-sm bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
                        React.createElement(PencilSquareIcon, { className: "w-4 h-4" }), "تعديل البيانات"
                    )
                ),

                isEditing ? (
                    React.createElement("div", { className: "space-y-4 mb-6 p-4 bg-light-100 dark:bg-dark-700/50 rounded-lg" },
                        React.createElement(FloatingInput, { id: "customer-name-edit", value: name, onChange: e => setName(e.target.value), placeholder: "الاسم بالكامل *" }),
                        React.createElement(FloatingInput, { id: "customer-phone-edit", value: phone, onChange: e => setPhone(e.target.value), placeholder: "رقم الهاتف", type: "tel" }),
                        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                            React.createElement("div", null,
                                React.createElement("label", { htmlFor:"user-role-edit", className: labelClass }, "الدور"),
                                React.createElement("select", { id:"user-role-edit", value: role, onChange: e => setRole(e.target.value), className: inputClass },
                                    React.createElement("option", { value: "user" }, "مستخدم"),
                                    React.createElement("option", { value: "admin" }, "مسؤول")
                                )
                            ),
                            React.createElement("div", null,
                                React.createElement("label", { htmlFor:"user-points-edit", className: labelClass }, "نقاط الولاء"),
                                React.createElement("input", { id:"user-points-edit", value: loyaltyPoints, onChange: e => setLoyaltyPoints(e.target.value), type: "number", className: inputClass })
                            )
                        ),
                        React.createElement("div", { className: "flex gap-2 justify-end pt-2" },
                            React.createElement("button", { onClick: () => setIsEditing(false), className: "admin-btn bg-gray-200 dark:bg-dark-600", disabled: isSaving }, "إلغاء"),
                            React.createElement("button", { onClick: handleSave, className: "admin-btn admin-btn-primary", disabled: isSaving }, isSaving ? 'جاري الحفظ...' : "حفظ")
                        )
                    )
                ) : (
                    React.createElement("div", { className: "mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" },
                        React.createElement("div", { className: "p-3 bg-light-100 dark:bg-dark-700 rounded-md" }, React.createElement("strong", null, "الاسم: "), customer.name),
                        React.createElement("div", { className: "p-3 bg-light-100 dark:bg-dark-700 rounded-md" }, React.createElement("strong", null, "البريد: "), customer.email),
                        React.createElement("div", { className: "p-3 bg-light-100 dark:bg-dark-700 rounded-md" }, React.createElement("strong", null, "الهاتف: "), customer.phone || 'غير مسجل')
                    )
                ),
                
                React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" },
                    React.createElement(StatCard, { title: "إجمالي الإنفاق", value: `${customer.totalSpent.toFixed(2)} ج.م`, icon: CurrencyDollarIcon }),
                    React.createElement(StatCard, { title: "إجمالي الطلبات", value: customer.totalOrders, icon: ShoppingCartIcon }),
                    React.createElement(StatCard, { title: "متوسط قيمة الطلب", value: `${averageOrderValue.toFixed(2)} ج.م`, icon: CurrencyDollarIcon }),
                    React.createElement(StatCard, { title: "تاريخ الانضمام", value: joinedDate, icon: CalendarDaysIcon })
                ),

                React.createElement("h3", { className: "text-lg font-semibold mb-3" }, "سجل الطلبات"),
                React.createElement("div", { className: "flex-grow overflow-y-auto admin-table-container" },
                    React.createElement("table", { className: "admin-table" },
                        React.createElement("thead", null, React.createElement("tr", null, 
                            React.createElement("th", null, "رقم الطلب"),
                            React.createElement("th", null, "التاريخ"),
                            React.createElement("th", null, "الحالة"),
                            React.createElement("th", null, "الإجمالي")
                        )),
                        React.createElement("tbody", null, 
                            customer.orders && customer.orders.length > 0 ? (
                                customer.orders.map(order => {
                                    const statusInfo = getStatusDisplayInfo(order.status);
                                    return React.createElement("tr", { key: order.id },
                                        React.createElement("td", { className: "font-mono text-sm" }, order.displayOrderId),
                                        React.createElement("td", null, order.createdAt?.toLocaleDateString('ar-EG')),
                                        React.createElement("td", null, React.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${statusInfo.colorClass}`}, statusInfo.text)),
                                        React.createElement("td", null, `${(order.totalAmount || 0).toFixed(2)} ج.م`)
                                    );
                                })
                            ) : (
                                React.createElement("tr", null, 
                                    React.createElement("td", { colSpan: "4", className: "text-center py-6 text-dark-600" }, "لا توجد طلبات لهذا العميل بعد.")
                                )
                            )
                        )
                    )
                )
            )
        )
    );
};

export { CustomerDetailsModal };