// world-technology-store/src/components/features/admin/ProductManagementPanel.js

import React, { useState, useMemo } from 'react';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, ClipboardDocumentIcon } from '../../icons/index.js';
import { ProductFormModal } from './ProductFormModal.js';
import { getImageUrl } from '../../../utils/imageUrl.js';
import { ToggleSwitch } from '../../ui/ToggleSwitch.js';

const BulkActionsBar = ({ selectedCount, onBulkDelete, onClearSelection }) => {
    return (
        React.createElement("div", { className: "bulk-actions-bar" },
            React.createElement("span", { className: "text-sm font-semibold" }, `تم تحديد ${selectedCount} منتج`),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement("button", { onClick: onBulkDelete, className: "admin-btn bg-red-600 hover:bg-red-700 text-white text-sm" }, 
                    React.createElement(TrashIcon, {className: "w-4 h-4"}), "حذف المحدد"
                ),
                React.createElement("button", { onClick: onClearSelection, className: "admin-btn bg-gray-500 hover:bg-gray-600 text-white text-sm" }, "إلغاء التحديد")
            )
        )
    );
};

const ProductManagementPanel = ({ products, isLoading, handleProductSave, handleProductDelete, handleStockUpdate, handleImageUpload, digitalServices, feeRules, handleProductBulkDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    
    const [inlineStock, setInlineStock] = useState({});
    const [selectedProducts, setSelectedProducts] = useState([]);

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            (p.arabicName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.id || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };
    
    const handleCloneProduct = (productToClone) => {
        const clonedProduct = { ...productToClone, id: null, arabicName: `${productToClone.arabicName} - نسخة`, status: 'draft' };
        delete clonedProduct.id;
        setEditingProduct(clonedProduct);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingProduct(null);
        setIsModalOpen(false);
    };

    const onSave = async (data) => {
        const result = await handleProductSave(data);
        if (result.success) {
            handleCloseModal();
            return result;
        }
        return result;
    };
    
    const handleInlineStockChange = (productId, value) => setInlineStock(prev => ({ ...prev, [productId]: value }));
    const handleInlineStockUpdate = (productId) => {
        const newStock = inlineStock[productId];
        if (newStock !== undefined && newStock !== '') handleStockUpdate(productId, Number(newStock));
    };
    
    const handleStatusToggle = async (productId, currentStatus) => {
        setUpdatingStatusId(productId);
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        await handleProductSave({ id: productId, status: newStatus });
        setUpdatingStatusId(null);
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prev => 
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(filteredProducts.map(p => p.id));
        } else {
            setSelectedProducts([]);
        }
    };
    
    const handleBulkDelete = async () => {
        if (window.confirm(`هل أنت متأكد من حذف ${selectedProducts.length} منتج؟ لا يمكن التراجع عن هذا الإجراء.`)) {
            await handleProductBulkDelete(selectedProducts);
            setSelectedProducts([]);
        }
    };

    return (
        React.createElement("div", null,
            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50" }, "إدارة المنتجات"),
                React.createElement("button", { onClick: () => handleOpenModal(), className: "admin-btn admin-btn-primary" }, React.createElement(PlusCircleIcon, { className: "w-5 h-5" }), "إضافة منتج جديد")
            ),
            React.createElement("div", { className: "mb-4" }, React.createElement("input", { type: "text", placeholder: "ابحث عن منتج بالاسم أو ID...", value: searchTerm, onChange: e => setSearchTerm(e.target.value), className: "w-full max-w-sm p-2 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700" })),
            isLoading ? React.createElement("p", null, "جاري تحميل المنتجات...")
            : React.createElement("div", { className: "admin-table-container" },
                React.createElement("table", { className: "admin-table" },
                    React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", { className: "w-12 text-center" }, React.createElement("input", { type: "checkbox", onChange: handleSelectAll, checked: selectedProducts.length === filteredProducts.length && filteredProducts.length > 0, "aria-label": "Select all products" })), React.createElement("th", null, "صورة"), React.createElement("th", null, "الاسم"), React.createElement("th", null, "الفئة"), React.createElement("th", null, "السعر"), React.createElement("th", null, "المخزون"), React.createElement("th", null, "الحالة"), React.createElement("th", null, "إجراءات"))),
                    React.createElement("tbody", null,
                        filteredProducts.map(p => {
                            const hasVariants = p.variants && p.variants.length > 0;
                            const isSelected = selectedProducts.includes(p.id);
                            return React.createElement("tr", { key: p.id, className: isSelected ? 'selected-row' : '' },
                                React.createElement("td", { className: "text-center" }, React.createElement("input", { type: "checkbox", checked: isSelected, onChange: () => handleSelectProduct(p.id) })),
                                React.createElement("td", null, React.createElement("img", { src: getImageUrl(p.imageUrl), alt: p.arabicName, className: "product-image", loading: "lazy" })),
                                React.createElement("td", { className: "font-semibold" }, p.arabicName),
                                React.createElement("td", null, p.category),
                                React.createElement("td", null, hasVariants ? 'متعدد' : `${p.discountPrice || p.price} ج.م`),
                                React.createElement("td", null, hasVariants ? p.stock : React.createElement("div", {className: "flex items-center gap-2"}, React.createElement("input", { type: "number", value: inlineStock[p.id] ?? p.stock, onChange: (e) => handleInlineStockChange(p.id, e.target.value), onBlur: () => handleInlineStockUpdate(p.id), className: "w-20 p-1 text-center rounded-md border bg-white dark:bg-dark-700" }))),
                                React.createElement("td", null, React.createElement(ToggleSwitch, {
                                    enabled: p.status === 'published',
                                    onChange: () => handleStatusToggle(p.id, p.status),
                                    srLabel: `Toggle status for ${p.arabicName}`,
                                    disabled: updatingStatusId === p.id
                                })),
                                React.createElement("td", { className: "space-x-1 space-x-reverse" },
                                    React.createElement("button", { onClick: () => handleCloneProduct(p), className: "p-2 hover:text-blue-500", title: "نسخ المنتج" }, React.createElement(ClipboardDocumentIcon, { className: "w-5 h-5" })),
                                    React.createElement("button", { onClick: () => handleOpenModal(p), className: "p-2 hover:text-primary", title: "تعديل" }, React.createElement(PencilSquareIcon, { className: "w-5 h-5" })),
                                    React.createElement("button", { onClick: () => handleProductDelete(p.id), className: "p-2 hover:text-red-500", title: "حذف" }, React.createElement(TrashIcon, { className: "w-5 h-5" }))
                                )
                            )
                        })
                    )
                )
            ),
            isModalOpen && React.createElement(ProductFormModal, { isOpen: isModalOpen, onClose: handleCloseModal, onSave: onSave, product: editingProduct, onImageUpload: handleImageUpload, digitalServices: digitalServices, feeRules: feeRules }),
            selectedProducts.length > 0 && React.createElement(BulkActionsBar, { selectedCount: selectedProducts.length, onBulkDelete: handleBulkDelete, onClearSelection: () => setSelectedProducts([]) })
        )
    );
};

export { ProductManagementPanel };