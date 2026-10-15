// Kimono Australia — 反物の表紙・帯締めの道すじ・衣桁・相談の下書き。言語の切り替えとシドニーの時刻は ds.js
const G = window.gsap;
if (G) G.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
const root = document.documentElement;
const ST = () => window.ScrollTrigger;

// ---------- 言語を変えたとき ----------
onRender(() => {
  $$("optgroup").forEach((o) => { o.label = lang === "en" ? o.dataset.lblEn : o.dataset.lblJa; });
  document.title = lang === "ja" ? "Kimono Australia | シドニーの JTTI 認定着付け教室" : "Kimono Australia | JTTI-certified kimono dressing school in Sydney";
  $$(".vid-toggle").forEach((b) => vtLabel(b));
  preview();
  if (G) requestAnimationFrame(() => { cordBuild(); ST().refresh(); rackMeasure(); });
});

// ---------- ヘッダー：下へ送ると隠れ、上へ戻すと出る ----------
const top_ = $(".top"), nav = $("#nav"), menuBtn = $(".menu-btn");
let lastY = scrollY;
addEventListener("scroll", () => {
  const y = scrollY;
  if (!nav.classList.contains("open")) {
    if (y > 240 && y > lastY + 6) top_.classList.add("is-hidden");
    else if (y < lastY - 6 || y < 240) top_.classList.remove("is-hidden");
  }
  lastY = y;
}, { passive: true });
menuBtn.addEventListener("click", () => {
  const open = !nav.classList.contains("open");
  nav.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", (e) => { if (e.target.closest("a")) { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });

// いま読んでいる章に印をつける
const chapters = ["story", "courses", "graduation", "services", "events"].map((id) => document.getElementById(id));
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    $$("#nav a").forEach((a) => (a.getAttribute("href") === "#" + e.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
  }), { rootMargin: "-45% 0px -50% 0px" });
  chapters.forEach((s) => io.observe(s));
}

// ---------- 映像：止める・再生する ----------
function vtLabel(b) {
  const paused = b.getAttribute("aria-pressed") === "true", s = b.lastElementChild;
  s.dataset.en = paused ? "Play film" : "Pause film"; s.dataset.ja = paused ? "映像を流す" : "映像を止める";
  s.innerHTML = s.dataset[lang];
}
function setPaused(v, b, paused) {
  b.setAttribute("aria-pressed", paused); vtLabel(b);
  if (paused) v.pause(); else { const p = v.play(); if (p) p.catch(() => {}); }
}
$$(".vid-toggle").forEach((b) => {
  const v = $(b.dataset.for);
  b.addEventListener("click", () => { b.dataset.user = "1"; setPaused(v, b, !v.paused ? true : false); });
});
const coverV = $(".cover__video"), coverB = $('.vid-toggle[data-for=".cover__video"]');
const evV = $(".events__video"), evB = $('.vid-toggle[data-for=".events__video"]');
if (reduce) { setPaused(coverV, coverB, true); setPaused(evV, evB, true); coverV.removeAttribute("autoplay"); }
else if ("IntersectionObserver" in window) {
  // イベントの映像は、画面に入ったときだけ読み込んで流す
  new IntersectionObserver((es) => es.forEach((e) => {
    if (evB.dataset.user) return;
    if (e.isIntersecting) { evV.preload = "auto"; setPaused(evV, evB, false); } else if (!evV.paused) { evV.pause(); }
  }), { threshold: 0.2 }).observe($(".events"));
  new IntersectionObserver((es) => es.forEach((e) => {
    if (coverB.dataset.user) return;
    if (e.isIntersecting) { const p = coverV.play(); if (p) p.catch(() => {}); } else coverV.pause();
  }), { threshold: 0.05 }).observe($(".cover"));
}

