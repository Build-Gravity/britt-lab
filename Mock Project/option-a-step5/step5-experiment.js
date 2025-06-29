// Step 5: Experimental Design Configuration
// Enhanced with JSON config approach and psychology-specific guidance

let rpsConfig = {
    numTrials: 100,
    feedbackDelay: 1500,
    showProgress: true,
    showAIStrategy: true,
    askParticipantInfo: true,
    aiAlgorithm: '',
    // New ELPH parameters with defaults
    stmLength: 3,
    entropyThreshold: 1.5,
    minObservations: 3,
    hypothesisPruning: true,
    // Biased Random AI parameters
    phase1End: 200,
    phase2End: 400
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Step 5: Experimental Design Configuration initialized');
    
    // Set up event listeners for RPS example
    setupRPSEventListeners();
    
    // Load any saved RPS configuration
    loadSavedRPSConfig();
    
    // Update initial preview
    updateRPSPreview();
    
    // Handle algorithm selection changes
    handleAlgorithmSelection();
    
    // Show algorithm explanation for default
    showAlgorithmExplanation();
    
    // Set up initial phase constraints
    validatePhaseConstraints();
});

/**
 * A helper function to synchronize a range slider and a number input.
 * When one changes, the other updates.
 * @param {string} sliderId - The ID of the range input.
 * @param {string} numberId - The ID of the number input.
 */
function syncSliderAndNumberInput(sliderId, numberId) {
    const slider = document.getElementById(sliderId);
    const numberInput = document.getElementById(numberId);

    if (!slider || !numberInput) return;

    slider.addEventListener('input', () => {
        numberInput.value = slider.value;
        updateRPSPreview();
    });

    numberInput.addEventListener('input', () => {
        slider.value = numberInput.value;
        updateRPSPreview();
    });
}

function setupRPSEventListeners() {
    // Sync sliders with their number inputs
    syncSliderAndNumberInput('num-trials', 'num-trials-number');
    syncSliderAndNumberInput('feedback-delay', 'feedback-delay-number');

    // General listeners
    const showProgressEl = document.getElementById('show-progress');
    const showAIStrategyEl = document.getElementById('show-ai-strategy');
    const aiAlgorithmEl = document.getElementById('ai-algorithm');
    const stmLengthEl = document.getElementById('stm-length');
    const hypothesisPruningEl = document.getElementById('hypothesis-pruning');
    const askParticipantInfoEl = document.getElementById('ask-participant-info');
    const downloadConfigBtn = document.getElementById('download-config-btn');
    const formEl = document.getElementById('rps-config-form');

    // Constraint listeners
    const numTrialsEl = document.getElementById('num-trials-number');
    const phase1EndEl = document.getElementById('phase1-end-number');
    const phase2EndEl = document.getElementById('phase2-end-number');
    
    if (showProgressEl) showProgressEl.addEventListener('change', updateRPSPreview);
    if (showAIStrategyEl) showAIStrategyEl.addEventListener('change', updateRPSPreview);
    if (hypothesisPruningEl) hypothesisPruningEl.addEventListener('change', updateRPSPreview);
    if (stmLengthEl) stmLengthEl.addEventListener('change', updateRPSPreview);
    if (askParticipantInfoEl) askParticipantInfoEl.addEventListener('change', updateRPSPreview);
    
    if (aiAlgorithmEl) {
        aiAlgorithmEl.addEventListener('change', updateRPSPreview);
        aiAlgorithmEl.addEventListener('change', handleAlgorithmSelection);
        aiAlgorithmEl.addEventListener('change', showAlgorithmExplanation);
    }
    
    if (numTrialsEl) {
        numTrialsEl.addEventListener('change', validatePhaseConstraints);
        numTrialsEl.addEventListener('blur', validatePhaseConstraints);
    }
    if (phase1EndEl) {
        phase1EndEl.addEventListener('change', validatePhaseConstraints);
        phase1EndEl.addEventListener('blur', validatePhaseConstraints);
    }
    if (phase2EndEl) {
        phase2EndEl.addEventListener('change', validatePhaseConstraints);
        phase2EndEl.addEventListener('blur', validatePhaseConstraints);
    }
    
    // Handle JSON download
    if (downloadConfigBtn) {
        downloadConfigBtn.addEventListener('click', downloadJSONConfig);
    }
    
    // Handle form submission
    if (formEl) {
        formEl.addEventListener('submit', function(e) {
            e.preventDefault();
            applyRPSConfiguration();
        });
    }
}

