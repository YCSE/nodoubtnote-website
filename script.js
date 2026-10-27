/**
 * 노답노트 - Webtoon Landing Page Scripts
 * Minimal, performant interactions
 */

(function() {
  'use strict';

  // ─── Ads Conversion: Track App Download Clicks ───
  const ADS_CONVERSION_SEND_TO = 'AW-17921161832/qxWZCIC4ovAbEOj0vOFC';

  function trackAdsConversion(platform) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'conversion', {
      send_to: ADS_CONVERSION_SEND_TO,
      value: 1.0,
      currency: 'KRW',
      event_label: platform,
      transport_type: 'beacon'
    });
  }

  // ─── App Download: Device-Aware Store Links ───
  const STORE_URLS = {
    ios: 'https://apps.apple.com/kr/app/%EB%85%B8%EB%8B%B5%EB%85%B8%ED%8A%B8/id6757139844',
    android: 'https://play.google.com/store/apps/details?id=com.ycse.nodoubtnote'
  };

  // Apple / Google Play logos, shared by the phone buttons and the QR modal
  const STORE_ICON_PATHS = {
    ios: 'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z',
    android: 'M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z'
  };

  function storeIconSvg(store, className) {
    return '<svg class="' + className + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="' + STORE_ICON_PATHS[store] + '"/>' +
    '</svg>';
  }

  // Keep in sync with the inline script in download/index.html
  function detectPlatform() {
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) return 'android';
    // iPadOS 13+ reports a Mac UA, so fall back to touch support
    if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) {
      return 'ios';
    }
    return 'desktop';
  }

  const platform = detectPlatform();
  const canShowQrModal = typeof HTMLDialogElement === 'function';

  document.querySelectorAll('a.js-app-download').forEach(function(a) {
    if (platform !== 'desktop') {
      // Same tab: store links hand off to the store app, and in-app browsers
      // often ignore target="_blank"
      a.href = STORE_URLS[platform];
      // Swap the generic download arrow for the store's logo
      const icon = a.querySelector('svg');
      if (icon) icon.outerHTML = storeIconSvg(platform, icon.getAttribute('class'));
    } else if (canShowQrModal) {
      a.setAttribute('aria-haspopup', 'dialog');
    }

    a.addEventListener('click', function(e) {
      trackAdsConversion(platform);
      if (platform === 'desktop' && canShowQrModal) {
        e.preventDefault();
        openQrModal(a);
      }
      // Otherwise the default href (/download/) handles the redirect
    });
  });

  // ─── QR Modal (desktop) ───
  let qrDialog = null;
  let qrTrigger = null;

  function buildQrDialog() {
    const dialog = document.createElement('dialog');
    dialog.className = 'qr-modal';
    dialog.setAttribute('aria-labelledby', 'qr-modal-title');
    dialog.innerHTML =
      '<div class="qr-modal-body">' +
        '<button type="button" class="qr-modal-close" aria-label="닫기" autofocus>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
          '</svg>' +
        '</button>' +
        '<img src="/assets/appicon.webp" alt="" class="qr-modal-icon" aria-hidden="true">' +
        '<h2 id="qr-modal-title" class="qr-modal-title">휴대폰으로 스캔하세요</h2>' +
        '<p class="qr-modal-desc">카메라로 찍으면 내 기기에 맞는<br>스토어로 바로 이동해요</p>' +
        '<div class="qr-modal-code">' +
          '<img src="/assets/download-qr.svg" width="200" height="200" alt="노답노트 앱 다운로드 QR 코드">' +
        '</div>' +
        '<div class="qr-modal-stores">' +
          '<a href="' + STORE_URLS.ios + '" target="_blank" rel="noopener noreferrer" class="btn btn-ios" aria-label="App Store에서 보기">' +
            storeIconSvg('ios', 'btn-icon') +
            '<span class="btn-text">App Store</span>' +
          '</a>' +
          '<a href="' + STORE_URLS.android + '" target="_blank" rel="noopener noreferrer" class="btn btn-android" aria-label="Google Play에서 보기">' +
            storeIconSvg('android', 'btn-icon') +
            '<span class="btn-text">Google Play</span>' +
          '</a>' +
        '</div>' +
      '</div>';

    dialog.querySelector('.qr-modal-close').addEventListener('click', function() {
      dialog.close();
    });

    // The dialog box has no padding, so a click whose target is the dialog
    // itself landed on the backdrop
    dialog.addEventListener('click', function(e) {
      if (e.target === dialog) dialog.close();
    });

    dialog.addEventListener('close', function() {
      document.documentElement.classList.remove('modal-open');
      if (qrTrigger) qrTrigger.focus();
    });

    document.body.appendChild(dialog);
    return dialog;
  }

  function openQrModal(trigger) {
    if (!qrDialog) qrDialog = buildQrDialog();
    qrTrigger = trigger;
    document.documentElement.classList.add('modal-open');
    qrDialog.showModal();
  }

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
