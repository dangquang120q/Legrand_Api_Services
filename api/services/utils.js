const CryptoJS = require("crypto-js");

module.exports = {
  formatObject: function (obj) {
    // Filter out entries where the value is not undefined
    const filteredEntries = Object.entries(obj).filter(
      ([key, value]) => value !== undefined
    );

    const cleanedObj = Object.fromEntries(
      filteredEntries.map(([key, value]) => {
        if (!isNaN(value) && !isNaN(parseFloat(value))) {
          return [key, parseFloat(value)]; // or parseInt(value, 10) for integer conversion
        }
        return [key, value];
      })
    );
    // Convert the filtered entries back to an object
    const filteredObj = Object.fromEntries(filteredEntries);

    return filteredObj;
  },
  decryptAES: function (cipherText, secret) {
    // IV is a base64 string

    var key = CryptoJS.enc.Utf8.parse(secret);
    var cipherBytes = CryptoJS.enc.Base64.parse(cipherText);

    var decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherBytes }, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  },
};
