// Visualization Module for Step 7: RELPH Analysis
// Creates plots replicating Anderson et al. (2014) figures

let currentVisualization = 'winRate';
let visualizationData = {};

// Show win rate analysis (replicates Figure 1 from Anderson et al.)
function showWinRateAnalysis() {
    if (!gameData || !analysisResults.relphResults) {
        console.log('📈 No data available for visualization');
        return;
    }
    
    console.log('📈 Generating win rate analysis (Anderson et al. Figure 1)...');
    
    // Focus on Phase 3 data (last 200 trials) as in original study
    const phase3Data = gameData.filter(trial => trial.phase === 3);
    const modelData = analysisResults.relphResults.slice(-200); // Last 200 model results
    
    // Calculate win rates in 10-trial blocks
    const humanWinRates = [];
    const modelWinRates = [];
    const blocks = [];
    
    for (let i = 0; i < phase3Data.length; i += 10) {
        const humanBlock = phase3Data.slice(i, i + 10);
        const modelBlock = modelData.slice(i, i + 10);
        
        const humanWins = humanBlock.filter(trial => trial.outcome === 'win').length;
        const modelWins = modelBlock.filter(trial => trial.outcome === 'win').length;
        
        humanWinRates.push(humanWins / humanBlock.length);
        modelWinRates.push(modelWins / modelBlock.length);
        blocks.push(Math.floor(i / 10) + 1);
    }
    
    // Create traces for Plotly
    const traces = [
        {
            x: blocks,
            y: humanWinRates,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Human Performance',
            line: { 
                color: '#2E86AB', 
                width: 3 
            },
            marker: { 
                size: 8, 
                color: '#2E86AB' 
            }
        },
        {
            x: blocks,
            y: modelWinRates,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'RELPH Model',
            line: { 
                color: '#A23B72', 
                width: 3, 
                dash: 'dash' 
            },
            marker: { 
                size: 8, 
                color: '#A23B72' 
            }
        }
    ];
    
    // Layout configuration
    const layout = {
        title: {
            text: 'Win Rate Over Time (10-Trial Blocks)<br><sub>Replicating Figure 1 from Anderson et al. (2014) - Phase 3 Only</sub>',
            font: { size: 16 }
        },
        xaxis: {
            title: 'Block Number (10 trials each)',
            showgrid: true,
            gridcolor: '#E5E5E5',
            range: [0.5, blocks.length + 0.5]
        },
        yaxis: {
            title: 'Win Rate',
            range: [0, 1],
            tickformat: '.1%',
            showgrid: true,
            gridcolor: '#E5E5E5'
        },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        hovermode: 'x unified',
        legend: {
            x: 0.02,
            y: 0.98,
            bgcolor: 'rgba(255,255,255,0.8)',
            bordercolor: '#CCCCCC',
            borderwidth: 1
        },
        margin: {
            l: 60,
            r: 50,
            t: 80,
            b: 60
        }
    };
    
    // Plot configuration
    const config = {
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d']
    };
    
    // Create the plot
    Plotly.newPlot('winRatePlot', traces, layout, config);
    
    console.log('✅ Win rate analysis plot created');
    
    // Add interpretation below the plot
    addInterpretation();
}

// Add interpretation text below the plot
function addInterpretation() {
    const plotContainer = document.getElementById('winRatePlot');
    if (!plotContainer || !analysisResults.fitResults) return;
    
    // Check if interpretation already exists
    let interpretation = plotContainer.nextElementSibling;
    if (!interpretation || !interpretation.classList.contains('plot-interpretation')) {
        interpretation = document.createElement('div');
        interpretation.className = 'plot-interpretation';
        plotContainer.parentNode.insertBefore(interpretation, plotContainer.nextSibling);
    }
    
    const choiceAgreement = (analysisResults.fitResults.choiceAgreement * 100).toFixed(1);
    const fitQuality = analysisResults.fitResults.fitQuality;
    
    interpretation.innerHTML = `
        <div class="interpretation-box">
            <h4>📊 Analysis Results</h4>
            <ul>
                <li><strong>Model Fit:</strong> ${choiceAgreement}% choice agreement (${fitQuality} fit)</li>
                <li><strong>Learning Pattern:</strong> Both human and model show improvement exploiting the 80% Paper bias</li>
                <li><strong>RELPH Parameters:</strong> n=${relphModel.n}, Hthr=${relphModel.Hthr}, α=${relphModel.alpha}</li>
                <li><strong>Key Finding:</strong> Reinforcement learning (reward-based) better explains behavior than statistical learning</li>
            </ul>
            <p><em>This replicates the methodology from Anderson et al. (2014), focusing on Phase 3 where participants 
            had the strongest opportunity to learn the computer's strategy.</em></p>
        </div>
    `;
}

