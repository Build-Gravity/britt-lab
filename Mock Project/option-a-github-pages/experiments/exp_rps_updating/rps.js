// Minimal RPS experiment - Step 3: Basic console logging
// Step 4 will add GitHub REST API data collection
// Step 5 will add full experiment logic

let trialData = [];

function logChoice(choice) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        trial: trialData.length + 1,
        timestamp: timestamp,
        playerChoice: choice,
        message: `Player chose ${choice} at ${timestamp}`
    };
    
    trialData.push(logEntry);
    console.log('Trial Data:', logEntry);
    console.log('All Data So Far:', trialData);
    
    // Visual feedback
    document.getElementById('status').textContent = `Logged: ${choice} (Trial ${logEntry.trial})`;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('RPS experiment initialized - Ready for Step 3 testing');
    document.getElementById('status').textContent = 'Ready - Click a button to test console logging';
}); 