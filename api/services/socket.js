// const { Server } = require("socket.io");
// const { login } = require("./socket/login");
// const { heartbeat } = require("./socket/heartbeat");
// const {
//   addDevice,
//   delDevice,
//   switchDevice,
//   battery,
//   alarm,
// } = require("./socket/data-report");
// const {
//   deviceList,
//   deviceListVersion,
//   cityList,
//   ntp,
//   weather,
// } = require("./socket/data-query");
// const { firmWareInfo, LTSversion } = require("./socket/update-lts");
// const { SOCKET_REQUEST } = require("./const");
// const { log } = require("./log");

// const io = new Server(9601, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });
// log("Run Socket");
// io.on("connection", (socket) => {
//   log("Socket connected", socket.id);

//   socket.onAny(async (_request, data) => {
//     const { cmdType, packetNo } = data;

//     log("Socket request || " + cmdType + ": " + JSON.stringify(data));
//     let response = {
//       cmdType: "",
//     };
//     if (cmdType) {
//       switch (cmdType) {
//         case SOCKET_REQUEST.login:
//           response = await login(data);
//           break;
//         case SOCKET_REQUEST.heartbeat:
//           response = heartbeat(data);
//           break;
//         case SOCKET_REQUEST.addDevice:
//           response = addDevice(data);
//           break;
//         case SOCKET_REQUEST.delDevice:
//           response = delDevice(data);
//           break;
//         case SOCKET_REQUEST.switch:
//           response = switchDevice(data);
//           break;
//         case SOCKET_REQUEST.battery:
//           response = battery(data);
//           break;
//         case SOCKET_REQUEST.alarm:
//           response = alarm(data);
//           break;
//         case SOCKET_REQUEST.deviceListVersion:
//           response = deviceListVersion(data);
//           break;
//         case SOCKET_REQUEST.deviceList:
//           response = deviceList(data);
//           break;
//         case SOCKET_REQUEST.cityList:
//           response = cityList(data);
//           break;
//         case SOCKET_REQUEST.weather:
//           response = weather(data);
//           break;
//         case SOCKET_REQUEST.ntp:
//           response = ntp(data);
//           break;
//         case SOCKET_REQUEST.firmwareInfo:
//           response = firmWareInfo(data);
//           break;
//         case SOCKET_REQUEST.LTSVersion:
//           response = LTSversion(data);
//           break;
//         default:
//           break;
//       }

//       response.cmdType = cmdType + "Ack";
//       response.packetNo = packetNo;
//       socket.send(response);
//     }
//   });
// });
