import React from 'react';
import { useApp } from '../../contexts/AppContext.js';
import { AnnouncementBanner } from '../ui/AnnouncementBanner.js';
import { LimitedTimeOfferBanner } from '../ui/LimitedTimeOfferBanner.js';

export const BannerRotator = () => {
    const {
        currentView,
        rotatingBanners,
        currentBannerIndex,
        handleGoToBanner,
        handleDismissBanner,
        handleNavigation
    } = useApp();
    
    if (currentView === 'productDetail' || rotatingBanners.length === 0) {
        return null;
    }

    return (
        React.createElement("div", { className: "relative" },
            (() => {
                const currentBanner = rotatingBanners[currentBannerIndex];
                if (!currentBanner) return null;

                switch (currentBanner.type) {
                    case 'offer':
                        return React.createElement(LimitedTimeOfferBanner, {
                            product: currentBanner.data,
                            onDismiss: () => handleDismissBanner(currentBanner.id),
                            onNavigate: handleNavigation,
                        });
                    case 'announcement':
                        return React.createElement(AnnouncementBanner, {
                            announcement: currentBanner.data,
                            onDismiss: () => handleDismissBanner(currentBanner.id),
                            onNavigate: handleNavigation
                        });
                    default:
                        return null;
                }
            })(),
            
            rotatingBanners.length > 1 && (
                React.createElement("div", {
                    className: "absolute bottom-1 left-1/2 -translate-x-1/2 flex justify-center items-center space-x-2 z-10"
                },
                    rotatingBanners.map((_, index) =>
                        React.createElement("button", {
                            key: `dot-${index}`,
                            onClick: () => handleGoToBanner(index),
                            "aria-label": `الانتقال إلى الإعلان ${index + 1}`,
                            className: `rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
                                currentBannerIndex === index
                                ? 'w-6 h-2 bg-primary shadow-md'
                                : 'w-2 h-2 bg-white/60 dark:bg-dark-700/60 hover:bg-white'
                            }`
                        })
                    )
                )
            )
        )
    );
};
