// Olenzo Dog Grooming: the moving parts. With "reduce motion" on, nothing moves and everything is shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Facts from the current site ---------- */
const STOPS = [
  ["Book online", "Choose a Full Groom or a Wash & Tidy and pick a time through our online booking system."],
  ["Drop off", "We groom one dog at a time, so the room stays calm and your dog has our full attention."],
  ["Watch the styling", "After the shampoo and blow-dry, just before the styling begins, we email you a live stream link so you can watch."],
  ["Pick up, with a treat", "Every pup chooses a reward: fresh organic apple, K9 Natural or Ziwi treats."],
];
const SQ = "https://book.squareup.com/appointments/cm3ydq1mnegsaa/location/L29DSK2CHQQSR/services/";
const SERVICES = [
  { price: 120, time: "Allow 2 to 3 hours", book: SQ + "7QXZTIS5HSPVTLZO6E6GF6XM", items: [["Wash & blow dry"], ["Full body clip", 1], ["Scissor finish on face and feet", 1], ["Hygiene area tidy clip"], ["Undercoat removal"], ["Nail trimming"], ["Ear cleaning"], ["Anal glands"]] },
  { price: 100, time: "Allow 1.5 to 2.5 hours", book: SQ + "LHPRCBMXCG2MEHSGYR4BFZGM", items: [["Wash & blow dry"], ["Light trim around the eyes and feet", 1], ["Hygiene area tidy clip"], ["Undercoat removal"], ["Nail trimming"], ["Ear cleaning"], ["Anal glands"]] },
];
const WEEK = [["Mon", 9, 18], ["Tue", 9, 18], ["Wed"], ["Thu", 9, 18], ["Fri", 9, 18], ["Sat"], ["Sun", 9, 18]];

/* ---------- Hero: shampoo bubbles drift up at a steady pace ---------- */
const cv = $("#bubbles"), cx = cv.getContext("2d");
let W = 0, H = 0, bubbles = [], heroOn = true, raf = 0;
function size() { const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0);
  bubbles = Array.from({ length: W < 700 ? 9 : 16 }, (_, i) => ({ x: Math.random() * W, y: Math.random() * H, r: 8 + Math.random() * 26, v: 0.25 + Math.random() * 0.3, p: i })); draw(0); }
function draw(now) {
  cx.clearRect(0, 0, W, H);
  for (const b of bubbles) {
    if (!reduce) { b.y -= b.v; if (b.y < -b.r * 2) { b.y = H + b.r; b.x = Math.random() * W; } }
    const x = b.x + Math.sin(now / 1400 + b.p) * 6;
    cx.beginPath(); cx.arc(x, b.y, b.r, 0, 7); cx.fillStyle = "rgba(255,255,255,.55)"; cx.fill(); cx.strokeStyle = "rgba(63,122,74,.28)"; cx.lineWidth = 1.5; cx.stroke();
    cx.beginPath(); cx.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.22, 0, 7); cx.fillStyle = "rgba(255,255,255,.9)"; cx.fill();
  }
}
function loop(now) { if (!heroOn) { raf = 0; return; } draw(now); raf = requestAnimationFrame(loop); }
new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; if (heroOn && !raf && !reduce) raf = requestAnimationFrame(loop); }).observe(cv);
addEventListener("resize", size);

/* ---------- The visit: a pup trots along the trail to the step you choose ---------- */
let stop = 0, auto = 0;
function setStop(i, user) {
  stop = i; if (user) { clearInterval(auto); auto = 0; }
  $(".trail").style.setProperty("--k", i / (STOPS.length - 1));
  $$(".stops button").forEach((b, n) => { b.classList.toggle("on", n === i); b.classList.toggle("done", n < i); b.setAttribute("aria-pressed", n === i); });
  $("#stop-h").textContent = STOPS[i][0]; $("#stop-p").textContent = STOPS[i][1];
  const pup = $(".pup"); pup.classList.add("trot"); clearTimeout(pup._t); pup._t = setTimeout(() => pup.classList.remove("trot"), 700);
}
$(".stops").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setStop(+b.dataset.i, true); });

/* ---------- Services: switch between the two, the list re-ticks itself ---------- */
let svc = 0, shown = 120, nraf = 0;
function setSvc(i, animate = true) {
  svc = i; const s = SERVICES[i];
  $$(".svc-tabs button").forEach((b, n) => b.setAttribute("aria-selected", n === i));
  $("#svc-time").textContent = s.time; $("#svc-book").href = s.book;
  $("#svc-list").innerHTML = s.items.map(([t, key], n) => `<li class="${key ? "key" : ""}" style="--d:${n * 45}ms">${t}</li>`).join("");
  if (animate && !reduce) { const l = $("#svc-list"); l.classList.remove("tick"); void l.offsetWidth; l.classList.add("tick"); }
  const el = $("#svc-n"), a = shown, b = s.price; shown = b; cancelAnimationFrame(nraf);
  if (reduce || !animate || a === b) { el.textContent = b; return; }
  const t0 = performance.now(); const step = (now) => { const k = Math.min(1, (now - t0) / 380); el.textContent = Math.round(a + (b - a) * (1 - Math.pow(1 - k, 3))); if (k < 1) nraf = requestAnimationFrame(step); }; nraf = requestAnimationFrame(step);
}
$(".svc-tabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setSvc(+b.dataset.i); });

/* ---------- Opening hours, with today marked (Sydney time) ---------- */
function week() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const h = (+p.hour % 24) + +p.minute / 60;
  $(".week").innerHTML = WEEK.map(([d, o, c]) => `<li class="${o ? "" : "shut"}${d === p.weekday ? " today" : ""}"><b>${d}</b><span>${o ? "9am – 6pm" : "Closed"}</span></li>`).join("");
  const t = WEEK.find(([d]) => d === p.weekday), open = t && t[1] && h >= t[1] && h < t[2];
  $(".status").innerHTML = `<i class="${open ? "on" : ""}"></i>` + (open ? "Open now, until 6pm" : "Closed right now. Online booking is open any time.");
}

/* ---------- Paw prints between sections, and reveal on scroll ---------- */
$(".paws").innerHTML = Array.from({ length: 9 }, (_, i) => `<svg viewBox="0 0 32 32" style="--i:${i}"><circle cx="8" cy="12" r="3.2"/><circle cx="14" cy="7" r="3.2"/><circle cx="21" cy="8" r="3.2"/><circle cx="26" cy="14" r="3.2"/><path d="M10 22c0-5 4-8 7.5-8s7 3 7 7.500c0 4-4 4.500-7.200 4.500S10 26 10 22z"/></svg>`).join("");
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; e.target.classList.add("in"); io.unobserve(e.target);
    if (e.target.classList.contains("trail") && !auto) { let n = 0; auto = setInterval(() => { n++; if (n >= STOPS.length) { clearInterval(auto); return; } setStop(n); }, 1500); } }), { rootMargin: "0px 0px -12% 0px" });
  $$(".paws, .visit h2, .trail, .stop-card, .services h2, .svc-tabs, .svc-card, .know-photo, .cards article, .find h2, .route li, .hours, .contact").forEach((el) => { el.classList.add("rv"); io.observe(el); });
}
addEventListener("scroll", () => $(".top").classList.toggle("stuck", scrollY > 8), { passive: true });
setStop(0); setSvc(0, false); week(); size();
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
