// Dance Worx Academy — 画面の切り替え・5678 の最初の画面・クラス探し・学費・暦・ショップ・申し込みの窓口（英語のみ）
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const G = window.gsap;
if (G) G.registerPlugin(SplitText);
const root = document.documentElement;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const money = (n) => "$" + n.toLocaleString("en-AU");

// シドニーの今日（年月日）
function sydToday() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return new Date(`${p.year}-${p.month}-${p.day}T00:00:00`);
}
const day = (s) => new Date(s + "T00:00:00");
const daysTo = (s) => Math.round((day(s) - sydToday()) / 864e5);

// ---------- 画面の切り替え ----------
const VIEWS = ["home", "classes", "fees", "term", "troupe", "team", "shop", "policies", "contact"];
let pendingForm = null, pendingPrefill = null, first = true;
function route() {
  const k = location.hash.replace(/^#\/?/, ""), id = VIEWS.includes(k) ? k : "home", v = $("#v-" + id);
  const show = () => {
    $$(".view").forEach((x) => { x.hidden = x !== v; });
    $$(".nav a").forEach((a) => (a.dataset.view === id ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    document.title = `Dance Worx Academy | ${v.dataset.title}`;
    const hv = $(".hero__v"); if (hv) { if (id === "home" && !vtPaused) { const p = hv.play(); if (p) p.catch(() => {}); } else hv.pause(); }
    if (id === "contact") mode(pendingForm || curMode, pendingPrefill);
    if (id === "term") yearDraw(true);
    pendingForm = null; pendingPrefill = null;
    if (!first) scrollTo(0, 0);
    reveals(v);
  };
  if (first || !G || reduce) { show(); first = false; return; }
  G.timeline().set(".wipe", { transformOrigin: "left" }).to(".wipe", { scaleX: 1, duration: 0.22, ease: "power2.in" })
    .add(show).set(".wipe", { transformOrigin: "right" }).to(".wipe", { scaleX: 0, duration: 0.26, ease: "power2.out" });
}
addEventListener("hashchange", route);
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-view]");
  if (!a) return;
  if (a.dataset.form) pendingForm = a.dataset.form;
  if (a.dataset.prefill) pendingPrefill = JSON.parse(a.dataset.prefill);
  nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false");
  if (a.getAttribute("href") === (location.hash || "#/")) { e.preventDefault(); route(); }
});
const nav = $("#nav"), menuBtn = $(".menu-btn");
menuBtn.addEventListener("click", () => { const o = !nav.classList.contains("open"); nav.classList.toggle("open", o); menuBtn.setAttribute("aria-expanded", o); });

// 画面に入った写真を布のように出す
function reveals(v) {
  const els = $$(".reveal:not(.in)", v);
  if (!("IntersectionObserver" in window) || reduce) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  els.forEach((e) => io.observe(e));
}

// ---------- 映像：止める・流す ----------
let vtPaused = reduce;
const vt = $(".vt"), hv = $(".hero__v");
function vtSet(p) { vtPaused = p; vt.setAttribute("aria-pressed", p); $(".vt__t", vt).textContent = p ? "Play film" : "Pause film"; if (p) hv.pause(); else { const r = hv.play(); if (r) r.catch(() => {}); } }
vt.addEventListener("click", () => vtSet(!vtPaused));
if (reduce) vtSet(true);

// ---------- 最初の画面：5, 6, 7, 8 ----------
function opening() {
  const op = $(".opening"); let tl = null;
  const finish = () => { if (!op.isConnected) return; op.remove(); root.classList.remove("op"); ["click", "keydown", "wheel", "touchstart", "scroll"].forEach((x) => removeEventListener(x, skip)); hello(); };
  const skip = () => { if (tl) tl.kill(); finish(); };
  if (!root.classList.contains("op") || !G || reduce) { finish(); return; }
  tl = G.timeline({ onComplete: finish });
  $$(".count span").forEach((s, i) => tl.fromTo(s, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 0.18, ease: "power3.out" }, i * 0.32));
  tl.to(".opening", { clipPath: "inset(0 0 100% 0)", duration: 0.45, ease: "power3.inOut" }, "+=0.15");
  setTimeout(() => ["click", "keydown", "wheel", "touchstart", "scroll"].forEach((x) => addEventListener(x, skip, { passive: true, once: true })), 120);
}
function hello() {
  if (!G || reduce || $("#v-home").hidden) return;
  G.from(".hero__h span", { yPercent: 100, opacity: 0, duration: 0.6, stagger: 0.09, ease: "power4.out", clearProps: "all" });
  G.from(".hero__p, .hero__act, .vt", { opacity: 0, y: 12, duration: 0.45, stagger: 0.08, delay: 0.25, ease: "power2.out", clearProps: "all" });
}

