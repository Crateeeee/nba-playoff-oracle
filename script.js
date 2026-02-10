// NBA Playoff Oracle - Dynamic Predictions Loader
// Fetch predictions from the JSON file and display them dynamically

async function loadPredictions() {
    try {
        const response = await fetch('predictions.json');
        const data = await response.json();
        
        // Display model info
        displayModelInfo(data.model_info, data.generated_at);
        
        // Display predictions
        displayPredictions(data.predictions);
        
    } catch (error) {
        console.error('Error loading predictions:', error);
        document.getElementById('predictions-container').innerHTML = 
            '<p class="error">Failed to load predictions. Please try again later.</p>';
    }
}

function displayModelInfo(modelInfo, generatedAt) {
    const modelInfoDiv = document.getElementById('model-info');
    if (modelInfoDiv) {
        const date = new Date(generatedAt);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        modelInfoDiv.innerHTML = `
            <div class="model-info-card">
                <h2>🤖 The Oracle Speaks</h2>
                <p><strong>Algorithm:</strong> ${modelInfo.algorithm}</p>
                <p><strong>Model Accuracy:</strong> ${(modelInfo.accuracy * 100).toFixed(1)}%</p>
                <p><strong>Primary Metric:</strong> ${modelInfo.primary_metric}</p>
                <p class="generated-time">Last Updated: ${formattedDate}</p>
            </div>
        `;
    }
}

function displayPredictions(predictions) {
    // Sort by playoff probability (highest first)
    predictions.sort((a, b) => b.playoff_probability - a.playoff_probability);
    
    const container = document.getElementById('predictions-container');
    if (!container) return;
    
    // Separate into conferences
    const eastern = predictions.filter(team => team.conference === 'Eastern');
    const western = predictions.filter(team => team.conference === 'Western');
    
    container.innerHTML = `
        <div class="conference-section">
            <h2 class="conference-header">Eastern Conference</h2>
            <div class="teams-grid">
                ${eastern.map(team => createTeamCard(team)).join('')}
            </div>
        </div>
        
        <div class="conference-section">
            <h2 class="conference-header">Western Conference</h2>
            <div class="teams-grid">
                ${western.map(team => createTeamCard(team)).join('')}
            </div>
        </div>
    `;
}

function createTeamCard(team) {
    const probability = (team.playoff_probability * 100).toFixed(0);
    const statusClass = probability >= 50 ? 'playoff-likely' : 'playoff-unlikely';
    const statusText = probability >= 75 ? 'Strong Contender' : 
                       probability >= 50 ? 'Playoff Bound' : 
                       probability >= 25 ? 'On The Bubble' : 'Longshot';
    
    return `
        <div class="team-card ${statusClass}">
            <div class="team-header">
                <h3>${team.team}</h3>
                <span class="status-badge">${statusText}</span>
            </div>
            
            <div class="probability-section">
                <div class="probability-bar">
                    <div class="probability-fill" style="width: ${probability}%"></div>
                </div>
                <p class="probability-text">${probability}%</p>
            </div>
            
            <div class="team-stats">
                <p class="projected-wins">📊 Projected Wins: <strong>${team.projected_wins}</strong></p>
                <p class="key-factors">🔑 Key Factors:</p>
                <ul class="factors-list">
                    ${team.key_factors.map(factor => `<li>${factor}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// Load predictions when page loads
document.addEventListener('DOMContentLoaded', loadPredictions);

// Optional: Refresh predictions every 5 minutes
setInterval(loadPredictions, 300000);