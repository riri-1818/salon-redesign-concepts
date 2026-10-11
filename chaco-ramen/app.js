// Chaco Ramen：店の切り替え／いま開いているか／一杯と Special／品書き／動画。住所・時間・文は今のサイト、品書きは両店の持ち帰り注文ページ（data.js）。
lang = "en";
const V = {
  bondi: { name: "Bondi Beach", addr: "11 O’Brien St, Bondi Beach NSW 2026", tel: "(02) 9130 4499", telh: "+61291304499", mail: "bondibeach@chacoramen.com.au",
    note: "Our newest venue, offering a more extensive menu that includes your usual suspects but more nibbles and Yakitori.",
    map: "https://www.google.com/maps/search/?api=1&query=Chaco+Ramen+Bondi+11+O%27Brien+St+Bondi+Beach", ig: "https://www.instagram.com/chaco_ramen_bondi/", order: "https://bopple.app/chacoramenbondi",
    acts: [["Reservations", "Go to the booking page", "https://www.opentable.com.au/r/chaco-ramen-bondi-reservations-bondi-beach?restref=167030&lang=en-AU&ot_source=Restaurant%20website"], ["Pick up order", "Go to the pick-up order page", "https://bopple.app/chacoramenbondi"], ["Delivery", "Go to the delivery page", "https://www.order.store/store/chaco-ramen-bondi/GJmDFzIAWl6UxwVOXdV3Kg"]],
    hours: [[[1050, 1230]], [[1050, 1230]], [[1050, 1230]], [[1050, 1230]], [[690, 870], [1020, 1260]], [[690, 1260]], [[690, 1230]]],
    hoursT: [["Mon to Thu", "17:30 – 20:30"], ["Fri", "11:30 – 14:30, 17:00 – 21:00"], ["Sat", "11:30 – 21:00"], ["Sun", "11:30 – 20:30"]],
    pairs: [["Fat Soy", "Soy Special"], ["Yuzu Scallop", "Yuzu Scallop Special"], ["Chilli Coriander", "Chilli Coriander Special"], ["Classic Chicken-soy", "Chicken-soy Special"], ["Vegetable Special"]] },
  darlo: { name: "Darlinghurst", addr: "238 Crown Street, Darlinghurst NSW 2010", tel: "(02) 9007 8352", telh: "+61290078352", mail: "info@chacoramen.com.au",
    note: "The original birthplace of Chaco Ramen (formally known as Chaco Bar), offering a ramen focused menu with sides and drinks.",
    map: "https://www.google.com/maps/search/?api=1&query=Chaco+Ramen+238+Crown+Street+Darlinghurst", ig: "https://www.instagram.com/chaco_ramen/", order: "https://bopple.app/chaco-ramen-darlinghurst",
    acts: [["Pick up order", "Go to the pick-up order page", "https://bopple.app/chaco-ramen-darlinghurst"]],
    hours: Array.from({ length: 7 }, () => [[690, 870], [1050, 1230]]),
    hoursT: [["Open 7 days", ""], ["Mon – Sun", "11:30 – 14:30, 17:30 – 20:30"]],
    pairs: [["Fat Soy", "Soy Special"], ["Yuzu Scallop", "Yuzu Scallop Special"], ["Fish Salt", "Salt Special"], ["Chilli Coriander", "Chilli Coriander Special"], ["Veggie Veggie"]] },
};
const DAY = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const hm = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const money = (p) => "$" + (Number.isInteger(p) ? p : p.toFixed(2));
const stars = (s) => s.replace(/^\*+\s*/, "").replace(/\s*\*+\s*/g, " · ");
let venue = "bondi", bi = 0, special = false, shown = { v: 0 };
const find = (name) => MENUS[venue].flatMap((s) => s[1]).find((d) => d[0] === name);

