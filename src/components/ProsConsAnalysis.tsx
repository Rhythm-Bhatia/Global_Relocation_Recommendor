import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ProsConsAnalysisProps {
  results: AnalysisResult[];
}

export const ProsConsAnalysis: React.FC<ProsConsAnalysisProps> = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">⚖️</span>
        <h3 className="text-lg font-semibold text-gray-800">Pros & Cons Analysis</h3>
      </div>
      <p className="text-gray-600 mb-6">Detailed advantages and challenges for each country</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result) => (
          <div key={result.country.code} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">{result.country.flag}</span>
              <h4 className="text-lg font-semibold text-gray-800">{result.country.name} Analysis</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Comprehensive pros and cons evaluation</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Key Advantages</span>
                </div>
                <ul className="space-y-2 ml-7">
                  {result.country.pros.map((pro, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">Challenges</span>
                </div>
                <ul className="space-y-2 ml-7">
                  {result.country.cons.map((con, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};