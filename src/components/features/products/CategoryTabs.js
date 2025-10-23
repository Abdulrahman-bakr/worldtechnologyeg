import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    "All": AllCatIcon,
    "Chargers": ChargerCatIcon,
    "Cables": CableCatIcon,
    "FlashDrives": FlashDriveCatIcon,
    "Keyboards": KeyboardCatIcon,
    "BluetoothHeadphones": BluetoothHeadphonesCatIcon,
    "WiredHeadphones": WiredHeadphonesCatIcon,
    "ComputerSpeakers": ComputerSpeakersCatIcon,
    "MobileCases": MobileCaseCatIcon,
    "Mice": MouseCatIcon,
    "ElectronicPayments": ElectronicPaymentsCatIcon,
    "GameTopUp": GameTopupCatIcon,
    "OtherAccessories": OtherProductsCatIcon,
};

const CategoryTabs = ({ categories, selectedCategory }) => {
  const navigate = useNavigate();

  const handleSelect = (categoryId) => {
    if (categoryId === 'All') {
      navigate('/products');
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  return React.createElement("div", { className: "py-8 sm:py-10 bg-light-100 dark:bg-dark-800 border-b border-light-200 dark:border-dark-700" },
    React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8" },
      React.createElement("h2", { className: "text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-dark-900 dark:text-dark-50" }, "تصفح حسب الفئة"),
      React.createElement("div", { className: "flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4" },
        categories.map((category) => {
          const IconComponent = iconMap[category.id];
          return React.createElement("button", {
            key: category.id,
            onClick: () => handleSelect(category.id),
            className: `flex items-center space-x-1.5 space-x-reverse px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md ${selectedCategory === category.id ? 'bg-primary text-white' : 'bg-white dark:bg-dark-700 text-dark-700 dark:text-dark-100 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary border border-light-300 dark:border-dark-600'}`
          }, 
            React.createElement("span", null, category.arabicName),
            IconComponent && React.createElement(IconComponent, { className: "w-5 h-5 object-contain" }) 
          )
        })
      )
    )
  );
};
export { CategoryTabs };