// Eva MUA: the moving parts. With "reduce motion" on, nothing moves and everything is shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const MAIL = "eva-mua@hotmail.com", SUBJECT = "Makeup Service Enquiry";

/* ---------- The enquiry writes itself as the fields are filled in ---------- */
let n = 1;
function compose() {
  const occ = $("#f-occ").value.trim(), where = $("#f-where").value.trim(), d = $("#f-date").value;
  const date = d ? new Date(d + "T12:00:00").toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";
  const gap = (v, ph) => v ? `<b>${v.replace(/</g, "&lt;")}</b>` : `<i>${ph}</i>`;
  $("#l-body").innerHTML = `Dear Eva,<br><br>I would like to enquire about makeup for ${gap(occ, "the occasion")}${date ? ` on <b>${date}</b>` : " on <i>the date</i>"}, in ${gap(where, "the suburb or venue")}, for <b>${n === 1 ? "one person" : n + " people"}</b>.<br><br>Could you let me know your availability?<br><br>Kind regards,`;
  const text = `Dear Eva,\n\nI would like to enquire about makeup for ${occ || "[the occasion]"} on ${date || "[the date]"}, in ${where || "[the suburb or venue]"}, for ${n === 1 ? "one person" : n + " people"}.\n\nCould you let me know your availability?\n\nKind regards,\n`;
  $("#send").href = `mailto:${MAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(text)}`;
  $("#f-n").textContent = n;
}
["input", "change"].forEach((ev) => $("#form").addEventListener(ev, compose));
$("#form").addEventListener("submit", (e) => e.preventDefault());
$("#minus").addEventListener("click", () => { n = Math.max(1, n - 1); compose(); });
$("#plus").addEventListener("click", () => { n = Math.min(20, n + 1); compose(); });

if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
  $$(".no, h2, .spread figure, .cols p, .three li, .approach blockquote, .sub, .form, .letter").forEach((el) => { el.classList.add("rv"); io.observe(el); });
  $$(".three li").forEach((li, i) => li.style.setProperty("--d", i * 140 + "ms")); $$(".cols p").forEach((p, i) => p.style.setProperty("--d", i * 100 + "ms"));
}
addEventListener("scroll", () => $(".top").classList.toggle("stuck", scrollY > 30), { passive: true });
compose();
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
