// KUMI Barber — 動きの部分。「動きを減らす」設定の人には、動かさずに全部表示する。
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (p) => p[lang === "ja" ? 1 : 0];

/* ---------- メニュー（現サイトの Service menu より）。g＝バリカンの刃の番号の絵に使う長さ 0〜4 ---------- */
const MENU = [
  { n: ["Hair Cut", "ヘアカット"], price: 80, min: 40, g: 2, body: ["A standard haircut, in a short back and sides style. For mid to long hair, please choose the long hair option.", "ショートバック＆サイドの標準的なカットです。ミディアム〜ロングの方は、ロングヘアのメニューをお選びください。"] },
  { n: ["Fade (Skin, Zero)", "フェード（スキン・ゼロ）"], price: 85, min: 45, g: 0, body: ["A skin or zero fade.", "スキンフェード、ゼロフェード。"] },
  { n: ["Buzz Cut", "バズカット"], price: 50, min: 20, g: 1, body: ["Clippers only, the same length all over (0–4). After a fade on the sides? Please book a Haircut, so there is enough time.", "バリカンのみ、全体を同じ長さ（0〜4）に。サイドをフェードにしたい方は、時間を確保するためヘアカットでご予約ください。"] },
  { n: ["Scissor Cut / Long Hair / Restyle", "シザーカット／ロング／スタイルチェンジ"], price: 100, from: true, min: 45, g: 4, body: ["For medium to long hair, or a change of style with a longer consultation. Advice on styling the new cut is included. The price can vary with the style.", "ミディアム〜ロングの方、スタイルを変えたい方に。長めにカウンセリングの時間を取り、スタイリングのアドバイスもします。料金はスタイルによって変わります。"] },
  { n: ["Hair & Beard Trim", "ヘアカット＋ひげトリム"], price: 130, min: 60, g: 2, body: ["A haircut and a beard trim together.", "ヘアカットとひげのトリムのセット。"] },
  { n: ["Haircut & Beard Trim with Hot Towel Shave", "ヘアカット＋ひげトリム＋ホットタオルシェーブ"], price: 140, min: 60, g: 2, body: ["Starting with a consultation. Your beard is shaped and groomed, and the edges are finished with an open razor shave.", "カウンセリングから始めます。ひげの形を整え、きわはレザーで仕上げます。"] },
  { n: ["Beard Trim", "ひげトリム"], price: 55, min: 30, g: 3, body: ["A beard trim on its own.", "ひげのトリムのみ。"] },
  { n: ["Beard Trim with Hot Towel Shave", "ひげトリム＋ホットタオルシェーブ"], price: 66, min: 40, g: 3, body: ["Your beard is shaped and trimmed, and the edges are finished with a hot towel and an open razor for a clean finish.", "ひげの形を整えてトリムし、きわはホットタオルとレザーですっきり仕上げます。"] },
];
let sel = 0, addon = false, shown = 80, raf = 0;
function build() {
  $(".list").innerHTML = MENU.map((m, i) => `<li><button type="button" role="tab" data-i="${i}" aria-selected="${i === sel}"><span class="n">${t(m.n)}</span><span class="dots"></span><span class="p">${m.from ? (lang === "ja" ? "" : "from ") : ""}$${m.price}${m.from && lang === "ja" ? "〜" : ""}</span></button></li>`).join("");
  $(".guards").innerHTML = [0, 1, 2, 3, 4].map((g) => `<i data-g="${g}"><b>${g}</b></i>`).join("");
}
function show(animate = true) {
  const m = MENU[sel], price = m.price + (addon ? 10 : 0), min = m.min + (addon ? 10 : 0);
  $$(".list button").forEach((b, i) => b.setAttribute("aria-selected", i === sel));
  $$(".guards i").forEach((i) => i.classList.toggle("on", +i.dataset.g === m.g));
  $("#t-name").textContent = t(m.n); $("#t-body").textContent = t(m.body); $("#t-min").textContent = min;
  $("#t-from").textContent = m.from && lang === "en" ? "from " : "";
  const el = $("#t-price"), a = shown; shown = price; cancelAnimationFrame(raf);
  if (!reduce && animate) { const tk = $(".ticket"); tk.classList.remove("snip"); void tk.offsetWidth; tk.classList.add("snip"); }
  if (reduce || !animate || a === price) { el.textContent = price; return; }
  const t0 = performance.now(); const step = (now) => { const k = Math.min(1, (now - t0) / 380); el.textContent = Math.round(a + (price - a) * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step);
}
$(".list").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { sel = +b.dataset.i; show(); } });
$("#addon").addEventListener("change", (e) => { addon = e.target.checked; show(); });

/* ---------- 営業日：土曜 9:00–18:00、日曜 9:00–17:00（シドニーの時刻で「次に開く日」を出す） ---------- */
const DAYS = [["Mon", "月"], ["Tue", "火"], ["Wed", "水"], ["Thu", "木"], ["Fri", "金"], ["Sat", "土"], ["Sun", "日"]], HOURS = { 5: [9, 18], 6: [9, 17] };
function week() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const d = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday), h = (+p.hour % 24) + +p.minute / 60;
  $(".week").innerHTML = DAYS.map((x, i) => { const o = HOURS[i]; return `<li class="${o ? "open" : ""}${i === d ? " today" : ""}" style="--d:${i * 60}ms"><b>${t(x)}</b><span>${o ? `${o[0]}:00<br>${o[1]}:00` : (lang === "ja" ? "休み" : "Closed")}</span></li>`; }).join("");
  const o = HOURS[d], open = o && h >= o[0] && h < o[1];
  let txt;
  if (open) txt = lang === "ja" ? `ただいま営業中（${o[1]}:00 まで）` : `Open now, until ${o[1]}:00`;
  else { const sat = d === 5 && h < 9, sun = (d === 5 && h >= 18) || (d === 6 && h < 9); const days = sat ? 0 : sun ? (d === 6 ? 0 : 1) : (5 - d + 7) % 7 || 7;
    const which = sun ? (lang === "ja" ? "日曜" : "Sunday") : (lang === "ja" ? "土曜" : "Saturday");
    txt = lang === "ja" ? `次に開くのは ${which} 9:00${days > 1 ? `（あと${days}日）` : days === 1 ? "（あした）" : "（きょう）"}` : `Next open: ${which}, 9:00 am${days > 1 ? ` (in ${days} days)` : days === 1 ? " (tomorrow)" : " (today)"}`; }
  $("#now").innerHTML = `<i class="${open ? "on" : ""}"></i>` + txt; $("#next").innerHTML = `<i class="${open ? "on" : ""}"></i>` + txt;
}
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  document.title = lang === "ja" ? "KUMI Barber｜Surry Hills の週末の床屋" : "KUMI Barber | Weekend barber in Surry Hills";
  build(); show(false); week();
}
$(".lang").addEventListener("click", () => { lang = lang === "ja" ? "en" : "ja"; applyLang(); });

if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".sec-head, .board, .week, .now, .find > div").forEach((el) => { el.classList.add("rv"); io.observe(el); });
}
applyLang();
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
