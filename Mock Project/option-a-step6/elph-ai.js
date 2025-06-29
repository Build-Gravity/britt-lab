// ELPH AI (Entropy Learned Pruned Hypothesis space) for Rock-Paper-Scissors
// Mathematically accurate implementation based on Mohammadi Sepahvand et al. (2014)
// Uses entropy calculations, hypothesis generation, and soft-max selection

class ELPH_AI {
    constructor(config = {}) {
        this.playerHistory = [];
        this.patternDatabase = new Map(); // Stores pattern frequencies
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        
        // Study-accurate ELPH configuration parameters
        this.config = {
            stmLength: config.stmLength || 3,
            entropyThreshold: config.entropyThreshold || 1.5,
            minObservations: config.minObservations || 3,
            hypothesisPruning: config.hypothesisPruning !== false, // Default true
            // Legacy parameters for backward compatibility
            patternLength: config.patternLength || config.stmLength || 3,
            confidenceThreshold: config.confidenceThreshold || config.minObservations || 3,
            learningRate: config.learningRate || 'moderate',
            alpha: config.alpha || 0.3
        };
        
        console.log('🧠 ELPH AI initialized with config:', this.config);
    }

    // Main decision-making method
    makeMove() {
        // Early game: insufficient history for ELPH
        if (this.playerHistory.length < this.config.stmLength) {
            return this.fallbackStrategy();
        }

        try {
            // Step 1: Extract STM (Short Term Memory)
            const stm = this.extractSTM();
            
            // Step 2: Generate all hypotheses from STM patterns
            const hypotheses = this.generateHypotheses(stm);
            
            // Step 3: Calculate entropy for each hypothesis
            const validHypotheses = this.calculateHypothesesEntropy(hypotheses);
            
            // Step 4: Filter hypotheses by entropy threshold and min observations
            const reliableHypotheses = this.filterReliableHypotheses(validHypotheses);
            
            // Step 5: Select hypothesis using soft-max probability
            const selectedHypothesis = this.selectHypothesis(reliableHypotheses);
            
            if (selectedHypothesis) {
                // Step 6: Predict player move and counter it
                const playerPrediction = this.predictFromHypothesis(selectedHypothesis);
                return this.counterMove(playerPrediction);
            } else {
                // No reliable patterns found - use fallback
                return this.fallbackStrategy();
            }
            
        } catch (error) {
            console.warn('ELPH error:', error.message);
            return this.fallbackStrategy();
        }
    }

    // Extract Short Term Memory from player history
    extractSTM() {
        const actualSTMLength = Math.min(this.config.stmLength, this.playerHistory.length);
        return this.playerHistory.slice(-actualSTMLength);
    }

    // Generate all possible pattern hypotheses from STM
    generateHypotheses(stm) {
        const hypotheses = [];
        
        // Generate all contiguous subpatterns of length 1 to stm.length
        for (let length = 1; length <= stm.length; length++) {
            for (let start = 0; start <= stm.length - length; start++) {
                const pattern = stm.slice(start, start + length).join('-');
                hypotheses.push({
                    pattern: pattern,
                    length: length,
                    context: stm.slice(start, start + length)
                });
            }
        }
        
        return hypotheses;
    }

    // Calculate entropy for each hypothesis based on historical data
    calculateHypothesesEntropy(hypotheses) {
        const validHypotheses = [];
        
        for (const hypothesis of hypotheses) {
            const patternData = this.patternDatabase.get(hypothesis.pattern);
            
            if (patternData) {
                const totalCount = patternData.Rock + patternData.Paper + patternData.Scissors;
                
                if (totalCount >= this.config.minObservations) {
                    const entropy = this.calculateEntropy(patternData, totalCount);
                    
                    validHypotheses.push({
                        ...hypothesis,
                        entropy: entropy,
                        totalObservations: totalCount,
                        outcomes: { ...patternData }
                    });
                }
            }
        }
        
        return validHypotheses;
    }

    // Calculate entropy using the formula: H = -Σ p_i * log2(p_i)
    calculateEntropy(outcomes, totalCount) {
        if (totalCount === 0) return Infinity;
        
        let entropy = 0;
        const moves = ['Rock', 'Paper', 'Scissors'];
        
        for (const move of moves) {
            const count = outcomes[move] || 0;
            if (count > 0) {
                const probability = count / totalCount;
                entropy -= probability * Math.log2(probability);
            }
        }
        
        return entropy;
    }

