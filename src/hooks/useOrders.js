// src/hooks/useOrders.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../services/firebase/config.js';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export const useOrdersData = (currentUser) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const unsubscribeRef = useRef(null);

    const processSnapshot = (documentSnapshots) => {
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
                createdAt: createdAtDate || clientCreatedAtDate, // Fallback for sorting if server timestamp is missing
            };
        });
        
        // Sorting is handled by the Firestore query with orderBy, so client-side sort is not needed.
        setOrders(newOrders);
    };
    
    const fetchMoreOrders = useCallback(async () => {
        // Pagination is currently disabled. This function is a placeholder.
    }, []);

    useEffect(() => {
        // Cleanup previous listener
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }

        if (currentUser?.uid) {
            setIsLoading(true);
            setOrders([]);
            setError(null);

            const ordersRef = collection(db, 'orders');
            
            // Query for user's orders, sorted by creation date (newest first).
            // This requires a composite index on (userId, createdAt desc) in Firestore.
            const q = query(ordersRef, where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
            
            const unsubscribe = onSnapshot(q, snapshot => {
                processSnapshot(snapshot);
                setIsLoading(false);
            }, err => {
                console.error("[useOrders] onSnapshot: ERROR:", err);
                setError("حدث خطأ أثناء تحديث الطلبات. قد تحتاج إلى إنشاء فهرس في Firestore.");
                setIsLoading(false);
            });
            
            unsubscribeRef.current = unsubscribe;

        } else {
            // If no user, clear orders and stop loading
            setOrders([]);
            setIsLoading(false);
        }

        // Cleanup listener on component unmount or user change
        return () => { 
            if (unsubscribeRef.current) {
                unsubscribeRef.current(); 
            }
        };
    }, [currentUser?.uid]);
    
    return { orders, isLoading, error, fetchMoreOrders, hasMore: false, isFetchingMore: false };
};
