import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  weatherData: any;
  loading = true;
  error: string | null = null;
  lastUpdated: Date | null = null;
  searchCity: string = 'Manado'; // Default city

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    this.loadWeather();
  }

  loadWeather() {
    this.loading = true;
    this.error = null;
    this.weatherService.getWeather(this.searchCity).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
        this.lastUpdated = new Date();
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      }
    });
  }

  searchWeather() {
    if (this.searchCity.trim()) {
      this.loadWeather();
    }
  }

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/w/${icon}.png`;
  }

  getBackgroundClass(): string {
    if (!this.weatherData) return 'default-bg';
    const id = this.weatherData.weather[0].id;
    if (id >= 200 && id < 300) return 'thunderstorm-bg';
    if (id >= 300 && id < 500) return 'drizzle-bg';
    if (id >= 500 && id < 600) return 'rain-bg';
    if (id >= 600 && id < 700) return 'snow-bg';
    if (id >= 700 && id < 800) return 'atmosphere-bg';
    if (id === 800) return 'clear-bg';
    if (id > 800) return 'clouds-bg';
    return 'default-bg';
  }

  refreshWeather() {
    this.loadWeather();
  }
}