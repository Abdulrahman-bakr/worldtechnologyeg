// A simple and safe function to convert a specific markdown subset to HTML
export const markdownToHtml = (text) => {
    if (!text) return '';
    let html = text;

    // Bold: **text** -> <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Links: [text](url) -> <a href="url" ...>text</a>
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
        const safeUrl = url.trim();
        // Allow only safe protocols
        if (safeUrl.startsWith('https://') || safeUrl.startsWith('http://') || safeUrl.startsWith('mailto:') || safeUrl.startsWith('tel:')) {
            const target = safeUrl.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : '';
            return `<a href="${safeUrl}" ${target} class="text-secondary hover:underline">${linkText}</a>`;
        }
        return match; // Return original markdown if protocol is not safe
    });

    // Unordered list items: * item -> • item
    html = html.replace(/^\s*\*\s+/gm, '&bull; ');

    // Newlines: \n -> <br />
    html = html.replace(/\n/g, '<br />');
    
    return html;
};


export const formatTimeAgo = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
        return '';
    }
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const getArabicPlural = (number, singular, dual, plural, femPlural) => {
        if (number === 1) return singular;
        if (number === 2) return dual;
        if (number >= 3 && number <= 10) return femPlural || plural;
        return plural;
    };

    let interval = seconds / 31536000; // year
    if (interval > 1) {
        const val = Math.floor(interval);
        return `منذ ${val} ${getArabicPlural(val, 'سنة', 'سنتين', 'سنة', 'سنوات')}`;
    }
    interval = seconds / 2592000; // month
    if (interval > 1) {
        const val = Math.floor(interval);
        return `منذ ${val} ${getArabicPlural(val, 'شهر', 'شهرين', 'شهر', 'أشهر')}`;
    }
    interval = seconds / 86400; // day
    if (interval >= 1) {
        const val = Math.floor(interval);
        if (val === 1) return 'أمس';
        return `منذ ${val} ${getArabicPlural(val, 'يوم', 'يومين', 'يوم', 'أيام')}`;
    }
    interval = seconds / 3600; // hour
    if (interval >= 1) {
        const val = Math.floor(interval);
        return `منذ ${val} ${getArabicPlural(val, 'ساعة', 'ساعتين', 'ساعة', 'ساعات')}`;
    }
    interval = seconds / 60; // minute
    if (interval >= 1) {
        const val = Math.floor(interval);
        return `منذ ${val} ${getArabicPlural(val, 'دقيقة', 'دقيقتين', 'دقيقة', 'دقائق')}`;
    }
    return 'الآن';
};
