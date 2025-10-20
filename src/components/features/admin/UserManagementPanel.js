import React, { useState, useMemo } from 'react';
import { PencilSquareIcon } from '../../icons/index.js';
import { CustomerDetailsModal } from './CustomerDetailsModal.js'; // Changed import

const UserManagementPanel = ({ users, orders, isLoading, handleUserUpdate }) => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const usersWithStats = useMemo(() => {
        if (!users || !orders) return [];
        return users.map(user => {
            const userOrders = orders.filter(o => o.userId === user.id);
            const totalSpent = userOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
            return {
                ...user,
                totalOrders: userOrders.length,
                totalSpent: totalSpent,
                orders: userOrders.sort((a,b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
            };
        });
    }, [users, orders]);

    const handleViewDetails = (user) => {
        setSelectedCustomer(user);
        setIsDetailsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedCustomer(null);
        setIsDetailsModalOpen(false);
    };

    const filteredUsers = useMemo(() => {
        return usersWithStats.filter(u =>
            (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [usersWithStats, searchTerm]);

    return (
        React.createElement("div", null,
            React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6" }, "إدارة العملاء"),
             React.createElement("div", { className: "mb-4" },
                React.createElement("input", {
                    type: "text",
                    placeholder: "ابحث عن عميل بالاسم أو البريد الإلكتروني أو الهاتف...",
                    value: searchTerm,
                    onChange: e => setSearchTerm(e.target.value),
                    className: "w-full max-w-sm p-2 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700"
                })
            ),
             isLoading
                ? React.createElement("p", null, "جاري تحميل المستخدمين...")
                : React.createElement("div", { className: "admin-table-container" },
                    React.createElement("table", { className: "admin-table" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "الاسم"),
                                React.createElement("th", null, "البريد الإلكتروني"),
                                React.createElement("th", null, "إجمالي الطلبات"),
                                React.createElement("th", null, "إجمالي الإنفاق"),
                                React.createElement("th", null, "النقاط"),
                                React.createElement("th", null, "الدور"),
                                React.createElement("th", null, "إجراءات")
                            )
                        ),
                        React.createElement("tbody", null,
                            filteredUsers.map(user =>
                                React.createElement("tr", { key: user.id },
                                    React.createElement("td", { className: "font-semibold" }, user.name),
                                    React.createElement("td", null, user.email),
                                    React.createElement("td", { className: "text-center" }, user.totalOrders),
                                    React.createElement("td", null, `${user.totalSpent.toFixed(2)} ج.م`),
                                    React.createElement("td", { className: "text-center" }, user.loyaltyPoints || 0),
                                    React.createElement("td", null, React.createElement("span", { className: `px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-gray-200 dark:bg-dark-600'}` }, user.role || 'user')),
                                    React.createElement("td", null,
                                        React.createElement("button", { onClick: () => handleViewDetails(user), className: "admin-btn text-sm bg-primary/10 text-primary" }, "عرض وتعديل")
                                    )
                                )
                            )
                        )
                    )
                ),
             isDetailsModalOpen && React.createElement(CustomerDetailsModal, {
                isOpen: isDetailsModalOpen,
                onClose: handleCloseModal,
                customer: selectedCustomer,
                onUserUpdate: handleUserUpdate
            })
        )
    );
};

export { UserManagementPanel };