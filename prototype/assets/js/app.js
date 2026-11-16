(() => {
  'use strict';

  const C = window.ROMINOS;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const SVGNS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- utilidades ---------------- */
  const money = (n) => '$' + Math.round(n).toLocaleString('es-MX');
  const pad = (n) => String(n).padStart(2, '0');
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const fmtLong = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const fmtShort = new Intl.DateTimeFormat('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtMonth = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' });
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const longDate = (iso) => cap(fmtLong.format(fromISO(iso)));
  const waUrl = (text) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (parent) parent.appendChild(n);
    return n;
  };

  // Generador pseudoaleatorio con semilla (para que la demo siempre se vea igual)
  const hash = (str) => { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; };
  const mulberry = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* sin almacenamiento */ } },
  };

  /* ---------------- fechas ---------------- */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const minDate = new Date(today); minDate.setDate(minDate.getDate() + 1);
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 11, 1);

  function isBusy(iso) {
    if (C.ocupadasFijas.includes(iso)) return true;
    const d = fromISO(iso);
    const daysAhead = (d - today) / 86400000;
    const near = daysAhead < 70;
    const dow = d.getDay();
    const p = dow === 6 ? (near ? 0.72 : 0.38) : dow === 0 ? (near ? 0.42 : 0.2) : dow === 5 ? (near ? 0.3 : 0.12) : 0.05;
    return hash('rominos' + iso) < p;
  }
  const pending = () => store.get('rominos-apartados', []);

  function dayStatus(iso) {
    const d = fromISO(iso);
    if (d < minDate) return 'past';
    if (pending().includes(iso)) return 'pending';
    if (isBusy(iso)) return 'busy';
    return 'free';
  }

  function rateFor(iso) {
    const dow = iso ? fromISO(iso).getDay() : 6;
    if (dow === 6) return { key: 'sabado', label: 'sábado', price: C.renta.sabado };
    if (dow === 5 || dow === 0) return { key: 'viernesDomingo', label: dow === 5 ? 'viernes' : 'domingo', price: C.renta.viernesDomingo };
    return { key: 'entreSemana', label: 'entre semana', price: C.renta.entreSemana };
  }

  /* ---------------- estado ---------------- */
  const state = {
    date: null,
    event: 'infantil',
    guests: 60,
    mesas: 6,
    sillas: 60,
    auto: true,
    deco: 'tematica',
    extras: { castillo: 1, resbaladilla: 0, horas: 0 },
    view: new Date(today.getFullYear(), today.getMonth(), 1),
  };
  const eventById = (id) => C.eventos.find((e) => e.id === id);

  /* ================= CALENDARIO ================= */
  const calDays = $('#calDays');
  function renderCalendar() {
    const y = state.view.getFullYear();
    const m = state.view.getMonth();
    $('#calMonth').textContent = cap(fmtMonth.format(state.view));
    $('#calPrev').disabled = y === today.getFullYear() && m === today.getMonth();
    $('#calNext').disabled = state.view >= maxMonth;

    const first = new Date(y, m, 1);
    const offset = (first.getDay() + 6) % 7; // semana inicia en lunes
    const days = new Date(y, m + 1, 0).getDate();
    const frag = document.createDocumentFragment();

    for (let i = 0; i < offset; i++) {
      const s = document.createElement('span');
      s.className = 'cal__day cal__day--empty';
      frag.appendChild(s);
    }
    for (let d = 1; d <= days; d++) {
      const iso = `${y}-${pad(m + 1)}-${pad(d)}`;
      const status = dayStatus(iso);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `cal__day cal__day--${status}`;
      b.textContent = d;
      b.dataset.date = iso;
      const label = cap(fmtLong.format(fromISO(iso)));
      if (status === 'past') { b.disabled = true; b.setAttribute('aria-label', `${label}, no disponible`); }
      else if (status === 'busy') { b.setAttribute('aria-disabled', 'true'); b.setAttribute('aria-label', `${label}, ocupado`); }
      else {
        const r = rateFor(iso);
        b.setAttribute('aria-label', `${label}, ${status === 'pending' ? 'apartado por ti, por confirmar' : 'disponible'}, renta ${money(r.price)}`);
      }
      if (iso === state.date) { b.classList.add('cal__day--selected'); b.setAttribute('aria-pressed', 'true'); }
      frag.appendChild(b);
    }
    calDays.replaceChildren(frag);
  }

  calDays.addEventListener('click', (e) => {
    const b = e.target.closest('.cal__day');
    if (!b || b.disabled || b.getAttribute('aria-disabled') === 'true') return;
    state.date = b.dataset.date;
    renderCalendar();
    renderSummary();
    $(`.cal__day[data-date="${state.date}"]`)?.focus();
  });
  $('#calPrev').addEventListener('click', () => { state.view = new Date(state.view.getFullYear(), state.view.getMonth() - 1, 1); renderCalendar(); });
  $('#calNext').addEventListener('click', () => { state.view = new Date(state.view.getFullYear(), state.view.getMonth() + 1, 1); renderCalendar(); });

  function selectDate(iso) {
    state.date = iso;
    const d = fromISO(iso);
    state.view = new Date(d.getFullYear(), d.getMonth(), 1);
    renderCalendar();
    renderSummary();
  }

  // Tarifas
  function renderRates() {
    const rows = [
      ['entreSemana', 'Lunes a jueves', C.renta.entreSemana],
      ['viernesDomingo', 'Viernes y domingo', C.renta.viernesDomingo],
      ['sabado', 'Sábado', C.renta.sabado],
    ];
    const active = state.date ? rateFor(state.date).key : null;
    $('#ratesBody').innerHTML = rows.map(([k, n, p]) => `<tr class="${k === active ? 'is-active' : ''}"><td>${n}</td><td>${money(p)}</td></tr>`).join('');
  }
  const capEl = $('.rates caption');
  capEl.textContent = capEl.textContent.replace('{horas}', C.horasIncluidas);

  // Sábados disponibles en el hero
  function renderHeroDates() {
    const out = [];
    const d = new Date(minDate);
    while (d.getDay() !== 6) d.setDate(d.getDate() + 1);
    for (let i = 0; i < 26 && out.length < 4; i++, d.setDate(d.getDate() + 7)) {
      const iso = toISO(d);
      if (dayStatus(iso) === 'free') out.push(iso);
    }
    $('#heroDates').innerHTML = out.map((iso) => `<button type="button" class="date-chip" data-date="${iso}">${fmtShort.format(fromISO(iso)).replace(/\./g, '')}</button>`).join('');
  }
  $('#heroDates').addEventListener('click', (e) => {
    const b = e.target.closest('[data-date]');
    if (!b) return;
    selectDate(b.dataset.date);
    $('#planea').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ================= EVENTOS ================= */
  const eventList = $('#eventList');
  eventList.innerHTML = C.eventos.map((e) => `<button type="button" role="listitem" class="event-pill" data-event="${e.id}" aria-pressed="false">${e.nombre}</button>`).join('');
  const eventSelect = $('#eventSelect');
  eventSelect.innerHTML = C.eventos.map((e) => `<option value="${e.id}">${e.nombre}</option>`).join('');

  function applyPreset(id) {
    const ev = eventById(id);
    state.event = id;
    state.guests = ev.invitados;
    state.deco = ev.deco;
    state.extras.castillo = ev.inflables?.castillo || 0;
    state.extras.resbaladilla = ev.inflables?.resbaladilla || 0;
    state.auto = true;
    syncAuto();
    renderAll();
  }

  eventList.addEventListener('click', (e) => {
    const b = e.target.closest('.event-pill');
    if (!b) return;
    applyPreset(b.dataset.event);
    const ev = eventById(b.dataset.event);
    $$('.event-pill').forEach((p) => p.setAttribute('aria-pressed', String(p === b)));
    $('#eventDetailText').textContent = ev.texto;
    $('#eventDetailCta').textContent = `Ver cotización de ${ev.nombre.toLowerCase()}`;
    $('#eventDetail').hidden = false;
  });

  eventSelect.addEventListener('change', () => { state.event = eventSelect.value; renderSummary(); renderPlan(); });

  /* ================= INVITADOS, MESAS, SILLAS ================= */
  const guestsRange = $('#guestsRange');
  guestsRange.max = C.capacidadMax;

  function syncAuto() {
    if (!state.auto) return;
    state.mesas = Math.max(1, Math.ceil(state.guests / C.personasPorMesa));
    state.sillas = state.guests;
  }

  guestsRange.addEventListener('input', () => {
    state.guests = Number(guestsRange.value);
    syncAuto();
    renderAll();
  });

  $('#resetAuto').addEventListener('click', () => { state.auto = true; syncAuto(); renderAll(); });

  // Extras
  const extrasDefs = [
    ...C.inflables.map((i) => ({ key: i.id, name: i.nombre, unit: `${money(i.precio)} cada uno`, price: i.precio, max: 2 })),
    { key: 'horas', name: 'Horas extra', unit: `${money(C.precios.horaExtra)} por hora`, price: C.precios.horaExtra, max: 4 },
  ];
  $('#extrasList').innerHTML = extrasDefs.map((x) => `
    <div class="qty">
      <div><p class="qty__name">${x.name}</p><p class="qty__price">${x.unit}</p></div>
      <div class="stepper" data-stepper="x:${x.key}" data-min="0" data-max="${x.max}">
        <button type="button" aria-label="Quitar ${x.name.toLowerCase()}" data-dir="-1">−</button>
        <output aria-live="polite">0</output>
        <button type="button" aria-label="Agregar ${x.name.toLowerCase()}" data-dir="1">+</button>
      </div>
    </div>`).join('');

  $$('[data-price]').forEach((p) => { p.textContent = `${money(C.precios[p.dataset.price])} cada una`; });

  function stepperValue(key) {
    if (key === 'mesas') return state.mesas;
    if (key === 'sillas') return state.sillas;
    return state.extras[key.slice(2)];
  }
  function setStepperValue(key, v) {
    if (key === 'mesas' || key === 'sillas') { state[key] = v; state.auto = false; }
    else state.extras[key.slice(2)] = v;
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.stepper button');
    if (!btn) return;
    const st = btn.closest('.stepper');
    const key = st.dataset.stepper;
    const step = Number(st.dataset.step || 1);
    const min = Number(st.dataset.min);
    const max = Number(st.dataset.max);
    const next = Math.min(max, Math.max(min, stepperValue(key) + step * Number(btn.dataset.dir)));
    setStepperValue(key, next);
    renderAll();
  });

  function renderControls() {
    guestsRange.value = state.guests;
    $('#guestsOut').textContent = state.guests;
    eventSelect.value = state.event;
    $$('.stepper').forEach((st) => {
      const key = st.dataset.stepper;
      const v = stepperValue(key);
      st.querySelector('output').textContent = v;
      st.querySelector('[data-dir="-1"]').disabled = v <= Number(st.dataset.min);
      st.querySelector('[data-dir="1"]').disabled = v >= Number(st.dataset.max);
    });
    $('#resetAuto').hidden = state.auto;
    const hint = $('#capacityHint');
    const garden = Math.max(0, state.mesas - SALON_SLOTS.length);
    if (state.guests >= C.capacidadMax) {
      hint.textContent = `Caben hasta ${C.capacidadMax} invitados. Si son más, escríbenos y lo revisamos.`;
      hint.classList.add('is-warning');
    } else if (garden > 0) {
      hint.textContent = `Con este número de mesas, ${garden === 1 ? 'una va' : garden + ' van'} en el jardín.`;
      hint.classList.remove('is-warning');
    } else {
      hint.textContent = `Caben hasta ${C.capacidadMax} invitados entre salón y jardín.`;
      hint.classList.remove('is-warning');
    }
    $$('input[name="deco"]').forEach((r) => { r.checked = r.value === state.deco; });
  }

  // Decoración
  $('#decoOptions').innerHTML = C.decoracion.map((d) => `
    <label class="option">
      <input type="radio" name="deco" value="${d.id}">
      <span class="option__mark" aria-hidden="true"></span>
      <span class="option__body">
        <span class="option__top"><span>${d.nombre}</span><span>${d.precio ? money(d.precio) : 'Sin costo'}</span></span>
        <p>${d.detalle}</p>
      </span>
    </label>`).join('');
  $('#decoOptions').addEventListener('change', (e) => { state.deco = e.target.value; renderSummary(); renderPlan(); });

  /* ================= RESUMEN ================= */
  function computeQuote() {
    const r = rateFor(state.date);
    const lines = [];
    lines.push({ label: `Renta del salón, ${r.label}, ${C.horasIncluidas} h${state.date ? '' : ' (elige tu fecha)'}`, amount: r.price });
    lines.push({ label: `${state.mesas} ${state.mesas === 1 ? 'mesa' : 'mesas'} con mantel`, amount: state.mesas * C.precios.mesa });
    lines.push({ label: `${state.sillas} sillas`, amount: state.sillas * C.precios.silla });
    const deco = C.decoracion.find((d) => d.id === state.deco);
    if (deco.precio) lines.push({ label: `Decoración ${deco.nombre.toLowerCase()}`, amount: deco.precio });
    for (const inf of C.inflables) {
      const q = state.extras[inf.id];
      if (q) lines.push({ label: `${q} × ${inf.nombre.toLowerCase()}`, amount: q * inf.precio });
    }
    if (state.extras.horas) lines.push({ label: `${state.extras.horas} ${state.extras.horas === 1 ? 'hora extra' : 'horas extra'}`, amount: state.extras.horas * C.precios.horaExtra });
    const total = lines.reduce((s, l) => s + l.amount, 0);
    lines.push({ label: 'Área de juegos', amount: 0, free: true });
    return { lines, total, deposit: Math.round(total * C.anticipo), rate: r };
  }

  function quoteMessage(q) {
    const ev = eventById(state.event);
    const items = q.lines.filter((l) => !l.free).map((l) => `• ${l.label}: ${money(l.amount)}`).join('\n');
    return [
      `Hola, vi su página y quiero cotizar un evento en ${C.nombre}.`,
      '',
      `Evento: ${ev.nombre}`,
      `Fecha: ${state.date ? longDate(state.date) : 'por definir'}`,
      `Invitados: ${state.guests}`,
      '',
      items,
      '',
      `Total estimado: ${money(q.total)}`,
      state.date ? '¿Me confirman si la fecha sigue disponible?' : '¿Qué fechas tienen disponibles?',
    ].join('\n');
  }

  function renderSummary() {
    const q = computeQuote();
    const dateEl = $('#sumDate');
    dateEl.textContent = state.date ? longDate(state.date) : 'Aún no eliges fecha';
    dateEl.classList.toggle('is-empty', !state.date);
    $('#sumLines').innerHTML = q.lines.map((l) => `<li class="${l.free ? 'is-free' : ''}"><span>${l.label}</span><span>${l.free ? 'Incluida' : money(l.amount)}</span></li>`).join('');
    $('#sumTotal').textContent = money(q.total);
    $('#mobileTotalValue').textContent = money(q.total);
    $('#sumDeposit').textContent = `Anticipo para apartar (${Math.round(C.anticipo * 100)} %): ${money(q.deposit)}`;
    const book = $('#bookBtn');
    book.disabled = !state.date;
    book.textContent = state.date ? 'Apartar esta fecha' : 'Elige una fecha para apartar';
    $('#quoteWa').href = waUrl(quoteMessage(q));
    renderRates();
  }

  /* ================= PLANO DEL SALÓN ================= */
  const plan = $('#floorPlan');
  const SALON_SLOTS = [];
  [36, 82, 128].forEach((y) => [34, 80, 126, 172, 218, 264, 310].forEach((x) => {
    if (y === 36 && x < 100) return; // cocina
    SALON_SLOTS.push([x, y]);
  }));
  // Se llenan del centro del salón hacia afuera
  SALON_SLOTS.sort((a, b) => Math.hypot(a[0] - 195, (a[1] - 90) * 1.6) - Math.hypot(b[0] - 195, (b[1] - 90) * 1.6));
  const GARDEN_SLOTS = [];
  [210, 260].forEach((y) => [34, 80, 126, 172].forEach((x) => GARDEN_SLOTS.push([x, y])));
  const SLOTS = [...SALON_SLOTS, ...GARDEN_SLOTS];
  const INFLABLE_SLOTS = [[260, 240], [292, 240], [324, 240], [260, 266], [292, 266], [324, 266]];

  const PALETTES = {
    elegante: ['#c89b6a', '#f7f2ea', '#e7b3a8', '#a9bd98'],
    infantil: ['#e2557a', '#2bb3b1', '#f2c230', '#7c6fd6'],
  };

  function buildPlanBase() {
    plan.innerHTML = '';
    const defs = el('defs', {}, plan);
    const pat = el('pattern', { id: 'tile', width: 12, height: 12, patternUnits: 'userSpaceOnUse' }, defs);
    el('rect', { width: 12, height: 12, fill: '#f6f1ea' }, pat);
    el('path', { d: 'M12 0H0V12', fill: 'none', stroke: '#e3d9cb', 'stroke-width': .8 }, pat);

    // Salón
    el('rect', { x: 8, y: 8, width: 344, height: 166, rx: 4, fill: 'url(#tile)', stroke: '#1d1d1b', 'stroke-width': 3 }, plan);
    // lonas (frente abierto al jardín)
    el('line', { x1: 10, y1: 174, x2: 350, y2: 174, stroke: '#f6f1ea', 'stroke-width': 3.5 }, plan);
    el('line', { x1: 10, y1: 174, x2: 350, y2: 174, stroke: '#1d1d1b', 'stroke-width': 2, 'stroke-dasharray': '7 5' }, plan);
    // Cocina
    el('rect', { x: 8, y: 8, width: 78, height: 46, rx: 3, fill: '#e3d6c3', stroke: '#1d1d1b', 'stroke-width': 1.5 }, plan);
    const tk = el('text', { x: 47, y: 35, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 600, fill: '#1d1d1b', 'font-family': 'Figtree, sans-serif' }, plan);
    tk.textContent = 'Cocina';
    const ts = el('text', { x: 16, y: 166, 'font-size': 10, 'font-weight': 600, fill: '#8a857c', 'font-family': 'Figtree, sans-serif' }, plan);
    ts.textContent = 'Salón techado';
    // Columnas
    [[149, 59], [241, 59], [149, 105], [241, 105]].forEach(([cx, cy]) => el('circle', { cx, cy, r: 4.5, fill: '#fff', stroke: '#1d1d1b', 'stroke-width': 1.5 }, plan));

    // Jardín
    el('rect', { x: 8, y: 184, width: 226, height: 108, rx: 4, fill: '#86a967' }, plan);
    el('rect', { x: 237, y: 184, width: 8, height: 108, rx: 3, fill: '#4e7a36' }, plan);
    const tj = el('text', { x: 16, y: 199, 'font-size': 10, 'font-weight': 700, fill: '#fff', 'font-family': 'Figtree, sans-serif' }, plan);
    tj.textContent = 'Jardín';
    // Área de juegos
    el('rect', { x: 250, y: 184, width: 102, height: 108, rx: 4, fill: '#9fc07f' }, plan);
    const tg = el('text', { x: 258, y: 199, 'font-size': 10, 'font-weight': 700, fill: '#fff', 'font-family': 'Figtree, sans-serif' }, plan);
    tg.textContent = 'Juegos';
    const play = el('g', { transform: 'translate(258 205)' }, plan);
    el('rect', { x: 0, y: 2, width: 16, height: 16, rx: 2, fill: '#7c6fd6' }, play);
    el('path', { d: 'M16 6 C 24 6, 24 18, 32 18', stroke: '#e2557a', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, play);
    el('rect', { x: 40, y: 8, width: 14, height: 10, fill: '#f2c230' }, play);
    el('path', { d: 'M38 9 L47 1 L56 9 Z', fill: '#e2557a' }, play);
    el('rect', { x: 64, y: 0, width: 20, height: 18, fill: 'none', stroke: '#2bb3b1', 'stroke-width': 2.5 }, play);

    el('g', { id: 'planDeco' }, plan);
    el('g', { id: 'planTables' }, plan);
    el('g', { id: 'planInflables' }, plan);
  }

  let prevTables = 0;
  function renderPlan() {
    const gTables = $('#planTables', plan);
    const gDeco = $('#planDeco', plan);
    const gInf = $('#planInflables', plan);
    const n = Math.min(state.mesas, SLOTS.length);
    const showDeco = state.deco !== 'ninguna';
    const centerpieces = state.deco === 'tematica' || state.deco === 'completa';
    const colors = PALETTES[state.event === 'infantil' ? 'infantil' : 'elegante'];

    // Mesas y sillas
    gTables.replaceChildren();
    const base = Math.floor(state.sillas / n);
    const extra = state.sillas % n;
    for (let i = 0; i < n; i++) {
      const [x, y] = SLOTS[i];
      const g = el('g', { class: 'plan-table', transform: `translate(${x} ${y})` }, gTables);
      const chairs = Math.min(12, base + (i < extra ? 1 : 0));
      for (let c = 0; c < chairs; c++) {
        const a = (c / chairs) * Math.PI * 2 - Math.PI / 2;
        el('circle', { cx: (Math.cos(a) * 17).toFixed(2), cy: (Math.sin(a) * 17).toFixed(2), r: 2.8, fill: '#1d1d1b' }, g);
      }
      el('circle', { r: 11.5, fill: '#fff', stroke: '#cfc5b6', 'stroke-width': 1 }, g);
      if (centerpieces) {
        el('circle', { cx: -2.5, cy: -1.5, r: 3, fill: colors[0] }, g);
        el('circle', { cx: 2.5, cy: -1.5, r: 3, fill: colors[2] }, g);
        el('circle', { cx: 0, cy: 2.5, r: 3, fill: colors[3] }, g);
      }
      if (i >= prevTables && !reduceMotion) {
        g.classList.add('is-new');
        requestAnimationFrame(() => requestAnimationFrame(() => g.classList.remove('is-new')));
      }
    }
    prevTables = n;

    // Decoración: racimos de globos y luces
    gDeco.replaceChildren();
    if (showDeco) {
      const rnd = mulberry(7);
      const cluster = (cx, cy, count, spread) => {
        for (let i = 0; i < count; i++) {
          const a = rnd() * Math.PI * 2;
          const d = Math.sqrt(rnd()) * spread;
          el('circle', { cx: (cx + Math.cos(a) * d).toFixed(1), cy: (cy + Math.sin(a) * d).toFixed(1), r: (2.6 + rnd() * 2.6).toFixed(1), fill: colors[i % colors.length], stroke: '#fff', 'stroke-width': .6 }, gDeco);
        }
      };
      cluster(218, 15, 14, 10);              // mesa principal
      if (state.deco !== 'basica') { cluster(342, 17, 10, 8); cluster(342, 165, 10, 8); cluster(96, 16, 8, 7); }
      if (state.deco === 'completa') {
        // luces colgantes en el salón
        for (let row = 0; row < 3; row++) {
          const y = 60 + row * 46;
          el('path', { d: `M12 ${y - 10} Q 180 ${y + 10} 348 ${y - 10}`, fill: 'none', stroke: '#c9a77d', 'stroke-width': .8, 'stroke-dasharray': '1 4' }, gDeco);
        }
        cluster(122, 192, 12, 9);         // arco en el jardín
        cluster(16, 238, 8, 7);
      }
    }

    // Inflables
    gInf.replaceChildren();
    let slot = 0;
    for (const inf of C.inflables) {
      for (let k = 0; k < state.extras[inf.id] && slot < INFLABLE_SLOTS.length; k++, slot++) {
        const [x, y] = INFLABLE_SLOTS[slot];
        const g = el('g', { transform: `translate(${x} ${y})` }, gInf);
        if (inf.id === 'castillo') {
          el('rect', { x: 0, y: 4, width: 24, height: 16, rx: 3, fill: '#e2557a' }, g);
          [0, 9, 18].forEach((tx) => el('rect', { x: tx, y: 0, width: 6, height: 7, rx: 1.5, fill: '#e2557a' }, g));
          el('rect', { x: 9, y: 11, width: 6, height: 9, rx: 3, fill: '#f7f2ea' }, g);
        } else {
          el('rect', { x: 0, y: 2, width: 12, height: 18, rx: 3, fill: '#2a86d1' }, g);
          el('path', { d: 'M11 4 L25 20 L11 20 Z', fill: '#52a7e8' }, g);
        }
      }
    }

    // Texto del plano
    const inSalon = Math.min(n, SALON_SLOTS.length);
    const inGarden = n - inSalon;
    const parts = [`${n} ${n === 1 ? 'mesa' : 'mesas'} y ${state.sillas} sillas`];
    if (inGarden) parts.push(`${inGarden} en el jardín`);
    const infTotal = C.inflables.reduce((s, i) => s + state.extras[i.id], 0);
    if (infTotal) parts.push(`${infTotal} ${infTotal === 1 ? 'inflable' : 'inflables'}`);
    $('#planCaption').textContent = cap(parts.join(', ')) + '.';
    plan.setAttribute('aria-label', `Plano ilustrativo del salón: ${parts.join(', ')}.`);
  }

  /* ================= APARTAR FECHA ================= */
  const dialog = $('#bookDialog');
  const form = $('#bookForm');
  $('#bookBtn').addEventListener('click', () => {
    if (!state.date) return;
    const q = computeQuote();
    $('#bookTitle').textContent = 'Apartar fecha';
    $('#bookDate').textContent = longDate(state.date);
    $('#bookTotal').textContent = `${eventById(state.event).nombre}, ${state.guests} invitados. Total estimado ${money(q.total)}, anticipo ${money(q.deposit)}.`;
    $('#bookStepForm').hidden = false;
    $('#bookStepDone').hidden = true;
    $$('.field', form).forEach((f) => f.classList.remove('has-error'));
    dialog.showModal();
    form.nombre.focus();
  });
  $$('[data-close-dialog]').forEach((b) => b.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const tel = form.telefono.value.replace(/\D/g, '');
    const errName = !nombre;
    const errTel = tel.length !== 10;
    form.nombre.closest('.field').classList.toggle('has-error', errName);
    form.telefono.closest('.field').classList.toggle('has-error', errTel);
    if (errName) { form.nombre.focus(); return; }
    if (errTel) { form.telefono.focus(); return; }

    const q = computeQuote();
    const ev = eventById(state.event);
    const msg = [
      `Hola, quiero apartar una fecha en ${C.nombre}.`,
      '',
      `Nombre: ${nombre}`,
      `Teléfono: ${tel}`,
      `Fecha: ${longDate(state.date)}`,
      `Evento: ${ev.nombre}, ${state.guests} invitados`,
      '',
      ...q.lines.filter((l) => !l.free).map((l) => `• ${l.label}: ${money(l.amount)}`),
      '',
      `Total estimado: ${money(q.total)}`,
      `Anticipo (${Math.round(C.anticipo * 100)} %): ${money(q.deposit)}`,
      form.comentarios.value.trim() ? `Comentarios: ${form.comentarios.value.trim()}` : '',
      '¿Cómo realizo el anticipo?',
    ].filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n');

    window.open(waUrl(msg), '_blank', 'noopener');

    const list = pending();
    if (!list.includes(state.date)) { list.push(state.date); store.set('rominos-apartados', list); }
    renderCalendar();
    renderHeroDates();

    $('#bookDoneText').textContent = `Abrimos WhatsApp con tu solicitud para el ${fmtLong.format(fromISO(state.date))}. En el calendario tu fecha aparece como apartada por ti hasta que Rominos reciba tu anticipo.`;
    $('#bookStepForm').hidden = true;
    $('#bookStepDone').hidden = false;
    $('#bookStepDone button').focus();
  });

  /* ================= ANTES / DESPUÉS ================= */
  const compare = $('#compare');
  const range = $('.compare__range', compare);
  range.addEventListener('input', () => compare.style.setProperty('--pos', range.value + '%'));

  function buildDecor() {
    const svg = $('#decor');
    const rnd = mulberry(42);
    const defs = el('defs', {}, svg);
    const tones = { oro: ['#f6dcb0', '#c99a5e', '#7d5530'], blanco: ['#ffffff', '#ebe3d8', '#a99e8e'], rosa: ['#fbe0da', '#e2a598', '#9b5f55'], salvia: ['#e1ead6', '#9fb48c', '#5d7350'] };
    for (const [k, [a, b, c]] of Object.entries(tones)) {
      const g = el('radialGradient', { id: `b-${k}`, cx: '35%', cy: '30%', r: '75%' }, defs);
      el('stop', { offset: '0%', 'stop-color': a }, g);
      el('stop', { offset: '55%', 'stop-color': b }, g);
      el('stop', { offset: '100%', 'stop-color': c }, g);
    }
    const glow = el('radialGradient', { id: 'glow' }, defs);
    el('stop', { offset: '0%', 'stop-color': '#ffd99a', 'stop-opacity': .95 }, glow);
    el('stop', { offset: '100%', 'stop-color': '#ffb85c', 'stop-opacity': 0 }, glow);
    const warm = el('radialGradient', { id: 'warm', cx: '55%', cy: '35%', r: '70%' }, defs);
    el('stop', { offset: '0%', 'stop-color': '#ffbe72', 'stop-opacity': .32 }, warm);
    el('stop', { offset: '100%', 'stop-color': '#3a1d05', 'stop-opacity': .25 }, warm);
    el('rect', { width: 1600, height: 1199, fill: 'url(#warm)' }, svg);

    const toneKeys = ['oro', 'blanco', 'rosa', 'oro', 'salvia', 'blanco'];
    const balloon = (parent, x, y, r) => {
      el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: r.toFixed(1), fill: `url(#b-${toneKeys[Math.floor(rnd() * toneKeys.length)]})` }, parent);
    };
    const garland = (pts, count, rMin, rMax, jitter) => {
      const g = el('g', {}, svg);
      const items = [];
      for (let i = 0; i < count; i++) {
        const t = rnd() * (pts.length - 1);
        const i0 = Math.floor(t), f = t - i0;
        const p0 = pts[i0], p1 = pts[Math.min(i0 + 1, pts.length - 1)];
        items.push([p0[0] + (p1[0] - p0[0]) * f + (rnd() - .5) * jitter, p0[1] + (p1[1] - p0[1]) * f + (rnd() - .5) * jitter, rMin + rnd() * (rMax - rMin)]);
      }
      items.sort((a, b) => b[2] - a[2]).forEach(([x, y, r]) => balloon(g, x, y, r));
    };

    // Luces colgantes en el techo
    const strings = [[0, 40, 1600, 90, 150], [0, 150, 1600, 20, 130], [0, 90, 1600, 180, 110]];
    strings.forEach(([x1, y1, x2, y2, sag], si) => {
      const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 + sag * 2;
      el('path', { d: `M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, fill: 'none', stroke: '#2a1f14', 'stroke-width': 2.2, opacity: .7 }, svg);
      for (let t = 0.02; t < 1; t += 0.034) {
        const x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2;
        const y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2 + 8;
        const b = el('g', { class: 'bulb', style: `animation-delay:${(-(t * 7 + si) % 3.2).toFixed(2)}s` }, svg);
        el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 22, fill: 'url(#glow)' }, b);
        el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 4.5, fill: '#fff4dc' }, b);
      }
    });

    // Arco de globos en la pared del fondo (mesa de honor)
    const arch = [];
    for (let a = 180; a >= 0; a -= 10) {
      const rad = a * Math.PI / 180;
      arch.push([1340 + 235 * Math.cos(rad), 520 - 290 * Math.sin(rad)]);
    }
    garland(arch, 120, 14, 34, 46);
    // Guirnalda en la columna izquierda
    const col = [];
    for (let y = 600; y >= 0; y -= 30) col.push([407 + Math.sin(y / 70) * 34, y]);
    garland(col, 70, 16, 40, 44);
    // Guirnalda en la columna del centro
    const col2 = [];
    for (let y = 500; y >= 140; y -= 30) col2.push([995 + Math.sin(y / 60) * 18, y]);
    garland(col2, 34, 10, 22, 26);

    // Centros de mesa
    const centerpiece = (x, y, s) => {
      const g = el('g', { transform: `translate(${x} ${y}) scale(${s})` }, svg);
      el('ellipse', { cx: 0, cy: 6, rx: 70, ry: 16, fill: 'url(#glow)', opacity: .7 }, g);
      el('rect', { x: -14, y: -40, width: 28, height: 46, rx: 4, fill: 'url(#b-oro)' }, g);
      const flowers = [[-30, -52, 16, 'rosa'], [0, -64, 19, 'blanco'], [30, -52, 16, 'rosa'], [-15, -74, 14, 'oro'], [17, -78, 14, 'blanco'], [0, -46, 14, 'salvia'], [-40, -38, 10, 'salvia'], [40, -38, 10, 'salvia']];
      flowers.forEach(([fx, fy, r, t]) => el('circle', { cx: fx, cy: fy, r, fill: `url(#b-${t})` }, g));
      [[-46, 4], [46, 4]].forEach(([cx, cy]) => {
        el('circle', { cx, cy: cy - 8, r: 16, fill: 'url(#glow)' }, g);
        el('rect', { x: cx - 4, y: cy - 10, width: 8, height: 12, rx: 2, fill: '#fbf3e4' }, g);
      });
    };
    centerpiece(576, 640, 1);
    centerpiece(1240, 528, .55);
    centerpiece(861, 440, .32);
    centerpiece(1394, 468, .36);
  }

  /* ================= BARRA MÓVIL ================= */
  const mobileTotal = $('#mobileTotal');
  if ('IntersectionObserver' in window) {
    let stepsVisible = false, summaryVisible = false;
    const update = () => {
      const show = stepsVisible && !summaryVisible;
      mobileTotal.hidden = !show;
      document.body.classList.toggle('has-mobile-total', show && window.innerWidth < 1000);
    };
    new IntersectionObserver(([e]) => { stepsVisible = e.isIntersecting; update(); }, { rootMargin: '-30% 0px -30% 0px' }).observe($('.planner__steps'));
    new IntersectionObserver(([e]) => { summaryVisible = e.isIntersecting; update(); }, { threshold: .15 }).observe($('#summary .receipt'));
  }

  /* ================= CONFIG Y ENLACES ================= */
  const cfgText = {
    capacidadMax: C.capacidadMax,
    horasIncluidas: C.horasIncluidas,
    anticipoPct: `${Math.round(C.anticipo * 100)} %`,
    ciudad: C.ciudad,
    referencia: C.referencia,
    telefonoFmt: C.telefono.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3'),
  };
  $$('[data-cfg]').forEach((n) => { n.textContent = cfgText[n.dataset.cfg]; });
  $$('[data-wa]').forEach((a) => { a.href = waUrl(a.dataset.wa); });
  $('#mapsLink').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(C.mapsQuery)}`;
  $('#callLink').href = `tel:+52${C.telefono}`;
  $('#mapFrame').src = `https://www.google.com/maps?q=${encodeURIComponent(C.mapsQuery)}&output=embed`;
  $('#fbLink').href = C.redes.facebook;
  $('#igLink').href = C.redes.instagram;
  $('#year').textContent = today.getFullYear();

  const demoBar = $('#demoBar');
  try { if (sessionStorage.getItem('rominos-demo-oculto')) demoBar.remove(); } catch { /* nada */ }
  $('[data-close-demo]')?.addEventListener('click', () => {
    demoBar.remove();
    try { sessionStorage.setItem('rominos-demo-oculto', '1'); } catch { /* nada */ }
  });

  /* ================= INICIO ================= */
  function renderAll() {
    renderControls();
    renderSummary();
    renderPlan();
  }

  buildPlanBase();
  buildDecor();
  renderCalendar();
  renderHeroDates();
  renderAll();
})();
