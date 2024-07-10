module.exports = {
    KtoC: function(K) {
        return K - 273,15;
    },
    degreesToDirection: function (degrees) {
        const sectors = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
        const index = Math.round(degrees / 45) % 8;
        return sectors[index];
    }
}