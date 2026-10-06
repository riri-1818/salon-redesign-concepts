// Shinbukan — motion and interaction. Everything is shown without motion when the visitor prefers reduced motion.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (p) => p[lang === "en" ? 0 : 1];

/* ---------- classes (text from the current site) ---------- */
const PATHS = [
  { id: "kids", k: "子", tab: ["Kids Karate", "キッズ空手"], age: ["7–13", "7〜13歳"], fee: "$90", title: ["Traditional Japanese karate for children", "子どものための、日本の伝統空手"],
    body: ["Children discover inner strength through disciplined practice. Each class follows time-honoured methods that develop character alongside technique. Safe, structured training.", "規律ある稽古を通じて、子どもが内にある強さに気づいていきます。昔からの方法で、技と一緒に人柄を育てます。安全で、順序立てた稽古です。"],
    stepsH: ["What it builds", "育つもの"], steps: [["Foundations", "土台"], ["Focus", "集中"], ["Confidence", "自信"]],
    stageH: ["The journey: from white to black belt", "白帯から黒帯までの道のり"],
    stages: [{ n: ["Foundations & focus", "土台と集中"], s: ["White to orange belt", "白帯〜橙帯"], d: ["Ritual and structure help children settle, concentrate and self-control.", "礼と型が、落ち着き、集中、自制を助けます。"], c: ["#f4f1ea", "#e8862a"] },
      { n: ["Resilience & discipline", "粘り強さと規律"], s: ["Green to brown belt", "緑帯〜茶帯"], d: ["Challenges are scaled appropriately: children learn perseverance, humility and composure.", "課題は段階に合わせて。粘り強さ、謙虚さ、落ち着きを学びます。"], c: ["#3d8a52", "#6b4226"] },
      { n: ["Calm confidence", "静かな自信"], s: ["Towards black belt", "黒帯へ"], d: ["As skills grow, students develop controlled intensity. Confidence without ego.", "技が伸びるにつれ、制御された強さが育ちます。驕りのない自信を。"], c: ["#6b4226", "#16130f"] }] },
  { id: "adults", k: "剛柔", tab: ["Adults Karate", "大人の空手"], age: ["14+", "14歳以上"], fee: "$120", title: ["Authentic Goju-Ryu Karate-Do", "本格の剛柔流空手道"],
    body: ["Training the balance of hard and soft through precise technique, controlled intensity and calm awareness.", "正確な技、制御された強度、静かな気づきを通して、剛と柔の均衡を稽古します。"],
    stepsH: ["A typical class", "ある日の稽古"], steps: [["Mokuso (meditation): silent reflection, leaving daily concerns outside", "黙想：静かに座り、日常を外に置く"], ["Conditioning: calisthenics and mobility, often with partners", "鍛錬：自重の鍛錬と可動の動き。多くは二人組で"], ["Kihon (fundamentals): precision and mindful breathing", "基本：正確さと呼吸"], ["Kumite (sparring): respect, timing and technique", "組手：礼、間、技"], ["Kata (forms): ancient sequences that encode fighting wisdom", "型：戦いの知恵を伝える古い連なり"]],
    stageH: ["The journey: white to black belt and beyond", "白帯から黒帯、その先へ"],
    stages: [{ n: ["Shu 守", "守"], s: ["Preserve", "まもる"], d: ["A strong base through traditional form: posture, breathing, timing. Learning the method before adding intensity.", "姿勢、呼吸、間。伝統の形で土台をつくります。強度を足す前に、方法を学ぶ。"], c: ["#f4f1ea", "#3d8a52"] },
      { n: ["Ha 破", "破"], s: ["Detach", "やぶる"], d: ["Students start to understand why techniques work. Power becomes efficient and composed, not forced.", "技がなぜ効くのかが分かり始めます。力は無理なく、落ち着いたものに。"], c: ["#3d8a52", "#6b4226"] },
      { n: ["Ri 離", "離"], s: ["Integrate", "はなれる"], d: ["Technique becomes natural: less thinking, more clear response. Practice becomes lifelong refinement.", "技が自然になります。考えるより先に、澄んだ応じ方を。稽古は一生の磨きに。"], c: ["#6b4226", "#16130f"] }] },
  { id: "ninja", k: "忍", tab: ["Ninjutsu", "忍術"], age: ["14+", "14歳以上"], fee: "$120", title: ["Iga Ryu Ninjutsu", "伊賀流忍術"],
    body: ["A traditional Japanese system of survival strategy and martial training. The curriculum draws from the classical “18 disciplines”: movement, unarmed skills, weapons principles and situational awareness.", "生き抜くための戦略と武術の、日本の伝統体系です。古来の「十八般」をもとに、動き、徒手、武器の理、状況への気づきを学びます。"],
    stepsH: ["What is involved", "稽古の中身"], steps: [["Mokuso (quiet focus): settle the mind before training", "黙想：稽古の前に心を鎮める"], ["Conditioning: endurance through traditional methods", "鍛錬：伝統の方法で持久力を"], ["Skill integration: striking, grappling, movement and weapons principles", "技の統合：打撃、組み技、動き、武器の理"], ["Scenario training: timing, distance, angles and decision-making", "想定稽古：間、距離、角度、判断"], ["Reflection: what worked, what did not, and why", "振り返り：何が効き、何が効かず、なぜか"]],
    stageH: ["Three areas of training", "稽古の三つの柱"],
    stages: [{ n: ["Conditioning", "鍛錬"], s: ["Endurance is the foundation", "持久力が土台"], d: ["Resilient legs, grip and breath control, so technique holds up under fatigue. The aim is mindful longevity.", "脚、握り、呼吸。疲れの中でも技が崩れないように。長く続けることを目指します。"], c: ["#f4f1ea", "#8a8377"] },
      { n: ["Striking", "打撃"], s: ["Strategic, not forceful", "力ではなく、戦略"], d: ["Calmness first, then distance, timing, angles and intent.", "まず落ち着き。そのうえで距離、間、角度、意図を扱います。"], c: ["#8a8377", "#b3271a"] },
      { n: ["Grappling", "組み技"], s: ["The study of control", "制することを学ぶ"], d: ["Balance-breaking, positional awareness, escapes. Control and precision over brute force.", "崩し、位置取り、抜け。力まかせではなく、制御と正確さを。"], c: ["#b3271a", "#16130f"] }] },
];
/* ---------- timetable (from the Shinbukan timetable on the current site) ---------- */
const DAYS = [["Mon", "月"], ["Tue", "火"], ["Wed", "水"], ["Thu", "木"], ["Fri", "金"], ["Sat", "土"], ["Sun", "日"]];
const TT = [
  [["6:30–8:00pm", ["Sparring (by instructor invitation)", "組手（指導者の招待制）"], "x"]],
  [["5:45–6:45pm", ["Kids Karate", "キッズ空手"], "kids"], ["6:45–7:45pm", ["Adults Goju-Ryu Karate", "大人の剛柔流空手"], "adults"], ["7:45–8:45pm", ["Iga Ryu Ninjutsu", "伊賀流忍術"], "ninja"]],
  [],
  [["5:45–6:45pm", ["Kids Karate", "キッズ空手"], "kids"], ["6:45–7:45pm", ["Adults Goju-Ryu Karate", "大人の剛柔流空手"], "adults"], ["7:45–8:45pm", ["Iga Ryu Ninjutsu", "伊賀流忍術"], "ninja"]],
  [],
  [["1:15–2:00pm", ["Kids Beginners (white to yellow belt)", "キッズ初級（白〜黄帯）"], "kids"], ["2:00–3:00pm", ["Kids Intermediate (orange belt and above)", "キッズ中級（橙帯以上）"], "kids"], ["3:00–4:00pm", ["Adults Goju-Ryu Karate", "大人の剛柔流空手"], "adults"], ["4:00–5:00pm", ["Iga Ryu Ninjutsu", "伊賀流忍術"], "ninja"], ["5:00–5:30pm", ["Iaido (swords)", "居合道（刀）"], "x"]],
  [["10:00am–4:00pm", ["Private classes (by booking)", "個人指導（予約制）"], "x"]],
];
const LINE = [
  ["1940s–60s", ["Foundation", "土台"], ["Born in Asakusa in the final days of the war. Trained under masters Gogen Yamaguchi “The Cat” and Shuuji Tasaki.", "終戦間際の浅草に生まれる。山口剛玄、田崎修司の両師のもとで稽古。"]],
  ["1970s", ["Competition", "試合の時代"], ["Twenty years of training, four hours a day, five days a week. Taito-Ku Championship (1972), Tokyo Metropolitan Championship (1973), Kanto Goju-Kai Group Championship (1974).", "1日4時間・週5日の稽古を20年。台東区大会（1972）、東京都大会（1973）、関東剛柔会大会（1974）で優勝。"]],
  ["1978", ["The cultural bridge", "文化の橋"], ["Sponsored by Tino Ceberano, Kazuo brought Japanese martial culture to Australia, to teach what and how he was taught.", "ティノ・セベラーノ氏の招きでオーストラリアへ。自分が教わったものを、教わったとおりに伝えるために。"]],
  ["1992", ["The hidden arts", "秘された術"], ["Under the 15th Soke, Heishichiro Okuse, Kazuo inherited the traditions of Iga Ryu Ninjutsu and became the 16th Soke.", "十五代宗家・奥瀬平七郎のもとで伊賀流忍術の伝統を継ぎ、十六代宗家に。"]],
  ["2000s–", ["The spiritual pursuit", "精神の道"], ["Ordained in Shingon Buddhism at Mount Koyasan, Wakayama.", "和歌山・高野山にて、真言宗の僧として得度。"]],
];
const TEACH = [
  ["Kazuo Saito", "10th Dan Soke", "If you can master suffering, you can master life.", "Founder of Shinbukan in 1978."],
  ["John Dalmedo", "7th Dan Shihan", "The more I learn about karate, the little I know!", "50 years of Goju Karate training and one of the first Shinbukan students in 1979."],
  ["Hean", "6th Dan Shihan", "Ultimately, your spirit and will is more important than technique.", "40 years of martial arts experience. Iaido practitioner and instructor."],
  ["Roberto", "6th Dan Shihan", "Ninjutsu!", "Dedicated Ninjutsu instructor with a passion for youth development."],
  ["Darren", "5th Dan Shihan", "Teach the new generation, to in turn, teach the new generation.", "35 years of teaching and live-in student of Saito Soke."],
  ["Peter", "5th Dan Shihan", "Students should leave their ego as learning happens when the mind is free.", "30 years of teaching experience, a spiritual pursuer of depth, art and simplicity."],
  ["Li-Huan", "5th Dan Shihan", "Life can be determined in an instant.", "30 years of Judo, Kendo, Karate and Ninjutsu experience. Seasoned competitor."],
  ["Jai", "5th Dan Shihan", "Tradition nurtures discipline. I incorporate Karate, Ninjutsu and Judo to create a well-rounded martial artist.", "30 years of Judo, Karate and Ninjutsu experience."],
  ["Hiroaki", "5th Dan Shihan", "Watching and learning is more effective than being spoonfed information.", "Kata-enthusiast karate-ka with 20 years of karate experience in Japan."],
  ["Bryan", "3rd Dan Shido-Shi", "Focus, find an opportunity and strike.", "25 years of combined experience in Karate, Taekwondo and Iaido."],
  ["Daniel", "3rd Dan Shido-Shi", "Discipline measured in years equals progress.", "Kata and Bunkai enthusiast, with interests in body mechanics and functional mobility."],
  ["Navin", "3rd Dan Shido-Shi", "Strong mind, strong body. Strong body, strong mind.", "15 years of martial arts experience. An excellent listener and observer."],
  ["Harrison", "2nd Dan Shido-In", "I am going to help create strong people with sharp minds and soft hearts.", "Teacher, youth coach and Kazuo’s son."],
  ["Kylar", "Shodan", "Do or do not. There is no try. (Master Yoda)", "10 years of training with Shinbukan; instructor for the beginner kids karate class."],
];
const syd = () => { const p = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short" }).format(new Date()); return Math.max(0, ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.slice(0, 3))); };
const today = syd();
let path = 0, stage = 0, day = TT[today].length ? today : [1, 3, 5].find((d) => d > today) ?? 1, teacher = 0;

function showPath(animate = true) {
  const p = PATHS[path];
  $(".paths").innerHTML = PATHS.map((x, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === path}"><b>${t(x.tab)}</b><span>${t(x.age)}</span></button>`).join("");
  $("#p-kanji").textContent = p.k; $("#p-title").textContent = t(p.title); $("#p-body").textContent = t(p.body); $("#p-fee").textContent = p.fee;
  $("#p-steps-h").textContent = t(p.stepsH); $("#p-steps").innerHTML = p.steps.map((s) => `<li>${t(s)}</li>`).join(""); $("#p-stage-h").textContent = t(p.stageH);
  $("#p-stages").innerHTML = p.stages.map((s, i) => `<button type="button" data-i="${i}" aria-pressed="${i === stage}"><i>${i + 1}</i><b>${t(s.n)}</b><span>${t(s.s)}</span><em>${t(s.d)}</em></button>`).join("");
  const c = p.stages[stage].c; const o = $("#obi"); o.style.setProperty("--a", c[0]); o.style.setProperty("--b", c[1]); o.style.setProperty("--w", ((stage + 1) / 3 * 100) + "%");
  if (animate && !reduce) { const el = $(".path"); el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); }
}
function showDay(animate = true) {
  $(".days").innerHTML = DAYS.map((d, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === day}" class="${TT[i].length ? "" : "off"}${i === today ? " today" : ""}"><b>${t(d)}</b><span>${TT[i].length || "–"}</span></button>`).join("");
  $("#slots").innerHTML = TT[day].length ? TT[day].map(([h, n, k], i) => `<li class="k-${k}" style="--d:${i * 60}ms"><time>${h}</time><b>${t(n)}</b>${k !== "x" ? `<button type="button" data-p="${k}">${t(["About this class", "このクラスについて"])}</button>` : ""}</li>`).join("") : `<li class="none">${t(["No classes on this day.", "この日はクラスがありません。"])}</li>`;
  if (animate && !reduce) { const l = $("#slots"); l.classList.remove("flow"); void l.offsetWidth; l.classList.add("flow"); }
}
function showTeacher(animate = true) {
  $("#tlist").innerHTML = TEACH.map((x, i) => `<li><button type="button" data-i="${i}" aria-pressed="${i === teacher}"><b>${x[0]}</b><span>${x[1]}</span></button></li>`).join("");
  const x = TEACH[teacher]; $("#q-text").textContent = "“" + x[2] + "”"; $("#q-name").textContent = x[0]; $("#q-rank").textContent = x[1]; $("#q-note").textContent = x[3];
  if (animate && !reduce) { const el = $(".quote"); el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); }
}
function showNext() {
  const d = [0, 1, 2, 3, 4, 5, 6].map((i) => (today + i) % 7).find((i) => TT[i].some((s) => s[2] !== "x"));
  const s = TT[d].find((x) => x[2] !== "x"), when = d === today ? t(["Today", "本日"]) : t(DAYS[d]) + (lang === "ja" ? "曜" : "");
  $("#next").innerHTML = `<i></i>${t(["Next classes", "次のクラス"])}: <b>${when} ${s[0]}</b> ${t(s[1])}`;
}
$(".paths").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { path = +b.dataset.i; stage = 0; showPath(); if (!trialClass) fillTrial(); } });
$("#p-stages").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { stage = +b.dataset.i; showPath(false); } });
$(".days").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { day = +b.dataset.i; showDay(); } });
$("#slots").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { path = PATHS.findIndex((p) => p.id === b.dataset.p); stage = 0; showPath(); $("#classes").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); } });
$("#tlist").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { teacher = +b.dataset.i; showTeacher(); } });
/* ---------- free trial form (same fields as the form on the current site). The date list only offers days when the chosen class runs. ---------- */
let trialClass = "", trialDate = "";
function trialDates() {
  const k = trialClass || PATHS[path].id, out = [], now = new Date();
  for (let i = 0; i < 21 && out.length < 6; i++) { const d = new Date(now.getTime() + i * 864e5), wd = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short" }).format(d).slice(0, 3));
    if (i === 0) continue; TT[wd].filter((s) => s[2] === k).forEach((s) => out.push({ v: new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "long", day: "numeric", month: "long" }).format(d) + ", " + s[0] + " (" + s[1][0] + ")", l: new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-AU", { timeZone: "Australia/Sydney", weekday: "short", day: "numeric", month: "short" }).format(d) + " · " + s[0] + " · " + t(s[1]) })); }
  return out.slice(0, 6);
}
function fillTrial() {
  const k = trialClass || PATHS[path].id;
  $("#f-class").innerHTML = PATHS.map((p) => `<option value="${p.id}" ${p.id === k ? "selected" : ""}>${t(p.tab)} (${t(p.age)})</option>`).join("");
  const ds = trialDates(); $("#f-date").innerHTML = ds.map((d) => `<option value="${d.v}" ${d.v === trialDate ? "selected" : ""}>${d.l}</option>`).join("");
}
$("#f-class").addEventListener("change", (e) => { trialClass = e.target.value; trialDate = ""; fillTrial(); });
$("#f-date").addEventListener("change", (e) => { trialDate = e.target.value; });
$("#enq").addEventListener("submit", (e) => { e.preventDefault(); const f = e.target, bad = [...f.elements].find((x) => x.required && !x.value.trim()); $$(".enq .bad").forEach((x) => x.classList.remove("bad")); $("#f-err").hidden = !bad; if (bad) { bad.closest("label").classList.add("bad"); bad.focus(); $("#f-err").textContent = t(["Please fill in the highlighted field.", "色のついた欄をご記入ください。"]); return; }
  const v = Object.fromEntries(new FormData(f)), body = ["Hi Harrison, I would like to book a free trial at Shinbukan.", "Class: " + PATHS.find((p) => p.id === v.cls).tab[0], "Date: " + v.date, "Name: " + v.name, "Phone: " + v.phone, v.email ? "Email: " + v.email : null, v.msg ? "I would like to know more about: " + v.msg : null].filter((x) => x !== null).join("\n");
  location.href = "sms:+61417884131?&body=" + encodeURIComponent(body); });
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-en]").forEach((el) => { el.alt = lang === "en" ? el.dataset.altEn : el.dataset.altJa; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  $("#line").innerHTML = LINE.map(([y, h, b]) => `<li><time>${y}</time><h3>${t(h)}</h3><p>${t(b)}</p></li>`).join("");
  showPath(false); showDay(false); showTeacher(false); showNext(); fillTrial(); observe();
}
$(".lang").addEventListener("click", () => { lang = lang === "en" ? "ja" : "en"; applyLang(); });
let io;
function observe() {
  if (reduce || !("IntersectionObserver" in window)) { document.documentElement.classList.add("no-motion"); return; }
  io ??= new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$(".sec-head, .paths, .path, .days, #slots, .saito-top, #line li, .harrison, .tgrid, .visit > div, .enq").forEach((el) => { if (!el.classList.contains("rv")) { el.classList.add("rv"); io.observe(el); } });
}
applyLang();
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
