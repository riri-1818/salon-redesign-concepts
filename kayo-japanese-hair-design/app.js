// Kayo Japanese Hair Design — 動きの部分。「動きを減らす」設定の人には、動かさずに全部表示する。
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (pair) => pair[lang === "ja" ? 1 : 0];

/* ---------- データ（料金は現サイトの料金ページより。"~" は「〜から」、"+" は「以上」） ---------- */
const LENS = [["Short", "ショート"], ["Bob", "ボブ"], ["Medium", "ミディアム"], ["Long", "ロング"], ["Very long", "ベリーロング"]];
const GROUPS = [
  { key: "cut", name: ["Cut & blow-dry", "カット・ブロー"], rows: [
    { id: "cut", n: ["Ladies cut, shampoo & blow-dry", "レディースカット（シャンプー・ブロー込み）"], d: ["About 60 minutes", "約60分"], p: ["75~", "75~", "82~", "90~", "100+"] },
    { n: ["Men’s style cut, shampoo & blow-dry", "メンズカット（シャンプー・ブロー込み）"], flat: "68" },
    { n: ["Men’s style dry cut", "メンズ ドライカット"], flat: "52" },
    { n: ["Kids cut, up to Year 4", "キッズカット（Year 4 まで）"], d: ["Dry cut only, 30 minutes", "ドライカットのみ、30分"], flat: "45" },
    { n: ["Fringe cut", "前髪カット"], d: ["5–10 minutes, no booking needed", "5〜10分、予約不要"], flat: "15+" },
    { n: ["Shampoo & blow-dry", "シャンプー・ブロー"], d: ["30 minutes", "30分"], p: ["44", "44", "50", "55", null] },
  ] },
  { key: "colour", name: ["Colour", "カラー"], rows: [
    { n: ["Retouch colour (up to 3 cm), shampoo & blow-dry", "リタッチカラー（3cmまで）＋シャンプー・ブロー"], d: ["About 1.5 hours", "約1.5時間"], p: ["110~", "110~", "120~", "130~", "145~"] },
    { id: "colour", n: ["Full colour, shampoo & blow-dry", "フルカラー＋シャンプー・ブロー"], p: ["130~", "140~", "150~", "160~", "175~"] },
    { n: ["Full colour with cut, shampoo & blow-dry", "フルカラー＋カット＋シャンプー・ブロー"], d: ["About 2 hours", "約2時間"], p: ["175~", "185~", "195~", "205~", "220~"] },
    { n: ["Half highlights (fewer than 30 foils)", "ハーフハイライト（ホイル30枚未満）"], d: ["Cut, base colour, shampoo and blow-dry not included", "カット・ベースカラー・シャンプーブローは含みません"], p: ["110+", "120+", "130+", "140+", "155+"] },
  ] },
  { key: "straight", name: ["Japanese straightening", "縮毛矯正"], note: ["Deep wave or very curly hair can take four to six hours; please come in for a quote.", "強いくせ毛は4〜6時間かかる場合があります。ご来店のうえお見積りします。"], rows: [
    { n: ["Shiseido Magic Straight, retouch (within 6 months) with cut", "資生堂 縮毛矯正 リタッチ（6か月以内）＋カット"], d: ["Shampoo & blow-dry included, about 3 hours", "シャンプー・ブロー込み、約3時間"], p: ["290~", "290~", "310~", "330~", "350~"] },
    { id: "straight", n: ["Shiseido Magic Straight, full head with cut", "資生堂 縮毛矯正 全体＋カット"], d: ["Shampoo & blow-dry included, about 3 hours", "シャンプー・ブロー込み、約3時間"], p: ["310~", "310~", "330~", "350~", "390~"] },
  ] },
  { key: "perm", name: ["Perm", "パーマ"], rows: [
    { id: "perm", n: ["Shiseido digital perm with cut", "資生堂 デジタルパーマ＋カット"], d: ["Shampoo & blow-dry included, about 3 hours", "シャンプー・ブロー込み、約3時間"], p: [null, "270~", "280~", "295~", "320~"] },
    { n: ["Cold perm with cut (ladies)", "コールドパーマ＋カット（レディース）"], d: ["Shampoo & blow-dry included, 2 to 2.5 hours", "シャンプー・ブロー込み、2〜2.5時間"], p: ["205~", "215~", "225~", "240~", "255~"] },
    { n: ["Cold perm with cut (men)", "コールドパーマ＋カット（メンズ）"], flat: "195~" },
  ] },
  { key: "treat", name: ["Treatment", "トリートメント"], rows: [
    { id: "keratin", n: ["Keratin Therapy treatment with cut", "ケラチンセラピー＋カット"], d: ["Shampoo & blow-dry included, about 3 hours", "シャンプー・ブロー込み、約3時間"], p: ["350~", "350~", "370~", "390~", null] },
    { n: ["Napla 3-step treatment, shampoo & blow-dry", "Napla 3ステップトリートメント＋シャンプー・ブロー"], d: ["45 minutes to 1 hour", "45分〜1時間"], p: ["82~", "87~", "92~", "97~", "102~"] },
    { n: ["Cureplex hair repair treatment", "Cureplex ヘアリペア トリートメント"], d: ["Two steps plus a take-home No. 3. Shampoo & blow-dry not included", "2ステップ＋ホームケア用 No.3 付き。シャンプー・ブローは含みません"], p: [null, "84+", "89+", "94+", "99+"] },
  ] },
];
const ROW = Object.fromEntries(GROUPS.flatMap((g) => g.rows).filter((r) => r.id).map((r) => [r.id, r]));
// えらぶ欄のメニュー。wave＝髪の図のうねり、tint＝毛先の色
const SERVICES = [
  { id: "straight", label: ["Japanese straightening", "縮毛矯正"], title: ["Shiseido Japanese Magic Straight", "資生堂の縮毛矯正"], wave: 0, tint: 0,
    body: ["Full head with cut, shampoo and blow-dry. If your hair is bleached or highlighted, please come in for a free five-minute consultation before you book.", "全体＋カット＋シャンプー・ブロー。ブリーチやハイライトをしている方は、ご予約の前に5分の無料相談にお越しください。"], time: ["About 3 hours", "約3時間"] },
  { id: "perm", label: ["Digital perm", "デジタルパーマ"], title: ["Shiseido Japanese digital perm", "資生堂のデジタルパーマ"], wave: 1, tint: 0,
    body: ["With cut, shampoo and blow-dry.", "カット＋シャンプー・ブロー込み。"], time: ["About 3 hours", "約3時間"], none: ["Digital perms start from bob length.", "デジタルパーマはボブの長さからです。"] },
  { id: "keratin", label: ["Smoother, less frizz", "うねり・広がりを抑える"], title: ["Keratin Therapy treatment", "ケラチンセラピー"], wave: 0.12, tint: 0,
    body: ["A smoothing treatment, with cut, shampoo and blow-dry.", "うねりや広がりを抑えるトリートメント。カット＋シャンプー・ブロー込み。"], time: ["About 3 hours", "約3時間"], none: ["For very long hair, please ask us for a quote.", "ベリーロングの方は、お見積りしますのでお尋ねください。"] },
  { id: "colour", label: ["Colour", "カラー"], title: ["Full colour", "フルカラー"], wave: 0.35, tint: 1,
    body: ["With shampoo and blow-dry. Retouch colour and highlights are in the full price list.", "シャンプー・ブロー込み。リタッチとハイライトは料金表にあります。"], time: ["", ""] },
  { id: "cut", label: ["Cut", "カット"], title: ["Ladies cut with shampoo and blow-dry", "レディースカット（シャンプー・ブロー込み）"], wave: 0.18, tint: 0,
    body: ["Includes a ten-minute consultation. Men’s and kids’ cuts are in the full price list.", "10分のカウンセリング込み。メンズ・キッズは料金表にあります。"], time: ["About 60 minutes", "約60分"] },
];
const HOURS = [ // 月曜はじまり。null＝定休
  [["Mon", "月"], 9.5, 19], [["Tue", "火"], 9.5, 19], [["Wed", "水"], 9.5, 19], [["Thu", "木"], 9.5, 20], [["Fri", "金"], 9.5, 20], [["Sat", "土"], 9, 18], [["Sun & public holidays", "日・祝"], null, null],
];
let len = 2, svc = 0;

