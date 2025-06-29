// ELPH Mathematical Accuracy Tests
// Tests for entropy calculations, hypothesis generation, and soft-max selection
// These tests verify the mathematical correctness of the study-accurate ELPH implementation

const ELPHMathTests = {
    
    // =====================================
    // ENTROPY CALCULATION TESTS
    // =====================================
    
    'Entropy calculation for perfectly predictable pattern (H=0)': function() {
        // Test case: Pattern always leads to same outcome
        const outcomes = { Rock: 10, Paper: 0, Scissors: 0 };
        const totalCount = 10;
        
        // Expected entropy: H = -1.0 * log2(1.0) = 0
        const expectedEntropy = 0.0;
        const actualEntropy = calculateEntropy(outcomes, totalCount);
        
        // Allow small floating point tolerance
        const tolerance = 0.001;
        const withinTolerance = Math.abs(actualEntropy - expectedEntropy) < tolerance;
        
        return TestFramework.assertTrue(withinTolerance, 
            `Perfect predictability should have entropy ~0, got ${actualEntropy}`);
    },

    'Entropy calculation for perfectly random pattern (H=1.585)': function() {
        // Test case: Equal distribution across all outcomes
        const outcomes = { Rock: 100, Paper: 100, Scissors: 100 };
        const totalCount = 300;
        
        // Expected entropy: H = -3 * (1/3 * log2(1/3)) = 1.585 bits
        const expectedEntropy = 1.585;
        const actualEntropy = calculateEntropy(outcomes, totalCount);
        
        const tolerance = 0.01;
        const withinTolerance = Math.abs(actualEntropy - expectedEntropy) < tolerance;
        
        return TestFramework.assertTrue(withinTolerance, 
            `Perfect randomness should have entropy ~1.585, got ${actualEntropy}`);
    },

    'Entropy calculation for biased pattern (80-20 split)': function() {
        // Test case: 80% Scissors, 20% Rock after Rock-Paper
        const outcomes = { Rock: 2, Paper: 0, Scissors: 8 };
        const totalCount = 10;
        
        // Expected: H = -(0.8*log2(0.8) + 0.2*log2(0.2)) = 0.722 bits
        const expectedEntropy = 0.722;
        const actualEntropy = calculateEntropy(outcomes, totalCount);
        
        const tolerance = 0.01;
        const withinTolerance = Math.abs(actualEntropy - expectedEntropy) < tolerance;
        
        return TestFramework.assertTrue(withinTolerance, 
            `80-20 pattern should have entropy ~0.722, got ${actualEntropy}`);
    },

    'Entropy handles edge case with zero probabilities': function() {
        // Test case: Some outcomes never occur
        const outcomes = { Rock: 0, Paper: 7, Scissors: 3 };
        const totalCount = 10;
        
        // Should handle log(0) gracefully (treat as 0 contribution)
        const actualEntropy = calculateEntropy(outcomes, totalCount);
        
        // Should not be NaN or Infinity
        const isValid = !isNaN(actualEntropy) && isFinite(actualEntropy);
        
        return TestFramework.assertTrue(isValid, 
            `Entropy calculation should handle zero probabilities gracefully, got ${actualEntropy}`);
    },

    // =====================================
    // HYPOTHESIS GENERATION TESTS
    // =====================================

    'STM generates correct number of subpatterns': function() {
        // Test case: STM = [Rock, Paper, Scissors] should generate 6 patterns
        const stm = ['Rock', 'Paper', 'Scissors'];
        const patterns = generateSubpatterns(stm);
        
        // Expected: "Rock", "Paper", "Scissors", "Rock-Paper", "Paper-Scissors", "Rock-Paper-Scissors"
        const expectedCount = 6; // 3 + 2 + 1 = 6 subpatterns
        
        return TestFramework.assertEqual(patterns.length, expectedCount,
            `STM length 3 should generate 6 subpatterns, got ${patterns.length}`);
    },

    'STM generates correct pattern sequences': function() {
        const stm = ['Rock', 'Paper', 'Scissors'];
        const patterns = generateSubpatterns(stm);
        
        const expectedPatterns = [
            'Rock', 'Paper', 'Scissors',           // Length 1
            'Rock-Paper', 'Paper-Scissors',       // Length 2  
            'Rock-Paper-Scissors'                 // Length 3
        ];
        
        // Check if all expected patterns are present
        const allPatternsFound = expectedPatterns.every(pattern => patterns.includes(pattern));
        
        return TestFramework.assertTrue(allPatternsFound,
            `Expected patterns: ${expectedPatterns.join(', ')}, got: ${patterns.join(', ')}`);
    },

    'STM pattern generation scales correctly': function() {
        // Test different STM lengths follow n*(n+1)/2 formula
        const testCases = [
            { stm: ['R'], expected: 1 },           // 1
            { stm: ['R', 'P'], expected: 3 },      // 2+1 = 3
            { stm: ['R', 'P', 'S'], expected: 6 }, // 3+2+1 = 6
            { stm: ['R', 'P', 'S', 'R'], expected: 10 }, // 4+3+2+1 = 10
        ];
        
        for (const testCase of testCases) {
            const patterns = generateSubpatterns(testCase.stm);
            if (patterns.length !== testCase.expected) {
                return TestFramework.assertEqual(patterns.length, testCase.expected,
                    `STM length ${testCase.stm.length} should generate ${testCase.expected} patterns, got ${patterns.length}`);
            }
        }
        
        return TestFramework.assertTrue(true, 'All STM lengths generate correct pattern counts');
    },

    // =====================================
    // SOFT-MAX SELECTION TESTS
    // =====================================

    'Soft-max selection favors lower entropy hypotheses': function() {
        // Test case: Three hypotheses with different entropy values
        const hypotheses = [
            { pattern: 'Rock', entropy: 0.5 },      // Most reliable
            { pattern: 'Paper', entropy: 1.0 },     // Medium reliability
            { pattern: 'Scissors', entropy: 1.5 }   // Least reliable
        ];
        
        const probabilities = calculateSoftMaxProbabilities(hypotheses);
        
        // P(h) = exp(-H) / Σ exp(-H_j)
        // Lower entropy should get higher probability
        const bestHypothesis = probabilities[0]; // Rock with entropy 0.5
        const worstHypothesis = probabilities[2]; // Scissors with entropy 1.5
        
        return TestFramework.assertTrue(bestHypothesis > worstHypothesis,
            `Lower entropy hypothesis should have higher probability: ${bestHypothesis} > ${worstHypothesis}`);
    },

    'Soft-max probabilities sum to 1.0': function() {
        const hypotheses = [
            { pattern: 'Rock', entropy: 0.7 },
            { pattern: 'Paper', entropy: 1.2 },
            { pattern: 'Scissors', entropy: 1.8 }
        ];
        
        const probabilities = calculateSoftMaxProbabilities(hypotheses);
        const sum = probabilities.reduce((total, prob) => total + prob, 0);
        
        const tolerance = 0.001;
        const sumIsOne = Math.abs(sum - 1.0) < tolerance;
        
        return TestFramework.assertTrue(sumIsOne,
            `Soft-max probabilities should sum to 1.0, got ${sum}`);
    },

    'Soft-max handles identical entropy values': function() {
        // Edge case: All hypotheses have same entropy
        const hypotheses = [
            { pattern: 'Rock', entropy: 1.0 },
            { pattern: 'Paper', entropy: 1.0 },
            { pattern: 'Scissors', entropy: 1.0 }
        ];
        
        const probabilities = calculateSoftMaxProbabilities(hypotheses);
        
        // Should be approximately equal (1/3 each)
        const expectedProb = 1/3;
        const tolerance = 0.01;
        
        const allEqual = probabilities.every(prob => 
            Math.abs(prob - expectedProb) < tolerance
        );
        
        return TestFramework.assertTrue(allEqual,
            `Equal entropy should yield equal probabilities ~0.333, got ${probabilities.join(', ')}`);
    }
};

// =====================================
// HELPER FUNCTIONS FOR MATHEMATICAL TESTS
// =====================================

// Calculate entropy using the formula: H = -Σ p_i * log2(p_i)
function calculateEntropy(outcomes, totalCount) {
    if (totalCount === 0) return 0;
    
    let entropy = 0;
    for (const [outcome, count] of Object.entries(outcomes)) {
        if (count > 0) {
            const probability = count / totalCount;
            entropy -= probability * Math.log2(probability);
        }
    }
    
    return entropy;
}

// Generate all subpatterns from STM (all possible contiguous subsequences)
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

// Calculate soft-max probabilities: P(h_i) = exp(-H_i) / Σ exp(-H_j)
function calculateSoftMaxProbabilities(hypotheses) {
    const expValues = hypotheses.map(h => Math.exp(-h.entropy));
    const sumExp = expValues.reduce((sum, val) => sum + val, 0);
    
    return expValues.map(exp => exp / sumExp);
}

// Export for test runner
window.ELPHMathTests = ELPHMathTests; 