const tls = require("tls");
const options = {
  host: "172.104.188.248",
  port: 9601,
  rejectUnauthorized: false
};
// var client = new net.Socket();
// client.connect({
//   port: 9601,
// });
var client = tls.connect(options, function () {
// client.on("connect", function () {
  console.log("Client: connection established with server");

  console.log("---------client details -----------------");
  var address = client.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log("Client is listening at port" + port);
  console.log("Client ip :" + ipaddr);
  console.log("Client is IP4/IP6 : " + family);

  // writing data to server
  client.write(
    JSON.stringify({
      cmdType: "login",
      packetNo: 1,
      data: {
        dn: "9E675FFEFF47B660",
        account: "quang",
        password: "1202002",
      },
    })
  );
  setTimeout(() => {
    client.write(
      JSON.stringify({
        cmdType: "heartbeat",
        packetNo: 1
      })
    );
  }, 15000);
  setTimeout(() => {
    client.write(
      JSON.stringify({
        cmdType: "addDevice",
        packetNo: 1234,
        "data": {
          "has": [{
            "nickName ": "a",
            "location": "a",
            "productKey": "a",
            "deviceDn": "a",
            "deviceId": "a"
            },
            {
              "nickName ": "b",
              "location": "b",
              "productKey": "b",
              "deviceDn": "b",
              "deviceId": "b"
            },
          ],
        }
      })
    );
  }, 17000);
  setTimeout(() => {
    client.write(
      JSON.stringify({
        cmdType: "delDevice",
        packetNo: 1234,
        "data": {
          "gatewayDn":"dnstr", 
          "deviceId":"idstr"
        }
      })
    );
  }, 18000);
  setTimeout(() => {
    client.write(
      JSON.stringify({
        cmdType: "switch",
        packetNo: 1234,
        "data": {"gatewayDn":"dnstr", "deviceId":"idstr"}
      })
    );
  }, 19000);
  setTimeout(() => {
    client.write(
      JSON.stringify({
        cmdType: "battery",
        packetNo: 1234,
        "data": {"gatewayDn":"dnstr", "deviceId":"idstr", "batteryLevel":50}
      })
    );
  }, 20000);
  setTimeout(() => {
    client.write(
      JSON.stringify({
        cmdType: "alarm",
        packetNo: 1234,
        "data": {
          "gatewayDn":"dnstr",
          "deviceId":"idstr", 
          "alarmType":1, 
          "time":"20230418 14:13:50", 
          "reportTime":"1692122750795"
        }
      })
    );
  }, 21000);
  setTimeout(() => {
    client.write(
      JSON.stringify({
        cmdType: "LTSVersion",
        packetNo: 1234,
        "data": {
          "system":"v1.0.0", 
          "gatewayDn":"dnstr", 
          "model":"693461", 
          "PCBA":"A1", 
          "appVersion":"v1.1.0", 
          "mcuVersion":"1.10"
        }
      })
    );
  }, 22000);
  setTimeout(() => {
    client.write(
      JSON.stringify({
        cmdType: "firmwareInfo",
        packetNo: 1234
      })
    );
  }, 23000);
});

client.setEncoding("utf8");

client.on("data", function (data) {
  console.log("Data from server:" + data);
});
