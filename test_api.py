#!/usr/bin/env python3
"""
Test script for Global Relocation Analyzer API
Run this after starting the FastAPI server to verify all endpoints work correctly.
"""

import requests
import json
import sys
from typing import Dict, Any

API_BASE_URL = "http://localhost:8000/api"

def test_endpoint(endpoint: str, method: str = "GET", data: Dict[Any, Any] = None) -> bool:
    """Test a single API endpoint"""
    url = f"{API_BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        else:
            print(f"❌ Unsupported method: {method}")
            return False
        
        if response.status_code == 200:
            print(f"✅ {method} {endpoint} - Status: {response.status_code}")
            return True
        else:
            print(f"❌ {method} {endpoint} - Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ {method} {endpoint} - Connection failed (is the server running?)")
        return False
    except Exception as e:
        print(f"❌ {method} {endpoint} - Error: {str(e)}")
        return False

def main():
    """Run all API tests"""
    print("🧪 Testing Global Relocation Analyzer API")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 0
    
    # Test health endpoint
    total_tests += 1
    if test_endpoint("/health"):
        tests_passed += 1
    
    # Test countries endpoint
    total_tests += 1
    if test_endpoint("/countries"):
        tests_passed += 1
    
    # Test professions endpoint
    total_tests += 1
    if test_endpoint("/professions"):
        tests_passed += 1
    
    # Test visa types endpoint
    total_tests += 1
    if test_endpoint("/visa-types"):
        tests_passed += 1
    
    # Test analyze endpoint
    total_tests += 1
    analyze_data = {
        "current_country": "IN",
        "target_countries": ["NL", "CA", "AU"],
        "profession": "Software Engineer",
        "visa_type": "Work Visa",
        "preferences": {
            "economicOpportunities": 8,
            "qualityOfLife": 7,
            "safetyAndSecurity": 6,
            "healthcareQuality": 7,
            "climateSuitability": 5
        }
    }
    if test_endpoint("/analyze", "POST", analyze_data):
        tests_passed += 1
    
    # Test compare endpoint
    total_tests += 1
    if test_endpoint("/compare/IN/NL"):
        tests_passed += 1
    
    # Test refresh data endpoint
    total_tests += 1
    if test_endpoint("/refresh-data", "POST"):
        tests_passed += 1
    
    # Summary
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! API is working correctly.")
        sys.exit(0)
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
        sys.exit(1)

if __name__ == "__main__":
    main()