// ---------- 開くとき：反物が転がって、表紙が現れる ----------
function opening() {
  const op = $(".opening");
  const finish = () => { if (!op.isConnected) return; op.remove(); root.classList.remove("op"); ["click", "keydown", "wheel", "touchstart", "scroll"].forEach((t) => removeEventListener(t, skip)); masthead(); };
  const skip = () => { if (tl) tl.kill(); finish(); };
  let tl = null;
  if (!root.classList.contains("op") || !G || reduce || location.hash) { finish(); return; }
  const p = coverV.play(); if (p) p.catch(() => {});
  const roll = $(".op-roll"), washi = $(".op-washi"), rw = roll.offsetWidth;
  G.set(roll, { xPercent: 0, x: -rw });
  tl = G.timeline({ onComplete: finish });
  tl.from(".op-crest", { opacity: 0, scale: 0.92, duration: 0.5, ease: "power2.out" })
    .from(".op-word", { opacity: 0, x: -12, duration: 0.5, ease: "power2.out" }, "<0.15")
    .to(roll, { x: innerWidth + rw, duration: 1.35, ease: "power2.inOut",
      onUpdate: () => { const x = G.getProperty(roll, "x"); washi.style.clipPath = `inset(0 0 0 ${Math.max(0, x + rw * 0.5)}px)`; } }, "+=0.2");
  setTimeout(() => ["click", "keydown", "wheel", "touchstart", "scroll"].forEach((t) => addEventListener(t, skip, { passive: true, once: true })), 120);
}
function masthead() {
  if (!G || reduce) return;
  const s = new SplitText(".mh-line", { type: "chars" });
  G.from(s.chars, { yPercent: 70, opacity: 0, duration: 0.7, stagger: 0.035, ease: "power3.out", onComplete: () => s.revert() });
  G.from(".coverlines li", { opacity: 0, x: 18, duration: 0.5, stagger: 0.08, delay: 0.35, ease: "power2.out", clearProps: "all" });
}

// ---------- 布を引くように現れる写真・見出しの線・数字 ----------
function reveals() {
  if (!("IntersectionObserver" in window) || reduce) { $$(".reveal, .chap").forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
  $$(".reveal, .chap").forEach((e) => io.observe(e));
  const nio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; nio.unobserve(e.target);
    const b = e.target, n = +b.dataset.count, o = { v: 0 };
    if (!G || n < 3) return;
    G.to(o, { v: n, duration: 1.2, ease: "power2.out", onUpdate: () => { b.textContent = Math.round(o.v); } });
  }), { threshold: 0.6 });
  $$("[data-count]").forEach((b) => nio.observe(b));
}

// ---------- 切り替わりの場面：大きな言葉が、スクロールした分だけ横に動く ----------
function band() {
  if (!G || reduce) return;
  G.fromTo(".band__line", { xPercent: 4 }, { xPercent: -38, ease: "none", scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: 0.6 } });
  G.fromTo(".band__img", { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: true } });
}

// ---------- 帯締めの道すじ：スクロールした分だけ紐が伸び、結び目が締まる ----------
const path = $(".path"), svg = $(".cord"), base = $(".cord__base"), line = $(".cord__line"), steps = $$(".step");
let cordLen = 0, stops = [], cordST = null;
function cordBuild() {
  const pr = path.getBoundingClientRect(), sr = svg.getBoundingClientRect();
  const pts = steps.map((s) => { const k = $(".knot", s).getBoundingClientRect(); return [k.left + k.width / 2 - sr.left, k.top + k.height / 2 - sr.top]; });
  const end = [pts[0][0], pr.height];
  let d = `M ${pts[0][0]} 0 L ${pts[0][0]} ${pts[0][1]}`;
  pts.slice(1).concat([end]).forEach((p, i) => {
    const a = i ? pts[i] : pts[0], dy = p[1] - a[1], sway = i % 2 ? -16 : 16;
    d += ` C ${a[0] + sway} ${a[1] + dy * 0.35}, ${p[0] - sway} ${a[1] + dy * 0.65}, ${p[0]} ${p[1]}`;
  });
  svg.setAttribute("viewBox", `0 0 ${sr.width} ${pr.height}`); svg.style.height = pr.height + "px";
  base.setAttribute("d", d); line.setAttribute("d", d);
  cordLen = line.getTotalLength();
  stops = pts.map((p) => p[1] / pr.height);
  line.style.strokeDasharray = cordLen;
  cordSet(cordST ? cordST.progress : 0);
}
function cordSet(pr) {
  line.style.strokeDashoffset = cordLen * (1 - pr);
  steps.forEach((s, i) => s.classList.toggle("on", pr >= stops[i] - 0.002));
}
function cord() {
  if (!G || reduce) { steps.forEach((s) => s.classList.add("on")); svg.style.display = "none"; return; }
  cordBuild();
  cordST = ST().create({ trigger: path, start: "top 62%", end: "bottom 62%", onUpdate: (st) => cordSet(st.progress), onRefresh: () => cordBuild() });
  addEventListener("resize", () => cordBuild());
}

