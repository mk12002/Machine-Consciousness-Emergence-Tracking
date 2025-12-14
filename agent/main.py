"""
Main ML Milestone Agent
Orchestrates the entire automated pipeline:
1. Aggregates ML news from multiple sources
2. Evaluates significance with AI
3. Updates events.json
4. Sends notifications to subscribers
"""

import os
import sys
import json
from datetime import datetime
import argparse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our modules
from news_aggregator import MLNewsAggregator
from milestone_evaluator import MilestoneEvaluator
from events_updater import EventsUpdater
from notification_system import NotificationSystem

class MLMilestoneAgent:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.aggregator = MLNewsAggregator()
        self.evaluator = MilestoneEvaluator()
        self.updater = EventsUpdater()
        self.notifier = NotificationSystem()
        
        self.log_file = f"agent_run_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
        
    def log(self, message: str):
        """Log message to console and file"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_msg = f"[{timestamp}] {message}"
        print(log_msg)
        
        with open(self.log_file, 'a', encoding='utf-8') as f:
            f.write(log_msg + '\n')
    
    def run(self, days_back=1):
        """Run the complete automated pipeline"""
        self.log("="*80)
        self.log("🤖 ML MILESTONE AGENT STARTING")
        self.log(f"Mode: {'DRY RUN' if self.dry_run else 'PRODUCTION'}")
        self.log("="*80)
        
        try:
            # Step 1: Aggregate news
            self.log("\n📰 STEP 1: Aggregating ML news from sources...")
            news_items = self.aggregator.aggregate_all_sources(days_back=days_back)
            self.log(f"✓ Found {len(news_items)} news items")
            
            if not news_items:
                self.log("⚠ No news items found. Exiting.")
                return
            
            # Save raw news for inspection
            with open('latest_ml_news.json', 'w') as f:
                json.dump(news_items, f, indent=2)
            
            # Step 2: Evaluate significance
            self.log("\n🧠 STEP 2: Evaluating milestone significance with AI...")
            milestones = self.evaluator.batch_evaluate(news_items)
            self.log(f"✓ Identified {len(milestones)} milestone(s)")
            
            if not milestones:
                self.log("⚠ No milestones identified. Exiting.")
                return
            
            # Save evaluated milestones
            with open('evaluated_milestones.json', 'w') as f:
                json.dump(milestones, f, indent=2)
            
            # Step 3: Update events.json
            if self.dry_run:
                self.log("\n📝 STEP 3: [DRY RUN] Would add milestones to events.json:")
                for m in milestones:
                    self.log(f"  - {m['name']} ({m['importance']})")
                added_count = len(milestones)
            else:
                self.log("\n📝 STEP 3: Updating events.json...")
                added_count = self.updater.add_milestones(milestones, auto_commit=True)
            
            # Step 4: Send notifications
            if added_count > 0:
                if self.dry_run:
                    self.log("\n📧 STEP 4: [DRY RUN] Would send notifications to subscribers")
                else:
                    self.log("\n📧 STEP 4: Sending notifications to subscribers...")
                    sent_count = self.notifier.notify_subscribers(milestones)
                    self.log(f"✓ Sent {sent_count} notification(s)")
            else:
                self.log("\n📧 STEP 4: No new milestones to notify about (all duplicates)")
            
            # Summary
            self.log("\n" + "="*80)
            self.log("✅ AGENT RUN COMPLETE")
            self.log(f"Summary:")
            self.log(f"  - News items scanned: {len(news_items)}")
            self.log(f"  - Milestones identified: {len(milestones)}")
            self.log(f"  - Milestones added: {added_count}")
            self.log("="*80)
            
        except Exception as e:
            self.log(f"\n❌ ERROR: {str(e)}")
            import traceback
            self.log(traceback.format_exc())
            raise

def main():
    parser = argparse.ArgumentParser(description='ML Milestone Agent - Automated ML progress tracking')
    parser.add_argument('--dry-run', action='store_true', help='Run without making changes')
    parser.add_argument('--days', type=int, default=1, help='Number of days back to scan (default: 1)')
    
    args = parser.parse_args()
    
    # Check LLM provider is configured
    provider = os.getenv('LLM_PROVIDER', 'groq')
    
    # Check for appropriate API key based on provider
    if provider == 'groq' and not os.getenv('GROQ_API_KEY'):
        print("❌ Missing GROQ_API_KEY for Groq provider")
        print("Get free key at: https://console.groq.com")
        print("\nAdd to .env file:")
        print("  LLM_PROVIDER=groq")
        print("  GROQ_API_KEY=your_groq_key_here")
        sys.exit(1)
    elif provider == 'gemini' and not os.getenv('GEMINI_API_KEY'):
        print("❌ Missing GEMINI_API_KEY for Gemini provider")
        print("Get free key at: https://makersuite.google.com/app/apikey")
        sys.exit(1)
    elif provider == 'openai' and not os.getenv('OPENAI_API_KEY'):
        print("❌ Missing OPENAI_API_KEY for OpenAI provider")
        sys.exit(1)
    elif provider == 'ollama':
        print("✓ Using Ollama (local) - make sure it's running!")
    
    print(f"✓ LLM Provider: {provider.upper()}")
    print("\nOptional (for notifications):")
    print("  GOOGLE_SHEET_ID, SENDGRID_API_KEY")
    print()
    
    # Run the agent
    agent = MLMilestoneAgent(dry_run=args.dry_run)
    agent.run(days_back=args.days)

if __name__ == "__main__":
    main()
