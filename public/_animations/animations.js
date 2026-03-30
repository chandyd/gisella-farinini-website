/**
 * GISELLA FARININI - ANIMATION SCRIPT
 * Features: Progressive Image Loading, Scroll Reveal, Lightbox Enhancement
 */

(function() {
  'use strict';

  // ==========================================
  // 1. PROGRESSIVE IMAGE LOADING (Blur-Up)
  // ==========================================
  
  const ImageLoader = {
    init() {
      this.images = document.querySelectorAll('.artwork-image img, .artwork-preview img');
      this.setupImages();
    },

    setupImages() {
      this.images.forEach(img => {
        // Skip if already processed
        if (img.dataset.progressiveLoaded) return;
        
        // Mark as being processed
        img.dataset.progressiveLoaded = 'true';
        
        // Set initial loading state
        img.dataset.loading = 'true';
        
        // If image is already complete (cached), mark as loaded
        if (img.complete && img.naturalWidth > 0) {
          this.onImageLoad(img);
        } else {
          // Wait for image to load
          img.addEventListener('load', () => this.onImageLoad(img), { once: true });
          img.addEventListener('error', () => this.onImageError(img), { once: true });
        }
      });
    },

    onImageLoad(img) {
      // Small delay for visual effect
      requestAnimationFrame(() => {
        img.dataset.loading = 'false';
        img.dataset.loaded = 'true';
        img.classList.add('blur-loaded');
      });
    },

    onImageError(img) {
      img.dataset.loading = 'false';
      img.style.filter = 'none';
      console.warn('Failed to load image:', img.src);
    }
  };

  // ==========================================
  // 2. SCROLL-TRIGGERED REVEAL
  // ==========================================
  
  const ScrollReveal = {
    init() {
      this.elements = document.querySelectorAll(
        '.gallery-item, .about-image, .philosophy-item, .contact-method, .coefficient-badge, .period-title'
      );
      
      this.options = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      };

      this.observer = new IntersectionObserver(this.onIntersect.bind(this), this.options);
      this.observeElements();
    },

    observeElements() {
      this.elements.forEach(el => {
        // Don't observe elements that are already visible in viewport on load
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport && rect.top < window.innerHeight * 0.8) {
          // Element is already visible, reveal immediately
          el.classList.add('revealed');
        } else {
          // Observe for scroll reveal
          this.observer.observe(el);
        }
      });
    },

    onIntersect(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add revealed class with small delay for stagger effect
          const element = entry.target;
          
          // Calculate stagger delay based on element index within parent
          const parent = element.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children);
            const index = siblings.indexOf(element);
            const delay = Math.min(index * 50, 500); // Max 500ms delay
            
            setTimeout(() => {
              element.classList.add('revealed');
            }, delay);
          } else {
            element.classList.add('revealed');
          }
          
          // Stop observing once revealed
          this.observer.unobserve(element);
        }
      });
    }
  };

  // ==========================================
  // 3. ENHANCED LIGHTBOX
  // ==========================================
  
  const LightboxEnhancer = {
    init() {
      this.lightbox = document.getElementById('lightbox');
      if (!this.lightbox) return;
      
      this.container = document.getElementById('lightbox-container');
      this.img = document.getElementById('lightbox-img');
      
      this.setupKeyboardNavigation();
      this.setupTouchGestures();
      this.setupFocusTrap();
    },

    setupKeyboardNavigation() {
      document.addEventListener('keydown', (e) => {
        if (!this.lightbox.classList.contains('active')) return;
        
        switch(e.key) {
          case 'Escape':
            e.preventDefault();
            window.closeLightbox();
            break;
          case 'ArrowRight':
            e.preventDefault();
            window.nextImage();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            window.prevImage();
            break;
        }
      });
    },

    setupTouchGestures() {
      let touchStartX = 0;
      let touchStartY = 0;
      let touchEndX = 0;
      let touchEndY = 0;
      const swipeThreshold = 50;
      
      const content = this.lightbox.querySelector('.lightbox-content');
      if (!content) return;

      content.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      content.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY, swipeThreshold);
      }, { passive: true });
    },

    handleSwipe(startX, endX, startY, endY, threshold) {
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Only process horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX < 0) {
          window.nextImage();
        } else {
          window.prevImage();
        }
      }
    },

    setupFocusTrap() {
      // Trap focus within lightbox when open
      this.lightbox.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        
        const focusableElements = this.lightbox.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      });
    }
  };

  // ==========================================
  // 4. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#') return;
          
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }
  };

  // ==========================================
  // 5. HEADER SCROLL EFFECT
  // ==========================================
  
  const HeaderEffect = {
    init() {
      this.header = document.querySelector('.header');
      if (!this.header) return;
      
      this.lastScroll = 0;
      this.ticking = false;
      
      window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    },

    onScroll() {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.updateHeader();
          this.ticking = false;
        });
        this.ticking = true;
      }
    },

    updateHeader() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        this.header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
      } else {
        this.header.style.boxShadow = 'none';
      }
      
      this.lastScroll = currentScroll;
    }
  };

  // ==========================================
  // INITIALIZATION
  // ==========================================
  
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runInit);
    } else {
      runInit();
    }
  }

  function runInit() {
    // Initialize all modules
    ImageLoader.init();
    ScrollReveal.init();
    LightboxEnhancer.init();
    SmoothScroll.init();
    HeaderEffect.init();
    
    console.log('🎨 Gisella Farinini animations initialized');
  }

  // Run initialization
  init();

})();
