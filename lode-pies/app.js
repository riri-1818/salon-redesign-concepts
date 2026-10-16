// Lode Pies & Pastries（試作 v2）：ロゴの4文字・いま開いている Lode・ショーケース（Flip）・今週の箱・飲み物
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap, anim = !!G && !RM;
  if (G) { if (window.Flip) G.registerPlugin(Flip); if (window.ScrollTrigger) G.registerPlugin(ScrollTrigger); }
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const EXT = '<span aria-hidden="true">&nearr;</span>';

  // ---------- シドニーの時刻 ----------
  function sydney() {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const h = +p.hour % 24, m = +p.minute, d = SHORT.indexOf(p.weekday.slice(0, 3));
    return { d, min: h * 60 + m, label: `${p.weekday} ${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")}${h < 12 ? "am" : "pm"}` };
  }
  const t12 = (m) => { const h = Math.floor(m / 60), mm = m % 60; return `${((h + 11) % 12) + 1}${mm ? ":" + String(mm).padStart(2, "0") : ""}${h < 12 ? "am" : "pm"}`; };
  function status(s, now) {
    const today = s.hours[now.d];
    if (today && now.min >= today[0] && now.min < today[1]) return { k: 0, cls: "pill--open", txt: `Open · until ${t12(today[1])}` };
    if (today && now.min < today[0]) return { k: 1, cls: "pill--soon", txt: `Opens ${t12(today[0])}` };
    for (let i = 1; i <= 7; i++) {
      const d = (now.d + i) % 7, h = s.hours[d];
      if (h) return { k: 2, cls: "", txt: `Opens ${i === 1 ? "tomorrow" : SHORT[d]} ${t12(h[0])}` };
    }
    return { k: 3, cls: "", txt: "Closed" };
  }

  // ---------- いま開いている Lode ----------
  const list = $("#store-list");
  let openId = null;
  function renderStores(first) {
    const now = sydney();
    $("#now-clock").textContent = now.label;
    const rows = STORES.map((s) => ({ s, st: status(s, now) })).sort((a, b) => a.st.k - b.st.k);
    const state = !first && anim && window.Flip ? Flip.getState($$(".st", list)) : null;
    rows.forEach(({ s, st }) => {
      let li = $(`[data-id="${s.id}"]`, list);
      if (!li) {
        li = document.createElement("li");
        li.className = "st"; li.dataset.id = s.id;
        const week = DAYS.map((d, i) => `<dt data-d="${i}">${d}</dt><dd data-d="${i}">${s.hours[i] ? `${t12(s.hours[i][0])} – ${t12(s.hours[i][1])}` : "Closed"}</dd>`).join("");
        li.innerHTML = `<button type="button" class="st__btn" aria-expanded="false"><span class="st__n">${s.name}</span><span class="st__a">${s.short}${s.phone ? " · " + s.phone : ""}</span><span class="st__s"><span class="pill"></span>${s.sourdough ? '<span class="tag">Sourdough daily</span>' : ""}</span></button>
          <div class="st__more"><dl class="week">${week}</dl><div class="st__act"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Lode Pies " + s.addr)}" target="_blank" rel="noopener">Get directions ${EXT}</a><a href="${ORDER}" target="_blank" rel="noopener">Go to order page ${EXT}</a></div><p class="fine" style="grid-column:1/-1;color:#bfa9a5;margin:0">${s.addr}</p></div>`;
        $(".st__btn", li).addEventListener("click", () => toggle(s.id));
      }
      const pill = $(".pill", li);
      pill.className = "pill " + st.cls; pill.textContent = st.txt;
      $$(".week [data-d]", li).forEach((e) => e.classList.toggle("today", +e.dataset.d === now.d));
      list.appendChild(li);
    });
    if (state) Flip.from(state, { duration: 0.4, ease: "power2.inOut" });
  }
  function toggle(id) {
    openId = openId === id ? null : id;
    $$(".st", list).forEach((li) => {
      const on = li.dataset.id === openId;
      li.classList.toggle("is-open", on);
      $(".st__btn", li).setAttribute("aria-expanded", on);
      if (on && anim) G.from($(".st__more", li), { opacity: 0, y: -8, duration: 0.3, clearProps: "all" });
    });
  }
  renderStores(true);
  setInterval(() => renderStores(false), 60000);
  // 問い合わせの店の選択肢
  STORES.forEach((s) => $("#f-store").insertAdjacentHTML("beforeend", `<option>${s.name}</option>`));

  // ---------- ショーケース ----------
  const GN = { pies: "Pies & rolls", pastry: "Croissant & co", sweet: "Sweet", box: "Pre-order" };
  const tray = $("#tray");
  FOOD.forEach((f, i) => {
    const li = document.createElement("li");
    li.dataset.g = f.g;
    const ph = f.img ? `<img src="img/${f.img}.jpg" alt="${f.name}" loading="lazy">` : `<span class="pc__type">${f.name}</span>`;
    li.innerHTML = `<button type="button" class="pc${f.g === "box" ? " pc--box" : ""}"><span class="pc__ph">${ph}</span><span class="pc__b"><span class="pc__n">${f.name}</span><span class="pc__p">${f.price}</span><span class="pc__d">${f.desc}</span></span></button>`;
    $("button", li).addEventListener("click", () => openDrawer(i));
    tray.appendChild(li);
  });
  $$(".tabs button").forEach((b) => b.addEventListener("click", () => {
    const g = b.dataset.g;
    $$(".tabs button").forEach((x) => x.setAttribute("aria-selected", x === b));
    const items = $$("li", tray);
    const state = anim && window.Flip ? Flip.getState(items) : null;
    items.forEach((li) => (li.hidden = !(g === "all" || li.dataset.g === g || (g === "sweet" && li.dataset.g === "box"))));
    if (state) Flip.from(state, { duration: 0.45, ease: "power2.inOut", absolute: true, onEnter: (els) => G.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35 }), onLeave: (els) => G.to(els, { opacity: 0, scale: 0.9, duration: 0.25 }) });
  }));

  // 引き出し
  const drawer = $("#drawer");
  let lastFocus = null;
  function openDrawer(i) {
    const f = FOOD[i];
    lastFocus = document.activeElement;
    $("#dr-ph").innerHTML = f.img ? `<img src="img/${f.img}.jpg" alt="${f.name}">` : `<span class="pc__type">${f.name}</span>`;
    $("#dr-g").textContent = GN[f.g]; $("#dr-n").textContent = f.name; $("#dr-d").textContent = f.desc; $("#dr-p").textContent = f.price;
    drawer.showModal(); $("#dr-x").focus();
    if (anim) G.from(".drawer__in", { xPercent: 100, duration: 0.4, ease: "power3.out", clearProps: "transform" });
  }
  function closeDrawer() { drawer.close(); }
  drawer.addEventListener("close", () => { if (lastFocus) lastFocus.focus(); });
  $("#dr-x").addEventListener("click", closeDrawer);
  drawer.addEventListener("click", (e) => { if (e.target === drawer) closeDrawer(); });

  // ---------- 飲み物 ----------
  const iced = (d) => /atcha|Iced|Ice coffee|Brew/.test(d.name);
  const dli = (d) => d.desc ? `<li><details><summary><b>${d.name === "Brew" ? "Cold Brew" : d.name}</b><i>${d.price}</i></summary><p>${d.desc}</p></details></li>` : `<li class="nodesc"><details><summary tabindex="-1"><b>${d.name}</b><i>${d.price}</i></summary></details></li>`;
  $("#d-coffee").innerHTML = DRINKS.filter((d) => !iced(d)).map(dli).join("");
  $("#d-iced").innerHTML = DRINKS.filter(iced).map(dli).join("");
  $$(".nodesc summary").forEach((s) => s.addEventListener("click", (e) => e.preventDefault()));

  // ---------- メニュー（スマホ）・いまの場所 ----------
  const mb = $(".menu-btn"), nav = $("#nav");
  mb.addEventListener("click", () => {
    const o = mb.getAttribute("aria-expanded") !== "true";
    nav.style.setProperty("--navtop", Math.round($(".top").getBoundingClientRect().bottom) + "px");
    mb.setAttribute("aria-expanded", o); nav.classList.toggle("is-open", o);
  });
  $$("#nav a").forEach((a) => a.addEventListener("click", () => { mb.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }));
  const here = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) $$("#nav a").forEach((a) => a.classList.toggle("is-here", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  ["case", "box", "drinks", "contact"].forEach((id) => here.observe(document.getElementById(id)));

  // ---------- フォーム ----------
  $("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, d = Object.fromEntries(new FormData(f));
    const bad = ["name", "email", "msg"].filter((k) => !String(d[k] || "").trim() || (k === "email" && !/^\S+@\S+\.\S+$/.test(d[k])));
    $$("input,textarea", f).forEach((i) => i.removeAttribute("aria-invalid"));
    bad.forEach((k) => f.elements[k].setAttribute("aria-invalid", "true"));
    $("#f-err").hidden = !bad.length;
    if (bad.length) { f.elements[bad[0]].focus(); return; }
    const body = [`Hi Lode team,`, ``, d.msg, ``, d.store ? `Store: ${d.store}` : "", `Name: ${d.name}`, `Email: ${d.email}`].filter((x) => x !== "").join("\n");
    location.href = `mailto:hello@lodepies.com?subject=${encodeURIComponent("Hello from the website" + (d.store ? " (" + d.store + ")" : ""))}&body=${encodeURIComponent(body)}`;
  });
  $("#loop").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#loop-e").value.trim();
    $("#loop-msg").textContent = /^\S+@\S+\.\S+$/.test(v) ? "Thanks! In the live site this signs you up to the Lode newsletter." : "Please enter your email address.";
  });

  // ---------- 動き ----------
  function opening(done) {
    const root = document.documentElement;
    if (!root.classList.contains("op") || !anim) { root.classList.remove("op"); return done(); }
    G.timeline({ onComplete: () => { root.classList.remove("op"); done(); } })
      .from(".q1", { x: "-60vw", y: "-40vh", duration: 0.6, ease: "power3.out" }, 0)
      .from(".q2", { x: "60vw", y: "-40vh", duration: 0.6, ease: "power3.out" }, 0.08)
      .from(".q3", { x: "-60vw", y: "40vh", duration: 0.6, ease: "power3.out" }, 0.16)
      .from(".q4", { x: "60vw", y: "40vh", duration: 0.6, ease: "power3.out" }, 0.24)
      .to(".opening", { yPercent: -100, duration: 0.5, ease: "power3.inOut" }, 1.0);
  }
  function reveals() {
    if (!anim) return;
    G.timeline()
      .from(".hero__h, .hero__p", { opacity: 0, y: 20, duration: 0.5, stagger: 0.08, clearProps: "all" })
      .from(".st", { opacity: 0, x: 24, duration: 0.35, stagger: 0.07, clearProps: "all" }, 0.15)
      .from(".hero__ph", { opacity: 0, duration: 0.5, clearProps: "all" }, 0.3);
    if (!window.ScrollTrigger) return;
    G.from("#tray li", { opacity: 0, y: 26, duration: 0.45, stagger: 0.04, clearProps: "all", scrollTrigger: { trigger: "#tray", start: "top 85%", once: true } });
    G.from("#box-list li", { opacity: 0, x: -20, duration: 0.4, stagger: 0.15, clearProps: "all", scrollTrigger: { trigger: "#box", start: "top 75%", once: true } });
    G.from(".gal__grid img", { opacity: 0, y: 30, rotation: (i) => (i % 2 ? 3 : -3), duration: 0.5, stagger: 0.06, clearProps: "all", scrollTrigger: { trigger: ".gal", start: "top 80%", once: true } });
  }
  opening(reveals);
})();
