const { HttpResponse } = require("../services/http-response");
const sqlString = require('sqlstring');
const jwtoken = require('../services/jwtoken');
const {log} = require('../services/log');

module.exports = async function (req, res, next) {
  const jwtToken = req.headers["auth-token"];
  try {
    let decodedToken = jwtoken.decode(jwtToken);
    let userId = decodedToken["userId"];
    let sqlCheck = sqlString.format("Select id from user_account where user_id = ? and login_token = ?", [userId,jwtToken]);
    let dataCheck = await sails.getDatastore(process.env.MYSQL_DATASTORE).sendNativeQuery(sqlCheck);
    let response;
    if (dataCheck["rows"].length == 0) {
        response = new HttpResponse({msg: "Invalid Token"}, { statusCode: 401, error: true });
        return res.ok(response);
    }
    return next();
  } catch (error) {
    return res.serverError("Something bad happened on the server: " + error);
  }
};