// ---------- クラス探し ----------
let age = "cc", style = "Jazz";
function finder() {
  $("#f-age").innerHTML = AGES.map((a) => `<button type="button" class="chip" role="radio" aria-checked="${a.id === age}" data-age="${a.id}"><b>${esc(a.name)}</b><span>${esc(a.ages)}</span></button>`).join("");
  $("#f-style").innerHTML = STYLES.map((s) => `<button type="button" class="chip" role="radio" aria-checked="${s === style}" data-style="${esc(s)}"><b>${esc(s)}</b></button>`).join("");
  answer(false);
}
function answer(anim) {
  const a = AGES.find((x) => x.id === age);
  $("#fa-k").textContent = `${a.name} · ${a.ages}`;
  $("#fa-h").textContent = `${style}, for ${a.name}`;
  $("#fa-t").textContent = a.text || "Adults (45 minutes).";
  $("#fa-len").textContent = age === "pv" ? "Private sessions of 30, 45 or 60 minutes" : "45 minutes";
  $("#fa-wear").textContent = UNIFORM[style] ? (style === "Ballet" ? UNIFORM.Ballet : UNIFORM[style]) : `${UNIFORM._all} Please ask us about anything else to bring for ${style}.`;
  const cta = $("#fa-cta");
  cta.textContent = age === "pv" ? "Ask about a private lesson" : `Book a free ${style} trial`;
  cta.dataset.prefill = JSON.stringify({ trialClass: style, student: a.name });
  if (anim && G && !reduce) G.from(".finder__a > *", { opacity: 0, y: 8, duration: 0.3, stagger: 0.03, clearProps: "all" });
}
$("#f-age").addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (!b) return; age = b.dataset.age; $$("#f-age .chip").forEach((x) => x.setAttribute("aria-checked", x === b)); answer(true); });
$("#f-style").addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (!b) return; style = b.dataset.style; $$("#f-style .chip").forEach((x) => x.setAttribute("aria-checked", x === b)); answer(true); });
$("#age-list").innerHTML = AGES.filter((a) => a.text).map((a) => `<li class="age"><b>${esc(a.name)}</b><i>${esc(a.ages)}</i><p>${esc(a.text)}</p></li>`).join("");

