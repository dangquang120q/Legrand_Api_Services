const { log } = require("./log");
const { SET_STATE_ACTION } = require("./const");
const { formatObject } = require("./utils");
const qs = require("qs");
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
      const { access_token, home_id } = params;
      log(JSON.stringify(params));
      let url = "";
      if (home_id != "") {
        url = API_URL + `/api/homesdata?home_id=${home_id}`;
      } else {
        url = API_URL + `/api/homesdata`;
      }
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Authorization: "Bearer " + access_token,
        },
      });
      const data = await res.json();
      log(JSON.stringify(data));
      if (data["error"]) {
        return {
          ...data,
        };
      }
      return {
        homes: data.body.homes || [],
        user: data.body.user,
        error: -1,
        status: "ok",
      };
    } catch (error) {
      log("Get netamo oauth token error: " + error);
      return {
        error: {
          code: 500,
          error: "Server error!",
        },
      };
    }
  },
  getRoomMeasure: async (params) => {
    try {
      const {
        home_id,
        room_id,
        access_token,
        scale,
        date_begin,
        date_end,
        limit,
        type,
      } = params;
      const searchParams = formatObject({
        home_id,
        room_id,
        scale,
        type,
        date_begin,
        date_end,
        limit,
      });

      const url =
        `${API_URL}/api/getroommeasure?` +
        new URLSearchParams({
          ...searchParams,
        });
      log("Netatmo getroommeasure: " + url);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Authorization: "Bearer " + access_token,
        },
      });
      const data = await res.json();
      log("Netatmo getroommeasure data: " + JSON.stringify(data));
      return data;
    } catch (error) {
      log("Netatmo getroommeasure error!: " + error);
      return {
        error: {
          code: 500,
          message: "Server error!",
        },
      };
    }
  },
  getHomeStatus: async (params) => {
    try {
      const { home_id, access_token } = params;
      const url = `${API_URL}/api/homestatus?home_id=${home_id}`;
      log("Netatmo getHomeStatus: " + url);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Authorization: "Bearer " + access_token,
        },
      });
      const data = await res.json();
      log("Netatmo getHomeStatus data: " + JSON.stringify(data));
      if (data.status == "ok" && data.body) return data;
      else
        return {
          status: "error",
          ...data,
          body: {
            home: {
              id: "",
              rooms: [],
              modules: [],
            },
          },
        };
    } catch (error) {
      log("Netatmo getHomeStatus error: " + error);
      return {
        status: "error",
        body: {
          home: {
            id: "",
            rooms: [],
            modules: [],
          },
        },
      };
    }
  },
  setState: async (params) => {
    const {
      action,
      value,
      home_id,
      module_id,
      bridge,
      access_token,
      room_id,
      modules,
    } = params;
    log("setState params: " + JSON.stringify(params));
    let body = {
      home: {
        id: home_id,
        modules: [],
      },
    };
    switch (action) {
      case SET_STATE_ACTION.turnOnLight:
        body.home.modules.push({
          id: module_id,
          on: value,
          bridge,
        });
        break;
      case SET_STATE_ACTION.changeBrightness:
        body.home.modules.push({
          id: module_id,
          brightness: value,
          bridge,
        });
        break;
      case SET_STATE_ACTION.openCurtain:
        body.home.modules.push({
          id: module_id,
          target_position: value,
          bridge,
        });
        break;
      case SET_STATE_ACTION.chageTemperatureSetpoint:
        body = {
          home: {
            id: home_id,
            rooms: [
              {
                id: room_id,
                ...value,
              },
            ],
          },
        };
        break;
      case SET_STATE_ACTION.changeFanSpeed:
        body.home.modules.push({
          id: module_id,
          bridge: bridge,
          ...value,
        });
        break;
      default:
        body.home.modules = modules;
        break;
    }
    log("setstate request body: " + JSON.stringify(body));
    try {
      const res = await fetch(API_URL + "/api/setstate", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      log("Turn on light error: " + JSON.stringify(error));
      return {
        error: error,
      };
    }
  },
  getScenario: async (params) => {
    const { home_id, access_token } = params;
    try {
      const url = `${API_URL}/api/getscenarios?home_id=${home_id}`;
      log("Netatmo getScenario: " + url);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Authorization: "Bearer " + access_token,
        },
      });
      const data = await res.json();
      log("Netatmo getScenario data: " + JSON.stringify(data));
      return data;
    } catch (error) {
      log("Netatmo getScenario error: " + error);
      return {
        error: error,
      };
    }
  },
  getMeasure: async (params) => {
    try {
      const {
        device_id,
        module_id,
        access_token,
        scale,
        date_begin,
        date_end,
        type,
      } = params;
      const searchParams = formatObject({
        module_id,
        device_id,
        scale,
        type,
        date_begin,
        date_end,
      });

      const url =
        `${API_URL}/api/getmeasure?` +
        new URLSearchParams({
          ...searchParams,
        });
      log("Netatmo getmeasure: " + url);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Authorization: "Bearer " + access_token,
        },
      });
      const data = await res.json();
      log("Netatmo getmeasure data: " + JSON.stringify(data));
      return data;
    } catch (error) {
      log("Netatmo getmeasure error!: " + error);
      return {
        error: {
          code: 500,
          message: "Server error",
        },
      };
    }
  },
  getHomeMeasure: async (params) => {
    try {
      const {
        home_id,
        modules,
        rooms,
        type,
        real_time,
        scale,
        date_begin,
        date_end,
        access_token,
      } = params;
      const searchParams = formatObject({
        home: {
          id: home_id,
          modules: modules?.map((item) => ({ ...item, type: type })) || [],
          rooms: rooms || [],
        },
        real_time: real_time || false,
        scale: scale || "5min",
        date_begin,
        date_end,
      });
      const url =
        `${API_URL}/api/gethomemeasure?` +
        qs.stringify({
          ...searchParams,
        });

      log("Netatmo gethomemeasure: " + url);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Authorization: "Bearer " + access_token,
        },
      });
      const data = await res.json();
      log("Netatmo gethomemeasure data: " + JSON.stringify(data));
      return data;
    } catch (error) {
      log("Netatmo gethomemeasure error!: " + error);
      return {
        error: {
          code: 500,
          message: "Server error!",
        },
      };
    }
  },
};
