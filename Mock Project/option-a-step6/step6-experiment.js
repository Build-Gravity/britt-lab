// Step 6: Interactive Elements Experiment
// Simple game flow and data collection - easy to adapt for your own experiments
// Complex AI algorithms are in step6-ai-algorithms.js

let gameState = {
    playerScore: 0,
    aiScore: 0,
    tieScore: 0,
    currentRound: 1,
    totalRounds: 30,
    playerHistory: [],
    gameData: [],
    gameStartTime: null,
    isGameActive: false,
    aiAgent: null,
    // New: basic participant-level metadata captured automatically
    participantInfo: {
        sessionStart: new Date().toISOString(),
        name: null,
        age: null
    }
};

let gameConfig = {
    numTrials: 100,
    trialDuration: 5,
    feedbackDelay: 1500,
    showProgress: true,
    aiAlgorithm: '',
    learningRate: 'moderate',
    stmLength: 3,
    entropyThreshold: 1.5,
    minObservations: 3,
    alpha: 0.3,
    phase1End: 200,
    phase2End: 400,
    showAIStrategy: true,
    askParticipantInfo: true
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Step 6: Interactive Elements initialized');
    
    // Load configuration from Step 5
    loadGameConfiguration();
    
    // Initialize AI agent (uses algorithms from separate file)
    initializeAI();
    
    // Update UI with configuration
    updateConfigurationDisplay();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show participant form if configured (now that config is loaded)
    setupParticipantOverlay();
});

function loadGameConfiguration() {
    // Load from Step 5 configuration
    const savedConfig = localStorage.getItem('rpsExperimentConfig');
    if (savedConfig) {
        try {
            const config = JSON.parse(savedConfig);
            gameConfig = { ...gameConfig, ...config };
            gameState.totalRounds = gameConfig.numTrials;
            
            console.log('📝 Loaded Step 5 configuration:', gameConfig);
        } catch (error) {
            console.warn('Failed to load Step 5 configuration:', error);
        }
    }
}

function initializeAI() {
    // Create AI based on algorithm selection from Step 5
    const algorithm = gameConfig.aiAlgorithm;
    
    if (!algorithm) {
        // No algorithm selected in Step 5 - use random as fallback with message
        gameState.aiAgent = new RandomAI();
        updateGameStatus('⚠️ No AI algorithm configured in Step 5. Using Random AI as fallback. Configure in Step 5 for full experience.');
        console.log(`🤖 No algorithm configured - using RANDOM fallback`);
        return;
    }
    
    if (algorithm === 'elph' || algorithm === 'pattern') {
        // Use the ELPH AI (PatternAI kept for backward compatibility)
        gameState.aiAgent = new ELPH_AI({
            stmLength: gameConfig.stmLength || gameConfig.patternLength || 3,
            entropyThreshold: gameConfig.entropyThreshold || 1.5,
            minObservations: gameConfig.minObservations || gameConfig.confidenceThreshold || 3,
            hypothesisPruning: gameConfig.hypothesisPruning !== false,
            learningRate: gameConfig.learningRate || 'moderate',
            alpha: gameConfig.alpha || 0.3
        });
        console.log(`🤖 ELPH AI created with config:`, gameState.aiAgent.config);
    } else if (algorithm === 'random') {
        // Use dedicated RandomAI
        gameState.aiAgent = new RandomAI();
        console.log(`🤖 RandomAI created`);
    } else if (algorithm === 'counter') {
        // Use dedicated CounterAI
        gameState.aiAgent = new CounterAI();
        console.log(`🤖 CounterAI created`);
    } else if (algorithm === 'biased_random') {
        // Use dedicated BiasedRandomAI
        const aiConfig = {
            phase1End: gameConfig.phase1End || 200,
            phase2End: gameConfig.phase2End || 400
        };
        gameState.aiAgent = new BiasedRandomAI(aiConfig);
        console.log(`🤖 BiasedRandomAI created with phases:`, aiConfig);
    } else if (algorithm === 'frequency_counter') {
        // Use dedicated FrequencyCounterAI
        gameState.aiAgent = new FrequencyCounterAI();
        console.log(`🤖 FrequencyCounterAI created`);
    } else {
        // Unknown algorithm - fallback to random
        gameState.aiAgent = new RandomAI();
        updateGameStatus(`⚠️ Unknown algorithm "${algorithm}" - using Random AI as fallback.`);
        console.log(`🤖 Unknown algorithm ${algorithm} - using RANDOM fallback`);
    }
}

