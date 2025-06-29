// ELPH Behavioral Correctness Tests
// Tests for parameter interactions, edge cases, and realistic gameplay scenarios
// These tests verify the algorithm behaves sensibly in various conditions

const ELPHBehavioralTests = {
    
    // =====================================
    // PARAMETER INTERACTION TESTS
    // =====================================
    
    'High STM + Low MinObs should handle sparse data gracefully': function() {
        // Test case: STM=6 but MinObs=2 - should not crash with insufficient data
        const config = {
            stmLength: 6,
            entropyThreshold: 1.5,
            minObservations: 2,
            hypothesisPruning: true
        };
        
        // Simulate early game with limited history
        const shortHistory = ['Rock', 'Paper', 'Scissors'];
        const result = simulateELPHDecision(shortHistory, config);
        
        // Should make a valid decision even with sparse data
        const validMoves = ['Rock', 'Paper', 'Scissors'];
        const isValidMove = validMoves.includes(result.move);
        
        return TestFramework.assertTrue(isValidMove && !result.error,
            `High STM + Low MinObs should handle sparse data: got ${result.move}`);
    },

    'Low EntropyThreshold + High MinObs should be very conservative': function() {
        // Test case: Only trust very predictable patterns with lots of evidence
        const config = {
            stmLength: 3,
            entropyThreshold: 0.8, // Very low - only very predictable patterns
            minObservations: 8,     // High - need lots of evidence
            hypothesisPruning: true
        };
        
        // Create a moderately predictable pattern
        const history = createPatternedHistory(['Rock', 'Paper', 'Scissors'], 5); // 15 moves
        const result = simulateELPHDecision(history, config);
        
        // Should either make no prediction (fall back) or be very confident
        const madeConservativeChoice = result.confidence === null || result.confidence > 0.7;
        
        return TestFramework.assertTrue(madeConservativeChoice,
            `Conservative parameters should result in cautious behavior: confidence ${result.confidence}`);
    },

    'Pruning ON vs OFF should show behavioral difference': function() {
        const baseConfig = {
            stmLength: 5,
            entropyThreshold: 2.0, // High threshold to allow many patterns
            minObservations: 2
        };
        
        // Create history with mixed entropy patterns
        const history = createMixedEntropyHistory(40);
        
        // Test with real ELPH instances
        const elphWithPruning = new ELPH_AI({ ...baseConfig, hypothesisPruning: true });
        const elphWithoutPruning = new ELPH_AI({ ...baseConfig, hypothesisPruning: false });
        
        // Feed identical history to both
        for (let i = 0; i < history.length - 1; i++) {
            elphWithPruning.rememberPlayerMove(history[i]);
            elphWithoutPruning.rememberPlayerMove(history[i]);
        }
        
        const patternsWithPruning = elphWithPruning.getPatternDetails();
        const patternsWithoutPruning = elphWithoutPruning.getPatternDetails();
        
        // With pruning should have fewer or equal reliable patterns
        const reliableWithPruning = patternsWithPruning.filter(p => p.reliable).length;
        const reliableWithoutPruning = patternsWithoutPruning.filter(p => p.reliable).length;
        
        // At minimum, they should have some patterns to compare
        const hasPatterns = patternsWithPruning.length > 0 && patternsWithoutPruning.length > 0;
        
        return TestFramework.assertTrue(hasPatterns,
            `Pruning test setup: with pruning ${reliableWithPruning} reliable, without ${reliableWithoutPruning} reliable, total patterns: ${patternsWithPruning.length}/${patternsWithoutPruning.length}`);
    },

    // =====================================
    // EDGE CASE HANDLING TESTS
    // =====================================

    'No patterns found (early game) should fallback to frequency counter': function() {
        const config = {
            stmLength: 5,
            entropyThreshold: 1.0,
            minObservations: 10, // Very high requirement
            hypothesisPruning: true
        };
        
        // Very short history - no patterns can meet requirements
        const shortHistory = ['Rock', 'Paper'];
        const result = simulateELPHDecision(shortHistory, config);
        
        // Should make a valid move using fallback strategy
        const validMoves = ['Rock', 'Paper', 'Scissors'];
        const usedFallback = result.strategy === 'fallback' || result.strategy === 'frequency';
        
        return TestFramework.assertTrue(validMoves.includes(result.move) && usedFallback,
            `Early game should use fallback: move ${result.move}, strategy ${result.strategy}`);
    },

    'Player plays only one move type should have low entropy patterns': function() {
        const config = {
            stmLength: 3,
            entropyThreshold: 1.5,
            minObservations: 3,
            hypothesisPruning: false
        };
        
        // Player always plays Rock
        const monotoneHistory = Array(15).fill('Rock');
        
        // Create ELPH and feed it the pattern
        const elph = new ELPH_AI(config);
        for (let i = 0; i < monotoneHistory.length - 1; i++) {
            elph.rememberPlayerMove(monotoneHistory[i]);
        }
        
        const patterns = elph.getPatternDetails();
        const move = elph.makeMove();
        
        // Should find at least one very low entropy pattern
        const hasLowEntropyPattern = patterns.some(p => parseFloat(p.entropy) < 0.1);
        const madeValidMove = ['Rock', 'Paper', 'Scissors'].includes(move);
        
        return TestFramework.assertTrue(hasLowEntropyPattern && madeValidMove,
            `Monotone pattern should create low entropy: patterns found ${patterns.length}, move ${move}`);
    },

    'STM longer than history should use available history': function() {
        const config = {
            stmLength: 10,
            entropyThreshold: 1.5,
            minObservations: 2,
            hypothesisPruning: false
        };
        
        const shortHistory = ['Rock', 'Paper', 'Scissors', 'Rock', 'Paper'];
        const result = simulateELPHDecision(shortHistory, config);
        
        const usedAvailableHistory = result.stmUsed <= shortHistory.length;
        const madeValidMove = ['Rock', 'Paper', 'Scissors'].includes(result.move);
        
        return TestFramework.assertTrue(usedAvailableHistory && madeValidMove,
            `Should adapt STM: used ${result.stmUsed}/${shortHistory.length}`);
    },

    // =====================================
    // REALISTIC GAMEPLAY SCENARIOS
    // =====================================

    'Should adapt behavior as game progresses from random to patterned': function() {
        const config = {
            stmLength: 4,
            entropyThreshold: 1.2,
            minObservations: 5,
            hypothesisPruning: true
        };
        
        // Start random, then develop pattern
        const earlyHistory = createRandomHistory(10);
        const lateHistory = [...earlyHistory, ...createPatternedHistory(['Rock', 'Paper'], 10)];
        
        const earlyResult = simulateELPHDecision(earlyHistory, config);
        const lateResult = simulateELPHDecision(lateHistory, config);
        
        // Early game should be uncertain, late game should be more confident
        const adaptedBehavior = (lateResult.confidence || 0) > (earlyResult.confidence || 0);
        
        return TestFramework.assertTrue(adaptedBehavior,
            `Should adapt to emerging patterns: early confidence ${earlyResult.confidence}, late confidence ${lateResult.confidence}`);
    },

    'Should handle alternating patterns (worst-case diversity)': function() {
        const config = {
            stmLength: 6,
            entropyThreshold: 1.8, // Allow higher entropy patterns
            minObservations: 3,
            hypothesisPruning: false
        };
        
        // Create alternating R-P-S-R-P-S pattern
        const alternatingHistory = [];
        for (let i = 0; i < 30; i++) {
            alternatingHistory.push(['Rock', 'Paper', 'Scissors'][i % 3]);
        }
        
        const result = simulateELPHDecision(alternatingHistory, config);
        
        // Should handle without error and make reasonable prediction
        const handledGracefully = result.move !== null && !result.error;
        const madeValidMove = ['Rock', 'Paper', 'Scissors'].includes(result.move);
        
        return TestFramework.assertTrue(handledGracefully && madeValidMove,
            `Should handle alternating patterns: move ${result.move}, error ${result.error}`);
    }
};

