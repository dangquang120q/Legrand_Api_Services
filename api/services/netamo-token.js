var axios = require("axios");
const { log } = require("./log");

const API_URL = process.env.NETAMO_API;

module.exports = {
  getAuthToken: async (params) => {
    try {
      const {
        grant_type,
        client_id,
        client_secret,
        code,
        redirect_uri,
        scope,
      } = params;
      log(API_URL + "/oauth2/token");
      log("Get netamo oauth token: " + JSON.stringify(params));
      const res = await axios.post(API_URL + "/oauth2/token", {
        grant_type,
        client_id,
        client_secret,
        code,
        redirect_uri,
        scope,
      });

      log("Netamo auth token:" + JSON.stringify(res));
      return {
        data: res,
        error: -1,
      };
    } catch (error) {
      log("Get netamo oauth token error: " + error);
      return {
        error: error,
      };
    }
  },
};
