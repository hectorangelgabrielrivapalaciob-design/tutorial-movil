/**
 * MOBILE DEV TUTORIAL - Main JavaScript
 * Navegación, progreso, matrix background y HUD
 */

(function () {
  'use strict';

  // ---- Elementos ----
  const sections = document.querySelectorAll('.section');
  const sideLinks = document.querySelectorAll('.side-nav a, .quick-link, .nav-link, .mobile-link');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const progressFill = document.getElementById('progressFill');
  const sectionCounter = document.getElementById('sectionCounter');
  const scrollPercent = document.getElementById('scrollPercent');
  const canvas = document.getElementById('matrix-bg');

  const sectionIds = [
    'inicio',
    'control-versiones',
    'persistencia',
    'sensores',
    'multimedia',
    'servicios',
    'librerias',
    'depuracion'
  ];

  // ---- Navegación por secciones ----
  function showSection(id) {
    sections.forEach((sec) => {
      sec.classList.toggle('active', sec.id === id);
    });

    // Actualizar links activos
    document.querySelectorAll('.side-nav a, .nav-link').forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + id);
    });

    // Contador y progreso
    const index = sectionIds.indexOf(id);
    if (index >= 0) {
      const num = String(index + 1).padStart(2, '0');
      const total = String(sectionIds.length).padStart(2, '0');
      if (sectionCounter) sectionCounter.textContent = num + ' / ' + total;
      if (progressFill) {
        const pct = ((index + 1) / sectionIds.length) * 100;
        progressFill.style.width = pct + '%';
      }
    }

    // Cerrar menú móvil
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (menuToggle) menuToggle.classList.remove('open');

    // Scroll al inicio del contenido
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Click en cualquier enlace interno
  sideLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const id = href.slice(1);
        if (sectionIds.includes(id)) {
          showSection(id);
          // Actualizar hash sin saltar
          history.replaceState(null, '', href);
        }
      }
    });
  });

  // Menú hamburguesa
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // Cargar sección desde hash al inicio
  function initFromHash() {
    const hash = window.location.hash.slice(1);
    if (hash && sectionIds.includes(hash)) {
      showSection(hash);
    } else {
      showSection('inicio');
    }
  }

  // ---- Scroll percent (HUD) ----
  function updateScrollPercent() {
    const main = document.querySelector('.main-content');
    if (!main || !scrollPercent) return;
    const active = document.querySelector('.section.active');
    if (!active) return;
    const rect = active.getBoundingClientRect();
    const total = active.scrollHeight - window.innerHeight;
    let pct = 0;
    if (total > 0) {
      pct = Math.min(100, Math.max(0, Math.round((window.scrollY / total) * 100)));
    }
    scrollPercent.textContent = pct + '%';
  }

  window.addEventListener('scroll', updateScrollPercent, { passive: true });

  // ---- Matrix rain background (más visible) ----
  function initMatrix() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, columns, drops;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン<>[]{}#$%&ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ';
    const fontSize = 16;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
    }

    function draw() {
      // Trazo más lento = letras más persistentes y visibles
      ctx.fillStyle = 'rgba(10, 14, 23, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Más brillo: letras normales más claras + destellos frecuentes
        if (Math.random() > 0.92) {
          ctx.fillStyle = '#8ec8ff';
          ctx.shadowColor = '#3b9eff';
          ctx.shadowBlur = 8;
        } else if (Math.random() > 0.7) {
          ctx.fillStyle = '#3b9eff';
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = '#2a6fad';
          ctx.shadowBlur = 0;
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.97) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    resize();
    window.addEventListener('resize', resize);
    setInterval(draw, 45);
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', () => {
    initFromHash();
    initMatrix();
    updateScrollPercent();
  });

  // Soporte para botones atrás/adelante del navegador
  window.addEventListener('hashchange', initFromHash);
})();
