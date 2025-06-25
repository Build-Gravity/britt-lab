// Step 4: Rock-Paper-Scissors with GitHub Data Collection
// Builds on Step 3 by adding automated data saving to GitHub repository

let experimentData = {
    metadata: {
        step: 4,
        experiment: "Rock-Paper-Scissors Data Collection",
        sessionId: null,
        startTime: null,
        participantId: null
    },
    trials: []
};

let isConfigured = false;

// Configuration function called from HTML
async function configureAPI() {
    const token = document.getElementById('github-token').value;
    const owner = document.getElementById('repo-owner').value;
    const repo = document.getElementById('repo-name').value;
    
    const statusEl = document.getElementById('config-status');
    
    if (!token || !owner || !repo) {
        statusEl.className = 'status-message error';
        statusEl.textContent = 'Please fill in all fields';
        return;
    }
    
    statusEl.className = 'status-message';
    statusEl.textContent = 'Testing connection...';
    
    // Configure GitHub API
    window.githubAPI.configure(token, owner, repo);
    
    // Test connection
    const result = await window.githubAPI.testConnection();
    
    if (result.success) {
        statusEl.className = 'status-message success';
        statusEl.textContent = result.message;
        
        // Enable experiment
        enableExperiment();
        
        // Initialize experiment metadata
        experimentData.metadata.sessionId = window.githubAPI.sessionId;
        experimentData.metadata.startTime = new Date().toISOString();
        experimentData.metadata.participantId = `participant_${Date.now()}`;
        
        isConfigured = true;
        
    } else {
        statusEl.className = 'status-message error';
        statusEl.textContent = result.message;
    }
}

function enableExperiment() {
    // Enable all choice buttons
    document.getElementById('rock-btn').disabled = false;
    document.getElementById('paper-btn').disabled = false;
    document.getElementById('scissors-btn').disabled = false;
    
    // Update status
    document.getElementById('status').innerHTML = `
        <strong>✅ Ready to collect data!</strong><br>
        <small>Click any button below - data will save to your GitHub repository</small>
    `;
}

async function makeChoice(choice) {
    if (!isConfigured) {
        alert('Please configure GitHub API first');
        return;
    }
    
    const timestamp = new Date().toISOString();
    const trialData = {
        trial: experimentData.trials.length + 1,
        timestamp: timestamp,
        playerChoice: choice,
        reactionTime: null, // Could be measured in future versions
        metadata: {
            userAgent: navigator.userAgent,
            screenSize: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`
        }
    };
    
    // Add to experiment data
    experimentData.trials.push(trialData);
    
    // Update UI
    document.getElementById('status').innerHTML = `
        <strong>Saving data...</strong><br>
        <small>Trial ${trialData.trial}: ${choice}</small>
    `;
    
    // Save to GitHub
    try {
        const result = await window.githubAPI.saveData(experimentData);
        
        if (result.success) {
            document.getElementById('status').innerHTML = `
                <strong>✅ Data saved successfully!</strong><br>
                <small>Trial ${trialData.trial}: ${choice} → <a href="${result.url}" target="_blank">View on GitHub</a></small>
            `;
            
            // Update data log
            updateDataLog(trialData, result);
            
        } else {
            document.getElementById('status').innerHTML = `
                <strong>❌ Save failed:</strong> ${result.message}<br>
                <small>Data stored locally until connection restored</small>
            `;
        }
    } catch (error) {
        document.getElementById('status').innerHTML = `
            <strong>❌ Error:</strong> ${error.message}<br>
            <small>Check console for details</small>
        `;
        console.error('Save error:', error);
    }
}

function updateDataLog(trialData, saveResult) {
    const logEl = document.getElementById('data-log');
    const logEntry = `
Trial ${trialData.trial} | ${trialData.timestamp} | Choice: ${trialData.playerChoice}
✅ Saved to: ${saveResult.fileName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    logEl.textContent = logEntry + '\n' + logEl.textContent;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Step 4: RPS experiment with GitHub API initialized');
    console.log('🔧 Configure GitHub API above to start collecting data');
    
    // Pre-fill some fields if running locally (for development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        document.getElementById('repo-owner').value = 'your-username';
        document.getElementById('repo-name').value = 'your-repo-name';
    }
}); 