import React, { useState } from 'react';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '../../icons/index.js';
import { PopupBannerFormModal } from './PopupBannerFormModal.js';
import { ToggleSwitch } from '../../ui/ToggleSwitch.js';

const PopupBannerManagementPanel = ({ popupBanners, isLoading, handlePopupBannerSave, handlePopupBannerDelete, handleImageUpload }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);

    const handleOpenModal = (banner = null) => {
        setEditingBanner(banner);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingBanner(null);
        setIsModalOpen(false);
    };

    const onSave = async (data) => {
        const result = await handlePopupBannerSave(data);
        if (result.success) {
            handleCloseModal();
        }
        return result;
    };

    const onDelete = (bannerId, bannerTitle) => {
        if (window.confirm(`هل أنت متأكد من حذف الإعلان المنبثق "${bannerTitle}"؟`)) {
            handlePopupBannerDelete(bannerId);
        }
    };

    const handleStatusToggle = async (banner) => {
        setUpdatingStatusId(banner.id);
        await handlePopupBannerSave({ ...banner, isActive: !banner.isActive });
        setUpdatingStatusId(null);
    };

    return (
        React.createElement("div", null,
            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50" }, "إدارة الإعلانات المنبثقة"),
                React.createElement("button", { onClick: () => handleOpenModal(), className: "admin-btn admin-btn-primary" },
                    React.createElement(PlusCircleIcon, { className: "w-5 h-5" }),
                    "إنشاء إعلان منبثق جديد"
                )
            ),
            isLoading
                ? React.createElement("p", null, "جاري تحميل الإعلانات...")
                : React.createElement("div", { className: "admin-table-container" },
                    React.createElement("table", { className: "admin-table" },
                        React.createElement("thead", null, React.createElement("tr", null,
                            React.createElement("th", null, "العنوان"),
                            React.createElement("th", null, "النوع"),
                            React.createElement("th", null, "قاعدة الظهور"),
                            React.createElement("th", null, "الحالة"),
                            React.createElement("th", null, "إجراءات")
                        )),
                        React.createElement("tbody", null,
                            popupBanners.map(banner => (
                                React.createElement("tr", { key: banner.id },
                                    React.createElement("td", { className: "font-semibold" }, banner.title),
                                    React.createElement("td", null, banner.type === 'image' ? 'صورة إعلانية' : 'نشرة بريدية'),
                                    React.createElement("td", { className: "text-xs" }, 
                                        banner.trigger === 'entry' ? 'فور دخول الموقع' : `بعد ${banner.triggerValue} ثانية`
                                    ),
                                    React.createElement("td", null, React.createElement(ToggleSwitch, {
                                        enabled: banner.isActive,
                                        onChange: () => handleStatusToggle(banner),
                                        disabled: updatingStatusId === banner.id,
                                        srLabel: `Toggle status for ${banner.title}`
                                    })),
                                    React.createElement("td", { className: "space-x-2 space-x-reverse" },
                                        React.createElement("button", { onClick: () => handleOpenModal(banner), className: "p-2 hover:text-primary" }, React.createElement(PencilSquareIcon, { className: "w-5 h-5" })),
                                        React.createElement("button", { onClick: () => onDelete(banner.id, banner.title), className: "p-2 hover:text-red-500" }, React.createElement(TrashIcon, { className: "w-5 h-5" }))
                                    )
                                )
                            ))
                        )
                    )
                ),
            isModalOpen && React.createElement(PopupBannerFormModal, {
                isOpen: isModalOpen,
                onClose: handleCloseModal,
                onSave: onSave,
                banner: editingBanner,
                onImageUpload: handleImageUpload,
            })
        )
    );
};

export { PopupBannerManagementPanel };