// Kong Space Spa: the moving parts. With "reduce motion" on, nothing moves and everything is shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const MAIL = "kongspacespa@gmail.com";

/* ---------- Treatments and add-ons (from the current site). p = pressure range on a 0–4 scale ---------- */
const TREATS = [
  { n: "Escape", min: 60, price: 90, p: [0, 2], pt: "Light to firm", body: "Your choice of personalised remedial massage, relaxation massage or a combination of both." },
  { n: "Escape Deluxe", min: 90, price: 130, p: [0, 2], pt: "Light to firm", body: "The same choice of remedial, relaxation or both, for those who want to spend longer on it." },
  { n: "Pregnancy", min: 60, price: 130, p: [0, 1.5], pt: "Light to medium-firm", body: "Pregnancy massage, for ladies after the first trimester (12 weeks)." },
  { n: "Walking on the Cloud", min: 90, price: 140, p: [1, 2], pt: "Medium to firm", body: "A foot soak and a foot-to-calf exfoliation (10 mins), a foot massage (20 mins), then a full-body massage (60 mins).", has: ["soak"] },
  { n: "Hardcore", min: 150, price: 230, p: [1, 4], pt: "Medium to firm and intense", body: "Targeted work on localised aches, injury management and muscular issues that have built up over time. For those who can really handle strong pressure." },
  { n: "Meet the New You", min: 150, price: 230, p: [0, 2], pt: "Light to firm", body: "A full-body exfoliation (30 mins), a full-body massage (90 mins), then an organic facial with a mask and scalp massage (30 mins).", has: ["scrub", "facial"] },
];
const ADDS = [
  { k: "scrub", n: "Full body scrub", min: 30, price: 40 }, { k: "soak", n: "Foot soaking", min: 20, price: 20 },
  { k: "facial", n: "Organic facial", min: 30, price: 50 }, { k: "ear", n: "Ear candling", min: 15, price: 20 },
];
let treat = 0; const on = new Set(); let shown = 90, raf = 0;
$(".treats").innerHTML = TREATS.map((t, i) => `<li><button type="button" role="radio" aria-checked="${i === 0}" data-i="${i}"><b>${t.n}</b><span>${t.min} mins</span><em>AU$${t.price}</em></button></li>`).join("");
$(".adds").innerHTML = ADDS.map((a) => `<li><label><input type="checkbox" data-k="${a.k}"><span class="tick"></span><b>${a.n}</b><span>+${a.min} mins</span><em>+AU$${a.price}</em></label></li>`).join("");
function show(animate = true) {
  const t = TREATS[treat], inc = t.has || [];
  $$(".treats button").forEach((b, i) => b.setAttribute("aria-checked", i === treat));
  $$(".adds input").forEach((c) => { const dis = inc.includes(c.dataset.k); if (dis) { on.delete(c.dataset.k); c.checked = false; } c.disabled = dis; c.closest("li").classList.toggle("included", dis); });
  const adds = ADDS.filter((a) => on.has(a.k)), min = t.min + adds.reduce((s, a) => s + a.min, 0), total = t.price + adds.reduce((s, a) => s + a.price, 0);
  $("#s-name").textContent = t.n; $("#s-body").textContent = t.body; $("#s-min").textContent = min; $("#s-press-t").textContent = t.pt;
  $("#s-press").style.left = (t.p[0] / 4) * 100 + "%"; $("#s-press").style.width = ((t.p[1] - t.p[0]) / 4) * 100 + "%";
  $("#s-adds").innerHTML = adds.map((a) => `<li><span>+ ${a.n}</span><span>AU$${a.price}</span></li>`).join("");
  $(".arc").style.strokeDashoffset = 1 - Math.min(1, min / 240);
  $("#s-mail").href = "mailto:" + MAIL + "?subject=" + encodeURIComponent("Appointment request: " + t.n) + "&body=" + encodeURIComponent(`Hello,\n\nI'd like to book:\n- ${t.n} (${t.min} mins, AU$${t.price})\n${adds.map((a) => `- ${a.n} (+${a.min} mins, AU$${a.price})\n`).join("")}Total: ${min} mins, AU$${total}\n\nPreferred day and time: \nMy name and phone number: \n`);
  const el = $("#s-total"), a = shown; shown = total; cancelAnimationFrame(raf);
  if (reduce || !animate || a === total) { el.textContent = total; return; }
  const t0 = performance.now(); const step = (now) => { const k = Math.min(1, (now - t0) / 500); el.textContent = Math.round(a + (total - a) * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step);
}
$(".treats").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { treat = +b.dataset.i; show(); } });
$(".adds").addEventListener("change", (e) => { const k = e.target.dataset.k; if (!k) return; e.target.checked ? on.add(k) : on.delete(k); show(); });

/* ---------- Day & Night: the page follows the time in Sydney, and the switch lets you change it ---------- */
const sw = $(".daynight");
function sydneyHour() { return +new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", hour: "numeric", hour12: false }).format(new Date()) % 24; }
function setTheme(night) {
  document.documentElement.dataset.theme = night ? "night" : "day"; sw.setAttribute("aria-checked", night);
  document.querySelector('meta[name="theme-color"]').content = night ? "#0e1a21" : "#eaf4f2";
  $("#hero-lead").textContent = night ? "Evenings are welcome. Kong Space sees guests any day of the week, and late-night treatments can be arranged with 24–48 hours’ notice." : "A haven where you can relax and unwind from the stresses of everyday life. Kong Space sees guests any day of the week, by appointment.";
}
const h = sydneyHour(), qs = new URLSearchParams(location.search).get("theme");
setTheme(qs ? qs === "night" : h >= 18 || h < 6);
$("#now").textContent = `It is ${new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", hour: "numeric", minute: "2-digit" }).format(new Date())} in Chatswood.`;
sw.addEventListener("click", () => setTheme(document.documentElement.dataset.theme !== "night"));

/* ---------- The circle breathes: four seconds in, four seconds out ---------- */
if (!reduce) { let inn = true; setInterval(() => { inn = !inn; $("#breath-word").textContent = inn ? "Breathe in" : "Breathe out"; }, 4000); }

if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".sec-head, .planner, .words > *, .visit h2, .info > div").forEach((el) => { el.classList.add("rv"); io.observe(el); });
}
show(false);
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
