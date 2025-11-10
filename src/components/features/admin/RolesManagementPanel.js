import React, { useState } from 'react';
import { ShieldCheckIcon, PlusCircleIcon, PencilSquareIcon, TrashIcon } from '../../icons/index.js';

const allPermissions = [
    { id: 'view_dashboard', label: 'عرض لوحة التحكم الرئيسية', group: 'عام' },
    { id: 'manage_products', label: 'إدارة المنتجات', group: 'الكتالوج' },
    { id: 'manage_categories', label: 'إدارة الفئات', group: 'الكتالوج' },
    { id: 'manage_orders', label: 'إدارة الطلبات', group: 'المبيعات' },
    { id: 'view_customers', label: 'عرض العملاء', group: 'المبيعات' },
    { id: 'manage_customers', label: 'تعديل بيانات العملاء', group: 'المبيعات' },
    { id: 'manage_discounts', label: 'إدارة الكوبونات', group: 'التسويق' },
    { id: 'manage_settings', label: 'تعديل إعدادات المتجر', group: 'الإعدادات' },
    { id: 'view_reports', label: 'عرض التقارير', group: 'التقارير' },
    { id: 'manage_roles', label: 'إدارة الأدوار والصلاحيات', group: 'الإعدادات' },
];

const permissionGroups = [...new Set(allPermissions.map(p => p.group))];

