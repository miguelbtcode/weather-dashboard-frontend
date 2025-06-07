import React from 'react';
import { format } from 'date-fns';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export const CurrentWeather: React.FC = () => {
  const { currentWeather, tempUnit } = useWeather();
  
  if (!currentWeather) return null;

  const { temp, feels_like, humidity, weather, wind_speed, dt, temp_max, temp_min } = currentWeather;
  const date = new Date(dt * 1000);
  const dayName = format(date, 'EEEE');
  const dateFormatted = format(date, 'dd MMM, yyyy');
  
  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <Sun className="text-sunny" size={80} />;
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) 
      return <Cloud className="text-cloudy" size={80} />;
    if (iconCode.includes('09') || iconCode.includes('10')) 
      return <CloudRain className="text-rainy" size={80} />;
    if (iconCode.includes('11')) 
      return <CloudLightning className="text-stormy" size={80} />;
    if (iconCode.includes('13')) 
      return <CloudSnow className="text-snowy" size={80} />;
    if (iconCode.includes('50')) 
      return <Wind className="text-cloudy" size={80} />;
    
    return <Sun className="text-sunny" size={80} />;
  };

  return (
    <div className="bg-secondary-800 rounded-2xl p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0">
          <div className="inline-flex items-center space-x-2 bg-secondary-700/50 px-4 py-1 rounded-full text-sm">
            <span className="text-white">{currentWeather.name}</span>
          </div>
          <h2 className="text-3xl font-medium mt-4">{dayName}</h2>
          <p className="text-secondary-400">{dateFormatted}</p>
        </div>
        
        <div className="flex space-x-4 items-center">
          <button 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${tempUnit === 'metric' ? 'bg-primary-600 text-white' : 'bg-secondary-700 text-secondary-400'}`}
            onClick={() => {}} // Will be implemented with Alpine.js
          >
            °C
          </button>
          <button 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${tempUnit === 'imperial' ? 'bg-primary-600 text-white' : 'bg-secondary-700 text-secondary-400'}`}
            onClick={() => {}} // Will be implemented with Alpine.js
          >
            °F
          </button>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-6 md:mb-0">
          <div className="text-center md:text-left">
            <div className="flex items-end">
              <span className="text-7xl font-bold">{Math.round(temp)}</span>
              <span className="text-4xl">°{tempUnit === 'metric' ? 'C' : 'F'}</span>
            </div>
            <p className="text-xl mt-2 text-secondary-300">
              {weather[0].main}
            </p>
            <p className="text-secondary-400 mt-1">
              High: {Math.round(temp_max)}° Low: {Math.round(temp_min)}°
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          {getWeatherIcon(weather[0].icon)}
          <p className="mt-4 text-lg">Feels Like {Math.round(feels_like)}°</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
          <div className="bg-secondary-700/50 p-3 rounded-lg">
            <p className="text-secondary-400 text-sm">Humidity</p>
            <p className="text-xl font-medium">{humidity}%</p>
          </div>
          <div className="bg-secondary-700/50 p-3 rounded-lg">
            <p className="text-secondary-400 text-sm">Wind</p>
            <p className="text-xl font-medium">{Math.round(wind_speed)} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
};