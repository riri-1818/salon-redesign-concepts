// Colin Bell Plumbing: the moving parts. With "reduce motion" on, nothing moves and everything is shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const TEL = "+61412619516";

/* ---------- The jobs, in Colin's own words (from the current site) ---------- */
const JOBS = [
  { v: "Dripping tap", kind: "Repairs", title: "Taps and cisterns", body: "Tap repairs and cistern repairs. Give me a call or send a text and I’ll sort it out.", sms: "Hi Colin, I have a dripping tap. I'm in [suburb]." },
  { v: "Water or gas leak", kind: "Repairs", title: "Water and gas leaks", body: "Water, gas and drainage leaks found and fixed. I’m a licensed gasfitter as well as a plumber.", sms: "Hi Colin, I think I have a leak (water / gas). I'm in [suburb]." },
  { v: "Kitchen or bathroom", kind: "Renovations", title: "Kitchens and bathrooms", body: "New builds and renovations of kitchens and bathrooms.", sms: "Hi Colin, I'm planning a kitchen / bathroom renovation in [suburb]. Could you quote?" },
  { v: "Backflow testing", kind: "Compliance", title: "Backflow compliance testing", body: "Backflow prevention devices tested for compliance.", sms: "Hi Colin, I need a backflow test at [address]." },
  { v: "Gutters & stormwater", kind: "Repairs", title: "Gutters, stormwater and drainage", body: "Gutters, stormwater and drainage repairs.", sms: "Hi Colin, I have a gutter / stormwater problem in [suburb]." },
  { v: "Water filtration", kind: "Installations", title: "Whole-house and under-sink filters", body: "Whole-house filtration systems designed to remove forever chemicals and microplastics, and under-sink filters for drinking water.", sms: "Hi Colin, I'd like to ask about water filtration for my home in [suburb]." },
  { v: "Blocked sewer", kind: "Not me, but…", title: "Blocked sewers", body: "I honestly don’t have time to unblock sewers, but I can refer you to a local legend who specialises in blockages!", sms: "Hi Colin, I have a blocked sewer in [suburb]. Could you refer me to your blockage specialist?", fine: "Blockages carry a limited warranty, especially if tree roots are involved." },
];
let job = 0;
$(".valves").innerHTML = JOBS.map((j, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === 0}"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="13"/><rect class="lever" x="17" y="3" width="6" height="22" rx="3"/></svg><span>${j.v}</span></button>`).join("");
function showJob(i, animate = true) {
  job = i; const j = JOBS[i], box = $(".answer");
  $$(".valves button").forEach((b, n) => b.setAttribute("aria-selected", n === i));
  const fill = () => { $("#a-kind").textContent = j.kind; $("#a-title").textContent = j.title; $("#a-body").textContent = j.body; $("#a-fine").textContent = j.fine || "Free quotes. Please note it’s not a free advice session.";
    $("#a-sms").href = "sms:" + TEL + "?&body=" + encodeURIComponent(j.sms); };
  if (reduce || !animate) { fill(); return; }
  box.classList.remove("flow"); void box.offsetWidth; fill(); box.classList.add("flow");
}
$(".valves").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) showJob(+b.dataset.i); });

/* ---------- The tap: it drips until you turn the handle ---------- */
const tap = $(".tap"), handle = $(".handle");
function turnOff() {
  const off = tap.classList.toggle("off");
  $("#tap-h").textContent = off ? "Sorted." : "That drip won’t fix itself.";
  $("#tap-p").textContent = off ? "Tap repairs are on the list below." : "Turn the handle.";
  handle.setAttribute("aria-label", off ? "Turn the tap back on" : "Turn off the tap");
}
handle.addEventListener("click", turnOff);
handle.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); turnOff(); } });

/* ---------- Count the years up once ---------- */
if (!reduce) { const el = $("#yrs"), t0 = performance.now(); const step = (now) => { const k = Math.min(1, (now - t0) / 1100); el.textContent = Math.round(35 * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }

/* ---------- Reveal on scroll ---------- */
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".sec-head, .manifold, .three li, .filter figure, .filter > div, .area-grid > div, .qa details, .sheet > div, .contact").forEach((el) => { el.classList.add("rv"); io.observe(el); });
}
addEventListener("scroll", () => $(".top").classList.toggle("stuck", scrollY > 8), { passive: true });
showJob(0, false);
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
