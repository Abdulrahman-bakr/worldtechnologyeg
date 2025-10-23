import React from 'react';

export const LightweightIcon = ({ 
  size = 32, 
  color = 'currentColor',
  strokeWidth = 30,
  className = '', 
  style = {}, 
  ...restProps 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 682.667 682.667"
      style={{
        enableBackground: 'new 0 0 512 512',
        ...style
      }}
      xmlSpace="preserve"
      className={className}
      {...restProps}
    >
      <defs>
        <clipPath id="scale-icon-clip-a">
          <path d="M0 512h512V0H0Z"></path>
        </clipPath>
      </defs>
      <g
        clipPath="url(#scale-icon-clip-a)"
        transform="matrix(1.33333 0 0 -1.33333 0 682.667)"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
      >
        <path
          d="m0 0 91.178 33.186c15.569 5.667 32.784-2.361 38.451-17.93 5.667-15.569-2.361-32.785-17.93-38.451L8.845-60.631"
          transform="translate(316.841 226.958)"
        ></path>
        <path
          d="M0 0c-71.797 0-110 60-110 60s58.203 60 130 60c90 0 130-100 130-100C90 40 70 0 0 0Z"
          transform="translate(277 336.342)"
        ></path>
        <path d="M0 0h-200" transform="translate(307 396.342)"></path>
        <path
          d="m0 0 131.015 47.686c15.569 5.666 32.784-2.361 38.451-17.931 5.667-15.569-2.361-32.784-17.93-38.451L-8.987-67.122a70.003 70.003 0 0 0-36.864-3.018l-99.234 18.641-40.13-14.607"
          transform="translate(325.717 166.337)"
        ></path>
        <path
          d="m0 0 44.845 24.745c34.512 19.044 76.74 17.374 109.639-4.337v0a106.106 106.106 0 0 1 13.592-7.6l71.154-33.179c15.017-7.002 21.513-24.852 14.511-39.868v0c-7.002-15.016-24.851-21.513-39.868-14.511l-90.616 42.255"
          transform="translate(88.873 242.077)"
        ></path>
        <path
          d="m0 0-67.781-24.618 65.104-178.54 67.658 24.625z"
          transform="translate(82.78 258.816)"
        ></path>
      </g>
    </svg>
  );
};
