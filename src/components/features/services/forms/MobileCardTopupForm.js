import React, { useState, useMemo, useEffect } from 'react';
import { StarIcon, InfoIcon } from '../../../icons/index.js';
import { FloatingInput } from '../../../ui/forms/FloatingInput.js';
import { MOBILE_OPERATOR_CONFIG, ETISALAT_CARD_OPTIONS, ORANGE_CARD_OPTIONS } from '../../../../constants/index.js';
import { getImageUrl } from '../../../../utils/imageUrl.js';

const renderGroupedBenefits = (benefits) => {
    if (!benefits || typeof benefits !== 'object' || Object.keys(benefits).length === 0) {
        return null;
    }
    
    const benefitValues = Object.values(benefits);
    if (benefitValues.length === 1) {
        const benefitText = benefitValues[0];
        if (String(benefitText).includes('رصيد')) {
             return React.createElement("p", { className: "text-sm text-dark-700 dark:text-dark-200" }, `يعطيك ${benefitText}`);
        }
        return React.createElement("p", { className: "text-sm text-primary font-semibold" }, benefitText);
    }
    
    return React.createElement(React.Fragment, null,
        React.createElement("p", { className: "text-sm text-primary font-bold mb-1" }, "يعطيك أحد الخيارات التالية:"),
        React.createElement("div", { className: "space-y-1" },
            benefitValues.map((value, index) => 
                React.createElement("p", { key: index, className: "text-xs text-primary font-semibold" }, `• ${value}`)
            )
        )
    );
};

