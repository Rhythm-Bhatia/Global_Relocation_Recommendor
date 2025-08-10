import { Country, UserPreferences } from '../types';

export const calculateMigrationScore = (
  country: Country,
  preferences: UserPreferences
): number => {
  const weights = {
    economicOpportunities: preferences.economicOpportunities / 10,
    qualityOfLife: preferences.qualityOfLife / 10,
    safetyAndSecurity: preferences.safetyAndSecurity / 10,
    healthcareQuality: preferences.healthcareQuality / 10,
    climateSuitability: preferences.climateSuitability / 10
  };

  // Normalize metrics to 0-10 scale
  const normalizedMetrics = {
    economic: Math.min((country.metrics.gdpPerCapita / 10000) * 10 + (country.metrics.jobMarket / 10) * 10, 10) / 2,
    quality: (country.metrics.healthcareQuality + country.metrics.educationQuality + (10 - country.metrics.costOfLiving / 10)) / 3,
    safety: country.metrics.safetyIndex,
    healthcare: country.metrics.healthcareQuality,
    climate: country.metrics.climateScore
  };

  // Calculate weighted score
  const score = 
    (normalizedMetrics.economic * weights.economicOpportunities) +
    (normalizedMetrics.quality * weights.qualityOfLife) +
    (normalizedMetrics.safety * weights.safetyAndSecurity) +
    (normalizedMetrics.healthcare * weights.healthcareQuality) +
    (normalizedMetrics.climate * weights.climateSuitability);

  // Apply visa difficulty penalty
  const visaPenalty = {
    LOW: 0,
    MEDIUM: -0.5,
    HIGH: -1.0
  };

  const finalScore = Math.max(0, Math.min(10, score + visaPenalty[country.metrics.visaDifficulty]));
  
  return Math.round(finalScore * 10) / 10;
};