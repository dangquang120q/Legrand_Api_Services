const sqlString = require("sqlstring");

module.exports = {
  checkPing: async (lts_mac) => {
    try{
      const response = {
        result: 0,
      };
      let result = -1;
      let sqlTime = sqlString.format(
          "Select last_ping_time from lts_device_control where lts_mac = ?",
          [lts_mac]
        );
        let dataTime = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlTime);
        if (Date.now() - dataTime["rows"][0]["last_ping_time"] < 120000) {
          result = 0;
        }
        else{
          result = -1;
        }
      response.result = result;
      return response;
    }
    catch(err){
      const response = {
        result: -1,
      };
      return response;
    }
  },
};