// ---------- 学費 ----------
let ctype = "rec", cn = "1", cage = "cj", shownTotal = 0;
function calcUI() {
  const n = $("#c-n"), ag = $("#c-age");
  if (ctype === "rec") { $("#c-q2").textContent = "Classes per week"; n.innerHTML = ["1", "2", "3", "4", "u"].map((k) => `<button type="button" role="radio" aria-checked="${k === cn}" data-n="${k}">${k === "u" ? "Unlimited" : k}</button>`).join(""); $("#c-q3").hidden = true; ag.hidden = true; }
  if (ctype === "elite") {
    $("#c-q2").textContent = "Styles of dance per week";
    n.innerHTML = ["1", "2", "3", "4", "u"].map((k) => `<button type="button" role="radio" aria-checked="${k === cn}" data-n="${k}">${k === "u" ? "Unlimited" : k}</button>`).join("");
    $("#c-q3").hidden = false; ag.hidden = false;
    const opts = cn === "u" ? [["cc", "Curious Cuties"], ["jr", "Junior"], ["tn", "Teen"]] : [["cj", "CC / Junior"], ["tn", "Teen"]];
    if (!opts.some((o) => o[0] === cage)) cage = opts[0][0];
    ag.innerHTML = opts.map(([k, l]) => `<button type="button" role="radio" aria-checked="${k === cage}" data-age="${k}">${l}</button>`).join("");
  }
  if (ctype === "priv") { $("#c-q2").textContent = "Length of session"; if (!["60", "45", "30"].includes(cn)) cn = "60"; n.innerHTML = [["60", "1 hour"], ["45", "45 min"], ["30", "30 min"]].map(([k, l]) => `<button type="button" role="radio" aria-checked="${k === cn}" data-n="${k}">${l}</button>`).join(""); $("#c-q3").hidden = true; ag.hidden = true; }
  calcOut();
}
function plan() {
  if (ctype === "rec") return PLANS.rec.find((p) => p.k === cn);
  if (ctype === "elite") return PLANS.elite.find((p) => p.k === cn && p.age === cage);
  return PLANS.priv.find((p) => p.k === cn);
}
function calcOut() {
  const p = plan(), lines = [[p.name, p.price]];
  if (ctype !== "priv") lines.push(["Joining fee (annual registration)", 25]);
  if (ctype === "rec") lines.push(["Costume levy, per term", 30]);
  const total = lines.reduce((s, l) => s + l[1], 0);
  $("#t-name").textContent = p.name;
  $("#t-note").textContent = p.note + (ctype === "priv" ? "" : ". Every 12 weeks.");
  $("#t-lines").innerHTML = lines.map(([n, v]) => `<li><span>${esc(n)}</span><b>${money(v)}</b></li>`).join("");
  $(".ticket__sum span").textContent = ctype === "priv" ? "One session" : "First 12 weeks";
  const el = $("#t-total");
  if (G && !reduce) { const o = { v: shownTotal }; G.to(o, { v: total, duration: 0.45, ease: "power2.out", onUpdate: () => { el.textContent = money(Math.round(o.v)); } }); } else el.textContent = money(total);
  shownTotal = total;
  const cta = $("#t-cta"); cta.dataset.form = "enrol"; cta.dataset.prefill = JSON.stringify({ plan: p.name });
}
$("#c-type").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; ctype = b.dataset.t; cn = ctype === "priv" ? "60" : "1"; $$("#c-type button").forEach((x) => x.setAttribute("aria-checked", x === b)); calcUI(); });
$("#c-n").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; cn = b.dataset.n; calcUI(); });
$("#c-age").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; cage = b.dataset.age; calcUI(); });
$("#plans").innerHTML = [["Recreational", PLANS.rec], ["Elite", PLANS.elite], ["Private sessions", PLANS.priv]].map(([h, ps]) => `<div class="plan"><h4>${h}</h4><ul>${ps.map((p) => `<li><span>${esc(p.name)}<i>${esc(p.note)}</i></span><b>${money(p.price)}</b></li>`).join("")}</ul><p class="fine">${h === "Private sessions" ? "Valid for 7 days." : "Every 12 weeks, +$25 Joining Fee."}</p></div>`).join("");

// ---------- 2026年の暦 ----------
function yearDraw(anim) {
  const bar = $("#year-bar"), y0 = day("2026-01-01"), y1 = day("2027-01-01"), pct = (s) => ((day(s) - y0) / (y1 - y0)) * 100;
  const today = sydToday(), tp = Math.max(0, Math.min(100, ((today - y0) / (y1 - y0)) * 100));
  bar.innerHTML = TERMS.map(([n, a, b]) => `<span class="tm" style="left:${pct(a)}%;width:${pct(b) - pct(a)}%" title="${n}">${n}</span>`).join("")
    + EVENTS.map(([n, d], i) => `<span class="ev${i === 2 ? " ev--concert" : ""}" style="left:${pct(d)}%" title="${esc(n)}">${i === 1 ? "<em>Music</em>" : i === 2 ? "<em>Concert</em>" : ""}</span>`).join("")
    + (today >= y0 && today < y1 ? `<span class="now" style="left:${tp}%"></span>` : "");
  const inTerm = TERMS.find(([, a, b]) => today >= day(a) && today <= day(b));
  const next = TERMS.find(([, a]) => day(a) > today);
  const dc = daysTo("2026-12-11");
  $("#year-now").innerHTML = inTerm ? `Today is in <b>${inTerm[0]}</b>, which ends ${day(inTerm[2]).toLocaleDateString("en-AU", { day: "numeric", month: "long" })}. The yellow marks are the Afternoon of Music (28 and 29 November), the red one is the concert.` : next ? `Next up: <b>${next[0]}</b> starts ${day(next[1]).toLocaleDateString("en-AU", { day: "numeric", month: "long" })}.` : "The 2026 terms have finished.";
  const cd = $("#cd");
  if (dc >= 0) { if (anim && G && !reduce) { const o = { v: dc + 40 }; G.to(o, { v: dc, duration: 0.8, ease: "power2.out", onUpdate: () => { cd.textContent = Math.round(o.v); } }); } else cd.textContent = dc; } else { cd.textContent = "0"; }
  if (anim && G && !reduce) G.from("#year-bar .tm", { scaleX: 0, transformOrigin: "left", duration: 0.5, stagger: 0.08, ease: "power3.out", clearProps: "transform" });
}
$("#home-days").textContent = Math.max(0, daysTo("2026-12-11"));

