const sqlString = require("sqlstring");

module.exports = {
  heartbeat: async (request, lts_mac) => {
    // const { data } = request;
    try{
      const response = {
        result: 0,
      };
      console.log("lts_mac == " + lts_mac);
      let result = -1;
      console.log(result);
      let sqlTime = sqlString.format(
        "Select last_ping_time from lts_device_control where lts_mac = ?",
        [lts_mac]
      );
      console.log("sqlTime == " + sqlTime);
      let dataTime = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlTime);
      if (Date.now() - dataTime["rows"][0]["last_ping_time"] < 120000) {
        let sqlUpdateTime = sqlString.format(
          "update lts_device_control set last_ping_time = ? where lts_mac = ?",
          [Date.now(),lts_mac]
        );
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlUpdateTime);
        result = 0;
      }
      else{
        result = -1;
      }
      response.packageNo = 1;
      response.result = result;
      return response;
    }
    catch{
      const response = {
        result: -1,
      };
      response.packetNo = 1;
      response.data = {
        "timestamp": Date.now(),
        "timezone": "UTC"
      }
      return response;
    }
  },
};
