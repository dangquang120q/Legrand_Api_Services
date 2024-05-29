module.exports = {
    extractData: function (request) {
        const { data } = request;
        const header = request.substring(0, 6);
        const body = request.substring(6, request.length - 1);
        const end = request[request.length-1];

        return {header, body, end};
    },
    
};
