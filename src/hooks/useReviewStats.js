import { useState, useEffect, useMemo } from 'react';
import { db } from '../services/firebase/config.js';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export const useReviewStats = (product) => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!product || !product.id) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const reviewsRef = collection(db, 'reviews');
        const q = query(
            reviewsRef, 
            where('productId', '==', product.id),
            where('isApproved', '==', true) // Only count approved reviews
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedReviews = snapshot.docs.map(doc => doc.data());
            setReviews(fetchedReviews);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching review stats:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [product]);

    const { liveRating, liveReviewCount } = useMemo(() => {
        if (!reviews || reviews.length === 0) {
            return { liveRating: 0, liveReviewCount: 0 };
        }
        const totalRating = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
        const average = totalRating / reviews.length;
        return { liveRating: average, liveReviewCount: reviews.length };
    }, [reviews]);

    return { liveRating, liveReviewCount, isLoadingReviewStats: isLoading };
};
