// src/components/AutoLocationDetection.tsx
import React, { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useWeather } from "../context/WeatherContext";

export const AutoLocationDetection: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasAskedBefore, setHasAskedBefore] = useState(false);
  const { getCurrentLocation, checkPermission } = useGeolocation();
  const { searchByCoords, currentWeather } = useWeather();

  useEffect(() => {
    // Verificar si ya hemos preguntado antes o si el usuario ya tiene clima cargado
    const hasAsked = localStorage.getItem("hasAskedLocation") === "true";
    const dismissed =
      sessionStorage.getItem("locationPromptDismissed") === "true";

    setHasAskedBefore(hasAsked);
    setIsDismissed(dismissed || currentWeather !== null);
  }, [currentWeather]);

  const handleAllowLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        await searchByCoords(location.lat, location.lon);
        localStorage.setItem("hasAskedLocation", "true");
        setIsDismissed(true);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      localStorage.setItem("hasAskedLocation", "true");
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("locationPromptDismissed", "true");
    localStorage.setItem("hasAskedLocation", "true");
  };

  // No mostrar si ya se descartó, ya hay clima cargado, o ya se preguntó antes
  if (isDismissed || currentWeather || hasAskedBefore) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-4 mb-6 text-white">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="bg-white/20 rounded-full p-2 mt-0.5">
            <MapPin size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-1">¿Detectar tu ubicación?</h3>
            <p className="text-sm text-primary-100 mb-3">
              Te mostraremos el clima de tu ciudad automáticamente
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleAllowLocation}
                className="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
              >
                Permitir ubicación
              </button>
              <button
                onClick={handleDismiss}
                className="text-primary-100 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                No, gracias
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-primary-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