// Utility function to export plot as image
function exportPlot() {
    if (typeof Plotly !== 'undefined') {
        Plotly.downloadImage('winRatePlot', {
            format: 'png',
            width: 800,
            height: 600,
            filename: 'anderson-relph-analysis'
        });
    }
}

// Export for browser use
if (typeof window !== 'undefined') {
    window.showWinRateAnalysis = showWinRateAnalysis;
    window.exportPlot = exportPlot;
}

// Show exploration analysis
function showExplorationAnalysis() {
    setActiveVisualization('exploration');
    
    if (!gameData) {
        showMessage('explorationPlot', 'Load data first to view exploration analysis');
        return;
    }
    
    console.log('🔍 Generating exploration analysis...');
    
    const explorationData = calculateExplorationMetrics();
    createExplorationPlot(explorationData);
    
    visualizationData.exploration = explorationData;
}

// Calculate exploration vs exploitation metrics
function calculateExplorationMetrics() {
    const windowSize = 20; // Rolling window for analysis
    const explorationMetrics = [];
    
    for (let i = windowSize; i <= gameData.length; i += 5) { // Every 5 trials
        const window = gameData.slice(i - windowSize, i);
        
        // Calculate choice entropy (exploration measure)
        const choiceFreq = { 'Rock': 0, 'Paper': 0, 'Scissors': 0 };
        window.forEach(trial => {
            choiceFreq[trial.playerChoice]++;
        });
        
        let entropy = 0;
        Object.values(choiceFreq).forEach(freq => {
            if (freq > 0) {
                const prob = freq / window.length;
                entropy -= prob * Math.log2(prob);
            }
        });
        
        // Normalize entropy (0 = pure exploitation, 1 = maximum exploration)
        const normalizedEntropy = entropy / Math.log2(3);
        
        // Calculate win rate in this window
        const wins = window.filter(trial => trial.outcome === 'win').length;
        const winRate = wins / window.length;
        
        // Calculate strategy consistency (exploitation measure)
        const mostFrequentChoice = Object.keys(choiceFreq).reduce((a, b) => 
            choiceFreq[a] > choiceFreq[b] ? a : b
        );
        const consistency = choiceFreq[mostFrequentChoice] / window.length;
        
        explorationMetrics.push({
            trial: i,
            exploration: normalizedEntropy,
            exploitation: consistency,
            winRate: winRate,
            phase: gameData[i - 1].phase
        });
    }
    
    return explorationMetrics;
}

// Create exploration plot
function createExplorationPlot(explorationData) {
    const explorationTrace = {
        x: explorationData.map(d => d.trial),
        y: explorationData.map(d => d.exploration),
        type: 'scatter',
        mode: 'lines',
        name: 'Exploration Index',
        line: { color: '#F18F01', width: 2 },
        yaxis: 'y'
    };
    
    const exploitationTrace = {
        x: explorationData.map(d => d.trial),
        y: explorationData.map(d => d.exploitation),
        type: 'scatter',
        mode: 'lines',
        name: 'Exploitation Index',
        line: { color: '#C73E1D', width: 2 },
        yaxis: 'y'
    };
    
    const winRateTrace = {
        x: explorationData.map(d => d.trial),
        y: explorationData.map(d => d.winRate),
        type: 'scatter',
        mode: 'lines',
        name: 'Win Rate',
        line: { color: '#2E86AB', width: 2 },
        yaxis: 'y2'
    };
    
    const layout = {
        title: {
            text: 'Exploration vs Exploitation Over Time<br><sub>Analysis of strategy flexibility and performance</sub>',
            font: { size: 18 }
        },
        xaxis: {
            title: 'Trial Number',
            showgrid: true,
            gridcolor: '#E5E5E5'
        },
        yaxis: {
            title: 'Exploration/Exploitation Index',
            side: 'left',
            range: [0, 1],
            showgrid: true,
            gridcolor: '#E5E5E5'
        },
        yaxis2: {
            title: 'Win Rate',
            side: 'right',
            overlaying: 'y',
            range: [0, 1],
            tickformat: '.1%'
        },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        hovermode: 'x unified',
        legend: {
            x: 0.02,
            y: 0.98
        }
    };
    
    const config = {
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
    };
    
    Plotly.newPlot('explorationPlot', [explorationTrace, exploitationTrace, winRateTrace], layout, config);
}

