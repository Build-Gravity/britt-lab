#!/usr/bin/env node

// Terminal Test Runner for Step 6 Tests
// Runs the same tests as test-runner.html but from the command line

const fs = require('fs');
const path = require('path');

// Enhanced DOM simulation for the test framework
global.document = {
    getElementById: () => ({ 
        appendChild: () => {}, 
        innerHTML: '', 
        textContent: '',
        style: {},
        addEventListener: () => {}
    }),
    createElement: () => ({ 
        className: '', 
        innerHTML: '', 
        appendChild: () => {},
        addEventListener: () => {}
    }),
    addEventListener: () => {} // For DOMContentLoaded
};

// Simple localStorage simulation
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
};

global.window = global;
global.console = console;

// Color output for terminal
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function colorize(color, text) {
    return `${colors[color]}${text}${colors.reset}`;
}

// Load JavaScript files in Node.js context
function loadScript(filename) {
    const fullPath = path.join(__dirname, '..', filename);
    if (!fs.existsSync(fullPath)) {
        console.error(colorize('red', `❌ Could not find ${filename}`));
        process.exit(1);
    }
    
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        eval(content);
        console.log(colorize('blue', `📁 Loaded ${filename}`));
    } catch (error) {
        console.error(colorize('red', `❌ Error loading ${filename}: ${error.message}`));
        process.exit(1);
    }
}

// Enhanced test framework for terminal output
class TerminalTestFramework {
    static results = [];
    
    // All the same assertion methods as the browser version
    static assertEqual(actual, expected, message) {
        if (actual === expected) {
            return { passed: true, message: `${message}` };
        } else {
            return { 
                passed: false, 
                message: `${message}\n     Expected: ${expected}\n     Actual: ${actual}` 
            };
        }
    }
    
    static assertNotEqual(actual, expected, message) {
        if (actual !== expected) {
            return { passed: true, message: `${message}` };
        } else {
            return { 
                passed: false, 
                message: `${message}\n     Values should not be equal: ${actual}` 
            };
        }
    }
    
    static assertTrue(condition, message) {
        if (condition) {
            return { passed: true, message: `${message}` };
        } else {
            return { passed: false, message: `${message}: Expected true, got ${condition}` };
        }
    }
    
    static assertFalse(condition, message) {
        if (!condition) {
            return { passed: true, message: `${message}` };
        } else {
            return { passed: false, message: `${message}: Expected false, got ${condition}` };
        }
    }
    
    static assertContains(array, item, message) {
        if (Array.isArray(array) && array.includes(item)) {
            return { passed: true, message: `${message}` };
        } else {
            return { 
                passed: false, 
                message: `${message}\n     Array ${JSON.stringify(array)} does not contain ${item}` 
            };
        }
    }
    
    static assertType(value, expectedType, message) {
        const actualType = typeof value;
        if (actualType === expectedType) {
            return { passed: true, message: `${message}` };
        } else {
            return { 
                passed: false, 
                message: `${message}\n     Expected type: ${expectedType}\n     Actual type: ${actualType}` 
            };
        }
    }
    
    static assertInstanceOf(value, expectedClass, message) {
        if (value instanceof expectedClass) {
            return { passed: true, message: `${message}` };
        } else {
            return { 
                passed: false, 
                message: `${message}\n     Expected instance of: ${expectedClass.name}\n     Got: ${value.constructor.name}` 
            };
        }
    }
    
    static assertRandomDistribution(values, expectedValue, tolerance, message) {
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        const difference = Math.abs(average - expectedValue);
        
        if (difference <= tolerance) {
            return { 
                passed: true, 
                message: `${message} (avg: ${average.toFixed(3)}, expected: ${expectedValue})` 
            };
        } else {
            return { 
                passed: false, 
                message: `${message}\n     Average: ${average.toFixed(3)}\n     Expected: ${expectedValue} ± ${tolerance}` 
            };
        }
    }
    
    static assertArrayLength(array, expectedLength, message) {
        if (array.length === expectedLength) {
            return { passed: true, message: `${message}` };
        } else {
            return { 
                passed: false, 
                message: `${message}\n     Expected length: ${expectedLength}\n     Actual length: ${array.length}` 
            };
        }
    }
    
    static runTest(testName, testFunction) {
        try {
            const result = testFunction();
            
            if (result.passed) {
                console.log(`  ${colorize('green', '✅')} ${testName}`);
            } else {
                console.log(`  ${colorize('red', '❌')} ${testName}`);
                console.log(`     ${colorize('red', result.message.replace(/\n/g, '\n     '))}`);
            }
            
            return {
                name: testName,
                passed: result.passed,
                message: result.message
            };
        } catch (error) {
            console.log(`  ${colorize('red', '💥')} ${testName}: ${colorize('red', 'ERROR')}`);
            console.log(`     ${colorize('red', error.message)}`);
            return {
                name: testName,
                passed: false,
                message: `${testName}: Threw error - ${error.message}`
            };
        }
    }
    
