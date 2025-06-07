import React, { useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { WeatherProvider } from "./context/WeatherContext";

function App() {
  // Apply weather animation styles to document
  useEffect(() => {
    // Add weather-specific classes to body
    document.body.classList.add("theme-transition");

    // Inject weather animation styles if not already present
    if (!document.getElementById("weather-styles")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "weather-styles";
      styleSheet.textContent = `
        /* Additional dynamic styles */
        body {
          overflow-x: hidden;
        }
        
        /* Smooth theme transitions */
        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
        
        /* Enhanced scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // Set initial theme
    document.documentElement.style.setProperty("--weather-primary", "#3b82f6");
    document.documentElement.style.setProperty(
      "--weather-secondary",
      "#2563eb"
    );
    document.documentElement.style.setProperty("--weather-accent", "#1d4ed8");
    document.documentElement.style.setProperty(
      "--weather-glow",
      "rgba(59, 130, 246, 0.3)"
    );

    return () => {
      // Cleanup if needed
      document.body.classList.remove("theme-transition");
    };
  }, []);

  return (
    <WeatherProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main dashboard - Full width on mobile, with sidebar on desktop */}
        <div className="flex-1 relative">
          <Dashboard />
        </div>
      </div>
    </WeatherProvider>
  );
}

export default App;
