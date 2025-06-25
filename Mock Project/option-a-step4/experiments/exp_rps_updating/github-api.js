// Step 4: GitHub REST API Integration
// Handles saving experiment data directly to GitHub repository

class GitHubAPI {
    constructor() {
        this.token = null;
        this.owner = null;
        this.repo = null;
        this.sessionId = this.generateSessionId();
        this.isConfigured = false;
    }

    generateSessionId() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const randomId = Math.random().toString(36).substr(2, 8);
        return `session_${timestamp}_${randomId}`;
    }

    configure(token, owner, repo) {
        this.token = token;
        this.owner = owner;
        this.repo = repo;
    }

    async testConnection() {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                this.isConfigured = true;
                return { success: true, message: 'GitHub API connection successful!' };
            } else {
                const error = await response.json();
                return { success: false, message: `Connection failed: ${error.message}` };
            }
        } catch (error) {
            return { success: false, message: `Network error: ${error.message}` };
        }
    }

    async saveData(data, filename = null) {
        if (!this.isConfigured) {
            throw new Error('GitHub API not configured');
        }

        const fileName = filename || `data/experiment_data_${this.sessionId}.json`;
        const content = JSON.stringify(data, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(content)));

        try {
            // Check if file exists to get SHA (required for updates)
            let sha = null;
            try {
                const existingFile = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/${fileName}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (existingFile.ok) {
                    const fileData = await existingFile.json();
                    sha = fileData.sha;
                }
            } catch (e) {
                // File doesn't exist, that's fine
            }

            // Create or update file
            const requestBody = {
                message: `Update experiment data - ${new Date().toISOString()}`,
                content: encodedContent,
                ...(sha && { sha })
            };

            const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/${fileName}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const result = await response.json();
                return { 
                    success: true, 
                    message: 'Data saved successfully!',
                    fileName: fileName,
                    url: result.content.html_url
                };
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            return { success: false, message: `Save failed: ${error.message}` };
        }
    }
}

// Global instance
window.githubAPI = new GitHubAPI(); 