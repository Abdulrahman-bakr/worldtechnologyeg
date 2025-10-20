export const ORDER_STATUS_GROUPS = [
    {
        title: "تحت المراجعة",
        statuses: ["pending_payment_confirmation", "processing", "failed_payment"]
    },
    {
        title: "قيد التجهيز والشحن",
        statuses: ["pending_fulfillment", "pending_delivery", "shipped"]
    },
    {
        title: "الطلبات المكتملة",
        statuses: ["delivered", "cancelled"]
    }
];

export const getStatusDisplayInfo = (statusKey) => {
    const statusMap = {
      pending_payment_confirmation: { text: "بانتظار تأكيد الدفع", colorClass: "border-yellow-500 bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300", icon: '🕒' },
      pending_fulfillment: { text: "قيد التجهيز", colorClass: "border-blue-500 bg-blue-100/80 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300", icon: '📦' },
      pending_delivery: { text: "قيد التوصيل", colorClass: "border-sky-500 bg-sky-100/80 text-sky-800 dark:bg-sky-900/20 dark:text-sky-300", icon: '🚚' },
      processing: { text: "قيد المراجعة", colorClass: "border-orange-500 bg-orange-100/80 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300", icon: '🔍' },
      shipped: { text: "تم الشحن", colorClass: "border-cyan-500 bg-cyan-100/80 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300", icon: '✈️' },
      delivered: { text: "تم التسليم", colorClass: "border-green-500 bg-green-100/80 text-green-800 dark:bg-green-900/20 dark:text-green-300", icon: '✅' },
      cancelled: { text: "ملغي", colorClass: "border-red-500 bg-red-100/80 text-red-800 dark:bg-red-900/20 dark:text-red-300", icon: '❌' },
      failed_payment: { text: "فشل الدفع", colorClass: "border-red-600 bg-red-200/80 text-red-900 dark:bg-red-900/30 dark:text-red-200", icon: '💳' },
      default: { text: statusKey || "غير معروف", colorClass: "border-gray-500 bg-gray-100/80 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300", icon: '❔' }
    };
    return statusMap[statusKey] || statusMap.default;
};

export const getOrderSummary = (items) => {
    if (!items || items.length === 0) return "لا توجد منتجات.";
    const firstItemName = items[0].name;
    if (items.length === 1) {
        return firstItemName;
    }
    return `${firstItemName} و ${items.length - 1} منتجات أخرى`;
};