const price = (s) => {
  if (!s) return null;
  const n = parseInt(s, 10), from = s.endsWith("~"), plus = s.endsWith("+");
  return { n, from, plus, html: lang === "ja" ? `$${n}${from ? "<small>〜</small>" : plus ? "+" : ""}` : `${from ? "<small>from</small> " : ""}$${n}${plus ? "+" : ""}` };
};
const hhmm = (h) => `${Math.floor(h)}:${h % 1 ? "30" : "00"}`;

/* ---------- 言語 ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-en]").forEach((el) => { el.alt = lang === "ja" ? el.dataset.altJa : el.dataset.altEn; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  document.title = lang === "ja" ? "Kayo Japanese Hair Design｜Chatswood の縮毛矯正・デジタルパーマ" : "Kayo Japanese Hair Design | Japanese straightening & digital perm, Chatswood";
  buildLengths(); buildServices(); showResult(false); buildPrices(); buildWeek();
}
$(".lang").addEventListener("click", () => { lang = lang === "ja" ? "en" : "ja"; applyLang(); });

/* ---------- 最初の画面：髪の線が、うねりとまっすぐを行き来する（一定の速さ） ---------- */
const cv = $("#strands"), cx = cv.getContext("2d");
let cw = 0, ch = 0, heroOn = true, heroRaf = 0;
function sizeHero() { const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); cw = r.width; ch = r.height; cv.width = cw * d; cv.height = ch * d; cx.setTransform(d, 0, 0, d, 0, 0); drawHero(performance.now()); }
function drawHero(now) {
  cx.clearRect(0, 0, cw, ch);
  const n = cw < 700 ? 7 : 11, k = reduce ? 0.55 : 0.5 + 0.5 * Math.sin(now / 2600); // 0＝まっすぐ 1＝ウェーブ
  for (let i = 0; i < n; i++) {
    const y0 = ch * (0.16 + (0.7 * i) / (n - 1)), amp = (10 + (i % 3) * 5) * k, ph = i * 0.9 + (reduce ? 0 : now / 2200);
    cx.beginPath();
    for (let x = -10; x <= cw + 10; x += 14) {
      const y = y0 + Math.sin(x / (90 + (i % 4) * 16) + ph) * amp + Math.sin(x / 37 + i) * amp * 0.18;
      x < 0 ? cx.moveTo(x, y) : cx.lineTo(x, y);
    }
    cx.strokeStyle = i % 4 === 1 ? "rgba(29,106,150,.20)" : "rgba(154,90,20,.16)"; cx.lineWidth = i % 3 === 0 ? 2 : 1.2; cx.stroke();
  }
}
function heroLoop(now) { if (!heroOn) { heroRaf = 0; return; } drawHero(now); heroRaf = requestAnimationFrame(heroLoop); }
new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; if (heroOn && !heroRaf && !reduce) heroRaf = requestAnimationFrame(heroLoop); }).observe(cv);
addEventListener("resize", sizeHero);

