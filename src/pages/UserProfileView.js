
import React, { useState, useEffect } from 'react';
import { StaticPageView } from './Static-Pages/StaticPageView.js';
import { UserIcon, StarIcon, ShoppingBagIcon, HeartIcon } from '../components/icons/index.js';
import { LOYALTY_TIERS as LOYALTY_TIERS_FALLBACK } from '../constants/loyaltyTiers.js';
import { EGYPT_GOVERNORATES_DATA } from '../constants/governorates.js';
import { FloatingInput } from '../components/ui/forms/FloatingInput.js';
import { useApp } from '../contexts/AppContext.js';


const UserProfileView = ({ currentUser, onBack, onNavigate, onUpdateProfile }) => {
    const { loyaltySettings } = useApp();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [governorate, setGovernorate] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [availableCities, setAvailableCities] = useState([]);

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || '');
            setPhone(currentUser.phone || '');
            const addr = currentUser.defaultShippingAddress;
            if (addr) {
                setGovernorate(addr.governorate || '');
                setCity(addr.city || '');
                setAddress(addr.address || '');
            }
        }
    }, [currentUser]);

     useEffect(() => {
        if (governorate && EGYPT_GOVERNORATES_DATA[governorate]) {
            const newCities = EGYPT_GOVERNORATES_DATA[governorate];
            setAvailableCities(newCities);
            if (!newCities.includes(city)) setCity('');
        } else {
            setAvailableCities([]);
            setCity('');
        }
    }, [governorate, city]);


    const handleProfileSave = async () => {
        if (!name.trim()) return;
        const success = await onUpdateProfile({ name: name.trim(), phone: phone.trim() });
        if (success) setIsEditingProfile(false);
    };

    const handleAddressSave = async () => {
        const newAddress = {
            ...(currentUser.defaultShippingAddress || {}),
            governorate,
            city,
            address
        };
        const success = await onUpdateProfile({ defaultShippingAddress: newAddress });
        if (success) setIsEditingAddress(false);
    };
    
    if (!currentUser) {
        return React.createElement("div", { className: "container mx-auto px-4 py-12 pt-24 sm:pt-32 text-center" },
            React.createElement("p", {className: "text-xl mb-4 text-dark-700 dark:text-dark-100"}, "يرجى تسجيل الدخول لعرض هذه الصفحة."),
             React.createElement("button", { onClick: onBack, className: "mt-4 bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg" }, "العودة")
        );
    }

    const loyaltyPoints = currentUser.loyaltyPoints || 0;
    const getTierInfo = (points) => {
        const Tiers = loyaltySettings || LOYALTY_TIERS_FALLBACK;
        if (points >= Tiers.GOLD.minPoints) return { ...Tiers.GOLD, nextTier: null, pointsForNext: Tiers.GOLD.minPoints, maxPoints: Tiers.GOLD.minPoints };
        if (points >= Tiers.SILVER.minPoints) return { ...Tiers.SILVER, nextTier: Tiers.GOLD, pointsForNext: Tiers.GOLD.minPoints, maxPoints: Tiers.GOLD.minPoints };
        return { ...Tiers.BRONZE, nextTier: Tiers.SILVER, pointsForNext: Tiers.SILVER.minPoints, maxPoints: Tiers.SILVER.minPoints };
    };
    const tierInfo = getTierInfo(loyaltyPoints);
    const progressPercentage = (tierInfo.nextTier && tierInfo.pointsForNext > tierInfo.minPoints)
        ? Math.min(100, ((loyaltyPoints - tierInfo.minPoints) / (tierInfo.pointsForNext - tierInfo.minPoints)) * 100)
        : 100;

    const inputClassName = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base";
    const labelClassName = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";

    return React.createElement(StaticPageView, { title: "حسابي", onBack: onBack, icon: UserIcon },
        React.createElement("div", { className: "space-y-8" },
            React.createElement("div", { className: "text-center mb-6" },
                React.createElement("p", { className: "text-xl text-dark-800 dark:text-dark-100" }, `أهلاً بك، `, React.createElement("strong", {className: "text-primary"}, currentUser.name),`!`)
            ),
            React.createElement("section", null,
                React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold text-dark-900 dark:text-dark-50 mb-4 border-b border-light-300 dark:border-dark-600 pb-2" }, "إجراءات سريعة"),
                React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                    React.createElement("button", { onClick: () => onNavigate('navigateToOrdersHistory'), className: "p-4 bg-light-100 dark:bg-dark-700 rounded-lg flex items-center space-x-3 space-x-reverse hover:bg-primary/10 hover:border-primary border border-transparent transition-all" },
                        React.createElement(ShoppingBagIcon, { className: "w-8 h-8 text-primary" }),
                        React.createElement("span", { className: "font-semibold text-dark-800 dark:text-dark-100" }, "عرض طلباتي السابقة")
                    ),
                    React.createElement("button", { onClick: () => onNavigate('navigateToWishlist'), className: "p-4 bg-light-100 dark:bg-dark-700 rounded-lg flex items-center space-x-3 space-x-reverse hover:bg-primary/10 hover:border-primary border border-transparent transition-all" },
                        React.createElement(HeartIcon, { className: "w-8 h-8 text-red-500" }),
                        React.createElement("span", { className: "font-semibold text-dark-800 dark:text-dark-100" }, "الانتقال إلى قائمة الرغبات")
                    )
                )
            ),
            React.createElement("section", null,
                React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold text-dark-900 dark:text-dark-50 mb-4 border-b border-light-300 dark:border-dark-600 pb-2" }, "برنامج الولاء والمكافآت"),
                 React.createElement("div", { className: `p-4 sm:p-6 rounded-lg border ${tierInfo.bgColor.replace('bg-', 'border-')}` },
                    React.createElement("div", { className: "flex items-start justify-between" },
                        React.createElement("div", null,
                            React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, "مستواك الحالي"),
                            React.createElement("p", { className: `text-2xl font-bold ${tierInfo.color}` }, `المستوى ${tierInfo.name}`)
                        ),
                        React.createElement("div", { className: "text-left" },
                            React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, "نقاطك"),
                            React.createElement("div", { className: "flex items-center gap-1.5" },
                                React.createElement(StarIcon, { filled: true, className: `w-6 h-6 ${tierInfo.color}` }),
                                React.createElement("span", { className: "font-bold text-2xl text-dark-900 dark:text-dark-50 tabular-nums" }, loyaltyPoints)
                            )
                        )
                    ),
                    React.createElement("div", { className: "mt-4" },
                        React.createElement("div", { className: "w-full bg-light-200 dark:bg-dark-700 rounded-full h-2.5" },
                            React.createElement("div", { className: `h-2.5 rounded-full ${tierInfo.progressColor} transition-all duration-500`, style: { width: `${progressPercentage}%` } })
                        ),
                        tierInfo.nextTier ? React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300 mt-2 text-center" }, `تحتاج إلى ${tierInfo.pointsForNext - loyaltyPoints} نقطة للوصول إلى المستوى ${tierInfo.nextTier.name} والحصول على مزايا أفضل!`)
                        : React.createElement("p", { className: `text-xs ${tierInfo.color} mt-2 text-center font-semibold` }, "لقد وصلت إلى أعلى مستوى! استمتع بمزايا حصرية.")
                    ),
                     React.createElement("p", { className: "text-xs sm:text-sm text-dark-600 dark:text-dark-300 mt-4 pt-3 border-t border-gray-300/20 dark:border-gray-600/30 text-center" }, "اكسب نقطة واحدة مقابل كل جنيه تنفقه. كل 100 نقطة تساوي خصم 1 جنيه على طلبك القادم.")
                )
            ),
            React.createElement("section", null,
                React.createElement("div", { className: "flex justify-between items-center mb-4 border-b border-light-300 dark:border-dark-600 pb-2" },
                    React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold text-dark-900 dark:text-dark-50" }, "معلومات الحساب"),
                    !isEditingProfile && React.createElement("button", { onClick: () => setIsEditingProfile(true), className: "text-sm text-primary font-semibold" }, "تعديل")
                ),
                isEditingProfile ? React.createElement("div", { className: "space-y-4 p-4 bg-light-100 dark:bg-dark-700/50 rounded-lg " },
                    React.createElement(FloatingInput, { id: "profile-name", value: name, onChange: e => setName(e.target.value), placeholder: "الاسم بالكامل *" }),
                    React.createElement(FloatingInput, { id: "profile-phone", value: phone, onChange: e => setPhone(e.target.value), placeholder: "رقم الهاتف", type: "tel", maxLength: 11 }),
                    React.createElement("div", { className: "flex gap-2" },
                        React.createElement("button", { onClick: handleProfileSave, className: "flex-1 bg-primary text-white py-2 rounded-md" }, "حفظ"),
                        React.createElement("button", { onClick: () => setIsEditingProfile(false), className: "flex-1 bg-light-200 dark:bg-dark-600 py-2 rounded-md" }, "إلغاء")
                    )
                ) : React.createElement("div", { className: "space-y-3 text-md" },
                    React.createElement("div", { className: "flex justify-between items-center bg-light-100 dark:bg-dark-700/50 p-3 rounded-md" }, React.createElement("strong", { className: "text-dark-800 dark:text-dark-100" }, "الاسم: "), React.createElement("span", { className: "text-dark-700 dark:text-dark-200" }, currentUser.name)),
                    React.createElement("div", { className: "flex justify-between items-center bg-light-100 dark:bg-dark-700/50 p-3 rounded-md" }, React.createElement("strong", { className: "text-dark-800 dark:text-dark-100" }, "البريد الإلكتروني: "), React.createElement("span", { className: "text-dark-700 dark:text-dark-200" }, currentUser.email)),
                    React.createElement("div", { className: "flex justify-between items-center bg-light-100 dark:bg-dark-700/50 p-3 rounded-md" }, React.createElement("strong", { className: "text-dark-800 dark:text-dark-100" }, "رقم الهاتف: "), React.createElement("span", { className: "text-dark-700 dark:text-dark-200" }, currentUser.phone || 'غير مسجل'))
                )
            ),
            React.createElement("section", null,
                React.createElement("div", { className: "flex justify-between items-center mb-4 border-b border-light-300 dark:border-dark-600 pb-2" },
                    React.createElement("h2", { className: "text-xl sm:text-2xl font-semibold text-dark-900 dark:text-dark-50" }, "عنوان الشحن الافتراضي"),
                     !isEditingAddress && React.createElement("button", { onClick: () => setIsEditingAddress(true), className: "text-sm text-primary font-semibold" }, "تعديل")
                ),
                 isEditingAddress ? React.createElement("div", { className: "space-y-4 p-4 bg-light-100 dark:bg-dark-700/50 rounded-lg " },
                     React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement("div", null, React.createElement("label", { htmlFor: "governorate-select", className: labelClassName }, "* المحافظة"), React.createElement("select", { id: "governorate-select", value: governorate, onChange: (e) => setGovernorate(e.target.value), className: inputClassName }, React.createElement("option", { value: "" }, "اختر..."), Object.keys(EGYPT_GOVERNORATES_DATA).map(gov => React.createElement("option", { key: gov, value: gov }, gov)))),
                        React.createElement("div", null, React.createElement("label", { htmlFor: "city-select", className: labelClassName }, "* المدينة"), React.createElement("select", { id: "city-select", value: city, onChange: (e) => setCity(e.target.value), className: inputClassName, disabled: availableCities.length === 0 }, React.createElement("option", { value: "" }, "اختر..."), availableCities.map(c => React.createElement("option", { key: c, value: c }, c))))
                     ),
                    React.createElement("div", null, React.createElement("label", { htmlFor: "address-details", className: labelClassName }, "* العنوان بالتفصيل"), React.createElement("textarea", { id: "address-details", value: address, onChange: (e) => setAddress(e.target.value), className: `${inputClassName} min-h-[80px]`, placeholder: "مثال: 10 شارع النصر..." })),
                     React.createElement("div", { className: "flex gap-2" }, React.createElement("button", { onClick: handleAddressSave, className: "flex-1 bg-primary text-white py-2 rounded-md" }, "حفظ"), React.createElement("button", { onClick: () => setIsEditingAddress(false), className: "flex-1 bg-light-200 dark:bg-dark-600 py-2 rounded-md" }, "إلغاء"))
                 ) : currentUser.defaultShippingAddress ? React.createElement("div", { className: "space-y-3 text-md bg-light-100 dark:bg-dark-700/50 p-4 rounded-md" },
                    React.createElement("p", null, React.createElement("strong", { className: "text-dark-800 dark:text-dark-100" }, "المحافظة: "), React.createElement("span", { className: "text-dark-700 dark:text-dark-200" }, currentUser.defaultShippingAddress.governorate)),
                    React.createElement("p", null, React.createElement("strong", { className: "text-dark-800 dark:text-dark-100" }, "المدينة: "), React.createElement("span", { className: "text-dark-700 dark:text-dark-200" }, currentUser.defaultShippingAddress.city)),
                    React.createElement("p", null, React.createElement("strong", { className: "text-dark-800 dark:text-dark-100" }, "العنوان: "), React.createElement("span", { className: "text-dark-700 dark:text-dark-200" }, currentUser.defaultShippingAddress.address))
                 ) : React.createElement("p", { className: "text-center text-dark-600 dark:text-dark-300 p-4" }, "لم يتم إضافة عنوان شحن افتراضي.")
            )
        )
    );
};
export { UserProfileView };