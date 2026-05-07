/* Contact form (client-side validation + accessible messages)
   Note: No network submit, just UX feedback.
*/
(function(){
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const status = document.getElementById('form-status');

  function setError(field, msg){
    const id = field.getAttribute('id');
    const err = form.querySelector(`[data-error-for="${id}"]`);
    if (err){
      err.textContent = msg || '';
      err.hidden = !msg;
    }
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function clearErrors(){
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(f => setError(f, ''));
    if (status){
      status.hidden = true;
      status.textContent = '';
      status.className = '';
    }
  }

  function showStatus(kind, msg){
    if (!status) return;
    status.hidden = false;
    status.textContent = msg;
    status.className = kind === 'success' ? 'success' : 'error';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const type = form.querySelector('#need');
    const message = form.querySelector('#message');

    let ok = true;

    if (!name.value.trim()){
      setError(name, 'Campo obrigatório.');
      ok = false;
    }

    const emailVal = email.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    if (!emailVal){
      setError(email, 'Campo obrigatório.');
      ok = false;
    } else if (!emailOk){
      setError(email, 'Verifique o email.');
      ok = false;
    }

    if (!type.value){
      setError(type, 'Selecione uma opção.');
      ok = false;
    }

    if (!message.value.trim()){
      setError(message, 'Campo obrigatório.');
      ok = false;
    }

    if (!ok){
      // focus first invalid
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      showStatus('error', 'Revise os campos destacados.');
      return;
    }

    form.reset();
    showStatus('success', 'Mensagem enviada. Retornaremos em até 1 dia útil.');
  });
})();
