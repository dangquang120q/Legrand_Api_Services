// var axios = require("axios");
// const { log } = require("./log");
// const { DATA_HOME_DEMO, DATA_LIST_HOME_DEMO } = require("./data-demo");
// const API_URL = process.env.NETAMO_API;

// module.exports = {
//   getAuthToken: async (params) => {
//     try {
//       const {
//         grant_type,
//         client_id,
//         client_secret,
//         code,
//         redirect_uri,
//         scope,
//       } = params;

//       const reqBody = {
//         grant_type: grant_type + "",
//         client_id: client_id + "",
//         client_secret: client_secret + "",
//         code: code + "",
//         redirect_uri: redirect_uri + "",
//         scope: scope + "",
//       };
//       log("Get netamo oauth token: " + JSON.stringify(reqBody));
//       const res = await fetch(API_URL + "/oauth2/token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
//         },
//         body: new URLSearchParams({
//           grant_type: grant_type + "",
//           client_id: client_id + "",
//           client_secret: client_secret + "",
//           code: code + "",
//           redirect_uri: redirect_uri + "",
//           scope: scope + "",
//         }),
//       });
//       const data = await res.json();
//       log("Netamo oauth token data: " + JSON.stringify(data));
//       return {
//         data: data,
//         error: -1,
//       };
//     } catch (error) {
//       log("Get netamo oauth token error: " + error);
//       return {
//         error: error,
//       };
//     }
//   },
//   getHomeData: async (params) => {
//     try {
//       const { access_token, home_id } = params;
//       log(JSON.stringify(params));
//       let url = "";
//       if (home_id != "") {
//         url = API_URL + `/api/homesdata?home_id=${home_id}`;
//       } else {
//         url = API_URL + `/api/homesdata`;
//       }
//       const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
//           Authorization: "Bearer " + access_token,
//         },
//       });
//       const data = await res.json();
//       log(JSON.stringify(data));
//       if (data["error"]) {
//         return {
//           ...data,
//         };
//       }
//       return {
//         homes: data.body.homes || [],
//         user: data.body.user,
//         error: -1,
//         status: "ok",
//       };
//     } catch (error) {
//       log("Get netamo oauth token error: " + error);
//       return {
//         error: {
//           code: 500,
//           error: "Server error!",
//         },
//       };
//     }
//   },
//   getRoomMeasure: async (params) => {
//     try {
//       const { home_id, room_id, access_token } = params;
//       const searchParams = {
//         scale: "30min",
//         type: "temperature",
//         date_begin: new Date(Date.now() - 86400000).getTime() / 1000,
//         date_end: new Date().getTime() / 1000,
//         limit: 1,
//       };

//       const url =
//         `${API_URL}/api/getroommeasure?` +
//         new URLSearchParams({
//           ...searchParams,
//           home_id,
//           room_id,
//         });
//       log("Netatmo getroommeasure: " + url);
//       const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
//           Authorization: "Bearer " + access_token,
//         },
//       });
//       const data = await res.json();
//       log("Netatmo getroommeasure data: " + JSON.stringify(data));
//       return data.body[0].value[0][0];
//     } catch (error) {
//       log("Netatmo getroommeasure error!: " + error);
//       return 24;
//     }
//   },
//   getHomeStatus: async (params) => {
//     try {
//       const { home_id, access_token } = params;
//       const url = `${API_URL}/api/homestatus?home_id=${home_id}`;
//       log("Netatmo getHomeStatus: " + url);
//       const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
//           Authorization: "Bearer " + access_token,
//         },
//       });
//       const data = await res.json();
//       log("Netatmo getHomeStatus data: " + JSON.stringify(data));
//       if (data.status == "ok" && data.body) return data;
//       else
//         return {
//           status: "error",
//           ...data,
//           body: {
//             home: {
//               id: "",
//               rooms: [],
//               modules: [],
//             },
//           },
//         };
//     } catch (error) {
//       log("Netatmo getHomeStatus error: " + error);
//       return {
//         status: "error",
//         body: {
//           home: {
//             id: "",
//             rooms: [],
//             modules: [],
//           },
//         },
//       };
//     }
//   },
//   turnOnTheLight: async (params) => {
//     const { on, home_id, module_id, bridge, access_token } = params;
//     try {
//       const body = {
//         home: {
//           id: home_id,
//           modules: [
//             {
//               id: module_id,
//               on: on,
//               bridge,
//             },
//           ],
//         },
//       };
//       const res = await fetch(API_URL + "/api/setstate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
//           Authorization: "Bearer " + access_token,
//         },
//         body: new URLSearchParams(body),
//       });
//       const data = await res.json();
//       return data;
//     } catch (error) {
//       log("Turn on light error: " + JSON.stringify(error));
//       return {
//         error: error,
//       };
//     }
//   },
// };
