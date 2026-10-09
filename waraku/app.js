// WARAKU Healthcare & Massage — interaction. With "reduce motion" on, everything is simply shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (p) => p[lang === "en" ? 0 : 1];
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* weekly roster, Monday to Sunday, exactly as on the current booking page */
const ROSTER = {
  lemon: [["Norie", "Rie", "Jun"], ["Rie", "(Alisa)", "(Norie)"], ["Norie", "Alisa"], ["Rie", "Alisa"], ["Rie", "Chitose"], ["Rie", "Norie", "Alisa"], ["Saki", "Rie", "Alisa"]],
  archer: [["Tom", "Saki"], ["Tom"], ["Tom", "Saki"], ["Tom", "Saki"], ["Tom"], ["Tom", "Saki"], []],
};
const DAYS = [["Mon", "月"], ["Tue", "火"], ["Wed", "水"], ["Thu", "木"], ["Fri", "金"], ["Sat", "土"], ["Sun", "日"]];
const DAYS_L = [["Monday", "月曜"], ["Tuesday", "火曜"], ["Wednesday", "水曜"], ["Thursday", "木曜"], ["Friday", "金曜"], ["Saturday", "土曜"], ["Sunday", "日曜"]];
const ROOM = { lemon: ["Lemon Grove room", "Lemon Grove の治療室"], archer: ["Archer Street room", "Archer Street の治療室"] };

/* therapists (names, titles and words from the Therapists page) */
const PEOPLE = {
  Tom: { full: "Motohiro Wada (Tom)", img: "tom", role: ["Acupuncture & Shiatsu Practitioner", "鍼・指圧"], say: ["“I am an experienced practitioner of Acupuncture with over 25 years of training in this ancient healing art.”", "「鍼の道で25年以上の経験があります。」"], more: ["Bachelor of Acupuncture in Japan · Diploma of Remedial Massage and Shiatsu · Sound Therapist", "日本の鍼灸学士 ・ リメディアル・マッサージと指圧のディプロマ ・ サウンドセラピスト"] },
  Saki: { full: "Yoshinori Sakiyama (Saki)", img: "saki", role: ["Shiatsu Practitioner", "指圧"], say: ["“I have more than 15 years’ experience working in the field of acupuncture and osteopathy in Japan.”", "「日本で、鍼と整体の分野に15年以上たずさわってきました。」"], more: ["Remedial Massage, trigger point, Shiatsu and Japanese Osteopathy", "リメディアル・マッサージ、トリガーポイント、指圧、日本の整体"] },
  Rie: { full: "Rie Sugiura (Rie)", img: "rie", role: ["Remedial Massage Practitioner", "リメディアル・マッサージ"], say: ["“Having experienced shoulder stiffness since childhood, I truly understand how it feels to live with body pain and discomfort.”", "「子どものころから肩こりがあったので、体の痛みや不調とつきあうつらさがよく分かります。」"], more: ["Remedial massage · Pressure point massage (oil-free) · Stretching", "リメディアル・マッサージ ・ オイルを使わない指圧 ・ ストレッチ"] },
  Norie: { full: "Norie (Nori)", img: "norie", role: ["Remedial Massage & Facial Dry Needling Practitioner", "リメディアル・マッサージ、美顔鍼"], say: ["“I am a registered nurse and I love helping my patients and enjoy caring for their physical and emotional well being.”", "「看護師の資格を持っています。患者さんの体と心の両方をケアすることが好きです。」"], more: ["Facial dry needling on Mondays, Wednesdays and Saturdays", "美顔鍼は 月・水・土"] },
  Alisa: { full: "Azusa Shimoyama (Alisa)", img: "alisa", role: ["Remedial Massage Practitioner", "リメディアル・マッサージ"], say: ["“My focus is on listening to your body’s needs and helping you achieve optimal comfort and wellbeing!”", "「体の声を聞き、いちばん心地よい状態に近づけることを大切にしています。」"], more: ["Eight years in rehabilitation at a hospital in Tokyo", "東京の病院で、8年間リハビリテーションに従事"] },
  Jun: { full: "Jun Mori (Jun)", img: "jun", role: ["Remedial Massage Practitioner", "リメディアル・マッサージ"], say: ["“My main techniques include myofascial release, trigger point pressure massage, and stretching.”", "「筋膜リリース、トリガーポイントの指圧、ストレッチを中心に行います。」"], more: ["Three years as a stretching trainer in Japan", "日本でストレッチトレーナーとして3年"] },
  Chitose: { full: "Chitose", img: "", role: ["Lemon Grove room", "Lemon Grove の治療室"], say: ["", ""], more: ["", ""] },
};

