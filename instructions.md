# Build Your Own Psychology Experiment

## Overview
Learn to code by building psychology experiments. This guide walks you through creating interactive experiments that run in web browsers, collect real data, and help answer questions about how minds work.

---

## **Phase 1: Deep Research & Study Selection**

### **Goal:**
Find a psychology study that interests you and can be adapted into a web-based experiment.

### **1.1: Use AI for Deep Research**
Modern AI assistants (like Gemini, Claude 3, and ChatGPT-4) have powerful built-in research capabilities. Instead of just asking for ideas, have them perform the research for you.

**Action:** Use your preferred AI assistant to find 3-5 potential studies.

> **Example Prompt:**
>
> "Search for recent (2018+) psychology experiments on [Your Topic, e.g., 'decision-making biases']. Find studies that could be adapted into a 5-minute web experiment.
>
> For each study, provide:
> 1.  A link to the original paper.
> 2.  The full author list and publication year.
> 3.  The core research question.
> 4.  A brief summary of the task participants performed.
> 5.  The key finding.
>
> Present the results in a table for easy comparison."

**Your Goal:** Find one study that seems both interesting and feasible to build. Download the PDF of the paper to read through it.

---

## **Phase 2: Save Your Plan & Choose Your Tools**

### **Goal:**
Document your chosen study and decide on your technical approach.

### **2.1: Save Your Study Reference**
Go to **[Step 0: Find Your Research Inspiration](../Mock%20Project/option-a-step0/index.html)** to use our planning tool.

1.  **Fill out the form** with the details of the study you chose.
2.  **Click "Save Study Choice."** This will generate and download a markdown file named `my-study-reference.md`.
3.  **Save this file** at the root of your project folder. In a later step, we will add this file to your GitHub repository so you have a permanent record of your project's inspiration.

> **Adaptation Guidance:**
> How do you adapt a complex academic study into a simple web experiment? We're writing a detailed guide on this. [*Link to detailed explanation coming soon.*]

### **2.2: Choose Your Tech Stack**
For this tutorial, we will focus on building experiments that run in the browser.

*   **Option A: Web Experiments (HTML, CSS, JavaScript)**
    *   **What you get:** Experiments that run in any browser, are easy to share, and can be hosted for free on GitHub Pages.
    *   **This is the path we will follow for this tutorial.**

*   **Option B: Python & Quarto**
    *   **What you get:** A powerful environment for creating reproducible research documents that combine code, analysis, and text.
    *   ***Tutorial for this option coming soon.***

---

## **Our Example: A Rock-Paper-Scissors Study**
To demonstrate the process, we chose the following study as our inspiration.

*   **Study Reference:**
    *   Mohammadi Sepahvand, N., Stöttinger, E., Danckert, J., & Anderson, B. (2014). Sequential decisions: A computational comparison of observational and reinforcement accounts. *PLoS ONE, 9*(4), e94308.
*   **Research Question:**
    *   How do people learn to predict an opponent's strategy in sequential decision games?
*   **Our Adaptation:**
    *   Build a web-based Rock-Paper-Scissors game where participants play against an AI that learns their patterns. We will measure how the participant's strategy changes over time.

---

## Next Steps

Now that you have your research inspiration, you're ready to start building. Follow the steps in order to go from a blank folder to a fully functional online experiment. Each step has its own folder in the `Mock Project/` directory and contains all the instructions you need.

1.  **[Step 1: Environment Setup](../Mock%20Project/option-a-step1/index.html)**: Install the tools you'll need.
2.  **[Step 2: Repository Setup](../Mock%20Project/option-a-step2/index.html)**: Create a place for your code to live.
3.  **[Step 3: Basic Deployment](../Mock%20Project/option-a-step3/index.html)**: Get your first interactive elements working.
4.  **[Step 4: Data Collection](../Mock%20Project/option-a-step4/index.html)**: Save the data your experiment generates.
5.  **[Step 5: Experimental Design](../Mock%20Project/option-a-step5/index.html)**: Configure and parameterize your experiment.
6.  **[Step 6: Interactive Elements](../Mock%20Project/option-a-step6/index.html)**: Add adaptive AI or other complex interactions.
7.  **[Step 7: Analysis & Visualization](../Mock%20Project/option-a-step7/index.html)**: Analyze your collected data and create publication-ready visualizations.

### Step 6: Running the Experiment & Exporting Data

In this step, the participant runs the full experiment. The experiment uses the configuration from Step 5 and the AI opponent from Step 6.

**Participant Experience:**
1.  The participant plays the Rock-Paper-Scissors game for the configured number of rounds.
2.  The AI learns from the participant's moves and adapts its strategy.
3.  When the experiment is complete, a summary of the results is displayed.
4.  The participant is prompted to export their data. Clicking "Export Data" downloads a JSON file (e.g., `rps-experiment-data-2023-10-27T12-00-00-000Z.json`).
5.  The participant can then send this file to the researcher.
6.  If needed, the participant can click "Run Another Trial" to reset the experiment and generate another data file.

### Step 7: Analyzing the Data

This step is for the researcher. It provides a tool to analyze the data collected from one or more participants.

**Researcher Experience:**
1.  The researcher opens the Step 7 page.
2.  They click "Choose Data Files" and select all the JSON files received from participants.
3.  They click "Load Data". The application reads all the files, combines the data, and displays an overview of the combined dataset (total trials, win rates, etc.).
4.  The researcher then clicks "Run RELPH Analysis".
5.  The application runs the RELPH model on the combined data and displays the results, including visualizations and model fit statistics. This replicates the analysis from the Anderson et al. (2014) study.

This workflow allows for a clear separation between the participant's task (data generation) and the researcher's task (data analysis), and it provides a simple way to aggregate and analyze data from multiple participants. 