// Step 5: Experimental Design Configuration
// Enhanced with JSON config approach and psychology-specific guidance

let rpsConfig = {
    numTrials: 30,
    feedbackDelay: 1500,
    showProgress: true,
    aiAlgorithm: 'relph',
    learningRate: 'moderate'
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
});

function setupRPSEventListeners() {
    // Update RPS preview in real-time as users change inputs
    const numTrialsEl = document.getElementById('num-trials');
    const feedbackDelayEl = document.getElementById('feedback-delay');
    const showProgressEl = document.getElementById('show-progress');
    const aiAlgorithmEl = document.getElementById('ai-algorithm');
    const learningRateEl = document.getElementById('learning-rate');
    const formEl = document.getElementById('rps-config-form');
    
    if (numTrialsEl) {
        numTrialsEl.addEventListener('input', updateRPSPreview);
        numTrialsEl.addEventListener('input', updateSliderDisplay);
    }
    if (feedbackDelayEl) {
        feedbackDelayEl.addEventListener('input', updateRPSPreview);
        feedbackDelayEl.addEventListener('input', updateSliderDisplay);
    }
    if (showProgressEl) showProgressEl.addEventListener('change', updateRPSPreview);
    if (aiAlgorithmEl) aiAlgorithmEl.addEventListener('change', updateRPSPreview);
    if (learningRateEl) learningRateEl.addEventListener('change', updateRPSPreview);
    
    // Handle form submission
    if (formEl) {
        formEl.addEventListener('submit', function(e) {
            e.preventDefault();
            applyRPSConfiguration();
        });
    }
}

function updateSliderDisplay() {
    // Update the display values for range sliders
    const numTrialsEl = document.getElementById('num-trials');
    const numTrialsValueEl = document.getElementById('num-trials-value');
    const feedbackDelayEl = document.getElementById('feedback-delay');
    const feedbackDelayValueEl = document.getElementById('feedback-delay-value');
    
    if (numTrialsEl && numTrialsValueEl) {
        numTrialsValueEl.textContent = numTrialsEl.value;
    }
    if (feedbackDelayEl && feedbackDelayValueEl) {
        feedbackDelayValueEl.textContent = feedbackDelayEl.value + 'ms';
    }
}

function updateRPSPreview() {
    // Update internal config state
    const numTrialsEl = document.getElementById('num-trials');
    const feedbackDelayEl = document.getElementById('feedback-delay');
    const showProgressEl = document.getElementById('show-progress');
    const aiAlgorithmEl = document.getElementById('ai-algorithm');
    const learningRateEl = document.getElementById('learning-rate');
    
    if (numTrialsEl) rpsConfig.numTrials = parseInt(numTrialsEl.value);
    if (feedbackDelayEl) rpsConfig.feedbackDelay = parseInt(feedbackDelayEl.value);
    if (showProgressEl) rpsConfig.showProgress = showProgressEl.checked;
    if (aiAlgorithmEl) rpsConfig.aiAlgorithm = aiAlgorithmEl.value;
    if (learningRateEl) rpsConfig.learningRate = learningRateEl.value;
    
    // Update estimated time
    updateEstimatedTime();
}

