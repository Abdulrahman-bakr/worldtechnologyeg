
import React, { useState, useEffect } from 'react';

export const useScrollSpy = (sectionsRef, mainActionRef, deps = []) => {
    const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
    const [activeQuickNav, setActiveQuickNav] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            if (mainActionRef.current) {
                const { bottom } = mainActionRef.current.getBoundingClientRect();
                // Show sticky bar when the main action button area scrolls above the top of the viewport (with an offset)
                setIsStickyBarVisible(bottom < 80); 
            }

            let currentSectionId = '';
            const offset = 150; // Offset from the top of the viewport

            Object.entries(sectionsRef.current).forEach(([id, element]) => {
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Check if the section is within the viewport at the offset position
                    if (rect.top <= offset && rect.bottom >= offset) {
                        currentSectionId = id;
                    }
                }
            });

            if (currentSectionId) {
                setActiveQuickNav(currentSectionId);
            } else {
                 // If no section is active, check if we've scrolled above all sections
                 if (sectionsRef.current.overview && sectionsRef.current.overview.getBoundingClientRect().top > offset) {
                    setActiveQuickNav(''); // Scrolled back to top
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Run on mount to set initial state
        handleScroll(); 
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, deps); // Rerun if product changes, for example

     useEffect(() => {
        if (isStickyBarVisible) {
            document.body.classList.add('sticky-product-bar-active');
        } else {
            document.body.classList.remove('sticky-product-bar-active');
        }
        return () => {
            document.body.classList.remove('sticky-product-bar-active'); // Cleanup on unmount
        };
    }, [isStickyBarVisible]);
    
    return { isStickyBarVisible, activeQuickNav, setActiveQuickNav };
};
