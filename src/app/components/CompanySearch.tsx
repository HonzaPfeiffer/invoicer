'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useSettings } from '@/contexts/SettingsContext';

interface Company {
  ico: string;
  name: string;
  address: string;
}

interface CompanySearchProps {
  onSelect: (company: Company) => void;
  placeholder?: string;
  label?: string;
  initialValue?: string;
}

export default function CompanySearch({ 
  onSelect, 
  placeholder,
  label,
  initialValue = ''
}: CompanySearchProps) {
  const { t } = useSettings();
  const [query, setQuery] = useState(initialValue);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchCompanies = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setCompanies([]);
      return;
    }

    setIsLoading(true);
    try {
      const isIco = /^\d+$/.test(searchQuery);
      const endpoint = isIco 
        ? `/api/ares/search?ico=${encodeURIComponent(searchQuery)}`
        : `/api/ares/search?q=${encodeURIComponent(searchQuery)}`;
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies || []);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Error searching companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchCompanies(value);
    }, 300);
  };

  const handleSelectCompany = (company: Company) => {
    setQuery(company.name);
    setShowDropdown(false);
    setCompanies([]);
    onSelect(company);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || companies.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < companies.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < companies.length) {
          handleSelectCompany(companies[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium text-gray-500 mb-2 block">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (companies.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder || t('company.searchPlaceholder')}
          className="w-full bg-white/5 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-black placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showDropdown && companies.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {companies.map((company, index) => (
            <button
              type="button"
              key={company.ico}
              onClick={() => handleSelectCompany(company)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-purple-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <BuildingOfficeIcon className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {company.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {t('company.ico')}: {company.ico}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {company.address}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && !isLoading && query.length >= 2 && companies.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 text-center">
            {t('company.noResults')}
          </p>
        </div>
      )}
    </div>
  );
}
