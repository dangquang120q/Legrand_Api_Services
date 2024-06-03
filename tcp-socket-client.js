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
        dn: 1234,
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
});

client.setEncoding("utf8");

client.on("data", function (data) {
  console.log("Data from server:" + data);
});
