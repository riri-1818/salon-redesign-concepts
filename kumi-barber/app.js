// KUMI Barber（ご提案用の試作）。設計は DESIGN.md。メニュー名・時間・料金・説明は、いまの予約ページ（2026-10-11 取得）の原文。
lang = "en";
// [id, メニュー名, 分, 料金, 表示の料金, 説明]
const S = {
  shampoo: ["Shampoo & Scalp Massage (with any services)", 10, 10, "$10.00", "This can be only added with any other services"],
  long: ["Scissor Cut / Long hair / Restyle cutting", 45, 100, "From $100", "This service is for medium to long length hair, or if you're looking for a style change & would like a longer consultation. We allocate extra time for this service so we can do a better consultation and ensure you'll be satisfied with your new do. Advice on styling your new cut is also available. Shampoo will be preferably added for precision cut and best result. Price can be vary depends on the style. From $100"],
  cutshave: ["Haircut and Beard Trim with Hot Towel Shave", 60, 140, "$140.00", "Starting with a consultation to understand your desired results. Your beard will be shaped + groomed and edges will be finished off with an open razor shave."],
  cut: ["Hair Cut", 40, 80, "$80.00", "Standard haircut as short back and side style. If you have mid to long length hair please select the long hair option in the service menu. Thank you for respecting our time."],
  cutbeard: ["Hair & Beard Trim", 60, 130, "$130.00", ""],
  beard: ["Beard Trim", 30, 55, "$55.00", ""],
  buzz: ["Buzz Cut", 20, 50, "$50.00", "Using only clippers same length all over (0-4). After a fade on the sides? Please book in for a Haircut so I have enough time to provide the service."],
  shave: ["Beard trim With Hot Towel shave", 40, 66, "$66.00", "Beard shape (including hot towel shave) Your beard will be shaped and trimmed and edges will be finished off with a hot towel & open razor for a clean finish."],
  fade: ["Fade (Skin, Zero)", 45, 85, "$85.00", ""],
};
const ORDER = ["shampoo", "long", "cutshave", "cut", "cutbeard", "beard", "buzz", "shave", "fade"];
const HAIR = [["cut", "Short back and sides", "Standard haircut"], ["long", "Medium to long, or a restyle", "Scissor cut, longer consultation"], ["fade", "Fade", "Skin, zero"], ["buzz", "Same length all over", "Clippers only, 0–4"], ["", "Not today", "Beard only"]];
const BEARD = [["", "Leave it", "No beard service"], ["beard", "Trim", "Shaped and trimmed"], ["shave", "Trim + hot towel shave", "Open razor for a clean finish"]];
const HOURS = [null, null, null, null, null, [540, 1080], [540, 1020]]; // 土 9–6、日 9–5
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const st = { hair: "", beard: "", add: false, direct: "" };
const f = (m) => `${Math.floor(m / 60) % 12 || 12}:${String(m % 60).padStart(2, "0")} ${m < 720 ? "am" : "pm"}`;
const dur = (m) => (m >= 60 ? `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} mins` : ""}` : `${m} mins`);

// 選んだ髪とひげから、予約ページのどのメニューになるかを決める
function pick() {
  if (st.direct) return [st.direct];
  const { hair, beard } = st;
  if (hair === "cut" && beard === "beard") return ["cutbeard"];
  if (hair === "cut" && beard === "shave") return ["cutshave"];
  return [hair, beard].filter(Boolean);
}
function next() {
  const { d, m } = sydney(), h = HOURS[d];
  if (h && m >= h[0] && m < h[1]) return { open: true, text: `The chair is open now, until ${f(h[1])}`, short: `Open now · until ${f(h[1])}` };
  let k = d, days = 0; if (!(h && m < h[0])) { do { k = (k + 1) % 7; days++; } while (!HOURS[k]); }
  const mins = days * 1440 + HOURS[k][0] - m, dd = Math.floor(mins / 1440), hh = Math.floor((mins % 1440) / 60);
  const inx = dd ? `in ${dd} ${dd === 1 ? "day" : "days"}${hh ? ` ${hh} ${hh === 1 ? "hour" : "hours"}` : ""}` : hh ? `in ${hh} ${hh === 1 ? "hour" : "hours"}` : `in ${mins % 60} minutes`;
  return { open: false, text: `Next chair: ${DAYS[k]} ${f(HOURS[k][0])}, ${inx}`, short: `Next chair: ${DAYS[k].slice(0, 3)} ${f(HOURS[k][0])}` };
}
function opts() {
  const mk = (arr, key) => arr.map((o) => `<button type="button" class="opt" role="radio" aria-checked="${!st.direct && st[key] === o[0] && (o[0] !== "" || touched[key])}" data-${key}="${o[0]}"><b>${o[1]}</b><span>${o[2]}</span></button>`).join("");
  $("#q-hair .opts").innerHTML = mk(HAIR, "hair"); $("#q-beard .opts").innerHTML = mk(BEARD, "beard");
  $("#add").setAttribute("aria-checked", st.add);
}
const touched = { hair: false, beard: false };
let typing = null, lastKey = "";
function ticket(animate) {
  const ids = pick(), items = ids.map((i) => S[i]).concat(st.add && ids.length ? [S.shampoo] : []);
  const mins = items.reduce((a, x) => a + x[1], 0), price = items.reduce((a, x) => a + x[2], 0), from = ids.includes("long");
  const n = next(), el = $("#ticket");
  el.classList.toggle("is-empty", !items.length);
  $("#t-no").textContent = items.length ? `No. ${String(mins).padStart(3, "0")}` : "No. ---";
  $("#t-lines").innerHTML = items.length ? items.map((x) => `<p class="t-line"><span class="t-name">${x[0]}</span><span class="t-dots" aria-hidden="true"></span><span class="t-p">${x[3]}</span><span class="t-m">${dur(x[1])}</span></p>`).join("") : '<p class="t-wait">Choose your hair or your beard, and the service prints here.</p>';
  $("#t-min").textContent = items.length ? dur(mins) : "—";
  $("#t-label").textContent = items.length > 1 ? "Estimate" : "Price";
  $("#t-price").textContent = items.length ? `${from ? "From " : ""}$${price}` : "—";
  $("#t-next").textContent = n.text;
  $("#t-fine").textContent = !items.length ? "" : ids.length > 1 ? "Please book these two services on the booking page. The total is an estimate." : st.add ? "Add the shampoo on the booking page too. The total is an estimate." : from ? "Price can vary depending on the style." : "";
  $("#t-go").textContent = "Go to the booking page";
  const key = ids.join("+") + st.add;
  if (animate && key !== lastKey && window.gsap && !reduce && items.length) {
    if (typing) typing.kill();
    gsap.set(".t-sum b", { opacity: 1 });
    typing = gsap.timeline();
    typing.fromTo(el, { y: -26 }, { y: 0, duration: 0.5, ease: "power3.out" }, 0);
    $$("#t-lines .t-name").forEach((nm, i) => { const full = nm.textContent, o = { n: 0 }; nm.textContent = ""; typing.to(o, { n: full.length, duration: Math.min(0.9, full.length * 0.022), ease: "none", onUpdate: () => { nm.textContent = full.slice(0, Math.round(o.n)); } }, 0.12 + i * 0.25); });
    typing.fromTo("#t-lines .t-p, #t-lines .t-m, .t-sum b", { opacity: 0 }, { opacity: 1, duration: 0.25, stagger: 0.06 }, 0.4);
  }
  lastKey = key;
  // スマホ：下に小さな票を出して、選んだ結果がいつも見えるようにする
  const stub = $("#stub"); stub.hidden = !items.length;
  if (items.length) { $("#stub-n").textContent = ids.length > 1 ? `${ids.length} services` : S[ids[0]][0]; $("#stub-d").textContent = `${dur(mins)} · ${from ? "From " : ""}$${price}`; }
  $$("#list .row").forEach((r) => r.classList.toggle("is-on", ids.includes(r.dataset.svc) || (r.dataset.svc === "shampoo" && st.add && ids.length > 0)));
}
function chair() {
  const n = next(); $("#chair").classList.toggle("is-open", n.open); $("#chair-t").textContent = n.short;
  const d = sydney().d;
  $("#week").innerHTML = DAYS.map((x, i) => `<li class="${HOURS[i] ? "on" : "off"}${i === d ? " today" : ""}"><b>${x.slice(0, 3)}</b><span>${HOURS[i] ? `${f(HOURS[i][0])} – ${f(HOURS[i][1])}` : "Closed"}</span></li>`).join("");
}
function list() {
  $("#list").innerHTML = ORDER.map((id) => { const x = S[id]; return `<li class="row" data-svc="${id}"><button type="button" class="row-b" data-direct="${id}"><span class="r-name">${x[0]}</span><span class="r-len" style="--w:${(x[1] / 60) * 100}%" aria-hidden="true"><i></i></span><span class="r-min">${dur(x[1])}</span><span class="r-price">${x[3]}</span></button>${x[4] ? `<p class="r-txt">${x[4]}</p>` : ""}</li>`; }).join("");
}
document.addEventListener("click", (e) => {
  const h = e.target.closest("[data-hair]"); if (h) { st.direct = ""; st.hair = h.dataset.hair; touched.hair = true; opts(); ticket(true); return; }
  const b = e.target.closest("[data-beard]"); if (b) { st.direct = ""; st.beard = b.dataset.beard; touched.beard = true; opts(); ticket(true); return; }
  if (e.target.closest("#add")) { st.add = !st.add; opts(); ticket(true); return; }
  const d = e.target.closest("[data-direct]");
  if (d) { const id = d.dataset.direct; if (id === "shampoo") { st.add = !st.add; } else { st.direct = st.direct === id ? "" : id; } opts(); ticket(true); if (innerWidth < 980) $("#ticket").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); }
});
list(); opts(); ticket(false); chair();
setInterval(() => { chair(); $("#t-next").textContent = next().text; }, 60000);
if (window.gsap && !reduce) {
  gsap.from(".ticket", { yPercent: -70, duration: 0.9, ease: "power3.out", delay: 0.25, clearProps: "transform" });
  gsap.from("h1", { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "power3.out", clearProps: "clipPath" });
  gsap.from("#list .r-len i", { scaleX: 0, duration: 0.7, stagger: 0.04, ease: "power2.out", delay: 0.3, clearProps: "transform" });
}
