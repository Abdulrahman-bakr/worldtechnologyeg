import React, { useState, useMemo } from 'react';
import { CustomerDetailsModal } from './CustomerDetailsModal.js'; // Changed import
import { ChevronUpIcon, ChevronDownIcon } from '../../icons/index.js';

const UserManagementPanel = ({ users, orders, isLoading, handleUserUpdate }) => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

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
    
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = useMemo(() => {
        let sortableItems = [...usersWithStats];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [usersWithStats, sortConfig]);

    const handleViewDetails = (user) => {
        setSelectedCustomer(user);
        setIsDetailsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedCustomer(null);
        setIsDetailsModalOpen(false);
    };

    const filteredUsers = useMemo(() => {
        return sortedUsers.filter(u =>
            (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedUsers, searchTerm]);

    const SortableHeader = ({ children, sortKey }) => (
        React.createElement("th", null,
            React.createElement("button", { onClick: () => requestSort(sortKey), className: "flex items-center gap-1 group" },
                children,
                React.createElement("span", { className: "opacity-30 group-hover:opacity-100 transition-opacity" },
                    sortConfig.key === sortKey
                        ? (sortConfig.direction === 'ascending' ? React.createElement(ChevronUpIcon, { className: "w-4 h-4" }) : React.createElement(ChevronDownIcon, { className: "w-4 h-4" }))
                        : React.createElement(ChevronUpIcon, { className: "w-4 h-4 opacity-0 group-hover:opacity-30" })
                )
            )
        )
    );

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
                                React.createElement(SortableHeader, { sortKey: "name" }, "الاسم"),
                                React.createElement(SortableHeader, { sortKey: "email" }, "البريد الإلكتروني"),
                                React.createElement(SortableHeader, { sortKey: "totalOrders" }, "إجمالي الطلبات"),
                                React.createElement(SortableHeader, { sortKey: "totalSpent" }, "إجمالي الإنفاق"),
                                React.createElement(SortableHeader, { sortKey: "loyaltyPoints" }, "النقاط"),
                                React.createElement(SortableHeader, { sortKey: "role" }, "الدور"),
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