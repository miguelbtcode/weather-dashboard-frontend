import React from 'react';
import { SearchBar } from './SearchBar';
import { CurrentWeather } from './CurrentWeather';
import { HourlyForecast } from './HourlyForecast';
import { WeatherHighlights } from './WeatherHighlights';
import { ForecastSection } from './ForecastSection';
import { OtherCities } from './OtherCities';
import { useWeather } from '../context/WeatherContext';

export const Dashboard: React.FC = () => {
  const { loading } = useWeather();

  return (
    <main className="flex-1 p-4 md:p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <SearchBar />
        
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <CurrentWeather />
              <HourlyForecast />
              <ForecastSection />
            </div>
            <div className="space-y-6">
              <WeatherHighlights />
              <OtherCities />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};