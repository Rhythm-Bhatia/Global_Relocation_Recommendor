import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AnalysisResult } from '../types';

interface MetricsTableProps {
  results: AnalysisResult[];
}

export const MetricsTable: React.FC<MetricsTableProps> = ({ results }) => {
  const getVisaDifficultyBadge = (difficulty: string) => {
    const configs = {
      LOW: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: '✓' },
      MEDIUM: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: '⚠' },
      HIGH: { color: 'bg-red-100 text-red-800 border-red-200', icon: '✗' }
    };
    const config = configs[difficulty as keyof typeof configs] || configs.MEDIUM;
    return { ...config };
  };

  const ProgressBar: React.FC<{ value: number; max: number; color?: string; showTrend?: boolean }> = ({ 
    value, 
    max, 
    color = 'teal', 
    showTrend = false 
  }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const colorClasses = {
      teal: 'bg-teal-500',
      blue: 'bg-blue-500',
      green: 'bg-emerald-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500'
    };

    const getTrendIcon = () => {
      if (!showTrend) return null;
      if (percentage >= 80) return <TrendingUp className="w-3 h-3 text-green-600" />;
      if (percentage <= 40) return <TrendingDown className="w-3 h-3 text-red-600" />;
      return <Minus className="w-3 h-3 text-gray-600" />;
    };

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold min-w-[45px] text-gray-700">
          {max === 100 ? `${value}${max === 100 ? '%' : ''}` : `${value}/${max}`}
        </span>
        <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color as keyof typeof colorClasses]}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {getTrendIcon()}
      </div>
    );
  };

  const metrics = [
    { key: 'gdpPerCapita', label: '💰 GDP per Capita', format: 'currency', color: 'green' },
    { key: 'safetyIndex', label: '🛡️ Safety Index', max: 10, color: 'blue', showTrend: true },
    { key: 'healthcareQuality', label: '🏥 Healthcare Quality', max: 10, color: 'purple', showTrend: true },
    { key: 'educationQuality', label: '🎓 Education Quality', max: 10, color: 'teal', showTrend: true },
    { key: 'costOfLiving', label: '🏠 Cost of Living', max: 100, color: 'orange', showTrend: true },
    { key: 'climateScore', label: '🌤️ Climate Score', max: 10, color: 'blue', showTrend: true },
    { key: 'languageBarrier', label: '🗣️ Language Barrier', max: 10, color: 'red', showTrend: true },
    { key: 'taxRate', label: '📊 Tax Rate', max: 100, suffix: '%', color: 'orange' },
    { key: 'visaDifficulty', label: '📄 Visa Difficulty', isBadge: true },
    { key: 'infrastructure', label: '🏗️ Infrastructure', max: 10, color: 'teal', showTrend: true },
    { key: 'jobMarket', label: '💼 Job Market', max: 10, color: 'green', showTrend: true }
  ];

  if (results.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Detailed Metrics Comparison</h3>
          <p className="text-gray-600">Comprehensive analysis across all key factors</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="text-left p-6 font-bold text-gray-800 sticky left-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10 border-r border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <span>Metric</span>
                  </div>
                </th>
                {results.map((result, index) => (
                  <th key={result.country.code} className="text-center p-6 font-bold text-gray-800 min-w-[220px] border-r border-gray-200 last:border-r-0">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{result.country.flag}</span>
                        <span className="text-lg">{result.country.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-purple-500' : 'bg-blue-500'
                        }`}>
                          #{index + 1}
                        </div>
                        <span className="text-sm text-gray-600">Score: {result.score}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr key={metric.key} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                  <td className="p-6 font-semibold text-gray-800 sticky left-0 bg-inherit border-r border-gray-200 z-10">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{metric.label.split(' ')[0]}</span>
                      <span>{metric.label.substring(metric.label.indexOf(' ') + 1)}</span>
                    </div>
                  </td>
                  {results.map((result) => (
                    <td key={result.country.code} className="p-6 text-center border-r border-gray-200 last:border-r-0">
                      {metric.format === 'currency' ? (
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            ${(result.country.metrics[metric.key as keyof typeof result.country.metrics] as number).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">USD</div>
                        </div>
                      ) : metric.isBadge ? (
                        (() => {
                          const badge = getVisaDifficultyBadge(result.country.metrics.visaDifficulty);
                          return (
                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border ${badge.color}`}>
                              <span>{badge.icon}</span>
                              {result.country.metrics.visaDifficulty}
                            </span>
                          );
                        })()
                      ) : metric.suffix === '%' ? (
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">
                            {result.country.metrics[metric.key as keyof typeof result.country.metrics]}%
                          </div>
                        </div>
                      ) : (
                        <ProgressBar
                          value={result.country.metrics[metric.key as keyof typeof result.country.metrics] as number}
                          max={metric.max || 10}
                          color={metric.color}
                          showTrend={metric.showTrend}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};