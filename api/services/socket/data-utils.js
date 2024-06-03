module.exports = {
    extractData: function (request) {
        var firstPosBody = request.indexOf("{");
        var lastPosBody = request.lastIndexOf("}");
        const header = request.substring(0, firstPosBody);
        const body = request.substring(firstPosBody, lastPosBody + 1);
        const end = request.substring(lastPosBody + 1, request.length);
        for (i = 0; i < header.length; i++) {
            var hex = header.charCodeAt(i).toString(16);
            console.log("header char code " + i + " -- " + hex);
        }
        console.log("header " + header.toString(16));
        console.log("end " + end.toString(16));
        return {header, body, end};
    },
    
};
