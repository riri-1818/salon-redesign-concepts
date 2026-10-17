// blu :/ creativity（試作 v2）：表紙の見出し・料金の見積もり・料金表・アーティスト・まつ毛・ジャーナル・今日の営業
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap, anim = !!G && !RM;
  if (G && window.ScrollTrigger) G.registerPlugin(ScrollTrigger);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

  // ---------- 料金の見積もり ----------
  const SVC = [["cut", "Hair cut"], ["colour", "Colour"], ["straight", "Straightening"], ["foil", "Foil"], ["perm", "Perm"], ["care", "Special care"]];
  const LEN = ["Very short", "Short", "Medium", "Long"];
  const STY = ["Stylist", "Master Stylist", "Hisa Goto"];
  const st = { svc: "cut", item: 0, len: 1, sty: 1, shown: 0 };
  const btns = (id, arr, key, dis = []) => { $(id).innerHTML = arr.map((t, i) => `<button type="button" role="radio" aria-checked="${st[key] === (key === "svc" ? t[0] : i)}" data-v="${key === "svc" ? t[0] : i}"${dis.includes(i) ? " disabled" : ""}>${esc(key === "svc" ? t[1] : t)}</button>`).join(""); };
  function items() {
    const p = PRICES[st.svc];
    return st.svc === "cut" ? [["Haircut", 0]] : p.items;
  }
  function render() {
    btns("#e-svc", SVC, "svc");
    const its = items();
    if (st.item >= its.length) st.item = 0;
    btns("#e-item", its.map((x) => x[0]), "item");
    const lenDis = st.svc === "cut" ? [] : st.svc === "perm" || st.svc === "care" ? [0] : [];
    if (lenDis.includes(st.len)) st.len = 1;
    btns("#e-len", st.svc === "cut" ? ["Very short", "Short", "Medium/long", "Style change"] : LEN, "len", lenDis);
    const styDis = st.svc === "care" ? [1, 2] : st.svc === "cut" ? [0] : [];
    if (styDis.includes(st.sty)) st.sty = st.svc === "cut" ? 1 : 0;
    btns("#e-sty", STY, "sty", styDis);
    let tot, sum, note = "";
    const p = PRICES[st.svc];
    if (st.svc === "cut") {
      const r = p.rows[st.len];
      tot = st.sty === 2 ? r[2] : r[4];
      sum = `${r[0]} cut with ${st.sty === 2 ? "Hisa Goto" : "a Master Stylist"}`;
      note = "Kids cuts from $55 are in the list below.";
    } else {
      const it = p.items[st.item], add = p.len[st.len] || 0, s = p.sty[st.sty] || 0;
      tot = it[1] + add + s;
      sum = `${it[0]}${add ? ` · ${LEN[st.len].toLowerCase()} hair +$${add}` : ""}${s ? ` · ${STY[st.sty]} +$${s}` : ""}`;
      note = p.note || "";
    }
    $("#e-tilde").style.visibility = st.svc === "cut" ? "hidden" : "visible";
    $("#e-sum").textContent = sum; $("#e-note").textContent = note;
    const el = $("#e-tot");
    if (anim) G.to(st, { shown: tot, duration: 0.4, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(st.shown)) });
    else el.textContent = tot;
    $$(".est__q button").forEach((b) => b.addEventListener("click", () => {
      const key = b.parentElement.id.replace("e-", "");
      st[key] = key === "svc" ? b.dataset.v : +b.dataset.v;
      if (key === "svc") st.item = 0;
      render();
    }));
  }
  render();
  $$("[data-svc]").forEach((a) => a.addEventListener("click", () => { st.svc = a.dataset.svc; st.item = 0; render(); }));

  // ---------- 料金表 ----------
  const pl = [];
  const c = PRICES.cut;
  pl.push(`<div class="pcat"><h3>${c.name}</h3><table><tr><th></th><th>Hisa Goto</th><th>Master Stylist</th></tr>${c.rows.map((r) => `<tr><td>${r[0]}</td><td>$${r[2]}</td><td>$${r[4]}</td></tr>`).join("")}${c.kids.map((k) => `<tr><td>${k[0]}</td><td colspan="2">${k[1]}</td></tr>`).join("")}</table></div>`);
  ["colour", "straight", "foil", "perm", "care"].forEach((k) => {
    const p = PRICES[k];
    pl.push(`<div class="pcat"><h3>${p.name}</h3><table>${p.items.map((r) => `<tr><td>${r[0]}</td><td>$${r[1]}~</td></tr>`).join("")}</table><ul>${p.extras.map((e) => `<li>${e}</li>`).join("")}</ul>${p.note ? `<p class="note">NOTE: ${p.note}</p>` : ""}</div>`);
  });
  $("#plist").innerHTML = pl.join("");

  // ---------- アーティスト ----------
  const hisa = ARTISTS.find((a) => a.name === "Hisa Goto");
  $("#hisa-text").textContent = hisa.text;
  $("#team").innerHTML = ARTISTS.filter((a) => a !== hisa).map((a) => `<li><figure><img src="img/${a.img}.jpg" alt="${a.name}" loading="lazy"></figure><h3>${a.name}</h3>${a.role ? `<p class="role">${a.role}</p>` : '<p class="role">&nbsp;</p>'}${a.hours ? `<p class="hrs">Working hours: ${a.hours}</p>` : ""}${a.text ? `<details><summary>About ${a.name}</summary><p>${esc(a.text)}</p></details>` : ""}</li>`).join("");

  // ---------- まつ毛と眉 ----------
  $("#lgrid").innerHTML = LASH.map(([h, rows]) => `<div class="lg"><h3>${h}</h3>${rows.map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join("")}</div>`).join("");

  // ---------- ジャーナル ----------
  $("#jlist").innerHTML = JOURNAL.map((j) => {
    let html = "", inList = false;
    j.b.forEach(([t, x]) => {
      if (t === "li") { if (!inList) { html += "<ul>"; inList = true; } html += `<li>${esc(x)}</li>`; return; }
      if (inList) { html += "</ul>"; inList = false; }
      html += t === "h" ? `<h4>${esc(x)}</h4>` : `<p>${esc(x)}</p>`;
    });
    if (inList) html += "</ul>";
    return `<details><summary>${esc(j.t)}</summary><div class="orig">${html}</div></details>`;
  }).join("");

  // ---------- 今日の営業 ----------
  const D = [["Mon", "11:00–20:00"], ["Tue", "11:00–20:00"], ["Wed", "11:00–20:00"], ["Thu", "11:00–20:00"], ["Fri", "11:00–20:00"], ["Sat", "10:00–18:00"], ["Sun", "10:00–18:00"]];
  const wd = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short" }).format(new Date()).slice(0, 3);
  $("#days").innerHTML = D.map(([d, h]) => `<div class="day${d === wd ? " today" : ""}"><b>${d.toUpperCase()}</b><span>${h}</span></div>`).join("");

  // ---------- 案内・メニュー ----------
  const here = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) $$("#nav a").forEach((a) => a.classList.toggle("is-here", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  ["menu", "artists", "straight", "lashes", "journal", "visit"].forEach((id) => here.observe(document.getElementById(id)));
  const mb = $(".menu-btn"), nav = $("#nav");
  const close = () => { mb.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); };
  let y0 = 0;
  mb.addEventListener("click", () => { const o = mb.getAttribute("aria-expanded") !== "true"; y0 = scrollY; nav.style.setProperty("--navtop", Math.round($(".top").getBoundingClientRect().bottom) + "px"); mb.setAttribute("aria-expanded", o); nav.classList.toggle("is-open", o); });
  $$("#nav a").forEach((a) => a.addEventListener("click", close));
  addEventListener("scroll", () => { if (nav.classList.contains("is-open") && Math.abs(scrollY - y0) > 40) close(); }, { passive: true });

  // ---------- 動き ----------
  if (!anim) return;
  G.timeline()
    .from(".cover__ph img", { scale: 1.08, duration: 1.4, ease: "power2.out", clearProps: "transform" }, 0)
    .from(".cover__h", { y: 40, opacity: 0, duration: 0.6, ease: "power3.out", clearProps: "all" }, 0.1)
    .from(".cover__lines li", { x: 30, opacity: 0, duration: 0.45, stagger: 0.1, clearProps: "all" }, 0.4)
    .to(".cover__h i", { scaleY: 0.1, duration: 0.08, yoyo: true, repeat: 1, transformOrigin: "50% 60%" }, 1.2);
  if (!window.ScrollTrigger) return;
  G.from(".services__cols article", { opacity: 0, y: 24, duration: 0.5, stagger: 0.08, clearProps: "all", scrollTrigger: { trigger: ".services", start: "top 80%", once: true } });
  G.from(".team li", { opacity: 0, y: 24, duration: 0.45, stagger: 0.07, clearProps: "all", scrollTrigger: { trigger: "#team", start: "top 85%", once: true } });
  G.from(".space figure", { clipPath: "inset(100% 0 0 0)", duration: 0.6, stagger: 0.1, ease: "power2.out", clearProps: "clipPath", scrollTrigger: { trigger: ".space", start: "top 85%", once: true } });
})();
