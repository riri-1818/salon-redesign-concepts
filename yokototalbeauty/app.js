// yokototalbeauty — interaction. With "reduce motion" on, everything is simply shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (p) => p[lang === "en" ? 0 : 1];

/* features, treatments and prices (from the service pages of the current site) */
const FEATS = [
  { id: "brows", w: ["Brows", "眉"], img: "brows", pos: "80% 60%", cap: ["Brows by Yoko, from the gallery", "Yoko が手がけた眉（ギャラリーより）"], from: 770,
    lead: ["Created strand by strand, in a shape that is balanced with your facial structure.", "一本ずつ描き、お顔の骨格に合う形に整えます。"],
    groups: [{ n: ["Eyebrow cosmetic tattoo", "眉のアートメイク"], rows: [["Microblading", "マイクロブレーディング", 770], ["Powder Brow / Shading", "パウダーブロウ／シェーディング", 770], ["Microblading & Shading Combination", "マイクロブレーディング＋シェーディング", 850], ["Nano Brow", "ナノブロウ", 990]] }] },
  { id: "eyes", w: ["Eyes", "目もと"], img: "lashes", pos: "50% 50%", cap: ["Eyelash extensions by Yoko, from the gallery", "Yoko が手がけたまつ毛エクステ（ギャラリーより）"], from: 120,
    lead: ["Eyelash extensions from classic to 4D, the Yumi Lash Lift, and eyeliner tattoo.", "クラシックから 4D までのまつ毛エクステ、Yumi ラッシュリフト、アイラインのアートメイク。"],
    groups: [{ n: ["Eyelashes", "まつ毛"], rows: [["Yumi Lash Lift", "Yumi ラッシュリフト", 120], ["Single full classic set", "シングル・フルクラシック", 120], ["Single & 2D glamour set", "シングル＋2D グラマー", 130], ["Full 2D-3D set", "フル 2D-3D", 130], ["Full 4D set", "フル 4D", 155], ["Eyelash removal", "まつ毛エクステのオフ", 25]] },
      { n: ["Infill", "リペア"], rows: [["Single · 2 weeks", "シングル ・ 2週間", 80], ["Single · 3 weeks", "シングル ・ 3週間", 90], ["2D-3D · 2 weeks", "2D-3D ・ 2週間", 80], ["2D-3D · 3 weeks", "2D-3D ・ 3週間", 100], ["4D, plus", "4D は追加", 30]] },
      { n: ["Eyeliner cosmetic tattoo", "アイラインのアートメイク"], rows: [["Lower", "下", 330], ["Upper with Lash Enhance", "上（ラッシュエンハンス）", 550], ["Upper / Lower (Combo)", "上下", 770], ["Upper Thick (Wing)", "上・太め（ウイング）", 880], ["Smokey Eyeliner", "スモーキー", 880]] }] },
  { id: "lips", w: ["Lips", "リップ"], img: "lips", pos: "50% 50%", cap: ["Lip blush by Yoko, from the gallery", "Yoko が手がけたリップ（ギャラリーより）"], from: 330,
    lead: ["Lip blush, for lips that appear refreshed, plumped and defined.", "リップブラッシュ。唇の色と輪郭を、すっきり整えます。"],
    groups: [{ n: ["Lip blush tattoo", "リップのアートメイク"], rows: [["Lip Line", "リップライン", 330], ["Full Lip", "フルリップ", 880], ["Touch-up · 12 months", "タッチアップ ・ 12か月", 330]] }] },
  { id: "hair", w: ["Hairline", "ヘアライン"], img: "hairline", pos: "50% 60%", cap: ["Hairline by Yoko, from the gallery", "Yoko が手がけたヘアライン（ギャラリーより）"], from: 440,
    lead: ["Hairline and scalp micropigmentation, for the temple, the hairline and thinning areas. Unisex.", "生えぎわと頭皮のアートメイク。こめかみ、生えぎわ、薄くなった部分に。男女どちらにも。"],
    groups: [{ n: ["Hairline", "ヘアライン"], rows: [["Thinning / Balding Spot", "薄い部分", 440], ["Temple Infill", "こめかみ", 550], ["Hairline Part", "生えぎわ（部分）", 660], ["Full Hairline", "生えぎわ（全体）", 880]] },
      { n: ["Scalp Micropigmentation (SMP)", "スカルプ・マイクロピグメンテーション（SMP）"], rows: [["Bald Patches, plus", "部分（から）", 1485], ["Half Head", "ハーフ", 2200], ["Widows Peak", "ウィドウズピーク", 2475], ["Scar Treatment", "傷あと", 2750], ["Repair", "リペア", 2750], ["Full Head", "フル", 4400]] }] },
];
const MORE = [["Teeth whitening, 1 person single", "ホワイトニング（1名・1回）", 240], ["Cosmetic tattoo removal", "アートメイクの除去", 250]];
const TOUCH = [[6, ["Under 6 months", "6か月未満"], 330], [12, ["6 to 12 months", "6〜12か月"], 385], [24, ["12 to 24 months", "12〜24か月"], 495], [999, ["Over 24 months", "24か月より先"], 550]];
const QUOTES = [
  [["“She designed my brows based on the golden ratio that suited my facial structure perfectly, and I absolutely love the result.”", "「眉毛は自分の骨格に合わせた黄金比でとても綺麗にデザインしてくださり、大満足です。」"], "Erika Yamao"],
  [["“I’ve been going to her for 6 years for permanent eyeliner, facials and microblading. She is a true artist.”", "「アイライン、フェイシャル、マイクロブレーディングで、6年通っています。本物のアーティストです。」"], "Esra H"],
  [["“Her craft is like artwork and she does it in the gentlest way possible.”", "「技術はまるで作品のよう。それを、これ以上ないほどやさしく進めてくれます。」"], "Yee Cheng"],
  [["“Yoko is an artist. Her work is so careful and precise.”", "「Yoko はアーティストです。仕事がとても丁寧で、正確です。」"], "Elizabeth Hastings"],
];
const COURSES = ["Nano Eyebrow Course", "Eyebrow Microblading / Combination Course", "Eyebrow Microblading / Nanofeather Course", "Ombre / Powder Brow Course", "Lip Blush Tattoo Course", "Eyeliner Tattoo Course", "Hairline Microblading Course", "Hyaluron Pen Course", "Eyelash Extension Course", "Keratin Lash Lift Course", "Teeth Whitening Course", "Scalp Micropigmentation Course"];

