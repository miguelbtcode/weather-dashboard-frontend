// Respuesta del backend para clima actual
export interface WeatherResponse {
  success: boolean;
  message: string;
  data: {
    name: string;
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
    coord: {
      lon: number;
      lat: number;
    };
  } | null;
  timestamp: string;
}

// Respuesta del backend para pronóstico
export interface ForecastResponse {
  success: boolean;
  message: string;
  data: {
    list: Array<{
      dt: number;
      main: {
        temp: number;
        temp_min: number;
        temp_max: number;
      };
      weather: Array<{
        main: string;
        description: string;
        icon: string;
      }>;
    }>;
    city: {
      name: string;
      country: string;
    };
  } | null;
  timestamp: string;
}

// Respuesta del backend para alertas
export interface AlertsResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    city: string;
    type: string;
    message: string;
    severity: string;
    createdAt: string;
    value: number;
    threshold: number;
  }> | null;
  timestamp: string;
}

// Types para el contexto (lo que ya usamos)
export interface CurrentWeather {
  name: string;
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  uvi?: number;
  wind_speed: number;
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  temp_max: number;
  temp_min: number;
}

export interface ForecastItem {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

export interface HourlyForecastItem {
  dt: number;
  temp: number;
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

export interface SavedCity {
  name: string;
  country: string;
  temp: number;
  weather: Array<{ icon: string }>;
}
