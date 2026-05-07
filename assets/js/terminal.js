/* Fractalyn Systems — terminal typing effect */
(function(){
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const terminals = Array.from(document.querySelectorAll('[data-terminal]'));
  if (!terminals.length) return;

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const stepSets = {
    intro: [
      {
        cmd: 'boot --sequence=init',
        lines: [
          `<span class="t-sys">›</span> core services … <span class="t-ok">ok</span>`,
          `<span class="t-sys">›</span> design system … <span class="t-ok">ok</span>`,
          `<span class="t-sys">›</span> assets otimizados … <span class="t-ok">ok</span>`,
        ],
      },
      {
        cmd: 'verify --ui --responsive',
        lines: [
          `<span class="t-sys">›</span> layout desktop … <span class="t-ok">ok</span>`,
          `<span class="t-sys">›</span> layout mobile … <span class="t-ok">ok</span>`,
          `<span class="t-sys">›</span> animações … <span class="t-ok">ok</span>`,
        ],
      },
      {
        cmd: 'launch --site',
        lines: [
          `<span class="t-sys">›</span> render da interface … <span class="t-ok">ok</span>`,
          `<span class="t-sys">›</span> conexões visuais … <span class="t-ok">ok</span>`,
          `<span class="t-ok">✓</span> site pronto para exibição`,
        ],
      },
    ],
    hero: [
      {
        cmd: 'npm run build',
        lines: [
          `<span class="t-sys">›</span> compile <span class="t-dim">(client)</span> … <span class="t-ok">ok</span>`,
          `<span class="t-sys">›</span> bundle size … <span class="t-ok">ok</span>  <span class="t-dim">(assets otimizados)</span>`,
          `<span class="t-sys">›</span> a11y checks … <span class="t-ok">ok</span>  <span class="t-dim">(focus + contraste)</span>`,
          `<span class="t-sys">›</span> no overflow-x … <span class="t-ok">ok</span>`,
        ],
      },
      {
        cmd: 'npm run test',
        lines: [
          `<span class="t-sys">›</span> unit … <span class="t-ok">ok</span>`,
          `<span class="t-sys">›</span> responsive … <span class="t-ok">ok</span>  <span class="t-dim">(320 → 1920+)</span>`,
          `<span class="t-sys">›</span> keyboard nav … <span class="t-ok">ok</span>`,
        ],
      },
      {
        cmd: 'deploy --env=prod',
        lines: [
          `<span class="t-sys">›</span> upload … <span class="t-ok">ok</span>`,
          `<span class="t-sys">›</span> cache … <span class="t-ok">ok</span>`,
          `<span class="t-sys">›</span> healthcheck … <span class="t-ok">ok</span>`,
          `<span class="t-warn">›</span> note: métricas e logs ativados`,
          `<span class="t-ok">✓</span> live: produção estável`,
        ],
      },
    ],
  };

  const staticSets = {
    intro: [
      `<span class="t-dim">fractalyn@boot:~</span><span class="t-sys"> $ </span><span class="t-cmd">boot --sequence=init</span>`,
      `<span class="t-sys">›</span> core services … <span class="t-ok">ok</span>`,
      `<span class="t-sys">›</span> design system … <span class="t-ok">ok</span>`,
      `<span class="t-sys">›</span> assets otimizados … <span class="t-ok">ok</span>`,
      ``,
      `<span class="t-dim">fractalyn@boot:~</span><span class="t-sys"> $ </span><span class="t-cmd">verify --ui --responsive</span>`,
      `<span class="t-sys">›</span> layout desktop … <span class="t-ok">ok</span>`,
      `<span class="t-sys">›</span> layout mobile … <span class="t-ok">ok</span>`,
      `<span class="t-sys">›</span> animações … <span class="t-ok">ok</span>`,
      ``,
      `<span class="t-dim">fractalyn@boot:~</span><span class="t-sys"> $ </span><span class="t-cmd">launch --site</span>`,
      `<span class="t-sys">›</span> render da interface … <span class="t-ok">ok</span>`,
      `<span class="t-sys">›</span> conexões visuais … <span class="t-ok">ok</span>`,
      `<span class="t-ok">✓</span> site pronto para exibição`,
    ],
    hero: [
      `<span class="t-dim">fractalyn@deploy:~</span><span class="t-sys"> $ </span><span class="t-cmd">npm run build</span>`,
      `<span class="t-sys">›</span> compile <span class="t-dim">(client)</span> … <span class="t-ok">ok</span>`,
      `<span class="t-sys">›</span> bundle size … <span class="t-ok">ok</span>  <span class="t-dim">(assets otimizados)</span>`,
      `<span class="t-sys">›</span> a11y checks … <span class="t-ok">ok</span>  <span class="t-dim">(focus + contraste)</span>`,
      `<span class="t-sys">›</span> no overflow-x … <span class="t-ok">ok</span>`,
      ``,
      `<span class="t-dim">fractalyn@deploy:~</span><span class="t-sys"> $ </span><span class="t-cmd">npm run test</span>`,
      `<span class="t-sys">›</span> unit … <span class="t-ok">ok</span>`,
      `<span class="t-sys">›</span> responsive … <span class="t-ok">ok</span>  <span class="t-dim">(320 → 1920+)</span>`,
      `<span class="t-sys">›</span> keyboard nav … <span class="t-ok">ok</span>`,
      ``,
      `<span class="t-dim">fractalyn@deploy:~</span><span class="t-sys"> $ </span><span class="t-cmd">deploy --env=prod</span>`,
      `<span class="t-sys">›</span> upload … <span class="t-ok">ok</span>`,
      `<span class="t-sys">›</span> cache … <span class="t-ok">ok</span>`,
      `<span class="t-sys">›</span> healthcheck … <span class="t-ok">ok</span>`,
      `<span class="t-warn">›</span> note: métricas e logs ativados`,
      `<span class="t-ok">✓</span> live: produção estável`,
    ]
  };

  function createTerminal(root){
    const outputEl = root.querySelector('.term-output');
    const typedEl = root.querySelector('.term-typed');
    const cursorEl = root.querySelector('.term-cursor');
    const mode = root.dataset.terminal || 'hero';
    const steps = stepSets[mode] || stepSets.hero;
    const staticLines = staticSets[mode] || staticSets.hero;

    if (!outputEl || !typedEl || !cursorEl) return null;

    const clear = () => {
      outputEl.innerHTML = '';
      typedEl.textContent = '';
      cursorEl.style.opacity = '1';
    };

    const addLine = (html) => {
      const div = document.createElement('div');
      div.className = 'term-line';
      div.innerHTML = html;
      outputEl.appendChild(div);
      root.scrollTop = root.scrollHeight;
    };

    const typeCommand = async (cmd, speed = mode === 'intro' ? 44 : 52) => {
      typedEl.textContent = '';
      for (const ch of cmd) {
        typedEl.textContent += ch;
        await sleep(speed + Math.random() * 20);
      }
    };

    const commitCommand = async () => {
      addLine(`<span class="t-dim">${mode === 'intro' ? 'fractalyn@boot:~' : 'fractalyn@deploy:~'}</span><span class="t-sys"> $ </span><span class="t-cmd">${typedEl.textContent}</span>`);
      typedEl.textContent = '';
      await sleep(mode === 'intro' ? 110 : 140);
    };

    const renderStatic = () => {
      clear();
      staticLines.forEach((line) => {
        if (line === ``) {
          addLine('<span class="t-dim"> </span>');
          return;
        }
        addLine(line);
      });
      cursorEl.style.opacity = '0.65';
    };

    const run = async () => {
      clear();
      for (const step of steps) {
        await typeCommand(step.cmd);
        await commitCommand();
        for (const line of step.lines) {
          await sleep((mode === 'intro' ? 120 : 220) + Math.random() * (mode === 'intro' ? 60 : 160));
          addLine(line);
        }
        await sleep(mode === 'intro' ? 180 : 420);
      }
      cursorEl.style.opacity = '0.65';
    };

    return { mode, run, renderStatic };
  }

  const instances = terminals.map(createTerminal).filter(Boolean);
  const intro = instances.find(item => item.mode === 'intro');
  const hero = instances.find(item => item.mode === 'hero');
  const body = document.body;
  const introLoader = document.querySelector('[data-intro-loader]');
  const introStorageKey = 'fractalyn:intro-seen';

  function hasSeenIntro(){
    try {
      return window.sessionStorage.getItem(introStorageKey) === '1' || window.localStorage.getItem(introStorageKey) === '1';
    } catch (error) {
      return body.dataset.introSeen === 'true';
    }
  }

  function markIntroSeen(){
    try {
      window.sessionStorage.setItem(introStorageKey, '1');
      window.localStorage.setItem(introStorageKey, '1');
    } catch (error) {
      body.dataset.introSeen = 'true';
    }
  }

  function revealSite(){
    body.classList.remove('intro-loading');
    body.classList.add('intro-ready');
    if (introLoader) {
      introLoader.classList.add('is-hidden');
      window.setTimeout(() => {
        introLoader.setAttribute('hidden', 'hidden');
        introLoader.style.display = 'none';
      }, 520);
    }
  }

  if (prefersReduced) {
    instances.forEach(instance => instance.renderStatic());
    markIntroSeen();
    revealSite();
    return;
  }

  if (hero) hero.renderStatic();

  if (intro && !hasSeenIntro()) {
    intro.run().then(async () => {
      await sleep(260);
      markIntroSeen();
      revealSite();
    });
  } else {
    if (intro) intro.renderStatic();
    markIntroSeen();
    revealSite();
    if (!intro && hero) hero.run();
  }

  window.addEventListener('pageshow', () => {
    if (hasSeenIntro()) revealSite();
  });
})();
