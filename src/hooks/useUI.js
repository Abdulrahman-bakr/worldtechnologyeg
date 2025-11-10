import { useState, useEffect, useCallback } from 'react';
import { ProductCategory } from '../constants/index.js';

export const useUI = () => {
    const [selectedCategory, setSelectedCategory] = useState(ProductCategory.All);
    const [showAllOffersView, setShowAllOffersView] = useState(false);
    const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
        try {
            if (typeof localStorage !== 'undefined') {
                const stored = localStorage.getItem('recentlyViewedIds');
                return stored ? JSON.parse(stored) : [];
            }
        } catch (e) { console.error(e); }
        return [];
    });
    
    const [viewMode, setViewMode] = useState('grid');
    const [toastMessage, setToastMessage] = useState({ text: null, type: 'success' });
    
    const [currentTheme, setCurrentTheme] = useState(() => {
        const storedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('appTheme') : 'light';
        return storedTheme || 'light';
    });
    
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false); // New state
    const [activePopover, setActivePopover] = useState(null);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);

    useEffect(() => { try { if (typeof localStorage !== 'undefined') localStorage.setItem('recentlyViewedIds', JSON.stringify(recentlyViewedIds)); } catch (e) { console.error(e); } }, [recentlyViewedIds]);
    
    useEffect(() => {
        try {
            if (typeof localStorage !== 'undefined') localStorage.setItem('appTheme', currentTheme);
            document.documentElement.classList.toggle('dark', currentTheme === 'dark');
            document.documentElement.classList.toggle('theme-light', currentTheme === 'light');
        } catch (e) { console.error("Error handling theme persistence:", e); }
    }, [currentTheme]);
    
    const handleToggleTheme = useCallback(() => {
        setCurrentTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    }, []);
    
    const handleToggleMiniCart = useCallback(() => setActivePopover(prev => (prev === 'cart' ? null : 'cart')), []);
    const handleToggleNotificationsPopover = useCallback(() => setActivePopover(prev => (prev === 'notifications' ? null : 'notifications')), []);
    const closeAllPopovers = useCallback(() => setActivePopover(null), []);

    return {
        selectedCategory, setSelectedCategory,
        showAllOffersView, setShowAllOffersView,
        recentlyViewedIds, setRecentlyViewedIds,
        viewMode, setViewMode,
        toastMessage, setToastMessage,
        currentTheme, handleToggleTheme,
        isChatOpen, setIsChatOpen,
        isComparisonModalOpen, setIsComparisonModalOpen, // Expose new state
        activePopover,
        handleToggleMiniCart,
        handleToggleNotificationsPopover,
        closeAllPopovers,
        autocompleteSuggestions, setAutocompleteSuggestions,
    };
};