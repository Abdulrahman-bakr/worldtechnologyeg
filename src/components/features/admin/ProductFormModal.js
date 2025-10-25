// world-technology-store/src/components/features/admin/ProductFormModal.js

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CATEGORIES, PRODUCT_BENEFITS_LIST } from '../../../constants/index.js';
import { ArrowUpOnSquareIcon, CloseIcon, StarIcon, TrashIcon, ClipboardDocumentIcon, PlusCircleIcon, SparklesIcon, SearchIcon } from '../../icons/index.js'; 
import { GoogleGenAI } from "@google/genai";

const ImageGalleryManager = ({ imageUrl, imageUrls = [], onImageUpload, onUrlsChange, onMainUrlChange }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);

    const handleFiles = async (files) => {
        if (!files || files.length === 0) return;
        setIsUploading(true);

        const uploadPromises = Array.from(files).map(file => onImageUpload(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        const validUrls = uploadedUrls.filter(Boolean);

        const newUrls = [...imageUrls, ...validUrls];
        onUrlsChange(newUrls);

        if (!imageUrl && validUrls.length > 0) {
            onMainUrlChange(validUrls[0]);
        }
        setIsUploading(false);
    };

    const handleFileChange = (e) => handleFiles(e.target.files);
    
    const handleDragStart = (e, index) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };
    
    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === index) return;
        const newUrls = [...imageUrls];
        const [draggedItem] = newUrls.splice(draggedItemIndex, 1);
        newUrls.splice(index, 0, draggedItem);
        onUrlsChange(newUrls);
        setDraggedItemIndex(index);
    };
    
    const handleDragEnd = () => setDraggedItemIndex(null);

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        const urlToRemove = imageUrls[indexToRemove];
        const newUrls = imageUrls.filter((_, index) => index !== indexToRemove);
        onUrlsChange(newUrls);
        if (imageUrl === urlToRemove) {
            onMainUrlChange(newUrls.length > 0 ? newUrls[0] : '');
        }
    };
    
    const handleSetMain = (indexToSet) => onMainUrlChange(imageUrls[indexToSet]);

    const dropzoneClass = `flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer transition-colors text-center p-2 border-light-300 dark:border-dark-600 hover:border-primary hover:bg-primary/5`;

    return (
        React.createElement("div", { className: "pt-4" },
            React.createElement("h3", { className: "font-semibold mb-2 text-dark-900 dark:text-dark-50" }, "معرض الصور (اسحب للترتيب)"),
            React.createElement("div", { className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3" },
                imageUrls.map((url, index) => (
                    React.createElement("div", { 
                        key: url + index,
                        className: `relative group aspect-square border-2 rounded-lg transition-all ${imageUrl === url ? 'border-primary' : 'border-transparent'} ${draggedItemIndex === index ? 'opacity-50' : ''}`,
                        draggable: true,
                        onDragStart: (e) => handleDragStart(e, index),
                        onDragOver: (e) => handleDragOver(e, index),
                        onDragEnd: handleDragEnd
                    },
                        React.createElement("img", { src: url, alt: `Preview ${index + 1}`, className: "w-full h-full object-contain rounded-md bg-white dark:bg-dark-600 p-1" }),
                        React.createElement("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1" },
                            React.createElement("button", { type: "button", onClick: () => handleSetMain(index), title: "تعيين كصورة رئيسية", className: "p-1.5 bg-white/20 rounded-full text-white hover:bg-primary" }, React.createElement(StarIcon, { filled: imageUrl === url, className: "w-4 h-4" })),
                            React.createElement("button", { type: "button", onClick: () => handleRemoveImage(index), title: "حذف الصورة", className: "p-1.5 bg-white/20 rounded-full text-white hover:bg-red-500" }, React.createElement(TrashIcon, { className: "w-4 h-4" }))
                        )
                    )
                )),
                React.createElement("label", { 
                    className: dropzoneClass,
                    onDragOver: (e) => e.preventDefault(),
                    onDrop: handleDrop
                 },
                    isUploading 
                        ? React.createElement("span", { className: "text-xs" }, "جاري الرفع...") 
                        : React.createElement(React.Fragment, null, 
                            React.createElement(ArrowUpOnSquareIcon, { className: "w-8 h-8 text-dark-600 dark:text-dark-300" }),
                            React.createElement("span", { className: "text-xs text-dark-600 dark:text-dark-300 mt-1" }, "اسحب وأفلت أو اضغط")
                          ),
                    React.createElement("input", { type: "file", multiple: true, className: "hidden", onChange: handleFileChange, accept: "image/*" })
                )
            )
        )
    );
};

const TabButton = ({ id, activeTab, label, onClick }) => (
    React.createElement("button", {
        type: "button",
        onClick: () => onClick(id),
        className: `px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === id ? 'bg-light-100 dark:bg-dark-700/50 border-b-2 border-primary text-primary' : 'text-dark-600 dark:text-dark-300 hover:bg-light-100/50 dark:hover:bg-dark-700/20'}`
    }, label)
);

