const CryptoJS = require("crypto-js");
const { log } = require("./log");
const crypto = require("crypto");

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
  decryptAES: function (cipherText, key) {
    // IV is a base64 string
    try {
      log("decryptAES: ", cipherText);
      // Tạo một đối tượng decipher
      // const decipher = crypto.createDecipheriv(
      //   "aes-128-ecb",
      //   Buffer.from(key, "hex"),
      //   null
      // );
      // decipher.setAutoPadding(true);

      // // Giải mã dữ liệu
      // let decrypted = decipher.update(cipherText, "base64", "utf8");
      // decrypted += decipher.final("utf8");
      // Decrypt the text
      // let text = CryptoJS.enc.Base64.parse(cipherText);
      let keyHex = CryptoJS.enc.Hex.parse(key);
      let decrypted = CryptoJS.AES.decrypt(
        cipherText,
        keyHex,
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      // Convert the decrypted data back to a string
      let decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      console.log("Decrypted Text:", decryptedText);

      return decryptedText;
    } catch (error) {
      console.log("error => " + error);
      return "";
    }
  },
};
