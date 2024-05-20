/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sqlString = require('sqlstring');
// const jwtoken = require('../services/jwtoken');
const CryptoJS = require('crypto-js');
const {HttpResponse} = require('../services/http-response');
const {log} = require('../services/log');
// const Users = require('../models/Users');

module.exports = {
  login: async(req, res) => {
    log('Login => ' + JSON.stringify(req.body));
    let userId = CryptoJS.MD5(req.body.email).toString();
    let password = req.body.password;
    let response;
    // let newUser = sync(__dirname + '/json_data/newUser.json');
    try {
        // let currentTime = Date.now();
        // let expiredIn = currentTime + 2 * 60 * 1000;
        // let loginToken = CryptoJS.MD5(currentTime) + "|" +  expiredIn;
        let sql = sqlString.format("CALL sp_login(?,?)", [userId, password]);
        let data = await sails.getDatastore(process.env.MYSQL_DATASTORE).sendNativeQuery(sql);
        // let jwtToken = jwtoken.sign({userId: data["rows"][0][0].userId});
        let response_data = {};
        // response_data.jwt = jwtToken;
        response_data.userData = data["rows"][0][0];
        if (data["rows"][0].length == 0) {
            response = new HttpResponse({msg: "Wrong email or password"}, {statusCode: 400, error: true});
            return res.ok(response);
        }
        response = new HttpResponse(response_data, {statusCode: 200, error: false});
        return res.ok(response);
    } catch (error) {
        log('Login error => ' + error.toString());
        response = new HttpResponse(error, {statusCode: 500, error: true});
        return res.serverError(response);
    }
  },
  signup: async(req, res) => {
    log('Signup => ' + JSON.stringify(req.body));
    let userId = CryptoJS.MD5(req.body.email).toString();
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let response;
    // let newUser = sync(__dirname + '/json_data/newUser.json');
    try {
        // let currentTime = Date.now();
        // let expiredIn = currentTime + 2 * 60 * 1000;
        // let loginToken = CryptoJS.MD5(currentTime) + "|" +  expiredIn;
        let sql = sqlString.format("CALL sp_signup(?,?,?,?)", [userId, name, password, email]);
        let data = await sails.getDatastore(process.env.MYSQL_DATASTORE).sendNativeQuery(sql);
        // let jwtToken = jwtoken.sign({userId: data["rows"][0][0].userId});
        let response_data = {};
        // response_data.jwt = jwtToken;
        response_data.userData = data["rows"][0][0];
        response = new HttpResponse(response_data, {statusCode: 200, error: false});
        return res.ok(response);
    } catch (error) {
        log('Signup error => ' + error.toString());
        response = new HttpResponse(error, {statusCode: 500, error: true});
        return res.serverError(response);
    }
  },
  normalSignup: async(req, res) => {

  },
};
