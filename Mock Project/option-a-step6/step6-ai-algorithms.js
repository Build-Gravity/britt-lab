// Step 6: AI Algorithms Implementation
// Based on Mohammadi Sepahvand et al. (2014) - Sequential Decisions Study
// Implements RELPH (reinforcement learning) and ELPH (statistical learning)

// Base class for AI algorithms
class AIAgent {
    constructor(algorithm = 'relph', learningRate = 0.3, memoryLength = 2) {
        this.algorithm = algorithm;
        this.alpha = learningRate;
        this.n = memoryLength;
        this.history = [];
        this.playerHistory = [];
        this.ownHistory = [];
        this.rewards = [];
        this.initialized = false;
        
        console.log(`🤖 AI Agent initialized: ${algorithm.toUpperCase()}, α=${learningRate}, n=${memoryLength}`);
    }
    
    makeMove(playerHistory) {
        this.playerHistory = [...playerHistory];
        
        switch (this.algorithm) {
            case 'relph':
                return this.makeRELPHMove();
            case 'elph':
                return this.makeELPHMove();
            case 'random':
                return this.makeRandomMove();
            default:
                return this.makeRELPHMove();
        }
    }
    
    learn(playerMove, aiMove, result) {
        // Store the interaction
        this.history.push({
            player: playerMove,
            ai: aiMove,
            result: result,
            timestamp: Date.now()
        });
        
        // Calculate reward from AI's perspective
        const reward = this.calculateReward(result);
        this.rewards.push(reward);
        
        // Algorithm-specific learning
        switch (this.algorithm) {
            case 'relph':
                this.learnRELPH(aiMove, reward);
                break;
            case 'elph':
                this.learnELPH(playerMove);
                break;
            case 'random':
                // No learning for random
                break;
        }
    }
    
    calculateReward(result) {
        switch (result) {
            case 'ai_wins': return 1;
            case 'tie': return 0;
            case 'player_wins': return -1;
            default: return 0;
        }
    }
    
    getReasoning() {
        switch (this.algorithm) {
            case 'relph':
                return this.getRELPHReasoning();
            case 'elph':
                return this.getELPHReasoning();
            case 'random':
                return "Random choice - no learning";
            default:
                return "AI decision made";
        }
    }
}

// RELPH Implementation - Reinforcement Learning Approach
class RELPHAgent extends AIAgent {
    constructor(learningRate = 0.3, memoryLength = 2) {
        super('relph', learningRate, memoryLength);
        this.valueMap = new Map(); // Stores hypothesis values
        this.lastPattern = null;
        this.lastAction = null;
    }
    
    makeRELPHMove() {
        if (this.playerHistory.length < this.n) {
            // Not enough history, make random choice
            return this.makeRandomMove();
        }
        
        // Get current context pattern
        const pattern = this.getPattern(this.playerHistory);
        this.lastPattern = pattern;
        
        // Get stored values for this pattern
        const values = this.valueMap.get(pattern) || { Rock: 0, Paper: 0, Scissors: 0 };
        
        // Soft-max selection (exploration vs exploitation)
        const action = this.softMaxSelection(values);
        this.lastAction = action;
        
        return action;
    }
    
    learnRELPH(action, reward) {
        if (!this.lastPattern) return;
        
        // Get current values for the pattern
        const values = this.valueMap.get(this.lastPattern) || { Rock: 0, Paper: 0, Scissors: 0 };
        
        // Update value using delta learning rule: V(t+1) = (1-α)V(t) + αr(t)
        values[action] = (1 - this.alpha) * values[action] + this.alpha * reward;
        
        // Store updated values
        this.valueMap.set(this.lastPattern, values);
        
        console.log(`🧠 RELPH Learning: Pattern "${this.lastPattern}" → ${action} (reward: ${reward})`);
        console.log(`   Updated values:`, values);
    }
    
    softMaxSelection(values) {
        const options = ['Rock', 'Paper', 'Scissors'];
        const temperature = 1.0; // Controls exploration vs exploitation
        
        // Calculate exp(value/temperature) for each option
        const expValues = options.map(option => Math.exp(values[option] / temperature));
        const sumExp = expValues.reduce((a, b) => a + b, 0);
        
        // Calculate probabilities
        const probabilities = expValues.map(exp => exp / sumExp);
        
        // Select based on probabilities
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < options.length; i++) {
            cumulative += probabilities[i];
            if (random <= cumulative) {
                return options[i];
            }
        }
        