function handleAlgorithmSelection() {
    const aiAlgorithmEl = document.getElementById('ai-algorithm');
    const settingsContainer = document.getElementById('ai-settings-container');
    const patternSettings = document.getElementById('pattern-settings');
    const frequencySettings = document.getElementById('frequency-settings');
    const biasedSettings = document.getElementById('biased-settings');
    
    if (!aiAlgorithmEl || !settingsContainer) return;
    
    const selectedAlgorithm = aiAlgorithmEl.value;
    
    // Hide all algorithm settings first
    if (patternSettings) patternSettings.style.display = 'none';
    if (frequencySettings) frequencySettings.style.display = 'none';
    if (biasedSettings) biasedSettings.style.display = 'none';
    
    // Show container and specific settings based on selection
    if (!selectedAlgorithm || ['random', 'counter', 'frequency_counter'].includes(selectedAlgorithm)) {
        settingsContainer.style.display = 'none';
    } else {
        settingsContainer.style.display = 'block';
        
        if (selectedAlgorithm === 'elph' && patternSettings) {
            patternSettings.style.display = 'block';
        } else if (selectedAlgorithm === 'biased_random' && biasedSettings) {
            biasedSettings.style.display = 'block';
        }
    }
}

function showAlgorithmExplanation() {
    const aiAlgorithmEl = document.getElementById('ai-algorithm');
    const explanationBox = document.getElementById('algorithm-explanation');
    const explanationContent = document.getElementById('explanation-content');
    
    if (!aiAlgorithmEl || !explanationBox || !explanationContent) return;
    
    const selectedAlgorithm = aiAlgorithmEl.value;
    
    const explanations = {
        'random': {
            title: 'Random (Baseline)',
            description: 'Completely random move selection with equal probability for Rock, Paper, and Scissors.',
            details: 'Perfect for baseline comparisons. No learning or adaptation - pure randomness every round.',
            parameters: 'No configurable parameters.',
            useCase: 'Ideal for control conditions and testing if players can detect patterns where none exist.'
        },
        'counter': {
            title: 'Counter (Beats Last Move)',
            description: 'Simple reactive strategy that always tries to beat your previous move.',
            details: 'If you played Rock last round, AI plays Paper this round. Very predictable once you understand the pattern.',
            parameters: 'No configurable parameters.',
            useCase: 'Great for studying how quickly participants adapt to simple, deterministic strategies.'
        },
        'frequency_counter': {
            title: 'Frequency Counter',
            description: 'Analyzes your move history and counters your most frequently used move.',
            details: 'Tracks how often you play Rock, Paper, and Scissors, then plays the move that beats your most common choice.',
            parameters: 'No configurable parameters.',
            useCase: 'Tests whether participants can maintain balanced strategies when facing statistical analysis.'
        },
        'biased_random': {
            title: 'Biased Random (Original Study)',
            description: 'Replicates the exact algorithm from Mohammadi Sepahvand et al. (2014) with three distinct phases.',
            details: 'Phase 1: Random (33% each). Phase 2: Light bias (50% Rock, 25% Paper/Scissors). Phase 3: Heavy bias (10% Rock, 80% Paper, 10% Scissors).',
            parameters: 'Phase boundaries are configurable below - adjust when the AI switches between strategies.',
            useCase: 'Perfect for replicating published research or studying adaptation to changing opponent strategies.'
        },
        'elph': {
            title: 'Pattern Matcher (ELPH)',
            description: 'Advanced learning AI that detects sequences in your moves and predicts your next choice.',
            details: 'Looks for patterns like "Rock-Paper-?" and predicts you\'ll play Scissors, then counters with Rock. Gets smarter over time. <br><a href="elph-algorithm-technical.html" target="_blank" class="secondary-btn compact">📖 View ELPH Technical Explanation</a><br>',
            parameters: 'STM length, entropy threshold, and minimum observations are all configurable below.',
            useCase: 'Ideal for studying human pattern generation, learning detection, and strategic adaptation.'
        }
    };
    
    if (selectedAlgorithm && explanations[selectedAlgorithm]) {
        const explanation = explanations[selectedAlgorithm];
        explanationContent.innerHTML = `
            <h4>${explanation.title}</h4>
            <p><strong>Strategy:</strong> ${explanation.description}</p>
            <p><strong>How it works:</strong> ${explanation.details}</p>
            <p><strong>Parameters:</strong> ${explanation.parameters}</p>
            <p><strong>Research use:</strong> ${explanation.useCase}</p>
        `;
        explanationBox.style.display = 'block';
    } else {
        explanationBox.style.display = 'none';
    }
}

