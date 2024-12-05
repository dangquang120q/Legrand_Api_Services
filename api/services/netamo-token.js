const { log } = require("./log");
const { SET_STATE_ACTION } = require("./const");
const { formatObject, sleep } = require("./utils");
const qs = require("qs");
const API_URL = process.env.NETAMO_API;
const sqlString = require("sqlstring");

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

  checkRefreshToken: async (userId) => {
    try {
      let sql = sqlString.format(
        "Select netatmo_token_expired, netatmo_refresh_token, netatmo_client_id, netatmo_client_secret from user_account where user_id=?",
        [userId]
      );
      let grant_type = process.env.NETATMO_REFRESH_GRANT_TYPE;
      let data1 = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if (data1["rows"].length > 0) {
        let expiredIn = data1["rows"][0]["netatmo_token_expired"];
        const dateObject = new Date(parseInt(expiredIn)).getTime();
        const current = new Date(
          new Date().getTime() + process.env.NETATMO_EXPIRES_IN * 1000
        ).getTime();
        log("expired => " + dateObject);
        log("current => " + current);
        if (dateObject < current) {
          let url = API_URL + "/oauth2/token";
          const params = new URLSearchParams({
            grant_type: grant_type,
            refresh_token: decodeURIComponent(
              data1["rows"][0]["netatmo_refresh_token"]
            ),
            client_id: data1["rows"][0]["netatmo_client_id"],
            client_secret: data1["rows"][0]["netatmo_client_secret"],
          });
          log("Netatmo refresh-token params => " + params);
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: params,
          });
          const data = await res.json();
          log("Netatmo refresh-token response => " + JSON.stringify(data));
          if (data["error"]) {
            log("REFRESH TOKEN ERRROR" + JSON.stringify(data));
          } else {
            const expired_at = new Date(
              new Date().getTime() + process.env.NETATMO_EXPIRES_IN * 1000
            ).getTime();
            let update_sql = sqlString.format(
              "UPDATE user_account " +
                "SET netatmo_access_token=?, netatmo_refresh_token=?, netatmo_token_expired=? " +
                "WHERE user_id=?",
              [data["access_token"], data["refresh_token"], expired_at, userId]
            );
            log("Update Refresh Token: " + update_sql);
            let data_ = await sails
              .getDatastore(process.env.MYSQL_DATASTORE)
              .sendNativeQuery(update_sql);
            log("Update Refresh Token: " + data_["rows"]);
            return data["access_token"];
          }
        }
      }
      return "";
    } catch (error) {
      log("refreshToken netamo token error: " + error);
      return "";
    }
  },

  testRefreshToken: async (param) => {
    try {
      log("Netatmo refresh-token test => " + param);
      let { refresh_token, client_id, client_secret } = param;
      let grant_type = process.env.NETATMO_REFRESH_GRANT_TYPE;
      // let data = await sails
      //   .getDatastore(process.env.MYSQL_DATASTORE)
      //   .sendNativeQuery(sql);
      let url = API_URL + "/oauth2/token";
      const params = new URLSearchParams({
        grant_type: grant_type,
        refresh_token: refresh_token,
        client_id: client_id,
        client_secret: client_secret,
      });
      log("Netatmo refresh-token params => " + params);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: params,
      });

      const datas = await res.json();
      log("Netatmo refresh-token response => " + JSON.stringify(datas));
      if (datas["error"]) {
        log("REFRESH TOKEN ERRROR" + JSON.stringify(datas));
      } else {
        const expired_at = new Date(
          new Date().getTime() + process.env.NETATMO_EXPIRES_IN * 1000
        ).getTime();
        let update_sql = sqlString.format(
          "UPDATE user_account " +
            "SET netatmo_access_token=?, netatmo_refresh_token=?, netatmo_token_expired=? " +
            "WHERE netatmo_refresh_token=? AND netatmo_client_id=? AND netatmo_client_secret=?",
          [
            datas["access_token"],
            datas["refresh_token"],
            expired_at,
            refresh_token,
            client_id,
            client_secret,
          ]
        );
        log("Update Refresh Token: " + update_sql);
      }
    } catch (error) {
      log("refreshToken netamo token error: " + error);
    }
  },

  refreshToken: async () => {
    try {
      let sql = sqlString.format(
        "Select netatmo_refresh_token, netatmo_client_id, netatmo_client_secret from user_account where netatmo_refresh_token is not null"
      );
      let grant_type = process.env.NETATMO_REFRESH_GRANT_TYPE;
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if (data["rows"].length > 0) {
        for (var element of data["rows"]) {
          let url = API_URL + "/oauth2/token";
          const params = new URLSearchParams({
            grant_type: grant_type,
            refresh_token: decodeURIComponent(element["netatmo_refresh_token"]),
            client_id: element["netatmo_client_id"],
            client_secret: element["netatmo_client_secret"],
          });
          log("Netatmo refresh-token params => " + params);
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: params,
          });

          const data = await res.json();
          log("Netatmo refresh-token response => " + JSON.stringify(data));
          if (data["error"]) {
            log("REFRESH TOKEN ERRROR" + JSON.stringify(data));
          } else {
            const expired_at = new Date(
              new Date().getTime() + process.env.NETATMO_EXPIRES_IN * 1000
            ).getTime();
            let update_sql = sqlString.format(
              "UPDATE user_account " +
                "SET netatmo_access_token=?, netatmo_refresh_token=?, netatmo_token_expired=? " +
                "WHERE netatmo_refresh_token=? AND netatmo_client_id=? AND netatmo_client_secret=?",
              [
                data["access_token"],
                data["refresh_token"],
                expired_at,
                decodeURIComponent(element["netatmo_refresh_token"]),
                element["netatmo_client_id"],
                element["netatmo_client_secret"],
              ]
            );
            log("Update Refresh Token: " + update_sql);
            let data_ = await sails
              .getDatastore(process.env.MYSQL_DATASTORE)
              .sendNativeQuery(update_sql);
            log("Update Refresh Token: " + data_["rows"]);
          }
          await sleep(1500);
        }
      }
    } catch (error) {
      log("refreshToken netamo token error: " + error);
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
      log("setstate error: " + JSON.stringify(error));
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
  switchHomeSchedule: async (params) => {
    log("switchHomeSchedule => " + JSON.stringify(params));
    try {
      const { home_id, schedule_id, access_token } = params;
      const res = await fetch(API_URL + `/api/switchhomeschedule`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
        body: JSON.stringify({
          home_id,
          schedule_id,
        }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      log("switchHomeSchedule error: " + JSON.stringify(error));
      return {
        error: error,
      };
    }
  },
};
