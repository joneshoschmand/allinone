/* ═══════════════════════════════════════════════════════════
   ALL IN ONE CONSULTING GERMANY — main.js
   Navigation · Scroll-Animationen · Parallax · Formular
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Konfiguration ─────────────────────────────────────
     FORM_ENDPOINT: Formspree-Endpoint, der die Bewerbung per POST
     entgegennimmt. Wird der Wert geleert, öffnet das Formular
     stattdessen eine vorausgefüllte E-Mail an FALLBACK_MAIL.
  ─────────────────────────────────────────────────────────*/
  var FORM_ENDPOINT = 'https://formspree.io/f/myezngaz';
  var FALLBACK_MAIL = 'info@allinone-consulting.de';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Jahr im Footer ──────────────────────────────────── */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ═══════════════════════════════════════════════════════
     1 · HEADLINES IN WÖRTER ZERLEGEN
     Nur Textknoten werden ersetzt, damit <em>, <span> und <br>
     in den Überschriften erhalten bleiben.
     ═══════════════════════════════════════════════════════ */
  function splitWords(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [], n, i = 0;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(function (node) {
      if (!node.nodeValue.trim()) return;
      var frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function (word) {
        if (!word) return;
        if (!word.trim()) { frag.appendChild(document.createTextNode(word)); return; }
        var outer = document.createElement('span');
        outer.className = 'sw-o';
        var inner = document.createElement('span');
        inner.className = 'sw';
        inner.style.setProperty('--w', i++);
        inner.textContent = word;
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  if (!reduced) $$('[data-split]').forEach(splitWords);

  /* ═══════════════════════════════════════════════════════
     2 · STAGGER-INDEX FÜR GRUPPEN
     ═══════════════════════════════════════════════════════ */
  $$('[data-anim-group]').forEach(function (group) {
    var kids = $$(':scope > *', group);
    kids.forEach(function (kid, i) {
      if (!kid.hasAttribute('data-anim')) kid.setAttribute('data-anim', group.dataset.animGroup || 'up');
      kid.style.setProperty('--i', i);
    });
  });

  /* ═══════════════════════════════════════════════════════
     3 · REVEAL BEIM HEREINSCROLLEN

     Bewusst ueber die Scroll-Schleife statt per IntersectionObserver:
     Bei Ankerspruengen und sehr schnellem Scrollen kann ein Element in
     einem einzigen Frame von unterhalb nach oberhalb des Viewports
     springen – der Observer meldet dann nie eine Ueberschneidung und der
     Abschnitt bliebe dauerhaft unsichtbar. Die Abtastung prueft dagegen
     jedes Mal die tatsaechliche Position. Die Liste schrumpft mit jedem
     eingeblendeten Element.
     ═══════════════════════════════════════════════════════ */
  var pending = $$('[data-anim], [data-split]');
  var counters = $$('[data-count]');
  var sweepOn = false;

  function sweepReveals(vh) {
    if (!pending.length) return;
    var still = [];
    for (var k = 0; k < pending.length; k++) {
      if (pending[k].getBoundingClientRect().top < vh * 0.92) pending[k].classList.add('is-in');
      else still.push(pending[k]);
    }
    pending = still;
  }

  if (reduced) {
    pending.forEach(function (el) { el.classList.add('is-in'); });
    pending = [];
  }

  /* ═══════════════════════════════════════════════════════
     4 · SCROLL-SCHLEIFE: Fortschritt, Parallax, Header, CTA
     ═══════════════════════════════════════════════════════ */
  var bar = $('.progress__bar');
  var hdr = $('#hdr');
  var sticky = $('#stickyCta');
  var applySec = $('#bewerbung');
  var hero = $('.hero__copy');

  var paraEls = $$('[data-parallax]').map(function (el) {
    return { el: el, amt: parseFloat(el.dataset.parallax) || 0.1 };
  });

  // Karrierepfad: Die Linie waechst mit dem Scrollen, die Stationen leuchten
  // nacheinander auf. --p (0 … 1) steuert beides, die Richtung macht das CSS.
  var drawEls = $$('[data-draw]').map(function (el) {
    return { el: el, stations: $$('.path__st', el) };
  });

  var ticking = false;

  function frame() {
    ticking = false;
    var y = window.scrollY;
    var vh = window.innerHeight;

    // Fortschrittsbalken
    if (bar) {
      var max = document.documentElement.scrollHeight - vh;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }

    // Header
    if (hdr) hdr.classList.toggle('is-stuck', y > 8);

    if (sweepOn) { sweepReveals(vh); sweepCounters(vh); }

    // Sticky-CTA: ab 65 % Viewporthöhe, aber nicht über dem Formular
    if (sticky) {
      var inForm = false;
      if (applySec) {
        var fr = applySec.getBoundingClientRect();
        inForm = fr.top < vh && fr.bottom > 0;
      }
      sticky.classList.toggle('is-on', y > vh * 0.65 && !inForm);
    }

    if (reduced) return;

    // Hero-Inhalt zieht beim Wegscrollen leicht hoch und blendet aus
    if (hero) {
      var p = Math.min(y / vh, 1);
      hero.style.transform = 'translate3d(0,' + (p * 60).toFixed(1) + 'px,0)';
      hero.style.opacity = (1 - p * 0.9).toFixed(3);
    }

    // Karrierepfad
    drawEls.forEach(function (o) {
      var r = o.el.getBoundingClientRect();
      var span = r.height + vh * 0.35;
      var p = span > 0 ? (vh * 0.82 - r.top) / span : 0;
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      o.el.style.setProperty('--p', p.toFixed(4));
      var n = o.stations.length;
      o.stations.forEach(function (st, i) {
        st.classList.toggle('is-on', p >= (n > 1 ? i / (n - 1) : 0) * 0.92);
      });
    });

    // Parallax
    paraEls.forEach(function (o) {
      var r = o.el.getBoundingClientRect();
      if (r.bottom < -240 || r.top > vh + 240) return;
      var mid = (r.top + r.height / 2 - vh / 2) / vh;   // -1 … 1
      o.el.style.transform = 'translate3d(0,' + (-mid * o.amt * 100).toFixed(2) + 'px,0)';
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  frame();

  function startReveals() {
    sweepOn = true;
    sweepReveals(window.innerHeight);
    sweepCounters(window.innerHeight);
  }

  // Regelfall: zwei Frames warten, damit der Startzustand einmal gerendert
  // wurde – sonst springt der sichtbare Bereich ohne Uebergang auf den
  // Endzustand.
  requestAnimationFrame(function () { requestAnimationFrame(startReveals); });

  // In einem Hintergrund-Tab laeuft requestAnimationFrame nicht. Der Timer
  // feuert auch dort und stellt sicher, dass die Abtastung aktiv wird; beim
  // Wechsel in den Vordergrund wird zusaetzlich nachgefasst.
  setTimeout(startReveals, 250);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { startReveals(); onScroll(); }
  });

  /* ═══════════════════════════════════════════════════════
     5 · ZAHLEN HOCHZÄHLEN
     Gleiche Abtastung wie beim Reveal – so bleibt keine Zahl auf 0
     stehen, wenn man schnell an ihr vorbeiscrollt.
     ═══════════════════════════════════════════════════════ */
  function runCount(el, instant) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || '';
    if (reduced || instant) { el.textContent = target + suffix; return; }

    var dur = 1500, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function sweepCounters(vh) {
    if (!counters.length) return;
    var still = [];
    for (var k = 0; k < counters.length; k++) {
      var r = counters[k].getBoundingClientRect();
      if (r.top > vh * 0.85) { still.push(counters[k]); continue; }
      // Schon vorbeigescrollt? Dann direkt den Endwert setzen.
      runCount(counters[k], r.bottom < 0);
    }
    counters = still;
  }

  /* ═══════════════════════════════════════════════════════
     6 · MARQUEE: Inhalt duplizieren für nahtlose Schleife
     ═══════════════════════════════════════════════════════ */
  $$('[data-marquee]').forEach(function (m) {
    var track = $('.marquee__track', m);
    var set = $('.marquee__set', track);
    if (!set) return;
    var clone = set.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    $$('a, button, input', clone).forEach(function (el) { el.tabIndex = -1; });
    track.appendChild(clone);
  });

  /* ═══════════════════════════════════════════════════════
     7 · LIME-SCHEIN FOLGT DEM ZEIGER (Karten)
     ═══════════════════════════════════════════════════════ */
  if (!reduced && window.matchMedia('(hover:hover)').matches) {
    $$('.perk').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    // Karten kippen leicht zum Zeiger. Die Neigung sitzt auf dem inneren
    // Element, weil das aeussere schon die Scroll-Animation transformiert.
    $$('[data-tilt]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--ry', (dx * 9).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-dy * 7).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* Linienlaenge der Auto-Illustration ermitteln, damit sie sich nachzeichnen
     laesst – feste Werte im CSS wuerden bei Skalierung nicht passen. */
  $$('.car__draw > *').forEach(function (el) {
    if (typeof el.getTotalLength === 'function') {
      el.style.setProperty('--len', Math.ceil(el.getTotalLength()));
    }
  });

  /* ═══════════════════════════════════════════════════════
     8 · NAVIGATION
     ═══════════════════════════════════════════════════════ */
  var burger = $('#burger');
  var nav = $('#nav');

  function closeNav() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Menü öffnen');
  }

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    if (open) nav.style.setProperty('--nav-top', hdr.getBoundingClientRect().bottom + 'px');
  });

  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
  window.addEventListener('resize', closeNav);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  // Aktiver Menüpunkt
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

  /* ═══════════════════════════════════════════════════════
     9 · FORMULAR
     ═══════════════════════════════════════════════════════ */
  var motivation = $('#motivation');
  var countOut = $('[data-count-out]');
  if (motivation && countOut) {
    motivation.addEventListener('input', function () {
      countOut.textContent = motivation.value.length;
    });
  }

  var form = $('#applyForm');
  if (!form) return;

  var status = $('[data-status]', form);
  var consentErr = $('[data-err-for="consent"]', form);
  var mailRe = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  var phoneRe = /^[+]?[\d\s()/.-]{6,}$/;

  function setError(input, msg) {
    var field = input.closest('.field');
    if (!field) return;
    field.classList.toggle('is-bad', !!msg);
    var out = $('[data-err]', field);
    if (out) out.textContent = msg || '';
  }

  function validate(input) {
    var v = input.value.trim();
    if (input.hasAttribute('required') && !v) { setError(input, 'Bitte ausfüllen.'); return false; }
    if (input.type === 'email' && v && !mailRe.test(v)) { setError(input, 'Bitte gültige E-Mail-Adresse angeben.'); return false; }
    if (input.type === 'tel' && v && !phoneRe.test(v)) { setError(input, 'Bitte gültige Telefonnummer angeben.'); return false; }
    setError(input, ''); return true;
  }

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
      var bad = $('.field.is-bad input, .field.is-bad textarea', form) || (!consent.checked ? consent : null);
      if (bad) bad.focus();
      status.textContent = 'Bitte prüfe die markierten Felder.';
      status.classList.add('is-bad');
      return;
    }

    var btn = $('button[type="submit"]', form);
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Wird gesendet …';

    function done(msg, good) {
      btn.disabled = false;
      btn.textContent = label;
      status.textContent = msg;
      status.classList.add(good ? 'is-ok' : 'is-bad');
    }

    var v = {
      vorname:    $('#fname', form).value.trim(),
      nachname:   $('#lname', form).value.trim(),
      email:      $('#email', form).value.trim(),
      telefon:    $('#phone', form).value.trim(),
      motivation: $('#motivation', form).value.trim() || '—'
    };

    if (!FORM_ENDPOINT) {
      var body = 'Vorname: ' + v.vorname + '\n' +
                 'Nachname: ' + v.nachname + '\n' +
                 'E-Mail: ' + v.email + '\n' +
                 'Telefon: ' + v.telefon + '\n' +
                 'Motivation: ' + v.motivation;
      window.location.href = 'mailto:' + FALLBACK_MAIL +
        '?subject=' + encodeURIComponent('Bewerbung: ' + v.vorname + ' ' + v.nachname) +
        '&body=' + encodeURIComponent(body);
      done('Dein E-Mail-Programm öffnet sich mit der fertigen Bewerbung – bitte nur noch absenden.', true);
      form.reset();
      if (countOut) countOut.textContent = '0';
      return;
    }

    /* Felder mit fuehrendem Unterstrich wertet Formspree selbst aus, der Rest
       landet als Klartext in der Benachrichtigungsmail. 'email' muss klein
       geschrieben sein – daraus baut Formspree den Antwort-Empfaenger, sodass
       sich direkt aus der Mail heraus auf die Bewerbung antworten laesst. */
    var payload = {
      email:      v.email,
      _subject:   'Bewerbung über die Website: ' + v.vorname + ' ' + v.nachname,
      _language:  'de',
      Vorname:    v.vorname,
      Nachname:   v.nachname,
      Telefon:    v.telefon,
      Motivation: v.motivation
    };

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        // Antwort immer als JSON lesen: Formspree begruendet Ablehnungen dort.
        return r.json().catch(function () { return {}; })
          .then(function (json) { return { ok: r.ok, status: r.status, json: json }; });
      })
      .then(function (res) {
        if (!res.ok) {
          var detail = res.json && res.json.errors
            ? res.json.errors.map(function (e) { return e.message; }).join(', ')
            : 'HTTP ' + res.status;
          throw new Error(detail);
        }
        form.reset();
        if (countOut) countOut.textContent = '0';
        done('Danke! Deine Bewerbung ist angekommen – wir melden uns innerhalb von 24 Stunden.', true);
      })
      .catch(function (err) {
        // Formspree-Meldungen sind englisch und betreffen meist die Einrichtung
        // (Formular inaktiv, Kontingent erschoepft). Bewerber sehen deshalb eine
        // verstaendliche Alternative, die Ursache landet in der Konsole.
        if (window.console) console.warn('Formularversand fehlgeschlagen:', err && err.message);
        done('Das hat leider nicht geklappt. Ruf uns gerne direkt an: 0151 10686258', false);
      });
  });
})();