    // Filter hypotheses by entropy threshold and pruning settings
    filterReliableHypotheses(hypotheses) {
        let filtered = hypotheses.filter(h => h.entropy <= this.config.entropyThreshold);
        
        // Apply hypothesis pruning if enabled
        if (this.config.hypothesisPruning && filtered.length > 1) {
            // Remove hypotheses with entropy significantly higher than the best
            const bestEntropy = Math.min(...filtered.map(h => h.entropy));
            const entropyTolerance = 0.5; // Allow some tolerance
            filtered = filtered.filter(h => h.entropy <= bestEntropy + entropyTolerance);
        }
        
        return filtered;
    }

    // Select hypothesis using soft-max probability based on entropy
    selectHypothesis(hypotheses) {
        if (hypotheses.length === 0) return null;
        if (hypotheses.length === 1) return hypotheses[0];
        
        // Calculate soft-max probabilities: P(h_i) = exp(-H_i) / Σ exp(-H_j)
        const expValues = hypotheses.map(h => Math.exp(-h.entropy));
        const sumExp = expValues.reduce((sum, val) => sum + val, 0);
        
        if (sumExp === 0) return hypotheses[0]; // Fallback if all exp values are 0
        
        const probabilities = expValues.map(exp => exp / sumExp);
        
        // Select hypothesis based on probability distribution
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < hypotheses.length; i++) {
            cumulative += probabilities[i];
            if (random <= cumulative) {
                return hypotheses[i];
            }
        }
        
