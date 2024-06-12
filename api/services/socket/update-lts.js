module.exports = {
  firmWareInfo: async function (request) {
    const { data } = request;

    const response = {
      result: 0,
    };
    return response;
  },

  LTSversion: async function (request) {
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
