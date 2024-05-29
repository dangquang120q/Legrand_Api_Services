module.exports = {
    extractData: function (request) {
        const { data } = request;
        const header = data.substring(0, 6);
        const body = data.substring(6, data.length - 1);
        const end = data[data.length-1];

        return {header, body, end};
    },
    
};
