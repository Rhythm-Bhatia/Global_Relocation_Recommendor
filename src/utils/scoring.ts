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

  // Normalize GDP per capita (realistic range: $2,000 - $85,000)
  const normalizedGDP = Math.min(10, Math.max(0, (country.metrics.gdpPerCapita - 2000) / 8300));
  
  // Calculate component scores with realistic scaling
  const economicScore = (
    normalizedGDP * 0.4 + 
    (country.metrics.jobMarket / 10) * 10 * 0.4 + 
    ((100 - country.metrics.taxRate) / 10) * 0.2
  );

  const qualityScore = (
    (country.metrics.healthcareQuality / 10) * 10 * 0.3 +
    (country.metrics.educationQuality / 10) * 10 * 0.25 +
    (country.metrics.infrastructure / 10) * 10 * 0.25 +
    Math.max(0, (120 - country.metrics.costOfLiving) / 12) * 0.2
  );

  const safetyScore = (country.metrics.safetyIndex / 10) * 10;
  const healthcareScore = (country.metrics.healthcareQuality / 10) * 10;
  const climateScore = (country.metrics.climateScore / 10) * 10;

  // Calculate weighted base score
  const baseScore = (
    economicScore * weights.economicOpportunities +
    qualityScore * weights.qualityOfLife +
    safetyScore * weights.safetyAndSecurity +
    healthcareScore * weights.healthcareQuality +
    climateScore * weights.climateSuitability
  ) / (weights.economicOpportunities + weights.qualityOfLife + weights.safetyAndSecurity + weights.healthcareQuality + weights.climateSuitability);

  // Apply penalties for realistic scoring
  let finalScore = baseScore;

  // Visa difficulty penalty
  const visaPenalties = {
    'LOW': 0,
    'MEDIUM': -0.8,
    'HIGH': -1.5
  };
  finalScore += visaPenalties[country.metrics.visaDifficulty] || -0.8;

  // Language barrier penalty (more significant impact)
  finalScore -= (country.metrics.languageBarrier / 10) * 1.2;

  // Cost of living penalty for very expensive countries
  if (country.metrics.costOfLiving > 100) {
    finalScore -= (country.metrics.costOfLiving - 100) / 50;
  }

  // Tax rate penalty for high tax countries
  if (country.metrics.taxRate > 35) {
    finalScore -= (country.metrics.taxRate - 35) / 20;
  }

  // Ensure realistic score distribution between 4.5 and 9.2
  finalScore = Math.max(4.5, Math.min(9.2, finalScore));
  
  // Add small random variation to prevent identical scores
  const variation = (Math.random() - 0.5) * 0.3;
  finalScore += variation;
  
  return Math.round(finalScore * 10) / 10;
};

export const getComponentScores = (country: Country) => {
  const normalizedGDP = Math.min(10, Math.max(0, (country.metrics.gdpPerCapita - 2000) / 8300));
  
  const economic = (
    normalizedGDP * 0.4 + 
    (country.metrics.jobMarket / 10) * 10 * 0.4 + 
    ((100 - country.metrics.taxRate) / 10) * 0.2
  );

  const quality = (
    (country.metrics.healthcareQuality / 10) * 10 * 0.3 +
    (country.metrics.educationQuality / 10) * 10 * 0.25 +
    (country.metrics.infrastructure / 10) * 10 * 0.25 +
    Math.max(0, (120 - country.metrics.costOfLiving) / 12) * 0.2
  );

  const safety = (country.metrics.safetyIndex / 10) * 10;

  return {
    economic: Math.round(economic * 10) / 10,
    quality: Math.round(quality * 10) / 10,
    safety: Math.round(safety * 10) / 10
  };
};