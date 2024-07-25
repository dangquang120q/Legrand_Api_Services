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
        device_id,
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
    } catch (error) {}
  },
};
