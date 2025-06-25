# Build Your Own Psychology Experiment

## Overview
Learn to code by building psychology experiments. This guide walks you through creating interactive experiments that run in web browsers, collect real data, and help answer questions about how minds work.

**Approach:** We'll implement each option ourselves as we document, ensuring Cursor has complete context and working examples.

---

## Step 1: Find Your Research Inspiration

### Goal
Find research that interests you and understand what makes experiments effective. Look at how computational methods can help answer psychology questions.

### 1.1 Research Approaches
Conduct thorough background research using multiple approaches:

**Quick Option - Deep Research (Gemini, GPT, ect):**
- See @Deep Research/gemini-dr-anderson-research.md for an example prompt
- Work on your own prompt based on your research interests

**Additional Research Sources:**
- Academic databases (Google Scholar, PsycINFO)
- University of Waterloo faculty pages and recent course syllabi  
- Collaborative research networks and lab websites

**Research Goals:**
Look for experiments that seem particularly clever or insightful, and figure out what makes them effective.

### 1.2 Research Analysis
After running the Gemini prompt, analyze the results to identify:
- **Primary research themes** that could inspire experiment topics
- **Methodological preferences** that should guide your architecture choice
- **Theoretical gaps** that present opportunities for novel contributions
- **Complexity level** appropriate for your audience

### 1.3 Documentation
**Document your research findings:**
- Add your research results to @Deep Research/
- Focus on actionable insights that will guide your experiment design
- Reference your research file in future discussions using the @ symbol

**Key Questions to Answer:**
- What methodological approaches seem most effective?
- Which research questions could benefit from computational tools?
- What would make your experiment both interesting and feasible?
- How can you balance ambition with practical constraints?

## Step 2: Choose Your Tech Stack 🔄

### Goal
Choose the right tools for your project. Set up everything you need to build, deploy, and share your experiment.

### Architecture Options (with Implementation)

#### **Option A: Web Experiments (GitHub Pages)**
- **What you get:** Experiments that run in any browser
- **Tech:** HTML/CSS/JavaScript + GitHub Pages hosting
- **Advantages:** No installation required, easy to share via link
- **Data collection:** Results automatically save to your GitHub repository
- **Best for:** Online experiments, easy participant recruitment, broad accessibility
  
  **Quick GitHub Pages How-To (First Run)**
  1. Push your repository to the `main` branch (keep the default structure).
  2. In **Repo → Settings → Pages**, set:
      • Source = `main` branch  
      • Folder = `/root` (or `/docs` if you move files there)
  3. Save – GitHub builds the page and gives you a URL like `https://<username>.github.io/<repo>/`.
  4. Visit the URL – you'll see a landing page with step-by-step options.
  5. Start with Step 3 to verify basic deployment works, then progress through the steps.

- **Documentation Needs:**
  - PsychoPy.js complete API documentation 
  - GitHub REST API authentication setup
  - GitHub Pages deployment workflow
  - Example experiment templates with data collection
- **Bold Factor:** Zero-installation experiments with automated data collection to GitHub

#### **Option B: Research Environment (Jupyter + Python)**
- **What you get:** Complete research workflow in one place
- **Tech:** Python + Jupyter notebooks + statistical libraries
- **Advantages:** Publication-ready graphs, advanced statistical analysis
- **Data collection:** Local files with comprehensive analysis capabilities
- **Best for:** In-depth analysis, learning Python, building research skills

### Cursor Documentation Strategy
**For each option, we'll create:**
1. **Complete setup instructions** with screenshots
2. **Working code examples** that run immediately
3. **Library documentation** copied/referenced locally
4. **Troubleshooting guides** with common issues
5. **Extension templates** for different experiment types

### Implementation Priority
- **Option A** leverages GitHub ecosystem extensively (Pages + REST API)
- **Option B** focuses on traditional psychology research workflow
- Both will use **PsychoPy** as the core experiment library

### Next Steps
1. **Fork this repository** to your own GitHub account
2. **Enable GitHub Pages** (see quick guide above) to deploy your experiments
3. **Start with Step 3** - Navigate to `Mock Project/option-a-step3/` to verify basic deployment
4. **Progress to Step 4** - Add automated data collection with GitHub API integration
5. **Experiment and modify** - Tweak parameters and document your changes

---

## What Makes a Great Experiment 🎯

### Your End Goal
Create experiments that generate meaningful insights about how minds work.

#### **What You're Aiming For**
1. **Focus on a Specific Question** - Choose something concrete and testable (like "Do people learn patterns without awareness?")
2. **Make Clear Predictions** - Develop testable hypotheses rather than vague ideas
3. **Collect Meaningful Data** - Gather enough information to compare different explanations

#### **How to Design Your Experiment**
1. **Create the Task**  
   • What do people actually *do* in your experiment?  
   • What will you change between conditions?  
   • What will you measure? (reaction time, accuracy, choices, confidence)
2. **Keep It Manageable**  
   • 5-10 minutes max - people get bored!  
   • Practice trials → main experiment → quick debrief
3. **Plan Your Data**  
   • Basic stuff: trial number, what you manipulated, what they did, how long it took  
   • Bonus points: confidence ratings, strategy questions, follow-up interviews
4. **Think About Analysis**  
   • What graph would show your main result?  
   • What statistical test would convince a skeptic?
   • Can you fit a simple model to the data?

