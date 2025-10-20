
export const formatPrice = (price) => {
    return (price || 0).toFixed(2);
};

export const getDiscountPercentage = (price, discountPrice) => {
    if (!price || !discountPrice || price <= discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
};

export const getStockStatus = (product, currentStock) => {
    if (product.isDynamicElectronicPayments) return { text: "خدمة متاحة", color: "text-blue-600 dark:text-blue-400" };
    if (currentStock > 0) return { text: "متوفر", color: "text-green-600 dark:text-green-400" };
    return { text: "نفذ المخزون", color: "text-red-600 dark:text-red-400" };
};

export const calculatePointsToEarn = (price) => {
    return Math.floor(price || 0);
};

export const filterAndSortProducts = ({ products, sortOption, activeFilters, priceRange }) => {
    let filtered = [...products];

    // Apply filters
    if (activeFilters) {
        // Price range filter
        if (priceRange) {
            filtered = filtered.filter(p => {
                if (p.isDynamicElectronicPayments) {
                    return true; // Always include dynamic services regardless of price range
                }
                const price = p.discountPrice || p.price;
                return price >= priceRange.min && price <= priceRange.max;
            });
        }

        // Discounted only filter
        if (activeFilters.discountedOnly) {
            filtered = filtered.filter(p => p.discountPrice);
        }

        // Brand filter
        if (activeFilters.brands && activeFilters.brands.length > 0) {
            filtered = filtered.filter(p => activeFilters.brands.includes(p.brand));
        }

        // Specs filter
        if (activeFilters.specs && Object.keys(activeFilters.specs).length > 0) {
            filtered = filtered.filter(p => {
                if (!p.specifications) return false;
                return Object.entries(activeFilters.specs).every(([specName, specValues]) => {
                    if (!specValues || specValues.length === 0) return true;
                    if (!p.specifications[specName]) return false;
                    return specValues.includes(p.specifications[specName]);
                });
            });
        }
    }

    // Apply sorting
    switch (sortOption) {
        case 'newest':
            filtered.sort((a, b) => (b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0) - (a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0));
            break;
        case 'name_az':
            filtered.sort((a, b) => (a.arabicName || '').localeCompare(b.arabicName || '', 'ar'));
            break;
        case 'name_za':
            filtered.sort((a, b) => (b.arabicName || '').localeCompare(a.arabicName || '', 'ar'));
            break;
        case 'price_lh':
            filtered.sort((a, b) => (a.discountPrice || a.price || 0) - (b.discountPrice || b.price || 0));
            break;
        case 'price_hl':
            filtered.sort((a, b) => (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0));
            break;
        case 'rating_hl':
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'default':
        default:
            // Default sort might be by relevance or just a stable sort
            break;
    }

    return filtered;
};