// Show strategy evolution analysis
function showStrategyEvolution() {
    setActiveVisualization('strategy');
    
    if (!gameData) {
        showMessage('strategyPlot', 'Load data first to view strategy evolution');
        return;
    }
    
    console.log('📊 Generating strategy evolution analysis...');
    
    const strategyData = calculateStrategyEvolution();
    createStrategyPlot(strategyData);
    
    visualizationData.strategy = strategyData;
}

// Calculate strategy evolution across phases
function calculateStrategyEvolution() {
    const phases = [
        { phase: 1, name: 'Uniform (1-200)', color: '#2E86AB' },
        { phase: 2, name: 'Light Bias (201-400)', color: '#F18F01' },
        { phase: 3, name: 'Heavy Bias (401-600)', color: '#C73E1D' }
    ];
    
    const strategyData = [];
    
    phases.forEach(phaseInfo => {
        const phaseTrials = gameData.filter(trial => trial.phase === phaseInfo.phase);
        
        if (phaseTrials.length > 0) {
            const choiceFreq = { 'Rock': 0, 'Paper': 0, 'Scissors': 0 };
            const opponentFreq = { 'Rock': 0, 'Paper': 0, 'Scissors': 0 };
            
            phaseTrials.forEach(trial => {
                choiceFreq[trial.playerChoice]++;
                opponentFreq[trial.opponentChoice]++;
            });
            
            // Convert to percentages
            const total = phaseTrials.length;
            Object.keys(choiceFreq).forEach(choice => {
                choiceFreq[choice] = choiceFreq[choice] / total;
                opponentFreq[choice] = opponentFreq[choice] / total;
            });
            
            // Calculate win rate for this phase
            const wins = phaseTrials.filter(trial => trial.outcome === 'win').length;
            const winRate = wins / total;
            
            strategyData.push({
                phase: phaseInfo.phase,
                name: phaseInfo.name,
                color: phaseInfo.color,
                playerChoices: choiceFreq,
                opponentChoices: opponentFreq,
                winRate: winRate,
                totalTrials: total
            });
        }
    });
    
    return strategyData;
}

// Create strategy evolution plot
function createStrategyPlot(strategyData) {
    const choices = ['Rock', 'Paper', 'Scissors'];
    const colors = ['#8E44AD', '#27AE60', '#E74C3C'];
    
    const traces = [];
    
    // Create traces for each choice type
    choices.forEach((choice, index) => {
        const playerTrace = {
            x: strategyData.map(d => d.name),
            y: strategyData.map(d => d.playerChoices[choice]),
            type: 'bar',
            name: `Player ${choice}`,
            marker: { color: colors[index] },
            offsetgroup: 1
        };
        
        const opponentTrace = {
            x: strategyData.map(d => d.name),
            y: strategyData.map(d => d.opponentChoices[choice]),
            type: 'bar',
            name: `Opponent ${choice}`,
            marker: { 
                color: colors[index],
                opacity: 0.6,
                pattern: { shape: '/' }
            },
            offsetgroup: 2
        };
        
        traces.push(playerTrace, opponentTrace);
    });
    
    const layout = {
        title: {
            text: 'Strategy Evolution Across Phases<br><sub>Player vs Opponent choice frequencies</sub>',
            font: { size: 18 }
        },
        xaxis: {
            title: 'Game Phase'
        },
        yaxis: {
            title: 'Choice Frequency',
            tickformat: '.1%',
            range: [0, 1]
        },
        barmode: 'group',
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        legend: {
            x: 0.02,
            y: 0.98
        }
    };
    
    const config = {
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
    };
    
    Plotly.newPlot('strategyPlot', traces, layout, config);
}

// Show model comparison analysis
function showModelComparison() {
    setActiveVisualization('modelComparison');
    
    if (!gameData || !relphModel) {
        showMessage('modelComparisonPlot', 'Run RELPH analysis first to view model comparison');
        return;
    }
    
    console.log('🤖 Generating model comparison analysis...');
    
    const comparisonData = calculateModelComparison();
    createModelComparisonPlot(comparisonData);
    
    visualizationData.modelComparison = comparisonData;
}

