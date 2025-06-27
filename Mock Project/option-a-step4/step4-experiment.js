// Step 4: Data Collection - Building on Step 3
// What's New: Proper data storage, experiment sessions, CSV/JSON export
// Builds On: Step 3's basic logging functionality

// Globsal state
let experimentData = [];
let trialCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateStatus();
});

function loadData() {
    const savedData = localStorage.getItem('rpsExperimentData');
    if (savedData) {
        experimentData = JSON.parse(savedData);
        trialCount = experimentData.length;
    }
}

function saveData() {
    localStorage.setItem('rpsExperimentData', JSON.stringify(experimentData));
}

function clearData() {
    if (confirm("Are you sure you want to clear all locally stored data? This cannot be undone.")) {
        localStorage.removeItem('rpsExperimentData');
        experimentData = [];
        trialCount = 0;
        updateStatus();
        alert("Local data cleared.");
    }
}

function logChoice(choice) {
    trialCount++;
    const trialData = {
        trial: trialCount,
        timestamp: new Date().toISOString(),
        playerChoice: choice
    };
    experimentData.push(trialData);
    saveData();
    updateStatus(choice);
}

function updateStatus(choice = null) {
    const statusEl = document.getElementById('status');
    if (trialCount > 0) {
        const lastChoice = choice || experimentData[experimentData.length - 1].playerChoice;
        statusEl.innerHTML = `Trial ${trialCount}: Logged '${lastChoice}'. Total trials: ${trialCount}.`;
    } else {
        statusEl.innerHTML = 'Ready - Click a button to start collecting data';
    }
}

function downloadJSON() {
    if (experimentData.length === 0) {
        alert("No data to download.");
        return;
    }
    const dataStr = JSON.stringify(experimentData, null, 2);
    const dataBlob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rps-data-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function downloadCSV() {
    if (experimentData.length === 0) {
        alert("No data to download.");
        return;
    }
    const headers = "trial,timestamp,playerChoice";
    const rows = experimentData.map(d => `${d.trial},${d.timestamp},${d.playerChoice}`);
    const csvContent = [headers, ...rows].join("\n");
    
    const dataBlob = new Blob([csvContent], {type: "text/csv"});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rps-data-${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function copyStep4Prompt() {
    const promptText = `I want to add local data collection to my experiment using localStorage.

I need help with:
1. A 'logChoice' function that saves data to localStorage.
2. A function to load existing data from localStorage when the page opens.
3. Download functions for both JSON and CSV formats.
4. A button to clear the data from localStorage.

The goal is to collect data that persists between page loads, all locally in the browser.`;
    navigator.clipboard.writeText(promptText).then(() => {
        alert("Prompt copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Initialize - builds on Step 3's initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Step 4: Data collection experiment loaded');
    console.log('📈 New features: Sessions, localStorage, export');
    
    // Load any existing sessions (show count)
    const sessions = JSON.parse(localStorage.getItem('experiment_sessions') || '[]');
    if (sessions.length > 0) {
        console.log(`📁 Found ${sessions.length} previous sessions`);
    }
    
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = `
        <strong>Ready for Step 4!</strong><br>
        <small>Click "Start Session" to begin data collection</small>
    `;
}); 