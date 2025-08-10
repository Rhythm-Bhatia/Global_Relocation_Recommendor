import React from 'react';
import { AnalysisResult } from '../types';

interface MetricsTableProps {
  results: AnalysisResult[];
}

export const MetricsTable: React.FC<MetricsTableProps> = ({ results }) => {
  const getVisaDifficultyBadge = (difficulty: string) => {
    const colors = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || colors.MEDIUM;
  };

  const ProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => {
    const percentage = (value / max) * 100;
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium min-w-[40px]">
          {max === 100 ? value : `${value}/${max}`}
        </span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  const metrics = [
    { key: 'educationQuality', label: '🎓 Education Quality', icon: '🎓', max: 10 },
    { key: 'costOfLiving', label: '💰 Cost of Living', icon: '💰', max: 100 },
    { key: 'climateScore', label: '🌤️ Climate Score', icon: '🌤️', max: 10 },
    { key: 'languageBarrier', label: '🗣️ Language Barrier', icon: '🗣️', max: 10 },
    { key: 'taxRate', label: '📊 Tax Rate', icon: '📊', max: 100, suffix: '%' },
    { key: 'visaDifficulty', label: '📄 Visa Difficulty', icon: '📄', isBadge: true },
    { key: 'infrastructure', label: '🏗️ Infrastructure', icon: '🏗️', max: 10 },
    { key: 'jobMarket', label: '💼 Job Market', icon: '💼', max: 10 }
  ];

  if (results.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Detailed Metrics Comparison</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700 sticky left-0 bg-gray-50">
                  Metric
                </th>
                {results.map((result) => (
                  <th key={result.country.code} className="text-center p-4 font-medium text-gray-700 min-w-[200px]">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl">{result.country.flag}</span>
                      <span>{result.country.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr key={metric.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-4 font-medium text-gray-700 sticky left-0 bg-inherit">
                    <div className="flex items-center gap-2">
                      <span>{metric.icon}</span>
                      <span>{metric.label.replace(metric.icon + ' ', '')}</span>
                    </div>
                  </td>
                  {results.map((result) => (
                    <td key={result.country.code} className="p-4 text-center">
                      {metric.isBadge ? (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getVisaDifficultyBadge(result.country.metrics.visaDifficulty)}`}>
                          {result.country.metrics.visaDifficulty}
                        </span>
                      ) : metric.suffix === '%' ? (
                        <span className="text-sm font-medium">
                          {result.country.metrics[metric.key as keyof typeof result.country.metrics]}%
                        </span>
                      ) : (
                        <ProgressBar
                          value={result.country.metrics[metric.key as keyof typeof result.country.metrics] as number}
                          max={metric.max}
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