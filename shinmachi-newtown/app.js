// Shinmachi Newtown — 今夜の板・印で絞るメニュー・ラーメンを組み立てる・灯りがともる最初の画面。言語とシドニーの時刻は ds.js
const G = window.gsap;
if (G) G.registerPlugin(ScrollTrigger, SplitText, Flip);
const root = document.documentElement;

onRender(() => {
  document.title = lang === "ja" ? "Shinmachi Newtown | Newtown の日本の創作料理・タパス・ラーメン" : "Shinmachi Newtown | Japanese fusion tapas and ramen on King St";
  tick(); week(); hoursList(); renderMenu(false); bowls(); extras(); receipt(false);
});

// ---------- 営業時間（いまのサイトのとおり。分で持つ） ----------
// sydney().d は 月=0 … 日=6
const H = [
  [[1050, 1230]], [[1050, 1230]], [[1050, 1230]], [[1050, 1230]], [[1050, 1245]],
  [[690, 840], [1050, 1245]], [[690, 840], [1050, 1230]],
];
const HH = [1050, 1110];   // ハッピーアワー 5:30pm〜6:30pm（毎日）
const DAY = { en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], ja: ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"] };
const DAY3 = { en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], ja: ["月", "火", "水", "木", "金", "土", "日"] };
const SITE = ["5:30pm - 8:30 pm", "5:30pm - 8:30 pm", "5:30pm - 8:30 pm", "5:30pm - 8:30 pm", "5:30pm - 8:45 pm", "11:30am - 2:00pm<br>5:30pm - 8:45 pm", "11:30am - 2:00pm<br>5:30pm - 8:30 pm"];
const hm = (m) => { const h = Math.floor(m / 60), mm = m % 60, h12 = ((h + 11) % 12) + 1; return `${h12}:${String(mm).padStart(2, "0")}${h < 12 ? "am" : "pm"}`; };

function tick() {
  const { d, m } = sydney();
  $("#clock").textContent = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const open = H[d].find(([a, b]) => m >= a && m < b);
  let s;
  if (open) s = lang === "en" ? `<b>Open now</b> · until ${hm(open[1])}` : `<b>営業中</b> · ${hm(open[1])} まで`;
  else {
    let nd = d, nm = H[d].find(([a]) => a > m), k = 0;
    while (!nm) { k++; nd = (d + k) % 7; nm = H[nd][0]; }
    const when = k === 0 ? (lang === "en" ? "today" : "今日") : k === 1 ? (lang === "en" ? "tomorrow" : "明日") : t([DAY.en[nd], DAY.ja[nd]]);
    s = lang === "en" ? `Closed now · opens ${hm(nm[0])} ${when}` : `ただいま準備中 · ${when} ${hm(nm[0])} から`;
  }
  $("#state").innerHTML = s;
  let hh;
  if (m >= HH[0] && m < HH[1]) hh = lang === "en" ? `Happy hour now · <b>${HH[1] - m} min</b> left` : `ハッピーアワー中 · あと <b>${HH[1] - m}分</b>`;
  else if (m < HH[0]) hh = lang === "en" ? `Happy hour today from <b>5:30pm</b>` : `今日のハッピーアワーは <b>5:30pm</b> から`;
  else hh = lang === "en" ? `Happy hour again tomorrow, <b>5:30pm</b>` : `次のハッピーアワーは明日 <b>5:30pm</b> から`;
  $("#hh").innerHTML = hh;
}
function week() {
  const { d } = sydney(), lo = 660, hi = 1260, pct = (v) => ((v - lo) / (hi - lo)) * 100;
  $("#week").innerHTML = H.map((ss, i) => `<li class="day${i === d ? " today" : ""}"><span class="day__n">${t([DAY3.en[i], DAY3.ja[i]])}</span><span class="day__bar" aria-hidden="true">${ss.map(([a, b]) => `<i style="top:${pct(a)}%;height:${pct(b) - pct(a)}%"></i>`).join("")}<i class="hh" style="top:${pct(HH[0])}%;height:${pct(HH[1]) - pct(HH[0])}%"></i></span><span class="sr">${t([DAY.en[i], DAY.ja[i]])}: ${SITE[i].replace("<br>", ", ")}</span></li>`).join("");
}
function hoursList() {
  const { d } = sydney();
  $("#hours").innerHTML = SITE.map((s, i) => `<div class="${i === d ? "today" : ""}"><dt>${t([DAY.en[i], DAY.ja[i]])}</dt><dd>${s}</dd></div>`).join("");
}

