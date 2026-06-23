/**
 * RecruitPro — Main JavaScript
 * Theme Switching, Mobile Nav, Form Validation, Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  initTheme();
  initRTL();
  initMobileMenu();
  initFormValidation();
  initScrollAnimations();
  initCounterAnimations();
  initJobApplyLinks();
});

/* ---- Theme Switching ---- */
function initTheme() {
  const saved = localStorage.getItem('theme');

  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  });
}

/* ---- RTL Toggling ---- */
function initRTL() {
  const savedDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.dir = savedDir;
  
  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.textContent = savedDir === 'rtl' ? 'LTR' : 'RTL';
    
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.dir || 'ltr';
      const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      
      document.documentElement.dir = nextDir;
      localStorage.setItem('dir', nextDir);
      
      document.querySelectorAll('.rtl-toggle-btn').forEach(b => {
        b.textContent = nextDir === 'rtl' ? 'LTR' : 'RTL';
      });
    });
  });
}

/* ---- Mobile Navigation ---- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navActions = document.querySelector('.nav-actions');
  const navContainer = document.querySelector('.nav-container');

  // Create overlay
  let overlay = document.querySelector('.menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
  }

  // Clone Brand for Mobile Menu
  const navBrand = document.querySelector('.nav-brand');
  let mobileBrand = navMenu ? navMenu.querySelector('.mobile-brand') : null;
  if (!mobileBrand && navBrand && navMenu) {
    mobileBrand = navBrand.cloneNode(true);
    mobileBrand.className = 'mobile-brand nav-brand';
    navMenu.insertBefore(mobileBrand, navMenu.firstChild);
  }

  function handleResize() {
    if (window.matchMedia('(max-width: 1199px)').matches) {
      if (navActions && navMenu && navActions.parentNode !== navMenu) {
        navMenu.appendChild(navActions);
      }
    } else {
      if (navActions && navContainer && navActions.parentNode === navMenu) {
        navContainer.insertBefore(navActions, hamburger);
      }
      // Close menu if switching to desktop
      if (navMenu && navMenu.classList.contains('active')) {
        closeMenu();
      }
    }
  }

  window.addEventListener('resize', handleResize);
  handleResize();

  function closeMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isActive = navMenu.classList.toggle('active');
    hamburger.classList.toggle('active', isActive);
    overlay.classList.toggle('active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // Handle link clicks
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      const isDropdownToggle = link.nextElementSibling && link.nextElementSibling.classList.contains('nav-dropdown-content');
      
      if (!isDropdownToggle) {
        link.addEventListener('click', closeMenu);
      } else {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const dropdownParent = link.closest('.nav-item-dropdown');
          dropdownParent.classList.toggle('mobile-expanded');
          
          // Optionally close other open dropdowns
          navMenu.querySelectorAll('.nav-item-dropdown.mobile-expanded').forEach(item => {
            if (item !== dropdownParent) item.classList.remove('mobile-expanded');
          });
        });
      }
    });
    
    // Ensure links inside dropdowns also close the menu
    navMenu.querySelectorAll('.nav-dropdown-content a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Dashboard Hamburger
  const dashHamburger = document.querySelector('.dashboard-hamburger');
  const sidebar = document.querySelector('.sidebar');
  if (dashHamburger && sidebar) {
    
    const closeSidebar = () => {
      sidebar.classList.remove('active');
      dashHamburger.classList.remove('hidden');
    };

    dashHamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.add('active');
      dashHamburger.classList.add('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!dashHamburger.contains(e.target) && !sidebar.contains(e.target)) {
        closeSidebar();
      }
    });

    const closeBtn = sidebar.querySelector('.sidebar-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeSidebar);
    }

    // Close sidebar when a menu link is clicked (useful for tabs on mobile)
    sidebar.querySelectorAll('.sidebar-menu a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1199) {
          closeSidebar();
        }
      });
    });
  }

  // Responsive Data Tables: Add data-label to all TDs for mobile card layout
  document.querySelectorAll('table').forEach(table => {
    const thead = table.querySelector('thead');
    if (thead) {
      const headers = Array.from(thead.querySelectorAll('th')).map(th => th.textContent.trim());
      table.querySelectorAll('tbody tr').forEach(tr => {
        Array.from(tr.querySelectorAll('td')).forEach((td, index) => {
          if (headers[index]) {
            td.setAttribute('data-label', headers[index]);
          }
        });
      });
      table.classList.add('mobile-data-table');
    }
  });
}

/* ---- Form Validation ---- */
function initFormValidation() {
  document.querySelectorAll('.needs-validation').forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });
}

/* ---- Scroll Reveal Animations ---- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ---- Animated Counters ---- */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const count = parseInt(target.getAttribute('data-count'), 10);
        const suffix = target.getAttribute('data-suffix') || '';
        animateCounter(target, count, suffix);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target, suffix) {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }
  }, 20);
}

/* ---- Job Apply Links ---- */
function initJobApplyLinks() {
  document.querySelectorAll('a[href="job-details.html"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const card = link.closest('.job-card');
      if (card) {
        const titleEl = card.querySelector('h4');
        const companyEl = card.querySelector('.job-card-header p');
        const logoEl = card.querySelector('.job-company-logo');
        const tags = Array.from(card.querySelectorAll('.job-tag')).map(tag => tag.textContent);

        const jobData = {
          title: titleEl ? titleEl.textContent : 'Job Application',
          company: companyEl ? companyEl.textContent : '',
          logo: logoEl ? logoEl.textContent : '💼',
          logoBg: logoEl ? logoEl.style.background : '',
          tags: tags
        };
        sessionStorage.setItem('currentJobApply', JSON.stringify(jobData));
      } else {
        sessionStorage.removeItem('currentJobApply');
      }
    });
  });
}

// Initialize Password Toggles
function initPasswordToggles() {
    const toggleBtns = document.querySelectorAll('.password-toggle-btn');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('div');
            const input = container.querySelector('input');
            const eyeIcon = btn.querySelector('.eye-icon');
            const eyeOffIcon = btn.querySelector('.eye-off-icon');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.style.display = 'none';
                eyeOffIcon.style.display = 'block';
            } else {
                input.type = 'password';
                eyeIcon.style.display = 'block';
                eyeOffIcon.style.display = 'none';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPasswordToggles();
});

