/**
 * Converts an image buffer to a base64 string.
 * @param {buffer} file Image Buffer
 *
 * @return {string} Base64 String of the Image Buffer
 */
export const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