function updateConfigurationDisplay() {
    // Update UI with configuration details
    document.getElementById('total-rounds').textContent = gameState.totalRounds;
    
    const algorithm = gameConfig.aiAlgorithm;
    const strategyElement = document.getElementById('current-algorithm');
    const configDetails = document.getElementById('config-details');
    
    if (strategyElement) {
        if (!algorithm) {
            strategyElement.textContent = 'NO ALGORITHM CONFIGURED (using Random fallback)';
        } else {
            switch (algorithm) {
                case 'pattern':
                case 'elph':
                    strategyElement.textContent = `ELPH AI (${gameConfig.learningRate || 'moderate'} learning)`;
                    break;
                case 'random':
                    strategyElement.textContent = 'RANDOM';
                    break;
                case 'counter':
                    strategyElement.textContent = 'COUNTER (beats your last move)';
                    break;
                case 'biased_random':
                    strategyElement.textContent = 'BIASED RANDOM (original study phases)';
                    break;
                case 'frequency_counter':
                    strategyElement.textContent = 'FREQUENCY COUNTER (beats your most common move)';
                    break;
                default:
                    strategyElement.textContent = `UNKNOWN (${algorithm})`;
            }
        }
    }
    
    // Show additional config details based on algorithm
    if (configDetails) {
        if (!algorithm) {
            configDetails.innerHTML = `<small>Return to <a href="../option-a-step5/index.html">Step 5</a> to configure an AI algorithm</small>`;
            configDetails.style.display = 'block';
        } else if (algorithm === 'pattern' || algorithm === 'elph') {
            configDetails.innerHTML = `
                <small>STM Length: ${gameConfig.stmLength || gameConfig.patternLength || 3} moves | 
                Min Observations: ${gameConfig.minObservations || gameConfig.confidenceThreshold || 3} | 
                Entropy ≤ ${gameConfig.entropyThreshold || 1.5}</small>
            `;
            configDetails.style.display = 'block';
        } else if (algorithm === 'biased_random') {
            configDetails.innerHTML = `
                <small>Phase 1: Random (1-${gameConfig.phase1End || 200}) | 
                Phase 2: 50% Rock (${(gameConfig.phase1End || 200) + 1}-${gameConfig.phase2End || 400}) | 
                Phase 3: 80% Paper (${(gameConfig.phase2End || 400) + 1}+)</small>
            `;
            configDetails.style.display = 'block';
        } else {
            configDetails.style.display = 'none';
        }
    }
}

function setupEventListeners() {
    // Basic button listeners
    const exportBtn = document.getElementById('export-data-btn');
    const resetBtn = document.getElementById('reset-game-btn');
    
    console.log('🔗 Setting up event listeners:');
    console.log('   Export button found:', !!exportBtn);
    console.log('   Reset button found:', !!resetBtn);
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportGameData);
        console.log('   ✅ Export button listener added');
    } else {
        console.warn('   ❌ Export button not found');
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
        console.log('   ✅ Reset button listener added');
    } else {
        console.warn('   ❌ Reset button not found');
    }
}

// Core game functions - simple and easy to adapt
function makeChoice(choice) {
    if (!gameState.isGameActive && gameState.currentRound === 1) {
        startGame();
    }
    
    if (!gameState.isGameActive) return;
    
    // 1. Record player choice
    const playerChoice = choice;
    const choiceTime = Date.now();
    gameState.playerHistory.push(playerChoice);
    
    // 2. Get AI choice (simple AI makes its decision)
    const aiChoice = gameState.aiAgent.makeMove();
    
    // 3. Simple game logic
    const result = determineWinner(playerChoice, aiChoice);
    updateScores(result);
    
    // 4. Let AI remember player's move for next time
    gameState.aiAgent.rememberPlayerMove(playerChoice);
    
    // 5. Record data and update UI
    recordTrialData(playerChoice, aiChoice, result, choiceTime);
    showChoices(playerChoice, aiChoice, result);
    
    // 6. Handle round progression
    disableChoiceButtons();
    setTimeout(() => {
        hideRevealSection();
        
        if (gameState.currentRound >= gameState.totalRounds) {
            endGame();
        } else {
            gameState.currentRound++;
            updateRoundDisplay();
            enableChoiceButtons();
        }
    }, gameConfig.feedbackDelay);
}

