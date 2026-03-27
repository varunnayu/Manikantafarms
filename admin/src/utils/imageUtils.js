/**
 * Compresses an image File using the Canvas API and returns a Base64 data URL.
 * Resizes to max 800px on the longest side, JPEG quality 0.78.
 * Free, runs entirely in the browser — no external service needed.
 *
 * @param {File} file - The image file to compress
 * @param {number} maxSize - Max width/height in px (default 800)
 * @param {number} quality - JPEG quality 0–1 (default 0.78)
 * @returns {Promise<string>} Base64 data URL
 */
export function compressImage(file, maxSize = 800, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        // Calculate scaled dimensions
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) { height = Math.round((height * maxSize) / width); width = maxSize; }
        } else {
          if (height > maxSize) { width = Math.round((width * maxSize) / height); height = maxSize; }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Returns a human-readable size of a base64 string in KB.
 */
export function base64SizeKB(base64) {
  const bytes = (base64.length * 3) / 4 - (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
  return (bytes / 1024).toFixed(0);
}
