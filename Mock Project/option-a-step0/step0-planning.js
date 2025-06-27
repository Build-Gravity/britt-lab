// Step 0: Research & Planning Logic

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Step 0: Research & Planning initialized');
    
    // Load any saved study choice from localStorage
    loadStudyChoice();
    
    // Add event listener to the save button
    const saveBtn = document.getElementById('save-study-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveStudyChoice);
    }
});

function saveStudyChoice() {
    // 1. Get data from the form
    const studyChoice = {
        citation: document.getElementById('citation').value,
        researchQuestion: document.getElementById('research-question').value,
        adaptation: document.getElementById('adaptation').value,
        keyVariables: document.getElementById('key-variables').value,
        personalInterest: document.getElementById('personal-interest').value,
        researchPredictions: document.getElementById('research-predictions').value,
        timestamp: new Date().toISOString()
    };

    // 2. Validate required fields
    if (!studyChoice.citation || !studyChoice.researchQuestion) {
        showStatus('⚠️ Please fill in at least the citation and research question.', 'error');
        return;
    }

    // 3. Save to localStorage for future reference
    localStorage.setItem('chosenStudy', JSON.stringify(studyChoice));

    // 4. Generate and download markdown file
    const markdownContent = createStudyMarkdown(studyChoice);
    downloadMarkdownFile(markdownContent, 'my-study-reference.md');

    // 5. Update UI
    showStatus('✅ Study choice saved! Your `my-study-reference.md` file is downloading.', 'success');
    
    // 6. Show post-save suggestions
    const postSaveSuggestions = document.getElementById('post-save-suggestions');
    if (postSaveSuggestions) {
        postSaveSuggestions.style.display = 'block';
    }
    
    // Activate next step button
    const nextBtn = document.getElementById('next-step-btn');
    if (nextBtn) {
        nextBtn.classList.remove('disabled');
        nextBtn.href = '../option-a-step1/index.html';
    }
}

function loadStudyChoice() {
    const savedStudyJSON = localStorage.getItem('chosenStudy');
    if (savedStudyJSON) {
        try {
            const savedStudy = JSON.parse(savedStudyJSON);
            document.getElementById('citation').value = savedStudy.citation || '';
            document.getElementById('research-question').value = savedStudy.researchQuestion || '';
            document.getElementById('adaptation').value = savedStudy.adaptation || '';
            
            // Handle new fields with backward compatibility
            if (document.getElementById('key-variables')) {
                document.getElementById('key-variables').value = savedStudy.keyVariables || '';
            }
            if (document.getElementById('personal-interest')) {
                document.getElementById('personal-interest').value = savedStudy.personalInterest || '';
            }
            if (document.getElementById('research-predictions')) {
                document.getElementById('research-predictions').value = savedStudy.researchPredictions || '';
            }

            showStatus('📝 Previous study choice loaded from your browser.', 'success');
            
            // Show post-save suggestions if study was saved
            if (savedStudy.citation && savedStudy.researchQuestion) {
                const postSaveSuggestions = document.getElementById('post-save-suggestions');
                if (postSaveSuggestions) {
                    postSaveSuggestions.style.display = 'block';
                }
                
                // Activate next step button
                const nextBtn = document.getElementById('next-step-btn');
                if (nextBtn) {
                    nextBtn.classList.remove('disabled');
                    nextBtn.href = '../option-a-step1/index.html';
                }
            }
        } catch (e) {
            console.error("Failed to load saved study", e);
            localStorage.removeItem('chosenStudy'); // Clear corrupted data
        }
    }
}

function createStudyMarkdown(studyChoice) {
    return `# My Study Reference

## Citation
${studyChoice.citation}

## Research Question
${studyChoice.researchQuestion}

## Our Adaptation
${studyChoice.adaptation}

## Key Variables to Measure
${studyChoice.keyVariables || 'Not specified'}

## Why This Study Interests Me
${studyChoice.personalInterest || 'Not specified'}

## My Predictions & Hypotheses
${studyChoice.researchPredictions || 'Not specified'}

## Tech Stack
Web Experiments (HTML/CSS/JavaScript + GitHub Pages)

---
*Reference created on ${new Date(studyChoice.timestamp).toLocaleDateString()}*
    `.trim();
}

function downloadMarkdownFile(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// AI-assisted prompt functions
function copyResearchPrompt() {
    const promptText = `I'm looking for psychology experiments I could adapt into a 5-minute web-based study. Please find 3-5 studies on [YOUR TOPIC].

For each study, provide:
1. Full citation (authors, year, title, journal)
2. The core research question
3. A summary of the participant's task
4. The key finding

Present the results in a table.`;

    navigator.clipboard.writeText(promptText).then(() => {
        showStatus('📋 Research prompt copied! Paste this into your AI assistant.', 'success');
    }).catch(() => {
        showStatus('❌ Copy failed. Please select and copy the text manually.', 'error');
    });
}

function showStatus(message, type = 'success') {
    const statusEl = document.getElementById('form-status');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = `status-message ${type}`;
        statusEl.style.display = 'block';

        setTimeout(() => {
            if(statusEl) statusEl.style.display = 'none';
        }, 5000);
    }
} 