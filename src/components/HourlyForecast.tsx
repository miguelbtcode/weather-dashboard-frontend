// src/components/HourlyForecast.tsx (Versión mejorada)

import React from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
} from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import { useTemperature } from "../utils/temperatureUtils";

export const HourlyForecast: React.FC = () => {
  const { hourlyForecast, forecast, tempUnit, viewMode, setViewMode } =
    useWeather();

  const getWeatherIcon = (iconCode: string, size = 24) => {
    const iconClass = "transition-all duration-300 drop-shadow-sm";

    if (iconCode.includes("01"))
      return <Sun className={`text-sunny ${iconClass}`} size={size} />;
    if (
      iconCode.includes("02") ||
      iconCode.includes("03") ||
      iconCode.includes("04")
    )
      return <Cloud className={`text-cloudy ${iconClass}`} size={size} />;
    if (iconCode.includes("09") || iconCode.includes("10"))
      return <CloudRain className={`text-rainy ${iconClass}`} size={size} />;
    if (iconCode.includes("11"))
      return (
        <CloudLightning className={`text-stormy ${iconClass}`} size={size} />
      );
    if (iconCode.includes("13"))
      return <CloudSnow className={`text-snowy ${iconClass}`} size={size} />;
    if (iconCode.includes("50"))
      return <Wind className={`text-cloudy ${iconClass}`} size={size} />;

    return <Sun className={`text-sunny ${iconClass}`} size={size} />;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: false,
    });
  };

  const formatDate = (
    timestamp: number,
    format: "short" | "long" = "short"
  ) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }

    if (format === "short") {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const renderTodayView = () => {
    if (!hourlyForecast || hourlyForecast.length === 0) {
      return (
        <div className="text-center py-8 text-white/60">
          <Cloud size={32} className="mx-auto mb-2 opacity-50" />
          <p>No hourly forecast available</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 mt-6">
        {hourlyForecast.slice(0, 12).map((hour, index) => {
          const tempDisplay = useTemperature(hour.temp, tempUnit);

          return (
            <div
              key={index}
              className="glass rounded-xl p-4 flex flex-col items-center hover:bg-white/20 transition-all duration-300 weather-card"
            >
              <p className="text-white/80 mb-2 text-sm font-medium">
                {formatTime(hour.dt)}
              </p>

              <div className="my-3 relative">
                {getWeatherIcon(hour.weather[0].icon, 28)}
              </div>

              <p className="text-lg font-bold text-white mb-1">
                {Math.round(tempDisplay.displayTemp)}°
              </p>

              {hour.pop > 0 && (
                <div className="flex items-center text-blue-300 text-xs">
                  <Droplets size={12} className="mr-1" />
                  <span>{Math.round(hour.pop * 100)}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    if (!forecast || forecast.length === 0) {
      return (
        <div className="text-center py-8 text-white/60">
          <Cloud size={32} className="mx-auto mb-2 opacity-50" />
          <p>No weekly forecast available</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 mt-6">
        {forecast.map((day, index) => {
          const tempMaxDisplay = useTemperature(day.temp.max, tempUnit);
          const tempMinDisplay = useTemperature(day.temp.min, tempUnit);

          return (
            <div
              key={index}
              className="glass rounded-xl p-4 flex items-center justify-between hover:bg-white/20 transition-all duration-300 weather-card"
            >
              {/* Date */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-base">
                  {formatDate(day.dt, "short")}
                </p>
                <p className="text-white/70 text-sm capitalize">
                  {day.weather[0].description}
                </p>
              </div>

              {/* Weather icon */}
              <div className="flex items-center mx-4">
                {getWeatherIcon(day.weather[0].icon, 32)}
              </div>

              {/* Precipitation */}
              {day.pop > 0 && (
                <div className="flex items-center text-blue-300 text-sm mr-4">
                  <Droplets size={14} className="mr-1" />
                  <span>{Math.round(day.pop * 100)}%</span>
                </div>
              )}

              {/* Temperature range */}
              <div className="flex items-center space-x-3 text-right">
                <span className="text-white font-bold text-lg">
                  {Math.round(tempMaxDisplay.displayTemp)}°
                </span>
                <span className="text-white/60 text-base">
                  {Math.round(tempMinDisplay.displayTemp)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Header with view toggles */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">
          {viewMode === "today" ? "Today's Hourly Forecast" : "7-Day Forecast"}
        </h3>

        <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-full p-1">
          <button
            onClick={() => setViewMode("today")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              viewMode === "today"
                ? "bg-white text-gray-800 shadow-lg"
                : "text-white hover:bg-white/20"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              viewMode === "week"
                ? "bg-white text-gray-800 shadow-lg"
                : "text-white hover:bg-white/20"
            }`}
          >
            7 Days
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      <div className="transition-all duration-500">
        {viewMode === "today" ? renderTodayView() : renderWeekView()}
      </div>

      {/* Additional info */}
      <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl">
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>
            {viewMode === "today"
              ? `Showing next ${Math.min(12, hourlyForecast.length)} hours`
              : `Showing next ${forecast.length} days`}
          </span>
          <span>All times in local time zone</span>
        </div>
      </div>
    </div>
  );
};
