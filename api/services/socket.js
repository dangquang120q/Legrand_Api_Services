const { Server } = require("socket.io");
const sqlString = require('sqlstring');

const io = new Server(9601, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
console.log("Run Socket");
io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
  socket.onAny( async (request, data) => {
    console.log(request, data);
    const { cmdType, packageNo } = data;
    console.log("Socket request || ", cmdType, ": ", data);
    let response = {
      cmdType: "",
    };
    switch (cmdType) {
      case "login":
        let result = 1;
        let sqlCheck = sqlString.format("Select id from lts_device_control where lts_mac = ?", [data["dn"]]);
        let dataCheck = await sails.getDatastore(process.env.MYSQL_DATASTORE).sendNativeQuery(sqlCheck);
        if (dataCheck["rows"].length == 0) {
          result = 0;
        }
        response.cmdType = "loginAck";
        response.packageNo = packageNo;
        response.result = result;
        break;
      case "heartbeat":
        response.cmdType = "heartbeatAck";
        break;
      default:
        break;
    }
    socket.send(response);
  });
});
