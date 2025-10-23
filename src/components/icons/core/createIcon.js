import React from "react";

/**
 * دالة لإنشاء أيقونات SVG قابلة للتخصيص والتوافق مع الثيم
 * @param {string[]} paths - المسارات (d) الخاصة بالأيقونة
 * @param {string} [viewBox="0 0 24 24"] - إطار العرض الافتراضي
 * @returns {React.FC} - مكون React للأيقونة
 */
export const createIcon = (paths, viewBox = "0 0 24 24") => {
  const Icon = ({
    className = "",
    size = 24,
    color = "currentColor",
    strokeWidth = 1.5,
    style = {},
  }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox={viewBox}
        stroke={color}
        strokeWidth={strokeWidth}
        width={size}
        height={size}
        className={className || "w-6 h-6"}
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          ...style,
        }}
      >
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke" // يمنع تشوه الخط عند التكبير/التصغير
          />
        ))}
      </svg>
    );
  };

  return Icon;
};