function validatePhaseConstraints() {
    const numTrialsEl = document.getElementById('num-trials-number');
    const phase1EndEl = document.getElementById('phase1-end-number');
    const phase2EndEl = document.getElementById('phase2-end-number');
    
    if (!numTrialsEl || !phase1EndEl || !phase2EndEl) return;
    
    let numTrials = parseInt(numTrialsEl.value, 10) || 100;
    let phase1End = parseInt(phase1EndEl.value, 10) || 0;
    let phase2End = parseInt(phase2EndEl.value, 10) || 0;

    // Set min/max for phase inputs based on total trials
    phase1EndEl.max = numTrials - 2; // Must be at least 2 trials for phase 2 & 3
    phase2EndEl.max = numTrials - 1; // Must be at least 1 trial for phase 3

    // 1. Ensure Phase 1 end is less than Phase 2 end
    if (phase1End >= phase2End && phase2End > 0) {
        phase1EndEl.value = phase2End - 1;
    }
    
    // 2. Ensure Phase 2 end is greater than Phase 1 end
    if (phase2End <= phase1End) {
        phase2EndEl.value = phase1End + 1;
    }

    // 3. Ensure phases don't exceed total trials
    if (phase1End >= numTrials) {
        phase1EndEl.value = numTrials - 2;
    }
    if (phase2End >= numTrials) {
        phase2EndEl.value = numTrials - 1;
    }
}

function updateRPSPreview() {
    // Update the config object with current form values
    rpsConfig.numTrials = parseInt(document.getElementById('num-trials')?.value) || 100;
    rpsConfig.feedbackDelay = parseInt(document.getElementById('feedback-delay')?.value) || 1500;
    rpsConfig.showProgress = document.getElementById('show-progress')?.checked || false;
    rpsConfig.showAIStrategy = document.getElementById('show-ai-strategy')?.checked || false;
    rpsConfig.askParticipantInfo = document.getElementById('ask-participant-info')?.checked !== false;
    rpsConfig.aiAlgorithm = document.getElementById('ai-algorithm')?.value || '';
    
    // ELPH-specific settings
    rpsConfig.stmLength = parseInt(document.getElementById('stm-length')?.value) || 3;
    rpsConfig.entropyThreshold = parseFloat(document.getElementById('entropy-threshold-number')?.value) || 1.5;
    rpsConfig.minObservations = parseInt(document.getElementById('min-observations-number')?.value) || 3;
    rpsConfig.hypothesisPruning = document.getElementById('hypothesis-pruning')?.checked !== false;
    
    // Biased Random settings
    rpsConfig.phase1End = parseInt(document.getElementById('phase1-end-number')?.value) || 200;
    rpsConfig.phase2End = parseInt(document.getElementById('phase2-end-number')?.value) || 400;
    
    // Update estimated time
    updateEstimatedTime();
    
    console.log('🔄 Configuration updated:', rpsConfig);
}

function updateEstimatedTime() {
    const timeEl = document.getElementById('estimated-time');
    if (!timeEl) return;
    
    const numTrials = rpsConfig.numTrials || 100;
    const feedbackDelay = rpsConfig.feedbackDelay || 1500;
    const totalSeconds = (numTrials * (feedbackDelay + 1000)) / 1000; // Assume 1s reaction time
    
    if (totalSeconds < 60) {
        timeEl.textContent = `~${Math.round(totalSeconds)} seconds`;
    } else {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.round(totalSeconds % 60);
        timeEl.textContent = `~${minutes} minute${minutes > 1 ? 's' : ''}${seconds > 0 ? ` and ${seconds} seconds` : ''}`;
    }
}

/**
 * Downloads the current configuration as a JSON file.
 * This introduces students to standard experiment configuration practices.
 */
