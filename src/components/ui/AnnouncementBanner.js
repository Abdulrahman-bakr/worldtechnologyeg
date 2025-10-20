import React from 'react';
import { MegaphoneIcon, StarIcon, ShoppingBagIcon, CloseIcon } from '../icons/index.js';

const AnnouncementBanner = ({ announcement, onDismiss, onNavigate }) => {
  if (!announcement) {
    return null;
  }

  const { icon, title, message, link, imageUrl } = announcement;

  const iconMap = {
    MegaphoneIcon: MegaphoneIcon,
    StarIcon: StarIcon,
    ShoppingBagIcon: ShoppingBagIcon,
  };

  const IconComponent = iconMap[icon] || MegaphoneIcon;

  const handleBannerClick = (e) => {
    if (e.target.closest('.dismiss-button')) {
      return;
    }
    if (link && link.action && onNavigate) {
        try {
            const params = link.params ? JSON.parse(link.params) : {};
            onNavigate(link.action, params);
        } catch(err) {
            console.error("Failed to parse link params for announcement:", err);
        }
    }
  };
  
  const handleDismiss = (e) => {
      e.stopPropagation(); 
      onDismiss();
  };

  const bannerClasses = `
    relative bg-gradient-to-r from-primary to-secondary
    dark:from-primary/80 dark:to-secondary/80 
    text-white p-3 sm:p-4
    ${link && link.action ? 'cursor-pointer' : ''}
  `;

  return React.createElement("div", {
      className: bannerClasses,
      onClick: handleBannerClick,
      role: link && link.action ? 'link' : 'region',
      "aria-label": title,
      tabIndex: link && link.action ? 0 : -1,
      onKeyDown: (e) => { if (link && link.action && (e.key === 'Enter' || e.key === ' ')) handleBannerClick(e); }
    },
    React.createElement("div", { className: "container mx-auto" },
      React.createElement("div", { className: "flex items-center justify-between" },
        React.createElement("div", { className: "flex items-center space-x-3 space-x-reverse" },
          imageUrl 
            ? React.createElement("img", { src: imageUrl, alt: title, className: "w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md flex-shrink-0" })
            : React.createElement(IconComponent, { className: "w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" }),
          React.createElement("div", null,
            React.createElement("h3", { className: "font-bold text-sm sm:text-base" }, title),
            React.createElement("p", { className: "text-xs sm:text-sm opacity-90" }, message)
          )
        ),
        React.createElement("button", {
          onClick: handleDismiss,
          "aria-label": "إغلاق الإعلان",
          className: "dismiss-button p-1.5 rounded-full hover:bg-black/20 transition-colors flex-shrink-0 ml-2",
        },
          React.createElement(CloseIcon, { className: "w-5 h-5" })
        )
      )
    )
  );
};

export { AnnouncementBanner };