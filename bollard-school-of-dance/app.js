// Bollard School of Dance: the moving parts. With "reduce motion" on, nothing moves and everything is shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const TEL = "+61419494462";

/* ---------- Styles (descriptions from the Classes page of the current site). beat = how the eight dots move ---------- */
const STYLES = [
  { n: "Ballet", kind: "Core class", beat: "glide", c: "#ff8fc7", body: "Ballet teaches poise and technique, and develops the strength required for all other forms of dance. Examinations are held with the Australian Teachers of Dancing." },
  { n: "Tap", kind: "Core class", beat: "tap", c: "#ffd23f", body: "Metal plates on special shoes make rhythmic taps. Students focus on beats and timing, while increasing foot, ankle and leg strength." },
  { n: "Jazz", kind: "Core class", beat: "kick", c: "#ff3fa4", body: "Upbeat, stylish and versatile: the basic techniques of ballet with the more modern steps of pop and Broadway. Warm-ups, stretching, leaps, turns and centre work to fun, upbeat music." },
  { n: "Contemporary", kind: "Core class", beat: "wave", c: "#8fd3ff", body: "Not one technique but a collection of methods, characterised by its versatility. It can be danced to almost any style of music." },
  { n: "Hip Hop", kind: "Core class", beat: "bounce", c: "#6ee7a8", body: "A style that began as street dancing in the USA. It is continually evolving and is heavily influenced by culture and music." },
  { n: "Musical Theatre", kind: "Specialty class", beat: "kick", c: "#ffb347", body: "Singing, dancing and acting together. Students learn acts from past and present musicals, and what it takes to have great stage presence." },
  { n: "Turns, Leaps, Kicks & Tricks", kind: "Specialty class", beat: "leap", c: "#c9a0ff", body: "Focused training on turns, leaps, kicks and tricks to improve power, control and flexibility." },
  { n: "Cheer", kind: "Specialty class", beat: "bounce", c: "#5cc8ff", body: "Rhythm, enthusiasm, stunts and props. This class will have you cheering in no time!" },
];
let style = 2;
$(".tabs").innerHTML = STYLES.map((s, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === style}" style="--c:${s.c}">${s.n}</button>`).join("");
function show(animate = true) {
  const s = STYLES[style], p = $(".panel");
  $$(".tabs button").forEach((b, i) => b.setAttribute("aria-selected", i === style));
  p.style.setProperty("--c", s.c); $(".beat").dataset.beat = s.beat;
  $("#p-kind").textContent = s.kind; $("#p-title").textContent = s.n; $("#p-body").textContent = s.body;
  $("#p-sms").href = "sms:" + TEL + "?&body=" + encodeURIComponent(`Hi BSD, I'd like to ask about ${s.n} classes. My dancer is [age].`);
  if (animate && !reduce) { p.classList.remove("swap"); void p.offsetWidth; p.classList.add("swap"); }
}
$(".tabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { style = +b.dataset.i; show(); } });

/* ---------- The first screen: a spotlight that follows you, or sweeps the stage on its own ---------- */
const hero = $("#hero"); let follow = false, heroOn = true, raf = 0;
function setSpot(x, y) { hero.style.setProperty("--mx", x + "%"); hero.style.setProperty("--my", y + "%"); }
hero.addEventListener("pointermove", (e) => { if (e.pointerType !== "mouse") return; follow = true; const r = hero.getBoundingClientRect(); setSpot(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100); });
hero.addEventListener("pointerleave", () => { follow = false; });
function sweep(now) { if (!heroOn) { raf = 0; return; } if (!follow) setSpot(50 + Math.sin(now / 2600) * 30, 46 + Math.sin(now / 1900) * 10); raf = requestAnimationFrame(sweep); }
new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; if (heroOn && !raf && !reduce) raf = requestAnimationFrame(sweep); }).observe(hero);
if (reduce) setSpot(56, 44);

/* ---------- 65 years, counted up once ---------- */
if (!reduce) { const el = $("#years"), t0 = performance.now(); const step = (now) => { const k = Math.min(1, (now - t0) / 1400); el.textContent = Math.round(65 * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }

if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".strip li, .sec-head, .styles, .little figure, .little > div, .cards article, .teachers figure, .teachers > div, .qa details, .trial, .where > div").forEach((el) => { el.classList.add("rv"); io.observe(el); });
  $$(".strip li").forEach((li, i) => li.style.setProperty("--d", i * 80 + "ms")); $$(".cards article").forEach((li, i) => li.style.setProperty("--d", i * 90 + "ms"));
}
show(false);
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