const ProductFormModal = ({ isOpen, onClose, product, onSave, onImageUpload, digitalServices, feeRules }) => {
    const [formData, setFormData] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    const [hasVariants, setHasVariants] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [formError, setFormError] = useState('');
    const descriptionRef = useRef(null);
    const [proposedId, setProposedId] = useState('');
    const [idManuallyEdited, setIdManuallyEdited] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const [benefitSearch, setBenefitSearch] = useState('');

    const slugify = (text) => text ? text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[/?#[\]*()]/g, '') : '';

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleGenerateDescription = async () => {
        setIsGeneratingDesc(true);
        setFormError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const specsText = (formData.specifications || [])
                .map(([key, value]) => key && value ? `${key}: ${value}` : '')
                .filter(Boolean).join(', ');

            const prompt = `
                أنت خبير في كتابة وصف المنتجات للمتاجر الإلكترونية باللغة العربية.
                اكتب وصفًا جذابًا ومقنعًا ومناسبًا لمحركات البحث (SEO) للمنتج التالي.
                اجعل الوصف واضحًا وسهل القراءة وركز على الفوائد الرئيسية للمستخدم.

                تفاصيل المنتج:
                - الاسم: ${formData.arabicName}
                - الماركة: ${formData.brand || 'غير محددة'}
                - الفئة: ${formData.category || 'غير محددة'}
                - المواصفات: ${specsText || 'لا توجد مواصفات'}

                ابدأ مباشرة بالوصف دون أي مقدمات.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const text = response.text;
            if (text) {
                setFormData(prev => ({ ...prev, description: text.trim() }));
            } else {
                setFormError('لم يتمكن الذكاء الاصطناعي من إنشاء وصف. يرجى المحاولة مرة أخرى.');
            }
        } catch (error) {
            console.error("Error generating description:", error);
            setFormError('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.');
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    const applyFormat = (format) => {
        const textarea = descriptionRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        let replacement;
        switch (format) {
            case 'bold': replacement = `<strong>${selectedText}</strong>`; break;
            case 'italic': replacement = `<em>${selectedText}</em>`; break;
            case 'list': replacement = `<ul>\n  <li>${selectedText || 'عنصر 1'}</li>\n  <li>عنصر 2</li>\n</ul>`; break;
            default: return;
        }
        const newText = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        setFormData(prev => ({ ...prev, description: newText }));
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + replacement.length - (format === 'list' ? 6 : (format === 'bold' ? 9 : 5) );
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    useEffect(() => {
        if (product) {
            const hasExistingVariants = product.variants && product.variants.length > 0;
            setHasVariants(hasExistingVariants);
            setFormData({
                ...product, status: product.status || 'draft',
                specifications: product.specifications ? Object.entries(product.specifications) : [],
                features: product.features || [], imageUrls: product.imageUrls || (product.imageUrl ? [product.imageUrl] : []),
                requiredFields: product.requiredFields || [],
                variants: hasExistingVariants ? product.variants : [], lowStockThreshold: product.lowStockThreshold ?? 10,
                benefitIds: product.benefitIds || [],
                pointsForReview: product.pointsForReview ?? 0,
                videoUrl: product.videoUrl || '',
            });
        } else {
            setHasVariants(false);
            setFormData({
                arabicName: '', name: '', brand: '', category: '', price: 0, discountPrice: 0, stock: 0, lowStockThreshold: 10,
                description: '', specifications: [], features: [], imageUrl: '', imageUrls: [], isNew: false, 
                isDynamicElectronicPayments: false, allowDirectPurchase: false, requiredFields: [],
                variants: [], status: 'draft',
                benefitIds: [], pointsForReview: 0,
                videoUrl: '',
            });
            setProposedId('');
            setIdManuallyEdited(false);
        }
        setActiveTab('basic');
        setFormError('');
        setCopySuccess('');
    }, [product, isOpen]);
    
    const handleSpecChange = (index, key, value) => {
        const newSpecs = [...formData.specifications];
        newSpecs[index] = [key, value];
        setFormData(prev => ({ ...prev, specifications: newSpecs }));
    };
    const handleAddSpec = () => setFormData(prev => ({ ...prev, specifications: [...(prev.specifications || []), ['', '']] }));
    const handleRemoveSpec = (index) => setFormData(prev => ({ ...prev, specifications: (prev.specifications || []).filter((_, i) => i !== index) }));
    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };
    const handleAddArrayItem = (field) => setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }));
    const handleRemoveArrayItem = (field, index) => setFormData(prev => ({ ...prev, [field]: (prev[field] || []).filter((_, i) => i !== index) }));
    const handleRequiredFieldChange = (index, fieldName, value) => {
        const newFields = [...(formData.requiredFields || [])];
        newFields[index] = { ...newFields[index], [fieldName]: value };
        setFormData(prev => ({ ...prev, requiredFields: newFields }));
    };
    const handleAddRequiredField = () => setFormData(prev => ({ ...prev, requiredFields: [...(prev.requiredFields || []), { id: '', label: '', type: 'text', placeholder: '' }] }));
    const handleRemoveRequiredField = (index) => setFormData(prev => ({ ...prev, requiredFields: (prev.requiredFields || []).filter((_, i) => i !== index) }));
    
    const handleNumericInput = (field, value, isFloat = false) => {
        const regex = isFloat ? /^\d*\.?\d*$/ : /^\d*$/;
        if (regex.test(value)) {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };
    
    const handleVariantNumericInput = (index, fieldName, value, isFloat = false) => {
        const regex = isFloat ? /^\d*\.?\d*$/ : /^\d*$/;
        if (regex.test(value)) {
            const newVariants = [...(formData.variants || [])];
            newVariants[index] = { ...newVariants[index], [fieldName]: value };
            setFormData(prev => ({ ...prev, variants: newVariants }));
        }
    };
    
    const handleAddVariant = () => setFormData(prev => ({ ...prev, variants: [...(prev.variants || []), { colorName: '', colorHex: '#ffffff', imageUrl: '', price: 0, discountPrice: 0, stock: 0 }] }));
    const handleRemoveVariant = (index) => setFormData(prev => ({ ...prev, variants: (prev.variants || []).filter((_, i) => i !== index) }));
    const handleVariantFileChange = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const url = await onImageUpload(file);
        if (url) {
            const newVariants = [...(formData.variants || [])];
            newVariants[index] = { ...newVariants[index], imageUrl: url };
            setFormData(prev => ({ ...prev, variants: newVariants }));
        }
        setIsUploading(false);
    };
    const handleCopyId = () => {
        if (product?.id) {
            navigator.clipboard.writeText(product.id).then(() => {
                setCopySuccess('تم النسخ!');
                setTimeout(() => setCopySuccess(''), 2000);
            });
        }
    };
    const handleBenefitChange = (benefitId) => {
        setFormData(prev => {
            const currentIds = prev.benefitIds || [];
            const newIds = currentIds.includes(benefitId)
                ? currentIds.filter(id => id !== benefitId)
                : [...currentIds, benefitId];
            return { ...prev, benefitIds: newIds };
        });
    };

    const groupedBenefits = useMemo(() => {
        return PRODUCT_BENEFITS_LIST.reduce((acc, benefit) => {
            const category = benefit.category || 'مزايا متنوعة';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(benefit);
            return acc;
        }, {});
    }, []);

    const handleToggleBenefitCategory = (category, selectAll) => {
        const categoryBenefitIds = groupedBenefits[category].map(b => b.id);
        setFormData(prev => {
            const currentIds = new Set(prev.benefitIds || []);
            if (selectAll) {
                categoryBenefitIds.forEach(id => currentIds.add(id));
            } else {
                categoryBenefitIds.forEach(id => currentIds.delete(id));
            }
            return { ...prev, benefitIds: Array.from(currentIds) };
        });
    };
    
    const filteredBenefits = useMemo(() => {
        if (!benefitSearch) return groupedBenefits;
        const lowercasedSearch = benefitSearch.toLowerCase();
        const filtered = {};
        for (const category in groupedBenefits) {
            const matchingBenefits = groupedBenefits[category].filter(b => 
                b.title.toLowerCase().includes(lowercasedSearch) || 
                b.description.toLowerCase().includes(lowercasedSearch)
            );
            if (matchingBenefits.length > 0) {
                filtered[category] = matchingBenefits;
            }
        }
        return filtered;
    }, [benefitSearch, groupedBenefits]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!hasVariants && !formData.isDynamicElectronicPayments && Number(formData.discountPrice) > 0 && Number(formData.discountPrice) >= Number(formData.price)) {
            setFormError('سعر الخصم يجب أن يكون أقل من السعر الأساسي.');
            setActiveTab('basic');
            return;
        }
        let dataToSave = { ...formData, imageUrl: formData.imageUrls.length > 0 ? formData.imageUrls[0] : '' };
        if (!product) dataToSave.customId = proposedId;
        if (dataToSave.isDynamicElectronicPayments) {
            dataToSave.requiredFields = (formData.requiredFields || []).filter(rf => rf && rf.id && rf.label);
            const physicalProductKeys = ['specifications', 'variants'];
            physicalProductKeys.forEach(key => delete dataToSave[key]);
        } else {
            dataToSave.specifications = (formData.specifications || []).reduce((acc, [key, value]) => {
                if (key && value) acc[key] = value;
                return acc;
            }, {});
            dataToSave.features = (formData.features || []).filter(f => f && f.trim());
            dataToSave.lowStockThreshold = Number(formData.lowStockThreshold) || 10;
            if (hasVariants) {
                dataToSave.variants = (dataToSave.variants || []).map(v => ({ ...v, price: Number(v.price) || 0, discountPrice: Number(v.discountPrice) || 0, stock: Number(v.stock) || 0 }));
                dataToSave.price = 0; dataToSave.discountPrice = 0;
                dataToSave.stock = dataToSave.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
            } else {
                dataToSave.price = Number(formData.price) || 0;
                dataToSave.discountPrice = Number(formData.discountPrice) || 0;
                dataToSave.stock = Number(formData.stock) || 0;
                dataToSave.variants = [];
            }
            const digitalServiceKeys = ['dynamicServiceId', 'dynamicServiceType', 'feeRuleId', 'requiredFields', 'packageSelectionStepTitle', 'detailsStepTitle', 'disableLightbox', 'isZoomDisabled'];
            digitalServiceKeys.forEach(key => delete dataToSave[key]);
        }
        dataToSave.pointsForReview = Number(formData.pointsForReview) || 0;
        dataToSave.benefitIds = formData.benefitIds || [];
        dataToSave.videoUrl = formData.videoUrl || '';
        const result = await onSave(dataToSave);
        if (result && !result.success) setFormError(result.error || 'حدث خطأ غير معروف.');
    };
    if (!isOpen) return null;
    const inputClass = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:border-primary focus:ring-primary transition-colors";
    const btnClass = "py-2 px-4 rounded-lg font-semibold transition-colors shadow-md";
    const labelClass = "block text-xs font-medium mb-1 text-dark-800 dark:text-dark-100";
    const tabs = [
        { id: 'basic', label: 'البيانات الأساسية' },
        { id: 'media', label: 'الوسائط والمتغيرات' },
        { id: 'details', label: 'الوصف والمواصفات' },
        { id: 'benefits', label: 'المزايا والمكافآت' },
        ...(formData.isDynamicElectronicPayments ? [{ id: 'digital', label: 'إعدادات الخدمات الرقمية' }] : [])
    ];

    return (
        React.createElement("div", { className: "fixed inset-0 z-[110] flex items-center justify-center p-4", role: "dialog", "aria-modal": "true" },
            React.createElement("div", { className: "modal-overlay absolute inset-0 bg-black/85 backdrop-blur-sm" }),
            React.createElement("div", { className: "modal-content bg-light-50 dark:bg-dark-800 rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col relative", onClick: (e) => e.stopPropagation() },
                React.createElement("button", { onClick: onClose, className: "absolute top-4 left-4 text-dark-600 dark:text-dark-300 hover:text-red-500 p-1 transition-colors", "aria-label": "إغلاق" }, React.createElement(CloseIcon, { className: "w-6 h-6" })),
                React.createElement("h2", { className: "text-xl font-bold mb-4 text-dark-900 dark:text-light-50" }, product ? 'تعديل المنتج' : 'إضافة منتج جديد'),
                React.createElement("div", { className: "border-b border-light-300 dark:border-dark-600 mb-4" }, tabs.map(tab => React.createElement(TabButton, { key: tab.id, ...tab, activeTab: activeTab, onClick: setActiveTab }))),
                formError && React.createElement("div", { className: "p-3 mb-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md text-sm" }, formError),
                React.createElement("form", { id:"product-form", onSubmit: handleSubmit, className: "flex-grow overflow-y-auto pr-2 -mr-2 space-y-4" },
                    activeTab === 'basic' && React.createElement("div", { className: "space-y-4 " },
                        product && React.createElement("div", null, React.createElement("label", {className: labelClass }, "معرف المنتج (ID)"), React.createElement("div", { className: "flex items-center gap-2 p-2.5 bg-light-100 dark:bg-dark-700/50 rounded-md" }, React.createElement("span", { className: "font-mono text-sm text-dark-600 dark:text-dark-300 flex-grow" }, product.id), React.createElement("button", { type: "button", onClick: handleCopyId, className: "text-dark-600 dark:text-dark-300 hover:text-primary" }, copySuccess ? React.createElement("span", { className: "text-xs text-primary" }, copySuccess) : React.createElement(ClipboardDocumentIcon, { className: "w-5 h-5" })))),
                        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                             React.createElement("div", null, React.createElement("label", { className: labelClass }, "الاسم بالعربية *"), React.createElement("input", { value: formData.arabicName || '', onChange: e => { const newName = e.target.value; setFormData({...formData, arabicName: newName}); if (!product && !idManuallyEdited) setProposedId(slugify(newName)); }, placeholder: "الاسم بالعربية", className: inputClass, required: true })),
                            !product && React.createElement("div", null, React.createElement("label", { className: labelClass }, "معرف المنتج (ID) - اختياري"), React.createElement("input", { value: proposedId, onChange: e => { setProposedId(slugify(e.target.value)); setIdManuallyEdited(true); }, placeholder: "سيتم إنشاؤه تلقائياً من الاسم", className: `${inputClass} font-mono`, dir: "ltr" })),
                            React.createElement("div", null, React.createElement("label", { className: labelClass }, "الاسم بالإنجليزية (Name)"), React.createElement("input", { value: formData.name || '', onChange: e => setFormData({...formData, name: e.target.value}), placeholder: "الاسم بالإنجليزية", className: inputClass })),
                            React.createElement("div", null, React.createElement("label", { className: labelClass }, "العلامة التجارية"), React.createElement("input", { value: formData.brand || '', onChange: e => setFormData({...formData, brand: e.target.value}), placeholder: "العلامة التجارية", className: inputClass })),
                            React.createElement("div", null, React.createElement("label", { className: labelClass }, "الفئة *"), React.createElement("select", { value: formData.category || '', onChange: e => setFormData({...formData, category: e.target.value}), className: inputClass, required: true }, React.createElement("option", { value: "" }, "اختر الفئة..."), CATEGORIES.filter(c => c.id !== 'All').map(c => React.createElement("option", { key: c.id, value: c.id }, c.arabicName)))),
                            React.createElement("div", null, React.createElement("label", { className: labelClass }, "حالة المنتج *"), React.createElement("select", { value: formData.status || 'draft', onChange: e => setFormData({...formData, status: e.target.value}), className: inputClass }, React.createElement("option", { value: "draft" }, "مسودة (مخفي)"), React.createElement("option", { value: "published" }, "منشور (ظاهر)"))),
                            !hasVariants && React.createElement(React.Fragment, null,
                                React.createElement("div", null, React.createElement("label", { className: labelClass }, "السعر الأساسي *"), React.createElement("input", { value: formData.price ?? '', onChange: e => handleNumericInput('price', e.target.value, true), placeholder: "السعر", type: "number", step: "0.01", className: inputClass, required: !hasVariants && !formData.isDynamicElectronicPayments })),
                                React.createElement("div", null, React.createElement("label", { className: labelClass }, "سعر الخصم (اختياري)"), React.createElement("input", { value: formData.discountPrice ?? '', onChange: e => handleNumericInput('discountPrice', e.target.value, true), placeholder: "سعر الخصم", type: "number", step: "0.01", className: inputClass })),
                                !formData.isDynamicElectronicPayments && React.createElement(React.Fragment, null, 
                                    React.createElement("div", null, React.createElement("label", { className: labelClass }, "الكمية بالمخزون"), React.createElement("input", { value: formData.stock ?? '', onChange: e => handleNumericInput('stock', e.target.value), placeholder: "المخزون", type: "number", className: inputClass })),
                                    React.createElement("div", null, React.createElement("label", { className: labelClass }, "تنبيه عند انخفاض المخزون عن"), React.createElement("input", { value: formData.lowStockThreshold ?? '', onChange: e => handleNumericInput('lowStockThreshold', e.target.value), type: "number", className: inputClass }))
                                )
                            ),
                             React.createElement("div", { className: "col-span-1 md:col-span-2 flex items-center flex-wrap gap-4 text-sm font-medium text-dark-800 dark:text-dark-100 pt-2 border-t mt-2" }, ["isNew", "isDynamicElectronicPayments"].map(key => React.createElement("label", { key: key, className: "flex items-center gap-2" }, React.createElement("input", { type: "checkbox", checked: !!formData[key], onChange: e => setFormData({...formData, [key]: e.target.checked}), className: "form-checkbox" }), key === 'isNew' ? 'منتج جديد؟' : 'خدمة رقمية؟')), !formData.isDynamicElectronicPayments && React.createElement("label", { className: "flex items-center gap-2" }, React.createElement("input", { type: "checkbox", checked: hasVariants, onChange: e => setHasVariants(e.target.checked), className: "form-checkbox" }), "هذا المنتج له متغيرات؟"))
                        )
                    ),
                    activeTab === 'media' && React.createElement("div", { className: "space-y-4 " },
                        React.createElement(ImageGalleryManager, { imageUrl: formData.imageUrls && formData.imageUrls[0], imageUrls: formData.imageUrls, onImageUpload: onImageUpload, onUrlsChange: (newUrls) => setFormData(prev => ({ ...prev, imageUrls: newUrls })), onMainUrlChange: (newMainUrl) => setFormData(prev => ({...prev, imageUrls: [newMainUrl, ...prev.imageUrls.filter(url => url !== newMainUrl)] })) }),
                        React.createElement("div", { className: "pt-4 border-t" },
                            React.createElement("h3", { className: "font-semibold mb-2 text-dark-900 dark:text-dark-50" }, "فيديو المنتج (اختياري)"),
                            React.createElement("div", null,
                                React.createElement("label", { htmlFor: "product-video-url", className: labelClass }, "رابط الفيديو (YouTube)"),
                                React.createElement("input", {
                                    id: "product-video-url",
                                    value: formData.videoUrl || '',
                                    onChange: (e) => setFormData({ ...formData, videoUrl: e.target.value }),
                                    placeholder: "https://www.youtube.com/watch?v=...",
                                    className: `${inputClass} font-mono`,
                                    dir: "ltr"
                                })
                            )
                        ),
                        hasVariants && !formData.isDynamicElectronicPayments && React.createElement("div", { className: "col-span-1 md:col-span-2 pt-4 border-t space-y-4 bg-light-100 dark:bg-dark-700/50 p-4 rounded-lg" }, React.createElement("h3", { className: "font-semibold text-dark-900 dark:text-dark-50" }, "متغيرات المنتج"), (formData.variants || []).map((variant, index) => React.createElement("div", { key: index, className: "p-3 border rounded-md bg-white dark:bg-dark-800 space-y-4" }, React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, React.createElement("div", null, React.createElement("label", { className: labelClass }, "اسم اللون/المتغير *"), React.createElement("input", { value: variant.colorName || '', onChange: e => handleVariantNumericInput(index, 'colorName', e.target.value), placeholder: "مثال: أحمر", className: inputClass, required: true })), React.createElement("div", null, React.createElement("label", { className: labelClass }, "كود اللون (Hex) *"), React.createElement("div", { className: "flex items-center gap-2" }, React.createElement("input", { type: "color", value: variant.colorHex || '#ffffff', onChange: e => handleVariantNumericInput(index, 'colorHex', e.target.value), className: "h-11 w-12 p-1 border-none rounded-md cursor-pointer bg-transparent" }), React.createElement("input", { type: "text", value: variant.colorHex || '', onChange: e => handleVariantNumericInput(index, 'colorHex', e.target.value), placeholder: "#FF0000", className: inputClass, required: true })))), React.createElement("div", { className: "flex items-center gap-2" }, React.createElement("input", { value: variant.imageUrl || '', readOnly: true, placeholder: "رابط صورة المتغير (اختياري)", className: `${inputClass} bg-light-100 dark:bg-dark-600` }), React.createElement("label", { className: `${btnClass} bg-light-200 dark:bg-dark-600 text-xs cursor-pointer`}, "رفع", React.createElement("input",{type: "file", className: "hidden", onChange: e => handleVariantFileChange(e, index)}))), React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3" }, React.createElement("div", null, React.createElement("label", { className: labelClass }, "السعر *"), React.createElement("input", { value: variant.price ?? '', onChange: e => handleVariantNumericInput(index, 'price', e.target.value, true), placeholder: "السعر", type: "number", step: "0.01", className: inputClass, required: true })), React.createElement("div", null, React.createElement("label", { className: labelClass }, "سعر الخصم"), React.createElement("input", { value: variant.discountPrice ?? '', onChange: e => handleVariantNumericInput(index, 'discountPrice', e.target.value, true), placeholder: "سعر الخصم", type: "number", step: "0.01", className: inputClass })), React.createElement("div", null, React.createElement("label", { className: labelClass }, "المخزون *"), React.createElement("input", { value: variant.stock ?? '', onChange: e => handleVariantNumericInput(index, 'stock', e.target.value), placeholder: "المخزون", type: "number", className: inputClass, required: true }))), React.createElement("button", { type: "button", onClick: () => handleRemoveVariant(index), className: "flex items-center gap-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-semibold pt-2" }, React.createElement(TrashIcon, { className: "w-4 h-4" }), "حذف المتغير"))), React.createElement("button", { type: "button", onClick: handleAddVariant, className: "flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-semibold mt-4" }, React.createElement(PlusCircleIcon, {className: "w-5 h-5"}), "إضافة متغير جديد"))
                    ),
                    activeTab === 'details' && React.createElement("div", { className: "space-y-4 " },
                        React.createElement("div", null,
                            React.createElement("div", { className: "flex justify-between items-center mb-1" },
                                React.createElement("label", { className: labelClass }, "الوصف"),
                                React.createElement("button", { type: "button", onClick: handleGenerateDescription, disabled: isGeneratingDesc, className: "flex items-center gap-1.5 text-xs font-semibold text-primary disabled:opacity-50" },
                                    React.createElement(SparklesIcon, { className: `w-4 h-4 ${isGeneratingDesc ? 'animate-spin' : ''}` }),
                                    isGeneratingDesc ? 'جاري الإنشاء...' : 'إنشاء بالذكاء الاصطناعي'
                                )
                            ),
                            React.createElement("div", { className: "border border-light-300 dark:border-dark-600 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary" },
                                React.createElement("div", { className: "flex items-center gap-2 p-1.5 bg-light-100 dark:bg-dark-700/50 border-b border-light-300 dark:border-dark-600" }, React.createElement("button", { type: "button", onClick: () => applyFormat('bold'), title: "Bold", className: "font-bold p-1 px-3 text-sm rounded hover:bg-light-200 dark:hover:bg-dark-600" }, "B"), React.createElement("button", { type: "button", onClick: () => applyFormat('italic'), title: "Italic", className: "italic p-1 px-3 text-sm rounded hover:bg-light-200 dark:hover:bg-dark-600" }, "I"), React.createElement("button", { type: "button", onClick: () => applyFormat('list'), title: "Unordered List", className: "p-1 px-3 text-sm rounded hover:bg-light-200 dark:hover:bg-dark-600" }, "• قائمة")),
                                React.createElement("textarea", { ref: descriptionRef, value: formData.description || '', onChange: e => setFormData({...formData, description: e.target.value}), placeholder: "الوصف...", className: "w-full p-2.5 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:outline-none min-h-[120px]" })
                            )
                        ),
                        React.createElement("div", { className: "pt-4 border-t" }, React.createElement("h3", { className: "font-semibold mb-2" }, "المواصفات الفنية"), (formData.specifications || []).map((spec, index) => React.createElement("div", { key: index, className: "flex gap-2 mb-2" }, React.createElement("input", { value: spec[0], onChange: e => handleSpecChange(index, e.target.value, spec[1]), placeholder: "اسم المواصفة", className: inputClass }), React.createElement("input", { value: spec[1], onChange: e => handleSpecChange(index, spec[0], e.target.value), placeholder: "قيمة المواصفة", className: inputClass }), React.createElement("button", { type: "button", onClick: () => handleRemoveSpec(index), className: `${btnClass} bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300` }, React.createElement(TrashIcon, { className: 'w-4 h-4' })))), React.createElement("button", { type: "button", onClick: handleAddSpec, className: "text-sm text-primary font-semibold mt-2" }, "+ إضافة مواصفة")),
                        React.createElement("div", { className: "pt-4 border-t" }, React.createElement("h3", { className: "font-semibold mb-2" }, "المميزات"), (formData.features || []).map((feature, index) => React.createElement("div", { key: index, className: "flex gap-2 mb-2" }, React.createElement("input", { value: feature, onChange: e => handleArrayChange('features', index, e.target.value), placeholder: "ميزة...", className: inputClass }), React.createElement("button", { type: "button", onClick: () => handleRemoveArrayItem('features', index), className: `${btnClass} bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300` }, React.createElement(TrashIcon, { className: 'w-4 h-4' })))), React.createElement("button", { type: "button", onClick: () => handleAddArrayItem('features'), className: "text-sm text-primary font-semibold mt-2" }, "+ إضافة ميزة"))
                    ),
                    activeTab === 'benefits' && React.createElement("div", { className: "space-y-6" },
                        React.createElement("div", null,
                            React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3" }, "نقاط مراجعة المنتج"),
                            React.createElement("label", { htmlFor: "pointsForReview", className: labelClass }, "نقاط المكافأة عند إضافة مراجعة"),
                            React.createElement("input", { id: "pointsForReview", type: "number", value: formData.pointsForReview ?? '', onChange: e => handleNumericInput('pointsForReview', e.target.value), className: inputClass, placeholder: "e.g., 50" }),
                            React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300 mt-1" }, "سيحصل العميل على هذا العدد من النقاط عند كتابة مراجعة للمنتج. أدخل 0 لتعطيل المكافأة.")
                        ),
                        React.createElement("div", { className: "pt-4 border-t border-light-300 dark:border-dark-600" },
                            React.createElement("h3", { className: "text-lg font-semibold text-dark-900 dark:text-dark-50 mb-3" }, "مزايا المنتج المعروضة"),
                            React.createElement("div", { className: "relative mb-4" },
                                React.createElement("input", { type: "search", value: benefitSearch, onChange: e => setBenefitSearch(e.target.value), placeholder: "ابحث عن ميزة...", className: `${inputClass} pl-10` }),
                                React.createElement(SearchIcon, { className: "w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-dark-500" })
                            ),
                            React.createElement("div", { className: "space-y-6 max-h-80 overflow-y-auto pr-2" },
                                Object.entries(filteredBenefits).map(([category, benefits]) => (
                                    React.createElement("div", { key: category },
                                        React.createElement("div", { className: "flex justify-between items-center mb-2" },
                                            React.createElement("h4", { className: "font-semibold text-md text-primary" }, category),
                                            React.createElement("div", { className: "flex gap-2" },
                                                React.createElement("button", { type: "button", onClick: () => handleToggleBenefitCategory(category, true), className: "text-xs font-semibold text-blue-500 hover:underline" }, "تحديد الكل"),
                                                React.createElement("button", { type: "button", onClick: () => handleToggleBenefitCategory(category, false), className: "text-xs font-semibold text-red-500 hover:underline" }, "إلغاء الكل")
                                            )
                                        ),
                                        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                                            benefits.map(benefit => (
                                                React.createElement("label", { key: benefit.id, className: "flex items-start gap-3 p-3 bg-light-100 dark:bg-dark-700/50 rounded-lg border border-transparent has-[:checked]:border-primary has-[:checked]:bg-primary/10 cursor-pointer" },
                                                    React.createElement("input", { type: "checkbox", checked: (formData.benefitIds || []).includes(benefit.id), onChange: () => handleBenefitChange(benefit.id), className: "form-checkbox h-5 w-5 rounded text-primary focus:ring-primary mt-1 flex-shrink-0" }),
                                                    React.createElement("div", { className: "flex items-start gap-2 flex-grow" },
                                                        React.createElement(benefit.icon, { className: "w-6 h-6 text-primary flex-shrink-0" }),
                                                        React.createElement("div", { className: "flex-grow" },
                                                            React.createElement("p", { className: "font-semibold" }, benefit.title),
                                                            React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300" }, benefit.description)
                                                        )
                                                    )
                                                )
                                            ))
                                        )
                                    )
                                ))
                            )
                        )
                    ),
                    activeTab === 'digital' && formData.isDynamicElectronicPayments && React.createElement("div", { className: "space-y-4 " }, React.createElement("h3", { className: "font-semibold text-dark-900 dark:text-dark-50" }, "إعدادات الخدمة الرقمية"), React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, React.createElement("div", null, React.createElement("label", { className: labelClass }, "معرف الخدمة (Service ID)"), React.createElement("select", { value: formData.dynamicServiceId || '', onChange: e => setFormData(p => ({...p, dynamicServiceId: e.target.value})), className: inputClass }, React.createElement("option", { value: "" }, "اختر خدمة..."), (digitalServices || []).map(service => React.createElement("option", { key: service.id, value: service.id }, service.id)))), React.createElement("div", null, React.createElement("label", { className: labelClass }, "نوع الخدمة (Service Type)"), React.createElement("input", { value: formData.dynamicServiceType || '', onChange: e => setFormData(p => ({...p, dynamicServiceType: e.target.value})), placeholder: "e.g., internet_bill", className: inputClass })), React.createElement("div", null, React.createElement("label", { className: labelClass }, "معرف قاعدة الرسوم (Fee Rule ID)"), React.createElement("select", { value: formData.feeRuleId || '', onChange: e => setFormData(p => ({...p, feeRuleId: e.target.value})), className: inputClass }, React.createElement("option", { value: "" }, "اختر قاعدة رسوم..."), (feeRules || []).map(rule => React.createElement("option", { key: rule.id, value: rule.id }, rule.id)))), React.createElement("div", null, React.createElement("label", { className: labelClass }, "عنوان خطوة اختيار الباقة"), React.createElement("input", { value: formData.packageSelectionStepTitle || '', onChange: e => setFormData(p => ({...p, packageSelectionStepTitle: e.target.value})), placeholder: "e.g., اختر باقة الشحن", className: inputClass })), React.createElement("div", { className: "md:col-span-2" }, React.createElement("label", { className: labelClass }, "عنوان خطوة إدخال التفاصيل"), React.createElement("input", { value: formData.detailsStepTitle || '', onChange: e => setFormData(p => ({...p, detailsStepTitle: e.target.value})), placeholder: "e.g., أدخل رقم الخط الأرضي", className: inputClass }))), React.createElement("div", { className: "pt-4 border-t" }, React.createElement("h3", { className: "font-semibold mb-2" }, "الحقول المطلوبة من المستخدم"), (formData.requiredFields || []).map((field, index) => React.createElement("div", { key: index, className: "grid grid-cols-1 md:grid-cols-5 gap-2 mb-3 p-3 border rounded-md bg-white dark:bg-dark-800" }, React.createElement("input", { value: field.id || '', onChange: e => handleRequiredFieldChange(index, 'id', e.target.value), placeholder: "ID الحقل", className: inputClass }), React.createElement("input", { value: field.label || '', onChange: e => handleRequiredFieldChange(index, 'label', e.target.value), placeholder: "العنوان (Label)", className: inputClass }), React.createElement("select", { value: field.type || 'text', onChange: e => handleRequiredFieldChange(index, 'type', e.target.value), className: inputClass }, React.createElement("option", { value: "text" }, "نص"), React.createElement("option", { value: "tel" }, "هاتف"), React.createElement("option", { value: "number" }, "رقم")), React.createElement("input", { value: field.placeholder || '', onChange: e => handleRequiredFieldChange(index, 'placeholder', e.target.value), placeholder: "النص المؤقت", className: inputClass }), React.createElement("button", { type: "button", onClick: () => handleRemoveRequiredField(index), className: `${btnClass} bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300` }, React.createElement(TrashIcon, { className: 'w-4 h-4' })))), React.createElement("button", { type: "button", onClick: handleAddRequiredField, className: "text-sm text-primary font-semibold mt-2" }, "+ إضافة حقل مطلوب")))
                ),
                React.createElement("div", { className: "pt-4 border-t flex justify-end gap-2 mt-auto" }, React.createElement("button", { type: "button", onClick: onClose, className: `${btnClass} bg-light-200 dark:bg-dark-600` }, "إلغاء"), React.createElement("button", { type: "submit", form: "product-form", className: `${btnClass} bg-primary text-white`, disabled: isUploading || isGeneratingDesc }, isUploading ? "جاري الرفع..." : (isGeneratingDesc ? "جاري الإنشاء..." : "حفظ المنتج")))
            )
        )
    );
};

export { ProductFormModal };