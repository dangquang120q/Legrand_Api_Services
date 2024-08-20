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
