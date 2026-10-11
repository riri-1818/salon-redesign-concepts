// AMANO Remedial Massage（ご提案用の試作）。設計は DESIGN.md。文言・料金は、いまのサイト（2026-10-11 取得）にあるものだけ。
lang = "en";
const EX = ["If you want to relax, I will do gentle slow flows.", "If you are in the middle of them, I will mix them.", "If you want to release tension/pain, I will spend more time in the area and go deep/firm pressure."];
// 圧の物差し：その強さについての本人の言葉（New Patient Form のページ）
const SC = (n) => n === 1 ? "1 – very gentle." : n <= 3 ? "Gentle. Pressure is adjusted from gentle (superficial) to firm (deep), according to your comfort level." : n <= 6 ? "Recommended pressure: 4 to 6. This range is generally effective while allowing your muscles to relax." + (n === 6 ? " Please let me know if your discomfort exceeds 5 during the session." : "") : n === 7 ? "Some clients prefer deeper pressure (around 7) for faster results, but deep breathing is important for safety and relaxation." : n < 10 ? "Using too much pressure while holding your breath can reduce effectiveness and may cause discomfort. Always communicate what feels right for you." : "10 – extremely painful. Please let me know if your discomfort exceeds 5 during the session.";
const MINS = [[45, 80], [60, 100], [75, 115], [90, 140]];
const AREAS = [
  ["Maintaining good health", ["Relaxation", "Stress release", "Anxiety", "Insomnia", "Improve immune function", "Increase flexibility and range of motion", "etc."]],
  ["Head, face and neck", ["Neck and Shoulder Pain or Tightness", "Headaches", "TMJ Dysfunction", "Post-Traumatic Injuries (Subacute–Chronic Stage)"]],
  ["Body", ["Lower Back Pain or Tightness", "Lordosis (Facet-related issues)", "Flat Back (Disc-related issues)", "Kyphosis", "Scoliosis", "Respiratory Problems"]],
  ["Upper limbs", ["Shoulder Pain or Tightness", "Limited Range of Motion (ROM)", "Post-Fracture / Post-Surgical Conditions"]],
  ["Lower limbs", ["Hip, Knee, or Ankle Pain or Tightness", "Piriformis Syndrome", "Sacroiliac Joint Dysfunction", "Post-Fracture / Post-Surgical Conditions (e.g., joint replacement)"]],
  ["Women’s health", ["Dysmenorrhea", "Irregular Menstruation", "PMS (Premenstrual Syndrome)", "Scar Tissue", "Post-Surgical Conditions (e.g., skin graft, plastic surgery)"]],
];
// 月〜日：どこにいるか [場所, 開始, 終了]
const WEEK = [null, ["Lane Cove", 570, 990], ["Ryde", 585, 930], ["Ryde", 585, 990], ["Ryde", 585, 990], null, null];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const B = { m: 1, dn: false, aroma: false, first: false };
let ex = 1, area = 0, shown = 100;
const f = (x) => `${Math.floor(x / 60) % 12 || 12}:${String(x % 60).padStart(2, "0")}${x < 720 ? "am" : "pm"}`;

