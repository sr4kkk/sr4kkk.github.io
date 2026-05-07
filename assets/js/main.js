/* Fractalyn Systems — global interactions
   - Accessible mobile nav (focus trap, ESC close, return focus)
*/
(function(){
  const doc = document;
  const body = doc.body;

  const nav = doc.getElementById('primary-nav');
  const openBtn = doc.getElementById('nav-open') || doc.querySelector('[data-menu-open]');
  const closeBtn = doc.getElementById('nav-close') || doc.querySelector('[data-menu-close]');

  if (!nav || !openBtn) return;

  const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

  let lastFocus = null;

  const focusablesSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function setNavState(open){
    if (isDesktop()){
      // Desktop nav is always visible; ignore overlay behaviors
      nav.hidden = false;
      openBtn.setAttribute('aria-expanded', 'false');
      body.classList.remove('no-scroll');
      return;
    }

    nav.hidden = !open;
    openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    body.classList.toggle('no-scroll', open);

    if (open){
      lastFocus = doc.activeElement;
      // focus first focusable within nav panel
      const focusables = nav.querySelectorAll(focusablesSelector);
      const target = focusables.length ? focusables[0] : nav;
      setTimeout(() => target.focus(), 0);
    } else {
      if (lastFocus && typeof lastFocus.focus === 'function'){
        setTimeout(() => lastFocus.focus(), 0);
      }
    }
  }

  function trapFocus(e){
    if (nav.hidden) return;
    if (isDesktop()) return;

    if (e.key !== 'Tab') return;

    const focusables = Array.from(nav.querySelectorAll(focusablesSelector))
      .filter(el => el.offsetParent !== null);

    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && doc.activeElement === first){
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && doc.activeElement === last){
      e.preventDefault();
      first.focus();
    }
  }

  function onKeyDown(e){
    if (e.key === 'Escape' && !nav.hidden){
      setNavState(false);
    }
    trapFocus(e);
  }

  let wasDesktop = isDesktop();

  function onResize(){
    const desktop = isDesktop();

    if (desktop){
      nav.hidden = false;
      body.classList.remove('no-scroll');
      openBtn.setAttribute('aria-expanded', 'false');
    } else if (wasDesktop !== desktop) {
      nav.hidden = true;
      body.classList.remove('no-scroll');
      openBtn.setAttribute('aria-expanded', 'false');
    }

    wasDesktop = desktop;
  }

  openBtn.addEventListener('click', () => setNavState(true));

  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (!isDesktop()) setNavState(false);
    });
  });
  if (closeBtn) closeBtn.addEventListener('click', () => setNavState(false));

  nav.addEventListener('click', (e) => {
    // close when clicking outside panel on mobile
    if (isDesktop()) return;
    const panel = nav.querySelector('[data-nav-panel]') || nav.querySelector('.nav-panel');
    if (panel && !panel.contains(e.target)){
      setNavState(false);
    }
  });

  doc.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', onResize, { passive: true });

  // initial state
  onResize();
})();


/* Click-to-zoom image viewer */
(function(){
  const images = Array.from(document.querySelectorAll('.media-frame img'));
  if (!images.length) return;

  const body = document.body;
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  let activeTrigger = null;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="lightbox__backdrop" data-lightbox-close></div>
    <div class="lightbox__dialog" role="dialog" aria-modal="true" aria-label="Visualização da imagem ampliada">
      <button class="lightbox__close" type="button" aria-label="Fechar visualização" data-lightbox-close>×</button>
      <img class="lightbox__image" alt="" />
      <p class="lightbox__caption" hidden></p>
    </div>
  `;
  body.appendChild(overlay);

  const dialog = overlay.querySelector('.lightbox__dialog');
  const lightboxImage = overlay.querySelector('.lightbox__image');
  const caption = overlay.querySelector('.lightbox__caption');
  const closeButton = overlay.querySelector('.lightbox__close');

  function openLightbox(img){
    activeTrigger = img;
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || 'Imagem ampliada';

    const figcaption = img.closest('figure')?.querySelector('figcaption');
    const captionText = figcaption?.textContent?.trim() || img.alt || '';
    caption.textContent = captionText;
    caption.hidden = !captionText;

    overlay.hidden = false;
    body.classList.add('no-scroll');
    if (!prefersReduced) {
      overlay.classList.remove('lightbox--open');
      void overlay.offsetWidth;
      overlay.classList.add('lightbox--open');
    }
    closeButton.focus();
  }

  function closeLightbox(){
    if (overlay.hidden) return;
    overlay.hidden = true;
    body.classList.remove('no-scroll');
    overlay.classList.remove('lightbox--open');
    lightboxImage.removeAttribute('src');
    if (activeTrigger && typeof activeTrigger.focus === 'function') {
      activeTrigger.focus();
    }
  }

  images.forEach((img) => {
    img.tabIndex = 0;
    img.classList.add('zoomable-image');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `${img.alt || 'Imagem'} — clicar para ampliar`);

    img.addEventListener('click', () => openLightbox(img));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target.closest('[data-lightbox-close]')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  window.addEventListener('resize', () => {
    if (overlay.hidden) return;
    lightboxImage.src = activeTrigger?.currentSrc || activeTrigger?.src || lightboxImage.src;
  }, { passive: true });
})();
