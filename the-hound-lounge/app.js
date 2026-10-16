// The Hound Lounge（試作 v2）：足あとの幕開け・いまの Hound Lounge・サービスの一覧と詳細・1日の帯・料金の計算・はじめての方へ・チーム
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap;
  if (G) { if (window.Flip) G.registerPlugin(Flip); if (window.ScrollTrigger) G.registerPlugin(ScrollTrigger); if (window.Draggable) G.registerPlugin(Draggable); }
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const PAW = '<svg viewBox="0 0 32 32" aria-hidden="true"><use href="#paw"/></svg>';
  const mobile = () => matchMedia("(max-width: 860px)").matches;

  // ---------- シドニーの時刻 ----------
  function sydney() {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const h = +p.hour % 24, m = +p.minute;
    return { min: h * 60 + m, label: `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")}${h < 12 ? "am" : "pm"}` };
  }
  const DAY0 = 420, DAY1 = 1140;
  const blockAt = (min) => DAY.findIndex((d) => min >= d.from && min < d.to);
  const pct = (min) => Math.max(0, Math.min(1, (min - DAY0) / (DAY1 - DAY0))) * 100;

  // ---------- 幕開け：足あとが横切る ----------
  function opening(done) {
    const root = document.documentElement;
    if (!root.classList.contains("op") || !G) { root.classList.remove("op"); return done(); }
    const trail = $("#trail"), W = innerWidth, H = innerHeight, n = W < 600 ? 7 : 10;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const el = document.createElement("div");
      el.innerHTML = PAW;
      const s = el.firstChild;
      const x = -40 + t * (W + 40), y = H * 0.62 - t * H * 0.26 + (i % 2 ? -26 : 26);
      s.style.left = x + "px"; s.style.top = y + "px"; s.style.transform = `rotate(${72 + (i % 2 ? -8 : 8)}deg)`;
      trail.appendChild(s);
    }
    const tl = G.timeline({ onComplete: () => { root.classList.remove("op"); done(); } });
    tl.to("#trail svg", { opacity: 1, duration: 0.08, stagger: 0.075, ease: "none" })
      .to("#trail svg", { opacity: 0, duration: 0.2, stagger: 0.04 }, 0.35)
      .to(".opening", { opacity: 0, duration: 0.3 }, ">-0.15");
  }

  function heroIn() {
    const lis = $$(".worries li");
    if (RM || !G) { lis.forEach((l) => l.classList.add("on")); return; }
    G.timeline()
      .from(".hero__ph", { opacity: 0, y: 24, duration: 0.5, stagger: 0.1, clearProps: "all" }, 0)
      .from(".now", { opacity: 0, x: 24, duration: 0.45, clearProps: "all" }, 0.2)
      .from(lis, { opacity: 0, x: -14, duration: 0.35, stagger: 0.12, clearProps: "all" }, 0)
      .add(() => lis.forEach((l, i) => setTimeout(() => l.classList.add("on"), i * 140)), 0.25)
      .from(".hero__h, .hero__p, .hero__act", { opacity: 0, y: 16, duration: 0.45, stagger: 0.08, clearProps: "all" }, 0.35);
  }

  // ---------- ヘッダー ----------
  const top = $(".top");
  addEventListener("scroll", () => top.classList.toggle("is-scrolled", scrollY > 8), { passive: true });
  const menu = $(".menu-btn"), nav = $("#nav");
  menu.addEventListener("click", () => { const o = menu.getAttribute("aria-expanded") !== "true"; menu.setAttribute("aria-expanded", o); nav.classList.toggle("is-open", o); });
  $$("#nav a").forEach((a) => a.addEventListener("click", () => { menu.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }));
  const here = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    $$("#nav a").forEach((a) => a.classList.toggle("is-here", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["services", "day", "prices", "team", "contact"].forEach((id) => here.observe(document.getElementById(id)));

  // ---------- いまの Hound Lounge ----------
  function tickNow() {
    const { min, label } = sydney(), i = blockAt(min);
    $("#now-clock").textContent = label;
    $("#now-h").textContent = i >= 0 ? `${DAY[i].h} · ${DAY[i].t}` : min < DAY0 ? "Doors open at 7am for drop off" : "Everyone is home for dinner. Drop off from 7am";
    $$(".now__seg").forEach((s, k) => s.classList.toggle("is-now", k === i));
    $("#now-pin").style.left = pct(min) + "%";
    $("#now-pin").style.opacity = i >= 0 ? 1 : 0;
    $$(".block").forEach((b, k) => b.classList.toggle("is-now", k === i));
    $$(".track__bar span").forEach((s, k) => s.classList.toggle("is-now", k === i));
    return min;
  }

  // ---------- 1日の帯 ----------
  const ruler = $("#ruler");
  for (let h = 7; h <= 19; h++) {
    const s = document.createElement("span");
    s.style.left = ((h - 7) / 12) * 100 + "%";
    s.textContent = h === 12 ? "12pm" : h < 12 ? h + "am" : h - 12 + "pm";
    ruler.appendChild(s);
  }
  $$(".block").forEach((b, k) => { $("div p:last-child", b).textContent = DAY[k].p; });
  function placeDog(animate) {
    const { min } = sydney(), dog = $("#track-dog");
    const x = blockAt(min) >= 0 ? pct(min) : min < DAY0 ? 0 : 100;
    if (animate && G && !RM) G.fromTo(dog, { left: "0%" }, { left: x + "%", duration: 1.1, ease: "power2.out" });
    else dog.style.left = x + "%";
  }

  // ---------- サービス：一覧と詳細 ----------
  const list = $("#svc-list"), card = $("#svc-card"), svc = $("#services");
  let cur = null, age = null;
  let grp = "";
  SERVICES.forEach((s) => {
    if (s.group !== grp) { grp = s.group; const g = document.createElement("p"); g.className = "grp"; g.textContent = grp; list.appendChild(g); }
    const b = document.createElement("button");
    b.type = "button"; b.className = "it"; b.dataset.id = s.id; b.setAttribute("role", "option"); b.setAttribute("aria-selected", "false");
    b.innerHTML = `<img src="img/s/${s.photo}.jpg" width="112" height="112" alt=""><span><b>${s.name}</b><small>${s.tag}</small></span><span class="fit">Fits your dog</span>`;
    b.addEventListener("click", () => select(s.id, true));
    list.appendChild(b);
  });
  const sel = document.createElement("span"); sel.className = "sel"; sel.setAttribute("aria-hidden", "true");

  function select(id, user) {
    const s = SERVICES.find((x) => x.id === id);
    const btn = $(`.it[data-id="${id}"]`, list);
    const state = G && window.Flip && !RM && sel.parentNode ? Flip.getState(sel) : null;
    $$(".it", list).forEach((b) => b.setAttribute("aria-selected", b === btn ? "true" : "false"));
    btn.prepend(sel);
    if (state) Flip.from(state, { duration: 0.35, ease: "power2.inOut" });
    cur = id;
    card.innerHTML = `<figure class="svc__ph"><img src="img/${s.photo}.jpg" alt=""><span class="svc__tag">${s.tag}</span></figure><div class="svc__in"><p class="svc__grp">${s.group}</p><h3 class="svc__h">${s.name}</h3></div>`;
    $(".svc__in", card).append($("#t-" + id).content.cloneNode(true));
    wire(card);
    if (user && G && !RM) G.fromTo(card, { opacity: 0, x: 22 }, { opacity: 1, x: 0, duration: 0.38, ease: "power2.out", clearProps: "all" });
    if (user && mobile()) { svc.classList.add("is-detail"); svc.scrollIntoView({ behavior: RM ? "auto" : "smooth" }); }
  }
  $("#svc-back").addEventListener("click", () => {
    svc.classList.remove("is-detail");
    const b = $(`.it[data-id="${cur}"]`, list);
    b.scrollIntoView({ block: "center" }); b.focus({ preventScroll: true });
  });

  function wire(root) {
    // 子犬教室の週
    $$("[data-weeks]", root).forEach((w) => {
      const tabs = $$('[role="tab"]', w), panes = $$('[role="tabpanel"]', w), ink = $(".weeks__ink", w);
      const go = (i) => {
        tabs.forEach((t, k) => { t.setAttribute("aria-selected", k === i); t.tabIndex = k === i ? 0 : -1; });
        panes.forEach((p, k) => (p.hidden = k !== i));
        ink.style.left = tabs[i].offsetLeft + "px"; ink.style.width = tabs[i].offsetWidth + "px";
        if (G && !RM) G.fromTo(panes[i], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, clearProps: "all" });
      };
      tabs.forEach((t, i) => {
        t.addEventListener("click", () => go(i));
        t.addEventListener("keydown", (e) => { const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (d) { const n = (i + d + tabs.length) % tabs.length; tabs[n].focus(); go(n); } });
      });
      requestAnimationFrame(() => { ink.style.left = tabs[0].offsetLeft + "px"; ink.style.width = tabs[0].offsetWidth + "px"; });
    });
    // 「思い当たる」チェック
    $$("[data-familiar]", root).forEach((ul) => {
      const alone = $("[data-alone]", root);
      $$("button", ul).forEach((b) => b.addEventListener("click", () => {
        b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true");
        const any = $$('button[aria-pressed="true"]', ul).length > 0;
        if (any && alone.hidden && G && !RM) { alone.hidden = false; G.from(alone, { opacity: 0, y: 10, duration: 0.35, clearProps: "all" }); }
        else alone.hidden = !any;
      }));
    });
    $$("[data-topic]", root).forEach(topicLink);
  }

  // 年齢で印をつける
  const AGE_NOTE = { 20: "Puppy School graduates over 16 weeks: ask us about follow on courses, private training and Nose Work®." };
  $$(".chip").forEach((c) => c.addEventListener("click", () => {
    $$(".chip").forEach((x) => { x.classList.toggle("is-on", x === c); x.setAttribute("aria-pressed", x === c); });
    age = c.dataset.age ? +c.dataset.age : null;
    const state = G && window.Flip && !RM ? Flip.getState($$(".it", list)) : null;
    let first = null;
    SERVICES.forEach((s) => {
      const b = $(`.it[data-id="${s.id}"]`, list);
      const fit = age != null && s.ages && age >= s.ages[0] && age <= s.ages[1];
      const dim = age != null && s.ages && !fit;
      b.classList.toggle("is-fit", !!fit); b.classList.toggle("is-dim", !!dim);
      if (fit && !first) first = s.id;
    });
    if (state) Flip.from(state, { duration: 0.3, ease: "power1.out" });
    const note = $("#age-note");
    note.hidden = !AGE_NOTE[age]; note.textContent = AGE_NOTE[age] || "";
    if (first && !mobile()) select(first, true);
  }));
  select("daycare", false);

  // ---------- 料金の計算 ----------
  const calc = { plan: "full", dogs: 1, days: 1, shown: 70 };
  const pawbar = $("#pawbar");
  function renderCalc() {
    const P = PRICES[calc.plan], taster = calc.plan === "taster";
    if (taster) { calc.dogs = 1; calc.days = 1; }
    $$(".seg button").forEach((b) => { b.setAttribute("aria-checked", +b.dataset.dogs === calc.dogs); b.disabled = taster && b.dataset.dogs === "2"; });
    $("#days").textContent = calc.days;
    $('[data-step="-1"]').disabled = calc.days <= 1 || taster;
    $('[data-step="1"]').disabled = calc.days >= 20 || taster;
    const each = calc.dogs === 2 ? P.two : P.one, base = each * calc.days, off = calc.days >= 5 ? 0.1 : 0;
    const tot = Math.round(base * (1 - off) * 100) / 100;
    $("#calc-sum").textContent = taster ? "One Taster Session, up to 3 hours, for one new dog"
      : `${calc.days} × ${P.name.toLowerCase()}${calc.dogs === 2 ? " for 2 dogs" : ""} at $${each}` + (off ? ` = $${base}, less 10% for a block of ${calc.days} days` : calc.days === 4 ? ". Add one more day to save 10%" : "");
    pawbar.innerHTML = Array.from({ length: Math.max(calc.days, 5) }, (_, k) => PAW.replace("<svg", `<svg class="${k < calc.days ? "on" : ""}"`)).join("");
    const el = $("#calc-tot"), fmt = (v) => (Number.isInteger(tot) ? Math.round(v) : v.toFixed(2));
    if (G && !RM) G.to(calc, { shown: tot, duration: 0.45, ease: "power2.out", onUpdate: () => (el.textContent = fmt(calc.shown)) });
    else { calc.shown = tot; el.textContent = fmt(tot); }
  }
  $$(".plan").forEach((b) => b.addEventListener("click", () => {
    calc.plan = b.dataset.plan;
    $$(".plan").forEach((x) => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-checked", x === b); });
    renderCalc();
  }));
  $$(".seg button").forEach((b) => b.addEventListener("click", () => { calc.dogs = +b.dataset.dogs; renderCalc(); }));
  $$(".step__b").forEach((b) => b.addEventListener("click", () => { calc.days = Math.max(1, Math.min(20, calc.days + +b.dataset.step)); renderCalc(); }));
  renderCalc();

  // ---------- はじめての方へ ----------
  const boxes = $$("[data-ready] input"), go = $("#ready-go"), msg = $("#ready-msg");
  boxes.forEach((b) => b.addEventListener("change", () => {
    const n = boxes.filter((x) => x.checked).length;
    go.classList.toggle("is-ready", n === boxes.length);
    msg.textContent = n === boxes.length ? "Great, you are ready to register." : n ? `${n} of 3 ticked.` : "Tick all three and you are ready.";
  }));

  // ---------- 授賞式の写真（ドラッグと矢印） ----------
  const row = $("#night"), view = $(".night__view");
  let drag = null;
  const bounds = () => ({ minX: Math.min(0, view.clientWidth - row.scrollWidth), maxX: 0 });
  if (G && window.Draggable) drag = Draggable.create(row, { type: "x", bounds: view, inertia: false, edgeResistance: 0.85, dragClickables: true })[0];
  $$("[data-roll]").forEach((b) => b.addEventListener("click", () => {
    const step = view.clientWidth * 0.8, cx = G ? G.getProperty(row, "x") : 0, bd = bounds();
    const x = Math.max(bd.minX, Math.min(bd.maxX, cx - +b.dataset.roll * step));
    if (G) G.to(row, { x, duration: RM ? 0 : 0.5, ease: "power2.out", onComplete: () => drag && drag.update() });
  }));

  // ---------- チーム ----------
  const crew = $("#crew"), bio = $("#bio");
  let bi = 0;
  TEAM.forEach((t, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<button type="button" class="mate"><figure><img src="img/${t.img}.jpg" alt="${t.name} with dogs" loading="lazy"></figure><span><b>${t.name}</b><small>${t.role}</small><span class="more">Read ${t.name === "Natanne" ? "Nat" : t.name}&rsquo;s story</span></span></button>`;
    $("button", li).addEventListener("click", () => openBio(i));
    crew.appendChild(li);
  });
  function fillBio(i) {
    bi = (i + TEAM.length) % TEAM.length;
    const t = TEAM[bi];
    $("#bio-img").src = `img/${t.img}.jpg`; $("#bio-img").alt = `${t.name} with dogs`;
    $("#bio-r").textContent = t.role; $("#bio-n").textContent = t.name;
    $("#bio-p").innerHTML = t.text.map((p) => `<p>${p}</p>`).join("");
    $(".bio__txt").scrollTop = 0;
    if (G && !RM) G.fromTo(".bio__txt > *", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, clearProps: "all" });
  }
  function openBio(i) { fillBio(i); bio.showModal(); bio.scrollTop = 0; $("#bio-x").focus({ preventScroll: true }); }
  $$("[data-bio]").forEach((b) => b.addEventListener("click", () => fillBio(bi + +b.dataset.bio)));
  $("#bio-x").addEventListener("click", () => bio.close());
  bio.addEventListener("click", (e) => { if (e.target === bio) bio.close(); });

  // ---------- 問い合わせ ----------
  function topicLink(a) {
    a.addEventListener("click", () => {
      const r = $(`#topics input[value="${a.dataset.topic}"]`);
      if (r) r.checked = true;
    });
  }
  $$("[data-topic]").forEach(topicLink);
  $("#ask").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, d = Object.fromEntries(new FormData(f));
    const bad = ["name", "email"].filter((k) => !String(d[k] || "").trim() || (k === "email" && !/^\S+@\S+\.\S+$/.test(d[k])));
    $$("input", f).forEach((i) => i.removeAttribute("aria-invalid"));
    bad.forEach((k) => f.elements[k].setAttribute("aria-invalid", "true"));
    $("#ask-err").hidden = !bad.length;
    if (bad.length) { f.elements[bad[0]].focus(); return; }
    const lines = [`Hi The Hound Lounge,`, ``, d.msg || `I have a question about ${d.topic.toLowerCase()}.`, ``];
    if (d.dog || d.breed || d.age) lines.push(`My dog: ${[d.dog, d.breed, d.age].filter(Boolean).join(", ")}`);
    lines.push(`Name: ${d.name}`, `Email: ${d.email}`);
    if (d.phone) lines.push(`Phone: ${d.phone}`);
    location.href = `mailto:info@thehoundlounge.com.au?subject=${encodeURIComponent("Enquiry: " + d.topic)}&body=${encodeURIComponent(lines.join("\n"))}`;
  });

  // ---------- 現れる動き（それぞれ違う動き） ----------
  function reveals() {
    if (RM || !G || !window.ScrollTrigger) return;
    G.from(".awards__list li", { opacity: 0, y: 10, duration: 0.4, stagger: 0.08, clearProps: "all", scrollTrigger: { trigger: ".awards", start: "top 90%", once: true } });
    G.from(".track__bar span", { scaleX: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "transform", scrollTrigger: { trigger: ".track", start: "top 85%", once: true, onEnter: () => placeDog(true) } });
    G.from(".block", { opacity: 0, y: 20, duration: 0.45, stagger: 0.08, clearProps: "all", scrollTrigger: { trigger: ".blocks", start: "top 88%", once: true } });
    G.from(".plan", { opacity: 0, y: 18, rotation: (i) => [-2, 1.5, -1][i], duration: 0.45, stagger: 0.07, clearProps: "all", scrollTrigger: { trigger: ".plans", start: "top 88%", once: true } });
    G.from(".stp", { opacity: 0, x: -18, duration: 0.4, stagger: 0.12, clearProps: "all", scrollTrigger: { trigger: ".steps", start: "top 88%", once: true } });
    G.from(".mate", { opacity: 0, y: 24, rotation: (i) => (i % 2 ? 2 : -2), duration: 0.45, stagger: 0.05, clearProps: "all", scrollTrigger: { trigger: ".crew", start: "top 90%", once: true } });
  }

  tickNow(); setInterval(tickNow, 30000);
  placeDog(false);
  opening(() => { heroIn(); reveals(); });
})();
