import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { UserIcon, StarIcon, ShoppingBagIcon, HeartIcon, LockClosedIcon, CogIcon, LogOutIcon } from '../components/icons/index.js';
import { LOYALTY_TIERS as LOYALTY_TIERS_FALLBACK } from '../constants/loyaltyTiers.js';
import { EGYPT_GOVERNORATES_DATA } from '../constants/governorates.js';
import { FloatingInput } from '../components/ui/forms/FloatingInput.js';
import { useApp } from '../contexts/AppContext.js';
import { useAuthHandlers } from '../hooks/useAuthHandlers.js';

const getTierInfo = (points, loyaltySettings) => {
    const Tiers = loyaltySettings || LOYALTY_TIERS_FALLBACK;
    if (points >= Tiers.GOLD.minPoints) return { ...Tiers.GOLD, nextTier: null, pointsForNext: Tiers.GOLD.minPoints, maxPoints: Tiers.GOLD.minPoints };
    if (points >= Tiers.SILVER.minPoints) return { ...Tiers.SILVER, nextTier: Tiers.GOLD, pointsForNext: Tiers.GOLD.minPoints, maxPoints: Tiers.GOLD.minPoints };
    return { ...Tiers.BRONZE, nextTier: Tiers.SILVER, pointsForNext: Tiers.SILVER.minPoints, maxPoints: Tiers.SILVER.minPoints };
};

