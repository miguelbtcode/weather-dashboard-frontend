import Alpine from 'alpinejs';
import persist from '@alpinejs/persist';

export const initAlpine = () => {
  Alpine.plugin(persist);
  
  // Add Alpine data and functions
  document.addEventListener('alpine:init', () => {
    Alpine.data('weather', () => ({
      tempUnit: Alpine.$persist('metric').as('tempUnit'),
      theme: Alpine.$persist('dark').as('theme'),
      
      toggleUnit() {
        this.tempUnit = this.tempUnit === 'metric' ? 'imperial' : 'metric';
        // Trigger React state update
        const event = new CustomEvent('alpine:unitChange', { 
          detail: { unit: this.tempUnit } 
        });
        window.dispatchEvent(event);
      },
      
      toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
      }
    }));
  });
  
  Alpine.start();
};

// Add event listener to connect Alpine and React
export const setupAlpineListeners = (setTempUnit: (unit: 'metric' | 'imperial') => void) => {
  window.addEventListener('alpine:unitChange', (e: any) => {
    setTempUnit(e.detail.unit);
  });
};