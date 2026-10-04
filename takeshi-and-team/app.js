// Takeshi & Team — 動きの部分。「動きを減らす」設定の人には、動かさずに全部表示する。
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (pair) => pair[lang === "ja" ? 1 : 0];

/* ---------- データ（料金は現サイトの Price List より） ---------- */
const HUES = [
  { key: "all", name: ["All", "すべて"], c: "#f2b632" },
  { key: "red", name: ["Red", "レッド"], c: "#e0312f" },
  { key: "blue", name: ["Blue", "ブルー"], c: "#2f7fe0" },
  { key: "copper", name: ["Copper", "コッパー"], c: "#ee7d32" },
  { key: "ash", name: ["Ash", "アッシュ"], c: "#c9b998" },
  { key: "dark", name: ["Dark", "ダーク"], c: "#9a9a9a" },
  { key: "perm", name: ["Perm", "パーマ"], c: "#b7e04a" },
];
const PHOTOS = [
  ["hero", ["red"], ["Layered cut, deep red", "深い赤のレイヤー"]], ["s6", ["blue"], ["Deep blue, long", "深いブルーのロング"]], ["s9", ["copper"], ["Copper orange waves", "コッパーオレンジ"]],
  ["s2", ["ash"], ["Men’s ash short cut", "メンズのアッシュ系ショート"]], ["s3", ["red"], ["Red and black, long", "赤と黒のロング"]], ["s4", ["perm", "dark"], ["Men’s short perm", "メンズのパーマ"]],
  ["s8", ["blue", "dark"], ["Black bob, blue inner colour", "ブルーのインナーカラー"]], ["s1", ["dark"], ["Long dark layers", "ロングのレイヤー"]], ["s5", ["perm", "ash"], ["Men’s curly top", "メンズのカーリースタイル"]],
  ["s7", ["dark", "ash"], ["Face-framing highlights", "顔まわりにハイライト"]],
];
const SIZES = ["S", "M", "L", "XL"];
const BOARD = [ // "~" は「〜から」。null は設定なし
  { n: ["Japanese colour / bleach", "日本製カラー／ブリーチ"], d: ["Men, short: $125", "メンズ ショートは $125"], p: ["135", "155", "175", "195"] },
  { n: ["Perm", "パーマ"], p: ["165", "185", "205", "225"] },
  { n: ["Japanese digital perm", "デジタルパーマ"], p: ["225", "265", "285", "325"] },
  { n: ["Shiseido straightening", "資生堂 縮毛矯正"], d: ["Wavy / thin hair", "くせ弱め・細い髪"], p: ["275", "305", "335~", null] },
  { n: ["Shiseido straightening", "資生堂 縮毛矯正"], d: ["Curly / thick hair", "くせ強め・太い髪"], p: ["335", "375", "405~", null] },
  { n: ["Shiseido straightening", "資生堂 縮毛矯正"], d: ["Strong curl / extra thick", "強いくせ・とても太い髪"], p: ["395", "435", "475~", null] },
  { n: ["Blow-dry", "ブロー"], d: ["Includes shampoo. Straightening iron, add $20", "シャンプー込み。ストレートアイロンは +$20"], p: ["50", "60", "70", "80"] },
];
const FIXED = [
  [["Cut", "カット"], [[["Ladies", "レディース"], "85"], [["Gentlemen", "メンズ"], "65"], [["Child", "お子さま"], "55"], [["Fringe cut / eyebrow trim", "前髪カット／眉カット"], "20"]]],
  [["Foils", "ホイル"], [[["Half head, short", "ハーフ（ショート）"], "105~"], [["Full head, short", "フル（ショート）"], "165~"]]],
  [["Micro mist treatment", "マイクロミスト トリートメント"], [[["Demi Intense Repairing (chemically damaged)", "デミ インテンス リペア（薬剤ダメージ）"], "80"], [["Arimino Deluxe (moderately damaged)", "アリミノ デラックス（中程度のダメージ）"], "65"], [["Shiseido Maintenance (minor damage)", "資生堂 メンテナンス（軽いダメージ）"], "60"], [["Shiseido scalp treatment", "資生堂 スカルプトリートメント"], "50"]]],
  [["Upstyle & make-up", "アップスタイル・メイク"], [[["Upstyle", "アップスタイル"], "95"], [["Make-up", "メイク"], "95"], [["Bridal make-up", "ブライダルメイク"], "150"], [["Bridal hair set", "ブライダルヘアセット"], "150"], [["Hair extensions", "エクステ"], "ask"]]],
];
let hue = 0, size = 1, picked = false;
const money = (s) => s === "ask" ? (lang === "ja" ? "お問い合わせ" : "On request") : s.endsWith("~") ? (lang === "ja" ? `$${parseInt(s)}〜` : `from $${parseInt(s)}`) : "$" + s;

