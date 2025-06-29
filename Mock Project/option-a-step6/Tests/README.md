# Step 6 Test Suite

Simple tests to verify the Rock-Paper-Scissors AI experiment works correctly. Perfect for catching bugs and understanding how the code works.

## 🚀 Quick Start

### Option 1: Browser Interface (Recommended for learning)
1. **Open the test runner**: Navigate to `Tests/test-runner.html` in your browser
2. **Run tests**: Click "🚀 Run All Tests" 
3. **Check results**: Green means good, red means something's broken
4. **Fix issues**: Use the error messages to find and fix problems

### Option 2: Terminal/Command Line (Great for development)
1. **Open terminal**: Navigate to the `option-a-step6` folder
2. **Run tests**: Use one of these commands:
   - `npm test` - Simple test run
   - `node Tests/test-runner.js` - Direct Node.js execution
3. **Check results**: ✅ for pass, ❌ for fail, with colored output
4. **Integrate with workflow**: Perfect for automation and quick checks

## 📋 What We Test

### 🤖 SimpleAI Tests
- **Creating AI**: Can make different AI strategies (random vs counter)
- **Valid Moves**: AI always chooses Rock, Paper, or Scissors
- **Counter Strategy**: AI beats Rock with Paper, Paper with Scissors, etc.
- **Memory**: AI remembers what the player did in the right order
- **Game Rules**: AI correctly determines who wins each round
- **Statistics**: AI counts wins, losses, and ties properly
- **Explanations**: AI can explain its reasoning to players

### 🧠 PatternAI Tests  
- **Starting Fresh**: New AI starts empty and makes valid moves
- **Learning Patterns**: AI notices when "Rock then Paper usually leads to Scissors"
- **Making Predictions**: AI predicts what player will do based on learned patterns
- **Countering Moves**: AI knows how to beat each move
- **Real Gameplay**: AI works properly during actual games

### 🎮 Game Logic Tests
- **Rock-Paper-Scissors Rules**: All the basic game rules work correctly

### 🔗 Integration Tests
- **Both AIs Work**: SimpleAI and PatternAI both function in real games
- **Different Behaviors**: Random AI vs Counter AI behave differently as expected
- **Data Collection**: Game properly captures important information about each round
- **Player Explanations**: AI provides helpful explanations players can understand

## 🧪 How Tests Help You

### **Catch Bugs Early**
Tests automatically find problems before players do. If a test fails, you know exactly what broke.

### **Safe Changes**
Want to improve the code? Run tests first, make changes, run tests again. If they still pass, your changes are safe.

### **Understand the Code**
Tests show you exactly how each part is supposed to work. They're like documentation that proves itself.

### **Add New Features**
When building new AI algorithms, write tests first to define what they should do, then build them step by step.

## 🔬 Adding Tests for New AI

When you create new AI algorithms (like the ones planned in `AI-Algorithm-Planning.md`), follow this pattern:

### 1. Write a Simple Test First
```javascript
const NewAITests = {
    'New AI makes valid moves': function() {
        const ai = new NewAI();
        const move = ai.makeMove();
        const validMoves = ['Rock', 'Paper', 'Scissors'];
        return TestFramework.assertContains(validMoves, move, 'AI should make valid moves');
    }
};
```

### 2. Run the Test (It Should Fail)
This confirms your test is working and catches the missing feature.

### 3. Build the Minimum Code to Pass
```javascript
class NewAI {
    makeMove() {
        return 'Rock'; // Simplest implementation
    }
}
```

### 4. Improve and Repeat
Add more tests, make them pass, improve the code. Each cycle makes your AI better and more reliable.

## 🔧 Test Framework Features

### **Simple Assertions**
```javascript
TestFramework.assertTrue(condition, 'Error message if false')
TestFramework.assertEqual(actual, expected, 'Error message if different')
TestFramework.assertContains(array, item, 'Error message if not found')
```

### **AI Testing Utilities**
```javascript
TestFramework.simulateMultipleGames(AIClass, 100) // Test AI over many games
TestFramework.analyzeRandomness(moves) // Check if moves are truly random
```

## 📁 Files

- **`test-runner.html`** - Visual interface to run tests in browser
- **`test-runner.js`** - Terminal interface to run tests from command line
- **`test-framework.js`** - Testing tools and utilities  
- **`simple-ai.test.js`** - Tests for SimpleAI class
- **`pattern-ai.test.js`** - Tests for PatternAI class
- **`game-logic.test.js`** - Tests for Rock-Paper-Scissors rules
- **`integration.test.js`** - Tests for how everything works together
- **`../package.json`** - NPM configuration for easy `npm test` command

## 🤝 Contributing

When adding new AI algorithms:

1. **Start with tests** - Define what your AI should do
2. **Keep descriptions clear** - Use simple language to explain what each test checks
3. **Test the essentials** - Focus on core functionality, not edge cases
4. **Make tests readable** - Other people should understand what you're testing

The test suite grows with the project - each new AI algorithm should add a few key tests that verify it works correctly. 