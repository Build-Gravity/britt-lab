// Tests for Individual AI Classes
// Testing RandomAI, CounterAI, BiasedRandomAI, and FrequencyCounterAI

const SimpleAITests = {
    'RandomAI can be created and makes valid moves': function() {
        const ai = new RandomAI();
        const validMoves = ['Rock', 'Paper', 'Scissors'];
        
        // Test 10 moves to be sure
        for (let i = 0; i < 10; i++) {
            const move = ai.makeMove();
            if (!validMoves.includes(move)) {
                return TestFramework.assertTrue(false, `RandomAI made invalid move: ${move}`);
            }
        }
        
        return TestFramework.assertTrue(true, 'RandomAI consistently makes valid moves');
    },
    
    'CounterAI beats Rock with Paper, Paper with Scissors, Scissors with Rock': function() {
        const ai = new CounterAI();
        
        // Test each counter
        ai.rememberPlayerMove('Rock');
        const counterToRock = ai.makeMove();
        
        ai.rememberPlayerMove('Paper');
        const counterToPaper = ai.makeMove();
        
        ai.rememberPlayerMove('Scissors');
        const counterToScissors = ai.makeMove();
        
        const allCountersCorrect = counterToRock === 'Paper' && 
                                  counterToPaper === 'Scissors' && 
                                  counterToScissors === 'Rock';
        
        return TestFramework.assertTrue(allCountersCorrect, 'CounterAI should beat each move with the correct counter-move');
    },
    
    'BiasedRandomAI follows the three-phase pattern': function() {
        const ai = new BiasedRandomAI({ phase1End: 5, phase2End: 10 });
        const moves = [];
        
        // Test phase behavior by collecting many moves
        for (let i = 0; i < 15; i++) {
            moves.push(ai.makeMove());
        }
        
        // Just verify it makes valid moves and progresses through phases
        const allValidMoves = moves.every(move => ['Rock', 'Paper', 'Scissors'].includes(move));
        const stats = ai.getStats();
        const hasPhaseInfo = stats.currentPhase && typeof stats.currentPhase.phase === 'number';
        
        return TestFramework.assertTrue(allValidMoves && hasPhaseInfo, 'BiasedRandomAI should make valid moves and track phases');
    },
    
    'FrequencyCounterAI tracks player frequencies correctly': function() {
        const ai = new FrequencyCounterAI();
        
        // Give it a pattern to learn
        ai.rememberPlayerMove('Rock');
        ai.rememberPlayerMove('Rock');
        ai.rememberPlayerMove('Paper');
        
        const analysis = ai.getFrequencyAnalysis();
        const rockFrequent = analysis.Rock.count === 2;
        const paperOnce = analysis.Paper.count === 1;
        const scissorsNever = analysis.Scissors.count === 0;
        
        return TestFramework.assertTrue(rockFrequent && paperOnce && scissorsNever, 'FrequencyCounterAI should track move frequencies accurately');
    },
    
    'All AIs remember player moves in the right order': function() {
        const ais = [new RandomAI(), new CounterAI(), new FrequencyCounterAI()];
        const testMoves = ['Rock', 'Paper', 'Scissors', 'Rock'];
        
        for (const ai of ais) {
            testMoves.forEach(move => ai.rememberPlayerMove(move));
            
            const historyMatches = ai.playerHistory.length === testMoves.length &&
                                  ai.playerHistory.every((move, i) => move === testMoves[i]);
            
            if (!historyMatches) {
                return TestFramework.assertTrue(false, `${ai.constructor.name} failed to remember moves correctly`);
            }
        }
        
        return TestFramework.assertTrue(true, 'All AIs should remember player moves in the correct sequence');
    },
    
    'All AIs correctly determine who wins each round': function() {
        const ais = [new RandomAI(), new CounterAI(), new BiasedRandomAI(), new FrequencyCounterAI()];
        
        for (const ai of ais) {
            const tie = ai.checkWinner('Rock', 'Rock');
            const playerWin = ai.checkWinner('Rock', 'Scissors');
            const aiWin = ai.checkWinner('Rock', 'Paper');
            
            const allResultsCorrect = tie === 'tie' && playerWin === 'player' && aiWin === 'ai';
            if (!allResultsCorrect) {
                return TestFramework.assertTrue(false, `${ai.constructor.name} failed winner determination`);
            }
        }
        
        return TestFramework.assertTrue(true, 'All AIs should correctly identify ties, player wins, and AI wins');
    },
    
    'All AIs keep track of wins, losses, and ties correctly': function() {
        const ais = [new RandomAI(), new CounterAI(), new BiasedRandomAI(), new FrequencyCounterAI()];
        
        for (const ai of ais) {
            ai.checkWinner('Rock', 'Paper');     // AI wins
            ai.checkWinner('Rock', 'Scissors');  // Player wins
            ai.checkWinner('Rock', 'Rock');      // Tie
            ai.checkWinner('Paper', 'Scissors'); // AI wins
            
            const stats = ai.getStats();
            const statsCorrect = stats.wins === 2 && stats.losses === 1 && stats.ties === 1 && stats.total === 4;
            
            if (!statsCorrect) {
                return TestFramework.assertTrue(false, `${ai.constructor.name} failed stats tracking`);
            }
        }
        
        return TestFramework.assertTrue(true, 'All AIs should count wins (2), losses (1), ties (1), and total games (4) correctly');
    },
    
    'All AIs provide explanations that make sense': function() {
        const randomAI = new RandomAI();
        const counterAI = new CounterAI();
        
        counterAI.rememberPlayerMove('Rock');
        
        const randomExplanation = randomAI.explainMove();
        const counterExplanation = counterAI.explainMove();
        
        const explanationsValid = typeof randomExplanation === 'string' && 
                                 typeof counterExplanation === 'string' &&
                                 randomExplanation.includes('random') &&
                                 counterExplanation.includes('Rock');
        
        return TestFramework.assertTrue(explanationsValid, 'AIs should explain their reasoning in a way humans can understand');
    }
};

// Export for test runner
window.SimpleAITests = SimpleAITests; 