#### **Code Like a Pro**
- **Make it tweakable** - Put all your settings in config files so you can easily change things
- **Document everything** - Future you will thank present you
- **Make it shareable** - Others should be able to run your code and get the same results
- **Build for expansion** - Make it easy to add new conditions or adapt for different questions

---

## Step 3: Get Something Working ⚙️

### Goal
Get your first experiment working. Start simple and build up:
1. Deploy your code successfully (web or local)
2. Verify that user interactions work and log data
3. Establish the foundation for more complex features

### Practical Tasks for Step 3

#### **Option A: GitHub Pages Deployment**
1. **Enable GitHub Pages**
   - Push your `option-a-step3` folder to `main` branch
   - Repo Settings → Pages → Source: `main` branch, folder: `/root`
   - Note your GitHub Pages URL (e.g., `https://username.github.io/repo-name/`)

2. **Test Basic Functionality**
   - Visit your GitHub Pages URL → Navigate to `Mock Project/option-a-step3/`
   - Open browser developer tools (F12 → Console)
   - Click the Rock/Paper/Scissors buttons
   - Verify structured data logs to console
   - Check that status updates show on screen

3. **Verify File Structure**
   ```
   option-a-step3/
   ├── index.html (main page with buttons)
   ├── styles.css (extracted styling)
   └── experiments/exp_rps_updating/
       ├── rps.js (console logging function)
       └── config.js (basic parameters)
   ```

#### **Option B: Local Jupyter Setup**
1. **Environment Setup**
   - Install Python, Jupyter Lab, PsychoPy
   - Navigate to `option-b-jupyter/` directory
   - Launch Jupyter Lab

2. **Test Basic Functionality**
   - Open and run starter notebook
   - Verify plots generate correctly
   - Test basic PsychoPy stimulus presentation

### Current Implementation Status
We provide **exp_rps_updating** as a minimal working example:
- **Option A**: Simple button clicks that log to browser console
- **Option B**: Basic Python script with analysis notebook

### Deliverables for Step 3
- **Working deployment** (GitHub Pages live URL or local Jupyter environment)
- **Verified logging** (console output shows structured data)
- **Clean file organization** (CSS extracted, clear folder structure)

---

## Step 4: Data Collection & Analysis Implementation 📊

### Goal
Transform your experiment from a testing prototype into a data-collecting research tool. Add automated data saving so every participant interaction creates permanent, analyzable records.

### Practical Tasks for Step 4

#### **Option A: GitHub REST API Integration**
1. **Setup GitHub Personal Access Token**
   - Go to GitHub → Settings → Developer Settings → Personal Access Tokens
   - Generate new token (classic) with 'repo' scope
   - Copy token for use in experiment configuration

2. **Configure Data Collection**
   - Navigate to `Mock Project/option-a-step4/`
   - Enter your GitHub token, username, and repository name
   - Test connection to verify API access

3. **Test Automated Data Saving**
   - Click experiment choices to generate data
   - Verify files appear in your repository's `data/` folder
   - Check that each session creates unique, timestamped files

4. **File Structure for Step 4**
   ```
   option-a-step4/
   ├── index.html (setup form + experiment interface)
   ├── styles.css (enhanced styling with forms)
   └── experiments/exp_rps_updating/
       ├── github-api.js (GitHub REST API integration)
       ├── rps-step4.js (main experiment with data saving)
       └── config.js (API configuration)
   ```

#### **What's New in Step 4**
- **GitHub API Integration**: Automatic file creation in your repository
- **Structured Data Format**: JSON files ready for analysis
- **Session Management**: Unique identifiers for each participant
- **Real-time Feedback**: Visual confirmation of successful data saves
- **Error Handling**: Graceful fallbacks when network issues occur

#### **Sample Data Output**
Each experiment session creates a JSON file like:
```json
{
  "metadata": {
    "step": 4,
    "experiment": "Rock-Paper-Scissors Data Collection",
    "sessionId": "session_2024-01-15T10-30-45_abc123",
    "startTime": "2024-01-15T10:30:45.123Z",
    "participantId": "participant_1705312245123"
  },
  "trials": [
    {
      "trial": 1,
      "timestamp": "2024-01-15T10:30:47.456Z",
      "playerChoice": "Rock",
      "reactionTime": null,
      "metadata": {
        "userAgent": "Mozilla/5.0...",
        "screenSize": "1920x1080",
        "viewportSize": "1200x800"
      }
    }
  ]
}
```

## Step 5: Testing & Documentation Finalization
*[Complete working examples with full documentation]*

---

## Implementation Notes
When building and documenting experiments *with Cursor* keep these high-level practices in mind:
1. **Visual First:** Prioritise quick, interactive visuals (plots, animations, dashboards) so you can instantly verify logic and show results to others.
2. **Scaffolded Code:** Start from the smallest runnable example, then iteratively add complexity. Make the parameters (probabilities, learning rates, trial counts) easy to tweak.
3. **Notebook-Centred Analysis:** Perform all stats and plotting inside Jupyter notebooks so the code, results, and narrative stay together.
4. **GitHub-First Workflow:** Commit early and often, deploy demos via GitHub Pages when possible, and (if web-based) POST data back to the repo using the GitHub REST API. This keeps everything transparent and reproducible.
5. **Theory Link:** Every README should state *which cognitive mechanism* the task targets and, ideally, reference a simple computational model. This keeps the focus on mechanistic clarity.

Cursor will maintain context across these files, so reference assets with the `@` symbol (e.g., @Deep Research/gemini-dr-anderson-research.md) and keep instructions succinct.