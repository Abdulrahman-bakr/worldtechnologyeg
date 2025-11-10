import React, { memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AllCatIcon,
  ChargerCatIcon,
  CableCatIcon,
  FlashDriveCatIcon,
  KeyboardCatIcon,
  BluetoothHeadphonesCatIcon,
  WiredHeadphonesCatIcon,
  ComputerSpeakersCatIcon,
  MobileCaseCatIcon,
  MouseCatIcon,
  ElectronicPaymentsCatIcon,
  GameTopupCatIcon,
  OtherProductsCatIcon,
} from '../../icons/category/index.js';

const iconMap = {
  All: AllCatIcon,
  Chargers: ChargerCatIcon,
  Cables: CableCatIcon,
  FlashDrives: FlashDriveCatIcon,
  Keyboards: KeyboardCatIcon,
  BluetoothHeadphones: BluetoothHeadphonesCatIcon,
  WiredHeadphones: WiredHeadphonesCatIcon,
  ComputerSpeakers: ComputerSpeakersCatIcon,
  MobileCases: MobileCaseCatIcon,
  Mice: MouseCatIcon,
  ElectronicPayments: ElectronicPaymentsCatIcon,
  GameTopUp: GameTopupCatIcon,
  OtherAccessories: OtherProductsCatIcon,
};

// حركة دخول الأزرار بشكل متدرج
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } },
};

export const CategoryTabs = memo(({ categories, selectedCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = (categoryId) => {
    if (categoryId === 'All') navigate('/products');
    else navigate(`/category/${categoryId}`);
  };

  const isProductsPage = location.pathname === '/products';

  return (
    <div className="py-8 sm:py-10 bg-light-100 dark:bg-dark-800 border-b border-light-200 dark:border-dark-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-8 text-dark-900 dark:text-dark-50"
        >
          تصفح حسب الفئة
        </motion.h2>

        {/* الحاوية الرئيسية */}
        <div className="relative">
          {/* تأثير التدرج الجانبي بتحسين المسافة */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-light-100 dark:from-dark-800 to-transparent z-10 pointer-events-none lg:hidden translate-x-[-6px]" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-light-100 dark:from-dark-800 to-transparent z-10 pointer-events-none lg:hidden translate-x-[6px]" />
          
          {/* الأزرار */}
          <motion.div
  className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent 
             justify-start gap-3 sm:gap-5 pb-4 pl-6 pr-4 sm:pl-8 sm:pr-6
             snap-x snap-mandatory lg:snap-none"

            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(59, 130, 246, 0.2) transparent'
            }}
          >
            {categories.map((category) => {
              const IconComponent = iconMap[category.id];
              const isSelected = selectedCategory === category.id;

              return (
                <motion.button
                  key={category.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(category.id)}
                  className={`group relative flex flex-col items-center justify-center flex-shrink-0 
                  w-20 h-[7.5rem] sm:w-24 sm:h-24 lg:w-28 lg:h-28 
                  rounded-xl border text-xs sm:text-sm font-medium transition-all duration-300
                  snap-start lg:snap-none
                    ${
                      isSelected
                        ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/40 dark:shadow-primary/60 border-primary'
                        : 'bg-white dark:bg-dark-700 text-gray-800 dark:text-gray-200 hover:bg-primary/10 dark:hover:bg-primary/20 border-light-300 dark:border-dark-600 hover:shadow-lg hover:shadow-primary/30 dark:hover:shadow-primary/50'
                    }`}
                >
                  {/* دائرة المؤشر عند التحديد */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        key="selected-dot"
                        layoutId="activeCategory"
                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-800 z-20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* الأيقونة */}
                  <div
                    className={`p-3 rounded-full mb-1 transition-all duration-300 ${
                      isSelected
                        ? 'bg-white/20'
                        : 'bg-light-200 dark:bg-dark-600 group-hover:bg-primary/15'
                    }`}
                  >
                    {IconComponent && (
                      <motion.div
                        whileHover={{ rotate: isSelected ? 0 : 6 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconComponent
                          className={`w-7 h-7 sm:w-9 sm:h-9 transition-colors duration-300 ${
                            isSelected
                              ? 'text-white'
                              : 'text-primary dark:text-primary group-hover:text-primary-dark dark:group-hover:text-primary-light'
                          }`}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* النص */}
                  <span
                    className={`text-center leading-tight font-semibold tracking-wide transition-all duration-300 px-1
                      ${
                        isSelected
                          ? 'text-white'
                          : 'text-gray-800 dark:text-gray-200 group-hover:text-primary group-hover:brightness-125'
                      }`}
                  >
                    {category.arabicName}
                  </span>

                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* نص توجيهي */}
        {isProductsPage && !selectedCategory && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6 text-gray-600 dark:text-gray-400 text-sm"
          >
            اختر فئة لتصفية المنتجات
          </motion.p>
        )}

        {/* مؤشر التمرير للشاشات الصغيرة */}
        <div className="text-center mt-4 lg:hidden">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            اسحب لليمين لرؤية المزيد من الفئات
          </span>
        </div>
      </div>
    </div>
  );
});