function updateEstimatedTime() {
    const estimatedTimeEl = document.getElementById('estimated-time');
    if (estimatedTimeEl && rpsConfig.numTrials && rpsConfig.feedbackDelay) {
        // Rough calculation: trials * (average choice time + feedback delay)
        const avgChoiceTime = 3000; // 3 seconds average thinking time
        const totalTime = rpsConfig.numTrials * (avgChoiceTime + rpsConfig.feedbackDelay);
        const minutes = Math.round(totalTime / 60000);
        estimatedTimeEl.textContent = `~${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
}

function applyRPSConfiguration() {
    const statusEl = document.getElementById('status-message');
    
    try {
        // Validate inputs
        if (rpsConfig.numTrials < 5 || rpsConfig.numTrials > 50) {
            throw new Error('Number of trials must be between 5 and 50');
        }
        
        if (rpsConfig.feedbackDelay < 500 || rpsConfig.feedbackDelay > 3000) {
            throw new Error('Feedback delay must be between 500 and 3000ms');
        }
        
        // Map learning rate to alpha values
        const alphaValues = {
            'slow': 0.1,
            'moderate': 0.3,
            'fast': 0.7
        };
        
        const enhancedConfig = {
            ...rpsConfig,
            alpha: alphaValues[rpsConfig.learningRate] || 0.3
        };
        
        // Save to localStorage for Step 6 to use
        localStorage.setItem('rpsExperimentConfig', JSON.stringify(enhancedConfig));
        
        // Show success message
        if (statusEl) {
            statusEl.className = 'status-message success';
            statusEl.style.display = 'block';
            statusEl.textContent = '✅ RPS Configuration saved! This will be used in Step 6 for the AI opponent demonstration';
        }
        
        // Log configuration for debugging
        console.log('RPS Configuration applied:', enhancedConfig);
        
    } catch (error) {
        if (statusEl) {
            statusEl.className = 'status-message error';
            statusEl.style.display = 'block';
            statusEl.textContent = `❌ ${error.message}`;
        }
    }
}

function loadSavedRPSConfig() {
    const saved = localStorage.getItem('rpsExperimentConfig');
    if (saved) {
        try {
            const config = JSON.parse(saved);
            
            // Restore form values
            const numTrialsEl = document.getElementById('num-trials');
            const feedbackDelayEl = document.getElementById('feedback-delay');
            const showProgressEl = document.getElementById('show-progress');
            const aiAlgorithmEl = document.getElementById('ai-algorithm');
            const learningRateEl = document.getElementById('learning-rate');
            
            if (numTrialsEl) numTrialsEl.value = config.numTrials || 30;
            if (feedbackDelayEl) feedbackDelayEl.value = config.feedbackDelay || 1500;
            if (showProgressEl) showProgressEl.checked = config.showProgress !== false;
            if (aiAlgorithmEl) aiAlgorithmEl.value = config.aiAlgorithm || 'relph';
            if (learningRateEl) learningRateEl.value = config.learningRate || 'moderate';
            
            updateRPSPreview();
            updateSliderDisplay();
            
            console.log('📝 Loaded saved RPS configuration:', config);
        } catch (error) {
            console.warn('Failed to load saved RPS configuration:', error);
        }
    }
}

// AI Design Prompt Functions
function copyDesignPrompt() {
    const promptText = `I'm designing a [reaction time/memory/decision-making/learning] experiment based on my Step 0 study: [YOUR STUDY FROM STEP 0].

Help me decide on experimental parameters:
1. How many trials for good statistical power without fatigue?
2. What timing is appropriate for my task type?
3. Should I show progress to participants?
4. How should I handle practice effects or learning?
5. What difficulty progression makes sense?

My key dependent variable is [WHAT YOU'RE MEASURING] and I expect the effect size to be [small/medium/large].`;

    navigator.clipboard.writeText(promptText).then(() => {
        showStatus('Design prompt copied! Paste this into your AI assistant.', 'success');
    }).catch(() => {
        showStatus('Copy failed. Please select and copy the text manually.', 'error');
    });
}

// JSON Configuration Functions
function copyConfigTemplate() {
    const jsonTemplate = `{
  "experiment": {
    "title": "Your Study Title from Step 0",
    "type": "reaction-time",
    "version": "1.0"
  },
  "timing": {
    "trialDuration": 3000,
    "interTrialInterval": 1500,
    "feedbackDuration": 1000,
    "maxResponseTime": 5000
  },
  "structure": {
    "practiceTrials": 10,
    "experimentTrials": 120,
    "blocks": 3,
    "breakDuration": 30000
  },
  "display": {
    "showProgress": true,
    "showFeedback": true,
    "showAccuracy": false
  },
  "conditions": {
    "randomizeOrder": true,
    "balanceConditions": true,
    "adaptiveDifficulty": false
  }
}`;

    navigator.clipboard.writeText(jsonTemplate).then(() => {
        showStatus('JSON template copied! Save this as config.json in your experiment folder.', 'success');
    }).catch(() => {
        showStatus('Copy failed. Please select and copy the text manually.', 'error');
    });
}

function copyImplementationPrompt() {
    const promptText = `I have a JSON configuration file for my psychology experiment. Help me write JavaScript to:

1. Load the JSON config file at experiment startup
2. Apply timing parameters to control trial flow
3. Use structure settings to manage blocks and breaks
4. Implement display options (progress, feedback)
5. Handle condition randomization and balancing

My config structure is: [PASTE YOUR JSON]`;

    navigator.clipboard.writeText(promptText).then(() => {
        showStatus('Implementation prompt copied! Use this with your AI assistant.', 'success');
    }).catch(() => {
        showStatus('Copy failed. Please select and copy the text manually.', 'error');
    });
}

function showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    if (statusEl) {
        statusEl.className = `status-message ${type}`;
        statusEl.style.display = 'block';
        statusEl.textContent = message;
        
        // Auto-hide after 3 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                statusEl.style.display = 'none';
            }, 3000);
        }
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