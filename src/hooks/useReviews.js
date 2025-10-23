
import { useState, useEffect, useMemo, useCallback } from 'react';
import { db, storage } from '../services/firebase/config.js';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, doc, updateDoc, increment, getDocs, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const useReviews = (product, currentUser, setToastMessage) => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userHasReviewed, setUserHasReviewed] = useState(false);

    useEffect(() => {
        const productId = product?.id;

        if (!productId || typeof productId !== 'string') {
            setIsLoading(false);
            if (productId) { // It exists but isn't a string
                console.error("useReviews received an invalid product ID (not a string):", productId);
                setError("معرف المنتج غير صالح.");
            }
            return;
        }

        setIsLoading(true);
        setError(null);

        const reviewsCollectionRef = collection(db, 'reviews');
        const q = query(
            reviewsCollectionRef,
            where('productId', '==', productId),
            where('isApproved', '==', true), // Only fetch approved reviews
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
    }, [product]);

    useEffect(() => {
        const productId = product?.id;
        if (!currentUser || !productId) {
            setUserHasReviewed(false);
            return;
        }

        const checkReview = async () => {
            const reviewsRef = collection(db, 'reviews');
            const q = query(
                reviewsRef,
                where('productId', '==', productId),
                where('userId', '==', currentUser.uid),
                limit(1)
            );
            try {
                const snapshot = await getDocs(q);
                setUserHasReviewed(!snapshot.empty);
            } catch (e) {
                console.error("Error checking if user has reviewed:", e);
                setUserHasReviewed(false);
            }
        };
        checkReview();
    }, [currentUser, product, reviews]);


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

    const handleReviewSubmit = useCallback(async ({ rating, comment, images }) => {
        const productId = product?.id;
        if (!productId || typeof productId !== 'string') {
            throw new Error("Product ID is invalid.");
        }
        if (!currentUser) {
            throw new Error("User must be logged in to submit a review.");
        }
        if (userHasReviewed) {
            throw new Error("You have already reviewed this product.");
        }

        const uploadedImageUrls = [];
        if (images && images.length > 0) {
            for (const imageFile of images) {
                const storageRef = ref(storage, `reviews/${productId}/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                const downloadURL = await getDownloadURL(snapshot.ref);
                uploadedImageUrls.push(downloadURL);
            }
        }
        
        const newReview = {
            productId,
            userId: currentUser.uid,
            userName: currentUser.name,
            rating,
            comment,
            images: uploadedImageUrls,
            createdAt: serverTimestamp(),
            isApproved: false, // Default to pending approval
        };

        await addDoc(collection(db, 'reviews'), newReview);

        const pointsForReview = product?.pointsForReview ?? 0;
        if (pointsForReview > 0) {
            try {
                const userDocRef = doc(db, "users", currentUser.uid);
                await updateDoc(userDocRef, {
                    loyaltyPoints: increment(pointsForReview)
                });
                if (setToastMessage) {
                    setToastMessage({ text: `شكراً لمراجعتك! لقد حصلت على ${pointsForReview} نقطة.`, type: 'success' });
                }
            } catch (e) {
                console.error("Error awarding points for review:", e);
            }
        }

    }, [product, currentUser, userHasReviewed, setToastMessage]);

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
