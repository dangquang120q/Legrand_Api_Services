/**
 * ReportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const { log } = require("../services/log");
const { HttpResponse } = require("../services/http-response");
const { getRoomMeasure } = require("../services/netamo-token");

module.exports = {
  temperatureReport: async (req, res) => {
    let response;
    let access_token = req.headers["access-token"];
    let { home_id, room_id, scale, date_begin, date_end, limit, type } =
      req.body;
    try {
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
};