// ---------- Show Troupe の準備 ----------
$("#prep").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true");
  const done = $$("#prep button[aria-pressed=true]").length, all = $$("#prep button").length;
  const p = $("#prep-done"); p.textContent = done === all ? "All set. See you at the audition!" : `${done} of ${all} ready.`; p.classList.toggle("all", done === all);
});

// ---------- ショップ ----------
const picked = {};
$("#shop").innerHTML = PRODUCTS.map((p) => `<article class="prod">${p.img ? `<div class="prod__ph"><img src="img/${p.img}.jpg" alt="${esc(p.name)}" loading="lazy">${p.best ? '<span class="prod__best">Best Seller</span>' : ""}</div>` : `<div class="prod__tk" aria-hidden="true"><span>Afternoon of Music</span><b>${p.day}</b><span>November 2026</span><i>Casablanca, Oatlands</i></div>`}
  <h3>${esc(p.name)}</h3><p class="prod__p">${p.price}</p>${p.text ? `<p class="prod__t">${esc(p.text)}</p>` : ""}
  ${p.sizes ? `<div class="prod__sizes" role="group" aria-label="Size (optional)" data-id="${p.id}">${SIZES.map((s) => `<button type="button" aria-pressed="false" data-s="${s}">${s}</button>`).join("")}</div>` : ""}
  ${p.pickup ? '<p class="prod__t">Please pick up your product from the Dance Worx Academy.</p>' : ""}
  <a class="btn btn--line btn--sm" href="#/contact" data-view="contact" data-form="order" data-pid="${p.id}">Order</a></article>`).join("");
$("#shop").addEventListener("click", (e) => {
  const s = e.target.closest(".prod__sizes button");
  if (s) { const g = s.parentElement; $$("button", g).forEach((x) => x.setAttribute("aria-pressed", x === s)); picked[g.dataset.id] = s.dataset.s; return; }
  const o = e.target.closest("[data-pid]");
  if (o) { const p = PRODUCTS.find((x) => x.id === o.dataset.pid); pendingPrefill = { product: `${p.name} (${p.price})${picked[p.id] ? ", size " + picked[p.id] : ""}` }; }
});

