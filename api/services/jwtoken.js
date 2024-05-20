var jwt = require('jsonwebtoken');

module.exports = {
	'sign': function(payload) {
		return jwt.sign({
			data: payload
		}, process.env.JWT_TOKEN, {expiresIn: 60 * 10});
	},
	'verify': function(token, callback) {
		jwt.verify(token, process.env.JWT_TOKEN, callback);
	},

	
};
