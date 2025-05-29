/**
 * Middleware kiểm tra hệ thống có đang bị vô hiệu hóa hay không.
 */
module.exports = async function (req, res, next) {
  const fs = require("fs");
  const flagFile = "./disabled.flag";

  if (fs.existsSync(flagFile)) {
    return res.status(503).json({
      message: "The system is temporarily disabled.",
    });
  }

  return next();
};
