# Psychology Experiment Development Instructions

## Overview
Step-by-step methodology for creating an engaging psychology experiment targeting Dr. Britt Anderson's interests. Designed for non-technical psychology students in university tech courses with ambitious research goals.

**Approach:** We'll implement each option ourselves as we document, ensuring Cursor has complete context and working examples.

---

## Step 1: Research Target Interests 

### Goal
Understand Dr. Britt Anderson's research interests, methodological preferences, and current work to design an experiment that genuinely aligns with his academic focus.

### 1.1 Research Approaches
Conduct thorough background research using multiple approaches:

**Quick Option - Deep Research (Gemini, GPT, ect):**
- See @Deep Research/gemini-dr-anderson-research.md for an example prompt
- Work on your own prompt based on your research interests

**Additional Research Sources:**
- Academic databases (Google Scholar, PsycINFO)
- University of Waterloo faculty pages and recent course syllabi  
- Recent conference presentations or keynotes
- Collaborative research networks and lab websites
- Social media/academic Twitter for current interests and opinions

**Research Goals:**
Focus on understanding his methodological preferences and theoretical positions to guide both experiment design and architecture choice.

### 1.2 Research Analysis
After running the Gemini prompt, analyze the results to identify:
- **Primary research themes** that could inspire experiment topics
- **Methodological preferences** that should guide your architecture choice
- **Theoretical gaps** that present opportunities for novel contributions
- **Complexity level** that matches his expectations

### 1.3 Documentation
**Document your research findings:**
- Add your research results to @Deep Research/
- Focus on actionable insights that will guide your experiment design
- Reference your research file in future discussions using the @ symbol

**Key Questions to Answer:**
- What methodological approaches does Dr. Anderson prefer?
- Which research themes align with current psychology trends?
- What gaps exist that your experiment could address?
- How complex should your implementation be to match his expectations?

## Step 2: Architecture & Documentation Setup 🔄

### Goal
Choose experimental architecture, implement it ourselves, and ensure all documentation/libraries are accessible to Cursor.

### Architecture Options (with Implementation)

