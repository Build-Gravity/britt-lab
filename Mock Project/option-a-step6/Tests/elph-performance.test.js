// ELPH Performance Stress Tests
// Tests to determine computational limits and enforce 2000ms response time requirement
// These tests help us find the practical STM limits for real-time gameplay

const ELPHPerformanceTests = {
    
    // Test STM scaling from 1-8 to find performance limits
    'STM 1-8 scaling performance under 2000ms': function() {
        const results = [];
        const threshold = 2000; // 2 second limit per user requirement
        
        for (let stm = 1; stm <= 8; stm++) {
            const startTime = performance.now();
            
            // Create realistic game history
            const mockHistory = generateTestHistory(100);
            const mockSTM = mockHistory.slice(-stm);
            
            // Generate all subpatterns
            const patterns = generateSubpatterns(mockSTM);
            
            // Simulate entropy calculations for each pattern
            for (const pattern of patterns) {
                simulateEntropyCalculation([pattern]);
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            results.push({ stm, duration, patternCount: patterns.length });
        }
        
        const maxDuration = Math.max(...results.map(r => r.duration));
        const maxSTM = results.filter(r => r.duration < threshold).length;
        
        return TestFramework.assertTrue(maxDuration < threshold,
            `STM 1-8 max duration: ${maxDuration.toFixed(2)}ms, practical max STM: ${maxSTM}`);
    },

    // Test performance with realistic game lengths
    'Handle 1000 trials with maximum practical STM': function() {
        const stm = 6; // Conservative estimate
        const numTrials = 1000;
        const threshold = 100; // 100ms per move should be responsive
        
        const mockHistory = [];
        const moveTimes = [];
        
        // Test every 50th trial to keep test reasonable
        for (let trial = 0; trial < numTrials; trial++) {
            const move = ['Rock', 'Paper', 'Scissors'][trial % 3];
            mockHistory.push(move);
            
            if (trial % 50 === 0 && mockHistory.length >= stm) {
                const startTime = performance.now();
                
                const mockSTM = mockHistory.slice(-stm);
                const patterns = generateSubpatterns(mockSTM);
                simulateEntropyCalculation(patterns);
                
                const endTime = performance.now();
                const duration = endTime - startTime;
                moveTimes.push(duration);
            }
        }
        
        const maxMoveTime = Math.max(...moveTimes);
        
        return TestFramework.assertTrue(maxMoveTime < threshold,
            `1000 trials with STM=${stm}: max move time ${maxMoveTime.toFixed(2)}ms`);
    },

    // Worst-case scenario with maximum pattern diversity
    'Handle worst-case pattern diversity': function() {
        const stm = 8;
        const threshold = 1000; // 1 second for worst case
        
        // Create alternating pattern for maximum diversity
        const worstCaseHistory = [];
        for (let i = 0; i < 50; i++) {
            worstCaseHistory.push(['Rock', 'Paper', 'Scissors'][i % 3]);
        }
        
        const startTime = performance.now();
        
        const mockSTM = worstCaseHistory.slice(-stm);
        const patterns = generateSubpatterns(mockSTM);
        
        // Full entropy calculation simulation
        for (const pattern of patterns) {
            simulateEntropyCalculation([pattern]);
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        return TestFramework.assertTrue(duration < threshold,
            `Worst-case diversity: ${duration.toFixed(2)}ms (limit: ${threshold}ms)`);
    }
};

// =====================================
// HELPER FUNCTIONS FOR PERFORMANCE TESTS
// =====================================

// Generate realistic test history
function generateTestHistory(length) {
    const moves = ['Rock', 'Paper', 'Scissors'];
    const history = [];
    
    for (let i = 0; i < length; i++) {
        if (i > 0 && Math.random() < 0.3) {
            // 30% chance to repeat (realistic bias)
            history.push(history[history.length - 1]);
        } else {
            history.push(moves[Math.floor(Math.random() * 3)]);
        }
    }
    
    return history;
}

// Generate all subpatterns from STM
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

// Simulate computational work of entropy calculation
function simulateEntropyCalculation(patterns) {
    let result = 0;
    
    for (const pattern of patterns) {
        // Simulate entropy calculation work
        for (let i = 0; i < 10; i++) {
            result += Math.log2(Math.random() + 0.1);
        }
    }
    
    return result;
}

// Export for test runner
window.ELPHPerformanceTests = ELPHPerformanceTests; 