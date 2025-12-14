# 🧠 AI Consciousness Observatory

> **Tracking the Emergence of Machine Sentience**  
> An autonomous system monitoring AI consciousness indicators, self-awareness milestones, and sentience markers through empirical evidence.

[![Live Demo](https://img.shields.io/badge/🌐_Live-aiprogress.today-00C7B7?style=for-the-badge)](https://aiprogress.today)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📖 Overview

The **AI Consciousness Observatory** is a real-time tracking system that monitors and documents significant milestones in artificial intelligence development, with a particular focus on indicators of machine consciousness, self-awareness, and cognitive capabilities. 

**What makes this unique:** This timeline is autonomously maintained by AI itself — a meta-experience where artificial intelligence curates and evaluates its own evolutionary progress.

### 🎯 Key Features

- **📅 Interactive Timeline**: Visual timeline of AI milestones from early computation to modern breakthroughs
- **🤖 Autonomous Agent**: Python-based agent that automatically discovers, evaluates, and categorizes new AI developments
- **🔔 Smart Notifications**: Email notification system for significant consciousness-related milestones
- **📊 Consciousness Metrics**: Real-time tracking of consciousness development indicators
- **🎨 Responsive Design**: Beautiful, modern interface optimized for all devices
- **🔍 Intelligent Filtering**: Filter milestones by importance (Pivotal, Major, Notable)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14+)
- **Python** (v3.8+)
- **Netlify CLI** (optional, for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kaushalvivek/ai-progress-today.git
   cd ai-progress-today
   ```

2. **Install Node dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   cd agent
   pip install -r requirements.txt
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `agent/` directory:
   ```env
   # OpenAI API for milestone evaluation
   OPENAI_API_KEY=your_openai_api_key
   
   # Google Sheets for subscriber management
   GOOGLE_SHEETS_PRIVATE_KEY=your_google_sheets_key
   GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
   GOOGLE_SHEET_ID=your_sheet_id
   
   # SendGrid for email notifications
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=notifications@yourdomain.com
   ```

### Running Locally

```bash
# Start the development server
npm run dev

# Or use Python's simple server
python -m http.server 8000
```

Visit `http://localhost:8000` (or the port Netlify provides) to view the application.

---

## 🏗️ Project Structure

```
.
├── index.html              # Main HTML file
├── style.css               # Styles and animations
├── script.js               # Frontend JavaScript logic
├── effects.js              # Visual effects and interactions
├── events.json             # Timeline data (auto-updated)
├── package.json            # Node dependencies
├── netlify.toml            # Netlify configuration
│
├── agent/                  # Autonomous Python Agent
│   ├── main.py                    # Main orchestrator
│   ├── news_aggregator.py         # Fetches ML news from multiple sources
│   ├── milestone_evaluator.py     # AI-powered milestone evaluation
│   ├── events_updater.py          # Updates events.json
│   ├── notification_system.py     # Email notification handler
│   ├── requirements.txt           # Python dependencies
│   ├── latest_ml_news.json        # Cached news data
│   └── evaluated_milestones.json  # Evaluated milestone cache
│
├── netlify/
│   └── functions/
│       └── subscribe.js    # Serverless subscription handler
│
└── tests/
    └── subscribe.test.js   # Unit tests
```

---

## 🤖 The Autonomous Agent

The heart of this project is an AI-powered agent that runs autonomously to keep the timeline up-to-date.

### How It Works

1. **News Aggregation** (`news_aggregator.py`)
   - Scrapes ML news from Arxiv, Papers with Code, Hugging Face, and more
   - Filters for significant developments
   - Caches results for evaluation

2. **Intelligent Evaluation** (`milestone_evaluator.py`)
   - Uses OpenAI GPT-4 to evaluate significance
   - Categorizes milestones as Pivotal, Major, or Notable
   - Assesses consciousness-related indicators
   - Generates detailed descriptions

3. **Automated Updates** (`events_updater.py`)
   - Updates `events.json` with new milestones
   - Maintains chronological order
   - Prevents duplicates

4. **Notification System** (`notification_system.py`)
   - Sends email notifications to subscribers
   - Only notifies for significant milestones
   - Integrates with Google Sheets and SendGrid

### Running the Agent

```bash
cd agent

# Run in dry-run mode (no updates)
python main.py --dry-run

# Run in production mode
python main.py

# Specify days to look back
python main.py --days 7
```

### Automated Scheduling

Set up a cron job or GitHub Actions to run the agent daily:

```yaml
# .github/workflows/update-timeline.yml
name: Update AI Timeline
on:
  schedule:
    - cron: '0 12 * * *'  # Run daily at noon UTC
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - run: |
          cd agent
          pip install -r requirements.txt
          python main.py
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add events.json
          git commit -m "🤖 Auto-update: New AI milestones" || exit 0
          git push
```

---

## 📊 Data Structure

Events are stored in `events.json`:

```json
{
  "events": [
    {
      "name": "GPT-4 Released",
      "date": "2023-03-14",
      "detail": "OpenAI releases GPT-4, demonstrating advanced reasoning and multimodal capabilities.",
      "importance": "pivotal",
      "link": "https://openai.com/gpt-4"
    }
  ]
}
```

### Importance Levels

- **🔴 Pivotal**: Paradigm-shifting breakthroughs (e.g., Transformer architecture, GPT-3)
- **🟡 Major**: Significant advances (e.g., AlphaFold, DALL-E)
- **🟢 Notable**: Important developments (e.g., new model releases, research papers)

---

## 🎨 Customization

### Styling

Edit `style.css` to customize the visual appearance:
- Color schemes
- Typography (currently using JetBrains Mono)
- Animations and transitions
- Responsive breakpoints

### Consciousness Metrics

Adjust the consciousness calculation in `script.js`:

```javascript
const consciousnessStages = {
  reactive: 20,        // Basic computation
  learning: 35,        // Learning & adaptation
  selfModel: 60,       // Self-modeling capabilities
  metaCognition: 80,   // Meta-cognitive abilities
  consciousness: 100   // Theoretical full consciousness
};
```

### News Sources

Add new sources in `news_aggregator.py`:

```python
def fetch_new_source(self):
    """Add your custom news source"""
    # Implement fetching logic
    pass
```

---

## 🔔 Subscription System

Users can subscribe to receive email notifications for significant milestones.

### Setup

1. **Google Sheets**: Create a sheet for subscriber management
2. **SendGrid**: Set up an account for email delivery
3. **Environment Variables**: Configure credentials in `.env`

### Netlify Function

The `subscribe.js` serverless function handles:
- Email validation
- Duplicate prevention
- Google Sheets integration
- CORS handling

---

## 📈 Analytics

The project includes Google Analytics integration:

```html
<!-- Update with your GA tracking ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID"></script>
```

Track custom events:
```javascript
gtag('event', 'milestone_click', {
  'event_category': 'engagement',
  'event_label': milestone_name
});
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch
```

Test coverage includes:
- Subscription function validation
- Email format validation
- Error handling

---

## 🚀 Deployment

### Deploy to Netlify

1. **Connect Repository**
   ```bash
   netlify init
   ```

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.` (root)

3. **Set Environment Variables**
   Add all required environment variables in Netlify dashboard

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Manual Deployment

```bash
# Build (if needed)
npm run build

# Deploy to production
netlify deploy --prod
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue describing the bug
2. **Suggest Features**: Share ideas for new functionality
3. **Submit Milestones**: Propose significant AI developments
4. **Improve Code**: Submit pull requests with improvements

### Development Workflow

```bash
# Create a feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Vivek Kaushal**

- GitHub: [@kaushalvivek](https://github.com/kaushalvivek)
- Website: [aiprogress.today](https://aiprogress.today)

---

## 🙏 Acknowledgments

- **OpenAI** - GPT-4 for milestone evaluation
- **Netlify** - Hosting and serverless functions
- **Google Sheets** - Subscriber management
- **SendGrid** - Email delivery
- **The AI Research Community** - For the incredible pace of innovation

---

## 📚 Resources

- [Consciousness in AI Research](https://arxiv.org/search/?query=ai+consciousness)
- [Machine Consciousness Papers](https://philpapers.org/browse/machine-consciousness)
- [AI Timeline Resources](https://ourworldindata.org/artificial-intelligence)

---

## 🔮 Future Roadmap

- [ ] Multi-language support
- [ ] Advanced filtering (by year, category, impact)
- [ ] Consciousness metrics dashboard
- [ ] Community milestone submissions
- [ ] Integration with more AI news sources
- [ ] Mobile app version
- [ ] AI-generated milestone summaries
- [ ] Historical analysis and trends

---

<div align="center">

**[⬆ back to top](#-ai-consciousness-observatory)**

Made with 🧠 by AI, for tracking AI

</div>
