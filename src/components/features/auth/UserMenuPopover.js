import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  CogIcon,
  LogOutIcon,
  CloseIcon, 
  StarIcon,
} from "../../icons/index.js"; 
import { LOYALTY_TIERS as LOYALTY_TIERS_FALLBACK } from "../../../constants/loyaltyTiers.js"; 

// ... (getInitials and getTierInfo helper functions remain the same) ...
const getInitials = (name) => {
  if (!name) return "?";
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};
const getTierInfo = (points, loyaltySettings) => {
  const Tiers = loyaltySettings || LOYALTY_TIERS_FALLBACK;
  if (points >= Tiers.GOLD.minPoints)
    return {
      ...Tiers.GOLD,
      nextTier: null,
      pointsForNext: Tiers.GOLD.minPoints,
      maxPoints: Tiers.GOLD.minPoints,
    };
  if (points >= Tiers.SILVER.minPoints)
    return {
      ...Tiers.SILVER,
      nextTier: Tiers.GOLD,
      pointsForNext: Tiers.GOLD.minPoints,
      maxPoints: Tiers.GOLD.minPoints,
    };
  return {
    ...Tiers.BRONZE,
    nextTier: Tiers.SILVER,
    pointsForNext: Tiers.SILVER.minPoints,
    maxPoints: Tiers.SILVER.minPoints,
  };
};


const MenuItem = ({ icon: Icon, label, to, onClick }) =>
  React.createElement(
    Link,
    {
      to: to,
      onClick: onClick,
      className:
        "w-full text-right flex items-center space-x-3 space-x-reverse px-3 py-2.5 text-sm text-dark-800 dark:text-dark-100 rounded-md hover:bg-light-100 dark:hover:bg-dark-700 transition-colors",
    },
    React.createElement(Icon, {
      className: "w-5 h-5 text-dark-600 dark:text-dark-300",
    }),
    React.createElement("span", null, label)
  );

const UserHeader = ({ currentUser }) =>
  React.createElement(
    "div",
    { className: "flex items-center gap-3 p-4" },
    React.createElement(
      "div",
      {
        className:
          "w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg flex-shrink-0",
      },
      getInitials(currentUser?.name)
    ),
    React.createElement(
      "div",
      { className: "overflow-hidden" },
      React.createElement(
        "p",
        {
          className:
            "text-md font-semibold text-dark-900 dark:text-dark-50 truncate",
        },
        currentUser?.name || "زائر"
      ),
      React.createElement(
        "p",
        { className: "text-xs text-dark-600 dark:text-dark-300 truncate" },
        currentUser?.email || ""
      )
    )
  );

const LoyaltyStatus = ({ points, loyaltySettings }) => {
  const tierInfo = getTierInfo(points, loyaltySettings);
  const progressPercentage = tierInfo.nextTier && tierInfo.pointsForNext > tierInfo.minPoints
    ? Math.min(
        100,
        ((points - tierInfo.minPoints) /
          (tierInfo.pointsForNext - tierInfo.minPoints)) *
          100
      )
    : 100;

  return React.createElement(
    "div",
    { className: "px-4 pb-4" },
    React.createElement(
      "div",
      { className: "flex justify-between items-center mb-2" },
      React.createElement(
        "span",
        { className: `text-sm font-bold ${tierInfo.color}` },
        `المستوى ${tierInfo.name}`
      ),
      React.createElement(
        "span",
        {
          className:
            "text-sm font-bold text-dark-800 dark:text-dark-100 flex items-center gap-1",
        },
        React.createElement(StarIcon, {
          filled: true,
          className: "w-4 h-4 text-yellow-400",
        }),
        points
      )
    ),
    React.createElement(
      "div",
      { className: "w-full bg-light-200 dark:bg-dark-700 rounded-full h-1.5" },
      React.createElement("div", {
        className: `h-1.5 rounded-full ${tierInfo.progressColor} transition-all duration-500`,
        style: { width: `${progressPercentage}%` },
      })
    ),
    tierInfo.nextTier
      ? React.createElement(
          "p",
          { className: "text-xs text-dark-600 dark:text-dark-300 mt-2 text-center" },
          `ينقصك ${tierInfo.pointsForNext - points} نقطة للوصول للمستوى ${
            tierInfo.nextTier.name
          }!`
        )
      : React.createElement(
          "p",
          { className: `text-xs text-center mt-2 font-semibold ${tierInfo.color}` },
          "لقد وصلت إلى أعلى مستوى!"
        )
  );
};

