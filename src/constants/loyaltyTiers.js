

export const LOYALTY_TIERS_FALLBACK = {
    GOLD: { name: "ذهبي", minPoints: 5000, discount: 0.05, color: "text-yellow-400", bgColor: "bg-yellow-400/10", progressColor: "bg-yellow-400", benefits: { freeShipping: false, prioritySupport: false, earlyAccess: false } },
    SILVER: { name: "فضي", minPoints: 1000, discount: 0.02, color: "text-gray-300", bgColor: "bg-gray-400/10", progressColor: "bg-gray-300", benefits: { freeShipping: false, prioritySupport: false, earlyAccess: false } },
    BRONZE: { name: "برونزي", minPoints: 0, discount: 0, color: "text-orange-400", bgColor: "bg-orange-400/10", progressColor: "bg-orange-400", benefits: { freeShipping: false, prioritySupport: false, earlyAccess: false } }
};

export const LOYALTY_TIERS = LOYALTY_TIERS_FALLBACK;