/* treatments and prices (from the Service page) */
const MENU = [
  { id: "rem", room: "lemon", n: ["Remedial Massage", "リメディアル・マッサージ"], d: ["For those who have symptoms of pain or discomfort. Deep tissue massage, trigger point therapy, myofascial release and/or lymphatic drainage, chosen by the therapist.", "痛みや不調のある方に。ディープティシュー、トリガーポイント、筋膜リリース、リンパドレナージュなどから、セラピストが合うものを選びます。"],
    rows: [[["30 min", "30分"], 75], [["45 min", "45分"], 105], [["60 min", "60分"], 125], [["75 min", "75分"], 165], [["90 min", "90分"], 200]], note: ["October special: $10 off the 90-minute remedial massage.", "10月のスペシャル：90分のリメディアル・マッサージが $10 引き。"] },
  { id: "aro", room: "lemon", n: ["Aromatic Remedial Massage", "アロマ・リメディアル・マッサージ"], d: ["A remedial massage with a blend of massage oil and essential oils, selected for your preference and condition.", "マッサージオイルにエッセンシャルオイルをブレンドして行います。お好みと体調に合わせて選びます。"],
    rows: [[["60 min", "60分"], 135], [["75 min", "75分"], 175], [["90 min", "90分"], 210]] },
  { id: "fdn", room: "lemon", n: ["Facial Dry Needling", "美顔鍼（フェイシャル・ドライニードリング）"], d: ["Japanese-style facial dry needling, with remedial massage techniques. Available Mondays, Wednesdays and Saturdays. Health fund rebates are available.", "日本式の美顔鍼。リメディアル・マッサージの手技を組み合わせます。月・水・土に行っています。医療保険の払い戻しの対象です。"],
    rows: [[["Basic · 40 min", "ベーシック ・ 40分"], 115], [["60 min, includes remedial massage", "60分（リメディアル・マッサージつき）"], 140], [["80 min, includes remedial massage", "80分（リメディアル・マッサージつき）"], 180], [["Basic · 5-visit package", "ベーシック ・ 5回パッケージ"], 550]], days: [0, 2, 5] },
  { id: "acu", room: "archer", n: ["Acupuncture", "鍼"], d: ["Japanese style acupuncture, with hair-fine needles and the gentle, yet energetic method of Meridian Therapy. From 60 minutes.", "髪の毛ほどの細い鍼を使う日本式の鍼。やさしく、それでいて力のある経絡治療です。60分から。"],
    rows: [[["Initial treatment", "初回"], 160], [["Subsequent visit", "2回目から"], 150]] },
  { id: "shi", room: "archer", n: ["Shiatsu Massage", "指圧"], d: ["Pressure on your acupoints, adjusted to your preference. This massage can be applied through your clothing.", "ツボを押す施術です。強さはお好みに合わせます。服を着たまま受けられます。"],
    rows: [[["Initial visit · 60 min", "初回 ・ 60分"], 160], [["Subsequent visit · 60 min", "2回目から ・ 60分"], 150]] },
  { id: "snd", room: "archer", n: ["Sound Therapy", "サウンドセラピー"], d: ["Using a Japanese healing sound instrument called the Singing Ring.", "シンギング・リンという日本の音の道具を使います。"],
    rows: [[["Harmonic Sound Drainage · 60 min", "ハーモニック・サウンド・ドレナージュ ・ 60分"], 150], [["3 Type Wayuruveda · 90 min", "3タイプ和ユルヴェーダ ・ 90分"], 230]] },
];
const TIMES = [["Any time", "いつでも"], ["Morning", "午前"], ["Around midday", "お昼ごろ"], ["Afternoon", "午後"]];