/* ---------- 髪の図：長さ・うねり・色が、選んだ内容に合わせて変わる ---------- */
const N = 30, LEN_Y = [150, 186, 236, 304, 384], CROWN = 34;
const hair = $("#hair"), NS = "http://www.w3.org/2000/svg";
const paths = Array.from({ length: N }, () => { const p = document.createElementNS(NS, "path"); p.setAttribute("class", "strand"); hair.appendChild(p); return p; });
const cur = { y: LEN_Y[2], wave: 0, tint: 0 }, goal = { ...cur };
let hairRaf = 0;
function drawHair() {
  for (let i = 0; i < N; i++) {
    const u = (i / (N - 1)) * 2 - 1, side = Math.sign(u) || 1, a = Math.abs(u);
    const endY = cur.y - a * a * 18 + ((i * 7) % 5) * 2.2;            // 外側ほど少し短く、毛先は不ぞろいに
    const steps = 18; let d = "";
    for (let s = 0; s <= steps; s++) {
      const top = CROWN + a * a * 16, k = s / steps, y = top + (endY - top) * k;
      const headW = 26 + 32 * Math.sin(Math.min(1, (y - CROWN) / 58) * Math.PI / 2); // 頭の丸み（つむじは幅を持たせる）
      const below = Math.max(0, y - 150) / 240;                                   // 肩から下でゆるく広がる
      let x = 150 + u * (headW + below * 26) + side * a * 4;
      const grow = Math.max(0, (y - 96) / 120);                                   // うねりは耳の下から
      x += Math.sin(y / 15 + i * 1.7) * 7.5 * cur.wave * Math.min(1, grow) + Math.sin(y / 46 + i) * 1.6;
      d += (s ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    paths[i].setAttribute("d", d);
  }
  const mix = (a, b, k) => Math.round(a + (b - a) * k), c = `rgb(${mix(74, 190, cur.tint)},${mix(47, 110, cur.tint)},${mix(27, 58, cur.tint)})`;
  $("#tint-end").setAttribute("stop-color", c); $("#tint-mid").setAttribute("stop-color", `rgb(${mix(74, 120, cur.tint)},${mix(47, 70, cur.tint)},${mix(27, 38, cur.tint)})`);
}
function hairLoop() {
  let moving = false;
  for (const k of ["y", "wave", "tint"]) { const dlt = goal[k] - cur[k]; if (Math.abs(dlt) > 0.004) { cur[k] += dlt * 0.16; moving = true; } else cur[k] = goal[k]; }
  drawHair(); hairRaf = moving ? requestAnimationFrame(hairLoop) : 0;
}
function setHair() {
  goal.y = LEN_Y[len]; goal.wave = SERVICES[svc].wave; goal.tint = SERVICES[svc].tint;
  if (reduce) { Object.assign(cur, goal); drawHair(); } else if (!hairRaf) hairRaf = requestAnimationFrame(hairLoop);
  $$(".ticks g").forEach((g, i) => g.classList.toggle("on", i === len));
}
// 長さの目盛り
$(".ticks").innerHTML = LEN_Y.map((y) => `<g><line x1="268" x2="290" y1="${y}" y2="${y}"/><circle cx="294" cy="${y}" r="3"/></g>`).join("");

/* ---------- 長さ・メニューの選択 ---------- */
const range = $("#len");
function buildLengths() {
  const html = LENS.map((l, i) => `<button type="button" data-i="${i}">${t(l)}</button>`).join("");
  $(".len-labels").innerHTML = html; $(".len-bar").innerHTML = `<span class="len-bar-t">${lang === "ja" ? "長さ" : "Length"}</span>` + html;
  markLen();
}
function markLen() {
  $$(".len-labels button, .len-bar button").forEach((b) => b.classList.toggle("on", +b.dataset.i === len));
  range.value = len; range.style.setProperty("--p", len / 4);
  $(".price-groups").dataset.len = len;
}
function setLen(i, animate = true) { if (i === len) return; len = i; markLen(); setHair(); showResult(animate); $(".drag-hint").classList.add("gone"); }
range.addEventListener("input", () => setLen(+range.value));
document.addEventListener("click", (e) => { const b = e.target.closest(".len-labels button, .len-bar button"); if (b) setLen(+b.dataset.i); });

function buildServices() {
  $(".services").innerHTML = SERVICES.map((s, i) => `<button type="button" role="tab" aria-selected="${i === svc}" data-i="${i}">${t(s.label)}</button>`).join("");
}
$(".services").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; svc = +b.dataset.i; $$(".services button").forEach((x, i) => x.setAttribute("aria-selected", i === svc)); setHair(); showResult(true); });

