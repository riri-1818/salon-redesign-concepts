// Culinary Studio Dekura — 包丁の線で割れる最初の画面・お品書きの札・物差し・年表・本棚・相談の下書き。言語の切り替えは ds.js
const G = window.gsap;
if (G) G.registerPlugin(ScrollTrigger, SplitText);
const root = document.documentElement;

onRender(() => {
  document.title = lang === "ja" ? "Culinary Studio Dekura | 出倉秀男の日本料理教室（シドニー・Chatswood）" : "Culinary Studio Dekura | Japanese cooking classes in Chatswood with Hideo Dekura";
  showDetail(current); blade(); hire(); yearSet(yearIdx, true); bookCap(); preview();
  if (G) requestAnimationFrame(() => ScrollTrigger.refresh());
});

// ---------- メニュー（スマホ）・いま読んでいる章 ----------
const nav = $("#nav"), menuBtn = $(".menu-btn");
menuBtn.addEventListener("click", () => { const o = !nav.classList.contains("open"); nav.classList.toggle("open", o); menuBtn.setAttribute("aria-expanded", o); });
nav.addEventListener("click", (e) => { if (e.target.closest("a")) { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    $$("#nav a").forEach((a) => (a.getAttribute("href") === "#" + e.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
  }), { rootMargin: "-40% 0px -55% 0px" });
  ["classes", "menu", "knives", "studio", "hideo", "books", "links", "contact"].forEach((id) => io.observe(document.getElementById(id)));
}

// ---------- 開くとき：包丁の線が走り、上下に割れる ----------
function opening() {
  const op = $(".opening");
  let tl = null;
  const finish = () => { if (!op.isConnected) return; op.remove(); root.classList.remove("op"); ["click", "keydown", "wheel", "touchstart", "scroll"].forEach((t) => removeEventListener(t, skip)); heading(); };
  const skip = () => { if (tl) tl.kill(); finish(); };
  if (!root.classList.contains("op") || !G || reduce || location.hash) { finish(); return; }
  tl = G.timeline({ onComplete: finish });
  tl.from(".op-name, .op-ja", { opacity: 0, y: (i) => (i ? -10 : 10), duration: 0.45, ease: "power2.out" })
    .to(".op-blade", { scaleX: 1, duration: 0.55, ease: "power3.inOut" }, "+=0.1")
    .to(".op-half--t", { yPercent: -100, duration: 0.7, ease: "power3.inOut" }, "+=0.05")
    .to(".op-half--b", { yPercent: 100, duration: 0.7, ease: "power3.inOut" }, "<")
    .to(".op-blade", { opacity: 0, duration: 0.25 }, "<");
  setTimeout(() => ["click", "keydown", "wheel", "touchstart", "scroll"].forEach((t) => addEventListener(t, skip, { passive: true, once: true })), 120);
}
function heading() {
  if (!G || reduce) return;
  const s = new SplitText(".hero__h", { type: "lines", linesClass: "ln" });
  G.from(s.lines, { yPercent: 60, opacity: 0, duration: 0.6, stagger: 0.09, ease: "power3.out", onComplete: () => s.revert() });
  G.from(".marks div", { opacity: 0, y: 12, duration: 0.45, stagger: 0.08, delay: 0.3, ease: "power2.out", clearProps: "all" });
}

// ---------- 写真：現れる・魚の皮がゆっくり動く・早めに読む ----------
function photos() {
  const lazy = $$('img[loading="lazy"]');
  if ("IntersectionObserver" in window) {
    const lio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.loading = "eager"; lio.unobserve(e.target); } }), { rootMargin: "1500px 0px" });
    lazy.filter((i) => !i.closest(".shelf")).forEach((i) => lio.observe(i));
    // 本棚は横に並ぶので、本棚ごと近づいたらまとめて読む
    const sio = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { $$(".shelf img").forEach((i) => { i.loading = "eager"; }); sio.disconnect(); } }, { rootMargin: "1500px 0px" });
    sio.observe($(".shelf"));
  } else lazy.forEach((i) => { i.loading = "eager"; });
  if (!("IntersectionObserver" in window) || reduce) { $$(".reveal").forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
  $$(".reveal").forEach((e) => io.observe(e));
  if (G) G.to(".hero__ph img", { yPercent: 5, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
}

// ---------- お品書きの札 ----------
let current = 0;
function showDetail(i) {
  current = i;
  $$(".tag__in[data-i]").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.i === i));
  $$(".detail").forEach((d) => { d.hidden = +d.dataset.i !== i; });
}
$$(".tag__in[data-i]").forEach((b) => b.addEventListener("click", () => {
  const i = +b.dataset.i; if (i === current) return;
  showDetail(i);
  if (G && !reduce) {
    G.fromTo(b, { rotationY: -90 }, { rotationY: 0, duration: 0.45, ease: "power2.out", clearProps: "transform" });
    G.from($(`.detail[data-i="${i}"]`), { opacity: 0, y: 10, duration: 0.35, ease: "power2.out", clearProps: "all" });
  }
}));

