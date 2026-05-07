/* Cases filtering (simple, accessible) */
(function(){
  const root = document.querySelector('[data-cases]');
  if (!root) return;

  const buttons = Array.from(document.querySelectorAll('[data-filter]'));
  const cards = Array.from(document.querySelectorAll('[data-case]'));

  function setPressed(btn){
    buttons.forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
  }

  function applyFilter(tag){
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(',').map(t => t.trim()).filter(Boolean);
      const show = tag === 'todos' ? true : tags.includes(tag);
      card.style.display = show ? '' : 'none';
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-filter');
      setPressed(btn);
      applyFilter(tag);
    });
  });

  // default
  const first = buttons.find(b => b.getAttribute('data-filter') === 'todos') || buttons[0];
  if (first){
    setPressed(first);
    applyFilter(first.getAttribute('data-filter'));
  }
})();
