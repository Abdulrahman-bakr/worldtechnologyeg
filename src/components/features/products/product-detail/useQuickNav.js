import { useCallback, useMemo } from "react";

export const useQuickNav = (product, setActiveTab, setIsReviewsAccordionOpen) => {
  const quickNavLinksData = useMemo(() => [
    ...(product.description ? [{ id: 'overview', label: 'نظرة عامة' }] : []),
    ...(product.features?.length ? [{ id: 'features', label: 'الميزات' }] : []),
    ...(product.specifications && Object.keys(product.specifications).length ? [{ id: 'specs', label: 'المواصفات' }] : []),
    { id: 'reviews', label: 'الآراء' },
  ], [product]);

  const handleQuickNavClick = useCallback((targetId) => {
    const isTab = ['overview', 'features', 'specs'].includes(targetId);
    const elementId = isTab ? 'product-details-tabs' : 'reviews-accordion';
    const element = document.getElementById(elementId);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      if (isTab) setActiveTab(targetId);
      else setIsReviewsAccordionOpen(true);
    }
  }, [setActiveTab, setIsReviewsAccordionOpen]);

  return { quickNavLinksData, handleQuickNavClick };
};
