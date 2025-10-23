// world-technology-store/src/hooks/useAdminData.js

import { useState, useEffect, useMemo, useCallback } from 'react';
import { db, storage } from '../services/firebase/config.js';
import { collection, getDocs, query, orderBy, doc, setDoc, addDoc, deleteDoc, updateDoc, writeBatch, serverTimestamp, arrayUnion, arrayRemove, getDoc, Timestamp, where, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const getJsDate = (timestamp) => {
    if (!timestamp) return null;
    if (typeof timestamp.toDate === 'function') return timestamp.toDate(); // Firestore Timestamp
    if (timestamp instanceof Date) return timestamp; // JS Date
    const date = new Date(timestamp); // Fallback for strings/numbers
    return isNaN(date.getTime()) ? null : date;
};

export const useAdminData = (currentUser, onDataChange) => {
    const [stats, setStats] = useState({ totalProducts: 0, newOrdersCount: 0, totalSales: 0, totalUsers: 0 });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [dealOfTheDay, setDealOfTheDay] = useState(null);
    const [digitalServices, setDigitalServices] = useState([]);
    const [feeRules, setFeeRules] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [popupBanners, setPopupBanners] = useState([]);
    const [storeSettings, setStoreSettings] = useState(null);
    const [loyaltySettings, setLoyaltySettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!currentUser || currentUser.role !== 'admin') {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const [
                productsSnapshot, ordersSnapshot, usersSnapshot, discountsSnapshot, 
                announcementsSnapshot, dealSnapshot, digitalServicesSnapshot, feeRulesSnapshot,
                reviewsSnapshot, popupBannersSnapshot, storeSettingsSnap, loyaltySettingsSnap
            ] = await Promise.all([
                getDocs(query(collection(db, 'products'), orderBy('arabicName'))),
                getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'))),
                getDocs(collection(db, 'users')),
                getDocs(query(collection(db, 'discounts'), orderBy('code'))),
                getDocs(query(collection(db, 'notifications'), orderBy('createdAt', 'desc'))),
                getDoc(doc(db, 'dealOfTheDay', 'current')),
                getDocs(collection(db, 'digital_service_packages')),
                getDocs(collection(db, 'feeRules')),
                getDocs(query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))),
                getDocs(query(collection(db, 'popup_banners'), orderBy('createdAt', 'desc'))),
                getDoc(doc(db, 'settings', 'storeInfo')),
                getDoc(doc(db, 'settings', 'loyaltyTiers'))
            ]);

            const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const ordersData = ordersSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: getJsDate(data.createdAt) || getJsDate(data.clientCreatedAt)
                };
            });
            const usersData = usersSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: getJsDate(data.createdAt)
                };
            });
            const discountsData = discountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const announcementsData = announcementsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const digitalServicesData = digitalServicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const feeRulesData = feeRulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const reviewsData = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const popupBannersData = popupBannersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            setProducts(productsData);
            setOrders(ordersData);
            setUsers(usersData);
            setDiscounts(discountsData);
            setAnnouncements(announcementsData);
            setDigitalServices(digitalServicesData);
            setFeeRules(feeRulesData);
            setReviews(reviewsData);
            setPopupBanners(popupBannersData);
            if (storeSettingsSnap.exists()) setStoreSettings(storeSettingsSnap.data());
            if (loyaltySettingsSnap.exists()) setLoyaltySettings(loyaltySettingsSnap.data());


            if (dealSnapshot.exists()) setDealOfTheDay({ id: dealSnapshot.id, ...dealSnapshot.data() });

            const newOrdersCount = ordersData.filter(o => o.status === 'pending_payment_confirmation' || o.status === 'processing' || o.status === 'pending_fulfillment').length;
            const totalSales = ordersData.filter(o => ['delivered', 'shipped'].includes(o.status)).reduce((acc, o) => acc + o.totalAmount, 0);
            setStats({
                totalProducts: productsData.length,
                newOrdersCount: newOrdersCount,
                totalSales: totalSales,
                totalUsers: usersData.length,
            });

        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleProductSave = async (productData) => {
        try {
            const { id, ...data } = productData;
            if (id) {
                await setDoc(doc(db, "products", id), data, { merge: true });
            } else {
                let newId = data.customId ? data.customId.trim().toLowerCase().replace(/\s+/g, '-').replace(/[/?#[\]*()]/g, '') : '';
                
                if (newId) {
                    const docRef = doc(db, 'products', newId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        return { success: false, error: 'معرف المنتج هذا مستخدم بالفعل. يرجى اختيار معرف آخر.' };
                    }
                } else {
                    let slugBase = (data.arabicName || `product-${Date.now()}`).trim().toLowerCase().replace(/\s+/g, '-').replace(/[/?#[\]*()]/g, '');
                    if (!slugBase) slugBase = `product-${Date.now()}`;
                    newId = slugBase;
                    let counter = 1;
                    let docRef = doc(db, 'products', newId);
                    let docSnap = await getDoc(docRef);
                    while (docSnap.exists()) {
                        newId = `${slugBase}-${counter}`;
                        docRef = doc(db, 'products', newId);
                        docSnap = await getDoc(docRef);
                        counter++;
                    }
                }
                
                const finalDocRef = doc(db, 'products', newId);
                delete data.customId;
                await setDoc(finalDocRef, { ...data, createdAt: serverTimestamp() });
            }
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) {
            console.error("Error saving product:", error);
            return { success: false, error: error.message };
        }
    };
    
    const handleProductDelete = async (productId) => {
        try {
            await deleteDoc(doc(db, "products", productId));
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error deleting product:", error); return { success: false, error }; }
    };
    
    const handleProductBulkDelete = async (productIds) => {
        if (!productIds || productIds.length === 0) return { success: true };
        try {
            const batch = writeBatch(db);
            productIds.forEach(id => {
                const docRef = doc(db, "products", id);
                batch.delete(docRef);
            });
            await batch.commit();
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error bulk deleting products:", error); return { success: false, error }; }
    };
    
    const handleStockUpdate = async (productId, newStock, variantName = null) => {
        try {
            const productRef = doc(db, 'products', productId);
            const productSnap = await getDoc(productRef);
            if (!productSnap.exists()) throw new Error("Product not found");

            if (variantName) {
                const productData = productSnap.data();
                const variants = productData.variants || [];
                const variantIndex = variants.findIndex(v => v.colorName === variantName);
                if (variantIndex > -1) {
                    variants[variantIndex].stock = Number(newStock);
                    const totalStock = variants.reduce((acc, v) => acc + v.stock, 0);
                    await updateDoc(productRef, { variants, stock: totalStock });
                }
            } else {
                await updateDoc(productRef, { stock: Number(newStock) });
            }
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch(error) { console.error("Error updating stock:", error); return { success: false, error }; }
    };

    const handleImageUpload = async (file) => {
        if (!file) return null;
        try {
            const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            return await getDownloadURL(snapshot.ref);
        } catch (error) { console.error("Error uploading image:", error); return null; }
    };

    const handleOrderStatusUpdate = async (orderId, newStatus) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            const newHistoryEntry = {
                status: newStatus,
                timestamp: Timestamp.now(),
                updatedBy: currentUser.name || 'Admin',
            };
            
            // Logic to award loyalty points on "delivered" status
            if (newStatus === 'delivered') {
                const orderSnap = await getDoc(orderRef);
                if (orderSnap.exists()) {
                    const orderData = orderSnap.data();
                    if (orderData.userId && !orderData.pointsAwarded && orderData.pointsToEarn > 0) {
                        const userRef = doc(db, "users", orderData.userId);
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists()) {
                            const userData = userSnap.data();
                            const currentPoints = userData.loyaltyPoints || 0;
                            const newPoints = currentPoints + orderData.pointsToEarn;
                            
                            const batch = writeBatch(db);
                            batch.update(userRef, { loyaltyPoints: newPoints });
                            batch.update(orderRef, { pointsAwarded: true, status: newStatus, statusHistory: arrayUnion(newHistoryEntry) });
                            await batch.commit();
                        } else {
                            await updateDoc(orderRef, { status: newStatus, statusHistory: arrayUnion(newHistoryEntry) });
                        }
                    } else {
                         await updateDoc(orderRef, { status: newStatus, statusHistory: arrayUnion(newHistoryEntry) });
                    }
                }
            } else {
                await updateDoc(orderRef, { status: newStatus, statusHistory: arrayUnion(newHistoryEntry) });
            }

            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch(error) { console.error("Error updating order status:", error); return { success: false, error }; }
    };

    const handleOrderDelete = async (orderId) => {
        try {
            await deleteDoc(doc(db, "orders", orderId));
            await fetchData(); // Refresh data
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) {
            console.error("Error deleting order:", error);
            return { success: false, error: error.message };
        }
    };
    
    const handleOrderShippingUpdate = async (orderId, shippingDetails) => {
        try {
            const newHistoryEntry = {
                status: 'shipped',
                timestamp: Timestamp.now(),
                updatedBy: currentUser.name || 'Admin',
                notes: `تم التسليم لشركة الشحن: ${shippingDetails.company}`
            };
            await updateDoc(doc(db, 'orders', orderId), { 
                shippingDetails, 
                status: 'shipped',
                statusHistory: arrayUnion(newHistoryEntry)
            });
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error updating shipping details:", error); return { success: false, error }; }
    };

    const handleUserUpdate = async (userId, userData) => {
        try {
            await updateDoc(doc(db, "users", userId), userData);
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch(error) { console.error("Error updating user:", error); return { success: false, error }; }
    };

    const handleDiscountSave = async (discountData) => {
        try {
            const { id, expiryDate, ...data } = discountData;
            const dataToSave = { ...data, expiryDate: expiryDate ? Timestamp.fromDate(new Date(expiryDate)) : null };
            if (id) await setDoc(doc(db, "discounts", id), dataToSave, { merge: true });
            else await addDoc(collection(db, "discounts"), dataToSave);
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch(error) { console.error("Error saving discount:", error); return { success: false, error }; }
    };
    
    const handleDiscountDelete = async (discountId) => {
        try {
            await deleteDoc(doc(db, "discounts", discountId));
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error deleting discount:", error); return { success: false, error }; }
    };

    const handleAnnouncementSave = async (announcementData) => {
        try {
            const { id, ...data } = announcementData;
            if (id) await setDoc(doc(db, "notifications", id), data, { merge: true });
            else await addDoc(collection(db, "notifications"), { ...data, createdAt: serverTimestamp() });
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch(error) { console.error("Error saving announcement:", error); return { success: false, error }; }
    };

    const handleAnnouncementDelete = async (announcementId) => {
        try {
            await deleteDoc(doc(db, "notifications", announcementId));
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error deleting announcement:", error); return { success: false, error }; }
    };

    const handleDealOfTheDaySave = async (dealData) => {
        try {
            await setDoc(doc(db, "dealOfTheDay", "current"), { productId: dealData.productId, offerEndTime: Timestamp.fromDate(new Date(dealData.offerEndTime)) });
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error saving deal of the day:", error); return { success: false, error }; }
    };

    const handleServiceSave = async (serviceData) => {
        try {
            const { id, name, operator, serviceId } = serviceData;
            if (!id) throw new Error("Document ID is required.");
            await setDoc(doc(db, "digital_service_packages", id), { name, operator, serviceId, packages: [] });
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error saving service:", error); return { success: false, error }; }
    };

    const handleServicePackageSave = async (serviceDocId, packageData, editingPackage) => {
        try {
            const serviceRef = doc(db, 'digital_service_packages', serviceDocId);
            if (editingPackage) await updateDoc(serviceRef, { packages: arrayRemove(editingPackage) });
            await updateDoc(serviceRef, { packages: arrayUnion(packageData) });
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error saving package:", error); return { success: false, error }; }
    };

    const handleServicePackageDelete = async (serviceDocId, packageToDelete) => {
        try {
            await updateDoc(doc(db, 'digital_service_packages', serviceDocId), { packages: arrayRemove(packageToDelete) });
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error deleting package:", error); return { success: false, error }; }
    };

    const handleFeeRuleSave = async (ruleData) => {
        try {
            await setDoc(doc(db, "feeRules", ruleData.ruleId), { tiers: [] });
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error saving fee rule:", error); return { success: false, error }; }
    };

    const handleFeeRuleTierSave = async (ruleId, tierData, editingTier) => {
        try {
            const ruleRef = doc(db, 'feeRules', ruleId);
            if (editingTier) await updateDoc(ruleRef, { tiers: arrayRemove(editingTier) });
            await updateDoc(ruleRef, { tiers: arrayUnion(tierData) });
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error saving tier:", error); return { success: false, error }; }
    };

    const handleFeeRuleTierDelete = async (ruleId, tierToDelete) => {
        try {
            await updateDoc(doc(db, 'feeRules', ruleId), { tiers: arrayRemove(tierToDelete) });
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error deleting tier:", error); return { success: false, error }; }
    };
    
    const handleReviewUpdate = async (reviewId, updateData) => {
        try {
            await updateDoc(doc(db, 'reviews', reviewId), updateData);
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error updating review:", error); return { success: false, error }; }
    };

    const handleReviewDelete = async (reviewId) => {
        try {
            await deleteDoc(doc(db, 'reviews', reviewId));
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error deleting review:", error); return { success: false, error }; }
    };
    
    const handlePopupBannerSave = async (bannerData) => {
        try {
            const { id, ...data } = bannerData;
            if (id) {
                await setDoc(doc(db, "popup_banners", id), data, { merge: true });
            } else {
                await addDoc(collection(db, "popup_banners"), { ...data, createdAt: serverTimestamp() });
            }
            await fetchData();
            if (onDataChange) onDataChange(); // To refresh client-side pop-ups
            return { success: true };
        } catch (error) { console.error("Error saving pop-up banner:", error); return { success: false, error }; }
    };

    const handlePopupBannerDelete = async (bannerId) => {
        try {
            await deleteDoc(doc(db, "popup_banners", bannerId));
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) { console.error("Error deleting pop-up banner:", error); return { success: false, error }; }
    };

    const handleStoreSettingsSave = async (settingsData) => {
        try {
            await setDoc(doc(db, "settings", "storeInfo"), settingsData, { merge: true });
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) {
            console.error("Error saving store settings:", error);
            return { success: false, error: error.message };
        }
    };
    
    const handleLoyaltySettingsSave = async (settingsData) => {
        try {
            await setDoc(doc(db, "settings", "loyaltyTiers"), settingsData, { merge: true });
            await fetchData();
            if (onDataChange) onDataChange();
            return { success: true };
        } catch (error) {
            console.error("Error saving loyalty settings:", error);
            return { success: false, error: error.message };
        }
    };

    const handleSendNotification = useCallback(async (target, notificationData) => {
        if (!currentUser || currentUser.role !== 'admin') {
            return { success: false, error: 'غير مصرح لك.' };
        }
        
        const notificationPayload = {
            ...notificationData,
            createdAt: serverTimestamp(),
            isRead: false,
        };
        
        try {
            if (target.type === 'all') {
                const allUsers = users || []; // users state from useAdminData
                if (allUsers.length === 0) {
                    return { success: false, error: 'لا يوجد مستخدمون لإرسال الإشعارات لهم.' };
                }
                
                const batches = [];
                for (let i = 0; i < allUsers.length; i += 500) {
                    const batch = writeBatch(db);
                    const chunk = allUsers.slice(i, i + 500);
                    chunk.forEach(user => {
                        const notificationRef = doc(collection(db, 'users', user.id, 'user_notifications'));
                        batch.set(notificationRef, notificationPayload);
                    });
                    batches.push(batch);
                }

                await Promise.all(batches.map(batch => batch.commit()));
                return { success: true, sentTo: allUsers.length };
            } 
            else if (target.type === 'user' && target.identifier) {
                let userQuery;
                if (target.identifier.includes('@')) {
                    userQuery = query(collection(db, 'users'), where("email", "==", target.identifier), limit(1));
                } else {
                    const userRef = doc(db, 'users', target.identifier);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        await addDoc(collection(db, 'users', userSnap.id, 'user_notifications'), notificationPayload);
                        return { success: true, sentTo: 1 };
                    } else {
                        // If not found by ID, try searching by phone as a fallback
                         userQuery = query(collection(db, 'users'), where("phone", "==", target.identifier), limit(1));
                    }
                }
                
                const querySnapshot = await getDocs(userQuery);
                if (querySnapshot.empty) {
                    return { success: false, error: `لم يتم العثور على مستخدم بالمعرف: ${target.identifier}` };
                }
                const userDoc = querySnapshot.docs[0];
                await addDoc(collection(db, 'users', userDoc.id, 'user_notifications'), notificationPayload);
                return { success: true, sentTo: 1 };
            }
            return { success: false, error: 'هدف غير صالح.' };
        } catch (error) {
            console.error("Error sending notification:", error);
            return { success: false, error: "حدث خطأ أثناء إرسال الإشعار." };
        }

    }, [currentUser, users]);

    const adminNotifications = useMemo(() => {
        const newOrders = orders.filter(o => o.status === 'pending_payment_confirmation' || o.status === 'pending_fulfillment');
        const lowStockProducts = products.filter(p => !p.isDynamicElectronicPayments && p.stock <= (p.lowStockThreshold ?? 10));
        const pendingReviews = reviews.filter(r => r.isApproved === false);

        return [
            { id: 'new-orders', count: newOrders.length, text: 'طلبات جديدة', panel: 'orders', icon: 'ShoppingCartIcon' },
            { id: 'low-stock', count: lowStockProducts.length, text: 'منتجات مخزونها منخفض', panel: 'inventory', icon: 'ExclamationTriangleIcon' },
            { id: 'pending-reviews', count: pendingReviews.length, text: 'مراجعات بانتظار الموافقة', panel: 'reviews', icon: 'DocumentTextIcon' },
        ].filter(n => n.count > 0);
    }, [orders, products, reviews]);

    return {
        stats, products, orders, users, discounts, announcements, dealOfTheDay,
        digitalServices, feeRules, reviews, adminNotifications, popupBanners, storeSettings, loyaltySettings,
        isLoading, currentUser,
        handleProductSave, handleProductDelete, handleProductBulkDelete, handleStockUpdate, handleImageUpload,
        handleOrderStatusUpdate, handleOrderDelete, handleOrderShippingUpdate,
        handleUserUpdate,
        handleDiscountSave, handleDiscountDelete,
        handleAnnouncementSave, handleAnnouncementDelete,
        handleDealOfTheDaySave,
        handleServiceSave, handleServicePackageSave, handleServicePackageDelete,
        handleFeeRuleSave, handleFeeRuleTierSave, handleFeeRuleTierDelete,
        handleReviewUpdate, handleReviewDelete,
        handlePopupBannerSave, handlePopupBannerDelete,
        handleStoreSettingsSave,
        handleLoyaltySettingsSave,
        handleSendNotification,
    };
};