/**
 * ============================================
 * Andrea Gravina Portfolio - JavaScript
 * ============================================
 *
 * Features:
 * - Smooth scrolling and navigation
 * - Theme customization panel
 * - Scroll animations
 * - Experience filtering
 * - Skill progress animations
 * - Contact form handling
 * - Performance optimizations
 */

'use strict';

// ============================================
// Utility Functions
// ============================================

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {Number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait = 100) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function execution rate
 * @param {Function} func - Function to throttle
 * @param {Number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
const throttle = (func, limit = 100) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if element is in viewport
 * @param {Element} element - DOM element to check
 * @param {Number} threshold - Visibility threshold (0-1)
 * @returns {Boolean} True if element is visible
 */
const isInViewport = (element, threshold = 0.1) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height * threshold) >= 0);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

  return vertInView && horInView;
};

/**
 * Animate number counter
 * @param {Element} element - Target element
 * @param {Number} target - Target number
 * @param {Number} duration - Animation duration in ms
 */
const animateCounter = (element, target, duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
};

// ============================================
// Navigation
// ============================================

class Navigation {
  constructor() {
    this.nav = document.getElementById('mainNav');
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav__link');

    this.init();
  }

  init() {
    // Scroll effect on navigation
    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > 50) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    }, 100));

    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMenu());
    }

    // Smooth scroll on navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleLinkClick(e));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.navMenu.classList.contains('is-open')) {
        if (!this.nav.contains(e.target)) {
          this.closeMenu();
        }
      }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.navMenu.classList.contains('is-open')) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    const isOpen = this.navMenu.classList.toggle('is-open');
    this.navToggle.setAttribute('aria-expanded', isOpen);
  }

  closeMenu() {
    this.navMenu.classList.remove('is-open');
    this.navToggle.setAttribute('aria-expanded', 'false');
  }

  handleLinkClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const navHeight = this.nav.offsetHeight;
      const targetPosition = targetSection.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      this.closeMenu();
    }
  }
}

// ============================================
// Dark Mode Toggle
// ============================================

class DarkMode {
  constructor() {
    this.darkModeToggle = document.getElementById('darkModeToggle');
    this.init();
    this.loadSavedMode();
  }

  init() {
    if (!this.darkModeToggle) return;

    // Toggle dark mode on click
    this.darkModeToggle.addEventListener('click', () => this.toggle());

    // Optional: Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('darkMode')) {
          this.setMode(e.matches);
        }
      });
    }
  }

  toggle() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
  }

  setMode(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  loadSavedMode() {
    const savedMode = localStorage.getItem('darkMode');

    if (savedMode === 'enabled') {
      this.setMode(true);
    } else if (savedMode === 'disabled') {
      this.setMode(false);
    } else {
      // No saved preference, check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setMode(true);
      }
    }
  }
}

// ============================================
// Scroll Animations
// ============================================

class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('[data-scroll-animation]');
    this.init();
  }

  init() {
    // Initial check for elements already in viewport
    this.checkElements();

    // Listen for scroll events
    window.addEventListener('scroll', throttle(() => {
      this.checkElements();
    }, 100));

    // Also check on resize
    window.addEventListener('resize', debounce(() => {
      this.checkElements();
    }, 200));
  }

  checkElements() {
    this.animatedElements.forEach(element => {
      if (isInViewport(element, 0.1) && !element.classList.contains('is-visible')) {
        element.classList.add('is-visible');
      }
    });
  }
}

// ============================================
// Experience Filter
// ============================================

class ExperienceFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.timelineItems = document.querySelectorAll('.timeline__item');
    this.currentFilter = 'all';

    this.init();
  }

  init() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        this.applyFilter(filter);
        this.setActiveButton(button);
      });
    });
  }

  applyFilter(filter) {
    this.currentFilter = filter;

    this.timelineItems.forEach(item => {
      const categories = item.dataset.category?.split(' ') || [];

      if (filter === 'all') {
        item.classList.remove('is-hidden');
        // Trigger reflow for animation
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 10);
      } else {
        if (categories.includes(filter)) {
          item.classList.remove('is-hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.classList.add('is-hidden');
          }, 300);
        }
      }
    });
  }

  setActiveButton(activeButton) {
    this.filterButtons.forEach(button => {
      button.classList.remove('filter-btn--active');
    });
    activeButton.classList.add('filter-btn--active');
  }
}

