// =============================================
// C.COQUETTEICE — Interactions v2
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Tahun otomatis di footer ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Navbar scroll shadow ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // ---- Toggle menu mobile ----
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Tutup menu saat link diklik (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Scroll to Top ----
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Scroll Reveal (IntersectionObserver) ----
  const revealEls = document.querySelectorAll('.reveal');

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ---- Testimonial Carousel ----
  const track    = document.getElementById('testiTrack');
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  const dotsWrap = document.getElementById('testiDots');

  if (track && prevBtn && nextBtn && dotsWrap) {
    const slides      = Array.from(track.children);
    const getPerView  = () => window.innerWidth >= 768 ? 2 : 1;
    let perView       = getPerView();
    let pageCount     = Math.ceil(slides.length / perView);
    let currentPage   = 0;

    const buildDots = () => {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < pageCount; i++) {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Ke testimoni halaman ${i + 1}`);
        dot.addEventListener('click', () => goToPage(i));
        dotsWrap.appendChild(dot);
      }
      updateDots();
    };

    const updateDots = () => {
      Array.from(dotsWrap.children).forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentPage);
      });
    };

    const goToPage = page => {
      currentPage = ((page % pageCount) + pageCount) % pageCount;
      const slideWidth =
        slides[0].getBoundingClientRect().width + 24; // 24 = gap
      track.style.transform = `translateX(-${
        currentPage * perView * slideWidth
      }px)`;
      updateDots();
    };

    prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newPerView = getPerView();
        if (newPerView !== perView) {
          perView   = newPerView;
          pageCount = Math.ceil(slides.length / perView);
          currentPage = 0;
          buildDots();
        }
        goToPage(currentPage);
      }, 150);
    });

    buildDots();
    goToPage(0);

    // Auto-advance setiap 6 detik
    if (!prefersReducedMotion) {
      const autoAdvance = setInterval(
        () => goToPage(currentPage + 1),
        6000
      );
      // Pause on hover/focus
      track.addEventListener('mouseenter', () => clearInterval(autoAdvance));
    }
  }

  // ---- Form Insider ----
  const insiderForm = document.getElementById('insiderForm');
  const insiderMsg  = document.getElementById('insiderMsg');

  if (insiderForm && insiderMsg) {
    insiderForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('insiderEmail').value.trim();
      if (!email) return;

      insiderMsg.textContent =
        '🎀 Makasih sudah bergabung! Kami akan segera menghubungimu.';
      insiderMsg.style.color = 'rgba(255,255,255,0.85)';
      insiderForm.reset();

      setTimeout(() => {
        insiderMsg.textContent = '';
      }, 5000);
    });
  }

});
