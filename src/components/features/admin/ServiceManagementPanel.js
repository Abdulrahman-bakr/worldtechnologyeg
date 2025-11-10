import React, { useState, useMemo } from 'react';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon, ChevronUpIcon, ChevronDownIcon } from '../../icons/index.js';
import { ServicePackageFormModal } from './ServicePackageFormModal.js';
import { ServiceFormModal } from './ServiceFormModal.js'; 

const ServiceManagementPanel = ({ digitalServices, isLoading, handleServiceSave, handleServicePackageSave, handleServicePackageDelete }) => {
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [editingData, setEditingData] = useState({ service: null, package: null });
    const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const collator = new Intl.Collator('ar', { numeric: true, sensitivity: 'base' });

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
        }
    };
    
    const getPackageDisplayName = (pkg, service) => {
        return pkg.name || `${service.packageBaseName || 'باقة'} ${(Number(pkg.price) || 0).toFixed(2)}`;
    };
    
    const handleDelete = async (service, pkg) => {
        if (window.confirm(`هل أنت متأكد من حذف باقة "${getPackageDisplayName(pkg, service)}"؟`)) {
            await handleServicePackageDelete(service.id, pkg);
        }
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader = ({ children, sortKey }) => (
        <th>
            <button onClick={() => requestSort(sortKey)} className="flex items-center gap-1 group">
                {children}
                <span className="opacity-30 group-hover:opacity-100 transition-opacity">
                    {sortConfig.key === sortKey
                        ? (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)
                        : <ChevronUpIcon className="w-4 h-4 opacity-0 group-hover:opacity-30" />
                    }
                </span>
            </button>
        </th>
    );

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
                    [...digitalServices].sort((a,b) => (a.name || '').localeCompare(b.name || '', 'ar')).map(service => {
                        const sortedPackages = [...(service.packages || [])];
                        
                        if (sortConfig.key) {
                            sortedPackages.sort((a, b) => {
                                let result = 0;
                                if (sortConfig.key === 'name') {
                                    result = collator.compare(getPackageDisplayName(a, service), getPackageDisplayName(b, service));
                                } else if (['price', 'cardValue'].includes(sortConfig.key)) {
                                    const numA = Number(a[sortConfig.key]) || 0;
                                    const numB = Number(b[sortConfig.key]) || 0;
                                    result = numA - numB;
                                } else { // for 'validity' or other string fields
                                    const strA = String(a[sortConfig.key] || '');
                                    const strB = String(b[sortConfig.key] || '');
                                    result = strA.localeCompare(strB, 'ar');
                                }
                                
                                return sortConfig.direction === 'ascending' ? result : -result;
                            });
                        }

                        return React.createElement("div", { key: service.id, className: "p-6 bg-white dark:bg-dark-800 rounded-lg border border-light-200 dark:border-dark-700" },
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
                                            React.createElement(SortableHeader, { sortKey: "name" }, "اسم الباقة"),
                                            React.createElement(SortableHeader, { sortKey: "price" }, "السعر"),
                                            React.createElement(SortableHeader, { sortKey: "cardValue" }, "قيمة الرصيد"),
                                            React.createElement(SortableHeader, { sortKey: "validity" }, "الصلاحية"),
                                            React.createElement("th", null, "إجراءات")
                                        )
                                    ),
                                    React.createElement("tbody", null,
                                        sortedPackages.length > 0
                                        ? sortedPackages.map((pkg, index) =>
                                            React.createElement("tr", { key: pkg.id || index },
                                                React.createElement("td", { className: "font-semibold" }, getPackageDisplayName(pkg, service)),
                                                React.createElement("td", null, pkg.price != null ? `${(Number(pkg.price) || 0).toFixed(2)} ج.م` : '-'),
                                                React.createElement("td", null, pkg.cardValue != null ? `${(Number(pkg.cardValue) || 0).toFixed(2)} ج.م` : '-'),
                                                React.createElement("td", null, pkg.validity || '-'),
                                                React.createElement("td", { className: "space-x-2 space-x-reverse" },
                                                    React.createElement("button", { onClick: () => handleOpenPackageModal(service, pkg), className: "p-2 hover:text-primary" }, React.createElement(PencilSquareIcon, { className: "w-5 h-5" })),
                                                    React.createElement("button", { onClick: () => handleDelete(service, pkg), className: "p-2 hover:text-red-500" }, React.createElement(TrashIcon, { className: "w-5 h-5" }))
                                                )
                                            )
                                        )
                                        : React.createElement("tr", null,
                                            React.createElement("td", { colSpan: "5", className: "text-center py-4 text-dark-600 dark:text-dark-300" }, "لا توجد باقات مضافة لهذه الخدمة بعد.")
                                          )
                                    )
                                )
                            )
                        );
                    })
                ),
            isPackageModalOpen && React.createElement(ServicePackageFormModal, {
                isOpen: isPackageModalOpen,
                onClose: handleClosePackageModal,
                onSave: handlePackageSave,
                packageData: editingData.package,
                service: editingData.service,
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