/* Sydney clock */
function sydney() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { d: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday), m: (+p.hour % 24) * 60 + +p.minute };
}
const NOW = sydney();
let day = NOW.d, picked = null;
const state = { treat: "rem", len: 2, day: 0, time: 0, who: "" };

function openNow() {
  const on = NOW.m >= 570 && NOW.m < 1080;
  $("#dot").classList.toggle("on", on);
  $("#open").textContent = on ? t(["Open now, until 6:00pm.", "ただいま営業中。18:00 まで。"]) : NOW.m < 570 ? t(["Opens today at 9:30am.", "本日 9:30 から営業します。"]) : t(["Opens tomorrow at 9:30am.", "明日 9:30 から営業します。"]);
}
const clean = (n) => n.replace(/[()]/g, "");
function board(swing = true) {
  $(".days").innerHTML = DAYS.map((d, i) => `<button type="button" role="tab" aria-selected="${i === day}" data-i="${i}">${t(d)}${i === NOW.d ? `<i>${t(["today", "今日"])}</i>` : ""}</button>`).join("");
  $("#day-label").textContent = t(DAYS_L[day]) + (day === NOW.d ? t([", today", "（今日）"]) : "");
  for (const r of ["lemon", "archer"]) {
    const names = ROSTER[r][day];
    $("#tags-" + r).innerHTML = names.length ? names.map((n, i) => `<button type="button" class="tag-name${picked === clean(n) ? " on" : ""}" data-n="${clean(n)}" style="--i:${i}"><span>${n}</span></button>`).join("") : `<p class="none">${t(["No one is listed for this day.", "この曜日の記載はありません。"])}</p>`;
  }
  if (swing && !reduce) $$(".tag-name").forEach((b) => { b.classList.remove("swing"); void b.offsetWidth; b.classList.add("swing"); });
  who();
}
function daysOf(n) {
  const out = [];
  for (const r of ["lemon", "archer"]) { const ds = DAYS.filter((_, i) => ROSTER[r][i].some((x) => clean(x) === n)).map((d) => t(d)); if (ds.length) out.push(`${ds.join(t([" · ", "・"]))}（${t(ROOM[r])}）`.replace("（", lang === "en" ? " (" : "（").replace("）", lang === "en" ? ")" : "）")); }
  return out.join(lang === "en" ? "; " : "、");
}
function who() {
  const el = $("#who");
  if (!picked) { el.innerHTML = `<p class="hint">${t(["Tap a name to read about the therapist.", "名前を押すと、セラピストの紹介が出ます。"])}</p>`; return; }
  const p = PEOPLE[picked];
  el.innerHTML = `<div class="who-card">${p.img ? `<img src="img/${p.img}.jpg" width="300" height="300" alt="">` : ""}<div><h3>${p.full}</h3><p class="role">${t(p.role)}</p>${t(p.say) ? `<p class="say">${t(p.say)}</p>` : ""}<p class="in">${t(["In on ", "担当日："])}${daysOf(picked)}</p><a class="link" href="#book" data-who="${picked}">${t(["Ask for " + picked + " →", picked + " さんを希望する →"])}</a></div></div>`;
}
function todayLines() {
  for (const r of ["lemon", "archer"]) { const n = ROSTER[r][NOW.d]; $("#today-" + r).textContent = n.length ? t(["In today: ", "今日の担当："]) + n.join(t([", ", "、"])) : t(["No one is listed for today. Please call.", "今日の記載はありません。お電話でおたずねください。"]); }
}
function menus() {
  for (const r of ["lemon", "archer"]) {
    $("#menu-" + r).innerHTML = MENU.filter((m) => m.room === r).map((m) => `<div class="item"><h4>${t(m.n)}</h4><p>${t(m.d)}</p><ul>${m.rows.map((row, i) => `<li><span>${t(row[0])}</span><b>$${row[1]}</b><a href="#book" data-treat="${m.id}" data-len="${i}" aria-label="${t(["Request", "希望する"])} ${t(m.n)} ${t(row[0])}">${t(["Request", "希望する"])}</a></li>`).join("")}</ul>${m.note ? `<p class="note">${t(m.note)}</p>` : ""}</div>`).join("");
  }
}
function staff() {
  $("#staff").innerHTML = ["Tom", "Saki", "Rie", "Norie", "Alisa", "Jun"].map((k) => { const p = PEOPLE[k]; return `<li><img loading="lazy" src="img/${p.img}.jpg" width="300" height="300" alt=""><div><h3>${p.full}</h3><p class="role">${t(p.role)}</p><p class="say">${t(p.say)}</p><p class="more">${t(p.more)}</p><p class="in">${t(["In on ", "担当日："])}${daysOf(k)}</p></div></li>`; }).join("");
}