// どこから始める？：選ぶと、その段へ進んで結び目が光る
$$(".opt").forEach((b) => b.addEventListener("click", () => {
  $$(".opt").forEach((x) => x.setAttribute("aria-pressed", x === b));
  const s = $("#step-" + b.dataset.go);
  steps.forEach((x) => x.classList.toggle("pick", x === s));
  const pick = { 1: "intro", 2: "sen", 3: "kenkyu", 4: "shihan", 5: "koutou" }[b.dataset.go];
  $("#f-what").value = pick; preview();
  s.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}));

// ---------- 衣桁：つかんで送ると、着物のように揺れて止まる ----------
const rack = $("#rack"), track = $("#rack-track"), garments = $$(".garment"), arrows = $$(".rack-btn");
let drag = null, snaps = [], minX = 0;
function rackMeasure() {
  minX = Math.min(0, rack.clientWidth - track.scrollWidth);
  const pad = garments[0].offsetLeft;
  snaps = garments.map((g) => Math.max(minX, -(g.offsetLeft - pad))).filter((v, i, a) => a.indexOf(v) === i);
  if (drag) { drag.applyBounds({ minX, maxX: 0 }); }
  arrowState();
}
const curX = () => (G ? G.getProperty(track, "x") : -rack.scrollLeft);
function arrowState() {
  const x = curX();
  arrows[0].disabled = x >= -2; arrows[1].disabled = x <= minX + 2;
}
function swing(v) {
  if (!G || reduce) return;
  const r = Math.max(-7, Math.min(7, -v / 260));
  G.to(garments, { rotation: r, duration: 0.25, overwrite: "auto", stagger: 0.012 });
}
function settle() { if (G && !reduce) G.to(garments, { rotation: 0, duration: 1.6, ease: "elastic.out(1, 0.28)", stagger: 0.02, overwrite: "auto" }); }
function rackGo(x) {
  x = Math.max(minX, Math.min(0, x));
  if (!G) { rack.scrollTo({ left: -x, behavior: "smooth" }); return; }
  const dx = x - curX();
  swing(dx * 1.8);
  G.to(track, { x, duration: reduce ? 0 : 0.8, ease: "power3.out", onUpdate: arrowState, onComplete: () => { settle(); if (drag) drag.update(); } });
}
function rack_() {
  if (!G) { rack.style.overflowX = "auto"; rack.addEventListener("scroll", arrowState, { passive: true }); }
  rackMeasure();
  // 横に並ぶ写真は画面の外にあると読み込まれないので、章が近づいたらまとめて読む
  const loadAll = () => $$("img", track).forEach((i) => { i.loading = "eager"; });
  if ("IntersectionObserver" in window) { const lio = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { loadAll(); lio.disconnect(); } }, { rootMargin: "1600px 0px" }); lio.observe(rack); } else loadAll();
  $$("img", track).forEach((i) => i.addEventListener("load", rackMeasure));
  if (G) {
    drag = Draggable.create(track, {
      type: "x", bounds: { minX, maxX: 0 }, inertia: true, edgeResistance: 0.85, dragClickables: true, minimumMovement: 6, zIndexBoost: false,
      snap: (v) => snaps.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a), snaps[0]),
      onPress() { rack.classList.add("is-drag"); },
      onRelease() { rack.classList.remove("is-drag"); },
      onDrag() { swing(InertiaPlugin.getVelocity(track, "x")); arrowState(); },
      onThrowUpdate() { swing(InertiaPlugin.getVelocity(track, "x")); arrowState(); },
      onDragEnd() { settle(); }, onThrowComplete() { settle(); arrowState(); },
    })[0];
  }
  arrows.forEach((b) => b.addEventListener("click", () => {
    const x = curX(), dir = +b.dataset.dir;
    const next = dir > 0 ? snaps.find((s) => s < x - 4) : [...snaps].reverse().find((s) => s > x + 4);
    rackGo(next === undefined ? (dir > 0 ? minX : 0) : next);
  }));
  // キーボードで送ったとき、見えるところまで動かす
  track.addEventListener("focusin", (e) => {
    const g = e.target.closest(".garment"); if (!g) return;
    const x = curX(), l = g.offsetLeft + x, r = l + g.offsetWidth;
    if (l < 0 || r > rack.clientWidth) rackGo(-(g.offsetLeft - garments[0].offsetLeft));
  });
  addEventListener("resize", rackMeasure);
}

