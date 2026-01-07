'use strict';

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

const isInViewport = (element, threshold = 0.1) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height * threshold) >= 0);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

  return vertInView && horInView;
};

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

class Navigation {
  constructor() {
    this.nav = document.getElementById('mainNav');
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav__link');

    this.init();
  }

  init() {
    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > 50) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    }, 100));

    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMenu());
    }

    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleLinkClick(e));
    });

    document.addEventListener('click', (e) => {
      if (this.navMenu.classList.contains('is-open')) {
        if (!this.nav.contains(e.target)) {
          this.closeMenu();
        }
      }
    });

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

      this.closeMenu();
    }
  }
}

class DarkMode {
  constructor() {
    this.darkModeToggle = document.getElementById('darkModeToggle');
    this.init();
    this.loadSavedMode();
  }

  init() {
    if (!this.darkModeToggle) return;

    this.darkModeToggle.addEventListener('click', () => this.toggle());

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
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
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setMode(true);
      }
    }
  }
}

class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('[data-scroll-animation]');
    this.init();
  }

  init() {
    this.checkElements();

    window.addEventListener('scroll', throttle(() => {
      this.checkElements();
    }, 100));

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
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    if (!this.validateForm(data)) {
      this.showMessage('Please fill in all fields correctly.', 'error');
      return;
    }

    try {
      await this.simulateFormSubmission(data);

      this.showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
      this.form.reset();
    } catch (error) {
      this.showMessage('Oops! Something went wrong. Please try again.', 'error');
    }
  }

  validateForm(data) {
    if (!data.name || !data.email || !data.subject || !data.message) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return false;
    }

    return true;
  }

  simulateFormSubmission(data) {
    return new Promise((resolve) => {
      console.log('Form data:', data);
      setTimeout(resolve, 1000);
    });
  }

  showMessage(message, type) {
    this.messageDiv.textContent = message;
    this.messageDiv.className = `form-message ${type}`;

    setTimeout(() => {
      this.messageDiv.style.opacity = '0';
      setTimeout(() => {
        this.messageDiv.className = 'form-message';
        this.messageDiv.style.opacity = '1';
      }, 300);
    }, 5000);
  }
}

class BackToTop {
  constructor() {
    this.button = document.getElementById('backToTop');
    this.init();
  }

  init() {
    if (!this.button) return;

    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > 500) {
        this.button.classList.add('is-visible');
      } else {
        this.button.classList.remove('is-visible');
      }
    }, 100));

    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

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

class StatSources {
  constructor() {
    this.expandableCards = document.querySelectorAll('.stat-card--expandable');
    this.expandBtns = document.querySelectorAll('.stat-card__expand-btn');
    this.expandDetails = document.querySelectorAll('.stat-card__details');
    this.isExpanded = false;
    this.mobileBreakpoint = 768;
    this.wasMobile = this.isMobile();
    this.init();
  }

  init() {
    this.setupExpandables();
    window.addEventListener('resize', debounce(() => {
      this.handleResize();
    }, 200));
  }

  handleResize() {
    const isMobileNow = this.isMobile();

    if (this.wasMobile !== isMobileNow) {
      this.isExpanded = false;
      this.closeAllExpandables();

      this.wasMobile = isMobileNow;
    }
  }

  isMobile() {
    return window.innerWidth <= this.mobileBreakpoint;
  }

  setupExpandables() {
    this.expandBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        if (this.isMobile()) {
          this.toggleSingleExpandable(index);
        } else {
          this.toggleAllExpandables();
        }
      });

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

    btn.setAttribute('aria-expanded', !isExpanded);
    if (isExpanded) {
      details.classList.remove('is-expanded');
    } else {
      details.classList.add('is-expanded');
    }
  }

  toggleAllExpandables() {
    this.isExpanded = !this.isExpanded;

    this.expandBtns.forEach(btn => {
      btn.setAttribute('aria-expanded', this.isExpanded);
    });

    this.expandDetails.forEach(details => {
      if (this.isExpanded) {
        details.classList.add('is-expanded');
      } else {
        details.classList.remove('is-expanded');
      }
    });
  }

  closeAllExpandables() {
    this.expandBtns.forEach(btn => {
      btn.setAttribute('aria-expanded', false);
    });

    this.expandDetails.forEach(details => {
      details.classList.remove('is-expanded');
    });
  }
}

class AccessibilityEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();

    this.setupLiveRegions();
  }

  setupKeyboardNavigation() {
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
    const liveRegions = document.querySelectorAll('[aria-live]');
    liveRegions.forEach(region => {
      region.setAttribute('aria-atomic', 'true');
    });
  }
}

function setupSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not(.nav__link)');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');

      if (targetId === '#' || targetId === '#!') return;

      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        e.preventDefault();

        const nav = document.getElementById('mainNav');
        const navHeight = nav ? nav.offsetHeight : 0;
        const isMobile = window.innerWidth <= 768;
        const extraOffset = isMobile ? 20 : 0;
        const targetPosition = targetSection.offsetTop - navHeight - extraOffset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

class ProjectModal {
  constructor() {
    this.modal = document.getElementById('projectModal');
    this.modalOverlay = this.modal?.querySelector('.project-modal__overlay');
    this.modalContainer = this.modal?.querySelector('.project-modal__container');
    this.closeButtons = this.modal?.querySelectorAll('[data-modal-close]');
    this.clickableProjects = document.querySelectorAll('.timeline__item--clickable[data-project]');

    this.modalLogo = document.getElementById('modalLogo');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalSubtitle = document.getElementById('modalSubtitle');
    this.modalDescription = document.getElementById('modalDescription');
    this.modalHighlights = document.getElementById('modalHighlights');
    this.modalStats = document.getElementById('modalStats');
    this.modalCTA = document.getElementById('modalCTA');
    this.modalCTAText = document.getElementById('modalCTAText');
    this.modalCTATop = document.getElementById('modalCTATop');
    this.modalCTATextTop = document.getElementById('modalCTATextTop');

    this.currentLanguage = document.documentElement.lang || 'en';

    this.projectData = {
      'language-space': {
        en: {
          logo: 'assets/ls_logo.png',
          title: 'Language Space',
          subtitle: 'Discord Community for Language Learners',
          description: 'Language Space is a Discord community dedicated to bringing people together from around the world to learn languages, share cultures, and build meaningful connections. As one of the founding moderators and community builders, I help create an inclusive environment where members can practice languages through voice channels, text conversations, and organized events. Our community focuses on practical language learning combined with genuine cultural exchange, making the learning process both effective and enjoyable.',
          highlights: [
            'Co-found and manage a community of 300+ active language learners.',
            'Organize voice chat sessions, language exchanges, and cultural events (also cooking sessions!)',
            'Collaborate with international moderators'
          ],
          stats: [
            { value: '300+', label: 'Active Members' },
            { value: '50+', label: 'Languages' },
          ],
          ctaText: 'Join the Community',
          ctaUrl: 'https://discord.com/invite/DfQESyV26V'
        },
        it: {
          logo: 'assets/ls_logo.png',
          title: 'Language Space',
          subtitle: 'Community Discord per Studenti di Lingue',
          description: 'Language Space è una vivace community Discord dedicata a riunire persone da tutto il mondo per imparare lingue, condividere culture e costruire connessioni significative. Come uno dei moderatori fondatori e costruttori della community, aiuto a creare un ambiente inclusivo dove i membri possono praticare le lingue attraverso canali vocali, conversazioni testuali ed eventi organizzati. La nostra community si concentra sull\'apprendimento pratico delle lingue combinato con un autentico scambio culturale, rendendo il processo di apprendimento efficace e piacevole.',
          highlights: [
            'Co-fondatore e gestore di una community di oltre 300 studenti di lingue attivi',
            'Organizzazione di sessioni di scambi linguistici ed eventi culturali (anche sessioni di cucina!)',
            'Collaborazione con moderatori internazionali'
          ],
          stats: [
            { value: '300+', label: 'Membri Attivi' },
            { value: '50+', label: 'Lingue' },
          ],
          ctaText: 'Unisciti alla Community',
          ctaUrl: 'https://discord.com/invite/DfQESyV26V'
        }
      },
      'eutimiamo': {
        en: {
          logo: 'assets/eutimiamo_logo.png',
          title: 'Eutimiamo',
          subtitle: 'Psychology Education & Documentary Content',
          description: 'Eutimiamo started as a passion project to make psychology accessible and engaging for Italian-speaking audiences. What began as an Instagram page sharing psychology facts evolved into a full-fledged YouTube channel producing high-quality documentary-style videos. I handle the complete production pipeline: from researching complex psychological concepts and writing scripts, to editing compelling videos in Premiere Pro and designing eye-catching thumbnails in Photoshop. The channel focuses on deep dives into psychological phenomena, mental health topics, and fascinating aspects of human behavior, presented in an educational yet entertaining format.',
          highlights: [
            'Built an audience of 26K+ YouTube subscribers and 28K+ Instagram followers',
            'Complete production workflow: research, scripting, editing in Premiere Pro, and thumbnail design in Photoshop'
          ],
          stats: [
            { value: '26K+', label: 'YouTube Subs' },
            { value: '28K+', label: 'Instagram Followers' },
            { value: '34.9M+', label: 'Cross-platform Views' },
            { value: '144+', label: 'Videos Published' }
          ],
          ctaText: 'View the Channel',
          ctaUrl: 'https://www.youtube.com/@eutimiamo'
        },
        it: {
          logo: 'assets/eutimiamo_logo.png',
          title: 'Eutimiamo',
          subtitle: 'Educazione Psicologica e Contenuti Documentari',
          description: 'Eutimiamo è nato come progetto personale per rendere la psicologia accessibile e coinvolgente per il pubblico italiano. Ciò che è iniziato come una pagina Instagram che condivideva curiosità di psicologia si è evoluto in un canale YouTube a tutti gli effetti che produce video documentari di alta qualità. Gestisco l\'intera pipeline di produzione: dalla ricerca di concetti psicologici complessi e scrittura degli script, al montaggio di video avvincenti in Premiere Pro e alla progettazione di miniature accattivanti in Photoshop. Il canale si concentra su approfondimenti di fenomeni psicologici, argomenti di salute mentale e aspetti affascinanti del comportamento umano, presentati in un formato educativo ma divertente.',
          highlights: [
            'Costruito un pubblico di oltre 26K iscritti YouTube e oltre 28K follower Instagram',
            'Flusso di produzione completo: ricerca, sceneggiatura, montaggio in Premiere Pro e progettazione miniature in Photoshop'
          ],
          stats: [
            { value: '26K+', label: 'Iscritti YouTube' },
            { value: '28K+', label: 'Follower Instagram' },
            { value: '34.9M+', label: 'Visualizzazioni Multi-piattaforma' },
            { value: '144+', label: 'Video Pubblicati' }
          ],
          ctaText: 'Vedi il Canale',
          ctaUrl: 'https://www.youtube.com/@eutimiamo'
        }
      }
    };

    this.init();
  }

