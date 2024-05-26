module.exports = {
  SOCKET_ERROR: {
    "00001": "The IoT device does not exist",
    "00002": "The IoT device already exists, and it is added repeatedly",
    "00003": "Repeat instructions",
    "00004": "Invalid Instructions",
    "00005": "There are no permissions",
    "00006": "Format error",
    "00007": "Illegal parameters",
    "00008": "There are too many request parameters",
  },

  SOCKET_RESULT: {
    SUCCESS: 0,
    FAIL: 1,
  },

  SOCKET_REQUEST: {
    login: "login",
    heartbeat: "heartbeat",
    addDevice: "addDevice",
    delDevice: "delDevice",
    switch: "switch",
    battery: "battery",
    alarm: "alarm",
    deviceListVersion: "deviceListVersion",
    deviceList: "deviceList",
    cityList: "cityList",
    weather: "weather",
    ntp: "ntp",
    light: "light",
    deviceLocation: "deviceLocation",
    deviceName: "deviceName",
    LTSVersion: "LTSVersion",
    upgrade: "upgrade",
    firmwareInfo: "firmwareInfo",
  },
};
