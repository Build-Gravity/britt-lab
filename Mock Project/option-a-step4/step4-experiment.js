// Step 4: Data Collection - Building on Step 3
// What's New: Proper data storage, experiment sessions, CSV/JSON export
// Builds On: Step 3's basic logging functionality

// Global state variables to hold data across functions
let experimentData = []; // An array to store all trial data objects
let trialCount = 0;      // A counter for the number of trials

// This function runs as soon as the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // 1. Check for and load any data from previous sessions
    loadData();
    
    // 2. Update the status message based on what was (or wasn't) loaded
    updateStatus();
    
    // 3. Log helpful messages to the developer console for debugging
    console.log('🚀 Step 4: Data collection experiment loaded');
    console.log('📈 New features: localStorage persistence, export');
    
    if (experimentData.length > 0) {
        console.log(`📁 Found ${experimentData.length} existing trials`);
    } else {
        console.log('📝 No existing data - ready for new session');
    }
});

// Looks for and loads existing data from the browser's local storage
function loadData() {
    // Retrieve data from localStorage using our unique key
    const savedData = localStorage.getItem('rpsExperimentData');
    
    // If data was found, parse it from a string back into an array
    if (savedData) {
        experimentData = JSON.parse(savedData);
        // And update our trial counter to match the loaded data
        trialCount = experimentData.length;
    }
}

// Saves the current experimentData array to local storage
function saveData() {
    // localStorage can only store strings, so we convert the array to a JSON string
    localStorage.setItem('rpsExperimentData', JSON.stringify(experimentData));
}

// Clears all data from local storage and resets the experiment state
function clearData() {
    // The confirm() function shows a popup to prevent accidental data loss
    if (confirm("Are you sure you want to clear all locally stored data? This cannot be undone.")) {
        localStorage.removeItem('rpsExperimentData'); // Remove the data from storage
        experimentData = []; // Reset the in-memory array
        trialCount = 0;      // Reset the trial counter
        updateStatus();      // Update the display on the page
        alert("Local data cleared.");
    }
}

// This function is called every time a player makes a choice
function logChoice(choice) {
    trialCount++; // Increment the trial counter
    
    // Create an "object" to hold all the data for this one trial
    const trialData = {
        trial: trialCount,
        timestamp: new Date().toISOString(), // Get the current time
        playerChoice: choice,
        step: 4, // Note which step this data is from
        status: 'localStorage_collection' // Note the data collection method
    };

    experimentData.push(trialData); // Add the new trial object to our main data array
    saveData(); // Immediately save the updated array to localStorage
    updateStatus(choice); // Update the status message on the page
}

// Updates the status message displayed on the page
function updateStatus(choice = null) {
    const statusEl = document.getElementById('status');
    if (trialCount > 0) {
        // If a choice was just made, use it. Otherwise, get the last choice from the data.
        const lastChoice = choice || experimentData[experimentData.length - 1].playerChoice;
        statusEl.innerHTML = `Trial ${trialCount}: Logged '${lastChoice}'. Total trials: ${trialCount}.`;
    } else {
        // If there are no trials, show the initial message
        statusEl.innerHTML = 'Ready - Click a button to start collecting data';
    }
}

// Downloads the collected data as a JSON file
function downloadJSON() {
    if (experimentData.length === 0) {
        alert("No data to download.");
        return;
    }
    // The 'null, 2' argument formats the JSON nicely with indentation
    const dataStr = JSON.stringify(experimentData, null, 2);
    // Create a "Blob" which is a file-like object
    const dataBlob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(dataBlob);
    
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `rps-data-${new Date().toISOString()}.json`; // Set the filename
    document.body.appendChild(link);
    link.click(); // Programmatically click the link
    document.body.removeChild(link); // Clean up by removing the link
    URL.revokeObjectURL(url);
}

// Downloads the collected data as a CSV file
function downloadCSV() {
    if (experimentData.length === 0) {
        alert("No data to download.");
        return;
    }
    // Define the headers for our CSV file
    const headers = "trial,timestamp,playerChoice,step,status";
    // Convert each data object into a comma-separated string
    const rows = experimentData.map(d => `${d.trial},${d.timestamp},${d.playerChoice},${d.step},${d.status}`);
    // Join the headers and rows with newline characters
    const csvContent = [headers, ...rows].join("\n");
    
    const dataBlob = new Blob([csvContent], {type: "text/csv"});
    const url = URL.createObjectURL(dataBlob);
    
    // This part is the same as the JSON download
    const link = document.createElement('a');
    link.href = url;
    link.download = `rps-data-${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Generates and copies the AI prompt for adapting this step
function copyStep4Prompt() {
    const promptText = `I'm building a psychology experiment based on my Step 0 study choice: [REFERENCE YOUR my-study-reference.md FILE]

I need to add local data collection to my experiment using localStorage.

Based on my study from Step 0, I need to collect data about:
- [LIST WHAT PARTICIPANTS WILL DO - e.g., "word recognition responses", "reaction times", "choice patterns"]
- [KEY VARIABLES FROM YOUR STEP 0 PLANNING - e.g., "accuracy", "response times", "confidence ratings"]

Help me create:
1. A 'logChoice' function that saves the right data for my experiment type
2. A function to load existing data from localStorage when the page opens  
3. Download functions for both JSON and CSV formats
4. A button to clear the data from localStorage with confirmation

The goal is to collect meaningful data for my research question that persists between page loads, all locally in the browser.`;
    navigator.clipboard.writeText(promptText).then(() => {
        alert("Prompt copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}
