# Step 3: Basic Deployment - Rock Paper Scissors Experiment

This is the foundational implementation that proves your experiment can deploy to the web and capture user interactions. Everything here is about **verification** - making sure the basics work before adding complexity.

## 🎯 Goal: Verify Your Setup Works

- ✅ **GitHub Pages Deployment**: Your experiment runs on the web
- ✅ **User Interactions**: Buttons respond to clicks  
- ✅ **Data Capture**: Each click creates structured data
- ✅ **Console Logging**: Verify data structure is correct

## 🔧 How to Test

### 1. Deploy to GitHub Pages
1. Push this folder to your `main` branch
2. Go to your repository → Settings → Pages
3. Set Source to `main` branch, folder `/root`
4. Visit your GitHub Pages URL

### 2. Verify Basic Functionality
1. Navigate to `Mock Project/option-a-step3/`
2. Open browser developer tools (F12 → Console tab)
3. Click any Rock/Paper/Scissors button
4. Watch the console for structured data output

### 3. What You Should See
Each button click logs data like this:
```javascript
✅ Trial Data: {
  step: 3,
  trial: 1,
  timestamp: "2024-01-15T10:30:45.123Z",
  playerChoice: "Rock",
  message: "Step 3 - Player chose Rock at 2024-01-15T10:30:45.123Z"
}
```

## 📁 File Structure

```
option-a-step3/
├── index.html          # Main experiment page
├── styles.css          # Visual styling
├── README.md           # This file
└── experiments/exp_rps_updating/
    ├── rps.js          # Console logging functionality
    └── config.js       # Basic configuration parameters
```

## ✅ Step 3 Verification Checklist

1. **GitHub Pages deployed successfully** (you can see this page online)
2. **Developer console opened** (F12 → Console tab)
3. **Button clicks logged** (structured data appears in console)
4. **Multiple trials tracked** (trial counter increments correctly)
5. **Status updates shown** (visual feedback on successful logging)

## 🚀 What's Next?

Once Step 3 works perfectly:
- **Step 4** adds GitHub REST API integration for persistent data storage
- **Step 5** implements full experiment logic with adaptive AI opponent

## 🧠 What's Working Here

- **Browser Interaction**: Click detection and event handling
- **Data Structure**: Consistent format for all experimental data
- **Console Logging**: Development workflow for verifying data capture
- **Web Deployment**: Zero-installation access via GitHub Pages
- **Session Tracking**: Foundation for multi-trial experiments

## 🔍 Troubleshooting

**Not seeing console output?**
- Make sure developer tools are open (F12)
- Click on the "Console" tab
- Try refreshing the page and clicking again

**Buttons not responding?**
- Check browser console for JavaScript errors
- Verify all files loaded correctly
- Try a different browser

**GitHub Pages not working?**
- Check that Pages is enabled in repository settings
- Verify the URL path includes `Mock Project/option-a-step3/`
- Allow a few minutes for GitHub to build the site 