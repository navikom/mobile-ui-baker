import CryptoJS from 'crypto-js';

export function decrypt(text: string) {
  return CryptoJS.AES
    .decrypt(text, process.env.REACT_APP_CONTENT || '')
    .toString(CryptoJS.enc.Utf8);
}
