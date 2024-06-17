const tls = require('tls');
var fs = require('fs');
const { log } = require("./log");
const { login } = require("./socket/login");
const { heartbeat } = require("./socket/heartbeat");
const { checkPing } = require("./socket/checkPing");
const { checkVersion } = require("./socket/checkVersion");
const { addDevice, delDevice,switchDevice, battery, alarm } = require("./socket/data-report");
const {
  deviceList,
  deviceListVersion,
  cityList,
  ntp,
  weather,
} = require("./socket/data-query");
const { firmWareInfo, LTSversion } = require("./socket/update-lts");
const { SOCKET_REQUEST } = require("./const");
const dataUtils = require('./socket/data-utils');

const options = {
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('fullchain.pem'),
  // Các tùy chọn bổ sung như passphrase, ca, crl, etc. (nếu cần)
};
// creates the server
var server = tls.createServer(options);

//emitted when server closes ...not emitted until all connections closes.
server.on("close", function () {
  console.log("Server closed !");
});
var list_account = {};
// emitted when new client connects
server.on("secureConnection", function (socket) {
  //this property shows the number of characters currently buffered to be written. (Number of characters is approximately equal to the number of bytes to be written, but the buffer may contain strings, and the strings are lazily encoded, so the exact number of bytes is not known.)
  //Users who experience large or growing bufferSize should attempt to "throttle" the data flows in their program with pause() and resume().

  console.log("Buffer size : " + socket.bufferSize);

  console.log("---------server details -----------------");

  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log("Server is listening at port" + port);
  console.log("Server ip :" + ipaddr);
  console.log("Server is IP4/IP6 : " + family);

  var lport = socket.localPort;
  var laddr = socket.localAddress;
  console.log("Server is listening at LOCAL port" + lport);
  console.log("Server LOCAL ip :" + laddr);

  console.log("------------remote client info --------------");

  var rport = socket.remotePort;
  var raddr = socket.remoteAddress;
  var rfamily = socket.remoteFamily;

  console.log("REMOTE Socket is listening at port" + rport);
  console.log("REMOTE Socket ip :" + raddr);
  console.log("REMOTE Socket is IP4/IP6 : " + rfamily);

  console.log("--------------------------------------------");
  //var no_of_connections =  server.getConnections(); // sychronous version
  server.getConnections(function (error, count) {
    console.log("Number of concurrent connections to the server : " + count);
  });

  socket.setEncoding("latin1");



  socket.on("data", async function (request) {
    log("Data sent to server : " + request);
    var { header, body, end } = dataUtils.extractData(request);
    try{
      var data = JSON.parse(body);
      const { cmdType, packetNo } = data;
      let response = {
        cmdType: "",
        packetNo: "",
      };
      if (cmdType) {
        switch (cmdType) {
          case SOCKET_REQUEST.login:
            response = await login(data);
            list_account[socket.remoteAddress] = data.data["dn"];
            setTimeout(async () => {
              let result,req = await checkVersion(list_account[socket.remoteAddress]);
              if (result == 0) {
                req.cmdType = SOCKET_REQUEST.upgrade;
                socket.write(header.concat(JSON.stringify(req)).concat(end));
              }
            }, 1000);
            break;
          case SOCKET_REQUEST.heartbeat:
            response = await heartbeat(data,list_account[socket.remoteAddress]);
            break;
          case SOCKET_REQUEST.addDevice:
            response = await addDevice(data,list_account[socket.remoteAddress]);
            break;
          case SOCKET_REQUEST.delDevice:
            response = await delDevice(data,list_account[socket.remoteAddress]);
            break;
          case SOCKET_REQUEST.switch:
            response = await switchDevice(data,list_account[socket.remoteAddress]);
            break;
          case SOCKET_REQUEST.battery:
            response = await battery(data,list_account[socket.remoteAddress]);
            break;
          case SOCKET_REQUEST.alarm:
            response = await alarm(data,list_account[socket.remoteAddress]);
            break;
          case SOCKET_REQUEST.deviceListVersion:
            response = await deviceListVersion(data,list_account[socket.remoteAddress]);
            break;
          case SOCKET_REQUEST.deviceList:
            response = await deviceList(data,list_account[socket.remoteAddress]);
            break;
          case SOCKET_REQUEST.cityList:
            response = await cityList(data,list_account[socket.remoteAddress]);
            break;
          case SOCKET_REQUEST.weather:
            response = await weather(data,list_account[socket.remoteAddress]);
            break;
          case SOCKET_REQUEST.ntp:
            response = await ntp(data,list_account[socket.remoteAddress]);
            break;
          case SOCKET_REQUEST.LTSVersion:
            response = await LTSversion(data,list_account[socket.remoteAddress]);
            break;
          case SOCKET_REQUEST.firmwareInfo:
            response = await firmWareInfo(data,list_account[socket.remoteAddress]);
            break;
          default:
            break;
        }
        response.cmdType = cmdType + "Ack";
        if (cmdType == SOCKET_REQUEST.LTSVersion) {
          response.cmdType = "deviceVersionAck";
        }
      }
      //echo data
      console.log("response-- " + header.concat(JSON.stringify(response)).concat(end));
      var is_kernel_buffer_full = socket.write(header.concat(JSON.stringify(response)).concat(end));
      setTimeout(async () => {
        let response = await checkPing(list_account[socket.remoteAddress]);
        if (response.result == -1) {
          socket.end("Timed out!");
        }
      }, 130000);
      if (is_kernel_buffer_full) {
        console.log(
          "Data was flushed successfully from kernel buffer i.e written successfully!"
        );
      } else {
        console.log(
          "Data was flushed unsuccessfully from kernel buffer i.e written unsuccessfully!"
        );
        socket.pause();
      }
    }
    catch (error) {
      log('error' + error);
  }
  });

  socket.on("drain", function () {
    console.log(
      "write buffer is empty now .. u can resume the writable stream"
    );
    socket.resume();
  });

  socket.on("error", function (error) {
    console.log("Error : " + error);
  });

  socket.on("timeout", function () {
    console.log("Socket timed out !");
    socket.end("Timed out!");
    // can call socket.destroy() here too.
  });

  socket.on("end", function (data) {
    console.log("Socket ended from other end!");
    console.log("End data : " + data);
  });

  socket.on("close", function (error) {
    var bread = socket.bytesRead;
    var bwrite = socket.bytesWritten;
    console.log("Bytes read : " + bread);
    console.log("Bytes written : " + bwrite);
    console.log("Socket closed!");
    if (error) {
      console.log("Socket was closed coz of transmission error");
    }
  });

  //   setTimeout(function () {
  //     var isdestroyed = socket.destroyed;
  //     console.log("Socket destroyed:" + isdestroyed);
  //     socket.destroy();
  //   }, 1200000);
});

// emits when any error occurs -> calls closed event immediately after this.
server.on("error", function (error) {
  console.log("Error: " + error);
});

//emits when server is bound with server.listen
server.on("listening", function () {
  console.log("Socket is listening!");
});


//static port allocation
server.listen(9601);

// for dyanmic port allocation
// server.listen(function () {
//   var address = server.address();
//   var port = address.port;
//   var family = address.family;
//   var ipaddr = address.address;
//   console.log("Server is listening at port" + port);
//   console.log("Server ip :" + ipaddr);
//   console.log("Server is IP4/IP6 : " + family);
// });

// var islistening = server.listening;

// if (islistening) {
//   console.log("Server is listening");
// } else {
//   console.log("Server is not listening");
// }

// setTimeout(function () {
//   server.close();
// }, 5000000);
