module.exports = {
  firmWareInfo: async function (request) {
    const { data } = request;

    const response = {
      result: 0,
    };
    return response;
  },

  LTSversion: async function (request,lts_mac) {
    try {
      const response = {
        result: 0,
      };
      console.log("request == " + JSON.stringify(request));
      console.log("lts_mac == " + lts_mac);
      let result = 0;
      response.packetNo = request.packetNo;
      response.result = result;
      return response;
    } 
    catch {
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },
};
