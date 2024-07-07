const sqlString = require("sqlstring");
const WEATHER_API_URL = process.env.WEATHER_API_URL;

module.exports = {
  deviceListVersion: async (request,lts_mac) => {
    try {
      const { data } = request;
      console.log(JSON.stringify(request));
  
      const response = {
        result: 0,
      };
  
      response.data = {
        "deviceVersion": "1000" 
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
  
      const response = {
        result: 0,
      };
      response.data = {
        "leftNumber": 0,
        "deviceVersion": "1.1.1",
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
      console.log("weather data == " + JSON.stringify(dataWeather));
      response.data = {
        "cityName": "北京",
        "realTime": {
          "date": "2024-04-17",
          "temperature": "25",
          "temperatureScope": "12/29℃",
          "weather": "晴",
          "windDirect": "南<3",
          "pm25": "46",
          "img": "16",
          "humidity": "29",
          "aqi": "89",
          "pm10": "128",
          "quality": "良"
        },
        "future": [
          {
            "date": "2024-04-17",
            "temperature": "",
            "temperatureScope": "12/29℃",
            "weather": "晴",
            "windDirect": "南<2",
            "pm25": "46",
            "img": "16",
            "humidity": "43",
            "aqi": "89",
            "pm10": "128",
            "quality": "良"
          },
          {
            "date": "2024-04-18",
            "temperature": "",
            "temperatureScope": "13/28℃",
            "weather": "晴",
            "windDirect": "东南<2",
            "pm25": "",
            "img": "16",
            "humidity": "45",
            "aqi": "",
            "pm10": "",
            "quality": ""
          },
          {
            "date": "2024-04-19",
            "temperature": "",
            "temperatureScope": "13/19℃",
            "weather": "阴",
            "windDirect": "东<1",
            "pm25": "",
            "img": "25",
            "humidity": "36",
            "aqi": "",
            "pm10": "",
            "quality": ""
          },
          {
            "date": "2024-04-20",
            "temperature": "",
            "temperatureScope": "10/20℃",
            "weather": "多云",
            "windDirect": "北<1",
            "pm25": "",
            "img": "10",
            "humidity": "67",
            "aqi": "",
            "pm10": "",
            "quality": ""
          },
          {
            "date": "2024-04-21",
            "temperature": "",
            "temperatureScope": "14/26℃",
            "weather": "晴",
            "windDirect": "南<2",
            "pm25": "",
            "img": "16",
            "humidity": "62",
            "aqi": "",
            "pm10": "",
            "quality": ""
          }
        ]
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
