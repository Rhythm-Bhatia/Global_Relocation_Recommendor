import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import requests
import json
from typing import Dict, List, Any

# Page configuration
st.set_page_config(
    page_title="Global Relocation Analyzer",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #0f766e 0%, #14b8a6 100%);
        padding: 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        text-align: center;
        color: white;
    }
    
    .metric-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-left: 4px solid #14b8a6;
        margin-bottom: 1rem;
    }
    
    .country-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        margin-bottom: 1rem;
        border: 1px solid #e5e7eb;
    }
    
    .recommendation-badge {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: bold;
        font-size: 0.8rem;
        text-align: center;
        margin: 0.5rem 0;
    }
    
    .strongly-recommended {
        background: #fef3c7;
        color: #92400e;
        border: 2px solid #f59e0b;
    }
    
    .recommended {
        background: #ddd6fe;
        color: #5b21b6;
        border: 2px solid #8b5cf6;
    }
    
    .consider {
        background: #dbeafe;
        color: #1e40af;
        border: 2px solid #3b82f6;
    }
    
    .not-recommended {
        background: #fee2e2;
        color: #dc2626;
        border: 2px solid #ef4444;
    }
    
    .sidebar-section {
        background: #f8fafc;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 1px solid #e2e8f0;
    }
    
    .priority-slider {
        margin: 1rem 0;
    }
    
    .score-display {
        font-size: 3rem;
        font-weight: bold;
        color: #14b8a6;
        text-align: center;
        margin: 1rem 0;
    }
    
    .component-scores {
        display: flex;
        justify-content: space-around;
        margin: 1rem 0;
    }
    
    .component-score {
        text-align: center;
        padding: 0.5rem;
    }
    
    .pros-cons-section {
        margin-top: 2rem;
    }
    
    .pros-list {
        background: #f0fdf4;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #22c55e;
    }
    
    .cons-list {
        background: #fef2f2;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #ef4444;
    }
