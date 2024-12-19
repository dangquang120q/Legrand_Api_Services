const sqlString = require("sqlstring");

module.exports = {
  login: async (request, header, end) => {
    try {
      const { data, packetNo } = request;
      const response = {
        result: 0,
      };

      let result = 0;
      let sqlCheck = sqlString.format(
        "Select lts_device_id from lts_device_control where lts_mac = ?",
        [data["dn"]]
      );
      let dataCheck = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlCheck);
      if (dataCheck["rows"].length == 0) {
        // result = -1;
        let sqlInsert = sqlString.format(
          "insert into lts_device_control(lts_mac) values (?)",
          [data["dn"]]
        );
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlInsert);
      } else {
        let sqlUpdateTime = sqlString.format(
          "update lts_device_control set last_ping_time = ? where lts_mac = ?",
          [Date.now(), data["dn"]]
        );
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlUpdateTime);
      }
      response.result = result;
      response.packetNo = 1;
      response.data = {
        timestamp: Date.now().toString(),
        timezone: "Asia/Bangkok",
        secretKey: "E26DC731BF67F664D28E90E008B083A6"
      };
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = 1;
      response.data = {
        timestamp: Date.now().toString(),
        timezone: "Asia/Bangkok",
        secretKey: "E26DC731BF67F664D28E90E008B083A6"
      };
      return response;
    }
  },
};
