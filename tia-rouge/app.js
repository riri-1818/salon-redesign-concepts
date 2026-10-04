// Tia Rouge — 動きの部分。「動きを減らす」設定の人には、動かさずに全部表示する。
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (pair) => pair[lang === "ja" ? 1 : 0];
const NS = "http://www.w3.org/2000/svg";

/* ---------- データ（料金は現サイトのメニューより） ---------- */
const COLOURS = [["Rouge", "ルージュ", "#9b1414"], ["Nude", "ヌード", "#d8a898"], ["Noir", "ノワール", "#1b1819"], ["Gold", "ゴールド", "#b8923a"], ["Milk", "ミルク", "#f2ede7"], ["Plum", "プラム", "#5c1f3b"]];
const DESIGNS = [
  { name: ["One colour", "ワンカラー"], price: 90, note: ["Hand or foot, with manicure.", "ハンドまたはフット。マニキュア込み。"], n: 1 },
  { name: ["French", "フレンチ"], price: 90, note: ["Hand or foot, with manicure.", "ハンドまたはフット。マニキュア込み。"], n: 1, french: true },
  { name: ["Two colours", "2色デザイン"], price: 110, note: ["Two-colour design.", "2色を使ったデザイン。"], n: 2 },
  { name: ["Three colours", "3色デザイン"], price: 120, note: ["Three-colour design.", "3色を使ったデザイン。"], n: 3 },
  { name: ["Multi-colour or luxury", "マルチカラー／ラグジュアリー"], price: 150, from: true, note: ["Multi-colour or luxury design.", "マルチカラー、ラグジュアリーデザイン。"], n: 5, gem: true },
];
const LASH = [
  { label: ["Lash lift", "まつ毛パーマ"], name: ["Eyelash lift", "まつ毛パーマ（ラッシュリフト）"], price: 85, note: ["Optional keratin treatment, add $15.", "ケラチントリートメントは +$15。"], n: 24, len: 34, curl: 1 },
  { label: ["80", "80本"], name: ["Lash extensions, 80 lashes", "まつ毛エクステ 80本"], price: 120, n: 20, len: 44, curl: 0.45 },
  { label: ["100", "100本"], name: ["Lash extensions, 100 lashes", "まつ毛エクステ 100本"], price: 130, n: 25, len: 46, curl: 0.45 },
  { label: ["120", "120本"], name: ["Lash extensions, 120 lashes", "まつ毛エクステ 120本"], price: 140, n: 30, len: 48, curl: 0.45 },
  { label: ["140", "140本"], name: ["Lash extensions, 140 lashes", "まつ毛エクステ 140本"], price: 150, n: 35, len: 50, curl: 0.45 },
  { label: ["160+", "160本〜"], name: ["Lash extensions, 160 lashes or more", "まつ毛エクステ 160本以上"], price: 160, from: true, n: 42, len: 52, curl: 0.45 },
];
let colour = 0, design = 0, lash = 3;

