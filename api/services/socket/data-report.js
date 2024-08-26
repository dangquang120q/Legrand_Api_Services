const sqlString = require("sqlstring");
const { getFirebaseToken } = require("./firebase-token");
module.exports = {
  addDevice: async function (request, lts_mac) {
    try {
      const { data } = request;
      const response = {
        result: 0,
      };
      console.log("request == " + request);
      console.log("lts_mac == " + lts_mac);
      let result = 0;
      for (let index = 0; index < data["has"].length; index++) {
        const element = data["has"][index];
        let sqlInsert = sqlString.format(
          "CALL sp_insert_device(?,?,?,?,?,?)", [element["name"],element["location"],element["productKey"],element["gatewayDn"],element["parentDn"],element["deviceId"]]
        );
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlInsert);
      }
      let sql = sqlString.format(
        "update lts_device_control set lts_device_version = lts_device_version + 1 where lts_mac = ?", [lts_mac]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let sqlGet = sqlString.format(
        "select lts_device_version from lts_device_control where lts_mac = ?", [lts_mac]
      );
      let dataVersion = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlGet);
      response.packetNo = request.packetNo;
      response.result = result;
      response.data = {
        "deviceVersion": (dataVersion["rows"][0]["lts_device_version"]).toString()
      }
      return response;
    } catch (e) {
      const response = {
        result: -1,
      };
      console.log("error == " + e);
      response.packetNo = request.packetNo;
      return response;
    }
  },

  delDevice: async function (request, lts_mac) {
    try {
      const { data } = request;
      const response = {
        result: 0,
      };
      console.log("request == " + request);
      console.log("lts_mac == " + lts_mac);
      let result = 0;
      let sql = sqlString.format(
        "delete from lts_device_detail where lts_mac = ? and deviceId = ?", [data["gatewayDn"], data["deviceId"]]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let sqlGet = sqlString.format(
        "select lts_device_version from lts_device_control where lts_mac = ?", [lts_mac]
      );
      let dataVersion = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlGet);
      response.packetNo = request.packetNo;
      response.result = result;
      response.data = {
        "deviceVersion": (dataVersion["rows"][0]["lts_device_version"]).toString()
      }
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  switchDevice: async function (request, lts_mac) {
    try {
      const { data } = request;
      const response = {
        result: 0,
      };
      console.log("request == " + request);
      console.log("lts_mac == " + lts_mac);
      let sql = sqlString.format(
        "update lts_device_detail set lampStatus = ? where lts_mac = ? and deviceId = ?", [data.switch,data.gatewayDn,data.deviceId]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let result = 0;
      response.packetNo = request.packetNo;
      response.result = result;
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  battery: async function (request, lts_mac) {
    try {
      const response = {
        result: 0,
      };
      console.log("request == " + request);
      console.log("lts_mac == " + lts_mac);
      let result = 0;
      response.packetNo = request.packetNo;
      response.result = result;
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  alarm: async function (request, lts_mac) {
    try {
      const { data } = request;
      const response = {
        result: 0,
      };
      console.log("request == " + request);
      console.log("lts_mac == " + lts_mac);
      let sql = sqlString.format(
        "update lts_device_detail set alarmStatus = ? where lts_mac = ? and deviceId = ?", [data.alarmType,data.gatewayDn,data.deviceId]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let insertSql = sqlString.format(
        "insert into sensor_alarm_history(deviceId, updated_by) values (?, ?)",
        [data.gatewayDn, "screen"]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(insertSql);
      let sqlUser = sqlString.format(
        "select owned_id from lts_device_control where lts_mac = ?", [data.gatewayDn]
      );
      let dataUser = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlUser);
      let userId = dataUser["rows"][0]["owned_id"];
      let sqlFirebase = sqlString.format(
        "SELECT device_token FROM firebase_token WHERE user_id = ?",
        [userId]
      );
      const dataFb = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlFirebase);

      // Chuyển đổi kết quả truy vấn thành mảng các token
      const registrationTokens = dataFb.rows.map((device) => device.device_token);

      const message = {
        title: "Thông báo",
        body: "Nội dung thông báo",
      };

      // Chia thành các batch nhỏ để tránh quá tải
      const batchSize = 500;
      for (let i = 0; i < registrationTokens.length; i += batchSize) {
        const batchTokens = registrationTokens.slice(i, i + batchSize);

        // Thêm công việc vào hàng đợi
        notificationQueue.add({
          registrationTokens: batchTokens,
          message: message,
        });
      }
      let result = 0;
      response.packetNo = request.packetNo;
      response.result = result;
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  reportDeviceMode: async function (request, lts_mac) {
    try {
      const { data } = request;
      const response = {
        result: 0,
      };
      console.log("request == " + request);
      console.log("lts_mac == " + lts_mac);
      let sql = sqlString.format(
        "update lts_device_control set status = ? where lts_mac = ?", [data.status,data.gatewayDn]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let result = 0;
      response.packetNo = request.packetNo;
      response.result = result;
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },
};
