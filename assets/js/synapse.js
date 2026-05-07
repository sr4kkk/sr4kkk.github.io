(() => {
  const buttons = document.querySelectorAll('[data-copy]');
  if (!buttons.length) return;

  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const makeToast = () => {
    let toast = document.getElementById('toast');
    if (toast) return toast;
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.hidden = true;
    document.body.appendChild(toast);
    return toast;
  };

  const showToast = (msg) => {
    const toast = makeToast();
    toast.textContent = msg;
    toast.hidden = false;

    if (!prefersReduced) {
      toast.classList.remove('toast--in');
      // force reflow
      void toast.offsetWidth;
      toast.classList.add('toast--in');
    }

    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.hidden = true;
      toast.classList.remove('toast--in');
    }, 1400);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        return true;
      } catch {
        return false;
      }
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy') || '';
      if (!text) return;

      const ok = await copyText(text);

      const prev = btn.textContent;
      btn.textContent = ok ? 'Copiado' : 'Falhou';
      btn.disabled = true;

      showToast(ok ? 'Caminho copiado.' : 'Não foi possível copiar.');

      window.setTimeout(() => {
        btn.textContent = prev || 'Copiar';
        btn.disabled = false;
      }, 1100);
    });
  });
})();