// ============================================
// Skills Progress Animation
// ============================================

class SkillsProgress {
  constructor() {
    this.skillBars = document.querySelectorAll('.skill-item__progress');
    this.animated = new Set();
    this.init();
  }

  init() {
    window.addEventListener('scroll', throttle(() => {
      this.animateVisibleBars();
    }, 100));

    // Initial check
    this.animateVisibleBars();
  }

  animateVisibleBars() {
    this.skillBars.forEach(bar => {
      if (isInViewport(bar.parentElement, 0.3) && !this.animated.has(bar)) {
        const progress = bar.dataset.progress;
        bar.style.setProperty('--progress-width', `${progress}%`);
        bar.classList.add('is-visible');
        this.animated.add(bar);
      }
    });
  }
}

// ============================================
// Stats Counter Animation
// ============================================

class StatsCounter {
  constructor() {
    this.statNumbers = document.querySelectorAll('[data-count]');
    this.animated = false;
    this.init();
  }

  init() {
    window.addEventListener('scroll', throttle(() => {
      this.checkAndAnimate();
    }, 100));

    // Initial check
    this.checkAndAnimate();
  }

  checkAndAnimate() {
    if (this.animated) return;

    const firstStat = this.statNumbers[0];
    if (firstStat && isInViewport(firstStat, 0.5)) {
      this.animateCounters();
      this.animated = true;
    }
  }

  animateCounters() {
    this.statNumbers.forEach(element => {
      const target = parseInt(element.dataset.count);
      animateCounter(element, target, 2000);
    });
  }
}

// ============================================
// Contact Form
// ============================================

class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.messageDiv = document.getElementById('formMessage');
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  async handleSubmit() {
    // Get form data
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    if (!this.validateForm(data)) {
      this.showMessage('Please fill in all fields correctly.', 'error');
      return;
    }

    try {
      // In a real application, you would send this to a server
      // For now, we'll simulate a successful submission
      await this.simulateFormSubmission(data);

      this.showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
      this.form.reset();
    } catch (error) {
      this.showMessage('Oops! Something went wrong. Please try again.', 'error');
    }
  }

  validateForm(data) {
    // Check if all fields are filled
    if (!data.name || !data.email || !data.subject || !data.message) {
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return false;
    }

    return true;
  }

  simulateFormSubmission(data) {
    // Simulate API call
    return new Promise((resolve) => {
      console.log('Form data:', data);
      setTimeout(resolve, 1000);
    });
  }

  showMessage(message, type) {
    this.messageDiv.textContent = message;
    this.messageDiv.className = `form-message ${type}`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.messageDiv.style.opacity = '0';
      setTimeout(() => {
        this.messageDiv.className = 'form-message';
        this.messageDiv.style.opacity = '1';
      }, 300);
    }, 5000);
  }
}

// ============================================
// Back to Top Button
// ============================================

class BackToTop {
  constructor() {
    this.button = document.getElementById('backToTop');
    this.init();
  }

  init() {
    if (!this.button) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > 500) {
        this.button.classList.add('is-visible');
      } else {
        this.button.classList.remove('is-visible');
      }
    }, 100));

    // Scroll to top on click
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// ============================================
// Performance Optimizations
// ============================================

/**
 * Lazy load images when they come into viewport
 */
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
          }
        });
      }, {
        rootMargin: '50px'
      });

      this.images.forEach(img => this.observer.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      this.images.forEach(img => this.loadImage(img));
    }
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    img.src = src;
    img.removeAttribute('data-src');

    if (this.observer) {
      this.observer.unobserve(img);
    }
  }
}

// ============================================
// Stat Sources - Different Behavior for Mobile/Desktop
// ============================================

class StatSources {
  constructor() {
    // Get all expandable stat cards
    this.expandableCards = document.querySelectorAll('.stat-card--expandable');
    this.expandBtns = document.querySelectorAll('.stat-card__expand-btn');
    this.expandDetails = document.querySelectorAll('.stat-card__details');
    this.isExpanded = false;
    this.mobileBreakpoint = 768;
    this.init();
  }

