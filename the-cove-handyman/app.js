// The Cove Handyman Services: the moving parts. With "reduce motion" on, nothing moves and everything is shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const TEL = "+61405627798", MAIL = "thecovehandyman@gmail.com";

/* ---------- Services (from the current site's "Our Services" list) ---------- */
const TYPES = [
  ["Residential", ["General repairs", "Hanging pictures, paintings & mirrors", "Assembling IKEA and other furniture", "Sanding skirting, floorboards and decks", "Gyprocking, plastering & painting", "Replacing smoke alarms and power points", "Fixing TVs to the wall", "Wiring TV and audio equipment", "Tiling installation & repairs", "Cabinetry: damaged panels, doors, cupboards & benches", "Cupboard handles and hinges", "Installing appliances", "Garden maintenance & repairs", "Shelving, decking, carpentry", "Silicone sealing"]],
  ["Commercial office", ["Laying carpet tiles", "Replacing ceiling tiles", "Plastering & painting", "Tiling installation & repairs", "Cabinetry: damaged panels, doors, cupboards & benches", "Silicone sealing", "Replacing light globes", "Garden maintenance and repairs"]],
  ["Industrial", ["Replacing cracked concrete", "Replacing ceiling tiles", "Plastering & painting", "Tiling installation & repairs", "Silicone sealing", "Garden maintenance and repairs"]],
];
let type = 0; const picked = new Map(); // "type|job" → label
$(".tabs").innerHTML = TYPES.map(([t], i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === 0}">${t}</button>`).join("");
function drawChecks() {
  $("#checks").innerHTML = TYPES[type][1].map((j, i) => { const k = type + "|" + j; return `<li style="--d:${i * 25}ms"><label><input type="checkbox" data-k="${k.replace(/"/g, "&quot;")}" ${picked.has(k) ? "checked" : ""}><span class="box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M4 13l5 5L20 6"/></svg></span><span class="t">${j}</span></label></li>`; }).join("");
  $$(".tabs button").forEach((b, i) => b.setAttribute("aria-selected", i === type));
}
function drawMine() {
  const items = [...picked.values()], n = items.length;
  $("#mine").innerHTML = items.map((t) => `<li>${t}</li>`).join(""); $("#empty").hidden = n > 0;
  $("#count").textContent = n; $("#count-w").textContent = n === 1 ? "job" : "jobs"; $("#dock-n").textContent = n ? n : "";
  const body = n ? `Hi Mark, could you quote on these jobs?\n${items.map((t) => "- " + t).join("\n")}\nMy suburb: \nBest time to call: ` : "Hi Mark, I'd like an obligation-free quote. The job: ";
  $("#send-sms").href = "sms:" + TEL + "?&body=" + encodeURIComponent(body);
  $("#send-mail").href = "mailto:" + MAIL + "?subject=" + encodeURIComponent("Quote request") + "&body=" + encodeURIComponent(body);
  const note = $(".note"); if (!reduce) { note.classList.remove("bump"); void note.offsetWidth; note.classList.add("bump"); }
}
$(".tabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { type = +b.dataset.i; drawChecks(); } });
$("#checks").addEventListener("change", (e) => { const k = e.target.dataset.k; if (!k) return; const [ti, job] = [k.slice(0, 1), k.slice(2)];
  if (e.target.checked) picked.set(k, job + (ti === "0" ? "" : ` (${TYPES[+ti][0].toLowerCase()})`)); else picked.delete(k); drawMine(); });

if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".sec-head, .builder, .three li, .about-card, .proof > div, .burbs li, .contact").forEach((el) => { el.classList.add("rv"); io.observe(el); });
  $$(".burbs li").forEach((li, i) => li.style.setProperty("--d", i * 28 + "ms")); $$(".three li").forEach((li, i) => li.style.setProperty("--d", i * 90 + "ms"));
}
addEventListener("scroll", () => $(".top").classList.toggle("stuck", scrollY > 8), { passive: true });
drawChecks(); drawMine();
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
