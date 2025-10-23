import React from 'react';

export const ReliablestoreIcon = ({
  size = 32,
  className = '',
  style = {},
  ...restProps
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{
        enableBackground: 'new 0 0 512 512',
        ...style
      }}
      className={className}
      {...restProps}
    >
      <g>
        <path fill="#FFB34D" d="M24 62H2V25h22z"></path>
        <path
          fill="#E6A145"
          d="M17 37c-1.1 0-2 .9-2 2v2.42c-1.76.77-3 2.54-3 4.58 0 1.59.77 3.06 2 3.99V62h10V37z"
        ></path>
        <circle cx="50" cy="14" r="12" fill="#44A649"></circle>
        <path
          fill="#FFC680"
          d="M59 31.46c-.83 0-1.5.67-1.5 1.5v-1c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v-1c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v-7.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v9.5h-2c-.55 0-1 .45-1 1v5.5a5 5 0 0 0 4 4.9v6.6h7.98v-6.5c1.79-1.03 3.02-2.78 3.02-5v-6.5c0-.83-.67-1.5-1.5-1.5z"
        ></path>
        <path fill="#596C80" d="M38 62H16V46h22z"></path>
        <path
          fill="#4D9AFF"
          d="M17 43v-4h20v4c1.66 0 3 1.34 3 3a2.996 2.996 0 0 1-5.5 1.65c-.54.81-1.46 1.35-2.5 1.35s-1.96-.54-2.5-1.35c-.54.81-1.46 1.35-2.5 1.35s-1.96-.54-2.5-1.35c-.54.81-1.46 1.35-2.5 1.35s-1.96-.54-2.5-1.35A2.996 2.996 0 0 1 14 46c0-1.66 1.34-3 3-3z"
        ></path>
        <g fill="#F2F2F2">
          <path d="M32 58H22v-5h10zM20 34h-4v-4h4zM10 34H6v-4h4zM10 45.5H6v-4h4zM10 57H6v-4h4z"></path>
        </g>
        <path
          fill="#F2FFF3"
          d="M47.7 18.24c-.38 0-.77-.15-1.06-.44l-3.18-3.18 2.12-2.12 2.12 2.12 6.72-6.72 2.12 2.12-7.78 7.78c-.29.29-.68.44-1.06.44z"
        ></path>
        <path fill="#E4AA68" d="M47.5 32.96h2v4.96h-2z"></path>
      </g>
    </svg>
  );
};