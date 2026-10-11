// Sumi Nails（ご提案用の試作）。文言と料金は、いまのサイト（2026-10-11 取得）にあるものだけ。英語のみ。
lang = "en";
// [名前, 分（null は時間の記載なし）, 料金, 説明, 見出し行か]
const M = [
  ["nail", "Nail Polish", [["Shape and polish", 20, "$25"], ["Basic Manicure", 45, "$40", "Shaping, buffing, cuticle care and polish."], ["Deluxe Manicure", 60, "$55", "Basic plus exfoliation and massage."], ["Deluxe Men’s Manicure", null, "$40", "Shaping, buffing, cuticle care, exfoliation and massage."],
    ["Basic Pedicure", 45, "$45"], ["Deluxe Pedicure", 65, "$65", "Basic plus scrub, callus removal and massage."], ["Deluxe Men’s Pedicure", 45, "$50", "Shaping, buffing, cuticle care, scrub, callus removal and massage."]]],
  ["shellac", "Shellac", [["Shellac Manicure", 45, "$50", "Incl shaping, buffing, dry cuticle care."], ["Basic Pedicure", 45, "$55"], ["Deluxe Pedicure", 60, "$75"], ["Removal", 15, "$20", "Half price removal by making next appointment ($10)."]]],
  ["ladi", "Ladiposh Soft Gel", [["Ladiposh Manicure", 60, "$80", "One colour coat incl shaping, buffing, dry cuticle care."], ["Basic Pedicure", 60, "$85"], ["Deluxe Pedicure", 90, "$105"], ["French coating extra", null, "$10", "Base colour from $5."], ["Gradation extra", null, "$10", "Base colour from $5."],
    ["Soft gel removal", 30, "$30", "Half price removal by making next appointment ($15)."], ["Extension (per nail)", null, "$7"], ["Hard gel removal", 40, "$40"], ["Stone, glitter (from $1 each)", null, "$1"], ["Nail art (from $3)", null, "$3"]]],
  ["acrylic", "Acrylic", [["Acrylic full set - no colour", 90, "$100", "", "from 90mins"], ["Coating/infill", 60, "$70", "*full removal fee applies for filing off Shellac and Ladiposh infill.", "from 60mins"], ["Polish finish", null, "$15"], ["Shellac finish", null, "$25"], ["Ladiposh finish", null, "$30"]]],
  ["lash", "Eyelash", [["Eyelash perming", 45, "$50"],
    ["Natural set", 75, "$150", "1:1 on natural lash. Approx. 80-100 lashes per eye", "60-75mins", 1], ["7-14days infills", 60, "$70", "", "45-60mins", 2], ["15-21days infills", null, "$80", "", "", 2], ["21-28days infills", null, "$90", "", "", 2],
    ["Hybrid set", 90, "$200", "A 50/50 of classic and Russian volume", "75mins - 90mins", 1], ["7-14days infills", 60, "$90", "", "", 2], ["15-21days infills", null, "$110", "", "", 2], ["21-28days infills", null, "$130", "", "", 2],
    ["Russian natural volume", 120, "$240", "2-3 lashes per fan around 250-300 lash per eye", "90mins - 120mins", 1], ["7-14days infills", 60, "$100", "", "1 hr", 2], ["15-21days infills", 75, "$130", "", "1.25hrs", 2], ["21-28days infills", 90, "$160", "", "1.5hrs", 2],
    ["Russian medium volume", 120, "$270", "4-5 lashes per fan around 350-400 lashes per eye / Dramatic look", "2hrs", 1], ["7-14days infills", 60, "$130", "", "1 hr", 2], ["15-21days infills", 75, "$160", "", "1.25hrs", 2], ["21-28days infills", 90, "$190", "", "1.5hrs", 2],
    ["Mega Volume", 165, "$300", "6D+ lashes per fan up to 600 lashes per eye", "2.75hrs", 1], ["7-14days infills", 90, "$150", "", "1.5hrs", 2], ["15-21days infills", 90, "$180", "", "1.5hrs", 2], ["21-28days infills", 105, "$210", "", "1.75hrs", 2],
    ["Lash removal", 15, "$30"], ["Lash tint", null, "$20"], ["Lash henna", null, "$50"]]],
  ["brow", "Eyebrow", [["The Brow Queen Signature (wax, shape, tint)", 30, "$40", "Henna extra $25"], ["Brow Wax", 15, "$25"], ["Brow Tint", 15, "$20"], ["Henna Brow", 20, "$50"], ["Brow Lamination", 45, "$90"], ["Wow Brow (Wax, lamination, shape, tint)", 75, "$120", "Henna extra $25", "1.25hrs"]]],
  ["other", "Other", [["Lip Wax", null, "$15"], ["Chin Wax", null, "$15"]]],
];
const TIMES = [[0, "Any time"], [20, "20 min"], [45, "45 min"], [60, "1 hour"], [90, "1.5 hours"], [999, "No rush"]];
const HOURS = [[600, 1200], [600, 1200], [600, 1200], [600, 1200], [600, 1200], [600, 1080], null]; // 月〜金 10–8、土 10–6、日 休み
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let tab = "nail", have = 0;
const label = (r) => r[4] || (r[1] ? `${r[1]}mins` : "");
function time() { $("#time").innerHTML = TIMES.map((x) => `<button type="button" data-have="${x[0]}" aria-pressed="${x[0] === have}">${x[1]}</button>`).join(""); }
function tabs() {
  const fits = (g) => g[2].filter((r) => r[1] && r[1] <= have).length;
  $("#tabs").innerHTML = M.map((g) => `<button type="button" role="tab" data-tab="${g[0]}" aria-selected="${g[0] === tab}">${g[1]}${have && have < 999 ? `<i>${fits(g)}</i>` : ""}</button>`).join("");
}
function sheet(animate) {
  const g = M.find((x) => x[0] === tab);
  $("#sheet").innerHTML = `<h3>${g[1]}</h3><ul>${g[2].map((r) => {
    const fit = !have || have === 999 || (r[1] && r[1] <= have), cls = r[5] === 1 ? " head" : r[5] === 2 ? " inf" : "";
    return `<li class="${fit ? "" : "dim"}${cls}"><span class="r-n">${r[0]}${r[3] ? `<small>${r[3]}</small>` : ""}</span><span class="r-t">${label(r)}</span><b class="r-p">${r[2]}</b></li>`;
  }).join("")}</ul>`;
  if (animate && window.gsap && !reduce) gsap.from("#sheet li", { x: -12, opacity: 0, duration: 0.3, stagger: 0.015, ease: "power2.out", clearProps: "all" });
}
function week() {
  const { d, m } = sydney(), f = (x) => `${Math.floor(x / 60) % 12 || 12}${x < 720 ? "am" : "pm"}`, h = HOURS[d];
  $("#week").innerHTML = `<li class="${d < 5 ? "is-today" : ""}"><span>Mon – Fri</span><span>10am – 8pm</span></li><li class="${d === 5 ? "is-today" : ""}"><span>Sat</span><span>10am – 6pm</span></li><li class="${d === 6 ? "is-today" : ""}"><span>Sun</span><span>Closed</span></li>`;
  let s;
  if (h && m >= h[0] && m < h[1]) s = `Open now, until ${f(h[1])}`;
  else if (h && m < h[0]) s = `Opens today at ${f(h[0])}`;
  else { let k = (d + 1) % 7; while (!HOURS[k]) k = (k + 1) % 7; s = `Closed now. Opens ${DAYS[k]} at ${f(HOURS[k][0])}`; }
  $("#today").textContent = s;
}
document.addEventListener("click", (e) => {
  const h = e.target.closest("[data-have]"); if (h) { have = +h.dataset.have; time(); tabs(); sheet(false); return; }
  const t = e.target.closest("[data-tab]"); if (t) { tab = t.dataset.tab; tabs(); sheet(true); }
});
function sample(form, need, errId, doneId, msg) {
  $(form).addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = need.some((id) => !$(id).value.trim());
    $(errId).textContent = msg; $(errId).hidden = !bad; $(doneId).hidden = bad;
  });
}
sample("#v-form", ["#v-name", "#v-tel", "#v-name2", "#v-amt"], "#v-err", "#v-done", "Please enter your name and phone, the name of the person receiving the voucher, and the amount.");
sample("#form", ["#f-name", "#f-tel", "#f-msg"], "#f-err", "#f-done", "Please enter your name, your phone number and a message.");
time(); tabs(); sheet(false); week(); setInterval(week, 60000);

if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  // 水彩のにじみ：紙に色が広がるように、ゆっくり大きくなる
  gsap.from(".hero .blob", { scale: 0.2, opacity: 0, duration: 2.2, ease: "power2.out", stagger: 0.3, clearProps: "opacity" });
  gsap.from(".kicker, .hero h1, .lead, .btns, .today, .founder", { y: 22, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power2.out", delay: 0.2, clearProps: "all" });
  gsap.to(".b1", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".b2", { yPercent: -14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  $$(".three li img").forEach((im) => gsap.from(im, { scale: 0.3, opacity: 0, duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: im, start: "top 88%", once: true } }));
  ScrollTrigger.batch(".sec-head, .three li, .ladi, .time, .sheet, .v-text, .form, .four li, .courses li, .info", {
    start: "top 90%", once: true,
    onEnter: (els) => gsap.from(els, { y: 20, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.05, clearProps: "y" }),
  });
}