        return hypotheses[hypotheses.length - 1]; // Fallback to last hypothesis
    }

    // Predict player move from selected hypothesis
    predictFromHypothesis(hypothesis) {
        const outcomes = hypothesis.outcomes;
        const total = hypothesis.totalObservations;
        
        // Select most likely outcome (can be enhanced with probabilistic selection)
        let maxCount = 0;
        let prediction = 'Rock';
        
        for (const [move, count] of Object.entries(outcomes)) {
            if (count > maxCount) {
                maxCount = count;
                prediction = move;
            }
        }
        
        return prediction;
    }

    // Return the move that beats the predicted move
    counterMove(predictedMove) {
        const counters = {
            'Rock': 'Paper',
            'Paper': 'Scissors', 
            'Scissors': 'Rock'
        };
        return counters[predictedMove] || this.fallbackStrategy();
    }

    // Fallback strategy when no patterns are reliable
    fallbackStrategy() {
        // Use frequency-based counter strategy
        if (this.playerHistory.length > 0) {
            const frequencies = this.calculateFrequencies();
            const mostFrequent = this.getMostFrequentMove(frequencies);
            return this.counterMove(mostFrequent);
        }
        
        // Ultimate fallback: random
        const choices = ['Rock', 'Paper', 'Scissors'];
        return choices[Math.floor(Math.random() * 3)];
    }

    // Calculate move frequencies for fallback strategy
    calculateFrequencies() {
        const freq = { Rock: 0, Paper: 0, Scissors: 0 };
        for (const move of this.playerHistory) {
            freq[move]++;
        }
        return freq;
    }

    // Get most frequent move
    getMostFrequentMove(frequencies) {
        let maxCount = 0;
        let mostFrequent = 'Rock';
        
        for (const [move, count] of Object.entries(frequencies)) {
            if (count > maxCount) {
                maxCount = count;
                mostFrequent = move;
            }
        }
        
        return mostFrequent;
    }

    // Remember player move and update pattern database
    rememberPlayerMove(playerMove) {
        // Update pattern database with new information
        this.updatePatternDatabase(playerMove);
        
        // Add move to history
        this.playerHistory.push(playerMove);
        
        // Limit history size to prevent memory issues
        if (this.playerHistory.length > 1000) {
            this.playerHistory = this.playerHistory.slice(-500);
        }
    }

    // Update pattern database with new move
    updatePatternDatabase(newMove) {
        // Generate patterns from current history and record what happened next
        for (let length = 1; length <= Math.min(this.config.stmLength, this.playerHistory.length); length++) {
            if (this.playerHistory.length >= length) {
                const pattern = this.playerHistory.slice(-length).join('-');
                
                if (!this.patternDatabase.has(pattern)) {
                    this.patternDatabase.set(pattern, { Rock: 0, Paper: 0, Scissors: 0 });
                }
                
                this.patternDatabase.get(pattern)[newMove] += 1;
            }
        }
    }

    // Check winner and update stats
    checkWinner(playerMove, aiMove) {
        if (playerMove === aiMove) {
            this.ties++;
            return 'tie';
        }

        const playerWins = (
            (playerMove === 'Rock' && aiMove === 'Scissors') ||
            (playerMove === 'Paper' && aiMove === 'Rock') ||
            (playerMove === 'Scissors' && aiMove === 'Paper')
        );

        if (playerWins) {
            this.losses++;
            return 'player';
        } else {
            this.wins++;
            return 'ai';
        }
    }

    // Explain current decision process
    explainMove() {
        if (this.playerHistory.length < this.config.stmLength) {
            return `Learning phase: need ${this.config.stmLength} moves for ELPH analysis. Playing frequency-based counter.`;
        }

        try {
            const stm = this.extractSTM();
            const hypotheses = this.generateHypotheses(stm);
            const validHypotheses = this.calculateHypothesesEntropy(hypotheses);
            const reliableHypotheses = this.filterReliableHypotheses(validHypotheses);

            if (reliableHypotheses.length > 0) {
                const selected = this.selectHypothesis(reliableHypotheses);
                return `ELPH detected pattern "${selected.pattern}" (entropy: ${selected.entropy.toFixed(3)}, ${selected.totalObservations} observations)`;
            } else {
                return `No reliable patterns found (entropy threshold: ${this.config.entropyThreshold}). Using frequency counter.`;
            }
        } catch (error) {
            return `ELPH analysis error. Using fallback strategy.`;
        }
    }

    // Get comprehensive stats
    getStats() {
        return {
            wins: this.wins,
            losses: this.losses,
            ties: this.ties,
            total: this.wins + this.losses + this.ties,
            patternsLearned: this.patternDatabase.size,
            config: this.config,
            currentHistory: this.playerHistory.slice(-5),
            winRate: this.wins + this.losses + this.ties > 0 ? 
                (this.wins / (this.wins + this.losses + this.ties)) : 0
        };
    }

    // Get detailed pattern analysis
    getPatternDetails() {
        const patterns = [];
        for (const [pattern, outcomes] of this.patternDatabase.entries()) {
            const total = outcomes.Rock + outcomes.Paper + outcomes.Scissors;
            if (total >= this.config.minObservations) {
                const entropy = this.calculateEntropy(outcomes, total);
                patterns.push({
                    pattern,
                    outcomes,
                    total,
                    entropy: entropy.toFixed(3),
                    reliable: entropy <= this.config.entropyThreshold
                });
            }
        }
        return patterns.sort((a, b) => a.entropy - b.entropy);
    }

    // Reset AI state
    reset() {
        this.playerHistory = [];
        this.patternDatabase.clear();
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
    }

    // Update configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('🧠 ELPH AI config updated:', this.config);
    }
}

// For backward compatibility, also export as PatternAI
class PatternAI extends ELPH_AI {
    constructor(config = {}) {
        super(config);
        console.log('⚠️ PatternAI is deprecated. Use ELPH_AI for new implementations.');
    }

    // Legacy method compatibility for old tests
    get patterns() {
        return this.patternDatabase;
    }

    predictPlayerMove() {
        // Simulate old prediction method for tests
        if (this.playerHistory.length < this.config.stmLength) return null;
        
        try {
            const stm = this.extractSTM();
            const hypotheses = this.generateHypotheses(stm);
            const validHypotheses = this.calculateHypothesesEntropy(hypotheses);
            const reliableHypotheses = this.filterReliableHypotheses(validHypotheses);
            const selectedHypothesis = this.selectHypothesis(reliableHypotheses);
            
            if (selectedHypothesis) {
                return this.predictFromHypothesis(selectedHypothesis);
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    beatMove(move) {
        return this.counterMove(move);
    }
}

// Export both classes for flexibility
window.ELPH_AI = ELPH_AI;
window.PatternAI = PatternAI; 