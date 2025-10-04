// src/utils/encryption.js
export const decryptString = (encryptedBase64, key) => {
    if (!encryptedBase64 || typeof encryptedBase64 !== 'string') return '';
    if (!key) return encryptedBase64;

    try {
        const decoded = atob(encryptedBase64);
        let decrypted = "";
        for (let i = 0; i < decoded.length; i++) {
            const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            decrypted += String.fromCharCode(charCode);
        }
        return decodeURIComponent(decrypted);
    } catch {
        return encryptedBase64;
    }
};

export const decryptObject = (encryptedObj, key) => {
    if (!encryptedObj || typeof encryptedObj !== 'object') return {};
    const decryptedObj = {};
    for (const [k, v] of Object.entries(encryptedObj)) {
        try {
            const decryptedKey = decryptString(k, key);
            const decryptedValue = JSON.parse(decryptString(v, key));
            decryptedObj[decryptedKey] = decryptedValue;
        } catch {
            decryptedObj[k] = v;
        }
    }
    return decryptedObj;
};