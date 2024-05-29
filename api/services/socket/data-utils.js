module.exports = {
    extractData: function (request) {
        const { data } = request;
        const header = data.subString(0, 6);
        const body = data.subString(6, data.length - 1);
        const end = data[data.length-1];

        return {header, body, end};
    },
    
};
