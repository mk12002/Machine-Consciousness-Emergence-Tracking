"""
ML News Aggregator Agent
Scans multiple sources for ML/AI news and returns relevant articles
"""

import os
import requests
from datetime import datetime, timedelta
from typing import List, Dict
import feedparser
import json

class MLNewsAggregator:
    def __init__(self):
        self.sources = {
            'arxiv': 'http://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CV+OR+cat:cs.CL&sortBy=submittedDate&sortOrder=descending&max_results=20',
            'huggingface_daily': 'https://huggingface.co/api/daily_papers',
        }
        
    def fetch_arxiv_papers(self, days_back=1) -> List[Dict]:
        """Fetch recent papers from ArXiv"""
        papers = []
        try:
            feed = feedparser.parse(self.sources['arxiv'])
            cutoff_date = datetime.now() - timedelta(days=days_back)
            
            for entry in feed.entries:
                published = datetime.strptime(entry.published, '%Y-%m-%dT%H:%M:%SZ')
                if published >= cutoff_date:
                    papers.append({
                        'title': entry.title,
                        'summary': entry.summary[:500],
                        'link': entry.link,
                        'date': published.strftime('%Y-%m-%d'),
                        'authors': [author.name for author in entry.authors],
                        'source': 'ArXiv'
                    })
        except Exception as e:
            print(f"Error fetching ArXiv papers: {e}")
        
        return papers
    
    def fetch_huggingface_papers(self) -> List[Dict]:
        """Fetch trending papers from HuggingFace"""
        papers = []
        try:
            response = requests.get(self.sources['huggingface_daily'], timeout=10)
            if response.status_code == 200:
                data = response.json()
                for paper in data[:10]:  # Top 10 papers
                    papers.append({
                        'title': paper.get('title', ''),
                        'summary': paper.get('summary', '')[:500],
                        'link': f"https://huggingface.co/papers/{paper.get('id', '')}",
                        'date': datetime.now().strftime('%Y-%m-%d'),
                        'source': 'HuggingFace'
                    })
        except Exception as e:
            print(f"Error fetching HuggingFace papers: {e}")
        
        return papers
    
    def fetch_ml_news_apis(self) -> List[Dict]:
        """Fetch ML news from various APIs"""
        news_items = []
        
        # You can add more sources here:
        # - Google Scholar API
        # - Papers with Code API
        # - Research blog RSS feeds
        # - Twitter/X API for announcements
        # - Reddit ML subreddit
        
        return news_items
    
    def aggregate_all_sources(self, days_back=1) -> List[Dict]:
        """Aggregate news from all sources"""
        all_news = []
        
        print("Fetching ArXiv papers...")
        all_news.extend(self.fetch_arxiv_papers(days_back))
        
        print("Fetching HuggingFace papers...")
        all_news.extend(self.fetch_huggingface_papers())
        
        print("Fetching from other ML news sources...")
        all_news.extend(self.fetch_ml_news_apis())
        
        print(f"Found {len(all_news)} total news items")
        return all_news

if __name__ == "__main__":
    aggregator = MLNewsAggregator()
    news = aggregator.aggregate_all_sources(days_back=1)
    
    # Save to file for inspection
    with open('latest_ml_news.json', 'w') as f:
        json.dump(news, f, indent=2)
    
    print(f"Saved {len(news)} news items to latest_ml_news.json")
