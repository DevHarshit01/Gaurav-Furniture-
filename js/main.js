(function () {
  'use strict';

  const WHATSAPP = '919838340035';

  /* ── Page loader ── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('hidden'), 400);
  });

  /* ── Dark mode ── */
  const darkToggle = document.getElementById('dark-toggle');
  const html = document.documentElement;

  function setDarkMode(on) {
    html.classList.toggle('dark', on);
    localStorage.setItem('gf-dark', on ? '1' : '0');
    document.querySelectorAll('.dark-icon').forEach((el) => el.classList.toggle('hidden', !on));
    document.querySelectorAll('.light-icon').forEach((el) => el.classList.toggle('hidden', on));
  }

  if (localStorage.getItem('gf-dark') === '1') setDarkMode(true);

  darkToggle?.addEventListener('click', () => setDarkMode(!html.classList.contains('dark')));

  /* ── Navbar scroll ── */
  const navbar = document.getElementById('navbar');
  const mobileBar = document.getElementById('mobile-action-bar');
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    const scrolled = window.scrollY > 60;
    navbar?.classList.toggle('nav-scrolled', scrolled);
    navbar?.classList.toggle('bg-transparent', !scrolled);
    navbar?.classList.toggle('py-4', !scrolled);
    navbar?.classList.toggle('py-2', scrolled);

    mobileBar?.classList.toggle('visible', window.scrollY > 400);
    backToTop?.classList.toggle('visible', window.scrollY > 600);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── Mobile menu ── */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  menuBtn?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('hidden') === false;
    menuIconOpen.classList.toggle('hidden', open);
    menuIconClose.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', open);
  });

  document.querySelectorAll('#mobile-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuIconOpen.classList.remove('hidden');
      menuIconClose.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Scroll reveal ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ── Gallery lightbox ── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const galleryImages = [];
  let currentIndex = 0;

  document.querySelectorAll('[data-gallery]').forEach((item, i) => {
    galleryImages.push({
      src: item.dataset.full || item.querySelector('img')?.src,
      caption: item.dataset.caption || '',
    });
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const img = galleryImages[currentIndex];
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.caption;
    lightboxCaption.textContent = img.caption;
  }

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  });
  document.getElementById('lightbox-next')?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightbox();
  });

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev')?.click();
    if (e.key === 'ArrowRight') document.getElementById('lightbox-next')?.click();
  });

  /* ── Gallery filter tabs ── */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const galleryItems = document.querySelectorAll('[data-category]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach((item) => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* ── Virtual tour tabs ── */
  const tourTabs = document.querySelectorAll('[data-tour]');
  const tourPanels = document.querySelectorAll('[data-tour-panel]');

  tourTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tour;
      tourTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      tourPanels.forEach((panel) => {
        panel.classList.toggle('hidden', panel.dataset.tourPanel !== target);
      });
    });
  });

  /* ── Tour fullscreen ── */
  const tourContainer = document.getElementById('tour-container');
  document.getElementById('tour-fullscreen')?.addEventListener('click', () => {
    tourContainer?.classList.toggle('tour-container-fullscreen');
  });

  /* ── Carousel helper ── */
  function initCarousel(trackId, prevId, nextId, slideSelector) {
    const track = document.getElementById(trackId);
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    if (!track) return;

    let index = 0;

    function getSlideWidth() {
      const slide = track.querySelector(slideSelector);
      if (!slide) return 0;
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      return slide.offsetWidth + gap;
    }

    function update() {
      const slides = track.querySelectorAll(slideSelector);
      const maxIndex = Math.max(0, slides.length - getVisibleCount());
      index = Math.min(index, maxIndex);
      track.style.transform = `translateX(-${index * getSlideWidth()}px)`;
    }

    function getVisibleCount() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    prev?.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      update();
    });

    next?.addEventListener('click', () => {
      const slides = track.querySelectorAll(slideSelector);
      const maxIndex = Math.max(0, slides.length - getVisibleCount());
      index = Math.min(maxIndex, index + 1);
      update();
    });

    window.addEventListener('resize', update, { passive: true });
  }

  initCarousel('video-track', 'video-prev', 'video-next', '.video-slide');
  initCarousel('reviews-track', 'review-prev', 'review-next', '.review-card');

  /* ── Contact form ── */
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name')?.value.trim();
    const phone = document.getElementById('form-phone')?.value.trim();
    const message = document.getElementById('form-message')?.value.trim();
    const text = encodeURIComponent(`Hi Gaurav Furniture,\n\nName: ${name}\nPhone: ${phone}\n\n${message}`);
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, '_blank');
  });

  /* ── Store open/closed badge ── */
  function updateOpenStatus() {
    const badge = document.getElementById('open-badge');
    if (!badge) return;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openTime = 10 * 60;
    const closeTime = 22 * 60;
    const isOpen = currentMinutes >= openTime && currentMinutes < closeTime;

    badge.textContent = isOpen ? 'Open Now' : currentMinutes < openTime ? 'Closed · Opens 10 AM' : 'Closed · Opens Tomorrow 10 AM';
    badge.className = isOpen
      ? 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700'
      : 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700';
  }

  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);

  /* ── Smooth anchor offset ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Counter animation ── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isDecimal = suffix.startsWith('.');
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));
})();
