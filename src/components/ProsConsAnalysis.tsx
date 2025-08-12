import React from 'react';
import { CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ProsConsAnalysisProps {
  results: AnalysisResult[];
}

export const ProsConsAnalysis: React.FC<ProsConsAnalysisProps> = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Pros & Cons Analysis</h3>
          <p className="text-gray-600">Detailed advantages and challenges for each country</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.map((result, index) => (
          <div key={result.country.code} className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{result.country.flag}</span>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{result.country.name}</h4>
                    <p className="text-sm text-gray-600">Comprehensive evaluation</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-purple-500' : 'bg-blue-500'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-teal-600">{result.score}</div>
                    <div className="text-xs text-gray-500">SCORE</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Advantages */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <span className="font-bold text-emerald-800 text-lg">Key Advantages</span>
                      <p className="text-sm text-emerald-600">{result.country.pros.length} major benefits</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                    <ul className="space-y-3">
                      {result.country.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Challenges */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <span className="font-bold text-red-800 text-lg">Key Challenges</span>
                      <p className="text-sm text-red-600">{result.country.cons.length} considerations</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
                    <ul className="space-y-3">
                      {result.country.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-blue-600 font-semibold mb-1">VISA</div>
                    <div className="text-sm font-bold text-blue-700">{result.country.metrics.visaDifficulty}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-xs text-purple-600 font-semibold mb-1">LANGUAGE</div>
                    <div className="text-sm font-bold text-purple-700">{result.country.metrics.languageBarrier}/10</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="text-xs text-orange-600 font-semibold mb-1">COST</div>
                    <div className="text-sm font-bold text-orange-700">{result.country.metrics.costOfLiving}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};