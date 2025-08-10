import aiosqlite
import httpx
import asyncio
import json
from typing import List, Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataFetcher:
    def __init__(self, db_path: str = "migration_data.db"):
        self.db_path = db_path
        self.countries_data = self._get_initial_countries_data()

    def _get_initial_countries_data(self) -> List[Dict[str, Any]]:
        """Initial country data with comprehensive metrics"""
        return [
            {
                "code": "NL", "name": "Netherlands", "flag": "🇳🇱",
                "metrics": {
                    "gdpPerCapita": 52331, "safetyIndex": 8.7, "healthcareQuality": 8.9,
                    "educationQuality": 9.0, "costOfLiving": 88, "climateScore": 6.8,
                    "languageBarrier": 4.0, "taxRate": 29, "visaDifficulty": "MEDIUM",
                    "infrastructure": 8.9, "jobMarket": 8.3
                },
                "pros": [
                    "Excellent work-life balance and progressive work culture",
                    "High-quality healthcare system with universal coverage",
                    "Strong English proficiency among population",
                    "Excellent cycling infrastructure and sustainable transport",
                    "High quality of education and research institutions",
                    "Stable political environment and strong rule of law"
                ],
                "cons": [
                    "High cost of living, especially housing in major cities",
                    "Complex tax system with relatively high tax rates",
                    "Challenging housing market with limited availability",
                    "Weather can be unpredictable with frequent rain",
                    "Bureaucratic processes can be slow and complex",
                    "Social integration may take time for non-EU citizens"
                ]
            },
            {
                "code": "FI", "name": "Finland", "flag": "🇫🇮",
                "metrics": {
                    "gdpPerCapita": 48810, "safetyIndex": 9.2, "healthcareQuality": 9.0,
                    "educationQuality": 9.4, "costOfLiving": 90, "climateScore": 5.8,
                    "languageBarrier": 8.0, "taxRate": 30, "visaDifficulty": "MEDIUM",
                    "infrastructure": 8.6, "jobMarket": 7.9
                },
                "pros": [
                    "World-class education system and high literacy rates",
                    "Excellent work-life balance with strong labor protections",
                    "Very low crime rates and high personal safety",
                    "Beautiful natural landscapes and clean environment",
                    "Strong social safety net and universal healthcare",
                    "High levels of government transparency and low corruption"
                ],
                "cons": [
                    "Very challenging climate with long, dark winters",
                    "Finnish language is extremely difficult to learn",
                    "Limited job market in certain sectors",
                    "High cost of living, especially alcohol and dining out",
                    "Social culture can be reserved, making integration challenging",
                    "Limited sunlight during winter months affecting mental health"
                ]
            },
            {
                "code": "PT", "name": "Portugal", "flag": "🇵🇹",
                "metrics": {
                    "gdpPerCapita": 23252, "safetyIndex": 8.5, "healthcareQuality": 7.8,
                    "educationQuality": 7.8, "costOfLiving": 65, "climateScore": 9.0,
                    "languageBarrier": 7.5, "taxRate": 21.5, "visaDifficulty": "MEDIUM",
                    "infrastructure": 7.5, "jobMarket": 6.5
                },
                "pros": [
                    "Excellent climate with 300+ days of sunshine annually",
                    "Relatively low cost of living compared to Western Europe",
                    "Beautiful coastline and natural landscapes",
                    "Growing tech sector and startup ecosystem",
                    "Friendly and welcoming local population",
                    "Strategic location with easy access to Europe and Africa"
                ],
                "cons": [
                    "Lower average salaries compared to Northern Europe",
                    "Limited job opportunities in specialized fields",
                    "Bureaucratic processes can be slow and inefficient",
                    "Portuguese language barrier for career advancement",
                    "Economic instability and high youth unemployment",
                    "Infrastructure gaps in rural areas and smaller cities"
                ]
            },
            {
                "code": "CA", "name": "Canada", "flag": "🇨🇦",
                "metrics": {
                    "gdpPerCapita": 43241, "safetyIndex": 8.9, "healthcareQuality": 8.5,
                    "educationQuality": 8.7, "costOfLiving": 75, "climateScore": 6.2,
                    "languageBarrier": 2.0, "taxRate": 26, "visaDifficulty": "MEDIUM",
                    "infrastructure": 8.2, "jobMarket": 8.1
                },
                "pros": [
                    "Excellent immigration programs with clear pathways to citizenship",
                    "Universal healthcare system",
                    "Cultural diversity and multicultural society",
                    "High quality of life and excellent education system",
                    "Abundant natural resources and beautiful landscapes",
                    "Strong economy with opportunities in multiple sectors"
                ],
                "cons": [
                    "Extremely cold winters in most regions",
                    "High cost of living in major cities like Toronto and Vancouver",
                    "Long wait times for certain medical procedures",
                    "Competitive job market requiring Canadian experience",
                    "Geographic isolation from family/friends in other continents",
                    "High taxes, especially in certain provinces"
                ]
            },
            {
                "code": "AU", "name": "Australia", "flag": "🇦🇺",
                "metrics": {
                    "gdpPerCapita": 55060, "safetyIndex": 8.4, "healthcareQuality": 8.3,
                    "educationQuality": 8.8, "costOfLiving": 95, "climateScore": 8.5,
                    "languageBarrier": 1.0, "taxRate": 32, "visaDifficulty": "HIGH",
                    "infrastructure": 8.1, "jobMarket": 7.8
                },
                "pros": [
                    "Excellent climate and outdoor lifestyle opportunities",
                    "High wages and strong job market in key sectors",
                    "World-class universities and education system",
                    "Universal healthcare system (Medicare)",
                    "Cultural diversity and English-speaking environment",
                    "Beautiful natural landscapes and beaches"
                ],
                "cons": [
                    "Extremely high cost of living in major cities",
                    "Geographic isolation from rest of the world",
                    "Strict and expensive visa requirements",
                    "Natural disasters (bushfires, floods, cyclones)",
                    "Expensive domestic travel due to large distances",
                    "Competitive job market with preference for local experience"
                ]
            },
            {
                "code": "DE", "name": "Germany", "flag": "🇩🇪",
                "metrics": {
                    "gdpPerCapita": 46258, "safetyIndex": 8.6, "healthcareQuality": 8.7,
                    "educationQuality": 8.5, "costOfLiving": 82, "climateScore": 6.5,
                    "languageBarrier": 7.0, "taxRate": 35, "visaDifficulty": "MEDIUM",
                    "infrastructure": 8.8, "jobMarket": 8.4
                },
                "pros": [
                    "Strong economy with excellent job opportunities in engineering and tech",
                    "Excellent public transportation and infrastructure",
                    "High-quality healthcare system",
                    "Central location in Europe for travel and business",
                    "Strong worker protections and benefits",
                    "Rich cultural heritage and history"
                ],
                "cons": [
                    "German language is essential for career advancement",
                    "Bureaucratic processes can be complex and slow",
                    "Relatively high tax rates",
                    "Weather can be gray and cold for extended periods",
                    "Formal business culture that may seem rigid",
                    "Paperwork-heavy administrative processes"
                ]
            },
            {
                "code": "CH", "name": "Switzerland", "flag": "🇨🇭",
                "metrics": {
                    "gdpPerCapita": 81867, "safetyIndex": 9.5, "healthcareQuality": 9.2,
                    "educationQuality": 8.9, "costOfLiving": 125, "climateScore": 7.2,
                    "languageBarrier": 6.5, "taxRate": 22, "visaDifficulty": "HIGH",
                    "infrastructure": 9.4, "jobMarket": 8.7
                },
                "pros": [
                    "Highest wages globally with excellent job opportunities",
                    "World-class infrastructure and public transportation",
                    "Extremely safe with very low crime rates",
                    "Beautiful alpine landscapes and outdoor recreation",
                    "Political stability and excellent governance",
                    "Central European location for business and travel"
                ],
                "cons": [
                    "Extremely high cost of living (highest globally)",
                    "Very difficult visa and residency requirements for non-EU citizens",
                    "Multiple language requirements (German, French, Italian)",
                    "Conservative social culture with strict social norms",
                    "Limited social integration opportunities for foreigners",
                    "Expensive healthcare despite high quality"
                ]
            },
            {
                "code": "SG", "name": "Singapore", "flag": "🇸🇬",
                "metrics": {
                    "gdpPerCapita": 59797, "safetyIndex": 9.8, "healthcareQuality": 9.1,
                    "educationQuality": 8.6, "costOfLiving": 105, "climateScore": 7.8,
                    "languageBarrier": 2.5, "taxRate": 17, "visaDifficulty": "MEDIUM",
                    "infrastructure": 9.6, "jobMarket": 8.0
                },
                "pros": [
                    "Extremely safe with world-class law and order",
                    "Strategic location as gateway to Asia",
                    "Excellent infrastructure and smart city initiatives",
                    "Low tax rates and business-friendly environment",
                    "Cultural diversity with English as working language",
                    "Excellent healthcare and education systems"
                ],
                "cons": [
                    "Very high cost of living, especially housing and cars",
                    "Hot and humid tropical climate year-round",
                    "Strict laws and regulations with heavy penalties",
                    "High stress and competitive work environment",
                    "Limited space and dense urban living",
                    "Expensive to maintain Western lifestyle"
                ]
            },
            {
                "code": "NZ", "name": "New Zealand", "flag": "🇳🇿",
                "metrics": {
                    "gdpPerCapita": 42084, "safetyIndex": 8.8, "healthcareQuality": 8.2,
                    "educationQuality": 8.4, "costOfLiving": 85, "climateScore": 8.2,
                    "languageBarrier": 1.0, "taxRate": 28, "visaDifficulty": "MEDIUM",
                    "infrastructure": 7.8, "jobMarket": 7.5
                },
                "pros": [
                    "Stunning natural beauty and outdoor lifestyle",
                    "Clean environment and low pollution",
                    "Friendly and welcoming culture",
                    "Good work-life balance",
                    "English-speaking country",
                    "Stable political system"
                ],
                "cons": [
                    "Geographic isolation from rest of the world",
                    "Limited job market in specialized fields",
                    "High cost of living relative to wages",
                    "Expensive to travel internationally",
                    "Limited cultural diversity in smaller cities",
                    "Earthquake risk in some regions"
                ]
            },
            {
                "code": "JP", "name": "Japan", "flag": "🇯🇵",
                "metrics": {
                    "gdpPerCapita": 39285, "safetyIndex": 9.4, "healthcareQuality": 8.8,
                    "educationQuality": 8.3, "costOfLiving": 92, "climateScore": 7.0,
                    "languageBarrier": 9.0, "taxRate": 30, "visaDifficulty": "HIGH",
                    "infrastructure": 9.2, "jobMarket": 6.8
                },
                "pros": [
                    "Extremely safe society with low crime rates",
                    "Excellent public transportation system",
                    "Rich culture and history",
                    "High-quality healthcare system",
                    "Advanced technology and innovation",
                    "Clean and organized cities"
                ],
                "cons": [
                    "Very difficult language barrier",
                    "Rigid work culture with long hours",
                    "Expensive cost of living in major cities",
                    "Difficult visa requirements for permanent residency",
                    "Natural disaster risks (earthquakes, tsunamis)",
                    "Aging population and shrinking workforce"
                ]
            },
            {
                "code": "KR", "name": "South Korea", "flag": "🇰🇷",
                "metrics": {
                    "gdpPerCapita": 31846, "safetyIndex": 8.2, "healthcareQuality": 8.5,
                    "educationQuality": 8.7, "costOfLiving": 78, "climateScore": 6.8,
                    "languageBarrier": 8.5, "taxRate": 24, "visaDifficulty": "MEDIUM",
                    "infrastructure": 8.9, "jobMarket": 7.2
                },
                "pros": [
                    "Advanced technology and digital infrastructure",
                    "Excellent healthcare system",
                    "Strong education system",
                    "Growing international business opportunities",
                    "Rich cultural heritage",
                    "Efficient public transportation"
                ],
                "cons": [
                    "Intense work culture and long hours",
                    "Language barrier for non-Korean speakers",
                    "High competition in job market",
                    "Air pollution in major cities",
                    "Social pressure and conformity expectations",
                    "Limited international community outside Seoul"
                ]
            },
            {
                "code": "IN", "name": "India", "flag": "🇮🇳",
                "metrics": {
                    "gdpPerCapita": 2256, "safetyIndex": 6.2, "healthcareQuality": 6.8,
                    "educationQuality": 6.5, "costOfLiving": 25, "climateScore": 6.5,
                    "languageBarrier": 3.0, "taxRate": 30, "visaDifficulty": "LOW",
                    "infrastructure": 5.8, "jobMarket": 6.0
                },
                "pros": [
                    "Very low cost of living",
                    "Growing tech and startup ecosystem",
                    "English widely spoken in business",
                    "Rich cultural diversity and heritage",
                    "Large domestic market opportunities",
                    "Relatively easy visa processes"
                ],
                "cons": [
                    "Significant infrastructure challenges",
                    "Air pollution in major cities",
                    "Income inequality and poverty",
                    "Bureaucratic processes can be slow",
                    "Healthcare quality varies significantly",
                    "Traffic congestion and transportation issues"
                ]
            },
            {
                "code": "US", "name": "United States", "flag": "🇺🇸",
                "metrics": {
                    "gdpPerCapita": 63544, "safetyIndex": 7.8, "healthcareQuality": 8.1,
                    "educationQuality": 8.2, "costOfLiving": 100, "climateScore": 7.5,
                    "languageBarrier": 1.0, "taxRate": 24, "visaDifficulty": "HIGH",
                    "infrastructure": 7.9, "jobMarket": 8.5
                },
                "pros": [
                    "World's largest economy with diverse job opportunities",
                    "Leading universities and research institutions",
                    "Cultural diversity and entrepreneurial spirit",
                    "High salaries in tech and professional sectors",
                    "Innovation hub with venture capital access",
                    "English-speaking environment"
                ],
                "cons": [
                    "Very expensive healthcare system",
                    "Complex and lengthy visa processes",
                    "High cost of living in major cities",
                    "Limited social safety net compared to Europe",
                    "Gun violence and safety concerns in some areas",
                    "Work-life balance challenges in competitive sectors"
                ]
            },
            {
                "code": "GB", "name": "United Kingdom", "flag": "🇬🇧",
                "metrics": {
                    "gdpPerCapita": 42330, "safetyIndex": 8.2, "healthcareQuality": 8.4,
                    "educationQuality": 8.6, "costOfLiving": 95, "climateScore": 6.0,
                    "languageBarrier": 1.0, "taxRate": 32, "visaDifficulty": "HIGH",
                    "infrastructure": 8.3, "jobMarket": 7.8
                },
                "pros": [
                    "English-speaking country with rich cultural heritage",
                    "Strong financial and tech sectors",
                    "Universal healthcare system (NHS)",
                    "Excellent universities and education system",
                    "Gateway to Europe for business",
                    "Diverse and multicultural society"
                ],
                "cons": [
                    "High cost of living, especially in London",
                    "Unpredictable weather and limited sunshine",
                    "Post-Brexit visa complications for EU citizens",
                    "High taxes and expensive public transport",
                    "Housing shortage and expensive property market",
                    "NHS waiting times for non-emergency procedures"
                ]
            },
            {
                "code": "FR", "name": "France", "flag": "🇫🇷",
                "metrics": {
                    "gdpPerCapita": 40493, "safetyIndex": 8.0, "healthcareQuality": 9.0,
                    "educationQuality": 8.3, "costOfLiving": 85, "climateScore": 7.8,
                    "languageBarrier": 8.0, "taxRate": 45, "visaDifficulty": "MEDIUM",
                    "infrastructure": 8.7, "jobMarket": 7.2
                },
                "pros": [
                    "Excellent healthcare system ranked #1 globally",
                    "Strong work-life balance with 35-hour work week",
                    "Rich culture, cuisine, and historical heritage",
                    "Excellent public transportation and infrastructure",
                    "Beautiful landscapes and climate diversity",
                    "Strong social benefits and worker protections"
                ],
                "cons": [
                    "French language essential for career advancement",
                    "Very high tax rates, especially for high earners",
                    "Bureaucratic processes can be complex",
                    "High unemployment rates in certain sectors",
                    "Strikes and labor disputes can disrupt services",
                    "Formal business culture and social hierarchies"
                ]
            }
        ]

    async def initialize_database(self):
        """Initialize SQLite database with country data"""
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute('''
                CREATE TABLE IF NOT EXISTS countries (
                    code TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    flag TEXT NOT NULL,
                    metrics TEXT NOT NULL,
                    pros TEXT NOT NULL,
                    cons TEXT NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Check if data exists
            cursor = await db.execute("SELECT COUNT(*) FROM countries")
            count = await cursor.fetchone()
            
            if count[0] == 0:
                logger.info("Initializing database with country data...")
                await self._store_countries_data(db)
            
            await db.commit()

    async def _store_countries_data(self, db):
        """Store country data in database"""
        for country in self.countries_data:
            await db.execute('''
                INSERT OR REPLACE INTO countries (code, name, flag, metrics, pros, cons)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                country['code'],
                country['name'],
                country['flag'],
                json.dumps(country['metrics']),
                json.dumps(country['pros']),
                json.dumps(country['cons'])
            ))

    async def fetch_and_store_data(self):
        """Fetch data from external APIs and store in database"""
        logger.info("Refreshing country data...")
        
        async with aiosqlite.connect(self.db_path) as db:
            # For now, we'll use our comprehensive static data
            # In production, you could fetch from REST Countries API and World Bank API
            await self._store_countries_data(db)
            await db.commit()
        
        logger.info("Country data refreshed successfully")

    async def get_all_countries(self) -> List[Dict[str, Any]]:
        """Get all countries from database"""
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute("SELECT * FROM countries ORDER BY name")
            rows = await cursor.fetchall()
            
            countries = []
            for row in rows:
                countries.append({
                    'code': row[0],
                    'name': row[1],
                    'flag': row[2],
                    'metrics': json.loads(row[3]),
                    'pros': json.loads(row[4]),
                    'cons': json.loads(row[5])
                })
            
            return countries

    async def get_country_by_code(self, code: str) -> Dict[str, Any]:
        """Get specific country by code"""
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute("SELECT * FROM countries WHERE code = ?", (code,))
            row = await cursor.fetchone()
            
            if row:
                return {
                    'code': row[0],
                    'name': row[1],
                    'flag': row[2],
                    'metrics': json.loads(row[3]),
                    'pros': json.loads(row[4]),
                    'cons': json.loads(row[5])
                }
            return None