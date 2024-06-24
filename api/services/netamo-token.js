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
      //   const res = await axios.post(API_URL + "/oauth2/token", {
      //     grant_type,
      //     client_id,
      //     client_secret,
      //     code,
      //     redirect_uri,
      //     scope,
      //   });
      const reqBody = {
        grant_type: grant_type + "",
        client_id: client_id + "",
        client_secret: client_secret + "",
        code: code + "",
        redirect_uri: redirect_uri + "",
        scope: scope + "",
      };
      log(reqBody);
      const res = await fetch(API_URL + "/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({
          grant_type: grant_type + "",
          client_id: client_id + "",
          client_secret: client_secret + "",
          code: code + "",
          redirect_uri: redirect_uri + "",
          scope: scope + "",
        }),
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
