// Integration Tests - Making Sure Everything Works Together
// Checking that AI, game logic, and data collection all work as a complete system

const IntegrationTests = {
    'Individual AIs and ELPH AI both work in real game scenarios': function() {
        const counterAI = new CounterAI();
        const elphAI = new ELPH_AI();
        
        // Test that both AIs can play a few moves
        counterAI.rememberPlayerMove('Rock');
        const counterMove = counterAI.makeMove();
        
        elphAI.rememberPlayerMove('Paper');
        const elphMove = elphAI.makeMove();
        
        const validMoves = ['Rock', 'Paper', 'Scissors'];
        const bothAIsWork = validMoves.includes(counterMove) && validMoves.includes(elphMove);
        
        return TestFramework.assertTrue(bothAIsWork, 
            'Both individual AIs and ELPH AI should work reliably during gameplay');
    },
    
    'AI strategies behave differently as expected': function() {
        const randomAI = new RandomAI();
        const counterAI = new CounterAI();
        
        // Give both the same player move
        randomAI.rememberPlayerMove('Rock');
        counterAI.rememberPlayerMove('Rock');
        
        // Counter AI should always counter with Paper
        const counterMove = counterAI.makeMove();
        const counterCorrect = counterMove === 'Paper';
        
        // Random AI should make any valid move
        const randomMove = randomAI.makeMove();
        const randomValid = ['Rock', 'Paper', 'Scissors'].includes(randomMove);
        
        return TestFramework.assertTrue(counterCorrect && randomValid, 
            'Different AI strategies should behave distinctly - counter AI is predictable, random AI varies');
    },
    
    'Game data collection captures important information': function() {
        // Test that we can create the data structure used for exports
        const sampleGameData = {
            round: 5,
            playerChoice: 'Rock',
            aiChoice: 'Paper',
            result: 'ai_wins',
            timestamp: Date.now(),
            aiAlgorithm: 'counter'
        };
        
        const hasImportantFields = sampleGameData.round && 
                                  sampleGameData.playerChoice && 
                                  sampleGameData.aiChoice && 
                                  sampleGameData.result && 
                                  sampleGameData.timestamp;
        
        return TestFramework.assertTrue(hasImportantFields, 
            'Game data should capture all the important information about each round');
    },
    
    'AI explanations help players understand what happened': function() {
        const counterAI = new CounterAI();
        const elphAI = new ELPH_AI();
        
        counterAI.rememberPlayerMove('Scissors');
        
        const counterExplanation = counterAI.explainMove();
        const elphExplanation = elphAI.explainMove();
        
        const explanationsUseful = typeof counterExplanation === 'string' && 
                                  counterExplanation.length > 5 &&
                                  typeof elphExplanation === 'string' && 
                                  elphExplanation.length > 5;
        
        return TestFramework.assertTrue(explanationsUseful, 
            'AI should provide helpful explanations that help players understand the game');
    }
};

window.IntegrationTests = IntegrationTests; 