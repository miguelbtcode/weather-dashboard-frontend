import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const { searchCity, loading } = useWeather();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchCity(query);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0" x-data="{ focused: false }">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" 
            size={20} 
          />
          <input
            type="text"
            placeholder="Search City..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary-800 border border-secondary-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
            x-on:focus="focused = true"
            x-on:blur="focused = false"
            disabled={loading}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-primary-500 rounded-full border-t-transparent"></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};