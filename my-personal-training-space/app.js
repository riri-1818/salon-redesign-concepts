// My Personal Training Space: the moving parts. With "reduce motion" on, nothing moves and everything is shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const TEL = "+61419403671";

/* ---------- Prices (from the Pricing page of the current site) ---------- */
const MIN = [30, 45, 60], SINGLE = [65, 100, 130], PACK = [360, 570, 750];
let len = 1, buy = "single", friend = false, shown = 100, raf = 0;
const money = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
function show(animate = true) {
  const single = SINGLE[len], pack = PACK[len], total = buy === "single" ? single : pack;
  $(".barbell").dataset.n = len + 1;
  $("#r-kind").textContent = `${MIN[len]}-minute personal training` + (buy === "pack" ? " · 6 sessions" : "");
  let line = buy === "single" ? "per session" : `for 6 sessions. That’s ${money(pack / 6)} a session, saving ${money(single * 6 - pack)}.`;
  if (friend) line += ` Split between two: ${money(total / 2)} each${buy === "pack" ? " for the pack" : ""}.`;
  $("#r-line").textContent = line;
  $("#r-note").textContent = buy === "pack" ? "Packs are paid upfront and must be used within 6 months. A pack can be shared: bring a friend with you." : friend ? "Yes, you can train with a friend. The cost can be split between the two of you." : "One on one. Sessions are catered to what you need and want.";
  $("#r-sms").href = "sms:" + TEL + "?&body=" + encodeURIComponent(`Hi Rasha, I'd like to book ${MIN[len]}-minute personal training (${buy === "pack" ? "pack of 6" : "pay per session"})${friend ? " with a friend" : ""}. I'm free on [days/times].`);
  const el = $("#r-n"), a = shown, b = total; shown = b; cancelAnimationFrame(raf);
  if (reduce || !animate || a === b) { el.textContent = b; return; }
  const t0 = performance.now(); const step = (now) => { const k = Math.min(1, (now - t0) / 420); el.textContent = Math.round(a + (b - a) * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step);
}
function seg(id, set) { $(id).addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; set(b.dataset.v); $$(id + " button").forEach((x) => x.setAttribute("aria-pressed", x === b)); show(); }); }
seg("#len", (v) => { len = +v; }); seg("#buy", (v) => { buy = v; });
$("#friend").addEventListener("change", (e) => { friend = e.target.checked; show(); });

if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".sec-head, .ticks li, .calc, .more article, .rasha figure, .rasha > div, .grid li, .sauna figure, .sauna > div, .contact h2, .info > div").forEach((el) => { el.classList.add("rv"); io.observe(el); });
  $$(".ticks li").forEach((li, i) => li.style.setProperty("--d", i * 70 + "ms")); $$(".grid li").forEach((li, i) => li.style.setProperty("--d", i * 70 + "ms"));
}
addEventListener("scroll", () => $(".top").classList.toggle("stuck", scrollY > 8), { passive: true });
show(false);
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
