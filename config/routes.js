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
  "POST /user/createRoom": "UsersController.createRoom",
  "POST /user/getListRoom": "UsersController.getListRoom",
  "POST /user/getListHomeNetatmo": "UsersController.getListHomeNetatmo",
  "GET /user/getListHome": "UsersController.getListHome",
  "POST /user/installNewHome": "UsersController.installNewHome",
  "POST /user/changeNameHome": "UsersController.changeNameHome",
  "POST /user/mapHome": "UsersController.mapHome",

  "GET /user/getNetamoApi": "UsersController.getNetamoToken",
  "GET /user/getNetamoInfo": "UsersController.getNetamoInfo",
  "POST /user/upgradeSocket": "UsersController.upgradeSocket",
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