const MobileCardTopupForm = ({ product, onInitiateDirectCheckout, allDigitalPackages }) => {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [formError, setFormError] = useState('');
    const [rechargeType, setRechargeType] = useState('code');
    const [selectedCardOperatorKey, setSelectedCardOperatorKey] = useState('');
    const [cardPhoneNumber, setCardPhoneNumber] = useState('');
    const [etisalatOption, setEtisalatOption] = useState('mixat');
    const [orangeOption, setOrangeOption] = useState('el_kabeer_internet');
    const [packagesLoading, setPackagesLoading] = useState(true);
    const [servicePackages, setServicePackages] = useState([]);

    const pointsToEarn = useMemo(() => {
        return selectedPackage ? Math.floor(Number(selectedPackage.price) || 0) : 0;
    }, [selectedPackage]);

    const operatorCardPackages = useMemo(() => {
        if (!selectedCardOperatorKey || !allDigitalPackages || !product) return [];
        
        const operatorInfo = MOBILE_OPERATOR_CONFIG[selectedCardOperatorKey];
        if (!operatorInfo) return [];

        const serviceDocuments = allDigitalPackages.filter(doc => doc.serviceId === product.dynamicServiceId);
        let foundPackages = [];

        serviceDocuments.forEach(doc => {
            if (Array.isArray(doc.operators)) {
                const operatorData = doc.operators.find(op => op.name && op.name.toLowerCase() === operatorInfo.name.toLowerCase());
                if (operatorData && Array.isArray(operatorData.packages)) {
                    foundPackages.push(...operatorData.packages);
                }
            }
            else if (doc.operator && doc.operator.toLowerCase() === operatorInfo.name.toLowerCase() && Array.isArray(doc.packages)) {
                foundPackages.push(...doc.packages);
            }
        });

        let packages = [...foundPackages].filter(pkg => rechargeType === 'code' ? pkg.showOnCode !== false : pkg.showOnDirect !== false);

        if (rechargeType === 'direct') {
            let benefitKey = null;
            if (selectedCardOperatorKey === '011') benefitKey = etisalatOption;
            else if (selectedCardOperatorKey === '012') benefitKey = orangeOption;
            
            packages = packages.filter(pkg => {
                if (!pkg.benefits) return true;
                const keys = Object.keys(pkg.benefits);
                if (keys.length === 1 && keys[0] === 'default_credit') return true;
                return benefitKey ? Object.prototype.hasOwnProperty.call(pkg.benefits, benefitKey) : false;
            });
        }
        
        return packages.sort((a, b) => (a.price || 0) - (b.price || 0));
    }, [selectedCardOperatorKey, allDigitalPackages, product, rechargeType, etisalatOption, orangeOption]);
    
    const hasAnyPackagesForService = useMemo(() => {
        if (!product?.dynamicServiceId || !allDigitalPackages) return false;
        const packageDoc = allDigitalPackages.find(doc => doc.serviceId === product.dynamicServiceId && Array.isArray(doc.packages));
        return !!packageDoc && packageDoc.packages.length > 0;
    }, [product, allDigitalPackages]);

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

    const handleMobileCardTopupCheckout = () => {
        setFormError('');
        if (!selectedPackage) {
            setFormError('الرجاء اختيار فئة الكارت.');
            return;
        }
        if (rechargeType === 'direct' && (!cardPhoneNumber || !/^\d{11}$/.test(cardPhoneNumber))) {
            setFormError('لشحن الهواء، يرجى إدخال رقم هاتف صحيح من 11 رقمًا.');
            return;
        }
        const cardPrice = Number(selectedPackage.price || 0);
        const packageName = (selectedPackage.name && selectedPackage.name.trim()) 
            ? selectedPackage.name 
            : `كارت ${MOBILE_OPERATOR_CONFIG[selectedCardOperatorKey].arabicName} ${cardPrice}`;

        onInitiateDirectCheckout(product, {
            finalPrice: cardPrice,
            rechargeType: rechargeType,
            operator: MOBILE_OPERATOR_CONFIG[selectedCardOperatorKey].arabicName,
            cardValue: selectedPackage.cardValue,
            validity: selectedPackage.validity,
            phoneNumber: rechargeType === 'direct' ? cardPhoneNumber : undefined,
            etisalatOption: (rechargeType === 'direct' && selectedCardOperatorKey === '011') ? etisalatOption : undefined,
            orangeOption: (rechargeType === 'direct' && selectedCardOperatorKey === '012') ? orangeOption : undefined,
            packageName: packageName,
            package: { imageUrl: product.imageUrl },
            formData: [
                { label: 'نوع الشحن', value: rechargeType === 'code' ? 'استلام كود' : 'شحن مباشر' },
                { label: 'الشبكة', value: MOBILE_OPERATOR_CONFIG[selectedCardOperatorKey].arabicName },
                { label: 'سعر الكارت', value: `${cardPrice} ج.م` },
                ...(selectedPackage.validity ? [{ label: 'صلاحية الكارت', value: selectedPackage.validity }] : []),
                ...(rechargeType === 'direct' ? [{ label: 'رقم الهاتف', value: cardPhoneNumber }] : []),
                ...(rechargeType === 'direct' && selectedCardOperatorKey === '011' && etisalatOption !== 'default_credit' 
                    ? [{ label: 'تحويل إلى', value: ETISALAT_CARD_OPTIONS.find(o => o.value === etisalatOption)?.label }] 
                    : [])
            ]
        });
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
    
    const isCheckoutDisabled = !selectedPackage || (rechargeType === 'direct' && (!cardPhoneNumber || !/^\d{11}$/.test(cardPhoneNumber)));
    let stepCounter = 1;

    const OperatorLogo = selectedCardOperatorKey ? MOBILE_OPERATOR_CONFIG[selectedCardOperatorKey].logo : null;

    if (!allDigitalPackages) {
        return React.createElement("div", { className: "text-center" },
            React.createElement("p", { className: "text-dark-800 dark:text-dark-100" }, "جاري تحميل الباقات...")
        );
    }
    
    if (!hasAnyPackagesForService) {
        return React.createElement("div", { className: "text-center" },
            React.createElement("p", { className: "text-red-500" }, "لا توجد باقات شحن متاحة لهذه الخدمة حالياً.")
        );
    }

    return React.createElement("form", {
        onSubmit: (e) => { e.preventDefault(); handleMobileCardTopupCheckout(); },
        className: "mt-4 space-y-4"
    },
        React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3 text-center" }, "شحن كروت الموبايل"),
        React.createElement("fieldset", null,
            React.createElement("legend", { className: "block text-sm font-medium mb-2 text-dark-800 dark:text-dark-100" }, `${stepCounter++}. اختر نوع الشحن`),
            React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                React.createElement("button", {
                    type: "button", onClick: () => setRechargeType('code'),
                    className: `p-3 text-center rounded-xl border-2 transition-all ${rechargeType === 'code' ? 'border-primary bg-primary/5' : 'border-light-300 dark:border-dark-600'}`
                }, "استلام كود"),
                React.createElement("button", {
                    type: "button", onClick: () => setRechargeType('direct'),
                    className: `p-3 text-center rounded-xl border-2 transition-all ${rechargeType === 'direct' ? 'border-primary bg-primary/5' : 'border-light-300 dark:border-dark-600'}`
                }, "شحن على الهواء")
            ),
            rechargeType === 'direct' && React.createElement("div", { className: "mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md flex items-start gap-2" },
                React.createElement(InfoIcon, { className: "w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" }),
                React.createElement("p", { className: "text-xs text-blue-700 dark:text-blue-200" }, "سيتم شحن الكارت مباشرة على رقم الهاتف بمجرد إتمام العملية، دون الحاجة لإدخال أي أكواد.")
            )
        ),
        React.createElement("fieldset", null,
            React.createElement("legend", { className: "block text-sm font-medium mb-2 text-dark-800 dark:text-dark-100" }, `${stepCounter++}. اختر الشبكة`),
            React.createElement("div", { className: "flex items-center gap-3" },
                React.createElement("select", { value: selectedCardOperatorKey, onChange: (e) => { setSelectedCardOperatorKey(e.target.value); setSelectedPackage(null); }, className: "flex-grow w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50" },
                    React.createElement("option", { value: "" }, "اختر الشبكة..."),
                    Object.entries(MOBILE_OPERATOR_CONFIG).map(([key, op]) => React.createElement("option", { key: key, value: key }, op.arabicName))
                ),
                OperatorLogo && React.createElement(OperatorLogo, { alt: MOBILE_OPERATOR_CONFIG[selectedCardOperatorKey].arabicName, className: "w-12 h-12 object-contain rounded-md bg-white p-1 border" })
            )
        ),
        (rechargeType === 'direct' && selectedCardOperatorKey === '011') && React.createElement("fieldset", null,
            React.createElement("legend", { className: "block text-sm font-medium mb-2 text-dark-800 dark:text-dark-100" }, `${stepCounter++}. اختر نوع الشحن (اتصالات)`),
            React.createElement("select", { value: etisalatOption, onChange: e => setEtisalatOption(e.target.value), className: "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50" },
                ETISALAT_CARD_OPTIONS.map(opt => React.createElement("option", { key: opt.value, value: opt.value }, opt.label))
            )
        ),
        (rechargeType === 'direct' && selectedCardOperatorKey === '012') && React.createElement("fieldset", null,
            React.createElement("legend", { className: "block text-sm font-medium mb-2 text-dark-800 dark:text-dark-100" }, `${stepCounter++}. اختر نوع الكارت (اورانج)`),
            React.createElement("select", { value: orangeOption, onChange: e => setOrangeOption(e.target.value), className: "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50" },
                ORANGE_CARD_OPTIONS.map(opt => React.createElement("option", { key: opt.value, value: opt.value }, opt.label))
            )
        ),
        (rechargeType === 'direct' && selectedCardOperatorKey) && React.createElement("fieldset", null,
            React.createElement("legend", { className: "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100" }, `${stepCounter++}. أدخل رقم الموبايل`),
            React.createElement(FloatingInput, { id: "card-phone-number", value: cardPhoneNumber, onChange: (e) => setCardPhoneNumber(e.target.value.replace(/\D/g, '')), placeholder: "رقم الهاتف (11 رقم)", type: "tel", required: true })
        ),
        selectedCardOperatorKey && React.createElement("fieldset", null,
            React.createElement("legend", { className: "block text-sm font-medium mb-2 text-dark-800 dark:text-dark-100" }, `${stepCounter++}. اختر فئة الكارت`),
            operatorCardPackages.length > 0 ? React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3" },
                operatorCardPackages.map(pkg => {
                    let benefitText = rechargeType === 'direct' && pkg.benefits ? (pkg.benefits[selectedCardOperatorKey === '011' ? etisalatOption : orangeOption] || `يعطيك ${pkg.benefits.default_credit}`) : null;
                    const displayName = (pkg.name && pkg.name.trim()) ? pkg.name : `كارت فكة ${pkg.price} ج.م`;
                    const imageUrlToShow = pkg.imageUrl || product.imageUrl;
                    return React.createElement("button", {
                        key: `${pkg.price}-${pkg.cardValue}`, type: "button", onClick: () => setSelectedPackage(pkg),
                        className: `p-2 text-center rounded-xl border-2 ${selectedPackage?.cardValue === pkg.cardValue && selectedPackage?.price === pkg.price ? 'border-primary bg-primary/5' : 'border-light-300 dark:border-dark-600'}`
                    },
                        imageUrlToShow && React.createElement("img", { src: getImageUrl(imageUrlToShow), alt: displayName, className: "w-full h-16 object-contain mb-2", loading: "lazy" }),
                        React.createElement("p", { className: "font-bold text-md" }, displayName),
                        React.createElement("div", { className: "text-xs text-dark-600 mt-1" },
                            rechargeType === 'code' && (pkg.benefits ? renderGroupedBenefits(pkg.benefits) : `يعطيك رصيد ${pkg.cardValue} ج.م`),
                            pkg.validity && React.createElement("p", { className: "font-medium" }, `صلاحية ${pkg.validity}`),
                            rechargeType === 'direct' && benefitText && React.createElement("p", { className: "text-sm text-primary font-bold" }, benefitText)
                        )
                    );
                })
            ) : React.createElement("p", { className: "text-sm text-center text-dark-600" }, "لا توجد كروت متاحة.")
        ),
        formError && React.createElement("p", { className: "text-red-500 text-xs mt-1 text-center" }, formError),
        React.createElement("div", { className: "pt-4 border-t border-light-200 dark:border-dark-600 mt-auto" },
            selectedPackage && React.createElement("div", { className: "text-center mb-3" },
                React.createElement("p", { className: "text-lg font-bold text-primary" }, `الإجمالي: ${Number(selectedPackage.price || 0).toFixed(2)} ج.م`),
                (pointsToEarn > 0) && React.createElement("p", { className: "mt-1 flex items-center justify-center gap-1 text-xs text-yellow-700 font-medium" },
                    React.createElement(StarIcon, { filled: true, className: "w-3.5 h-3.5" }), `ستحصل على ${pointsToEarn} نقطة`)
            ),
            React.createElement("button", {
                type: "submit", disabled: isCheckoutDisabled,
                className: "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg disabled:opacity-60"
            }, "إتمام الشراء الآن")
        )
    );
};

export { MobileCardTopupForm };