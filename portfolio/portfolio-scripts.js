// Portfolio-specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    setupPortfolioFiltering();
    setupLazyLoading();
    setupPortfolioAnimations();
}

// Portfolio Filtering System
function setupPortfolioFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('filtered-out');
                    item.style.display = 'block';
                } else {
                    item.classList.add('filtered-out');
                    // Use timeout to allow CSS transition to complete
                    setTimeout(() => {
                        if (item.classList.contains('filtered-out')) {
                            item.style.display = 'none';
                        }
                    }, 500);
                }
            });
            
            // Track filter usage
            if (typeof window.DotPitch !== 'undefined') {
                window.DotPitch.trackEvent('portfolio_filter', { filter: filter });
            }
        });
    });
}

// Lazy Loading for Portfolio Images
function setupLazyLoading() {
    const images = document.querySelectorAll('.portfolio-image img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Create placeholder for failed loads
                    img.addEventListener('error', function() {
                        this.src = createPlaceholderImage(this.alt);
                    });
                    
                    // Remove observer once loaded
                    img.addEventListener('load', function() {
                        this.classList.add('loaded');
                    });
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.addEventListener('error', function() {
                this.src = createPlaceholderImage(this.alt);
            });
        });
    }
}

// Create placeholder image for missing files
function createPlaceholderImage(altText) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 400;
    canvas.height = 300;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f7fafc');
    gradient.addColorStop(1, '#e2e8f0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = '#718096';
    ctx.font = '16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw icon placeholder
    ctx.fillStyle = '#a0aec0';
    ctx.font = '48px sans-serif';
    ctx.fillText('🖼', canvas.width / 2, canvas.height / 2 - 20);
    
    // Draw alt text
    ctx.fillStyle = '#718096';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(altText || 'Portfolio Image', canvas.width / 2, canvas.height / 2 + 30);
    
    return canvas.toDataURL();
}

// Portfolio Animations
function setupPortfolioAnimations() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Stagger animation for portfolio items
    portfolioItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    portfolioItems.forEach(item => observer.observe(item));
}

// Portfolio Search Functionality (for future use)
function setupPortfolioSearch() {
    const searchInput = document.querySelector('.portfolio-search');
    if (!searchInput) return;
    
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        portfolioItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
                item.classList.remove('filtered-out');
            } else {
                item.classList.add('filtered-out');
                setTimeout(() => {
                    if (item.classList.contains('filtered-out')) {
                        item.style.display = 'none';
                    }
                }, 300);
            }
        });
    });
}

// Portfolio Modal/Lightbox (for future use)
function setupPortfolioModal() {
    const viewProjectLinks = document.querySelectorAll('.view-project');
    
    viewProjectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const portfolioItem = this.closest('.portfolio-item');
            const title = portfolioItem.querySelector('h3').textContent;
            const image = portfolioItem.querySelector('img').src;
            const description = portfolioItem.querySelector('.portfolio-overlay-content p').textContent;
            
            openPortfolioModal({
                title,
                image,
                description,
                // Add more project details here
            });
        });
    });
}

// Modal functionality
function openPortfolioModal(projectData) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'portfolio-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="portfolio-modal">
            <button class="modal-close">&times;</button>
            <div class="modal-content">
                <img src="${projectData.image}" alt="${projectData.title}">
                <div class="modal-info">
                    <h2>${projectData.title}</h2>
                    <p>${projectData.description}</p>
                    <div class="modal-actions">
                        <button class="btn-primary">View Live Project</button>
                        <button class="btn-secondary">View Case Study</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .portfolio-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;
        }
        
        .portfolio-modal {
            background: white;
            border-radius: 12px;
            max-width: 800px;
            max-height: 90vh;
            overflow: auto;
            position: relative;
            transform: scale(0.9);
            animation: modalSlideIn 0.3s ease forwards;
        }
        
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
            to { transform: scale(1); }
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.5rem;
            z-index: 1;
        }
        
        .modal-content img {
            width: 100%;
            height: auto;
            display: block;
        }
        
        .modal-info {
            padding: 2rem;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
    `;
    
    // Add styles to head if not already present
    if (!document.querySelector('#portfolio-modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'portfolio-modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add to page
    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden';
    
    // Close modal functionality
    const closeModal = () => {
        modalOverlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modalOverlay);
            document.body.style.overflow = '';
        }, 300);
    };
    
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Escape key closes modal
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Performance monitoring for portfolio
function trackPortfolioPerformance() {
    // Track page load time
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        if (typeof window.DotPitch !== 'undefined') {
            window.DotPitch.trackEvent('portfolio_page_load', { load_time: loadTime });
        }
    });
    
    // Track portfolio interactions
    document.addEventListener('click', (e) => {
        if (e.target.matches('.view-project')) {
            const projectTitle = e.target.closest('.portfolio-item').querySelector('h3').textContent;
            if (typeof window.DotPitch !== 'undefined') {
                window.DotPitch.trackEvent('portfolio_project_viewed', { project: projectTitle });
            }
        }
    });
}

// Initialize performance tracking
trackPortfolioPerformance();

// Export portfolio functions for external use
window.Portfolio = {
    setupPortfolioFiltering,
    setupLazyLoading,
    openPortfolioModal,
    createPlaceholderImage
};