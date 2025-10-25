// --- START OF ImageCarousel.tsx ---
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { CloseIcon } from "../../../icons/index.js";
import { getImageUrl } from "../../../../utils/imageUrl.js";

const ZoomIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

// أيقونة جديدة للتأثير ثلاثي الأبعاد
const ThreeDIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25"
    />
  </svg>
);

// مكون فرعي لأزرار التنقل
const ArrowButton = ({ direction, onClick }) => {
  const isLeft = direction === "left";
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 ${
        isLeft ? "left-3" : "right-3"
      } transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition z-10`}
      aria-label={isLeft ? "الصورة السابقة" : "الصورة التالية"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6"
      >
        {isLeft ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        )}
      </svg>
    </button>
  );
};

// مكون فرعي لشريط الصور المصغرة
const ThumbnailStrip = ({ images, currentIndex, showVideo, handleClick }) => (
  <div className="flex justify-center mt-3 sm:mt-4 gap-2 overflow-x-auto snap-x scroll-smooth scrollbar-hide">
    {images.map((image, index) => (
      <button
        key={index}
        onClick={() => handleClick(index)}
        className={`w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-md overflow-hidden border-2 snap-center transition-all ${
          !showVideo && currentIndex === index
            ? "border-primary scale-105"
            : "border-transparent hover:border-primary/50"
        }`}
        aria-label={`عرض الصورة ${index + 1}`}
      >
        <img
          src={getImageUrl(image)}
          alt={`صورة ${index + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </button>
    ))}
  </div>
);

