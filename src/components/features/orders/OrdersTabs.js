import React from 'react';
import { motion } from 'framer-motion';
import { getStatusDisplayInfo, ORDER_STATUS_GROUPS } from './ordersUtils.js';

const OrdersTabs = ({
    selectedStatusTab,
    selectedGroupTitle,
    handleAllSelect,
    handleGroupSelect,
    handleStatusSelect
}) => {
    return (
        <div className="mb-8">
            {/* Main Tabs */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                role="tablist" 
                aria-label="فئات الطلبات" 
                className="flex flex-wrap justify-center gap-3 mb-6"
            >
                {/* All Tab */}
                <motion.button
                    key="all"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    id="tab-all"
                    role="tab"
                    aria-selected={selectedStatusTab === "all"}
                    onClick={handleAllSelect}
                    className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-lg border backdrop-blur-sm ${
                        selectedStatusTab === "all" 
                            ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-primary/25 border-primary/20' 
                            : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary border-gray-200 dark:border-gray-600'
                    }`}
                >
                    الكل
                </motion.button>

                {/* Group Tabs */}
                {ORDER_STATUS_GROUPS.map((group, index) => {
                    const isGroupActive = selectedGroupTitle === group.title;
                    const isGroupSelectedForFilter = selectedStatusTab === `group:${group.title}`;
                    const isActive = isGroupActive || isGroupSelectedForFilter;
                    
                    return (
                        <motion.button
                            key={group.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            id={`tab-group-${group.title.replace(/\s/g, '-')}`}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => handleGroupSelect(group)}
                            className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-lg border backdrop-blur-sm ${
                                isActive
                                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-primary/25 border-primary/20' 
                                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary border-gray-200 dark:border-gray-600'
                            }`}
                        >
                            {group.title}
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* Sub Tabs - Only show when a group is selected */}
            {selectedGroupTitle && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    id="sub-tabs-panel"
                    className="flex flex-wrap justify-center gap-2 p-6 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-inner"
                >
                    {(ORDER_STATUS_GROUPS.find(g => g.title === selectedGroupTitle)?.statuses || []).map((statusKey, index) => {
                        const statusInfo = getStatusDisplayInfo(statusKey);
                        const isActive = selectedStatusTab === statusKey;
                        
                        return (
                            <motion.button
                                key={statusKey}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                id={`tab-${statusKey}`}
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => handleStatusSelect(statusKey)}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 shadow-md border backdrop-blur-sm ${
                                    isActive
                                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-primary/20 border-primary/20' 
                                        : 'bg-white/70 dark:bg-gray-700/70 text-gray-600 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary border-gray-150 dark:border-gray-600'
                                }`}
                            >
                                {statusInfo.text}
                            </motion.button>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
};

export { OrdersTabs };