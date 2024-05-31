module.exports = {
  heartbeat: async function (request, lts_mac) {
    // const { data } = request;
    const response = {
      result: 0,
    };
    console.log(lts_mac);
    let result = -1;
    let sqlTime = sqlString.format(
      "Select last_ping_time from lts_device_control where lts_mac = ?",
      [lts_mac]
    );
    let dataTime = await sails
      .getDatastore(process.env.MYSQL_DATASTORE)
      .sendNativeQuery(sqlTime);
    if (Date.now() - dataTime["rows"][0] < 120) {
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
    response.result = result;
    return response;
  },
};