const ImageCarousel = ({ product }) => {
  const {
    imageUrls,
    imageUrl,
    arabicName,
    isZoomDisabled,
    disableLightbox,
    videoUrl,
  } = product || {};

  const images = useMemo(
    () =>
      imageUrls && imageUrls.length > 0
        ? imageUrls
        : imageUrl
        ? [imageUrl]
        : [],
    [imageUrl, imageUrls]
  );

  const altText = arabicName || "صورة المنتج";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [is3dEffectActive, setIs3dEffectActive] = useState(false); // <-- حالة جديدة
  const [imageStyle, setImageStyle] = useState({});
  const [isFading, setIsFading] = useState(false);

  const carouselRef = useRef(null);
  const scaleValue = 1.7;
  const maxRotate = 160;

  const videoEmbed = useMemo(() => {
    if (!videoUrl) return null;
    const embedUrl = videoUrl.replace("watch?v=", "embed/");
    return (
      <iframe
        src={embedUrl}
        title="Product Video"
        className="w-full h-full rounded-lg"
        allowFullScreen
        loading="lazy"
      ></iframe>
    );
  }, [videoUrl]);

  const changeImage = useCallback(
    (newIndex) => {
      if (newIndex === currentIndex || isFading) return;
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex(newIndex);
        setTimeout(() => setIsFading(false), 50);
      }, 200);
    },
    [currentIndex, isFading]
  );

  const goToPrevious = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      setShowVideo(false);
      const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      changeImage(newIndex);
    },
    [currentIndex, images, changeImage]
  );

  const goToNext = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      setShowVideo(false);
      const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      changeImage(newIndex);
    },
    [currentIndex, images, changeImage]
  );

  const handleImageClick = (index) => {
    setShowVideo(false);
    changeImage(index);
  };

  const closeLightbox = useCallback(() => setIsLightboxOpen(false), []);

  const toggleZoom = (e) => {
    e.stopPropagation();
    setIsZoomActive((prev) => !prev);
  };

  // دالة جديدة لتفعيل التأثير
  const toggle3dEffect = (e) => {
    e.stopPropagation();
    setIs3dEffectActive((prev) => !prev);
  };

  const handleMouseMove = (e) => {
    if (isZoomDisabled || showVideo) return;
    const rect = e.currentTarget.getBoundingClientRect();

    if (isZoomActive) {
      const originX = ((e.clientX - rect.left) / rect.width) * 100;
      const originY = ((e.clientY - rect.top) / rect.height) * 100;
      setImageStyle({
        transform: `scale(${scaleValue})`,
        transformOrigin: `${originX}% ${originY}%`,
        transition: "none",
      });
    } else if (is3dEffectActive) { // <-- التعديل هنا
      const { width, height } = rect;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const rotateX = ((mouseY - height / 2) / (height / 2)) * -maxRotate;
      const rotateY = ((mouseX - width / 2) / (width / 2)) * maxRotate;
      setImageStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1)`,
        transformOrigin: "50% 50%",
        transition: "transform 0.1s ease-out",
      });
    }
  };

  const handleMouseLeave = () => {
    setImageStyle({
      transform: "perspective(1000px) rotateX(0) rotateY(0) scale(1)",
      transformOrigin: "50% 50%",
      transition: "transform 0.4s ease-in-out",
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goToNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPrevious();
    }
  };

  useEffect(() => {
    handleMouseLeave();
  }, [isZoomActive]);

  // عند إيقاف التأثير، أعد الصورة لوضعها الطبيعي
  useEffect(() => {
    if (!is3dEffectActive) {
      handleMouseLeave();
    }
  }, [is3dEffectActive]);


  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    if (isLightboxOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isLightboxOpen, closeLightbox]);

  if (!images || images.length === 0) {
    return <div>Loading...</div>;
  }

  const mainImageCursor = isZoomActive
    ? "zoom-in"
    : disableLightbox
    ? "default"
    : "pointer";

  return (
    <>
      <div
        ref={carouselRef}
        tabIndex="0"
        className="relative outline-none"
        onKeyDown={handleKeyDown}
      >
        <div
          className="relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-dark-700 border border-light-200 dark:border-dark-600 aspect-square max-w-xl mx-auto flex items-center justify-center transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/20"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* زر تفعيل التأثير ثلاثي الأبعاد */}
          {!isZoomDisabled && !showVideo && (
            <button
              onClick={toggle3dEffect}
              className={`absolute top-3 left-3 z-20 p-2 rounded-full transition-all duration-300 ${
                is3dEffectActive
                  ? "bg-primary text-white scale-110"
                  : "bg-black/30 text-white hover:bg-black/85"
              }`}
              aria-label="تفعيل التأثير ثلاثي الأبعاد"
            >
              <ThreeDIcon className="w-5 h-5" />
            </button>
          )}
          
          {/* زر الزوم */}
          {!isZoomDisabled && !showVideo && (
            <button
              onClick={toggleZoom}
              className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300 ${
                isZoomActive
                  ? "bg-primary text-white scale-110"
                  : "bg-black/30 text-white hover:bg-black/85"
              }`}
              aria-label="تفعيل الزوم"
            >
              <ZoomIcon className="w-5 h-5" />
            </button>
          )}

          {isZoomActive && (
            <div className="absolute inset-0 ring-2 ring-primary/60 rounded-lg pointer-events-none transition-opacity duration-300"></div>
          )}

          {showVideo && videoEmbed ? (
            videoEmbed
          ) : !images[currentIndex] ? (
            <div className="w-full h-full flex items-center justify-center animate-pulse bg-gray-100 dark:bg-dark-600">
              <span className="text-gray-400">جارٍ التحميل...</span>
            </div>
          ) : (
            <img
              key={currentIndex}
              src={getImageUrl(images[currentIndex])}
              alt={`${altText} - صورة ${currentIndex + 1}`}
              className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${
                isFading ? "opacity-0" : "opacity-100"
              }`}
              style={{ ...imageStyle, cursor: mainImageCursor }}
              onClick={() => !disableLightbox && setIsLightboxOpen(true)}
              fetchpriority="high"
            />
          )}
        </div>

        {images.length > 1 && (
          <>
            <ArrowButton direction="left" onClick={goToPrevious} />
            <ArrowButton direction="right" onClick={goToNext} />
          </>
        )}

        {(images.length > 1 || videoEmbed) && (
          <ThumbnailStrip
            images={images}
            currentIndex={currentIndex}
            showVideo={showVideo}
            handleClick={handleImageClick}
          />
        )}
      </div>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 text-white hover:text-primary transition-all p-2 z-[10000] rounded-full hover:bg-white/10 transform hover:scale-110"
            aria-label="إغلاق الصورة"
          >
            <CloseIcon className="w-8 h-8" />
          </button>

          <div
            className="relative w-full h-full max-w-4xl max-h-[90vh] p-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(images[currentIndex])}
              alt={`${altText} - صورة مكبرة ${currentIndex + 1}`}
              className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              loading="lazy"
              decoding="async"
            />
          </div>

          {images.length > 1 && (
            <>
              <ArrowButton direction="left" onClick={goToPrevious} />
              <ArrowButton direction="right" onClick={goToNext} />
            </>
          )}
        </div>
      )}
    </>
  );
};

export { ImageCarousel };
// --- END OF ImageCarousel.tsx ---