function expect() { $$("[data-ex]").forEach((b) => b.setAttribute("aria-checked", +b.dataset.ex === ex)); $(".tri").dataset.on = ex; $("#ex-out").textContent = EX[ex]; }
function scale(animate) {
  const n = +$("#sc").value, el = $("#sc-n"), from = +el.textContent || n;
  $("#sc").style.setProperty("--p", `${((n - 1) / 9) * 100}%`);
  $("#sc-out").textContent = SC(n);
  $(".scale").dataset.zone = n <= 3 ? "soft" : n <= 6 ? "ok" : "deep";
  $$(".sc-ticks li").forEach((li, i) => li.classList.toggle("is-on", i + 1 === n));
  if (animate && window.gsap && !reduce && from !== n) { const o = { v: from }; gsap.to(o, { v: n, duration: 0.25, ease: "power1.out", onUpdate: () => { el.textContent = Math.round(o.v); } }); } else el.textContent = n;
}
function builder(animate) {
  $("#mins").innerHTML = MINS.map((m, i) => `<button type="button" role="radio" aria-checked="${i === B.m}" data-m="${i}"><b>${m[0]}</b><span>minutes</span><em>$${m[1]}</em></button>`).join("");
  $$("[data-add]").forEach((b) => b.setAttribute("aria-checked", B[b.dataset.add]));
  const m = MINS[B.m], price = m[1] + (B.dn ? 30 : 0) + (B.aroma ? 10 : 0), time = m[0] + (B.first ? 15 : 0);
  $("#b-line").innerHTML = `${m[0]} Minutes Remedial Massage${B.dn ? "<br>+ Dry needling" : ""}${B.aroma ? "<br>+ Aroma essential oil" : ""}${B.first ? "<br>+ First visit: form and discussion" : ""}`;
  $("#b-time").textContent = `Please allow ${time} minutes`;
  const el = $("#b-price");
  if (animate && window.gsap && !reduce && shown !== price) { const o = { v: shown }; gsap.to(o, { v: price, duration: 0.35, ease: "power2.out", onUpdate: () => { el.textContent = "$" + Math.round(o.v); } }); } else el.textContent = "$" + price;
  shown = price;
}
function areas(animate) {
  $("#a-tabs").innerHTML = AREAS.map((a, i) => `<button type="button" role="tab" aria-selected="${i === area}" data-area="${i}"><i>${String(i + 1).padStart(2, "0")}</i>${a[0]}</button>`).join("");
  $("#a-panel").innerHTML = `<h3>${AREAS[area][0]}</h3><ul>${AREAS[area][1].map((x) => `<li>${x}</li>`).join("")}</ul>`;
  if (animate && window.gsap && !reduce) gsap.from("#a-panel li", { opacity: 0, x: 10, duration: 0.25, stagger: 0.03, ease: "power2.out", clearProps: "all" });
}
function week() {
  const { d, m } = sydney();
  $("#wk").innerHTML = DAYS.map((n, i) => { const w = WEEK[i]; return `<li class="${w ? (w[0] === "Ryde" ? "ryde" : "lane") : "off"}${i === d ? " now" : ""}"><b>${n.slice(0, 3)}</b><span>${w ? w[0] : "—"}</span><i>${w ? `${f(w[1])}–${f(w[2])}` : ""}</i></li>`; }).join("");
  const w = WEEK[d]; let s;
  if (w && m >= w[1] && m < w[2]) s = `Today I am at ${w[0] === "Ryde" ? "the Ryde clinic" : "Dr. Li TCM Clinic, Lane Cove"}, until ${f(w[2])}.`;
  else { let k = d, days = 0; if (!(w && m < w[1])) { do { k = (k + 1) % 7; days++; } while (!WEEK[k]); } s = `Next: ${days === 0 ? "today" : DAYS[k]} at ${WEEK[k][0] === "Ryde" ? "the Ryde clinic" : "Dr. Li TCM Clinic, Lane Cove"}, from ${f(WEEK[k][1])}.`; }
  $("#today").textContent = s;
}
document.addEventListener("click", (e) => {
  const x = e.target.closest("[data-ex]"); if (x) { ex = +x.dataset.ex; expect(); return; }
  const m = e.target.closest("[data-m]"); if (m) { B.m = +m.dataset.m; builder(true); return; }
  const a = e.target.closest("[data-add]"); if (a) { B[a.dataset.add] = !B[a.dataset.add]; builder(true); return; }
  const t = e.target.closest("[data-area]"); if (t) { area = +t.dataset.area; areas(true); }
});
$("#sc").addEventListener("input", () => scale(true));
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim(), err = $("#f-err");
  if (!v("#f-name") || !/^\S+@\S+\.\S+$/.test(v("#f-mail"))) { err.textContent = "Please enter your name and a valid email address."; err.hidden = false; $("#f-done").hidden = true; return; }
  err.hidden = true; $("#f-done").hidden = false;
  location.href = `mailto:amanoremedialmassage@gmail.com?subject=${encodeURIComponent("Appointment request")}&body=${encodeURIComponent(`Name: ${v("#f-name")}\nEmail: ${v("#f-mail")}\nRequest: ${v("#f-what") || "-"}\n\n${v("#f-msg")}`)}`;
});
expect(); scale(false); builder(false); areas(false); week(); setInterval(week, 60000);

// 柱（いま読んでいる記事）と、読み進んだ量
const marks = $$("[data-n]");
function running() {
  const y = scrollY + innerHeight * 0.35; let cur = marks[0];
  marks.forEach((s) => { if (s.offsetTop <= y) cur = s; });
  $("#run-n").textContent = cur.dataset.n; $("#run-t").textContent = cur.dataset.t;
  $("#progress").style.transform = `scaleX(${Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))})`;
}
addEventListener("scroll", running, { passive: true }); running();

if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".cover h1 .l > span", { yPercent: 105, duration: 0.9, ease: "power3.out", stagger: 0.09, clearProps: "transform" });
  gsap.from(".kick, .cover-b, .today", { opacity: 0, duration: 0.6, delay: 0.6, stagger: 0.1, clearProps: "opacity" });
  gsap.from(".plate img", { clipPath: "inset(0 100% 0 0)", duration: 1.2, ease: "power3.inOut", delay: 0.3, clearProps: "clipPath" });
  $$(".ph h2").forEach((h) => gsap.from(h, { clipPath: "inset(0 0 100% 0)", y: 18, duration: 0.7, ease: "power3.out", clearProps: "all", scrollTrigger: { trigger: h, start: "top 86%", once: true } }));
  $$(".strip img").forEach((im, i) => gsap.from(im, { clipPath: i ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", duration: 1, ease: "power3.inOut", clearProps: "clipPath", scrollTrigger: { trigger: im, start: "top 88%", once: true } }));
  gsap.from(".room li b", { opacity: 0, y: 24, duration: 0.6, stagger: 0.1, ease: "power2.out", clearProps: "all", scrollTrigger: { trigger: ".room", start: "top 82%", once: true } });
}
