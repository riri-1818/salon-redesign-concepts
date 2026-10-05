// Melismatic Music: the moving parts. With "reduce motion" on, the lines are drawn once and stay still.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const TEL = "+61451429140";

/* ---------- Lesson options (from the current site: three kinds, three lengths; no prices are published) ---------- */
const KINDS = [
  { tab: "Vocal lessons", title: "Vocal lessons", body: "Explore your voice and range, and build vocal quality and technique, working with all genres.", shape: "voice" },
  { tab: "Piano lessons", title: "Piano lessons", body: "From first notes to advanced pieces, at the pace of each student.", shape: "keys" },
  { tab: "Combined", title: "Combined vocal & piano", body: "Sing and play in the same lesson.", shape: "both" },
];
const MINS = [["30 min", "30 minutes"], ["45 min", "45 minutes"], ["1 hour", "1 hour"]];
let kind = 0, min = 1;
$(".kinds").innerHTML = KINDS.map((k, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === 0}">${k.tab}</button>`).join("");
$(".mins").innerHTML = MINS.map((m, i) => `<button type="button" data-i="${i}" aria-pressed="${i === min}">${m[0]}</button>`).join("");
function show() {
  const k = KINDS[kind];
  $$(".kinds button").forEach((b, i) => b.setAttribute("aria-selected", i === kind)); $$(".mins button").forEach((b, i) => b.setAttribute("aria-pressed", i === min));
  $("#c-kind").textContent = MINS[min][1]; $("#c-title").textContent = k.title; $("#c-body").textContent = k.body;
  $("#c-sms").href = "sms:" + TEL + "?&body=" + encodeURIComponent(`Hi Maya, I'd like to ask about ${k.title.toLowerCase()} (${MINS[min][1]}). The student is [age / level].`);
  target = { len: [0.5, 0.75, 1][min], voice: k.shape === "keys" ? 0 : 1, keys: k.shape === "voice" ? 0 : 1 };
  if (reduce) { Object.assign(cur, target); drawShape(0); } else if (!shapeRaf) shapeRaf = requestAnimationFrame(shapeLoop);
}
$(".kinds").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { kind = +b.dataset.i; show(); } });
$(".mins").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { min = +b.dataset.i; show(); } });

/* ---------- The lesson's shape: a voice line, piano steps, or both; longer lessons draw a longer line ---------- */
const sc = $("#shape"), sx = sc.getContext("2d"); let sw = 0, sh = 0, shapeRaf = 0, shapeOn = false;
const cur = { len: 0.75, voice: 1, keys: 0 }; let target = { ...cur };
function sizeShape() { const r = sc.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); sw = r.width; sh = r.height; sc.width = sw * d; sc.height = sh * d; sx.setTransform(d, 0, 0, d, 0, 0); drawShape(performance.now()); }
function drawShape(now) {
  sx.clearRect(0, 0, sw, sh); const t = reduce ? 0 : now / 1000, end = sw * cur.len, mid = sh / 2;
  if (cur.keys > 0.02) { // piano: stepped blocks
    const n = Math.round(22 * cur.len), bw = end / n;
    sx.fillStyle = `rgba(255,255,255,${0.9 * cur.keys})`;
    for (let i = 0; i < n; i++) { const h = (0.25 + 0.6 * Math.abs(Math.sin(i * 0.9 + t * 1.6))) * sh * 0.42; sx.fillRect(i * bw + 2, mid - h * cur.keys, bw - 4, h * 2 * cur.keys); }
  }
  if (cur.voice > 0.02) { // voice: a held note with vibrato, a "melisma" of small turns
    sx.beginPath();
    for (let x = 0; x <= end; x += 3) { const u = x / sw, y = mid + Math.sin(u * 9 + t * 1.8) * sh * 0.2 * cur.voice + Math.sin(u * 46 + t * 5) * sh * 0.045 * cur.voice; x ? sx.lineTo(x, y) : sx.moveTo(x, y); }
    sx.strokeStyle = cur.keys > 0.5 ? "#ffd166" : "#fff"; sx.lineWidth = 3.5; sx.lineCap = "round"; sx.stroke();
  }
  sx.fillStyle = "#ffd166"; sx.beginPath(); sx.arc(Math.max(6, end), mid, 6, 0, 7); sx.fill();
}
function shapeLoop(now) {
  for (const k in cur) cur[k] += (target[k] - cur[k]) * 0.1;
  drawShape(now); shapeRaf = shapeOn ? requestAnimationFrame(shapeLoop) : 0;
}
/* ---------- The first screen: one long sung line across the bottom, moving at a steady pace ---------- */
const hc = $("#wave"), hx = hc.getContext("2d"); let hw = 0, hh = 0, heroRaf = 0, heroOn = true;
function sizeHero() { const r = hc.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); hw = r.width; hh = r.height; hc.width = hw * d; hc.height = hh * d; hx.setTransform(d, 0, 0, d, 0, 0); drawHero(performance.now()); }
function drawHero(now) {
  hx.clearRect(0, 0, hw, hh); const t = reduce ? 0 : now / 1000;
  [["rgba(255,255,255,.9)", 3, 0], ["rgba(255,209,102,.9)", 2, 1.3], ["rgba(255,255,255,.35)", 1.5, 2.4]].forEach(([c, lw, ph]) => {
    hx.beginPath();
    for (let x = 0; x <= hw; x += 4) { const u = x / hw, env = Math.sin(u * Math.PI), y = hh / 2 + Math.sin(u * 7 + t * 1.2 + ph) * hh * 0.26 * env + Math.sin(u * 40 + t * 4 + ph) * hh * 0.05 * env; x ? hx.lineTo(x, y) : hx.moveTo(x, y); }
    hx.strokeStyle = c; hx.lineWidth = lw; hx.stroke();
  });
}
function heroLoop(now) { if (!heroOn) { heroRaf = 0; return; } drawHero(now); heroRaf = requestAnimationFrame(heroLoop); }
new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; if (heroOn && !heroRaf && !reduce) heroRaf = requestAnimationFrame(heroLoop); }).observe(hc);
new IntersectionObserver(([e]) => { shapeOn = e.isIntersecting; if (shapeOn && !shapeRaf && !reduce) shapeRaf = requestAnimationFrame(shapeLoop); }).observe(sc);
addEventListener("resize", () => { sizeHero(); sizeShape(); });

if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".sec-head, .picker, .four li, .stage, .people article, .quotes li, .contact").forEach((el) => { el.classList.add("rv"); io.observe(el); });
  $$(".four li").forEach((li, i) => li.style.setProperty("--d", i * 90 + "ms")); $$(".quotes li").forEach((li, i) => li.style.setProperty("--d", i * 90 + "ms"));
}
sizeHero(); sizeShape(); show();
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
