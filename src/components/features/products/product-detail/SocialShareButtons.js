import React from 'react';
import { ShareIcon, WhatsAppIcon, FacebookIcon, TwitterIcon } from '../../../icons/index.js';

const SocialShareButtons = ({ product }) => {
    if (!product) return null;

    const productUrl = window.location.href;
    const shareText = `اكتشف هذا المنتج الرائع: ${product.arabicName} على متجر World Technology!`;
    
    const encodedUrl = encodeURIComponent(productUrl);
    const encodedText = encodeURIComponent(shareText);

    const shareLinks = [
        { 
            name: 'WhatsApp', 
            url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`, 
            icon: WhatsAppIcon,
            className: 'bg-green-500 hover:bg-green-600'
        },
        { 
            name: 'Facebook', 
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, 
            icon: FacebookIcon,
            className: 'bg-blue-600 hover:bg-blue-700'
        },
        { 
            name: 'X', 
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, 
            icon: TwitterIcon,
            className: 'bg-black dark:bg-gray-200 hover:bg-gray-800 dark:hover:bg-gray-300'
        },
    ];

    const handleNativeShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.arabicName,
                text: shareText,
                url: productUrl,
            }).catch((error) => console.log('Error sharing', error));
        }
    };

    return (
        React.createElement("div", { className: "social-share-container mt-6 pt-4 border-t border-light-200 dark:border-dark-700" },
            React.createElement("p", { className: "text-sm font-semibold text-dark-800 dark:text-dark-100 mb-2" }, "شارك المنتج:"),
            React.createElement("div", { className: "flex items-center gap-3" },
                navigator.share && (
                    React.createElement("button", {
                        onClick: handleNativeShare,
                        title: "مشاركة",
                        className: "social-share-button bg-primary hover:bg-primary-hover"
                    }, React.createElement(ShareIcon, { className: "w-5 h-5 text-white" }))
                ),
                shareLinks.map(link => (
                    React.createElement("a", {
                        key: link.name,
                        href: link.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        title: `شارك عبر ${link.name}`,
                        className: `social-share-button ${link.className}`
                    }, React.createElement(link.icon, { className: 'w-5 h-5 text-white' }))
                ))
            )
        )
    );
};

export { SocialShareButtons };