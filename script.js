/* ═══════════════════════════════════════════════════════════════
   AYESHA BANQUET — script.js
   Handles: custom cursor, nav scroll, reveal animations,
   counter animation, gallery filtering, testimonial slider,
   hero particles, and form submission.
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Custom Cursor ─────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Smooth follower with RAF
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor expand on interactive elements
    document.querySelectorAll('a, button, .gallery-item, .tab-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
        follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        follower.style.opacity = '0.3';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.opacity = '0.6';
      });
    });
  }

  /* ─── Navigation Scroll ─────────────────────────────────── */
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  /* ─── Mobile Menu ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger?.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ─── Hero Particles ────────────────────────────────────── */
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    const count = 55;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const x = Math.random() * 100;
      const tx = (Math.random() - 0.5) * 160;
      const dur = 6 + Math.random() * 10;
      const delay = Math.random() * 8;
      const size = 1 + Math.random() * 3;
      p.style.cssText = `
        left: ${x}%;
        bottom: -10px;
        width: ${size}px;
        height: ${size}px;
        --tx: ${tx}px;
        --dur: ${dur}s;
        --delay: ${delay}s;
      `;
      particleContainer.appendChild(p);
    }
  }

  /* ─── Scroll Reveal ─────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-fade, .reveal-up');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el, i) => {
    // Stagger children with delay
    if (!el.style.animationDelay && !el.style.transitionDelay) {
      const delay = el.dataset.delay || 0;
      el.style.transitionDelay = delay + 's';
    }
    revealObs.observe(el);
  });

  /* ─── Counter Animation ─────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-num[data-count]');

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObs.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current < target) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(update);
  }

  /* ─── Gallery Filter ────────────────────────────────────── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active tab
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ─── Testimonial Slider ────────────────────────────────── */
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    const total = cards.length;
    let autoTimer;

    // Build dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(idx) {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      document.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
      resetAuto();
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));

    // Auto-advance
    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }
    startAuto();

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });
  }

  /* ─── Contact Form ──────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const btnSpan = btn.querySelector('span:first-child');

    // Simulate loading
    btnSpan.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.add('show');
    }, 1200);
  });

  /* ─── Smooth scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Gallery items entrance animation ──────────────────── */
  const galleryObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
        }, i * 80);
        galleryObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px) scale(0.97)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)';
    galleryObs.observe(item);
  });

  /* ─── Service cards staggered entrance ───────────────────── */
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });
  serviceCards.forEach(card => serviceObs.observe(card));

  /* ─── Parallax on hero ───────────────────────────────────── */
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      const parallax = window.scrollY * 0.3;
      if (heroContent) heroContent.style.transform = `translateY(${parallax}px)`;
    }
  }, { passive: true });

  /* ─── Active nav link on scroll ─────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-cta)');

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--gold-pale)' : '';
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => sectionObs.observe(s));

});
