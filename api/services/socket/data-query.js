module.exports = {
  deviceListVersion: async function (request) {
    const { data } = request;

    const response = {
      result: 0,
    };
    response.packetNo = request.packetNo;
    return response;
  },

  deviceList: async function (request) {
    const { data } = request;

    const response = {
      result: 0,
    };
    response.packetNo = request.packetNo;
    return response;
  },

  cityList: async function (request) {
    const { data } = request;

    const response = {
      result: 0,
    };
    response.packetNo = request.packetNo;
    return response;
  },

  weather: async function (request) {
    const { data } = request;

    const response = {
      result: 0,
    };
    response.packetNo = request.packetNo;
    return response;
  },

  ntp: async function (request) {
    const { data } = request;

    const response = {
      result: 0,
    };
    response.packetNo = request.packetNo;
    return response;
  },
};
