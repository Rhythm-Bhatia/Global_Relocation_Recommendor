from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import sqlite3
import json
import asyncio
from contextlib import asynccontextmanager
from scheduler import start_scheduler
from data_fetcher import DataFetcher
from migration_analyzer import MigrationAnalyzer

# Pydantic models
class AnalysisRequest(BaseModel):
    current_country: Optional[str] = None
    target_countries: List[str]
    profession: Optional[str] = None
    visa_type: str = "Work Visa"
    preferences: Dict[str, float]

class Country(BaseModel):
    code: str
    name: str
    flag: str
    metrics: Dict[str, Any]
    pros: List[str]
    cons: List[str]

# Global variables
data_fetcher = None
migration_analyzer = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global data_fetcher, migration_analyzer
    data_fetcher = DataFetcher()
    migration_analyzer = MigrationAnalyzer()
    
    # Initialize database and start scheduler
    await data_fetcher.initialize_database()
    start_scheduler(data_fetcher)
    
    yield
    
    # Shutdown
    pass

app = FastAPI(
    title="Global Relocation Analyzer API",
    description="Migration analytics and country comparison API",
    version="1.0.0",
    lifespan=lifespan
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Global Relocation Analyzer API is running"}

@app.get("/api/countries")
async def get_countries():
    try:
        countries = await data_fetcher.get_all_countries()
        return {"countries": countries}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/professions")
async def get_professions():
    professions = [
        "Software Engineer", "Data Scientist", "Product Manager", "Marketing Manager",
        "Financial Analyst", "Mechanical Engineer", "Registered Nurse", "Teacher",
        "Graphic Designer", "Sales Manager", "Consultant", "Researcher",
        "Project Manager", "Business Analyst", "UX/UI Designer", "Operations Manager",
        "HR Manager", "Accountant", "Civil Engineer", "Healthcare Professional",
        "Doctor", "Lawyer", "Architect", "Chef", "Pharmacist"
    ]
    return {"professions": professions}

@app.get("/api/visa-types")
async def get_visa_types():
    visa_types = [
        "Work Visa", "Student Visa", "Investment Visa", "Family Reunification",
        "Skilled Migrant Visa", "Startup Visa", "Freelancer Visa", "Tourist Visa"
    ]
    return {"visa_types": visa_types}

@app.post("/api/analyze")
async def analyze_migration(request: AnalysisRequest):
    try:
        results = await migration_analyzer.analyze_migration(
            current_country=request.current_country,
            target_countries=request.target_countries,
            profession=request.profession,
            visa_type=request.visa_type,
            preferences=request.preferences
        )
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/compare/{source}/{target}")
async def compare_countries(source: str, target: str):
    try:
        comparison = await migration_analyzer.compare_countries(source, target)
        return {"comparison": comparison}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/refresh-data")
async def refresh_data():
    try:
        await data_fetcher.fetch_and_store_data()
        return {"message": "Data refreshed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)