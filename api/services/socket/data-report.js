const sqlString = require("sqlstring");

module.exports = {
  addDevice: async function (request, lts_mac) {
    try {
      const response = {
        result: 0,
      };
      console.log("request == " + request);
      console.log("lts_mac == " + lts_mac);
      let result = 0;
      response.packetNo = request.packetNo;
      response.result = result;
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  delDevice: async function (request, lts_mac) {
    try {
      const response = {
        result: 0,
      };
      console.log("request == " + request);
      console.log("lts_mac == " + lts_mac);
      let result = 0;
      response.packetNo = request.packetNo;
      response.result = result;
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  switchDevice: async function (request, lts_mac) {
    try {
      const response = {
        result: 0,
      };
      console.log("request == " + request);
      console.log("lts_mac == " + lts_mac);
      let result = 0;
      response.packetNo = request.packetNo;
      response.result = result;
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  battery: async function (request, lts_mac) {
    try {
      const response = {
        result: 0,
      };
      console.log("request == " + request);
      console.log("lts_mac == " + lts_mac);
      let result = 0;
      response.packetNo = request.packetNo;
      response.result = result;
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  alarm: async function (request, lts_mac) {
    try {
      const response = {
        result: 0,
      };
      console.log("request == " + request);
      console.log("lts_mac == " + lts_mac);
      let result = 0;
      response.packetNo = request.packetNo;
      response.result = result;
      return response;
    } catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },
};
