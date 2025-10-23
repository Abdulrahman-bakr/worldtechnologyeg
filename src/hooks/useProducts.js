// world-technology-store/src/hooks/useProducts.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { filterAndSortProducts } from '../utils/productUtils.js';
import { ProductCategory, SortOption } from '../constants/index.js';
import { db } from '../services/firebase/config.js';
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";

export const useProducts = (setToastMessage, selectedCategory, showAllOffersView) => {
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [filteredAndSortedProducts, setFilteredAndSortedProducts] = useState([]);
    
    const [initialMaxPrice, setInitialMaxPrice] = useState(1000);
    
    const [sortOption, setSortOption] = useState(SortOption.Default);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [allDigitalPackages, setAllDigitalPackages] = useState([]);
    const [allFeeRules, setAllFeeRules] = useState([]);
    const [activePopup, setActivePopup] = useState(null);
    const [storeSettings, setStoreSettings] = useState(null);
    const [loyaltySettings, setLoyaltySettings] = useState(null);
    const [discounts, setDiscounts] = useState([]);


    const [activeFilters, setActiveFilters] = useState({ brands: [], specs: {}, discountedOnly: false });
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

    const fetchInitialData = useCallback(async () => {
        setProductsLoading(true);
        try {
            // Fetch critical public data that the app needs to function.
            const productsQuery = query(collection(db, 'products'));
            const packagesQuery = query(collection(db, 'digital_service_packages'));
            const popupQuery = query(collection(db, 'popup_banners'));
            const settingsQuery = getDoc(doc(db, 'settings', 'storeInfo'));
            const loyaltyQuery = getDoc(doc(db, 'settings', 'loyaltyTiers'));
            const feeRulesQuery = getDocs(collection(db, 'feeRules'));


            const [productsSnapshot, packagesSnapshot, popupSnapshot, settingsSnap, loyaltySnap, feeRulesSnapshot] = await Promise.all([
                getDocs(productsQuery),
                getDocs(packagesQuery),
                getDocs(popupQuery),
                settingsQuery,
                loyaltyQuery,
                feeRulesQuery,
            ]);

            const productsData = productsSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(p => p.status === "published") 
                .sort((a, b) => (a.arabicName || '').localeCompare(b.arabicName || '', 'ar'));
                
            const packagesData = packagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const feeRulesData = feeRulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            const allPopups = popupSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const firstActivePopup = allPopups.find(p => p.isActive === true);

            if (firstActivePopup) {
                setActivePopup(firstActivePopup);
            } else {
                setActivePopup(null);
            }
            
            if (settingsSnap.exists()) {
                setStoreSettings(settingsSnap.data());
            }
            if (loyaltySnap.exists()) {
                setLoyaltySettings(loyaltySnap.data());
            }

            setProducts(productsData);
            setAllDigitalPackages(packagesData);
            setAllFeeRules(feeRulesData);

            if (productsData.length > 0) {
                const maxPrice = Math.ceil(Math.max(...productsData.map(p => p.price).filter(p => !isNaN(p)), 0) / 100) * 100;
                const finalMax = maxPrice > 0 ? maxPrice : 1000;
                setInitialMaxPrice(finalMax);
                setPriceRange({ min: 0, max: finalMax });
            }

            // Separately fetch potentially restricted data like discounts.
            // If this fails, the app can still function.
            try {
                const discountsQuery = query(collection(db, 'discounts'));
                const discountsSnapshot = await getDocs(discountsQuery);
                const discountsData = discountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDiscounts(discountsData);
            } catch (discountError) {
                console.warn("Could not fetch discounts, likely due to permissions. This is a non-critical error.", discountError);
                setDiscounts([]); // Gracefully degrade by setting discounts to an empty array.
            }

        } catch (err) {
            console.error("Error fetching critical initial data from Firestore:", err);
            setToastMessage({ text: "فشل تحميل البيانات الأساسية. يرجى تحديث الصفحة.", type: 'error' });
        }
        setProductsLoading(false);
    }, [setToastMessage]);

    const baseFilteredProducts = useMemo(() => {
        let tempProducts = [...products];
        if (searchTerm) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            tempProducts = tempProducts.filter(p =>
                (p.arabicName && p.arabicName.toLowerCase().includes(lowercasedSearchTerm)) ||
                (p.englishName && p.englishName.toLowerCase().includes(lowercasedSearchTerm))
            );
        } else if (showAllOffersView) {
            tempProducts = tempProducts.filter(p => p.discountPrice);
        } else if (selectedCategory !== ProductCategory.All) {
            tempProducts = tempProducts.filter(p => p.category === selectedCategory);
        }
        return tempProducts;
    }, [products, searchTerm, showAllOffersView, selectedCategory]);

    const { brands, availableSpecFilters } = useMemo(() => {
        const brandsSet = new Set();
        const specsMap = {};
        baseFilteredProducts.forEach(p => {
            if (p.brand) brandsSet.add(p.brand);
            if (p.specifications) {
                Object.entries(p.specifications).forEach(([key, value]) => {
                    if (!specsMap[key]) specsMap[key] = new Set();
                    specsMap[key].add(value);
                });
            }
        });
        const sortedSpecs = {};
        Object.keys(specsMap).sort().forEach(key => {
            sortedSpecs[key] = Array.from(specsMap[key]).sort();
        });
        return {
            brands: Array.from(brandsSet).sort(),
            availableSpecFilters: sortedSpecs,
        };
    }, [baseFilteredProducts]);

    useEffect(() => {
        if (productsLoading) return;
        
        const processedProducts = filterAndSortProducts({
            products: baseFilteredProducts, // Filter from the base set
            sortOption,
            activeFilters,
            priceRange,
        });
        
        const timer = setTimeout(() => {
            setFilteredAndSortedProducts(processedProducts);
        }, 150); // A small debounce to prevent jarring updates while sliding price

        return () => clearTimeout(timer);

    }, [sortOption, baseFilteredProducts, activeFilters, priceRange, productsLoading]);
    
    const handleFilterChange = useCallback((newFilters) => {
        setActiveFilters(newFilters);
    }, []);
    
    const handlePriceRangeChange = useCallback((newRange) => {
        setPriceRange(newRange);
    }, []);
    
    const handleResetFilters = useCallback(() => {
        setActiveFilters({ brands: [], specs: {}, discountedOnly: false });
        setPriceRange({ min: 0, max: initialMaxPrice });
    }, [initialMaxPrice]);

    const filterCounts = useMemo(() => {
        const counts = { brands: {}, specs: {} };

        // --- Brand Counts Calculation ---
        let productsForBrandCounting = baseFilteredProducts;
        productsForBrandCounting = productsForBrandCounting.filter(p => {
            const price = p.discountPrice || p.price;
            return p.isDynamicElectronicPayments ? true : (price >= priceRange.min && price <= priceRange.max);
        });
        if (activeFilters.discountedOnly) {
            productsForBrandCounting = productsForBrandCounting.filter(p => p.discountPrice);
        }
        Object.entries(activeFilters.specs).forEach(([specName, specValues]) => {
            if (specValues && specValues.length > 0) {
                productsForBrandCounting = productsForBrandCounting.filter(p => p.specifications && specValues.includes(p.specifications[specName]));
            }
        });
        brands.forEach(brand => {
            counts.brands[brand] = productsForBrandCounting.filter(p => p.brand === brand).length;
        });

        // --- Specs Counts Calculation ---
        Object.entries(availableSpecFilters).forEach(([specName, specValues]) => {
            counts.specs[specName] = {};
            let productsForSpecCounting = baseFilteredProducts;
            productsForSpecCounting = productsForSpecCounting.filter(p => {
                const price = p.discountPrice || p.price;
                return p.isDynamicElectronicPayments ? true : (price >= priceRange.min && price <= priceRange.max);
            });
            if (activeFilters.discountedOnly) {
                productsForSpecCounting = productsForSpecCounting.filter(p => p.discountPrice);
            }
            if (activeFilters.brands && activeFilters.brands.length > 0) {
                productsForSpecCounting = productsForSpecCounting.filter(p => activeFilters.brands.includes(p.brand));
            }
            Object.entries(activeFilters.specs).forEach(([otherSpecName, otherSpecValues]) => {
                if (specName !== otherSpecName && otherSpecValues && otherSpecValues.length > 0) {
                    productsForSpecCounting = productsForSpecCounting.filter(p => p.specifications && otherSpecValues.includes(p.specifications[otherSpecName]));
                }
            });
            specValues.forEach(value => {
                counts.specs[specName][value] = productsForSpecCounting.filter(
                    p => p.specifications && p.specifications[specName] === value
                ).length;
            });
        });

        return counts;
    }, [baseFilteredProducts, brands, availableSpecFilters, activeFilters, priceRange]);

    const getProductsForCategory = useCallback((categoryIds, limit) => {
        if (productsLoading) return [];
        const categoryProducts = products.filter(p => categoryIds.includes(p.category));
        return categoryProducts
            .sort((a, b) => (b.isNew ? 1:0) - (a.isNew ? 1:0) || a.arabicName.localeCompare(b.arabicName, 'ar'))
            .slice(0, limit);
    }, [products, productsLoading]);

    return {
        products: products,
        productsLoading,
        initialMaxPrice,
        allDigitalPackages,
        allFeeRules,
        activePopup,
        storeSettings,
        loyaltySettings,
        filteredAndSortedProducts,
        sortOption,
        setSortOption,
        searchTerm,
        setSearchTerm,
        getProductsForCategory,
        fetchInitialData,
        discounts,
        // Filter props
        brands,
        availableSpecFilters,
        activeFilters,
        setActiveFilters,
        priceRange,
        setPriceRange,
        handleFilterChange,
        handlePriceRangeChange,
        handleResetFilters,
        filterCounts,
    };
};