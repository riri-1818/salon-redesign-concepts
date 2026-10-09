// WARAKU Healthcare & Massage — the parts that change: who is in, treatments and prices, the booking message. (Shared helpers are in ds.js.)

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
  Tom: { full: "Motohiro Wada (Tom)", img: "tom", role: ["Acupuncture & Shiatsu Practitioner", "鍼・指圧"], say: ["“I am an experienced practitioner of Acupuncture with over 25 years of training in this ancient healing art.”", "「鍼の世界で25年以上、経験を積んできました。」"] },
  Saki: { full: "Yoshinori Sakiyama (Saki)", img: "saki", role: ["Shiatsu Practitioner", "指圧"], say: ["“I have more than 15 years’ experience working in the field of acupuncture and osteopathy in Japan.”", "「日本で15年以上、鍼と整体にたずさわってきました。」"] },
  Rie: { full: "Rie Sugiura (Rie)", img: "rie", role: ["Remedial Massage Practitioner", "リメディアル・マッサージ"], say: ["“Having experienced shoulder stiffness since childhood, I truly understand how it feels to live with body pain and discomfort.”", "「子どものころから肩こりに悩んできたので、体の痛みや不調のつらさがよく分かります。」"] },
  Norie: { full: "Norie (Nori)", img: "norie", role: ["Remedial Massage & Facial Dry Needling Practitioner", "リメディアル・マッサージ、美顔鍼"], say: ["“I am a registered nurse and I love helping my patients and enjoy caring for their physical and emotional well being.”", "「看護師の資格を持っています。体と心の両方をケアすることが、何よりのやりがいです。」"] },
  Alisa: { full: "Azusa Shimoyama (Alisa)", img: "alisa", role: ["Remedial Massage Practitioner", "リメディアル・マッサージ"], say: ["“My focus is on listening to your body’s needs and helping you achieve optimal comfort and wellbeing!”", "「体の声に耳を傾けて、いちばん楽な状態に近づけます。」"] },
  Jun: { full: "Jun Mori (Jun)", img: "jun", role: ["Remedial Massage Practitioner", "リメディアル・マッサージ"], say: ["“My main techniques include myofascial release, trigger point pressure massage, and stretching.”", "「筋膜リリース、トリガーポイント、ストレッチを組み合わせて施術します。」"] },
  Chitose: { full: "Chitose", img: "", role: ["Lemon Grove room", "Lemon Grove の治療室"], say: ["", ""] },
};

/* treatments and prices (from the Service page) */
const MENU = [
  { id: "rem", room: "lemon", n: ["Remedial Massage", "リメディアル・マッサージ"], d: ["For those who have symptoms of pain or discomfort. The therapist chooses from deep tissue massage, trigger point therapy, myofascial release and lymphatic drainage.", "痛みや不調がある方に。ディープティシュー、トリガーポイント、筋膜リリース、リンパドレナージュなどから、セラピストが合う手技を選びます。"],
    rows: [[["30 minutes", "30分"], 75], [["45 minutes", "45分"], 105], [["60 minutes", "60分"], 125], [["75 minutes", "75分"], 165], [["90 minutes", "90分"], 200]], note: ["October special: $10 off the 90-minute remedial massage.", "10月のスペシャル：90分のリメディアル・マッサージが $10 引きです。"] },
  { id: "aro", room: "lemon", n: ["Aromatic Remedial Massage", "アロマ・マッサージ"], d: ["A remedial massage with a blend of massage oil and essential oils, selected for your preference and condition.", "マッサージオイルにエッセンシャルオイルを混ぜて行います。香りは、お好みと体調に合わせて選びます。"],
    rows: [[["60 minutes", "60分"], 135], [["75 minutes", "75分"], 175], [["90 minutes", "90分"], 210]] },
  { id: "fdn", room: "lemon", n: ["Facial Dry Needling", "美顔鍼"], d: ["Japanese-style facial dry needling, combined with remedial massage techniques. Available Mondays, Wednesdays and Saturdays. Health fund rebates are available.", "日本式の美顔鍼（フェイシャル・ドライニードリング）です。リメディアル・マッサージの手技も組み合わせます。月・水・土に受けられます。保険の払い戻しの対象です。"],
    rows: [[["Basic, 40 minutes", "ベーシック 40分"], 115], [["60 minutes, with remedial massage", "60分（マッサージつき）"], 140], [["80 minutes, with remedial massage", "80分（マッサージつき）"], 180], [["Basic, 5-visit package", "ベーシック 5回券"], 550]], days: [0, 2, 5] },
  { id: "acu", room: "archer", n: ["Acupuncture", "鍼"], d: ["Japanese style acupuncture, with hair-fine needles and the gentle method of Meridian Therapy. From 60 minutes.", "髪の毛ほどの細い鍼を使う、日本式の鍼です。やさしい刺激で、経絡に働きかけます。60分から。"],
    rows: [[["Initial treatment", "初回"], 160], [["Subsequent visit", "2回目から"], 150]] },
  { id: "shi", room: "archer", n: ["Shiatsu Massage", "指圧"], d: ["Pressure on your acupoints, adjusted to your preference. This massage can be applied through your clothing.", "ツボを指で押す施術です。強さはお好みに合わせます。服を着たまま受けられます。"],
    rows: [[["Initial visit, 60 minutes", "初回 60分"], 160], [["Subsequent visit, 60 minutes", "2回目から 60分"], 150]] },
  { id: "snd", room: "archer", n: ["Sound Therapy", "サウンドセラピー"], d: ["Using a Japanese healing sound instrument called the Singing Ring.", "シンギング・リンという日本の楽器の、音と響きを使います。"],
    rows: [[["Harmonic Sound Drainage, 60 minutes", "Harmonic Sound Drainage 60分"], 150], [["3 Type Wayuruveda, 90 minutes", "3 Type Wayuruveda 90分"], 230]] },
];
const TIMES = [["any time", "時間はいつでも"], ["morning", "午前"], ["around midday", "お昼ごろ"], ["afternoon", "午後"]];

