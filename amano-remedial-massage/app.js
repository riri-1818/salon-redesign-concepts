// AMANO Remedial Massage — 動きの部分。「動きを減らす」設定の人には、動かさずに全部表示する。
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (p) => p[lang === "ja" ? 1 : 0];

/* ---------- 今日の希望（現サイト「What is your expectation」より） ---------- */
const WANT = [
  { tab: ["I want to relax", "リラックスしたい"], say: ["I will do gentle, slow flows.", "やさしく、ゆっくりとした流れで行います。"] },
  { tab: ["I want to release tension", "こりや張りをゆるめたい"], say: ["I will spend more time in the area and use deep, firm pressure.", "気になる場所に時間をかけ、深くしっかりとした圧で行います。"] },
  { tab: ["Somewhere in between", "その中間"], say: ["I will mix them.", "両方を組み合わせます。"] },
];
const NOTE = ["The firm pressure provided is therapeutic, but not as intense as sports or Thai-style treatments.", "しっかりした圧は治療的なもので、スポーツマッサージやタイ式ほど強くはありません。"];
/* ---------- 圧の目安（現サイト「Pressure and Pain Scale」より） ---------- */
const PRESS = (n) => n === 1 ? ["Very gentle.", "とてもやさしい。"] : n <= 3 ? ["Gentle.", "やさしめ。"] : n <= 6 ? ["Recommended. Generally effective, while allowing your muscles to relax.", "おすすめの強さ。効果が出やすく、筋肉もゆるみます。"] : n === 7 ? ["Deeper. Some clients prefer this; deep breathing is important for safety and relaxation.", "深め。好まれる方もいます。安全とリラックスのために、深い呼吸が大切です。"] : n <= 9 ? ["Too much pressure while holding your breath can reduce effectiveness. Please tell me what feels right.", "息を止めるほどの強さは、かえって効果を下げることがあります。ちょうどよい強さを教えてください。"] : ["Extremely painful. Not where we want to be.", "強すぎて痛い状態。ここは目指しません。"];
const MINS = [[45, 75], [60, 95], [75, 115], [90, 135]];
let want = 0, min = 1, shown = 95, raf = 0;
function build() {
  $(".want").innerHTML = WANT.map((w, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === want}">${t(w.tab)}</button>`).join("");
  $(".mins").innerHTML = MINS.map(([m, p], i) => `<button type="button" data-i="${i}" aria-pressed="${i === min}"><b>${m}</b><span>${lang === "ja" ? "分" : "min"}</span><em>$${p}</em></button>`).join("");
  $(".ticks").innerHTML = Array.from({ length: 10 }, (_, i) => `<i>${i + 1}</i>`).join("");
}
function showWant(animate = true) {
  $$(".want button").forEach((b, i) => b.setAttribute("aria-selected", i === want));
  $("#r-say").textContent = t(WANT[want].say); $("#r-note").textContent = want === 0 ? "" : t(NOTE);
  if (animate && !reduce) { const r = $(".reply"); r.classList.remove("bloom"); void r.offsetWidth; r.classList.add("bloom"); }
}
function showPress() { const n = +$("#press").value; $("#p-n").textContent = n; $("#p-t").textContent = t(PRESS(n)); $("#press").style.setProperty("--p", (n - 1) / 9); $(".p-out").dataset.z = n >= 4 && n <= 6 ? "ok" : n >= 8 ? "hi" : ""; }
function showPrice(animate = true) {
  const [m, p] = MINS[min], dn = $("#dn").checked, ar = $("#aroma").checked, total = p + (dn ? 30 : 0) + (ar ? 10 : 0);
  $$(".mins button").forEach((b, i) => b.setAttribute("aria-pressed", i === min));
  $("#tot-l").textContent = (lang === "ja" ? `${m}分のリメディアル・マッサージ` : `${m}-minute remedial massage`) + (dn ? (lang === "ja" ? "＋ドライニードリング" : " + dry needling") : "") + (ar ? (lang === "ja" ? "＋アロマ" : " + aroma") : "");
  const el = $("#tot"), a = shown; shown = total; cancelAnimationFrame(raf);
  if (reduce || !animate || a === total) { el.textContent = total; return; }
  const t0 = performance.now(); const step = (now) => { const k = Math.min(1, (now - t0) / 400); el.textContent = Math.round(a + (total - a) * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step);
}
$(".want").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { want = +b.dataset.i; showWant(); } });
$("#press").addEventListener("input", showPress);
$(".mins").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { min = +b.dataset.i; showPrice(); } });
["dn", "aroma"].forEach((id) => $("#" + id).addEventListener("change", () => showPrice()));
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  document.title = lang === "ja" ? "AMANO Remedial Massage｜Ryde のリメディアル・マッサージ" : "AMANO Remedial Massage | Remedial massage & dry needling, Ryde";
  build(); showWant(false); showPress(); showPrice(false);
}
$(".lang").addEventListener("click", () => { lang = lang === "ja" ? "en" : "ja"; applyLang(); });
// 最初の画面：あじさいの花びらを散らす（位置は固定。ゆっくり揺れるだけ）
$(".petals").innerHTML = Array.from({ length: 14 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--y:${(i * 53) % 100}%;--s:${0.6 + ((i * 7) % 10) / 10};--r:${(i * 47) % 360}deg;--c:${["#8f9be6", "#b9a6ee", "#7fb6e8", "#d7c8f6"][i % 4]};--d:${i * -0.7}s"></i>`).join("");
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".sec-head, .expect, .scale, .calc, .fine, .who, .certs > div, .room figure, .room > div, .places article").forEach((el) => { el.classList.add("rv"); io.observe(el); });
}
applyLang();
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
