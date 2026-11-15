(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = (n) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const money2 = (n) => (n < 0 ? '−$' : '$') + Math.abs(n).toFixed(2);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On a local preview there is no form backend, so sign-ups are simulated.
  const isPreview =
    location.protocol === 'file:' ||
    /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  const store = {
    get(key) { try { return sessionStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { sessionStorage.setItem(key, value); } catch (e) { /* storage unavailable */ } },
  };

  // Count a number up or down to its new value.
  function tween(el, to, format) {
    const from = el.dataset.value !== undefined ? Number(el.dataset.value) : to;
    el.dataset.value = to;
    cancelAnimationFrame(el._raf);
    if (reduceMotion || from === to) { el.textContent = format(to); return; }
    const start = performance.now();
    const duration = 380;
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(Math.round(from + (to - from) * eased));
      if (p < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }

  /* ---------- Header: shadow on scroll + mobile menu ---------- */
  const header = $('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const toggle = $('.nav-toggle', header);
    const setMenu = (open) => {
      header.classList.toggle('menu-open', open);
      if (toggle) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      }
    };
    if (toggle) {
      toggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
      $$('.nav-links a', header).forEach((a) => a.addEventListener('click', () => setMenu(false)));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
      });
      window.addEventListener('resize', () => { if (window.innerWidth > 920) setMenu(false); });
    }
  }

  /* ---------- Scroll reveal ---------- */
  if ('IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('js-reveal');
    let observerWorks = false;
    const io = new IntersectionObserver((entries) => {
      observerWorks = true;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    $$('.reveal').forEach((el) => io.observe(el));
    // Safety net: if the observer never reports (unusual browsers, embedded views), show everything.
    setTimeout(() => {
      if (!observerWorks) document.documentElement.classList.remove('js-reveal');
    }, 2500);
  }

  /* ---------- Interactive order page demo ---------- */
  const demo = $('#demo-form');
  if (demo) {
    // Offer the next four Saturdays at least 10 days away; the second one is fully booked.
    const dates = $('#d-dates');
    const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const first = new Date();
    first.setHours(12, 0, 0, 0);
    first.setDate(first.getDate() + 10);
    while (first.getDay() !== 6) first.setDate(first.getDate() + 1);

    for (let i = 0; i < 4; i++) {
      const d = new Date(first);
      d.setDate(first.getDate() + i * 7);
      const full = i === 1;
      const label = fmt.format(d);

      const chip = document.createElement('label');
      chip.className = 'chip';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'date';
      input.value = d.toISOString().slice(0, 10);
      input.checked = i === 0;
      input.disabled = full;
      const text = document.createElement('span');
      text.textContent = label + (full ? ' · Full' : '');
      text.dataset.label = label;
      chip.append(input, text);
      dates.append(chip);

      if (i === 0 && $('#op-next-date')) $('#op-next-date').textContent = label;
      if (full && $('#float-full-date')) $('#float-full-date').textContent = label;
    }

    const TIER_SUPPORT = 25; // extra cost per added tier (dowels, boards, assembly)
    const totalEl = $('#d-total');
    const depositEl = $('#d-deposit');
    const bookBtn = $('#d-book');
    const note = $('#d-note');

    const calculate = () => {
      const size = $('#d-size', demo).selectedOptions[0];
      const servings = Number(size.value);
      const tiers = Number(size.dataset.tiers);
      const perServing = Number(demo.elements.flavor.value);
      const designFactor = Number(demo.elements.design.value);

      let total = (servings * perServing + (tiers - 1) * TIER_SUPPORT) * designFactor;
      $$('input[name="extra"]:checked', demo).forEach((x) => { total += Number(x.value); });
      total = Math.ceil(total / 5) * 5; // round up to the nearest $5
      const deposit = Math.ceil(total / 2);

      tween(totalEl, total, money);
      tween(depositEl, deposit, money);
      bookBtn.textContent = `Book & pay ${money(deposit)} deposit`;
      note.hidden = true;
      return { size, deposit };
    };

    demo.addEventListener('change', calculate);
    demo.addEventListener('submit', (e) => {
      e.preventDefault();
      const { size, deposit } = calculate();
      const pick = (name) => {
        const input = $(`input[name="${name}"]:checked`, demo);
        if (!input) return '';
        const span = input.nextElementSibling;
        return span.dataset.label || span.textContent;
      };
      $('#d-toast-summary').textContent =
        `${size.textContent.split(' · ')[0]}, ${pick('flavor')}, ${pick('design').toLowerCase()}`;
      $('#d-toast-date').textContent = pick('date') || 'Saturday';
      $('#d-toast-dep').textContent = money(deposit);
      note.hidden = false;
    });
    calculate();
  }

  /* ---------- Price check calculator ---------- */
  const pc = $('#pc-form');
  if (pc) {
    const read = (id) => parseFloat($(id).value);
    const wageEl = $('#pc-wage');
    const bar = $('#pc-bar-fill');
    const verdict = $('#pc-verdict');

    const update = () => {
      const price = read('#pc-price');
      const costs = read('#pc-costs');
      const hours = read('#pc-hours');
      const target = read('#pc-target');

      if (![price, costs, hours, target].every(Number.isFinite) || hours <= 0 || target < 0) {
        wageEl.textContent = '—';
        bar.style.width = '0%';
        verdict.textContent = 'Fill in all four boxes, with more than zero hours.';
        return;
      }

      const wage = (price - costs) / hours;
      const fairPrice = Math.ceil(costs + hours * target);
      wageEl.textContent = money2(wage);

      const ratio = target > 0 ? Math.max(0, Math.min(1, wage / target)) : 1;
      bar.style.width = (ratio * 100).toFixed(1) + '%';
      bar.classList.toggle('good', wage >= target);

      verdict.textContent = '';
      if (wage >= target) {
        verdict.append('Nice, you hit your goal on this one. CrumbQuote keeps it that way when your costs go up.');
      } else {
        const lead = wage < 0
          ? 'You lost money on this order. '
          : `That’s ${money2(target - wage)} an hour short of your goal. `;
        const strong = document.createElement('b');
        strong.textContent = money(fairPrice);
        verdict.append(`${lead}To earn ${money(target)} an hour, charge `, strong, '.');
      }
    };

    pc.addEventListener('input', update);
    pc.addEventListener('submit', (e) => e.preventDefault());
    update();
  }

  /* ---------- Monthly / yearly toggle (pricing page) ---------- */
  const plans = {
    monthly: { amount: '$9', per: '/month', alt: 'Billed monthly · 14-day free trial' },
    yearly: { amount: '$90', per: '/year', alt: 'That’s $7.50 a month · 14-day free trial' },
  };
  const toggleButtons = $$('.billing-toggle button');
  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = plans[btn.dataset.billing];
      toggleButtons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      const amount = $('#plan-amount');
      if (amount) {
        amount.textContent = plan.amount;
        $('#plan-per').textContent = plan.per;
        $('#plan-alt').textContent = plan.alt;
      }
    });
  });

  /* ---------- Early access forms (Netlify Forms) ---------- */
  async function sendSignup(fields) {
    if (isPreview) {
      await new Promise((r) => setTimeout(r, 400));
      return { preview: true };
    }
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(fields).toString(),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return { preview: false };
  }

  // Prefill the full form with an email entered elsewhere on the site.
  const joinEmail = $('#join-email');
  if (joinEmail && !joinEmail.value) {
    const saved = store.get('cq-email');
    if (saved) joinEmail.value = saved;
  }

  $$('.js-waitlist').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = $('.form-msg', form);
      const button = $('button[type="submit"]', form);
      const email = $('input[type="email"]', form);

      if (!email.value.trim() || !email.checkValidity()) {
        msg.className = 'form-msg err';
        msg.textContent = 'Please enter a valid email address.';
        email.focus();
        return;
      }

      const fields = Object.fromEntries(new FormData(form));
      if (fields['bot-field']) return; // honeypot filled in: silently ignore bots
      delete fields['bot-field'];
      fields['form-name'] = 'waitlist'; // every form feeds the same Netlify list

      button.disabled = true;
      msg.className = 'form-msg';
      msg.textContent = 'Saving…';

      try {
        const { preview } = await sendSignup(fields);

        if (form.id === 'join-form') {
          const done = $('#join-done');
          form.hidden = true;
          done.hidden = false;
          $('.preview-note', done).hidden = !preview;
          done.focus();
        } else {
          store.set('cq-email', email.value.trim());
          msg.className = 'form-msg ok';
          msg.textContent = 'You’re on the list! ';
          const link = document.createElement('a');
          link.href = 'early-access.html';
          link.textContent = 'Tell us about your bakery →';
          msg.append(link);
          if (preview) msg.append(' (Preview mode: nothing was saved.)');
          form.reset();
        }
      } catch (err) {
        msg.className = 'form-msg err';
        msg.textContent = 'Sorry, that didn’t go through. Please try again in a moment.';
      } finally {
        button.disabled = false;
      }
    });
  });

  /* ---------- Footer year ---------- */
  $$('.js-year').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
