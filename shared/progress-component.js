// Progress Bar Component
class ProgressBar {
    constructor(currentStep) {
        this.currentStep = currentStep;
        this.steps = [
            { number: 0, title: 'Step 0', url: '../option-a-step0/index.html' },
            { number: 1, title: 'Step 1', url: '../option-a-step1/index.html' },
            { number: 2, title: 'Step 2', url: '../option-a-step2/index.html' },
            { number: 3, title: 'Step 3', url: '../option-a-step3/index.html' },
            { number: 4, title: 'Step 4', url: '../option-a-step4/index.html' },
            { number: 5, title: 'Step 5', url: '../option-a-step5/index.html' },
            { number: 6, title: 'Step 6', url: '../option-a-step6/index.html' },
            { number: 7, title: 'Step 7', url: '../option-a-step7/index.html' }
        ];
    }

    render() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-bar';

        this.steps.forEach(step => {
            const stepElement = document.createElement('div');
            stepElement.className = 'progress-step';
            stepElement.textContent = step.title;

            // Add appropriate classes based on step status
            if (step.number < this.currentStep) {
                stepElement.classList.add('completed');
            } else if (step.number === this.currentStep) {
                stepElement.classList.add('active');
            }

            // Make step clickable if it's not the current step
            if (step.number !== this.currentStep) {
                stepElement.classList.add('clickable');
                stepElement.addEventListener('click', () => {
                    window.location.href = step.url;
                });
            }

            progressContainer.appendChild(stepElement);
        });

        return progressContainer;
    }

    // Static method to easily insert progress bar into any page
    static insertInto(containerId, currentStep) {
        const container = document.getElementById(containerId);
        if (container) {
            const progressBar = new ProgressBar(currentStep);
            container.appendChild(progressBar.render());
        }
    }
}

// Auto-initialize if progress-container exists
document.addEventListener('DOMContentLoaded', function() {
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer && typeof window.currentStep === 'number') {
        ProgressBar.insertInto('progress-container', window.currentStep);
    }
}); 