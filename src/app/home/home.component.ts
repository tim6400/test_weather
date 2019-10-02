import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/public_api';
import { mergeMap } from 'rxjs/operators';
import { StorageService } from '../_service/storage.service';
import { DataService } from '../_service/data.service';
import { SelectedCity, FavoritCity, CompleteWeather } from '../_model/selectedCity.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  locationInInUrl: number;

  isFavorite: boolean;
  isFavoriteCity: FavoritCity = null;

  isSelectedCityInFavorites = false;
  isCitySelected = false;

  selectedCityWeather = {
    degree: '',
    foreCast: [],
    locationKey: null,
    name: ''
  } as CompleteWeather

  selectedCityName: string;

  // Typeahead
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;

  // Tets only
  statesComplex: any[] = [
    { id: 1, name: 'Alabama', region: 'South' },
    { id: 2, name: 'Alaska', region: 'West' },
    { id: 3, name: 'Arizona', region: 'West' },
    { id: 4, name: 'Arkansas', region: 'South' },
    { id: 5, name: 'California', region: 'West' },
    { id: 6, name: 'Colorado', region: 'West' },
    { id: 7, name: 'Connecticut', region: 'Northeast' },
    { id: 8, name: 'Delaware', region: 'South' },
    { id: 9, name: 'Florida', region: 'South' },
    { id: 10, name: 'Georgia', region: 'South' },
    { id: 11, name: 'Hawaii', region: 'West' },
    { id: 12, name: 'Idaho', region: 'West' },
    { id: 13, name: 'Illinois', region: 'Midwest' },
    { id: 14, name: 'Indiana', region: 'Midwest' },
    { id: 15, name: 'Iowa', region: 'Midwest' },
    { id: 16, name: 'Kansas', region: 'Midwest' },
    { id: 17, name: 'Kentucky', region: 'South' },
    { id: 18, name: 'Louisiana', region: 'South' },
    { id: 19, name: 'Maine', region: 'Northeast' },
    { id: 21, name: 'Maryland', region: 'South' },
    { id: 22, name: 'Massachusetts', region: 'Northeast' },
    { id: 23, name: 'Michigan', region: 'Midwest' },
    { id: 24, name: 'Minnesota', region: 'Midwest' },
    { id: 25, name: 'Mississippi', region: 'South' },
    { id: 26, name: 'Missouri', region: 'Midwest' },
    { id: 27, name: 'Montana', region: 'West' },
    { id: 28, name: 'Nebraska', region: 'Midwest' },
    { id: 29, name: 'Nevada', region: 'West' },
    { id: 30, name: 'New Hampshire', region: 'Northeast' },
    { id: 31, name: 'New Jersey', region: 'Northeast' },
    { id: 32, name: 'New Mexico', region: 'West' },
    { id: 33, name: 'New York', region: 'Northeast' },
    { id: 34, name: 'North Dakota', region: 'Midwest' },
    { id: 35, name: 'North Carolina', region: 'South' },
    { id: 36, name: 'Ohio', region: 'Midwest' },
    { id: 37, name: 'Oklahoma', region: 'South' },
    { id: 38, name: 'Oregon', region: 'West' },
    { id: 39, name: 'Pennsylvania', region: 'Northeast' },
    { id: 40, name: 'Rhode Island', region: 'Northeast' },
    { id: 41, name: 'South Carolina', region: 'South' },
    { id: 42, name: 'South Dakota', region: 'Midwest' },
    { id: 43, name: 'Tennessee', region: 'South' },
    { id: 44, name: 'Texas', region: 'South' },
    { id: 45, name: 'Utah', region: 'West' },
    { id: 46, name: 'Vermont', region: 'Northeast' },
    { id: 47, name: 'Virginia', region: 'South' },
    { id: 48, name: 'Washington', region: 'South' },
    { id: 49, name: 'West Virginia', region: 'South' },
    { id: 50, name: 'Wisconsin', region: 'Midwest' },
    { id: 51, name: 'Wyoming', region: 'West' }
  ];


  constructor(
    private storageService: StorageService,
    private weatherService: DataService,
    private route: ActivatedRoute
  ) {
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.asyncSelected);
    })
      .pipe(
        mergeMap((token: string) => this.weatherService.getLocationAutoComplete(token))
      );

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.locationInInUrl = params['locationKey'];
      if (this.locationInInUrl === undefined) {
        this.initDefaultCity();
      } else {
        this.initFromRoute()
      }
    });
  }

  getStatesAsObservable(token: string): Observable<any> {
    const query = new RegExp(token, 'i');

    return of(
      this.statesComplex.filter((state: any) => {
        return query.test(state.name);
      })
    );
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(selectedCityName: TypeaheadMatch): void {

    this.isCitySelected = true;

    this.selectedCityWeather = {
      degree: '',
      foreCast: [],
      locationKey: '',
      name: selectedCityName.value
    };

    this.isFavoriteCity = this.storageService.isSavedAsFavorites(selectedCityName.value);

    if (this.isFavoriteCity) {
      this.isSelectedCityInFavorites = true;
    } else {
      this.isSelectedCityInFavorites = false;
    }


    if (this.isFavoriteCity) {

      this.getDegreeAndForcats();

    } else {

      this.weatherService.getLocationAutoComplete(selectedCityName.value)
        .subscribe(locationKey => {
          this.selectedCityWeather.locationKey = locationKey[0].Key;

          this.getDegreeAndForcats();
        })
    }
  }

  initDefaultCity() {
    this.isCitySelected = true;

    this.isFavoriteCity = this.storageService.isSavedAsFavorites('Tel Aviv');

    if (this.isFavoriteCity) {
      this.isSelectedCityInFavorites = true;
    } else {
      this.isSelectedCityInFavorites = false;
    }

    this.selectedCityWeather.name = 'Tel Aviv';
    this.selectedCityWeather.locationKey = 215854;

    this.getDegreeAndForcats();

  }

  initFromRoute() {

    this.isSelectedCityInFavorites = true;
    this.selectedCityWeather.locationKey = this.locationInInUrl;
    this.isCitySelected = true;

    let favoriteCity = this.storageService.isSavedAsFavorites(null, this.locationInInUrl);

    this.selectedCityWeather.name = favoriteCity.name;
    this.getDegreeAndForcats();
  }

  private getDegreeAndForcats() {
    this.weatherService.getDegreeAndForcats(this.selectedCityWeather.locationKey)
      .subscribe(item => {
        let formatedResult = this.weatherService.formatResult(item);

        this.selectedCityWeather.foreCast = formatedResult.forcast;
        this.selectedCityWeather.degree = formatedResult.degree
      })
  }


  addToFavorites() {
    this.storageService.addToFavorites({ locationKey: this.selectedCityWeather.locationKey, name: this.selectedCityWeather.name });
    this.isSelectedCityInFavorites = true;
  }

  removeFromFavorites() {
    this.storageService.removeFromFavorite(this.selectedCityWeather.name, this.selectedCityWeather.locationKey);
    this.isSelectedCityInFavorites = false;
  }
}
