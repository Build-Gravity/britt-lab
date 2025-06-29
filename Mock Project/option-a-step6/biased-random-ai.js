// Biased Random AI for Rock-Paper-Scissors
// Three phases: Random → Light Bias → Heavy Bias (replicates original study)

class BiasedRandomAI {
    constructor(config = {}) {
        this.playerHistory = [];
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.moveCount = 0;
        this.config = {
            phase1End: config.phase1End || 200,
            phase2End: config.phase2End || 400,
            ...config
        };
        
        console.log('📊 BiasedRandomAI initialized with phases:', this.config);
    }

    // Biased Random strategy with three phases
    makeMove() {
        this.moveCount++;
        const choices = ['Rock', 'Paper', 'Scissors'];
        const random = Math.random();
        
        if (this.moveCount <= this.config.phase1End) {
            // Phase 1: 33% each (random)
            return choices[Math.floor(Math.random() * 3)];
        } else if (this.moveCount <= this.config.phase2End) {
            // Phase 2: 50% Rock, 25% Paper, 25% Scissors
            if (random < 0.5) return 'Rock';
            if (random < 0.75) return 'Paper';
            return 'Scissors';
        } else {
            // Phase 3: 10% Rock, 80% Paper, 10% Scissors
            if (random < 0.1) return 'Rock';
            if (random < 0.9) return 'Paper';
            return 'Scissors';
        }
    }

    // Remember what the player did
    rememberPlayerMove(playerMove) {
        this.playerHistory.push(playerMove);
    }

    // Figure out who won the round
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

    // Explain what the AI is thinking
    explainMove() {
        if (this.moveCount <= this.config.phase1End) {
            return `Phase 1 (move ${this.moveCount}): Playing randomly (33% each)`;
        } else if (this.moveCount <= this.config.phase2End) {
            return `Phase 2 (move ${this.moveCount}): Favoring Rock (50% Rock, 25% each other)`;
        } else {
            return `Phase 3 (move ${this.moveCount}): Heavily favoring Paper (80% Paper, 10% each other)`;
        }
    }

    // Get current game stats
    getStats() {
        return {
            wins: this.wins,
            losses: this.losses,
            ties: this.ties,
            total: this.wins + this.losses + this.ties,
            currentPhase: this.getCurrentPhase(),
            moveCount: this.moveCount
        };
    }

    // Get current phase info
    getCurrentPhase() {
        if (this.moveCount <= this.config.phase1End) {
            return { phase: 1, description: 'Random (33% each)' };
        } else if (this.moveCount <= this.config.phase2End) {
            return { phase: 2, description: 'Light Bias (50% Rock)' };
        } else {
            return { phase: 3, description: 'Heavy Bias (80% Paper)' };
        }
    }

    // Start a new game
    reset() {
        this.playerHistory = [];
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.moveCount = 0;
    }
}

// Make it available to other files
window.BiasedRandomAI = BiasedRandomAI; 