function startGame() {
    gameState.isGameActive = true;
    gameState.gameStartTime = Date.now();
    updateGameStatus('Game started! Make your choices to see how the AI adapts.');
    console.log('🎮 Game started');
}

function determineWinner(playerChoice, aiChoice) {
    // Simple game rules - easy to adapt for other choice games
    if (playerChoice === aiChoice) return 'tie';
    
    const winCombos = {
        'Rock': 'Scissors',
        'Paper': 'Rock',
        'Scissors': 'Paper'
    };
    
    return winCombos[playerChoice] === aiChoice ? 'player_wins' : 'ai_wins';
}

function updateScores(result) {
    // Simple score tracking
    switch (result) {
        case 'player_wins': gameState.playerScore++; break;
        case 'ai_wins': gameState.aiScore++; break;
        case 'tie': gameState.tieScore++; break;
    }
    
    // Update display
    const playerScore = document.getElementById('player-score');
    if (playerScore) playerScore.textContent = gameState.playerScore;
    
    const aiScore = document.getElementById('ai-score');
    if (aiScore) aiScore.textContent = gameState.aiScore;
    
    const tieScore = document.getElementById('tie-score');
    if (tieScore) tieScore.textContent = gameState.tieScore;
}

function recordTrialData(playerChoice, aiChoice, result, choiceTime) {
    // Simple data recording - easy to adapt for different experiments
    const trialData = {
        round: gameState.currentRound,
        playerChoice: playerChoice,
        aiChoice: aiChoice,
        result: result,
        timestamp: choiceTime,
        reactionTime: choiceTime - (gameState.lastTrialEnd || gameState.gameStartTime),
        // AI reasoning is trial-specific and comes from the AI module
        aiReasoning: gameState.aiAgent.explainMove()
    };
    
    gameState.gameData.push(trialData);
    gameState.lastTrialEnd = Date.now();
    
    console.log(`📊 Trial ${gameState.currentRound} recorded`);
}

// UI Functions - simple patterns students can adapt
function showChoices(playerChoice, aiChoice, result) {
    // Hide choice buttons, show results
    document.querySelector('.choice-section').style.display = 'none';
    document.getElementById('reveal-section').style.display = 'block';
    
    // Update displays
    document.getElementById('player-emoji').textContent = getChoiceEmoji(playerChoice);
    document.getElementById('player-choice-name').textContent = playerChoice;
    document.getElementById('ai-emoji').textContent = getChoiceEmoji(aiChoice);
    document.getElementById('ai-choice-name').textContent = aiChoice;
    
    // Show results
    document.getElementById('result-text').textContent = getResultText(result);
    document.getElementById('result-reason').textContent = getResultReason(playerChoice, aiChoice, result);
    
    // Show AI reasoning only if enabled in configuration
    const aiReasoningElement = document.getElementById('ai-reasoning');
    if (gameConfig.showAIStrategy !== false) {
        aiReasoningElement.textContent = gameState.aiAgent.explainMove();
        aiReasoningElement.style.display = 'block';
    } else {
        aiReasoningElement.style.display = 'none';
    }
    
    // Style based on result
    document.getElementById('result-display').className = `result-display ${result}`;
}

function hideRevealSection() {
    document.getElementById('reveal-section').style.display = 'none';
    document.querySelector('.choice-section').style.display = 'block';
}

// Simple helper functions - easy to adapt
function getChoiceEmoji(choice) {
    const emojis = {
        'Rock': '🗿',
        'Paper': '📄',
        'Scissors': '✂️'
    };
    return emojis[choice] || '❓';
}