/* ---------- 言語 ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-en]").forEach((el) => { el.alt = lang === "ja" ? el.dataset.altJa : el.dataset.altEn; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  document.title = lang === "ja" ? "Takeshi & Team｜セントラル駅近くの日系ヘアサロン" : "Takeshi & Team | Japanese hair salon near Central Station, Sydney";
  buildWall(); buildBoard(); openNow();
}
$(".lang").addEventListener("click", () => { lang = lang === "ja" ? "en" : "ja"; applyLang(); });

/* ---------- 色：サイト全体の差し色が、選んだ髪色になる ---------- */
function setHue(i) { hue = i; document.documentElement.style.setProperty("--hue", HUES[i].c); }
// えらぶ前は、見出しの色が一定の間隔で入れ替わる
let cyc = 1;
if (!reduce) setInterval(() => { if (picked) return; cyc = (cyc % (HUES.length - 1)) + 1; document.documentElement.style.setProperty("--hue", HUES[cyc].c); }, 2400);

function buildWall() {
  $(".chips").innerHTML = HUES.map((h, i) => `<button type="button" data-i="${i}" aria-pressed="${i === hue && picked || (!picked && i === 0)}" style="--c:${h.c}"><i></i>${t(h.name)}</button>`).join("");
  $(".wall").innerHTML = PHOTOS.map(([f, tags, cap], i) => `<figure data-tags="${tags.join(" ")}" style="--n:${i}"><img loading="lazy" src="img/${f}.jpg" width="760" height="760" alt="${t(cap)}"><figcaption>${t(cap)}</figcaption></figure>`).join("");
  sortWall(false);
}
function sortWall(animate = true) {
  const key = HUES[hue].key, figs = $$(".wall figure");
  const first = animate && !reduce ? figs.map((f) => f.getBoundingClientRect()) : null;
  let n = 0;
  figs.forEach((f) => { const on = key === "all" || f.dataset.tags.split(" ").includes(key); f.classList.toggle("off", !on); f.style.order = on ? n++ : 100; });
  if (!first) return;
  figs.forEach((f, i) => { // 並びが変わるところを、元の位置から滑らせる（FLIP）
    const last = f.getBoundingClientRect(), dx = first[i].left - last.left, dy = first[i].top - last.top;
    if (!dx && !dy) return;
    f.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 520, easing: "cubic-bezier(.2,.7,.2,1)" });
  });
}
$(".chips").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; picked = true; setHue(+b.dataset.i); $$(".chips button").forEach((x, i) => x.setAttribute("aria-pressed", i === hue)); sortWall(); });

/* ---------- 料金ボード：長さを変えると、数字がパタパタと替わる ---------- */
function cells(s) {
  const txt = s == null ? "—" : s.replace("~", "");
  return [..."$" + txt.padStart(3, " ")].map((ch) => `<i>${ch === " " ? "&nbsp;" : ch}</i>`).join("") + `<em>${s && s.endsWith("~") ? (lang === "ja" ? "〜" : "+") : ""}</em>`;
}
function buildBoard() {
  $(".sizes").innerHTML = `<span>${lang === "ja" ? "長さ" : "Length"}</span>` + SIZES.map((s, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === size}">${s}</button>`).join("");
  $(".board").innerHTML = BOARD.map((r) => `<div class="row"><span class="rn">${t(r.n)}${r.d ? `<small>${t(r.d)}</small>` : ""}</span><span class="flap">${cells(r.p[size])}</span></div>`).join("");
  $(".fixed").innerHTML = FIXED.map(([h, rows]) => `<div><h3>${t(h)}</h3><ul>${rows.map(([n, p]) => `<li><span>${t(n)}</span><b>${money(p)}</b></li>`).join("")}</ul></div>`).join("");
}
function flipBoard() {
  $$(".sizes button").forEach((b, i) => b.setAttribute("aria-selected", i === size));
  $$(".board .flap").forEach((el, r) => {
    const html = cells(BOARD[r].p[size]);
    if (reduce) { el.innerHTML = html; return; }
    el.classList.remove("flip"); void el.offsetWidth; el.style.setProperty("--d", r * 45 + "ms"); el.classList.add("flip");
    setTimeout(() => { el.innerHTML = html; }, 150 + r * 45);
  });
}
$(".sizes").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b || +b.dataset.i === size) return; size = +b.dataset.i; flipBoard(); });

/* ---------- いま営業中か（シドニーの時刻。水曜定休） ---------- */
function openNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const h = (+p.hour % 24) + +p.minute / 60, open = p.weekday !== "Wed" && h >= 10 && h < 19;
  $(".status").innerHTML = `<i class="${open ? "on" : ""}"></i>` + (open ? (lang === "ja" ? "ただいま営業中" : "Open now") : (lang === "ja" ? "ただいま営業時間外" : "Closed right now"));
}

/* ---------- 画面に入ったら現れる ---------- */
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".sec-head, .chips, .wall, .sizes, .board, .fixed, .team li, .quote, .book-in, .quick li").forEach((el) => { el.classList.add("rv"); io.observe(el); });
}
applyLang();
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
