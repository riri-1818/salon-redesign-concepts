// Wabi-Sabi Remedial Massage — 動きの部分。「動きを減らす」設定の人には、動かさずに全部表示する。
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (p) => p[lang === "ja" ? 1 : 0];

/* ---------- 施術と料金（現サイトの予約メニューの「Book now」の金額。plus＝「$◯+」の表記） ---------- */
const KINDS = [
  { n: ["Massage / Remedial massage", "マッサージ／リメディアル"], body: ["For the best results we recommend 30 minutes to treat one area, 60 minutes for the whole body, and 90 minutes for the best whole-body treatment.", "おすすめは、1か所だけなら30分、全身なら60分、全身をしっかりなら90分です。"],
    opts: [[30, 70, 1], [45, 90, 1], [60, 100, 0], [75, 130, 1], [90, 140, 0, 1], [120, 190, 1]] },
  { n: ["Reflexology", "リフレクソロジー"], body: ["Stimulates the reflex points of the feet. This treatment includes a foot spa.", "足の反射区を刺激します。フットスパ付きです。"], opts: [[30, 75, 1], [45, 95, 1], [60, 115, 1]] },
  { n: ["Head Relaxation", "ヘッド・リラクゼーション"], body: ["A calming treatment focused on the scalp, head, neck and jaw (formerly known as Dry Head Spa). The touch is gentle and responsive; pressure can be firm where needed, but never forced. Includes a 5-minute foot bath.", "頭皮、頭、首、あごを中心にした、落ち着いた施術です（旧称：ドライヘッドスパ）。やさしく、必要なところはしっかりと、でも無理には押しません。5分のフットバス付きです。"], opts: [[30, 75, 1], [45, 95, 1], [60, 115, 1]] },
];
const HINTS = { 30: ["30 minutes: one area.", "30分：1か所を集中して。"], 45: ["45 minutes: a little more room.", "45分：もう少しゆとりを。"], 60: ["60 minutes: the whole body.", "60分：全身に。"], 75: ["75 minutes: the whole body, unhurried.", "75分：全身を、ゆっくりと。"], 90: ["90 minutes: recommended for the best whole-body treatment.", "90分：全身をしっかり。おすすめです。"], 120: ["120 minutes: a long, slow session.", "120分：長く、ゆっくりと。"] };
let kind = 0, opt = 2, shown = 100, raf = 0;
function build() {
  $(".kinds").innerHTML = KINDS.map((k, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === kind}">${t(k.n)}</button>`).join("");
  $(".times").innerHTML = KINDS[kind].opts.map(([m, , , rec], i) => `<button type="button" data-i="${i}" aria-pressed="${i === opt}"${rec ? ' class="rec"' : ""}>${m}</button>`).join("");
}
function show(animate = true) {
  const k = KINDS[kind], [m, price, plus] = k.opts[opt];
  $$(".kinds button").forEach((b, i) => b.setAttribute("aria-selected", i === kind)); $$(".times button").forEach((b, i) => b.setAttribute("aria-pressed", i === opt));
  $("#c-min").textContent = m; $("#c-name").textContent = t(k.n); $("#c-body").textContent = t(k.body); $("#c-plus").textContent = plus ? "+" : "";
  $("#hint").textContent = kind === 0 ? t(HINTS[m]) : (lang === "ja" ? `${m}分` : `${m} minutes`);
  $(".seam-gold").style.strokeDashoffset = 1 - m / 120;
  const el = $("#c-price"), a = shown; shown = price; cancelAnimationFrame(raf);
  if (reduce || !animate || a === price) { el.textContent = price; return; }
  const t0 = performance.now(); const step = (now) => { const x = Math.min(1, (now - t0) / 450); el.textContent = Math.round(a + (price - a) * (1 - Math.pow(1 - x, 3))); if (x < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step);
}
$(".kinds").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; kind = +b.dataset.i; const cur = KINDS[kind].opts.findIndex(([m]) => m === 60); opt = cur < 0 ? 0 : cur; build(); show(); });
$(".times").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { opt = +b.dataset.i; show(); } });

/* ---------- 営業時間（水〜金 10:00–19:00、土日 9:00–19:00、月火 休み） ---------- */
const DAYS = [["Mon", "月"], ["Tue", "火"], ["Wed", "水"], ["Thu", "木"], ["Fri", "金"], ["Sat", "土"], ["Sun", "日"]], H = [null, null, [10, 19], [10, 19], [10, 19], [9, 19], [9, 19]];
function week() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const d = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday), h = (+p.hour % 24) + +p.minute / 60;
  $(".week").innerHTML = DAYS.map((x, i) => `<li class="${H[i] ? "" : "shut"}${i === d ? " today" : ""}"><b>${t(x)}</b><span>${H[i] ? `${H[i][0]}:00 – ${H[i][1]}:00` : (lang === "ja" ? "お休み" : "Closed")}</span></li>`).join("");
  const o = H[d], open = o && h >= o[0] && h < o[1];
  $("#now").innerHTML = `<i class="${open ? "on" : ""}"></i>` + (open ? (lang === "ja" ? `ただいま営業中（${o[1]}:00 まで）` : `Open now, until ${o[1]}:00`) : (lang === "ja" ? "ただいま営業時間外。ご予約はオンラインでいつでも。" : "Closed right now. You can book online any time."));
}
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  document.title = lang === "ja" ? "Wabi-Sabi Remedial Massage｜Newtown のマッサージ" : "Wabi-Sabi Remedial Massage | Newtown";
  build(); show(false); week();
}
$(".lang").addEventListener("click", () => { lang = lang === "ja" ? "en" : "ja"; applyLang(); });

if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".sec-head, .picker, .sig, .clean, .flow li, .week, .info > div").forEach((el) => { el.classList.add("rv"); io.observe(el); });
  $$(".flow li").forEach((li, i) => li.style.setProperty("--d", i * 140 + "ms"));
}
applyLang();
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
