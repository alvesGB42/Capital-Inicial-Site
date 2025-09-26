/* script.js
   Versão melhorada: controles de acessibilidade (font-size, contraste, TTS),
   persistência via localStorage, menu mobile, ScrollReveal + smooth scroll.
   Comentários explicativos incluídos.
*/

/* ------------- HELPERS ------------- */
const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));

/* ------------- Estado / Configurações ------------- */
const SETTINGS_KEY = 'rock90s.accessibility';
const defaultSettings = {
  fontScale: 1,       // 1 = 100% (multiplicador)
  highContrast: false
};

// carregar / salvar preferências
function loadSettings(){
  try{
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {...defaultSettings};
  }catch(e){ return {...defaultSettings}; }
}
function saveSettings(s){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }

/* ------------- Inicialização ------------- */
document.addEventListener('DOMContentLoaded', () => {
  const settings = loadSettings();

  // elementos de acessibilidade
  const accessToggle = qs('#access-toggle');
  const accessControls = qs('#access-controls');
  const btnFontInc = qs('#font-increase');
  const btnFontDec = qs('#font-decrease');
  const btnFontReset = qs('#font-reset');
  const btnContrast = qs('#toggle-contrast');
  const btnReset = qs('#access-reset');
  const ttsStart = qs('#tts-start');
  const ttsStop = qs('#tts-stop');

  // menu mobile
  const mobileMenuBtn = qs('#mobile-menu-btn');
  const mobileMenu = qs('#mobile-menu');

  // aplicar preferências salvas
  applyFontScale(settings.fontScale);
  if(settings.highContrast) document.body.classList.add('alto-contraste');

  // Toggle exibição dos controles
  accessToggle.addEventListener('click', () => {
    const expanded = accessToggle.getAttribute('aria-expanded') === 'true';
    accessToggle.setAttribute('aria-expanded', String(!expanded));
    accessControls.setAttribute('aria-hidden', String(expanded));
    accessControls.classList.toggle('open', !expanded);
  });

  // atalhos de teclado: Alt + A abre/fecha acessibilidade
  document.addEventListener('keydown', (e) => {
    if(e.altKey && e.key.toLowerCase() === 'a'){
      accessToggle.click();
    }
  });

  /* ---------- Controle de fonte ---------- */
  btnFontInc.addEventListener('click', () => {
    const s = loadSettings();
    s.fontScale = clamp((s.fontScale || 1) + 0.05, 0.7, 2);
    applyFontScale(s.fontScale);
    saveSettings(s);
  });

  btnFontDec.addEventListener('click', () => {
    const s = loadSettings();
    s.fontScale = clamp((s.fontScale || 1) - 0.05, 0.7, 2);
    applyFontScale(s.fontScale);
    saveSettings(s);
  });

  btnFontReset.addEventListener('click', () => {
    const s = loadSettings();
    s.fontScale = 1;
    applyFontScale(1);
    saveSettings(s);
  });

  /* ---------- Alternar contraste ---------- */
  btnContrast.addEventListener('click', () => {
    const s = loadSettings();
    s.highContrast = !s.highContrast;
    document.body.classList.toggle('alto-contraste', s.highContrast);
    btnContrast.setAttribute('aria-pressed', String(s.highContrast));
    saveSettings(s);
  });

  /* ---------- Reset geral de acessibilidade ---------- */
  btnReset.addEventListener('click', () => {
    // restaurar defaults
    saveSettings(defaultSettings);
    applyFontScale(defaultSettings.fontScale);
    document.body.classList.toggle('alto-contraste', defaultSettings.highContrast);
    // atualizar UI
    btnContrast.setAttribute('aria-pressed', String(defaultSettings.highContrast));
  });

  /* ---------- Menu mobile simples ---------- */
  mobileMenuBtn.addEventListener('click', () => {
    const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.setAttribute('aria-hidden', String(expanded));
    mobileMenu.style.display = expanded ? 'none' : 'block';
  });
  // mobile: esconder ao clicar em link
  qsa('#mobile-menu a').forEach(a => a.addEventListener('click', () => {
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.style.display = 'none';
  }));

  /* ---------- Smooth scroll for same-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(!href || href === '#') return;
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        target.focus({preventScroll:true});
      }
    });
  });

  /* ---------- TTS (Text-To-Speech) - usa Web Speech API ---------- */
  let utterance = null;
  let synth = window.speechSynthesis;
  ttsStart.addEventListener('click', () => {
    // Se preferir, podemos ler apenas a seção visível ou conteúdo selecionado.
    const toRead = buildReadableText();
    if(!toRead) return;
    // parar qualquer fala em andamento
    if(synth.speaking) synth.cancel();

    utterance = new SpeechSynthesisUtterance(toRead);
    // idioma pt-BR:
    utterance.lang = 'pt-BR';
    utterance.rate = 1; // velocidade
    utterance.pitch = 1;
    synth.speak(utterance);
  });

  ttsStop.addEventListener('click', () => {
    if(synth.speaking) synth.cancel();
  });

  /* ---------- ScrollReveal animations (se disponível) ---------- */
  if(window.ScrollReveal){
    const sr = ScrollReveal({
      distance: '22px',
      duration: 650,
      easing: 'cubic-bezier(.2,.8,.2,1)',
      origin: 'bottom',
      viewFactor: 0.12,
      reset: false
    });

    sr.reveal('.hero-left', { origin: 'left', delay: 150 });
    sr.reveal('.hero-right', { origin: 'right', delay: 250 });
    sr.reveal('.highlight-card', { interval: 80, scale: 0.98 });
    sr.reveal('.mini-card', { interval: 60 });
    sr.reveal('.timeline-item', { interval: 90 });
    sr.reveal('.masonry-item', { interval: 70, origin: 'bottom' });
  }

  /* ---------- Formulário (simulação de envio) ---------- */
  const contactForm = qs('#contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // apenas simula envio — integrar com backend se necessário
      alert('Mensagem enviada (simulado). Obrigado!');
      contactForm.reset();
    });
  }
});

/* ========== Funções auxiliares ========== */

/**
 * Aplica escala de fonte no :root para deixá-la responsiva via CSS var
 * Mantém legibilidade usando multiplicador sobre uma base.
 */
function applyFontScale(scale){
  // escala segura entre 0.7 e 2
  const s = clamp(scale, 0.7, 2);
  document.documentElement.style.setProperty('--base-font', `${s}rem`);
}

/** Clamp simples */
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

/**
 * Constrói uma string simples com os principais textos da página para leitura por TTS.
 * A ideia é ler títulos e parágrafos principais, sem menus e sem textos repetidos.
 */
function buildReadableText(){
  const pieces = [];
  // Título da página
  const hero = document.querySelector('.hero-title');
  if(hero) pieces.push(hero.textContent.trim());

  // primeira lead
  const lead = document.querySelector('.lead');
  if(lead) pieces.push(lead.textContent.trim());

  // seções principais (h2 + p)
  document.querySelectorAll('main section').forEach(section => {
    const h2 = section.querySelector('h2');
    if(h2) pieces.push(h2.textContent.trim());
    const p = section.querySelector('p');
    if(p) pieces.push(p.textContent.trim());
  });

  return pieces.join('. ');
}

/* ========== Comentário final ==========
   - Preferências de acessibilidade são persistidas em localStorage (chave: rock90s.accessibility).
   - O TTS usa a Web Speech API — funciona na maioria dos navegadores modernos (Chrome, Edge, Firefox com suporte limitado).
   - Para suporte pleno de acessibilidade: verifique contraste das imagens, alt text, e teste com leitores de tela reais.
=========================================== */
