const cron = require("node-cron");
const refreshFunc = require("./netamo-token").refreshToken;

module.exports = {
  // Tạo schedule chạy mỗi 2 tiếng
  refreshCronJob: async () => {
    const refreshSchedule = cron.schedule(
      "0 */2 * * *",
      async () => {
        console.log("Cron job chạy mỗi 2 tiếng");
        try {
          await refreshFunc();
        } catch (error) {
          console.log("Có lỗi xảy ra trong cron job refresh token:", error);
        }
      },
      {
        scheduled: true, // Tự động chạy cron khi server start
        timezone: "Asia/Ho_Chi_Minh", // Cấu hình timezone nếu cần
      }
    );
    refreshSchedule.start();
  },
};