function downloadJSONConfig() {
    // Update the global config with the latest form values before downloading
    updateRPSPreview(); 
    
    // Create a clean config object for export
    const exportConfig = {
        general: {
            numTrials: rpsConfig.numTrials,
            feedbackDelay: rpsConfig.feedbackDelay,
            showProgress: rpsConfig.showProgress,
            askParticipantInfo: rpsConfig.askParticipantInfo,
        },
        ai: {
            algorithm: rpsConfig.aiAlgorithm
        }
    };

    // Add algorithm-specific parameters
    if (rpsConfig.aiAlgorithm === 'elph') {
        exportConfig.ai.parameters = {
            stmLength: rpsConfig.stmLength,
            entropyThreshold: rpsConfig.entropyThreshold,
            minObservations: rpsConfig.minObservations,
            hypothesisPruning: rpsConfig.hypothesisPruning
        };
    } else if (rpsConfig.aiAlgorithm === 'biased_random') {
        exportConfig.ai.parameters = {
            phase1End: rpsConfig.phase1End,
            phase2End: rpsConfig.phase2End
        };
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportConfig, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "rps_config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    showStatus("✅ Configuration downloaded as <strong>rps_config.json</strong>.", "success");
}

/**
 * Applies the current configuration and saves it to localStorage.
 * This makes the settings persistent and available for Step 6.
 */
function applyRPSConfiguration() {
    // Update the global config with the latest form values
    updateRPSPreview();
    
    // Save the complete configuration to localStorage
    try {
        localStorage.setItem('rpsExperimentConfig', JSON.stringify(rpsConfig));
        console.log('💾 Configuration saved:', rpsConfig);
        showStatus("✅ Configuration saved! It will be used in the next step.", "success");
    } catch (error) {
        console.error("Error saving to localStorage:", error);
        showStatus("❌ Error: Could not save configuration. Your browser might be blocking storage.", "error");
    }
}

/**
 * Loads the saved configuration from localStorage and updates the form.
 */
function loadSavedRPSConfig() {
    const savedConfigJSON = localStorage.getItem('rpsExperimentConfig');
    if (!savedConfigJSON) {
        console.log('No saved config found. Using defaults.');
        // Apply defaults to UI
        updateFormFromConfig(rpsConfig);
        return;
    }

    try {
        const savedConfig = JSON.parse(savedConfigJSON);
        rpsConfig = { ...rpsConfig, ...savedConfig }; // Merge saved config with defaults
        console.log('📄 Loaded saved configuration:', rpsConfig);
        
        updateFormFromConfig(rpsConfig);
        
    } catch (error) {
        console.error("Error parsing saved configuration:", error);
        // If parsing fails, stick with defaults
        updateFormFromConfig(rpsConfig);
    }
}

/**
 * Helper function to update all form inputs from a config object.
 * @param {object} config - The configuration object.
 */
function updateFormFromConfig(config) {
    if (!config) return;
    
    // Update general settings
    setInputValue('num-trials', config.numTrials, 'range');
    setInputValue('num-trials-number', config.numTrials, 'number');
    setInputValue('feedback-delay', config.feedbackDelay, 'range');
    setInputValue('feedback-delay-number', config.feedbackDelay, 'number');
    setInputValue('show-progress', config.showProgress, 'checkbox');
    setInputValue('show-ai-strategy', config.showAIStrategy, 'checkbox');
    setInputValue('ask-participant-info', config.askParticipantInfo, 'checkbox');
    setInputValue('ai-algorithm', config.aiAlgorithm, 'select');

    // Update ELPH (pattern) settings
    setInputValue('stm-length', config.stmLength, 'select');
    setInputValue('entropy-threshold-number', config.entropyThreshold, 'number');
    setInputValue('min-observations-number', config.minObservations, 'number');
    setInputValue('hypothesis-pruning', config.hypothesisPruning, 'checkbox');
    
    // Update Biased Random settings
    setInputValue('phase1-end-number', config.phase1End, 'number');
    setInputValue('phase2-end-number', config.phase2End, 'number');

    // Refresh UI elements based on new values
    handleAlgorithmSelection();
    showAlgorithmExplanation();
    updateRPSPreview();
    validatePhaseConstraints();
}

/**
 * A robust helper to set the value of different form input types.
 * @param {string} id - The ID of the form element.
 * @param {any} value - The value to set.
 * @param {string} type - The type of input ('range', 'number', 'checkbox', 'select').
 */
function setInputValue(id, value, type = 'text') {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) {
        switch (type) {
            case 'checkbox':
                el.checked = !!value;
                break;
            case 'range':
            case 'number':
            case 'select':
            default:
                el.value = value;
                break;
        }
    }
}

function showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = `status-message ${type}`;
        statusEl.style.display = 'block';
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 3000);
    }
}

// Export configuration functions for other scripts to use
window.getRPSConfig = function() {
    return rpsConfig;
};

// Helper function to generate configuration suggestions for different experiment types
window.generateConfigSuggestions = function(experimentType) {
    const suggestions = {
        'reaction-time': {
            timing: {
                trialDuration: 3000,
                interTrialInterval: 800,
                maxResponseTime: 2000
            },
            structure: {
                practiceTrials: 20,
                experimentTrials: 100,
                blocks: 2
            },
            display: {
                showProgress: false,
                showFeedback: true
            }
        },
        'decision-making': {
            timing: {
                trialDuration: 10000,
                interTrialInterval: 2000,
                maxResponseTime: 8000
            },
            structure: {
                practiceTrials: 10,
                experimentTrials: 50,
                blocks: 3
            },
            display: {
                showProgress: true,
                showFeedback: true
            }
        },
        'learning': {
            timing: {
                trialDuration: 5000,
                interTrialInterval: 1500,
                maxResponseTime: 4000
            },
            structure: {
                practiceTrials: 5,
                experimentTrials: 80,
                blocks: 4
            },
            display: {
                showProgress: true,
                showFeedback: false
            }
        },
        'memory': {
            timing: {
                trialDuration: 4000,
                interTrialInterval: 1000,
                maxResponseTime: 3000
            },
            structure: {
                practiceTrials: 8,
                experimentTrials: 60,
                blocks: 2
            },
            display: {
                showProgress: false,
                showFeedback: false
            }
        }
    };
    
    return suggestions[experimentType] || suggestions['decision-making'];
}; 