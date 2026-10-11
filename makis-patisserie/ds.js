// 共通の道具（言語の切り替え・シドニーの時刻・スクロールで現れる動き）。各店のフォルダに ds.js としてコピーして使う。表示する文字はここに書かない。
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q_ = new URLSearchParams(location.search).get("lang");
let lang = q_ === "ja" || q_ === "en" ? q_ : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (p) => p[lang === "en" ? 0 : 1];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const renders = [];
function onRender(fn) { renders.push(fn); }
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-en]").forEach((el) => { el.alt = lang === "en" ? el.dataset.altEn : el.dataset.altJa; });
  $$(".lang").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  renders.forEach((f) => f());
}
document.addEventListener("click", (e) => { const b = e.target.closest(".lang"); if (b && b.dataset.lang !== lang) { lang = b.dataset.lang; applyLang(); } });
function sydney() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { d: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday), m: (+p.hour % 24) * 60 + +p.minute };
}
function start(sel) {
  applyLang();
  if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
    $$(sel).forEach((el) => { el.classList.add("rv"); io.observe(el); });
  }
  requestAnimationFrame(() => document.documentElement.classList.add("ready"));
}
