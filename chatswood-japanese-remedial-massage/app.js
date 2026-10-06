// Chatswood Japanese Remedial Massage — interaction. With "reduce motion" on, everything is simply shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (p) => p[lang === "en" ? 0 : 1];

// Prices from the booking page
const KINDS = [{ n: ["Remedial massage", "リメディアル・マッサージ"], p: { 30: 70, 45: 95, 60: 110, 75: 135, 90: 155 } }, { n: ["Deep tissue massage", "ディープティシュー・マッサージ"], p: { 30: 75, 45: 100, 60: 120, 75: 140, 90: 160 } }];
const MINS = [30, 45, 60, 75, 90];
const STEPS = [["The intercom is on the left side of the entrance.", "インターホンは、入口の左側にあります。"], ["Press “call” and 202 for access.", "「call」と 202 を押してください。"], ["Take the lift to Level 2.", "エレベーターで Level 2 へ。"], ["Suite 202a.", "Suite 202a です。"]];
let kind = 0, min = 60, step = 0, timer;
function calc(animate = true) {
  $(".kinds").innerHTML = KINDS.map((k, i) => `<button type="button" role="radio" aria-checked="${i === kind}" data-i="${i}">${t(k.n)}</button>`).join("");
  $(".mins").innerHTML = MINS.map((m) => `<button type="button" role="radio" aria-checked="${m === min}" data-m="${m}"><b>${m}</b><span>${t(["min", "分"])}</span></button>`).join("");
  $("#c-name").textContent = `${t(KINDS[kind].n)} · ${min} ${t(["minutes", "分"])}`; $("#c-price").textContent = "$" + KINDS[kind].p[min]; $("#bar").style.width = (min / 90 * 100) + "%";
  if (animate && !reduce) { const el = $("#c-price"); el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
}
function nextSat() {
  const now = new Date(), p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", hour12: false }).formatToParts(now).map((x) => [x.type, x.value]));
  const d = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday), h = +p.hour % 24; let add = (6 - d + 7) % 7; const today = add === 0 && h < 20; if (add === 0 && !today) add = 7;
  const date = new Date(now.getTime() + add * 864e5), f = new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-AU", { timeZone: "Australia/Sydney", day: "numeric", month: "long" }).format(date);
  $("#sat").textContent = today ? t(["Open today, Saturday, 10am to 8pm.", "本日（土曜）営業、10:00〜20:00。"]) : t([`Open Saturdays, 10am to 8pm. Next: Saturday ${f}.`, `土曜のみ営業、10:00〜20:00。次回は ${f}（土）。`]);
}
function steps() { $("#steps").innerHTML = STEPS.map((s, i) => `<li class="${i === step ? "on" : i < step ? "done" : ""}"><button type="button" data-i="${i}"><i>${i + 1}</i><span>${t(s)}</span></button></li>`).join(""); const sc = $("#screen"); sc.textContent = step === 0 ? "– – –" : step === 1 ? sc.textContent : step === 2 ? "LEVEL 2 ↑" : "202a"; $$("#keys b").forEach((k) => k.classList.remove("hit")); if (step === 1) press(); }
function press() { clearTimeout(timer); const seq = ["call", "2", "0", "2"], sc = $("#screen"); if (reduce) { sc.textContent = "202"; return; } sc.textContent = ""; seq.forEach((k, i) => { timer = setTimeout(() => { if (step !== 1) return; const el = $(`#keys b[data-k="${k}"]`); $$("#keys b").forEach((x) => x.classList.remove("hit")); el.classList.add("hit"); sc.textContent = k === "call" ? "CALL" : (sc.textContent === "CALL" ? "" : sc.textContent) + k; }, 350 + i * 480); }); }
$("#keys").innerHTML = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "call", "0", "#"].map((k) => `<b data-k="${k}">${k}</b>`).join("");
$(".kinds").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { kind = +b.dataset.i; calc(); } });
$(".mins").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { min = +b.dataset.m; calc(); } });
$("#steps").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { step = +b.dataset.i; steps(); } });
$("#replay").addEventListener("click", () => { step = 0; steps(); play(); });
function play() { if (reduce) return; [1, 2, 3].forEach((s, i) => setTimeout(() => { step = s; steps(); }, 900 + i * 2600)); }
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-en]").forEach((el) => { el.alt = lang === "en" ? el.dataset.altEn : el.dataset.altJa; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  calc(false); nextSat(); steps();
}
$(".lang").addEventListener("click", () => { lang = lang === "en" ? "ja" : "en"; applyLang(); });
applyLang();
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); if (e.target.classList.contains("way")) play(); } }), { rootMargin: "0px 0px -15% 0px" });
  $$(".sec-head, .ask, .calc, .room figure, .r-copy, .way, .info").forEach((el) => { el.classList.add("rv"); io.observe(el); });
}
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
