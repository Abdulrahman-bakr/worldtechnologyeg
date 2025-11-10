
export const getImageUrl = (url) => {
  if (!url) {
    return 'https://i.postimg.cc/PqYp2cGM/placeholder.png';
  }
  // If it's already an absolute URL, data URL, or blob URL, return it
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  // If it's a root-relative path, it's fine
  if (url.startsWith('/')) {
    return url;
  }
  // Otherwise, make it root-relative
  return `/${url}`;
};
