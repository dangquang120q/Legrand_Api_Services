const sqlString = require("sqlstring");
module.exports = {
  firmWareInfo: async function (request) {
    const { data } = request;

    const response = {
      result: 0,
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
