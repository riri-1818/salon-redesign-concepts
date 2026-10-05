// Wilson Luiz Personal Trainer: the moving parts. With "reduce motion" on, nothing moves and everything is shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const TEL = "+61405868489";

/* ---------- Sessions and prices (from the booking page of the current site) ---------- */
const WHO = [
  { tab: "Just me", kind: "1 on 1 workout", price: 100, each: "45 minutes, one on one.", body: "A personally tailored program: a full-body workout or split training, depending on your goals. Every session ends with assisted stretching.", sms: "1 on 1" },
  { tab: "Two of us", kind: "2 on 1 workout", price: 140, each: "That’s $70 each.", body: "Bring a partner, friend, family member or workmate for a buddy session.", sms: "2 on 1" },
  { tab: "3 or 4 of us", kind: "3/4 on 1 workout", price: 200, each: "That’s $50 each for four, about $67 each for three.", body: "Small group training: cardio circuits, HIIT, speed, agility, balance, power and endurance.", sms: "small group (3/4 on 1)" },
  { tab: "Stretch / massage", kind: "Stretch / massage", price: 120, each: "Massage gun, assisted stretch and massage.", body: "A recovery session instead of a workout.", sms: "stretch / massage", noGoal: true },
];
const GOALS = ["TRX workout", "Weight loss", "Posture correction", "Muscle tone", "Cardio fitness", "Core strength"];
let who = 0, goal = 1, shown = 100, raf = 0;
$(".who").innerHTML = WHO.map((w, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === 0}"><b>${w.tab}</b><span>$${w.price}</span></button>`).join("");
$(".goals").innerHTML = GOALS.map((g, i) => `<button type="button" data-i="${i}" aria-pressed="${i === goal}">${g}</button>`).join("");
function show(animate = true) {
  const w = WHO[who];
  $$(".who button").forEach((b, i) => b.setAttribute("aria-selected", i === who)); $$(".goals button").forEach((b, i) => b.setAttribute("aria-pressed", i === goal && !w.noGoal));
  $(".goals").classList.toggle("off", !!w.noGoal);
  $("#t-kind").textContent = w.kind + (w.noGoal ? "" : " · " + GOALS[goal]); $("#t-each").textContent = w.each; $("#t-body").textContent = w.body;
  $("#t-sms").href = "sms:" + TEL + "?&body=" + encodeURIComponent(`Hi Wilson, I'd like to book a ${w.sms} session` + (w.noGoal ? "." : `. My goal: ${GOALS[goal].toLowerCase()}.`) + " I'm free on [days/times].");
  const el = $("#t-n"), a = shown, b = w.price; shown = b; cancelAnimationFrame(raf);
  if (!reduce && animate) { const t = $(".ticket"); t.classList.remove("hit"); void t.offsetWidth; t.classList.add("hit"); }
  if (reduce || !animate || a === b) { el.textContent = b; return; }
  const t0 = performance.now(); const step = (now) => { const k = Math.min(1, (now - t0) / 380); el.textContent = Math.round(a + (b - a) * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step);
}
$(".who").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { who = +b.dataset.i; show(); } });
$(".goals").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { goal = +b.dataset.i; show(); } });

/* ---------- Count the numbers up when they come into view ---------- */
function count(el) { const to = +el.dataset.n; if (reduce) return; const t0 = performance.now(); const step = (now) => { const k = Math.min(1, (now - t0) / 900); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }

if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; e.target.classList.add("in"); io.unobserve(e.target); if (e.target.classList.contains("stats")) $$("b", e.target).forEach(count); }), { rootMargin: "0px 0px -10% 0px" });
  $$(".stats, .about figure, .about > div, .sec-head, .builder, .say-photo, .quotes blockquote, .where-grid figure, .burbs li, .contact").forEach((el) => { el.classList.add("rv"); io.observe(el); });
  $$(".burbs li").forEach((li, i) => li.style.transitionDelay = i * 30 + "ms");
}
show(false);
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
