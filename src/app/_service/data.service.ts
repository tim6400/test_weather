import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DataService {

  private basePath = 'https://dataservice.accuweather.com/';

  private locationPath = this.basePath + 'locations/v1/cities/autocomplete';
  private currentConditionPath = this.basePath + 'currentconditions/v1/';
  private dailyForecastsPath = this.basePath + 'forecasts/v1/daily/5day/';

  private apikey = '?apikey=XByNR7G7Ku0qP4U5SZALgvuoXGqCVvch';

  constructor(
    private http: HttpClient,
  ) { }

  getLocationAutoComplete(query: string): Observable<any> {
    return this.http.get(`${this.locationPath}${this.apikey}&q=${query}`);
  }

  getCurrentCondition(locationKey: number): Observable<any> {
    return this.http.get(`${this.currentConditionPath}${locationKey}${this.apikey}`);
  }

  getDailyForecasts(locationKey: number): Observable<any> {
    return this.http.get(`${this.dailyForecastsPath}${locationKey}${this.apikey}&metric=true`);
  }


  getDegreeAndForcats(locationKey) {
    let observableBatch = [];

    observableBatch.push(this.getCurrentCondition(locationKey));
    observableBatch.push(this.getDailyForecasts(locationKey));

    return forkJoin(observableBatch);
  }

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
