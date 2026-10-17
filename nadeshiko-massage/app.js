// Nadeshiko Japanese Massage（試作 v2）：一覧と詳細・時間ごとの料金の棒・パッケージの時間割・保険の確認・最終受付の時計・質問フォーム
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap, anim = !!G && !RM;
  if (G && window.Flip) G.registerPlugin(Flip);
  if (G && window.ScrollTrigger) G.registerPlugin(ScrollTrigger);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const BOOK = "https://www.fresha.com/book-now/nadeshiko-japanese-massage-xk36yad2/all-offer?share&pId=1285627";
  const narrow = matchMedia("(max-width: 920px)");
  const byId = Object.fromEntries(SERVICES.map((s) => [s.id, s]));
  const catName = Object.fromEntries(CATS.map((c) => [c[0], c[1]]));
  const TAGS = { oilfree: "Oil-free", fund: "Health fund rebate", couple: "Couples & groups" };

  // ---------- 一覧 ----------
  const st = { cat: "all", tags: new Set(), sel: "shiatsu-massage", len: {} };
  $("#cats").innerHTML = [["all", "All", SERVICES.length], ...CATS].map((c) => `<button type="button" role="tab" aria-selected="${c[0] === "all"}" data-cat="${c[0]}">${c[1]}<small>${c[2]}</small></button>`).join("");
  const span = (s) => { const m = s.v.map((v) => v[1]); return [Math.min(...m), Math.max(...m)]; };
  $("#rows").innerHTML = SERVICES.map((s) => {
    const [a, b] = span(s);
    const tags = s.tags.filter((t) => t !== "couple").map((t) => `<em>${TAGS[t]}</em>`).join("") + (s.new ? '<em class="new">New</em>' : "");
    return `<li data-id="${s.id}"><button type="button" class="row" data-id="${s.id}"><span class="row__n">${esc(s.name)}${tags}</span>` +
      `<span class="row__t"><i class="ruler" aria-hidden="true"><b style="--a:${(a / 120).toFixed(3)};--b:${(Math.min(b, 120) / 120).toFixed(3)}"></b></i><small>${esc(s.cap)}</small></span>` +
      `<span class="row__p">${s.fromLabel ? "<small>from</small>" : ""}$${s.from}</span></button></li>`;
  }).join("") + '<li class="empty" hidden>No treatment matches. Try another type, or switch off a filter.</li>';

  function filter(first) {
    const items = $$("#rows li[data-id]");
    const state = !first && anim && window.Flip ? Flip.getState(items) : null;
    let n = 0;
    items.forEach((li) => {
      const s = byId[li.dataset.id];
      const ok = (st.cat === "all" || s.cat === st.cat) && [...st.tags].every((t) => s.tags.includes(t));
      li.hidden = !ok; if (ok) n++;
    });
    $("#rows .empty").hidden = n > 0;
    if (state) Flip.from(state, { duration: 0.35, ease: "power2.out", absolute: false, onEnter: (els) => G.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.3 }), onLeave: (els) => G.to(els, { opacity: 0, duration: 0.2 }) });
  }
  $$("#cats button").forEach((b) => b.addEventListener("click", () => {
    st.cat = b.dataset.cat;
    $$("#cats button").forEach((x) => x.setAttribute("aria-selected", x === b));
    filter();
  }));
  $$(".tg").forEach((b) => b.addEventListener("click", () => {
    const on = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", on);
    on ? st.tags.add(b.dataset.tag) : st.tags.delete(b.dataset.tag);
    if (on) { st.cat = "all"; $$("#cats button").forEach((x) => x.setAttribute("aria-selected", x.dataset.cat === "all")); }
    filter();
  }));

  // ---------- 詳細 ----------
  const para = (t) => t.split(/\n\s*\n/).map((p) => `<p>${esc(p.trim()).replace(/\n/g, "<br>")}</p>`).join("");
  function detailHTML(s) {
    const i = st.len[s.id] ?? Math.max(0, s.v.findIndex((v) => v[1] === 60));
    const v = s.v[i];
    const max = Math.max(120, ...s.v.map((x) => x[1]));
    return `<div class="dt" data-id="${s.id}">
      <p class="cap dt__cat">${catName[s.cat]}</p>
      <h2 class="dt__h">${esc(s.name)}</h2>
      <p class="dt__price"><b data-price>$${v[2]}</b><span data-for>for ${esc(v[0])}</span></p>
      <p class="dt__sub">${s.v.length > 1 ? "Choose a session length:" : "One session length."}</p>
      <ol class="bars">${s.v.map((x, k) => `<li><button type="button" class="bar" aria-pressed="${k === i}" data-k="${k}"><i class="bar__f" style="--w:${(x[1] / max).toFixed(3)}" aria-hidden="true"></i><span class="bar__l">${esc(x[0])}${vname(s, x)}</span><span class="bar__p">$${x[2]}</span></button></li>`).join("")}</ol>
      <div class="dt__act"><a class="btn" href="${BOOK}" target="_blank" rel="noopener">Go to booking page <span aria-hidden="true">&nearr;</span></a><button type="button" class="lnk" data-ask>Ask about this treatment</button></div>
      ${s.tags.includes("fund") ? '<p class="dt__fund">Eligible for health fund rebates with most providers. <a href="#health-fund" data-go>Check your fund</a>.</p>' : ""}
      ${s.tags.length ? `<div class="dt__tags">${s.tags.map((t) => `<span>${TAGS[t]}</span>`).join("")}</div>` : ""}
      <div class="dt__desc">${s.desc ? para(s.desc) : "<p>Ask us for details of this treatment.</p>"}</div>
    </div>`;
  }
  // Fresha の時間ごとの名前（「Shiatsu」など施術名の言い換え）は出さず、追加の内容（反射区15分など）だけ出す
  const vname = (s, x) => { const n = x[3] && !s.name.toLowerCase().includes(x[3].toLowerCase()) ? x[3] : ""; const d = x[4] || ""; const t = d || n; return t ? `<small>${esc(t)}</small>` : ""; };
  let counter = { n: 0 };
  function wire(root, s, grow) {
    const price = $("[data-price]", root), forEl = $("[data-for]", root);
    $$(".bar", root).forEach((b) => b.addEventListener("click", () => {
      const k = +b.dataset.k, v = s.v[k];
      st.len[s.id] = k;
      $$(".bar", root).forEach((x) => x.setAttribute("aria-pressed", x === b));
      forEl.textContent = `for ${v[0]}`;
      const from = parseInt(price.textContent.slice(1), 10) || v[2];
      if (anim) { counter.n = from; G.to(counter, { n: v[2], duration: 0.4, ease: "power2.out", overwrite: true, onUpdate: () => (price.textContent = "$" + Math.round(counter.n)) }); }
      else price.textContent = "$" + v[2];
    }));
    $("[data-ask]", root).addEventListener("click", () => ask(s));
    const go = $("[data-go]", root);
    if (go) go.addEventListener("click", () => { if (sheet.open) sheet.close(); });
    if (grow && anim) G.from($$(".bar__f", root), { scaleX: 0, duration: 0.5, stagger: 0.04, ease: "power2.out", clearProps: "transform" });
  }
  const aside = $("#detail"), sheet = $("#sheet"), sheetBody = $("#sheet-body");
  function select(id, opts = {}) {
    const s = byId[id]; if (!s) return;
    st.sel = id;
    $$(".row").forEach((r) => r.setAttribute("aria-current", r.dataset.id === id));
    if (narrow.matches && !opts.quiet) {
      sheetBody.innerHTML = detailHTML(s); wire(sheetBody, s, true);
      if (!sheet.open) sheet.showModal();
      sheetBody.parentElement.scrollTop = 0;
    } else {
      aside.innerHTML = detailHTML(s); wire(aside, s, !opts.quiet);
      aside.scrollTop = 0;
      if (anim && !opts.quiet) G.from($(".dt", aside), { opacity: 0, y: 12, duration: 0.3, clearProps: "all" });
    }
  }
  $("#rows").addEventListener("click", (e) => { const r = e.target.closest(".row"); if (r) select(r.dataset.id); });
  $("[data-close]", sheet).addEventListener("click", () => sheet.close());
  sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });
  narrow.addEventListener("change", () => { if (!narrow.matches && sheet.open) sheet.close(); select(st.sel, { quiet: narrow.matches }); });
  // パッケージ・保険から詳細を開く
  $$("[data-open]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.open;
    st.cat = "all"; st.tags.clear();
    $$("#cats button").forEach((x) => x.setAttribute("aria-selected", x.dataset.cat === "all"));
    $$(".tg").forEach((x) => x.setAttribute("aria-pressed", "false"));
    filter(true);
    select(id);
    if (!narrow.matches) {
      const row = $(`.row[data-id="${id}"]`);
      document.getElementById("treatments").scrollIntoView({ behavior: RM ? "auto" : "smooth" });
      setTimeout(() => row && row.scrollIntoView({ block: "center", behavior: RM ? "auto" : "smooth" }), RM ? 0 : 450);
    }
  }));

  // ---------- 質問フォーム ----------
  const askT = $("#ask-t"), askL = $("#ask-l"), askM = $("#ask-m");
  askT.insertAdjacentHTML("beforeend", SERVICES.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join(""));
  function fillLengths(id, k) {
    const s = byId[id];
    askL.innerHTML = '<option value="">Any</option>' + (s ? s.v.map((v, i) => `<option value="${i}">${esc(v[0])}${v[4] ? " · " + esc(v[4]) : ""} · $${v[2]}</option>`).join("") : "");
    if (s && k != null) askL.value = String(k);
  }
  askT.addEventListener("change", () => fillLengths(askT.value));
  function ask(s, msg) {
    if (sheet.open) sheet.close();
    if (s) { askT.value = s.id; fillLengths(s.id, st.len[s.id] ?? Math.max(0, s.v.findIndex((v) => v[1] === 60))); }
    if (msg && !askM.value.trim()) askM.value = msg;
    document.getElementById("ask").scrollIntoView({ behavior: RM ? "auto" : "smooth" });
    setTimeout(() => { [askT, askL].forEach((el) => { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }); askM.focus({ preventScroll: true }); }, RM ? 0 : 500);
  }
  $("#ask").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, err = $("#ask-err");
    const name = f.name.value.trim(), email = f.email.value.trim(), msg = askM.value.trim();
    const miss = [!name && "your name", !/^\S+@\S+\.\S+$/.test(email) && "a valid email", !msg && "a message"].filter(Boolean);
    if (miss.length) { err.textContent = `Please add ${miss.join(", ")}.`; err.hidden = false; return; }
    err.hidden = true;
    const s = byId[askT.value], v = s && askL.value !== "" ? s.v[+askL.value] : null;
    const body = `${msg}\n\n—\nName: ${name}\nEmail: ${email}${s ? `\nTreatment: ${s.name}` : ""}${v ? `\nSession: ${v[0]}${v[3] ? " (" + v[3] + ")" : ""}, $${v[2]}` : ""}`;
    location.href = `mailto:info@nadeshiko.com.au?subject=${encodeURIComponent("Question" + (s ? ": " + s.name : ""))}&body=${encodeURIComponent(body)}`;
  });

  // ---------- 保険 ----------
  $("#fund-list").innerHTML = FUNDS.map((f) => `<option value="${esc(f)}">`).join("");
  $("#fund-all").innerHTML = FUNDS.map((f) => `<li>${esc(f)}</li>`).join("");
  const norm = (t) => t.toLowerCase().replace(/[（）().&’'\-]/g, " ").replace(/\s+/g, " ").trim();
  const fundRes = $("#fund-res");
  $("#fund-q").addEventListener("input", (e) => {
    const q = norm(e.target.value);
    if (q.length < 2) { fundRes.innerHTML = '<p class="fund__hint">We are partnered with 36 major private health funds.</p>'; return; }
    if (/^hcf\b/.test(q) || q.includes("hospitals contribution")) {
      fundRes.innerHTML = '<p class="no">HCF is currently not claimable.</p><p>As noted on our booking page for Remedial Massage.</p>'; return;
    }
    const hits = FUNDS.filter((f) => norm(f).includes(q) || q.split(" ").filter((w) => w.length > 2).some((w) => norm(f).split(" ").includes(w)));
    if (hits.length) {
      fundRes.innerHTML = `<ul>${hits.slice(0, 5).map((f) => `<li>${esc(f)}</li>`).join("")}</ul><p>On our list of participating funds. Remedial Massage may be claimable; on-the-spot claiming is available for some funds through our HICAPS terminal.</p>`;
    } else {
      fundRes.innerHTML = `<p class="no">Not on our list.</p><p>If your health fund is not listed here, you may still be able to claim. Please contact us to confirm whether your insurance is accepted.</p><button type="button" class="lnk" id="fund-ask">Ask us about my fund <span aria-hidden="true">&rarr;</span></button>`;
      $("#fund-ask").addEventListener("click", () => ask(byId["remedial-massage"], `Hello, can I claim Remedial Massage with ${e.target.value.trim()}?`));
    }
  });

  // ---------- 最終受付の時計 ----------
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const H = (d) => (d === 6 ? { o: 600, c: 1080, last: 1050, lastL: "5:30pm", cL: "6pm" } : { o: 600, c: 1140, last: 1110, lastL: "6:30pm", cL: "7pm" });
  const dur = (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60 ? (m % 60) + " min" : ""}`.trim() : `${m} min`);
  function tick(now = new Date()) {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(now).map((x) => [x.type, x.value]));
    const d = DAYS.indexOf(p.weekday.slice(0, 3)), m = (+p.hour % 24) * 60 + +p.minute, h = H(d);
    let txt, on = false;
    if (m >= h.o && m <= h.last) { on = true; txt = `Open now · last appointment ${h.lastL}, in ${dur(h.last - m)}`; }
    else if (m > h.last && m < h.c) txt = `Today’s last appointment (${h.lastL}) has passed · open until ${h.cL}`;
    else if (m < h.o) txt = "Closed now · opens today at 10am";
    else txt = "Closed now · opens tomorrow at 10am";
    $("#now").textContent = txt;
    $(".dot").classList.toggle("off", !on);
    $$("#hours [data-d]").forEach((r) => r.classList.toggle("today", r.dataset.d.split(",").map(Number).includes(d)));
  }
  tick(); setInterval(tick, 30000);

  // ---------- 声（横送り） ----------
  const row = $("#voices-row"), arws = $$(".arw");
  const upd = () => { arws[0].disabled = row.scrollLeft < 8; arws[1].disabled = row.scrollLeft + row.clientWidth > row.scrollWidth - 8; };
  arws.forEach((b) => b.addEventListener("click", () => row.scrollBy({ left: +b.dataset.dir * (row.firstElementChild.offsetWidth + 16), behavior: RM ? "auto" : "smooth" })));
  row.addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();

  // ---------- 案内・メニュー ----------
  const here = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) $$("#nav a").forEach((a) => a.classList.toggle("is-here", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  ["treatments", "packages", "health-fund", "about", "visit"].forEach((id) => here.observe(document.getElementById(id)));
  const mb = $(".menu-btn"), nav = $("#nav");
  const close = () => { mb.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); };
  let y0 = 0;
  mb.addEventListener("click", () => { const o = mb.getAttribute("aria-expanded") !== "true"; y0 = scrollY; nav.style.setProperty("--navtop", Math.round($(".top").getBoundingClientRect().bottom) + "px"); mb.setAttribute("aria-expanded", o); nav.classList.toggle("is-open", o); });
  $$("#nav a").forEach((a) => a.addEventListener("click", close));
  addEventListener("scroll", () => { if (nav.classList.contains("is-open") && Math.abs(scrollY - y0) > 40) close(); }, { passive: true });
  addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  document.addEventListener("click", (e) => { if (nav.classList.contains("is-open") && !nav.contains(e.target) && !mb.contains(e.target)) close(); });

  // ---------- はじめ ----------
  filter(true);
  select(st.sel, { quiet: true });
  if (!anim) return;
  G.timeline()
    .fromTo(".intro__sign img", { filter: "brightness(.45) saturate(.6)" }, { filter: "brightness(1) saturate(1)", duration: 0.9, ease: "power2.inOut", clearProps: "filter" }, 0.1)
    .from(".intro__h", { opacity: 0, y: 18, duration: 0.5, clearProps: "all" }, 0)
    .from(".intro__lede, .status, .rating", { opacity: 0, y: 10, duration: 0.4, stagger: 0.06, clearProps: "all" }, 0.15)
    .from(".rows li:not([hidden])", { opacity: 0, y: 8, duration: 0.3, stagger: 0.015, clearProps: "all" }, 0.25)
    .from(".desk__detail .bar__f", { scaleX: 0, duration: 0.5, stagger: 0.04, ease: "power2.out", clearProps: "transform" }, 0.35);
  if (!window.ScrollTrigger) return;
  $$(".pkg").forEach((p) => {
    const segs = $$(".seg", p);
    G.fromTo(segs, { "--fill": 0 }, { "--fill": 1, duration: 0.45, stagger: 0.18, ease: "none", scrollTrigger: { trigger: p, start: "top 82%", once: true } });
  });
})();
