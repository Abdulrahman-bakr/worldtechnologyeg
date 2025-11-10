import React from 'react';
import { VodafoneLogoIcon, InstapayLogoIcon } from '../../icons/logo/index.js';

const PaymentIcon = ({ title, children }) => (
  <div className="flex flex-col items-center gap-1 text-center">
    <div className="flex items-center justify-center w-12 h-12 bg-white dark:bg-dark-700 rounded-xl shadow-soft border border-light-200 dark:border-dark-600 transition-all duration-300 hover:shadow-elevated hover:scale-105">
      {children}
    </div>
    <span className="text-[10px] font-medium text-dark-700 dark:text-dark-200">{title}</span>
  </div>
);

const AppIcon = ({ platform, comingSoon }) => {
  const platformStyles = {
    apple: {
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-900 dark:text-white">
          <path d="M15.54,4.22 C14.39,4.48,13.29,4.83,12.24,5.27c0.05-0.34,0.08-0.68,0.08-1.03c0-1.05-0.37-1.94-1.12-2.68C10.46,0.82,9.57,0.46,8.52,0.46 c-0.7,0-1.33,0.18-1.9,0.53C6.06,1.33,5.64,1.8,5.32,2.38C4.33,4.1,4.24,6.08,4.99,8.32c0.75,2.24,2.15,4,4.19,5.27 c1.07,0.67,2.18,1,3.31,1c0.14,0,0.28-0.01,0.42-0.02c1.2-0.12,2.44-0.63,3.7-1.52c0-2.1-0.79-3.95-2.36-5.56 c-1.57-1.61-3.4-2.41-5.48-2.41c-0.4,0-0.8,0.04-1.18,0.13c1.58-1.22,2.54-2.82,2.88-4.81C16.14,4.82,15.86,4.5,15.54,4.22z" />
        </svg>
      ),
      text: 'App Store'
    },
    google: {
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-900 dark:text-white">
          <path d="M3 2v20l18-10L3 2zm5.93 10L5 14.39V9.61L8.93 12zM17.2 14.39L13.27 12 17.2 9.61v4.78z" />
        </svg>
      ),
      text: 'Google Play'
    }
  };

  const styles = platformStyles[platform];

  return (
    <div
      onClick={() => comingSoon && alert('🚧 التطبيق قيد التطوير وسيتم إطلاقه قريبًا!')}
      title={comingSoon ? 'قريباً...' : `نزله من ${styles.text}`}
      className={`flex flex-col items-center justify-center w-12 h-12 bg-white dark:bg-dark-700 rounded-xl border border-light-200 dark:border-dark-600 shadow-soft cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elevated ${comingSoon ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {styles.logo}
    </div>
  );
};

const FooterPayments = () => {
  return (
    <div className="space-y-1.5">
      {/* طرق الدفع */}
      <h4
        className="text-lg font-semibold text-dark-900 dark:text-white mb-4 relative pb-2 
        after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-12 after:h-1 
        after:bg-gradient-to-r after:from-primary after:to-secondary after:rounded-full"
      >
        طرق الدفع المتاحة
      </h4>
      <div className="flex justify-start items-center gap-4">
        <PaymentIcon title="عند الاستلام">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m18 0h-4.5M3.75 18h4.5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </PaymentIcon>

        <PaymentIcon title="فودافون كاش">
          <VodafoneLogoIcon className="w-7 h-7 object-contain" />
        </PaymentIcon>

        <PaymentIcon title="إنستا باي">
          <InstapayLogoIcon className="w-7 h-7 object-contain" />
        </PaymentIcon>
      </div>

      {/* تنزيل التطبيق */}
      <div className="pt-6">
        <h4
          className="text-lg font-semibold text-dark-900 dark:text-white mb-4 relative pb-2 
          after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-12 after:h-1 
          after:bg-gradient-to-r after:from-primary after:to-secondary after:rounded-full"
        >
          تنزيل التطبيق
        </h4>
        <div className="flex justify-start items-center gap-4">
          <AppIcon platform="apple" comingSoon={true} />
          <AppIcon platform="google" comingSoon={true} />
        </div>
      </div>
    </div>
  );
};

export { FooterPayments };

