// Bonza Bike Tours（試作 v2）：出発案内板（日付で切り替え）・ツアーの路線図・人数で料金・レンタル料金・問い合わせ
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap, anim = !!G && !RM;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const BOOK = "https://bonzabiketours.com/book-now/";

  // ---------- 原文 ----------
  Object.entries(FULL).forEach(([k, v]) => { const el = document.getElementById("full-" + k); if (el) el.innerHTML = v; });

  // ---------- 出発案内板 ----------
  const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function sydNow() {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { y: +p.year, m: +p.month, d: +p.day, min: (+p.hour % 24) * 60 + +p.minute };
  }
  function goodFriday(y) {   // 復活祭（グレゴリオ暦）の2日前
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
    const dt = new Date(Date.UTC(y, mo - 1, da - 2)); return [dt.getUTCMonth() + 1, dt.getUTCDate()];
  }
  const CLOSED = (y, m, d) => {
    const gf = goodFriday(y);
    const list = [[12, 25, "Christmas Day"], [12, 26, "Boxing Day"], [1, 1, "New Years Day"], [1, 26, "Australia Day"], [4, 25, "ANZAC Day"], [gf[0], gf[1], "Good Friday"]];
    const hit = list.find(([mm, dd]) => mm === m && dd === d); return hit ? hit[2] : "";
  };
  const inHoliday = (y, m, d) => { const n = y * 10000 + m * 100 + d; return n >= 20261221 && n <= 20270105; };
  const fmt = (min) => { const h = Math.floor(min / 60), mm = min % 60; return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, "0")}${h < 12 ? "am" : "pm"}`; };
  let sel = 0;
  function board(y, m, d, isToday) {
    const dt = new Date(Date.UTC(y, m - 1, d));
    $("#dep-label").textContent = `${DOW[dt.getUTCDay()]} ${d} ${MON[m - 1]}`;
    const rows = $("#dep-rows"), note = $("#dep-note"), now = sydNow().min;
    const closed = CLOSED(y, m, d);
    let html = "", nt = "";
    if (closed) {
      html = `<li class="closed">Closed today: ${closed}. Bonza Bike Tours is closed for business on this day.</li>`;
    } else if (inHoliday(y, m, d)) {
      html = `<li><time>Holiday</time><div><b>Holiday tour schedule 2026–2027</b><small>Morning and afternoon tours run to the holiday table</small></div></li>`;
      if (m === 12 && d === 31) html += `<li><time>10:30am</time><div><b>NYE Victory Lap Tour</b><small>2½ hours · 31 December only</small></div></li>`;
      nt = "Sydney Harbour Bridge Ride and Manly Beach & Sunset Cruise will not be operating during this holiday period. Bike hires: please call or email a day or two ahead. <a href=\"#holiday\">See the holiday table</a>";
    } else {
      const pm = m >= 10 || m <= 3 ? 15 * 60 + 30 : 14 * 60 + 30;
      const list = [[630, "Sydney Classic Tour", "4 hours · most popular", "classic"], [630, "Sydney Harbour Bridge Ride", "5 hours · lunch included", "bridge"],
        [pm, "Sydney Highlights Tour", "2½ hours", "highlights"], [pm, "Manly Beach & Sunset Cruise", "4 hours · min. 2 guests", "manly"]];
      html = list.map(([t, n, s, id]) => { const gone = isToday && now >= t; return `<li class="${gone ? "off" : ""}"><time>${fmt(t)}</time><div><b><a href="#tours" data-tour="${id}">${n}</a></b><small>${gone ? "Departed" : s}</small></div></li>`; }).join("")
        + `<li><time>Hire</time><div><b><a href="#hire">Bike hire / rental</a></b><small>Available · 1 hour, 4 hours or 24 hours</small></div></li>`;
      nt = m >= 10 || m <= 3 ? "Afternoon tours meet at 3:30pm from October 1st to March 31st." : "Afternoon tours meet at 2:30pm from April 1st to September 30th.";
    }
    const swap = () => { rows.innerHTML = html; note.innerHTML = nt; };
    if (anim && rows.children.length) G.to(rows, { rotationX: -70, opacity: 0, duration: 0.12, transformOrigin: "50% 0", onComplete: () => { swap(); G.fromTo(rows, { rotationX: 70, opacity: 0 }, { rotationX: 0, opacity: 1, duration: 0.2, clearProps: "transform,opacity" }); } });
    else swap();
  }
  function showDay(offset) {
    const n = sydNow(), dt = new Date(Date.UTC(n.y, n.m - 1, n.d + offset));
    board(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate(), offset === 0);
  }
  const di = $("#dep-date");
  { const n = sydNow(); di.min = `${n.y}-${String(n.m).padStart(2, "0")}-${String(n.d).padStart(2, "0")}`; }
  $$(".dep__days button").forEach((b) => b.addEventListener("click", () => {
    $$(".dep__days button").forEach((x) => x.setAttribute("aria-pressed", x === b)); di.classList.remove("on"); di.value = "";
    showDay(+b.dataset.d);
  }));
  di.addEventListener("change", () => {
    if (!di.value) return;
    const [y, m, d] = di.value.split("-").map(Number); const n = sydNow();
    $$(".dep__days button").forEach((x) => x.setAttribute("aria-pressed", "false")); di.classList.add("on");
    board(y, m, d, y === n.y && m === n.m && d === n.d);
  });
  { const n = sydNow(), pm = n.m >= 10 || n.m <= 3 ? 930 : 870, start = n.min >= pm || CLOSED(n.y, n.m, n.d) ? 1 : 0;   // 今日の便が全部出たあとは、最初から明日を出す
    $$(".dep__days button").forEach((x) => x.setAttribute("aria-pressed", +x.dataset.d === start)); showDay(start); }
  setInterval(() => { const b = $(".dep__days button[aria-pressed='true']"); if (b && b.dataset.d === "0") showDay(0); }, 60000);
  $("#dep-rows").addEventListener("click", (e) => { const a = e.target.closest("[data-tour]"); if (a) pickTour(a.dataset.tour); });

  // ---------- ツアー ----------
  const st = { t: "classic", a: 2, c: 0, e: 0 };
  $("#tour-tabs").innerHTML = TOURS.map((t) => `<button type="button" role="tab" aria-selected="${t.id === st.t}" data-id="${t.id}"><b>${esc(t.name)}</b><small>${t.dur} · from $${t.p.a}</small></button>`).join("");
  $$("#tour-tabs button").forEach((b) => b.addEventListener("click", () => pickTour(b.dataset.id)));
  function pickTour(id) {
    st.t = id;
    $$("#tour-tabs button").forEach((b) => b.setAttribute("aria-selected", b.dataset.id === id));
    renderTour(true);
  }
  function renderTour(animate) {
    const t = TOURS.find((x) => x.id === st.t);
    $("#t-tag").textContent = t.tag; $("#t-name").textContent = t.name; $("#t-fit").textContent = t.fit; $("#t-desc").textContent = t.desc;
    $("#t-dur").textContent = t.dur; $("#t-meet").textContent = t.meet + (t.min ? " · minimum of 2 guests to depart" : "");
    const nt = $("#t-note"); nt.hidden = !t.note; nt.textContent = t.note || "";
    $("#t-incl").innerHTML = [...INCL, ...t.extra].map((x) => `<li>${esc(x)}</li>`).join("");
    const ol = $("#t-stops");
    ol.innerHTML = t.stops.length ? t.stops.map((s, i) => `<li class="${i === t.stops.length - 1 ? "end" : ""}">${esc(s)}</li>`).join("") : `<li class="empty">The route is based on our Sydney Highlights Tour route. Conditions change from year to year on New Year’s Eve.</li>`;
    $("#pa").textContent = `$${t.p.a} each`; $("#pc").textContent = `$${t.p.c} each`;
    if (animate && anim && t.stops.length) {
      G.fromTo(ol, { "--draw": 0 }, { "--draw": 1, duration: 0.6, ease: "power2.out" });
      G.from($$("li", ol), { opacity: 0, x: -8, duration: 0.25, stagger: 0.04, clearProps: "all" });
    }
    price();
  }
  const tot = $("#p-tot"), shown = { v: 298 };
  function price() {
    const t = TOURS.find((x) => x.id === st.t), p = t.p;
    st.e = Math.min(st.e, st.a + st.c);
    let base = st.a * p.a + st.c * p.c, how = [];
    if (st.a) how.push(`${st.a} adult${st.a > 1 ? "s" : ""} × $${p.a}`);
    if (st.c) how.push(`${st.c} child${st.c > 1 ? "ren" : ""} × $${p.c}`);
    if (st.a >= 2 && st.c >= 2) {
      const extra = st.a - 2 + st.c - 2, fam = p.f + extra * p.x;
      if (fam < base) { base = fam; how = [`Family $${p.f} (2 adults and 2 children)`]; if (extra) how.push(`${extra} additional rider${extra > 1 ? "s" : ""} × $${p.x}`); }
    }
    if (st.e) how.push(`${st.e} e-bike${st.e > 1 ? "s" : ""} × $${EBIKE}`);
    const total = base + st.e * EBIKE;
    let msg = how.join(" + ");
    if (t.min && st.a + st.c < 2) msg += ". We require a minimum of 2 guests for this tour to depart.";
    $("#p-how").textContent = msg || "Add riders to see the price.";
    if (anim) G.to(shown, { v: total, duration: 0.35, ease: "power2.out", overwrite: true, onUpdate: () => (tot.textContent = Math.round(shown.v)) });
    else tot.textContent = total;
    $$(".party .ctr").forEach((c) => { const k = c.dataset.k; $("b", c).textContent = st[k]; $("[data-step='-1']", c).disabled = st[k] <= 0 || (k === "a" && st.a + st.c <= 1); $("[data-step='1']", c).disabled = st[k] >= (k === "e" ? st.a + st.c : 20); });
  }
  $$(".party .ctr button").forEach((b) => b.addEventListener("click", () => { const k = b.closest(".ctr").dataset.k; st[k] = Math.max(0, st[k] + +b.dataset.step); price(); }));
  renderTour(false);

  // ---------- レンタル ----------
  const hs = { i: 1, d: 0 };
  function hire() {
    const r = HIRE.rows[hs.i];
    $("#h-pp").textContent = `$${r[1] + hs.d * HIRE.extraDay[0]}`;
    $("#h-pf").textContent = `$${r[2] + hs.d * HIRE.extraDay[1]}`;
    const c = $(".ctr--sm"); $("b", c).textContent = hs.d; $("[data-step='-1']", c).disabled = hs.d <= 0; $("[data-step='1']", c).disabled = hs.d >= 14;
  }
  $$("#h-len button").forEach((b) => b.addEventListener("click", () => { hs.i = +b.dataset.i; $$("#h-len button").forEach((x) => x.setAttribute("aria-pressed", x === b)); if (hs.i < 2) hs.d = 0; hire(); }));
  $$(".ctr--sm button").forEach((b) => b.addEventListener("click", () => { hs.d = Math.max(0, hs.d + +b.dataset.step); if (hs.d) { hs.i = 2; $$("#h-len button").forEach((x) => x.setAttribute("aria-pressed", x.dataset.i === "2")); } hire(); }));
  hire();
  $("#fleet").innerHTML = FLEET.map(([f, n]) => `<li><img src="img/${f}.jpg" width="400" height="297" alt="${esc(n)}"><b>${esc(n)}</b></li>`).join("");

  // ---------- 問い合わせ ----------
  const askT = $("#ask-t"), askN = $("#ask-n"), askM = $("#ask-m");
  $$("[data-ask]").forEach((b) => b.addEventListener("click", () => {
    askT.value = b.dataset.ask; if (!askN.value) askN.value = st.a + st.c;
    $("#ask").scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "center" });
    setTimeout(() => { [askT, askN].forEach((el) => { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }); askM.focus({ preventScroll: true }); }, RM ? 0 : 500);
  }));
  $("#ask").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, err = $("#ask-err");
    const miss = [!f.name.value.trim() && "your name", !/^\S+@\S+\.\S+$/.test(f.email.value.trim()) && "a valid email", !askM.value.trim() && "a message"].filter(Boolean);
    if (miss.length) { err.textContent = `Please add ${miss.join(", ")}.`; err.hidden = false; return; }
    err.hidden = true;
    const body = `${askM.value.trim()}\n\n—\nTopic: ${askT.value}\nName: ${f.name.value.trim()}\nEmail: ${f.email.value.trim()}${f.date.value ? `\nPreferred date: ${f.date.value}` : ""}${askN.value ? `\nNumber of guests: ${askN.value}` : ""}`;
    location.href = `mailto:info@bonzabiketours.com?subject=${encodeURIComponent("Enquiry: " + askT.value)}&body=${encodeURIComponent(body)}`;
  });

  // ---------- 案内・メニュー・スマホの並び ----------
  const here = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) $$("#nav a").forEach((a) => a.classList.toggle("is-here", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-40% 0px -55% 0px" });
  ["tours", "hire", "groups", "gift", "faq", "visit"].forEach((id) => here.observe(document.getElementById(id)));
  const mb = $(".menu-btn"), nav = $("#nav");
  const close = () => { mb.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); };
  let y0 = 0;
  mb.addEventListener("click", () => { const o = mb.getAttribute("aria-expanded") !== "true"; y0 = scrollY; mb.setAttribute("aria-expanded", o); nav.classList.toggle("is-open", o); });
  $$("#nav a").forEach((a) => a.addEventListener("click", close));
  addEventListener("scroll", () => { if (nav.classList.contains("is-open") && Math.abs(scrollY - y0) > 40) close(); }, { passive: true });
  addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  document.addEventListener("click", (e) => { if (nav.classList.contains("is-open") && !nav.contains(e.target) && !mb.contains(e.target)) close(); });
  const narrow = matchMedia("(max-width: 920px)"), dep = $("#departures"), hero = $(".hero"), board0 = $("#board");
  const place = () => { if (narrow.matches) hero.after(dep); else board0.appendChild(dep); };
  narrow.addEventListener("change", place); place();

  // ---------- はじめ ----------
  if (!anim) return;
  const c = $(".count"), o = { v: 0 };
  G.to(o, { v: 50000, duration: 1.2, ease: "power2.out", onUpdate: () => (c.textContent = Math.round(o.v / 100) * 100 === 50000 ? "50,000" : Math.round(o.v).toLocaleString("en-AU")) });
  G.from(".hero h1", { y: 24, opacity: 0, duration: 0.55, ease: "power3.out", clearProps: "all" });
  G.from(".hero__ph img", { scale: 1.06, duration: 1.4, ease: "power2.out", clearProps: "transform" });
})();
