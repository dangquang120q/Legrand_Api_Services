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
const { getAuthToken, getHomeData } = require("../services/netamo-token");
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
        response = new HttpResponse(
          { msg: "Wrong email or password" },
          { statusCode: 400, error: true }
        );
        return res.ok(response);
      }
      let response_data = {};
      response_data.jwt = jwtToken;
      response_data.userData = data["rows"][0][0];
      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
      });
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
        response = new HttpResponse(
          { msg: "Email has already in use" },
          { statusCode: 405, error: true }
        );
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
        { msg: "updateProfile Successful" },
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
  getListRoom: async (req, res) => {
    log("getListRoom => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let dept_id = req.body.dept_id;
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format(
        "Select room_id, room_name from dept_room where dept_id = ?",
        [dept_id]
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
      log("getListRoom error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  getListDepartment: async (req, res) => {
    log("getListDepartment => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let access_token = req.headers["access-token"];
    let home_id = req.body.home_id || "";
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let response_data = [];
      const data = await getHomeData({
        access_token,
        home_id
      });
      for (let index = 0; index < data.homes.length; index++) {
        const element = data.homes[index];
        let sql = sqlString.format(
          "Select dept_name from department where dept_id = ?",
          [element["id"]]
        );
        let data = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
        let home_data = {
          "id": element["id"],
          "name": data["rows"][0]["dept_name"],
          "scenarios": [
            {
              "id": "",
              "name": "",
              "selected": "",
              "roomName": "",
            },
          ],
          "waterLeakage": {
            value: "off",
            alarm: "off",
          },
          "doorLock": true,
          "rooms": element["rooms"]
        }
        response_data.push(home_data);
      }
      if (data.error != -1) {
        response = new HttpResponse(data.error, {
          statusCode: 400,
          error: true,
        });
      }
      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      log("getListDepartment error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },

  getNetamoToken: async (req, res) => {
    const { state, code } = req.query;
    const grant_type = "authorization_code";
    const client_id = process.env.NETAMO_CLIENT_ID;
    const client_secret = process.env.NETAMO_CLIENT_SECRET;
    const scope = "read_station";
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
    const clientId = process.env.NETAMO_CLIENT_ID;
    const clientSecret = process.env.NETAMO_CLIENT_SECRET;
    const scope = "read_station";
    const state = (Math.random() + 1).toString(36).substring(3);
    let response;
    try {
      const response_data = {
        "clientId" : clientId,
        "clientSecret" : clientSecret,
        "scope" : scope,
        "state" : state
      }
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
  installNewDepartment: async (req, res) => {
    log("installNewDepartment => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let dept_id = req.body.home_id || "";
    let dept_name = req.body.home_name || "";
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format(
        "CALL sp_install_department(?,?,?)", [
          userId,
          dept_id,
          dept_name
        ]
      );
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse(
        { msg:"installNewDepartment Successfull"}, 
        { statusCode: 200, error: false,
      });
      return res.ok(response);
    } catch (error) {
      log("installNewDepartment error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  changeNameDepartment: async (req, res) => {
    log("changeNameDepartment => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let dept_id = req.body.home_id || "";
    let dept_name = req.body.new_home_name || "";
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format(
        "CALL sp_changeName_department(?,?,?)", [
          userId,
          dept_id,
          dept_name
        ]
      );
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse(
        { msg:"changeNameDepartment Successfull"}, 
        { statusCode: 200, error: false,
      });
      return res.ok(response);
    } catch (error) {
      log("changeNameDepartment error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
};
