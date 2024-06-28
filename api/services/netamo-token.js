var axios = require("axios");
const { log } = require("./log");

const API_URL = process.env.NETAMO_API;

module.exports = {
  getAuthToken: async (params) => {
    try {
      const {
        grant_type,
        client_id,
        client_secret,
        code,
        redirect_uri,
        scope,
      } = params;

      const reqBody = {
        grant_type: grant_type + "",
        client_id: client_id + "",
        client_secret: client_secret + "",
        code: code + "",
        redirect_uri: redirect_uri + "",
        scope: scope + "",
      };
      log("Get netamo oauth token: " + JSON.stringify(reqBody));
      const res = await fetch(API_URL + "/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({
          grant_type: grant_type + "",
          client_id: client_id + "",
          client_secret: client_secret + "",
          code: code + "",
          redirect_uri: redirect_uri + "",
          scope: scope + "",
        }),
      });
      const data = await res.json();
      log("Netamo oauth token data: " + JSON.stringify(data));
      return {
        data: data,
        error: -1,
      };
    } catch (error) {
      log("Get netamo oauth token error: " + error);
      return {
        error: error,
      };
    }
  },
  getHomeData: async (params) => {
    try {
      const {
        access_token,
        home_id
      } = params;
      log(JSON.stringify(params));
      let url = "";
      if (home_id != "") {
        url = API_URL + `/api/homesdata?home_id=${home_id}`;
      }
      else{
        url = API_URL + `/api/homesdata`
      }
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "Authorization": 'Bearer ' + access_token
        },
      });
      const data = await res.json();
      log(JSON.stringify(data));
      if (data["error"]) {
        let dataDemo = {};
        if (home_id != "") {
          dataDemo =  
        {
          "body": {
            "homes": [
              {
                "id": "6299cc4eee916a326a6cc557",
                "name": "Legrand Demo",
                "altitude": 4,
                "coordinates": [
                  106.695594,
                  10.76131
                ],
                "country": "VN",
                "timezone": "Asia/Ho_Chi_Minh",
                "rooms": [
                  {
                    "id": "3148126183",
                    "name": "Living Room",
                    "type": "livingroom"
                  },
                  {
                    "id": "1477203598",
                    "name": "Electrical cabinet",
                    "type": "electrical_cabinet"
                  }
                ],
                "schedules": [
                  {
                    "timetable": [
                      {
                        "zone_id": 1,
                        "m_offset": 0
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 420
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 480
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 1140
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 1320
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 1860
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 1920
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 2580
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 2760
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 3300
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 3360
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 4020
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 4200
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 4740
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 4800
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 5460
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 5640
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 6180
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 6240
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 6900
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 7080
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 7620
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 8520
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 9060
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 9960
                      }
                    ],
                    "zones": [
                      {
                        "name": "Comfort",
                        "id": 0,
                        "type": 0,
                        "rooms_temp": [],
                        "modules": [],
                        "rooms": []
                      },
                      {
                        "name": "Night",
                        "id": 1,
                        "type": 1,
                        "rooms_temp": [],
                        "modules": [],
                        "rooms": []
                      },
                      {
                        "name": "Comfort+",
                        "id": 3,
                        "type": 8,
                        "rooms_temp": [],
                        "modules": [],
                        "rooms": []
                      },
                      {
                        "name": "Eco",
                        "id": 4,
                        "type": 5,
                        "rooms_temp": [],
                        "modules": [],
                        "rooms": []
                      }
                    ],
                    "name": "Temperature schedule",
                    "default": false,
                    "away_temp": 12,
                    "away_temperature_mode": "off",
                    "hg_temp": 7,
                    "id": "6299cc4eee916a326a6cc558",
                    "type": "therm",
                    "selected": true
                  },
                  {
                    "timetable": [
                      {
                        "zone_id": 1,
                        "m_offset": 0
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 420
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 480
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 1140
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 1320
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 1860
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 1920
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 2580
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 2760
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 3300
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 3360
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 4020
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 4200
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 4740
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 4800
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 5460
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 5640
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 6180
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 6240
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 6900
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 7080
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 7620
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 8520
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 9060
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 9960
                      }
                    ],
                    "zones": [
                      {
                        "name": "Comfort",
                        "id": 0,
                        "type": 0,
                        "rooms_temp": [],
                        "modules": [],
                        "rooms": []
                      },
                      {
                        "name": "Night",
                        "id": 1,
                        "type": 1,
                        "rooms_temp": [],
                        "modules": [],
                        "rooms": []
                      },
                      {
                        "name": "Comfort+",
                        "id": 3,
                        "type": 8,
                        "rooms_temp": [],
                        "modules": [],
                        "rooms": []
                      },
                      {
                        "name": "Eco",
                        "id": 4,
                        "type": 5,
                        "rooms_temp": [],
                        "modules": [],
                        "rooms": []
                      }
                    ],
                    "name": "Temperature schedule",
                    "default": false,
                    "away_temp": 12,
                    "away_temperature_mode": "off",
                    "hg_temp": 7,
                    "id": "63160292d14b1868e70def5e",
                    "type": "therm"
                  },
                  {
                    "timetable": [
                      {
                        "zone_id": 1,
                        "m_offset": 0
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 420
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 480
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 1140
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 1320
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 1860
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 1920
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 2580
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 2760
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 3300
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 3360
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 4020
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 4200
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 4740
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 4800
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 5460
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 5640
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 6180
                      },
                      {
                        "zone_id": 4,
                        "m_offset": 6240
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 6900
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 7080
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 7620
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 8520
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 9060
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 9960
                      }
                    ],
                    "zones": [
                      {
                        "name": "Comfort",
                        "id": 0,
                        "type": 0,
                        "rooms_temp": [],
                        "modules": [],
                        "rooms": []
                      },
                      {
                        "name": "Night",
                        "id": 1,
                        "type": 1,
                        "rooms_temp": [],
                        "modules": [],
                        "rooms": []
                      },
                      {
                        "name": "Comfort+",
                        "id": 3,
                        "type": 8,
                        "rooms_temp": [],
                        "modules": [],
                        "rooms": []
                      },
                      {
                        "name": "Eco",
                        "id": 4,
                        "type": 5,
                        "rooms_temp": [],
                        "modules": [],
                        "rooms": []
                      }
                    ],
                    "name": "Temperature schedule",
                    "default": false,
                    "away_temp": 12,
                    "away_temperature_mode": "off",
                    "hg_temp": 7,
                    "id": "6317083a170860667809e027",
                    "type": "therm"
                  },
                  {
                    "timetable": [
                      {
                        "zone_id": 0,
                        "m_offset": 0
                      },
                      {
                        "zone_id": 2,
                        "m_offset": 420
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 1320
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 1860
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 2760
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 3300
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 4200
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 4740
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 5640
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 6180
                      },
                      {
                        "zone_id": 1,
                        "m_offset": 7080
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 7620
                      },
                      {
                        "zone_id": 2,
                        "m_offset": 8520
                      },
                      {
                        "zone_id": 0,
                        "m_offset": 9060
                      }
                    ],
                    "zones": [
                      {
                        "name": "Comfort",
                        "id": 0,
                        "type": 0,
                        "rooms": [],
                        "modules": []
                      },
                      {
                        "name": "Eco",
                        "id": 2,
                        "type": 5,
                        "rooms": [],
                        "modules": []
                      },
                      {
                        "name": "Night",
                        "id": 1,
                        "type": 1,
                        "rooms": [],
                        "modules": []
                      }
                    ],
                    "name": "My cooling schedule",
                    "default": false,
                    "cooling_away_temp": 30,
                    "id": "6299cc4eee916a326a6cc559",
                    "type": "cooling",
                    "selected": true
                  },
                  {
                    "timetable": [
                      {
                        "m_offset": 0,
                        "zone_id": 1
                      },
                      {
                        "m_offset": 420,
                        "zone_id": 0
                      },
                      {
                        "m_offset": 480,
                        "zone_id": 2
                      },
                      {
                        "m_offset": 1140,
                        "zone_id": 0
                      },
                      {
                        "m_offset": 1320,
                        "zone_id": 1
                      },
                      {
                        "m_offset": 1860,
                        "zone_id": 0
                      },
                      {
                        "m_offset": 1920,
                        "zone_id": 2
                      },
                      {
                        "m_offset": 2580,
                        "zone_id": 0
                      },
                      {
                        "m_offset": 2760,
                        "zone_id": 1
                      },
                      {
                        "m_offset": 3300,
                        "zone_id": 0
                      },
                      {
                        "m_offset": 3360,
                        "zone_id": 2
                      },
                      {
                        "m_offset": 4020,
                        "zone_id": 0
                      },
                      {
                        "m_offset": 4200,
                        "zone_id": 1
                      },
                      {
                        "m_offset": 4740,
                        "zone_id": 0
                      },
                      {
                        "m_offset": 4800,
                        "zone_id": 2
                      },
                      {
                        "m_offset": 5460,
                        "zone_id": 0
                      },
                      {
                        "m_offset": 5640,
                        "zone_id": 1
                      },
                      {
                        "m_offset": 6180,
                        "zone_id": 0
                      },
                      {
                        "m_offset": 6240,
                        "zone_id": 2
                      },
                      {
                        "m_offset": 6900,
                        "zone_id": 0
                      },
                      {
                        "m_offset": 7080,
                        "zone_id": 1
                      },
                      {
                        "m_offset": 7620,
                        "zone_id": 0
                      },
                      {
                        "m_offset": 8520,
                        "zone_id": 1
                      },
                      {
                        "m_offset": 9060,
                        "zone_id": 0
                      },
                      {
                        "m_offset": 9960,
                        "zone_id": 1
                      }
                    ],
                    "zones": [
                      {
                        "type": 0,
                        "id": 0,
                        "rooms": [],
                        "modules": []
                      },
                      {
                        "type": 1,
                        "id": 1,
                        "rooms": [],
                        "modules": []
                      },
                      {
                        "type": 5,
                        "id": 2,
                        "rooms": [],
                        "modules": []
                      }
                    ],
                    "default": true,
                    "auto_away_temp": 30,
                    "id": "62b135f5a1570f69d70ded5b",
                    "type": "auto",
                    "selected": true
                  },
                  {
                    "timetable": [],
                    "zones": [],
                    "name": "Actions schedule",
                    "default": false,
                    "timetable_sunrise": [],
                    "timetable_sunset": [],
                    "id": "62b12a50d369fc04e350343f",
                    "type": "event",
                    "selected": true
                  },
                  {
                    "timetable": [],
                    "zones": [],
                    "name": "fhnhfcbn",
                    "default": false,
                    "timetable_sunrise": [],
                    "timetable_sunset": [],
                    "id": "636b1aa298d0e66b68063dd7",
                    "type": "event"
                  },
                  {
                    "timetable": [
                      {
                        "zone_id": 0,
                        "m_offset": 0
                      }
                    ],
                    "zones": [
                      {
                        "id": 0,
                        "price": 2500,
                        "price_type": "basic"
                      }
                    ],
                    "name": "electricity",
                    "tariff": "custom",
                    "tariff_option": "basic",
                    "power_threshold": 5,
                    "contract_power_unit": "kW",
                    "version": 1,
                    "id": "62b125a929cb46143a0617b9",
                    "type": "electricity",
                    "selected": true
                  }
                ]
              }
            ],
            "user": {
              "email": "thothien.dao@gmail.com",
              "language": "en",
              "locale": "en-US",
              "feel_like_algorithm": 0,
              "unit_pressure": 0,
              "unit_system": 0,
              "unit_wind": 0,
              "id": "6296e28623fc417cad28496e"
            }
          },
          "status": "ok",
          "time_exec": 0.6559069156646729,
          "time_server": 1719560956
          }
        }
        else{
          dataDemo =  
          {
            "body": {
              "homes": [
                {
                  "id": "6299cc4eee916a326a6cc557",
                  "name": "Legrand Demo",
                  "altitude": 4,
                  "coordinates": [
                    106.695594,
                    10.76131
                  ],
                  "country": "VN",
                  "timezone": "Asia/Ho_Chi_Minh",
                  "rooms": [
                    {
                      "id": "3148126183",
                      "name": "Living Room",
                      "type": "livingroom"
                    },
                    {
                      "id": "1477203598",
                      "name": "Electrical cabinet",
                      "type": "electrical_cabinet"
                    }
                  ],
                  "schedules": [
                    {
                      "timetable": [
                        {
                          "zone_id": 1,
                          "m_offset": 0
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 420
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 480
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 1140
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 1320
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 1860
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 1920
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 2580
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 2760
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 3300
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 3360
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 4020
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 4200
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 4740
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 4800
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 5460
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 5640
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 6180
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 6240
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 6900
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 7080
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 7620
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 8520
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 9060
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 9960
                        }
                      ],
                      "zones": [
                        {
                          "name": "Comfort",
                          "id": 0,
                          "type": 0,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        },
                        {
                          "name": "Night",
                          "id": 1,
                          "type": 1,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        },
                        {
                          "name": "Comfort+",
                          "id": 3,
                          "type": 8,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        },
                        {
                          "name": "Eco",
                          "id": 4,
                          "type": 5,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        }
                      ],
                      "name": "Temperature schedule",
                      "default": false,
                      "away_temp": 12,
                      "away_temperature_mode": "off",
                      "hg_temp": 7,
                      "id": "6299cc4eee916a326a6cc558",
                      "type": "therm",
                      "selected": true
                    },
                    {
                      "timetable": [
                        {
                          "zone_id": 1,
                          "m_offset": 0
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 420
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 480
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 1140
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 1320
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 1860
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 1920
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 2580
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 2760
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 3300
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 3360
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 4020
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 4200
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 4740
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 4800
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 5460
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 5640
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 6180
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 6240
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 6900
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 7080
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 7620
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 8520
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 9060
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 9960
                        }
                      ],
                      "zones": [
                        {
                          "name": "Comfort",
                          "id": 0,
                          "type": 0,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        },
                        {
                          "name": "Night",
                          "id": 1,
                          "type": 1,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        },
                        {
                          "name": "Comfort+",
                          "id": 3,
                          "type": 8,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        },
                        {
                          "name": "Eco",
                          "id": 4,
                          "type": 5,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        }
                      ],
                      "name": "Temperature schedule",
                      "default": false,
                      "away_temp": 12,
                      "away_temperature_mode": "off",
                      "hg_temp": 7,
                      "id": "63160292d14b1868e70def5e",
                      "type": "therm"
                    },
                    {
                      "timetable": [
                        {
                          "zone_id": 1,
                          "m_offset": 0
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 420
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 480
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 1140
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 1320
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 1860
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 1920
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 2580
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 2760
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 3300
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 3360
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 4020
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 4200
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 4740
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 4800
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 5460
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 5640
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 6180
                        },
                        {
                          "zone_id": 4,
                          "m_offset": 6240
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 6900
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 7080
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 7620
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 8520
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 9060
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 9960
                        }
                      ],
                      "zones": [
                        {
                          "name": "Comfort",
                          "id": 0,
                          "type": 0,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        },
                        {
                          "name": "Night",
                          "id": 1,
                          "type": 1,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        },
                        {
                          "name": "Comfort+",
                          "id": 3,
                          "type": 8,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        },
                        {
                          "name": "Eco",
                          "id": 4,
                          "type": 5,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        }
                      ],
                      "name": "Temperature schedule",
                      "default": false,
                      "away_temp": 12,
                      "away_temperature_mode": "off",
                      "hg_temp": 7,
                      "id": "6317083a170860667809e027",
                      "type": "therm"
                    },
                    {
                      "timetable": [
                        {
                          "zone_id": 0,
                          "m_offset": 0
                        },
                        {
                          "zone_id": 2,
                          "m_offset": 420
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 1320
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 1860
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 2760
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 3300
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 4200
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 4740
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 5640
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 6180
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 7080
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 7620
                        },
                        {
                          "zone_id": 2,
                          "m_offset": 8520
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 9060
                        }
                      ],
                      "zones": [
                        {
                          "name": "Comfort",
                          "id": 0,
                          "type": 0,
                          "rooms": [],
                          "modules": []
                        },
                        {
                          "name": "Eco",
                          "id": 2,
                          "type": 5,
                          "rooms": [],
                          "modules": []
                        },
                        {
                          "name": "Night",
                          "id": 1,
                          "type": 1,
                          "rooms": [],
                          "modules": []
                        }
                      ],
                      "name": "My cooling schedule",
                      "default": false,
                      "cooling_away_temp": 30,
                      "id": "6299cc4eee916a326a6cc559",
                      "type": "cooling",
                      "selected": true
                    },
                    {
                      "timetable": [
                        {
                          "m_offset": 0,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 420,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 480,
                          "zone_id": 2
                        },
                        {
                          "m_offset": 1140,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 1320,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 1860,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 1920,
                          "zone_id": 2
                        },
                        {
                          "m_offset": 2580,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 2760,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 3300,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 3360,
                          "zone_id": 2
                        },
                        {
                          "m_offset": 4020,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 4200,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 4740,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 4800,
                          "zone_id": 2
                        },
                        {
                          "m_offset": 5460,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 5640,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 6180,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 6240,
                          "zone_id": 2
                        },
                        {
                          "m_offset": 6900,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 7080,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 7620,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 8520,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 9060,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 9960,
                          "zone_id": 1
                        }
                      ],
                      "zones": [
                        {
                          "type": 0,
                          "id": 0,
                          "rooms": [],
                          "modules": []
                        },
                        {
                          "type": 1,
                          "id": 1,
                          "rooms": [],
                          "modules": []
                        },
                        {
                          "type": 5,
                          "id": 2,
                          "rooms": [],
                          "modules": []
                        }
                      ],
                      "default": true,
                      "auto_away_temp": 30,
                      "id": "62b135f5a1570f69d70ded5b",
                      "type": "auto",
                      "selected": true
                    },
                    {
                      "timetable": [],
                      "zones": [],
                      "name": "Actions schedule",
                      "default": false,
                      "timetable_sunrise": [],
                      "timetable_sunset": [],
                      "id": "62b12a50d369fc04e350343f",
                      "type": "event",
                      "selected": true
                    },
                    {
                      "timetable": [],
                      "zones": [],
                      "name": "fhnhfcbn",
                      "default": false,
                      "timetable_sunrise": [],
                      "timetable_sunset": [],
                      "id": "636b1aa298d0e66b68063dd7",
                      "type": "event"
                    },
                    {
                      "timetable": [
                        {
                          "zone_id": 0,
                          "m_offset": 0
                        }
                      ],
                      "zones": [
                        {
                          "id": 0,
                          "price": 2500,
                          "price_type": "basic"
                        }
                      ],
                      "name": "electricity",
                      "tariff": "custom",
                      "tariff_option": "basic",
                      "power_threshold": 5,
                      "contract_power_unit": "kW",
                      "version": 1,
                      "id": "62b125a929cb46143a0617b9",
                      "type": "electricity",
                      "selected": true
                    }
                  ]
                },
                {
                  "id": "62e224f9e8fc4533c97eb658",
                  "name": "Office",
                  "altitude": 9,
                  "coordinates": [
                    106.6581,
                    10.8326
                  ],
                  "country": "VN",
                  "timezone": "Asia/Ho_Chi_Minh",
                  "rooms": [
                    {
                      "id": "1879199412",
                      "name": "Office",
                      "type": "home_office"
                    },
                    {
                      "id": "1690311618",
                      "name": "Dining Room",
                      "type": "bathroom"
                    },
                    {
                      "id": "1485618317",
                      "name": "Bedroom",
                      "type": "dining_room"
                    }
                  ],
                  "schedules": [
                    {
                      "timetable": [
                        {
                          "m_offset": 0,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 420,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 450,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 480,
                          "zone_id": 4
                        },
                        {
                          "m_offset": 1140,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 1290,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 1320,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 1860,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 1890,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 1920,
                          "zone_id": 4
                        },
                        {
                          "m_offset": 2580,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 2730,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 2760,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 3300,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 3330,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 3360,
                          "zone_id": 4
                        },
                        {
                          "m_offset": 4020,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 4170,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 4200,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 4740,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 4770,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 4800,
                          "zone_id": 4
                        },
                        {
                          "m_offset": 5460,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 5610,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 5640,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 6180,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 6210,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 6240,
                          "zone_id": 4
                        },
                        {
                          "m_offset": 6900,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 7050,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 7080,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 7620,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 7650,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 8490,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 8520,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 9060,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 9090,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 9930,
                          "zone_id": 3
                        },
                        {
                          "m_offset": 9960,
                          "zone_id": 1
                        }
                      ],
                      "zones": [
                        {
                          "type": 0,
                          "id": 0,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        },
                        {
                          "type": 1,
                          "id": 1,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        },
                        {
                          "type": 8,
                          "id": 3,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        },
                        {
                          "type": 5,
                          "id": 4,
                          "rooms_temp": [],
                          "modules": [],
                          "rooms": []
                        }
                      ],
                      "default": true,
                      "away_temp": 12,
                      "hg_temp": 7,
                      "id": "62eb2d3b47fcd4706543dc44",
                      "type": "therm",
                      "selected": true
                    },
                    {
                      "timetable": [
                        {
                          "zone_id": 1,
                          "m_offset": 0
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 420
                        },
                        {
                          "zone_id": 2,
                          "m_offset": 480
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 1140
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 1320
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 1860
                        },
                        {
                          "zone_id": 2,
                          "m_offset": 1920
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 2580
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 2760
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 3300
                        },
                        {
                          "zone_id": 2,
                          "m_offset": 3360
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 4020
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 4200
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 4740
                        },
                        {
                          "zone_id": 2,
                          "m_offset": 4800
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 5460
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 5640
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 6180
                        },
                        {
                          "zone_id": 2,
                          "m_offset": 6240
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 6900
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 7080
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 7620
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 8520
                        },
                        {
                          "zone_id": 0,
                          "m_offset": 9060
                        },
                        {
                          "zone_id": 1,
                          "m_offset": 9960
                        }
                      ],
                      "zones": [
                        {
                          "name": "Comfort",
                          "id": 0,
                          "type": 0,
                          "rooms": [
                            {
                              "id": "1690311618",
                              "cooling_setpoint_temperature": 24
                            },
                            {
                              "id": "1690311618",
                              "cooling_setpoint_temperature": 26
                            }
                          ],
                          "modules": []
                        },
                        {
                          "name": "Night",
                          "id": 1,
                          "type": 1,
                          "rooms": [
                            {
                              "id": "1690311618",
                              "cooling_setpoint_mode": "off"
                            },
                            {
                              "id": "1690311618",
                              "cooling_setpoint_mode": "off"
                            }
                          ],
                          "modules": []
                        },
                        {
                          "name": "Eco",
                          "id": 2,
                          "type": 5,
                          "rooms": [
                            {
                              "id": "1690311618",
                              "cooling_setpoint_mode": "off"
                            },
                            {
                              "id": "1690311618",
                              "cooling_setpoint_mode": "off"
                            }
                          ],
                          "modules": []
                        }
                      ],
                      "name": "My cooling schedule",
                      "default": false,
                      "cooling_away_temp": 30,
                      "away_temperature_mode": "off",
                      "id": "62eb2d3b47fcd4706543dc45",
                      "type": "cooling",
                      "selected": true
                    },
                    {
                      "timetable": [
                        {
                          "m_offset": 0,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 420,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 480,
                          "zone_id": 2
                        },
                        {
                          "m_offset": 1140,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 1320,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 1860,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 1920,
                          "zone_id": 2
                        },
                        {
                          "m_offset": 2580,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 2760,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 3300,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 3360,
                          "zone_id": 2
                        },
                        {
                          "m_offset": 4020,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 4200,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 4740,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 4800,
                          "zone_id": 2
                        },
                        {
                          "m_offset": 5460,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 5640,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 6180,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 6240,
                          "zone_id": 2
                        },
                        {
                          "m_offset": 6900,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 7080,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 7620,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 8520,
                          "zone_id": 1
                        },
                        {
                          "m_offset": 9060,
                          "zone_id": 0
                        },
                        {
                          "m_offset": 9960,
                          "zone_id": 1
                        }
                      ],
                      "zones": [
                        {
                          "type": 0,
                          "id": 0,
                          "rooms": [
                            {
                              "id": "1690311618",
                              "auto_setpoint_temperature": 26
                            },
                            {
                              "id": "1690311618",
                              "auto_setpoint_temperature": 26
                            }
                          ],
                          "modules": []
                        },
                        {
                          "type": 1,
                          "id": 1,
                          "rooms": [
                            {
                              "id": "1690311618",
                              "auto_setpoint_mode": "off"
                            },
                            {
                              "id": "1690311618",
                              "auto_setpoint_mode": "off"
                            }
                          ],
                          "modules": []
                        },
                        {
                          "type": 5,
                          "id": 2,
                          "rooms": [
                            {
                              "id": "1690311618",
                              "auto_setpoint_mode": "off"
                            },
                            {
                              "id": "1690311618",
                              "auto_setpoint_mode": "off"
                            }
                          ],
                          "modules": []
                        }
                      ],
                      "default": true,
                      "auto_away_temp": 30,
                      "away_temperature_mode": "off",
                      "id": "62eb2d3b47fcd4706543dc46",
                      "type": "auto",
                      "selected": true
                    },
                    {
                      "timetable": [],
                      "zones": [],
                      "name": "Actions schedule",
                      "default": false,
                      "timetable_sunrise": [],
                      "timetable_sunset": [],
                      "id": "632c19c2e90324a7220196e7",
                      "type": "event",
                      "selected": true
                    },
                    {
                      "timetable": [
                        {
                          "zone_id": 0,
                          "m_offset": 0
                        }
                      ],
                      "zones": [
                        {
                          "id": 0,
                          "price": 2500,
                          "price_type": "basic"
                        }
                      ],
                      "name": "electricity",
                      "tariff": "custom",
                      "tariff_option": "basic",
                      "power_threshold": 9,
                      "contract_power_unit": "kW",
                      "version": 1,
                      "id": "62e22f3a034a4d1bcb076023",
                      "type": "electricity",
                      "selected": true
                    }
                  ]
                },
                {
                  "id": "6322f96cfdacf9e48f0551a9",
                  "name": "Training",
                  "altitude": 4,
                  "coordinates": [
                    106.695611,
                    10.761484
                  ],
                  "country": "VN",
                  "timezone": "Asia/Ho_Chi_Minh",
                  "rooms": [
                    {
                      "id": "172968417",
                      "name": "Living room",
                      "type": "livingroom"
                    },
                    {
                      "id": "917783839",
                      "name": "Other",
                      "type": "custom"
                    }
                  ]
                },
              ],
              "user": {
                "email": "thothien.dao@gmail.com",
                "language": "en",
                "locale": "en-US",
                "feel_like_algorithm": 0,
                "unit_pressure": 0,
                "unit_system": 0,
                "unit_wind": 0,
                "id": "6296e28623fc417cad28496e"
              }
            },
            "status": "ok",
            "time_exec": 0.6559069156646729,
            "time_server": 1719560956
          }
        }
        return {
          homes: dataDemo.body.homes || [],
          user: dataDemo.body.user,
          error: -1,
        };
      }
      return {
        homes: data.body.homes || [],
        user: data.body.user,
        error: -1,
      };
    } catch (error) {
      log("Get netamo oauth token error: " + error);
      return {
        error: error,
      };
    }
  },
};
