const crypto = require("crypto");

// Dữ liệu cần mã hóa
// const data = "LEGRAND_SC#BA671EFEFFB96F8C#1#0";
const data = "LEGRAND_SC#BA7C5B4E3F2D9C8E#1#0";
// Khóa AES-128-ECB
const key = "E26DC731BF67F664D28E90E008B083A6";

// Tạo một đối tượng cipher
const cipher = crypto.createCipheriv(
  "aes-128-ecb",
  Buffer.from(key, "hex"),
  null
);
cipher.setAutoPadding(true);

// Mã hóa dữ liệu
let encrypted = cipher.update(data, "utf8", "base64");
encrypted += cipher.final("base64");

// Tạo một đối tượng decipher
const decipher = crypto.createDecipheriv(
  "aes-128-ecb",
  Buffer.from(key, "hex"),
  null
);
decipher.setAutoPadding(true);

// Giải mã dữ liệu
let decrypted = decipher.update(encrypted, "base64", "utf8");
decrypted += decipher.final("utf8");

// decrypted = cipher.update(data, "utf8", "base64");
// decrypted += cipher.final("base64");
console.log("Dữ liệu đã mã hóa:", encrypted);
console.log("Dữ liệu giải mã:", decrypted);