const NOW = sydney();
let day = NOW.d, picked = null, kind = "rem";
const state = { treat: "rem", len: 2, day: 0, time: 0, who: "" };
const clean = (n) => n.replace(/[()]/g, "");
const menuOf = (id) => MENU.find((x) => x.id === id);

function openNow() {
  const on = NOW.m >= 570 && NOW.m < 1080;
  $("#dot").classList.toggle("on", on);
  $("#open").textContent = on ? t(["Open now, until 6:00pm", "ただいま営業中です（18:00 まで）"]) : NOW.m < 570 ? t(["Opens today at 9:30am", "本日は 9:30 から営業します"]) : t(["Closed for today. Opens tomorrow at 9:30am", "本日の営業は終了しました。明日は 9:30 からです"]);
}
function board(move) {
  $("#b-title").textContent = day === NOW.d ? t([`Who is in today, ${DAYS_L[day][0]}`, `今日（${DAYS_L[day][1]}）の担当`]) : t([`Who is in on ${DAYS_L[day][0]}`, `${DAYS_L[day][1]}の担当`]);
  $(".days").innerHTML = DAYS.map((d, i) => `<button type="button" class="chip" role="tab" aria-selected="${i === day}" data-day="${i}">${t(d)}</button>`).join("");
  for (const r of ["lemon", "archer"]) {
    const names = ROSTER[r][day];
    $("#n-" + r).innerHTML = names.length ? names.map((n, i) => `<button type="button" class="name${move ? " drop" : ""}" aria-pressed="${picked === clean(n)}" data-n="${clean(n)}" style="--i:${i}">${n}</button>`).join("") : `<p class="note">${t(["No one is listed for this day. Please call.", "この曜日は、担当の記載がありません。お電話でお問い合わせください。"])}</p>`;
  }
  $("#b-note").hidden = !ROSTER.lemon[day].concat(ROSTER.archer[day]).some((n) => n.includes("("));
  who();
}
function daysOf(n) {
  return ["lemon", "archer"].map((r) => { const ds = DAYS.filter((_, i) => ROSTER[r][i].some((x) => clean(x) === n)).map((d) => t(d)); return ds.length ? t([`${ds.join(", ")} at the ${ROOM[r][0]}`, `${ds.join("・")}（${ROOM[r][1]}）`]) : ""; }).filter(Boolean).join(t(["; ", "、"]));
}
function who() {
  const el = $("#who"); if (!picked) { el.innerHTML = ""; return; }
  const p = PEOPLE[picked];
  el.innerHTML = `<div class="who-card">${p.img ? `<img src="img/${p.img}.jpg" width="300" height="300" alt="">` : ""}<div><h3>${p.full}</h3><p class="note">${t(p.role)}</p>${t(p.say) ? `<p>${t(p.say)}</p>` : ""}<p class="note">${t(["In on ", "担当日："])}${daysOf(picked)}</p><a class="more" href="#book" data-who="${picked}">${t(["Request a booking with " + picked, picked + " さんで予約をリクエストする"])}</a></div></div>`;
}
function todayLines() {
  for (const r of ["lemon", "archer"]) { const n = ROSTER[r][NOW.d]; $("#t-" + r).textContent = n.length ? t(["In today: ", "今日の担当："]) + n.join(t([", ", "、"])) : t(["Please call to ask who is in today.", "今日の担当は、お電話でお問い合わせください。"]); }
}
function menu() {
  $(".kinds").innerHTML = MENU.map((m) => `<button type="button" class="chip" role="tab" aria-selected="${m.id === kind}" data-kind="${m.id}">${t(m.n)}</button>`).join("");
  const m = menuOf(kind);
  $("#detail").innerHTML = `<div><p class="pill">${t(ROOM[m.room])}</p><h3>${t(m.n)}</h3><p>${t(m.d)}</p>${m.note ? `<p class="special">${t(m.note)}</p>` : ""}</div><ul class="rows">${m.rows.map((r, i) => `<li><span>${t(r[0])}</span><span class="price"><b>$${r[1]}</b><a href="#book" data-treat="${m.id}" data-len="${i}" aria-label="${t(["Book", "予約する"])}: ${t(m.n)} ${t(r[0])}">${t(["Book", "予約する"])}</a></span></li>`).join("")}</ul>`;
}
function staff() {
  $("#staff").innerHTML = ["Tom", "Saki", "Rie", "Norie", "Alisa", "Jun"].map((k) => { const p = PEOPLE[k]; return `<li class="card"><img loading="lazy" src="img/${p.img}.jpg" width="300" height="300" alt=""><div><h3>${p.full}</h3><p class="note">${t(p.role)}</p><p>${t(p.say)}</p><p class="note">${t(["In on ", "担当日："])}${daysOf(k)}</p></div></li>`; }).join("");
}

