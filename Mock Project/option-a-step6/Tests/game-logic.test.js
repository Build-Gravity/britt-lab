// Simple Tests for Rock-Paper-Scissors Game Rules
// Making sure the basic game logic works correctly

const GameLogicTests = {
    'Rock-Paper-Scissors rules work correctly': function() {
        // Test all the basic game outcomes
        const tie = TestFramework.determineWinner('Rock', 'Rock');
        const rockBeatsScissors = TestFramework.determineWinner('Rock', 'Scissors');
        const paperBeatsRock = TestFramework.determineWinner('Paper', 'Rock');
        const scissorsBeatPaper = TestFramework.determineWinner('Scissors', 'Paper');
        const paperBeatsRock2 = TestFramework.determineWinner('Rock', 'Paper'); // AI wins (Rock vs Paper = AI wins because AI played Paper)
        
        const allRulesWork = tie === 'tie' && 
                            rockBeatsScissors === 'player_wins' && 
                            paperBeatsRock === 'player_wins' &&
                            scissorsBeatPaper === 'player_wins' &&
                            paperBeatsRock2 === 'ai_wins';
        
        return TestFramework.assertTrue(allRulesWork, 
            'Game should correctly determine wins, losses, and ties for Rock-Paper-Scissors');
    }
};

window.GameLogicTests = GameLogicTests; 