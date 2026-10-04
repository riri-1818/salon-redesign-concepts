// Sydney Shiatsu Clinic — 動きの部分。動きを減らす設定の人には、何も動かさず全部表示する。
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
let lang = "ja";
const t = (ja, en) => (lang === "ja" ? ja : en);

/* ---------- 施術のデータ（料金は現サイトの料金ページより） ---------- */
const POINTS = {
  shoulder: { where: ["肩・首", "Shoulders and neck"], title: ["指圧", "Shiatsu"],
    body: ["指と手のひらだけで行う、日本独自の手技です。薄い衣服やタオルの上から体の状態を手で探り、そのままツボを押していきます。", "A traditional Japanese technique using only the thumbs and palms, through light clothing or a towel. The therapist finds what is out of balance by touch and treats it in the same movement."],
    prices: [[["60分", "60 min"], 95], [["90分", "90 min"], 130], [["ストレッチ付き 60分", "With stretching, 60 min"], 105]] },
  back: { where: ["背中・全身", "Back and whole body"], title: ["リメディアル・マッサージ", "Remedial massage"],
    body: ["スウェディッシュ、ディープティシュー、筋膜リリース、トリガーポイントなどを症状に合わせて組み合わせるオイルマッサージ。オイルはホホバ、ラベンダー、ローズから選べます。", "Swedish, deep tissue, myofascial release and trigger point techniques, combined to suit your condition. Choose jojoba, lavender or rose oil."],
    prices: [[["ホホバ 60分", "Jojoba, 60 min"], 110], [["ローズ 60分", "Rose, 60 min"], 120], [["リンパ・マッサージ 60分", "Lymphatic massage, 60 min"], 110]] },
  pelvis: { where: ["腰・骨盤・姿勢", "Lower back, pelvis and posture"], title: ["指圧 ＆ 姿勢・骨盤矯正", "Shiatsu & pelvic correction"],
    body: ["体の反射を利用して骨盤を軽く刺激する、ソフトな矯正です。そのあと指圧で全身を整えます。", "A gentle correction that uses the body’s own reflexes, followed by shiatsu. No forceful cracking."],
    prices: [[["60分（矯正15分＋指圧45分）", "60 min (15 correction + 45 shiatsu)"], 105], [["90分（矯正30分＋指圧60分）", "90 min (30 correction + 60 shiatsu)"], 140]] },
  knee: { where: ["けが・関節", "Injuries and joints"], title: ["鍼灸", "Acupuncture"],
    body: ["髪の毛ほどの細い使い捨ての鍼を、筒を使って痛くないように刺します。オーナーの専門は運動器系で、スポーツトレーナーとしての経験が土台です。", "Fine, single-use needles placed with a guide tube so that insertion is comfortable. The owner’s specialty is musculoskeletal conditions, built on years as a sports trainer."],
    prices: [[["30分", "30 min"], 80], [["60分", "60 min"], 110]] },
  foot: { where: ["足・脚の疲れ", "Tired feet and legs"], title: ["指圧 ＆ リフレクソロジー", "Shiatsu & reflexology"],
    body: ["足の裏の特定の部位を押すリフレクソロジーを、指圧と組み合わせます。", "Reflexology on specific points of the soles, combined with shiatsu."],
    prices: [[["60分", "60 min"], 105], [["90分", "90 min"], 150]] },
  face: { where: ["顔・肌", "Face and skin"], title: ["美容鍼 ＆ ガルバニック・スパ", "Cosmetic acupuncture & galvanic spa"],
    body: ["東洋医学の考え方にもとづく顔への鍼に、ガルバニック・スパを組み合わせます。仕上げにトナーとクリームで保湿します。", "Acupuncture for the face from the viewpoint of Eastern medicine, paired with a galvanic spa treatment and finished with toner and moisturiser."],
    prices: [[["50分", "50 min"], 130], [["フェイシャル・マッサージ 45分", "Facial massage, 45 min"], 85]] },
};
const ORDER = ["shoulder", "back", "pelvis", "knee", "foot", "face"];
const PRICES = [
  [["指圧", "Shiatsu"], null, 95, 130],
  [["指圧 ＆ 姿勢・骨盤矯正", "Shiatsu & posture / pelvic correction"], null, 105, 140],
  [["指圧 ＆ リフレクソロジー", "Shiatsu & reflexology"], null, 105, 150],
  [["指圧 ＆ ストレッチ", "Shiatsu & stretching"], null, 105, 140],
  [["リメディアル・マッサージ", "Remedial massage"], ["ホホバ／ラベンダー", "Jojoba or lavender"], 110, 140],
  [["リメディアル・マッサージ", "Remedial massage"], ["ローズ", "Rose"], 120, 150],
  [["リンパ・マッサージ", "Lymphatic massage"], null, 110, 140],
];
const FIXED = [
  [["鍼灸", "Acupuncture"], [[["30分", "30 min"], 80], [["60分", "60 min"], 110]]],
  [["美容鍼 ＆ ガルバニック・スパ", "Cosmetic acupuncture & galvanic spa"], [[["50分", "50 min"], 130]]],
  [["フェイシャル・マッサージ", "Facial massage"], [[["45分", "45 min"], 85], [["60分", "60 min"], 130]]],
  [["日本製の湿布・擦剤", "Japanese pain-relief patches and rub"], [[["各", "each"], 22]]],
];

