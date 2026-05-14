/* ═══════════════════════════════════════════════════
   PORTFOLIO — ACHRAF BZI | script.js
   ═══════════════════════════════════════════════════ */

'use strict';

// ── Navbar scroll ──────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

// ── Mobile menu ────────────────────────────────────
const menuToggle = document.querySelector('.menu-toggle');
const navLinks   = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
  // Animate hamburger → X
  const spans = menuToggle.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Active nav link by current page URL ───────────
const navItems = document.querySelectorAll('.nav-links a');
const currentPage = location.pathname.split('/').pop() || 'index.html';

navItems.forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ── Reveal on scroll ──────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Add reveal class to elements
const revealTargets = [
  '.skill-category',
  '.project-card',
  '.timeline-item',
  '.contact-card',
  '.about-avatar',
  '.about-text',
  '.badge-tech',
];
revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
});

// ── Skill bars animation ───────────────────────────
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const width = bar.dataset.width;
        setTimeout(() => { bar.style.width = width + '%'; }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(c => skillObserver.observe(c));

// ── Counter animation ──────────────────────────────
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const raw   = el.textContent.replace(/[^0-9]/g, '');
      const end   = parseInt(raw, 10);
      const suffix = el.textContent.replace(/[0-9]/g, '');
      if (!end) return;
      let start = 0;
      const duration = 1400;
      const step = Math.ceil(duration / end);
      const timer = setInterval(() => {
        start += 1;
        el.textContent = start + suffix;
        if (start >= end) { el.textContent = end + suffix; clearInterval(timer); }
      }, step);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => counterObserver.observe(n));

// ── Contact form ───────────────────────────────────
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours…';

    // Simulate sending (replace with real backend / EmailJS / Formspree)
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Envoyer le message';
      btn.disabled  = false;
      formSuccess.classList.add('show');
      form.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1800);
  });
}

// ── Back to top ────────────────────────────────────
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Smooth cursor hover effect on cards ───────────
document.querySelectorAll('.project-card, .skill-category, .timeline-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Typing effect in hero subtitle ────────────────
const heroSub  = document.querySelector('.hero-sub');
const phrases  = [
  'Étudiant BTS SIO SISR — Lycée Saint-John Perse',
  'Passionné par les Réseaux & Systèmes',
  'Technicien support — Stage à Malte 2025',
  'En quête d\'un stage / alternance',
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function type() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    heroSub.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 2200);
      return;
    }
  } else {
    heroSub.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 45 : 75);
}

// Start typing after initial animation
setTimeout(type, 1200);

// ── Image modal ────────────────────────────────────
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');
const detailImages = document.querySelectorAll('.pd-detail-image');

// Ouvrir la modal au clic sur l'image
detailImages.forEach(img => {
  img.addEventListener('click', () => {
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

// Fermer la modal au clic sur le bouton de fermeture
closeModal.addEventListener('click', () => {
  imageModal.classList.remove('active');
  document.body.style.overflow = '';
});

// Fermer la modal au clic en dehors de l'image
imageModal.addEventListener('click', (e) => {
  if (e.target === imageModal) {
    imageModal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Fermer la modal avec la touche Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && imageModal.classList.contains('active')) {
    imageModal.classList.remove('active');
    document.body.style.overflow = '';
  }
});
