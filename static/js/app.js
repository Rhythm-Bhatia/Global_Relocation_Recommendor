// Global Relocation Analyzer API Frontend JavaScript

// API base URL
const API_BASE_URL = '/api';

// DOM elements
const responseOutput = document.getElementById('response-output');

// Utility function to format JSON with syntax highlighting
function formatJSON(obj) {
    const json = JSON.stringify(obj, null, 2);
    return json
        .replace(/(".*?"):/g, '<span class="json-key">$1</span>:')
        .replace(/: (".*?")/g, ': <span class="json-string">$1</span>')
        .replace(/: (\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
        .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>');
}

// Show loading state
function showLoading() {
    responseOutput.innerHTML = '<div class="loading"></div> Loading...';
}

// Show success response
function showSuccess(data) {
    responseOutput.innerHTML = `<div class="success">✅ Success</div><pre>${formatJSON(data)}</pre>`;
}

// Show error response
function showError(error) {
    responseOutput.innerHTML = `<div class="error">❌ Error: ${error}</div>`;
}

// Test a generic endpoint
async function testEndpoint(endpoint, method = 'GET', data = null) {
    showLoading();
    
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(API_BASE_URL + endpoint, options);
        const result = await response.json();
        
        if (response.ok) {
            showSuccess(result);
        } else {
            showError(`HTTP ${response.status}: ${result.detail || 'Unknown error'}`);
        }
    } catch (error) {
        showError(`Network error: ${error.message}`);
    }
}

// Test the analyze endpoint with sample data
async function testAnalyzeEndpoint() {
    const sampleData = {
        current_country: "IN",
        target_countries: ["NL", "CA", "AU"],
        profession: "Software Engineer",
        visa_type: "Work Visa",
        preferences: {
            economicOpportunities: 8,
            qualityOfLife: 7,
            safetyAndSecurity: 6,
            healthcareQuality: 7,
            climateSuitability: 5
        }
    };
    
    await testEndpoint('/analyze', 'POST', sampleData);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌍 Global Relocation Analyzer API Frontend Loaded');
    
    // Test the health endpoint on page load
    setTimeout(() => {
        testEndpoint('/health');
    }, 1000);
});

// Add some interactive features
function addInteractiveFeatures() {
    // Add hover effects to endpoint cards
    const cards = document.querySelectorAll('.endpoint-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click animation to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Call interactive features when DOM is loaded
document.addEventListener('DOMContentLoaded', addInteractiveFeatures);

// Export functions for global access
window.testEndpoint = testEndpoint;
window.testAnalyzeEndpoint = testAnalyzeEndpoint;