let cur = 0, asked = "";
/* a row of fine hair strokes, drawn one by one under the chosen word */
function strokes() {
  const N = 30; let s = "";
  for (let i = 0; i < N; i++) { const p = i / (N - 1), x = 4 + p * 190, y = 21 - Math.sin(p * Math.PI * 0.86) * 13, a = -72 + p * 58, r = a * Math.PI / 180, len = 9 - p * 3; s += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + Math.cos(r) * len).toFixed(1)}" y2="${(y + Math.sin(r) * len).toFixed(1)}" style="--d:${i * 16}ms"/>`; }
  return `<svg class="strokes" viewBox="0 0 200 26" aria-hidden="true">${s}</svg>`;
}
function words() {
  $(".words").innerHTML = FEATS.map((f, i) => `<button type="button" role="tab" aria-selected="${i === cur}" data-i="${i}"><span>${t(f.w)}</span>${i === cur ? strokes() : ""}</button>`).join("");
}
function frame(first) {
  const f = FEATS[cur], box = $("#frame"), set = () => { box.innerHTML = `<img src="img/${f.img}.jpg" width="1000" height="1000" alt="${t(f.cap)}" style="object-position:${f.pos}">`; box.classList.remove("out"); };
  if (first || reduce) set(); else { box.classList.add("out"); setTimeout(set, 220); }
  $("#f-cap").textContent = t(f.cap); $("#f-from").textContent = t(["from $", "$"]) + f.from + t(["", " から"]);
}
function menu() {
  const f = FEATS[cur];
  $("#m-title").textContent = t(f.w); $("#m-lead").textContent = t(f.lead);
  const row = (r) => `<li><span>${t(r)}</span><b>$${r[2].toLocaleString("en-AU")}</b><a href="#ask" data-ask="${r[0]}" aria-label="${t(["Ask about", "質問する："])} ${t(r)}">${t(["Ask", "質問"])}</a></li>`;
  $("#m-body").innerHTML = f.groups.map((g) => `<div class="grp"><h3>${t(g.n)}</h3><ul>${g.rows.map(row).join("")}</ul></div>`).join("") + `<div class="grp also"><h3>${t(["Also at the clinic", "ほかのメニュー"])}</h3><ul>${MORE.map(row).join("")}<li class="plain"><span>${t(["Plasma skin tightening · Hyaluron Pen", "プラズマ・スキンタイトニング ・ ヒアルロンペン"])}</span><a href="#ask" data-ask="Other treatments">${t(["Ask", "質問"])}</a></li></ul></div>`;
  $("#touch").hidden = f.id !== "brows"; touch();
}
function touch() {
  const m = +$("#months").value, b = TOUCH.find((x) => m < x[0]);
  $("#t-when").textContent = t([`${m} month${m === 1 ? "" : "s"} ago · ${b[1][0]}`, `${m}か月前 ・ ${b[1][1]}`]); $("#t-price").textContent = "$" + b[2];
  $("#months").style.setProperty("--p", ((m - 1) / 29 * 100) + "%");
}
function rest() {
  $("#quotes").innerHTML = QUOTES.map((x) => `<blockquote><p>${t(x[0])}</p><footer>${x[1]}</footer></blockquote>`).join("");
  $("#c-list").innerHTML = COURSES.map((c) => `<li>${c}</li>`).join("");
  const opts = [...FEATS.flatMap((f) => f.groups.flatMap((g) => g.rows.map((r) => [r[0], t(r)]))), ...MORE.map((r) => [r[0], t(r)]), ["Other treatments", t(["Other treatments", "そのほかのメニュー"])], ["Courses", t(["Courses", "技術コース"])]];
  $("#a-what").innerHTML = `<option value="">${t(["Please choose", "選んでください"])}</option>` + opts.map((o) => `<option value="${o[0]}"${o[0] === asked ? " selected" : ""}>${o[1]}</option>`).join("");
}
function pick(i) { cur = i; words(); frame(false); menu(); }
document.addEventListener("click", (e) => {
  const w = e.target.closest(".words button"); if (w) { pick(+w.dataset.i); return; }
  const a = e.target.closest("[data-ask]"); if (a) { asked = a.dataset.ask; $("#a-what").value = asked; }
});
$("#months").addEventListener("input", touch);
$("#a-what").addEventListener("change", (e) => { asked = e.target.value; });
$("#ask").addEventListener("submit", (e) => {
  e.preventDefault();
  const what = $("#a-what").value, name = $("#a-name").value.trim(), msg = $("#a-msg").value.trim();
  const err = $("#ask-err"); if (!msg) { err.textContent = t(["Please write your question first.", "ご質問をご記入ください。"]); err.hidden = false; $("#a-msg").focus(); return; } err.hidden = true;
  const subject = t(["Question", "ご質問"]) + (what ? `: ${what}` : "");
  const body = msg + "\n\n" + (name || t(["(your name)", "（お名前）"]));
  location.href = `mailto:yoko@yokototalbeauty.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-en]").forEach((el) => { el.alt = lang === "en" ? el.dataset.altEn : el.dataset.altJa; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  words(); frame(true); menu(); rest();
}
$(".lang").addEventListener("click", () => { lang = lang === "en" ? "ja" : "en"; applyLang(); });
applyLang();
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
  $$(".menu-head, .menu-body, .yoko-photo, .yoko-copy, .quotes, .c-head, .c-list, .v-info, .ask").forEach((el) => { el.classList.add("rv"); io.observe(el); });
}
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
