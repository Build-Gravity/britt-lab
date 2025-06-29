// Random AI for Rock-Paper-Scissors
// Always picks moves randomly - good baseline for comparison

class RandomAI {
    constructor(config = {}) {
        this.playerHistory = [];
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.moveCount = 0;
        this.config = config;
        
        console.log('🎲 RandomAI initialized');
    }

    // Always pick randomly
    makeMove() {
        this.moveCount++;
        const choices = ['Rock', 'Paper', 'Scissors'];
        const randomIndex = Math.floor(Math.random() * 3);
        return choices[randomIndex];
    }

    // Remember what the player did (not used by random strategy, but needed for interface)
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
        return "I'm picking randomly - no strategy!";
    }

    // Get current game stats
    getStats() {
        return {
            wins: this.wins,
            losses: this.losses,
            ties: this.ties,
            total: this.wins + this.losses + this.ties
        };
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
window.RandomAI = RandomAI; 