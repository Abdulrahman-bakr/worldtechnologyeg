import React from 'react';
import { CheckIcon, CloseIcon, TrashIcon } from '../../icons/index.js';

const ReviewManagementPanel = ({ reviews, isLoading, handleReviewUpdate, handleReviewDelete }) => {

    const sortedReviews = React.useMemo(() => {
        return [...reviews].sort((a, b) => {
            // Pending reviews first
            if (a.isApproved === false && b.isApproved !== false) return -1;
            if (a.isApproved !== false && b.isApproved === false) return 1;
            // Then sort by date
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : 0;
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : 0;
            return dateB - dateA;
        });
    }, [reviews]);

    return (
        React.createElement("div", null,
            React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6" }, "إدارة مراجعات العملاء"),
            isLoading
                ? React.createElement("p", null, "جاري تحميل المراجعات...")
                : React.createElement("div", { className: "admin-table-container" },
                    React.createElement("table", { className: "admin-table" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "المنتج"),
                                React.createElement("th", null, "المستخدم"),
                                React.createElement("th", null, "التقييم"),
                                React.createElement("th", { className: "w-1/3" }, "التعليق"),
                                React.createElement("th", null, "الحالة"),
                                React.createElement("th", null, "إجراءات")
                            )
                        ),
                        React.createElement("tbody", null,
                            sortedReviews.map(review =>
                                React.createElement("tr", { key: review.id },
                                    React.createElement("td", { className: "font-semibold" }, review.productId), // In a real app, you'd fetch product name
                                    React.createElement("td", null, review.userName),
                                    React.createElement("td", null, `${review.rating} نجوم`),
                                    React.createElement("td", { className: "text-xs" }, review.comment),
                                    React.createElement("td", null,
                                        review.isApproved === false
                                            ? React.createElement("span", { className: "px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800" }, "بانتظار الموافقة")
                                            : React.createElement("span", { className: "px-2 py-1 text-xs rounded-full bg-green-100 text-green-800" }, "تمت الموافقة")
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
                                            onClick: () => handleReviewDelete(review.id),
                                            className: "p-2 hover:text-red-500", title: "حذف"
                                        }, React.createElement(TrashIcon, { className: "w-5 h-5" }))
                                    )
                                )
                            )
                        )
                    )
                )
        )
    );
};

export { ReviewManagementPanel };