from typing import List, Dict, Any, Optional
from data_fetcher import DataFetcher
import math

class MigrationAnalyzer:
    def __init__(self):
        self.data_fetcher = DataFetcher()

    def _normalize_metric(self, value: float, min_val: float, max_val: float) -> float:
        """Normalize metric to 0-10 scale"""
        if max_val == min_val:
            return 5.0
        normalized = ((value - min_val) / (max_val - min_val)) * 10
        return max(0, min(10, normalized))

    def _calculate_economic_score(self, metrics: Dict[str, Any]) -> float:
        """Calculate economic opportunities score"""
        gdp_score = self._normalize_metric(metrics['gdpPerCapita'], 2000, 85000)
        job_score = metrics['jobMarket']
        tax_penalty = (100 - metrics['taxRate']) / 10  # Lower tax = higher score
        
        return (gdp_score * 0.4 + job_score * 0.4 + tax_penalty * 0.2)

    def _calculate_quality_score(self, metrics: Dict[str, Any]) -> float:
        """Calculate quality of life score"""
        healthcare = metrics['healthcareQuality']
        education = metrics['educationQuality']
        infrastructure = metrics['infrastructure']
        cost_penalty = (150 - metrics['costOfLiving']) / 15  # Lower cost = higher score
        
        return (healthcare * 0.3 + education * 0.2 + infrastructure * 0.3 + cost_penalty * 0.2)

    def _calculate_migration_score(self, country: Dict[str, Any], preferences: Dict[str, float]) -> float:
        """Calculate overall migration score based on user preferences"""
        metrics = country['metrics']
        
        # Calculate component scores
        economic_score = self._calculate_economic_score(metrics)
        quality_score = self._calculate_quality_score(metrics)
        safety_score = metrics['safetyIndex']
        healthcare_score = metrics['healthcareQuality']
        climate_score = metrics['climateScore']
        
        # Apply user preference weights (normalize to 0-1)
        weights = {k: v / 10 for k, v in preferences.items()}
        
        # Calculate weighted score
        weighted_score = (
            economic_score * weights.get('economicOpportunities', 0.7) +
            quality_score * weights.get('qualityOfLife', 0.8) +
            safety_score * weights.get('safetyAndSecurity', 0.6) +
            healthcare_score * weights.get('healthcareQuality', 0.7) +
            climate_score * weights.get('climateSuitability', 0.5)
        ) / sum(weights.values())
        
        # Apply visa difficulty penalty
        visa_penalties = {'LOW': 0, 'MEDIUM': -0.5, 'HIGH': -1.0}
        visa_penalty = visa_penalties.get(metrics['visaDifficulty'], -0.5)
        
        # Apply language barrier penalty
        language_penalty = -metrics['languageBarrier'] * 0.1
        
        final_score = weighted_score + visa_penalty + language_penalty
        return max(0, min(10, final_score))

    def _get_recommendation(self, score: float) -> str:
        """Get recommendation based on score"""
        if score >= 8.5:
            return "Strongly recommended"
        elif score >= 7.0:
            return "Recommended"
        elif score >= 5.5:
            return "Consider with caution"
        else:
            return "Not recommended"

    async def analyze_migration(
        self,
        current_country: Optional[str],
        target_countries: List[str],
        profession: Optional[str],
        visa_type: str,
        preferences: Dict[str, float]
    ) -> List[Dict[str, Any]]:
        """Analyze migration options and return ranked results"""
        
        results = []
        
        for country_code in target_countries:
            country = await self.data_fetcher.get_country_by_code(country_code)
            if not country:
                continue
            
            # Calculate migration score
            score = self._calculate_migration_score(country, preferences)
            
            # Get recommendation
            recommendation = self._get_recommendation(score)
            
            # Calculate component scores for display
            economic_score = self._calculate_economic_score(country['metrics'])
            quality_score = self._calculate_quality_score(country['metrics'])
            safety_score = country['metrics']['safetyIndex']
            
            results.append({
                'country': country,
                'score': round(score, 1),
                'recommendation': recommendation,
                'component_scores': {
                    'economic': round(economic_score, 1),
                    'quality': round(quality_score, 1),
                    'safety': round(safety_score, 1)
                }
            })
        
        # Sort by score (highest first)
        results.sort(key=lambda x: x['score'], reverse=True)
        
        return results

    async def compare_countries(self, source: str, target: str) -> Dict[str, Any]:
        """Compare two countries directly"""
        source_country = await self.data_fetcher.get_country_by_code(source)
        target_country = await self.data_fetcher.get_country_by_code(target)
        
        if not source_country or not target_country:
            raise ValueError("One or both countries not found")
        
        comparison = {
            'source': source_country,
            'target': target_country,
            'metrics_comparison': {}
        }
        
        # Compare each metric
        for metric in source_country['metrics']:
            source_val = source_country['metrics'][metric]
            target_val = target_country['metrics'][metric]
            
            if isinstance(source_val, (int, float)) and isinstance(target_val, (int, float)):
                difference = target_val - source_val
                percentage_change = (difference / source_val * 100) if source_val != 0 else 0
                
                comparison['metrics_comparison'][metric] = {
                    'source_value': source_val,
                    'target_value': target_val,
                    'difference': difference,
                    'percentage_change': round(percentage_change, 1)
                }
        
        return comparison