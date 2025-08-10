# 🌍 Global Relocation Analyzer

A comprehensive migration analytics dashboard that helps users compare international migration destinations and receive actionable, data-driven recommendations.

## 🚀 Features

- **Interactive Analysis**: Compare up to 3 countries simultaneously with personalized scoring
- **Comprehensive Metrics**: GDP, safety, healthcare, education, cost of living, climate, and more
- **Visual Analytics**: Radar charts, cost comparisons, and detailed metrics tables
- **Pros & Cons Analysis**: Detailed advantages and challenges for each country
- **Real-time Scoring**: Dynamic analysis based on user preferences and priorities
- **Professional UI**: Modern, responsive design with independent scrolling sections

## 🛠️ Tech Stack

### Backend
- **FastAPI**: RESTful API with automatic documentation
- **SQLite**: Persistent data storage
- **APScheduler**: Automated data refresh every 6 hours
- **aiosqlite**: Async database operations
- **Pydantic**: Data validation and serialization

### Frontend
- **Streamlit**: Interactive dashboard and visualizations
- **Plotly**: Advanced charts (radar, bar charts)
- **Pandas**: Data manipulation and table display
- **Custom CSS/JS**: Professional styling and interactions

## 📁 Project Structure

```
global-relocation-analyzer/
├── main.py                 # FastAPI application
├── data_fetcher.py         # Data management and API integration
├── migration_analyzer.py   # Scoring algorithms and analysis logic
├── scheduler.py            # Background task scheduling
├── streamlit_app.py        # Streamlit dashboard
├── test_api.py            # API endpoint testing
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── templates/
│   └── index.html         # API documentation page
└── static/
    ├── css/
    │   └── style.css      # Custom styling
    └── js/
        └── app.js         # Frontend interactions
```

## 🚀 How to Run

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Start the FastAPI Backend

```bash
uvicorn main:app --reload
```

The API will be available at: http://localhost:8000

### 3. Launch the Streamlit Dashboard

In a new terminal:

```bash
streamlit run streamlit_app.py
```

The dashboard will be available at: http://localhost:8501

### 4. Test the API (Optional)

```bash
python test_api.py
```

## 📊 API Endpoints

- `GET /api/health` - Check API health status
- `GET /api/countries` - Get all available countries with metrics
- `GET /api/professions` - Get list of supported professions
- `GET /api/visa-types` - Get available visa types
- `POST /api/analyze` - Analyze migration options based on preferences
- `GET /api/compare/{source}/{target}` - Compare two countries directly
- `POST /api/refresh-data` - Manually refresh country data

## 🎯 Usage

1. **Select Countries**: Choose your current country and up to 3 target countries
2. **Set Preferences**: Adjust priority sliders for different factors:
   - Economic Opportunities
   - Quality of Life
   - Safety & Security
   - Healthcare Quality
   - Climate Suitability
3. **Choose Profile**: Select your profession and visa type
4. **Analyze**: Click "Analyze Migration Options" to get personalized recommendations
5. **Explore Results**: View rankings, detailed metrics, charts, and pros/cons analysis

## 🌍 Supported Countries

The application includes comprehensive data for 15+ countries:

- 🇳🇱 Netherlands
- 🇫🇮 Finland  
- 🇵🇹 Portugal
- 🇨🇦 Canada
- 🇦🇺 Australia
- 🇩🇪 Germany
- 🇨🇭 Switzerland
- 🇸🇬 Singapore
- 🇳🇿 New Zealand
- 🇯🇵 Japan
- 🇰🇷 South Korea
- 🇮🇳 India
- 🇺🇸 United States
- 🇬🇧 United Kingdom
- 🇫🇷 France

## 📈 Scoring Algorithm

The migration score (0-10) is calculated using:

1. **Economic Score**: GDP per capita, job market, tax rates
2. **Quality Score**: Healthcare, education, infrastructure, cost of living
3. **Safety Score**: Personal safety and security index
4. **User Preferences**: Weighted according to priority sliders
5. **Penalties**: Visa difficulty and language barriers

## 🔄 Data Management

- **Initial Setup**: Database is populated with comprehensive country data on first run
- **Auto Refresh**: Data is automatically refreshed every 6 hours
- **Manual Refresh**: Use the "Refresh Data" button in the sidebar
- **Persistent Storage**: All data is stored in SQLite for fast access

## 🧪 Testing

Run the test script to verify all API endpoints:

```bash
python test_api.py
```

Expected output:
```
🧪 Testing Global Relocation Analyzer API
==================================================
✅ GET /api/health - Status: 200
✅ GET /api/countries - Status: 200
✅ GET /api/professions - Status: 200
✅ GET /api/visa-types - Status: 200
✅ POST /api/analyze - Status: 200
✅ GET /api/compare/IN/NL - Status: 200
✅ POST /api/refresh-data - Status: 200

==================================================
📊 Test Results: 7/7 tests passed
🎉 All tests passed! API is working correctly.
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Independent Scrolling**: Sidebar and main content scroll separately
- **Interactive Charts**: Hover effects and dynamic updates
- **Professional Styling**: Modern card-based layout with subtle animations
- **Color-coded Results**: Visual indicators for recommendations
- **Progress Bars**: Visual representation of metric values

## 🔧 Configuration

### Environment Variables
No environment variables required - the application works out of the box.

### Database
SQLite database (`migration_data.db`) is created automatically in the project directory.

### Customization
- Modify country data in `data_fetcher.py`
- Adjust scoring weights in `migration_analyzer.py`
- Customize UI styling in `static/css/style.css`

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the test script output for API connectivity
2. Ensure both FastAPI and Streamlit servers are running
3. Verify all dependencies are installed correctly

---

**Ready to find your ideal migration destination? Start the servers and begin your analysis!** 🚀