function getResultText(result) {
    const texts = {
        'player_wins': 'You Win!',
        'ai_wins': 'AI Wins!',
        'tie': "It's a Tie!"
    };
    return texts[result] || 'Unknown Result';
}

function getResultReason(playerChoice, aiChoice, result) {
    if (result === 'tie') return `Both chose ${playerChoice}`;
    
    const reasons = {
        'Rock-Scissors': 'Rock crushes Scissors',
        'Paper-Rock': 'Paper covers Rock',
        'Scissors-Paper': 'Scissors cut Paper'
    };
    
    const winningChoice = result === 'player_wins' ? playerChoice : aiChoice;
    const losingChoice = result === 'player_wins' ? aiChoice : playerChoice;
    
    return reasons[`${winningChoice}-${losingChoice}`] || `${winningChoice} beats ${losingChoice}`;
}

function disableChoiceButtons() {
    document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);
}

function enableChoiceButtons() {
    document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = false);
}

function updateRoundDisplay() {
    document.getElementById('current-round').textContent = gameState.currentRound;
    
    if (gameConfig.showProgress) {
        const progressPercent = ((gameState.currentRound - 1) / gameState.totalRounds) * 100;
        const gameProgressFill = document.getElementById('game-progress-fill');
        if (gameProgressFill) gameProgressFill.style.width = `${progressPercent}%`;
    }
}

function updateGameStatus(message) {
    const statusEl = document.getElementById('game-status');
    if (statusEl) statusEl.innerHTML = `<p>${message}</p>`;
}

function endGame() {
    gameState.isGameActive = false;
    
    // Hide game area, show completion
    const gameSection = document.querySelector('.game-section');
    if (gameSection) gameSection.style.display = 'none';
    
    const gameComplete = document.getElementById('game-complete');
    if (gameComplete) gameComplete.style.display = 'block';
    
    displayFinalResults();
    
    // Set up button event listeners now that they're visible
    setupCompletionButtonListeners();
    
    updateGameStatus('🎉 Experiment complete! Review your results below.');
    console.log('🎯 Game completed');
}

function setupCompletionButtonListeners() {
    // Set up event listeners for completion buttons
    const exportBtn = document.getElementById('export-data-btn');
    const resetBtn = document.getElementById('reset-game-btn');
    
    console.log('🔗 Setting up completion button listeners:');
    console.log('   Export button found:', !!exportBtn);
    console.log('   Reset button found:', !!resetBtn);
    
    if (exportBtn) {
        // Remove any existing listeners first
        exportBtn.removeEventListener('click', exportGameData);
        exportBtn.addEventListener('click', exportGameData);
        console.log('   ✅ Export button listener added');
    } else {
        console.warn('   ❌ Export button not found');
    }
    
    if (resetBtn) {
        // Remove any existing listeners first
        resetBtn.removeEventListener('click', resetGame);
        resetBtn.addEventListener('click', resetGame);
        console.log('   ✅ Reset button listener added');
    } else {
        console.warn('   ❌ Reset button not found');
    }
}

