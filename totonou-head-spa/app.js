// TOTONOU Japanese Head Spa（ご提案用の試作）。設計は DESIGN.md。文言・料金は、いまのサイト（2026-10-11 取得）にあるものだけ。
lang = "en";
const HOURS = [[660, 1200], [660, 1200], [660, 1200], [660, 1200], [660, 1200], [660, 1080], [660, 1080]]; // 月〜金 11–8、土日 11–6
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const VIEWS = { "": "home", menu: "menu", removal: "removal", visit: "visit" };
const f = (x) => `${Math.floor(x / 60) % 12 || 12}${x % 60 ? ":" + String(x % 60).padStart(2, "0") : ""}${x < 720 ? "am" : "pm"}`;

// ---------- いま営業中か（案内の柱） ----------
function status() {
  const { d, m } = sydney(), h = HOURS[d], el = $("#status");
  const on = m >= h[0] && m < h[1];
  el.classList.toggle("is-open", on);
  $("#status-t").textContent = on ? `Open now, until ${f(h[1])}` : m < h[0] ? `Opens today at ${f(h[0])}` : `Opens ${DAYS[(d + 1) % 7]} at ${f(HOURS[(d + 1) % 7][0])}`;
}

// ---------- 画面の切り替え（#/menu など） ----------
let current = "home";
function go(animate) {
  const key = location.hash.replace(/^#\/?/, ""), v = VIEWS[key] || "home";
  $$("[data-view]").forEach((a) => { const on = a.dataset.view === v; a.classList.toggle("is-on", on); if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  if (v === current && animate) return;
  const from = $("#v-" + current), to = $("#v-" + v); current = v;
  const show = () => { $$(".view").forEach((s) => { s.hidden = s !== to; s.classList.toggle("is-on", s === to); }); $("#stage").scrollTo?.(0, 0); scrollTo(0, 0); if (v === "home") settle(); };
  if (!animate || reduce || !window.gsap || from === to) return show();
  gsap.to(from, { opacity: 0, y: -8, duration: 0.16, ease: "power1.in", onComplete: () => { gsap.set(from, { clearProps: "all" }); show(); gsap.from(to, { opacity: 0, y: 12, duration: 0.3, ease: "power2.out", clearProps: "all" }); } });
}
addEventListener("hashchange", () => go(true));

// ---------- 「整う」：ずれていた文字が、きちんとそろう ----------
let split = null, tl = null;
function settle() {
  const h = $(".align"); if (!h) return;
  if (reduce || !window.gsap || !window.SplitText) { h.classList.add("is-set"); return; }
  if (tl) tl.kill(); if (split) split.revert();
  h.classList.remove("is-set");
  split = new SplitText(h, { type: "chars,words", charsClass: "ch" });
  const rnd = gsap.utils.random;
  gsap.set(split.chars, { x: () => rnd(-16, 16), y: () => rnd(-13, 13), rotation: () => rnd(-11, 11), opacity: () => rnd(0.25, 0.6) });
  gsap.set(".kanji", { letterSpacing: "0.5em", opacity: 0.35 });
  tl = gsap.timeline({ delay: 0.5, onComplete: () => { h.classList.add("is-set"); } });
  tl.to(split.chars, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1.5, ease: "power3.inOut", stagger: { each: 0.012, from: "random" } })
    .to(".kanji", { letterSpacing: "0.04em", opacity: 1, duration: 1.7, ease: "power3.inOut" }, 0)
    .from(".post, .state-actions", { opacity: 0, y: 10, duration: 0.5, stagger: 0.12, ease: "power2.out", clearProps: "all" }, 1.25);
}
$("#replay").addEventListener("click", settle);

// ---------- メニュー：頭・体・顔のスイッチ ----------
// [名前, 入っているもの, 分, 料金, 頭の種類（wet / dry / any / ""）, 中身の説明, 追記]
const COURSES = [
  ["Wet Head Spa & Shoulder Massage", "h", 60, "$125", "wet", "Wet Head Spa + Neck & Shoulder Massage"],
  ["Dry Head Spa & Shoulder Massage", "h", 60, "$125", "dry", "Dry Head Spa and Neck & Shoulder Massage", "Deep relax"],
  ["Wet Head Spa & Body Massage", "hb", 80, "$155", "wet", "Wet Head Spa and Body Massage"],
  ["Dry Head Spa & Body Massage", "hb", 80, "$155", "dry", "Dry Head Spa and Body Massage"],
  ["Halloween Reset", "hb", 90, "From $150", "any", "90min Body massage + Head Spa. You can choose Dry or Wet head spa.", "Add Facial $30, 20min"],
  ["Japanese Relaxation Body Massage", "b", 30, "$75", "", "Oil or Deep Tissue Body Massage"],
  ["Japanese Relaxation Body Massage", "b", 45, "$90", "", "Oil or Deep Tissue Body Massage"],
  ["Japanese Relaxation Body Massage", "b", 60, "$105", "", "Oil or Deep Tissue Body Massage"],
  ["Japanese Relaxation Body Massage", "b", 90, "$165", "", "Oil or Deep Tissue Body Massage"],
  ["Facial Lift up Massage", "f", 30, "$75", "", "Facial Cleansing and Lift up Oil Massage"],
  ["Photo Facial", "f", 0, "$100", "", "Facial machine"],
  ["Radio Frequency", "f", 0, "$100", "", "Facial machine"],
  ["Executive Matcha Special", "hf", 120, "$265", "wet", "Facial Special (Cleansing, Massage, EMS, Matcha Mask & Sugar moisture) + Wet Head Spa + Neck, Shoulder Massage", "Indulge in the ultimate relaxation experience."],
  ["Spring Campaign", "hbf", 110, "$180", "any", "Wet or Dry Head Spa + Body Massage + Facial Massage", "If you prefer to skip the facial massage, we can extend the time spent on your Body massage and Dry Head Spa instead."],
  ["Silky Hair, Facial & Body Special", "hbf", 120, "$285", "wet", "Wet Head Spa + 3 Step Hair Treatment + Facial Cleansing, Lift up Massage & Facial Mask + Body Massage", "A special package for deep relaxation and smooth, nourished hair and skin."],
];
const WD = {
  wet: ["Wet head spa", ["Scalp cleansing", "Scalp detox", "Dandruff control", "Hair nourishment", "Damage repair", "Aromatherapy effect", "Hair growth support", "Rejuvenating effect"], "Wet Head Spa includes hair dryer.", "Optional add-on: 3 Step Hair Treatment +$50. Our most popular and highly recommended add-on."],
  dry: ["Dry head spa", ["Relaxation", "Mental refreshment", "Stress relief", "Anxiety reduction", "Improved sleep quality", "Eye strain relief", "Headache relief", "Brain fatigue relief"], "Deep relax.", "Dry Head Spa option: if you prefer to skip the facial massage, we can extend the time spent on your Body massage and Dry Head Spa instead."],
};
const M = { head: true, body: false, face: false, wd: "wet" };
const mins = (m) => (m ? (m >= 60 ? `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`) : "");
function mixer(animate) {
  $$(".part").forEach((b) => b.setAttribute("aria-checked", M[b.dataset.part]));
  const key = (M.head ? "h" : "") + (M.body ? "b" : "") + (M.face ? "f" : "");
  const names = [M.head && "Head", M.body && "Body", M.face && "Face"].filter(Boolean);
  const list = COURSES.filter((c) => c[1] === key && (!c[4] || c[4] === "any" || c[4] === M.wd));
  const other = COURSES.filter((c) => c[1] === key && c[4] && c[4] !== "any" && c[4] !== M.wd).length;
  $("#r-sum").innerHTML = !key ? "Switch on at least one part." : list.length ? `<b>${names.join(" + ")}</b><span>${list.length} ${list.length === 1 ? "course" : "courses"}${M.head ? ` · ${WD[M.wd][0].toLowerCase()}` : ""}</span>` : `<b>${names.join(" + ")}</b><span>${other ? `Only with a ${M.wd === "wet" ? "dry" : "wet"} head spa. Switch below.` : "There is no set course for this combination. Please ask us."}</span>`;
  $("#courses").innerHTML = list.map((c) => { const t = `${c[0]}${c[2] ? ` (${mins(c[2])})` : ""} ${c[3]}`;
    return `<li><div class="c-top"><h3>${c[0]}</h3><p class="c-price">${c[3]}</p></div><p class="c-meta">${c[2] ? `<span class="c-min">${mins(c[2])}</span>` : ""}<span class="c-bar" style="--w:${Math.round(((c[2] || 0) / 120) * 100)}%" aria-hidden="true"><i></i></span></p><p class="c-in">${c[5]}</p>${c[6] ? `<p class="c-add">${c[6]}</p>` : ""}<a class="textbtn" href="#/visit" data-req="${t.replace(/"/g, "&quot;")}">Request this course</a></li>`; }).join("")
    + (key && !list.length && !other ? `<li class="none"><a class="btn btn--ghost" href="#/visit" data-req="${names.join(" + ")} (please advise)">Ask about ${names.join(" + ").toLowerCase()}</a></li>` : "");
  $("#wetdry").classList.toggle("is-off", !M.head);
  if (animate && window.gsap && !reduce) { gsap.from("#courses > li", { opacity: 0, x: 14, duration: 0.32, stagger: 0.05, ease: "power2.out", clearProps: "all" }); gsap.from("#courses .c-bar i", { scaleX: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", clearProps: "transform" }); }
}
function wetdry(animate) {
  $$("[data-wd]").forEach((b) => b.setAttribute("aria-checked", b.dataset.wd === M.wd));
  $(".wd-head .seg").dataset.on = M.wd;
  const w = WD[M.wd];
  $("#wd-body").innerHTML = `<ul>${w[1].map((x) => `<li>${x}</li>`).join("")}</ul><div class="wd-notes"><p>${w[2]}</p><p>${w[3]}</p></div>`;
  if (animate && window.gsap && !reduce) gsap.from("#wd-body li", { opacity: 0, y: 8, duration: 0.28, stagger: 0.03, ease: "power2.out", clearProps: "all" });
}

// ---------- 脱毛：部位と回数で合計 ----------
const TIMES = [1, 3, 6, 12];
const AREAS = [["Face", [50, 135, 285, 440]], ["Beard", [40, 110, 225, 460]], ["Neck", [40, 110, 225, 460]], ["Mouth", [35, 95, 195, 400]], ["Upper back", [45, 125, 255, 520]], ["Under back", [45, 125, 255, 520]], ["Upper arms", [45, 125, 255, 520]], ["Under arms", [35, 95, 195, 400]],
  ["Hand", [20, 50, 105, 220]], ["Chest", [40, 110, 225, 460]], ["Stomach", [35, 95, 195, 400]], ["VIO", [50, 140, 285, 580]], ["Upper legs", [45, 125, 255, 520]], ["Under legs", [35, 95, 195, 400]], ["Foot", [20, 50, 105, 220]]];
const R = { t: 0, on: new Set() };
let sumShown = 0;
function shr(animate) {
  $("#times").innerHTML = TIMES.map((n, i) => `<button type="button" role="radio" aria-checked="${i === R.t}" data-times="${i}">${n} ${n === 1 ? "time" : "times"}</button>`).join("") + '<span class="seg-thumb" aria-hidden="true"></span>';
  $("#times").dataset.on = R.t;
  $("#areas").innerHTML = AREAS.map((a, i) => `<li><button type="button" class="area" role="checkbox" aria-checked="${R.on.has(i)}" data-area="${i}"><span class="tick" aria-hidden="true"></span><span class="a-n">${a[0]}</span><span class="a-p">$${a[1][R.t]}</span></button></li>`).join("");
  const picked = [...R.on].sort((x, y) => x - y), total = picked.reduce((s, i) => s + AREAS[i][1][R.t], 0), n = TIMES[R.t];
  $("#bill-list").innerHTML = picked.length ? picked.map((i) => `<li><span>${AREAS[i][0]}</span><b>$${AREAS[i][1][R.t]}</b></li>`).join("") : '<li class="empty">Choose one or more areas.</li>';
  $("#bill-times").textContent = `${n} ${n === 1 ? "time" : "times"}`;
  const el = $("#bill-sum");
  if (animate && window.gsap && !reduce && sumShown !== total) { const o = { v: sumShown }; gsap.to(o, { v: total, duration: 0.4, ease: "power2.out", onUpdate: () => { el.textContent = "$" + Math.round(o.v); } }); } else el.textContent = "$" + total;
  sumShown = total;
  $("#bill-per").textContent = picked.length && n > 1 ? `About $${Math.round(total / n)} a time.` : "";
  $("#bill-go").dataset.req = picked.length ? `SHR hair removal, ${n} ${n === 1 ? "time" : "times"}: ${picked.map((i) => AREAS[i][0]).join(", ")} ($${total})` : "SHR hair removal";
  $("#bill-clear").hidden = !picked.length;
  $("#shr-table").innerHTML = `<thead><tr><th>Area</th>${TIMES.map((x) => `<th>${x} ${x === 1 ? "time" : "times"}</th>`).join("")}</tr></thead><tbody>${AREAS.map((a) => `<tr><th>${a[0]}</th>${a[1].map((v) => `<td>$${v}</td>`).join("")}</tr>`).join("")}</tbody>`;
}

// ---------- 来店：営業時間と予約の申込み ----------
function visit() {
  const { d, m } = sydney(), h = HOURS[d], on = m >= h[0] && m < h[1];
  $("#v-status").innerHTML = `<span class="dot${on ? " on" : ""}" aria-hidden="true"></span>${on ? `Open now, until ${f(h[1])}` : m < h[0] ? `Opens today at ${f(h[0])}` : `Closed now. Opens ${DAYS[(d + 1) % 7]} at ${f(HOURS[(d + 1) % 7][0])}`}`;
  $("#week").innerHTML = DAYS.map((n, i) => `<li class="${i === d ? "is-today" : ""}"><span>${n.slice(0, 3)}</span><i style="--a:${((HOURS[i][0] - 600) / 660) * 100}%;--b:${((HOURS[i][1] - 600) / 660) * 100}%"></i><b>${f(HOURS[i][0])} – ${f(HOURS[i][1])}</b></li>`).join("");
  const sel = $("#f-time"); if (!sel.options.length) sel.innerHTML = '<option value="">Any time</option>' + Array.from({ length: 9 }, (_, i) => `<option>${f(660 + i * 60)}</option>`).join("");
}

document.addEventListener("click", (e) => {
  const p = e.target.closest(".part"); if (p) { M[p.dataset.part] = !M[p.dataset.part]; mixer(true); return; }
  const w = e.target.closest("[data-wd]"); if (w) { M.wd = w.dataset.wd; wetdry(true); mixer(true); return; }
  const t = e.target.closest("[data-times]"); if (t) { R.t = +t.dataset.times; shr(true); return; }
  const a = e.target.closest("[data-area]"); if (a) { const i = +a.dataset.area; R.on.has(i) ? R.on.delete(i) : R.on.add(i); shr(true); return; }
  if (e.target.closest("#bill-clear")) { R.on.clear(); shr(true); return; }
  const r = e.target.closest("[data-req]"); if (r) { const box = $("#f-what"); box.value = r.dataset.req; if (!r.getAttribute("href")) { location.hash = "#/visit"; } setTimeout(() => box.focus({ preventScroll: true }), 500); }
});
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim(), err = $("#f-err");
  if (!v("#f-what") || !v("#f-name") || !v("#f-tel")) { err.textContent = "Please tell us what you would like, your name and your phone number."; err.hidden = false; $("#f-done").hidden = true; return; }
  err.hidden = true; $("#f-done").hidden = false;
  location.href = `mailto:totonou.offical380@gmail.com?subject=${encodeURIComponent("Reservation request")}&body=${encodeURIComponent(`Request: ${v("#f-what")}\nDay: ${v("#f-day") || "-"}\nTime: ${v("#f-time") || "Any time"}\nName: ${v("#f-name")}\nPhone: ${v("#f-tel")}\n\n${v("#f-msg")}`)}`;
});

mixer(false); wetdry(false); shr(false); visit();
status(); setInterval(() => { status(); visit(); }, 60000);
go(false);
