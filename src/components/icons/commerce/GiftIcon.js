import React from 'react';

export const GiftIcon = ({ 
  size = 64, 
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
      viewBox="0 0 58 58"
      style={{
        enableBackground: 'new 0 0 512 512',
        ...style
      }}
      xmlSpace="preserve"
      className={className}
      {...restProps}
    >
      <g>
        <g fill="none" fillRule="nonzero" transform="translate(0 -1)">
          <path
            fill="#4482C3"
            d="M54.94 17.12A3.989 3.989 0 0 1 58 21v34a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V21a4 4 0 0 1 4-4h26.95z"
          ></path>
          <path
            fill="#F3D55B"
            d="m44.964 2.279 2.951 6.216a2.206 2.206 0 0 0 1.652 1.256l6.546.989a2.351 2.351 0 0 1 1.21 3.963l-4.7 4.759a2.393 2.393 0 0 0-.642 2.067l1.119 6.753a2.224 2.224 0 0 1-3.174 2.453L44.011 27.5a2.094 2.094 0 0 0-2.022 0l-5.914 3.232a2.224 2.224 0 0 1-3.175-2.45l1.114-6.753a2.393 2.393 0 0 0-.642-2.067l-4.7-4.759a2.351 2.351 0 0 1 1.21-3.963l6.546-.989a2.206 2.206 0 0 0 1.652-1.256l2.951-6.216a2.148 2.148 0 0 1 3.933 0z"
          ></path>
          <g fill="#F0C419">
            <path d="M43 35a1 1 0 0 1-1-1v-3a1 1 0 0 1 2 0v3a1 1 0 0 1-1 1zM43 39a1 1 0 0 1-1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1-1 1zM47 37a1 1 0 0 1-1-1v-3a1 1 0 0 1 2 0v3a1 1 0 0 1-1 1zM39 37a1 1 0 0 1-1-1v-3a1 1 0 0 1 2 0v3a1 1 0 0 1-1 1z"></path>
          </g>
          <path fill="#2C3E50" d="M0 41h58v10H0z"></path>
          <rect
            width="14"
            height="10"
            x="6"
            y="23"
            fill="#F29C1F"
            rx="2"
          ></rect>
          <path
            fill="#F0C419"
            d="M52.63 19.46a2.416 2.416 0 0 0-.65 2.07l1.12 6.75a2.229 2.229 0 0 1-3.18 2.46l-5.91-3.24c-.63-.34-1.39-.34-2.02 0l-5.91 3.24a2.229 2.229 0 0 1-3.18-2.46l.25-1.49C48 17.81 45.69 5.64 44.34 1.47c.264.22.476.498.62.81l2.95 6.22a2.238 2.238 0 0 0 1.66 1.25l6.54.99a2.349 2.349 0 0 1 1.21 3.96z"
          ></path>
        </g>
      </g>
    </svg>
  );
};