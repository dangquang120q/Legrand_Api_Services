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

      const reqBody = {
        grant_type: grant_type + "",
        client_id: client_id + "",
        client_secret: client_secret + "",
        code: code + "",
        redirect_uri: redirect_uri + "",
        scope: scope + "",
      };
      log("Get netamo oauth token: " + JSON.stringify(reqBody));
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
      const data = await res.json();
      log("Netamo oauth token data: " + JSON.stringify(data));
      return {
        data: data,
        error: -1,
      };
    } catch (error) {
      log("Get netamo oauth token error: " + error);
      return {
        error: error,
      };
    }
  },
  getHomeData: async (params) => {
    try {
      const {
        access_token,
        home_id
      } = params;
      log(JSON.stringify(params));
      const res = await fetch(API_URL + "/api/homesdata", {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "Authorization": 'Bearer ' + access_token
        },
        body: new URLSearchParams({
          home_id: home_id + ""
        }),
      });
      const data = await res.json();
      // log(JSON.stringify(data));
      return {
        homes: data.body.homes || [],
        user: data.body.user,
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
