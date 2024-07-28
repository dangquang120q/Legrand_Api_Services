const sqlString = require("sqlstring");

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

  switchDevice: async function (request, lts_mac) {
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

  reportDeviceMode: async function (request, lts_mac) {
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
};