// ---------- 申し込みの窓口（いまのサイトのフォームの項目どおり） ----------
const F = {
  trial: { h: "Book your free trial.", to: "info@danceworx.com.au", subj: "Free trial booking", fields: [["First name", "text", 1], ["Last name", "text", 1], ["Student Full Name", "text", 1], ["Email", "email", 1], ["Mobile", "tel", 1], ["Student DOB", "date", 1], ["Trial Class", ["Jazz", "Ballet", "Hip Hop", "Lyrical/Contemporary", "Acrobatics", "Musical Theatre", "Tap", "Private Singing", "Acting", "Other"], 1], ["Date of Trial", "date", 1]] },
  audition: { h: "Show Troupe audition.", to: "sheridan@danceworx.com.au", subj: "Show Troupe audition application", note: "Please send a 30 second routine in your best / favourite style as an MP3 to sheridan@danceworx.com.au.", fields: [["First Name", "text", 1], ["Last Name", "text", 1], ["Child Name", "text", 1], ["Child D.O.B", "date", 1], ["Email", "email", 1], ["Phone", "tel", 1], ["Message", "area", 0]] },
  change: { h: "Change or cancel enrolment.", to: "info@danceworx.com.au", subj: "Cancellation / change request", note: "Cancellation can only occur during the school holidays. Please read the Terms and conditions on the Policies page first.", fields: [["Student Full Name", "text", 1], ["First name", "text", 1], ["Last name", "text", 1], ["Email", "email", 1], ["Phone", "tel", 1], ["Classes being cancelled/changed", "text", 1], ["Reason for cancelling enrolment", "area", 1], ["Feedback", "area", 0]] },
  voucher: { h: "Redeem your NSW Government voucher.", to: "info@danceworx.com.au", subj: "NSW voucher redemption", note: "Dance Worx Academy will ONLY credit your account once we have received reimbursement for this voucher from Service NSW.", fields: [["Full name of student exactly as it appears on your voucher", "text", 1], ["Voucher Type", ["Active Kids", "Creative Kids"], 1], ["Student Date of Birth", "date", 1], ["Voucher Code", "text", 1], ["Parent Full Name", "text", 1], ["Parent Phone Number", "tel", 1]], agree: "I understand and accept the above." },
  order: { h: "Order from our shop.", to: "info@danceworx.com.au", subj: "Shop order", note: "Please pick up your product from the Dance Worx Academy.", fields: [["Product", "text", 1], ["Quantity", "number", 1], ["Your name", "text", 1], ["Email", "email", 1], ["Phone", "tel", 0], ["Message", "area", 0]] },
  enrol: { h: "Ask to enrol.", to: "info@danceworx.com.au", subj: "Enrolment enquiry", note: "There is a $25 (incl. GST) annual registration fee payable per student upon enrolment.", fields: [["Membership", "text", 1], ["Student Full Name", "text", 1], ["Student DOB", "date", 1], ["Parent name", "text", 1], ["Email", "email", 1], ["Mobile", "tel", 1], ["Message", "area", 0]] },
};
let curMode = "trial";
const fid = (l) => "f-" + l.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
function mode(m, pre) {
  curMode = m; const f = F[m];
  $$(".desk__tabs button").forEach((b) => b.setAttribute("aria-selected", b.dataset.mode === m));
  $("#v-contact .ph__h").textContent = f.h;
  $("#fields").innerHTML = (f.note ? `<p class="form__note">${esc(f.note)}</p>` : "") + f.fields.map(([l, t, req]) => {
    const id = fid(l), lab = `${esc(l)}${req ? " *" : ""}`, wide = t === "area" || l.length > 30 ? " fld--w" : "";
    if (Array.isArray(t)) return `<label class="fld${wide}"><span>${lab}</span><select id="${id}" ${req ? "required" : ""}><option value="">Select</option>${t.map((o) => `<option>${esc(o)}</option>`).join("")}</select></label>`;
    if (t === "area") return `<label class="fld fld--w"><span>${lab}</span><textarea id="${id}" rows="4" ${req ? "required" : ""}></textarea></label>`;
    return `<label class="fld${wide}"><span>${lab}</span><input id="${id}" type="${t}" ${t === "number" ? 'min="1" value="1"' : ""} ${req ? "required" : ""}></label>`;
  }).join("") + (f.agree ? `<label class="chk"><input type="checkbox" id="f-agree" required> <span>${esc(f.agree)} *</span></label>` : "");
  $("#f-err").hidden = true;
  if (pre) {
    if (pre.trialClass) { const s = $("#f-trial-class"); const opt = [...s.options].find((o) => o.text.toLowerCase().startsWith(pre.trialClass.toLowerCase().slice(0, 4))); if (opt) s.value = opt.text; }
    if (pre.plan && $("#f-membership")) $("#f-membership").value = pre.plan;
    if (pre.product && $("#f-product")) $("#f-product").value = pre.product;
  }
}
$(".desk__tabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) mode(b.dataset.mode); });
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = F[curMode], miss = $$("#fields [required]").filter((x) => (x.type === "checkbox" ? !x.checked : !x.value.trim()));
  const mail = $$('#fields input[type="email"]')[0];
  if (mail && mail.value && !/^\S+@\S+\.\S+$/.test(mail.value)) miss.push(mail);
  $("#f-err").hidden = !miss.length;
  if (miss.length) { miss[0].focus(); return; }
  const body = f.fields.map(([l]) => `${l}: ${$("#" + fid(l)).value.trim() || "-"}`).join("\n") + (f.agree ? `\n\n${f.agree} Yes` : "");
  location.href = `mailto:${f.to}?subject=${encodeURIComponent(f.subj)}&body=${encodeURIComponent(body)}`;
});

// ---------- 写真を早めに読む（表示していない画面の写真も、開いて少ししたら読んでおく） ----------
setTimeout(() => $$('img[loading="lazy"]').forEach((i) => { i.loading = "eager"; }), 1500);
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.loading = "eager"; io.unobserve(e.target); } }), { rootMargin: "1500px 0px" });
  $$('img[loading="lazy"]').forEach((i) => io.observe(i));
}

// ---------- はじめる ----------
finder(); calcUI(); mode("trial");
route();
opening();