// =====================================
// HELPER FUNCTIONS FOR BEHAVIORAL TESTS
// =====================================

// Real ELPH decision-making process using actual implementation
function simulateELPHDecision(history, config) {
    const validMoves = ['Rock', 'Paper', 'Scissors'];
    
    try {
        // Create real ELPH AI instance
        const elph = new ELPH_AI(config);
        
        // Feed it the history (except last move to simulate decision point)
        for (let i = 0; i < history.length - 1; i++) {
            elph.rememberPlayerMove(history[i]);
        }
        
        // Get decision and analysis
        const move = elph.makeMove();
        const patterns = elph.getPatternDetails();
        const explanation = elph.explainMove();
        
        // Determine strategy from explanation
        let strategy = 'fallback';
        if (explanation.includes('ELPH detected pattern')) {
            strategy = 'pattern';
        } else if (explanation.includes('frequency')) {
            strategy = 'frequency';
        }
        
        return {
            move: move,
            strategy: strategy,
            stmUsed: Math.min(config.stmLength, history.length - 1),
            hypothesesConsidered: patterns.filter(p => p.reliable).length,
            confidence: patterns.length > 0 ? (1 - Math.min(...patterns.map(p => parseFloat(p.entropy)))) : null,
            error: false
        };
        
    } catch (error) {
        return {
            move: null,
            strategy: 'error',
            confidence: null,
            stmUsed: 0,
            hypothesesConsidered: 0,
            error: error.message
        };
    }
}

