// Simple Test Framework for Step 6
// Provides assertion methods and test running capabilities
// Designed for easy extension when adding new AI algorithms

class TestFramework {
    static results = [];
    
    // Core assertion methods
    static assertEqual(actual, expected, message) {
        if (actual === expected) {
            return { passed: true, message: `✅ ${message}` };
        } else {
            return { 
                passed: false, 
                message: `❌ ${message}\n   Expected: ${expected}\n   Actual: ${actual}` 
            };
        }
    }
    
    static assertNotEqual(actual, expected, message) {
        if (actual !== expected) {
            return { passed: true, message: `✅ ${message}` };
        } else {
            return { 
                passed: false, 
                message: `❌ ${message}\n   Values should not be equal: ${actual}` 
            };
        }
    }
    
    static assertTrue(condition, message) {
        if (condition) {
            return { passed: true, message: `✅ ${message}` };
        } else {
            return { passed: false, message: `❌ ${message}: Expected true, got ${condition}` };
        }
    }
    
    static assertFalse(condition, message) {
        if (!condition) {
            return { passed: true, message: `✅ ${message}` };
        } else {
            return { passed: false, message: `❌ ${message}: Expected false, got ${condition}` };
        }
    }
    
    static assertContains(array, item, message) {
        if (Array.isArray(array) && array.includes(item)) {
            return { passed: true, message: `✅ ${message}` };
        } else {
            return { 
                passed: false, 
                message: `❌ ${message}\n   Array ${JSON.stringify(array)} does not contain ${item}` 
            };
        }
    }
    
    static assertType(value, expectedType, message) {
        const actualType = typeof value;
        if (actualType === expectedType) {
            return { passed: true, message: `✅ ${message}` };
        } else {
            return { 
                passed: false, 
                message: `❌ ${message}\n   Expected type: ${expectedType}\n   Actual type: ${actualType}` 
            };
        }
    }
    
    static assertInstanceOf(value, expectedClass, message) {
        if (value instanceof expectedClass) {
            return { passed: true, message: `✅ ${message}` };
        } else {
            return { 
                passed: false, 
                message: `❌ ${message}\n   Expected instance of: ${expectedClass.name}\n   Got: ${value.constructor.name}` 
            };
        }
    }
    
    // Statistical assertion for randomness testing
    static assertRandomDistribution(values, expectedValue, tolerance, message) {
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        const difference = Math.abs(average - expectedValue);
        
        if (difference <= tolerance) {
            return { 
                passed: true, 
                message: `✅ ${message} (avg: ${average.toFixed(3)}, expected: ${expectedValue})` 
            };
        } else {
            return { 
                passed: false, 
                message: `❌ ${message}\n   Average: ${average.toFixed(3)}\n   Expected: ${expectedValue} ± ${tolerance}` 
            };
        }
    }
    
    // Test for array properties
    static assertArrayLength(array, expectedLength, message) {
        if (array.length === expectedLength) {
            return { passed: true, message: `✅ ${message}` };
        } else {
            return { 
                passed: false, 
                message: `❌ ${message}\n   Expected length: ${expectedLength}\n   Actual length: ${array.length}` 
            };
        }
    }
    
    // Test runner methods
    static runTest(testName, testFunction) {
        try {
            console.log(`🔄 Running: ${testName}`);
            const result = testFunction();
            
            if (result.passed) {
                console.log(`✅ ${testName}: PASSED`);
            } else {
                console.error(`❌ ${testName}: FAILED`);
                console.error(result.message);
            }
            
            return {
                name: testName,
                passed: result.passed,
                message: result.message
            };
        } catch (error) {
            console.error(`💥 ${testName}: ERROR - ${error.message}`);
            return {
                name: testName,
                passed: false,
                message: `❌ ${testName}: Threw error - ${error.message}`
            };
        }
    }
    
