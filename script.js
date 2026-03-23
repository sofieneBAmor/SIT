/* =========================================
   SIT eLearning Solutions - Main Script
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Init Lucide Icons ----
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // ---- Theme Toggle (Light / Dark) ----
  const html = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('sit-theme', theme);
    // Swap icon
    // Show sun in dark mode (click to go light), moon in light mode (click to go dark)
    if (themeToggleBtn) {
      themeToggleBtn.querySelector('.icon-sun').style.display = theme === 'light' ? 'none' : 'block';
      themeToggleBtn.querySelector('.icon-moon').style.display = theme === 'light' ? 'block' : 'none';
    }
  }

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('sit-theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // ---- AOS elements (must be declared before onScroll is called) ----
  const aosElements = document.querySelectorAll('[data-aos]');

  function animateOnScroll() {
    const windowHeight = window.innerHeight;
    aosElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const delay = parseInt(el.getAttribute('data-aos-delay') || 0);
      if (rect.top < windowHeight - 60) {
        setTimeout(() => el.classList.add('aos-animate'), delay);
      }
    });
  }

  function onScroll() {
    // Scrolled class
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Back to top button
    const btn = document.getElementById('backToTop');
    if (btn) {
      if (window.scrollY > 400) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }

    // AOS animations
    animateOnScroll();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial call

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
      navLinksEl.classList.toggle('open');
      const spans = navToggle.querySelectorAll('span');
      if (navLinksEl.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close on link click
    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        navToggle.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }

  // ---- Back to top ----
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Initial AOS check after short delay (elements already declared above)
  setTimeout(animateOnScroll, 100);

  // ---- Hero counter animation ----
  const heroCounters = document.querySelectorAll('.hero .stat-num[data-target]');
  let heroCountersAnimated = false;

  function animateHeroCounters() {
    if (heroCountersAnimated) return;
    heroCountersAnimated = true;
    heroCounters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      animateCounter(counter, target, 2000);
    });
  }

  // Animate hero counters on load
  setTimeout(animateHeroCounters, 600);

  // ---- Section counters ----
  const sectionCounters = document.querySelectorAll('.counter[data-target]');
  let sectionCountersAnimated = false;

  function checkSectionCounters() {
    if (sectionCountersAnimated) return;
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      sectionCountersAnimated = true;
      sectionCounters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target, 2500);
      });
    }
  }

  window.addEventListener('scroll', checkSectionCounters, { passive: true });

  function animateCounter(el, target, duration) {
    const start = 0;
    const startTime = performance.now();
    const isLarge = target >= 1000;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const value = Math.round(start + eased * (target - start));

      if (isLarge && value >= 1000) {
        el.textContent = (value / 1000).toFixed(1).replace('.0', '') + 'K';
      } else {
        el.textContent = value.toLocaleString('fr-FR');
      }

      if (progress < 1) requestAnimationFrame(update);
      else {
        if (isLarge && target >= 1000) {
          el.textContent = (target / 1000).toFixed(1).replace('.0', '') + 'K';
        } else {
          el.textContent = target.toLocaleString('fr-FR');
        }
      }
    }

    requestAnimationFrame(update);
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  // ---- Services tabs ----
  const tabBtns = document.querySelectorAll('.tab-btn');
  const allServiceCards = document.querySelectorAll('.service-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');

      // Update active tab
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide cards
      allServiceCards.forEach(card => {
        if (card.getAttribute('data-tab-content') === tab) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Make sure correct cards show on load
  const firstTab = document.querySelector('.tab-btn.active');
  if (firstTab) {
    const activeTab = firstTab.getAttribute('data-tab');
    allServiceCards.forEach(card => {
      if (card.getAttribute('data-tab-content') !== activeTab) {
        card.style.display = 'none';
      }
    });
  }

  // ---- Testimonials slider ----
  const track = document.getElementById('testiTrack');
  const dotsContainer = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');

  if (track) {
    const cards = track.querySelectorAll('.testi-card');
    let current = 0;
    let autoSlide;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = (index + cards.length) % cards.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      document.querySelectorAll('.testi-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function startAuto() {
      autoSlide = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAuto() { clearInterval(autoSlide); }

    prevBtn?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    startAuto();
  }

  // ---- Contact form ----
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.innerHTML = '<svg class="spinner" viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10"/></svg> Envoi en cours...';
      btn.disabled = true;

      // Simulate sending
      setTimeout(() => {
        showToast('Votre message a bien été envoyé ! Nous vous répondrons sous 24h.', 'success');
        form.reset();
        btn.innerHTML = '<i data-lucide="send"></i> Envoyer ma demande';
        btn.disabled = false;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 1800);
    });
  }

  // ---- Toast ----
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // ---- Smooth anchor scrolling ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const y = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ---- Inject fade-in-up keyframes ----
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .spinner {
      animation: rotate 0.8s linear infinite;
      display: inline-block;
      vertical-align: middle;
    }
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // ---- Team cards hover depth effect ----
  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ---- Service cards hover glow ----
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(200px circle at ${x}px ${y}px, rgba(99,102,241,0.08), transparent 70%), var(--bg-card-hover)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
      if (card.classList.contains('featured')) {
        card.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(14,165,233,0.05))';
      }
    });
  });

  // ---- Intersection observer for lazy images ----
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
  }

  // ---- Partners hover scale ----
  document.querySelectorAll('.partner-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const img = card.querySelector('img');
      if (img) img.style.transform = 'scale(1.1)';
    });
    card.addEventListener('mouseleave', () => {
      const img = card.querySelector('img');
      if (img) img.style.transform = '';
    });
  });

  console.log('🚀 SIT eLearning Solutions — Site initialisé');
});
