// Step 3: Basic Deployment - Reference Implementation
// This demonstrates the basic structure students should create for their own experiments

let experimentData = [];
let trialCount = 0;

function logChoice(choice) {
    trialCount++;
    const trialData = {
        trial: trialCount,
        timestamp: new Date().toISOString(),
        playerChoice: choice,
        step: 3,
        status: 'console_logging'
    };
    
    experimentData.push(trialData);
    
    // Console logging for verification
    console.log('✅ New Trial:', trialData);
    console.log('📊 All Data:', experimentData);
    
    // Update status display
    updateStatus(choice, trialCount);
}

function updateStatus(choice, trial) {
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = `✅ Trial ${trial}: Logged '${choice}' - Check console for data structure`;
}

// Copy prompt function for students building their own experiments
function copyAdaptationPrompt() {
    const promptText = `I'm building a psychology experiment based on my Step 0 study choice: [REFERENCE YOUR my-study-reference.md FILE]

Based on my study from Step 0, my experiment needs:
- Interactive elements for [DESCRIBE YOUR TASK - refer to your adaptation idea from Step 0]
- Buttons/inputs for [LIST YOUR RESPONSE OPTIONS - based on your key variables]
- Data logging that captures [REFERENCE YOUR KEY VARIABLES FROM STEP 0]

My research question is: [COPY YOUR RESEARCH QUESTION FROM STEP 0]

Help me create:
1. HTML with appropriate buttons/inputs for my specific task
2. JavaScript function to handle responses and log data
3. Console logging to verify data structure matches my needs
4. Basic status updates to show the experiment is working

Keep it simple - this is just for initial testing and verification. I want to make sure the core interaction works before adding data persistence.`;

    navigator.clipboard.writeText(promptText).then(() => {
        alert("Development prompt copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert("Copy failed. Please select and copy the text manually.");
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Step 3: Basic experiment loaded');
    console.log('📝 What we\'re testing: Console logging works correctly');
    
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = `
        <strong>Ready to test!</strong><br>
        <small>Click any choice button to log data</small>
    `;
}); 