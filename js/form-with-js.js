// JS enhancements for form-with-js.html
// - masking for name field (remove disallowed chars)
// - temporary error messages in output area
// - character countdown for textarea with warning near limit
// - collect form_errors[] and serialize into hidden input before submit

(function () {
  'use strict';

  const form = document.querySelector('.contact-form');
  if (!form) return;

  // Elements
  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const comments = form.querySelector('#comments');
  const outError = document.getElementById('form-errors');
  const outInfo = document.getElementById('form-info');
  const hiddenErrors = document.getElementById('form-errors-data'); // hidden input to send JSON
  // per-field message spans (inline messages)
  const nameMsg = document.getElementById('name-msg');
  const emailMsg = document.getElementById('email-msg');
  const commentsMsg = document.getElementById('comments-msg');

  const form_errors = [];
  const invalidSet = new Set(); // track fields that have reported errors so we can notify when corrected

  // Pattern of disallowed chars for name (inverse of allowed pattern)
  const nameDisallowed = /[^A-Za-zÀ-ÖØ-öø-ÿ '\\-]+/g;

  function flashField(el) {
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 350);
  }

  function showTempError(msg, timeout = 3000) {
    if (!outError) return;
    outError.textContent = msg;
    outError.classList.add('temp-visible');
    clearTimeout(outError._hideTimeout);
    outError._hideTimeout = setTimeout(() => {
      outError.classList.remove('temp-visible');
      outError.textContent = '';
    }, timeout);
  }

  function showInfo(msg, timeout = 2500) {
    if (!outInfo) return;
    outInfo.textContent = msg;
    outInfo.classList.add('temp-visible');
    clearTimeout(outInfo._hideTimeout);
    outInfo._hideTimeout = setTimeout(() => {
      outInfo.classList.remove('temp-visible');
      outInfo.textContent = '';
    }, timeout);
  }

  // set a per-field inline message. severity: 'error'|'info'. timeout=0 means persist until cleared.
  function setFieldMessage(el, msg, severity = 'info', timeout = 3000) {
    if (!el) return;
    let target = null;
    if (el === name) target = nameMsg;
    else if (el === email) target = emailMsg;
    else if (el === comments) target = commentsMsg;
    if (!target) return;
    target.textContent = msg;
    target.classList.remove('field-info', 'field-error');
    target.classList.add(severity === 'error' ? 'field-error' : 'field-info');
    // clear any previous timer
    if (target._clearTimer) {
      clearTimeout(target._clearTimer);
      target._clearTimer = null;
    }
    if (timeout > 0) {
      target._clearTimer = setTimeout(() => {
        target.textContent = '';
        target.classList.remove('field-info', 'field-error');
        target._clearTimer = null;
      }, timeout);
    }
  }

  // Masking: strip disallowed characters as user types in name
  if (name) {
    name.addEventListener('input', () => {
      const before = name.value;
      const removed = before.match(nameDisallowed);
      if (removed) {
        const filtered = before.replace(nameDisallowed, '');
        name.value = filtered;
        flashField(name);
        const err = {
          field: 'name',
          type: 'illegal_char',
          removed: removed.join(''),
          before: before,
          time: new Date().toISOString()
        };
        form_errors.push(err);
        invalidSet.add('name');
        showTempError('Illegal character removed from Name');
        setFieldMessage(name, 'Illegal characters were removed from name', 'error', 0);
      }
      // if name is now valid and it was previously invalid, show info
      if (name.checkValidity() && invalidSet.has('name')) {
        invalidSet.delete('name');
        showInfo('Name looks good');
        setFieldMessage(name, 'Name looks good', 'info', 2500);
      }
    });
  }

  // Email: clear any custom validity on input
  if (email) {
    email.addEventListener('input', () => {
      email.setCustomValidity('');
      if (outError) outError.textContent = '';
      // if email becomes valid after prior error, show info
      if (email.checkValidity() && invalidSet.has('email')) {
        invalidSet.delete('email');
        showInfo('Email looks valid');
        setFieldMessage(email, 'Email looks valid', 'info', 2500);
      }
    });
  }

  // Character counter for comments
  const charsLeftEl = document.getElementById('chars-left');
  function updateCharCounter() {
    if (!comments || !charsLeftEl) return;
    const max = parseInt(comments.getAttribute('maxlength') || '2000', 10);
    const len = comments.value.length;
    const remaining = Math.max(0, max - len);
    charsLeftEl.textContent = remaining;
    if (remaining <= 50) {
      charsLeftEl.parentElement.classList.add('warning');
    } else {
      charsLeftEl.parentElement.classList.remove('warning');
    }
    if (len > max) {
      comments.setCustomValidity('Too many characters');
      flashField(comments);
      const err = { field: 'comments', type: 'too_long', maxlength: max, length: len, time: new Date().toISOString() };
      form_errors.push(err);
      invalidSet.add('comments');
      showTempError('You have exceeded the maximum comment length');
      setFieldMessage(comments, 'Comments exceed maximum length', 'error', 0);
    } else {
      comments.setCustomValidity('');
      if (invalidSet.has('comments')) {
        invalidSet.delete('comments');
        showInfo('Comments length OK');
        setFieldMessage(comments, 'Comments length OK', 'info', 2500);
      }
    }
  }
  if (comments) {
    comments.addEventListener('input', updateCharCounter);
    // initialize
    updateCharCounter();
  }

  // Handle submit: validate using Constraint Validation API and record errors
  form.addEventListener('submit', (ev) => {
    // prevent native validation UI; we will show messages
    ev.preventDefault();

    // Clear any previous form-errors hidden value
    if (hiddenErrors) hiddenErrors.value = '';

    let hadError = false;
    // Reset any custom validity
    [name, email, comments].forEach(el => { if (el) el.setCustomValidity(''); });

    // Let browser check validity. Use a helper to create clearer messages per-field.
    function getValidationMessage(el) {
      if (!el) return 'Invalid field';
      const v = el.validity;
      // valueMissing
      if (v.valueMissing) return (el.labels && el.labels[0]) ? `${el.labels[0].textContent.replace('*','').trim()} is required` : 'This field is required';
      if (v.typeMismatch) {
        if (el.type === 'email') return 'Please enter a valid email address';
        return 'Please enter a value in the correct format';
      }
      if (v.tooShort) return `${(el.labels && el.labels[0]) ? el.labels[0].textContent.replace('*','').trim() : 'Value'} must be at least ${el.getAttribute('minlength')} characters`;
      if (v.tooLong) return `${(el.labels && el.labels[0]) ? el.labels[0].textContent.replace('*','').trim() : 'Value'} must be no more than ${el.getAttribute('maxlength')} characters`;
      if (v.patternMismatch) return el.getAttribute('title') || 'Invalid format';
      if (v.rangeUnderflow || v.rangeOverflow) return el.validationMessage || 'Value out of range';
      if (v.badInput) return 'Please enter a valid value';
      // Fallback to built-in message or generic
      return el.validationMessage || 'Invalid field';
    }

    if (!form.checkValidity()) {
      hadError = true;
      const invalids = Array.from(form.querySelectorAll(':invalid'));
      invalids.forEach(el => {
        const msg = getValidationMessage(el);
        form_errors.push({ field: el.name || el.id || 'unknown', type: 'validation', message: msg, value: el.value, time: new Date().toISOString() });
        // mark field as invalid so we can announce when corrected
        if (el.name) invalidSet.add(el.name);
        else if (el.id) invalidSet.add(el.id);
        // show per-field inline message and keep it until corrected
        try { setFieldMessage(el, msg, 'error', 0); } catch (e) { /* ignore */ }
      });
      if (invalids.length) {
        const first = invalids[0];
        const message = getValidationMessage(first);
        showTempError(message || 'Please correct the highlighted fields');
        try { first.focus(); } catch (e) {}
      }
    }

    // Serialize form_errors into hidden input
    if (form_errors.length && hiddenErrors) {
      try { hiddenErrors.value = JSON.stringify(form_errors); } catch (e) { /* ignore */ }
    }

    // If there were errors, don't submit; otherwise submit normally
    if (hadError) return false;
    // submit form programmatically so hidden field is included
    form.submit();
    return true;
  });

})();
