
const crypto = require("crypto");
const CryptoJS = require("crypto-js");

// Dữ liệu cần mã hóa
// const data = "LEGRAND_SC#BA671EFEFFB96F8C#1#0";
// const data = "LEGRAND_SC#BA7C5B4E3F2D9C8E#1#0";
// Khóa AES-128-ECB
const key = "E26DC731BF67F664D28E90E008B083A6";
const cipherText = "0ddWMQXtZXpARAEJrrl1hjuTbk1Tj7/MlwVhXEC7/Qo=";

// Tạo một đối tượng cipher
// const cipher = crypto.createCipheriv(
//   "aes-128-ecb",
//   Buffer.from(key, "hex"),
//   null
// );
// cipher.setAutoPadding(true);

// // Mã hóa dữ liệu
// let encrypted = cipher.update(data, "utf8", "base64");
// encrypted += cipher.final("base64");

// // Tạo một đối tượng decipher
// const decipher = crypto.createDecipheriv(
//   "aes-128-ecb",
//   Buffer.from(key, "hex"),
//   null
// );
// decipher.setAutoPadding(true);

// // Giải mã dữ liệu
// let decrypted = decipher.update(encrypted, "base64", "utf8");
// decrypted += decipher.final("utf8");

// // decrypted = cipher.update(data, "utf8", "base64");
// // decrypted += cipher.final("base64");
// console.log("Dữ liệu đã mã hóa:", encrypted);
// console.log("Dữ liệu giải mã:", decrypted);

// let text = CryptoJS.enc.Base64.parse(cipherText);
// let keyHex = CryptoJS.enc.Hex.parse(key);
// let decrypted = CryptoJS.AES.decrypt(
//   cipherText,
//   keyHex,
//   {
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7,
//   }
// );

// // Convert the decrypted data back to a string
// let decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

var data = [
  'M01.L4A.16.09@gmail.com',
  'M01.L4A.06.07@gmail.com'
]
;
data.forEach(element => {
  console.log(CryptoJS.MD5(element).toString());
});

// console.log("Decrypted Text:", decryptedText);