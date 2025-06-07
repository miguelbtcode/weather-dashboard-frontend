// src/services/weatherService.ts

import {
  WeatherResponse,
  ForecastResponse,
  AlertsResponse,
} from "../types/weather";

// URL base de tu Azure Function App
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7105/api";

class WeatherService {
  private async fetchFromApi<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  // Obtener clima actual por nombre de ciudad
  async getCurrentWeather(city: string): Promise<WeatherResponse> {
    return this.fetchFromApi<WeatherResponse>(
      `/weather/${encodeURIComponent(city)}`
    );
  }

  // Obtener clima actual por coordenadas
  async getCurrentWeatherByCoords(
    lat: number,
    lon: number
  ): Promise<WeatherResponse> {
    return this.fetchFromApi<WeatherResponse>(
      `/weather-coords?lat=${lat}&lon=${lon}`
    );
  }

  // Obtener pronóstico por nombre de ciudad
  async getForecast(city: string): Promise<ForecastResponse> {
    return this.fetchFromApi<ForecastResponse>(
      `/forecast/${encodeURIComponent(city)}`
    );
  }

  // Obtener pronóstico por coordenadas
  async getForecastByCoords(
    lat: number,
    lon: number
  ): Promise<ForecastResponse> {
    return this.fetchFromApi<ForecastResponse>(
      `/forecast-coord?lat=${lat}&lon=${lon}`
    );
  }

  // Obtener alertas
  async getAlerts(city: string): Promise<AlertsResponse> {
    return this.fetchFromApi<AlertsResponse>(
      `/alerts/${encodeURIComponent(city)}`
    );
  }

  // Obtener alertas por coordenadas
  async getAlertsByCoords(lat: number, lon: number): Promise<AlertsResponse> {
    return this.fetchFromApi<AlertsResponse>(
      `/alerts-coords?lat=${lat}&lon=${lon}`
    );
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.fetchFromApi<{ status: string }>("/health");
  }

  // Método auxiliar para obtener clima por coordenadas (fallback con OpenWeatherMap directo)
  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherResponse> {
    try {
      // Intentar con nuestro backend primero
      return await this.getCurrentWeatherByCoords(lat, lon);
    } catch (error) {
      // Si falla, podemos usar OpenWeatherMap directamente como fallback
      // (esto requeriría tener la API key en el frontend, no recomendado para producción)
      console.warn("Backend no disponible, usando fallback");
      throw error;
    }
  }
}

// Exportar instancia única
export const weatherService = new WeatherService();
export default weatherService;