// ---------- メニュー：分類と印で絞り込む ----------
const SECS = {
  tapas: ["From the sea (cold)", "Meat and bird (hot)", "Plant based (hot)"],
  ramen: ["Pork ramen", "Vegan ramen"], sets: ["Sets", "Extra"],
  drink: ["Beer", "Sake", "Sparkling Sake", "Wine", "Highball", "Cocktails", "Spirits", "Non-alcoholic"],
};
const CATJA = { "From the sea (cold)": "海から（冷たい料理）", "Meat and bird (hot)": "肉と鶏（温かい料理）", "Plant based (hot)": "植物性（温かい料理）（V）", "Pork ramen": "豚骨ラーメン", "Vegan ramen": "ヴィーガンラーメン", Sets: "セット", Extra: "追加",
  Beer: "ビール", Sake: "日本酒", "Sparkling Sake": "スパークリング日本酒", Wine: "ワイン", Highball: "ハイボール", Cocktails: "カクテル", Spirits: "スピリッツ", "Non-alcoholic": "ノンアルコール" };
const CATEN = { "Plant based (hot)": "Plant based (hot) (V)" };
// 「Vegan ramen」の品は分類の名前どおり V として扱う
FOOD.forEach((x) => { if (x.c === "Vegan ramen" && !x.t.includes("V")) x.t = ["V", ...x.t]; });
let sec = "tapas"; const marks = new Set();
const all = () => (sec === "drink" ? DRINK : FOOD);
const price = (p) => (!p ? (lang === "en" ? "Ask" : "お店に確認") : p.startsWith("+") ? "+$" + p.slice(1) : "$" + p);
function renderMenu(anim) {
  const list = $("#list"), items = all().filter((x) => SECS[sec].includes(x.c));
  const st = anim && G && !reduce ? Flip.getState(".item") : null;
  list.innerHTML = SECS[sec].map((c) => {
    const rows = items.filter((x) => x.c === c);
    return `<div class="grp"><h3 class="grp__h">${lang === "en" ? CATEN[c] || c : CATJA[c]}</h3>${rows.map((x) => {
      const off = marks.size && ![...marks].every((k) => x.t.includes(k));
      return `<div class="item${off ? " off" : ""}" data-flip-id="${esc(x.n)}"><p class="item__r"><span class="item__n">${esc(x.n)}${x.t.length ? `<span class="item__t">${x.t.map((k) => `<b>${k}</b>`).join("")}</span>` : ""}</span><span class="item__dots" aria-hidden="true"></span><span class="item__p">${price(x.p)}</span></p>${x.d.length ? `<p class="item__d">${x.d.map(esc).join("<br>")}</p>` : ""}</div>`;
    }).join("")}</div>`;
  }).join("");
  $$(".grp", list).forEach((g) => { if (!$(".item:not(.off)", g)) g.hidden = true; });
  const n = $$(".item:not(.off)", list).length;
  if (!n) list.insertAdjacentHTML("beforeend", `<p class="none">${sec === "drink" ? (lang === "en" ? "The V, GF and NF marks are on the food menu." : "V・GF・NF の印は、料理のメニューについています。") : (lang === "en" ? "No dishes carry all of these marks." : "選んだ印がすべてつく料理はありません。")}</p>`);
  $("#count").textContent = lang === "en" ? `${n} ${sec === "drink" ? "drinks" : "dishes"}${marks.size ? " marked " + [...marks].join(" + ") : ""}` : `${n}${sec === "drink" ? "品（飲み物）" : "品"}${marks.size ? "（" + [...marks].join("・") + "）" : ""}`;
  if (st) Flip.from(st, { duration: 0.45, ease: "power2.inOut", targets: ".item", onEnter: (els) => G.fromTo(els, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.015, clearProps: "all" }) });
}
$$(".tab").forEach((b) => b.addEventListener("click", () => {
  sec = b.dataset.sec; $$(".tab").forEach((x) => x.setAttribute("aria-selected", x === b)); renderMenu(true);
}));
$$(".mk").forEach((b) => b.addEventListener("click", () => {
  const k = b.dataset.mk; marks.has(k) ? marks.delete(k) : marks.add(k);
  b.setAttribute("aria-pressed", marks.has(k)); renderMenu(true);
}));

