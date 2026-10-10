// Hair By YUKI — the parts that change: this week's hours, the price list, the booking message. Language and Sydney-time helpers are in ds.js; motion uses GSAP.

/* opening hours, Monday to Sunday, as on the current site (by appointment) */
const HOURS = [null, [570, 1080, "9:30am to 6pm", "9:30〜18:00"], [570, 1200, "9:30am to 8pm", "9:30〜20:00"], [570, 1020, "9:30am to 5pm", "9:30〜17:00"], [570, 1020, "9:30am to 5pm", "9:30〜17:00"], [570, 900, "9:30am to 3pm", "9:30〜15:00"], null];
const DAYS = [["Mon", "月"], ["Tue", "火"], ["Wed", "水"], ["Thu", "木"], ["Fri", "金"], ["Sat", "土"], ["Sun", "日"]];
const DAYS_L = [["Monday", "月曜"], ["Tuesday", "火曜"], ["Wednesday", "水曜"], ["Thursday", "木曜"], ["Friday", "金曜"], ["Saturday", "土曜"], ["Sunday", "日曜"]];

/* prices, as on the current site */
const MENU = [
  { id: "cut", n: ["Haircut", "カット"], rows: [[["Ladies", "レディース"], "$100", ["Style change +$10", "スタイルチェンジは +$10"]], [["Mens", "メンズ"], "$80"], [["Fringe", "前髪"], "$25"], [["Blow-dry", "ブロー"], "$50-$65"]] },
  { id: "col", n: ["Colour", "カラー"], rows: [[["Tint regrowth", "リタッチ（根元）"], "$100"], [["Colour", "カラー"], "$110-$150"], [["Foils, half complete", "ホイル（ハーフ）"], "$295"], [["Foils, full complete", "ホイル（フル）"], "$370"], [["Balayage", "バレイヤージュ"], ["Free consultation", "無料でご相談"], ["As everyone’s hair is different and requires individual treatment, I’m more than happy to provide a free consultation at the salon.", "髪は一人ひとり違い、それぞれに合った施術が必要です。サロンで、無料でご相談を承ります。"]]] },
  { id: "care", n: ["Treatment and care", "トリートメント・ケア"], rows: [[["Bondpro+ (protection)", "Bondpro+（保護）"], ["$55 + length", "$55＋長さ"]], [["Repair Keratin treatment", "リペア・ケラチン・トリートメント"], ["$370 + length", "$370＋長さ"], ["Kerasilk control keratin treatment by Goldwell. Long-lasting transformations of unmanageable and frizzy hair. KeraShape Technology. Simply fabulous, non-chemical (2 to 3 hours).", "Goldwell の Kerasilk コントロール・ケラチン・トリートメント。まとまりにくい髪、広がる髪を、長く扱いやすくします。KeraShape テクノロジー。薬剤に頼らない施術です（2〜3時間）。"]], [["Care bleach", "ケアブリーチ"], "$48-98", ["First choice for all types of highlights and full head / balayage applications. The Anti-Yellow-System counteracts unwanted yellow tones for a beautiful colour result.", "ハイライト、全体、バレイヤージュのどれにも向くブリーチです。Anti-Yellow-System が黄ばみをおさえ、きれいな色に仕上げます。"]]],
    photos: [["kerasilk", ["Kerasilk Control by Goldwell", "Goldwell の Kerasilk Control"]], ["bleach", ["Care bleach being mixed", "ケアブリーチを混ぜているところ"]]] },
];
const TIMES = [["any time", "時間はいつでも"], ["morning", "午前"], ["around midday", "お昼ごろ"], ["afternoon", "午後"], ["evening (Wednesday only)", "夕方（水曜のみ）"]];
const NOW = sydney();
let tab = "cut";
const st = { svc: 0, day: 0, time: 0 };
const val = (v) => typeof v === "string" ? v : t(v);
const svcs = () => MENU.flatMap((m) => m.rows.map((r) => ({ g: m.n, n: r[0], p: r[1] })));

