import React from 'react';

export const VideoCameraIcon = ({ 
  size = 32, 
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
      viewBox="0 0 512 512"
      style={{
        enableBackground: 'new 0 0 512 512',
        ...style
      }}
      xmlSpace="preserve"
      className={className}
      {...restProps}
    >
      <g>
        <path
          d="M187.368 146.928V355.8l195.624-104.432z"
          fill="#FFFFFF"
        ></path>
        <path
          d="M256 .376C114.616.376 0 114.824 0 256s114.616 255.624 256 255.624S512 397.176 512 256 397.384.376 256 .376zm-71.504 146.552 195.624 104.44L184.496 355.8V146.928z"
          fill="#DB2B42"
        ></path>
      </g>
    </svg>
  );
};

