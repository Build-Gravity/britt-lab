// RELPH Model Implementation
// Based on "Sequential decisions: a computational comparison of observational and reinforcement accounts"
// Mohammadi Sepahvand et al. (2014) - PLoS ONE 9(4): e94308

class RELPHModel {
    constructor(params = {}) {
        // Parameters from Anderson et al. study
        this.n = params.n || 2;              // STM length
        this.Hthr = params.Hthr || 1.8;      // Entropy threshold for pruning
        this.alpha = params.alpha || 0.3;    // Learning rate (α)
        
        // Model components
        this.STM = [];                        // Short Term Memory
        this.hypothesisSpace = new Map();     // Hypothesis Space with prediction-sets
        this.choices = ['Rock', 'Paper', 'Scissors'];
        
        // Performance tracking
        this.trialHistory = [];
        this.currentTrial = 0;
        
        console.log('🧠 RELPH Model initialized with parameters:', {
            n: this.n,
            Hthr: this.Hthr,
            alpha: this.alpha
        });
    }

    // Reset model for new simulation
    reset() {
        this.STM = [];
        this.hypothesisSpace.clear();
        this.trialHistory = [];
        this.currentTrial = 0;
    }

    // Main function: make choice for current trial
    makeChoice() {
        this.currentTrial++;
        
        // Generate hypotheses from current STM
        this.generateHypotheses();
        
        // Select action using soft-max
        const choice = this.selectAction();
        
        return choice;
    }

    // Update model after receiving feedback
    updateModel(myChoice, opponentChoice, outcome) {
        const reward = this.getReward(outcome);
        
        // Update STM with opponent's choice
        this.updateSTM(opponentChoice);
        
        // Update hypothesis values using delta-learning rule
        this.updateHypothesisValues(myChoice, reward);
        
        // Update prediction sets
        this.updatePredictionSets(myChoice, reward);
        
        // Prune high-entropy hypotheses
        this.pruneHypotheses();
        
        // Record trial
        this.trialHistory.push({
            trial: this.currentTrial,
            myChoice,
            opponentChoice,
            outcome,
            reward,
            hypothesesCount: this.hypothesisSpace.size,
            stmContent: [...this.STM]
        });
    }

    // Update Short Term Memory with new observation
    updateSTM(observation) {
        this.STM.push(observation);
        
        // Keep only last n observations
        if (this.STM.length > this.n) {
            this.STM = this.STM.slice(-this.n);
        }
    }

    // Generate hypotheses based on current STM (all subsets)
    generateHypotheses() {
        if (this.STM.length === 0) return;
        
        // Generate all possible non-empty subsets of STM
        const subsets = this.generateSubsets(this.STM);
        
        for (let subset of subsets) {
            const hypothesisKey = subset.join('-');
            
            if (!this.hypothesisSpace.has(hypothesisKey)) {
                this.hypothesisSpace.set(hypothesisKey, {
                    pattern: subset,
                    predictionSet: new Map(),  // choice -> total reward
                    counts: new Map(),         // choice -> count
                    value: Math.random() * 0.1 // Small random initial value
                });
            }
        }
    }

    // Generate all non-empty subsets of array
    generateSubsets(arr) {
        const subsets = [];
        const n = arr.length;
        
        for (let i = 1; i < Math.pow(2, n); i++) {
            const subset = [];
            for (let j = 0; j < n; j++) {
                if (i & (1 << j)) {
                    subset.push(arr[j]);
                }
            }
            subsets.push(subset);
        }
        
        return subsets;
    }

    // Select action using soft-max decision rule
    selectAction() {
        if (this.hypothesisSpace.size === 0) {
            // No hypotheses - random choice
            return this.choices[Math.floor(Math.random() * 3)];
        }

        // Calculate Q-values for each action based on hypothesis values
        const qValues = new Map();
        for (let choice of this.choices) {
            qValues.set(choice, 0);
        }

        // Sum contributions from all hypotheses
        for (let [key, hypothesis] of this.hypothesisSpace) {
            for (let choice of this.choices) {
                if (hypothesis.predictionSet.has(choice)) {
                    const totalReward = hypothesis.predictionSet.get(choice);
                    const count = hypothesis.counts.get(choice) || 1;
                    const avgReward = totalReward / count;
                    
                    // Weight by hypothesis value
                    qValues.set(choice, qValues.get(choice) + hypothesis.value * avgReward);
                }
            }
        }

        // Apply soft-max with temperature
        return this.softMaxSelection(qValues, 1.0);
    }

    // Soft-max action selection
    softMaxSelection(qValues, temperature) {
        const values = Array.from(qValues.values());
        const maxValue = Math.max(...values);
        
        // Calculate probabilities
        const expValues = new Map();
        let sumExp = 0;
        
        for (let [choice, value] of qValues) {
            const expVal = Math.exp((value - maxValue) / temperature);
            expValues.set(choice, expVal);
            sumExp += expVal;
        }

        // Sample from distribution
        const random = Math.random() * sumExp;
        let cumSum = 0;
        
        for (let [choice, expVal] of expValues) {
            cumSum += expVal;
            if (random <= cumSum) {
                return choice;
            }
        }
        
        return this.choices[0]; // Fallback
    }