function status(v) {
  const { d, m } = sydney(), today = v.hours[d];
  const now = today.find(([a, b]) => m >= a && m < b);
  if (now) return [true, `Open now · until ${hm(now[1])}`];
  const later = today.find(([a]) => m < a);
  if (later) return [false, `Closed now · opens today at ${hm(later[0])}`];
  for (let i = 1; i <= 7; i++) { const k = (d + i) % 7; if (v.hours[k].length) return [false, `Closed now · opens ${i === 1 ? "tomorrow" : DAY[k]} at ${hm(v.hours[k][0][0])}`]; }
  return [false, "Closed"];
}
function tick() {
  const [open, text] = status(V[venue]);
  $("#status").classList.toggle("open", open); $("#st-t").textContent = `${V[venue].name}: ${text}`;
  $$("[data-st]").forEach((el) => { const [o, t] = status(V[el.dataset.st]); el.classList.toggle("open", o); el.querySelector("span").textContent = t; });
}

// 一杯（Special にすると具と料金が変わる）
const pieces = (s) => s.replace(/^w\/\s*/i, "").replace(/John Dory and Prawn/gi, "John Dory & Prawn").split(/,\s*|\s+and\s+/).map((x) => x.trim()).filter(Boolean);
function bowl(moved) {
  const v = V[venue], pair = v.pairs[bi], base = find(pair[0]), sp = pair[1] ? find(pair[1]) : null, on = special && sp, d = on ? sp : base;
  $$("#b-tabs button").forEach((b, i) => b.setAttribute("aria-pressed", i === bi));
  $("#b-name").textContent = d[0];
  const extra = sp ? pieces((sp[2].match(/(?:toppings\s+(?:and|w\/)\s+(?:extra\s+)?|extra\s+)(.+)$/i) || ["", ""])[1].replace(/^Chashu Pork,/, "Chashu Pork,")) : [];
  $("#b-chips").innerHTML = pieces(base[2]).map((x) => `<li>${x}</li>`).join("") + (on ? extra.map((x) => `<li class="x">+ ${x.replace(/^extra\s+/i, "")}</li>`).join("") : "");
  const notes = (d[3] || "").replace(/^\*+\s*/, "").split(/\s*\*{2,}\s*/);
  $("#b-broth").textContent = notes[0] && !/^contains/i.test(notes[0]) ? notes[0].replace(/^./, (c) => c.toUpperCase()) : "";
  $("#b-contains").textContent = stars(notes.slice($("#b-broth").textContent ? 1 : 0).join(" · ")) || "";
  const sb = $("#b-special"); sb.hidden = !sp; sb.setAttribute("aria-pressed", !!on);
  if (sp) $("#b-sp-t").textContent = sp[1] && base[1] ? `${sp[0]}: ${sp[2].replace(/^w\/\s*/i, "")} (+${money(sp[1] - base[1])})` : sp[0];
  const el = $("#b-price"), to = d[1];
  if (to === null) { if (window.gsap) gsap.killTweensOf(shown); el.textContent = "See the order page"; el.classList.add("txt"); }
  else {
    el.classList.remove("txt");
    if (moved && window.gsap && !reduce && shown.v) gsap.to(shown, { v: to, duration: 0.4, ease: "power2.out", overwrite: true, onUpdate: () => { el.textContent = money(Math.round(shown.v)); }, onComplete: () => { el.textContent = money(to); } });
    else { shown.v = to; el.textContent = money(to); }
  }
  $("#b-order").href = v.order;
  if (moved && window.gsap && !reduce) gsap.fromTo("#b-chips li", { opacity: 0, y: 8, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.28, stagger: 0.03, ease: "back.out(1.6)", clearProps: "all" });
}
function menu() {
  $("#board").innerHTML = MENUS[venue].map(([name, list]) => `<section class="sec"><h3>${name}</h3><ul>${list.map((d) => `<li class="dish"><span class="d-n">${d[0]}${d[4] ? ' <i class="veg">V</i>' : ""}</span><span class="d-p${d[1] === null ? " na" : ""}">${d[1] === null ? "see order page" : money(d[1])}</span>${d[2] ? `<span class="d-s">${d[2]}</span>` : ""}${d[3] ? `<span class="d-c">${stars(d[3])}</span>` : ""}</li>`).join("")}</ul></section>`).join("");
}
function shops() {
  $("#shops").innerHTML = Object.entries(V).map(([k, v]) => `<article class="shop${k === venue ? " cur" : ""}"><h3>${v.name}</h3><p class="st" data-st="${k}"><i class="dot" aria-hidden="true"></i><span></span></p>
    <p class="s-addr">${v.addr.replace(", ", ",<br>")}</p><table><caption>Opening Hours</caption>${v.hoursT.map(([a, b]) => `<tr><th>${a}</th><td>${b}</td></tr>`).join("")}</table>
    <p>Phone: <a class="link" href="tel:${v.telh}">${v.tel}</a><br>Email: <a class="link" href="mailto:${v.mail}">${v.mail}</a></p>
    <div class="s-acts">${v.acts.map(([l, t, u]) => `<a class="btn ghost" href="${u}" target="_blank" rel="noopener">${t} <span aria-hidden="true">→</span></a>`).join("")}</div>
    <p class="s-links"><a class="link" href="${v.map}" target="_blank" rel="noopener">Open in Google Maps</a> · <a class="link" href="${v.ig}" target="_blank" rel="noopener">Instagram</a></p></article>`).join("");
}
function setVenue(k, moved) {
  venue = k; bi = 0; special = false; const v = V[k];
  document.body.dataset.venue = k;
  $$(".vsw button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.venue === k));
  $("#ph-bondi").classList.toggle("on", k === "bondi"); $("#ph-darlo").classList.toggle("on", k === "darlo");
  $("#h-venue").textContent = v.name; $("#m-venue").textContent = v.name; $("#v-note").textContent = v.note;
  $("#acts").innerHTML = v.acts.map(([l, t, u], i) => `<a class="btn${i ? " ghost" : ""}" href="${u}" target="_blank" rel="noopener">${t} <span aria-hidden="true">→</span></a>`).join("");
  $("#v-line").innerHTML = `${v.addr} · <a class="link" href="tel:${v.telh}">${v.tel}</a>`;
  const a = $("#top-act"); a.href = v.acts[0][2]; a.textContent = v.acts[0][0] === "Reservations" ? "Reserve" : "Order pick-up"; a.setAttribute("aria-label", v.acts[0][1]);
  $("#m-order").href = v.order;
  $("#b-tabs").innerHTML = v.pairs.map((p, i) => `<button type="button" data-bi="${i}" aria-pressed="${i === 0}">${p[0]}</button>`).join("");
  bowl(false); menu(); shops(); tick();
  try { history.replaceState(null, "", k === "darlo" ? "#darlinghurst" : location.pathname + location.search); } catch (e) {}
  if (moved && window.gsap && !reduce) {
    gsap.fromTo(".hero h1 .l > span", { yPercent: 105 }, { yPercent: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, overwrite: true, clearProps: "transform" });
    gsap.fromTo("#status, #v-note, #acts, #v-line", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.15, ease: "power2.out", overwrite: true, clearProps: "all" });
  }
}
document.addEventListener("click", (e) => {
  const v = e.target.closest(".vsw [data-venue]"); if (v) { if (v.dataset.venue !== venue) setVenue(v.dataset.venue, true); return; }
  const b = e.target.closest("[data-bi]"); if (b) { bi = +b.dataset.bi; special = false; bowl(true); return; }
  if (e.target.closest("#b-special")) { special = !special; bowl(true); return; }
  if (e.target.closest("#play")) { $("#video").innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/3Hnxdc1iczE?autoplay=1&rel=0" title="Frozen pack instructions" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'; }
});
$("#m-contains").addEventListener("change", (e) => $("#board").classList.toggle("show-c", e.target.checked));

setVenue(location.hash === "#darlinghurst" ? "darlo" : "bondi", false);
setInterval(tick, 30000);
start(".gal li, .shop, .news, .careers, .sec");
if (window.gsap && !reduce) {
  gsap.fromTo(".hero h1 .l > span", { yPercent: 105 }, { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.15, overwrite: true, clearProps: "transform" });
  gsap.fromTo(".kick, #status, #v-note, #acts, #v-line", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, delay: 0.5, ease: "power2.out", overwrite: true, clearProps: "all" });
}