    static runTestSuite(suiteName, testSuite) {
        console.log(`\n🧪 Running test suite: ${suiteName}`);
        const suiteResults = [];
        
        for (const [testName, testFunction] of Object.entries(testSuite)) {
            const result = this.runTest(testName, testFunction);
            suiteResults.push(result);
        }
        
        // Display results in UI
        this.displayResults(suiteName, suiteResults);
        
        const passed = suiteResults.filter(r => r.passed).length;
        const total = suiteResults.length;
        console.log(`📊 ${suiteName}: ${passed}/${total} tests passed\n`);
        
        return suiteResults;
    }
    
    static displayResults(suiteName, results) {
        const resultsContainer = document.getElementById('test-results');
        
        // Create suite section
        const suiteDiv = document.createElement('div');
        suiteDiv.className = 'test-suite-results';
        
        const passed = results.filter(r => r.passed).length;
        const total = results.length;
        const allPassed = passed === total;
        
        suiteDiv.innerHTML = `
            <h3>${suiteName} (${passed}/${total})</h3>
            <div class="suite-summary ${allPassed ? 'test-pass' : 'test-fail'}">
                ${allPassed ? '✅ All tests passed!' : `❌ ${total - passed} test(s) failed`}
            </div>
        `;
        
        // Add individual test results
        results.forEach(result => {
            const testDiv = document.createElement('div');
            testDiv.className = `test-result ${result.passed ? 'test-pass' : 'test-fail'}`;
            testDiv.innerHTML = `<strong>${result.name}:</strong> ${result.message}`;
            suiteDiv.appendChild(testDiv);
        });
        
        resultsContainer.appendChild(suiteDiv);
    }
    
    // Utility methods for common test patterns
    static simulateMultipleGames(aiClass, numGames = 100) {
        const ai = new aiClass();
        const moves = ['Rock', 'Paper', 'Scissors'];
        const results = [];
        
        for (let i = 0; i < numGames; i++) {
            // Simulate player making random moves
            const playerMove = moves[Math.floor(Math.random() * 3)];
            const aiMove = ai.makeMove();
            
            // Record moves
            ai.rememberPlayerMove(playerMove);
            results.push({ playerMove, aiMove, round: i + 1 });
        }
        
        return { ai, results };
    }
    
    static analyzeRandomness(moves, expectedDistribution = [1/3, 1/3, 1/3]) {
        const counts = { Rock: 0, Paper: 0, Scissors: 0 };
        moves.forEach(move => counts[move]++);
        
        const total = moves.length;
        const distribution = [
            counts.Rock / total,
            counts.Paper / total,
            counts.Scissors / total
        ];
        
        // Chi-square test for randomness
        const chiSquare = expectedDistribution.reduce((sum, expected, i) => {
            const observed = distribution[i];
            return sum + Math.pow(observed - expected, 2) / expected;
        }, 0);
        
        return {
            counts,
            distribution,
            chiSquare,
            isRandom: chiSquare < 5.991 // 95% confidence level for 2 degrees of freedom
        };
    }
    
    static measureLearningProgression(gameResults) {
        const thirdSize = Math.floor(gameResults.length / 3);
        
        const early = gameResults.slice(0, thirdSize);
        const middle = gameResults.slice(thirdSize, thirdSize * 2);
        const late = gameResults.slice(-thirdSize);
        
        const calculateWinRate = (games) => {
            const aiWins = games.filter(g => {
                const result = this.determineWinner(g.playerMove, g.aiMove);
                return result === 'ai_wins';
            }).length;
            return aiWins / games.length;
        };
        
        return {
            early: calculateWinRate(early),
            middle: calculateWinRate(middle),
            late: calculateWinRate(late)
        };
    }
    
    // Helper method for determining winners (mirrors game logic)
    static determineWinner(playerChoice, aiChoice) {
        if (playerChoice === aiChoice) return 'tie';
        
        const winCombos = {
            'Rock': 'Scissors',
            'Paper': 'Rock',
            'Scissors': 'Paper'
        };
        
        return winCombos[playerChoice] === aiChoice ? 'player_wins' : 'ai_wins';
    }
}

// Export for use in other test files
window.TestFramework = TestFramework; 