#### **Option A: GitHub Pages Psychology Experiment**
- **Stack:** HTML/CSS/JavaScript frontend + PsychoPy.js + GitHub REST API
- **Deployment:** GitHub Pages (automatic hosting)
- **Data Storage:** GitHub REST API to store results back to repo as JSON/CSV
- **Visualization:** PsychoPy.js for experiments + Chart.js for results
- **Implementation Plan:**
  - Create experiment using PsychoPy.js (web-compatible)
  - Deploy to GitHub Pages for universal access
  - Use [GitHub REST API](https://docs.github.com/en/rest?apiVersion=2022-11-28) to POST experiment data back to repo
  - Real-time results dashboard pulling from repo data
  
  **Quick GitHub Pages How-To (First Run)**
  1. Push your `option-a-github-pages` folder to the `main` branch (keep the default structure).
  2. In **Repo → Settings → Pages**, set:
      • Source = `main` branch  
      • Folder = `/root` (or `/docs` if you move files there)
  3. Save – GitHub builds the page and gives you a URL like `https://<username>.github.io/<repo>/`.
  4. Visit the URL – you'll see a landing page with project options. Click "Launch Web Experiment" to navigate to your Option A implementation.
  5. You should see Rock/Paper/Scissors buttons that log to console. That means the basics are working. Visual dashboards can be added later.

- **Documentation Needs:**
  - PsychoPy.js complete API documentation 
  - GitHub REST API authentication setup
  - GitHub Pages deployment workflow
  - Example experiment templates with data collection
- **Bold Factor:** Zero-installation experiments with automated data collection to GitHub

#### **Option B: Jupyter + PsychoPy Research Environment**
- **Stack:** Jupyter Lab + Python (PsychoPy, pandas, matplotlib, seaborn)
- **Deployment:** Local/cloud Jupyter server
- **Data Storage:** Local files + GitHub integration for sharing
- **Visualization:** PsychoPy for experiments + publication-ready analysis plots
- **Implementation Plan:**
  - Create PsychoPy experiment scripts
  - Jupyter notebooks for data analysis and visualization
  - Templates for common psychology paradigms
  - Integration with GitHub for version control and sharing
- **Documentation Needs:**
  - Complete PsychoPy Python API documentation
  - Jupyter Lab setup and extension guides
  - Statistical analysis templates for psychology
  - GitHub integration workflows
- **Bold Factor:** Professional-grade analysis pipelines with publication-ready outputs

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
1. Fork or clone this repository to your own GitHub account/computer.
2. Decide which architecture template you want to try first.
   - **Option A:** Enable GitHub Pages (see quick guide above) and visit the published URL to ensure the basic prompt appears. (Skip visualisation for now.)
   - **Option B:** Launch JupyterLab, open `option-b-jupyter/starter.ipynb`, and run the cells to generate a basic dataset and plot.
3. Commit and push your first working demo (even if unchanged) so you have a restore point.
4. Tweak task parameters (probabilities, trial counts, learning rates) and rerun; visualise the effect in the provided analysis notebook or dashboard.
5. Document what you changed (and what happened) in a short `YOURNAME_notes.md` file inside your experiment folder and push the update.

---

## Our Experiment Design Goals 🎯

### Long-Term Vision
When fully implemented, your experiment should achieve these theoretical and practical goals:

#### **Theoretical Goals**
1. **Target a Specific Cognitive Mechanism** - Focus on one clear process identified in your research (e.g., probability learning, belief updating, attention vs. statistical learning)
2. **Generate Mechanistic Hypotheses** - Move beyond vague labels to testable predictions about *how* the mind works
3. **Enable Model Comparison** - Collect data rich enough to distinguish between competing computational accounts

#### **Experimental Design Framework**
1. **Define the Paradigm**  
   • What is the task? What are participants asked to do every trial?  
   • Which independent variables will you manipulate? (probability bias, feedback type, etc.)  
   • What dependent variables will you record? (accuracy, RT, confidence, choice patterns)
2. **Sketch the Timeline**  
   • Practice block → main blocks → debrief  
   • Roughly 5–10 min per participant keeps things manageable
3. **Plan Data Structure**  
   • At minimum: trial number, IV levels, participant response, RT  
   • Consider: confidence ratings, strategy reports, demographic info
4. **Design Analysis Pipeline**  
   • One meaningful plot (e.g., learning curve, error distribution)  
   • Statistical tests that directly address your theoretical question
   • Computational model fits (even simple ones)

#### **Implementation Standards**
- **Modular Code** - Keep stimulus parameters in config files for easy tweaking
- **Clear Documentation** - READMEs that explain the paradigm and key parameters
- **Reproducible** - Others can run your exact experiment and analysis
- **Extensible** - Easy to add conditions, change parameters, or adapt for new questions

---

## Step 3: Basic Deployment & Console Logging ⚙️

### Goal
Get your chosen architecture working end-to-end with minimal functionality:
1. Deploy successfully to GitHub Pages (Option A) or run locally (Option B)
2. Verify basic user interaction and data logging works
3. Establish the foundation for adding full experiment logic later

### Practical Tasks for Step 3

#### **Option A: GitHub Pages Deployment**
1. **Enable GitHub Pages**
   - Push your `option-a-github-pages` folder to `main` branch
   - Repo Settings → Pages → Source: `main` branch, folder: `/root`
   - Note your GitHub Pages URL (e.g., `https://username.github.io/repo-name/`)

2. **Test Basic Functionality**
   - Visit your GitHub Pages URL
   - Open browser developer tools (F12 → Console)
   - Click the Rock/Paper/Scissors buttons
   - Verify structured data logs to console
   - Check that status updates show on screen

3. **Verify File Structure**
   ```
   option-a-github-pages/
   ├── index.html (main page with buttons)
   ├── styles.css (extracted styling)
   └── experiments/exp_rps_updating/
       ├── rps.js (minimal logging function)
       └── config.js (for future parameters)
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

## Step 4: Data Collection & Analysis Implementation
*[GitHub REST API integration OR local analysis pipeline]*

## Step 5: Testing & Documentation Finalization
*[Complete working examples with full documentation]*

---

## Implementation Notes
When building and documenting experiments *with Cursor* keep these high-level practices in mind:
1. **Visual First:** Prioritise quick, interactive visuals (plots, animations, dashboards) so you can instantly verify logic and show results to others.
2. **Scaffolded Code:** Start from the smallest runnable example, then iteratively add complexity. Make the parameters (probabilities, learning rates, trial counts) easy to tweak.
3. **Notebook-Centred Analysis:** Perform all stats and plotting inside Jupyter notebooks so the code, results, and narrative stay together.
4. **GitHub-First Workflow:** Commit early and often, deploy demos via GitHub Pages when possible, and (if web-based) POST data back to the repo using the GitHub REST API. This keeps everything transparent and reproducible.
5. **Theory Link:** Every README should state *which cognitive mechanism* the task targets and, ideally, reference a simple computational model. This mirrors Dr. Anderson's emphasis on mechanistic clarity.

Cursor will maintain context across these files, so reference assets with the `@` symbol (e.g., @Deep Research/gemini-dr-anderson-research.md) and keep instructions succinct.