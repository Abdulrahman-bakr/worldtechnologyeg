import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CloseIcon, SearchIcon } from '../../icons/index.js';

const StationSelectionModal = ({ isOpen, onClose, onStationSelect, stations, target }) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [contentAnimation, setContentAnimation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        setContentAnimation('animate-fade-in-up');
        // Focus the input when modal opens
        setTimeout(() => inputRef.current?.focus(), 100);
      });
    } else if (isRendered) {
      document.body.style.overflow = '';
      setContentAnimation('animate-fade-out-up');
      const timer = setTimeout(() => {
          setIsRendered(false);
          setSearchTerm(''); // Reset search on close
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, isRendered]);

  const filteredStations = useMemo(() => {
    if (!searchTerm) {
      return stations;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return stations.filter(station =>
      station.name.toLowerCase().includes(lowercasedTerm)
    );
  }, [stations, searchTerm]);

  const handleSelect = (station) => {
    onStationSelect(station);
    onClose();
  };
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isRendered) return null;

  const title = target === 'departure' ? 'اختر محطة القيام' : 'اختر محطة الوصول';

  return React.createElement("div", {
      className: `fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4`,
      role: "dialog", "aria-modal": "true", "aria-labelledby": "station-select-title"
    },
    React.createElement("div", { className: `modal-overlay absolute inset-0 bg-black/85 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`, onClick: handleOverlayClick }),
    React.createElement("div", { className: `modal-content bg-white dark:bg-dark-800 rounded-xl shadow-2xl w-full max-w-md relative ${contentAnimation} border border-light-200 dark:border-dark-700 max-h-[85vh] flex flex-col` },
      React.createElement("div", { className: "flex items-center justify-between p-4 border-b border-light-300 dark:border-dark-600 flex-shrink-0" },
        React.createElement("h2", { id: "station-select-title", className: "text-lg font-bold text-primary" }, title),
        React.createElement("button", { onClick: onClose, className: "p-1.5 rounded-full text-dark-600 dark:text-dark-300 hover:bg-light-100 dark:hover:bg-dark-700", "aria-label": "إغلاق" },
          React.createElement(CloseIcon, { className: "w-5 h-5" })
        )
      ),
      React.createElement("div", { className: "p-4 flex-shrink-0" },
        React.createElement("div", { className: "relative" },
          React.createElement("input", {
            ref: inputRef,
            type: "search",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            placeholder: "ابحث عن محطة...",
            className: "w-full py-2.5 pl-10 pr-4 rounded-full border border-light-300 dark:border-dark-600 bg-light-50 dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary"
          }),
          React.createElement("div", { className: "absolute top-1/2 -translate-y-1/2 left-3 text-dark-500 dark:text-dark-400 pointer-events-none" },
            React.createElement(SearchIcon, { className: "w-5 h-5" })
          )
        )
      ),
      React.createElement("ul", { className: "flex-grow overflow-y-auto px-4 pb-4" },
        filteredStations.length > 0 ? (
            filteredStations.map(station =>
                React.createElement("li", { key: station.name },
                    React.createElement("button", {
                        onClick: () => handleSelect(station),
                        className: "w-full text-right px-4 py-3 rounded-md hover:bg-light-100 dark:hover:bg-dark-700 text-dark-800 dark:text-dark-100 transition-colors"
                    },
                        station.name
                    )
                )
            )
        ) : (
            React.createElement("li", { className: "text-center text-dark-600 dark:text-dark-300 py-8" }, "لا توجد محطات تطابق بحثك.")
        )
      )
    )
  );
};

export { StationSelectionModal };