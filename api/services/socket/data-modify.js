const sqlString = require("sqlstring");
const notificationQueue = require("../firebase-queue");
module.exports = {
    doLampControl: async function (request) {
    try {
      const { data } = request;
      let result = 0;
      const req = {};
      let sql = sqlString.format(
        "update lts_device_detail set lampStatus = ? where lts_mac = ? and deviceId = ?", [data.switch,data.gatewayDn,data.deviceId]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
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
      req.packetNo = request.packetNo;
      req.cmdType = request.cmdType;
      var response = {
        "gatewayDn": data.gatewayDn,
        "deviceId": data.deviceId,
        "switch": data.switch
      }
      req.data = response;
      console.log(JSON.stringify(req));
      return {req,result};
    } catch (e){
        const req = {};
        let result = -1;
        console.log(e);
        return {req,result};
    }
  },
  doDeviceMode: async function (request) {
    try {
      const { data } = request;
      let result = 0;
      const req = {};
      let sql = sqlString.format(
        "update lts_device_control set status = ? where lts_mac = ?", [data.status,data.gatewayDn]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      req.packetNo = request.packetNo;
      req.cmdType = request.cmdType;
      req.data = data;
      return {req,result};
    } catch(error) {
        console.log(error);
        const req = {};
        let result = -1;
        return {req,result};
    }
  },
  doModLocation: async function (request) {
    try {
        const { data } = request;
        let result = 0;
        const req = {};
        console.log("request == " + request);
        let sql = sqlString.format(
            "update lts_device_detail set location = ? where lts_mac = ? and deviceId = ?", [data.location,data.gatewayDn,data.deviceId]
        );
        await sails
            .getDatastore(process.env.MYSQL_DATASTORE)
            .sendNativeQuery(sql);
        let sqlGet = sqlString.format(
          "select lts_device_version from lts_device_control where lts_mac = ?", [data.gatewayDn]
        );
        let dataVersion = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
              .sendNativeQuery(sqlGet);
        req.packetNo = request.packetNo;
        req.cmdType = request.cmdType;      
        req.data = data;
        req.data.deviceVersion = dataVersion["rows"][0]["lts_device_version"];
        return {req,result};
    } catch(error) {
        console.log(error);
        const req = {};
        let result = -1;
        return {req,result};
    }
  },

  doModName: async function (request) {
    try {
        const { data } = request;
        let result = 0;
        const req = {};
        let sql = sqlString.format(
            "update lts_device_detail set name = ? where lts_mac = ? and deviceId = ?", [data.name,data.gatewayDn,data.deviceId]
        );
        await sails
            .getDatastore(process.env.MYSQL_DATASTORE)
            .sendNativeQuery(sql);
        let sqlGet = sqlString.format(
          "select lts_device_version from lts_device_control where lts_mac = ?", [data.gatewayDn]
        );
        let dataVersion = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
              .sendNativeQuery(sqlGet);
        req.packetNo = request.packetNo;
        req.cmdType = request.cmdType;
        req.data = data;
        req.data.deviceVersion = dataVersion["rows"][0]["lts_device_version"];
        return {req,result};
    } catch(error) {
        console.log(error);
        const req = {};
        let result = -1;
        return {req,result};
    }
  },

  doChangePassword: async function (request) {
    try {
        const { data } = request;

        let result = 0;
        const req = {};
    //   let sql = sqlString.format(
    //     "update lts_device_detail set location = ? where lts_mac = ? and deviceId = ?", [data.location,data.gatewayDn,data.deviceId]
    //   );
    //   await sails
    //     .getDatastore(process.env.MYSQL_DATASTORE)
    //     .sendNativeQuery(sql);
        req.packetNo = request.packetNo;
        req.cmdType = request.cmdType;
        req.data = data;
        return {req,result};
    } catch {
        const req = {};
        let result = -1;
        return {req,result};
    }
  },
};
