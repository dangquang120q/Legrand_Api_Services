const { Server } = require("socket.io");

const io = new Server(9601, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
console.log("Run Socket");
io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
  socket.on("request", (data) => {
    const { cmdType } = data;
    console.log("Socket request || ", cmdType, ": ", data);
    let response = {
      cmdType: "",
    };
    switch (cmdType) {
      case "login":
        response.cmdType = "loginAck";
        response.result = 0;
        break;
      case "heartbeat":
        response.cmdType = "heartbeatAck";
        break;
      default:
        break;
    }

    socket.emit("response", response);
  });
});
