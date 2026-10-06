// Lamp Hair — interaction. With "reduce motion" on, everything is simply shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (p) => p[lang === "en" ? 0 : 1];

const TIERS = [["Stylist", "スタイリスト"], ["Top Stylist", "トップスタイリスト"], ["Director", "ディレクター"]];
const LEN = ["Length charge: +20 (S), +25 (M), +30 (L), +35 (EL).", "長さによる追加：S +20、M +25、L +30、EL +35。"];
const SB = ["Includes shampoo and blow dry", "シャンプー・ブロー込み"];
// Prices as listed on the current site (Stylist / Top Stylist / Director). A single value applies to every level.
const MENU = [
  { c: ["Cut", "カット"], incl: SB, note: ["", ""], rows: [[["Ladies", "レディース"], "85", "90", "95"], [["Gents", "メンズ"], "65", "70", "75"]] },
  { c: ["Cut & colour", "カット＋カラー"], incl: SB, note: LEN, rows: [[["Re-growth", "リタッチ"], "180", "190", "200"], [["Whole colour", "全体カラー"], "180~", "190~", "200~"], [["Hair manicure (semi-permanent)", "ヘアマニキュア"], "190~", "200~", "210~"], [["Herbal treatment colour, semi-permanent", "ハーブカラー（セミパーマネント）"], "200~", "210~", "220~"], [["Herbal treatment colour, permanent", "ハーブカラー（パーマネント）"], "230~", "240~", "250~"], [["Half head", "ハーフヘッド"], "240~", "250~", "260~"], [["Full head", "フルヘッド"], "270~", "280~", "290~"], [["Lightener (per time)", "ライトナー（1回）"], "220~"], [["Bottom lightener (per time)", "毛先ライトナー（1回）"], "170~"]] },
  { c: ["Cut & perm", "カット＋パーマ"], incl: SB, note: LEN, rows: [[["Cold normal perm", "コールドパーマ"], "185~", "195~", "205~"], [["Cosmetic treatment perm", "コスメパーマ"], "215~", "225~", "235~"], [["Digital perm", "デジタルパーマ"], "260~", "270~", "280~"]] },
  { c: ["Cut & straightening", "カット＋縮毛矯正"], incl: SB, note: LEN, rows: [[["Iron straightening perm", "アイロン縮毛矯正"], "310~", "320~", "330~"], [["Straightening perm without iron", "アイロンなしのストレート"], "230~", "240~", "250~"], [["Half iron straightening", "ハーフ縮毛矯正"], "255~", "265~", "275~"]] },
  { c: ["Colour or perm only", "カラー・パーマのみ"], incl: SB, note: LEN, rows: [[["Re-growth", "リタッチ"], "135~", "140~", "145~"], [["Hair manicure (semi-permanent)", "ヘアマニキュア"], "145~", "150~", "155~"], [["Herbal treatment colour, semi-permanent", "ハーブカラー（セミパーマネント）"], "155~", "160~", "165~"], [["Herbal treatment colour, permanent", "ハーブカラー（パーマネント）"], "185~", "190~", "195~"], [["Half head foils", "ハーフヘッド・フォイル"], "180~", "185~", "190~"], [["Full head foils", "フルヘッド・フォイル"], "210~", "215~", "220~"], [["Perm", "パーマ"], "140~", "145~", "150~"], [["Cosmetic treatment perm", "コスメパーマ"], "170~", "175~", "180~"], [["Digital perm", "デジタルパーマ"], "215~", "220~", "225~"], [["Iron straightening", "アイロン縮毛矯正"], "260~", "265~", "270~"], [["Straightening perm without iron", "アイロンなしのストレート"], "180~", "185~", "190~"], [["Half iron straightening", "ハーフ縮毛矯正"], "205~", "210~", "215~"], [["Point straightening", "ポイント縮毛矯正"], "155~"], [["Bottom digital perm", "毛先デジタルパーマ"], "170~"]] },
  { c: ["Treatments", "トリートメント"], incl: ["Treatment only: add $25 for shampoo and blow dry", "トリートメントのみの場合は、シャンプー・ブロー +$25"], note: ["Head spa: deep cleanse, scalp pH control, massage and scalp remedy. $100 as a spa-only visit.", "ヘッドスパ：ディープクレンズ、頭皮のpHコントロール、マッサージ、スカルプケア。スパのみのご利用は $100。"], rows: [[["2 step moisture treatment", "2ステップ モイスチャー"], "55~"], [["Premium treatment", "プレミアム"], "75~"], [["Executive inner repair treatment", "エグゼクティブ インナーリペア"], "115~"], [["Olaplex treatment", "オラプレックス"], "65~"], [["Head spa scalp treatment", "ヘッドスパ（頭皮ケア）"], "75~"]] },
  { c: ["Others", "その他"], incl: ["", ""], note: ["", ""], rows: [[["Shampoo & blow dry", "シャンプー・ブロー"], "65"], [["Shampoo & blow dry with heat tool", "シャンプー・ブロー（アイロン仕上げ）"], "75"], [["Add iron finish", "アイロン仕上げの追加"], "+30"], [["Fringe cut", "前髪カット"], "25"], [["Fringe perm", "前髪パーマ"], "70"], [["Eyebrow cut", "眉カット"], "20"], [["Eyebrow colour", "眉カラー"], "20"]] },
];
// Mon..Sun, [open, close] in minutes; null = closed (from the Find Us page)
const HOURS = [null, [570, 1110], [570, 1110], [600, 1140], [570, 1110], [600, 1080], [600, 1080]];
const DAYS = [["Mon", "月"], ["Tue", "火"], ["Wed", "水"], ["Thu", "木"], ["Fri", "金"], ["Sat", "土"], ["Sun", "日"]];
let tier = 0, cat = 0;
const money = (s) => { const plus = s.startsWith("+"), from = s.endsWith("~"), n = parseInt(s.replace("+", "")); return (plus ? "+" : "") + (from ? (lang === "ja" ? `$${n}〜` : `from $${n}`) : `$${n}`); };
const hm = (m) => { const h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? "pm" : "am", h12 = h % 12 || 12; return h12 + (mm ? ":" + String(mm).padStart(2, "0") : "") + ap; };
function sydney() { const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value])); return { d: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday), m: (+p.hour % 24) * 60 + +p.minute }; }
function render(animate = true) {
  $(".tiers").innerHTML = TIERS.map((x, i) => `<button type="button" role="radio" aria-checked="${i === tier}" data-i="${i}"><i></i>${t(x)}</button>`).join("");
  $(".cats").innerHTML = MENU.map((m, i) => `<button type="button" role="tab" aria-selected="${i === cat}" data-i="${i}">${t(m.c)}</button>`).join("");
  const m = MENU[cat]; $("#incl").textContent = t(m.incl); $("#pnote").textContent = t(m.note);
  $("#plist").innerHTML = m.rows.map((r, i) => { const flat = r.length === 2; return `<li style="--d:${i * 35}ms"><span>${t(r[0])}</span><i></i><b>${money(flat ? r[1] : r[1 + tier])}</b>${flat && m.rows.some((x) => x.length > 2) ? `<em>${t(["all levels", "全員共通"])}</em>` : ""}</li>`; }).join("");
  if (animate && !reduce) { const l = $("#plist"); l.classList.remove("flow"); void l.offsetWidth; l.classList.add("flow"); }
}
function hours() {
  const n = sydney();
  $("#hours").innerHTML = DAYS.map((d, i) => `<li class="${i === n.d ? "today" : ""}${HOURS[i] ? "" : " shut"}"><b>${t(d)}</b><span>${HOURS[i] ? hm(HOURS[i][0]) + " – " + hm(HOURS[i][1]) : t(["Closed", "定休日"])}</span></li>`).join("") + `<li class="ph"><b>${t(["Public holidays", "祝日"])}</b><span>${t(["Closed", "休み"])}</span></li>`;
  const h = HOURS[n.d], open = h && n.m >= h[0] && n.m < h[1];
  $("#now").innerHTML = `<i class="${open ? "on" : ""}"></i>` + (open ? t([`Open now, until ${hm(h[1])}`, `ただいま営業中（${hm(h[1])} まで）`]) : t(["Closed right now. Email us and we will reply.", "ただいま営業時間外です。メールでご連絡ください。"]));
  document.documentElement.classList.toggle("lit", !!open);
}
$(".tiers").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { tier = +b.dataset.i; render(); } });
$(".cats").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { cat = +b.dataset.i; render(); } });
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-en]").forEach((el) => { el.alt = lang === "en" ? el.dataset.altEn : el.dataset.altJa; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  render(false); hours();
}
$(".lang").addEventListener("click", () => { lang = lang === "en" ? "ja" : "en"; applyLang(); });
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else { const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" }); $$(".sec-head, .tiers, .menu-grid, .people li, .yoshiko, .s-a, .s-b, .s-copy, .v-head, .hours, .info").forEach((el) => { el.classList.add("rv"); io.observe(el); }); }
applyLang();
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
