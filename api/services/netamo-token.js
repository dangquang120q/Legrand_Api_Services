var { Axios } = require("axios");
const { log } = require("./log");

const axiosNetamo = new Axios({
  baseURL: process.env.NETAMO_API,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

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

      log("Get netamo oauth token: " + JSON.stringify(params));
      const res = await axiosNetamo.post("/oauth2/token", {
        grant_type,
        client_id,
        client_secret,
        code,
        redirect_uri,
        scope,
      });

      log("Netamo auth token:" + JSON.stringify(res));
      return res;
    } catch (error) {
      log("Get netamo oauth token error: " + error);
    }
  },
};