function week() {
  $("#days").innerHTML = DAYS.map((d, i) => { const h = HOURS[i]; return `<li class="${i === NOW.d ? "now" : ""}${h ? "" : " off"}"><b>${t(d)}</b><span>${h ? t([h[2].replace(" to ", "–").replace(/am|pm/g, (m) => m), h[3]]) : t(["Closed", "お休み"])}</span>${i === NOW.d ? `<i>${t(["Today", "今日"])}</i>` : ""}</li>`; }).join("");
  const h = HOURS[NOW.d], on = h && NOW.m >= h[0] && NOW.m < h[1];
  let i = 1; while (!HOURS[(NOW.d + i) % 7]) i++;
  const nx = DAYS_L[(NOW.d + i) % 7];
  $("#today").innerHTML = `<i class="${on ? "on" : ""}"></i>` + (on ? t([`Open today until ${h[2].split(" to ")[1]}, by appointment`, `本日は ${h[3].split("〜")[1]} まで（予約制）`]) : h && NOW.m < h[0] ? t(["Opens today at 9:30am, by appointment", "本日は 9:30 から（予約制）"]) : t([`Closed now. Next open ${i === 1 ? "tomorrow" : nx[0]} from 9:30am`, `ただいま時間外です。次は${i === 1 ? "明日" : nx[1]} 9:30 から`]));
  $("#hours").innerHTML = DAYS_L.map((d, k) => `${t(d)}${t([": ", "　"])}${HOURS[k] ? t([HOURS[k][2], HOURS[k][3]]) : t(["closed", "お休み"])}`).join("<br>") + `<br>${t(["By appointment", "予約制"])}`;
}
function menu(move) {
  $("#tabs").innerHTML = MENU.map((m) => `<button type="button" class="tab" role="tab" aria-selected="${m.id === tab}" data-tab="${m.id}">${t(m.n)}</button>`).join("");
  const m = MENU.find((x) => x.id === tab), all = svcs();
  $("#panel").innerHTML = `<ul class="rows">${m.rows.map((r) => { const idx = all.findIndex((s) => s.n === r[0]); return `<li><div><h3>${t(r[0])}</h3>${r[2] ? `<p>${t(r[2])}</p>` : ""}</div><b>${val(r[1])}</b><a href="#book" data-svc="${idx}" aria-label="${t(["Book", "予約する"])}: ${t(r[0])}">${t(["Book", "予約する"])}</a></li>`; }).join("")}</ul>` + (m.photos ? `<div class="pics">${m.photos.map((p) => `<figure><img loading="lazy" src="img/${p[0]}.jpg" width="828" height="1033" alt="${t(p[1])}"><figcaption>${t(p[1])}</figcaption></figure>`).join("")}</div>` : "");
  if (move && window.gsap && !reduce) gsap.from("#panel .rows li, #panel figure", { y: 16, opacity: 0, duration: .4, stagger: .05, ease: "power2.out", clearProps: "transform,opacity" });
}
/* booking request: the choices become a message */
function nextDays() {
  const out = [];
  for (let i = 0; i < 14 && out.length < 8; i++) {
    const d = (NOW.d + i) % 7; if (!HOURS[d]) continue;
    const f = new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-AU", { timeZone: "Australia/Sydney", day: "numeric", month: "long" }).format(new Date(Date.now() + i * 864e5));
    out.push({ d, label: lang === "ja" ? `${f}（${DAYS[d][1]}）` : `${DAYS_L[d][0]} ${f}` });
  }
  return out;
}
function form() {
  const all = svcs(), ds = nextDays(); if (st.day >= ds.length) st.day = 0;
  $("#f-svc").innerHTML = MENU.map((m) => `<optgroup label="${t(m.n)}">${m.rows.map((r) => { const i = all.findIndex((s) => s.n === r[0]); return `<option value="${i}"${i === st.svc ? " selected" : ""}>${t(r[0])}（${val(r[1])}）</option>`; }).join("")}</optgroup>`).join("");
  $("#f-day").innerHTML = ds.map((d, i) => `<option value="${i}"${i === st.day ? " selected" : ""}>${d.label}</option>`).join("");
  $("#f-time").innerHTML = TIMES.map((x, i) => `<option value="${i}"${i === st.time ? " selected" : ""}>${t(x).replace(/^./, (c) => c.toUpperCase())}</option>`).join("");
  slip();
}
function text() {
  const s = svcs()[st.svc], d = nextDays()[st.day], name = $("#f-name").value.trim();
  return lang === "ja" ? `こんにちは。Hair By YUKI の予約をお願いします。\nメニュー：${s.n[1]}（${val(s.p)}）\n希望日：${d.label} ${TIMES[st.time][1]}\n名前：${name}` : `Hello Yuki, I would like to make a booking.\nService: ${s.n[0]} (${val(s.p)})\nDay: ${d.label}, ${TIMES[st.time][0]}\nName: ${name}`;
}
function slip() { const m = text(); $("#msg").textContent = m; $("#sms").href = `sms:+61435391543?&body=${encodeURIComponent(m)}`; }
$("#req").addEventListener("change", (e) => { const id = e.target.id; if (id === "f-svc") st.svc = +e.target.value; if (id === "f-day") st.day = +e.target.value; if (id === "f-time") st.time = +e.target.value; slip(); });
$("#f-name").addEventListener("input", slip);
$("#req").addEventListener("submit", (e) => {
  e.preventDefault(); const err = $("#err");
  if (!$("#f-name").value.trim()) { err.textContent = t(["Please enter your name.", "お名前を入力してください。"]); err.hidden = false; $("#f-name").focus(); return; } err.hidden = true;
  location.href = `mailto:hairbyyuuki@gmail.com?subject=${encodeURIComponent("Booking")}&body=${encodeURIComponent(text())}`;
});
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-tab]"); if (b) { tab = b.dataset.tab; menu(true); return; }
  const a = e.target.closest("[data-svc]"); if (a) { st.svc = +a.dataset.svc; form(); }
});
onRender(() => { week(); menu(false); form(); });
applyLang();

