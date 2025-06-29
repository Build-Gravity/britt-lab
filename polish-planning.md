# Polishing Plan

This document outlines small improvements and consistency checks to prepare the project for delivery. The focus is on UI/UX refinement, consistency, and clarity, not major refactoring.

## ✅ Main Landing Page (`index.html`) - COMPLETED

*   ✅ **Consistency Check**: Fixed button consistency - Step 0 remains `btn primary` to guide users, all other steps now use `btn secondary` for visual hierarchy.
*   ✅ **"Your Experiment" Section**: Added `featured-card` class with gradient background and enhanced styling to make the user's experiment section stand out.
*   ✅ **Footer Clarity**: The footer is good. The link to `instructions.md` is clear. No changes were needed.
*   ✅ **Overall**: The page now has consistent styling and clear visual hierarchy guiding users to start with Step 0.

## ✅ Step 0: Research & Planning (`Mock Project/option-a-step0/index.html`) - COMPLETED

*   ✅ **Visual Hierarchy**: Enhanced spacing in the "Our Example" section with 25px margins between Study Reference, Research Question, and Our Adaptation sections for better readability.
*   ✅ **Button Consistency**: All buttons now use consistent styling system with proper primary/secondary distinction.
*   ✅ **Content Clarity**: The content is excellent, comprehensive, and well-structured. Enhanced with improved whitespace for better scanning.
*   ✅ **User Experience**: The reference box now has better visual separation making it easier to distinguish between different sections.

## ✅ Step 1: Environment Setup (`Mock Project/option-a-step1/index.html`) - COMPLETED

*   ✅ **Code Block Usability**: Implemented automatic copy buttons for all code blocks using the enhanced `code-copy-utils.js` system. All commands now have single, consistent copy buttons in the top-right corner.
*   ✅ **Visual Grouping**: Wrapped setup instructions in unified container box and created distinct `.os-instructions` styling for each OS section (Windows, Mac, Linux variants) to improve scannability.
*   ✅ **Instructional Clarity**: Added `.placeholder` styling with yellow background for git config commands to clearly indicate text that needs to be replaced, preventing verbatim copying.
*   ✅ **CentOS/RHEL/Fedora Fix**: Moved "or for older versions" text outside code block and gave `sudo yum install git` its own dedicated copy box.
*   ✅ **Infrastructure**: Enhanced shared copy utility system to use `data-copy-text` attributes for precise command copying, eliminating duplicate buttons.
*   ✅ **Overall**: This is now a polished, professional setup page with excellent usability and clear visual hierarchy.

## ✅ Step 2: Repository Setup (`Mock Project/option-a-step2/index.html`) - COMPLETED

