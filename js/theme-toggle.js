/**
 * IMPORTANT: This file must be loaded WITHOUT the 'defer' attribute
 * to ensure theme is set before the page renders.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'theme'; // values: 'light' | 'dark'
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      // inform UA controls about the chosen theme so native controls match
      root.style.colorScheme = 'dark';
    } else {
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(t) {
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch (e) {
      // ignore storage errors
    }
  }

  // ============================================================
  // PART 1: Initial theme setup (runs immediately)
  // ============================================================
  const stored = getStoredTheme();
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');

  // Apply theme immediately to document root
  applyTheme(theme);

  // ============================================================
  // PART 2: Button initialization and event listener (runs on DOMContentLoaded)
  // ============================================================
  document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return; // no button to enhance

    // Set initial button text and state
    btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');

    // Add click event listener
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      setStoredTheme(next);
      btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
      btn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
    });
  });

  // expose a small public API for debugging if needed
  window.__setSiteTheme = function (t) { applyTheme(t); setStoredTheme(t); };
})();
