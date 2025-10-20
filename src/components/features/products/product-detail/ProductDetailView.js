import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StarIcon } from '../../../icons/index.js';
import { getStockStatus, calculatePointsToEarn } from '../../../../utils/productUtils.js';
import { useReviewStats } from '../../../../hooks/useReviewStats.js';
import { useScrollSpy } from '../../../../hooks/useScrollSpy.js';

// New DynamicServiceRenderer import
import { DynamicServiceRenderer } from '../../services/forms/DynamicServiceRenderer.js';

// Import newly created sub-components
import { ImageCarousel } from './ImageCarousel.js';
import { ProductInfo } from './ProductInfo.js';
import { PriceDisplay } from './PriceDisplay.js';
import { VariantsSelector } from './VariantsSelector.js';
import { ActionButtons } from './ActionButtons.js';
import { TabsSection } from './TabsSection.js';
import { ReviewsAccordion } from './ReviewsAccordion.js';
import { RelatedProducts } from './RelatedProducts.js';
import { StickyBar } from './StickyBar.js';
import { QuickNavLink } from './QuickNavLink.js';
import { useQuickNav } from './useQuickNav.js'; // New import

const ProductDetailView = ({ product, allProducts, onAddToCart, onViewDetails, onBack, onToggleWishlist, isInWishlist, currentUser, onLoginRequest, wishlistItems, onInitiateDirectCheckout, onPendingReviewLogin, allDigitalPackages, allFeeRules }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [isReviewsAccordionOpen, setIsReviewsAccordionOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    
    const mainActionRef = useRef(null);
    const sectionsRef = useRef({
        overview: null,
        features: null,
        specs: null,
        reviews: null,
    });
    
    const isDynamicService = product && product.isDynamicElectronicPayments;

    // Custom Hooks
    const { liveRating, liveReviewCount, isLoadingReviewStats } = useReviewStats(product);
    const { isStickyBarVisible, activeQuickNav } = useScrollSpy(sectionsRef, mainActionRef, [product]);
    const { quickNavLinksData, handleQuickNavClick } = useQuickNav(product, setActiveTab, setIsReviewsAccordionOpen); // New hook usage
    
    const carouselProduct = useMemo(() => {
        if (!product) return null;
        const images = selectedVariant 
            ? [selectedVariant.imageUrl, ...(product.imageUrls || []).filter(img => img !== selectedVariant.imageUrl)]
            : (product.imageUrls || (product.imageUrl ? [product.imageUrl] : []));
        
        return {
            ...product,
            imageUrls: [...new Set(images)]
        };
    }, [product, selectedVariant]);
    
    useEffect(() => {
        if (product?.variants?.length > 0) {
            const defaultVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
            setSelectedVariant(defaultVariant);
        } else {
            setSelectedVariant(null);
        }
    }, [product]);

    useEffect(() => {
        if (product) {
            if (product.description) setActiveTab('overview');
            else if (product.features && product.features.length > 0) setActiveTab('features');
            else if (product.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0) setActiveTab('specs');
        }
    }, [product]);

    useEffect(() => {
        if (product && allProducts && allProducts.length > 0) {
            const filtered = allProducts.filter(p => p.category === product.category && p.id !== product.id);
            const shuffled = filtered.sort(() => 0.5 - Math.random());
            setRelatedProducts(shuffled.slice(0, 4));
        } else {
            setRelatedProducts([]); 
        }
    }, [product, allProducts]);
    
    const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
    const { text: stockStatusText, color: stockStatusColor } = getStockStatus(product, currentStock);
    const pointsToEarn = calculatePointsToEarn(product.discountPrice || product.price);

    const handleActionClick = () => {
        if (product.allowDirectPurchase) {
            onInitiateDirectCheckout(product, { finalPrice: product.discountPrice || product.price || 0 });
        } else if (!isDynamicService && currentStock > 0) {
            onAddToCart(product, selectedVariant); 
        }
    };

    const handleWishlistToggle = () => {
        if (!currentUser) {
            onLoginRequest();
            return;
        }
        onToggleWishlist(product.id);
    };

    // Removed handleQuickNavClick and quickNavLinksData
    
    return (
        React.createElement("div", null,
            isStickyBarVisible && !isDynamicService && React.createElement(StickyBar, { product: product, selectedVariant: selectedVariant, handleActionClick: handleActionClick }),
            React.createElement("div", { className: "sticky-quick-nav-bar" },
                React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8" },
                    React.createElement("nav", { className: "flex justify-center items-center gap-4 py-2" },
                        quickNavLinksData.map(link => React.createElement(QuickNavLink, { key: link.id, targetId: link.id, onNavClick: handleQuickNavClick, isActive: activeQuickNav === link.id }, link.label))
                    )
                )
            ),
            React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-6" },
                React.createElement("button", {
                    onClick: onBack,
                    className: "mb-6 text-primary hover:text-primary-hover font-semibold flex items-center space-x-2 space-x-reverse transition-colors"
                }, React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5 transform rtl:rotate-180" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" })), React.createElement("span", null, "العودة")),
                React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start" },
                    React.createElement("div", { className: "lg:sticky lg:top-40 z-30" }, React.createElement(ImageCarousel, { product: carouselProduct })),
                    React.createElement("div", { className: "space-y-5" },
                        React.createElement(ProductInfo, { product: product, isLoadingReviewStats: isLoadingReviewStats, liveRating: liveRating, liveReviewCount: liveReviewCount, setIsReviewsAccordionOpen: setIsReviewsAccordionOpen }),
                        isDynamicService
                            ? React.createElement(DynamicServiceRenderer, {
                                product: product,
                                onInitiateDirectCheckout: onInitiateDirectCheckout,
                                allDigitalPackages: allDigitalPackages,
                                allFeeRules: allFeeRules
                              })
                            : React.createElement("div", { ref: mainActionRef },
                                React.createElement(PriceDisplay, { product: product }),
                                React.createElement(VariantsSelector, { product: product, selectedVariant: selectedVariant, setSelectedVariant: setSelectedVariant }),
                                (pointsToEarn > 0) && React.createElement("div", { className: "mt-2 flex items-center gap-1.5 text-sm text-yellow-600 dark:text-yellow-400 font-semibold" }, React.createElement(StarIcon, { filled: true, className: "w-5 h-5" }), React.createElement("span", null, `ستربح ${pointsToEarn} نقطة عند شراء هذا المنتج`)),
                                React.createElement("p", { className: `text-sm font-semibold mt-2 ${stockStatusColor}` }, stockStatusText),
                                React.createElement(ActionButtons, { product: product, currentStock: currentStock, handleActionClick: handleActionClick, handleWishlistToggle: handleWishlistToggle, isInWishlist: isInWishlist })
                            )
                    )
                ),
                React.createElement(TabsSection, { product: product, activeTab: activeTab, setActiveTab: setActiveTab, sectionsRef: sectionsRef }),
                React.createElement(ReviewsAccordion, { product: product, isReviewsAccordionOpen: isReviewsAccordionOpen, setIsReviewsAccordionOpen: setIsReviewsAccordionOpen, sectionsRef: sectionsRef, currentUser: currentUser, onPendingReviewLogin: onPendingReviewLogin }),
                React.createElement(RelatedProducts, { relatedProducts: relatedProducts, onAddToCart: onAddToCart, onViewDetails: onViewDetails, onToggleWishlist: onToggleWishlist, wishlistItems: wishlistItems, currentUser: currentUser, onLoginRequest: onLoginRequest, onInitiateDirectCheckout: onInitiateDirectCheckout })
            )
        )
    );
};

export { ProductDetailView };