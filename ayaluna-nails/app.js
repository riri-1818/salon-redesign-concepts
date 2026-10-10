// Ayaluna Nails — the parts that change: the set builder (price and time add up), the full menu, the gallery, today's hours. Language and Sydney-time helpers are in ds.js; motion uses GSAP.

/* the service menu, as on the current booking page: [name, description, price (null = price varies), minutes] */
const CATS = [
  { id: "biab", img: "c-biab", n: ["Builder gel", "ビルダージェル"], rows: [[["BIAB overlay", "BIAB オーバーレイ"], ["Involves applying a layer of builder gel onto natural nails", "自爪の上に、ビルダージェルを1層のせます"], 100, 60], [["BIAB infill", "BIAB インフィル"], ["It involves filling in the regrowth area near the cuticle with builder gel", "伸びてきた根元の部分を、ビルダージェルで埋めます"], 120, 90], [["Add Gel", "カラージェルの追加"], ["After BIAB gel manicure, add your favourite colour gel polish", "BIAB のあとに、お好きな色のジェルを重ねます"], 15, 20]] },
  { id: "gel", img: "c-gel", n: ["Japanese gel", "ジャパニーズジェル"], rows: [[["Japanese gel overlay", "ジャパニーズジェル オーバーレイ"], ["Involves applying a layer of Japanese gel onto natural nails", "自爪の上に、ジャパニーズジェルを1層のせます"], 95, 60], [["Japanese gel infill", "ジャパニーズジェル インフィル"], ["It involves filling in the regrowth area near the cuticle with Japanese gel", "伸びてきた根元の部分を、ジャパニーズジェルで埋めます"], 115, 80]] },
  { id: "art", img: "c-art", n: ["Nail art", "ネイルアート"], rows: [[["Art 15min", "アート 15分"], ["Simple art, or art on 1 nail each", "シンプルなアート、または片手1本ずつ"], null, 15], [["Art 30min", "アート 30分"], ["Nail art on 2 or 3 nails each", "片手2〜3本ずつ"], null, 30], [["Art 45min", "アート 45分"], ["Nail art on 3 or 4 nails each", "片手3〜4本ずつ"], null, 45], [["Art 60min", "アート 60分"], ["Nail art on all fingers", "すべての指に"], null, 60], [["French", "フレンチ"], null, 35, 15], [["Ombre", "オンブレ（グラデーション）"], null, 35, 30], [["Add Magnet gel", "マグネットジェルの追加"], null, 35, 20], [["Chrome powder", "クロームパウダー"], null, 35, 20]] },
  { id: "foot", img: "c-foot", n: ["Foot nails", "フットネイル"], rows: [[["Gel Pedicure", "ジェルペディキュア"], ["Including foot bath and cuticle care", "フットバスと甘皮のケアつき"], 105, 60], [["Gel Pedicure with gel removal", "ジェルペディキュア（ジェルオフつき）"], null, 125, 75], [["Ingrown nails care", "巻き爪のケア"], ["Ingrown toe nails care", "足の巻き爪のケアです"], 120, 60]] },
  { id: "ext", img: "c-ext", n: ["Extensions", "長さ出し"], rows: [[["Extension with tips", "チップでの長さ出し"], null, 180, 100], [["Extension with form", "フォームでの長さ出し"], null, 150, 120], [["Extension per finger with tip", "チップでの長さ出し（1本）"], null, 15, 15], [["Extension per finger with form", "フォームでの長さ出し（1本）"], null, 18, 15]] },
  { id: "rem", img: "c-removal", n: ["Removal", "オフ"], rows: [[["SNS removal", "SNS のオフ"], null, 45, 30], [["Gel removal", "ジェルのオフ"], null, 35, 30], [["Builder gel removal", "ビルダージェルのオフ"], null, 40, 40], [["Acrylic removal", "アクリルのオフ"], null, 55, 45]] },
  { id: "care", img: "c-care", n: ["Nails care", "ネイルケア"], rows: [[["Hand nail care", "ハンドのネイルケア"], null, 45, 40], [["Foot nails care", "フットのネイルケア"], null, 55, 45]] },
  { id: "other", img: "", n: ["Other", "そのほか"], rows: [[["Silk repair", "シルクリペア"], null, 10, 10], [["Fix", "お直し"], null, null, 30]] },
];
const R = (c, i) => CATS.find((x) => x.id === c).rows[i];
const BASE = [R("biab", 0), R("biab", 1), R("gel", 0), R("gel", 1), R("foot", 0), R("foot", 1), R("ext", 0), R("ext", 1), R("care", 0), R("care", 1)];
const ADD = [R("biab", 2), R("art", 4), R("art", 5), R("art", 6), R("art", 7), R("art", 0), R("art", 1), R("art", 2), R("art", 3), R("rem", 1), R("rem", 2), R("rem", 0), R("rem", 3), R("other", 0)];
const WORKS = [["w2", ["Natural nails with fine stripes and gold", "細いストライプと金のナチュラルネイル"]], ["w1", ["Aurora chrome", "オーロラのクローム"]], ["w13", ["French with hand-painted flowers", "手描きの花のフレンチ"]], ["w5", ["Silver glitter", "シルバーのグリッター"]], ["w3", ["Lavender swirls", "ラベンダーのうずまき"]], ["w8", ["Tortoiseshell and brown", "べっ甲とブラウン"]], ["w9", ["Pink chrome with flowers", "ピンクのクロームと花"]], ["w4", ["Blue with dots", "ブルーにドット"]], ["w10", ["Gold with dots", "ゴールドにドット"]], ["w7", ["Soft silver ombre", "やわらかなシルバーのオンブレ"]], ["w12", ["White marble", "白のマーブル"]], ["w11", ["Blue with stars", "ブルーに星"]], ["w6", ["Blue hearts", "ブルーのハート"]], ["w14", ["Pink with dots", "ピンクにドット"]]];
/* opening hours, Monday to Sunday */
const HOURS = [null, [600, 1080], [600, 1080], [600, 1080], [600, 1080], [600, 960], null];
const DAYS_L = [["Monday", "月曜"], ["Tuesday", "火曜"], ["Wednesday", "水曜"], ["Thursday", "木曜"], ["Friday", "金曜"], ["Saturday", "土曜"], ["Sunday", "日曜"]];
const NOW = sydney();
let base = 0; const adds = new Set(); let shown = 0, openCat = "biab";
const mins = (m) => { const h = Math.floor(m / 60), r = m % 60; return lang === "ja" ? (h ? h + "時間" : "") + (r ? r + "分" : "") : (h ? h + (h > 1 ? " hrs" : " hr") : "") + (h && r ? " " : "") + (r ? r + " mins" : ""); };
const money = (p) => p == null ? t(["Price varies", "デザインによる"]) : "$" + p;
const clock = (m) => lang === "ja" ? `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}` : `${(Math.floor(m / 60) + 11) % 12 + 1}${m % 60 ? ":" + String(m % 60).padStart(2, "0") : ""}${m < 720 ? "am" : "pm"}`;