const UserMenuPopover = ({
  isVisible,
  currentUser,
  onClose,
  onLogout,
  triggerRef,
  loyaltySettings
}) => {
  const popoverRef = useRef(null);
  const [isRendered, setIsRendered] = useState(isVisible);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [desktopPositionStyle, setDesktopPositionStyle] = useState({});
  const scrollPosition = useRef(0);

  // Fade-in/Fade-out logic
  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
    } else if (isRendered) {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isRendered]);

  // Mobile/Desktop mode logic
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop popover positioning
  useEffect(() => {
    if (isVisible && !isMobile && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const top = triggerRect.bottom + 8;
      const left = triggerRect.left + triggerRect.width / 2;
      setDesktopPositionStyle({ top: `${top}px`, left: `${left}px`, transform: `translateX(-50%)` });
    }
    if (!isVisible && !isMobile) {
      setDesktopPositionStyle({});
    }
  }, [isVisible, isMobile, triggerRef]);

  // Mobile scroll lock logic
  useEffect(() => {
    const unlockScroll = (tempScroll = 0) => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.paddingRight = "";
      if (tempScroll > 0) window.scrollTo(0, tempScroll);
      scrollPosition.current = 0;
    };

    if (isRendered && isMobile) {
      scrollPosition.current = window.pageYOffset;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = "100%";
      if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else if (!isMobile) {
      unlockScroll();
    } else if (!isRendered && isMobile && scrollPosition.current !== 0) {
      unlockScroll(scrollPosition.current);
    }

    return () => {
      if (document.body.style.position === "fixed") {
        const tempScroll = Math.abs(parseFloat(document.body.style.top) || 0);
        unlockScroll(tempScroll);
      }
    };
  }, [isRendered, isMobile]);

  // Click outside / Escape key handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !isMobile &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    const handleEscapeKey = (event) => event.key === "Escape" && onClose();

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isVisible, onClose, triggerRef, isMobile]);

  if (!isRendered) return null;

  const handleLinkClick = () => onClose();
  const handleLogoutClick = () => { onLogout(); onClose(); };

  const baseItems = [
    { label: "حسابي", to: "/profile", icon: UserIcon },
    { label: "طلباتي", to: "/orders", icon: ShoppingBagIcon },
    { label: "قائمة الرغبات", to: "/wishlist", icon: HeartIcon },
  ];
  const menuItems =
    currentUser?.role === "admin"
      ? [{ label: "لوحة التحكم", to: "/admin", icon: CogIcon }, ...baseItems]
      : baseItems;

  const popoverContent = React.createElement(
    React.Fragment,
    null,
    React.createElement(UserHeader, { currentUser: currentUser }),
    React.createElement(LoyaltyStatus, {
      points: currentUser?.loyaltyPoints || 0,
      loyaltySettings: loyaltySettings,
    }),
    React.createElement("div", { className: "border-t border-light-200 dark:border-dark-700" }),
    React.createElement(
      "nav",
      { className: "p-2" },
      menuItems.map((item) =>
        React.createElement(MenuItem, { key: item.to, ...item, onClick: handleLinkClick })
      )
    ),
    React.createElement(
      "div",
      { className: "p-2 border-t border-light-200 dark:border-dark-700" },
      React.createElement(
        "button",
        {
          onClick: handleLogoutClick,
          className:
            "w-full text-right flex items-center space-x-3 space-x-reverse px-3 py-2.5 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors",
        },
        React.createElement(LogOutIcon, { className: "w-5 h-5" }),
        React.createElement("span", null, "تسجيل الخروج")
      )
    )
  );

  if (isMobile) {
    const mobileContent = React.createElement(
      React.Fragment,
      null,
      React.createElement("div", { className: "w-12 h-1.5 bg-gray-300 dark:bg-dark-600 rounded-full mx-auto my-3 flex-shrink-0" }),
      React.createElement(
        "button", { onClick: onClose, className: "absolute top-4 left-4 p-2 text-dark-800 dark:text-dark-100 rounded-full hover:bg-light-100 dark:hover:bg-dark-700 z-10" },
        React.createElement(CloseIcon, { className: "w-6 h-6" })
      ),
      React.createElement( "div", { className: "overflow-y-auto w-full" },
        React.createElement( "div", { className: "text-center mb-3 border-b border-gray-200 dark:border-dark-700 pb-3 px-4 pt-4" },
          React.createElement("p", { className: "font-semibold text-lg" }, currentUser?.name || "زائر"),
          React.createElement("p", { className: "text-sm text-gray-500" }, currentUser?.email || ""),
          React.createElement(LoyaltyStatus, { points: currentUser?.loyaltyPoints || 0, loyaltySettings: loyaltySettings })
        ),
        React.createElement("nav", { className: "space-y-2 p-2" },
          menuItems.map((item) =>
            React.createElement(
              Link,
              {
                key: item.to,
                to: item.to,
                onClick: handleLinkClick,
                className: "w-full text-right flex items-center space-x-3 space-x-reverse px-3 py-3 text-dark-800 dark:text-dark-100 hover:bg-light-100 dark:hover:bg-dark-700 rounded-lg cursor-pointer transition-colors",
              },
              React.createElement(item.icon, { className: "w-5 h-5 text-dark-600 dark:text-dark-300" }),
              React.createElement("span", null, item.label)
            )
          ),
          React.createElement("div", { className: "border-t border-light-200 dark:border-dark-700 pt-4 mt-4" },
            React.createElement(
              "button",
              {
                onClick: handleLogoutClick,
                className: "w-full text-right flex items-center space-x-3 space-x-reverse px-3 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors",
              },
              React.createElement(LogOutIcon, { className: "w-5 h-5" }),
              React.createElement("span", null, "تسجيل الخروج")
            )
          )
        )
      )
    );

    return React.createElement(
      "div",
      {
        onClick: onClose,
        className: `fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${ isVisible ? "bg-black/40 opacity-100" : "bg-black/0 opacity-0 pointer-events-none" }`,
      },
      React.createElement(
        "div",
        {
          ref: popoverRef,
          onClick: (e) => e.stopPropagation(),
          className: `bg-white dark:bg-dark-800 w-full rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out max-h-[85vh] flex flex-col ${ isVisible ? "translate-y-0" : "translate-y-full" }`,
        },
        mobileContent
      )
    );
  }

  const desktopPopoverWidthClass = "w-72 max-w-[calc(100vw-2rem)]"; 
  const finalDesktopStyle = { ...desktopPositionStyle, transformOrigin: 'top center' };

  return React.createElement(
    "div",
    {
      ref: popoverRef,
      className: `fixed ${desktopPopoverWidthClass} bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-light-200 dark:border-dark-700 z-50 transform transition-all duration-300 ease-out origin-top ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`,
      style: finalDesktopStyle,
      role: "dialog",
      "aria-modal": "true",
    },
    popoverContent
  );
};

export { UserMenuPopover };