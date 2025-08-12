import React from 'react';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { AnalysisResult } from '../types';
import { getComponentScores } from '../utils/scoring';

interface AnalysisResultsProps {
  results: AnalysisResult[];
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const getRecommendationBadge = (index: number, score: number) => {
    if (index === 0) {
      return { 
        label: '1ST RECOMMENDED CHOICE', 
        color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
        icon: Trophy,
        textColor: 'text-white'
      };
    } else if (index === 1) {
      return { 
        label: '2ND RECOMMENDED CHOICE', 
        color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
        icon: Medal,
        textColor: 'text-white'
      };
    } else if (index === 2) {
      return { 
        label: '3RD RECOMMENDED CHOICE', 
        color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
        icon: Award,
        textColor: 'text-white'
      };
    }
    return { 
      label: 'CONSIDER', 
      color: 'bg-gradient-to-r from-gray-400 to-gray-600',
      icon: Star,
      textColor: 'text-white'
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-600';
    if (score >= 7.5) return 'text-blue-600';
    if (score >= 6.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8.5) return 'from-emerald-500 to-teal-600';
    if (score >= 7.5) return 'from-blue-500 to-indigo-600';
    if (score >= 6.5) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Migration Analysis Results</h2>
          <p className="text-gray-600">Ranked by compatibility with your preferences</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {results.map((result, index) => {
          const badge = getRecommendationBadge(index, result.score);
          const componentScores = getComponentScores(result.country);
          const IconComponent = badge.icon;
          
          return (
            <div key={result.country.code} className="group relative">
              {/* Rank indicator */}
              <div className="absolute -top-3 -left-3 z-10">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-sm">#{index + 1}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <div className="w-full h-full bg-gradient-to-br from-teal-400 to-blue-600 rounded-full transform translate-x-16 -translate-y-16"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{result.country.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{result.country.name}</h3>
                      <p className="text-sm text-gray-500">Migration Destination</p>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className={`text-4xl font-black mb-2 bg-gradient-to-r ${getScoreGradient(result.score)} bg-clip-text text-transparent`}>
                      {result.score}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">COMPATIBILITY SCORE</div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${badge.color} ${badge.textColor} shadow-md`}>
                      <IconComponent className="w-4 h-4" />
                      {badge.label}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3">
                      <div className="text-xs text-orange-600 font-semibold mb-1">ECONOMIC</div>
                      <div className="text-lg font-bold text-orange-700">{componentScores.economic}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
                      <div className="text-xs text-purple-600 font-semibold mb-1">QUALITY</div>
                      <div className="text-lg font-bold text-purple-700">{componentScores.quality}</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
                      <div className="text-xs text-blue-600 font-semibold mb-1">SAFETY</div>
                      <div className="text-lg font-bold text-blue-700">{componentScores.safety}</div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>GDP: ${(result.country.metrics.gdpPerCapita / 1000).toFixed(0)}k</span>
                      <span>Safety: {result.country.metrics.safetyIndex}/10</span>
                      <span>Cost: {result.country.metrics.costOfLiving}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};