  init() {
    if (!this.modal) return;

    this.clickableProjects.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target.closest('a')) return;

        const projectId = card.dataset.project;
        this.openModal(projectId);
      });

      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const projectId = card.dataset.project;
          this.openModal(projectId);
        }
      });
    });

    this.closeButtons.forEach(button => {
      button.addEventListener('click', () => this.closeModal());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('is-open')) {
        this.closeModal();
      }
    });

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal || e.target === this.modalOverlay) {
        this.closeModal();
      }
    });

    this.modalContainer.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  openModal(projectId) {
    const projectLangData = this.projectData[projectId];
    if (!projectLangData) return;

    const project = projectLangData[this.currentLanguage] || projectLangData['en'];

    this.modalLogo.src = project.logo;
    this.modalLogo.alt = `${project.title} Logo`;
    this.modalTitle.textContent = project.title;
    this.modalSubtitle.textContent = project.subtitle;
    this.modalDescription.textContent = project.description;

    this.modalHighlights.innerHTML = '';
    project.highlights.forEach(highlight => {
      const li = document.createElement('li');
      li.textContent = highlight;
      this.modalHighlights.appendChild(li);
    });

    this.modalStats.innerHTML = '';
    project.stats.forEach(stat => {
      const statDiv = document.createElement('div');
      statDiv.className = 'project-modal__stat';
      statDiv.innerHTML = `
        <span class="project-modal__stat-value">${stat.value}</span>
        <span class="project-modal__stat-label">${stat.label}</span>
      `;
      this.modalStats.appendChild(statDiv);
    });

    this.modalCTAText.textContent = project.ctaText;
    this.modalCTA.href = project.ctaUrl;
    this.modalCTATextTop.textContent = project.ctaText;
    this.modalCTATop.href = project.ctaUrl;

    document.body.classList.add('modal-open');

    this.modal.classList.add('is-open');
    this.modal.setAttribute('aria-hidden', 'false');

    this.modalContainer.scrollTop = 0;

    setTimeout(() => {
      const closeButton = this.modal.querySelector('.project-modal__close');
      if (closeButton) closeButton.focus();
    }, 100);

    this.trapFocus();
  }

  closeModal() {
    this.modal.classList.remove('is-open');
    this.modal.setAttribute('aria-hidden', 'true');

    document.body.classList.remove('modal-open');

    const openCard = document.querySelector('.timeline__item--clickable[data-project]:focus');
    if (openCard) {
      openCard.focus();
    }
  }

  trapFocus() {
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (!this.modal.classList.contains('is-open')) {
        document.removeEventListener('keydown', handleTabKey);
        return;
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
  }
}

document.addEventListener('DOMContentLoaded', () => {
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
  new ProjectModal();

  setupSmoothScrolling();

  document.body.classList.add('loaded');

  console.log('%c Portfolio Initialized Successfully! ',
    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;');
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Page hidden - pausing non-critical animations');
  } else {
    console.log('Page visible - resuming animations');
  }
});

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
  });
}

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