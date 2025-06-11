// Project Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeProjectPage();
});

function initializeProjectPage() {
    setupImageLazyLoading();
    setupImageZoom();
    setupSmoothScrolling();
    setupProjectAnimations();
    trackProjectViews();
}

// Enhanced lazy loading for project images
function setupImageLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loading placeholder
                    img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
                    img.style.backgroundSize = '200% 100%';
                    img.style.animation = 'shimmer 1.5s infinite';
                    
                    // Handle successful load
                    img.addEventListener('load', function() {
                        this.style.background = 'none';
                        this.style.animation = 'none';
                        this.classList.add('loaded');
                    });
                    
                    // Handle load errors
                    img.addEventListener('error', function() {
                        this.src = createProjectPlaceholder(this.alt);
                        this.style.background = 'none';
                        this.style.animation = 'none';
                    });
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Add shimmer animation to CSS if not present
    if (!document.querySelector('#shimmer-styles')) {
        const shimmerStyles = `
            @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'shimmer-styles';
        styleSheet.textContent = shimmerStyles;
        document.head.appendChild(styleSheet);
    }
}

// Create placeholder for missing project images
function createProjectPlaceholder(altText) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f7fafc');
    gradient.addColorStop(1, '#e2e8f0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add DotPitch logo placeholder
    ctx.fillStyle = '#a0aec0';
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DotPitch', canvas.width / 2, canvas.height / 2 - 30);
    
    // Add project title
    ctx.fillStyle = '#718096';
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText(altText || 'Project Image', canvas.width / 2, canvas.height / 2 + 20);
    
    // Add subtle grid pattern
    ctx.strokeStyle = 'rgba(160, 174, 192, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    
    for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    return canvas.toDataURL();
}

// Image zoom functionality
function setupImageZoom() {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this);
        });
        
        // Add cursor pointer to indicate clickable
        img.style.cursor = 'zoom-in';
    });
}

// Image modal for full-size viewing
function openImageModal(img) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-backdrop">
            <div class="image-modal-content">
                <button class="image-modal-close">&times;</button>
                <img src="${img.src}" alt="${img.alt}">
                <div class="image-modal-caption">
                    <h4>${img.alt}</h4>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(4px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;
        }
        
        .image-modal-backdrop {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
        }
        
        .image-modal-content {
            position: relative;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            transform: scale(0.9);
            animation: modalZoomIn 0.3s ease forwards;
        }
        
        .image-modal img {
            max-width: 90vw;
            max-height: 80vh;
            width: auto;
            height: auto;
            display: block;
        }
        
        .image-modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.5rem;
            z-index: 1;
            transition: background 0.3s ease;
        }
        
        .image-modal-close:hover {
            background: rgba(0, 0, 0, 0.9);
        }
        
        .image-modal-caption {
            padding: 1.5rem;
            background: white;
        }
        
        .image-modal-caption h4 {
            margin: 0;
            font-size: 1.1rem;
            color: #2d3748;
        }
        
        @keyframes modalZoomIn {
            to { transform: scale(1); }
        }
    `;
    
    // Add styles if not present
    if (!document.querySelector('#image-modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'image-modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal functionality
    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    };
    
    modal.querySelector('.image-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.className === 'image-modal-backdrop') {
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

// Smooth scrolling for project navigation
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Project-specific animations
function setupProjectAnimations() {
    const animatedElements = document.querySelectorAll('.gallery-item, .principle-item, .related-item, .spec-category');
    
    // Stagger animations
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
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
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Track project page views and interactions
function trackProjectViews() {
    // Track page view
    if (typeof window.DotPitch !== 'undefined') {
        const projectTitle = document.querySelector('.project-hero h1')?.textContent || 'Unknown Project';
        window.DotPitch.trackEvent('project_page_view', { 
            project: projectTitle,
            page: window.location.pathname 
        });
    }
    
    // Track image interactions
    document.addEventListener('click', (e) => {
        if (e.target.matches('.gallery-item img')) {
            const imageName = e.target.alt || 'Unknown Image';
            if (typeof window.DotPitch !== 'undefined') {
                window.DotPitch.trackEvent('project_image_viewed', { 
                    image: imageName,
                    project: document.querySelector('.project-hero h1')?.textContent 
                });
            }
        }
        
        // Track navigation clicks
        if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
            const direction = e.target.closest('.nav-link').classList.contains('prev') ? 'previous' : 'next';
            if (typeof window.DotPitch !== 'undefined') {
                window.DotPitch.trackEvent('project_navigation', { direction });
            }
        }
        
        // Track related project clicks
        if (e.target.matches('.related-item') || e.target.closest('.related-item')) {
            const relatedProject = e.target.closest('.related-item').querySelector('h4')?.textContent;
            if (typeof window.DotPitch !== 'undefined') {
                window.DotPitch.trackEvent('related_project_click', { project: relatedProject });
            }
        }
    });
}

// Progress indicator for long pages
function setupProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
    
    const progressStyles = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(0, 0, 0, 0.1);
            z-index: 1001;
        }
        
        .reading-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    
    if (!document.querySelector('#progress-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'progress-styles';
        styleSheet.textContent = progressStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(progressBar);
    
    const progressBarFill = progressBar.querySelector('.reading-progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBarFill.style.width = scrollPercent + '%';
    });
}

// Initialize progress indicator for long project pages
if (document.body.scrollHeight > window.innerHeight * 2) {
    setupProgressIndicator();
}

// Copy link functionality
function setupCopyLink() {
    const copyLinkBtn = document.createElement('button');
    copyLinkBtn.className = 'copy-link-btn';
    copyLinkBtn.innerHTML = '🔗 Copy Link';
    copyLinkBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #2d3748;
        color: white;
        border: none;
        padding: 0.75rem 1rem;
        border-radius: 50px;
        cursor: pointer;
        font-size: 0.9rem;
        z-index: 1000;
        transition: all 0.3s ease;
        opacity: 0.8;
    `;
    
    copyLinkBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            copyLinkBtn.innerHTML = '✓ Copied!';
            setTimeout(() => {
                copyLinkBtn.innerHTML = '🔗 Copy Link';
            }, 2000);
            
            if (typeof window.DotPitch !== 'undefined') {
                window.DotPitch.trackEvent('project_link_copied');
            }
        } catch (err) {
            console.log('Copy failed:', err);
        }
    });
    
    copyLinkBtn.addEventListener('mouseenter', () => {
        copyLinkBtn.style.opacity = '1';
        copyLinkBtn.style.transform = 'translateY(-2px)';
    });
    
    copyLinkBtn.addEventListener('mouseleave', () => {
        copyLinkBtn.style.opacity = '0.8';
        copyLinkBtn.style.transform = 'translateY(0)';
    });
    
    document.body.appendChild(copyLinkBtn);
}

// Initialize copy link functionality
setupCopyLink();

// Export project functions
window.ProjectPage = {
    openImageModal,
    createProjectPlaceholder,
    setupImageZoom,
    setupProgressIndicator
};