// ---------- 修了式の映像：押したときだけ読み込む ----------
$(".film__play").addEventListener("click", (e) => {
  const v = $(".film__video");
  v.src = v.dataset.src; v.hidden = false; e.currentTarget.hidden = true;
  const p = v.play(); if (p) p.catch(() => {});
  v.focus();
});

// ---------- 相談の下書き ----------
const TOPIC = {
  intro: ["Introductory Course (初等科)", "初等科（Introductory Course）"], sen: ["Intermediate Course – Sen-ka (専科)", "専科（Intermediate Course）"],
  kenkyu: ["Instructor Course – Kenkyu-ka (研究科)", "研究科（Instructor Course）"], shihan: ["Master Course – Shihan-ka (師範科)", "師範科（Master Course）"],
  koutou: ["Grand Master Course – Koutou Shihan-ka (高等師範科)", "高等師範科（Grand Master Course）"], rental: ["Kimono rental, styling & dressing", "着物のレンタル・スタイリング・着付け"],
  photo: ["Photography", "写真撮影"], family: ["Family Photography", "家族写真"], present: ["Kimono Presentation", "着物の実演・紹介"], other: ["Something else", "そのほか"],
};
const COURSE = ["intro", "sen", "kenkyu", "shihan", "koutou"];
let people = 1;
const val = (id) => $(id).value.trim();
function fmtDate(s) {
  if (!s) return "";
  const d = new Date(s + "T00:00:00");
  return lang === "en" ? d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
}
function draft() {
  const k = val("#f-what"), tp = t(TOPIC[k]), course = COURSE.includes(k), en = lang === "en";
  const subject = en ? (k === "intro" ? "I am interested in enrolling into Introductory Course." : `Enquiry: ${tp}`) : `【お問い合わせ】${tp}`;
  const L = [];
  if (en) {
    L.push("Hi Kyoko,", "", course ? `I am interested in the ${tp}.` : `I would like to ask about ${tp}.`);
    if (val("#f-date")) L.push(`Preferred date: ${fmtDate(val("#f-date"))}`);
    L.push(`Number of people: ${people}`);
    if (val("#f-msg")) L.push("", val("#f-msg"));
    L.push("", val("#f-name") || "(your name)", val("#f-mail") || "(your email)"); if (val("#f-tel")) L.push(val("#f-tel"));
  } else {
    L.push("恭子さん", "", course ? `${tp}の受講について、お問い合わせします。` : `${tp}について、ご相談したいです。`);
    if (val("#f-date")) L.push(`希望日：${fmtDate(val("#f-date"))}`);
    L.push(`人数：${people}名`);
    if (val("#f-msg")) L.push("", val("#f-msg"));
    L.push("", val("#f-name") || "（お名前）", val("#f-mail") || "（メールアドレス）"); if (val("#f-tel")) L.push(val("#f-tel"));
  }
  return { subject, body: L.join("\n") };
}
function preview() {
  const d = draft();
  $("#f-preview").textContent = (lang === "en" ? "Subject: " : "件名：") + d.subject + "\n\n" + d.body;
}
$$(".cnt").forEach((b) => b.addEventListener("click", () => { people = Math.max(1, Math.min(20, people + +b.dataset.d)); $("#f-n").textContent = people; preview(); }));
$("#eq-form").addEventListener("input", preview);
$("#eq-form").addEventListener("change", preview);
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-pick]"); if (!a) return;
  $("#f-what").value = a.dataset.pick; preview();
});
$("#eq-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const ok = val("#f-name") && /^\S+@\S+\.\S+$/.test(val("#f-mail"));
  $("#f-err").hidden = !!ok;
  if (!ok) { (val("#f-name") ? $("#f-mail") : $("#f-name")).focus(); return; }
  const d = draft();
  location.href = `mailto:kimonoenquiry@gmail.com?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.body)}`;
});

// ---------- 写真：画面の手前1500pxで読み始める（スクロールしたときに待たせない） ----------
function early() {
  const imgs = $$('img[loading="lazy"]').filter((i) => !i.closest(".rack"));
  if (!("IntersectionObserver" in window)) { imgs.forEach((i) => { i.loading = "eager"; }); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.loading = "eager"; io.unobserve(e.target); } }), { rootMargin: "1500px 0px" });
  imgs.forEach((i) => io.observe(i));
}

// ---------- はじめる ----------
applyLang();
early();
reveals();
band();
cord();
rack_();
opening();
root.classList.add("ready");
