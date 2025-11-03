import React from 'react';

/**
 * أيقونة "التالي/متابعة" (Next/Continue Icon)
 * تستخدم "currentColor" للتكيف التلقائي مع الوضع الداكن والنهاري.
 * (ViewBox: 512x512)
 */
export const ArrowRightIcon = ({
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
      // تعيين لون التعبئة (fill) ليكون لون النص الحالي (currentColor)
      fill="currentColor"
      {...restProps}
    >
      <g>
        {/* المسار الأول: الدائرة الخارجية */}
        <path
          d="M256 0C114.618 0 0 114.618 0 256s114.618 256 256 256 256-114.618 256-256S397.382 0 256 0zm0 469.333c-117.818 0-213.333-95.515-213.333-213.333S138.182 42.667 256 42.667 469.333 138.182 469.333 256 373.818 469.333 256 469.333z"
        />
        {/* المسار الثاني: السهم الداخلي */}
        <path
          d="M228.418 134.248c-8.331-8.331-21.839-8.331-30.17 0-8.331 8.331-8.331 21.839 0 30.17L289.83 256l-91.582 91.582c-8.331 8.331-8.331 21.839 0 30.17 8.331 8.331 21.839 8.331 30.17 0l106.667-106.667c8.331-8.331 8.331-21.839 0-30.17L228.418 134.248z"
        />
      </g>
    </svg>
  );
};