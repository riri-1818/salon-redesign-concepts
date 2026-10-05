// Le Acupuncture: the moving parts. With "reduce motion" on, nothing moves and everything is shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Standard fees (from the Treatments page of the current site) ---------- */
const FEES = {
  "initial-body": [180, "Initial body consultation", ""], "follow-body": [150, "Follow-up treatment", ""],
  "initial-face": [250, "Initial facial acupuncture", ""], "follow-face": [200, "Follow-up facial acupuncture", ""],
  "initial-both": [300, "Combined facial and body acupuncture", "The combined session is one fee."], "follow-both": [300, "Combined facial and body acupuncture", "The combined session is one fee."],
};
let visit = "initial", kind = "body", shown = 180, raf = 0;
function showFee(animate = true) {
  const [n, name, note] = FEES[visit + "-" + kind];
  $("#fee-name").textContent = name; $("#fee-note").textContent = note || "Standard fee. Please call to make an appointment.";
  const el = $("#fee-n"), a = shown; shown = n; cancelAnimationFrame(raf);
  $(".fee-card").style.setProperty("--k", (n - 150) / 150);
  if (reduce || !animate || a === n) { el.textContent = n; return; }
  const t0 = performance.now(); const step = (now) => { const k = Math.min(1, (now - t0) / 500); el.textContent = Math.round(a + (n - a) * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step);
}
function seg(id, set) { $(id).addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; set(b.dataset.v); $$(id + " button").forEach((x) => x.setAttribute("aria-pressed", x === b)); showFee(); }); }
seg("#seg-visit", (v) => { visit = v; }); seg("#seg-kind", (v) => { kind = v; });

/* ---------- Reveal on scroll ---------- */
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
  $$(".eyebrow, h2, .cups li, .for, .q, .fee-card, .hanh figure, .hanh p, .creds li, .visit-photo, .info > div").forEach((el) => { if (el.closest(".hero")) return; el.classList.add("rv"); io.observe(el); });
}
addEventListener("scroll", () => $(".top").classList.toggle("stuck", scrollY > 30), { passive: true });
showFee(false);
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