/* booking request: the choices become a message */
function nextDays() {
  const m = menuOf(state.treat), out = [];
  for (let i = 0; i < 7; i++) {
    const dt = new Date(Date.now() + i * 864e5), d = (NOW.d + i) % 7;
    if (m.days && !m.days.includes(d)) continue;
    const f = new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-AU", { timeZone: "Australia/Sydney", day: "numeric", month: "long" }).format(dt);
    out.push({ d, label: lang === "ja" ? `${f}（${DAYS[d][1]}）` : `${DAYS_L[d][0]} ${f}` });
  }
  return out;
}
function form() {
  const m = menuOf(state.treat); if (state.len >= m.rows.length) state.len = 0;
  const ds = nextDays(); if (state.day >= ds.length) state.day = 0;
  $("#f-treat").innerHTML = ["lemon", "archer"].map((r) => `<optgroup label="${t(ROOM[r])}">${MENU.filter((x) => x.room === r).map((x) => `<option value="${x.id}"${x.id === state.treat ? " selected" : ""}>${t(x.n)}</option>`).join("")}</optgroup>`).join("");
  $("#f-len").innerHTML = m.rows.map((r, i) => `<option value="${i}"${i === state.len ? " selected" : ""}>${t(r[0])}（$${r[1]}）</option>`).join("");
  $("#f-day").innerHTML = ds.map((d, i) => `<option value="${i}"${i === state.day ? " selected" : ""}>${d.label}</option>`).join("");
  $("#f-time").innerHTML = TIMES.map((x, i) => `<option value="${i}"${i === state.time ? " selected" : ""}>${t(x).replace(/^./, (c) => c.toUpperCase())}</option>`).join("");
  slip();
}
function slip() {
  const m = menuOf(state.treat), row = m.rows[state.len], d = nextDays()[state.day], name = $("#f-name").value.trim();
  const inThat = ROSTER[m.room][d.d].map(clean), who = state.who && inThat.includes(state.who) ? state.who : "";
  const msg = lang === "ja"
    ? `こんにちは。WARAKU（${ROOM[m.room][1]}）の予約をお願いします。\nメニュー：${m.n[1]} ${row[0][1]}（$${row[1]}）\n希望日：${d.label} ${TIMES[state.time][1]}${who ? `\nセラピスト：${who} さん希望` : ""}\n名前：${name}`
    : `Hello, I would like to book at WARAKU (${ROOM[m.room][0]}).\nTreatment: ${m.n[0]}, ${row[0][0]} ($${row[1]})\nDay: ${d.label}, ${TIMES[state.time][0]}${who ? `\nTherapist: ${who}` : ""}\nName: ${name}`;
  $("#slip-msg").textContent = msg;
  const body = encodeURIComponent(msg);
  const to = m.id === "fdn" ? { sms: ["+61407351496", "0407 351 496"], mail: "noriewaraku@gmail.com" } : m.room === "lemon" ? { sms: ["+61449569107", "0449 569 107"], tel: ["+61294103413", "02 9410 3413"] } : { tel: ["+61294102258", "02 9410 2258"] };
  $("#slip-to").textContent = m.id === "fdn" ? t(["Facial dry needling is booked by text or email.", "美顔鍼のご予約は、SMS かメールで承ります。"]) : m.room === "archer" ? t(["The Archer Street room takes bookings by phone.", "Archer Street の治療室のご予約は、お電話で承ります。"]) : t(["The Lemon Grove room takes bookings by phone or text.", "Lemon Grove の治療室のご予約は、お電話か SMS で承ります。"]);
  $("#slip-go").innerHTML = (to.sms ? `<a class="btn" href="sms:${to.sms[0]}?&body=${body}">${t(["Text to ", "SMS で送る "])}${to.sms[1]}</a>` : "") + (to.mail ? `<a class="btn btn--line" href="mailto:${to.mail}?subject=${encodeURIComponent(t(["Booking request", "予約リクエスト"]))}&body=${body}">${t(["Send by email", "メールで送る"])}</a>` : "") + (to.tel ? `<a class="btn${to.sms ? " btn--line" : ""}" href="tel:${to.tel[0]}">${t(["Call ", "電話する "])}${to.tel[1]}</a>` : "") + `<button type="button" class="btn btn--line" id="copy">${t(["Copy the message", "メッセージをコピー"])}</button>`;
}
$("#req").addEventListener("change", (e) => { const id = e.target.id; if (id === "f-treat") { state.treat = e.target.value; state.len = 0; state.day = 0; } if (id === "f-len") state.len = +e.target.value; if (id === "f-day") state.day = +e.target.value; if (id === "f-time") state.time = +e.target.value; form(); });
$("#f-name").addEventListener("input", slip);
$("#req").addEventListener("submit", (e) => e.preventDefault());
document.addEventListener("click", (e) => {
  const d = e.target.closest("[data-day]"); if (d) { day = +d.dataset.day; picked = null; board(!reduce); return; }
  const n = e.target.closest(".name"); if (n) { picked = picked === n.dataset.n ? null : n.dataset.n; board(false); return; }
  const k = e.target.closest("[data-kind]"); if (k) { kind = k.dataset.kind; menu(); return; }
  const a = e.target.closest("[data-treat]"); if (a) { state.treat = a.dataset.treat; state.len = +a.dataset.len; state.day = 0; form(); return; }
  const w = e.target.closest("[data-who]");
  if (w) { state.who = w.dataset.who; const inRoom = (r) => ROSTER[r].some((x) => x.map(clean).includes(state.who)); if (!inRoom(menuOf(state.treat).room)) { state.treat = inRoom("lemon") ? "rem" : "acu"; state.len = 0; } const i = nextDays().findIndex((x) => ROSTER[menuOf(state.treat).room][x.d].map(clean).includes(state.who)); state.day = Math.max(0, i); form(); return; }
  if (e.target.id === "copy") { const b = e.target; (navigator.clipboard ? navigator.clipboard.writeText($("#slip-msg").textContent) : Promise.reject()).then(() => { b.textContent = t(["Copied", "コピーしました"]); }).catch(() => { const r = document.createRange(); r.selectNodeContents($("#slip-msg")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = t(["Selected. Please copy.", "選択しました。コピーしてください"]); }); }
});
onRender(() => { openNow(); board(false); todayLines(); menu(); staff(); form(); });
start(".head, .points, .room, .kinds, .detail, .staff > li, .facts > div, .req > *");
