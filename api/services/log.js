const datetime = require('node-datetime');

module.exports = {
    'log': function (mgs) {
        var dt = datetime.create();
        var formatted = dt.format('Y-m-d H:M:S:N');
        console.log(formatted + "|" + mgs);
    },

}