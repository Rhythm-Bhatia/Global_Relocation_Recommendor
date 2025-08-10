import React from 'react';
import { DollarSign, Heart, Shield, Building2, Sun } from 'lucide-react';
import { UserPreferences } from '../types';

interface PrioritySlidersProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
}

export const PrioritySliders: React.FC<PrioritySlidersProps> = ({
  preferences,
  onPreferencesChange
}) => {
  const handleSliderChange = (key: keyof UserPreferences, value: number) => {
    onPreferencesChange({
      ...preferences,
      [key]: value
    });
  };

  const sliders = [
    {
      key: 'economicOpportunities' as keyof UserPreferences,
      label: 'Economic Opportunities',
      icon: DollarSign,
      color: 'text-orange-600'
    },
    {
      key: 'qualityOfLife' as keyof UserPreferences,
      label: 'Quality of Life',
      icon: Heart,
      color: 'text-pink-600'
    },
    {
      key: 'safetyAndSecurity' as keyof UserPreferences,
      label: 'Safety & Security',
      icon: Shield,
      color: 'text-blue-600'
    },
    {
      key: 'healthcareQuality' as keyof UserPreferences,
      label: 'Healthcare Quality',
      icon: Building2,
      color: 'text-purple-600'
    },
    {
      key: 'climateSuitability' as keyof UserPreferences,
      label: 'Climate Suitability',
      icon: Sun,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center gap-2">
        ⚖️ Your Priorities
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Adjust the importance of each factor (1=Low, 10=High)
      </p>
      
      <div className="space-y-6">
        {sliders.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="font-medium text-gray-800">{label}</span>
              </div>
              <div className="bg-white border-2 border-teal-500 rounded-full w-10 h-10 flex items-center justify-center">
                <span className="font-bold text-teal-700">{preferences[key]}</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={preferences[key]}
              onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
              style={{
                background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${(preferences[key] - 1) * 11.11}%, #e5e7eb ${(preferences[key] - 1) * 11.11}%, #e5e7eb 100%)`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};