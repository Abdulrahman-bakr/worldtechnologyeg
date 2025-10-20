import React, { useState } from 'react';
import { StarRating } from '../../ui/feedback/StarRating.js';

const ReviewForm = ({ productId, currentUser, onPendingReviewLogin, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            onPendingReviewLogin();
            return;
        }
        if (rating === 0) {
            setError("يرجى تحديد تقييم (عدد النجوم).");
            return;
        }
        setIsSubmitting(true);
        setError('');
        setSuccess('');
        try {
            await onSubmit({ rating, comment });
            setSuccess("شكرًا لك! تم إرسال مراجعتك بنجاح وستظهر بعد الموافقة عليها.");
            setRating(0);
            setComment('');
        } catch (err) {
            setError(err.message || "حدث خطأ أثناء إرسال المراجعة.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentUser) {
        return React.createElement("div", { className: "p-4 bg-light-100 dark:bg-dark-700 rounded-lg text-center" },
            React.createElement("p", { className: "mb-2" }, "يجب تسجيل الدخول أولاً لتتمكن من إضافة مراجعة."),
            React.createElement("button", { onClick: onPendingReviewLogin, className: "text-primary font-semibold hover:underline" }, "تسجيل الدخول الآن")
        );
    }
    
    return React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
        React.createElement("h3", { className: "text-lg font-semibold" }, "أضف مراجعتك"),
        error && React.createElement("p", { className: "text-red-500 text-sm" }, error),
        success && React.createElement("p", { className: "text-green-600 text-sm" }, success),
        React.createElement("div", null,
            React.createElement("label", { className: "block mb-2 font-medium" }, "تقييمك:"),
            React.createElement(StarRating, { rating: rating, onRatingChange: setRating, className: "text-2xl" })
        ),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "review-comment", className: "block mb-2 font-medium" }, "تعليقك (اختياري):"),
            React.createElement("textarea", {
                id: "review-comment",
                value: comment,
                onChange: (e) => setComment(e.target.value),
                className: "w-full p-2 border border-light-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 min-h-[100px]",
                placeholder: "اكتب رأيك في المنتج..."
            })
        ),
        React.createElement("button", {
            type: "submit",
            disabled: isSubmitting,
            className: "bg-primary text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
        }, isSubmitting ? "جاري الإرسال..." : "إرسال المراجعة")
    );
};

export { ReviewForm };