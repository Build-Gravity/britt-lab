// Step 3: Basic Deployment - Console logging verification
// Goal: Verify that user interactions work and data is captured
// Next: Step 4 will add GitHub REST API data collection

let trialData = [];

function logChoice(choice) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        step: 3,
        trial: trialData.length + 1,
        timestamp: timestamp,
        playerChoice: choice,
        message: `Step 3 - Player chose ${choice} at ${timestamp}`
    };
    
    trialData.push(logEntry);
    console.log('✅ Trial Data:', logEntry);
    console.log('📊 All Data So Far:', trialData);
    
    // Visual feedback
    document.getElementById('status').innerHTML = `
        <strong>✅ Logged Successfully:</strong> ${choice} (Trial ${logEntry.trial})<br>
        <small>Check browser console for full data structure</small>
    `;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Step 3: RPS experiment initialized - Ready for testing');
    console.log('📝 Goal: Verify basic deployment and data logging works');
    console.log('🔧 Next: Step 4 will add GitHub REST API integration');
    
    document.getElementById('status').innerHTML = `
        <strong>Ready for Step 3 Testing</strong><br>
        <small>Click any button above to test console logging</small>
    `;
}); 