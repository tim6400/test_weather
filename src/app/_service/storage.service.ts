import { Injectable } from '@angular/core';
import { FavoritCity } from '../_model/selectedCity.model';

@Injectable({ providedIn: 'root' })
export class StorageService {

  constructor() { }

  getItem(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  isSavedAsFavorites(cityName: String, locationKey = null): FavoritCity {
    let favorits = JSON.parse(localStorage.getItem('favorites'));

    if (!favorits) return null;

    let res = favorits.filter(item => item.name === cityName || item.locationKey == locationKey)[0];

    if (res) {
      return res;
    } else {
      return null;
    }
  }

  addToFavorites(city: FavoritCity) {

    let favorites = this.getItem('favorites');
    if (favorites == null) favorites = [];
    favorites.push(city);

    this.set('favorites', favorites);
  }

  removeFromFavorite(cityName) {
    let favorites = this.getItem('favorites');

    let res = favorites.filter(item => item.name != cityName);

    this.set('favorites', res);
  }
}
