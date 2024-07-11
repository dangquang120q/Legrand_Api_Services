/**
 * DeviceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { log } = require("grunt");
const { SET_STATE_ACTION } = require("../services/const");
const { setState } = require("../services/netamo-token");

module.exports = {
  turnOnLight: async (req, res) => {
    let access_token = req.headers["access-token"];
    let { device_id, bridge, net_home_id, on } = req.body;

    try {
      const data = await setState({
        action: SET_STATE_ACTION.turnOnLight,
        value: on,
        home_id: net_home_id,
        module_id: device_id,
        bridge: bridge,
        access_token,
      });
      log("turnOnLight data: " + data);
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
    } catch (error) {
      log("Turn on light error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
};
