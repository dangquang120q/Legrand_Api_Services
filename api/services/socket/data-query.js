const sqlString = require("sqlstring");
const WEATHER_API_URL = process.env.WEATHER_API_URL;
const {KtoC, degreesToDirection} = require("../calculate");
module.exports = {
  deviceListVersion: async (request,lts_mac) => {
    try {
      const { data } = request;
      console.log(JSON.stringify(request));
  
      const response = {
        result: 0,
      };
      let sql = sqlString.format(
        "Select lts_device_version from lts_device_control where lts_mac = ?", [lts_mac]
      );
      let dataVersion = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      if (dataVersion["rows"].length < 1) {
        const responseErr = {
          result: -1,
        };
        responseErr.packetNo = request.packetNo;
        return responseErr;
      }
      response.data = {
        "deviceVersion": dataVersion["rows"][0]["lts_device_version"]
      }
  
      response.packetNo = request.packetNo;
      return response;
    }
    catch(error) {
      console.log('error' + error);
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  deviceList: async (request,lts_mac) => {
    try{
      const { data } = request;
      let sqlVersion = sqlString.format(
        "Select lts_device_version from lts_device_control where lts_mac = ?", [data.gatewayDn]
      );
      let dataVersion = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sqlVersion);
      let sql = sqlString.format(
        "Select * from lts_device_control where lts_mac = ?", [data.gatewayDn]
      );
      let dataListDevice = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      const response = {
        result: 0,
      };
      let deviceVersion = dataVersion["rows"][0]["lts_device_version"];
      // let leftNumber = deviceVersion - data.
      response.data = {
        "leftNumber": 0,
        "deviceVersion": deviceVersion,
        "has": [{
          "nickName ": "",
          "location": "",
          "productKey": "",
          "deviceDn": "",
          "deviceId": ""
        }]
      }
        
      response.packetNo = request.packetNo;
      return response;
    }
    catch(error) {
      console.log('error' + error);
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  cityList: async (request,lts_mac) => {
    try{

      const { data } = request;
  
      const response = {
        result: 0,
      };
      let sql = sqlString.format(
        "Select cityCode,cityName from city_information"
      );
      let dataCity = await sails
        .getDatastore(process.env.MYSQL_DATASTORE)
        .sendNativeQuery(sql);
      response.data ={
        "cityList": dataCity["rows"] || []
      }
      response.packetNo = request.packetNo;
      return response;
    }
    catch(error) {
      console.log('error' + error);
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  weather: async (request,lts_mac) => {
    try{

      const { data } = request;
  
      const response = {
        result: 0,
      };

      const searchParams = {
        id: data.cityCode,
        appid: "c3c7edff736a03db0bb150e86820ba68"
      };
      const url =
      `${WEATHER_API_URL}/data/2.5/forecast?` +
      new URLSearchParams({
        ...searchParams
      });
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
      });
      const dataWeather = await res.json();
      // console.log("weather data == " + JSON.stringify(dataWeather));

      const searchParamsPollution = {
        lat: dataWeather["city"]["coord"]["lat"],
        lon: dataWeather["city"]["coord"]["lon"],
        appid: "c3c7edff736a03db0bb150e86820ba68"
      };
      const urlPollution =
      `${WEATHER_API_URL}/data/2.5/air_pollution/forecast?` +
      new URLSearchParams({
        ...searchParamsPollution
      });
      const resPollution = await fetch(urlPollution, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
      });
      const dataWeatherPollution = await resPollution.json();

      let listWeather = [];
      for (let index = 0; index < 32; index++) {
        const element = dataWeather["list"][index];
        let pollution = dataWeatherPollution["list"][index * 3];
        console.log(JSON.stringify(pollution));
        let weather = {
          "date": element["dt_txt"],
          "temp": KtoC(element["main"]["temp"]),
          "temperatureScope": KtoC(element["main"]["feels_like"]),
          "weather": element["weather"]["main"],
          "windDirect": degreesToDirection(element["wind"]["deg"]),
          "pm25": pollution["components"]["pm2_5"],
          "humidity": element["main"]["humidity"],
          "aqi": pollution["main"]["aqi"],
          "pm10": pollution["components"]["pm10"],
        }
        listWeather.push(weather);
      }
      response.data = {
        "cityName": dataWeather["city"]["name"],
        "realTime": listWeather[0],
        "future": listWeather
      }
      response.packetNo = request.packetNo;
      return response;
    }
    catch(error) {
      console.log('error' + error);
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },

  ntp: async (request,lts_mac) => {
    try{
      const { data } = request;
  
      const response = {
        result: 0,
      };
      response.data = {
        "url":"https://ntp.ubuntu.com"
      }
  
      response.packetNo = request.packetNo;
      return response;
    }
    catch(error) {
      console.log('error' + error);
      const response = {
        result: -1,
      };
      response.packetNo = request.packetNo;
      return response;
    }
  },
};
