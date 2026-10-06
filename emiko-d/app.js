// Emiko D — interaction. With "reduce motion" on, everything is simply shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (p) => p[lang === "en" ? 0 : 1];

// Prices from the Pricing page: [bride only, + one person, + two people]
const INC = { consult: ["Personalised consultation before the day", "当日までの個別のご相談"], day: ["Wedding day hair styling and make-up", "当日のヘアスタイリングとメイク"], trial: ["A trial session, to see the complete look", "リハーサル（仕上がりを事前に確認）"], refine: ["Refinement of your chosen look", "選んだスタイルの仕上げ調整"], touch: ["On-site touch-up at one location", "会場でのお直し（1か所）"], change: ["Hair change for the reception or evening", "披露宴・夜のためのヘアチェンジ"], extended: ["Extended styling time through key moments", "大切な場面に合わせた、長めのスタイリング時間"], two: ["Hair and make-up for both brides", "お二人分のヘアとメイク"] };
const COLLS = [
  { n: ["The Signature Bride", "シグネチャー"], p: [690, 1090, 1440], from: false, d: ["A bespoke bridal hairstyle and make-up, created exclusively for your wedding day.", "結婚式当日のためだけに仕立てる、ヘアスタイルとメイク。"], inc: ["consult", "day"] },
  { n: ["The Couture Bride", "クチュール"], p: [1090, 1490, 1840], from: false, d: ["For the bride who wants to see the complete look before the big day.", "当日の前に、仕上がりを一度見ておきたい方へ。"], inc: ["trial", "refine", "day"] },
  { n: ["The Bespoke Premium Bride", "ビスポーク・プレミアム"], p: [1490, 1840, 2190], from: true, d: ["For brides who want to look impeccable from ceremony to celebration.", "挙式から披露宴まで、ずっと美しくいたい方へ。"], inc: ["trial", "day", "touch", "change", "extended"] },
  { n: ["Signature Bride × Bride", "シグネチャー（Bride × Bride）"], p: [1190], from: false, d: ["Bespoke hairstyle and make-up for two brides, for an LGBT wedding.", "お二人の花嫁さまのための、ヘアスタイルとメイク。"], inc: ["consult", "two"] },
];
const EXTRA = [["Just me", "わたしだけ"], ["One more person", "もう1名"], ["Two more people", "もう2名"]];
const HELPS = [["Getting ready and keeping things organised", "お支度と、段取りのお手伝い"], ["Helping with your dress and accessories", "ドレスや小物のお手伝い"], ["Looking after small personal items", "身の回りの小さな持ち物のお預かり"], ["Calming those pre-wedding nerves", "式の前の緊張をやわらげる"], ["Accompanying you for photographs", "写真撮影への付き添い"], ["Simply sitting with you, sharing the excitement of your day", "ただそばに座って、その日のうれしさを一緒に"]];
const CHIPS = [["Registry, micro and elopement weddings", "レジストリー婚・少人数婚・エロープメント"], ["Pre-wedding photoshoots", "前撮り"], ["School formals and graduations", "フォーマル・卒業式"], ["Corporate functions and photoshoots", "企業イベント・撮影"], ["Red carpet events", "レッドカーペット"], ["Birthdays, anniversaries and hens parties", "誕生日・記念日・ヘンズパーティー"], ["Maternity shoots", "マタニティ撮影"], ["Media appearances", "メディア出演"]];
let coll = 0, extra = 0;
const fmt = (n) => "$" + n.toLocaleString("en-AU");
function render(animate = true) {
  const c = COLLS[coll]; if (c.p.length === 1) extra = 0;
  $(".colls").innerHTML = COLLS.map((x, i) => `<button type="button" role="radio" aria-checked="${i === coll}" data-i="${i}"><b>${t(x.n)}</b><span>${x.from ? (lang === "ja" ? fmt(x.p[0]) + "〜" : "from " + fmt(x.p[0])) : fmt(x.p[0])}</span></button>`).join("");
  $(".extra").innerHTML = EXTRA.map((x, i) => `<button type="button" role="radio" aria-checked="${i === extra}" data-i="${i}" ${c.p.length === 1 && i ? "disabled" : ""}>${t(x)}</button>`).join("");
  const price = c.p[extra], from = c.from && extra === 0;
  $("#t-name").textContent = t(c.n) + (extra ? " + " + extra : ""); $("#t-price").textContent = from ? (lang === "ja" ? fmt(price) + "〜" : "from " + fmt(price)) : fmt(price); $("#t-desc").textContent = t(c.d);
  $("#t-list").innerHTML = c.inc.map((k, i) => `<li style="--d:${i * 70}ms">${t(INC[k])}</li>`).join("") + (extra ? `<li style="--d:${c.inc.length * 70}ms">${t([`Hair and make-up for ${extra === 1 ? "one more person" : "two more people"} (bridesmaid, mother, sister, mother-in-law)`, `もう${extra}名さまのヘアとメイク（ブライズメイド、お母さま、ご姉妹など）`])}</li>` : "");
  $("#t-note").textContent = coll === 2 ? t(["Touch-up: an extra fee may apply depending on the location.", "お直しは、場所によって追加料金がかかる場合があります。"]) : coll === 3 ? t(["Extra people: please ask.", "ご一緒の方の追加は、お問い合わせください。"]) : "";
  if (animate && !reduce) { const el = $(".ticket"); el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); }
}
$(".colls").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { coll = +b.dataset.i; render(); } });
$(".extra").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b && !b.disabled) { extra = +b.dataset.i; render(); } });
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-en]").forEach((el) => { el.alt = lang === "en" ? el.dataset.altEn : el.dataset.altJa; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  $("#helps").innerHTML = HELPS.map((h, i) => `<li style="--d:${i * 80}ms">${t(h)}</li>`).join(""); $("#chips").innerHTML = CHIPS.map((c) => `<li>${t(c)}</li>`).join("");
  render(false);
}
$(".lang").addEventListener("click", () => { lang = lang === "en" ? "ja" : "en"; applyLang(); });
applyLang();
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else { const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" }); $$(".sec-head, .builder, .reel figure, .companion > div, .helps, .m-card, .em figure, .em > div, .contact").forEach((el) => { el.classList.add("rv"); io.observe(el); }); }
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
