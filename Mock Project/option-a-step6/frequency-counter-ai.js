// Frequency Counter AI for Rock-Paper-Scissors
// Counters the player's most frequently used move

class FrequencyCounterAI {
    constructor(config = {}) {
        this.playerHistory = [];
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.moveCount = 0;
        this.config = config;
        
        // For frequency tracking
        this.playerFrequency = { Rock: 0, Paper: 0, Scissors: 0 };
        
        console.log('📈 FrequencyCounterAI initialized');
    }

    // Counter the player's most frequent move
    makeMove() {
        this.moveCount++;
        
        // If no moves recorded yet, play randomly
        if (this.playerHistory.length === 0) {
            return this.playRandom();
        }

        // Find the player's most frequent move
        let mostFrequent = 'Rock';
        let maxCount = this.playerFrequency.Rock;
        
        if (this.playerFrequency.Paper > maxCount) {
            mostFrequent = 'Paper';
            maxCount = this.playerFrequency.Paper;
        }
        if (this.playerFrequency.Scissors > maxCount) {
            mostFrequent = 'Scissors';
            maxCount = this.playerFrequency.Scissors;
        }

        // Play the move that beats their most frequent choice
        if (mostFrequent === 'Rock') return 'Paper';
        if (mostFrequent === 'Paper') return 'Scissors';
        if (mostFrequent === 'Scissors') return 'Rock';
        
        return this.playRandom(); // Fallback
    }

    // Fallback to random when no history
    playRandom() {
        const choices = ['Rock', 'Paper', 'Scissors'];
        const randomIndex = Math.floor(Math.random() * 3);
        return choices[randomIndex];
    }

    // Remember what the player did and update frequency tracking
    rememberPlayerMove(playerMove) {
        this.playerHistory.push(playerMove);
        
        // Update frequency tracking
        if (this.playerFrequency.hasOwnProperty(playerMove)) {
            this.playerFrequency[playerMove]++;
        }
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
            return "No moves yet - playing randomly";
        } else {
            const maxFreq = Math.max(this.playerFrequency.Rock, this.playerFrequency.Paper, this.playerFrequency.Scissors);
            const mostCommon = Object.keys(this.playerFrequency).find(key => this.playerFrequency[key] === maxFreq);
            return `You play ${mostCommon} most often (${maxFreq}/${this.playerHistory.length}), so I'll counter it`;
        }
    }

    // Get current game stats
    getStats() {
        return {
            wins: this.wins,
            losses: this.losses,
            ties: this.ties,
            total: this.wins + this.losses + this.ties,
            playerFrequencies: { ...this.playerFrequency },
            totalMoves: this.playerHistory.length
        };
    }

    // Get detailed frequency analysis
    getFrequencyAnalysis() {
        const total = this.playerHistory.length;
        if (total === 0) return null;
        
        return {
            Rock: { count: this.playerFrequency.Rock, percentage: ((this.playerFrequency.Rock / total) * 100).toFixed(1) },
            Paper: { count: this.playerFrequency.Paper, percentage: ((this.playerFrequency.Paper / total) * 100).toFixed(1) },
            Scissors: { count: this.playerFrequency.Scissors, percentage: ((this.playerFrequency.Scissors / total) * 100).toFixed(1) }
        };
    }

    // Start a new game
    reset() {
        this.playerHistory = [];
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.moveCount = 0;
        this.playerFrequency = { Rock: 0, Paper: 0, Scissors: 0 };
    }
}

// Make it available to other files
window.FrequencyCounterAI = FrequencyCounterAI; 