*   ✅ **URL Generator**: Enhanced with automatic space-to-hyphen conversion and special character removal, plus helpful messaging when conversions occur. Added upfront guidance about repository naming best practices.
*   ✅ **Visual Feedback**: Implemented green border and light green background for valid URLs, providing clear visual confirmation that the URL is ready to use.
*   ✅ **Code Block Consistency**: Fixed `git clone` command to use proper `.code-block` styling with automatic copy button and `.placeholder` styling for the URL placeholder.
*   ✅ **Broader Audience**: Updated fork instructions to link directly to the actual repository (https://github.com/Build-Gravity/britt-lab), making it self-service friendly for independent learners.
*   ✅ **Troubleshooting Section**: This excellent feature required no changes.

## ✅ Step 3: Build Your First Experiment (`Mock Project/option-a-step3/index.html`) - COMPLETED

*   ✅ **Code Block Usability**: All code blocks now have automatic copy buttons via the enhanced `code-copy-utils.js` system. No duplicate buttons needed.
*   ✅ **AI Prompt Enhancement**: Updated AI prompts to reference Step 0 study materials and provide more specific guidance for adaptation.
*   ✅ **Data Structure Alignment**: Aligned Step 3's console logging structure with Step 4's localStorage structure for consistency.
*   ✅ **Button Consistency**: All buttons use consistent styling with automatic copy functionality.
*   ✅ **Overall**: This step now provides clear guidance for building basic experiments with proper data structure alignment.

## ✅ Step 4: Data Collection (`Mock Project/option-a-step4/index.html`) - COMPLETED

*   ✅ **Code Block Usability**: All code blocks now have automatic copy buttons via the enhanced `code-copy-utils.js` system.
*   ✅ **localStorage Guide Migration**: Moved and completely rewrote localStorage guide specifically for Step 4's simple data collection needs, with non-technical explanations.
*   ✅ **AI Prompt Enhancement**: Updated AI prompts to reference Step 0 study materials and provide more specific guidance based on user's chosen study.
*   ✅ **Data Structure Alignment**: Added `step` and `status` fields to match Step 3's structure for consistency.
*   ✅ **Destructive Action Warning**: The "Clear Data" button already includes a `confirm()` dialog for user safety.
*   ✅ **Technical Terms**: Added clear explanation of "array" and localStorage concepts with beginner-friendly analogies.
*   ✅ **Troubleshooting Structure**: Separated checklist and troubleshooting into distinct step-box elements for better organization.
*   ✅ **Overall**: This step now provides comprehensive data collection guidance with proper localStorage implementation and clear educational content.

## Step 5: Experimental Design (`Mock Project/option-a-step5/index.html`)

*   **Form Layout Consistency**: The configuration form is excellent but has some minor inconsistencies. The range sliders for "Biased Random" look different from the others. Unifying all `parameter-control` elements to use the same styles would improve the look and feel.
*   **Clarity on Buttons**: The main form has "Save Configuration" and "Download JSON Config". A small note could clarify their distinct purposes (e.g., "Save applies settings to the Step 6 demo, while Download gives you a template for your own project.").
*   **Code Block Usability**: The large `config.json` template and the AI prompt should have "Copy" buttons. This is especially important for the long JSON block.
*   **Content Update**: The "Frequency Counter" settings box shows a "coming soon" message, but the algorithm is available. This box should be removed or updated to show relevant settings if any exist.
*   **JSON Explanation**: A brief, one-sentence explanation of what a JSON file is could be added before the code block to help beginners who have never seen the format before.
*   ✅ **localStorage Guide Update**: Updated reference to point to Step 4's basic localStorage guide and created new advanced configuration guide for Step 5's complex configuration management.
*   **Overall**: This is a very powerful and well-designed page. The polishing points are minor refinements to an already great user experience.

## Step 6: Interactive Elements (`Mock Project/option-a-step6/index.html`)

*   **CRITICAL CONTENT CORRECTION**: The section "AI Opponents for Experiments" is critically out of date and misrepresents the current state of the project.
    *   It references `pattern-ai.js`, which has been renamed to `elph-ai.js`.
    *   It describes the pattern AI as a "simplified" algorithm, failing to mention the new study-accurate ELPH implementation.
    *   Most importantly, it claims ELPH is moved to Step 7 for analysis and is **not** used as an opponent. This is incorrect. The main achievement of our recent work was implementing ELPH as the primary adaptive opponent for Step 6.
*   **Interactive Demo**: The game demo is excellent. The "AI reasoning" feature is a key learning tool and could be made more prominent with a unique style to ensure it's noticed by users.
*   **Test Suite Link**: The link to the test suite is a fantastic feature for showcasing TDD. No changes are needed.
*   **Adaptation Guidance**: The instructions for adapting the code are good. They could be slightly improved by adding a small, concrete, non-RPS example to help users generalize the concepts.
*   **Overall**: The interactive demo is the star of the show. The top priority is to fix the inaccurate descriptive text to correctly reflect the major algorithm upgrades that were just completed.

## Step 7: Analysis & Visualization (`Mock Project/option-a-step7/index.html`)

*   **Content Consistency**: After correcting the content in Step 6, this page will be largely accurate. We can improve it further by adding a sentence to the "RELPH & ELPH: Computational Modeling" section that explicitly connects the two steps, e.g., "While a version of the ELPH model was used as an adaptive opponent in Step 6, its primary scientific purpose is for post-hoc analysis of participant data, which is what we focus on here."
*   **Code Block Usability**: All code blocks, especially the detailed AI prompts and analysis/visualization templates, should have a "Copy" button.
*   **Button Consistency**: Multiple copy buttons exist with different styles (`primary-btn`, `secondary-btn`). These should be unified into a single, consistent style.
*   **Mention Dependencies**: The visualization code example uses `new Chart()`, which implies an external library like Chart.js. A note should be added to inform the user that this library is required and provide a link to its website.
*   **Interactive Analysis UI**: The file upload interface is a powerful feature. We should ensure it provides good user feedback, such as a "loading" indicator while processing data and clear error messages for invalid file formats.
*   **Overall**: This page provides an excellent, high-level overview of the analysis phase and effectively leverages AI prompts to guide the user. The main goal is to ensure it's consistent with the updated information from Step 6. 