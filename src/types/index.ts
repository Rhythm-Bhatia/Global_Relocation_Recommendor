export interface Country {
  code: string;
  name: string;
  flag: string;
  metrics: {
    gdpPerCapita: number;
    safetyIndex: number;
    healthcareQuality: number;
    educationQuality: number;
    costOfLiving: number;
    climateScore: number;
    languageBarrier: number;
    taxRate: number;
    visaDifficulty: 'LOW' | 'MEDIUM' | 'HIGH';
    infrastructure: number;
    jobMarket: number;
  };
  pros: string[];
  cons: string[];
}

export interface UserPreferences {
  economicOpportunities: number;
  qualityOfLife: number;
  safetyAndSecurity: number;
  healthcareQuality: number;
  climateSuitability: number;
}

export interface AnalysisResult {
  country: Country;
  score: number;
  recommendation: string;
}