function displayFinalResults() {
    // Simple results calculation
    const totalGames = gameState.gameData.length;
    const playerWinRate = (gameState.playerScore / totalGames * 100).toFixed(1);
    const aiWinRate = (gameState.aiScore / totalGames * 100).toFixed(1);
    const tieRate = (gameState.tieScore / totalGames * 100).toFixed(1);
    
    // Calculate AI learning progression
    const thirdSize = Math.floor(totalGames / 3);
    const earlyGames = gameState.gameData.slice(0, thirdSize);
    const lateGames = gameState.gameData.slice(-thirdSize);
    
    const earlyAIWins = earlyGames.filter(game => game.result === 'ai_wins').length;
    const lateAIWins = lateGames.filter(game => game.result === 'ai_wins').length;
    
    const earlyAIRate = (earlyAIWins / earlyGames.length * 100).toFixed(1);
    const lateAIRate = (lateAIWins / lateGames.length * 100).toFixed(1);
    
    // Display results
    const finalResults = document.getElementById('final-results');
    if (finalResults) {
        finalResults.innerHTML = `
        <div class="results-grid">
            <div class="result-card">
                <h4>🏆 Who Won?</h4>
                <p><strong>You:</strong> ${gameState.playerScore} wins (${playerWinRate}%)</p>
                <p><strong>AI:</strong> ${gameState.aiScore} wins (${aiWinRate}%)</p>
                <p><strong>Ties:</strong> ${gameState.tieScore} games (${tieRate}%)</p>
            </div>
            
            <div class="result-card">
                <h4>🤖 Did the AI Get Better?</h4>
                <p><strong>First third:</strong> AI won ${earlyAIRate}% of games</p>
                <p><strong>Last third:</strong> AI won ${lateAIRate}% of games</p>
                <p><strong>Change:</strong> ${(lateAIRate - earlyAIRate) >= 0 ? '+' : ''}${(lateAIRate - earlyAIRate).toFixed(1)}% ${(lateAIRate - earlyAIRate) >= 0 ? '(got better!)' : '(got worse)'}</p>
            </div>
            
            <div class="result-card">
                <h4>⚙️ AI Details</h4>
                <p><strong>Strategy:</strong> ${gameState.aiAgent.strategy.toUpperCase()}</p>
                <p><strong>Description:</strong> ${gameState.aiAgent.strategy === 'random' ? 'Picks moves randomly' : 'Counters your last move'}</p>
                <p><strong>Moves remembered:</strong> ${gameState.aiAgent.playerHistory.length}</p>
            </div>
        </div>
    `;
    }
}

function exportGameData() {
    console.log('🔄 Export button clicked');

    try {
        const exportData = {
            gameConfiguration: gameConfig,
            participantInfo: gameState.participantInfo,
            experimentSummary: {
                title: 'Step 6: Interactive Elements - RPS AI Demonstration',
                totalRounds: gameState.totalRounds,
                completedAt: new Date().toISOString(),
                finalScores: {
                    player: gameState.playerScore,
                    ai: gameState.aiScore,
                    ties: gameState.tieScore
                },
                aiStats: gameState.aiAgent ? gameState.aiAgent.getStats() : null
            },
            trialData: gameState.gameData,
            fullPlayerHistory: gameState.playerHistory
        };

        console.log('📊 Export data prepared:', exportData);

        // Create download
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `rps-ai-experiment-${gameConfig.aiAlgorithm || 'data'}-${new Date().toISOString().split('T')[0]}.json`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        updateGameStatus('✅ Results downloaded successfully!');
        console.log('✅ Export completed successfully');

    } catch (error) {
        console.error('❌ Export failed:', error);
        updateGameStatus('❌ Export failed. Check console for details.');
    }
}

function resetGame() {
    console.log('🔄 Reset button clicked');
    
    try {
        // Simple reset
        gameState = {
            playerScore: 0,
            aiScore: 0,
            tieScore: 0,
            currentRound: 1,
            totalRounds: gameConfig.numTrials,
            playerHistory: [],
            gameData: [],
            gameStartTime: null,
            isGameActive: false,
            aiAgent: null,
            // New: basic participant-level metadata captured automatically
            participantInfo: {
                sessionStart: new Date().toISOString(),
                name: null,
                age: null
            }
        };
        
        // Reinitialize
        initializeAI();
        
        // Reset UI
        const playerScore = document.getElementById('player-score');
        if (playerScore) playerScore.textContent = '0';
        
        const aiScore = document.getElementById('ai-score');
        if (aiScore) aiScore.textContent = '0';
        
        const tieScore = document.getElementById('tie-score');
        if (tieScore) tieScore.textContent = '0';
        
        const currentRound = document.getElementById('current-round');
        if (currentRound) currentRound.textContent = '1';
        
        // Show/hide sections
        const gameSection = document.querySelector('.game-section');
        if (gameSection) gameSection.style.display = 'block';
        
        const gameComplete = document.getElementById('game-complete');
        if (gameComplete) gameComplete.style.display = 'none';
        
        hideRevealSection();
        enableChoiceButtons();
        
        updateGameStatus('Game reset! Ready to play again.');
        console.log('✅ Game reset completed successfully');
        
    } catch (error) {
        console.error('❌ Reset failed:', error);
        updateGameStatus('❌ Reset failed. Check console for details.');
    }
}

