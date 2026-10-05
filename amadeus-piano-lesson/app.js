// Amadeus Piano Lesson: the moving parts. With "reduce motion" on, nothing animates; the keyboard still plays.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const TEL = "+61469397096";

/* ---------- A keyboard you can actually play (two octaves from middle C) ---------- */
const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const piano = $("#piano"); let ctx = null, down = false, last = null;
const octaves = innerWidth < 700 ? 1 : 2, whites = octaves * 7 + 1;
piano.style.setProperty("--n", whites);
let html = "", w = 0;
for (let i = 0; i <= octaves * 12; i++) {
  const name = NAMES[i % 12], black = name.includes("#"), midi = 60 + i;
  if (black) html += `<button type="button" class="k b" data-m="${midi}" style="--x:${w}" aria-label="${name}"></button>`;
  else { html += `<button type="button" class="k w" data-m="${midi}" aria-label="${name}"><span>${name === "C" ? (i === 0 ? "Middle C" : "C") : ""}</span></button>`; w++; }
}
piano.innerHTML = html;
function play(el) {
  if (!el || el === last) return; last = el;
  el.classList.add("on"); setTimeout(() => el.classList.remove("on"), 260);
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume();
    const f = 440 * Math.pow(2, (+el.dataset.m - 69) / 12), t = ctx.currentTime, g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.32, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5); g.connect(ctx.destination);
    [[1, "triangle", 1], [2, "sine", 0.35], [3, "sine", 0.12]].forEach(([m, type, v]) => { const o = ctx.createOscillator(), gg = ctx.createGain(); o.type = type; o.frequency.value = f * m; gg.gain.value = v; o.connect(gg); gg.connect(g); o.start(t); o.stop(t + 1.6); });
  } catch (e) {}
  $(".play-hint").classList.add("gone");
}
piano.addEventListener("pointerdown", (e) => { const k = e.target.closest(".k"); if (!k) return; down = true; last = null; play(k); });
piano.addEventListener("pointermove", (e) => { if (!down) return; const k = document.elementFromPoint(e.clientX, e.clientY); play(k && k.closest ? k.closest(".k") : null); });
addEventListener("pointerup", () => { down = false; last = null; }); addEventListener("pointercancel", () => { down = false; last = null; });
piano.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("k")) { e.preventDefault(); last = null; play(e.target); } });

/* ---------- Find your lesson (wording from the current site's course overview) ---------- */
const WHO = [
  { tab: "A child under 5", title: "Start in a small group", body: "For under-fives, the idea is to begin with music foundations before individual one-on-one lessons start.", list: ["Two, or at most three, in a group", "Listening and rhythm first", "Learning and encouraging each other"] },
  { tab: "A child, 4 and up", title: "A weekly one-on-one lesson", body: "Establishing the basics while learning music the student enjoys playing. Kids are welcome from four years old.", list: ["Classical, contemporary and more", "Practice lessons available during the week", "Home lessons, subject to availability"] },
  { tab: "An adult beginner", title: "It is never too late to start", body: "Beginner adults are welcome, one-on-one or in a small group.", list: ["Learn for leisure, with steady progress", "Small groups: enjoy playing duets", "Online lessons for flexible schedules"] },
  { tab: "An adult coming back", title: "Pick it back up", body: "Revisiting the piano after years of not playing? Lessons start from where you are and the music you want to play.", list: ["Pop, jazz, classical: your choice", "One-on-one, at your pace", "Online lessons on Zoom, Skype or Messenger"] },
  { tab: "Someone taking exams", title: "AMEB or Trinity preparation", body: "Students can prepare for exams with AMEB or Trinity, alongside playing for enjoyment.", list: ["One-on-one lessons", "Practice lessons between weekly lessons", "A practice room if there is no piano at home"] },
];
let who = 1;
$(".who").innerHTML = WHO.map((x, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === who}">${x.tab}</button>`).join("");
function show(animate = true) {
  const x = WHO[who], box = $(".answer");
  $$(".who button").forEach((b, i) => b.setAttribute("aria-selected", i === who));
  const fill = () => { $("#a-title").textContent = x.title; $("#a-body").textContent = x.body; $("#a-list").innerHTML = x.list.map((t) => `<li>${t}</li>`).join("");
    $("#a-sms").href = "sms:" + TEL + "?&body=" + encodeURIComponent(`Hello, I'd like to ask about piano lessons for ${x.tab.toLowerCase()}. `); };
  if (reduce || !animate) { fill(); return; }
  box.classList.remove("turn"); void box.offsetWidth; fill(); box.classList.add("turn");
}
$(".who").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { who = +b.dataset.i; show(); } });

if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".staff, .sec-head, .finder, .keys6 li, .quotes li, .know-grid > *, .contact").forEach((el) => { el.classList.add("rv"); io.observe(el); });
  $$(".keys6 li").forEach((li, i) => li.style.setProperty("--d", i * 70 + "ms")); $$(".quotes li").forEach((li, i) => li.style.setProperty("--d", (i % 3) * 80 + "ms"));
}
show(false);
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
