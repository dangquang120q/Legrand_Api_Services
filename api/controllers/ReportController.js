/**
 * ReportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const { log } = require("../services/log");
const { HttpResponse } = require("../services/http-response");
const {
  getRoomMeasure,
  getMeasure,
  getHomeMeasure,
  checkRefreshToken,
} = require("../services/netamo-token");
const { ELECTRICITY_TYPE } = require("../services/const");

module.exports = {
  temperatureReport: async (req, res) => {
    let response;
    let access_token = req.user["access_token"];
    let { home_id, room_id, scale, date_begin, date_end, limit, type } =
      req.body;
    let userId = req.user.userId;
    try {
      // Check if access_token expired and return new access_token
      let checkAccessToken = await checkRefreshToken(userId);
      if (checkAccessToken) access_token = checkAccessToken;
      //

      const request = {
        home_id,
        room_id,
        scale: scale || "30min",
        type: type || "temperature",
        date_begin,
        date_end,
        limit,
        access_token,
      };
      log("temperatureReport: " + JSON.stringify(request));
      const data = await getRoomMeasure(request);

      if (data.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + data.error.code,
          error: true,
          errorMsg: data.error.message,
        });
        return res.send(response);
      }
      response = new HttpResponse(data["body"] || [], {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      log("Get temperatute report error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  electricityReport: async (req, res) => {
    let response;
    let access_token = req.user["access_token"];
    let { device_id, bridge, scale, date_begin, date_end, type } = req.body;
    let { userId } = req.user;
    try {
      // Check if access_token expired and return new access_token
      let checkAccessToken = await checkRefreshToken(userId);
      if (checkAccessToken) access_token = checkAccessToken;
      //
      const request = {
        module_id: device_id,
        device_id: bridge,
        scale: scale || "30min",
        type: type || "sum_energy_price",
        date_begin,
        date_end,
        access_token,
      };
      // const request = {
      //   home_id,
      //   modules: [
      //     {
      //       id: device_id,
      //       bridge,
      //     },
      //   ],
      //   scale,
      //   date_begin,
      //   date_end,
      //   access_token,
      //   type: ELECTRICITY_TYPE,
      // };
      log("electricityReport: " + JSON.stringify(request));
      const data = await getMeasure(request);
      // const data = await getHomeMeasure(request);

      if (data.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + data.error.code,
          error: true,
          errorMsg: data.error.message,
        });
        return res.send(response);
      }
      response = new HttpResponse(data["body"] || [], {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      log("Get electricity report error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  humidityReport: async (req, res) => {
    let response;
    let access_token = req.user["access_token"];
    let { home_id, room_id, scale, date_begin, date_end, limit, type } =
      req.body;
    let userId = req.user.userId;
    try {
      // Check if access_token expired and return new access_token
      let checkAccessToken = await checkRefreshToken(userId);
      if (checkAccessToken) access_token = checkAccessToken;
      //
      const request = {
        home_id,
        room_id,
        scale: scale || "30min",
        type: type || "humidity",
        date_begin,
        date_end,
        limit,
        access_token,
      };
      log("humidityReport: " + JSON.stringify(request));
      const data = await getRoomMeasure(request);

      if (data.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + data.error.code,
          error: true,
          errorMsg: data.error.message,
        });
        return res.send(response);
      }
      response = new HttpResponse(data["body"] || [], {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      log("Get humidity report error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
};
