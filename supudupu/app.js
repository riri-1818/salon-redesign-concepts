// Supudupu（試作 v2）：髪の長さで料金（最初の画面）・料金表の印（Flip）・縮毛矯正の範囲・いま開いているか
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap, anim = !!G && !RM;
  if (G && window.Flip) G.registerPlugin(Flip);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let L = 1;
  const money = (v) => (v == null ? null : typeof v === "number" ? `$${v}` : `$${v}`);
  const find = (cat, h, row) => MENU.find((m) => m.id === cat).tables.find((t) => t.h === h).rows.find((r) => r[0] === row)[1];

  // ---------- 最初の画面のカード ----------
  const QUICK = [
    { cat: "cut", name: "Cut & shampoo", sub: "Ladies, adult · very long +$10", val: () => (L === 3 ? "$80–$100 +$10" : "$80–$100") },
    { cat: "perm", name: "Digital perm", sub: "Including cut & shampoo, blow dry", val: () => money(find("perm", "Perm", "Digital Perm")[L]) },
    { cat: "straight", name: "Straight perm, all full", sub: "Including cut & shampoo", val: () => money(find("straight", "Straight perm", "All Full")[L]) },
    { cat: "colour", name: "Full colour", sub: "Includes cut & shampoo, blow dry", val: () => money(find("colour", "Basic colours", "Full")[L]) },
    { cat: "colour", name: "Balayage", sub: "Toner +$40~", val: () => money(find("colour", "Balayage", "Balayage")[L]) },
    { cat: "keratin", name: "Lisse keratin therapy", sub: "Alfaparf Lisse Design", val: () => money(find("keratin", "Alfaparf Lisse Design keratin therapy", "Lisse")[L]) },
    { cat: "care", name: "Micro Mist treatment", sub: "Including cut & shampoo", val: () => money(find("care", "Micro Mist hair treatment", "Micro Mist Hair Treatment")[L]) },
    { cat: "care", name: "Shampoo & blow dry", sub: "Updo styling $70–80~", val: () => money(find("care", "Shampoo & blow dry", "Blow dry & Shampoo")[L]) },
  ];
  const quick = $("#quick");
  function renderQuick() {
    quick.innerHTML = QUICK.map((q, i) => { const v = q.val(); return `<li><a class="qc${v ? "" : " na"}" href="#prices" data-cat="${q.cat}"><span><b>${q.name}</b><small>${q.sub}</small></span><i>${v ? v.replace("~", '<small>from</small>') : "Ask us"}</i></a></li>`; }).join("");
    $$(".qc", quick).forEach((a) => a.addEventListener("click", () => openCat(a.dataset.cat)));
    if (anim) G.from(".qc i", { opacity: 0, y: 10, duration: 0.3, stagger: 0.03, clearProps: "all" });
  }

  // ---------- 料金表 ----------
  $("#cats").innerHTML = MENU.map((m, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-cat="${m.id}">${m.name}</button>`).join("");
  const cell = (v) => (v == null ? "–" : money(v));
  $("#tables").innerHTML = MENU.map((m, i) => `<div class="cat" data-cat="${m.id}"${i ? " hidden" : ""}>${m.sub ? `<p class="cat__sub">${m.sub}</p>` : ""}${m.tables.map((t) => {
    let h = `<div class="tb"><h3>${t.h}</h3>${t.sub ? `<p class="sub">${t.sub}</p>` : ""}`;
    if (t.flat) h += `<div class="flat">${t.flat.map(([a, b]) => `<span>${a}</span><span>${b}</span>`).join("")}</div>`;
    if (t.rows) {
      const cols = t.lenCols || 4;
      h += `<table><thead><tr><th></th>${LENGTHS.slice(0, cols).map((l, k) => `<th data-l="${k}">${k === 3 && t.vl ? t.vl : l}</th>`).join("")}</tr></thead><tbody>${t.rows.map(([n, vals]) => `<tr><td>${n}</td>${vals.slice(0, cols).map((v, k) => `<td data-l="${k}">${cell(v)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    }
    if (t.after) h += `<div class="flat" style="margin-top:8px">${t.after.map(([a, b]) => `<span>${a}</span><span>${b}</span>`).join("")}</div>`;
    if (t.steps) h += `<ol class="steps-mini">${t.steps.map((s, k) => `<li>${k + 1}: ${s}</li>`).join("")}</ol>`;
    return h + "</div>";
  }).join("")}<p class="cat__note">*All prices are subject to change.</p></div>`).join("");
  function openCat(id) {
    $$("#cats button").forEach((b) => b.setAttribute("aria-selected", b.dataset.cat === id));
    $$(".cat").forEach((c) => (c.hidden = c.dataset.cat !== id));
    mark(true);
  }
  $$("#cats button").forEach((b) => b.addEventListener("click", () => openCat(b.dataset.cat)));
  function mark(first) {
    $$(".tb table").forEach((tb) => {
      let hl = $(".hl", tb.parentElement);
      const th = $(`th[data-l="${L}"]`, tb);
      $$("[data-l]", tb).forEach((c) => c.classList.toggle("on", +c.dataset.l === L));
      if (!th) { if (hl) hl.style.opacity = 0; return; }
      if (!hl) { hl = document.createElement("i"); hl.className = "hl"; tb.parentElement.style.position = "relative"; tb.parentElement.appendChild(hl); }
      const box = tb.parentElement.getBoundingClientRect(), r = th.getBoundingClientRect(), tr = tb.getBoundingClientRect();
      if (!r.width) return;
      const state = !first && anim && window.Flip ? Flip.getState(hl) : null;
      Object.assign(hl.style, { opacity: 1, left: r.left - box.left + "px", width: r.width + "px", top: tr.top - box.top + "px", height: tr.height + "px" });
      if (state) Flip.from(state, { duration: 0.35, ease: "power2.inOut" });
    });
  }
  addEventListener("resize", () => mark(true));

  // ---------- 長さ ----------
  $("#len2").innerHTML = LENGTHS.map((l, k) => `<button type="button" role="radio" aria-checked="${k === L}" data-l="${k}">${l}</button>`).join("");
  function setLen(k) {
    L = k;
    $$("#len button, #len2 button").forEach((b) => b.setAttribute("aria-checked", +b.dataset.l === L));
    renderQuick(); mark(false);
    const full = find("straight", "Straight perm", "All Full")[L];
    $("#full-p").textContent = `$${full}`;
  }
  $$("#len button").forEach((b) => b.addEventListener("click", () => setLen(+b.dataset.l)));
  $("#len2").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setLen(+b.dataset.l); });

  // ---------- 縮毛矯正 ----------
  $("#straight-full").innerHTML = STRAIGHT_FULL.map((p) => `<p>${p}</p>`).join("");
  $$("#range button").forEach((b) => b.addEventListener("click", () => $$("#range button").forEach((x) => x.setAttribute("aria-pressed", x === b))));

  // ---------- いま開いているか ----------
  function tick() {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const d = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday.slice(0, 3)), m = (+p.hour % 24) * 60 + +p.minute, h = HOURS[d];
    const open = h && m >= h[0] && m < h[1];
    let next = "";
    if (!open) { for (let i = (h && m < h[0]) ? 0 : 1; i < 8; i++) { const hh = HOURS[(d + i) % 7]; if (hh) { next = `Opens ${i === 0 ? "today" : i === 1 ? "tomorrow" : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][(d + i) % 7]} 10am`; break; } } }
    $("#now").textContent = open ? `Open now · until ${h[1] === 1200 ? "8pm" : "6pm"}` : next;
    $(".dot").classList.toggle("off", !open);
    $$("#hours [data-d]").forEach((r) => r.classList.toggle("today", r.dataset.d.split(",").map(Number).includes(d)));
  }
  tick(); setInterval(tick, 60000);

  // ---------- 案内・メニュー ----------
  const here = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) $$("#nav a").forEach((a) => a.classList.toggle("is-here", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  ["prices", "straight", "salon", "visit"].forEach((id) => here.observe(document.getElementById(id)));
  const mb = $(".menu-btn"), nav = $("#nav");
  const close = () => { mb.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); };
  let y0 = 0;
  mb.addEventListener("click", () => { const o = mb.getAttribute("aria-expanded") !== "true"; y0 = scrollY; nav.style.setProperty("--navtop", Math.round($(".top").getBoundingClientRect().bottom) + "px"); mb.setAttribute("aria-expanded", o); nav.classList.toggle("is-open", o); });
  $$("#nav a").forEach((a) => a.addEventListener("click", close));
  addEventListener("scroll", () => { if (nav.classList.contains("is-open") && Math.abs(scrollY - y0) > 40) close(); }, { passive: true });

  setLen(1);
  requestAnimationFrame(() => mark(true));
  if (anim) {
    G.timeline()
      .from(".brand img", { rotation: -6, scale: 0.9, duration: 0.5, ease: "back.out(2)", clearProps: "all" })
      .from(".tool__h", { opacity: 0, y: 24, duration: 0.5, clearProps: "all" }, 0.1)
      .from(".len button", { opacity: 0, y: 20, duration: 0.4, stagger: 0.07, clearProps: "all" }, 0.2)
      .from(".qc", { opacity: 0, y: 20, duration: 0.4, stagger: 0.05, clearProps: "all" }, 0.35);
  }
})();