  init() {
    this.setupExpandables();
    // Listen for window resize to potentially reset state
    window.addEventListener('resize', debounce(() => {
      this.handleResize();
    }, 200));
  }

  handleResize() {
    // Reset all states when switching between mobile and desktop
    if (this.isMobile()) {
      // Close all when switching to mobile
      this.closeAllExpandables();
    } else {
      // Reset desktop state
      this.isExpanded = false;
      this.closeAllExpandables();
    }
  }

  isMobile() {
    return window.innerWidth <= this.mobileBreakpoint;
  }

  // Setup all expandable stat cards
  setupExpandables() {
    this.expandBtns.forEach((btn, index) => {
      // Click event
      btn.addEventListener('click', () => {
        if (this.isMobile()) {
          // Mobile: toggle only this card
          this.toggleSingleExpandable(index);
        } else {
          // Desktop: toggle all cards
          this.toggleAllExpandables();
        }
      });

      // Keyboard interaction
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (this.isMobile()) {
            this.toggleSingleExpandable(index);
          } else {
            this.toggleAllExpandables();
          }
        }
      });
    });
  }

  toggleSingleExpandable(index) {
    const btn = this.expandBtns[index];
    const details = this.expandDetails[index];
    const isExpanded = details.classList.contains('is-expanded');

    // Toggle this specific card
    btn.setAttribute('aria-expanded', !isExpanded);
    if (isExpanded) {
      details.classList.remove('is-expanded');
    } else {
      details.classList.add('is-expanded');
    }
  }

  toggleAllExpandables() {
    this.isExpanded = !this.isExpanded;

    // Update all buttons
    this.expandBtns.forEach(btn => {
      btn.setAttribute('aria-expanded', this.isExpanded);
    });

    // Update all details sections
    this.expandDetails.forEach(details => {
      if (this.isExpanded) {
        details.classList.add('is-expanded');
      } else {
        details.classList.remove('is-expanded');
      }
    });
  }

  closeAllExpandables() {
    // Update all buttons
    this.expandBtns.forEach(btn => {
      btn.setAttribute('aria-expanded', false);
    });

    // Update all details sections
    this.expandDetails.forEach(details => {
      details.classList.remove('is-expanded');
    });
  }
}

// ============================================
// Accessibility Enhancements
// ============================================

class AccessibilityEnhancements {
  constructor() {
    this.init();
  }

  init() {
    // Add keyboard navigation for custom interactive elements
    this.setupKeyboardNavigation();

    // Announce dynamic content changes to screen readers
    this.setupLiveRegions();
  }

  setupKeyboardNavigation() {
    // Allow Enter key to activate buttons
    const customButtons = document.querySelectorAll('[role="button"]:not(button)');
    customButtons.forEach(element => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });
  }

  setupLiveRegions() {
    // Ensure ARIA live regions are properly announced
    const liveRegions = document.querySelectorAll('[aria-live]');
    liveRegions.forEach(region => {
      // Force screen readers to recognize changes
      region.setAttribute('aria-atomic', 'true');
    });
  }
}

// ============================================
// Initialize Everything
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new Navigation();
  new DarkMode();
  new ScrollAnimations();
  new ExperienceFilter();
  new SkillsProgress();
  new StatsCounter();
  new StatSources();
  new ContactForm();
  new BackToTop();
  new LazyLoader();
  new AccessibilityEnhancements();

  // Add loaded class to body for CSS hooks
  document.body.classList.add('loaded');

  // Log initialization (remove in production)
  console.log('%c Portfolio Initialized Successfully! ',
    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;');
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, pause animations if needed
    console.log('Page hidden - pausing non-critical animations');
  } else {
    // Page is visible, resume animations
    console.log('Page visible - resuming animations');
  }
});

// Service Worker registration (optional - for PWA capabilities)
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    // Uncomment to register a service worker
    // navigator.serviceWorker.register('/sw.js')
    //   .then(reg => console.log('Service Worker registered', reg))
    //   .catch(err => console.log('Service Worker registration failed', err));
  });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Navigation,
    DarkMode,
    ScrollAnimations,
    ExperienceFilter,
    SkillsProgress,
    StatsCounter,
    ContactForm,
    BackToTop
  };
}