import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock data for weather conditions
const mockCurrentWeather = {
  name: "London",
  dt: Date.now() / 1000,
  temp: 18,
  feels_like: 17,
  humidity: 65,
  uvi: 4,
  wind_speed: 12,
  weather: [
    {
      main: "Clouds",
      description: "scattered clouds",
      icon: "03d"
    }
  ],
  temp_max: 20,
  temp_min: 15
};

const mockForecast = Array(5).fill(null).map((_, i) => ({
  dt: (Date.now() / 1000) + (i * 86400),
  temp: {
    min: 15 + Math.random() * 5,
    max: 20 + Math.random() * 5
  },
  weather: [{
    main: "Clouds",
    description: "scattered clouds",
    icon: "03d"
  }]
}));

const mockHourlyForecast = Array(24).fill(null).map((_, i) => ({
  dt: (Date.now() / 1000) + (i * 3600),
  temp: 18 + Math.random() * 5,
  weather: [{
    main: "Clouds",
    description: "scattered clouds",
    icon: "03d"
  }]
}));

const mockSavedCities = [
  {
    name: "New York",
    country: "US",
    temp: 22,
    weather: [{ icon: "01d" }]
  },
  {
    name: "Tokyo",
    country: "JP",
    temp: 25,
    weather: [{ icon: "02d" }]
  },
  {
    name: "Paris",
    country: "FR",
    temp: 19,
    weather: [{ icon: "03d" }]
  },
  {
    name: "Sydney",
    country: "AU",
    temp: 28,
    weather: [{ icon: "01d" }]
  }
];

type WeatherUnit = 'metric' | 'imperial';

interface WeatherContextType {
  currentWeather: any;
  forecast: any[];
  hourlyForecast: any[];
  savedCities: any[];
  loading: boolean;
  error: string | null;
  tempUnit: WeatherUnit;
  searchCity: (city: string) => void;
  switchToCity: (city: string) => void;
  setTempUnit: (unit: WeatherUnit) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState<any>(mockCurrentWeather);
  const [forecast, setForecast] = useState<any[]>(mockForecast);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>(mockHourlyForecast);
  const [savedCities, setSavedCities] = useState<any[]>(mockSavedCities);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tempUnit, setTempUnit] = useState<WeatherUnit>('metric');

  const searchCity = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update current weather with mock data
      const newCurrentWeather = {
        ...mockCurrentWeather,
        name: city
      };
      
      setCurrentWeather(newCurrentWeather);
      setForecast(mockForecast);
      setHourlyForecast(mockHourlyForecast);
      
      // Add to saved cities if not already there
      const cityExists = savedCities.some(c => c.name.toLowerCase() === city.toLowerCase());
      if (!cityExists) {
        const newCity = {
          name: city,
          country: 'XX',
          temp: Math.round(15 + Math.random() * 15),
          weather: [{ icon: "01d" }]
        };
        setSavedCities(prev => [newCity, ...prev].slice(0, 4));
      }
    } catch (err) {
      console.error('Error with mock data', err);
      setError('Failed to fetch weather data. Please try another city.');
    } finally {
      setLoading(false);
    }
  };

  const switchToCity = (city: string) => {
    searchCity(city);
  };

  const changeUnit = (unit: WeatherUnit) => {
    setTempUnit(unit);
    if (currentWeather) {
      searchCity(currentWeather.name);
    }
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
        switchToCity,
        setTempUnit: changeUnit
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};