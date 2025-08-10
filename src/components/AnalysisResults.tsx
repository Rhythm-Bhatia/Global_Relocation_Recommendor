import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisResultsProps {
  results: AnalysisResult[];
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const getRecommendationBadge = (index: number, recommendation: string) => {
    const badges = [
      { label: '1ST RECOMMENDED CHOICE', color: 'bg-orange-500' },
      { label: '2ND RECOMMENDED CHOICE', color: 'bg-purple-500' },
      { label: '3RD RECOMMENDED CHOICE', color: 'bg-blue-500' }
    ];
    
    return badges[index] || { label: 'CONSIDER', color: 'bg-gray-500' };
  };

  const getScoreMetrics = (country: AnalysisResult['country']) => ({
    economic: ((country.metrics.gdpPerCapita / 10000) + (country.metrics.jobMarket / 10) * 5).toFixed(1),
    quality: ((country.metrics.healthcareQuality + country.metrics.educationQuality) / 2).toFixed(1),
    safety: (country.metrics.safetyIndex / 10).toFixed(1)
  });

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">👑</span>
        <h2 className="text-xl font-semibold text-gray-800">Migration Analysis Results</h2>
      </div>
      <p className="text-gray-600 mb-6">Ranked by compatibility with your preferences</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {results.map((result, index) => {
          const badge = getRecommendationBadge(index, result.recommendation);
          const metrics = getScoreMetrics(result.country);
          
          return (
            <div key={result.country.code} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{result.country.flag}</span>
                <h3 className="text-lg font-semibold text-gray-800">{result.country.name}</h3>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  {result.score.toFixed(1)}
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${badge.color}`}>
                  {badge.label}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-gray-600">ECONOMIC</div>
                  <div className="font-semibold text-gray-800">{metrics.economic}</div>
                </div>
                <div>
                  <div className="text-gray-600">QUALITY</div>
                  <div className="font-semibold text-gray-800">{metrics.quality}</div>
                </div>
                <div>
                  <div className="text-gray-600">SAFETY</div>
                  <div className="font-semibold text-gray-800">{metrics.safety}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};