const RolesManagementPanel = () => {
    const [roles, setRoles] = useState([
        { id: 'admin', name: 'مسؤول', permissions: allPermissions.map(p => p.id), isEditable: false },
        { id: 'order_manager', name: 'مدير طلبات', permissions: ['manage_orders', 'view_customers', 'view_dashboard'] },
        { id: 'content_writer', name: 'كاتب محتوى', permissions: ['manage_products', 'manage_categories'] },
    ]);

    const [editingRole, setEditingRole] = useState(null);

    const handleStartAdd = () => {
        setEditingRole({
            id: '',
            name: '',
            permissions: [],
            isNew: true,
            isEditable: true,
        });
    };

    const handleStartEdit = (role) => {
        setEditingRole({ ...role, permissions: [...role.permissions] });
    };

    const handleCancelEdit = () => {
        setEditingRole(null);
    };

    const handlePermissionChange = (permissionId) => {
        if (!editingRole) return;
        const newPermissions = editingRole.permissions.includes(permissionId)
            ? editingRole.permissions.filter(p => p !== permissionId)
            : [...editingRole.permissions, permissionId];
        setEditingRole({ ...editingRole, permissions: newPermissions });
    };
    
    const handleSave = () => {
        if (!editingRole.name.trim() || !editingRole.id.trim()) {
            alert("اسم الدور والمعرّف مطلوبان.");
            return;
        }

        const newId = editingRole.id.trim().toLowerCase().replace(/\s+/g, '_');

        if (editingRole.isNew) {
            if (roles.some(r => r.id === newId)) {
                alert("هذا المعرّف مستخدم بالفعل. يرجى اختيار معرف فريد.");
                return;
            }
            const { isNew, ...newRole } = editingRole;
            newRole.id = newId;
            setRoles(prevRoles => [...prevRoles, newRole]);
            alert('تم إضافة الدور بنجاح (محاكاة).');
        } else {
            setRoles(roles.map(r => r.id === editingRole.id ? editingRole : r));
            alert('تم حفظ الدور بنجاح (محاكاة).');
        }
        setEditingRole(null);
    };

    if (editingRole) {
        return (
            React.createElement("div", null,
                React.createElement("div", { className: "flex justify-between items-center mb-6" },
                    React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50" }, 
                        editingRole.isNew ? 'إضافة دور جديد' : `تعديل دور: ${editingRole.name}`
                    )
                ),
                React.createElement("div", { className: "p-6 bg-white dark:bg-dark-800 rounded-lg border" },
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" },
                        React.createElement("div", null,
                            React.createElement("label", { htmlFor: "role-name-edit", className: "block text-sm font-medium mb-1" }, "اسم الدور"),
                            React.createElement("input", { 
                                id: "role-name-edit",
                                type: "text",
                                value: editingRole.name,
                                onChange: (e) => setEditingRole({...editingRole, name: e.target.value}),
                                className: "w-full p-2 rounded-md border bg-white dark:bg-dark-700",
                                disabled: !editingRole.isEditable && editingRole.isEditable !== undefined
                            })
                        ),
                        React.createElement("div", null,
                            React.createElement("label", { htmlFor: "role-id-edit", className: "block text-sm font-medium mb-1" }, "المعرّف (ID) - (انجليزي وبدون مسافات)"),
                            React.createElement("input", { 
                                id: "role-id-edit",
                                type: "text",
                                value: editingRole.id,
                                onChange: (e) => setEditingRole({...editingRole, id: e.target.value}),
                                className: "w-full p-2 rounded-md border bg-white dark:bg-dark-700 font-mono disabled:bg-light-100 dark:disabled:bg-dark-700/50",
                                placeholder: "e.g., content_editor",
                                disabled: !editingRole.isNew
                            })
                        )
                    ),
                    React.createElement("h3", { className: "text-lg font-semibold mb-3" }, "الصلاحيات"),
                    React.createElement("div", { className: "space-y-4" },
                        permissionGroups.map(group => (
                            React.createElement("div", { key: group },
                                React.createElement("h4", { className: "font-semibold text-md text-primary border-b mb-2 pb-1" }, group),
                                React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2" },
                                    allPermissions.filter(p => p.group === group).map(permission => (
                                        React.createElement("label", { key: permission.id, className: "flex items-center gap-2 p-2 rounded-md hover:bg-light-100 dark:hover:bg-dark-700 cursor-pointer" },
                                            React.createElement("input", { 
                                                type: "checkbox",
                                                checked: editingRole.permissions.includes(permission.id),
                                                onChange: () => handlePermissionChange(permission.id),
                                                className: "form-checkbox"
                                            }),
                                            permission.label
                                        )
                                    ))
                                )
                            )
                        ))
                    ),
                     React.createElement("div", { className: "flex justify-end gap-2 mt-6 pt-4 border-t" },
                        React.createElement("button", { onClick: handleCancelEdit, className: "admin-btn bg-gray-200 dark:bg-dark-600" }, "إلغاء"),
                        React.createElement("button", { onClick: handleSave, className: "admin-btn admin-btn-primary" }, 
                            editingRole.isNew ? 'إضافة الدور' : 'حفظ التغييرات'
                        )
                    )
                )
            )
        );
    }

    return (
        React.createElement("div", null,
            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50" }, "إدارة الصلاحيات والأدوار"),
                React.createElement("button", { onClick: handleStartAdd, className: "admin-btn admin-btn-primary" },
                    React.createElement(PlusCircleIcon, { className: "w-5 h-5" }),
                    "إضافة دور جديد"
                )
            ),
            React.createElement("div", { className: "admin-table-container" },
                React.createElement("table", { className: "admin-table" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "الدور"),
                            React.createElement("th", null, "الصلاحيات"),
                            React.createElement("th", null, "إجراءات")
                        )
                    ),
                    React.createElement("tbody", null,
                        roles.map(role => (
                            React.createElement("tr", { key: role.id },
                                React.createElement("td", { className: "font-semibold" }, role.name, " ", role.isEditable === false && React.createElement("span", { className: "text-xs text-gray-500" }, "(أساسي)")),
                                React.createElement("td", { className: "text-xs max-w-md" },
                                    role.permissions.map(pId => allPermissions.find(p => p.id === pId)?.label || pId).join('، ')
                                ),
                                React.createElement("td", { className: "space-x-2 space-x-reverse" },
                                    React.createElement("button", { onClick: () => handleStartEdit(role), className: "p-2 hover:text-primary" }, React.createElement(PencilSquareIcon, { className: "w-5 h-5" })),
                                    role.isEditable !== false && (
                                        React.createElement("button", { onClick: () => alert("سيتم إضافة هذه الميزة قريباً!"), className: "p-2 hover:text-red-500" }, React.createElement(TrashIcon, { className: "w-5 h-5" }))
                                    )
                                )
                            )
                        ))
                    )
                )
            )
        )
    );
};

export { RolesManagementPanel };