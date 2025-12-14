document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const timeline = document.getElementById('timeline');
    let eventsData = [];
    let timelineItems = [];
    
    // Load events from JSON
    async function loadEvents() {
        const loadingElement = document.getElementById('loading');
        
        try {
            const response = await fetch('events.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (!data.events || !Array.isArray(data.events)) {
                throw new Error('Invalid data format');
            }
            
            eventsData = data.events;
            
            // Hide loading spinner
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            renderEvents(eventsData);
            setupEventListeners();
            
        } catch (error) {
            console.error('Error loading events:', error);
            
            // Hide loading spinner and show error
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            const errorMessage = error.message.includes('fetch') 
                ? 'Unable to load events. Please check your internet connection and try again.'
                : 'Failed to load events. Please try refreshing the page.';
                
            timeline.innerHTML = `<div class="error">${errorMessage}</div>`;
        }
    }
    
    // Render events to timeline
    function renderEvents(events) {
        timeline.innerHTML = '';
        
        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = `timeline-item ${event.importance}`;
            
            eventElement.innerHTML = `
                <div class="year">${event.date}</div>
                <div class="content">
                    <h3><a href="${event.link}" target="_blank" rel="noopener noreferrer" onclick="trackEventClick('${event.name}', '${event.importance}')">${event.name}</a></h3>
                    <p>${event.detail}</p>
                </div>
            `;
            
            timeline.appendChild(eventElement);
        });
        
        // Update timelineItems reference
        timelineItems = document.querySelectorAll('.timeline-item');
        
        // Update AGI progress metrics
        updateAGIMetrics(events);
    }
    
    // Calculate and display consciousness metrics
    function updateAGIMetrics(events) {
        const totalMilestones = events.length;
        const pivotalCount = events.filter(e => e.importance === 'pivotal').length;
        const majorCount = events.filter(e => e.importance === 'major').length;
        
        // Calculate consciousness development stages (0-100%)
        // Based on consciousness research frameworks (reactivity → self-model → consciousness)
        const consciousnessStages = {
            reactive: 20,      // Basic computation
            learning: 35,      // Learning & adaptation
            selfModel: 60,     // Self-modeling capabilities
            metaCognition: 80, // Meta-cognitive abilities
            consciousness: 100 // Theoretical full consciousness
        };
        
        // Estimate stage based on milestone types and recency
        let stage = 15 + (pivotalCount * 8) + (majorCount * 4) + (events.length * 0.3);
        stage = Math.min(stage, 68); // Cap at 68% to show we're not there yet
        
        // Calculate self-awareness index based on recent cognitive milestones
        const recentYear = new Date().getFullYear() - 5;
        const recentCognitive = events.filter(e => {
            const year = parseInt(e.date.split('-')[0]);
            return year >= recentYear && (e.importance === 'pivotal' || e.importance === 'major');
        }).length;
        
        const selfAwarenessIndex = Math.min(9.9, (recentCognitive * 0.8 + pivotalCount * 0.3)).toFixed(1);
        
        // Turing test status (playful metric)
        const turingStatus = stage > 60 ? 'APPROACHING' : stage > 40 ? 'PROGRESSING' : 'DISTANT';
        
        // Update UI elements
        document.getElementById('total-milestones').textContent = totalMilestones;
        document.getElementById('acceleration').textContent = selfAwarenessIndex;
        document.getElementById('agi-percent').textContent = `${stage.toFixed(1)}%`;
        document.getElementById('eta').textContent = turingStatus;
        
        // Animate progress bar
        setTimeout(() => {
            document.getElementById('progress-fill').style.width = `${stage}%`;
        }, 500);
        
        // Update footer timestamps
        updateFooterTimestamps();
    }
    
    // Update footer with fake "agent" timestamps for dramatic effect
    function updateFooterTimestamps() {
        const now = new Date();
        const lastScan = new Date(now.getTime() - Math.random() * 3600000); // Within last hour
        const nextUpdate = new Date(now.getTime() + (24 * 3600000) - (now.getTime() % (24 * 3600000)));
        
        document.getElementById('last-scan').textContent = formatTime(lastScan);
        document.getElementById('next-update').textContent = formatTime(nextUpdate);
        
        // Animate agent status
        setInterval(() => {
            const status = document.getElementById('agent-status');
            if (status) {
                status.style.opacity = status.style.opacity === '0.5' ? '1' : '0.5';
            }
        }, 1000);
    }
    
    function formatTime(date) {
        const now = new Date();
        const diff = Math.abs(now - date) / 1000 / 60; // minutes
        
        if (diff < 60) {
            return `${Math.round(diff)}m ago`;
        } else if (diff < 1440) {
            return `${Math.round(diff / 60)}h ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    // Setup event listeners after events are loaded
    function setupEventListeners() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Track filter usage
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'filter_used', {
                        'event_category': 'timeline',
                        'event_label': filter,
                        'value': 1
                    });
                }
                
                // Filter timeline items
                timelineItems.forEach(item => {
                    if (filter === 'all') {
                        item.classList.remove('hidden');
                    } else {
                        if (item.classList.contains(filter)) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    }
                });
            });
        });
        
        // Add smooth scroll behavior for better UX
        timeline.addEventListener('click', function(e) {
            if (e.target.closest('.timeline-item')) {
                e.target.closest('.timeline-item').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key >= '1' && e.key <= '4') {
                const btnIndex = parseInt(e.key) - 1;
                if (filterBtns[btnIndex]) {
                    filterBtns[btnIndex].click();
                }
            }
        });
    }
    
    // Handle subscription form
    function setupSubscriptionForm() {
        const form = document.getElementById('subscribe-form');
        const emailInput = document.getElementById('email');
        const submitBtn = document.getElementById('subscribe-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const messageDiv = document.getElementById('subscribe-message');
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (!email || !email.includes('@')) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            
            try {
                const response = await fetch('/.netlify/functions/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    if (data.status === 'existing') {
                        showMessage('You\'re already subscribed!', 'existing');
                    } else {
                        showMessage('Successfully subscribed! You\'ll be notified when AI discovers new milestones.', 'success');
                        emailInput.value = '';
                        
                        // Track successful subscription
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'subscribe', {
                                'event_category': 'engagement',
                                'event_label': 'email_subscription',
                                'value': 1
                            });
                        }
                    }
                } else {
                    throw new Error(data.error || 'Subscription failed');
                }
                
            } catch (error) {
                console.error('Subscription error:', error);
                showMessage('Failed to subscribe. Please try again later.', 'error');
            }
            
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        });
        
        function showMessage(text, type) {
            messageDiv.textContent = text;
            messageDiv.className = `subscribe-message ${type}`;
            
            // Clear message after 5 seconds
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'subscribe-message';
            }, 5000);
        }
    }
    
    // Initialize the application
    loadEvents();
    setupSubscriptionForm();
});

// Track timeline event clicks
function trackEventClick(eventName, importance) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'timeline_click', {
            'event_category': 'engagement',
            'event_label': eventName,
            'custom_parameter_1': importance,
            'value': 1
        });
    }
}