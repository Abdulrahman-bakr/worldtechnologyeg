import React, { useState } from 'react';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from '../../icons/index.js';
import { FeeRuleTierFormModal } from './FeeRuleTierFormModal.js';
import { FeeRuleFormModal } from './FeeRuleFormModal.js'; // Import the new modal

const FeeRuleManagementPanel = ({ feeRules, isLoading, handleFeeRuleSave, handleFeeRuleTierSave, handleFeeRuleTierDelete }) => {
    const [isTierModalOpen, setIsTierModalOpen] = useState(false);
    const [editingData, setEditingData] = useState({ rule: null, tier: null });
    const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false);

    const handleOpenTierModal = (rule, tier = null) => {
        setEditingData({ rule, tier });
        setIsTierModalOpen(true);
    };

    const handleCloseTierModal = () => {
        setEditingData({ rule: null, tier: null });
        setIsTierModalOpen(false);
    };

    const handleOpenNewRuleModal = () => setIsNewRuleModalOpen(true);
    const handleCloseNewRuleModal = () => setIsNewRuleModalOpen(false);

    const handleTierSave = async (tierData) => {
        const result = await handleFeeRuleTierSave(editingData.rule.id, tierData, editingData.tier);
        if (result.success) {
            handleCloseTierModal();
        } else {
            console.error("Failed to save tier:", result.error);
        }
    };
    
    const handleNewRuleSave = async (ruleData) => {
        const result = await handleFeeRuleSave(ruleData);
        if (result.success) {
            handleCloseNewRuleModal();
        } else {
            console.error("Failed to save fee rule:", result.error);
        }
    };

    const handleDelete = async (rule, tier) => {
        await handleFeeRuleTierDelete(rule.id, tier);
    };

    return (
        React.createElement("div", null,
            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("h1", { className: "text-2xl font-bold text-dark-900 dark:text-dark-50" }, "إدارة قواعد الرسوم"),
                React.createElement("button", { onClick: handleOpenNewRuleModal, className: "admin-btn admin-btn-primary" },
                    React.createElement(PlusCircleIcon, { className: "w-5 h-5" }),
                    "إضافة قاعدة جديدة"
                )
            ),
             isLoading
                ? React.createElement("p", null, "جاري تحميل قواعد الرسوم...")
                : React.createElement("div", { className: "space-y-8" },
                    feeRules.map(rule => (
                        React.createElement("div", { key: rule.id, className: "p-6 bg-white dark:bg-dark-800 rounded-lg border border-light-200 dark:border-dark-700" },
                            React.createElement("div", { className: "flex justify-between items-center mb-4" },
                                React.createElement("h2", { className: "text-xl font-semibold" }, `قاعدة: ${rule.id}`),
                                React.createElement("button", { onClick: () => handleOpenTierModal(rule), className: "admin-btn text-sm bg-primary/10 text-primary hover:bg-primary/20" },
                                    React.createElement(PlusCircleIcon, { className: "w-4 h-4" }),
                                    "إضافة شريحة"
                                )
                            ),
                            React.createElement("div", { className: "admin-table-container" },
                                React.createElement("table", { className: "admin-table" },
                                    React.createElement("thead", null,
                                        React.createElement("tr", null,
                                            React.createElement("th", null, "الحد الأدنى للمبلغ"),
                                            React.createElement("th", null, "الحد الأقصى للمبلغ"),
                                            React.createElement("th", null, "الرسوم"),
                                            React.createElement("th", null, "إجراءات")
                                        )
                                    ),
                                    React.createElement("tbody", null,
                                        (rule.tiers && rule.tiers.length > 0)
                                        ? rule.tiers.sort((a,b) => a.minAmount - b.minAmount).map((tier, index) =>
                                            React.createElement("tr", { key: tier.id || index },
                                                React.createElement("td", null, `${tier.minAmount} ج.م`),
                                                React.createElement("td", null, `${tier.maxAmount} ج.م`),
                                                React.createElement("td", { className: "font-semibold" }, `${tier.fee} ج.م`),
                                                React.createElement("td", { className: "space-x-2 space-x-reverse" },
                                                    React.createElement("button", { onClick: () => handleOpenTierModal(rule, tier), className: "p-2 hover:text-primary" }, React.createElement(PencilSquareIcon, { className: "w-5 h-5" })),
                                                    React.createElement("button", { onClick: () => handleDelete(rule, tier), className: "p-2 hover:text-red-500" }, React.createElement(TrashIcon, { className: "w-5 h-5" }))
                                                )
                                            )
                                        )
                                        : React.createElement("tr", null,
                                            React.createElement("td", { colSpan: "4", className: "text-center py-4 text-dark-600 dark:text-dark-300" }, "لا توجد شرائح مضافة لهذه القاعدة بعد.")
                                          )
                                    )
                                )
                            )
                        )
                    ))
                ),
            isTierModalOpen && React.createElement(FeeRuleTierFormModal, {
                isOpen: isTierModalOpen,
                onClose: handleCloseTierModal,
                onSave: handleTierSave,
                tierData: editingData.tier
            }),
            isNewRuleModalOpen && React.createElement(FeeRuleFormModal, {
                isOpen: isNewRuleModalOpen,
                onClose: handleCloseNewRuleModal,
                onSave: handleNewRuleSave,
            })
        )
    );
};

export { FeeRuleManagementPanel };