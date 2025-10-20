import { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../../../services/firebase/config.js';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

export const useReviews = (productId, currentUser) => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const reviewsCollectionRef = collection(db, 'reviews');
        const q = query(
            reviewsCollectionRef,
            where('productId', '==', productId),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedReviews = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            }));
            setReviews(fetchedReviews);
            setIsLoading(false);
        }, (err) => {
            console.error("Error fetching reviews:", err);
            setError("حدث خطأ أثناء تحميل المراجعات.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [productId]);

    const { ratingCounts, averageRating, totalReviews } = useMemo(() => {
        if (reviews.length === 0) {
            return { ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, averageRating: 0, totalReviews: 0 };
        }
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let totalRating = 0;
        reviews.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
                counts[review.rating]++;
                totalRating += review.rating;
            }
        });
        const avg = totalRating / reviews.length;
        return { ratingCounts: counts, averageRating: avg, totalReviews: reviews.length };
    }, [reviews]);

    const userHasReviewed = useMemo(() => {
        if (!currentUser || !reviews.length) return false;
        return reviews.some(review => review.userId === currentUser.uid);
    }, [currentUser, reviews]);

    const handleReviewSubmit = useCallback(async ({ rating, comment }) => {
        if (!currentUser) {
            throw new Error("User must be logged in to submit a review.");
        }
        if (userHasReviewed) {
            throw new Error("You have already reviewed this product.");
        }

        const newReview = {
            productId,
            userId: currentUser.uid,
            userName: currentUser.name,
            rating,
            comment,
            images: [],
            createdAt: serverTimestamp(),
            isApproved: true, // Auto-approve for now
        };

        await addDoc(collection(db, 'reviews'), newReview);

    }, [productId, currentUser, userHasReviewed]);

    return {
        reviews,
        isLoading,
        error,
        ratingCounts,
        averageRating,
        totalReviews,
        userHasReviewed,
        handleReviewSubmit,
    };
};