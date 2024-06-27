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

  '*': true,
  UsersController: {
    login: true,
    signup: true,
    logout: "checkJwtoken",
    getListRoom: "checkJwtoken",
    createRoom: "checkJwtoken",
    getListHomeNetatmo: "checkJwtoken",
    getListHome: "checkJwtoken",
    updateProfile: "checkJwtoken",
    installNewHome: "checkJwtoken",
    changeNameHome: "checkJwtoken",
    getNetamoInfo: "checkJwtoken"
  },

};