// Calculate model vs human comparison data
function calculateModelComparison() {
    // Get model simulation results
    const modelResults = simulateRELPHModel();
    
    if (!modelResults) return null;
    
    // Calculate performance metrics in blocks
    const blockSize = 10;
    const comparisonData = [];
    
    for (let i = 0; i < modelResults.length; i += blockSize) {
        const block = modelResults.slice(i, i + blockSize);
        
        // Human performance in this block
        const humanWins = block.filter(result => result.humanOutcome === 'win').length;
        const humanWinRate = humanWins / block.length;
        
        // Model performance in this block
        const modelWins = block.filter(result => result.modelOutcome === 'win').length;
        const modelWinRate = modelWins / block.length;
        
        // Choice agreement
        const agreementCount = block.filter(result => 
            result.humanChoice === result.modelChoice
        ).length;
        const choiceAgreement = agreementCount / block.length;
        
        comparisonData.push({
            blockNumber: Math.floor(i / blockSize) + 1,
            trialStart: i + 1,
            trialEnd: Math.min(i + blockSize, modelResults.length),
            humanWinRate: humanWinRate,
            modelWinRate: modelWinRate,
            choiceAgreement: choiceAgreement,
            avgHypotheses: block.reduce((sum, r) => sum + r.hypothesesCount, 0) / block.length
        });
    }
    
    return comparisonData;
}

// Create model comparison plot
function createModelComparisonPlot(comparisonData) {
    if (!comparisonData) return;
    
    const humanTrace = {
        x: comparisonData.map(d => d.blockNumber),
        y: comparisonData.map(d => d.humanWinRate),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Human Performance',
        line: { color: '#2E86AB', width: 3 },
        marker: { size: 8 }
    };
    
    const modelTrace = {
        x: comparisonData.map(d => d.blockNumber),
        y: comparisonData.map(d => d.modelWinRate),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'RELPH Model',
        line: { color: '#A23B72', width: 3, dash: 'dash' },
        marker: { size: 8 }
    };
    
    const agreementTrace = {
        x: comparisonData.map(d => d.blockNumber),
        y: comparisonData.map(d => d.choiceAgreement),
        type: 'scatter',
        mode: 'lines',
        name: 'Choice Agreement',
        line: { color: '#F18F01', width: 2 },
        yaxis: 'y2'
    };
    
    const layout = {
        title: {
            text: 'Human vs RELPH Model Performance<br><sub>Comparison of learning curves and choice agreement</sub>',
            font: { size: 18 }
        },
        xaxis: {
            title: 'Block Number (10 trials each)',
            showgrid: true,
            gridcolor: '#E5E5E5'
        },
        yaxis: {
            title: 'Win Rate',
            side: 'left',
            range: [0, 1],
            tickformat: '.1%',
            showgrid: true,
            gridcolor: '#E5E5E5'
        },
        yaxis2: {
            title: 'Choice Agreement',
            side: 'right',
            overlaying: 'y',
            range: [0, 1],
            tickformat: '.1%'
        },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        hovermode: 'x unified',
        legend: {
            x: 0.02,
            y: 0.98
        }
    };
    
    const config = {
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
    };
    
    Plotly.newPlot('modelComparisonPlot', [humanTrace, modelTrace, agreementTrace], layout, config);
}

// Update all visualizations after analysis
function updateVisualizations(results) {
    // Store model results for visualization
    visualizationData.modelResults = results;
    
    // Update the currently active visualization
    switch (currentVisualization) {
        case 'winRate':
            showWinRateAnalysis();
            break;
        case 'exploration':
            showExplorationAnalysis();
            break;
        case 'strategy':
            showStrategyEvolution();
            break;
        case 'modelComparison':
            showModelComparison();
            break;
    }
}

// Set active visualization tab
function setActiveVisualization(vizType) {
    currentVisualization = vizType;
    
    // Update button states
    document.querySelectorAll('.viz-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show corresponding container
    document.querySelectorAll('.viz-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // Activate selected visualization
    switch (vizType) {
        case 'winRate':
            document.querySelector('button[onclick="showWinRateAnalysis()"]').classList.add('active');
            document.getElementById('winRateViz').style.display = 'block';
            break;
        case 'exploration':
            document.querySelector('button[onclick="showExplorationAnalysis()"]').classList.add('active');
            document.getElementById('explorationViz').style.display = 'block';
            break;
        case 'strategy':
            document.querySelector('button[onclick="showStrategyEvolution()"]').classList.add('active');
            document.getElementById('strategyViz').style.display = 'block';
            break;
        case 'modelComparison':
            document.querySelector('button[onclick="showModelComparison()"]').classList.add('active');
            document.getElementById('modelComparisonViz').style.display = 'block';
            break;
    }
}

// Show message in plot area
function showMessage(plotId, message) {
    const layout = {
        title: message,
        xaxis: { visible: false },
        yaxis: { visible: false },
        annotations: [{
            text: message,
            x: 0.5,
            y: 0.5,
            xref: 'paper',
            yref: 'paper',
            showarrow: false,
            font: { size: 16 }
        }],
        plot_bgcolor: 'white',
        paper_bgcolor: 'white'
    };
    
    Plotly.newPlot(plotId, [], layout, { displayModeBar: false });
} 