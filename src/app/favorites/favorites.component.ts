import { Component, OnInit } from '@angular/core';
import { FavoritCity } from '../_model/selectedCity.model';

import { DataService } from '../_service/data.service';

import { forkJoin, Subscription, of } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  favorites: FavoritCity[];

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.initFavorites();
  }

  initFavorites() {

    this.loadForcats()
      .subscribe(item => {

        for (let index = 0; index < item.length; index++) {
          const favoritDetail = item[index][0];

          this.favorites.forEach(element => {
            if (favoritDetail.Link.indexOf(element.locationKey) != -1) {

              element.degree = favoritDetail.Temperature.Metric.Value
            }
          });
        }
      })
  }

  loadForcats() {
    this.favorites = JSON.parse(localStorage.getItem('favorites'));

    if (this.favorites == null) return of([]);


    let observableBatch = [];

    this.favorites.forEach((componentarray, key) => {
      observableBatch.push(this.dataService.getCurrentCondition(componentarray.locationKey));
    });

    return forkJoin(observableBatch);
  }
}
