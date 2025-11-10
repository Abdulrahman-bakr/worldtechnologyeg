// Defines the types of services that can be created.
export const SERVICE_TYPES = [
    { id: 'mobile-card-topup', label: 'شحن كروت رصيد' },
    { id: 'game-topup', label: 'شحن ألعاب' },
    { id: 'digital_code_topup', label: 'أكواد وبطاقات رقمية' },
    { id: 'internet-bill', label: 'فاتورة إنترنت' },
    { id: 'mobile-credit', label: 'شحن رصيد على الهواء' },
    { id: 'mobile-bill-payment', label: 'فاتورة موبايل' },
    { id: 'landline-bill-payment', label: 'فاتورة أرضي' },
    { id: 'fawry-pay', label: 'دفع فوري' },
    { id: 'train-ticket-booking', label: 'حجز قطارات' },
    { id: 'instapay-transfer', label: 'تحويل إنستاباي' },
    { id: 'cash-to-instapay', label: 'كاش إلى إنستاباي' },
    { id: 'meta_verified_payment', label: 'توثيق حسابات السوشيال ميديا' },
    { id: 'military_travel_permit', label: 'تصريح سفر (التجنيد)' },
    { id: 'interior_travel_permit', label: 'تصريح سفر (الداخلية)' },
    { id: 'flight_ticket_booking', label: 'حجز طيران' },
];

// Defines which form fields to show in the package modal for each service type.
export const SERVICE_PACKAGE_FIELD_CONFIG = {
    'default': ['name', 'price'],
    'mobile-card-topup': ['name', 'price', 'cardValue', 'validity', 'imageUrl', 'benefits', 'showOnCode', 'showOnDirect'],
    'game-topup': ['name', 'price', 'imageUrl', 'popular', 'discount'],
    'meta_verified_payment': ['name', 'price', 'imageUrl'], // ID is handled by variant name logic in the form
    'military_travel_permit': ['name', 'price', 'id'], // 'id' for manual override for specific logic
};