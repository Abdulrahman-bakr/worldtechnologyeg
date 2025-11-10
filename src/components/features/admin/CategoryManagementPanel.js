import React, { useState, useEffect } from 'react';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, CheckIcon, CloseIcon } from '../../icons/index.js';

const CategoryManagementPanel = ({ categories, isLoading, handleCategorySave, handleCategoryDelete }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formState, setFormState] = useState({ id: '', name: '' });
    
    // Original ID needed for ID changes
    const [originalId, setOriginalId] = useState(null);

    const handleStartAdd = () => {
        setIsAdding(true);
        setEditingId(null);
        setOriginalId(null);
        setFormState({ id: '', name: '' });
    };

    const handleStartEdit = (category) => {
        setEditingId(category.id);
        setOriginalId(category.id);
        setIsAdding(false);
        setFormState({ id: category.id, name: category.name });
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setOriginalId(null);
        setFormState({ id: '', name: '' });
    };

    const onSave = async () => {
        if (!formState.name.trim() || !formState.id.trim()) {
            alert('اسم الفئة والمعرّف مطلوبان.');
            return;
        }
        const dataToSave = { 
            name: formState.name.trim(), 
            id: formState.id.trim().toLowerCase().replace(/\s/g, '_') 
        };
        
        const result = await handleCategorySave(dataToSave, originalId);
        if (result.success) {
            handleCancel();
        } else {
            alert(result.error || 'حدث خطأ أثناء الحفظ.');
        }
    };

    const onDelete = (categoryId, categoryName) => {
        if (window.confirm(`هل أنت متأكد من حذف فئة "${categoryName}"؟ سيؤثر هذا على المنتجات المرتبطة بها.`)) {
            handleCategoryDelete(categoryId);
        }
    };

    const sortedCategories = [...(categories || [])].sort((a,b) => a.name.localeCompare(b.name, 'ar'));

    const renderRow = (category) => {
        const isEditingThis = editingId === category.id;
        return (
            isEditingThis ? (
                <tr key="editing-row" className="bg-light-100 dark:bg-dark-700">
                    <td><input value={formState.id} onChange={e => setFormState(p => ({...p, id: e.target.value.toLowerCase().replace(/\s/g, '_')}))} className="admin-inline-input font-mono" placeholder="المعرّف (انجليزي)" /></td>
                    <td><input value={formState.name} onChange={e => setFormState(p => ({...p, name: e.target.value}))} className="admin-inline-input" placeholder="اسم الفئة" /></td>
                    <td className="space-x-2 space-x-reverse">
                        <button onClick={onSave} className="p-2 text-green-500 hover:text-green-700"><CheckIcon className="w-5 h-5" /></button>
                        <button onClick={handleCancel} className="p-2 text-red-500 hover:text-red-700"><CloseIcon className="w-5 h-5" /></button>
                    </td>
                </tr>
            ) : (
                <tr key={category.id}>
                    <td className="font-mono text-sm">{category.id}</td>
                    <td className="font-semibold">{category.name}</td>
                    <td className="space-x-2 space-x-reverse">
                        <button onClick={() => handleStartEdit(category)} className="p-2 hover:text-primary"><PencilSquareIcon className="w-5 h-5" /></button>
                        <button onClick={() => onDelete(category.id, category.name)} className="p-2 hover:text-red-500"><TrashIcon className="w-5 h-5" /></button>
                    </td>
                </tr>
            )
        );
    }
    
    return (
        React.createElement("div", null,
            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50" }, "إدارة الفئات"),
                !isAdding && !editingId && (
                    React.createElement("button", { onClick: handleStartAdd, className: "admin-btn admin-btn-primary" },
                        React.createElement(PlusCircleIcon, { className: "w-5 h-5" }),
                        "إضافة فئة جديدة"
                    )
                )
            ),
            isLoading
                ? React.createElement("p", null, "جاري تحميل الفئات...")
                : React.createElement("div", { className: "admin-table-container" },
                    React.createElement("table", { className: "admin-table" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "المعرّف (ID)"),
                                React.createElement("th", null, "اسم الفئة"),
                                React.createElement("th", null, "إجراءات")
                            )
                        ),
                        React.createElement("tbody", null,
                            isAdding && (
                                <tr className="bg-light-100 dark:bg-dark-700">
                                    <td><input value={formState.id} onChange={e => setFormState(p => ({...p, id: e.target.value.toLowerCase().replace(/\s/g, '_')}))} className="admin-inline-input font-mono" placeholder="المعرّف (انجليزي)" /></td>
                                    <td><input value={formState.name} onChange={e => setFormState(p => ({...p, name: e.target.value}))} className="admin-inline-input" placeholder="اسم الفئة الجديد" /></td>
                                    <td className="space-x-2 space-x-reverse">
                                        <button onClick={onSave} className="p-2 text-green-500 hover:text-green-700"><CheckIcon className="w-5 h-5" /></button>
                                        <button onClick={handleCancel} className="p-2 text-red-500 hover:text-red-700"><CloseIcon className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            ),
                            sortedCategories.map(renderRow)
                        )
                    )
                )
        )
    );
};

export { CategoryManagementPanel };