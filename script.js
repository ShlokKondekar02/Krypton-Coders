/**
 * KRYPTON CODERS - OFFICIAL WEBSITE LOGIC
 * Dynamic interactive features, particle canvas, playground sandbox,
 * event filtering, modals, counters and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initDynamicTyping();
  initScrollEffects();
  initStatsCounter();
  initMobileNav();
  initEventFilter();
  initCodePlayground();
  initFaqAccordion();
  initModals();
  initForms();
});

/* ==========================================================================
   1. Interactive Particle / Network Canvas
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
  const maxDistance = 140;

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.75;
      this.vy = (Math.random() - 0.5) * 0.75;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(0, 245, 155, ' : 'rgba(0, 210, 255, ';
      this.alpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 245, 155, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Dynamic Typing Text in Hero
   ========================================================================== */
function initDynamicTyping() {
  const dynamicElement = document.getElementById('dynamic-word');
  if (!dynamicElement) return;

  const words = [
    'Executable Code',
    'Fun Projects',
    'Hackathon Teams',
    'Problem Solving',
    'Tech Friendships'
  ];

  let wordIndex = 0;
  let charIndex = words[0].length;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeCycle() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      dynamicElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      dynamicElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before typing new word
    }

    setTimeout(typeCycle, typingSpeed);
  }

  // Start after small initial delay
  setTimeout(typeCycle, 1500);
}

/* ==========================================================================
   3. Scroll Effects (Navbar Shadow, Active Link Highlighting)
   ========================================================================== */
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Navbar glass blur style on scroll
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSection = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. Stats Number Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const statsStrip = document.getElementById('stats-counter-strip');
  if (!statsStrip) return;

  let hasAnimated = false;
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach((stat) => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const duration = 1800; // ms
          const stepTime = 30;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target + '+';
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(current) + '+';
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsStrip);
}

/* ==========================================================================
   5. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileJoinBtn = document.getElementById('mobile-join-btn');

  if (!hamburgerBtn || !navMenu) return;

  function toggleMenu() {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  }

  hamburgerBtn.addEventListener('click', toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  if (mobileJoinBtn) {
    mobileJoinBtn.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
      openJoinModal();
    });
  }
}

/* ==========================================================================
   6. Events Filtering
   ========================================================================== */
function initEventFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const eventCards = document.querySelectorAll('.event-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      eventCards.forEach((card) => {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Injected simple keyframe for event filter transition
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInCard {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

/* ==========================================================================
   7. Interactive In-Browser Code Playground
   ========================================================================== */
function initCodePlayground() {
  const editor = document.getElementById('code-editor');
  const runBtn = document.getElementById('run-code-btn');
  const resetBtn = document.getElementById('reset-code-btn');
  const clearBtn = document.getElementById('clear-console-btn');
  const consoleOutput = document.getElementById('console-output');

  if (!editor || !runBtn || !consoleOutput) return;

  const defaultCode = editor.value;

  function runCode() {
    consoleOutput.innerHTML = '';
    const userCode = editor.value;

    const logMessages = [];
    const originalConsoleLog = console.log;

    try {
      // Intercept console.log inside the evaluation
      console.log = (...args) => {
        const formatted = args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            return JSON.stringify(arg, null, 2);
          }
          return String(arg);
        }).join(' ');
        logMessages.push(formatted);
      };

      // Execute code safely using Function constructor
      const runner = new Function(userCode);
      runner();

      if (logMessages.length === 0) {
        consoleOutput.innerHTML = `<span class="console-entry-success">// Code executed successfully (no console.log output).</span>`;
      } else {
        consoleOutput.innerHTML = logMessages
          .map(msg => `<div>${escapeHtml(msg)}</div>`)
          .join('');
      }
      showToast('Sandbox Executed', 'Your JavaScript snippet ran smoothly!', 'success');
    } catch (err) {
      consoleOutput.innerHTML = `<span class="console-entry-error">// Runtime Error: ${escapeHtml(err.message)}</span>`;
      showToast('Execution Error', err.message, 'error');
    } finally {
      console.log = originalConsoleLog;
    }
  }

  runBtn.addEventListener('click', runCode);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      editor.value = defaultCode;
      consoleOutput.innerHTML = '<span class="console-placeholder">// Code restored to default. Click "Run Code".</span>';
      showToast('Reset Complete', 'Playground code has been restored.', 'info');
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      consoleOutput.innerHTML = '<span class="console-placeholder">// Console cleared.</span>';
    });
  }
}