// ---------- 包丁研ぎ：物差しで刃の長さ → 料金（いまのサイトの表） ----------
const range = $("#blade");
const TIERS = [
  { max: 20, price: "$25", note: ["Up to 20cm", "20cm まで"] },
  { max: 30, price: "$35~", note: ["Over 20cm", "20cm を超える長さ"] },
  { max: 40, price: "$50~", note: ["Over 30cm", "30cm を超える長さ"] },
  { max: 99, price: null, note: ["Knives over 40cm: cost on request", "40cm を超える包丁は、お見積もりです"] },
];
let tierNow = -1;
function blade() {
  const cm = +range.value, ti = TIERS.findIndex((x) => cm <= x.max);
  $("#blade-out").textContent = cm;
  $("#blade-bar").style.width = ((cm - 10) / 40 * 100) + "%";
  const price = TIERS[ti].price || (lang === "en" ? "Ask" : "お見積もり");
  $("#q-price").textContent = price;
  $("#q-tier").textContent = t(TIERS[ti].note);
  $$(".tiers li").forEach((li) => li.classList.toggle("on", +li.dataset.t === ti));
  if (ti !== tierNow && tierNow !== -1 && G && !reduce) G.fromTo("#q-price", { y: 10, opacity: 0.2 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out", clearProps: "all" });
  tierNow = ti; preview();
}
range.addEventListener("input", blade);

// ---------- スタジオの貸し出し：時間 → 目安 ----------
let hours = 2;
function hire() {
  $("#hrs").textContent = hours;
  const ex = 70 * hours, inc = Math.round(ex * 1.1);
  $("#hire-sum").textContent = lang === "en"
    ? `${hours} hour${hours > 1 ? "s" : ""}: from $${ex} plus GST (about $${inc} including GST)`
    : `${hours}時間：$${ex}＋GST から（GST込みで約 $${inc}）`;
  preview();
}
$$(".step-btn").forEach((b) => b.addEventListener("click", () => { hours = Math.max(1, Math.min(12, hours + +b.dataset.h)); hire(); }));

// ---------- 年表：読んでいる段の年が、左に大きく出る ----------
const eras = $$(".era");
let yearIdx = 0;
function yearSet(i, quiet) {
  yearIdx = i;
  const e = eras[i], y = $("#year"), txt = lang === "en" ? e.dataset.yearEn : e.dataset.year;
  eras.forEach((x, k) => x.classList.toggle("on", k === i));
  $(".life__year").classList.toggle("ja", /[^\x00-\x7F]/.test(txt) && !/^\d/.test(txt));
  if (y.innerHTML === txt) return;
  if (quiet || !G || reduce) { y.innerHTML = txt; return; }
  G.to(y, { yPercent: -100, opacity: 0, duration: 0.2, ease: "power2.in", onComplete: () => { y.innerHTML = txt; G.fromTo(y, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3, ease: "power2.out" }); } });
}
function timeline() {
  if (!G) { yearSet(0, true); return; }
  eras.forEach((e, i) => ScrollTrigger.create({ trigger: e, start: "top 55%", end: "bottom 55%", onToggle: (st) => { if (st.isActive) yearSet(i); } }));
}

// ---------- 本棚：触れると1冊が引き出される ----------
const books = $$(".book");
let openBook = 0;
function bookOpen(i) {
  openBook = i;
  books.forEach((b, k) => b.classList.toggle("open", k === i));
  bookCap();
}
function bookCap() {
  const img = $("img", books[openBook]), alt = img.alt.split(", by ");
  $("#ob-t").textContent = alt[0].replace(/, a cooking video.*$/, "");
  $("#ob-s").textContent = alt[1] ? (lang === "en" ? "by " + alt[1] : alt[1].replace(/ and /g, "・") + " 著") : (lang === "en" ? "A cooking video with Hideo Dekura" : "出倉秀男の料理の映像");
}
books.forEach((b, i) => {
  const btn = $(".book__b", b);
  btn.addEventListener("mouseenter", () => bookOpen(i));
  btn.addEventListener("focus", () => bookOpen(i));
  btn.addEventListener("click", () => bookOpen(i));
});

// ---------- 相談の下書き ----------
const TOPIC = {
  group: ["Group Cooking Class", "グループの料理教室"], private: ["Private Cooking Class", "個人の料理教室"], special: ["Special Class", "特別教室"],
  school: ["School incursion / excursion", "学校の出張授業・校外学習"], consult: ["Consulting and events", "コンサルティング・イベント"],
  pro: ["Professional / apprentice training", "プロ・見習いの指導"], knife: ["Japanese knife sharpening", "包丁研ぎ"], hire: ["Hiring the studio", "スタジオの貸し出し"],
};
const val = (id) => $(id).value.trim();
const topic = () => ($('input[name="topic"]:checked') || {}).value || "group";
function draft() {
  const k = topic(), en = lang === "en", tp = t(TOPIC[k]), L = [];
  const subject = en ? `Enquiry: ${tp}` : `【お問い合わせ】${tp}`;
  L.push(en ? "Dear Hideo," : "出倉先生", "", en ? `I would like to ask about: ${tp}.` : `${tp}について、お問い合わせします。`);
  if (k === "knife") L.push(en ? `Blade length: about ${range.value}cm (${$("#q-price").textContent})` : `刃の長さ：約${range.value}cm（${$("#q-price").textContent}）`);
  if (k === "hire") L.push(en ? `Hours: ${hours} (from $${70 * hours} plus GST)` : `時間：${hours}時間（$${70 * hours}＋GST から）`);
  if (val("#f-date")) L.push((en ? "Preferred date: " : "希望日：") + val("#f-date"));
  if (val("#f-n")) L.push((en ? "Number of people: " : "人数：") + val("#f-n") + (en ? "" : "名"));
  if (val("#f-msg")) L.push("", val("#f-msg"));
  L.push("", val("#f-name") || (en ? "(your name)" : "（お名前）"), val("#f-mail") || (en ? "(your email)" : "（メールアドレス）"));
  return { subject, body: L.join("\n") };
}
function preview() { const d = draft(); $("#preview").textContent = (lang === "en" ? "Subject: " : "件名：") + d.subject + "\n\n" + d.body; }
$("#form").addEventListener("input", preview);
$("#form").addEventListener("change", preview);
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-pick]"); if (!a) return;
  const r = $(`input[name="topic"][value="${a.dataset.pick}"]`); if (r) r.checked = true;
  preview();
  if (a.tagName === "BUTTON") $("#contact").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
});
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const ok = val("#f-name") && /^\S+@\S+\.\S+$/.test(val("#f-mail"));
  $("#f-err").hidden = !!ok;
  if (!ok) { (val("#f-name") ? $("#f-mail") : $("#f-name")).focus(); return; }
  const d = draft();
  location.href = `mailto:dekura@bigpond.com?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.body)}`;
});

// ---------- はじめる ----------
applyLang();
photos();
timeline();
bookOpen(0);
opening();
