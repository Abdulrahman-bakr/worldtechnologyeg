import React, { useState } from 'react';
import { StarRating } from '../../ui/feedback/StarRating.js';
import { ArrowUpOnSquareIcon, TrashIcon, StarIcon } from '../../icons/index.js';

const ReviewForm = ({ productId, currentUser, onPendingReviewLogin, onSubmit, product }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const pointsForReview = product?.pointsForReview ?? 0;

    const handleImageChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 3 - images.length);
            setImages(prev => [...prev, ...files]);
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

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
            await onSubmit({ rating, comment, images });
            setSuccess("شكرًا لك! تم إرسال مراجعتك بنجاح وستظهر بعد الموافقة عليها.");
            setRating(0);
            setComment('');
            setImages([]);
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
        pointsForReview > 0 && (
            React.createElement("div", { className: "flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400 font-semibold p-2 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-md" },
                React.createElement(StarIcon, { filled: true, className: "w-5 h-5" }),
                React.createElement("span", null, `احصل على ${pointsForReview} نقطة مكافأة عند إضافة مراجعتك!`)
            )
        ),
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
        React.createElement("div", null,
            React.createElement("label", { className: "block mb-2 font-medium" }, "إضافة صور (اختياري - 3 كحد أقصى)"),
            React.createElement("div", { className: "flex items-center gap-4" },
                React.createElement("label", { className: "review-image-uploader flex-grow" },
                    React.createElement(ArrowUpOnSquareIcon, { className: "w-8 h-8 text-dark-600 dark:text-dark-300 mb-1" }),
                    React.createElement("span", { className: "text-sm text-dark-700 dark:text-dark-200" }, "اختر صورًا"),
                    React.createElement("input", { type: "file", multiple: true, accept: "image/*", onChange: handleImageChange, className: "hidden", disabled: images.length >= 3 })
                ),
                React.createElement("div", { className: "review-image-previews" },
                    images.map((file, index) => (
                        React.createElement("div", { key: index, className: "review-image-preview-item" },
                            React.createElement("img", { src: URL.createObjectURL(file), alt: `Preview ${index + 1}` }),
                            React.createElement("button", { type: "button", onClick: () => removeImage(index), className: "remove-btn" }, React.createElement(TrashIcon, { className: "w-4 h-4" }))
                        )
                    ))
                )
            )
        ),
        React.createElement("button", {
            type: "submit",
            disabled: isSubmitting,
            className: "bg-primary text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
        }, isSubmitting ? "جاري الإرسال..." : "إرسال المراجعة")
    );
};

export { ReviewForm };