function builder(bump) {
  $("#b-base").innerHTML = BASE.map((r, i) => `<button type="button" class="opt" role="radio" aria-checked="${i === base}" data-base="${i}"><b>${t(r[0])}</b><span>${money(r[2])}・${mins(r[3])}</span></button>`).join("");
  $("#b-add").innerHTML = ADD.map((r, i) => `<button type="button" class="opt opt--s" aria-pressed="${adds.has(i)}" data-add="${i}"><b>${t(r[0])}</b><span>${r[2] == null ? t(["price varies", "デザインによる"]) : "+$" + r[2]}・${mins(r[3])}</span></button>`).join("");
  const picked = [BASE[base], ...[...adds].sort((a, b) => a - b).map((i) => ADD[i])];
  const total = picked.reduce((a, r) => a + (r[2] || 0), 0), time = picked.reduce((a, r) => a + r[3], 0), varies = picked.some((r) => r[2] == null);
  $("#t-lines").innerHTML = picked.map((r, i) => `<li><span>${t(r[0])}</span><b>${i && r[2] != null ? "+ " : ""}${money(r[2])}</b></li>`).join("");
  $("#t-plus").textContent = varies ? t([" + art", "＋アート代"]) : "";
  $("#t-time").textContent = t(["About ", "約"]) + mins(time);
  const el = $("#t-price"), o = { v: shown };
  if (bump && window.gsap && !reduce) { gsap.killTweensOf(o); gsap.to(o, { v: total, duration: .5, ease: "power2.out", onUpdate: () => { el.textContent = "$" + Math.round(o.v); }, onComplete: () => { el.textContent = "$" + total; } }); gsap.from("#t-lines li:last-child", { x: -12, opacity: 0, duration: .3, clearProps: "transform,opacity" }); } else el.textContent = "$" + total;
  shown = total;
}
function cats() {
  $("#cats").innerHTML = CATS.map((c) => `<div class="cat${c.id === openCat ? " is-open" : ""}"><button type="button" class="cat-h" aria-expanded="${c.id === openCat}" data-cat="${c.id}">${c.img ? `<img loading="lazy" src="img/${c.img}.jpg" width="400" height="520" alt="">` : "<span></span>"}<b>${t(c.n)}</b><i></i></button><div class="cat-b"><ul>${c.rows.map((r) => `<li><div><h4>${t(r[0])}</h4>${r[1] ? `<p>${t(r[1])}</p>` : ""}</div><span>${mins(r[3])}</span><b>${money(r[2])}</b></li>`).join("")}</ul></div></div>`).join("");
}
function strip() { $("#strip").innerHTML = WORKS.map((w) => `<li><figure><img src="img/${w[0]}.jpg" width="520" height="693" alt="${t(w[1])}"><figcaption>${t(w[1])}</figcaption></figure></li>`).join(""); }
function hours() {
  const h = HOURS[NOW.d], on = h && NOW.m >= h[0] && NOW.m < h[1];
  let i = 1; while (!HOURS[(NOW.d + i) % 7]) i++;
  const nx = DAYS_L[(NOW.d + i) % 7];
  $("#today").innerHTML = `<i class="${on ? "on" : ""}"></i>` + (on ? t([`Open today until ${clock(h[1])}`, `本日は ${clock(h[1])} まで営業しています`]) : h && NOW.m < h[0] ? t(["Opens today at 10am", "本日は 10:00 から営業します"]) : t([`Closed now. Opens ${i === 1 ? "tomorrow" : nx[0]} at 10am`, `ただいま時間外です。次は${i === 1 ? "明日" : nx[1]} 10:00 からです`]));
  $("#hours").innerHTML = [[["Tuesday to Friday", "火〜金"], ["10:00am to 6:00pm", "10:00〜18:00"]], [["Saturday", "土"], ["10:00am to 4:00pm", "10:00〜16:00"]], [["Sunday and Monday", "日・月"], ["closed", "お休み"]]].map((r) => `${t(r[0])}${t([": ", "　"])}${t(r[1])}`).join("<br>");
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-base]"); if (b) { base = +b.dataset.base; builder(true); return; }
  const a = e.target.closest("[data-add]"); if (a) { const i = +a.dataset.add; adds.has(i) ? adds.delete(i) : adds.add(i); builder(true); return; }
  const c = e.target.closest("[data-cat]"); if (c) { openCat = openCat === c.dataset.cat ? "" : c.dataset.cat; for (const el of $$(".cat")) { const on = el.firstElementChild.dataset.cat === openCat; el.classList.toggle("is-open", on); el.firstElementChild.setAttribute("aria-expanded", on); } }
});
onRender(() => { builder(false); cats(); strip(); hours(); });
applyLang();

