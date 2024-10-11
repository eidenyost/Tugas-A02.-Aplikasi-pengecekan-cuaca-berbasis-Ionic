import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.openWeatherApiKey;
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) { }

  getWeather(city: string): Observable<any> {
    const params = {
      q: city,
      appid: this.apiKey,
      units: 'metric'
    };

    return this.http.get(this.apiUrl, { params }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid API key';
          break;
        case 404:
          errorMessage = 'City not found';
          break;
        case 429:
          errorMessage = 'Too many requests';
          break;
        default:
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    console.error('Weather API Error:', errorMessage);
    return throwError(() => errorMessage);
  }
}