/* ---------- 言語 ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-en]").forEach((el) => { el.alt = lang === "ja" ? el.dataset.altJa : el.dataset.altEn; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  document.title = lang === "ja" ? "Tia Rouge｜シドニー King Street のネイル＆まつ毛サロン" : "Tia Rouge | Japanese nails & eyelash extensions, King Street Sydney";
  buildControls(); showNail(); showLash(false); openNow();
}
$(".lang").addEventListener("click", () => { lang = lang === "ja" ? "en" : "ja"; applyLang(); });

/* ---------- 爪：色とデザインを選ぶと、塗られていく ---------- */
const FINGERS = [[62, 196, 58], [160, 120, 64], [260, 84, 66], [360, 124, 64], [458, 214, 58]]; // 中心x, 指先のy, 幅
const hand = $(".hand");
hand.innerHTML = FINGERS.map(([x, y, w], i) => {
  const nw = w * 0.7, nh = nw * 1.62, ny = y + 16, l = x - nw / 2, r = x + nw / 2;
  const nail = `M${l} ${ny + nh} L${l} ${ny + nh * 0.42} C${l} ${ny + nh * 0.1} ${x - nw * 0.2} ${ny} ${x} ${ny} C${x + nw * 0.2} ${ny} ${r} ${ny + nh * 0.1} ${r} ${ny + nh * 0.42} L${r} ${ny + nh} Q${x} ${ny + nh + 9} ${l} ${ny + nh} Z`;
  return `<g class="finger" data-i="${i}">
    <path class="skin" d="M${x - w / 2} 400 L${x - w / 2} ${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${y + w / 2} L${x + w / 2} 400"/>
    <clipPath id="nc${i}"><path d="${nail}"/></clipPath>
    <path class="bare" d="${nail}"/>
    <g clip-path="url(#nc${i})"><rect class="paint" x="${l - 2}" y="${ny - 2}" width="${nw + 4}" height="${nh + 14}"/><rect class="gloss" x="${l + nw * 0.16}" y="${ny + nh * 0.12}" width="${nw * 0.16}" height="${nh * 0.62}" rx="${nw * 0.08}"/></g>
    <circle class="gem" cx="${x}" cy="${ny + nh * 0.78}" r="3.4"/>
  </g>`;
}).join("");
const paints = $$(".paint", hand);
let painted = false;
function paintNails(animate = true) {
  const d = DESIGNS[design];
  paints.forEach((p, i) => {
    const c = COLOURS[(colour + (d.n > 1 ? i % d.n : 0)) % COLOURS.length][2];
    const to = d.french ? "scaleY(.3)" : "scaleY(1)";            // フレンチは爪先だけ、ほかは根元から先へ塗る
    p.style.transition = "none"; p.style.transformOrigin = d.french ? "50% 0" : "50% 100%";
    if (reduce || !animate) { p.style.fill = c; p.style.transform = to; return; }
    p.style.transform = "scaleY(0)"; p.style.fill = c; void p.getBoundingClientRect();
    p.style.transition = `transform .55s cubic-bezier(.3,.7,.2,1) ${i * 0.07}s`; p.style.transform = to;
  });
  hand.classList.toggle("gems", !!d.gem); hand.classList.toggle("french", !!d.french);
  painted = true;
}
function showNail() {
  const d = DESIGNS[design];
  $(".nails .t-name").textContent = t(d.name) + " · " + t(COLOURS[colour]);
  $(".nails .t-from").textContent = d.from && lang === "en" ? "from" : "";
  $(".nails .t-price b").textContent = "$" + d.price + (d.from && lang === "ja" ? "〜" : "");
  $(".nails .t-note").textContent = t(d.note);
  $$(".swatches button").forEach((b, i) => b.setAttribute("aria-pressed", i === colour));
  $$(".designs button").forEach((b, i) => b.setAttribute("aria-selected", i === design));
}
function buildControls() {
  $(".swatches").innerHTML = COLOURS.map((c, i) => `<button type="button" data-i="${i}" style="--c:${c[2]}" aria-pressed="${i === colour}"><i></i><span>${t(c)}</span></button>`).join("");
  $(".designs").innerHTML = DESIGNS.map((d, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === design}"><span>${t(d.name)}</span><b>${d.from && lang === "en" ? "from " : ""}$${d.price}${d.from && lang === "ja" ? "〜" : ""}</b></button>`).join("");
  $(".counts").innerHTML = LASH.map((l, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === lash}">${t(l.label)}</button>`).join("");
}
$(".swatches").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; colour = +b.dataset.i; showNail(); paintNails(); $(".tap-hint").classList.add("gone"); });
$(".designs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; design = +b.dataset.i; showNail(); paintNails(); });

/* ---------- まつ毛：本数に合わせて描き直す ---------- */
const lashset = $("#lashset");
function lid(u) { const x = 48 + (472 - 48) * u, a = 1 - u; return [a * a * 48 + 2 * a * u * 260 + u * u * 472, a * a * 150 + 2 * a * u * 262 + u * u * 150, x]; }
function showLash(animate = true) {
  const L = LASH[lash];
  let d = "";
  for (let i = 0; i < L.n; i++) {
    const u = 0.04 + (0.92 * i) / (L.n - 1), [x, y] = lid(u);
    const out = (u - 0.5) * 1.5, len = L.len * (0.72 + 0.28 * Math.sin(u * Math.PI)) * (0.9 + ((i * 7) % 5) * 0.045);
    const ex = x + out * len * 0.75, ey = y + len;                           // 閉じた目なので、下へ伸びる
    const cx = x + out * len * 0.1 - L.curl * 6 * Math.sign(out || 1), cy = y + len * (0.55 + L.curl * 0.25);
    d += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${(ex + L.curl * out * 16).toFixed(1)} ${(ey - L.curl * 12).toFixed(1)}" pathLength="1" style="--d:${(i * 0.012).toFixed(3)}s"/>`;
  }
  lashset.innerHTML = d;
  lashset.classList.remove("grow"); if (animate && !reduce) { void lashset.getBoundingClientRect(); lashset.classList.add("grow"); }
  $("#l-name").textContent = t(L.name); $("#l-from").textContent = L.from && lang === "en" ? "from" : "";
  $("#l-price").textContent = "$" + L.price + (L.from && lang === "ja" ? "〜" : ""); $("#l-note").textContent = L.note ? t(L.note) : "";
  $$(".counts button").forEach((b, i) => b.setAttribute("aria-selected", i === lash));
}
$(".counts").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; lash = +b.dataset.i; showLash(); });

/* ---------- いま営業中か（シドニーの時刻） ---------- */
function openNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const h = (+p.hour % 24) + +p.minute / 60, wk = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(p.weekday), sat = p.weekday === "Sat";
  const open = (wk && h >= 11 && h < 20) || (sat && h >= 12 && h < 19);
  $(".status").innerHTML = `<i class="${open ? "on" : ""}"></i>` + (open ? (lang === "ja" ? "ただいま営業中" : "Open now") : (lang === "ja" ? "ただいま営業時間外" : "Closed right now"));
}

/* ---------- 画面に入ったら現れる。爪は、見えたときに最初の一塗り ---------- */
if (reduce || !("IntersectionObserver" in window)) { document.documentElement.classList.add("no-motion"); }
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; e.target.classList.add("in"); io.unobserve(e.target);
    if (e.target === hand) paintNails(); if (e.target.classList.contains("eye")) showLash(); }), { rootMargin: "0px 0px -12% 0px" });
  $$(".head, .hand, .panel, .rest > div, .eye, .lash-panel, .five li, .courses > div, .visit-photo, .facts > div").forEach((el) => { el.classList.add("rv"); io.observe(el); });
}
addEventListener("scroll", () => $(".top").classList.toggle("stuck", scrollY > 40), { passive: true });

applyLang();
if (reduce || !("IntersectionObserver" in window)) paintNails(false);
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
