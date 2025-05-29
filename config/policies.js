/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  "*": true,
  UsersController: {
    login: true,
    signup: true,
    logout: ["isSystemEnabled", "checkJwtoken"],
    getListRoom: ["isSystemEnabled", "checkJwtoken"],
    createRoom: ["isSystemEnabled", "checkJwtoken"],
    getListHomeNetatmo: ["isSystemEnabled", "checkJwtoken"],
    getListHome: ["isSystemEnabled", "checkJwtoken"],
    updateProfile: ["isSystemEnabled", "checkJwtoken"],
    installNewHome: ["isSystemEnabled", "checkJwtoken"],
    changeNameHome: ["isSystemEnabled", "checkJwtoken"],
    mapHome: ["isSystemEnabled", "checkJwtoken"],
    getRoomDetail: ["isSystemEnabled", "checkJwtoken"],
    removeMappedHome: ["isSystemEnabled", "checkJwtoken"],
    changePassword: ["isSystemEnabled", "checkJwtoken"],
    shareAccount: ["isSystemEnabled", "checkJwtoken"],
    getUserInfo: ["isSystemEnabled", "checkJwtoken"],
    deleteAccount: ["isSystemEnabled", "checkJwtoken"],
    getHomeDevices: ["isSystemEnabled", "checkJwtoken"],
    getListScreen: ["isSystemEnabled", "checkJwtoken"],
    getListSensor: ["isSystemEnabled", "checkJwtoken"],
    getAlarmValve: ["isSystemEnabled", "checkJwtoken"],
  },
  DeviceController: {
    turnOnLight: ["isSystemEnabled", "checkJwtoken"],
    changeLightBrightness: ["isSystemEnabled", "checkJwtoken"],
    openCurtain: ["isSystemEnabled", "checkJwtoken"],
    controlAirConditioner: ["isSystemEnabled", "checkJwtoken"],
    changeFanSpeed: ["isSystemEnabled", "checkJwtoken"],
    addScreen: ["isSystemEnabled", "checkJwtoken"],
    turnOffAlarm: ["isSystemEnabled", "checkJwtoken"],
    changeRoomLightOn: ["isSystemEnabled", "checkJwtoken"],
    launchScenario: ["isSystemEnabled", "checkJwtoken"],
  },
  ReportController: {
    temperatureReport: ["isSystemEnabled", "checkJwtoken"],
    electricityReport: ["isSystemEnabled", "checkJwtoken"],
    humidityReport: ["isSystemEnabled", "checkJwtoken"],
  },
};
