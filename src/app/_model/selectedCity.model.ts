export interface FavoritCity {
  name: string;
  locationKey: number;
  degree?: number;
}

export interface SelectedCity {
  name: string;
  locationKey: number;
  degree: number;
}

export interface CompleteWeather {
  name;
  locationKey;
  degree;
  foreCast;
}
