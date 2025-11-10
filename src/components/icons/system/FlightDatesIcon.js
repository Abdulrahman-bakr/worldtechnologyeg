import React from 'react';

/**
 * أيقونة الكاميرا الكلاسيكية (Classic Camera Icon)
 * تم استبدال أيقونة القلم التمييزي بها.
 * @param {number} size - حجم الأيقونة (العرض والارتفاع). القيمة الافتراضية 32.
 * @param {string} className - سلاسل CSS إضافية.
 * @param {object} style - أنماط CSS داخلية إضافية.
 * @param {object} restProps - أي خصائص SVG إضافية.
 * @returns {JSX.Element}
 */
export const FlightDatesIcon = ({
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
      // تم تغيير viewBox إلى 0 0 64 64 ليتوافق مع الرمز الجديد
      viewBox="0 0 64 64"
      style={{
        // تم تغيير enableBackground إلى 0 0 64 64
        enableBackground: 'new 0 0 64 64',
        ...style
      }}
      xmlSpace="preserve"
      className={className}
      {...restProps}
    >
      <g>
        <path fill="#E2E7F6" d="M60 52H14a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h46a2 2 0 0 1 2 2v40a2 2 0 0 1-2 2z" opacity="1" data-original="#e2e7f6"></path>
        <path fill="#FFFFFF" d="M14 8a2 2 0 0 0-2 2v33h33a4 4 0 0 0 4-4V8z" opacity="1" data-original="#ffffff"></path>
        <path fill="#B52F28" d="M28 34h6v6h-6z" opacity="1" data-original="#b52f28"></path>
        <path fill="#D23F34" d="M28 34v4h3a1 1 0 0 0 1-1v-3z" opacity="1" data-original="#d23f34"></path>
        <path fill="#2458AD" d="M17 32c8.284 0 15 6.716 15 15 0 1.993-.397 3.891-1.103 5.631A14.907 14.907 0 0 0 33 45c0-8.284-6.716-15-15-15-6.291 0-11.669 3.877-13.897 9.369C6.716 34.963 11.506 32 17 32z" opacity="1" data-original="#2458ad"></path>
        <circle cx="17" cy="47" r="15" fill="#2862BE" opacity="1" data-original="#2862be"></circle>
        <path fill="#3279EA" d="M17 32C8.716 32 2 38.716 2 47c0 2.945.861 5.683 2.327 8H21a4 4 0 0 0 4-4V34.327A14.909 14.909 0 0 0 17 32z" opacity="1" data-original="#3279ea"></path>
        <path fill="#B52F28" d="M52 34h6v6h-6z" opacity="1" data-original="#b52f28"></path>
        <path fill="#D23F34" d="M52 34v4h3a1 1 0 0 0 1-1v-3z" opacity="1" data-original="#d23f34"></path>
        <path fill="#A9ADCC" d="m39 52 18-15 5 7-18 8" opacity="1" data-original="#a9adcc"></path>
        <path fill="#8389B2" d="m44 52 18-8v6a2 2 0 0 1-2 2z" opacity="1" data-original="#8389b2"></path>
        <path fill="#B52F28" d="M40 24h6v6h-6z" opacity="1" data-original="#b52f28"></path>
        <path fill="#D23F34" d="M40 24v4h3a1 1 0 0 0 1-1v-3z" opacity="1" data-original="#d23f34"></path>
        <path fill="#B52F28" d="M40 34h6v6h-6z" opacity="1" data-original="#b52f28"></path>
        <path fill="#D23F34" d="M40 34v4h3a1 1 0 0 0 1-1v-3z" opacity="1" data-original="#d23f34"></path>
        <path fill="#B52F28" d="M52 24h6v6h-6z" opacity="1" data-original="#b52f28"></path>
        <path fill="#D23F34" d="M52 24v4h3a1 1 0 0 0 1-1v-3z" opacity="1" data-original="#d23f34"></path>
        <path fill="#B52F28" d="M16 24h6v6h-6z" opacity="1" data-original="#b52f28"></path>
        <path fill="#D23F34" d="M16 24v4h3a1 1 0 0 0 1-1v-3z" opacity="1" data-original="#d23f34"></path>
        <path fill="#B52F28" d="M28 24h6v6h-6z" opacity="1" data-original="#b52f28"></path>
        <path fill="#D23F34" d="M28 24v4h3a1 1 0 0 0 1-1v-3z" opacity="1" data-original="#d23f34"></path>
        <path fill="#B52F28" d="M62 20H12V10a2 2 0 0 1 2-2h46a2 2 0 0 1 2 2z" opacity="1" data-original="#b52f28"></path>
        <path fill="#D23F34" d="M55 16a2 2 0 0 0 2-2V8H14a2 2 0 0 0-2 2v6z" opacity="1" data-original="#d23f34"></path>
        <path fill="#61668C" d="M20 14h-2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z" opacity="1" data-original="#61668c"></path>
        <path fill="#8389B2" d="M16 4v7h1a2 2 0 0 0 2-2V2h-1a2 2 0 0 0-2 2z" opacity="1" data-original="#8389b2"></path>
        <path fill="#61668C" d="M56 14h-2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z" opacity="1" data-original="#61668c"></path>
        <path fill="#8389B2" d="M52 4v7h1a2 2 0 0 0 2-2V2h-1a2 2 0 0 0-2 2z" opacity="1" data-original="#8389b2"></path>
        <g fill="#F8CED7"><path d="M36.5 14h-10a1.5 1.5 0 0 1 0-3h10a1.5 1.5 0 0 1 0 3zM43.5 14h-2a1.5 1.5 0 0 1 0-3h2a1.5 1.5 0 0 1 0 3z" fill="#F8CED7" opacity="1" data-original="#f8ced7"></path></g>
        <path fill="#FFFFFF" d="M19 49h9v-2l-9-2v-7a2 2 0 1 0-4 0v7l-9 2v2h9v3l-3 3v2l5-2 5 2v-2l-3-3z" opacity="1" data-original="#ffffff"></path>
        <path fill="#E2E7F6" d="M17 36a2 2 0 0 0-2 2v7l-9 2v2h9v3l-2 2h3a1 1 0 0 0 1-1z" opacity="1" data-original="#e2e7f6"></path>
        <path d="m32.859 44.868-1.982.264c.082.615.123 1.243.123 1.868h2c0-.713-.047-1.43-.141-2.132z" fill="#000000" opacity="1" data-original="#000000"></path>
        <path d="M60 7h-1V4c0-1.654-1.346-3-3-3h-2c-1.654 0-3 1.346-3 3v3H23V4c0-1.654-1.346-3-3-3h-2c-1.654 0-3 1.346-3 3v3h-1c-1.654 0-3 1.346-3 3v22.178C5.144 34.557 1 40.3 1 47c0 8.822 7.178 16 16 16 6.618 0 12.423-4.099 14.821-10H60c1.654 0 3-1.346 3-3V10c0-1.654-1.346-3-3-3zm-7-3c0-.551.448-1 1-1h2c.552 0 1 .449 1 1v8c0 .551-.448 1-1 1h-2c-.552 0-1-.449-1-1zM17 4c0-.551.448-1 1-1h2c.552 0 1 .449 1 1v8c0 .551-.448 1-1 1h-2c-.552 0-1-.449-1-1zm13.877 44.868C29.955 55.784 23.989 61 17 61 9.28 61 3 54.72 3 47s6.28-14 14-14c6.278 0 11.828 4.222 13.497 10.266l1.928-.531C30.518 35.825 24.175 31 17 31c-1.383 0-2.719.195-4 .527V10c0-.551.448-1 1-1h1v3c0 1.654 1.346 3 3 3h2c1.654 0 3-1.346 3-3V9h28v3c0 1.654 1.346 3 3 3h2c1.654 0 3-1.346 3-3V9h1c.552 0 1 .449 1 1v9H19v2h42v19.88l-3.187-4.461a.998.998 0 0 0-1.455-.187L53 39.031V35h6v-2h-7a1 1 0 0 0-1 1v6.698L38.637 51h-6.156c.158-.611.293-1.23.378-1.868zm25.935-10.41 3.661 5.126L43.787 51h-2.024zM60 51H48.713L61 45.539V50a1 1 0 0 1-1 1z" fill="#000000" opacity="1" data-original="#000000"></path>
        <path d="M15 19h2v2h-2zM23 30v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1zm-2-1h-4v-4h4zM34 31a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm-5-6h4v4h-4zM40 31h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm1-6h4v4h-4zM52 31h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm1-6h4v4h-4zM33 41h2v-7a1 1 0 0 0-1-1h-6v2h5zM40 41h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm1-6h4v4h-4zM28.217 46.023 20 44.198V38c0-1.654-1.346-3-3-3s-3 1.346-3 3v6.198l-8.217 1.825A1.001 1.001 0 0 0 5 47v2a1 1 0 0 0 1 1h8v1.586l-2.707 2.707A.996.996 0 0 0 11 55v2a1.001 1.001 0 0 0 1.371.929L17 56.077l4.629 1.852a1.007 1.007 0 0 0 .932-.101c.274-.186.439-.496.439-.828v-2a.996.996 0 0 0-.293-.707L20 51.586V50h8a1 1 0 0 0 1-1v-2c0-.469-.325-.874-.783-.977zM27 48h-8a1 1 0 0 0-1 1v3c0 .266.105.52.293.707L21 55.414v.109l-3.629-1.452a.99.99 0 0 0-.742 0L13 55.523v-.109l2.707-2.707A.996.996 0 0 0 16 52v-3a1 1 0 0 0-1-1H7v-.198l8.217-1.825c.458-.103.783-.508.783-.977v-7a1 1 0 0 1 2 0v7c0 .469.325.874.783.977L27 47.802z" fill="#000000" opacity="1" data-original="#000000"></path>
      </g>
    </svg>
  );
};