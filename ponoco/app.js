// ponoco — 動きの部分。「動きを減らす」設定の人には、動かさずに全部表示する。
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("en") ? "en" : "ja";
const t = (p) => p[lang === "ja" ? 0 : 1];

/* ---------- 5つのこだわり（現サイトより。文章は短くまとめた） ---------- */
const FIVE = [
  { k: ["技術", "Technique"], title: ["技術×知識で、「なりたい」を叶える", "Technique and knowledge, to bring your vision to life"], body: ["スタイリストは経験15年以上。毛髪診断を行い、ご要望に合う技術とサービスを提案します。髪質ごとのケアや、先を見据えたスタイルもご提案します。", "Our stylists have over 15 years of experience. We assess your hair and suggest the techniques and services that fit, with care advice and styles that look ahead."] },
  { k: ["品質", "Quality"], title: ["頭皮にも髪にも負担の軽い薬剤を厳選", "Products chosen to be gentle on scalp and hair"], body: ["カラーやパーマの薬剤は、高品質で安全性の高い日本のプロダクトを選んでいます。髪質と今の状態に合わせ、必要なときはダメージ補修のトリートメントを組み合わせます。", "For colour and perms we use high-quality, safe Japanese products, chosen for your hair type and condition, with damage-repair treatments when needed."] },
  { k: ["艶髪", "Lustre"], title: ["薬剤を使っても、素髪にリセット", "Reset to natural hair, even after chemical services"], body: ["薬剤を使うメニューでは、marbb のマイクロバブル（超微細気泡）のシャンプーを使います。通うたびに髪がきれいに、を目指しています。", "Services with chemical products include a marbb microbubble shampoo. Our aim: hair that looks better with every visit."] },
  { k: ["癒し", "Relaxation"], title: ["マッサージで、ひと息つく時間を", "A massage, and a moment to breathe"], body: ["マッサージも大切にしている技術のひとつです。シャンプー＆ヘッドマッサージと、そのあとの肩のマッサージをお楽しみください。", "Massage is one of the techniques we value. Enjoy a shampoo and head massage, followed by a shoulder massage."] },
  { k: ["安心", "Assurance"], title: ["施術後2週間以内は、無料でお直し", "Free adjustments within two weeks"], body: ["「もう少し短め」「もう少し明るめ」。お家に帰ってから気になることがあれば、些細なことでもご相談ください。", "“A little shorter.” “A little brighter.” If something comes to mind once you are home, however small, please tell us."], days: true },
];
/* ---------- メニュー（現サイトの Service より） ---------- */
const MENU = [
  { c: ["カット", "Haircut"], rows: [[["メンズカット", "Men’s cut"], "65"], [["レディースカット", "Ladies’ cut"], "90"], [["キッズカット（Year 6 以下）", "Kids’ cut (Year 6 and under)"], "45"], [["前髪カット", "Fringe cut"], "15~"]], note: ["marbb によるシャンプーは別途 $20。", "Shampoo with marbb is an extra $20."] },
  { c: ["カラー", "Colour"], rows: [[["タッチアップカラー（3cm以内）", "Touch-up colour (within 3cm)"], "80~"], [["フルカラー", "Full colour"], "110~"], [["ブリーチ タッチアップ（3cm以内）", "Bleach touch-up (within 3cm)"], "130~"], [["フルブリーチ", "Full bleach"], "180~"], [["1/2 ハイライト（トナー込み）", "Half-head highlights (with toner)"], "160~"], [["フルヘッド ハイライト（トナー込み）", "Full-head highlights (with toner)"], "230~"], [["バレイヤージュ／オンブレ（トナー込み）", "Balayage / ombré (with toner)"], "380~"]], note: ["カラーのみの場合は、別途シャンプーブロー $30（marbb を使用）。", "Colour only: shampoo and blow-dry is an extra $30 (with marbb)."] },
  { c: ["パーマ・縮毛矯正", "Perm & straightening"], rows: [[["ナチュラルパーマ（コールド）", "Natural perm (cold)"], "135~"], [["デジタルパーマ（ホット）", "Digital perm (hot)"], "215~"], [["縮毛矯正", "Straightening"], "230~"], [["前髪 縮毛矯正", "Fringe straightening"], "130~"], [["オーラ スムースストレート", "Aura smooth straight"], "280~"]], note: ["パーマのみの場合は、別途シャンプーブロー $30（marbb を使用）。", "Perm only: shampoo and blow-dry is an extra $30 (with marbb)."] },
  { c: ["トリートメント", "Treatment"], rows: [[["フローディア 3ステップ", "Flowdia 3-step treatment"], "85"], [["フローディア 5ステップ", "Flowdia 5-step treatment"], "150"], [["ディープスキャルプクレンジング", "Deep scalp cleansing"], "85"], [["シャンプー＆ブロー", "Shampoo & blow-dry"], "60~"]], note: ["ほかのメニューに追加する場合：3ステップ +$40、5ステップ +$80、スキャルプクレンジング +$40。", "Added to another service: 3-step +$40, 5-step +$80, scalp cleansing +$40."] },
  { c: ["セット", "Packages"], rows: [[["カット＆根元カラー（3cm以内）", "Cut & root colour (within 3cm)"], "170"], [["カット＆全体カラー", "Cut & full colour"], "200~"], [["カット＆ナチュラルパーマ", "Cut & natural perm"], "225~"], [["カット＆デジタルパーマ", "Cut & digital perm"], "305~"], [["カット＆縮毛矯正", "Cut & straightening"], "330~"]], note: ["", ""] },
];
let five = 0, cat = 0;
const money = (s) => s.endsWith("~") ? (lang === "ja" ? `$${parseInt(s)}〜` : `from $${parseInt(s)}`) : "$" + s;
function build() {
  $(".tabs").innerHTML = FIVE.map((f, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === five}"><i>0${i + 1}</i><b>${t(f.k)}</b></button>`).join("");
  $(".cats").innerHTML = MENU.map((m, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === cat}">${t(m.c)}</button>`).join("");
}
function showFive(animate = true) {
  const f = FIVE[five]; $$(".tabs button").forEach((b, i) => b.setAttribute("aria-selected", i === five));
  $("#l-no").textContent = "0" + (five + 1); $("#l-title").textContent = t(f.title); $("#l-body").textContent = t(f.body);
  $("#l-extra").innerHTML = f.days ? `<div class="days14">${Array.from({ length: 14 }, (_, i) => `<i style="--d:${i * 45}ms"></i>`).join("")}</div><p>${lang === "ja" ? "14日間" : "14 days"}</p>` : "";
  if (animate && !reduce) { const l = $(".leaf"); l.classList.remove("turn"); void l.offsetWidth; l.classList.add("turn"); }
}
function showMenu(animate = true) {
  const m = MENU[cat]; $$(".cats button").forEach((b, i) => b.setAttribute("aria-selected", i === cat));
  $("#plist").innerHTML = m.rows.map(([n, p], i) => `<li style="--d:${i * 40}ms"><span>${t(n)}</span><i></i><b>${money(p)}</b></li>`).join(""); $("#pnote").textContent = t(m.note);
  if (animate && !reduce) { const l = $("#plist"); l.classList.remove("flow"); void l.offsetWidth; l.classList.add("flow"); }
}
$(".tabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { five = +b.dataset.i; showFive(); } });
$(".cats").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { cat = +b.dataset.i; showMenu(); } });
function now() {
  const h = +new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", hour: "numeric", hour12: false }).format(new Date()) % 24, open = h >= 10 && h < 19;
  $("#now").innerHTML = `<i class="${open ? "on" : ""}"></i>` + (open ? t(["ただいま営業中", "Open now"]) : t(["ただいま営業時間外。オンライン予約は24時間受け付けています。", "Closed right now. Online booking is open 24 hours."]));
}
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-ja]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-ja]").forEach((el) => { el.alt = lang === "ja" ? el.dataset.altJa : el.dataset.altEn; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "ja")));
  document.title = lang === "ja" ? "ponoco｜Chatswood の日系ヘアサロン" : "ponoco | Japanese hair salon in Chatswood";
  build(); showFive(false); showMenu(false); now();
}
$(".lang").addEventListener("click", () => { lang = lang === "ja" ? "en" : "ja"; applyLang(); });
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".sec-head, .wheel, .marbb figure, .marbb > div, .cats, #plist, .staff, .qa details, .visit h2, .info > div").forEach((el) => { el.classList.add("rv"); io.observe(el); });
}
applyLang();
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
