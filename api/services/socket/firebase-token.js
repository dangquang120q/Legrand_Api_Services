const sqlString = require("sqlstring");

module.exports = {
  getFirebaseToken: async (lts_mac) => {
    try{
        let sqlUser = sqlString.format(
            "Select owned_id from lts_device_control where lts_mac = ?",
            [lts_mac]
        );
        let dataUser = await sails
            .getDatastore(process.env.MYSQL_DATASTORE)
            .sendNativeQuery(sqlUser);
        let userId = dataUser["rows"][0]["owned_id"];
        let sql = sqlString.format(
          "SELECT device_token FROM firebase_token WHERE user_id = ?",
          [userId]
        );
        const data = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
        return data;
    }
    catch(err){
        console.log(err);
        return -1;
    }
  },
};