function escapeHtml(string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   8. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    if (!trigger || !content) return;

    // Set initial height for active items
    if (item.classList.contains('active')) {
      content.style.maxHeight = content.scrollHeight + 'px';
      trigger.setAttribute('aria-expanded', 'true');
    }

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for clean accordion UX
      accordionItems.forEach((otherItem) => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.accordion-content');
        const otherTrigger = otherItem.querySelector('.accordion-trigger');
        if (otherContent) otherContent.style.maxHeight = null;
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   9. Join Modal Logic
   ========================================================================== */
function openJoinModal(prefillReason = '') {
  const modal = document.getElementById('join-modal');
  if (!modal) return;

  if (prefillReason) {
    const reasonField = document.getElementById('applicant-reason');
    if (reasonField) reasonField.value = prefillReason;
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const firstInput = modal.querySelector('input');
  if (firstInput) setTimeout(() => firstInput.focus(), 150);
}

function closeJoinModal() {
  const modal = document.getElementById('join-modal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initModals() {
  const modal = document.getElementById('join-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const openBtns = document.querySelectorAll('.open-join-modal-btn');
  const eventRegisterBtns = document.querySelectorAll('.register-event-btn');

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openJoinModal();
    });
  });

  eventRegisterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const eventName = btn.getAttribute('data-event-name') || 'Upcoming Event';
      openJoinModal(`Interested in registering for: ${eventName}`);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeJoinModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeJoinModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeJoinModal();
    }
  });
}

/* ==========================================================================
   10. Form Submissions & Validation
   ========================================================================== */
function initForms() {
  // Join Application Form
  const joinForm = document.getElementById('join-form');
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('applicant-name');
      const emailInput = document.getElementById('applicant-email');
      const yearSelect = document.getElementById('applicant-year');
      const domainSelect = document.getElementById('applicant-domain');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        showFieldError(nameInput, 'name-error', true);
        isValid = false;
      } else {
        showFieldError(nameInput, 'name-error', false);
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        showFieldError(emailInput, 'email-error', true);
        isValid = false;
      } else {
        showFieldError(emailInput, 'email-error', false);
      }

      // Validate Year
      if (!yearSelect.value) {
        showFieldError(yearSelect, 'year-error', true);
        isValid = false;
      } else {
        showFieldError(yearSelect, 'year-error', false);
      }

      // Validate Domain
      if (!domainSelect.value) {
        showFieldError(domainSelect, 'domain-error', true);
        isValid = false;
      } else {
        showFieldError(domainSelect, 'domain-error', false);
      }

      if (isValid) {
        const applicantName = nameInput.value.trim();
        closeJoinModal();
        joinForm.reset();

        showToast(
          'Application Received! 🚀',
          `Welcome aboard, ${applicantName}! We will email you the Discord invite shortly.`,
          'success'
        );
      }
    });
  }

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailField = document.getElementById('newsletter-email');
      if (emailField && emailField.value.trim()) {
        const email = emailField.value.trim();
        emailField.value = '';
        showToast(
          'Subscribed!',
          `You've been added to the Krypton newsletter. Stay tuned!`,
          'success'
        );
      }
    });
  }
}

function showFieldError(inputElement, errorId, hasError) {
  const errorElement = document.getElementById(errorId);
  if (hasError) {
    inputElement.classList.add('error');
    if (errorElement) errorElement.classList.add('visible');
  } else {
    inputElement.classList.remove('error');
    if (errorElement) errorElement.classList.remove('visible');
  }
}

/* ==========================================================================
   11. Toast Notification Utility
   ========================================================================== */
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;

  const iconClass = type === 'error'
    ? 'fa-solid fa-triangle-exclamation'
    : 'fa-solid fa-circle-check';

  toast.innerHTML = `
    <i class="${iconClass} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-msg">${escapeHtml(message)}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-hide');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4200);
}
