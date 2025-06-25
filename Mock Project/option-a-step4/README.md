# Step 4: Data Collection - Rock Paper Scissors Experiment

This implementation builds on Step 3 by adding **automated data collection** using the GitHub REST API. Every participant interaction now creates permanent data files in your repository.

## 🎯 What's New in Step 4

- **GitHub API Integration**: Automatic file creation in your repository
- **Persistent Data Storage**: All experiment data saves permanently to GitHub
- **Structured JSON Format**: Data ready for analysis with clear metadata
- **Real-time Feedback**: Visual confirmation when data saves successfully
- **Session Management**: Unique identifiers for each participant session

## 🔧 Setup Instructions

### 1. Get Your GitHub Personal Access Token

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Psychology Experiment Data Collection")
4. Select the **`repo`** scope (full repository access)
5. Click "Generate token" and **copy the token immediately**

### 2. Configure the Experiment

1. Open `index.html` in your browser
2. Fill in the configuration form:
   - **GitHub Token**: Paste your personal access token
   - **Repository Owner**: Your GitHub username
   - **Repository Name**: The name of this repository
3. Click "Configure & Test" to verify the connection

### 3. Start Collecting Data

Once configured:
- Click any Rock/Paper/Scissors button
- Watch the real-time feedback showing successful saves
- Check your repository's `data/` folder for the generated JSON files

## 📊 Data Structure

Each session creates a uniquely named JSON file with this structure:

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

## 🔐 Security Notes

- Your GitHub token stays in your browser and is never sent to external servers
- The token is only used to authenticate with GitHub's official API
- Consider creating a dedicated repository for experiment data
- You can revoke the token anytime in your GitHub settings

## 🚀 Next Steps

Step 4 proves that automated data collection works. Step 5 will add:
- Full experiment logic with AI opponent
- Pattern learning and adaptation
- Statistical analysis dashboard
- Publication-ready data visualization

## 🔍 Troubleshooting

**"Connection failed" error?**
- Check that your token has `repo` scope
- Verify your username and repository name are correct
- Make sure the repository exists and is accessible

**No data files appearing?**
- Check the browser console for error messages
- Verify you clicked "Configure & Test" and saw success message
- Try refreshing and reconfiguring

**Network errors?**
- Check your internet connection
- GitHub API may be temporarily unavailable
- Data is cached locally until connection is restored 