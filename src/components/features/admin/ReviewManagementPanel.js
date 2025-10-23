import React, { useState, useMemo } from 'react';
import { CheckIcon, CloseIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from '../../icons/index.js';

const ReviewManagementPanel = ({ reviews, products, isLoading, handleReviewUpdate, handleReviewDelete }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const reviewsWithProductNames = useMemo(() => {
        return reviews.map(review => {
            let productName = 'منتج غير معروف';
            if (!review.productId) {
                 productName = 'منتج غير معروف';
            } else if (typeof review.productId === 'object' && review.productId !== null && review.productId.arabicName) {
                 productName = review.productId.arabicName;
            } else if (typeof review.productId === 'string') {
                const product = (products || []).find(p => p.id === review.productId);
                productName = product ? product.arabicName : `(منتج محذوف: ${review.productId})`;
            }
            return { ...review, productName };
        });
    }, [reviews, products]);

    const sortedReviews = React.useMemo(() => {
        let sortableItems = [...reviewsWithProductNames];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                
                // Handle date sorting
                if (sortConfig.key === 'createdAt') {
                    aValue = a.createdAt?.getTime ? a.createdAt.getTime() : 0;
                    bValue = b.createdAt?.getTime ? b.createdAt.getTime() : 0;
                }
                
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                    return 0;
                }
                
                const aStr = String(aValue || '').toLowerCase();
                const bStr = String(bValue || '').toLowerCase();
                
                if (aStr < bStr) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aStr > bStr) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        // Default secondary sort for pending
        sortableItems.sort((a, b) => {
            if (a.isApproved === false && b.isApproved !== false) return -1;
            if (a.isApproved !== false && b.isApproved === false) return 1;
            return 0;
        });
        return sortableItems;
    }, [reviewsWithProductNames, sortConfig]);

    const onDelete = (reviewId) => {
        if (window.confirm('هل أنت متأكد من حذف هذه المراجعة؟')) {
            handleReviewDelete(reviewId);
        }
    };
    
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
            React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6" }, "إدارة مراجعات العملاء"),
            isLoading
                ? React.createElement("p", null, "جاري تحميل المراجعات...")
                : React.createElement("div", { className: "admin-table-container" },
                    React.createElement("table", { className: "admin-table" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement(SortableHeader, { sortKey: "productName" }, "المنتج"),
                                React.createElement(SortableHeader, { sortKey: "userName" }, "المستخدم"),
                                React.createElement(SortableHeader, { sortKey: "rating" }, "التقييم"),
                                React.createElement("th", { className: "w-1/3" }, "التعليق"),
                                React.createElement(SortableHeader, { sortKey: "isApproved" }, "الحالة"),
                                React.createElement("th", null, "إجراءات")
                            )
                        ),
                        React.createElement("tbody", null,
                            sortedReviews.map(review => (
                                React.createElement("tr", { key: review.id },
                                    React.createElement("td", { className: "font-semibold" }, review.productName),
                                    React.createElement("td", null, review.userName),
                                    React.createElement("td", null, `${review.rating} نجوم`),
                                    React.createElement("td", { className: "text-xs" }, review.comment),
                                    React.createElement("td", null,
                                        review.isApproved === false
                                            ? React.createElement("span", { className: "px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300" }, "بانتظار الموافقة")
                                            : React.createElement("span", { className: "px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" }, "تمت الموافقة")
                                    ),
                                    React.createElement("td", { className: "space-x-1 space-x-reverse" },
                                        review.isApproved === false && React.createElement("button", {
                                            onClick: () => handleReviewUpdate(review.id, { isApproved: true }),
                                            className: "p-2 hover:text-green-500", title: "موافقة"
                                        }, React.createElement(CheckIcon, { className: "w-5 h-5" })),
                                        review.isApproved === true && React.createElement("button", {
                                            onClick: () => handleReviewUpdate(review.id, { isApproved: false }),
                                            className: "p-2 hover:text-yellow-500", title: "إلغاء الموافقة"
                                        }, React.createElement(CloseIcon, { className: "w-5 h-5" })),
                                        React.createElement("button", {
                                            onClick: () => onDelete(review.id),
                                            className: "p-2 hover:text-red-500", title: "حذف"
                                        }, React.createElement(TrashIcon, { className: "w-5 h-5" }))
                                    )
                                )
                            ))
                        )
                    )
                )
        )
    );
};

export { ReviewManagementPanel };