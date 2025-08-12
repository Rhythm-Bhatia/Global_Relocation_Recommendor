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
      color: 'orange',
      description: 'GDP, job market, tax rates'
    },
    {
      key: 'qualityOfLife' as keyof UserPreferences,
      label: 'Quality of Life',
      icon: Heart,
      color: 'pink',
      description: 'Healthcare, education, infrastructure'
    },
    {
      key: 'safetyAndSecurity' as keyof UserPreferences,
      label: 'Safety & Security',
      icon: Shield,
      color: 'blue',
      description: 'Crime rates, political stability'
    },
    {
      key: 'healthcareQuality' as keyof UserPreferences,
      label: 'Healthcare Quality',
      icon: Building2,
      color: 'purple',
      description: 'Medical facilities, accessibility'
    },
    {
      key: 'climateSuitability' as keyof UserPreferences,
      label: 'Climate Suitability',
      icon: Sun,
      color: 'yellow',
      description: 'Weather, seasonal variation'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      orange: {
        bg: 'from-orange-50 to-orange-100',
        icon: 'text-orange-600',
        slider: 'accent-orange-500',
        badge: 'bg-orange-500 border-orange-600'
      },
      pink: {
        bg: 'from-pink-50 to-pink-100',
        icon: 'text-pink-600',
        slider: 'accent-pink-500',
        badge: 'bg-pink-500 border-pink-600'
      },
      blue: {
        bg: 'from-blue-50 to-blue-100',
        icon: 'text-blue-600',
        slider: 'accent-blue-500',
        badge: 'bg-blue-500 border-blue-600'
      },
      purple: {
        bg: 'from-purple-50 to-purple-100',
        icon: 'text-purple-600',
        slider: 'accent-purple-500',
        badge: 'bg-purple-500 border-purple-600'
      },
      yellow: {
        bg: 'from-yellow-50 to-yellow-100',
        icon: 'text-yellow-600',
        slider: 'accent-yellow-500',
        badge: 'bg-yellow-500 border-yellow-600'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Your Priorities</h3>
          <p className="text-sm text-gray-600">Adjust the importance of each factor (1=Low, 10=High)</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {sliders.map(({ key, label, icon: Icon, color, description }) => {
          const colorClasses = getColorClasses(color);
          const value = preferences[key];
          
          return (
            <div key={key} className={`bg-gradient-to-r ${colorClasses.bg} rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-white rounded-lg shadow-sm border-2 ${colorClasses.icon.replace('text-', 'border-')}`}>
                    <Icon className={`w-5 h-5 ${colorClasses.icon}`} />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 text-lg">{label}</span>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                </div>
                <div className={`${colorClasses.badge} border-2 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg`}>
                  <span className="font-black text-lg">{value}</span>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={value}
                  onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                  className={`w-full h-3 bg-white rounded-lg appearance-none cursor-pointer shadow-inner ${colorClasses.slider}`}
                  style={{
                    background: `linear-gradient(to right, ${color === 'orange' ? '#f97316' : color === 'pink' ? '#ec4899' : color === 'blue' ? '#3b82f6' : color === 'purple' ? '#8b5cf6' : '#eab308'} 0%, ${color === 'orange' ? '#f97316' : color === 'pink' ? '#ec4899' : color === 'blue' ? '#3b82f6' : color === 'purple' ? '#8b5cf6' : '#eab308'} ${(value - 1) * 11.11}%, #ffffff ${(value - 1) * 11.11}%, #ffffff 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                  <span className="font-medium">Low Priority</span>
                  <span className="font-medium">High Priority</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};