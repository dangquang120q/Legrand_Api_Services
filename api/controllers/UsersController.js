/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sqlString = require("sqlstring");
const jwtoken = require("../services/jwtoken");
const CryptoJS = require("crypto-js");
const { HttpResponse } = require("../services/http-response");
const { log } = require("../services/log");
const {
  getAuthToken,
  getHomeData,
  getRoomMeasure,
  getHomeStatus,
  getScenario,
} = require("../services/netamo-token");
const {
  upgradeVersion,
  controlLight,
  modLocation,
  modName,
  changePassword,
  deviceMode,
} = require("../services/net");
const {
  DEVICE_CODES,
  SOCKET_REQUEST,
  SCENARIO_TYPE,
} = require("../services/const");
const sendMailjet = require("../services/mailjet-util");
const transporter = require("../services/mailtrap-utils");
// const notificationQueue = require("../services/firebase-queue");

module.exports = {
  testFCMNoti: async (req, res) => {
    try {
      log("testFCMNoti test => " + JSON.stringify(req.body));
      let { userId } = req.body;
      let sql = sqlString.format(
        "SELECT device_token FROM firebase_token WHERE user_id = ?",
        [userId]
      );
      const data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);

      // Chuyển đổi kết quả truy vấn thành mảng các token
      const registrationTokens = data.rows.map((device) => device.device_token);

      const message = {
        title: "Thông báo",
        body: "Nội dung thông báo",
      };

      // Chia thành các batch nhỏ để tránh quá tải
      const batchSize = 500;
      for (let i = 0; i < registrationTokens.length; i += batchSize) {
        const batchTokens = registrationTokens.slice(i, i + batchSize);

        // Thêm công việc vào hàng đợi
        // notificationQueue.add({
        //   registrationTokens: batchTokens,
        //   message: message,
        // });
      }

      return res.ok("Notification jobs added to the queue.");
    } catch (error) {
      console.error("Error querying device tokens:", error);
      return res.serverError("Failed to add notification jobs to the queue.");
    }
  },
  addFCMDeviceToken: async (req, res) => {
    log("addFCMDeviceToken test => " + JSON.stringify(req.body));
    let jwtToken = req.headers["auth-token"];
    let response;
    let decodedToken = jwtoken.decode(jwtToken);
    let userId = decodedToken["userId"];
    let { deviceToken } = req.body;
    try {
      let insertSql = sqlString.format(
        "insert into firebase_token(user_id, device_token) values (?, ?)",
        [userId, deviceToken]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(insertSql);
      response = new HttpResponse(
        {
          msg: "insert token successfully",
        },
        {
          statusCode: 200,
          error: false,
        }
      );
      return res.ok(response);
    } catch (error) {
      sails.log.error("Error add firebase device token:", error);
      // throw error;
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  updateFCMDeviceToken: async (req, res) => {
    log("updateFCMDeviceToken test => " + JSON.stringify(req.body));
    let jwtToken = req.headers["auth-token"];
    let response;
    let decodedToken = jwtoken.decode(jwtToken);
    let userId = decodedToken["userId"];
    let { oldDeviceToken, newDeviceToken } = req.body;
    try {
      let selectDeviceToken = sqlString.format(
        "select user_id from firebase_token where user_id=? and device_token = ?",
        [userId, oldDeviceToken]
      );
      let tokenData = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(selectDeviceToken);

      if (tokenData["rows"].length == 0) {
        let insertSql = sqlString.format(
          "insert into firebase_token(user_id, device_token) values (?, ?)",
          [userId, newDeviceToken]
        );
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(insertSql);
        response = new HttpResponse(
          {
            msg: "update token successfully",
          },
          {
            statusCode: 200,
            error: false,
          }
        );
      } else {
        let updateSql = sqlString.format(
          "update firebase_token set device_token = ? where user_id=? and device_token = ?",
          [newDeviceToken, userId, oldDeviceToken]
        );
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(updateSql);
        response = new HttpResponse(
          {
            msg: "update token successfully",
          },
          {
            statusCode: 200,
            error: false,
          }
        );
      }
      return res.ok(response);
    } catch (error) {
      sails.log.error("Error update firebase device token:", error);
      // throw error;
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  deleteFCMDeviceToken: async (req, res) => {
    log("deleteFCMDeviceToken test => " + JSON.stringify(req.body));
    let response;
    let decodedToken = jwtoken.decode(jwtToken);
    let userId = decodedToken["userId"];
    let { deviceToken } = req.body;
    try {
      if (deviceToken == "abcxyz") {
        // Delete all
        let deleteSql = sqlString.format(
          "delete firebase_token where user_id=?",
          [userId]
        );
        await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(deleteSql);
        response = new HttpResponse(
          {
            msg: "delete all token successfully",
          },
          {
            statusCode: 200,
            error: false,
          }
        );
      } else {
        // Delete one
        let selectDeviceToken = sqlString.format(
          "select user_id from firebase_token where user_id=? and device_token = ?",
          [userId, deviceToken]
        );
        let tokenData = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(selectDeviceToken);

        if (tokenData["rows"].length == 0) {
          response = new HttpResponse(
            {
              msg: "No device token",
            },
            {
              statusCode: 200,
              error: false,
            }
          );
        } else {
          let deleteSql = sqlString.format(
            "delete firebase_token where user_id=? and device_token = ?",
            [userId, deviceToken]
          );
          await sails
            .getDatastore(process.env.MYSQL_DATASTORE)
            .sendNativeQuery(deleteSql);
          response = new HttpResponse(
            {
              msg: "delete token successfully",
            },
            {
              statusCode: 200,
              error: false,
            }
          );
        }
      }

      return res.ok(response);
    } catch (error) {
      sails.log.error("Error delete firebase device token:", error);
      // throw error;
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  sendEmail: async (req, res) => {
    log("SendMail test => " + JSON.stringify(req.body));
    let { email, text } = req.body;

    let response;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
      if (emailRegex.test(email)) {
        let sqlEmail = sqlString.format(
          "SELECT user_id, id FROM user_account WHERE email = ?",
          [email]
        );
        const findUser = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sqlEmail);
        if (findUser["rows"].length == 0) {
          response = new HttpResponse(null, {
            statusCode: 400,
            error: true,
            errorMsg: "Email is not registered",
          });
          return res.ok(response);
        }
        const otp = await sendMailjet.generateOTP();
        const userId = findUser["rows"][0]["user_id"];
        if (otp != "" && userId) {
          const mailResponse = await sendMailjet.sendOTPEmail(email, text, otp);
          const expired_at = new Date(
            new Date().getTime() + process.env.OTP_EXPIRED_TIME * 1000
          ).getTime();
          let sql = sqlString.format(
            "UPDATE user_account SET pass_otp = ?, otp_expired_at = ? WHERE user_id = ?",
            [otp, expired_at + "", userId]
          );
          await sails
            .getDatastore(process.env.MYSQL_DATASTORE)
            .sendNativeQuery(sql);

          response = new HttpResponse(
            {
              mailResponse,
              userId: userId,
            },
            {
              statusCode: 200,
              error: false,
            }
          );
        } else {
          response = new HttpResponse(null, {
            statusCode: 400,
            error: true,
            errorMsg: "Email sent failed!",
          });
        }
      } else {
        response = new HttpResponse(null, {
          statusCode: 400,
          error: true,
          errorMsg: "Invalid email",
        });
      }
      return res.ok(response);
      // return res.json({ message: 'Email sent successfully!', mailResponse });
    } catch (error) {
      sails.log.error("Error sending email:", error);
      // throw error;
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  verifyOTP: async (req, res) => {
    log("verifyOtp => " + JSON.stringify(req.body));
    let { otp, userId } = req.body;

    let response;
    try {
      let sql = sqlString.format(
        "SELECT pass_otp, otp_expired_at FROM user_account WHERE user_id = ?",
        [userId]
      );
      const data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      const value = data["rows"].length > 0 ? data["rows"][0] : undefined;
      if (value && value["pass_otp"] == otp) {
        let expired_at = +value["otp_expired_at"];
        if (expired_at > new Date().getTime()) {
          let sqlUpdate = sqlString.format(
            "UPDATE user_account SET pass_otp = NULL, otp_expired_at = NULL WHERE user_id = ?",
            [userId]
          );
          await sails
            .getDatastore(process.env.MYSQL_DATASTORE)
            .sendNativeQuery(sqlUpdate);
          response = new HttpResponse(
            {
              msg: "OTP verification successful",
            },
            {
              statusCode: 200,
              error: false,
            }
          );
        } else {
          response = new HttpResponse(null, {
            statusCode: 400,
            error: true,
            errorMsg: "OTP is expired!",
          });
        }
      } else {
        response = new HttpResponse(null, {
          statusCode: 403,
          error: true,
          errorMsg: "Invalid OTP!",
        });
      }
      return res.ok(response);
    } catch (error) {
      sails.log.error("Error verify otp:", error);
      // throw error;
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  sendEmailTrap: async (req, res) => {
    log("SendMailTrap test => " + JSON.stringify(req.body));
    try {
      try {
        const mailOptions = {
          from: "kiennt.k54@gmail.com",
          to: "mrneo1991@gmail.com",
          subject: "Your OTP Code",
          text: `Your OTP code is: 1234`,
          html: `<p>Your OTP code is: <b>1234</b></p>`,
        };

        var mailResponse = await transporter.sendMail(mailOptions);
        log("OTP email sent successfully.");
      } catch (error) {
        log("Error sending OTP email:" + error);
      }
      return res.json({ message: "Email sent successfully!", mailResponse });
    } catch (error) {
      sails.log.error("Error sending email:", error);
      throw error;
    }
  },
  login: async (req, res) => {
    log("Login => " + JSON.stringify(req.body));
    let userId = CryptoJS.MD5(req.body.email).toString();
    let password = req.body.password;
    let response;
    try {
      let jwtToken = jwtoken.sign({ userId: userId });
      let sql = sqlString.format("CALL sp_login(?,?,?)", [
        userId,
        password,
        jwtToken,
      ]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if (data["rows"][0].length == 0) {
        response = new HttpResponse(null, {
          statusCode: 400,
          error: true,
          errorMsg: "Wrong email or password",
        });
        return res.ok(response);
      }
      let response_data = {};
      response_data.jwt = jwtToken;
      response_data.userData = data["rows"][0][0];
      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
      });
      console.log(JSON.stringify(response));
      return res.ok(response);
    } catch (error) {
      log("Login error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  signup: async (req, res) => {
    log("Signup => " + JSON.stringify(req.body));
    let userId = CryptoJS.MD5(req.body.email).toString();
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let response;
    try {
      let jwtToken = jwtoken.sign({ userId: userId });
      let sqlCheck = sqlString.format(
        "Select id from user_account where user_id = ?",
        [userId]
      );
      let dataCheck = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlCheck);
      if (dataCheck["rows"].length == 0) {
        let sql = sqlString.format("CALL sp_signup(?,?,?,?,?)", [
          userId,
          name,
          password,
          email,
          jwtToken,
        ]);
        let data = await sails
          .getDatastore(process.env.MYSQL_DATASTORE)
          .sendNativeQuery(sql);
        let response_data = {};
        response_data.jwt = jwtToken;
        // response_data.userData = data["rows"][0][0];
        response = new HttpResponse(response_data, {
          statusCode: 200,
          error: false,
        });
        return res.ok(response);
      } else {
        response = new HttpResponse(null, {
          statusCode: 405,
          error: true,
          errorMsg: "Email has already in use",
        });
        return res.ok(response);
      }
    } catch (error) {
      log("Signup error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  logout: async (req, res) => {
    log("Logout => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sqlUpdate = sqlString.format(
        "update user_account set login_token = ? where user_id = ?",
        ["", userId]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlUpdate);
      response = new HttpResponse(
        { msg: "Logout Successful" },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Logout error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  updateProfile: async (req, res) => {
    log("updateProfile => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let full_name = req.body.full_name;
    let avatar = req.body.avatar;
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sqlUpdate = sqlString.format(
        "update user_account set full_name = ?, avatar = ? where user_id = ?",
        [full_name, avatar, userId]
      );
      if (!full_name && !avatar) {
        response = new HttpResponse(null, {
          statusCode: 400,
          error: true,
          errorMsg: "Invalid data.",
        });
        return res.ok(response);
      }
      if (!full_name) {
        sqlUpdate = sqlString.format(
          "update user_account set avatar = ? where user_id = ?",
          [avatar, userId]
        );
      }
      if (!avatar) {
        sqlUpdate = sqlString.format(
          "update user_account set full_name = ? where user_id = ?",
          [full_name, userId]
        );
      }

      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlUpdate);
      response = new HttpResponse(
        { msg: "Update Profile Successful." },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Logout error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  changePassword: async (req, res) => {
    log("changePassword => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let current_password = req.body.current_password;
    let new_password = req.body.new_password;
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sqlUpdate = sqlString.format("call sp_change_password(?,?,?)", [
        userId,
        new_password,
        current_password,
      ]);
      const data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlUpdate);
      const ref = data["rows"][0][0]["ref"];
      if (ref == 1) {
        response = new HttpResponse(
          { msg: "Change Password Successful." },
          { statusCode: 200, error: false }
        );
      } else if (ref == -1) {
        response = new HttpResponse(null, {
          statusCode: 400,
          error: true,
          errorMsg: "Incorrect Current Password.",
        });
      } else {
        response = new HttpResponse(null, {
          statusCode: 400,
          error: true,
          errorMsg: "Change Password Failed.",
        });
      }
      return res.ok(response);
    } catch (error) {
      log("Change password error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  createPassword: async (req, res) => {
    log("createPassword => " + JSON.stringify(req.body));
    let response;
    const { password, userId } = req.body;
    try {
      let sqlUpdate = sqlString.format(
        "UPDATE user_account SET password_comp = ? WHERE user_id = ?",
        [password, userId]
      );
      await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlUpdate);
      response = new HttpResponse(
        { msg: "Create Password Successful." },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Logout error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  shareAccount: async (req, res) => {
    log("shareAccount => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let guestId = req.body.guest_id;
    let homeId = req.body.home_id;
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      log(
        "shareAccount" +
          JSON.stringify({
            guestId,
            homeId,
            userId,
          })
      );

      response = new HttpResponse(
        { msg: "Share Account Successful." },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("Logout error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  // createRoom: async (req, res) => {
  //   log("CreateRoom => " + JSON.stringify(req.headers));
  //   let jwtToken = req.headers["auth-token"];
  //   let room_name = req.body.room_name;
  //   let accessToken = req.headers["access-token"];
  //   let response;
  //   try {
  //     let decodedToken = jwtoken.decode(jwtToken);
  //     let userId = decodedToken["userId"];
  //     let sql = sqlString.format("CALL sp_createRoom(?,?)", [
  //       userId,
  //       room_name,
  //     ]);
  //     let data = await sails
  //       .getDatastore(process.env.MYSQL_DATASTORE)
  //       .sendNativeQuery(sql);
  //     response = new HttpResponse(data["rows"][0], {
  //       statusCode: 200,
  //       error: false,
  //     });
  //     return res.ok(response);
  //   } catch (error) {
  //     log("CreateRoom error => " + error.toString());
  //     response = new HttpResponse(error, { statusCode: 500, error: true });
  //     return res.serverError(response);
  //   }
  // },
  // getListRoom: async (req, res) => {
  //   log("getListRoom => " + JSON.stringify(req.headers));
  //   let jwtToken = req.headers["auth-token"];
  //   let dept_id = req.body.dept_id;
  //   let response;
  //   try {
  //     let decodedToken = jwtoken.decode(jwtToken);
  //     let userId = decodedToken["userId"];
  //     let sql = sqlString.format(
  //       "Select room_id, room_name from dept_room where dept_id = ?",
  //       [dept_id]
  //     );
  //     let data = await sails
  //       .getDatastore(process.env.MYSQL_DATASTORE)
  //       .sendNativeQuery(sql);
  //     response = new HttpResponse(data["rows"], {
  //       statusCode: 200,
  //       error: false,
  //     });
  //     return res.ok(response);
  //   } catch (error) {
  //     log("getListRoom error => " + error.toString());
  //     response = new HttpResponse(error, { statusCode: 500, error: true });
  //     return res.serverError(response);
  //   }
  // },
  getListHomeNetatmo: async (req, res) => {
    log("getListHomeNetatmo => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let access_token = req.headers["access-token"];
    let home_id = req.body.net_home_id || "";
    let get_user = req.body.get_user || false;
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let response_data = {};
      let listhomes = [];

      // Call API /homesdata get list room
      const data = await getHomeData({
        access_token,
        home_id,
      });
      log("get home data: ", JSON.stringify(data));
      if (data.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + data.error.code,
          error: true,
          errorMsg: data.error.message,
        });
        return res.send(response);
      }

      // Loop all homes
      for (let index = 0; index < data.homes?.length; index++) {
        const element = data.homes[index];

        // call API /homestatus get home detail
        const homeStatus = await getHomeStatus({
          home_id: element["id"],
          access_token,
        });

        let rooms = [];
        let doorLock = null;

        // Loop all rooms in home
        for (let id = 0; id < element["rooms"]?.length; id++) {
          const room = element["rooms"][id];

          // Check if room is Doorlock and get room detail from /homestatus
          if (room.name.toLowerCase() != "door lock") {
            // Get room temperature
            const temperature = homeStatus.body?.home?.rooms
              ? homeStatus.body?.home?.rooms.find((item) => item.id == room.id)
              : null;

            // Get room light, air-conditioner status
            let roomDevices =
              element.modules?.filter((item) => item.room_id == room.id) || [];
            roomDevices = roomDevices.map((item) => {
              const device = homeStatus.body?.home?.modules?.find(
                (dItem) => dItem.id == item.id
              );
              return {
                ...item,
                ...device,
              };
            });
            let lights = roomDevices.find(
              (item) =>
                DEVICE_CODES.lights.includes(item.type) && item.on == true
            );
            // const airConditioner = roomDevices.find((item) =>
            //   DEVICE_CODES.airConditioner.includes(item.type)
            // );
            log("airConditioner => " + temperature?.cooling_setpoint_mode);
            // Push room to array
            rooms.push({
              ...room,
              cooling_setpoint_mode: temperature?.cooling_setpoint_mode || null,
              temperature: temperature
                ? temperature.therm_measured_temperature
                : null,
              isLightOn: lights ? true : false,
              isBoost: !temperature
                ? null
                : temperature?.cooling_setpoint_mode == "max"
                ? true
                : false,
            });
          } else {
            const doorStatus = homeStatus.body?.home?.modules?.find(
              (item) => item.id == room.module_ids[0]
            );

            doorLock = doorStatus || null;
          }
        }

        // Scenario

        // Call api /getscenario
        const scenarioData = await getScenario({
          home_id: element["id"],
          access_token,
        });
        if (scenarioData.error?.code) {
          response = new HttpResponse(null, {
            statusCode: "NET_" + scenarioData.error.code,
            error: true,
            errorMsg: scenarioData.error.message,
          });
          return res.send(response);
        }
        const module_scenario = scenarioData.body?.home?.modules || [];
        let scenarios =
          scenarioData.body?.home?.scenarios.map((item) => ({
            id: item.id,
            name: item.type,
            displayName: SCENARIO_TYPE[item.type] || item.type,
            selected: "",
            roomName: item.category,
          })) || [];
        // Transform the array into an object with keys as ids
        const scenarioObj = scenarios.reduce((acc, obj) => {
          const { id, ...rest } = obj; // Destructure id and rest of properties
          acc[id] = {
            id: id,
            ...rest,
            modules: [],
          }; // Add the rest of properties to the result object with id as the key
          return acc;
        }, {});

        // Loop all modules in api /getscenario
        module_scenario.forEach((item) => {
          if (item.id && item.scenarios) {
            item.scenarios.forEach((scenario) => {
              let { id: scenario_id, ...status } = scenario;
              scenarioObj[scenario.id]["modules"].push({
                id: item.id,
                ...status,
              });
            });
          }
        });

        // Final scenarios
        scenarios = Object.keys(scenarioObj).map((key) => {
          let scenario = scenarioObj[key];
          return {
            ...scenario,
            isEmpty:
              scenario.modules.length != 0 &&
              scenario.modules.find((module) => Object.keys(module).length > 1)
                ? false
                : true,
          };
        });

        // Response data
        let home_data = {
          id: element["id"],
          name: element["name"],
          scenarios: scenarios,
          waterLeakage: {
            valve: "off",
            alarm: "off",
          },
          doorLock: doorLock,
          rooms,
        };
        listhomes.push(home_data);
      }
      response_data.homes = listhomes;
      if (get_user) {
        response_data.user = data.user;
      }

      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
        errorMsg: null,
      });
      return res.ok(response);
    } catch (error) {
      log("getListHomeNetatmo error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },

  getNetamoToken: async (req, res) => {
    const { state, code } = req.query;
    const grant_type = "authorization_code";
    const client_id = process.env.NETAMO_CLIENT_ID;
    const client_secret = process.env.NETAMO_CLIENT_SECRET;
    const scope =
      "read_station read_magellan read_smarther read_thermostat read_bubendorff read_mhs1";
    const redirect_uri = "http://172.104.188.248:9000/user/getNetamoApi";
    log("=> getNetamoToken params:" + JSON.stringify(req.query));
    let response;
    try {
      const data = await getAuthToken({
        grant_type,
        client_id,
        client_secret,
        code,
        redirect_uri,
        scope,
      });
      if (data.error != -1) {
        response = new HttpResponse(data.error, {
          statusCode: 400,
          error: true,
        });
      } else {
        response = new HttpResponse(data.data, {
          statusCode: 200,
          error: false,
        });
      }
      return res.send(response);
    } catch (error) {
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(error);
    }
  },
  getNetamoInfo: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    const clientId = process.env.NETAMO_CLIENT_ID;
    const clientSecret = process.env.NETAMO_CLIENT_SECRET;
    const scope = "read_station";
    const state = (Math.random() + 1).toString(36).substring(3);
    let response;
    try {
      const response_data = {
        clientId: clientId,
        clientSecret: clientSecret,
        scope: scope,
        state: state,
      };
      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
      });
      return res.send(response);
    } catch (error) {
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(error);
    }
  },
  installNewHome: async (req, res) => {
    log("installNewHome => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let dept_name = req.body.home_name || "";
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format("CALL sp_install_department(?,?)", [
        userId,
        dept_name,
      ]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse(
        { msg: "installNewHome Successfull" },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("installNewHome error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  changeNameHome: async (req, res) => {
    log("changeNameHome => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let home_id = req.body.home_id || "";
    let dept_name = req.body.new_home_name || "";
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format("CALL sp_changeName_department(?,?,?)", [
        userId,
        home_id,
        dept_name,
      ]);
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse(
        { msg: "changeNameHome Successfull" },
        { statusCode: 200, error: false }
      );
      return res.ok(response);
    } catch (error) {
      log("changeNameHome error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  getListHome: async (req, res) => {
    log("getListHome => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format(
        "Select id,dept_id as net_home_id,dept_name as name from department where owner_id = ?",
        [userId]
      );
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response = new HttpResponse(data["rows"], {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      log("getListHome error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  mapHome: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    let dept_id = req.body.net_home_id || "";
    let home_id = req.body.home_id || "";
    let response;
    log("mapHome => " + JSON.stringify(req.headers) + JSON.stringify(req.body));
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];

      let sql = sqlString.format("CALL sp_map_home(?,?,?)", [
        userId,
        dept_id,
        +home_id,
      ]);
      const data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      const ref = data["rows"][1][0]["ref"];

      if (ref == 1) {
        response = new HttpResponse(
          { msg: "Map Home Successfull", homes: data["rows"][0] },
          { statusCode: 200, error: false }
        );
        return res.ok(response);
      } else {
        response = new HttpResponse(null, {
          statusCode: 400,
          error: true,
          errorMsg: "House has already mapped!",
        });
        return res.ok(response);
      }
    } catch (error) {
      log("mapHome error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  sendRequestSocket: async (req, res) => {
    try {
      log("sendRequestSocket => " + JSON.stringify(req.body));
      if (req.body.cmdType == SOCKET_REQUEST.upgrade) {
        await upgradeVersion(req.body);
        let response = new HttpResponse(
          { msg: "Upgrade Successfull" },
          { statusCode: 200, error: false }
        );
        return res.ok(response);
      } else if (req.body.cmdType == SOCKET_REQUEST.light) {
        await controlLight(req.body);
        let response = new HttpResponse(
          { msg: "Ordinary Lamp Control Successfull" },
          { statusCode: 200, error: false }
        );
        return res.ok(response);
      } else if (req.body.cmdType == SOCKET_REQUEST.deviceMode) {
        await deviceMode(req.body);
        let response = new HttpResponse(
          { msg: "Device network configuration mode Successfull" },
          { statusCode: 200, error: false }
        );
        return res.ok(response);
      } else if (req.body.cmdType == SOCKET_REQUEST.deviceLocation) {
        await modLocation(req.body);
        let response = new HttpResponse(
          { msg: "Modify the Device Location Successfull" },
          { statusCode: 200, error: false }
        );
        return res.ok(response);
      } else if (req.body.cmdType == SOCKET_REQUEST.deviceName) {
        await modName(req.body);
        let response = new HttpResponse(
          { msg: "Modify the Device Name Successfull" },
          { statusCode: 200, error: false }
        );
        return res.ok(response);
      } else if (req.body.cmdType == SOCKET_REQUEST.changePassword) {
        await changePassword(req.body);
        let response = new HttpResponse(
          { msg: "Change the login password Successfull" },
          { statusCode: 200, error: false }
        );
        return res.ok(response);
      }
    } catch (error) {
      log("Upgrade Socket error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  getRoomDetail: async (req, res) => {
    log("getListHomeNetatmo => " + JSON.stringify(req.headers));
    let jwtToken = req.headers["auth-token"];
    let access_token = req.headers["access-token"];
    let home_id = req.body.net_home_id || "";
    let room_id = req.body.net_room_id;
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      const homeData = await getHomeData({
        access_token,
        home_id,
      });
      if (homeData.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + homeData.error.code,
          error: true,
          errorMsg: homeData.error.message,
        });
        return res.send(response);
      }
      let homeStatus = await getHomeStatus({
        access_token,
        home_id,
      });
      if (homeStatus.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + homeData.error.code,
          error: true,
          errorMsg: homeStatus.error.message,
        });
        return res.send(response);
      }
      let errors = homeStatus.body.errors;
      homeStatus = homeStatus.body.home;
      let room = {
        ...homeData?.homes[0]?.rooms?.find((item) => item.id == room_id),
        ...(homeStatus?.rooms?.find((item) => item.id == room_id) || {}),
      };
      let roomDevices =
        homeData?.homes[0]?.modules
          ?.filter((item) => item.room_id == room_id)
          .map((item) => ({
            ...item,
            reachable: errors?.find(
              (error) => item["id"] == error.id || item["bridge"] == error.id
            )
              ? false
              : true,
          })) || [];
      roomDevices = roomDevices.map((item) => {
        const device = homeStatus?.modules?.find(
          (dItem) => dItem.id == item.id
        );
        return {
          ...item,
          ...device,
        };
      });
      const fan = roomDevices.find((item) =>
        DEVICE_CODES.fan.includes(item.type)
      );
      const airConditioner = roomDevices.find((item) =>
        DEVICE_CODES.airConditioner.includes(item.type)
      );
      const response_data = {
        id: room_id,
        name: room["name"],
        temperature: room["therm_measured_temperature"] || null,
        humidity: room["humidity"] || null,
        reachable: room["reachable"] || false,
        devices: {
          lights: roomDevices.filter(
            (item) =>
              DEVICE_CODES.lights.includes(item.type) &&
              item.variant != "NLTS:remote_motion_sensor"
          ),

          curtains: roomDevices
            .filter((item) => DEVICE_CODES.rollerShutter.includes(item.type))
            .map((item) => ({
              ...item,
              controlType:
                item["target_position:step"] >= 100 || item["type"] == "NLIV"
                  ? 0
                  : 1,
              // controlType: item["type"] == "NLLV" ? 1 : 0,
            })),
          airConditioner: airConditioner
            ? {
                id: airConditioner.id,
                reachable: airConditioner.reachable,
                temperature: room["cooling_setpoint_temperature"] || null,
                start_time: room["cooling_setpoint_start_time"] || null,
                end_time: room["cooling_setpoint_end_time"] || null,
                mode: room["cooling_setpoint_mode"] || null,
                fan: fan ? fan : null,
              }
            : null,
        },
      };
      response = new HttpResponse(response_data, {
        statusCode: 200,
        error: false,
        errorMsg: null,
      });
      return res.ok(response);
    } catch (error) {
      log("getRoomDevice error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  removeMappingHome: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    let home_id = req.body.net_home_id || "";
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      log("Remove Mapping Home: " + userId);
      let sqlStr;
      if (home_id) {
        sqlStr = sqlString.format("call sp_remove_mapped_home(?,?)", [
          userId,
          home_id,
        ]);
      } else {
        sqlStr = sqlString.format("call sp_remove_mapped_home(?,?)", [
          userId,
          -1,
        ]);
      }
      const data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlStr);
      response = new HttpResponse(
        { msg: "Remove Mapping Home Successfull!", homes: data["rows"][0] },
        { statusCode: 200, error: false }
      );
      log("Remove Mapping Home Success: " + JSON.stringify(data["rows"][0]));
      return res.ok(response);
    } catch (error) {
      log("Remove Mapping Home Error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  getUserInfo: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      log("getUserInfo => " + JSON.stringify(userId));
      let sqlUpdate = sqlString.format(
        "SELECT * FROM user_account WHERE user_id = ?",
        [userId]
      );
      const data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlUpdate);
      if (data["rows"].length > 0) {
        const userInfo = data["rows"][0];
        response = new HttpResponse(
          {
            id: userInfo["id"],
            user_id: userInfo["user_id"],
            email: userInfo["email"],
            full_name: userInfo["full_name"],
            created_at: userInfo["created_at"],
            updated_at: userInfo["updated_at"],
            avatar: userInfo["avatar"],
          },
          {
            statusCode: 200,
            error: false,
          }
        );
        return res.ok(response);
      } else {
        response = new HttpResponse(null, {
          statusCode: 404,
          error: true,
          errorMsg: "Can not find user!",
        });
        return res.send(response);
      }
    } catch (error) {
      log("Logout error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  deleteAccount: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    let response;
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      log("deleteAccount => " + JSON.stringify(userId));
      let sqlUpdate = sqlString.format("call sp_delete_account(?)", [userId]);
      const data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlUpdate);
      const ref = data["rows"][0][0]["ref"];
      if (ref == 1) {
        response = new HttpResponse(
          {
            msg: "Delete account successful!",
          },
          {
            statusCode: 200,
            error: false,
          }
        );
        return res.ok(response);
      } else {
        response = new HttpResponse(null, {
          statusCode: 400,
          error: true,
          errorMsg: "Delete account failed!",
        });
        return res.send(response);
      }
    } catch (error) {
      log("deleteAccount error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  getHomeDevices: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    let access_token = req.headers["access-token"];
    let home_id = req.body.net_home_id || "";
    log("getHomeDevices => " + home_id);

    let response;
    try {
      const homeData = await getHomeData({
        access_token,
        home_id,
      });
      if (homeData.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + homeData.error.code,
          error: true,
          errorMsg: homeData.error.message,
        });
        return res.send(response);
      }
      let homeStatus = await getHomeStatus({
        access_token,
        home_id,
      });
      if (homeStatus.error?.code) {
        response = new HttpResponse(null, {
          statusCode: "NET_" + homeData.error.code,
          error: true,
          errorMsg: homeStatus.error.message,
        });
        return res.send(response);
      }
      let errors = homeStatus.body.errors;
      homeStatus = homeStatus.body.home;
      let devices =
        homeData?.homes[0]?.modules.map((item) => ({
          ...item,
          reachable: errors?.find(
            (error) => item["id"] == error.id || item["bridge"] == error.id
          )
            ? false
            : true,
        })) || [];
      devices = devices.map((item) => {
        const device = homeStatus?.modules?.find(
          (dItem) => dItem.id == item.id
        );
        return {
          ...item,
          ...device,
        };
      });
      let lights = devices.filter(
        (item) =>
          DEVICE_CODES.lights.includes(item.type) &&
          item.variant != "NLTS:remote_motion_sensor"
      );
      response = new HttpResponse(lights, {
        statusCode: 200,
        error: false,
        errorMsg: null,
      });
      return res.ok(response);
    } catch (error) {
      log("getHomeDevices error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  getListScreen: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    let response;
    let home_id = req.body.home_id;
    log("getListScreen => " + JSON.stringify(req.body));
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format(
        "SELECT * FROM lts_device_control WHERE owned_id = ? and dept_id = ?",
        [userId, home_id]
      );
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      log("list screen: " + JSON.stringify(data["rows"]));
      response = new HttpResponse(data["rows"], {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      log("getListScreen error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  getListSensor: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    let response;
    let home_id = req.body.home_id;
    log("getListSensor => " + JSON.stringify(req.body));
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format(
        "select * from lts_device_detail where lts_mac in " +
          "(select lts_mac from lts_device_control where dept_id = ? and owned_id = ? and (productKey = ? or productKey = ?))",
        [
          home_id,
          userId,
          process.env.WATER_SENSOR_KEY,
          process.env.WATER_SENSOR_KEY_1,
        ]
      );
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let res_data = data["rows"].map((item) => ({
        ...item,
        lampStatus: item.lampStatus == 1 ? "ON" : "OFF",
      }));
      log("response: " + JSON.stringify(res_data));
      response = new HttpResponse(res_data, {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      log("getListSensor error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
  getAlarmValve: async (req, res) => {
    let jwtToken = req.headers["auth-token"];
    let response;
    let home_id = req.body.home_id;
    log("getAlarmValve => " + JSON.stringify(req.body));
    try {
      let decodedToken = jwtoken.decode(jwtToken);
      let userId = decodedToken["userId"];
      let sql = sqlString.format(
        "select * from lts_device_detail where lts_mac in " +
          "(select lts_mac from lts_device_control where dept_id = ? and owned_id = ? and (productKey = ? or productKey = ?))",
        [
          home_id,
          userId,
          process.env.SMART_SCREEN_KEY,
          process.env.SMART_SCREEN_KEY_1,
        ]
      );
      let data = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      let res_data = data["rows"].map((item) => ({
        ...item,
        lampStatus: item.lampStatus == 1 ? "ON" : "OFF",
      }));
      res_data = {
        alarm: res_data.find((item) =>
          item.deviceId.toLowerCase().includes("powerswitch_2")
        ),
        valve: res_data.find((item) =>
          item.deviceId.toLowerCase().includes("powerswitch_1")
        ),
      };

      log("response => " + JSON.stringify(res_data));
      response = new HttpResponse(res_data, {
        statusCode: 200,
        error: false,
      });
      return res.ok(response);
    } catch (error) {
      log("getAlarmValve error => " + error.toString());
      response = new HttpResponse(error, { statusCode: 500, error: true });
      return res.serverError(response);
    }
  },
};