</style>
""", unsafe_allow_html=True)

# API Configuration
API_BASE_URL = "http://localhost:8000/api"

@st.cache_data(ttl=300)  # Cache for 5 minutes
def fetch_countries():
    """Fetch countries from API"""
    try:
        response = requests.get(f"{API_BASE_URL}/countries")
        if response.status_code == 200:
            return response.json()["countries"]
        return []
    except:
        return []

@st.cache_data(ttl=3600)  # Cache for 1 hour
def fetch_professions():
    """Fetch professions from API"""
    try:
        response = requests.get(f"{API_BASE_URL}/professions")
        if response.status_code == 200:
            return response.json()["professions"]
        return []
    except:
        return []

@st.cache_data(ttl=3600)  # Cache for 1 hour
def fetch_visa_types():
    """Fetch visa types from API"""
    try:
        response = requests.get(f"{API_BASE_URL}/visa-types")
        if response.status_code == 200:
            return response.json()["visa_types"]
        return []
    except:
        return []

def analyze_migration(current_country, target_countries, profession, visa_type, preferences):
    """Call migration analysis API"""
    try:
        payload = {
            "current_country": current_country,
            "target_countries": target_countries,
            "profession": profession,
            "visa_type": visa_type,
            "preferences": preferences
        }
        response = requests.post(f"{API_BASE_URL}/analyze", json=payload)
        if response.status_code == 200:
            return response.json()["results"]
        return []
    except:
        return []

def create_radar_chart(results):
    """Create radar chart for country comparison"""
    if not results:
        return None
    
    categories = ['Economic', 'Quality', 'Safety', 'Healthcare', 'Climate']
    
    fig = go.Figure()
    
    colors = ['#14b8a6', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6']
    
    for i, result in enumerate(results[:3]):  # Show top 3 countries
        country = result['country']
        metrics = country['metrics']
        
        values = [
            result['component_scores']['economic'],
            result['component_scores']['quality'],
            result['component_scores']['safety'],
            metrics['healthcareQuality'],
            metrics['climateScore']
        ]
        
        fig.add_trace(go.Scatterpolar(
            r=values,
            theta=categories,
            fill='toself',
            name=f"{country['flag']} {country['name']}",
            line_color=colors[i % len(colors)]
        ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 10]
            )),
        showlegend=True,
        title="Country Comparison - Key Metrics",
        height=500
    )
    
    return fig

def create_cost_comparison_chart(results):
    """Create cost of living comparison chart"""
    if not results:
        return None
    
    countries = []
    costs = []
    flags = []
    
    for result in results:
        country = result['country']
        countries.append(country['name'])
        costs.append(country['metrics']['costOfLiving'])
        flags.append(country['flag'])
    
    fig = go.Figure(data=[
        go.Bar(
            x=countries,
            y=costs,
            text=[f"{flag}<br>{cost}" for flag, cost in zip(flags, costs)],
            textposition='auto',
            marker_color='#14b8a6'
        )
    ])
    
    fig.update_layout(
        title="Cost of Living Comparison (Index: 100 = New York)",
        xaxis_title="Countries",
        yaxis_title="Cost of Living Index",
        height=400
    )
    
    return fig

def display_metrics_table(results):
    """Display detailed metrics comparison table"""
    if not results:
        return
    
    metrics_data = []
    for result in results:
        country = result['country']
        metrics = country['metrics']
        
        metrics_data.append({
            'Country': f"{country['flag']} {country['name']}",
            'GDP per Capita': f"${metrics['gdpPerCapita']:,}",
            'Safety Index': f"{metrics['safetyIndex']}/10",
            'Healthcare': f"{metrics['healthcareQuality']}/10",
            'Education': f"{metrics['educationQuality']}/10",
            'Cost of Living': metrics['costOfLiving'],
            'Climate Score': f"{metrics['climateScore']}/10",
            'Tax Rate': f"{metrics['taxRate']}%",
            'Visa Difficulty': metrics['visaDifficulty'],
            'Infrastructure': f"{metrics['infrastructure']}/10",
            'Job Market': f"{metrics['jobMarket']}/10"
        })
    
    df = pd.DataFrame(metrics_data)
    st.dataframe(df, use_container_width=True)

def get_recommendation_class(recommendation):
    """Get CSS class for recommendation badge"""
    if recommendation == "Strongly recommended":
        return "strongly-recommended"
    elif recommendation == "Recommended":
        return "recommended"
    elif recommendation == "Consider with caution":
        return "consider"
    else:
        return "not-recommended"

# Main App
def main():
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>🌍 Global Relocation Analyzer</h1>
        <p>Find your ideal country for migration with data-driven insights</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Load data
    countries = fetch_countries()
    professions = fetch_professions()
    visa_types = fetch_visa_types()
    
    if not countries:
        st.error("Unable to load country data. Please ensure the API server is running.")
        st.stop()
    
    # Sidebar
    with st.sidebar:
        st.markdown("## 🎯 Migration Analysis Settings")
        
        # Current Country
        st.markdown('<div class="sidebar-section">', unsafe_allow_html=True)
        st.markdown("### Current Country")
        current_country_options = [""] + [f"{c['flag']} {c['name']}" for c in countries]
        current_country_display = st.selectbox(
            "Select your current country",
            current_country_options,
            key="current_country"
        )
        current_country = None
        if current_country_display:
            current_country = next((c['code'] for c in countries if f"{c['flag']} {c['name']}" == current_country_display), None)
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Target Countries
        st.markdown('<div class="sidebar-section">', unsafe_allow_html=True)
        st.markdown("### Target Countries (Select up to 3)")
        target_countries_display = st.multiselect(
            "Countries to analyze",
            [f"{c['flag']} {c['name']}" for c in countries],
            max_selections=3,
            key="target_countries"
        )
        target_countries = [
            next((c['code'] for c in countries if f"{c['flag']} {c['name']}" == display), None)
            for display in target_countries_display
        ]
        target_countries = [c for c in target_countries if c]
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Profession
        st.markdown('<div class="sidebar-section">', unsafe_allow_html=True)
        st.markdown("### Profession")
        profession = st.selectbox(
            "Select your profession",
            [""] + professions,
            key="profession"
        )
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Visa Type
        st.markdown('<div class="sidebar-section">', unsafe_allow_html=True)
        st.markdown("### 📄 Visa Type")
        visa_type = st.selectbox(
            "Select visa type",
            visa_types,
            key="visa_type"
        )
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Priority Sliders
        st.markdown('<div class="sidebar-section">', unsafe_allow_html=True)
        st.markdown("### ⚖️ Your Priorities")
        st.markdown("*Adjust the importance of each factor (1=Low, 10=High)*")
        
        preferences = {}
        
        st.markdown("#### 💰 Economic Opportunities")
        preferences['economicOpportunities'] = st.slider("", 1, 10, 7, key="economic")
        
        st.markdown("#### ❤️ Quality of Life")
        preferences['qualityOfLife'] = st.slider("", 1, 10, 8, key="quality")
        
        st.markdown("#### 🛡️ Safety & Security")
        preferences['safetyAndSecurity'] = st.slider("", 1, 10, 6, key="safety")
        
        st.markdown("#### 🏥 Healthcare Quality")
        preferences['healthcareQuality'] = st.slider("", 1, 10, 7, key="healthcare")
        
        st.markdown("#### ☀️ Climate Suitability")
        preferences['climateSuitability'] = st.slider("", 1, 10, 5, key="climate")
        
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Analyze Button
        analyze_button = st.button(
            "🔍 Analyze Migration Options",
            type="primary",
            use_container_width=True,
            disabled=len(target_countries) == 0
        )
        
        # Refresh Data Button
        if st.button("🔄 Refresh Data", use_container_width=True):
            try:
                response = requests.post(f"{API_BASE_URL}/refresh-data")
                if response.status_code == 200:
                    st.success("Data refreshed successfully!")
                    st.cache_data.clear()
                else:
                    st.error("Failed to refresh data")
            except:
                st.error("Unable to refresh data")
    
    # Main Content
    if not analyze_button and len(target_countries) == 0:
        # Welcome Screen
        col1, col2 = st.columns([1, 1])
        
        with col1:
            st.markdown("""
            ## Welcome to Global Relocation Analyzer
            
            Get comprehensive migration analysis based on your preferences and professional background.
            
            ### Features:
            - 📊 **Data-driven country analysis**
            - 🎯 **Personalized recommendations** 
            - 📈 **Interactive visualizations**
            - 💰 **Cost analysis & comparisons**
            """)
        
        with col2:
            st.info("**Ready to start?** Select your preferences on the left and click 'Analyze Migration Options'")
    
    elif analyze_button or len(target_countries) > 0:
        # Analysis Results
        if len(target_countries) > 0:
            with st.spinner("Analyzing migration options..."):
                results = analyze_migration(
                    current_country, target_countries, profession, visa_type, preferences
                )
            
            if results:
                # Results Header
                st.markdown("## 👑 Migration Analysis Results")
                st.markdown("*Ranked by compatibility with your preferences*")
                
                # Country Cards
                cols = st.columns(min(len(results), 3))
                for i, result in enumerate(results[:3]):
                    with cols[i]:
                        country = result['country']
                        
                        # Recommendation badge
                        badge_class = get_recommendation_class(result['recommendation'])
                        rank_labels = ["1ST RECOMMENDED CHOICE", "2ND RECOMMENDED CHOICE", "3RD RECOMMENDED CHOICE"]
                        rank_label = rank_labels[i] if i < len(rank_labels) else "CONSIDER"
                        
                        st.markdown(f"""
                        <div class="country-card">
                            <div style="text-align: center;">
                                <h3>{country['flag']} {country['name']}</h3>
                                <div class="score-display">{result['score']}</div>
                                <div class="recommendation-badge {badge_class}">
                                    {rank_label}
                                </div>
                            </div>
                            <div class="component-scores">
                                <div class="component-score">
                                    <div style="color: #6b7280; font-size: 0.8rem;">ECONOMIC</div>
                                    <div style="font-weight: bold;">{result['component_scores']['economic']}</div>
                                </div>
                                <div class="component-score">
                                    <div style="color: #6b7280; font-size: 0.8rem;">QUALITY</div>
                                    <div style="font-weight: bold;">{result['component_scores']['quality']}</div>
                                </div>
                                <div class="component-score">
                                    <div style="color: #6b7280; font-size: 0.8rem;">SAFETY</div>
                                    <div style="font-weight: bold;">{result['component_scores']['safety']}</div>
                                </div>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                
                # Charts Section
                st.markdown("## 📊 Visual Analysis")
                
                col1, col2 = st.columns(2)
                
                with col1:
                    radar_chart = create_radar_chart(results)
                    if radar_chart:
                        st.plotly_chart(radar_chart, use_container_width=True)
                
                with col2:
                    cost_chart = create_cost_comparison_chart(results)
                    if cost_chart:
                        st.plotly_chart(cost_chart, use_container_width=True)
                
                # Detailed Metrics Table
                st.markdown("## 📋 Detailed Metrics Comparison")
                display_metrics_table(results)
                
                # Pros & Cons Analysis
                st.markdown("## ⚖️ Pros & Cons Analysis")
                st.markdown("*Detailed advantages and challenges for each country*")
                
                for result in results:
                    country = result['country']
                    
                    with st.expander(f"{country['flag']} {country['name']} Analysis"):
                        col1, col2 = st.columns(2)
                        
                        with col1:
                            st.markdown("### ✅ Key Advantages")
                            st.markdown('<div class="pros-list">', unsafe_allow_html=True)
                            for pro in country['pros']:
                                st.markdown(f"• {pro}")
                            st.markdown('</div>', unsafe_allow_html=True)
                        
                        with col2:
                            st.markdown("### ⚠️ Challenges")
                            st.markdown('<div class="cons-list">', unsafe_allow_html=True)
                            for con in country['cons']:
                                st.markdown(f"• {con}")
                            st.markdown('</div>', unsafe_allow_html=True)
            
            else:
                st.error("Unable to analyze migration options. Please try again.")

if __name__ == "__main__":
    main()