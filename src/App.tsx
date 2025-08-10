import React, { useState, useMemo } from 'react';
import { Globe, BarChart3, Users, Shield, Heart, Sun, DollarSign, Building2, Briefcase } from 'lucide-react';
import { CountrySelector } from './components/CountrySelector';
import { PrioritySliders } from './components/PrioritySliders';
import { AnalysisResults } from './components/AnalysisResults';
import { MetricsTable } from './components/MetricsTable';
import { ProsConsAnalysis } from './components/ProsConsAnalysis';
import { countryData, professions, visaTypes } from './data/mockData';
import { Country, UserPreferences, AnalysisResult } from './types';
import { calculateMigrationScore } from './utils/scoring';

function App() {
  const [currentCountry, setCurrentCountry] = useState<string>('');
  const [targetCountries, setTargetCountries] = useState<string[]>([]);
  const [profession, setProfession] = useState<string>('');
  const [visaType, setVisaType] = useState<string>('Work Visa');
  const [preferences, setPreferences] = useState<UserPreferences>({
    economicOpportunities: 7,
    qualityOfLife: 8,
    safetyAndSecurity: 6,
    healthcareQuality: 7,
    climateSuitability: 5
  });
  const [showResults, setShowResults] = useState<boolean>(false);

  const analysisResults: AnalysisResult[] = useMemo(() => {
    if (targetCountries.length === 0) return [];
    
    return targetCountries
      .map(countryCode => {
        const country = countryData.find(c => c.code === countryCode);
        if (!country) return null;
        
        const score = calculateMigrationScore(country, preferences);
        return {
          country,
          score,
          recommendation: score >= 8.5 ? 'Strongly recommended' : score >= 7 ? 'Recommended' : 'Consider with caution'
        };
      })
      .filter((result): result is AnalysisResult => result !== null)
      .sort((a, b) => b.score - a.score);
  }, [targetCountries, preferences]);

  const handleAnalyze = () => {
    if (targetCountries.length > 0) {
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-600 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Globe className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Global Relocation Analyzer</h1>
          </div>
          <p className="text-teal-100 text-lg">
            Find your ideal country for migration with data-driven insights
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 h-full overflow-y-auto">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Migration Analysis Settings
              </h2>
              
              <CountrySelector
                currentCountry={currentCountry}
                targetCountries={targetCountries}
                profession={profession}
                visaType={visaType}
                onCurrentCountryChange={setCurrentCountry}
                onTargetCountriesChange={setTargetCountries}
                onProfessionChange={setProfession}
                onVisaTypeChange={setVisaType}
                countries={countryData}
                professions={professions}
                visaTypes={visaTypes}
              />
              
              <PrioritySliders
                preferences={preferences}
                onPreferencesChange={setPreferences}
              />
              
              <button
                onClick={handleAnalyze}
                disabled={targetCountries.length === 0}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mt-6"
              >
                Analyze Migration Options
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border h-full overflow-y-auto">
              {!showResults ? (
                <div className="p-8 text-center h-full flex flex-col justify-center">
                  <div className="bg-teal-50 rounded-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                      Welcome to Global Relocation Analyzer
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Get comprehensive migration analysis based on your preferences and professional background.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6 text-left">
                      <div className="flex items-start gap-3">
                        <BarChart3 className="w-6 h-6 text-teal-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-800">Data-driven country analysis</h3>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-6 h-6 text-pink-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-800">Personalized recommendations</h3>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-6 h-6 text-purple-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-800">Interactive visualizations</h3>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-6 h-6 text-orange-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-800">Cost analysis & comparisons</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      <strong>Ready to start?</strong> Select your preferences on the left and click "Analyze Migration Options"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <AnalysisResults results={analysisResults} />
                  <MetricsTable results={analysisResults} />
                  <ProsConsAnalysis results={analysisResults} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;