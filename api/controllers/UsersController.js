/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sqlString = require('sqlstring');
const jwtoken = require('../services/jwtoken');
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
    try {
        let jwtToken = jwtoken.sign({userId: userId});
        let sql = sqlString.format("CALL sp_login(?,?,?)", [userId, password, jwtToken]);
        let data = await sails.getDatastore(process.env.MYSQL_DATASTORE).sendNativeQuery(sql);
        // response_data.userData = data["rows"][0][0];
        if (data["rows"][0].length == 0) {
            response = new HttpResponse({msg: "Wrong email or password"}, {statusCode: 400, error: true});
            return res.ok(response);
        }
        let response_data = {};
        response_data.jwt = jwtToken;
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
    try {
        let jwtToken = jwtoken.sign({userId: userId});
        let sqlCheck = sqlString.format("Select id from user_account where user_id = ?", [userId]);
        let dataCheck = await sails.getDatastore(process.env.MYSQL_DATASTORE).sendNativeQuery(sqlCheck);
        if (dataCheck["rows"].length == 0) {
            let sql = sqlString.format("CALL sp_signup(?,?,?,?,?)", [userId, name, password, email, jwtToken]);
            let data = await sails.getDatastore(process.env.MYSQL_DATASTORE).sendNativeQuery(sql);
            let response_data = {};
            response_data.jwt = jwtToken;
            // response_data.userData = data["rows"][0][0];
            response = new HttpResponse(response_data, {statusCode: 200, error: false});
            return res.ok(response);
        }
        else{
            response = new HttpResponse({msg: "Email has already in use"}, {statusCode: 405, error: true});
            return res.ok(response);
        }
    } catch (error) {
        log('Signup error => ' + error.toString());
        response = new HttpResponse(error, {statusCode: 500, error: true});
        return res.serverError(response);
    }
  },
  createRoom: async (req, res) => {
    log('CreateRoom => ' + JSON.stringify(req.body));
    let jwtToken = req.body.jwt;
    let response;
    try {
        let decodedToken = await new Promise((resolve, reject) => {
            jwtoken.verify(jwtToken, (err, decodedToken) => {
                if (err) {
                    response = new HttpResponse({msg: "Invalid Token"}, { statusCode: 401, error: true });
                    return res.ok(response);
                    reject(err);
                } else {
                    console.log("Token được xác minh thành công:", decodedToken);
                    resolve(decodedToken);
                }
            });
        });
        let response_data = {};
        
        response = new HttpResponse(response_data, { statusCode: 200, error: false });
        return res.ok(response);
    } catch (error) {
        log('CreateRoom error => ' + error.toString());
        response = new HttpResponse(error, {statusCode: 500, error: true});
        return res.serverError(response);
    }
  },
};
