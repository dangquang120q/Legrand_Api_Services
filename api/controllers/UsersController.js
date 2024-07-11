/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sqlString = require("sqlstring");
const jwtoken = require("../services/jwtoken");
const CryptoJS = require("crypto-js");
const { HttpResponse } = require("../services/http-response");
const { log } = require("../services/log");
const {
  getAuthToken,
  getHomeData,
  getRoomMeasure,
  getHomeStatus,
} = require("../services/netamo-token");
const { upgradeVersion } = require("../services/net");
const { DEVICE_CODES } = require("../services/const");
// const Users = require('../models/Users');

module.exports = {
  login: async (req, res) => {
    log("Login => " + JSON.stringify(req.body));
    let userId = CryptoJS.MD5(req.body.email).toString();
    let password = req.body.password;
    let response;
    try {
      let jwtToken = jwtoken.sign({ userId: userId });
      let sql = sqlString.format("CALL sp_login(?,?,?)", [
        userId,
        password,
        jwtToken,
      ]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if (data["rows"][0].length == 0) {
        response = new HttpResponse(null, {
          statusCode: 400,
          error: true,
          errorMsg: "Wrong email or password",
        });
        return res.ok(response);
      }
      let response_data = {};
      response_data.jwt = jwtToken;
      response_data.userData = data["rows"][0][0];
      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
      });
      console.log(JSON.stringify(response));
      return res.ok(response);
    } catch (error) {
      log("Login error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  signup: async (req, res) => {
    log("Signup => " + JSON.stringify(req.body));
    let userId = CryptoJS.MD5(req.body.email).toString();
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let response;
    try {
      let jwtToken = jwtoken.sign({ userId: userId });
      let sqlCheck = sqlString.format(
        "Select id from user_account where user_id = ?",
        [userId]
      );
      let dataCheck = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlCheck);
      if (dataCheck["rows"].length == 0) {
        let sql = sqlString.format("CALL sp_signup(?,?,?,?,?)", [
          userId,
          name,
          password,
          email,
          jwtToken,
        ]);
        let data = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
        let response_data = {};
        response_data.jwt = jwtToken;
        // response_data.userData = data["rows"][0][0];
        response = new HttpResponse(response_data, {
          statusCode: 200,
          error: false,
        });
        return res.ok(response);
      } else {
        response = new HttpResponse(null, {
          statusCode: 405,
          error: true,
          errorMsg: "Email has already in use",
        });
        return res.ok(response);
      }
    } catch (error) {
      log("Signup error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  logout: async (req, res) => {
    log("Logout => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sqlUpdate = sqlString.format(
        "update user_account set login_token = ? where user_id = ?",
        ["", userId]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlUpdate);
      response = new HttpResponse(
        { msg: "Logout Successful" },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Logout error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  updateProfile: async (req, res) => {
    log("updateProfile => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let full_name = req.body.full_name;
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sqlUpdate = sqlString.format(
        "update user_account set full_name = ? where user_id = ?",
        [full_name, userId]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlUpdate);
      response = new HttpResponse(
        { msg: "Update Profile Successful." },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Logout error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  changePassword: async (req, res) => {
    log("changePassword => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let password = req.body.password;
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sqlUpdate = sqlString.format(
        "update user_account set password_comp = ? where user_id = ?",
        [password, userId]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlUpdate);
      response = new HttpResponse(
        { msg: "Change Password Successful." },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Logout error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  shareAccount: async (req, res) => {
    log("shareAccount => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let guestId = req.body.guest_id;
    let homeId = req.body.home_id;
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      log(
        "shareAccount" +
          JSON.stringify({
            guestId,
            homeId,
            userId,
          })
      );

      response = new HttpResponse(
        { msg: "Share Account Successful." },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Logout error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  // createRoom: async (req, res) => {
  //   log("CreateRoom => " + JSON.stringify(req.headers));
  //   let jwtToken = req.headers["auth-token"];
  //   let room_name = req.body.room_name;
  //   let accessToken = req.headers["access-token"];
  //   let response;
  //   try {
  //     let decodedToken = jwtoken.decode(jwtToken);
  //     let userId = decodedToken["userId"];
  //     let sql = sqlString.format("CALL sp_createRoom(?,?)", [
  //       userId,
  //       room_name,
  //     ]);
  //     let data = await sails
  //       .getDatastore(process.env.MYSQL_DATASTORE)
  //       .sendNativeQuery(sql);
  //     response = new HttpResponse(data["rows"][0], {
  //       statusCode: 200,
  //       error: false,
  //     });
  //     return res.ok(response);
  //   } catch (error) {
  //     log("CreateRoom error => " + error.toString());
  //     response = new HttpResponse(error, { statusCode: 500, error: true });
  //     return res.serverError(response);
  //   }
  // },
  // getListRoom: async (req, res) => {
  //   log("getListRoom => " + JSON.stringify(req.headers));
  //   let jwtToken = req.headers["auth-token"];
  //   let dept_id = req.body.dept_id;
  //   let response;
  //   try {
  //     let decodedToken = jwtoken.decode(jwtToken);
  //     let userId = decodedToken["userId"];
  //     let sql = sqlString.format(
  //       "Select room_id, room_name from dept_room where dept_id = ?",
  //       [dept_id]
  //     );
  //     let data = await sails
  //       .getDatastore(process.env.MYSQL_DATASTORE)
  //       .sendNativeQuery(sql);
  //     response = new HttpResponse(data["rows"], {
  //       statusCode: 200,
  //       error: false,
  //     });
  //     return res.ok(response);
  //   } catch (error) {
  //     log("getListRoom error => " + error.toString());
  //     response = new HttpResponse(error, { statusCode: 500, error: true });
  //     return res.serverError(response);
  //   }
  // },
  getListHomeNetatmo: async (req, res) => {
    log("getListHomeNetatmo => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let access_token = req.headers["access-token"];
    let home_id = req.body.net_home_id || "";
    let get_user = req.body.get_user || false;
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let response_data = {};
      let listhomes = [];
      const data = await getHomeData({
        access_token,
        home_id,
      });
      log("get home data: ", JSON.stringify(data));
      if (data.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + data.error.code,
          error: true,
          errorMsg: data.error.message,
        });
        return res.send(response);
      }
      for (let index = 0; index < data.homes?.length; index++) {
        const element = data.homes[index];
        const homeStatus = await getHomeStatus({
          home_id: element["id"],
          access_token,
        });
        let rooms = [];
        for (let id = 0; id < element["rooms"]?.length; id++) {
          const room = element["rooms"][id];
          const temperature = homeStatus.body?.home?.rooms
            ? homeStatus.body?.home?.rooms.find((item) => item.id == room.id)
            : null;

          rooms.push({
            ...room,
            temperature: temperature
              ? temperature.therm_measured_temperature
              : null,
          });
        }
        let home_data = {
          id: element["id"],
          name: element["name"],
          scenarios: [
            {
              id: "",
              name: "",
              selected: "",
              roomName: "",
            },
          ],
          waterLeakage: {
            valve: "off",
            alarm: "off",
          },
          doorLock: true,
          rooms: rooms,
        };
        listhomes.push(home_data);
      }
      response_data.homes = listhomes;
      if (get_user) {
        response_data.user = data.user;
      }

      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
        errorMsg: null,
      });
      return res.ok(response);
    } catch (error) {
      log("getListHomeNetatmo error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },

  getNetamoToken: async (req, res) => {
    const { state, code } = req.query;
    const grant_type = "authorization_code";
    const client_id = process.env.NETAMO_CLIENT_ID;
    const client_secret = process.env.NETAMO_CLIENT_SECRET;
    const scope =
      "read_station read_magellan read_smarther read_thermostat read_bubendorff read_mhs1";
    const redirect_uri = "http://172.104.188.248:9000/user/getNetamoApi";
    log("=> getNetamoToken params:" + JSON.stringify(req.query));
    let response;
    try {
      const data = await getAuthToken({
        grant_type,
        client_id,
        client_secret,
        code,
        redirect_uri,
        scope,
      });
      if (data.error != -1) {
        response = new HttpResponse(data.error, {
          statusCode: 400,
          error: true,
        });
      } else {
        response = new HttpResponse(data.data, {
          statusCode: 200,
          error: false,
        });
      }
      return res.send(response);
    } catch (error) {
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(error);
    }
  },
  getNetamoInfo: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    const clientId = process.env.NETAMO_CLIENT_ID;
    const clientSecret = process.env.NETAMO_CLIENT_SECRET;
    const scope = "read_station";
    const state = (Math.random() + 1).toString(36).substring(3);
    let response;
    try {
      const response_data = {
        clientId: clientId,
        clientSecret: clientSecret,
        scope: scope,
        state: state,
      };
      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
      });
      return res.send(response);
    } catch (error) {
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(error);
    }
  },
  installNewHome: async (req, res) => {
    log("installNewHome => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let dept_name = req.body.home_name || "";
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format("CALL sp_install_department(?,?)", [
        userId,
        dept_name,
      ]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse(
        { msg: "installNewHome Successfull" },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("installNewHome error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  changeNameHome: async (req, res) => {
    log("changeNameHome => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let home_id = req.body.home_id || "";
    let dept_name = req.body.new_home_name || "";
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format("CALL sp_changeName_department(?,?,?)", [
        userId,
        home_id,
        dept_name,
      ]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse(
        { msg: "changeNameHome Successfull" },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("changeNameHome error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  getListHome: async (req, res) => {
    log("getListHome => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format(
        "Select id,dept_id as net_home_id,dept_name as name from department where owner_id = ?",
        [userId]
      );
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse(data["rows"], {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      log("getListHome error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  mapHome: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    let dept_id = req.body.net_home_id || "";
    let home_id = req.body.home_id || "";
    let response;
    log("mapHome => " + JSON.stringify(req.headers) + JSON.stringify(req.body));
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];

      let sql = sqlString.format("CALL sp_map_home(?,?,?)", [
        userId,
        dept_id,
        +home_id,
      ]);
      const data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      const ref = data["rows"][1][0]["ref"];

      if (ref == 1) {
        response = new HttpResponse(
          { msg: "Map Home Successfull", homes: data["rows"][0] },
          { statusCode: 200, error: false }
        );
        return res.ok(response);
      } else {
        response = new HttpResponse(null, {
          statusCode: 400,
          error: true,
          errorMsg: "House has already mapped!",
        });
        return res.ok(response);
      }
    } catch (error) {
      log("mapHome error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  upgradeSocket: async (req, res) => {
    try {
      await upgradeVersion();
      let response = new HttpResponse(
        { msg: "Upgrade Successfull" },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Upgrade Socket error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  getRoomDetail: async (req, res) => {
    log("getListHomeNetatmo => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let access_token = req.headers["access-token"];
    let home_id = req.body.net_home_id || "";
    let room_id = req.body.net_room_id;
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      const homeData = await getHomeData({
        access_token,
        home_id,
      });
      if (homeData.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + homeData.error.code,
          error: true,
          errorMsg: homeData.error.message,
        });
        return res.send(response);
      }
      let homeStatus = await getHomeStatus({
        access_token,
        home_id,
      });
      if (homeStatus.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + homeData.error.code,
          error: true,
          errorMsg: homeStatus.error.message,
        });
        return res.send(response);
      }
      homeStatus = homeStatus.body.home;
      let room = {
        ...homeData?.homes[0]?.rooms?.find((item) => item.id == room_id),
        ...(homeStatus?.rooms?.find((item) => item.id == room_id) || {}),
      };
      let roomDevices =
        homeData?.homes[0]?.modules?.filter(
          (item) => item.room_id == room_id
        ) || [];
      roomDevices = roomDevices.map((item) => {
        const device = homeStatus?.modules?.find(
          (dItem) => dItem.id == item.id
        );
        return {
          ...item,
          ...device,
        };
      });

      const response_data = {
        id: room_id,
        name: room["name"],
        temperature: room["therm_measured_temperature"] || null,
        humidity: room["humidity"] || null,
        reachable: room["reachable"] || false,
        devices: {
          lights: roomDevices.filter((item) =>
            DEVICE_CODES.lights.includes(item.type)
          ),
          curtains: roomDevices.filter((item) =>
            DEVICE_CODES.rollerShutter.includes(item.type)
          ),
        },
      };
      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
        errorMsg: null,
      });
      return res.ok(response);
    } catch (error) {
      log("getRoomDevice error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  removeMappingHome: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    let home_id = req.body.net_home_id || "";
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      log("Remove Mapping Home: " + userId);
      let sqlStr;
      if (home_id) {
        sqlStr = sqlString.format("call sp_remove_mapped_home(?,?)", [
          userId,
          home_id,
        ]);
      } else {
        sqlStr = sqlString.format("call sp_remove_mapped_home(?,?)", [
          userId,
          -1,
        ]);
      }
      const data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlStr);
      response = new HttpResponse(
        { msg: "Remove Mapping Home Successfull!", homes: data["rows"][0] },
        { statusCode: 200, error: false }
      );
      log("Remove Mapping Home Success: " + JSON.stringify(data["rows"][0]));
      return res.ok(response);
    } catch (error) {
      log("Remove Mapping Home Error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  turnOnLight: async (req, res) => {
    const {} = req.body;
    try {
    } catch (error) {}
  },
};