    // Update hypothesis values using delta-learning rule (Equation 2)
    updateHypothesisValues(action, reward) {
        for (let [key, hypothesis] of this.hypothesisSpace) {
            if (this.matchesCurrentSTM(hypothesis.pattern) && 
                hypothesis.predictionSet.has(action)) {
                
                // V_{t+1}(Hyp) = (1-α)V_t(Hyp) + αr_t
                const oldValue = hypothesis.value;
                hypothesis.value = (1 - this.alpha) * oldValue + this.alpha * reward;
            }
        }
    }

    // Update prediction sets with new action-reward pair
    updatePredictionSets(action, reward) {
        for (let [key, hypothesis] of this.hypothesisSpace) {
            if (this.matchesCurrentSTM(hypothesis.pattern)) {
                // Update prediction set
                if (!hypothesis.predictionSet.has(action)) {
                    hypothesis.predictionSet.set(action, 0);
                    hypothesis.counts.set(action, 0);
                }
                
                const currentReward = hypothesis.predictionSet.get(action);
                const currentCount = hypothesis.counts.get(action);
                
                hypothesis.predictionSet.set(action, currentReward + reward);
                hypothesis.counts.set(action, currentCount + 1);
            }
        }
    }

    // Check if current STM matches hypothesis pattern
    matchesCurrentSTM(pattern) {
        if (pattern.length > this.STM.length) return false;
        
        const stmSuffix = this.STM.slice(-pattern.length);
        return JSON.stringify(stmSuffix) === JSON.stringify(pattern);
    }

    // Prune hypotheses with entropy above threshold
    pruneHypotheses() {
        const toRemove = [];
        
        for (let [key, hypothesis] of this.hypothesisSpace) {
            const entropy = this.calculateEntropy(hypothesis);
            if (entropy > this.Hthr) {
                toRemove.push(key);
            }
        }
        
        for (let key of toRemove) {
            this.hypothesisSpace.delete(key);
        }
    }

    // Calculate modified entropy (Equation 1 from paper)
    calculateEntropy(hypothesis) {
        const counts = Array.from(hypothesis.counts.values()).filter(c => c > 0);
        if (counts.length === 0) return 0;
        
        const totalCount = counts.reduce((sum, c) => sum + c, 0);
        if (totalCount === 0) return 0;
        
        // H'(Hyp) = -Σ(c_i/(Σc_j + 1)) * log2(c_i/(Σc_j + 1))
        let entropy = 0;
        for (let count of counts) {
            const prob = count / (totalCount + 1);
            entropy -= prob * Math.log2(prob);
        }
        
        return entropy;
    }

    // Convert outcome to reward
    getReward(outcome) {
        switch (outcome) {
            case 'win': return 1;
            case 'loss': return -1;
            case 'tie': return 0;
            default: return 0;
        }
    }

    // Get model statistics
    getStats() {
        const wins = this.trialHistory.filter(t => t.outcome === 'win').length;
        const losses = this.trialHistory.filter(t => t.outcome === 'loss').length;
        const ties = this.trialHistory.filter(t => t.outcome === 'tie').length;
        const totalTrials = this.trialHistory.length;
        
        return {
            parameters: {
                n: this.n,
                Hthr: this.Hthr,
                alpha: this.alpha
            },
            performance: {
                totalTrials,
                wins,
                losses,
                ties,
                winRate: totalTrials > 0 ? wins / totalTrials : 0
            },
            model: {
                hypothesesCount: this.hypothesisSpace.size,
                avgHypothesesPerTrial: this.trialHistory.length > 0 ? 
                    this.trialHistory.reduce((sum, t) => sum + t.hypothesesCount, 0) / this.trialHistory.length : 0
            }
        };
    }

    // Simulate against opponent sequence
    simulate(opponentSequence) {
        this.reset();
        const results = [];
        
        for (let i = 0; i < opponentSequence.length; i++) {
            const modelChoice = this.makeChoice();
            const opponentChoice = opponentSequence[i];
            const outcome = this.determineOutcome(modelChoice, opponentChoice);
            
            this.updateModel(modelChoice, opponentChoice, outcome);
            
            results.push({
                trial: i + 1,
                modelChoice,
                opponentChoice,
                outcome,
                winRate: this.getStats().performance.winRate,
                hypothesesCount: this.hypothesisSpace.size
            });
        }
        
        return results;
    }

    // Determine outcome
    determineOutcome(modelChoice, opponentChoice) {
        if (modelChoice === opponentChoice) return 'tie';
        
        const wins = (
            (modelChoice === 'Rock' && opponentChoice === 'Scissors') ||
            (modelChoice === 'Paper' && opponentChoice === 'Rock') ||
            (modelChoice === 'Scissors' && opponentChoice === 'Paper')
        );
        
        return wins ? 'win' : 'loss';
    }
}

// Export for browser use
if (typeof window !== 'undefined') {
    window.RELPHModel = RELPHModel;
} 