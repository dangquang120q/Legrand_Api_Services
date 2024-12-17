const sqlString = require("sqlstring");

module.exports = {
  updateDeviceVersion: async (request, lts_mac) => {
    try{
      const { result } = request;
      if (result == 0) {
        let sqlDeviceVersion = sqlString.format(
            "update lts_device_control set lts_device_version = lts_device_version + 1 where lts_mac = ?",
            [lts_mac]
        );
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlDeviceVersion);
      }
      
      return {result: 0};
    }
    catch(err){
      console.log(err);
      const response = {
        result: -1,
      };
      return response;
    }
  },
};
