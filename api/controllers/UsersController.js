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
const { getAuthToken } = require("../services/netamo-token");
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
  createRoom: async (req, res) => {
    log("CreateRoom => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let room_name = req.body.room_name;
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format("CALL sp_createRoom(?,?)", [
        userId,
        room_name,
      ]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse(data["rows"][0], {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      log("CreateRoom error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
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
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format(
        "Select dept_id,dept_name,owner_id as user_id,dept_address as address from department where owner_id = ?",
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
      log("getListDepartment error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },

  getNetamoToken: async (req, res) => {
    const { state, code } = req.params;
    const grant_type = "authorization_code";
    const client_id = "665febbf67d9b37028016359";
    const client_secret = "ZsvFbr0gnnsBOP8bQ5yOOJKstWvphSZKHIpY0OHbO4q";
    const scope = "read_station";
    const redirect_uri = "";
    try {
      const data = await getAuthToken({
        grant_type,
        client_id,
        client_secret,
        code,
        redirect_uri,
        scope,
      });
      return res.send(data);
    } catch (error) {
      return res.serverError(error);
    }
  },
};