        return options[0]; // Fallback
    }
    
    getRELPHReasoning() {
        if (!this.lastPattern || !this.lastAction) {
            return "Learning participant patterns...";
        }
        
        const values = this.valueMap.get(this.lastPattern) || { Rock: 0, Paper: 0, Scissors: 0 };
        const maxValue = Math.max(...Object.values(values));
        const bestAction = Object.keys(values).find(key => values[key] === maxValue);
        
        return `RELPH: Pattern "${this.lastPattern}" suggests ${bestAction} (value: ${maxValue.toFixed(2)})`;
    }
}

// ELPH Implementation - Statistical Learning Approach
class ELPHAgent extends AIAgent {
    constructor(learningRate = 0.3, memoryLength = 2) {
        super('elph', learningRate, memoryLength);
        this.predictionMap = new Map(); // Stores pattern → outcome frequencies
        this.lastPattern = null;
        this.lastPrediction = null;
    }
    
    makeELPHMove() {
        if (this.playerHistory.length < this.n) {
            // Not enough history, make random choice
            return this.makeRandomMove();
        }
        
        // Get current context pattern
        const pattern = this.getPattern(this.playerHistory);
        this.lastPattern = pattern;
        
        // Predict what player will do next
        const prediction = this.predictPlayerMove(pattern);
        this.lastPrediction = prediction;
        
        // Choose counter-move
        return this.getCounter(prediction);
    }
    
    learnELPH(playerMove) {
        if (!this.lastPattern) return;
        
        // Get current predictions for this pattern
        const predictions = this.predictionMap.get(this.lastPattern) || { Rock: 0, Paper: 0, Scissors: 0 };
        
        // Update frequency count for observed move
        predictions[playerMove]++;
        
        // Store updated predictions
        this.predictionMap.set(this.lastPattern, predictions);
        
        console.log(`📊 ELPH Learning: Pattern "${this.lastPattern}" → ${playerMove}`);
        console.log(`   Updated frequencies:`, predictions);
    }
    
    predictPlayerMove(pattern) {
        const predictions = this.predictionMap.get(pattern) || { Rock: 0, Paper: 0, Scissors: 0 };
        
        // Find most frequent player move for this pattern
        const maxCount = Math.max(...Object.values(predictions));
        if (maxCount === 0) {
            return this.makeRandomMove(); // No data yet
        }
        
        const mostLikely = Object.keys(predictions).find(key => predictions[key] === maxCount);
        return mostLikely;
    }
    
    getELPHReasoning() {
        if (!this.lastPattern || !this.lastPrediction) {
            return "Learning player move patterns...";
        }
        
        const predictions = this.predictionMap.get(this.lastPattern) || { Rock: 0, Paper: 0, Scissors: 0 };
        const total = Object.values(predictions).reduce((a, b) => a + b, 0);
        
        if (total === 0) {
            return "ELPH: No pattern data available yet";
        }
        
        const probability = predictions[this.lastPrediction] / total;
        return `ELPH: Pattern "${this.lastPattern}" predicts ${this.lastPrediction} (${(probability * 100).toFixed(1)}% of time)`;
    }
}

// Shared helper methods
AIAgent.prototype.getPattern = function(history) {
    if (history.length < this.n) {
        return history.join('-') || 'empty';
    }
    
    // Get last n moves
    return history.slice(-this.n).join('-');
};

AIAgent.prototype.makeRandomMove = function() {
    const moves = ['Rock', 'Paper', 'Scissors'];
    return moves[Math.floor(Math.random() * moves.length)];
};

AIAgent.prototype.getCounter = function(move) {
    switch (move) {
        case 'Rock': return 'Paper';
        case 'Paper': return 'Scissors';
        case 'Scissors': return 'Rock';
        default: return this.makeRandomMove();
    }
};

// Factory function to create appropriate AI agent
function createAIAgent(algorithm = 'relph', learningRate = 0.3, memoryLength = 2) {
    switch (algorithm.toLowerCase()) {
        case 'relph':
            return new RELPHAgent(learningRate, memoryLength);
        case 'elph':
            return new ELPHAgent(learningRate, memoryLength);
        case 'random':
            return new AIAgent('random', learningRate, memoryLength);
        default:
            console.warn(`Unknown algorithm: ${algorithm}, defaulting to RELPH`);
            return new RELPHAgent(learningRate, memoryLength);
    }
}

// Export for global use
window.createAIAgent = createAIAgent;
window.AIAgent = AIAgent;
window.RELPHAgent = RELPHAgent;
window.ELPHAgent = ELPHAgent;

console.log('🤖 AI Algorithms loaded: RELPH, ELPH, Random'); 