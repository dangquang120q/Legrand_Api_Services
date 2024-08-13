/**
 * DeviceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { log } = require("../services/log");
const { SET_STATE_ACTION } = require("../services/const");
const { setState } = require("../services/netamo-token");
const { HttpResponse } = require("../services/http-response");
const jwtoken = require("../services/jwtoken");
const CryptoJS = require("crypto-js");
const { decryptAES } = require("../services/utils");
const sqlString = require("sqlstring");

module.exports = {
  turnOnLight: async (req, res) => {
    let access_token = req.headers["access-token"];
    let { device_id, bridge, net_home_id, on } = req.body;

    try {
      const data = await setState({
        action: SET_STATE_ACTION.turnOnLight,
        value: on == "true" || on == true ? true : false,
        home_id: net_home_id,
        module_id: device_id,
        bridge: bridge,
        access_token,
      });
      log("turnOnLight data: " + JSON.stringify(data));
      if (data.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + data.error.code,
          error: true,
          errorMsg: data.error.message,
        });
        return res.send(response);
      }
      response = new HttpResponse(
        {
          msg: on
            ? "Turn on the light successful"
            : "Turn off the light successful",
        },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Turn on light error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  changeLightBrightness: async (req, res) => {
    let access_token = req.headers["access-token"];
    let { device_id, bridge, net_home_id, brightness } = req.body;

    try {
      const data = await setState({
        action: SET_STATE_ACTION.changeBrightness,
        value: +brightness,
        home_id: net_home_id,
        module_id: device_id,
        bridge: bridge,
        access_token,
      });
      log("changeLightBrightness data: " + JSON.stringify(data));
      if (data.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + data.error.code,
          error: true,
          errorMsg: data.error.message,
        });
        return res.send(response);
      }
      response = new HttpResponse(
        {
          msg: "Change brightness of the light successful",
        },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Change brightness of the light error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  openCurtain: async (req, res) => {
    let access_token = req.headers["access-token"];
    let { device_id, bridge, net_home_id, target_position } = req.body;

    try {
      const data = await setState({
        action: SET_STATE_ACTION.openCurtain,
        value: +target_position,
        home_id: net_home_id,
        module_id: device_id,
        bridge: bridge,
        access_token,
      });
      log("openCurtain data: " + JSON.stringify(data));
      if (data.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + data.error.code,
          error: true,
          errorMsg: data.error.message,
        });
        return res.send(response);
      }
      response = new HttpResponse(
        {
          msg: "Open curtain successful",
        },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Open curtain error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  controlAirConditioner: async (req, res) => {
    let access_token = req.headers["access-token"];
    let { room_id, net_home_id, end_time, mode, temperature } = req.body;

    let value = {
      cooling_setpoint_mode: mode,
      cooling_setpoint_temperature: +temperature,
    };
    if (end_time) {
      value["cooling_setpoint_end_time"] = +end_time;
    }
    log("controlAirConditioner => " + JSON.stringify(value));
    try {
      const data = await setState({
        action: SET_STATE_ACTION.chageTemperatureSetpoint,
        value: value,
        home_id: net_home_id,
        room_id: room_id,
        access_token,
      });
      log("controlAirConditioner data: " + JSON.stringify(data));
      if (data.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + data.error.code,
          error: true,
          errorMsg: data.error.message,
        });
        return res.send(response);
      }
      response = new HttpResponse(
        {
          msg: "Change air conditioner set point successfull",
        },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Change air conditioner set point error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  changeFanSpeed: async (req, res) => {
    let access_token = req.headers["access-token"];
    let { net_home_id, bridge, device_id, mode, speed, end_time } = req.body;
    try {
      let value = {
        fan_setpoint_from: "module",
        fan_mode: mode || "manual",
        fan_speed: speed,
      };
      if (end_time) {
        value.fan_end_time = end_time;
      }
      const data = await setState({
        action: SET_STATE_ACTION.changeFanSpeed,
        value: value,
        home_id: net_home_id,
        access_token,
        bridge,
        module_id: device_id,
      });
      log("changeFanSpeed data: " + JSON.stringify(data));
      if (data.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + data.error.code,
          error: true,
          errorMsg: data.error.message,
        });
        return res.send(response);
      }
      response = new HttpResponse(
        {
          msg: "Change fan speed successfull",
        },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Change fan speed error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  addScreen: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    let encrypt_text = req.body.qrcode;
    let home_id = req.body.home_id || 0;
    let response;
    log("addScreen => " + JSON.stringify(req.body));
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];

      let key = process.env.AES_SCREEN_KEY;
      log("addScreen => encrypt_text => " + encrypt_text);
      let decode_text = await decryptAES(encrypt_text);
      // Fix: Utf8 decode the decrypted data
      log("addScreen data decrypted: " + decode_text);

      // LEGRAND_SC#DN#gatewayType#deviceNum
      let data = decode_text.split("#");
      if (data[0] == "LEGRAND_SC" && data.length == 4) {
        let sql = sqlString.format("call sp_add_screen(?,?,?)", [
          userId,
          data[1],
          home_id,
        ]);
        let resData = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
        let ref = resData["rows"][0][0]["ref"];
        let newSensor = resData["rows"][1][0];
        if (ref == 1) {
          response = new HttpResponse(
            {
              msg: "Add screen success!",
              data: newSensor,
            },
            {
              statusCode: 200,
              error: false,
            }
          );
        } else {
          let errorMsg =
            ref == "-1" ? "Home does not exit" : "Sensor already exits!";
          response = new HttpResponse(null, {
            statusCode: 400,
            error: true,
            errorMsg: errorMsg,
          });
        }
        log("response => " + JSON.stringify(response));
        return res.ok(response);
      } else {
        response = new HttpResponse(null, {
          statusCode: 400,
          error: true,
          errorMsg: "Invalid data!",
        });
        return res.ok(response);
      }
    } catch (error) {
      log("addScreen error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  turnOffAlarm: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    let { lts_mac } = req.body;
    let response;
    log("turnOffAlarm => " + JSON.stringify(req.body));
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format(
        "UPDATE lts_device_detail SET alarmStatus = -1 where lts_mac = ?",
        [lts_mac]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      sql = sqlString.format(
        "SELECT * FROM lts_device_detail WHERE lts_mac = ?",
        [lts_mac]
      );
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if (data["rows"].find((item) => item.lts_mac != -1)) {
        response = new HttpResponse(null, {
          statusCode: 400,
          error: true,
          errorMsg: "Turn off alarm unsuccessful!",
        });
        return res.ok(response);
      }
      response = new HttpResponse(
        {
          msg: "Turn off alarm successful!",
          data: data["rows"],
        },
        {
          statusCode: 200,
          error: false,
        }
      );
    } catch (error) {
      log("turnOffAlarm error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
};