// ---------- ラーメンを組み立てる ----------
const BOWLS = FOOD.filter((x) => x.c === "Pork ramen" || x.c === "Vegan ramen");
const EXTRAS = FOOD.filter((x) => x.c === "Extra").flatMap((x) => x.n.split(/,\s*/).map((n) => ({ n, p: +x.p })));
let bowlI = 0; const picked = new Set(); let shown = 0;
function bowls() {
  $("#bowls").innerHTML = BOWLS.map((x, i) => `<button type="button" class="bowl" role="radio" aria-checked="${i === bowlI}" data-i="${i}"><span class="bowl__n"><span>${esc(x.n)}${x.c === "Vegan ramen" ? '<span class="bowl__v">V</span>' : ""}</span><i>$${x.p}</i></span><span class="bowl__b">${esc(x.d[0] || "")}</span></button>`).join("");
}
function extras() {
  $("#extras").innerHTML = EXTRAS.map((x, i) => `<button type="button" class="ex" aria-pressed="${picked.has(i)}" data-i="${i}">${esc(x.n)}<i>+$${x.p}</i></button>`).join("");
}
function receipt(anim) {
  const b = BOWLS[bowlI], rows = [[b.n, +b.p], ...[...picked].sort((a, c) => a - c).map((i) => ["+ " + EXTRAS[i].n, EXTRAS[i].p])];
  $("#receipt").innerHTML = rows.map(([n, p]) => `<li><span>${esc(n)}</span><span>$${p}</span></li>`).join("");
  const total = rows.reduce((s, r) => s + r[1], 0), el = $("#total");
  if (anim && G && !reduce) { const o = { v: shown }; G.to(o, { v: total, duration: 0.4, ease: "power2.out", onUpdate: () => { el.textContent = "$" + Math.round(o.v); } }); }
  else el.textContent = "$" + total;
  shown = total;
}
$("#bowls").addEventListener("click", (e) => { const b = e.target.closest(".bowl"); if (!b) return; bowlI = +b.dataset.i; $$(".bowl").forEach((x) => x.setAttribute("aria-checked", x === b)); receipt(true); });
$("#extras").addEventListener("click", (e) => { const b = e.target.closest(".ex"); if (!b) return; const i = +b.dataset.i; picked.has(i) ? picked.delete(i) : picked.add(i); b.setAttribute("aria-pressed", picked.has(i)); receipt(true); });

// ---------- ヘッダー・いま読んでいる章 ----------
const nav = $("#nav"), menuBtn = $(".menu-btn");
menuBtn.addEventListener("click", () => { const o = !nav.classList.contains("open"); nav.classList.toggle("open", o); menuBtn.setAttribute("aria-expanded", o); });
nav.addEventListener("click", (e) => { if (e.target.closest("a")) { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) $$("#nav a").forEach((a) => (a.getAttribute("href") === "#" + e.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"))); }), { rootMargin: "-45% 0px -50% 0px" });
  ["tonight", "menu", "ramen", "about", "visit"].forEach((id) => io.observe(document.getElementById(id)));
}

// ---------- 写真：早めに読む・現れる・ゆっくり動く ----------
function photos() {
  const lazy = $$('img[loading="lazy"]');
  if ("IntersectionObserver" in window) {
    const lio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.loading = "eager"; lio.unobserve(e.target); } }), { rootMargin: "1500px 0px" });
    lazy.filter((i) => !i.closest(".reel")).forEach((i) => lio.observe(i));
    const rio = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { $$(".reel img").forEach((i) => { i.loading = "eager"; }); rio.disconnect(); } }, { rootMargin: "1500px 0px" });
    rio.observe($(".reel"));
  } else lazy.forEach((i) => { i.loading = "eager"; });
  if (!("IntersectionObserver" in window) || reduce) { $$(".reveal").forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
  $$(".reveal").forEach((e) => io.observe(e));
  if (G) {
    G.to(".tonight__ph img", { scale: 1.08, ease: "none", scrollTrigger: { trigger: ".tonight", start: "top top", end: "bottom top", scrub: true } });
    G.fromTo(".reel__row", { x: 40 }, { x: -40, ease: "none", scrollTrigger: { trigger: ".reel", start: "top bottom", end: "bottom top", scrub: 0.5 } });
  }
}

// ---------- 開くとき：暗い店内に灯りがともる ----------
function opening() {
  const op = $(".opening"); let tl = null;
  const finish = () => { if (!op.isConnected) return; op.remove(); root.classList.remove("op"); ["click", "keydown", "wheel", "touchstart", "scroll"].forEach((x) => removeEventListener(x, skip)); hello(); };
  const skip = () => { if (tl) tl.kill(); finish(); };
  if (!root.classList.contains("op") || !G || reduce || location.hash) { finish(); return; }
  const s = new SplitText(".op-word", { type: "chars" });
  tl = G.timeline({ onComplete: finish });
  tl.from(s.chars, { opacity: 0, y: 14, duration: 0.4, stagger: 0.04, ease: "power2.out" })
    .to(".op-img", { filter: "brightness(1) saturate(1)", duration: 0.9, ease: "power2.inOut" }, "-=0.1")
    .to(".op-word", { opacity: 0, duration: 0.3 }, "-=0.35")
    .to(op, { opacity: 0, duration: 0.35 });
  setTimeout(() => ["click", "keydown", "wheel", "touchstart", "scroll"].forEach((x) => addEventListener(x, skip, { passive: true, once: true })), 120);
}
function hello() {
  if (!G || reduce) return;
  G.from(".board > *", { opacity: 0, y: 14, duration: 0.5, stagger: 0.06, ease: "power2.out", clearProps: "all" });
}

// ---------- はじめる ----------
applyLang();
renderMenu(false); bowls(); extras(); receipt(false);
photos();
opening();
setInterval(tick, 30000);
