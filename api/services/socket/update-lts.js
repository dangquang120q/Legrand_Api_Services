const sqlString = require("sqlstring");
module.exports = {
  firmWareInfo: async function (request, lts_mac) {
    console.log("request == " + JSON.stringify(request));
    console.log("lts_mac == " + lts_mac);
    const response = {
      result: 0,
    };
    let sql = sqlString.format("Select * from lts_lastest_firmware_ver ORDER BY id DESC LIMIT 1;");
    let data2 = await sails
      .getDatastore(process.env.MYSQL_DATASTORE)
      .sendNativeQuery(sql);
    let result = 0;
    response.packetNo = request.packetNo;
    response.result = result;
    response.data = {
      system: data2["rows"][0]["system_img"],
      gatewayDn: data2["rows"][0]["gatewayDn"],
      account: data2["rows"][0]["account"],
      password: data2["rows"][0]["password"],
      accessUrl: data2["rows"][0]["access_url"],
      port: data2["rows"][0]["port"],
      ip: data2["rows"][0]["ip"],
      describe: data2["rows"][0]["describe"]
    };
    return response;
  },

  LTSversion: async function (request,lts_mac) {
    try {
      const response = {
        result: 0,
      };
      const { data } = request;
      console.log("request == " + JSON.stringify(request));
      console.log("lts_mac == " + lts_mac);
      let sql = sqlString.format("CALL sp_upload_version(?,?,?,?,?,?,?,?)", [data.system, data.gatewayDn,data.model,data.PCBA,data.appVersion,data.mcuVersion, lts_mac, request.packetNo]);
      let data2 = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let result = 0;
      response.packetNo = request.packetNo;
      response.result = result;
      return response;
    } 
    catch(error) {
      console.log('error' + error);
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },
};
