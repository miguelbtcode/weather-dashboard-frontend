import React from 'react';
import { format } from 'date-fns';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export const ForecastSection: React.FC = () => {
  const { forecast, tempUnit } = useWeather();
  
  if (!forecast || forecast.length === 0) return null;

  const getWeatherIcon = (iconCode: string, size = 32) => {
    if (iconCode.includes('01')) return <Sun className="text-sunny" size={size} />;
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) 
      return <Cloud className="text-cloudy" size={size} />;
    if (iconCode.includes('09') || iconCode.includes('10')) 
      return <CloudRain className="text-rainy" size={size} />;
    if (iconCode.includes('11')) 
      return <CloudLightning className="text-stormy" size={size} />;
    if (iconCode.includes('13')) 
      return <CloudSnow className="text-snowy" size={size} />;
    if (iconCode.includes('50')) 
      return <Wind className="text-cloudy" size={size} />;
    
    return <Sun className="text-sunny" size={size} />;
  };

  return (
    <div className="bg-secondary-800 rounded-2xl p-6 animate-fade-in">
      <h3 className="text-xl font-medium mb-4">5-Day Forecast</h3>
      
      <div className="space-y-4">
        {forecast.slice(0, 5).map((day, index) => (
          <div 
            key={index}
            className="flex items-center justify-between px-3 py-4 rounded-xl bg-secondary-700/30"
          >
            <p className="w-24 text-secondary-300">
              {format(new Date(day.dt * 1000), 'EEE, MMM d')}
            </p>
            
            <div className="flex items-center">
              {getWeatherIcon(day.weather[0].icon)}
              <span className="ml-2 text-sm hidden md:inline">{day.weather[0].main}</span>
            </div>
            
            <div className="flex space-x-2 md:space-x-4">
              <span className="font-medium">{Math.round(day.temp.max)}°</span>
              <span className="text-secondary-400">{Math.round(day.temp.min)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};