import React, { useEffect } from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Eye,
  Thermometer,
  Droplets,
  Gauge,
} from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import { useWeatherTheme, applyWeatherTheme } from "../utils/weatherThemes";

// Utility function to format date without date-fns
const formatDate = (date: Date, formatType: "day" | "date" | "time") => {
  if (formatType === "day") {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }
  if (formatType === "date") {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  if (formatType === "time") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return "";
};

export const CurrentWeather: React.FC = () => {
  const { currentWeather, tempUnit } = useWeather();

  if (!currentWeather) return null;

  const {
    temp,
    feels_like,
    humidity,
    weather,
    wind_speed,
    dt,
    temp_max,
    temp_min,
  } = currentWeather;
  const date = new Date(dt * 1000);
  const dayName = formatDate(date, "day");
  const dateFormatted = formatDate(date, "date");
  const timeFormatted = formatDate(date, "time");

  const weatherCode = weather[0].icon;
  const { theme, isNight } = useWeatherTheme(weatherCode);

  // Aplicar tema dinámico
  useEffect(() => {
    applyWeatherTheme(theme);
  }, [theme]);

  const getWeatherIcon = (iconCode: string, size: number = 80) => {
    const iconProps = {
      size,
      className: `weather-float transition-all duration-500 drop-shadow-lg`,
      style: {
        color: theme.iconColor,
        filter: `drop-shadow(0 0 20px ${theme.glowColor})`,
      },
    };

    if (iconCode.includes("01")) return <Sun {...iconProps} />;
    if (
      iconCode.includes("02") ||
      iconCode.includes("03") ||
      iconCode.includes("04")
    )
      return <Cloud {...iconProps} />;
    if (iconCode.includes("09") || iconCode.includes("10"))
      return <CloudRain {...iconProps} />;
    if (iconCode.includes("11")) return <CloudLightning {...iconProps} />;
    if (iconCode.includes("13")) return <CloudSnow {...iconProps} />;
    if (iconCode.includes("50")) return <Wind {...iconProps} />;

    return <Sun {...iconProps} />;
  };

  const getTemperatureColor = (temp: number) => {
    if (temp <= 0) return "text-blue-300";
    if (temp <= 10) return "text-blue-200";
    if (temp <= 20) return "text-green-300";
    if (temp <= 30) return "text-yellow-300";
    return "text-red-300";
  };

  return (
    <div
      className="relative rounded-3xl p-8 backdrop-blur-lg shadow-2xl transition-all duration-700 weather-glow overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.gradient
          .split(" ")
          .join(", ")})`,
        boxShadow: `0 25px 50px -12px ${theme.glowColor}`,
      }}
    >
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: theme.accent }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white">{currentWeather.name}</span>
              <span className="text-white/70">•</span>
              <span className="text-white/70">{timeFormatted}</span>
            </div>
            <h2 className="text-4xl font-bold mt-4 text-white drop-shadow-lg">
              {dayName}
            </h2>
            <p className="text-white/80 text-lg">{dateFormatted}</p>
          </div>

          {/* Unit toggles */}
          <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-full p-1">
            <button
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                tempUnit === "metric"
                  ? "bg-white text-gray-800 shadow-lg"
                  : "text-white hover:bg-white/20"
              }`}
            >
              °C
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                tempUnit === "imperial"
                  ? "bg-white text-gray-800 shadow-lg"
                  : "text-white hover:bg-white/20"
              }`}
            >
              °F
            </button>
          </div>
        </div>

        {/* Main weather display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Temperature */}
          <div className="text-center lg:text-left">
            <div className="flex items-end justify-center lg:justify-start mb-4">
              <span
                className={`text-8xl md:text-9xl font-bold ${getTemperatureColor(
                  temp
                )} drop-shadow-2xl transition-all duration-500`}
                style={{
                  textShadow: `0 0 30px ${theme.glowColor}`,
                  animation: "glow 3s ease-in-out infinite",
                }}
              >
                {Math.round(temp)}
              </span>
              <span className="text-4xl text-white/80 mb-4">
                °{tempUnit === "metric" ? "C" : "F"}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-medium text-white">
                {weather[0].main}
              </p>
              <p className="text-white/70 capitalize">
                {weather[0].description}
              </p>
              <p className="text-white/60">
                H: {Math.round(temp_max)}° L: {Math.round(temp_min)}°
              </p>
            </div>
          </div>

          {/* Weather icon */}
          <div className="flex justify-center">
            <div className="relative">
              {getWeatherIcon(weather[0].icon, 120)}
              {/* Pulsing ring effect */}
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{
                  background: `radial-gradient(circle, ${theme.primary}, transparent 70%)`,
                }}
              />
            </div>
          </div>

          {/* Weather details */}
          <div className="grid grid-cols-2 gap-4">
            {/* Feels like */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center mb-2">
                <Thermometer size={20} className="text-white/80 mr-2" />
                <span className="text-white/80 text-sm">Feels like</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {Math.round(feels_like)}°
              </p>
            </div>

            {/* Humidity */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center mb-2">
                <Droplets size={20} className="text-white/80 mr-2" />
                <span className="text-white/80 text-sm">Humidity</span>
              </div>
              <p className="text-2xl font-bold text-white">{humidity}%</p>
            </div>

            {/* Wind */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center mb-2">
                <Wind size={20} className="text-white/80 mr-2" />
                <span className="text-white/80 text-sm">Wind</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {Math.round(wind_speed)} km/h
              </p>
            </div>

            {/* Visibility */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center mb-2">
                <Eye size={20} className="text-white/80 mr-2" />
                <span className="text-white/80 text-sm">Visibility</span>
              </div>
              <p className="text-2xl font-bold text-white">10 km</p>
            </div>
          </div>
        </div>

        {/* Weather insights */}
        <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <p className="text-white text-lg">
              {getWeatherInsight(weather[0].main, temp, humidity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Función helper para insights del clima
const getWeatherInsight = (
  condition: string,
  temp: number,
  humidity: number
): string => {
  if (condition === "Clear" && temp > 25) {
    return "Perfect day for outdoor activities! Don't forget sunscreen.";
  }
  if (condition === "Rain") {
    return "Rainy weather ahead. Perfect for staying cozy indoors.";
  }
  if (condition === "Clouds" && temp > 20) {
    return "Nice cloudy weather, great for a walk in the park.";
  }
  if (temp < 5) {
    return "Bundle up! It's quite cold outside today.";
  }
  if (humidity > 80) {
    return "High humidity levels. Stay hydrated!";
  }
  return "Have a wonderful day!";
};
