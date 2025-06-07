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

export const Dashboard: React.FC = () => {
  const { loading, error, currentWeather } = useWeather();
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
            onRetry={() => window.location.reload()}
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
          {/* Header with search */}
          <header className="mb-8 animate-slide-up">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Logo and title */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg weather-glow">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">SkySense</h1>
                  <p className="text-white/70">
                    Real-time weather intelligence
                  </p>
                </div>
              </div>

              {/* Search bar */}
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

              {/* Secondary content grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main column */}
                <div className="xl:col-span-2 space-y-8">
                  {/* Hourly forecast */}
                  <section className="animate-slide-up-delay-3">
                    <div className="glass rounded-2xl p-6 shadow-weather transition-all duration-500 hover:shadow-weather-lg">
                      <HourlyForecast />
                    </div>
                  </section>

                  {/* 5-day forecast */}
                  <section className="animate-slide-left">
                    <div className="glass rounded-2xl p-6 shadow-weather transition-all duration-500 hover:shadow-weather-lg">
                      <ForecastSection />
                    </div>
                  </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Weather highlights */}
                  <section className="animate-slide-right">
                    <div className="glass rounded-2xl p-6 shadow-weather transition-all duration-500 hover:shadow-weather-lg">
                      <WeatherHighlights />
                    </div>
                  </section>

                  {/* Other cities */}
                  <section className="animate-slide-up-delay-3">
                    <div className="glass rounded-2xl p-6 shadow-weather transition-all duration-500 hover:shadow-weather-lg">
                      <OtherCities />
                    </div>
                  </section>

                  {/* Weather insights */}
                  <section className="animate-fade-scale">
                    <WeatherInsights weatherCode={weatherCode} />
                  </section>
                </div>
              </div>
            </div>
          ) : (
            /* Welcome state */
            <div className="text-center py-20 animate-fade-scale">
              <div className="max-w-2xl mx-auto">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center weather-float shadow-weather-lg">
                  <span className="text-6xl">🌤️</span>
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  Welcome to SkySense
                </h2>
                <p className="text-xl text-white/80 mb-8">
                  Get real-time weather data with beautiful visualizations
                </p>
                <div className="inline-flex items-center space-x-2 glass px-6 py-3 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white">
                    Search for a city to get started
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {loading && currentWeather && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="glass rounded-2xl p-8">
                <WeatherLoading message="Updating weather data..." />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating elements for ambiance */}
      <div className="fixed bottom-8 right-8 z-30">
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
    </main>
  );
};

// Weather insights component
const WeatherInsights: React.FC<{ weatherCode: string }> = ({
  weatherCode,
}) => {
  const getInsight = () => {
    if (weatherCode.includes("01")) {
      return {
        icon: "☀️",
        title: "Clear Skies",
        message: "Perfect conditions for outdoor activities",
        color: "from-yellow-400 to-orange-500",
      };
    }
    if (weatherCode.includes("10")) {
      return {
        icon: "🌧️",
        title: "Rain Alert",
        message: "Grab an umbrella before heading out",
        color: "from-blue-400 to-blue-600",
      };
    }
    if (weatherCode.includes("11")) {
      return {
        icon: "⛈️",
        title: "Storm Warning",
        message: "Stay indoors for safety",
        color: "from-purple-500 to-indigo-600",
      };
    }
    if (weatherCode.includes("13")) {
      return {
        icon: "❄️",
        title: "Snow Conditions",
        message: "Drive carefully and dress warmly",
        color: "from-gray-200 to-blue-300",
      };
    }
    return {
      icon: "🌤️",
      title: "Weather Update",
      message: "Stay informed about changing conditions",
      color: "from-blue-400 to-purple-500",
    };
  };

  const insight = getInsight();

  return (
    <div
      className={`glass rounded-2xl p-6 bg-gradient-to-r ${insight.color} shadow-weather`}
    >
      <div className="flex items-center space-x-4">
        <div className="text-4xl weather-float">{insight.icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
          <p className="text-white/90">{insight.message}</p>
        </div>
      </div>
    </div>
  );
};
