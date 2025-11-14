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

  // determine initial theme: stored preference or system preference
  const stored = getStoredTheme();
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(initial);

  // create and insert a toggle button into the header nav if present
  const navList = document.querySelector('header nav ul');
  if (!navList) return; // nothing to attach to

  const li = document.createElement('li');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'theme-toggle';
  btn.className = 'button theme-toggle';
  btn.setAttribute('aria-pressed', initial === 'dark' ? 'true' : 'false');
  btn.title = 'Toggle light / dark theme';
  btn.textContent = initial === 'dark' ? 'Light' : 'Dark';

  li.appendChild(btn);
  navList.appendChild(li);

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStoredTheme(next);
    btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
    btn.textContent = next === 'dark' ? 'Light' : 'Dark';
  });

  // expose a small public API for debugging if needed
  window.__setSiteTheme = function (t) { applyTheme(t); setStoredTheme(t); };
})();
