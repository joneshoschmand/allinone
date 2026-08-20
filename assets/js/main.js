/* ═══════════════════════════════════════════════════════════
   ALL IN ONE CONSULTING GERMANY — main.js
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Konfiguration ─────────────────────────────────────
     FORM_ENDPOINT: URL eines Formular-Dienstes (z. B. Formspree,
     Brevo, eigenes PHP-Skript), der die Bewerbung per POST
     entgegennimmt. Bleibt der Wert leer, öffnet das Formular
     stattdessen eine vorausgefüllte E-Mail an FALLBACK_MAIL.
  ─────────────────────────────────────────────────────────*/
  var FORM_ENDPOINT = '';
  var FALLBACK_MAIL = 'info@allinone-consulting.de';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Jahr im Footer ──────────────────────────────────── */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ── Header: Schatten beim Scrollen ──────────────────── */
  var hdr = $('#hdr');
  var onScroll = function () {
    hdr.classList.toggle('is-stuck', window.scrollY > 8);
    toggleStickyCta();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile-Navigation ───────────────────────────────── */
  var burger = $('#burger');
  var nav = $('#nav');

  var setNavTop = function () {
    nav.style.setProperty('--nav-top', hdr.getBoundingClientRect().bottom + 'px');
  };

  var closeNav = function () {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Menü öffnen');
  };

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    if (open) setNavTop();
  });

  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
  window.addEventListener('resize', function () { closeNav(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* ── Scroll-Reveal ───────────────────────────────────── */
  var reveals = $$('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
        el.classList.add('is-in');
        revealIO.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { revealIO.observe(el); });
  }

  /* ── Zahlen hochzählen ───────────────────────────────── */
  var counters = $$('[data-count]');
  var runCount = function (el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || '';
    if (reduced) { el.textContent = target + suffix; return; }

    var dur = 1400, t0 = null;
    var step = function (ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        countIO.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countIO.observe(el); });
  } else {
    counters.forEach(runCount);
  }

  /* ── Marquee: Inhalt duplizieren für nahtlose Schleife ── */
  $$('[data-marquee]').forEach(function (m) {
    var track = $('.marquee__track', m);
    var set = $('.marquee__set', track);
    if (!set) return;
    var clone = set.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    $$('a, button, input', clone).forEach(function (el) { el.tabIndex = -1; });
    track.appendChild(clone);
  });

  /* ── Aktiver Navigationspunkt ────────────────────────── */
  var navLinks = $$('.nav a[href^="#"]:not(.btn)');
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navIO.observe(s); });
  }

  /* ── Sticky CTA (mobil) ──────────────────────────────── */
  var sticky = $('#stickyCta');
  var applySec = $('#bewerbung');
  function toggleStickyCta() {
    if (!sticky) return;
    var past = window.scrollY > window.innerHeight * 0.65;
    var inForm = applySec && (function () {
      var r = applySec.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    })();
    sticky.classList.toggle('is-on', past && !inForm);
  }

  /* ── Zeichenzähler Motivation ────────────────────────── */
  var motivation = $('#motivation');
  var countOut = $('[data-count-out]');
  if (motivation && countOut) {
    motivation.addEventListener('input', function () {
      countOut.textContent = motivation.value.length;
    });
  }

  /* ── Formular ────────────────────────────────────────── */
  var form = $('#applyForm');
  if (!form) return;

  var status = $('[data-status]', form);
  var consentErr = $('[data-err-for="consent"]', form);
  var mailRe = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  var phoneRe = /^[+]?[\d\s()/.-]{6,}$/;

  var setError = function (input, msg) {
    var field = input.closest('.field');
    if (!field) return;
    field.classList.toggle('is-bad', !!msg);
    var out = $('[data-err]', field);
    if (out) out.textContent = msg || '';
  };

  var validate = function (input) {
    var v = input.value.trim();
    if (input.hasAttribute('required') && !v) {
      setError(input, 'Bitte ausfüllen.'); return false;
    }
    if (input.type === 'email' && v && !mailRe.test(v)) {
      setError(input, 'Bitte gültige E-Mail-Adresse angeben.'); return false;
    }
    if (input.type === 'tel' && v && !phoneRe.test(v)) {
      setError(input, 'Bitte gültige Telefonnummer angeben.'); return false;
    }
    setError(input, ''); return true;
  };

  var inputs = $$('input[required], textarea', form).filter(function (i) { return i.type !== 'checkbox'; });
  inputs.forEach(function (input) {
    input.addEventListener('blur', function () { validate(input); });
    input.addEventListener('input', function () {
      if (input.closest('.field').classList.contains('is-bad')) validate(input);
    });
  });

  var consent = $('#consent', form);
  consent.addEventListener('change', function () {
    if (consent.checked) consentErr.classList.remove('is-shown');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    status.className = 'form__status';

    // Honeypot: von Bots ausgefüllt → still verwerfen
    if ($('#company', form).value) return;

    var ok = true;
    inputs.forEach(function (input) { if (!validate(input)) ok = false; });

    if (!consent.checked) {
      consentErr.textContent = 'Bitte stimme der Datenschutzrichtlinie zu.';
      consentErr.classList.add('is-shown');
      ok = false;
    }

    if (!ok) {
      var bad = $('.field.is-bad input, .field.is-bad textarea', form) ||
                (!consent.checked ? consent : null);
      if (bad) bad.focus();
      status.textContent = 'Bitte prüfe die markierten Felder.';
      status.classList.add('is-bad');
      return;
    }

    var btn = $('button[type="submit"]', form);
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Wird gesendet …';

    var done = function (msg, good) {
      btn.disabled = false;
      btn.textContent = label;
      status.textContent = msg;
      status.classList.add(good ? 'is-ok' : 'is-bad');
    };

    var data = {
      Vorname:    $('#fname', form).value.trim(),
      Nachname:   $('#lname', form).value.trim(),
      'E-Mail':   $('#email', form).value.trim(),
      Telefon:    $('#phone', form).value.trim(),
      Motivation: $('#motivation', form).value.trim() || '—'
    };

    if (!FORM_ENDPOINT) {
      // Kein Endpoint hinterlegt → E-Mail-Programm mit fertiger Nachricht öffnen
      var body = Object.keys(data).map(function (k) { return k + ': ' + data[k]; }).join('\n');
      window.location.href = 'mailto:' + FALLBACK_MAIL +
        '?subject=' + encodeURIComponent('Bewerbung: ' + data.Vorname + ' ' + data.Nachname) +
        '&body=' + encodeURIComponent(body);
      done('Dein E-Mail-Programm öffnet sich mit der fertigen Bewerbung – bitte nur noch absenden.', true);
      form.reset();
      if (countOut) countOut.textContent = '0';
      return;
    }

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        if (countOut) countOut.textContent = '0';
        done('Danke! Deine Bewerbung ist angekommen – wir melden uns innerhalb von 24 Stunden.', true);
      })
      .catch(function () {
        done('Das hat leider nicht geklappt. Ruf uns gerne direkt an: 0151 10686258', false);
      });
  });
})();