/* booking request: the choices become a message */
function nextDays() {
  const m = MENU.find((x) => x.id === state.treat), out = [];
  for (let i = 0; i < 7; i++) {
    const dt = new Date(Date.now() + i * 864e5), d = (NOW.d + i) % 7;
    if (m.days && !m.days.includes(d)) continue;
    const f = new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-AU", { timeZone: "Australia/Sydney", day: "numeric", month: "long" }).format(dt);
    out.push({ d, label: lang === "ja" ? `${f}（${DAYS[d][1]}）` : `${DAYS_L[d][0]} ${f}` });
  }
  return out;
}
function form() {
  const m = MENU.find((x) => x.id === state.treat); if (state.len >= m.rows.length) state.len = 0;
  const ds = nextDays(); if (state.day >= ds.length) state.day = 0;
  $("#f-treat").innerHTML = ["lemon", "archer"].map((r) => `<optgroup label="${t(ROOM[r])}">${MENU.filter((x) => x.room === r).map((x) => `<option value="${x.id}"${x.id === state.treat ? " selected" : ""}>${t(x.n)}</option>`).join("")}</optgroup>`).join("");
  $("#f-len").innerHTML = m.rows.map((r, i) => `<option value="${i}"${i === state.len ? " selected" : ""}>${t(r[0])} · $${r[1]}</option>`).join("");
  $("#f-day").innerHTML = ds.map((d, i) => `<option value="${i}"${i === state.day ? " selected" : ""}>${d.label}</option>`).join("");
  $("#f-time").innerHTML = TIMES.map((x, i) => `<option value="${i}"${i === state.time ? " selected" : ""}>${t(x)}</option>`).join("");
  slip();
}
function slip() {
  const m = MENU.find((x) => x.id === state.treat), row = m.rows[state.len], d = nextDays()[state.day], name = $("#f-name").value.trim();
  const inThat = ROSTER[m.room][d.d].map(clean), who = state.who && inThat.includes(state.who) ? state.who : "";
  const msg = lang === "ja"
    ? `こんにちは。WARAKU（${ROOM[m.room][1]}）の予約を希望します。\n${m.n[1]}　${row[0][1]}（$${row[1]}）\n${d.label}　${TIMES[state.time][1]}${who ? `\n希望のセラピスト：${who} さん` : ""}\n名前：${name || "（　　　）"}`
    : `Hello, I would like to book at WARAKU (${ROOM[m.room][0]}).\n${m.n[0]}, ${row[0][0]} ($${row[1]})\n${d.label}, ${TIMES[state.time][0].toLowerCase()}${who ? `\nPreferred therapist: ${who}` : ""}\nName: ${name || "(          )"}`;
  $("#slip-msg").textContent = msg;
  const body = encodeURIComponent(msg);
  const to = m.id === "fdn" ? { sms: ["+61407351496", "0407 351 496"], mail: "noriewaraku@gmail.com" } : m.room === "lemon" ? { sms: ["+61449569107", "0449 569 107"], tel: ["+61294103413", "02 9410 3413"] } : { tel: ["+61294102258", "02 9410 2258"] };
  $("#slip-to").textContent = t(ROOM[m.room]) + (m.id === "fdn" ? t([" · facial dry needling is booked by text or email", " ・ 美顔鍼のご予約は SMS かメールで"]) : m.room === "archer" ? t([" · bookings by phone", " ・ ご予約はお電話で"]) : t([" · bookings by phone or text", " ・ ご予約はお電話か SMS で"]));
  $("#slip-go").innerHTML = (to.sms ? `<a class="btn" href="sms:${to.sms[0]}?&body=${body}">${t(["Text it to ", "SMS で送る "])}${to.sms[1]}</a>` : "") + (to.mail ? `<a class="btn ghost" href="mailto:${to.mail}?subject=${encodeURIComponent(t(["Booking request", "予約の希望"]))}&body=${body}">${t(["Email it", "メールで送る"])}</a>` : "") + (to.tel ? `<a class="btn${to.sms ? " ghost" : ""}" href="tel:${to.tel[0]}">${t(["Call ", "電話 "])}${to.tel[1]}</a>` : "") + `<button type="button" class="copy" id="copy">${t(["Copy the text", "文面をコピー"])}</button>`;
}
$("#req").addEventListener("change", (e) => { const id = e.target.id; if (id === "f-treat") { state.treat = e.target.value; state.len = 0; state.day = 0; } if (id === "f-len") state.len = +e.target.value; if (id === "f-day") state.day = +e.target.value; if (id === "f-time") state.time = +e.target.value; form(); });
$("#f-name").addEventListener("input", slip);
$("#req").addEventListener("submit", (e) => e.preventDefault());
document.addEventListener("click", (e) => {
  const d = e.target.closest(".days button"); if (d) { day = +d.dataset.i; picked = null; board(); return; }
  const n = e.target.closest(".tag-name"); if (n) { picked = picked === n.dataset.n ? null : n.dataset.n; board(false); return; }
  const a = e.target.closest("[data-treat]"); if (a) { state.treat = a.dataset.treat; state.len = +a.dataset.len; state.day = 0; form(); return; }
  const w = e.target.closest("[data-who]"); if (w) { state.who = w.dataset.who; const m = MENU.find((x) => x.id === state.treat), r = ROSTER.lemon.some((x) => x.map(clean).includes(state.who)) ? "lemon" : "archer"; if (m.room !== r && !ROSTER[m.room].some((x) => x.map(clean).includes(state.who))) { state.treat = r === "lemon" ? "rem" : "acu"; state.len = 0; } const ds = nextDays(), i = ds.findIndex((x) => ROSTER[MENU.find((y) => y.id === state.treat).room][x.d].map(clean).includes(state.who)); state.day = Math.max(0, i); form(); return; }
  if (e.target.id === "copy") { const b = e.target; (navigator.clipboard ? navigator.clipboard.writeText($("#slip-msg").textContent) : Promise.reject()).then(() => { b.textContent = t(["Copied", "コピーしました"]); }).catch(() => { const r = document.createRange(); r.selectNodeContents($("#slip-msg")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = t(["Selected. Press copy.", "選択しました。コピーしてください。"]); }); }
});
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-en]").forEach((el) => { el.alt = lang === "en" ? el.dataset.altEn : el.dataset.altJa; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  openNow(); board(false); todayLines(); menus(); staff(); form();
}
$(".lang").addEventListener("click", () => { lang = lang === "en" ? "ja" : "en"; applyLang(); });
applyLang();
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
  $$(".sec-head, .walk, .stop, .staff, .facts > div, .req").forEach((el) => { el.classList.add("rv"); io.observe(el); });
  requestAnimationFrame(() => $$(".tag-name").forEach((b) => b.classList.add("swing")));
}
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
