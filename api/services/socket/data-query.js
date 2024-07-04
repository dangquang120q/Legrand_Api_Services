module.exports = {
  deviceListVersion: async (request,lts_mac) => {
    const { data } = request;
    console.log(JSON.stringify(request));

    const response = {
      result: 0,
    };
    response.packetNo = request.packetNo;
    return response;
  },

  deviceList: async (request,lts_mac) => {
    const { data } = request;

    const response = {
      result: 0,
    };
    response.packetNo = request.packetNo;
    return response;
  },

  cityList: async (request,lts_mac) => {
    const { data } = request;

    const response = {
      result: 0,
    };
    response.packetNo = request.packetNo;
    return response;
  },

  weather: async (request,lts_mac) => {
    const { data } = request;

    const response = {
      result: 0,
    };
    response.packetNo = request.packetNo;
    return response;
  },

  ntp: async (request,lts_mac) => {
    const { data } = request;

    const response = {
      result: 0,
    };
    response.packetNo = request.packetNo;
    return response;
  },
};
