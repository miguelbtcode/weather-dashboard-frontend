// src/components/Dashboard.tsx (Versión mejorada)

import React, { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";
import { CurrentWeather } from "./CurrentWeather";
import { HourlyForecast } from "./HourlyForecast";
import { WeatherHighlights } from "./WeatherHighlights";
import { ForecastSection } from "./ForecastSection";
import { OtherCities } from "./OtherCities";
import { AnimatedBackground, WeatherGlow } from "./AnimatedBackground";
import { AutoLocationDetection } from "./AutoLocationDetection";
import { WeatherLoading, ErrorState } from "./ui/LoadingStates";
import { useWeather } from "../context/WeatherContext";
import {
  Zap,
  Sparkles,
  TrendingUp,
  Cloud,
  Sun,
  AlertTriangle,
  CloudRain,
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const { loading, error, currentWeather, lastUpdated, clearError } =
    useWeather();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!loading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [loading, isInitialLoad]);

  // Detectar el código del clima para el fondo
  const weatherCode = currentWeather?.weather[0]?.icon || "01d";

  if (isInitialLoad && loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <AnimatedBackground weatherCode="01d" intensity="light" />
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <WeatherLoading message="Inicializando SkySense..." />
        </div>
      </main>
    );
  }

  if (error && !currentWeather) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 relative overflow-hidden">
        <AnimatedBackground weatherCode="11d" intensity="medium" />
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <ErrorState
            message={error}
            onRetry={() => {
              clearError();
              window.location.reload();
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <AnimatedBackground
        weatherCode={weatherCode}
        intensity={currentWeather ? "medium" : "light"}
      />

      {/* Weather glow effects */}
      <WeatherGlow weatherCode={weatherCode} />

      {/* Main content */}
      <div className="relative z-20 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with enhanced design */}
          <header className="mb-8 animate-slide-up">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Logo and title with enhanced design */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl weather-glow">
                    <Zap className="text-white" size={32} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="text-white" size={12} />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    SkySense
                  </h1>
                  <p className="text-white/80 text-lg">
                    Real-time weather intelligence
                  </p>
                  {lastUpdated && (
                    <p className="text-white/60 text-sm">
                      Last updated:{" "}
                      {lastUpdated.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Search bar with enhanced styling */}
              <div className="lg:max-w-md lg:w-full">
                <SearchBar />
              </div>
            </div>
          </header>

          {/* Auto location detection */}
          <div className="animate-slide-up-delay-1">
            <AutoLocationDetection />
          </div>

          {currentWeather ? (
            <div className="space-y-8">
              {/* Current weather - Hero section */}
              <section className="animate-slide-up-delay-2">
                <CurrentWeather />
              </section>

              {/* Main content grid with improved layout */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Primary column - spans 3 columns on xl screens */}
                <div className="xl:col-span-3 space-y-8">
                  {/* Hourly/Weekly forecast */}
                  <section className="animate-slide-up-delay-3">
                    <div className="glass rounded-3xl p-8 shadow-weather transition-all duration-500 hover:shadow-weather-lg border border-white/10">
                      <HourlyForecast />
                    </div>
                  </section>

                  {/* 7-day forecast */}
                  <section className="animate-slide-left">
                    <div className="glass rounded-3xl p-8 shadow-weather transition-all duration-500 hover:shadow-weather-lg border border-white/10">
                      <ForecastSection />
                    </div>
                  </section>
                </div>

                {/* Sidebar - spans 1 column */}
                <div className="space-y-8">
                  {/* Weather highlights */}
                  <section className="animate-slide-right">
                    <div className="glass rounded-3xl p-6 shadow-weather transition-all duration-500 hover:shadow-weather-lg border border-white/10">
                      <WeatherHighlights />
                    </div>
                  </section>

                  {/* Other cities */}
                  <section className="animate-slide-up-delay-3">
                    <div className="glass rounded-3xl p-6 shadow-weather transition-all duration-500 hover:shadow-weather-lg border border-white/10">
                      <OtherCities />
                    </div>
                  </section>

                  {/* Weather insights */}
                  <section className="animate-fade-scale">
                    <WeatherInsights weatherCode={weatherCode} />
                  </section>

                  {/* Quick stats */}
                  <section className="animate-fade-scale">
                    <QuickStats />
                  </section>
                </div>
              </div>
            </div>
          ) : (
            /* Enhanced welcome state */
            <div className="text-center py-20 animate-fade-scale">
              <div className="max-w-3xl mx-auto">
                {/* Animated hero icon */}
                <div className="relative mx-auto mb-8 w-48 h-48">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center weather-float shadow-weather-lg">
                    <div className="text-8xl weather-glow">🌤️</div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                    <Sun className="text-white" size={28} />
                  </div>
                </div>

                <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Welcome to SkySense
                </h2>
                <p className="text-xl text-white/80 mb-8 leading-relaxed">
                  Get real-time weather data with beautiful visualizations,
                  accurate forecasts, and intelligent insights
                </p>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 weather-card">
                    <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">
                      Accurate Forecasts
                    </h3>
                    <p className="text-white/70 text-sm">
                      7-day detailed weather predictions
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 weather-card">
                    <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">
                      Real-time Data
                    </h3>
                    <p className="text-white/70 text-sm">
                      Live weather updates every 15 minutes
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 weather-card">
                    <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">
                      Smart Alerts
                    </h3>
                    <p className="text-white/70 text-sm">
                      Intelligent weather warnings
                    </p>
                  </div>
                </div>

                {/* Call to action */}
                <div className="inline-flex items-center space-x-3 glass px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white text-lg font-medium">
                    Search for a city to get started
                  </span>
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {loading && currentWeather && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="glass rounded-3xl p-8 border border-white/20">
                <WeatherLoading message="Updating weather data..." />
              </div>
            </div>
          )}

          {/* Error toast */}
          {error && currentWeather && (
            <div className="fixed top-4 right-4 z-50 animate-slide-up">
              <div className="glass bg-red-500/20 border-red-400/50 rounded-xl p-4 border">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-white">{error}</span>
                  <button
                    onClick={clearError}
                    className="text-white/80 hover:text-white ml-2"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating ambient elements */}
      <div className="fixed bottom-8 right-8 z-30 pointer-events-none">
        <div className="relative">
          <div
            className="w-4 h-4 bg-white/20 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="w-2 h-2 bg-white/10 rounded-full animate-bounce mt-2 ml-2"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="w-3 h-3 bg-white/15 rounded-full animate-bounce mt-1 ml-4"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      {/* Performance indicator */}
      <div className="fixed bottom-4 left-4 z-30 pointer-events-none">
        <div className="glass rounded-full px-3 py-1 text-xs text-white/70">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </div>
    </main>
  );
};

// Weather insights component enhanced
const WeatherInsights: React.FC<{ weatherCode: string }> = ({
  weatherCode,
}) => {
  const getInsight = () => {
    if (weatherCode.includes("01")) {
      return {
        icon: <Sun className="w-8 h-8" />,
        title: "Perfect Clear Skies",
        message: "Ideal conditions for outdoor activities",
        color: "from-yellow-400 to-orange-500",
        bgColor: "bg-yellow-500/10",
        tips: ["Apply sunscreen", "Stay hydrated", "Great for sports"],
      };
    }
    if (weatherCode.includes("10")) {
      return {
        icon: <CloudRain className="w-8 h-8" />,
        title: "Rain Expected",
        message: "Pack an umbrella before heading out",
        color: "from-blue-400 to-blue-600",
        bgColor: "bg-blue-500/10",
        tips: ["Bring umbrella", "Drive carefully", "Indoor activities"],
      };
    }
    if (weatherCode.includes("11")) {
      return {
        icon: <AlertTriangle className="w-8 h-8" />,
        title: "Storm Warning",
        message: "Severe weather conditions expected",
        color: "from-purple-500 to-indigo-600",
        bgColor: "bg-purple-500/10",
        tips: ["Stay indoors", "Avoid travel", "Charge devices"],
      };
    }
    if (weatherCode.includes("13")) {
      return {
        icon: <Cloud className="w-8 h-8" />,
        title: "Snow Conditions",
        message: "Winter weather advisory in effect",
        color: "from-gray-200 to-blue-300",
        bgColor: "bg-blue-200/10",
        tips: ["Dress warmly", "Drive slowly", "Check heating"],
      };
    }
    return {
      icon: <Sun className="w-8 h-8" />,
      title: "Weather Update",
      message: "Stay informed about changing conditions",
      color: "from-blue-400 to-purple-500",
      bgColor: "bg-blue-500/10",
      tips: ["Check hourly", "Plan ahead", "Stay safe"],
    };
  };

  const insight = getInsight();

  return (
    <div
      className={`glass rounded-3xl p-6 ${insight.bgColor} border border-white/10 hover:bg-white/20 transition-all duration-300`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`p-3 rounded-2xl bg-gradient-to-r ${insight.color} weather-float`}
        >
          <div className="text-white">{insight.icon}</div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {insight.title}
          </h3>
          <p className="text-white/80 mb-3">{insight.message}</p>
          <div className="space-y-1">
            {insight.tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-white/70"
              >
                <div className="w-1 h-1 bg-white/50 rounded-full mr-2" />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick stats component
const QuickStats: React.FC = () => {
  const { currentWeather, forecast, tempUnit } = useWeather();

  if (!currentWeather || !forecast.length) return null;

  return (
    <div className="glass rounded-3xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-white/70">Today's Range</span>
          <span className="text-white font-medium">
            {Math.round(currentWeather.temp_min)}° -{" "}
            {Math.round(currentWeather.temp_max)}°
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/70">Humidity</span>
          <span className="text-white font-medium">
            {currentWeather.humidity}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/70">UV Index</span>
          <span className="text-white font-medium">
            {currentWeather.uvi || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/70">Rainy Days</span>
          <span className="text-white font-medium">
            {forecast.filter((day) => day.pop > 0.3).length}/{forecast.length}
          </span>
        </div>
      </div>
    </div>
  );
};
