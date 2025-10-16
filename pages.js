// Page-specific JavaScript functionality

// Project filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize project filtering only on the projects page (avoid research custom logic conflicts)
    const isProjectsPage = document.body && !document.body.classList.contains('research-page') && document.querySelector('h1.page-title')?.textContent.includes('Projects');
    if (isProjectsPage && document.querySelector('.filter-buttons')) {
        initProjectFilter();
    }
    
    // Initialize skill bars animation if on about page
    if (document.querySelector('.skill-progress')) {
        initSkillBars();
    }
    
    // Initialize FAQ functionality if on contact page
    if (document.querySelector('.faq-item')) {
        initFAQ();
    }
    
    // Initialize enhanced contact form if on contact page
    if (document.querySelector('#contactForm')) {
        initEnhancedContactForm();
    }
});

// Project filtering
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Initialize project links
    initProjectLinks();
}

// Project links functionality
function initProjectLinks() {
    const projectLinks = document.querySelectorAll('.project-link');
    
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const icon = this.querySelector('i');
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard.querySelector('.project-title').textContent;
            
            if (icon.classList.contains('fa-external-link-alt')) {
                // External link - redirect to GitHub profile
                window.open('https://github.com/tanyas8920', '_blank');
            } else if (icon.classList.contains('fa-github') || icon.classList.contains('fab-github')) {
                // GitHub link - redirect to GitHub profile
                window.open('https://github.com/tanyas8920', '_blank');
            }
        });
    });
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
                
                skillObserver.unobserve(progressBar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Enhanced contact form
function initEnhancedContactForm() {
    const form = document.querySelector('#contactForm');
    const submitBtn = form.querySelector('.btn-submit');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        setTimeout(() => {
            // Hide loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Show success message
            showEnhancedNotification('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
            
            // Reset form
            form.reset();
            
            // Scroll to top of form
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 2000);
    });
    
    // Real-time form validation
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (!value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required.`;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#DCA1A1';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #DCA1A1;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Get field label
function getFieldLabel(fieldName) {
    const labels = {
        'name': 'Full name',
        'email': 'Email address',
        'phone': 'Phone number',
        'subject': 'Subject',
        'message': 'Message'
    };
    return labels[fieldName] || fieldName;
}

// Enhanced notification system
function showEnhancedNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.enhanced-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `enhanced-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${getNotificationIcon(type)}"></i>
        </div>
        <div class="notification-content">
            <h4>${getNotificationTitle(type)}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--white);
        color: var(--text-primary);
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        display: flex;
        align-items: flex-start;
        gap: 15px;
        border-left: 4px solid ${getNotificationColor(type)};
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 6 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 6000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons['info'];
}

// Get notification title
function getNotificationTitle(type) {
    const titles = {
        'success': 'Success!',
        'error': 'Error',
        'warning': 'Warning',
        'info': 'Information'
    };
    return titles[type] || titles['info'];
}

// Get notification color
function getNotificationColor(type) {
    const colors = {
        'success': '#91DDF2',
        'error': '#DCA1A1',
        'warning': '#B8E6F5',
        'info': '#8BD3E6'
    };
    return colors[type] || colors['info'];
}

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-icon {
        font-size: 1.5rem;
        color: var(--pastel-blue-dark);
        margin-top: 2px;
    }
    
    .notification-content h4 {
        margin: 0 0 5px 0;
        font-size: 1rem;
        font-weight: 600;
    }
    
    .notification-content p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        color: var(--text-secondary);
        transition: color 0.3s ease;
    }
    
    .notification-close:hover {
        color: var(--text-primary);
    }
`;
document.head.appendChild(animationStyles);

// Page-specific animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.overview-card, .value-card, .achievement-card, .project-card, .timeline-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Enhanced mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});

// Add loading states for buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.type === 'submit' || this.classList.contains('btn-submit')) {
                return; // Let form handling take care of this
            }
            
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple animation
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);
