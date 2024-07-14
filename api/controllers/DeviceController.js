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
        value: brightness,
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
        value: target_position,
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
};
