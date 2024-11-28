var jwt = require("jsonwebtoken");

module.exports = {
  sign: function (payload) {
    return jwt.sign(
      {
        data: payload,
      },
      process.env.JWT_TOKEN,
      { expiresIn: "30d" }
    );
  },
  verify: function (token, callback) {
    jwt.verify(token, process.env.JWT_TOKEN, callback);
  },
  decode: function (token) {
    let decodedToken = jwt.decode(token);
    return decodedToken ? decodedToken.data : null;
  },
};
