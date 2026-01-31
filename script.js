/**
 * 노답노트 - Webtoon Landing Page Scripts
 * Minimal, performant interactions
 */

(function() {
  'use strict';

  // ─── Header Scroll State ───
  const header = document.querySelector('.header');
  let lastScrollY = 0;
  let ticking = false;
  const scrollThreshold = 10; // Minimum scroll distance to trigger hide/show

  function updateHeaderState() {
    const scrollY = window.scrollY;
    const scrollDelta = scrollY - lastScrollY;

    // Add 'scrolled' class when scrolled past threshold
    if (scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide/show header based on scroll direction
    // Hide when scrolling down (reading webtoon), show when scrolling up
    if (Math.abs(scrollDelta) > scrollThreshold) {
      if (scrollDelta > 0 && scrollY > 100) {
        // Scrolling down - hide header
        header.classList.add('header-hidden');
      } else {
        // Scrolling up - show header
        header.classList.remove('header-hidden');
      }
      lastScrollY = scrollY;
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      // Use requestAnimationFrame for smooth performance
      window.requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  }

  // Initialize scroll listener
  window.addEventListener('scroll', onScroll, { passive: true });

  // Check initial state (in case page loads scrolled)
  updateHeaderState();

  // ─── Lazy Loading Enhancement ───
  // Native lazy loading is used via HTML attributes
  // This adds intersection observer for older browsers as fallback
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Trigger load by ensuring src is processed
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px', // Start loading 100px before viewport
      threshold: 0.01
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ─── Smooth Scroll for Anchor Links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      // Skip placeholder links
      if (href === '#') {
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

})();
