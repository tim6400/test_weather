import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { CompleteWeather } from '../_model/selectedCity.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataService {

  private basePath = 'http://dataservice.accuweather.com/';

  private locationPath = this.basePath + 'locations/v1/cities/autocomplete';
  private currentConditionPath = this.basePath + 'currentconditions/v1/';
  private dailyForecastsPath = this.basePath + 'forecasts/v1/daily/5day/';

  private apikey = '?apikey=Tg76d45wW54G3oPooZWGBcgFXFCFUYa2';

  private autoComplete = [
    {
      "Version": 1,
      "Key": "226396",
      "Type": "City",
      "Rank": 10,
      "LocalizedName": "Tokyo",
      "Country": {
        "ID": "JP",
        "LocalizedName": "Japan"
      },
      "AdministrativeArea": {
        "ID": "13",
        "LocalizedName": "Tokyo"
      }
    },
    {
      "Version": 1,
      "Key": "106770",
      "Type": "City",
      "Rank": 11,
      "LocalizedName": "Taiyuan",
      "Country": {
        "ID": "CN",
        "LocalizedName": "China"
      },
      "AdministrativeArea": {
        "ID": "SX",
        "LocalizedName": "Shanxi"
      }
    },
    {
      "Version": 1,
      "Key": "106780",
      "Type": "City",
      "Rank": 11,
      "LocalizedName": "Tianjin",
      "Country": {
        "ID": "CN",
        "LocalizedName": "China"
      },
      "AdministrativeArea": {
        "ID": "TJ",
        "LocalizedName": "Tianjin"
      }
    },
    {
      "Version": 1,
      "Key": "58491",
      "Type": "City",
      "Rank": 13,
      "LocalizedName": "Tongren",
      "Country": {
        "ID": "CN",
        "LocalizedName": "China"
      },
      "AdministrativeArea": {
        "ID": "GZ",
        "LocalizedName": "Guizhou"
      }
    },
    {
      "Version": 1,
      "Key": "102324",
      "Type": "City",
      "Rank": 13,
      "LocalizedName": "Tangshan",
      "Country": {
        "ID": "CN",
        "LocalizedName": "China"
      },
      "AdministrativeArea": {
        "ID": "HE",
        "LocalizedName": "Hebei"
      }
    },
    {
      "Version": 1,
      "Key": "59573",
      "Type": "City",
      "Rank": 13,
      "LocalizedName": "Taizhou",
      "Country": {
        "ID": "CN",
        "LocalizedName": "China"
      },
      "AdministrativeArea": {
        "ID": "JS",
        "LocalizedName": "Jiangsu"
      }
    },
    {
      "Version": 1,
      "Key": "60198",
      "Type": "City",
      "Rank": 13,
      "LocalizedName": "Tongliao",
      "Country": {
        "ID": "CN",
        "LocalizedName": "China"
      },
      "AdministrativeArea": {
        "ID": "NM",
        "LocalizedName": "Inner Mongolia"
      }
    },
    {
      "Version": 1,
      "Key": "106571",
      "Type": "City",
      "Rank": 13,
      "LocalizedName": "Tai'an",
      "Country": {
        "ID": "CN",
        "LocalizedName": "China"
      },
      "AdministrativeArea": {
        "ID": "SD",
        "LocalizedName": "Shandong"
      }
    },
    {
      "Version": 1,
      "Key": "58055",
      "Type": "City",
      "Rank": 15,
      "LocalizedName": "Tianshui",
      "Country": {
        "ID": "CN",
        "LocalizedName": "China"
      },
      "AdministrativeArea": {
        "ID": "GS",
        "LocalizedName": "Gansu"
      }
    },
    {
      "Version": 1,
      "Key": "2333653",
      "Type": "City",
      "Rank": 15,
      "LocalizedName": "Taizhou",
      "Country": {
        "ID": "CN",
        "LocalizedName": "China"
      },
      "AdministrativeArea": {
        "ID": "ZJ",
        "LocalizedName": "Zhejiang"
      }
    }
  ];

  private currentLocation = [
    {
      "LocalObservationDateTime": "2019-09-26T15:33:00+08:00",
      "EpochTime": 1569483180,
      "WeatherText": "Sunny",
      "WeatherIcon": 1,
      "HasPrecipitation": false,
      "PrecipitationType": null,
      "LocalSource": {
        "Id": 7,
        "Name": "Huafeng",
        "WeatherCode": "00"
      },
      "IsDayTime": true,
      "Temperature": {
        "Metric": {
          "Value": 27.2,
          "Unit": "C",
          "UnitType": 17
        },
        "Imperial": {
          "Value": 81,
          "Unit": "F",
          "UnitType": 18
        }
      },
      "MobileLink": "http://m.accuweather.com/en/cn/taiyuan/106770/current-weather/106770?lang=en-us",
      "Link": "http://www.accuweather.com/en/cn/taiyuan/106770/current-weather/106770?lang=en-us"
    }
  ];

  private forecast = {
    "Headline": {
      "EffectiveDate": "2019-09-26T07:00:00+08:00",
      "EffectiveEpochDate": 1569452400,
      "Severity": 7,
      "Text": "Warm from Thursday to Monday",
      "Category": "heat",
      "EndDate": "2019-09-30T19:00:00+08:00",
      "EndEpochDate": 1569841200,
      "MobileLink": "http://m.accuweather.com/en/cn/taiyuan/106770/extended-weather-forecast/106770?lang=en-us",
      "Link": "http://www.accuweather.com/en/cn/taiyuan/106770/daily-weather-forecast/106770?lang=en-us"
    },
    "DailyForecasts": [
      {
        "Date": "2019-09-26T07:00:00+08:00",
        "EpochDate": 1569452400,
        "Temperature": {
          "Minimum": {
            "Value": 48,
            "Unit": "F",
            "UnitType": 18
          },
          "Maximum": {
            "Value": 81,
            "Unit": "F",
            "UnitType": 18
          }
        },
        "Day": {
          "Icon": 3,
          "IconPhrase": "Partly sunny",
          "HasPrecipitation": false,
          "LocalSource": {
            "Id": 7,
            "Name": "Huafeng",
            "WeatherCode": "00"
          }
        },
        "Night": {
          "Icon": 33,
          "IconPhrase": "Clear",
          "HasPrecipitation": false,
          "LocalSource": {
            "Id": 7,
            "Name": "Huafeng",
            "WeatherCode": "00"
          }
        },
        "Sources": [
          "AccuWeather",
          "Huafeng"
        ],
        "MobileLink": "http://m.accuweather.com/en/cn/taiyuan/106770/daily-weather-forecast/106770?day=1&lang=en-us",
        "Link": "http://www.accuweather.com/en/cn/taiyuan/106770/daily-weather-forecast/106770?day=1&lang=en-us"
      },
      {
        "Date": "2019-09-27T07:00:00+08:00",
        "EpochDate": 1569538800,
        "Temperature": {
          "Minimum": {
            "Value": 50,
            "Unit": "F",
            "UnitType": 18
          },
          "Maximum": {
            "Value": 79,
            "Unit": "F",
            "UnitType": 18
          }
        },
        "Day": {
          "Icon": 3,
          "IconPhrase": "Partly sunny",
          "HasPrecipitation": false,
          "LocalSource": {
            "Id": 7,
            "Name": "Huafeng",
            "WeatherCode": "01"
          }
        },
        "Night": {
          "Icon": 33,
          "IconPhrase": "Clear",
          "HasPrecipitation": false,
          "LocalSource": {
            "Id": 7,
            "Name": "Huafeng",
            "WeatherCode": "00"
          }
        },
        "Sources": [
          "AccuWeather",
          "Huafeng"
        ],
        "MobileLink": "http://m.accuweather.com/en/cn/taiyuan/106770/daily-weather-forecast/106770?day=2&lang=en-us",
        "Link": "http://www.accuweather.com/en/cn/taiyuan/106770/daily-weather-forecast/106770?day=2&lang=en-us"
      },
      {
        "Date": "2019-09-28T07:00:00+08:00",
        "EpochDate": 1569625200,
        "Temperature": {
          "Minimum": {
            "Value": 50,
            "Unit": "F",
            "UnitType": 18
          },
          "Maximum": {
            "Value": 81,
            "Unit": "F",
            "UnitType": 18
          }
        },
        "Day": {
          "Icon": 2,
          "IconPhrase": "Mostly sunny",
          "HasPrecipitation": false,
          "LocalSource": {
            "Id": 7,
            "Name": "Huafeng",
            "WeatherCode": "00"
          }
        },
        "Night": {
          "Icon": 34,
          "IconPhrase": "Mostly clear",
          "HasPrecipitation": false,
          "LocalSource": {
            "Id": 7,
            "Name": "Huafeng",
            "WeatherCode": "00"
          }
        },
        "Sources": [
          "AccuWeather",
          "Huafeng"
        ],
        "MobileLink": "http://m.accuweather.com/en/cn/taiyuan/106770/daily-weather-forecast/106770?day=3&lang=en-us",
        "Link": "http://www.accuweather.com/en/cn/taiyuan/106770/daily-weather-forecast/106770?day=3&lang=en-us"
      },
      {
        "Date": "2019-09-29T07:00:00+08:00",
        "EpochDate": 1569711600,
        "Temperature": {
          "Minimum": {
            "Value": 50,
            "Unit": "F",
            "UnitType": 18
          },
          "Maximum": {
            "Value": 82,
            "Unit": "F",
            "UnitType": 18
          }
        },
        "Day": {
          "Icon": 3,
          "IconPhrase": "Partly sunny",
          "HasPrecipitation": false,
          "LocalSource": {
            "Id": 7,
            "Name": "Huafeng",
            "WeatherCode": "00"
          }
        },
        "Night": {
          "Icon": 35,
          "IconPhrase": "Partly cloudy",
          "HasPrecipitation": false,
          "LocalSource": {
            "Id": 7,
            "Name": "Huafeng",
            "WeatherCode": "01"
          }
        },
        "Sources": [
          "AccuWeather",
          "Huafeng"
        ],
        "MobileLink": "http://m.accuweather.com/en/cn/taiyuan/106770/daily-weather-forecast/106770?day=4&lang=en-us",
        "Link": "http://www.accuweather.com/en/cn/taiyuan/106770/daily-weather-forecast/106770?day=4&lang=en-us"
      },
      {
        "Date": "2019-09-30T07:00:00+08:00",
        "EpochDate": 1569798000,
        "Temperature": {
          "Minimum": {
            "Value": 50,
            "Unit": "F",
            "UnitType": 18
          },
          "Maximum": {
            "Value": 79,
            "Unit": "F",
            "UnitType": 18
          }
        },
        "Day": {
          "Icon": 7,
          "IconPhrase": "Cloudy",
          "HasPrecipitation": false,
          "LocalSource": {
            "Id": 7,
            "Name": "Huafeng",
            "WeatherCode": "02"
          }
        },
        "Night": {
          "Icon": 35,
          "IconPhrase": "Partly cloudy",
          "HasPrecipitation": false,
          "LocalSource": {
            "Id": 7,
            "Name": "Huafeng",
            "WeatherCode": "01"
          }
        },
        "Sources": [
          "AccuWeather",
          "Huafeng"
        ],
        "MobileLink": "http://m.accuweather.com/en/cn/taiyuan/106770/daily-weather-forecast/106770?day=5&lang=en-us",
        "Link": "http://www.accuweather.com/en/cn/taiyuan/106770/daily-weather-forecast/106770?day=5&lang=en-us"
      }
    ]
  }

  constructor(
    private http: HttpClient,
    private favoriteStorage: StorageService
  ) { }

  getLocationAutoComplete(query: string): Observable<any> {

    return this.http.get(`${this.locationPath}${this.apikey}&q=${query}`);

    // const queryt = new RegExp(query, 'i');

    // return of(
    //   this.autoComplete.filter((state: any) => {
    //     return queryt.test(state.LocalizedName);
    //   })
    // );
  }

  getDailyForecasts(locationKey: number): Observable<any> {
    return this.http.get(`${this.dailyForecastsPath}${locationKey}${this.apikey}&metric=true`);

    //return of(this.forecast);
  }

  // getCurrentCondition(locationKey: number, isFavorit) {
  //   // return this.http.get(`${this.currentConditionPath}${locationKey}${this.apikey}`);
  //   if (isFavorit) {
  //     return of(this.currentLocation[0]);
  //   }
  //   return of(this.currentLocation[0]['Temperature']['Metric']['Value']);
  // }

  getCurrentCondition(locationKey: number) {
    return this.http.get(`${this.currentConditionPath}${locationKey}${this.apikey}`);
  }

  getDegreeAndForcats(locationKey) {
    let observableBatch = [];

    observableBatch.push(this.getCurrentCondition(locationKey));
    observableBatch.push(this.getDailyForecasts(locationKey));

    return forkJoin(observableBatch);
  }

  // From CurrentLocation and forcats
  // Return object
  formatResult(item) {
    let formatedResult = {
      degree: '',
      forcast: []
    };

    item.forEach(element => {

      if (Array.isArray(element) && element.length > 0) {
        formatedResult.degree = element[0]['Temperature']['Metric']['Value'];
        return;
      }

      if (element['DailyForecasts']) {
        let forcatResult = element['DailyForecasts'];

        forcatResult.forEach(element => {
          let currentDayForcats = {
            dayName: '',
            min: '',
            max: ''
          };

          // Extract day name
          currentDayForcats.dayName = this.getDayName(element.Date)
          currentDayForcats.min = element['Temperature']['Minimum']['Value'];
          currentDayForcats.max = element['Temperature']['Minimum']['Value'];

          formatedResult.forcast.push(currentDayForcats);
        });
      }
    })

    return formatedResult;
  }

  private getDayName(date: string) {

    // Extract date from string
    let onlyDate = date.substr(0, 10)

    var a = new Date(onlyDate);
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dayOfWeek = days[a.getDay()]
    return dayOfWeek
  }
}
