/**
 * Gisella Farinini - Enhanced Animations
 */

(function() {
  'use strict';

  // ==========================================
  // 1. PROGRESSIVE IMAGE LOADING (Blur-Up)
  // ==========================================
  
  function initProgressiveLoading() {
    const images = document.querySelectorAll('.artwork-image img, .artwork-preview img');
    
    images.forEach(img => {
      // Set initial state
      img.setAttribute('data-loading', 'true');
      
      // If image is already loaded
      if (img.complete) {
        setTimeout(() => {
          img.setAttribute('data-loaded', 'true');
          img.removeAttribute('data-loading');
        }, 100);
      } else {
        // Wait for load
        img.addEventListener('load', function() {
          setTimeout(() => {
            img.setAttribute('data-loaded', 'true');
            img.removeAttribute('data-loading');
          }, 200);
        });
        
        // Fallback for error
        img.addEventListener('error', function() {
          img.setAttribute('data-loaded', 'true');
          img.removeAttribute('data-loading');
        });
      }
    });
  }

  // ==========================================
  // 2. SCROLL-TRIGGERED REVEAL (ENHANCED)
  // ==========================================
  
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.gallery-item, .about-image, .philosophy-item, .contact-method, .coefficient-badge, .period-title'
    );
    
    if (revealElements.length === 0) return;
    
    // Use LOWER threshold so animation starts earlier (more visible)
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.05
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, index * 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  // ==========================================
  // 3. ENHANCED LIGHTBOX
  // ==========================================
  
  let currentArtworkIndex = 0;
  let artworks = [];
  let lightbox = null;
  
  function initLightbox() {
    const artworkCards = document.querySelectorAll('.artwork-card, figure[data-lightbox]');
    artworks = Array.from(artworkCards).map(card => {
      const img = card.querySelector('img');
      const title = card.querySelector('h4, figcaption')?.textContent || '';
      const meta = card.querySelector('.artwork-meta, .gallery-item-info')?.textContent || '';
      
      return {
        src: img?.src || '',
        title: title,
        meta: meta,
        year: card.querySelector('.year')?.textContent || ''
      };
    });
    
    artworkCards.forEach((card, index) => {
      card.addEventListener('click', () => openLightbox(index));
      card.style.cursor = 'pointer';
    });
    
    createLightboxElement();
  }
  
  function createLightboxElement() {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <button class="lightbox-close" aria-label="Chiudi">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Precedente">&#10094;</button>
      <button class="lightbox-nav lightbox-next" aria-label="Successivo">&#10095;</button>
      <div class="lightbox-content">
        <div class="lightbox-image-container">
          <img src="" alt="" />
        </div>
        <div class="lightbox-info">
          <h3></h3>
          <p></p>
        </div>
      </div>
    `;
    
    document.body.appendChild(lightbox);
    
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);
    lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    
    document.addEventListener('keydown', handleKeydown);
  }
  
  function openLightbox(index) {
    currentArtworkIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function showPrev() {
    const container = lightbox.querySelector('.lightbox-image-container');
    container.classList.add('slide-out-right');
    
    setTimeout(() => {
      currentArtworkIndex = (currentArtworkIndex - 1 + artworks.length) % artworks.length;
      updateLightboxContent();
      container.classList.remove('slide-out-right');
      container.classList.add('slide-in-left');
      
      setTimeout(() => {
        container.classList.remove('slide-in-left');
      }, 300);
    }, 300);
  }
  
  function showNext() {
    const container = lightbox.querySelector('.lightbox-image-container');
    container.classList.add('slide-out-left');
    
    setTimeout(() => {
      currentArtworkIndex = (currentArtworkIndex + 1) % artworks.length;
      updateLightboxContent();
      container.classList.remove('slide-out-left');
      container.classList.add('slide-in-right');
      
      setTimeout(() => {
        container.classList.remove('slide-in-right');
      }, 300);
    }, 300);
  }
  
  function updateLightboxContent() {
    const artwork = artworks[currentArtworkIndex];
    const img = lightbox.querySelector('.lightbox-image-container img');
    const title = lightbox.querySelector('.lightbox-info h3');
    const meta = lightbox.querySelector('.lightbox-info p');
    
    img.src = artwork.src;
    img.alt = artwork.title;
    title.textContent = artwork.title;
    meta.textContent = artwork.meta || `${artwork.year} • ${currentArtworkIndex + 1} / ${artworks.length}`;
  }
  
  function handleKeydown(e) {
    if (!lightbox.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrev();
        break;
      case 'ArrowRight':
        showNext();
        break;
    }
  }

  // ==========================================
  // 4. SMOOTH SCROLL FOR NAV LINKS
  // ==========================================
  
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ==========================================
  // INITIALIZE ALL
  // ==========================================
  
  function init() {
    initProgressiveLoading();
    initScrollReveal();
    initLightbox();
    initSmoothScroll();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
