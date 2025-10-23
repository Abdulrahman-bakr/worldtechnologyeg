import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { db } from '../services/firebase/config.js';
import { collection, query, getDocs, orderBy, Timestamp, onSnapshot, doc, getDoc } from "firebase/firestore";

export const useNotificationsAndBanners = ({ products, setToastMessage, currentUser }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [userNotifications, setUserNotifications] = useState([]);
    const [readAnnouncementIds, setReadAnnouncementIds] = useState(() => {
        try {
            if (typeof localStorage !== 'undefined') {
                const readIds = localStorage.getItem('readAnnouncementIds');
                return readIds ? JSON.parse(readIds) : [];
            }
        } catch (e) { console.error(e); }
        return [];
    });
    const [readUserNotificationsIds, setReadUserNotificationsIds] = useState(() => {
        try {
            if (typeof localStorage !== 'undefined') {
                const readIds = localStorage.getItem('readUserNotificationsIds');
                return readIds ? JSON.parse(readIds) : [];
            }
        } catch (e) { console.error(e); }
        return [];
    });
    
    const [activeOffer, setActiveOffer] = useState(null);
    const [rotatingBanners, setRotatingBanners] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [dismissedSessionBannerIds, setDismissedSessionBannerIds] = useState([]);
    const rotationTimerRef = useRef(null);

    const fetchAnnouncements = useCallback(async () => {
        try {
            const notificationsCollectionRef = collection(db, 'notifications');
            const q = query(notificationsCollectionRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const notificationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAnnouncements(notificationsData);
        } catch (err) {
            console.error("Error fetching announcements:", err);
            setToastMessage({ text: "فشل تحميل الإعلانات.", type: 'error' });
        }
    }, [setToastMessage]);

    const fetchDealOfTheDay = useCallback(async () => {
        try {
            const dealRef = doc(db, 'dealOfTheDay', 'current');
            const dealSnap = await getDoc(dealRef);
            if (dealSnap.exists()) {
                const dealData = dealSnap.data();
                const productData = products.find(p => p.id === dealData.productId);
                if (productData && dealData.offerEndTime && dealData.offerEndTime instanceof Timestamp) {
                    const endTime = dealData.offerEndTime.toDate();
                    if (endTime > new Date()) {
                        setActiveOffer({ ...productData, ...dealData, id: productData.id, offerEndTime: endTime.toISOString() });
                    }
                }
            }
        } catch (err) {
            console.error("Error fetching deal of the day:", err);
        }
    }, [products]);

    const setupUserNotificationsListener = useCallback((currentUser) => {
        if (!currentUser?.uid) {
            setUserNotifications([]);
            return () => {};
        }
        const notificationsRef = collection(db, 'users', currentUser.uid, 'user_notifications');
        const q = query(notificationsRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUserNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (err) => console.error("Error listening to user notifications:", err));
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            fetchDealOfTheDay();
        }
    }, [products, fetchDealOfTheDay]);
    
    useEffect(() => {
        const banners = [];
        if (activeOffer && !dismissedSessionBannerIds.includes(activeOffer.id)) {
            banners.push({ type: 'offer', data: activeOffer, id: activeOffer.id });
        }
        announcements.forEach(ann => {
            if (ann.isActive && !dismissedSessionBannerIds.includes(ann.id) && !readAnnouncementIds.includes(ann.id)) {
                banners.push({ type: 'announcement', data: ann, id: ann.id });
            }
        });
        setRotatingBanners(banners);
        if (currentBannerIndex >= banners.length) {
            setCurrentBannerIndex(0);
        }
    }, [activeOffer, announcements, dismissedSessionBannerIds, readAnnouncementIds, currentBannerIndex]);
    
    const resetRotationTimer = useCallback(() => {
        if (rotationTimerRef.current) clearInterval(rotationTimerRef.current);
        if (rotatingBanners.length > 1) {
            rotationTimerRef.current = setInterval(() => {
                setCurrentBannerIndex(prevIndex => (prevIndex + 1) % rotatingBanners.length);
            }, 7000);
        }
    }, [rotatingBanners]);

    useEffect(() => {
        resetRotationTimer();
        return () => { if (rotationTimerRef.current) clearInterval(rotationTimerRef.current); };
    }, [resetRotationTimer]);

    const handleGoToBanner = useCallback((index) => {
        setCurrentBannerIndex(index);
        resetRotationTimer();
    }, [resetRotationTimer]);

    const handleDismissBanner = useCallback((bannerId) => {
        setDismissedSessionBannerIds(prevIds => [...prevIds, bannerId]);
        const isAnnouncement = announcements.some(ann => ann.id === bannerId);
        if (isAnnouncement && !readAnnouncementIds.includes(bannerId)) {
            const newReadIds = [...new Set([...readAnnouncementIds, bannerId])];
            setReadAnnouncementIds(newReadIds);
            try { if (typeof localStorage !== 'undefined') localStorage.setItem('readAnnouncementIds', JSON.stringify(newReadIds)); } catch (e) { console.error(e); }
        }
    }, [announcements, readAnnouncementIds]);

    const { allNotifications, totalUnreadCount } = useMemo(() => {
        const processedAnnouncements = announcements.map(ann => ({ ...ann, isRead: readAnnouncementIds.includes(ann.id), notificationType: 'announcement' }));
        const processedUserNotifications = userNotifications.map(n => ({ ...n, isRead: readUserNotificationsIds.includes(n.id), notificationType: 'userNotification' }));
        
        let combined = [...processedAnnouncements, ...processedUserNotifications];

        if (currentUser && !currentUser.phone) {
            const phoneNotification = {
                id: 'local_add_phone_notification',
                title: "أكمل ملفك الشخصي",
                message: "أضف رقم هاتفك لتسهيل التواصل واستلام تحديثات طلباتك.",
                icon: 'PhoneIcon',
                isRead: false,
                notificationType: 'local',
                createdAt: new Date(),
                link: { action: 'navigateToUserProfile', params: {} }
            };
            combined.push(phoneNotification);
        }
        
        combined.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt ? new Date(a.createdAt) : 0;
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt ? new Date(b.createdAt) : 0;
            return dateB - dateA;
        });
        
        const unreadGlobal = announcements.filter(ann => ann.isActive && !readAnnouncementIds.includes(ann.id)).length;
        const unreadUser = userNotifications.filter(n => !readUserNotificationsIds.includes(n.id)).length;
        const unreadLocal = (currentUser && !currentUser.phone) ? 1 : 0;
        
        return { allNotifications: combined, totalUnreadCount: unreadGlobal + unreadUser + unreadLocal };

    }, [announcements, userNotifications, readAnnouncementIds, readUserNotificationsIds, currentUser]);

    useEffect(() => { try { if (typeof localStorage !== 'undefined') localStorage.setItem('readUserNotificationsIds', JSON.stringify(readUserNotificationsIds)); } catch(e) { console.error(e); } }, [readUserNotificationsIds]);

    const handleMarkNotificationAsRead = useCallback((notificationId, type) => {
        if (type === 'announcement' && !readAnnouncementIds.includes(notificationId)) {
            const newIds = [...readAnnouncementIds, notificationId];
            setReadAnnouncementIds(newIds);
            try { localStorage.setItem('readAnnouncementIds', JSON.stringify(newIds)); } catch(e) { console.error(e); }
        } else if (type === 'userNotification' && !readUserNotificationsIds.includes(notificationId)) {
            const newIds = [...readUserNotificationsIds, notificationId];
            setReadUserNotificationsIds(newIds);
            try { localStorage.setItem('readUserNotificationsIds', JSON.stringify(newIds)); } catch(e) { console.error(e); }
        }
    }, [readAnnouncementIds, readUserNotificationsIds]);
    
    return {
        announcements, userNotifications, readAnnouncementIds, readUserNotificationsIds,
        activeOffer, rotatingBanners, currentBannerIndex,
        allNotifications, totalUnreadCount,
        fetchAnnouncements, fetchDealOfTheDay, setupUserNotificationsListener,
        handleMarkNotificationAsRead,
        handleGoToBanner,
        handleDismissBanner,
    };
};