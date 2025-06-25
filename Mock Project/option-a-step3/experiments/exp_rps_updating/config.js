// Config parameters for exp_rps_updating
// Change values here – no need to edit rps.js

export const OPPONENT_ALGO = "wsls"; // "wsls" | "qlearn" | "bayes"
export const N_ROUNDS = 150;
export const FEEDBACK_GRANULARITY = "immediate"; // "immediate" | "block" 

// Step 3: Basic Deployment Configuration
// These parameters will be used in later steps for full experiment implementation

export const EXPERIMENT_CONFIG = {
    step: 3,
    name: "Basic Deployment Test",
    description: "Console logging verification for Rock-Paper-Scissors interactions",
    
    // Future parameters for Step 4 & 5
    github_api: {
        enabled: false, // Will be true in Step 4
        repo_owner: "YOUR_GITHUB_USERNAME",
        repo_name: "YOUR_REPO_NAME"
    },
    
    experiment_params: {
        n_rounds: 150,
        opponent_algo: "wsls", // "wsls" | "qlearn" | "bayes"
        feedback_granularity: "immediate" // "immediate" | "block"
    }
}; 