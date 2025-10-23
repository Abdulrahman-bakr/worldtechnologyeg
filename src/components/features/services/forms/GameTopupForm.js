import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCartIcon, StarIcon } from '../../../icons/index.js';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';

const GameTopupForm = ({ product, onInitiateDirectCheckout, allDigitalPackages }) => {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [formData, setFormData] = useState({});
    const [formStep, setFormStep] = useState('packageSelection');
    const [formError, setFormError] = useState('');
    const [packagesLoading, setPackagesLoading] = useState(true);
    const [servicePackages, setServicePackages] = useState([]);

    const fieldsForService = useMemo(() => {
        if (!product) return [];
        return product.requiredFields || [];
    }, [product]);

    useEffect(() => {
        if (!product) {
            setServicePackages([]);
            setPackagesLoading(false);
            setFormError('');
            return;
        }

        setPackagesLoading(true);
        if (allDigitalPackages && allDigitalPackages.length > 0 && product.dynamicServiceId) {
            let foundPackages = [];
            const packageDocument = allDigitalPackages.find(doc => doc.serviceId === product.dynamicServiceId && Array.isArray(doc.packages));

            if (packageDocument) {
                foundPackages = packageDocument.packages.map((p, index) => ({
                    ...p,
                    id: p.id || `${product.dynamicServiceId}-${(p.name || `pkg-${index}`).replace(/\s/g, '')}`
                }));
            }

            if (foundPackages.length > 0) {
                foundPackages.sort((a, b) => (a.price || 0) - (b.price || 0));
                setServicePackages(foundPackages);
                setFormError('');
            } else {
                setServicePackages([]);
                setFormError("لا توجد باقات شحن متاحة لهذه الخدمة حالياً.");
            }
        }
        setPackagesLoading(false);
    }, [product, allDigitalPackages]);
    
    const pointsToEarn = useMemo(() => {
        return selectedPackage ? Math.floor(selectedPackage.price || 0) : 0;
    }, [selectedPackage]);

    const handleProceedToDetails = () => {
        if (selectedPackage) {
            if (!fieldsForService || fieldsForService.length === 0) {
                const serviceDetails = {
                    serviceName: product.arabicName,
                    packageName: selectedPackage.name,
                    packagePrice: Number(selectedPackage.price || 0),
                    finalPrice: Number(selectedPackage.price || 0),
                    package: { imageUrl: selectedPackage.imageUrl || null },
                    formData: []
                };
                onInitiateDirectCheckout(product, serviceDetails);
            } else {
                setFormStep('details');
                setFormError('');
            }
        } else {
            setFormError('يرجى اختيار باقة أولاً للمتابعة.');
        }
    };

    const handleDynamicServiceCheckout = () => {
        setFormError('');
        if (!fieldsForService || fieldsForService.length === 0) return;
        for (const field of fieldsForService) {
            if (!formData[field.id] || !formData[field.id].trim()) {
                setFormError(`يرجى إدخال ${field.label}.`);
                return;
            }
            if (field.type === 'tel' && !/^\d+$/.test(formData[field.id].trim())) {
                setFormError(`حقل ${field.label} يجب أن يحتوي على أرقام فقط.`);
                return;
            }
        }
        if (!selectedPackage) {
            setFormError('حدث خطأ، لم يتم تحديد باقة الشحن.');
            setFormStep('packageSelection');
            return;
        }
        const serviceDetails = {
            serviceName: product.arabicName,
            packageName: selectedPackage.name,
            packagePrice: Number(selectedPackage.price || 0),
            finalPrice: Number(selectedPackage.price || 0),
            package: { imageUrl: selectedPackage.imageUrl || null },
            formData: fieldsForService.map(field => ({
                label: field.label, value: formData[field.id].trim(), id: field.id
            }))
        };
        onInitiateDirectCheckout(product, serviceDetails);
    };
    
    if (packagesLoading) {
        return React.createElement("div", { className: "text-center" },
            React.createElement("p", { className: "text-dark-800 dark:text-dark-100" }, "جاري تحميل الباقات...")
        );
    }

    if (servicePackages.length === 0 && !packagesLoading) {
        return React.createElement("div", { className: "text-center" },
            React.createElement("p", { className: "text-red-500" }, formError || "لا توجد باقات متاحة لهذه الخدمة.")
        );
    }
    
    const isDetailsFormValid = fieldsForService.length > 0 && fieldsForService.every(field => formData[field.id] && formData[field.id].trim() !== '');
    const packageStepTitle = product.packageSelectionStepTitle || "1. اختر الباقة";
    const detailsStepTitle = product.detailsStepTitle || `2. بيانات ${product.arabicName}`;

    return React.createElement("div", { className: "mt-4" },
        React.createElement("div", {
            className: `transition-all duration-300 ease-in-out ${formStep === 'packageSelection' ? 'block' : 'hidden'}`
        },
            React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3" }, packageStepTitle),
             React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 max-h-[40vh] overflow-y-auto pr-2" },
                servicePackages.map(pkg => {
                    const isSelected = selectedPackage && selectedPackage.id === pkg.id;
                    return React.createElement("button", {
                        key: pkg.id, type: "button", onClick: () => setSelectedPackage(pkg),
                        className: `uc-card relative text-center p-3 rounded-xl border-2 transition-all duration-200 transform hover:-translate-y-1 ${isSelected ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-primary/30 shadow-md' : 'border-light-300 dark:border-dark-600 bg-white dark:bg-dark-800 hover:bg-light-50 dark:hover:bg-dark-600'}`
                    },
                        pkg.popular && React.createElement("div", { className: "popular-tag absolute top-1 left-1/2 -translate-x-1/2 z-[20]" },
                            React.createElement(StarIcon, { filled: true }),
                            React.createElement("span", null, "شائع")
                        ),
                        pkg.discount && React.createElement("div", { className: "absolute top-1 -right-2 z-[20] bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg transform rotate-12" },
                            `خصم ${pkg.discount}`
                        ),
                        pkg.imageUrl && React.createElement("img", { src: pkg.imageUrl, alt: pkg.name, className: "h-12 md:h-16 mx-auto mb-1 object-contain" }),
                        React.createElement("p", { className: "text-dark-800 dark:text-dark-100 font-semibold text-sm" }, pkg.name),
                        React.createElement("div", { className: "text-primary font-bold text-sm mt-1" }, `${(pkg.price || 0).toFixed(2)} ج.م`)
                    );
                })
            ),
             formError && formStep === 'packageSelection' && React.createElement("p", { className: "text-red-500 text-sm text-center mt-2" }, formError),
             React.createElement("div", {className: "mt-auto pt-4"},
                (pointsToEarn > 0) && React.createElement("p", { className: "mb-2 flex items-center justify-center gap-1 text-sm text-yellow-700 dark:text-yellow-300 font-semibold" },
                    React.createElement(StarIcon, { filled: true, className: "w-4 h-4" }),
                    React.createElement("span", null, `ستحصل على ${pointsToEarn} نقطة عند اختيار هذه الباقة`)
                ),
                React.createElement("button", {
                    onClick: handleProceedToDetails,
                    disabled: !selectedPackage,
                    className: `w-full bg-secondary hover:bg-secondary-hover text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${selectedPackage ? 'animate-button-pulse' : ''}`
                }, "التالي")
             )
        ),
        React.createElement("div", {
            className: `transition-all duration-300 ease-in-out ${formStep === 'details' ? 'block' : 'hidden'}`
        },
            React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3" }, detailsStepTitle),
            React.createElement("div", { className: "space-y-4" },
                fieldsForService.map(field => React.createElement(FloatingInput, {
                    key: field.id,
                    id: `service-field-${field.id}`,
                    value: formData[field.id] || '',
                    onChange: (e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value })),
                    placeholder: `${field.label} *`,
                    type: field.type || 'text',
                    required: true
                }))
            ),
             React.createElement("div", { className: "flex items-center gap-3 mt-4" },
                React.createElement("button", {
                    type: "button",
                    onClick: () => setFormStep('packageSelection'),
                    className: "bg-light-200 dark:bg-dark-600 hover:bg-light-300 dark:hover:bg-dark-500 text-dark-800 dark:text-dark-100 font-bold py-3 px-6 rounded-lg text-lg transition-colors"
                }, "رجوع"),
                React.createElement("button", {
                    type: "button",
                    onClick: handleDynamicServiceCheckout, disabled: !isDetailsFormValid,
                    className: "w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                }, 
                  React.createElement(ShoppingCartIcon, { className: "w-6 h-6" }),
                  React.createElement("span", null, "إتمام الشراء الآن")
                )
             ),
             formError && formStep === 'details' && React.createElement("p", { className: "text-red-500 text-sm text-center mt-4" }, formError)
        )
    );
};

export { GameTopupForm };