/* motion (GSAP). Everything is visible without it. */
if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".fr", { y: 60, opacity: 0, rotate: (i) => [-6, 0, 6][i], duration: .9, stagger: .12, clearProps: "transform,opacity" })
    .from(".hero-copy > *", { y: 18, opacity: 0, duration: .55, stagger: .08, clearProps: "transform,opacity" }, .2);
  /* the moon in the header fills as you read down the page */
  gsap.to(".top .moon", { "--phase": 1, ease: "none", scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: .4 } });
  gsap.from(".strip li", { x: 70, opacity: 0, duration: .6, stagger: .06, ease: "power2.out", clearProps: "transform,opacity", scrollTrigger: { trigger: "#strip", start: "top 88%", once: true } });
  gsap.from(".cat", { y: 20, opacity: 0, duration: .45, stagger: .05, ease: "power2.out", clearProps: "transform,opacity", scrollTrigger: { trigger: "#cats", start: "top 88%", once: true } });
  ScrollTrigger.batch(".sec-head > *, .steps fieldset, .tally, .all-h, .logo, .story-copy > *, .facts > div, .partners", { start: "top 92%", once: true, onEnter: (els) => gsap.from(els, { y: 22, opacity: 0, duration: .5, stagger: .05, ease: "power2.out", clearProps: "transform,opacity" }) });
}
