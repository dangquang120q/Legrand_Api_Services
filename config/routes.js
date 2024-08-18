/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  "/": { view: "pages/homepage" },
  "/upgrade-socket": { view: "pages/upgrade-socket" },
  "POST /user/login": "UsersController.login",
  "POST /user/signup": "UsersController.signup",
  "POST /user/logout": "UsersController.logout",
  "POST /user/updateProfile": "UsersController.updateProfile",
  "POST /user/changePassword": "UsersController.changePassword",
  "POST /user/createPassword": "UsersController.createPassword",
  "POST /user/shareAccount": "UsersController.shareAccount",
  "POST /user/sendMail": "UsersController.sendEmail",
  "POST /user/verifyOtp": "UsersController.verifyOTP",
  "GET /user/information": "UsersController.getUserInfo",
  "DELETE /user/deleteAccount": "UsersController.deleteAccount",

  "POST /user/addFCMToken": "UsersController.addFCMDeviceToken",
  "POST /user/updateFCMToken": "UsersController.updateFCMDeviceToken",
  "POST /user/deleteFCMToken": "UsersController.deleteFCMDeviceToken",
  "POST /user/testFCMNoti": "UsersController.testFCMNoti",

  "POST /user/createRoom": "UsersController.createRoom",
  "POST /user/getListRoom": "UsersController.getListRoom",
  "POST /user/getListHomeNetatmo": "UsersController.getListHomeNetatmo",
  "GET /user/getListHome": "UsersController.getListHome",
  "POST /user/installNewHome": "UsersController.installNewHome",
  "POST /user/changeNameHome": "UsersController.changeNameHome",
  "POST /user/mapHome": "UsersController.mapHome",

  "GET /user/getNetamoApi": "UsersController.getNetamoToken",
  "GET /user/getNetamoInfo": "UsersController.getNetamoInfo",
  "POST /user/sendRequestSocket": "UsersController.sendRequestSocket",
  "POST /user/getRoomDetail": "UsersController.getRoomDetail",
  "POST /user/removeMappingHome": "UsersController.removeMappingHome",
  "POST /user/getHomeDevices": "UsersController.getHomeDevices",
  "POST /user/getListScreen": "UsersController.getListScreen",
  "POST /user/getListSensor": "UsersController.getListSensor",
  "POST /user/getAlarmValve": "UsersController.getAlarmValve",

  "POST /device/turnOnLight": "DeviceController.turnOnLight",
  "POST /device/controlDoorlock": "DeviceController.turnOnLight",
  "POST /device/changeLightBrightness":
    "DeviceController.changeLightBrightness",
  "POST /device/openCurtain": "DeviceController.openCurtain",
  "POST /device/controlAirConditioner":
    "DeviceController.controlAirConditioner",
  "POST /device/changeFanSpeed": "DeviceController.changeFanSpeed",
  "POST /device/addScreen": "DeviceController.addScreen",
  "POST /device/turnOffAlarm": "DeviceController.turnOffAlarm",
  "POST /device/changeRoomLightOn": "DeviceController.changeRoomLightOn",
  "POST /device/switchHomeSchedule": "DeviceController.switchHomeSchedule",

  "POST /report/temperature": "ReportController.temperatureReport",
  "POST /report/electricity": "ReportController.electricityReport",
  "POST /report/humidity": "ReportController.humidityReport",

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