let shown = 0, numRaf = 0;
function showResult(animate) {
  const s = SERVICES[svc], p = price(ROW[s.id].p[len]), box = $(".result");
  $(".result-len").textContent = t(LENS[len]);
  $(".result-title").textContent = t(s.title); $(".result-body").textContent = t(s.body); $(".result-time").textContent = t(s.time);
  box.classList.toggle("no-price", !p);
  if (!p) { $(".result-price .num").textContent = "—"; $(".result-price .from").textContent = ""; $(".result-price .plus").textContent = ""; $(".result-time").textContent = t(s.none); shown = 0; return; }
  $(".result-price .from").textContent = p.from && lang === "en" ? "from" : ""; $(".result-price .plus").textContent = p.plus ? "+" : p.from && lang === "ja" ? "〜" : "";
  cancelAnimationFrame(numRaf);
  const el = $(".result-price .num"), a = shown || p.n, b = p.n; shown = b;
  if (reduce || !animate || a === b) { el.textContent = "$" + b; return; }
  const t0 = performance.now();
  const step = (now) => { const k = Math.min(1, (now - t0) / 420), e = 1 - Math.pow(1 - k, 3); el.textContent = "$" + Math.round(a + (b - a) * e); if (k < 1) numRaf = requestAnimationFrame(step); };
  numRaf = requestAnimationFrame(step);
}