    static runTestSuite(suiteName, testSuite) {
        console.log(`\n${colorize('bold', suiteName)}`);
        const suiteResults = [];
        
        for (const [testName, testFunction] of Object.entries(testSuite)) {
            const result = this.runTest(testName, testFunction);
            suiteResults.push(result);
        }
        
        const passed = suiteResults.filter(r => r.passed).length;
        const total = suiteResults.length;
        const color = passed === total ? 'green' : 'red';
        console.log(`  ${colorize(color, `${passed}/${total} tests passed`)}`);
        
        return suiteResults;
    }
    
    // Utility methods (same as browser version)
    static simulateMultipleGames(aiClass, numGames = 100) {
        const ai = new aiClass();
        const moves = ['Rock', 'Paper', 'Scissors'];
        const results = [];
        
        for (let i = 0; i < numGames; i++) {
            const playerMove = moves[Math.floor(Math.random() * 3)];
            const aiMove = ai.makeMove();
            ai.rememberPlayerMove(playerMove);
            results.push({ playerMove, aiMove, round: i + 1 });
        }
        
        return results;
    }
    
    static analyzeRandomness(moves, expectedDistribution = [1/3, 1/3, 1/3]) {
        const counts = [0, 0, 0]; // Rock, Paper, Scissors
        const moveMap = { 'Rock': 0, 'Paper': 1, 'Scissors': 2 };
        
        moves.forEach(move => {
            if (moveMap[move] !== undefined) {
                counts[moveMap[move]]++;
            }
        });
        
        const total = moves.length;
        const actual = counts.map(count => count / total);
        
        return {
            expected: expectedDistribution,
            actual: actual,
            deviations: actual.map((freq, i) => Math.abs(freq - expectedDistribution[i]))
        };
    }
    
    static determineWinner(playerChoice, aiChoice) {
        if (playerChoice === aiChoice) return 'tie';
        
        const winConditions = {
            'Rock': 'Scissors',
            'Paper': 'Rock', 
            'Scissors': 'Paper'
        };
        
        return winConditions[playerChoice] === aiChoice ? 'player_wins' : 'ai_wins';
    }
}

// Make TestFramework available globally
global.TestFramework = TerminalTestFramework;

function main() {
    console.log(colorize('bold', '🧪 Step 6 Terminal Test Suite'));
    console.log(colorize('blue', '====================================='));
    
    try {
        // Load dependencies
        console.log(colorize('blue', '\n📦 Loading dependencies...'));
        loadScript('random-ai.js');
        loadScript('counter-ai.js');
        loadScript('biased-random-ai.js');
        loadScript('frequency-counter-ai.js');
        loadScript('elph-ai.js');
        loadScript('step6-experiment.js');
        
        // Load tests
        console.log(colorize('blue', '\n🧪 Loading tests...'));
        loadScript('Tests/simple-ai.test.js');
        loadScript('Tests/pattern-ai.test.js');
        loadScript('Tests/game-logic.test.js');
        loadScript('Tests/integration.test.js');
        loadScript('Tests/elph-math.test.js');
        loadScript('Tests/elph-performance.test.js');
        loadScript('Tests/elph-behavioral.test.js');
        
        // Run all tests
        console.log(colorize('blue', '\n🚀 Running tests...'));
        const allResults = [];
        
        allResults.push(...TerminalTestFramework.runTestSuite('🤖 SimpleAI Tests', SimpleAITests));
        allResults.push(...TerminalTestFramework.runTestSuite('🧠 PatternAI Tests', PatternAITests));
        allResults.push(...TerminalTestFramework.runTestSuite('🎮 Game Logic Tests', GameLogicTests));
        allResults.push(...TerminalTestFramework.runTestSuite('🔗 Integration Tests', IntegrationTests));
        allResults.push(...TerminalTestFramework.runTestSuite('🧮 ELPH Math Tests', ELPHMathTests));
        allResults.push(...TerminalTestFramework.runTestSuite('⚡ ELPH Performance Tests', ELPHPerformanceTests));
        allResults.push(...TerminalTestFramework.runTestSuite('🎯 ELPH Behavioral Tests', ELPHBehavioralTests));
        
        // Final summary
        const totalTests = allResults.length;
        const passedTests = allResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log(colorize('blue', '\n====================================='));
        if (failedTests === 0) {
            console.log(colorize('green', `🎉 All ${totalTests} tests passed!`));
            process.exit(0);
        } else {
            console.log(colorize('red', `📊 Test Results: ${passedTests}/${totalTests} passed`));
            console.log(colorize('red', `❌ ${failedTests} test(s) failed`));
            process.exit(1);
        }
        
    } catch (error) {
        console.error(colorize('red', `💥 Test runner error: ${error.message}`));
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { TerminalTestFramework }; 