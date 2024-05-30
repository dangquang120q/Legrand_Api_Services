module.exports = {
  heartbeat: async function (request) {
    const { data } = request;
    log(data);
    const response = {
      result: 0,
    };
    let result = 1;
    let sqlCheck = sqlString.format(
      "Select last_ping_time from user_account where lts_mac = ?",
      [data["dn"]]
    );
    let dataCheck = await sails
      .getDatastore(process.env.MYSQL_DATASTORE)
      .sendNativeQuery(sqlCheck);
    if (dataCheck["rows"].length == 0) {
      result = 0;
    }
    response.result = result;
    return response;
  },
};
