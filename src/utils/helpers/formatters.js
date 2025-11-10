// A simple and safe function to convert a specific markdown subset to HTML
export const markdownToHtml = (text) => {
    if (!text) return '';
    
    // This is a simple parser that handles paragraphs, links, bold, and lists.
    // It's designed to be safe for streaming, as it processes the whole text on each chunk.
    const blocks = text.split(/(\n\n+)/); // Split by one or more blank lines, keeping the separator
    
    const html = blocks.map(block => {
        if (block.match(/^\s*$/)) return ''; // Ignore empty blocks

        // Escape potential HTML in the block first
        let processedBlock = block
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Process links: [text](url)
        processedBlock = processedBlock.replace(
            /\[(.*?)\]\((.*?)\)/g,
            (match, linkText, url) => {
                const cleanUrl = url.replace(/&amp;/g, '&');
                return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${linkText}</a>`;
            }
        );

        // Process bold: **text**
        processedBlock = processedBlock.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Process unordered lists
        if (processedBlock.match(/^\s*\*\s+/m)) {
            const listItems = processedBlock.split('\n')
                .map(item => item.replace(/^\s*\*\s+/, '').trim())
                .filter(item => item)
                .map(item => `<li>${item}</li>`)
                .join('');
            return `<ul>${listItems}</ul>`;
        }

        // If it's not a list, wrap it in a paragraph and convert single newlines to <br>
        return `<p>${processedBlock.replace(/\n/g, '<br />')}</p>`;
    }).join('');

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