// AI-assisted prompt functions for "Build Your Own" section
function copyInteractivePrompt() {
    const promptText = `I'm building interactive elements for my [EXPERIMENT TYPE] study from Step 0: [YOUR STUDY DESCRIPTION].

I need help implementing:
1. [Adaptive difficulty/AI opponent/dynamic feedback/pattern recognition]
2. An algorithm that [learns from participant behavior/adapts to performance/provides intelligent responses]
3. Real-time adaptation based on [accuracy/response time/strategy/choices]

My experiment measures [YOUR DEPENDENT VARIABLE] and I want the interaction to [YOUR GOAL].

Can you help me design the algorithm and implement the JavaScript?`;

    navigator.clipboard.writeText(promptText).then(() => {
        showStatus('Interactive elements prompt copied! Use this with your AI assistant.', 'success');
    }).catch(() => {
        showStatus('Copy failed. Please select and copy the text manually.', 'error');
    });
}

function copyImplementationPrompt() {
    const promptText = `I want to add interactive elements to my psychology experiment. 

Before running this prompt:
1. Go to Step 5 and download your configuration using "📥 Download JSON Config" button
2. Create a study-plan.md file with your research details from Step 0

Then include these files as context:
- Your downloaded config.json file from Step 5
- Your study-plan.md file with research details from Step 0

Help me implement:
1. [SPECIFIC INTERACTIVE ELEMENT] that adapts to participant behavior
2. JavaScript functions to track performance and adjust parameters
3. Real-time updates to experiment difficulty/feedback/responses
4. Data logging for the interactive element's decisions

Reference my study-plan.md file for experiment details.`;

    navigator.clipboard.writeText(promptText).then(() => {
        showStatus('Implementation prompt copied! Use this with your AI assistant.', 'success');
    }).catch(() => {
        showStatus('Copy failed. Please select and copy the text manually.', 'error');
    });
}

// Utility function for status messages
function showStatus(message, type) {
    const statusEl = document.createElement('div');
    statusEl.className = `status-message ${type}`;
    statusEl.textContent = message;
    statusEl.style.position = 'fixed';
    statusEl.style.top = '20px';
    statusEl.style.right = '20px';
    statusEl.style.zIndex = '1000';
    statusEl.style.padding = '15px';
    statusEl.style.borderRadius = '8px';
    statusEl.style.fontWeight = 'bold';
    
    document.body.appendChild(statusEl);
    
    setTimeout(() => {
        if (statusEl.parentNode) {
            statusEl.parentNode.removeChild(statusEl);
        }
    }, 3000);
}

// Export for debugging
window.gameState = gameState;
window.gameConfig = gameConfig;

// Capture or update participant-level data (extend as needed)
function gatherParticipantInfo(customFields = {}) {
    gameState.participantInfo = {
        ...gameState.participantInfo,
        ...customFields
    };
    console.log('🧑‍💻 Participant info captured:', gameState.participantInfo);
}

// Show overlay form if askParticipantInfo is true
function setupParticipantOverlay() {
    const shouldAsk = gameConfig.askParticipantInfo !== false; // default true
    const overlay = document.getElementById('participant-overlay');
    const form = document.getElementById('participant-form');
    if (!shouldAsk || !overlay || !form) return;

    // Hide main game area until form completed
    const gameContainer = document.querySelector('.experiment-demo');
    if (gameContainer) gameContainer.style.display = 'none';

    overlay.style.display = 'block';
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const nameVal = document.getElementById('participant-name').value.trim();
        const ageVal = document.getElementById('participant-age').value.trim();
        if (!nameVal) return; // Required validation
        gatherParticipantInfo({ name: nameVal, age: ageVal ? Number(ageVal) : null });
        overlay.style.display = 'none';
        if (gameContainer) gameContainer.style.display = 'block';
    });
} 