const ProfileSidebar = ({ currentUser, activeTab, setActiveTab, onLogout }) => {
    const navigate = useNavigate();

    const sidebarItems = [
        { id: 'profile', label: 'الملف الشخصي', icon: UserIcon },
        { id: 'security', label: 'الأمان', icon: LockClosedIcon },
        { id: 'orders', label: 'طلباتي', icon: ShoppingBagIcon, path: '/orders' },
        { id: 'wishlist', label: 'قائمة الرغبات', icon: HeartIcon, path: '/wishlist' },
        ...(currentUser.role === 'admin' ? [{ id: 'dashboard', label: 'لوحة التحكم', icon: CogIcon, path: '/admin' }] : [])
    ];
    
    return (
        React.createElement("aside", { className: "w-full md:w-1/4 lg:w-1/5 flex-shrink-0" },
            React.createElement("div", { className: "bg-white dark:bg-dark-800 p-4 rounded-xl border border-light-200 dark:border-dark-700" },
                React.createElement("div", { className: "text-center border-b border-light-200 dark:border-dark-700 pb-4 mb-4" },
                    React.createElement("p", { className: "font-bold text-lg text-dark-900 dark:text-dark-50" }, currentUser.name),
                    React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, currentUser.email)
                ),
                React.createElement("nav", { className: "space-y-2" },
                    sidebarItems.map(item => {
                        const isActive = activeTab === item.id;
                        const buttonClasses = `w-full text-right flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            isActive ? 'bg-primary/10 text-primary' : 'text-dark-700 dark:text-dark-100 hover:bg-light-100 dark:hover:bg-dark-700'
                        }`;

                        if (item.path) {
                            return React.createElement(Link, { key: item.id, to: item.path, className: buttonClasses }, React.createElement(item.icon, {className: "w-5 h-5"}), item.label)
                        }
                        return React.createElement("button", { key: item.id, onClick: () => setActiveTab(item.id), className: buttonClasses }, React.createElement(item.icon, {className: "w-5 h-5"}), item.label)
                    }),
                     React.createElement("button", { 
                        onClick: () => { onLogout(); navigate('/'); }, 
                        className: "w-full text-right flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                    }, React.createElement(LogOutIcon, {className: "w-5 h-5"}), "تسجيل الخروج")
                )
            )
        )
    );
};

const ProfileInfoSection = ({ currentUser, handleUpdateUserProfileData, loyaltySettings }) => {
    const { setToastMessage } = useApp();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [name, setName] = useState(currentUser.name || '');
    const [phone, setPhone] = useState(currentUser.phone || '');

    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [governorate, setGovernorate] = useState(currentUser.defaultShippingAddress?.governorate || '');
    const [city, setCity] = useState(currentUser.defaultShippingAddress?.city || '');
    const [address, setAddress] = useState(currentUser.defaultShippingAddress?.address || '');
    const [availableCities, setAvailableCities] = useState([]);
    
    useEffect(() => {
        if (governorate && EGYPT_GOVERNORATES_DATA[governorate]) {
            const newCities = EGYPT_GOVERNORATES_DATA[governorate];
            setAvailableCities(newCities);
            if (!newCities.includes(city)) setCity('');
        } else { setAvailableCities([]); setCity(''); }
    }, [governorate, city]);

    const loyaltyPoints = currentUser.loyaltyPoints || 0;
    const tierInfo = getTierInfo(loyaltyPoints, loyaltySettings);
    const progressPercentage = (tierInfo.nextTier && tierInfo.pointsForNext > tierInfo.minPoints) ? Math.min(100, ((loyaltyPoints - tierInfo.minPoints) / (tierInfo.pointsForNext - tierInfo.minPoints)) * 100) : 100;
    
    const handleProfileSave = async () => {
        if (!name.trim()) return;
        const success = await handleUpdateUserProfileData({ name: name.trim(), phone: phone.trim() });
        if (success) setIsEditingProfile(false);
    };

    const handleAddressSave = async () => {
        if (!governorate || !city || !address) {
            setToastMessage({text: "يرجى ملء جميع حقول العنوان.", type: "error"});
            return;
        }
        const newAddress = { governorate, city, address };
        const success = await handleUpdateUserProfileData({ defaultShippingAddress: newAddress });
        if (success) setIsEditingAddress(false);
    };
    
    const inputClassName = "w-full p-2.5 rounded-md border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base";
    const labelClassName = "block text-sm font-medium mb-1 text-dark-800 dark:text-dark-100";

    return (
        React.createElement("div", { className: "space-y-8" },
            React.createElement("div", { className: `p-4 sm:p-6 rounded-lg border ${tierInfo.bgColor.replace('bg-', 'border-')}` },
                React.createElement("div", { className: "flex items-start justify-between" },
                    React.createElement("div", null,
                        React.createElement("p", { className: `text-2xl font-bold ${tierInfo.color}` }, `المستوى ${tierInfo.name}`),
                        React.createElement("p", { className: "text-sm text-dark-600 dark:text-dark-300" }, "برنامج الولاء والمكافآت")
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
                    tierInfo.nextTier ? React.createElement("p", { className: "text-xs text-dark-600 dark:text-dark-300 mt-2 text-center" }, `ينقصك ${tierInfo.pointsForNext - loyaltyPoints} نقطة للوصول إلى المستوى ${tierInfo.nextTier.name} والحصول على مزايا أفضل!`)
                    : React.createElement("p", { className: `text-xs ${tierInfo.color} mt-2 text-center font-semibold` }, "لقد وصلت إلى أعلى مستوى! استمتع بمزايا حصرية.")
                ),
                React.createElement("p", { className: "text-xs sm:text-sm text-dark-600 dark:text-dark-300 mt-4 pt-3 border-t border-gray-300/20 dark:border-gray-600/30 text-center" }, "اكسب نقطة واحدة مقابل كل جنيه تنفقه. كل 100 نقطة تساوي خصم 1 جنيه على طلبك القادم.")
            ),

            React.createElement("section", null,
                React.createElement("div", { className: "flex justify-between items-center mb-4 border-b border-light-200 dark:border-dark-700 pb-2" },
                    React.createElement("h3", { className: "text-lg font-semibold" }, "معلومات الحساب"),
                    !isEditingProfile && React.createElement("button", { onClick: () => setIsEditingProfile(true), className: "text-sm text-primary font-semibold" }, "تعديل")
                ),
                 isEditingProfile ? React.createElement("div", { className: "space-y-4 p-4 bg-light-100 dark:bg-dark-700/50 rounded-lg " },
                    React.createElement(FloatingInput, { id: "profile-name", value: name, onChange: e => setName(e.target.value), placeholder: "الاسم بالكامل *" }),
                    React.createElement(FloatingInput, { id: "profile-phone", value: phone, onChange: e => setPhone(e.target.value), placeholder: "رقم الهاتف", type: "tel", maxLength: 11 }),
                    React.createElement("div", { className: "flex gap-2 pt-2" },
                        React.createElement("button", { onClick: handleProfileSave, className: "flex-1 bg-primary text-white py-2 rounded-md" }, "حفظ"),
                        React.createElement("button", { onClick: () => setIsEditingProfile(false), className: "flex-1 bg-light-200 dark:bg-dark-600 py-2 rounded-md" }, "إلغاء")
                    )
                ) : React.createElement("div", { className: "space-y-3 text-md" },
                    React.createElement("p", null, React.createElement("strong", { className: "w-32 inline-block" }, "الاسم: "), currentUser.name),
                    React.createElement("p", null, React.createElement("strong", { className: "w-32 inline-block" }, "البريد الإلكتروني: "), currentUser.email),
                    React.createElement("p", null, React.createElement("strong", { className: "w-32 inline-block" }, "رقم الهاتف: "), currentUser.phone || 'غير مسجل')
                )
            ),

            React.createElement("section", null,
                React.createElement("div", { className: "flex justify-between items-center mb-4 border-b border-light-200 dark:border-dark-700 pb-2" },
                    React.createElement("h3", { className: "text-lg font-semibold" }, "عنوان الشحن الافتراضي"),
                    !isEditingAddress && React.createElement("button", { onClick: () => setIsEditingAddress(true), className: "text-sm text-primary font-semibold" }, "تعديل")
                ),
                 isEditingAddress ? React.createElement("div", { className: "space-y-4 p-4 bg-light-100 dark:bg-dark-700/50 rounded-lg " },
                     React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement("div", null, React.createElement("label", { htmlFor: "governorate-select", className: labelClassName }, "* المحافظة"), React.createElement("select", { id: "governorate-select", value: governorate, onChange: (e) => setGovernorate(e.target.value), className: inputClassName }, React.createElement("option", { value: "" }, "اختر..."), Object.keys(EGYPT_GOVERNORATES_DATA).map(gov => React.createElement("option", { key: gov, value: gov }, gov)))),
                        React.createElement("div", null, React.createElement("label", { htmlFor: "city-select", className: labelClassName }, "* المدينة"), React.createElement("select", { id: "city-select", value: city, onChange: (e) => setCity(e.target.value), className: inputClassName, disabled: availableCities.length === 0 }, React.createElement("option", { value: "" }, "اختر..."), availableCities.map(c => React.createElement("option", { key: c, value: c }, c))))
                     ),
                    React.createElement("div", null, React.createElement("label", { htmlFor: "address-details", className: labelClassName }, "* العنوان بالتفصيل"), React.createElement("textarea", { id: "address-details", value: address, onChange: (e) => setAddress(e.target.value), className: `${inputClassName} min-h-[80px]`, placeholder: "مثال: 10 شارع النصر..." })),
                     React.createElement("div", { className: "flex gap-2 pt-2" }, React.createElement("button", { onClick: handleAddressSave, className: "flex-1 bg-primary text-white py-2 rounded-md" }, "حفظ"), React.createElement("button", { onClick: () => setIsEditingAddress(false), className: "flex-1 bg-light-200 dark:bg-dark-600 py-2 rounded-md" }, "إلغاء"))
                 ) : currentUser.defaultShippingAddress?.address ? React.createElement("div", { className: "space-y-3 text-md" },
                    React.createElement("p", null, React.createElement("strong", { className: "w-32 inline-block" }, "المحافظة: "), currentUser.defaultShippingAddress.governorate),
                    React.createElement("p", null, React.createElement("strong", { className: "w-32 inline-block" }, "المدينة: "), currentUser.defaultShippingAddress.city),
                    React.createElement("p", null, React.createElement("strong", { className: "w-32 inline-block" }, "العنوان: "), currentUser.defaultShippingAddress.address)
                 ) : React.createElement("p", { className: "text-center text-dark-600 dark:text-dark-300 p-4" }, "لم يتم إضافة عنوان شحن افتراضي.")
            )
        )
    );
};

const SecuritySettingsSection = () => {
    const { setToastMessage } = useApp();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { handleChangePassword } = useAuthHandlers({
        onLoginSuccess: () => {}, // Not needed here
        setError,
        setSuccessMessage: (msg) => setToastMessage({ text: msg, type: 'success' }),
        setIsLoading
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 6) {
            setError("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError("كلمتا المرور الجديدتان غير متطابقتين.");
            return;
        }
        const result = await handleChangePassword(currentPassword, newPassword);
        if (result.success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setToastMessage({ text: "تم تغيير كلمة المرور بنجاح.", type: 'success' });
        }
    };
    
    return (
        React.createElement("div", { className: "space-y-6" },
            React.createElement("h3", { className: "text-lg font-semibold" }, "تغيير كلمة المرور"),
            React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
                error && React.createElement("p", { className: "text-sm text-red-500" }, error),
                React.createElement(FloatingInput, { id: "current-password", type: "password", value: currentPassword, onChange: e => setCurrentPassword(e.target.value), placeholder: "كلمة المرور الحالية *" }),
                React.createElement(FloatingInput, { id: "new-password", type: "password", value: newPassword, onChange: e => setNewPassword(e.target.value), placeholder: "كلمة المرور الجديدة *" }),
                React.createElement(FloatingInput, { id: "confirm-new-password", type: "password", value: confirmNewPassword, onChange: e => setConfirmNewPassword(e.target.value), placeholder: "تأكيد كلمة المرور الجديدة *" }),
                React.createElement("button", { type: "submit", disabled: isLoading, className: "bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-70" },
                    isLoading ? "جاري الحفظ..." : "حفظ التغييرات"
                )
            )
        )
    );
};

export const UserProfileView = () => {
    const { currentUser, handleLogout, handleUpdateUserProfileData, loyaltySettings } = useApp();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    if (!currentUser) return null; // Render nothing while redirecting

    const renderContent = () => {
        switch (activeTab) {
            case 'security': return React.createElement(SecuritySettingsSection, null);
            case 'profile':
            default: return React.createElement(ProfileInfoSection, { currentUser, handleUpdateUserProfileData, loyaltySettings });
        }
    };

    return (
        React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-32" },
            React.createElement(Helmet, null, 
                React.createElement("title", null, "حسابي - World Technology")
            ),
            React.createElement("div", { className: "flex flex-col md:flex-row gap-8 lg:gap-12" },
                React.createElement(ProfileSidebar, { currentUser: currentUser, activeTab: activeTab, setActiveTab: setActiveTab, onLogout: handleLogout }),
                React.createElement("main", { className: "flex-grow md:w-3/4 lg:w-4/5" },
                    React.createElement("div", { className: "bg-white dark:bg-dark-800 p-6 sm:p-8 rounded-xl border border-light-200 dark:border-dark-700" },
                        renderContent()
                    )
                )
            )
        )
    );
};