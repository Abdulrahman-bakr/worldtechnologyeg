import React, { useState, useMemo } from 'react';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '../../icons/index.js';
import { AnnouncementFormModal } from './AnnouncementFormModal.js';
import { useApp } from '../../../contexts/AppContext.js';

const BannerManagementPanel = ({ announcements, dealOfTheDay, products, isLoading, handleAnnouncementSave, handleAnnouncementDelete, handleDealOfTheDaySave, handleImageUpload }) => {
    const { setToastMessage } = useApp();
    const [activeTab, setActiveTab] = useState('announcements');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);

    // State for Deal of the Day
    const [dealProductId, setDealProductId] = useState(dealOfTheDay?.productId || '');
    const [dealEndTime, setDealEndTime] = useState(dealOfTheDay?.offerEndTime?.toDate ? dealOfTheDay.offerEndTime.toDate().toISOString().slice(0, 16) : '');

    const productsWithDiscount = useMemo(() => {
        return products.filter(p => p.discountPrice);
    }, [products]);

    const handleOpenModal = (announcement = null) => {
        setEditingAnnouncement(announcement);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingAnnouncement(null);
        setIsModalOpen(false);
    };

    const onSaveAnnouncement = async (data) => {
        const result = await handleAnnouncementSave(data);
        if (result.success) handleCloseModal();
    };
    
    const onDeleteAnnouncement = (announcementId, announcementTitle) => {
        if (window.confirm(`هل أنت متأكد من حذف إعلان "${announcementTitle}"؟`)) {
            handleAnnouncementDelete(announcementId);
        }
    };

    const onSaveDeal = async (e) => {
        e.preventDefault();
        if (!dealProductId || !dealEndTime) {
            setToastMessage({ text: "يرجى اختيار منتج وتحديد وقت انتهاء العرض.", type: 'error' });
            return;
        }
        await handleDealOfTheDaySave({ productId: dealProductId, offerEndTime: dealEndTime });
    };

    return (
        React.createElement("div", null,
            React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50 mb-4" }, "إدارة الإعلانات والبانرات"),
            React.createElement("div", { className: "border-b border-light-300 dark:border-dark-600 mb-4" },
                React.createElement("nav", { className: "flex space-x-4 space-x-reverse" },
                    React.createElement("button", { onClick: () => setActiveTab('announcements'), className: `py-2 px-4 ${activeTab === 'announcements' ? 'border-b-2 border-primary text-primary' : ''}` }, "الإعلانات"),
                    React.createElement("button", { onClick: () => setActiveTab('offer'), className: `py-2 px-4 ${activeTab === 'offer' ? 'border-b-2 border-primary text-primary' : ''}` }, "عرض اليوم الواحد")
                )
            ),
            
            activeTab === 'announcements' && React.createElement("div", null,
                 React.createElement("div", { className: "flex justify-end mb-4" },
                    React.createElement("button", { onClick: () => handleOpenModal(), className: "admin-btn admin-btn-primary" }, React.createElement(PlusCircleIcon, { className: "w-5 h-5" }), "إضافة إعلان جديد")
                ),
                isLoading ? React.createElement("p", null, "جاري التحميل...") :
                React.createElement("div", { className: "admin-table-container" },
                    React.createElement("table", { className: "admin-table" },
                        React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "العنوان"), React.createElement("th", null, "الرسالة"), React.createElement("th", null, "الحالة"), React.createElement("th", null, "إجراءات"))),
                        React.createElement("tbody", null,
                            announcements.map(ann => React.createElement("tr", { key: ann.id },
                                React.createElement("td", { className: "font-semibold" }, ann.title),
                                React.createElement("td", null, ann.message),
                                React.createElement("td", null, ann.isActive ? React.createElement("span", {className: "text-green-500"}, "فعال") : "غير فعال"),
                                React.createElement("td", { className: "space-x-2 space-x-reverse" },
                                    React.createElement("button", { onClick: () => handleOpenModal(ann), className: "p-2 hover:text-primary" }, React.createElement(PencilSquareIcon, { className: "w-5 h-5" })),
                                    React.createElement("button", { onClick: () => onDeleteAnnouncement(ann.id, ann.title), className: "p-2 hover:text-red-500" }, React.createElement(TrashIcon, { className: "w-5 h-5" }))
                                )
                            ))
                        )
                    )
                )
            ),

            activeTab === 'offer' && React.createElement("div", { className: "p-6 bg-white dark:bg-dark-800 rounded-lg border" },
                React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "تحديد عرض اليوم الواحد"),
                isLoading ? React.createElement("p", null, "جاري التحميل...") :
                React.createElement("form", { onSubmit: onSaveDeal, className: "space-y-4" },
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium mb-1" }, "اختر المنتج"),
                        React.createElement("select", { value: dealProductId, onChange: e => setDealProductId(e.target.value), className: "w-full p-2 rounded-md border bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50" },
                            React.createElement("option", { value: "" }, "اختر منتجًا..."),
                            productsWithDiscount.map(p => React.createElement("option", { key: p.id, value: p.id }, p.arabicName))
                        ),
                        productsWithDiscount.length === 0 && !isLoading && (
                            React.createElement("p", { className: "text-xs text-yellow-600 dark:text-yellow-400 mt-2 px-1" }, 
                                "لا توجد منتجات عليها خصم حاليًا. لعرض منتج هنا، يرجى إضافة 'سعر الخصم' للمنتج أولاً."
                            )
                        )
                    ),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium mb-1" }, "تاريخ ووقت انتهاء العرض"),
                        React.createElement("input", { type: "datetime-local", value: dealEndTime, onChange: e => setDealEndTime(e.target.value), className: "w-full p-2 rounded-md border bg-white dark:bg-dark-700" })
                    ),
                    React.createElement("button", { type: "submit", className: "admin-btn admin-btn-primary" }, "حفظ العرض")
                )
            ),
            
            isModalOpen && React.createElement(AnnouncementFormModal, {
                isOpen: isModalOpen,
                onClose: handleCloseModal,
                onSave: onSaveAnnouncement,
                announcement: editingAnnouncement,
                onImageUpload: handleImageUpload
            })
        )
    );
};

export { BannerManagementPanel };