/* ---------- 言語の切り替え ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-ja]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "ja")));
  buildChips(); showPoint(current, false); buildPrices(); openNow();
}
$(".lang").addEventListener("click", () => { lang = lang === "ja" ? "en" : "ja"; applyLang(); });

/* ---------- 最初の画面：縦書きを一文字ずつ押す ---------- */
$$(".v-line i").forEach((el, i) => el.style.setProperty("--i", i));
requestAnimationFrame(() => document.documentElement.classList.add("ready"));

/* 数字を数え上げる */
function countUp(el, to, ms = 1500, from = 1980) {
  if (reduce) { el.textContent = to; return; }
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(from + (to - from) * e);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
countUp($(".since-n"), 2003, 900, 1990);

/* ---------- 墨の波紋（押すと広がる） ---------- */
const cv = $("#ink"), cx = cv.getContext("2d");
let W = 0, H = 0, DPR = 1, ripples = [], running = false;
function size() { DPR = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0); }
function ripple(x, y, strong = true) {
  if (reduce) return;
  const n = strong ? 3 : 1;
  for (let i = 0; i < n; i++) ripples.push({ x, y, r: 0, max: (strong ? 220 : 120) + i * 90, a: strong ? 0.5 : 0.22, delay: i * 9, red: strong && i === 0 });
  if (!running) { running = true; requestAnimationFrame(draw); }
}
function draw() {
  cx.clearRect(0, 0, W, H);
  ripples = ripples.filter((p) => p.r < p.max);
  for (const p of ripples) {
    if (p.delay > 0) { p.delay--; continue; }
    p.r += (p.max - p.r) * 0.045 + 0.6;
    const k = 1 - p.r / p.max;
    cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    cx.strokeStyle = p.red ? `rgba(200,69,44,${p.a * k})` : `rgba(28,27,26,${p.a * k})`;
    cx.lineWidth = 1 + k * (p.red ? 2.5 : 1.5); cx.stroke();
    if (p.red && p.r < 26) { cx.beginPath(); cx.arc(p.x, p.y, 7 * k, 0, Math.PI * 2); cx.fillStyle = `rgba(200,69,44,${0.7 * k})`; cx.fill(); }
  }
  if (ripples.length) requestAnimationFrame(draw); else { running = false; cx.clearRect(0, 0, W, H); }
}
size(); addEventListener("resize", size);
// 波紋は、体の図のツボを押したときだけ出す（showPoint から呼ぶ）

