import React from 'react';

export const AcademicCapIcon = ({ 
  size = 48, 
  className = '', 
  style = {}, 
  ...restProps 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size}
      height={size}
      x="0"
      y="0"
      viewBox="0 0 48 48"
      style={{
        enableBackground: 'new 0 0 512 512',
        ...style
      }}
      xmlSpace="preserve"
      className={className}
      {...restProps}
    >
      <defs>
        <linearGradient id="grad-c" x1="11.694" x2="32.904" y1="3.002" y2="14.009" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3e4154"></stop>
          <stop offset="1" stopColor="#1b2129"></stop>
        </linearGradient>
        <linearGradient id="grad-a" x1="24" x2="24" y1="27.548" y2="48.275" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4793eb"></stop>
          <stop offset="1" stopColor="#2367ec"></stop>
        </linearGradient>
        <linearGradient id="grad-d" x1="24" x2="24" y1="34.618" y2="47.709" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2b50d2"></stop>
          <stop offset="1" stopColor="#182ea5"></stop>
        </linearGradient>
        <linearGradient id="grad-e" x1="13.043" x2="17.801" y1="37.993" y2="39.943" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff"></stop>
          <stop offset="1" stopColor="#dadfe0"></stop>
        </linearGradient>
        <linearGradient id="grad-f" x1="24" x2="24" y1="27.166" y2="34.66" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6fc6fc"></stop>
          <stop offset="1" stopColor="#50a7f6"></stop>
        </linearGradient>
        <linearGradient id="grad-g" x1="19.655" x2="28.827" y1="26.465" y2="30.936" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f1d2bd"></stop>
          <stop offset="1" stopColor="#feb592"></stop>
        </linearGradient>
        <linearGradient id="grad-b" x1="31.5" x2="31.5" y1="19.255" y2="23.77" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c6cbcc"></stop>
          <stop offset="1" stopColor="#9fa5a6"></stop>
        </linearGradient>
        <linearGradient xlinkHref="#grad-a" id="grad-h" x1="34" x2="34" y1="12.261" y2="20.068"></linearGradient>
        <linearGradient xlinkHref="#grad-a" id="grad-i" x1="14" x2="14" y1="12.261" y2="20.068"></linearGradient>
        <linearGradient id="grad-j" x1="24" x2="24" y1="9.624" y2="29.098" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f1d2bd"></stop>
          <stop offset=".314" stopColor="#f2cfb9"></stop>
          <stop offset=".608" stopColor="#f5c7ad"></stop>
          <stop offset=".894" stopColor="#fbbb9b"></stop>
          <stop offset="1" stopColor="#feb592"></stop>
        </linearGradient>
        <linearGradient xlinkHref="#grad-b" id="grad-k" x1="30" x2="30" y2="23.77"></linearGradient>
        <linearGradient xlinkHref="#grad-a" id="grad-l" x1="26" x2="26" y1="20.898" y2="24.569"></linearGradient>
      </defs>
      <g>
        <path fill="url(#grad-c)" d="M12.787 12.642c-2.299-5.057.861-8.872 4.035-10.136v.008c.039-.49.103-.931.17-1.302A1.485 1.485 0 0 1 18.458 0h9.407c5.853 0 9.694 6.826 7.52 12.802l-1.486 4.087H14.718l-1.93-4.246z"></path>
        <path fill="url(#grad-a)" d="M38 48H10a4.98 4.98 0 0 1-3.842-1.806 4.991 4.991 0 0 1-1.071-4.118l1.421-7.571c.491-2.648 2.422-4.741 5.037-5.46l6.933-1.889a21.011 21.011 0 0 1 11.045 0l6.931 1.889h.002c2.615.719 4.546 2.812 5.038 5.462l1.419 7.568a4.994 4.994 0 0 1-1.07 4.119A4.98 4.98 0 0 1 38.001 48z"></path>
        <path fill="url(#grad-d)" d="M23 32h2v16h-2z"></path>
        <path fill="url(#grad-e)" d="M17 40h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2z"></path>
        <path fill="url(#grad-f)" d="M22 26h4a7 7 0 0 1 7 7 2 2 0 0 1-2 2H17a2 2 0 0 1-2-2 7 7 0 0 1 7-7z"></path>
        <path fill="url(#grad-g)" d="M19 24.04V30a5 5 0 0 0 10 0v-5.96z"></path>
        <path fill="url(#grad-b)" d="M33.001 24H28a1 1 0 1 1 0-2h5.001c.552 0 1-.449 1-1v-3a1 1 0 1 1 2 0v3c0 1.654-1.346 3-3 3z"></path>
        <path fill="url(#grad-h)" d="M34 20h-2a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h2c1.654 0 3 1.346 3 3v2c0 1.654-1.346 3-3 3z"></path>
        <path fill="url(#grad-i)" d="M11 17v-2c0-1.654 1.346-3 3-3h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2c-1.654 0-3-1.346-3-3z"></path>
        <path fill="url(#grad-j)" d="M15 20v-7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7a7.242 7.242 0 0 1-2.121 5.121l-1.757 1.757a7.242 7.242 0 0 1-10.242 0l-1.757-1.757A7.242 7.242 0 0 1 15.002 20z"></path>
        <path fill="url(#grad-k)" d="M33.001 24H28a1 1 0 1 1 0-2h5.001z"></path>
        <rect width="6" height="4" x="23" y="21" fill="url(#grad-l)" rx="2"></rect>
      </g>
    </svg>
  );
};