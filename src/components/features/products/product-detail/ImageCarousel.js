import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CloseIcon } from '../../../icons/index.js';
import { getImageUrl } from '../../../../utils/imageUrl.js';

// --- START OF ImageCarousel.tsx ---
const ImageCarousel = ({ product }) => {
    const { imageUrls, imageUrl, arabicName, isZoomDisabled, disableLightbox } = product || {};
    const images = imageUrls && imageUrls.length > 0 ? imageUrls : (imageUrl ? [imageUrl] : []);
    const altText = arabicName || 'صورة المنتج';

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    
    // State for magnifier
    const imgRef = useRef(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isDesktopSize, setIsDesktopSize] = useState(false);

    // Effect to check for touch device support once on mount
    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    // Effect to check window size on mount and on resize
    useEffect(() => {
        const checkSize = () => {
            setIsDesktopSize(window.innerWidth >= 768);
        };
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    // Combined condition to determine if the zoom feature should be active
    const canZoom = !isTouchDevice && isDesktopSize && !isZoomDisabled;
    const ZOOM_FACTOR = 2.5;

    const goToPrevious = useCallback((e) => {
        if (e) e.stopPropagation();
        const isFirstImage = currentIndex === 0;
        const newIndex = isFirstImage ? (images.length - 1) : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, images]);

    const goToNext = useCallback((e) => {
        if (e) e.stopPropagation();
        const isLastImage = currentIndex === (images.length - 1);
        const newIndex = isLastImage ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, images]);
    
    const closeLightbox = useCallback(() => setIsLightboxOpen(false), []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') closeLightbox();
            // For RTL, ArrowLeft should go to the next image (like reading direction)
            else if (event.key === 'ArrowLeft') goToNext(event);
            // For RTL, ArrowRight should go to the previous image
            else if (event.key === 'ArrowRight') goToPrevious(event);
        };
        
        if (isLightboxOpen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('lightbox-open');
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('lightbox-open');
        }
        
        return () => {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('lightbox-open');
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isLightboxOpen, goToPrevious, goToNext, closeLightbox]);


    if (!images || images.length === 0) {
        return React.createElement("div", { className: "relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-dark-700 border border-light-200 dark:border-dark-600 aspect-square max-w-xl mx-auto flex items-center justify-center" }, 
            React.createElement("img", { src: getImageUrl(null), alt: "Placeholder Image", className: "w-full h-full object-cover" })
        );
    }
    
    const handleMainImageClick = () => {
        if (disableLightbox) return;
        setIsLightboxOpen(true);
    };

    // Inner Zoom Logic
    const handleMouseEnter = () => {
        if (canZoom && imgRef.current) {
            // No need to set extra state, just apply style
        }
    };
    
    const handleMouseLeave = () => {
        if (canZoom && imgRef.current) {
            imgRef.current.style.transform = 'scale(1)';
        }
    };

    const handleMouseMove = (e) => {
        if (!canZoom || !imgRef.current) return;
        const { left, top, width, height } = imgRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        imgRef.current.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        imgRef.current.style.transform = `scale(${ZOOM_FACTOR})`;
    };

    const mainImageCursor = disableLightbox ? 'default' : (canZoom ? 'zoom-in' : 'pointer');

    return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "relative group" }, 
             React.createElement("div", {
                className: "relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-dark-700 border border-light-200 dark:border-dark-600 aspect-square max-w-xl mx-auto flex items-center justify-center",
                onClick: handleMainImageClick,
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
                onMouseMove: handleMouseMove,
             },
                React.createElement("img", {
                    ref: imgRef,
                    src: getImageUrl(images[currentIndex]),
                    alt: `${altText} - صورة ${currentIndex + 1}`,
                    className: "max-w-full max-h-full object-contain transition-transform duration-100 ease-out",
                    style: { cursor: mainImageCursor },
                    fetchpriority: "high"
                })
            ),
            
            images.length > 1 && React.createElement(React.Fragment, null,
                React.createElement("button", {
                    onClick: (e) => goToNext(e),
                    className: "absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10",
                    "aria-label": "الصورة التالية"
                }, React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", className: "w-5 h-5 sm:w-6 sm:h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 19.5L8.25 12l7.5-7.5" }))),
                React.createElement("button", {
                    onClick: (e) => goToPrevious(e),
                    className: "absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10",
                    "aria-label": "الصورة السابقة"
                }, React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", className: "w-5 h-5 sm:w-6 sm:h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.25 4.5l7.5 7.5-7.5 7.5" })))
            ),
            images.length > 1 && React.createElement("div", { className: "flex justify-center mt-3 sm:mt-4 space-x-2 space-x-reverse" },
                images.map((image, index) =>
                    React.createElement("button", {
                        key: index,
                        onClick: () => setCurrentIndex(index),
                        className: `w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-all ${currentIndex === index ? 'border-primary scale-105' : 'border-transparent hover:border-primary/50'}`,
                        "aria-label": `عرض الصورة ${index + 1}`
                    }, React.createElement("img", { src: getImageUrl(image), alt: `Thumbnail ${index + 1}`, className: "w-full h-full object-cover", loading: "lazy" }))
                )
            )
        ),
        
        isLightboxOpen && React.createElement("div", {
          className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/95  ",
          onClick: closeLightbox,
          role: "dialog", "aria-modal": "true", "aria-labelledby": "lightbox-title"
        },
          React.createElement("button", { onClick: (e) => { e.stopPropagation(); closeLightbox(); }, className: "absolute top-4 right-4 text-white hover:text-primary transition-all p-2 z-[10000] rounded-full hover:bg-white/10 transform hover:scale-110", "aria-label": "إغلاق الصورة" }, React.createElement(CloseIcon, { className: "w-8 h-8" })),
          React.createElement("div", { className: "relative w-full h-full max-w-4xl max-h-[90vh] p-4 flex items-center justify-center", onClick: (e) => e.stopPropagation() },
            React.createElement("img", { src: getImageUrl(images[currentIndex]), alt: `${altText} - صورة مكبرة ${currentIndex + 1}`, className: "w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl", loading: "lazy" })
          ),
          images.length > 1 && React.createElement(React.Fragment, null,
            React.createElement("button", { onClick: goToNext, className: "absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors z-[10000]", "aria-label": "الصورة التالية" }, React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", className: "w-8 h-8" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 19.5L8.25 12l7.5-7.5" }))),
            React.createElement("button", { onClick: goToPrevious, className: "absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors z-[10000]", "aria-label": "الصورة السابقة" }, React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", className: "w-8 h-8" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.25 4.5l7.5 7.5-7.5 7.5" })))
          ),
          React.createElement("h2", { id: "lightbox-title", className: "sr-only" }, `عرض صورة المنتج: ${altText}`)
        )
    );
};
// --- END OF ImageCarousel.tsx ---
export { ImageCarousel };