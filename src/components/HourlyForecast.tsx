import React from 'react';
import { format } from 'date-fns';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export const HourlyForecast: React.FC = () => {
  const { hourlyForecast, tempUnit } = useWeather();
  
  if (!hourlyForecast || hourlyForecast.length === 0) return null;

  const getWeatherIcon = (iconCode: string, size = 24) => {
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium">Today / Week</h3>
        <div>
          <button className="text-white bg-primary-600 px-4 py-1 rounded-full text-sm mr-2">
            Today
          </button>
          <button className="text-secondary-400 hover:text-white px-4 py-1 rounded-full text-sm">
            Week
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 mt-4">
        {hourlyForecast.slice(0, 7).map((hour, index) => (
          <div 
            key={index} 
            className="bg-secondary-700/30 rounded-xl p-3 flex flex-col items-center"
          >
            <p className="text-secondary-300 mb-2">
              {format(new Date(hour.dt * 1000), 'ha')}
            </p>
            <div className="my-2">
              {getWeatherIcon(hour.weather[0].icon)}
            </div>
            <p className="text-lg font-medium mt-1">
              {Math.round(hour.temp)}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};