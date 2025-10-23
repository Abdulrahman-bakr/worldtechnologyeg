import React, { useState } from 'react';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '../../icons/index.js';
import { DiscountFormModal } from './DiscountFormModal.js';

const DiscountManagementPanel = ({ discounts, isLoading, handleDiscountSave, handleDiscountDelete, products }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState(null);

    const handleOpenModal = (discount = null) => {
        setEditingDiscount(discount);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setEditingDiscount(null);
        setIsModalOpen(false);
    };

    const onSave = async (data) => {
        const result = await handleDiscountSave(data);
        if (result.success) {
            handleCloseModal();
        }
    };

    const onDelete = (discountId, discountCode) => {
        if (window.confirm(`هل أنت متأكد من حذف كوبون "${discountCode}"؟`)) {
            handleDiscountDelete(discountId);
        }
    };

    return (
        React.createElement("div", null,
            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50" }, "إدارة الكوبونات والخصومات"),
                React.createElement("button", { onClick: () => handleOpenModal(), className: "admin-btn admin-btn-primary" },
                    React.createElement(PlusCircleIcon, { className: "w-5 h-5" }),
                    "إنشاء كوبون جديد"
                )
            ),
            isLoading
                ? React.createElement("p", null, "جاري تحميل الكوبونات...")
                : React.createElement("div", { className: "admin-table-container" },
                    React.createElement("table", { className: "admin-table" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "الكود"),
                                React.createElement("th", null, "النوع"),
                                React.createElement("th", null, "القيمة"),
                                React.createElement("th", null, "الحد الأدنى للطلب"),
                                React.createElement("th", null, "حد الاستخدام"),
                                React.createElement("th", null, "تاريخ الانتهاء"),
                                React.createElement("th", null, "إجراءات")
                            )
                        ),
                        React.createElement("tbody", null,
                            discounts.map(d =>
                                React.createElement("tr", { key: d.id },
                                    React.createElement("td", { className: "font-semibold" }, d.code),
                                    React.createElement("td", null, d.type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'),
                                    React.createElement("td", null, d.type === 'percentage' ? `${d.value}%` : `${d.value} ج.م`),
                                    React.createElement("td", null, d.minPurchase ? `${d.minPurchase} ج.م` : 'لا يوجد'),
                                    React.createElement("td", null, d.usageLimit || 'غير محدود'),
                                    React.createElement("td", null, d.expiryDate ? d.expiryDate.toDate().toLocaleDateString('ar-EG') : 'لا يوجد'),
                                    React.createElement("td", { className: "space-x-2 space-x-reverse" },
                                        React.createElement("button", { onClick: () => handleOpenModal(d), className: "p-2 hover:text-primary" }, React.createElement(PencilSquareIcon, { className: "w-5 h-5" })),
                                        React.createElement("button", { onClick: () => onDelete(d.id, d.code), className: "p-2 hover:text-red-500" }, React.createElement(TrashIcon, { className: "w-5 h-5" }))
                                    )
                                )
                            )
                        )
                    )
                ),
             isModalOpen && React.createElement(DiscountFormModal, {
                isOpen: isModalOpen,
                onClose: handleCloseModal,
                onSave: onSave,
                discount: editingDiscount,
                products: products,
            })
        )
    );
};

export { DiscountManagementPanel };