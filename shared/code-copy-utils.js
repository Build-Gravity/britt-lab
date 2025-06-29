/**
 * Code Copy Utilities for Psychology Experiment Course
 * Provides consistent copy-to-clipboard functionality across all steps
 */

/**
 * Initialize copy functionality for all code blocks on the page
 * This should be called after the DOM loads
 */
function initializeCodeCopy() {
    // Find all code blocks and enhance them
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach((block, index) => {
        enhanceCodeBlock(block, index);
    });
}

/**
 * Enhance a single code block with copy functionality
 * @param {HTMLElement} codeBlock - The code block element to enhance
 * @param {number} index - Index for unique identification
 */
function enhanceCodeBlock(codeBlock, index) {
    // Skip if already enhanced
    if (codeBlock.classList.contains('enhanced')) {
        return;
    }
    
    const codeElement = codeBlock.querySelector('code');
    if (!codeElement) {
        return;
    }
    
    // Get the raw text content - prefer data-copy-text attribute if available
    const codeText = codeBlock.dataset.copyText || codeElement.textContent || codeElement.innerText;
    
    // Detect language for styling (optional)
    const language = detectLanguage(codeText);
    if (language) {
        codeBlock.classList.add(`language-${language}`);
    }
    
    // Determine if this is a simple block or needs a header
    const needsHeader = codeText.length > 100 || codeText.includes('\n');
    
    if (needsHeader) {
        // Restructure with header and content wrapper
        codeBlock.classList.add('has-header');
        
        // Create header
        const header = document.createElement('div');
        header.className = 'code-header';
        
        const label = document.createElement('span');
        label.textContent = language ? language.toUpperCase() : 'CODE';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = '📋 Copy';
        copyBtn.onclick = () => copyCodeToClipboard(codeText, copyBtn);
        
        header.appendChild(label);
        header.appendChild(copyBtn);
        
        // Create content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'code-content';
        contentWrapper.appendChild(codeElement);
        
        // Clear and rebuild
        codeBlock.innerHTML = '';
        codeBlock.appendChild(header);
        codeBlock.appendChild(contentWrapper);
    } else {
        // Simple block - add always-visible copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn simple-copy';
        copyBtn.textContent = '📋';
        copyBtn.title = 'Copy code';
        copyBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 10;
        `;
        copyBtn.onclick = () => copyCodeToClipboard(codeText, copyBtn);
        
        codeBlock.appendChild(copyBtn);
        codeBlock.style.position = 'relative';
    }
    
    codeBlock.classList.add('enhanced');
}

/**
 * Copy code text to clipboard
 * @param {string} text - The text to copy
 * @param {HTMLElement} button - The button that was clicked
 */
async function copyCodeToClipboard(text, button) {
    try {
        // Use modern clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            fallbackCopyToClipboard(text);
        }
        
        // Show success feedback
        showCopySuccess(button);
        
    } catch (err) {
        console.error('Failed to copy code:', err);
        showCopyError(button);
    }
}

/**
 * Fallback copy method for older browsers
 * @param {string} text - The text to copy
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy failed:', err);
        throw err;
    }
    
    document.body.removeChild(textArea);
}

/**
 * Show success feedback when copy succeeds
 * @param {HTMLElement} button - The copy button
 */
function showCopySuccess(button) {
    if (!button) return;
    const originalText = button.textContent;
    button.textContent = '✅ Copied!';
    button.classList.add('copied');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
    }, 2000);
}

/**
 * Show error feedback when copy fails
 * @param {HTMLElement} button - The copy button
 */
function showCopyError(button) {
    if (!button) return;
    const originalText = button.textContent;
    button.textContent = '❌ Error';
    button.style.backgroundColor = '#dc3545';
    button.style.borderColor = '#dc3545';
    button.style.color = 'white';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.style.borderColor = '';
        button.style.color = '';
    }, 2000);
}

/**
 * Copy text from a prompt block to clipboard.
 * This is called from an inline `onclick` attribute in the HTML.
 * @param {string} elementId - The ID of the element containing the prompt text.
 */
async function copyPrompt(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID '${elementId}' not found.`);
        return;
    }

    const text = element.innerText;

    // Find the button that triggered this copy action to provide user feedback.
    // This is a workaround since we can't easily pass the button element from the onclick attribute
    // without modifying a large number of HTML files.
    const buttons = document.querySelectorAll('.prompt-copy-btn');
    const button = Array.from(buttons).find(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        return onclickAttr && onclickAttr.includes(`'${elementId}'`);
    });

    await copyCodeToClipboard(text, button);
}

/**
 * Detect programming language from code content
 * @param {string} code - The code text
 * @returns {string|null} - The detected language or null
 */
function detectLanguage(code) {
    // Simple language detection based on common patterns
    if (code.includes('<!DOCTYPE html>') || code.includes('<html')) {
        return 'html';
    }
    if (code.includes('function ') || code.includes('const ') || code.includes('let ') || code.includes('var ')) {
        return 'javascript';
    }
    if (code.startsWith('{') && code.includes('"')) {
        return 'json';
    }
    if (code.includes('{') && (code.includes('background') || code.includes('color') || code.includes('margin'))) {
        return 'css';
    }
    if (code.includes('def ') || code.includes('import ') || code.includes('print(')) {
        return 'python';
    }
    
    return null;
}

/**
 * Create a new copyable code block programmatically
 * @param {string} code - The code content
 * @param {string} language - Optional language for syntax highlighting
 * @returns {HTMLElement} - The created code block element
 */
function createCopyableCodeBlock(code, language = null) {
    const codeBlock = document.createElement('div');
    codeBlock.className = 'code-block';
    
    const codeElement = document.createElement('code');
    codeElement.textContent = code;
    
    codeBlock.appendChild(codeElement);
    
    if (language) {
        codeBlock.classList.add(`language-${language}`);
    }
    
    enhanceCodeBlock(codeBlock, Date.now());
    
    return codeBlock;
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCodeCopy);
} else {
    // DOM already loaded
    initializeCodeCopy();
}

// Make functions available globally for manual use
window.copyPrompt = copyPrompt;
window.CodeCopyUtils = {
    initializeCodeCopy,
    enhanceCodeBlock,
    createCopyableCodeBlock,
    copyCodeToClipboard
}; 