/* ---------- 引き寄せられるボタン（PCのみ） ---------- */
if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
  $$(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`; });
    el.addEventListener("pointerleave", () => { el.style.transition = "transform .4s cubic-bezier(.2,.7,.2,1)"; el.style.transform = ""; setTimeout(() => (el.style.transition = ""), 400); });
  });
}

/* ---------- 体の図：ツボを押して施術を選ぶ ---------- */
let current = "shoulder";
$$(".fig-line > *").forEach((p) => { if (!p.classList.contains("spine")) p.style.setProperty("--len", Math.ceil(p.getTotalLength()) + 2); });
$$(".tsubo g").forEach((g, i) => { g.style.setProperty("--i", i); g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); });
function buildChips() {
  $(".chips").innerHTML = ORDER.map((k) => `<button type="button" role="tab" data-key="${k}" class="${k === current ? "on" : ""}">${t(...POINTS[k].where)}</button>`).join("");
  $$(".tsubo g").forEach((g) => g.setAttribute("aria-label", t(...POINTS[g.dataset.key].where)));
}
function showPoint(key, animate = true) {
  current = key; const p = POINTS[key], box = $(".answer");
  $$(".tsubo g").forEach((g) => g.classList.toggle("on", g.dataset.key === key));
  $$(".chips button").forEach((b) => b.classList.toggle("on", b.dataset.key === key));
  $(".answer-where").textContent = t(...p.where);
  $(".answer-title").textContent = t(...p.title);
  $(".answer-body").textContent = t(...p.body);
  $(".answer-prices").innerHTML = p.prices.map(([lab, v]) => `<li><span>${t(...lab)}</span><b>$${v}</b></li>`).join("");
  if (animate && !reduce) {
    box.classList.remove("swap"); void box.offsetWidth; box.classList.add("swap");
    const dot = $(`.tsubo g[data-key="${key}"] .dot`), r = dot.getBoundingClientRect();
    ripple(r.left + r.width / 2, r.top + r.height / 2, true);
  }
}
$(".tsubo").addEventListener("click", (e) => { const g = e.target.closest("g[data-key]"); if (g) showPoint(g.dataset.key); });
$(".tsubo").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { const g = e.target.closest("g[data-key]"); if (g) { e.preventDefault(); showPoint(g.dataset.key); } } });
$(".chips").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) showPoint(b.dataset.key); });

/* ---------- 料金：60分／90分で数字が切り替わる ---------- */
let minutes = 60;
const digits = (v) => ("$" + v).split("").map((ch, i) => `<span class="digit" style="--d:${i}">${ch}</span>`).join("");
function buildPrices() {
  $(".price-list").innerHTML = PRICES.map(([name, sub, a, b], i) => `<li style="--i:${i}"><span class="p-name">${t(...name)}${sub ? `<small>${t(...sub)}</small>` : ""}</span><span class="p-price" data-60="${a}" data-90="${b}">${digits(minutes === 60 ? a : b)}</span></li>`).join("");
  $(".price-fixed").innerHTML = FIXED.map(([name, rows]) => `<li><b class="p-name">${t(...name)}</b>${rows.map(([lab, v]) => `<span>${t(...lab)}<b>$${v}</b></span>`).join("")}</li>`).join("");
}
$(".switch").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b || +b.dataset.min === minutes) return;
  minutes = +b.dataset.min;
  $$(".switch button").forEach((x) => x.classList.toggle("on", x === b));
  $(".switch").classList.toggle("r", minutes === 90);
  $$(".price-list .p-price").forEach((el) => { el.innerHTML = digits(el.dataset[minutes]); el.classList.remove("roll"); void el.offsetWidth; el.classList.add("roll"); });
});

/* ---------- 営業中かどうか（シドニー時間） ---------- */
function openNow() {
  const el = $(".open-now");
  try {
    const parts = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const get = (k) => parts.find((p) => p.type === k).value;
    const wd = get("weekday"), h = +get("hour") + +get("minute") / 60;
    const close = ["Sat", "Sun"].includes(wd) ? 17 : 19, open = h >= 10 && h < close;
    el.hidden = false; el.classList.toggle("closed", !open);
    el.textContent = open ? t(`ただいま営業中（${close}時まで）`, `Open now, until ${close > 12 ? close - 12 : close}pm`) : t("ただいま営業時間外です", "Closed right now");
  } catch (e) { el.hidden = true; }
}

/* ---------- スクロールに合わせた動き ---------- */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
$$(".reveal, .price-list").forEach((el) => io.observe(el));
if (reduce) $$(".reveal, .price-list, .figure").forEach((el) => el.classList.add("in"));

/* 八つの施術：自分で横に送る。矢印・ドラッグ・スワイプ・横ホイールのどれでも */
const track = $(".track"), bar = $(".track-bar i"), prev = $(".tn.prev"), next = $(".tn.next");
function trackState() {
  const max = track.scrollWidth - track.clientWidth, p = max > 0 ? track.scrollLeft / max : 0;
  bar.style.width = 12 + p * 88 + "%"; prev.disabled = track.scrollLeft < 4; next.disabled = track.scrollLeft > max - 4;
}
const step = () => ($(".card").getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 20)) * (innerWidth > 1100 ? 2 : 1);
prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: reduce ? "auto" : "smooth" }));
next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: reduce ? "auto" : "smooth" }));
track.addEventListener("scroll", trackState, { passive: true });
let dragX = null, dragS = 0, moved = false;
track.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; dragX = e.clientX; dragS = track.scrollLeft; moved = false; });
addEventListener("pointermove", (e) => { if (dragX === null) return; const d = e.clientX - dragX; if (Math.abs(d) > 4) { moved = true; track.classList.add("drag"); } track.scrollLeft = dragS - d; });
addEventListener("pointerup", () => { dragX = null; track.classList.remove("drag"); });

const liftSec = $(".lift"), car = $(".lift-car"), liftN = $(".lift-n"), shaft = $(".lift-shaft"), doorImg = $(".door-in img");
const fill = $(".meridian-fill"), dots = $$(".meridian b"), secs = dots.map((d) => document.getElementById(d.dataset.for)), navA = $$(".top-nav a");
function onScroll() {
  const y = scrollY, vh = innerHeight;
  $(".top").classList.toggle("scrolled", y > 20);
  // エレベーター
  const lr = liftSec.getBoundingClientRect(), lp = Math.min(1, Math.max(0, (vh * 0.85 - lr.top) / (vh * 0.6)));
  const floor = Math.min(9, 1 + Math.floor(lp * 8.999));
  if (!reduce) car.style.transform = `translateY(${-(shaft.clientHeight - 12 - car.offsetHeight) * lp}px)`;
  liftN.textContent = reduce ? 9 : floor;
  if (!reduce && doorImg) { const dr = doorImg.parentElement.getBoundingClientRect(); doorImg.style.transform = `translateY(${-Math.min(1, Math.max(0, (vh - dr.top) / (vh + dr.height))) * 16}%)`; }
  // 経絡の線と、いまいる節
  const doc = document.documentElement, sp = y / Math.max(1, doc.scrollHeight - vh);
  fill.style.height = sp * 100 + "%";
  let here = 0; secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < vh * 0.5) here = i; });
  dots.forEach((d, i) => d.classList.toggle("lit", i <= here));
  navA.forEach((a) => a.classList.toggle("here", a.getAttribute("href") === "#" + secs[here].id));
}
let ticking = false;
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } }, { passive: true });
addEventListener("resize", () => { trackState(); onScroll(); });

// 体の図は、見えたら線を描く
new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); o.disconnect(); } }), { threshold: 0.3 }).observe($(".figure"));

buildChips(); showPoint(current, false); buildPrices(); openNow();
trackState(); onScroll();
