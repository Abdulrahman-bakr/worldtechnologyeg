import React, { useState } from 'react';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from '../../icons/index.js';
import { ServicePackageFormModal } from './ServicePackageFormModal.js';
import { ServiceFormModal } from './ServiceFormModal.js'; // Import the new modal

const ServiceManagementPanel = ({ digitalServices, isLoading, handleServiceSave, handleServicePackageSave, handleServicePackageDelete }) => {
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [editingData, setEditingData] = useState({ service: null, package: null });
    const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);

    const handleOpenPackageModal = (service, pkg = null) => {
        setEditingData({ service, package: pkg });
        setIsPackageModalOpen(true);
    };

    const handleClosePackageModal = () => {
        setEditingData({ service: null, package: null });
        setIsPackageModalOpen(false);
    };
    
    const handleOpenNewServiceModal = () => setIsNewServiceModalOpen(true);
    const handleCloseNewServiceModal = () => setIsNewServiceModalOpen(false);

    const handlePackageSave = async (packageData) => {
        const result = await handleServicePackageSave(editingData.service.id, packageData, editingData.package);
        if (result.success) {
            handleClosePackageModal();
        } else {
            console.error("Failed to save package:", result.error);
        }
    };

    const handleNewServiceSave = async (serviceData) => {
        const result = await handleServiceSave(serviceData);
        if (result.success) {
            handleCloseNewServiceModal();
        } else {
            console.error("Failed to save service:", result.error);
            // Optionally show an error to the user in the modal
        }
    };
    
    const handleDelete = async (service, pkg) => {
        await handleServicePackageDelete(service.id, pkg);
    };

    return (
        React.createElement("div", null,
            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50" }, "إدارة الخدمات الرقمية"),
                React.createElement("button", { onClick: handleOpenNewServiceModal, className: "admin-btn admin-btn-primary" },
                    React.createElement(PlusCircleIcon, { className: "w-5 h-5" }),
                    "إضافة خدمة جديدة"
                )
            ),
            isLoading
                ? React.createElement("p", null, "جاري تحميل الخدمات...")
                : React.createElement("div", { className: "space-y-8" },
                    digitalServices.map(service => (
                        React.createElement("div", { key: service.id, className: "p-6 bg-white dark:bg-dark-800 rounded-lg border border-light-200 dark:border-dark-700" },
                            React.createElement("div", { className: "flex justify-between items-center mb-4" },
                                React.createElement("h2", { className: "text-xl font-semibold" }, service.name || `خدمة: ${service.id}`,
                                    service.operator && React.createElement("span", { className: "text-sm text-gray-500 ml-2" }, `(${service.operator})`)
                                ),
                                React.createElement("button", { onClick: () => handleOpenPackageModal(service), className: "admin-btn text-sm bg-primary/10 text-primary hover:bg-primary/20" },
                                    React.createElement(PlusCircleIcon, { className: "w-4 h-4" }),
                                    "إضافة باقة"
                                )
                            ),
                            React.createElement("div", { className: "admin-table-container" },
                                React.createElement("table", { className: "admin-table" },
                                    React.createElement("thead", null,
                                        React.createElement("tr", null,
                                            React.createElement("th", null, "اسم الباقة"),
                                            React.createElement("th", null, "السعر"),
                                            React.createElement("th", null, "قيمة الرصيد"),
                                            React.createElement("th", null, "الصلاحية"),
                                            React.createElement("th", null, "إجراءات")
                                        )
                                    ),
                                    React.createElement("tbody", null,
                                        (service.packages || []).map((pkg, index) =>
                                            React.createElement("tr", { key: pkg.id || index },
                                                React.createElement("td", { className: "font-semibold" }, pkg.name || `كارت ${pkg.price}`),
                                                React.createElement("td", null, pkg.price ? `${pkg.price.toFixed(2)} ج.م` : '-'),
                                                React.createElement("td", null, pkg.cardValue ? `${pkg.cardValue} ج.م` : '-'),
                                                React.createElement("td", null, pkg.validity || '-'),
                                                React.createElement("td", { className: "space-x-2 space-x-reverse" },
                                                    React.createElement("button", { onClick: () => handleOpenPackageModal(service, pkg), className: "p-2 hover:text-primary" }, React.createElement(PencilSquareIcon, { className: "w-5 h-5" })),
                                                    React.createElement("button", { onClick: () => handleDelete(service, pkg), className: "p-2 hover:text-red-500" }, React.createElement(TrashIcon, { className: "w-5 h-5" }))
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ))
                ),
            isPackageModalOpen && React.createElement(ServicePackageFormModal, {
                isOpen: isPackageModalOpen,
                onClose: handleClosePackageModal,
                onSave: handlePackageSave,
                packageData: editingData.package
            }),
            isNewServiceModalOpen && React.createElement(ServiceFormModal, {
                isOpen: isNewServiceModalOpen,
                onClose: handleCloseNewServiceModal,
                onSave: handleNewServiceSave,
            })
        )
    );
};

export { ServiceManagementPanel };