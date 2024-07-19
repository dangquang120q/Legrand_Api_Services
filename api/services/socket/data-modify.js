const sqlString = require("sqlstring");

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
