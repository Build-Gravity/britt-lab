// Step 6: AI Opponent Logic
// Simple pattern matching AI that learns from player's last 1-3 moves

class AIOpponent {
    constructor() {
        this.playerHistory = [];
        this.patternMemory = new Map(); // Stores pattern -> next move frequency
        this.choices = ['Rock', 'Paper', 'Scissors'];
        this.winCount = 0;
        this.lossCount = 0;
        this.tieCount = 0;
    }

    // Reset AI state for new game
    reset() {
        this.playerHistory = [];
        this.patternMemory.clear();
        this.winCount = 0;
        this.lossCount = 0;
        this.tieCount = 0;
    }

    // Record player's choice and update pattern memory
    recordPlayerChoice(choice) {
        this.playerHistory.push(choice);
        this.updatePatternMemory();
    }

    // Update pattern memory with new data
    updatePatternMemory() {
        if (this.playerHistory.length < 2) return;

        // Look at patterns of length 1-3 leading up to the most recent choice
        const recentChoice = this.playerHistory[this.playerHistory.length - 1];
        
        // Pattern length 1 (previous move -> current move)
        if (this.playerHistory.length >= 2) {
            const pattern1 = this.playerHistory[this.playerHistory.length - 2];
            this.addToPatternMemory(pattern1, recentChoice);
        }

        // Pattern length 2 (last 2 moves -> current move)
        if (this.playerHistory.length >= 3) {
            const pattern2 = this.playerHistory.slice(-3, -1).join('-');
            this.addToPatternMemory(pattern2, recentChoice);
        }

        // Pattern length 3 (last 3 moves -> current move)
        if (this.playerHistory.length >= 4) {
            const pattern3 = this.playerHistory.slice(-4, -1).join('-');
            this.addToPatternMemory(pattern3, recentChoice);
        }
    }

    // Add pattern observation to memory
    addToPatternMemory(pattern, nextChoice) {
        if (!this.patternMemory.has(pattern)) {
            this.patternMemory.set(pattern, {
                'Rock': 0,
                'Paper': 0,
                'Scissors': 0
            });
        }
        this.patternMemory.get(pattern)[nextChoice]++;
    }

    // Predict player's next move based on patterns
    predictNextMove() {
        if (this.playerHistory.length === 0) {
            // First move - completely random
            return this.choices[Math.floor(Math.random() * 3)];
        }

        if (this.playerHistory.length === 1) {
            // Second move - just counter their last move
            return this.getCounterMove(this.playerHistory[0]);
        }

        // For moves 3+, look for patterns
        let bestPrediction = null;
        let bestConfidence = 0;

        // Check patterns of different lengths (prefer longer patterns)
        const patternLengths = [3, 2, 1]; // Check longer patterns first
        
        for (let length of patternLengths) {
            if (this.playerHistory.length >= length) {
                const pattern = this.playerHistory.slice(-length).join('-');
                
                if (this.patternMemory.has(pattern)) {
                    const frequencies = this.patternMemory.get(pattern);
                    const total = frequencies.Rock + frequencies.Paper + frequencies.Scissors;
                    
                    if (total > 0) {
                        // Find most likely next move
                        let maxFreq = 0;
                        let mostLikely = null;
                        
                        for (let choice of this.choices) {
                            if (frequencies[choice] > maxFreq) {
                                maxFreq = frequencies[choice];
                                mostLikely = choice;
                            }
                        }
                        
                        const confidence = maxFreq / total;
                        if (confidence > bestConfidence && confidence > 0.4) { // Require some confidence
                            bestPrediction = mostLikely;
                            bestConfidence = confidence;
                            break; // Use first good pattern found (longest)
                        }
                    }
                }
            }
        }

        if (bestPrediction) {
            return this.getCounterMove(bestPrediction);
        } else {
            // No strong pattern found - use simple frequency analysis
            return this.getFrequencyBasedMove();
        }
    }

    // Get move that counters the predicted player move
    getCounterMove(playerMove) {
        switch (playerMove) {
            case 'Rock': return 'Paper';
            case 'Paper': return 'Scissors';
            case 'Scissors': return 'Rock';
            default: return this.choices[Math.floor(Math.random() * 3)];
        }
    }

    // Fallback: counter the most frequent player choice
    getFrequencyBasedMove() {
        if (this.playerHistory.length === 0) {
            return this.choices[Math.floor(Math.random() * 3)];
        }

        const frequencies = { 'Rock': 0, 'Paper': 0, 'Scissors': 0 };
        for (let choice of this.playerHistory) {
            frequencies[choice]++;
        }

        let mostFrequent = 'Rock';
        let maxCount = frequencies['Rock'];
        
        for (let choice of this.choices) {
            if (frequencies[choice] > maxCount) {
                maxCount = frequencies[choice];
                mostFrequent = choice;
            }
        }

        return this.getCounterMove(mostFrequent);
    }

    // Make AI's choice for this round
    makeChoice() {
        return this.predictNextMove();
    }

    // Determine winner of a round
    determineWinner(playerChoice, aiChoice) {
        if (playerChoice === aiChoice) {
            this.tieCount++;
            return 'tie';
        }
        
        const playerWins = (
            (playerChoice === 'Rock' && aiChoice === 'Scissors') ||
            (playerChoice === 'Paper' && aiChoice === 'Rock') ||
            (playerChoice === 'Scissors' && aiChoice === 'Paper')
        );
        
        if (playerWins) {
            this.lossCount++;
            return 'player';
        } else {
            this.winCount++;
            return 'ai';
        }
    }

    // Get explanation of AI's reasoning (for debugging/education)
    getReasoningExplanation() {
        if (this.playerHistory.length === 0) {
            return "First move - playing randomly";
        }
        
        if (this.playerHistory.length === 1) {
            return `Countering your last move (${this.playerHistory[0]})`;
        }

        // Look for the pattern that was used
        const patternLengths = [3, 2, 1];
        
        for (let length of patternLengths) {
            if (this.playerHistory.length >= length) {
                const pattern = this.playerHistory.slice(-length).join('-');
                
                if (this.patternMemory.has(pattern)) {
                    const frequencies = this.patternMemory.get(pattern);
                    const total = frequencies.Rock + frequencies.Paper + frequencies.Scissors;
                    
                    if (total > 0) {
                        let maxFreq = 0;
                        let mostLikely = null;
                        
                        for (let choice of this.choices) {
                            if (frequencies[choice] > maxFreq) {
                                maxFreq = frequencies[choice];
                                mostLikely = choice;
                            }
                        }
                        
                        const confidence = maxFreq / total;
                        if (confidence > 0.4) {
                            return `Pattern detected: After ${pattern}, you usually play ${mostLikely} (${Math.round(confidence * 100)}% of the time)`;
                        }
                    }
                }
            }
        }

        return "No clear pattern found - using frequency analysis";
    }

    // Get current game statistics
    getStats() {
        return {
            wins: this.winCount,
            losses: this.lossCount,
            ties: this.tieCount,
            totalGames: this.winCount + this.lossCount + this.tieCount,
            patterns: this.patternMemory.size,
            playerHistory: [...this.playerHistory]
        };
    }
}

// Export for use in main game file
window.AIOpponent = AIOpponent; 