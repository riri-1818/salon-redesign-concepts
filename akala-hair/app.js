// akala Japanese Salon（ご提案用の試作）。文言と料金は、いまのサイト（2026-10-11 取得）にあるものだけ。英語のみ。
lang = "en";
// [メニュー, 時間, Senior Stylist, Master/Director, メモ]
const MENUS = [
  ["Cut", "Cut include wash and blow dry", [["Ladies cut", "1H", "$85~", "$105~"], ["Men’s cut", "45min", "$65~", "$85~"], ["Kids cut", "30min", "$50~", "$50~", "Not included w b/d"], ["Fringe cut", "15min", "$25 - $30~", "$25 - $35~"]]],
  ["Colour", "", [["Regrowth Color", "1H15", "$95~", "$100~"], ["Tint Full", "1H30", "$135~", "$160~"], ["Half Foils", "1H30", "$120~", "$150~"], ["Full Foils", "2H", "$200~", "$220~"], ["Balayages", "2H", "$160~", "$200~"], ["Bleach", "2H", "$150~", "$150~"], ["Toner", "1H", "$80~", "$100~"]]],
  ["Perm", "", [["Men’s Perm", "1H30", "$130~", "$150~"], ["Ladies Perm", "2H", "$150~", "$230~"], ["Digital Perm", "2H30", "$200~", "$230~"], ["Japanese Straightening", "2H30", "$240~", "$270~"]]],
  ["Wash / B’dry", "", [["Wash Blow Dry", "45min", "All $60 - $80~", "All $80~"]]],
  ["Treatment", "", [["Shiseido 3 Step Treatment", "1H", "$80~", "$80~"], ["Kamishitsu Kaizen + Quick Spa", "1H", "$130~", "$130~"], ["Tokio Treatment + Quick Spa", "1H", "$120~", "$120~"]]],
  ["Spa", "", [["Head spa", "1H", "$80~", "$80~"], ["Scalp Spa", "1H", "$100~", "$100~"]]],
];
const HOURS = [[600, 1080], [600, 1080], [600, 1080], [600, 1080], [600, 1080], [600, 1020], [600, 1020]]; // 月〜金 10–6、土日 10–5
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let tier = 0;
const mins = (s) => { const m = s.match(/(\d+)H(\d+)?|(\d+)min/); return m[3] ? +m[3] : +m[1] * 60 + (+m[2] || 0); };
function menus(animate) {
  $("#menus").innerHTML = MENUS.map((g) => `<article class="menu"><h3>${g[0]}</h3><ul>${g[2].map((r) => `<li><span class="m-name">${r[0]}${r[4] ? `<small>${r[4]}</small>` : ""}</span><span class="m-time"><i style="--w:${Math.round((mins(r[1]) / 150) * 100)}%"></i>${r[1]}</span><b class="m-price${r[2] !== r[3] ? " dif" : ""}">${r[2 + tier]}</b></li>`).join("")}</ul>${g[1] ? `<p class="m-note">* ${g[1]}</p>` : ""}</article>`).join("");
  $$("[data-tier]").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.tier === tier));
  if (animate && window.gsap && !reduce) gsap.from(".m-price.dif", { y: 10, opacity: 0, duration: 0.35, stagger: 0.02, ease: "power2.out", clearProps: "all" });
}
function week() {
  const { d, m } = sydney(), h = HOURS[d], f = (x) => `${Math.floor(x / 60) % 12 || 12}${x < 720 ? "am" : "pm"}`;
  $("#week").innerHTML = DAYS.map((n, i) => `<li class="${i === d ? "is-today" : ""}"><span>${n}</span><span>${f(HOURS[i][0])}–${f(HOURS[i][1])}</span></li>`).join("");
  $("#today").textContent = m >= h[0] && m < h[1] ? `Open now, until ${f(h[1])}` : m < h[0] ? `Opens today at ${f(h[0])}` : `Closed now. Opens ${DAYS[(d + 1) % 7]} at ${f(HOURS[(d + 1) % 7][0])}`;
}
document.addEventListener("click", (e) => { const b = e.target.closest("[data-tier]"); if (b) { tier = +b.dataset.tier; menus(true); } });
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim(), err = $("#f-err");
  if (!v("#f-name") || !/^\S+@\S+\.\S+$/.test(v("#f-mail")) || !v("#f-tel")) { err.textContent = "Please enter your full name, a valid email address and your mobile number."; err.hidden = false; $("#f-done").hidden = true; return; }
  err.hidden = true; $("#f-done").hidden = false;
  location.href = `mailto:akalaorganic@gmail.com?subject=${encodeURIComponent("Enquiry from the website")}&body=${encodeURIComponent(`Full name: ${v("#f-name")}\nEmail: ${v("#f-mail")}\nMobile: ${v("#f-tel")}\n\n${v("#f-msg")}`)}`;
});
menus(false); week(); setInterval(week, 60000);

if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  // 日の出：見出しの後ろから、ロゴと同じ色の光が上がってくる
  gsap.from(".hero-pic", { "--rise": "70%", duration: 1.8, ease: "power2.out" });
  gsap.from(".kicker, .hero h1, .mean, .lead, .btns, .today", { y: 22, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power2.out", clearProps: "all" });
  gsap.from(".hero-pic img", { scale: 1.1, duration: 1.6, ease: "power2.out", clearProps: "transform" });
  gsap.to(".hero-pic img", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  ScrollTrigger.create({ trigger: "#menus", start: "top 85%", once: true, onEnter: () => gsap.from(".m-time i", { scaleX: 0, duration: 0.6, stagger: 0.02, ease: "power2.out", clearProps: "transform" }) });
  ScrollTrigger.batch(".sec-head, .pano li, .p-intro p, .menu, .extra > div, .crew li, .shelf li, .facts > div, .form", {
    start: "top 90%", once: true,
    onEnter: (els) => gsap.from(els, { y: 22, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.05, clearProps: "all" }),
  });
}
