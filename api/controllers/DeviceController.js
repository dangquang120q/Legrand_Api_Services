/**
 * DeviceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { log } = require("../services/log");
const {
  SET_STATE_ACTION,
  DEVICE_CODES,
  SET_STATE_ERRORS,
} = require("../services/const");
const {
  setState,
  getHomeStatus,
  getHomeData,
  switchHomeSchedule: switchNetatmoSchedule,
} = require("../services/netamo-token");
const { HttpResponse } = require("../services/http-response");
const jwtoken = require("../services/jwtoken");
const CryptoJS = require("crypto-js");
const { decryptAES } = require("../services/utils");
const sqlString = require("sqlstring");

module.exports = {
  turnOnLight: async (req, res) => {
    let access_token = req.user["access-token"];
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
    let access_token = req.user["access-token"];
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
    let access_token = req.user["access-token"];
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
    let access_token = req.user["access-token"];
    let { room_id, net_home_id, end_time, mode, temperature, current_mode } =
      req.body;

    let value = {
      cooling_setpoint_mode:
        current_mode == "off" && mode == "max" ? "manual" : mode,
      cooling_setpoint_temperature: +temperature,
    };
    if (end_time) {
      value["cooling_setpoint_end_time"] = +end_time;
    }
    if (mode == "max") {
      const currTime = new Date().getTime();
      let endTime = new Date(currTime + 30 * 60000).getTime();
      value["cooling_setpoint_end_time"] = Math.round(endTime / 1000);
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
      if (current_mode == "off" && mode == "max") {
        value.cooling_setpoint_mode = "max";
        const data = await setState({
          action: SET_STATE_ACTION.chageTemperatureSetpoint,
          value: value,
          home_id: net_home_id,
          room_id: room_id,
          access_token,
        });
        log("controlAirConditioner max data: " + JSON.stringify(data));
        if (data.error?.code) {
          response = new HttpResponse(null, {
            statusCode: "NET_" + data.error.code,
            error: true,
            errorMsg: data.error.message,
          });
          return res.send(response);
        }
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
    let access_token = req.user["access-token"];
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
    let userId = req.user.userId;
    let response;
    log("addScreen => " + JSON.stringify(req.body));
    log("addScreen => " + JSON.stringify(req.body));
    try {
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
    let { deviceId } = req.body;
    let response;
    let userId = req.user.userId;
    log("turnOffAlarm => " + JSON.stringify(req.body));
    try {
      let sql = sqlString.format("call sp_turn_off_alarm(?)", [deviceId]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);

      response = new HttpResponse(
        {
          msg: "Turn off alarm successful!",
          data: data["rows"][0],
        },
        {
          statusCode: 200,
          error: false,
        }
      );
      return res.ok(response);
    } catch (error) {
      log("turnOffAlarm error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  changeRoomLightOn: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    let access_token = req.user["access-token"];
    let { net_home_id, room_id, status } = req.body;

    let response;
    log("changeRoomLightOn => " + JSON.stringify(req.body));
    try {
      let homeData = await getHomeData({ access_token, home_id: net_home_id });
      if (homeData.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + homeData.error.code,
          error: true,
          errorMsg: homeData.error.message,
        });
        return res.send(response);
      }

      let roomDevices =
        homeData?.homes[0]?.modules
          ?.filter((item) => item.room_id == room_id)
          .map((item) => ({
            ...item,
          })) || [];
      let lights = roomDevices.filter((item) =>
        DEVICE_CODES.lights.includes(item.type)
      );
      let modules = lights.map((item) => {
        let module = {
          id: item.id,
          bridge: item.bridge,
        };
        if (item.type == "NLF") {
          module.brightness = status == 1 ? 100 : 0;
        } else {
          module.on = status == 1 ? true : false;
        }
        return module;
      });
      const data = await setState({
        action: "modify multi devices",
        modules,
        access_token,
        home_id: net_home_id,
      });
      log("changeRoomLightOn data: " + JSON.stringify(data));
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
          msg: "Change room lightOn successful",
          errors: data.body?.errors?.map((item) => ({
            ...item,
            msg: SET_STATE_ERRORS[item.code],
          })),
        },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("changeRoomLightOn error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  launchScenario: async (req, res) => {
    let access_token = req.user["access-token"];
    let { net_home_id, modules, scenario } = req.body;
    modules = modules || [];
    let response;
    log("launchScenario => " + JSON.stringify(req.body));
    try {
      const data = await setState({
        access_token,
        home_id: net_home_id,
        action: SET_STATE_ACTION.launchScenario,
        modules: modules.map((item) => ({
          id: item.id,
          scenario: scenario,
        })),
      });
      log("launchScenario data: " + JSON.stringify(data));
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
          msg: "Switch home schedule successful",
        },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("launchScenario error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
};
