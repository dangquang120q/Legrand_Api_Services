const sqlString = require("sqlstring");

module.exports = {
  login: async (request, header, end) => {
    const { data } = request;
    const response = {
      result: 0,
    };

    let result = 1;
    let sqlCheck = sqlString.format(
      "Select lts_device_id from lts_device_control where lts_mac = ?",
      [data["dn"]]
    );
    let dataCheck = await sails
      .getDatastore(process.env.MYSQL_DATASTORE)
      .sendNativeQuery(sqlCheck);
    if (dataCheck["rows"].length == 0) {
      result = 0;
    }
    else{
      let sqlUpdateTime = sqlString.format(
        "update lts_device_control set last_ping_time = ? where lts_mac = ?",
        [Date.now(),data["dn"]]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlUpdateTime);
    }
    response.result = result;
    response.data = {
      "timestamp": Date.now(),
      "timezone": "UTC"
    }
    return response;
  },
};
