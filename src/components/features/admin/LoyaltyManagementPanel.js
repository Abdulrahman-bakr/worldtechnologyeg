// world-technology-store/src/components/features/admin/LoyaltyManagementPanel.js

import React, { useState, useEffect, useMemo } from 'react';
import { LOYALTY_TIERS_FALLBACK } from '../../../constants/loyaltyTiers.js';

const TierEditCard = ({ tierKey, tierData, onUpdate, isSaving }) => {
    const [localData, setLocalData] = useState(tierData);

    useEffect(() => {
        setLocalData(tierData);
    }, [tierData]);

    const handleChange = (field, value) => {
        const newData = { ...localData, [field]: value };
        setLocalData(newData);
        onUpdate(tierKey, newData);
    };

    const handleBenefitChange = (benefitKey, value) => {
        const newBenefits = { ...(localData.benefits || {}), [benefitKey]: value };
        handleChange('benefits', newBenefits);
    };

    const inputClass = "w-full p-2 rounded-md border bg-white dark:bg-dark-700 border-light-300 dark:border-dark-600";
    const labelClass = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";

    return React.createElement("div", { className: `p-4 border-l-4 rounded-lg bg-light-50 dark:bg-dark-700 ${tierData.bgColor.replace('bg-', 'border-')}` },
        React.createElement("h3", { className: `text-lg font-bold ${tierData.color}` }, `المستوى ${tierData.name}`),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" },
            React.createElement("div", null,
                React.createElement("label", { className: labelClass }, "الحد الأدنى للنقاط"),
                React.createElement("input", { type: "number", value: localData.minPoints, onChange: e => handleChange('minPoints', Number(e.target.value)), className: inputClass, disabled: isSaving || tierKey === 'BRONZE' })
            ),
            React.createElement("div", null,
                React.createElement("label", { className: labelClass }, "نسبة الخصم (%)"),
                React.createElement("input", { type: "number", step: "0.1", value: (localData.discount || 0) * 100, onChange: e => handleChange('discount', Number(e.target.value) / 100), className: inputClass, disabled: isSaving })
            )
        ),
        React.createElement("div", { className: "mt-4" },
            React.createElement("h4", { className: "font-medium mb-2 text-dark-800 dark:text-dark-100" }, "المزايا الإضافية"),
            React.createElement("div", { className: "space-y-2" },
                React.createElement("label", { className: "flex items-center gap-2 text-sm" },
                    React.createElement("input", { type: "checkbox", checked: !!localData.benefits?.freeShipping, onChange: e => handleBenefitChange('freeShipping', e.target.checked), className: "form-checkbox rounded text-primary", disabled: isSaving }),
                    "شحن مجاني"
                ),
                React.createElement("label", { className: "flex items-center gap-2 text-sm" },
                    React.createElement("input", { type: "checkbox", checked: !!localData.benefits?.prioritySupport, onChange: e => handleBenefitChange('prioritySupport', e.target.checked), className: "form-checkbox rounded text-primary", disabled: isSaving }),
                    "أولوية في خدمة العملاء"
                ),
                 React.createElement("label", { className: "flex items-center gap-2 text-sm" },
                    React.createElement("input", { type: "checkbox", checked: !!localData.benefits?.earlyAccess, onChange: e => handleBenefitChange('earlyAccess', e.target.checked), className: "form-checkbox rounded text-primary", disabled: isSaving }),
                    "وصول مبكر للعروض"
                )
            )
        )
    );
};

const LoyaltyManagementPanel = ({ orders, users, loyaltySettings, handleLoyaltySettingsSave, isLoading }) => {
    const [localSettings, setLocalSettings] = useState(loyaltySettings || LOYALTY_TIERS_FALLBACK);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (loyaltySettings) {
            setLocalSettings(loyaltySettings);
        }
    }, [loyaltySettings]);

    const handleTierUpdate = (tierKey, newData) => {
        setLocalSettings(prev => ({ ...prev, [tierKey]: newData }));
    };

    const onSave = async () => {
        setIsSaving(true);
        await handleLoyaltySettingsSave(localSettings);
        setIsSaving(false);
    };
    
    const reports = useMemo(() => {
        const totalPointsEarned = (orders || [])
            .filter(o => o.pointsAwarded && o.pointsToEarn > 0)
            .reduce((sum, o) => sum + o.pointsToEarn, 0);

        const totalPointsRedeemed = (orders || [])
            .filter(o => o.pointsRedeemed && o.pointsRedeemed > 0)
            .reduce((sum, o) => sum + o.pointsRedeemed, 0);

        const totalAvailablePoints = (users || [])
            .reduce((sum, u) => sum + (u.loyaltyPoints || 0), 0);

        return { totalPointsEarned, totalPointsRedeemed, totalAvailablePoints };
    }, [orders, users]);

    if (isLoading) return React.createElement("p", null, "جاري التحميل...");
    
    return React.createElement("div", { className: "space-y-8" },
        React.createElement("div", { className: "flex justify-between items-center" },
            React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50" }, "إدارة برنامج الولاء"),
            React.createElement("button", { onClick: onSave, disabled: isSaving, className: "admin-btn admin-btn-primary" }, isSaving ? 'جاري الحفظ...' : "حفظ التغييرات")
        ),

        React.createElement("section", { className: "p-6 bg-white dark:bg-dark-800 rounded-lg border border-light-200 dark:border-dark-700" },
            React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "قواعد المستويات"),
            React.createElement("div", { className: "space-y-6" },
                React.createElement(TierEditCard, { tierKey: "BRONZE", tierData: localSettings.BRONZE, onUpdate: handleTierUpdate, isSaving: isSaving }),
                React.createElement(TierEditCard, { tierKey: "SILVER", tierData: localSettings.SILVER, onUpdate: handleTierUpdate, isSaving: isSaving }),
                React.createElement(TierEditCard, { tierKey: "GOLD", tierData: localSettings.GOLD, onUpdate: handleTierUpdate, isSaving: isSaving })
            )
        ),
        
        React.createElement("section", { className: "p-6 bg-white dark:bg-dark-800 rounded-lg border border-light-200 dark:border-dark-700" },
            React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "تقارير النقاط"),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-center" },
                React.createElement("div", { className: "p-4 bg-light-100 dark:bg-dark-700 rounded-lg" },
                    React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, "إجمالي النقاط المكتسبة"),
                    React.createElement("p", { className: "text-2xl font-bold text-green-500" }, reports.totalPointsEarned.toLocaleString('ar-EG'))
                ),
                React.createElement("div", { className: "p-4 bg-light-100 dark:bg-dark-700 rounded-lg" },
                    React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, "إجمالي النقاط المستبدلة"),
                    React.createElement("p", { className: "text-2xl font-bold text-red-500" }, reports.totalPointsRedeemed.toLocaleString('ar-EG'))
                ),
                React.createElement("div", { className: "p-4 bg-light-100 dark:bg-dark-700 rounded-lg" },
                    React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, "النقاط المتاحة لدى العملاء"),
                    React.createElement("p", { className: "text-2xl font-bold text-blue-500" }, reports.totalAvailablePoints.toLocaleString('ar-EG'))
                )
            )
        )
    );
};

export { LoyaltyManagementPanel };