/* motion (GSAP). Everything is visible without it. */
if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const split = new SplitText("#h1", { type: "lines" });
  const inner = split.lines.map((l) => { l.style.overflow = "hidden"; const d = document.createElement("div"); d.innerHTML = l.innerHTML; l.innerHTML = ""; l.appendChild(d); return d; });
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".blob", { scale: .2, opacity: 0, duration: 1.1, stagger: .12, ease: "power2.out", clearProps: "transform,opacity" })
    .from(".w", { y: 50, opacity: 0, duration: .8, stagger: .14, clearProps: "transform,opacity" }, .15)
    .from(inner, { yPercent: 105, duration: .8, stagger: .1, onComplete: () => split.revert() }, .2)
    .from(".kicker, .lead, .today, .hero .btns", { y: 14, opacity: 0, duration: .5, stagger: .07, clearProps: "transform,opacity" }, .5);
  /* the three photos drift at slightly different speeds, like cards laid on a table */
  gsap.to(".w1", { yPercent: -8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".w2", { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".blob--green", { rotate: 25, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.from(".days li", { y: 20, opacity: 0, duration: .4, stagger: .05, ease: "power2.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".week", start: "top 88%", once: true } });
  gsap.from(".credits li", { x: -24, opacity: 0, duration: .5, stagger: .1, ease: "power2.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".credits", start: "top 85%", once: true } });
  ScrollTrigger.batch(".sec-head > *, .tabs, .about-photo, .about-copy > h2, .about-copy > p, .more, .fields, .out, .facts > div", { start: "top 92%", once: true, onEnter: (els) => gsap.from(els, { y: 22, opacity: 0, duration: .5, stagger: .05, ease: "power2.out", clearProps: "transform,opacity" }) });
}
