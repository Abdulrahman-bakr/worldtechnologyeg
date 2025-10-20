// src/hooks/useOrders.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../services/firebase/config.js';
import { collection, query, where, orderBy, limit, getDocs, onSnapshot, startAfter } from 'firebase/firestore';

const ORDERS_PER_PAGE = 10;

export const useOrdersData = (currentUser) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastVisible, setLastVisible] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    
    const unsubscribeRef = useRef(null);

    const processSnapshot = (documentSnapshots, isInitial) => {
        const newOrders = documentSnapshots.docs.map(doc => {
            const data = doc.data();

            const createdAtDate = data.createdAt && typeof data.createdAt.toDate === 'function' 
                ? data.createdAt.toDate() 
                : null;
            
            const clientCreatedAtDate = data.clientCreatedAt && typeof data.clientCreatedAt.toDate === 'function'
                ? data.clientCreatedAt.toDate()
                : (data.clientCreatedAt ? new Date(data.clientCreatedAt) : null);

            return {
                id: doc.id,
                ...data,
                createdAt: createdAtDate,
                clientCreatedAt: clientCreatedAtDate,
            };
        });
        
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
        setHasMore(newOrders.length === ORDERS_PER_PAGE);

        if (isInitial) {
            setOrders(newOrders);
        } else {
            setOrders(prevOrders => {
                const existingIds = new Set(prevOrders.map(o => o.id));
                const filteredNewOrders = newOrders.filter(o => !existingIds.has(o.id));
                return [...prevOrders, ...filteredNewOrders];
            });
        }
    };
    
    const fetchMoreOrders = useCallback(async () => {
        if (!currentUser?.uid || !hasMore || isFetchingMore || !lastVisible) return;

        setIsFetchingMore(true);
        setError(null);

        try {
            const ordersRef = collection(db, 'orders');
            const q = query(ordersRef, where("userId", "==", currentUser.uid), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(ORDERS_PER_PAGE));
            const documentSnapshots = await getDocs(q);
            processSnapshot(documentSnapshots, false);
        } catch (err) {
            console.error("Error fetching more orders:", err);
            setError("حدث خطأ أثناء جلب المزيد من الطلبات.");
        } finally {
            setIsFetchingMore(false);
        }
    }, [currentUser?.uid, lastVisible, hasMore, isFetchingMore]);

    useEffect(() => {
        if (unsubscribeRef.current) unsubscribeRef.current();

        if (currentUser?.uid) {
            setIsLoading(true);
            setOrders([]);
            setLastVisible(null);
            setHasMore(true);

            const ordersRef = collection(db, 'orders');
            const q = query(ordersRef, where("userId", "==", currentUser.uid), orderBy('createdAt', 'desc'), limit(ORDERS_PER_PAGE));
            const unsubscribe = onSnapshot(q, snapshot => {
                processSnapshot(snapshot, true);
                setIsLoading(false);
            }, err => {
                console.error("Error with order listener:", err);
                setError("حدث خطأ أثناء تحديث الطلبات.");
                setIsLoading(false);
            });
            unsubscribeRef.current = unsubscribe;
        } else {
            setOrders([]);
            setIsLoading(false);
            setHasMore(true);
        }

        return () => { if (unsubscribeRef.current) unsubscribeRef.current(); };
    }, [currentUser?.uid]);
    
    return { orders, isLoading, error, fetchMoreOrders, hasMore, isFetchingMore };
};