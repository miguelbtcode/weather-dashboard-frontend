import Alpine from "alpinejs";
import persist from "@alpinejs/persist";

export const initAlpine = () => {
  Alpine.plugin(persist);

  // Add Alpine data and functions
  Alpine.data("weatherSettings", () => ({
    tempUnit: Alpine.$persist("metric").as("tempUnit"),
    theme: Alpine.$persist("dark").as("theme"),

    toggleUnit() {
      this.tempUnit = this.tempUnit === "metric" ? "imperial" : "metric";
      // Trigger custom event for React components
      window.dispatchEvent(
        new CustomEvent("tempUnitChanged", {
          detail: { unit: this.tempUnit },
        })
      );
    },

    toggleTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", this.theme);
    },

    getCurrentUnit() {
      return this.tempUnit;
    },
  }));

  Alpine.start();
};

// Setup event listeners for React integration
export const setupAlpineListeners = (
  setTempUnit: (unit: "metric" | "imperial") => void
) => {
  window.addEventListener("tempUnitChanged", (e: any) => {
    setTempUnit(e.detail.unit);
  });

  // Also listen for storage changes (for multi-tab sync)
  window.addEventListener("storage", (e) => {
    if (e.key === "_x_tempUnit") {
      const newUnit = e.newValue?.replace(/['"]/g, "") as "metric" | "imperial";
      if (newUnit && (newUnit === "metric" || newUnit === "imperial")) {
        setTempUnit(newUnit);
      }
    }
  });
};

// Helper to get current Alpine settings
export const getAlpineSettings = () => {
  try {
    const tempUnit = localStorage
      .getItem("_x_tempUnit")
      ?.replace(/['"]/g, "") as "metric" | "imperial";
    const theme = localStorage.getItem("_x_theme")?.replace(/['"]/g, "") as
      | "dark"
      | "light";

    return {
      tempUnit: tempUnit || "metric",
      theme: theme || "dark",
    };
  } catch {
    return {
      tempUnit: "metric" as const,
      theme: "dark" as const,
    };
  }
};
