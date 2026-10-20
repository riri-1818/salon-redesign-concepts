(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = !calm && window.gsap ? window.gsap : null;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const LOC = Object.fromEntries(LOCS.map(l => [l.id, l]));
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const map = q => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);

  /* ---------- 文字の大きさ ---------- */
  const setSize = (n, save) => {
    document.documentElement.dataset.size = n;
    $$(".size button").forEach(b => b.setAttribute("aria-pressed", b.dataset.size === n));
    if (save) try { localStorage.setItem("kopd-size", n); } catch (e) {}
  };
  setSize(document.documentElement.dataset.size || "1");
  $$(".size button").forEach(b => b.addEventListener("click", () => setSize(b.dataset.size, true)));

  /* ---------- メニュー ---------- */
  const nav = $("#nav"), mb = $(".menu-btn");
  const closeNav = () => { nav.classList.remove("is-open"); mb.setAttribute("aria-expanded", "false"); };
  mb.addEventListener("click", () => { const o = !nav.classList.contains("is-open"); nav.classList.toggle("is-open", o); mb.setAttribute("aria-expanded", o); });
  $$("a", nav).forEach(a => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeNav(); });
  // 今いる場所をナビに
  const secs = $$("main > section");
  const io2 = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$(".nav a").forEach(a => a.classList.toggle("here", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(s => io2.observe(s));

  /* ---------- シドニーの今（曜日と時刻） ---------- */
  const syd = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "long", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date()).map(x => [x.type, x.value]));
    return { day: DAYS.indexOf(p.weekday), min: (+p.hour % 24) * 60 + +p.minute };
  };
  const startMin = t => { const m = t.match(/(\d+):(\d+)\s*(am|pm)?/i); let h = +m[1]; const ap = (m[3] || (t.match(/(am|pm)/i) || [])[1] || "pm").toLowerCase(); if (ap === "pm" && h < 12) h += 12; return h * 60 + +m[2]; };
  // 次のクラス（今日まだ始まっていなければ今日）
  const nextClass = times => {
    if (!times.length) return null;
    const now = syd(); let best = null;
    times.forEach(t => {
      const d = DAYS.indexOf(t[0]); let diff = (d - now.day + 7) % 7;
      if (diff === 0 && startMin(t[1]) <= now.min) diff = 7;
      const score = diff * 1440 + startMin(t[1]);
      if (!best || score < best.score) best = { t, diff, score };
    });
    const when = best.diff === 0 ? "Today" : best.diff === 1 ? "Tomorrow" : best.t[0];
    return `${when}, ${best.t[1]}`;
  };

  /* ---------- Start here（場所 × やりたいこと） ---------- */
  const ACTS = [["boxing", "Boxing", "Strength & balance"], ["reformer", "Reformer Pilates", "Chatswood only"], ["both", "Both", "Chatswood only"], ["unsure", "Not sure yet", "We’ll help you choose"]];
  const st = { loc: "chatswood", act: "boxing" };
  const fl = $("#f-loc"), fa = $("#f-act"), ans = $("#answer");
  fl.innerHTML = LOCS.map(l => `<button type="button" class="opt" data-v="${l.id}" aria-pressed="false">${l.name}<small>${l.state}</small></button>`).join("");
  fa.innerHTML = ACTS.map(a => `<button type="button" class="opt" data-v="${a[0]}" aria-pressed="false">${a[1]}<small>${a[2]}</small></button>`).join("");

  const answerHTML = () => {
    const l = LOC[st.loc], a = st.act;
    const free = `<p class="answer__note">Your first class is free: observe, participate, or simply meet the team. A carer or family member can join boxing, strength &amp; balance sessions for free with the Corner Pass.</p>`;
    const where = (v, ad) => `<div><dt>Where</dt><dd>${esc(v)}<br><span style="font-weight:400">${esc(ad)}</span></dd></div>`;
    let k = "", h = "", rows = "", nx = null, sel = "";
    if (a === "unsure") {
      k = l.name; h = "Start with a free first class";
      rows = `<div><dt>Try it first</dt><dd><span class="big">Free</span> first class</dd></div><div><dt>Or start properly</dt><dd>Starter Pack <span class="big">$300</span><br><span style="font-weight:400">Assessment, report, gloves &amp; shirt (normally $610)</span></dd></div>`;
      sel = `${l.name} · Not sure yet`;
    } else if (a === "boxing") {
      k = `${l.name} · ${l.venue}`; h = "KOPD Boxing, strength & balance";
      rows = where(l.venue, l.addr);
      if (l.id === "chatswood") rows += `<div><dt>Weekly price</dt><dd><span class="big">$45</span> 1 class · <span class="big">$80</span> all boxing</dd></div>`;
      if (l.id === "gladesville") rows += `<div><dt>Weekly price</dt><dd><span class="big">$45</span> 1 session · <span class="big">$80</span> Crossover</dd></div>`;
      if (l.id === "hobart") rows += `<div><dt>Coach</dt><dd>${esc(l.coach[0])}<br><span style="font-weight:400">Hybrid Training Centre</span></dd></div>`;
      nx = l.id === "gladesville" ? nextClass(l.times) : null;
      sel = `${l.name} · Boxing`;
    } else if (a === "reformer") {
      const t = LOC.chatswood.times.filter(x => /Reformer/.test(x[2]));
      k = "Chatswood · Club Pilates"; h = "Reformer for Parkinson’s";
      rows = where("Club Pilates", LOC.chatswood.addr2) + `<div><dt>Weekly price</dt><dd><span class="big">$45</span> 1 class · <span class="big">$80</span> 2 classes</dd></div>`;
      nx = nextClass(t); sel = "Chatswood · Reformer Pilates";
    } else {
      k = "Chatswood · Boxing + Reformer"; h = "Combo options";
      rows = `<div><dt>1 boxing + 1 Reformer</dt><dd><span class="big">$80</span>/week</dd></div><div><dt>All boxing + 1 or 2 Reformer</dt><dd><span class="big">$110</span> · <span class="big">$130</span></dd></div>`;
      nx = nextClass(LOC.chatswood.times); sel = "Chatswood · Boxing and Reformer";
    }
    const timesNote = a === "boxing" && l.timesNote ? `<p class="answer__note">${esc(l.timesNote)}</p>` : "";
    const limited = a === "reformer" ? `<p class="answer__note"><b>${esc(LOC.chatswood.reformer[1])}</b></p>` : "";
    return { sel, html: `<p class="answer__k">${esc(k)}</p><h2>${esc(h)}</h2>${nx ? `<p class="next">Next ${a === "boxing" ? "" : "Reformer "}class: ${esc(nx)}</p>` : ""}<dl class="answer__grid">${rows}</dl>${timesNote}${limited}${free}
      <div class="answer__act"><a class="btn" href="#start" data-pick="${esc(sel)}">Book my free first class</a><a class="lnk" href="#locations" data-goloc="${a === "reformer" || a === "both" ? "chatswood" : l.id}">${a === "unsure" ? "See all prices" : "See " + (a === "reformer" || a === "both" ? "Chatswood" : l.name) + " details"}</a></div>` };
  };
  let first = true;
  const renderFinder = () => {
    const only = st.loc === "chatswood";
    if (!only && (st.act === "reformer" || st.act === "both")) st.act = "boxing";
    $$(".opt", fl).forEach(b => b.setAttribute("aria-pressed", b.dataset.v === st.loc));
    $$(".opt", fa).forEach(b => { b.setAttribute("aria-pressed", b.dataset.v === st.act); b.disabled = !only && (b.dataset.v === "reformer" || b.dataset.v === "both"); });
    const r = answerHTML();
    ans.innerHTML = r.html;
    if (G && !first) G.fromTo(ans, { x: 18, opacity: 0 }, { x: 0, opacity: 1, duration: .25, ease: "power2.out", clearProps: "all" });
    first = false;
  };
  fl.addEventListener("click", e => { const b = e.target.closest(".opt"); if (!b) return; st.loc = b.dataset.v; renderFinder(); });
  fa.addEventListener("click", e => { const b = e.target.closest(".opt"); if (!b || b.disabled) return; st.act = b.dataset.v; renderFinder(); });
  renderFinder();

  /* ---------- 拠点のタブと1週間 ---------- */
  const tabs = $("#loc-tabs"), lp = $("#loc");
  tabs.innerHTML = LOCS.map(l => `<button type="button" class="tab" role="tab" id="t-${l.id}" aria-controls="loc" data-v="${l.id}" aria-selected="false">${l.name}<small>${l.state}</small></button>`).join("");
  lp.setAttribute("role", "tabpanel");
  const week = l => {
    const today = syd().day;
    const all = l.id === "chatswood" ? l.times : l.times;
    return `<div class="week"><p class="week__h">Class times this week</p><ol class="week__d">${DAYS.map((d, i) => {
      const cl = all.filter(t => t[0] === d);
      return `<li class="${cl.length ? "" : "empty"}${i === today ? " today" : ""}"><span>${d.slice(0, 3)}</span>${cl.map(t => `<div class="cl${/Reformer/.test(t[2]) ? " cl--ref" : ""}"><b>${esc(t[1].split(" – ")[0])}</b><i> to ${esc(t[1].split(" – ")[1])}</i>${/Reformer/.test(t[2]) ? "Reformer" : esc(t[2])}<span class="sr"> at ${esc(t[3])}</span></div>`).join("")}</li>`;
    }).join("")}</ol>${all.some(t => /Reformer/.test(t[2])) ? `<p class="week__note"><span class="key key--ref"></span>Reformer for Parkinson’s, at ${esc(all.find(t => /Reformer/.test(t[2]))[3])}</p>` : all.length ? `<p class="week__note"><span class="key"></span>${esc(all[0][2])}, at ${esc(all[0][3])}</p>` : ""}${l.timesNote ? `<p class="week__note">${esc(l.timesNote)}</p>` : ""}</div>`;
  };
  const renderLoc = (id, anim) => {
    const l = LOC[id];
    $$(".tab", tabs).forEach(b => { const on = b.dataset.v === id; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
    lp.setAttribute("aria-labelledby", "t-" + id);
    const venues = [[l.venue, l.addr]].concat(l.addr2 ? [[l.venue2, l.addr2]] : []);
    lp.innerHTML = `<figure class="loc__ph"><img src="img/${l.img}" alt="KOPD class at ${esc(l.name)}" width="1400" height="933"><figcaption>${esc(l.tag)}</figcaption></figure>
      <div class="loc__b"><h3>${esc(l.name)}</h3><p class="loc__st">${esc(l.state)}${l.phone ? ` · <a href="tel:+61${l.phone.replace(/\s/g, "").slice(1)}">${esc(l.phone)}</a>` : ""}</p>
      <p class="loc__lead">${esc(l.text)}</p>${l.more.map(p => `<p class="loc__more">${esc(p)}</p>`).join("")}
      <div class="venue">${venues.map(v => `<div><b>${esc(v[0])}</b><span>${esc(v[1])}</span><a class="lnk" href="${map(v[1])}" target="_blank" rel="noopener">Directions <span aria-hidden="true">&nearr;</span></a></div>`).join("")}</div>
      ${l.reformer ? `<div class="refb"><h4>Reformer for Parkinson’s</h4><p>${esc(l.reformer[0])}</p><p class="refb__l">${esc(l.reformer[1])}</p></div>` : ""}
      ${week(l)}
      ${l.coach ? `<div class="coach"><img src="img/coach-chris.jpg" alt="${esc(l.coach[0])}" width="500" height="771"><p><b>${esc(l.coach[0])}</b>${esc(l.coach[1])}</p></div>` : ""}
      <p style="margin:1.5rem 0 0"><a class="btn" href="#start" data-pick="${esc(l.name)} · Free first class">Join at ${esc(l.name)}</a></p></div>`;
    if (G && anim) G.fromTo(lp, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .3, ease: "power2.out", clearProps: "all" });
  };
  tabs.addEventListener("click", e => { const b = e.target.closest(".tab"); if (b) renderLoc(b.dataset.v, true); });
  tabs.addEventListener("keydown", e => {
    const bs = $$(".tab", tabs), i = bs.indexOf(document.activeElement); if (i < 0) return;
    const j = e.key === "ArrowRight" ? (i + 1) % bs.length : e.key === "ArrowLeft" ? (i - 1 + bs.length) % bs.length : -1;
    if (j >= 0) { e.preventDefault(); bs[j].focus(); renderLoc(bs[j].dataset.v, true); }
  });
  renderLoc("chatswood");

  /* ---------- 料金表 ---------- */
  const dl = rows => rows.map(r => `<div><dt><b>${esc(r[0])}</b><span>${esc(r[1])}</span></dt><dd>$${r[2]}<small>/wk</small></dd></div>`).join("");
  $("#pt-kopd").innerHTML = dl(PRICE_CHAT.kopd);
  $("#pt-ref").innerHTML = dl(PRICE_CHAT.reformer);
  $("#pt-combo").innerHTML = PRICE_CHAT.combo.map(r => `<div><dt><b>${esc(r[0])}</b></dt><dd>$${r[1]}<small>/wk</small></dd></div>`).join("");
  $("#pt-glad").innerHTML = PRICE_GLAD.map(g => `<article class="pt"><h3>${esc(g[0])}</h3><p class="pt__s">${esc(g[1])}</p><dl><div><dt><b>${esc(g[2])}</b><span>${esc(g[3])}</span></dt><dd>$${g[4]}<small>/wk</small></dd></div></dl></article>`).join("");

  /* ---------- 週の金額を組み立てる（公開の料金だけで計算） ---------- */
  const B = { box: 1, ref: 0, car: 0 };
  const mk = (el, key, vals) => { el.innerHTML = vals.map(v => `<button type="button" class="opt" data-v="${v[0]}" aria-pressed="false">${v[1]}</button>`).join(""); el.addEventListener("click", e => { const b = e.target.closest(".opt"); if (!b || b.disabled) return; B[key] = +b.dataset.v; renderB(); }); };
  mk($("#b-box"), "box", [[0, "None"], [1, "1 a week"], [9, "All classes"]]);
  mk($("#b-ref"), "ref", [[0, "None"], [1, "1 a week"], [2, "2 a week"]]);
  mk($("#b-car"), "car", [[0, "No"], [1, "1 class"], [2, "2 classes"]]);
  const plan = () => {
    const { box, ref } = B, k = PRICE_CHAT;
    if (!box && !ref) return null;
    if (box && !ref) return box === 1 ? [k.kopd[0][2], "KOPD · 1 Class", "1 KOPD class per week"] : [k.kopd[1][2], "KOPD · All Boxing Classes", "Unlimited KOPD Boxing classes"];
    if (!box && ref) return ref === 1 ? [k.reformer[0][2], "KOPD Reformer · 1 Class", "1 Reformer class per week"] : [k.reformer[1][2], "KOPD Reformer · 2 Classes", "2 Reformer classes per week"];
    if (box === 1 && ref === 1) return [k.combo[0][1], "Combo", k.combo[0][0]];
    if (box === 9 && ref === 1) return [k.combo[1][1], "Combo", k.combo[1][0]];
    if (box === 9 && ref === 2) return [k.combo[2][1], "Combo", k.combo[2][0]];
    return [k.kopd[0][2] + k.reformer[1][2], "Two separate plans", "KOPD 1 Class ($45) + Reformer 2 Classes ($80). This mix is not a listed combo, so ask us if a better option applies."];
  };
  const tot = $("#b-tot"), bo = $(".b-out"); let shown = 45;
  const renderB = () => {
    if (B.car > B.ref) B.car = B.ref;
    $$("#b-box .opt").forEach(b => b.setAttribute("aria-pressed", +b.dataset.v === B.box));
    $$("#b-ref .opt").forEach(b => b.setAttribute("aria-pressed", +b.dataset.v === B.ref));
    $$("#b-car .opt").forEach(b => { b.setAttribute("aria-pressed", +b.dataset.v === B.car); b.disabled = +b.dataset.v > B.ref; });
    const p = plan(), add = B.car * PRICE_CHAT.addon;
    bo.classList.toggle("is-empty", !p);
    $("#b-plan").innerHTML = p ? `<b>${esc(p[1])}</b>${esc(p[2])}${add ? `<small>+ Family member or carer – Reformer: ${B.car} × $${PRICE_CHAT.addon} per class</small>` : ""}${B.box ? "<small>Corner Pass: one carer joins boxing, strength &amp; balance for free.</small>" : ""}` : `<b>Choose a class</b>Pick boxing, Reformer, or both.`;
    const to = p ? p[0] + add : 0;
    if (G && to !== shown) { const o = { v: shown }; G.to(o, { v: to, duration: .45, ease: "power2.out", onUpdate: () => tot.textContent = Math.round(o.v) }); }
    else tot.textContent = to;
    shown = to;
    bo.dataset.pick = p ? `Chatswood · ${p[1]}${p[1] === "Combo" ? " (" + p[2] + ")" : ""}${add ? ` + carer Reformer × ${B.car}` : ""} · $${to}/week` : "";
  };
  renderB();
  const bbtn = document.createElement("a"); bbtn.className = "btn"; bbtn.href = "#start"; bbtn.textContent = "Ask about this plan"; bbtn.style.marginTop = "1.25rem";
  bbtn.addEventListener("click", () => bbtn.dataset.pick = bo.dataset.pick || "Chatswood · Free first class");
  bo.appendChild(bbtn);

  /* ---------- 声・FAQ ---------- */
  $("#voices").innerHTML = VOICES.map(v => `<li><q>${esc(v[1])}</q><b>${esc(v[0])}</b></li>`).join("");
  $("#faq-list").innerHTML = FAQ.map((f, i) => `<div class="faq__i" data-n="${String(i + 1).padStart(2, "0")}"><h3>${esc(f[0])}</h3><p>${esc(f[1]).replace("info@kopd.com.au", '<a class="lnk" href="mailto:info@kopd.com.au">info@kopd.com.au</a>')}</p></div>`).join("");

  /* ---------- 記事の書架 ---------- */
  const topicOf = a => (TOPICS.find(t => t[2].test(a.slug)) || ["more"])[0];
  const counts = { all: ARTICLES.length };
  ARTICLES.forEach(a => counts[topicOf(a)] = (counts[topicOf(a)] || 0) + 1);
  const chips = [["all", "All"]].concat(TOPICS.map(t => [t[0], t[1]])).concat(counts.more ? [["more", "More"]] : []);
  const at = $("#ar-topics"), al = $("#ar-list");
  at.innerHTML = chips.map(c => `<button type="button" class="chip" data-v="${c[0]}" aria-pressed="${c[0] === "all"}">${c[1]}<span>${counts[c[0]] || 0}</span></button>`).join("");
  const cut = s => s.length <= 120 ? s : s.slice(0, 120).replace(/[\s,;:.]+\S*$/, "") + "…";
  const words = s => s.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  al.innerHTML = ARTICLES.map((a, i) => { const m = Math.max(1, Math.round(words(FULL["a:" + a.slug] || "") / 200));
    return `<li data-t="${topicOf(a)}"><button type="button" class="art" data-i="${i}"><span class="art__n">${String(i + 1).padStart(2, "0")}</span><span><span class="art__t">${esc(a.title)}</span><span class="art__l">${esc(cut(a.lede))}</span><span class="art__m">Read article · about ${m} min</span></span></button></li>`; }).join("");
  at.addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    $$(".chip", at).forEach(c => c.setAttribute("aria-pressed", c === b));
    $$("li", al).forEach(li => li.hidden = b.dataset.v !== "all" && li.dataset.t !== b.dataset.v);
  });

  const rd = $("#reader"), rh = $("#r-h"), rb = $("#r-body"); let cur = -1, opener = null;
  const vis = () => $$("li:not([hidden]) .art", al).map(b => +b.dataset.i);
  const openArt = i => {
    cur = i; const a = ARTICLES[i], m = Math.max(1, Math.round(words(FULL["a:" + a.slug]) / 200));
    $(".reader__bar .kick", rd).textContent = "KOPD article";
    rh.textContent = a.title;
    const v = vis(), k = v.indexOf(i), prev = v[k - 1], next = v[k + 1];
    rb.innerHTML = `<p class="reader__m">About ${m} min read · from the KOPD articles page, kept in full</p>${FULL["a:" + a.slug]}
      <div class="reader__nav"><button type="button" data-go="${prev ?? ""}" ${prev === undefined ? "disabled" : ""}><small>Previous</small>${prev !== undefined ? esc(ARTICLES[prev].title) : ""}</button><button type="button" data-go="${next ?? ""}" ${next === undefined ? "disabled" : ""}><small>Next</small>${next !== undefined ? esc(ARTICLES[next].title) : ""}</button></div>`;
    if (!rd.open) rd.showModal();
    rd.scrollTop = 0;
  };
  al.addEventListener("click", e => { const b = e.target.closest(".art"); if (b) { opener = b; openArt(+b.dataset.i); } });
  rb.addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b && b.dataset.go !== "") openArt(+b.dataset.go); });
  $$("[data-open=privacy]").forEach(b => b.addEventListener("click", () => {
    opener = b; $(".reader__bar .kick", rd).textContent = "KOPD";
    rh.textContent = "Privacy policy"; rb.innerHTML = FULL.privacy; rd.showModal(); rd.scrollTop = 0;
  }));
  $("[data-close]", rd).addEventListener("click", () => rd.close());
  rd.addEventListener("click", e => { if (e.target === rd) rd.close(); });
  rd.addEventListener("close", () => opener && opener.focus());

  /* ---------- 申込みフォーム（選んだ内容を引き継ぐ） ---------- */
  const fsel = $("#f-sel"), form = $("#form"), err = $("#err");
  const setSel = (txt) => {
    if (!txt) return;
    fsel.hidden = false; fsel.innerHTML = `<b>You picked</b>${esc(txt)}`;
    const loc = ["Chatswood", "Gladesville", "Hobart"].find(n => txt.startsWith(n)); if (loc) form.loc.value = loc;
    form.act.value = /Reformer/.test(txt) && !/Boxing|Combo|All/.test(txt) ? "Reformer Pilates" : /Starter/.test(txt) ? "Starter Pack" : /Combo|Boxing|·\s*\$/.test(txt) && !/Free first/.test(txt) ? "Boxing" : "Free trial class";
  };
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-pick]"); if (a) setSel(a.dataset.pick);
    const g = e.target.closest("[data-goloc]"); if (g) { renderLoc(g.dataset.goloc, true); if (g.textContent.includes("prices")) { e.preventDefault(); $("#pricing").scrollIntoView({ behavior: calm ? "auto" : "smooth" }); } }
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const f = form; $$(".is-bad", f).forEach(x => x.classList.remove("is-bad"));
    const bad = [];
    if (!f.name.value.trim()) bad.push([f.name, "your name"]);
    if (!f.phone.value.trim() && !f.email.value.trim()) bad.push([f.phone, "a phone number or email"]);
    else if (f.email.value.trim() && !/^\S+@\S+\.\S+$/.test(f.email.value.trim())) bad.push([f.email, "a valid email"]);
    if (bad.length) { err.hidden = false; err.textContent = "Please add " + bad.map(b => b[1]).join(" and ") + "."; bad.forEach(b => b[0].classList.add("is-bad")); bad[0][0].focus(); return; }
    err.hidden = true;
    const body = [`Name: ${f.name.value.trim()}`, `Phone: ${f.phone.value.trim() || "-"}`, `Email: ${f.email.value.trim() || "-"}`, `I am: ${f.who.value}`, `Location: ${f.loc.value}`, `Interested in: ${f.act.value}`, fsel.hidden ? "" : `Picked on the website: ${fsel.textContent.replace(/^You picked/, "")}`, "", f.msg.value.trim()].filter((x, i) => x !== "" || i === 7).join("\n");
    location.href = `mailto:info@kopd.com.au?subject=${encodeURIComponent("Get started: " + f.loc.value + " (" + f.act.value + ")")}&body=${encodeURIComponent(body)}`;
  });

  /* ---------- 動き ---------- */
  if (G) {
    G.from(".hero h1 .w", { x: -26, opacity: 0, duration: .35, stagger: .09, ease: "back.out(2.2)", clearProps: "all" });
    G.from(".lede, .finder", { opacity: 0, y: 12, duration: .4, delay: .25, stagger: .08, ease: "power2.out", clearProps: "all" });
  }
  // ロープの線・1000 の数え上げ（画面に入ったとき1回）
  const once = (el, fn) => { if (!el) return; const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); fn(); } }, { threshold: .35 }); io.observe(el); };
  const rope = $(".steps__list");
  if (G) { rope.style.setProperty("--rope", 0); once(rope, () => G.to(rope, { "--rope": 1, duration: .6, ease: "power2.inOut" })); }
  const mn = $("#m-n");
  if (G) { mn.textContent = "0"; once(mn, () => { const o = { v: 0 }; G.to(o, { v: 1000, duration: 1.1, ease: "power3.out", onUpdate: () => mn.textContent = Math.round(o.v) }); }); }
})();
