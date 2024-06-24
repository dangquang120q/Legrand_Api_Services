const sqlString = require("sqlstring");

module.exports = {
  checkVersion: async (lts_mac) => {
    try{
      const req = {};
      let result = -1;
      let sql2 = sqlString.format("Select * from lst_device_upload_firmware where lts_mac = ? ORDER BY id DESC LIMIT 1",[lts_mac]);
      let data2 = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql2);
      let sql = sqlString.format(
          "Select * from lts_lastest_firmware_ver ORDER BY id DESC LIMIT 1"
      );
      let data = await sails
      .getDatastore(process.env.MYSQL_DATASTORE)
      .sendNativeQuery(sql);
      if (data2["rows"][0]["app_ver"] != data["rows"][0]["app"]
        || data2["rows"][0]["mcu_ver"] != data["rows"][0]["MCU"]
        || data2["rows"][0]["system_ver"] != data["rows"][0]["system_ver"]) {
          result = 0;
      }
      else{
          result = -1;
      }
      req.packetNo = data2["rows"][0]["package_no"];
      req.data = {
          "systemVersion":data["rows"][0]["system_ver"], 
          "gatewayDn":data2["rows"][0]["lts_mac"], 
          "model": data2["rows"][0]["model"], 
          "PCBA":data2["rows"][0]["PCBA"], 
          "appVersion":data["rows"][0]["app"], 
          "mcuVersion":data["rows"][0]["MCU"]
      }
      return {req,result};
    }
    catch(err){
      console.log(err);
      const req = {};
      let result = -1;
      return {req,result};
    }
  },
};
