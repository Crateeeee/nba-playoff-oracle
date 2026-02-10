// Fetch predictions from Azure Blob Storage
async function loadPredictions() {
    try {
        const response = await fetch('predictions.json');
        const data = await response.json();
        
        displayModelInfo(data.model_info);
        displayPredictions(data.predictions);
        updateTimestamp(data.generated_at);
    } catch (error) {
        console.error('Error loading predictions:', error);
        document.body.innerHTML += '<p class="error">Failed to load predictions. Please try again later.</p>';
    }
}

function displayModelInfo(modelInfo) {
    const statsDiv = document.getElementById('model-stats');
    statsDiv.innerHTML = `
        <div class="stat-card">
            <h3>Algorithm</h3>
            <p>${modelInfo.algorithm}</p>
        </div>
        <div class="stat-card">
            <h3>Accuracy</h3>
            <p>${(modelInfo.accuracy * 100).toFixed(1)}%</p>
        </div>
        <div class="stat-card">
            <h3>Metric</h3>
            <p>${modelInfo.primary_metric}</p>
        </div>
    `;
}

function displayPredictions(predictions) {
    const easternDiv = document.getElementById('eastern-conference');
    const westernDiv = document.getElementById('western-conference');
    
    const easternTeams = predictions.filter(t => t.conference === 'Eastern');
    const westernTeams = predictions.filter(t => t.conference === 'Western');
    
    easternDiv.innerHTML = easternTeams.map(team => createTeamCard(team)).join('');
    westernDiv.innerHTML = westernTeams.map(team => createTeamCard(team)).join('');
}

function createTeamCard(team) {
    const probability = (team.playoff_probability * 100).toFixed(1);
    const probabilityClass = probability >= 75 ? 'high' : probability >= 50 ? 'medium' : 'low';
    
    return `
        <div class="team-card">
            <h3>${team.team}</h3>
            <div class="probability ${probabilityClass}">
                <span class="percentage">${probability}%</span>
                <span class="label">Playoff Chance</span>
            </div>
            <p class="wins">Projected Wins: ${team.projected_wins}</p>
            <p class="factors">Key Factors: ${team.key_factors.join(', ')}</p>
        </div>
    `;
}

function updateTimestamp(timestamp) {
    const date = new Date(timestamp);
    document.getElementById('last-updated').textContent = date.toLocaleString();
}

// Load predictions when page loads
document.addEventListener('DOMContentLoaded', loadPredictions);