/* ---------- 料金表（選んだ長さの列が色づく。スマホではその列だけを出す） ---------- */
function buildPrices() {
  const open = $$(".price-groups details").map((d) => d.open);
  $(".price-groups").innerHTML = GROUPS.map((g, gi) => `<details ${open.length ? (open[gi] ? "open" : "") : gi === 0 || g.key === "straight" ? "open" : ""}>
    <summary><h3>${t(g.name)}</h3><span class="count">${g.rows.length}</span></summary>
    <div class="ptable"><div class="prow phead"><span></span>${LENS.map((l, i) => `<span class="pc" data-l="${i}">${t(l)}</span>`).join("")}</div>
    ${g.rows.map((r) => `<div class="prow"><span class="pn">${t(r.n)}${r.d ? `<small>${t(r.d)}</small>` : ""}</span>${r.flat ? `<span class="pc flat"><span>${price(r.flat).html}</span></span>` : r.p.map((v, i) => `<span class="pc" data-l="${i}"><span>${v ? price(v).html : "—"}</span></span>`).join("")}</div>`).join("")}</div>
    ${g.note ? `<p class="gnote">${t(g.note)}</p>` : ""}</details>`).join("");
  markLen();
}

/* ---------- 営業時間：1週間を帯で見せる。シドニーの今の時刻に印 ---------- */
function sydneyNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday), h: (+p.hour % 24) + +p.minute / 60 };
}
function buildWeek() {
  const A = 9, B = 20, now = sydneyNow(), pct = (h) => ((h - A) / (B - A)) * 100;
  const axis = [9, 12, 15, 18, 20].map((h) => `<i style="left:${pct(h)}%">${h}:00</i>`).join("");
  $(".week").innerHTML = `<div class="wrow waxis"><span></span><div class="wtrack">${axis}</div><span></span></div>` + HOURS.map(([d, o, c], i) => {
    const today = i === now.day, late = c === 20;
    return `<div class="wrow${today ? " today" : ""}${o == null ? " shut" : ""}" role="row"><span class="wday" role="cell">${t(d)}${today ? `<em>${lang === "ja" ? "今日" : "Today"}</em>` : ""}</span>
      <div class="wtrack" role="cell">${o == null ? "" : `<b class="wbar${late ? " late" : ""}" style="left:${pct(o)}%;width:${pct(c) - pct(o)}%"></b>`}${today && now.h >= A && now.h <= B ? `<u class="wnow" style="left:${pct(now.h)}%"></u>` : ""}</div>
      <span class="wtime" role="cell">${o == null ? (lang === "ja" ? "定休日" : "Closed") : `${hhmm(o)} – ${hhmm(c)}`}</span></div>`;
  }).join("");
  const [, o, c] = HOURS[now.day], isOpen = o != null && now.h >= o && now.h < c;
  $(".now").innerHTML = `<i class="${isOpen ? "open" : "closed"}"></i>` + (isOpen ? (lang === "ja" ? `ただいま営業中（${hhmm(c)} まで）` : `Open now, until ${hhmm(c)}`) : (lang === "ja" ? "ただいま営業時間外です。オンライン予約は24時間受け付けています。" : "Closed right now. Online booking is open any time."));
}

/* ---------- 画面に入ったら現れる ---------- */
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$(".sec-head, .chooser-grid, .wall figure, .price-groups, .week, .about-photo, .notes li, .stairs-wrap, .info > div, .facts li").forEach((el) => { el.classList.add("rv"); io.observe(el); });
}
// ヘッダー：少し下げたら影をつける
addEventListener("scroll", () => $(".top").classList.toggle("stuck", scrollY > 8), { passive: true });

applyLang(); setHair(); sizeHero();
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
