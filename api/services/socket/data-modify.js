const sqlString = require("sqlstring");

module.exports = {
    doLampControl: async function (request) {
    try {
      const { data } = request;
      const response = {
        result: 0,
      };
      let sql = sqlString.format(
        "update lts_device_detail set lampStatus = ? where lts_mac = ? and deviceId = ?", [data.switch,data.gatewayDn,data.deviceId]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response.packetNo = request.packetNo;
      response.cmdType = request.cmdType + "Ack";
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  doModLocation: async function (request) {
    try {
      const { data } = request;
      const response = {
        result: 0,
      };
      console.log("request == " + request);
      let sql = sqlString.format(
        "update lts_device_detail set location = ? where lts_mac = ? and deviceId = ?", [data.location,data.gatewayDn,data.deviceId]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);

      response.packetNo = request.packetNo;
      response.cmdType = request.cmdType + "Ack";
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  doModName: async function (request) {
    try {
      const { data } = request;
      const response = {
        result: 0,
      };
      let sql = sqlString.format(
        "update lts_device_detail set name = ? where lts_mac = ? and deviceId = ?", [data.name,data.gatewayDn,data.deviceId]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response.packetNo = request.packetNo;
      response.cmdType = request.cmdType + "Ack";
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  doChangePassword: async function (request) {
    try {
      const response = {
        result: 0,
      };
    //   let sql = sqlString.format(
    //     "update lts_device_detail set location = ? where lts_mac = ? and deviceId = ?", [data.location,data.gatewayDn,data.deviceId]
    //   );
    //   await sails
    //     .getDatastore(process.env.MYSQL_DATASTORE)
    //     .sendNativeQuery(sql);
      response.packetNo = request.packetNo;
      response.cmdType = request.cmdType + "Ack";
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
