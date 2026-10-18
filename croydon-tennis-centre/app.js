// Croydon Tennis Centre（試作 v2）：画面の切り替え・誰が何を・2026年の学期の帯・コート料金・全ページを読む画面
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap, anim = !!G && !RM;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const P = Object.fromEntries(PAGES.map((p) => [p[0], p]));
  const VN = Object.fromEntries(VIEWS.map((v) => [v[0], v]));

  // ---------- 読む画面 ----------
  const reader = $("#reader");
  async function openPage(slug) {
    const p = P[slug]; if (!p) return;
    $("#reader-cat").textContent = VN[p[2]] ? VN[p[2]][1] : "";
    $("#reader-h").textContent = p[1];
    $("#reader-body").innerHTML = "<p>Loading…</p>";
    if (!reader.open) reader.showModal();
    try { const r = await fetch(`p/${slug}.html`); $("#reader-body").innerHTML = r.ok ? await r.text() : "<p>This page could not be loaded.</p>"; }
    catch (e) { $("#reader-body").innerHTML = "<p>This page could not be loaded.</p>"; }
    reader.scrollTop = 0;
  }
  $("[data-close]", reader).addEventListener("click", () => reader.close());
  reader.addEventListener("click", (e) => { if (e.target === reader) reader.close(); });
  const card = (slug, cls = "") => { const p = P[slug]; if (!p) return ""; return `<li><button type="button" class="card ${cls}" data-slug="${slug}"><b>${esc(p[1])}</b><span>${esc(p[3] || "")}</span><i>Read more →</i></button></li>`; };
  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-slug]"); if (c) { openPage(c.dataset.slug); return; }
    const o = e.target.closest("[data-open]"); if (o) { setTimeout(() => openPage(o.dataset.open), 60); }
  });

  // ---------- 画面の切り替え ----------
  const views = { home: $('[data-view="home"]'), cat: $('[data-view="cat"]') };
  const EXTRA = {
    kids: () => `<div class="box"><h2>Junior development pathway</h2><ol class="path">
      <li><button type="button" data-slug="gross-motor-skills-prep-tennis-camp-3-5-">Gross Motor Skills PREP</button><small>For children from 3 to 5</small></li>
      <li><button type="button" data-slug="ctc-tennis-hot-shots-explore">Tennis Hot Shots</button><small>Explore, Red and beyond</small></li>
      <li><button type="button" data-slug="development-squads">Development Squads</button><small>For developing young players</small></li>
      <li><button type="button" data-slug="performance-squads">Performance Squads</button><small>Training and competition</small></li></ol>
      <p class="fine">From our Junior Development Pathway, Juniors and Hot Shots pages.</p></div>`,
    swim: () => `<div class="light"><h2>Swim school fees <small style="font-size:15px;font-weight:600;color:var(--soft)">Effective Term 4, 2024</small></h2>
      <table class="rtab"><thead><tr><th>Lessons</th><th>Duration</th><th>Price</th></tr></thead><tbody>${SWIM.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table>
      <p class="fine">Private lesson packs and term prices are on the <button type="button" class="lnk" data-slug="swim-school-fees" style="min-height:0">full fees page</button>.</p></div>`,
    courts: () => `<div class="two"><div class="box" id="calc"><h2>What will my court cost?</h2>
      <div class="seg" role="group" aria-label="Membership" id="c-who"><button type="button" data-v="mem" aria-pressed="true">Member</button><button type="button" data-v="non" aria-pressed="false">Non member</button></div>
      <div class="calc__row">
        <label>Day<select id="c-day"><option value="wd">Monday to Friday</option><option value="we">Weekend</option><option value="ph">Public holiday</option></select></label>
        <label>Time<select id="c-time"><option value="day">9am – 3pm</option><option value="eve" selected>3pm – 11pm</option></select></label>
        <label>Hours<select id="c-hrs"><option>1</option><option>1.5</option><option>2</option><option>3</option></select></label>
        <label>Racquet hire<select id="c-rq"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
      </div>
      <p class="calc__out"><b id="c-tot">$25</b><span id="c-how"></span></p>
      <p class="fine">All bookings are a minimum of 60 minutes. Racquet hire $10 per racquet, available during office hours and for bookings made over the phone or in person. To book a court, download our app.</p>
      <dl class="hrs"><h3>Opening &amp; office hours</h3><dt>Courts</dt><dd>Open daily from 7am till 11pm</dd><dt>Office, Monday to Friday</dt><dd>9:30am to 7:30pm</dd><dt>Office, Saturday &amp; Sunday</dt><dd>8:00am to 3:00pm</dd><dt>Office, Public Holidays</dt><dd>Closed</dd></dl>
      <p class="fine">Online court bookings must be made before 5pm for evening play. Office hours can change without notice due to adverse weather conditions. <button type="button" class="lnk" data-slug="office-hours" style="min-height:0;color:var(--ball)">Office hours in full</button></p></div>
      <div class="light"><h2>Court hire rates</h2><table class="rtab"><tbody>
      <tr><th colspan="2">Members – Permanent Bookings</th></tr><tr><td>Weekdays 9am – 3pm</td><td>$19 per hour*</td></tr><tr><td>Weekdays 3pm – 11pm</td><td>$25 per hour*</td></tr><tr><td>Weekends · Public Holidays</td><td>$25 per hour*</td></tr>
      <tr><th colspan="2">Members – Casual Court Hire Rates</th></tr><tr><td>9am – 3pm Monday to Friday</td><td>$19 per hour*</td></tr><tr><td>3pm – 11pm · Evenings, Weekends &amp; Public Holidays</td><td>$25 per hour*</td></tr>
      <tr><th colspan="2">Non Members – Casual Court Hire Rates</th></tr><tr><td>Anytime</td><td>$27 per hour*</td></tr>
      <tr><th colspan="2">Ball Machine Hire (Monday – Thursday 10am – 1pm)</th></tr><tr><td>60 mins, plus court hire</td><td>$60</td></tr></tbody></table>
      <p class="fine">* All bookings are a minimum of 60 minutes (One hour). Become a member &amp; save on court hire.</p></div></div>`,
    club: () => `<div class="light"><h2>Membership types</h2><table class="rtab"><tbody>${MEMBERSHIP.map((m) => `<tr><td>${esc(m[0])}</td><td>$${m[1]}</td></tr>`).join("")}</tbody></table>
      <p class="fine">Membership is valid for twelve months. Benefits include discounts on court hire, term based group classes and squads, private lesson packs, the weekly competition, the pro shop and racquet hire. <button type="button" class="lnk" data-slug="membership" style="min-height:0">Full membership details</button></p></div>`,
  };
  function route() {
    const v = (location.hash.match(/^#\/([a-z]+)/) || [])[1] || "home";
    if (reader.open) reader.close();
    $$("#nav a").forEach((a) => a.setAttribute("aria-current", a.getAttribute("href") === "#/" + v ? "page" : "false"));
    if (!VN[v]) { show("home"); return; }
    const [, name, lede] = VN[v];
    $("#cat-head").innerHTML = `<div><p class="crumb"><a href="#/">Home</a> / ${esc(name)}</p><h1>${esc(name)}</h1><p>${esc(lede)}</p></div><a class="lnk" href="tel:+61297474259">Call (02) 9747 4259</a>`;
    $("#cat-extra").innerHTML = EXTRA[v] ? EXTRA[v]() : "";
    const list = PAGES.filter((p) => p[2] === v);
    $("#cat-all-h").textContent = `All ${list.length} pages`;
    $("#cat-cards").innerHTML = list.map((p) => card(p[0])).join("");
    if (v === "courts") wireCalc();
    show("cat");
  }
  function show(k) {
    Object.entries(views).forEach(([n, el]) => el.classList.toggle("is-on", n === k));
    window.scrollTo(0, 0);
    if (anim) G.from(k === "cat" ? "#cat-head, #cat-extra, #cat-cards li" : ".hero__txt > *", { opacity: 0, y: 14, duration: 0.35, stagger: 0.03, clearProps: "all" });
  }
  addEventListener("hashchange", route);

  // ---------- 誰が・何を ----------
  const ps = { age: "5-12", want: "learn" };
  const chips = (id, arr, key) => { $(id).innerHTML = arr.map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${ps[key] === v}">${l}</button>`).join(""); };
  function pick() {
    chips("#p-age", PICK.age, "age"); chips("#p-want", PICK.want, "want");
    const list = PICK.map[`${ps.age}|${ps.want}`] || [];
    const a = PICK.age.find((x) => x[0] === ps.age)[1], w = PICK.want.find((x) => x[0] === ps.want)[1];
    $("#p-lab").textContent = `${w} · ${a}: ${list.length} options`;
    $("#p-out").innerHTML = list.map((s) => card(s)).join("");
    if (anim) G.from("#p-out li", { opacity: 0, y: 10, duration: 0.25, stagger: 0.05, clearProps: "all" });
    $$("#p-age button, #p-want button").forEach((b) => b.addEventListener("click", () => { ps[b.parentElement.id === "p-age" ? "age" : "want"] = b.dataset.v; pick(); }));
  }
  pick();

  // ---------- 2026年の学期の帯 ----------
  const syd = () => { const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map((x) => [x.type, x.value])); return { iso: `${p.year}-${p.month}-${p.day}`, dow: p.weekday.slice(0, 3), min: (+p.hour % 24) * 60 + +p.minute }; };
  const day = (iso) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
  const Y0 = day("2026-01-01"), Y1 = day("2027-01-01"), pct = (iso) => ((day(iso) - Y0) / (Y1 - Y0)) * 100;
  const nice = (iso) => new Date(day(iso)).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  function season() {
    const t = syd().iso, tl = $("#tl");
    tl.innerHTML = TERMS.map(([k, , a, b]) => `<span class="${k}" style="left:${pct(a)}%;width:${pct(b) - pct(a) + 0.3}%"></span>`).join("")
      + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => `<span class="m" style="left:${(i / 12) * 100 + 0.6}%">${m}</span>`).join("")
      + (t >= "2026-01-01" && t < "2027-01-01" ? `<span class="today" style="left:${pct(t)}%"></span>` : "");
    $("#tl-list").innerHTML = TERMS.filter((x) => x[0] === "term").map(([k, n, a, b]) => {
      const st = t > b ? "past" : t >= a ? "on" : "";
      return `<li class="${k} ${st}"><b>${n}</b><small>${nice(a)} – ${nice(b)}${st === "on" ? " · now" : st === "past" ? " · finished" : ""}</small></li>`;
    }).join("");
    const cur = TERMS.find((x) => t >= x[2] && t <= x[3] && x[0] === "term") || TERMS.find((x) => t >= x[2] && t <= x[3]);
    let txt = "";
    if (cur) { const wk = Math.floor((day(t) - day(cur[2])) / 6048e5) + 1, tot = Math.ceil((day(cur[3]) - day(cur[2]) + 864e5) / 6048e5); txt = `${cur[1]} · week ${wk} of ${tot} · until ${nice(cur[3])}`; }
    else { const nx = TERMS.find((x) => x[2] > t); txt = nx ? `Next: ${nx[1]}, from ${nice(nx[2])}` : "2027 dates: see the term dates page"; }
    $("#season-now").textContent = txt;
    if (anim) G.from("#tl span:not(.m)", { scaleX: 0, transformOrigin: "left", duration: 0.5, stagger: 0.05, ease: "power2.out", clearProps: "transform", scrollTrigger: undefined });
  }
  season();

  // ---------- 入口 ----------
  $("#hub").innerHTML = VIEWS.filter((v) => !["shop", "info"].includes(v[0])).map(([k, n, l]) => `<li><a href="#/${k}"><b>${n}</b><span>${l}</span><em>${PAGES.filter((p) => p[2] === k).length} pages →</em></a></li>`).join("");

  // ---------- いま開いているか ----------
  function tick() {
    const n = syd(), m = n.min, wk = !["Sat", "Sun"].includes(n.dow);
    const open = m >= 420 && m < 1380, office = wk ? m >= 570 && m < 1170 : m >= 480 && m < 900;
    const oc = wk ? "7:30pm" : "3pm";
    $("#now").textContent = open ? `Courts open now until 11pm · office ${office ? `open until ${oc}` : "closed"}` : "Closed now · the centre opens daily at 7am";
    $(".dot").classList.toggle("off", !open);
  }
  tick(); setInterval(tick, 60000);

  // ---------- コート料金 ----------
  function wireCalc() {
    const st = { who: "mem" };
    const calc = () => {
      const d = $("#c-day").value, tm = $("#c-time").value, h = +$("#c-hrs").value, rq = +$("#c-rq").value;
      const rate = st.who === "non" ? RATES.casual : d === "wd" && tm === "day" ? RATES.mem.day : 25;
      const tot = rate * h + rq * RATES.racquet;
      $("#c-tot").textContent = "$" + (Number.isInteger(tot) ? tot : tot.toFixed(2));
      $("#c-how").textContent = `${h} hour${h > 1 ? "s" : ""} × $${rate}${rq ? ` + ${rq} racquet${rq > 1 ? "s" : ""} × $10` : ""}`;
    };
    $$("#c-who button").forEach((b) => b.addEventListener("click", () => { st.who = b.dataset.v; $$("#c-who button").forEach((x) => x.setAttribute("aria-pressed", x === b)); calc(); }));
    ["#c-day", "#c-time", "#c-hrs", "#c-rq"].forEach((s) => $(s).addEventListener("change", calc));
    calc();
  }

  // ---------- メニュー ----------
  const mb = $(".menu-btn"), nav = $("#nav");
  const close = () => { mb.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); };
  let y0 = 0;
  mb.addEventListener("click", () => { const o = mb.getAttribute("aria-expanded") !== "true"; y0 = scrollY; nav.style.setProperty("--navtop", Math.round($(".top").getBoundingClientRect().bottom) + "px"); mb.setAttribute("aria-expanded", o); nav.classList.toggle("is-open", o); });
  $$("#nav a").forEach((a) => a.addEventListener("click", close));
  addEventListener("scroll", () => { if (nav.classList.contains("is-open") && Math.abs(scrollY - y0) > 40) close(); }, { passive: true });
  addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  document.addEventListener("click", (e) => { if (nav.classList.contains("is-open") && !nav.contains(e.target) && !mb.contains(e.target)) close(); });

  route();
})();
