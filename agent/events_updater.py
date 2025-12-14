"""
Events JSON Updater
Automatically updates events.json with new milestones
"""

import json
import os
from typing import List, Dict
from datetime import datetime
import subprocess

class EventsUpdater:
    def __init__(self, events_file_path='../events.json'):
        self.events_file_path = events_file_path
        
    def load_events(self) -> Dict:
        """Load current events from events.json"""
        with open(self.events_file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def save_events(self, events_data: Dict):
        """Save events back to events.json"""
        with open(self.events_file_path, 'w', encoding='utf-8') as f:
            json.dump(events_data, f, indent=2, ensure_ascii=False)
    
    def milestone_exists(self, events_data: Dict, new_milestone: Dict) -> bool:
        """Check if milestone already exists (by name or link)"""
        for event in events_data['events']:
            if (event['name'] == new_milestone['name'] or 
                event['link'] == new_milestone['link']):
                return True
        return False
    
    def add_milestones(self, new_milestones: List[Dict], auto_commit=False) -> int:
        """
        Add new milestones to events.json
        Returns number of milestones added
        """
        if not new_milestones:
            print("No new milestones to add")
            return 0
        
        events_data = self.load_events()
        added_count = 0
        
        for milestone in new_milestones:
            if not self.milestone_exists(events_data, milestone):
                # Add at the beginning (most recent first)
                events_data['events'].insert(0, milestone)
                added_count += 1
                print(f"✓ Added: {milestone['name']}")
            else:
                print(f"✗ Skipped (duplicate): {milestone['name']}")
        
        if added_count > 0:
            self.save_events(events_data)
            print(f"\n✓ Successfully added {added_count} new milestone(s) to events.json")
            
            if auto_commit:
                self.commit_changes(added_count)
        else:
            print("\nNo new milestones were added (all duplicates)")
        
        return added_count
    
    def commit_changes(self, count: int):
        """Create git commit with changes (optional)"""
        try:
            subprocess.run(['git', 'add', self.events_file_path], check=True)
            commit_msg = f"🤖 Auto-add {count} new ML milestone(s) - {datetime.now().strftime('%Y-%m-%d')}"
            subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
            print(f"\n✓ Git commit created: {commit_msg}")
        except subprocess.CalledProcessError as e:
            print(f"\n⚠ Git commit failed (run manually): {e}")
        except FileNotFoundError:
            print("\n⚠ Git not found (commit manually)")

if __name__ == "__main__":
    updater = EventsUpdater()
    
    # Load evaluated milestones
    try:
        with open('evaluated_milestones.json', 'r') as f:
            milestones = json.load(f)
        
        print(f"Found {len(milestones)} evaluated milestone(s)")
        
        if milestones:
            added = updater.add_milestones(milestones, auto_commit=True)
            print(f"\nSummary: Added {added}/{len(milestones)} milestone(s)")
        
    except FileNotFoundError:
        print("No evaluated_milestones.json found. Run milestone_evaluator.py first.")