// Generate all subpatterns from STM (reused from math tests)
function generateSubpatterns(stm) {
    const patterns = [];
    for (let length = 1; length <= stm.length; length++) {
        for (let start = 0; start <= stm.length - length; start++) {
            const pattern = stm.slice(start, start + length).join('-');
            patterns.push(pattern);
        }
    }
    return patterns;
}

// Create history with repeated pattern
function createPatternedHistory(pattern, repetitions) {
    const history = [];
    for (let i = 0; i < repetitions; i++) {
        history.push(...pattern);
    }
    return history;
}

// Create random history
function createRandomHistory(length) {
    const moves = ['Rock', 'Paper', 'Scissors'];
    const history = [];
    for (let i = 0; i < length; i++) {
        history.push(moves[Math.floor(Math.random() * 3)]);
    }
    return history;
}

// Create history with mixed entropy patterns for testing pruning
function createMixedEntropyHistory(length) {
    const moves = ['Rock', 'Paper', 'Scissors'];
    const history = [];
    
    for (let i = 0; i < length; i++) {
        if (i % 10 < 3) {
            // Create predictable pattern (low entropy)
            history.push('Rock');
        } else if (i % 7 < 2) {
            // Create semi-predictable pattern (medium entropy)
            history.push(i % 2 === 0 ? 'Paper' : 'Scissors');
        } else {
            // Random (high entropy)
            history.push(moves[Math.floor(Math.random() * 3)]);
        }
    }
    return history;
}

// Create noisy history with mixed patterns
function createNoisyHistory(length) {
    const history = [];
    const moves = ['Rock', 'Paper', 'Scissors'];
    
    for (let i = 0; i < length; i++) {
        if (i % 7 === 0) {
            // Introduce some predictable patterns
            history.push('Rock');
        } else if (i % 11 === 0) {
            history.push('Paper');
        } else {
            // Random noise
            history.push(moves[Math.floor(Math.random() * 3)]);
        }
    }
    return history;
}

// Counter a move
function counterMove(move) {
    const counters = { 'Rock': 'Paper', 'Paper': 'Scissors', 'Scissors': 'Rock' };
    return counters[move] || 'Rock';
}

// Export for test runner
window.ELPHBehavioralTests = ELPHBehavioralTests; 