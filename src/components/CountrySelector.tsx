import React from 'react';
import { Country } from '../types';

interface CountrySelectorProps {
  currentCountry: string;
  targetCountries: string[];
  profession: string;
  visaType: string;
  onCurrentCountryChange: (country: string) => void;
  onTargetCountriesChange: (countries: string[]) => void;
  onProfessionChange: (profession: string) => void;
  onVisaTypeChange: (visaType: string) => void;
  countries: Country[];
  professions: string[];
  visaTypes: string[];
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  currentCountry,
  targetCountries,
  profession,
  visaType,
  onCurrentCountryChange,
  onTargetCountriesChange,
  onProfessionChange,
  onVisaTypeChange,
  countries,
  professions,
  visaTypes
}) => {
  const handleTargetCountryToggle = (countryCode: string) => {
    if (targetCountries.includes(countryCode)) {
      onTargetCountriesChange(targetCountries.filter(c => c !== countryCode));
    } else if (targetCountries.length < 3) {
      onTargetCountriesChange([...targetCountries, countryCode]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Country
        </label>
        <select
          value={currentCountry}
          onChange={(e) => onCurrentCountryChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Select your current country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Target Countries */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Countries (Select up to 3)
        </label>
        <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
          {countries.map((country) => (
            <label
              key={country.code}
              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <input
                type="checkbox"
                checked={targetCountries.includes(country.code)}
                onChange={() => handleTargetCountryToggle(country.code)}
                disabled={!targetCountries.includes(country.code) && targetCountries.length >= 3}
                className="mr-3 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-lg mr-2">{country.flag}</span>
              <span className="text-sm text-gray-700">{country.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Profession */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profession
        </label>
        <select
          value={profession}
          onChange={(e) => onProfessionChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Select your profession</option>
          {professions.map((prof) => (
            <option key={prof} value={prof}>
              {prof}
            </option>
          ))}
        </select>
      </div>

      {/* Visa Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span className="inline-flex items-center gap-2">
            📄 Visa Type
          </span>
        </label>
        <select
          value={visaType}
          onChange={(e) => onVisaTypeChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          {visaTypes.map((visa) => (
            <option key={visa} value={visa}>
              {visa}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};