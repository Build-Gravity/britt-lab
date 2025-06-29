// Counter AI for Rock-Paper-Scissors
// Always tries to counter the player's most recent move

class CounterAI {
    constructor(config = {}) {
        this.playerHistory = [];
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.moveCount = 0;
        this.config = config;
        
        console.log('🔄 CounterAI initialized');
    }

    // Counter the player's most recent move
    makeMove() {
        this.moveCount++;
        
        // If no previous moves, play randomly
        if (this.playerHistory.length === 0) {
            return this.playRandom();
        }

        // Get the player's last move
        const lastPlayerMove = this.playerHistory[this.playerHistory.length - 1];
        
        // Play the move that beats their last move
        if (lastPlayerMove === 'Rock') return 'Paper';
        if (lastPlayerMove === 'Paper') return 'Scissors';
        if (lastPlayerMove === 'Scissors') return 'Rock';
        
        return this.playRandom(); // Fallback
    }

    // Fallback to random when no history
    playRandom() {
        const choices = ['Rock', 'Paper', 'Scissors'];
        const randomIndex = Math.floor(Math.random() * 3);
        return choices[randomIndex];
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
        if (this.playerHistory.length === 0) {
            return "First move - I'll pick randomly";
        } else {
            const lastMove = this.playerHistory[this.playerHistory.length - 1];
            return `You played ${lastMove} last time, so I'll counter it`;
        }
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
window.CounterAI = CounterAI; 