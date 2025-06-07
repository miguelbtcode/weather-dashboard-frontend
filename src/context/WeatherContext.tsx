import React, { createContext, useContext, useState } from "react";
import weatherService from "../services/weatherService";
import {
  CurrentWeather,
  ForecastItem,
  HourlyForecastItem,
  SavedCity,
} from "../types/weather";

type WeatherUnit = "metric" | "imperial";

interface WeatherContextType {
  currentWeather: CurrentWeather | null;
  forecast: ForecastItem[];
  hourlyForecast: HourlyForecastItem[];
  savedCities: SavedCity[];
  loading: boolean;
  error: string | null;
  tempUnit: WeatherUnit;
  searchCity: (city: string) => Promise<void>;
  searchByCoords: (lat: number, lon: number) => Promise<void>;
  switchToCity: (city: string) => Promise<void>;
  setTempUnit: (unit: WeatherUnit) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastItem[]>(
    []
  );
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tempUnit, setTempUnit] = useState<WeatherUnit>("metric");

  // Función para transformar respuesta del backend a formato del frontend
  const transformWeatherData = (backendData: any): CurrentWeather => {
    return {
      name: backendData.name,
      dt: backendData.dt,
      temp: backendData.main.temp,
      feels_like: backendData.main.feels_like,
      humidity: backendData.main.humidity,
      wind_speed: backendData.wind.speed,
      weather: backendData.weather,
      temp_max: backendData.main.temp_max,
      temp_min: backendData.main.temp_min,
      uvi: 5, // Valor por defecto, ya que OpenWeather no incluye UV en basic plan
    };
  };

  const transformForecastData = (backendData: any[]): ForecastItem[] => {
    // Agrupar por día y tomar el primer pronóstico de cada día
    const dailyData: { [key: string]: any } = {};

    backendData.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = item;
      }
    });

    return Object.values(dailyData)
      .slice(0, 5)
      .map((item: any) => ({
        dt: item.dt,
        temp: {
          min: item.main.temp_min,
          max: item.main.temp_max,
        },
        weather: item.weather,
      }));
  };

  const transformHourlyData = (backendData: any[]): HourlyForecastItem[] => {
    return backendData.slice(0, 24).map((item) => ({
      dt: item.dt,
      temp: item.main.temp,
      weather: item.weather,
    }));
  };

  const searchCity = async (city: string) => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Obtener clima actual
      const weatherResponse = await weatherService.getCurrentWeather(city);

      if (!weatherResponse.success || !weatherResponse.data) {
        throw new Error(
          weatherResponse.message || "No se pudo obtener el clima"
        );
      }

      const transformedWeather = transformWeatherData(weatherResponse.data);
      setCurrentWeather(transformedWeather);

      // Obtener pronóstico
      try {
        const forecastResponse = await weatherService.getForecast(city);
        if (forecastResponse.success && forecastResponse.data) {
          const transformedForecast = transformForecastData(
            forecastResponse.data.list
          );
          const transformedHourly = transformHourlyData(
            forecastResponse.data.list
          );

          setForecast(transformedForecast);
          setHourlyForecast(transformedHourly);
        }
      } catch (forecastError) {
        console.warn("No se pudo obtener el pronóstico:", forecastError);
      }

      // Agregar a ciudades guardadas si no existe
      addToSavedCities(transformedWeather);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error searching city:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      // Obtener clima actual por coordenadas
      const weatherResponse = await weatherService.getWeatherByCoords(lat, lon);

      if (!weatherResponse.success || !weatherResponse.data) {
        throw new Error(
          weatherResponse.message ||
            "No se pudo obtener el clima para esta ubicación"
        );
      }

      const transformedWeather = transformWeatherData(weatherResponse.data);
      setCurrentWeather(transformedWeather);

      // Obtener pronóstico por coordenadas
      try {
        const forecastResponse = await weatherService.getForecastByCoords(
          lat,
          lon
        );
        if (forecastResponse.success && forecastResponse.data) {
          const transformedForecast = transformForecastData(
            forecastResponse.data.list
          );
          const transformedHourly = transformHourlyData(
            forecastResponse.data.list
          );

          setForecast(transformedForecast);
          setHourlyForecast(transformedHourly);
        }
      } catch (forecastError) {
        console.warn("No se pudo obtener el pronóstico:", forecastError);
      }

      // Agregar a ciudades guardadas
      addToSavedCities(transformedWeather);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error obteniendo clima por ubicación";
      setError(errorMessage);
      console.error("Error searching by coords:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToSavedCities = (weather: CurrentWeather) => {
    const cityExists = savedCities.some(
      (c) => c.name.toLowerCase() === weather.name.toLowerCase()
    );

    if (!cityExists) {
      const newCity: SavedCity = {
        name: weather.name,
        country: "XX", // El backend no devuelve país en current weather
        temp: Math.round(weather.temp),
        weather: weather.weather,
      };
      setSavedCities((prev) => [newCity, ...prev].slice(0, 4));
    }
  };

  const switchToCity = async (city: string) => {
    await searchCity(city);
  };

  const changeUnit = (unit: WeatherUnit) => {
    setTempUnit(unit);
    // Nota: Necesitaríamos volver a hacer la petición con la unidad correcta
    // Por ahora solo cambiar la unidad de visualización
  };

  return (
    <WeatherContext.Provider
      value={{
        currentWeather,
        forecast,
        hourlyForecast,
        savedCities,
        loading,
        error,
        tempUnit,
        searchCity,
        searchByCoords,
        switchToCity,
        setTempUnit: changeUnit,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};
