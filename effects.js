// Particle Background Effect
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.3;';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticles() {
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: ['rgba(168, 85, 247, ', 'rgba(255, 0, 128, ', 'rgba(0, 255, 255, '][Math.floor(Math.random() * 3)]
            });
        }
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color + (0.3 + Math.sin(Date.now() * 0.001 + index) * 0.2) + ')';
            ctx.fill();
            
            // Draw connections
            particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = particle.color + (1 - distance / 100) * 0.1 + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
        
        animationId = requestAnimationFrame(drawParticles);
    }
    
    function init() {
        resize();
        createParticles();
        drawParticles();
    }
    
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Optional: Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            drawParticles();
        }
    });
})();

// Add scanning effect to header
(function() {
    const header = document.querySelector('header');
    if (!header) return;
    
    const scanner = document.createElement('div');
    scanner.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent);
        animation: scan 4s linear infinite;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes scan {
            0% { transform: translateY(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    header.style.position = 'relative';
    header.style.overflow = 'hidden';
    header.appendChild(scanner);
})();

// Add glitch effect on page load
(function() {
    function glitchTitle() {
        const h1 = document.querySelector('header h1');
        if (!h1) return;
        
        const originalText = h1.innerHTML;
        const glitchChars = '█▓▒░⚡◈◇◆◇◈⚡░▒▓█';
        
        let glitchCount = 0;
        const glitchInterval = setInterval(() => {
            if (glitchCount > 3) {
                h1.innerHTML = originalText;
                clearInterval(glitchInterval);
                return;
            }
            
            // Create glitched version
            let glitched = originalText.split('').map(char => {
                if (Math.random() > 0.9 && char !== '<' && char !== '>') {
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }
                return char;
            }).join('');
            
            h1.innerHTML = glitched;
            
            setTimeout(() => {
                h1.innerHTML = originalText;
            }, 50);
            
            glitchCount++;
        }, 200);
    }
    
    // Trigger on load and occasionally
    setTimeout(glitchTitle, 500);
    setInterval(() => {
        if (Math.random() > 0.95) glitchTitle();
    }, 10000);
})();
