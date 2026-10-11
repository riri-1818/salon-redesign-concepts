// JAPANESE SYDNEY（ご提案用の試作）。文言・料金・日程は、いまのサイト（2026-10-11 取得）にあるものだけ。英語のみ（読み方の表示を切り替えられる）。
lang = "en";
// 入門クラスの開始日（Timetable のページ）
const STARTS = ["2026-08-10", "2026-09-14", "2026-10-19", "2026-11-23", "2027-01-11"];
const OPEN = "2026-10-19"; // 「available now」と書かれている回
const SLOTS = [
  ["Monday", "5pm", "October 19th to December 7th", "classroom", "80 minutes once a week for 8 weeks", "$330"],
  ["Tuesday", "6:40pm", "October 20th to December 8th", "online via zoom", "80 minutes once a week for 8 weeks", "$330"],
  ["Saturday", "2pm", "October 24th to December 12th", "classroom", "80 minutes once a week for 8 weeks", "$330"],
  ["Wednesday", "12:10pm", "October 21st to January 6th 2027, no lessons on December 23rd and 30th", "classroom", "Senior class, from 50 years old. 80 minutes once a week for 10 weeks", "$380"],
];
// [名前, 日本語, かな, ローマ字, 概要, めざすこと, 教科書, JLPT, 学習内容]
const LEVELS = [
  ["Beginner introduction class", "入門", "にゅうもん", "nyūmon", ["If you have never studied Japanese before, this course is for you. We will teach you the initial gist to read, write, speak and listen to the Japanese language. New vocabulary and grammar will be constantly introduced and you will learn very simple conversation."],
    ["Learn Japanese characters (Hiragana)", "Can have simple conversation to use very basic vocabulary and grammar", "Good preparation before you go to Japan for short holiday"], "Study materials provided", "", null],
  ["Beginner (continue)", "初級", "しょきゅう", "shokyū", ["After beginner introduction class, the course continues more by the same way. The main task is speaking and listening, and reading and writing more. New vocabulary and grammar are constantly introduced and you will learn simple conversation steadily."],
    ["Learn Japanese characters (Hiragana, Katakana)", "Can have simple conversation to use very basic vocabulary and grammar"], "Ippo Nihongo Sanpo beginner I (いっぽにほんごさんぽ 初級I), Chapter 1–20", "",
    [["1", "1-5", "Daily greeting, Introducing yourself, Numbers, Shopping conversations, Names of basic objects, Time, Places, House/Office, HIRAGANA reading."], ["2", "6-9", "Day/Date expression, Weather, Daily actions, Going out, Birthday, HIRAGANA reading."], ["3", "10-12", "Actions with objects/methods, Completed actions, Impression and feeling (adjective), HIRAGANA and KATAKANA reading."], ["4", "13-16", "Describing people/places, Colors, Likes/dislikes, Reasons, Expression of desire, Good/bad at, Expression of offer, KATAKANA reading."], ["5", "17-20", "Existence of things/people, Position, Quantifiers, Family, Restaurant conversations, Giving and receiving, KATAKANA reading."]]],
  ["Pre-Intermediate", "初中級", "しょちゅうきゅう", "shochūkyū", ["After completing Beginner level, we will build from the previous level and start prepping you for a more intermediate level of the Japanese language. You will learn to communicate in a variety of situations, whether at work, school, college or in the Japanese community."],
    ["Can read Japanese characters (Hiragana, Katakana)", "Can understand basic Japanese in life to a certain extent", "Can use more vocabularies and expressions"], "Minna no Nihongo elementary I (みんなの日本語 初級I), Chapter 1-25", "Similar level to JLPT N5",
    [["1", "1-7", "Review of Beginner level · Daily greeting · Introducing yourself · Numbers · Time/Date expression · Names of basic objects · Shopping conversations · Daily actions · Going out · Birthday (Greetings, farewells and special expressions) · Giving and receiving.", "～は～です/じゃありません　～を（V）ます/ません/ました/ませんでした/ませんか"],
      ["2", "8-13", "Impression and feeling (adjective) · Like/dislike · Reasons · Counters · Family · Describe places/countries · Comparison/most · Expression of desire · Restaurant conversations", "～は（A)です/でした/かったです　～のほうが（A）です　～がいます/あります　（Ｖ）たいです"],
      ["3", "14-19", "Request and offering · Action in progress · Asking permission/expressing prohibition · Sightseeing situations · Daily actions · Describing people/things · Health (illness and physical injuries) · Expressing ability/hobby · Talking about everyday experiences", "（V）て形　ない形　じしょ(dictionary)形　た形　（V）ています　（V）ないでください　～まえに　（V）たことがあります"],
      ["4", "20-25", "Casual conversation between friends · Expressing ideas/information/opinion · Noun modification · Direction · Expressing gratitude · Talking about possibilities (Conditional) and the future", "（V）ふつう（plain）形　～とおもいます　～と、～　～とき、～　～てくれました　もし～たら/ても～"]]],
  ["Pre-Intermediate (comprehensive)", "初中級・総合", "しょちゅうきゅう・そうごう", "shochūkyū sōgō", ["After Pre-intermediate level, we will build the comprehensive conversation skill. You will get used to using varieties of words and grammar at any situation of conversation, and start to learn some kanji as well."],
    ["Can write Japanese characters (Hiragana, Katakana)", "Can read and write some Chinese characters (Kanji)", "Understand basic Japanese in life to a certain extent", "Use more vocabularies and expressions in polite and casual conversation"], "Ippo Nihongo Sanpo 2 (いっぽにほんごさんぽ 初級２)", "Similar level to JLPT N5 (and N4 a bit)", null],
  ["Intermediate", "中級", "ちゅうきゅう", "chūkyū", ["After completing Pre-Intermediate level, we will aim for comprehensive Japanese skill to use more advanced vocabularies and expressions."],
    ["Can recognize some Japanese characters (Kanji originally from China)", "Can understand basic Japanese and can use a lot of grammar and expressions", "Can speak and write properly in Japanese and understand the detailed contents to read some writings"], "Minna no Nihongo elementary II (みんなの日本語 初級II), Chapter 26-50", "Similar level to JLPT N4, N3",
    [["1", "26-30", "Review of Elementary · Requests · Invitations and suggestions · Job interview · How to refuse politely · Trouble situations · Planning and preparing a party", "～んです　～ながら、～　可能(Potential)形（できる）　～てしまう　自動詞（Vi)/他動詞（Vｔ）　～てある/～ておく"],
      ["2", "31-37", "Going out with friends · Giving advice and assistance · Hospital situation · Reading Japanese signs · Guiding people · Conditional expression · Recommendation · Explaining your troubles", "意向(Volitional)形（行こう）　～ほうがいい　命令・禁止(imperative・prohibitive)形 (行け／行くな）　～とおりに～　条件(Conditional)形（～ば）　受身(passive)形（～られます）"],
      ["3", "38-44", "Maintaining a long chat in social situations · Causes of accidents · Conversations in meeting at office/school · Choosing right phrases in terms of Japanese Hierarchy · Impression and natural feeling", "～のは～　～ので～　～てみる　～をいただく　～のために～　～そうです　～すぎる"],
      ["4", "45-50", "Inquiries to public institution · Making complaints · Asking delivery · Emotional expression · Telling/listening to news · Expression through face senses · Kids’ education · Business conversations", "～のばあいは～　～ばかりだ　～ようだ　使役(Causative)形（～させる）　尊敬(respectful)・謙譲(humble)語"]]],
  ["Upper-Intermediate – Advanced", "中上級", "ちゅうじょうきゅう", "chūjōkyū", ["After completing intermediate level, this is the time to guide you to be able to shift more advanced level of Japanese smoothly. We will learn more advanced grammar, to write your opinion regarding various topics, to read longer reading materials.", "Now that you’ve completed all intermediate level, we will start guiding you into more advanced level of Japanese. We will learn to use advanced grammar in your conversation and help that the all Japanese skill (Kanji, Vocab, Writing, Listening, Speaking) will be developed."],
    ["Can speak and understand daily conversation with confidence, no issue", "Can read and write regarding various topics, newspaper, various type of writings and can understand its outline"], "Chuukyuu e ikoo (中級へ行こう), Chuukyuu o manaboo (中級を学ぼう) & Others", "Similar level to JLPT N3, N2", null],
];
const GROUP = { 8: ["Straight 8 weeks package", "80 minutes once a week", 330, 8], 10: ["Straight 10 weeks package", "80 minutes once a week", 380, 10], 1: ["One lesson", "80 minutes", 55, 1] };
// PRIV[長さ][時間帯][頻度] = [料金, 回数]
const PRIV = { 50: { off: { "1x": [400, 8], "2x": [750, 16], one: [58, 1] }, peak: { "1x": [500, 8], "2x": [880, 16], one: [72, 1] } }, 80: { off: { "1x": [560, 8], one: [80, 1] }, peak: { "1x": [670, 8], one: [96, 1] } } };
const WHEN = { off: "on weekdays finish until 5:30pm", peak: "on weekdays finish after 5:30pm or Saturday anytime" };
const CITIES = [["Sapporo", "札幌", "Hokkaido 北海道"], ["Tokyo", "東京", ""], ["Nagoya", "名古屋", "Aichi 愛知県"], ["Kyoto", "京都", ""], ["Osaka", "大阪", ""], ["Nishinomiya · Kobe", "西宮・神戸", "Hyogo 兵庫県"], ["Fukuoka", "福岡", ""], ["Naha", "那覇", "Okinawa 沖縄"]];
const CATS = [["all", "All 22"], ["lessons", "Lessons"], ["enrol", "Enrolling and fees"], ["change", "Changes and missed lessons"], ["which", "Which course"], ["jlpt", "JLPT"]];
const PHONE = [[720, 1140], [720, 1140], [720, 1140], [720, 1140], [720, 1140], [720, 1080], null]; // 月〜金 正午〜7pm、土 正午〜6pm
const F = { type: "group", gpack: "8", len: "50", when: "off", freq: "1x" };
let lv = 0, cat = "all";
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ord = (n) => n + (n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th");
const D = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const nice = (d) => `${MONTHS[d.getMonth()]} ${ord(d.getDate())}`;
function today0() { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" })); d.setHours(0, 0, 0, 0); return d; }

function yomi() { const k = document.body.dataset.yomi; $$(".yomi").forEach((el) => { el.textContent = el.dataset[k]; }); $$("[data-yomi]:not(body)").forEach((b) => b.setAttribute("aria-pressed", b.dataset.yomi === k)); }
function starts() {
  const now = today0();
  $("#starts").innerHTML = STARTS.map((s) => {
    const d = D(s), rel = new Date(d); rel.setDate(rel.getDate() - 21); const by = new Date(d); by.setDate(by.getDate() - 7);
    const st = d < now ? "past" : s === OPEN ? "open" : "soon";
    const note = st === "past" ? "Started" : st === "open" ? `Available now. Please enrol by ${nice(by)}` : `Timetable released around ${nice(rel)}`;
    return `<li class="${st}"><span>${d.getFullYear()}</span><b>${nice(d)}</b><i>${note}</i></li>`;
  }).join("");
  $("#slots").innerHTML = SLOTS.map((s, i) => `<li><p class="s-day"><b>${s[0]}</b><span>at ${s[1]}</span></p><p class="s-info"><em class="${s[3].startsWith("online") ? "on" : "room"}">${s[3]}</em>${s[4]}<br>from ${s[2]}</p><p class="s-fee">${s[5]}</p><a class="btn btn--s" href="#contact" data-topic="Beginner introduction class: ${s[0]} at ${s[1]} (${s[3]}), from ${s[2].split(" to ")[0]}">Ask for this class</a></li>`).join("");
}
function steps() {
  $("#steps").innerHTML = LEVELS.map((l, i) => `<li style="--i:${i}"><button type="button" role="tab" data-lv="${i}" aria-selected="${i === lv}"><span class="n">${i + 1}</span><span class="jp" lang="ja">${l[1]}</span><span class="en">${l[0]}</span>${l[7] ? `<span class="jl">${l[7].replace("Similar level to ", "≈ ")}</span>` : ""}</button></li>`).join("");
}
function level(animate) {
  const l = LEVELS[lv], k = document.body.dataset.yomi;
  $("#level").innerHTML = `<p class="word"><span class="jp" lang="ja">${l[1]}</span><span class="yomi" data-kana="${l[2]}" data-roma="${l[3]}">${k === "kana" ? l[2] : l[3]}</span><span class="imi">step ${lv + 1} of 6</span></p><h3>${l[0]}</h3>${l[4].map((p) => `<p>${p}</p>`).join("")}
    <h4>Level, aim</h4><ul class="ticks">${l[5].map((a) => `<li>${a}</li>`).join("")}${l[7] ? `<li>${l[7]}</li>` : ""}</ul>
    <p class="book"><b>${lv === 0 ? "Materials" : "Textbook"}</b>${l[6]}</p>
    ${l[8] ? `<details class="fold"><summary>See what each part covers</summary><div class="parts">${l[8].map((p) => `<div><p class="p-h"><b>Part ${p[0]}</b><span>Chapter ${p[1]}</span></p><p>${p[2]}</p>${p[3] ? `<p class="gram" lang="ja"><i lang="en">Grammar examples</i>${p[3]}</p>` : ""}</div>`).join("")}</div></details>` : ""}
    <a class="btn btn--line" href="${lv === 0 ? "#next" : "#contact"}" ${lv === 0 ? "" : `data-topic="${l[0]} course"`}>${lv === 0 ? "See the next start dates" : "Ask about this level"}</a>`;
  if (animate && window.gsap && !reduce) gsap.from("#level > *", { y: 14, opacity: 0, duration: 0.4, stagger: 0.04, ease: "power2.out", clearProps: "all" });
}
function calc() {
  $$(".seg").forEach((s) => $$("button", s).forEach((b) => b.setAttribute("aria-pressed", F[s.dataset.k] === b.dataset.v)));
  $$("[data-for]").forEach((q) => { q.hidden = q.dataset.for !== F.type; });
  const two = $('.seg[data-k="freq"] [data-v="2x"]'); two.disabled = F.len === "80"; if (F.len === "80" && F.freq === "2x") { F.freq = "1x"; return calc(); }
  let label, price, n, sub;
  if (F.type === "group") { const g = GROUP[F.gpack]; label = `Group lesson · ${g[0]}`; price = g[2]; n = g[3]; sub = `${g[1]}${n > 1 ? ` (${n} lessons)` : ""}`; }
  else {
    const p = PRIV[F.len][F.when][F.freq]; price = p[0]; n = p[1];
    label = `Private lesson · ${F.freq === "one" ? "One lesson" : "8 weeks package"}`;
    sub = `${F.len} minutes${F.freq === "one" ? "" : F.freq === "2x" ? " twice a week" : " once a week"}, ${WHEN[F.when]}${n > 1 ? ` (${n} lessons)` : ""}`;
  }
  $("#a-label").textContent = label; $("#a-sub").textContent = sub;
  const el = $("#a-price"), from = +el.dataset.v || price; el.dataset.v = price;
  if (window.gsap && !reduce && from !== price) { const o = { v: from }; gsap.to(o, { v: price, duration: 0.45, ease: "power2.out", onUpdate: () => { el.textContent = "$" + Math.round(o.v); } }); } else el.textContent = "$" + price;
  $("#a-go").dataset.topic = `${label}: ${sub}, $${price}`;
}
function pricelist() {
  const g = Object.values(GROUP).map((x) => `<li><span>${x[0]}: ${x[1]}${x[3] > 1 ? ` (${x[3]} lessons)` : ""}</span><b>$${x[2]}</b></li>`).join("");
  const rows = (freq) => [[50, "off"], [50, "peak"], [80, "off"], [80, "peak"]].filter(([l, w]) => PRIV[l][w][freq]).map(([l, w]) => `<li><span>${l} minutes${freq === "one" ? "" : freq === "2x" ? " twice a week" : " once a week"}, ${freq === "2x" && w === "peak" ? "on weekdays finish after 5:30pm and Saturday anytime" : WHEN[w]}${freq === "one" ? "" : ` (${PRIV[l][w][freq][1]} lessons)`}</span><b>$${PRIV[l][w][freq][0]}</b></li>`).join("");
  $("#pricelist").innerHTML = `<h3>Group lessons</h3><ul class="pl">${g}</ul><h3>Private lessons: 8 weeks package</h3><ul class="pl">${rows("1x")}${rows("2x")}</ul><h3>Private lessons: one lesson</h3><ul class="pl">${rows("one")}</ul>`;
}
function tt() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], T0 = 660, T1 = 1200, pct = (m) => ((m - T0) / (T1 - T0)) * 100, now = sydney();
  const fmt = (m) => `${Math.floor(m / 60) % 12 || 12}${m % 60 ? ":" + String(m % 60).padStart(2, "0") : ""}${m < 720 ? "am" : "pm"}`;
  const hrs = [660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200].map((m) => `<span style="top:${pct(m)}%">${fmt(m)}</span>`).join("");
  $("#tt").innerHTML = `<div class="tt-h" aria-hidden="true">${hrs}</div>` + days.map((d, i) => {
    const sat = i === 5, bands = sat ? [["eve", 720, 1140]] : [["day", 660, 1050], ["eve", 1050, 1200]], gs = sat ? [730, 840, 940] : [730, 1020, 1120];
    return `<div class="tt-d${i === now.d ? " is-today" : ""}"><b>${d}</b><div class="tt-c">${bands.map((b) => `<i class="b-${b[0]}" style="top:${pct(b[1])}%;height:${pct(b[2]) - pct(b[1])}%"></i>`).join("")}${gs.map((g) => `<span class="g" style="top:${pct(g)}%;height:${(80 / (T1 - T0)) * 100}%">${Math.floor(g / 60) % 12 || 12}:${String(g % 60).padStart(2, "0")}<small>pm</small></span>`).join("")}${i === now.d && now.m >= T0 && now.m <= T1 ? `<em class="now" style="top:${pct(now.m)}%"></em>` : ""}</div></div>`;
  }).join("");
}
function cities() { $("#cities").innerHTML = CITIES.map((c) => `<li><span class="jp" lang="ja">${c[1]}</span><b>${c[0]}</b>${c[2] ? `<i>${c[2]}</i>` : ""}</li>`).join(""); }
function faq() {
  $("#cats").innerHTML = CATS.map((c) => `<button type="button" data-cat-f="${c[0]}" aria-pressed="${c[0] === cat}">${c[1]}</button>`).join("");
  $$("#qa details").forEach((d) => { d.hidden = cat !== "all" && d.dataset.cat !== cat; });
}
function hours() {
  const { d, m } = sydney(), h = PHONE[d];
  $("#hours").textContent = "Mondays – Fridays noon – 7pm, Saturdays noon – 6pm";
  $("#today").textContent = h && m >= h[0] && m < h[1] ? `We’re answering the phone now, until ${h[1] === 1140 ? "7pm" : "6pm"}: 0432 728 790` : "Phone: Mondays – Fridays noon – 7pm, Saturdays noon – 6pm";
}

document.addEventListener("click", (e) => {
  const y = e.target.closest(".yomi-sw [data-yomi]"); if (y) { document.body.dataset.yomi = y.dataset.yomi; yomi(); return; }
  const s = e.target.closest("[data-lv]"); if (s) { lv = +s.dataset.lv; steps(); level(true); return; }
  const b = e.target.closest(".seg button"); if (b && !b.disabled) { F[b.parentElement.dataset.k] = b.dataset.v; calc(); return; }
  const c = e.target.closest("[data-cat-f]"); if (c) { cat = c.dataset.catF; faq(); return; }
  const o = e.target.closest("[data-open]"); if (o) { $("#" + o.dataset.open).open = true; }
  const tp = e.target.closest("[data-topic]"); if (tp) { $("#f-topic").value = tp.dataset.topic; }
});
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim(), err = $("#f-err");
  if (!v("#f-name") || !/^\S+@\S+\.\S+$/.test(v("#f-mail")) || !v("#f-msg")) { err.textContent = "Please enter your name, a valid email address and a message."; err.hidden = false; $("#f-done").hidden = true; return; }
  err.hidden = true; $("#f-done").hidden = false;
  location.href = `mailto:info-rep@japanesesydney.com.au?subject=${encodeURIComponent("Inquiry" + (v("#f-topic") ? ": " + v("#f-topic") : ""))}&body=${encodeURIComponent(`Name: ${v("#f-name")}\nEmail: ${v("#f-mail")}\nAbout: ${v("#f-topic") || "-"}\n\n${v("#f-msg")}`)}`;
});

yomi(); starts(); steps(); level(false); calc(); pricelist(); tt(); cities(); faq(); hours();
setInterval(() => { tt(); hours(); }, 60000);

if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".hero .jp", { clipPath: "inset(0 100% 0 0)", duration: 1.1, ease: "power2.out", clearProps: "clipPath" });
  gsap.from(".hero-copy > *:not(.word), .board, .facts3 li", { y: 20, opacity: 0, duration: 0.55, ease: "power2.out", stagger: 0.07, delay: 0.25, clearProps: "all" });
  gsap.from(".stamp", { scale: 2.2, opacity: 0, rotate: 8, duration: 0.45, ease: "back.out(2)", scrollTrigger: { trigger: ".intake", start: "top 80%", once: true } });
  gsap.from(".steps li", { x: -24, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", clearProps: "all", scrollTrigger: { trigger: ".ladder", start: "top 82%", once: true } });
  gsap.from(".tt .g", { scaleY: 0, transformOrigin: "50% 0", duration: 0.5, stagger: 0.03, ease: "power2.out", clearProps: "transform", scrollTrigger: { trigger: "#tt", start: "top 85%", once: true } });
  ScrollTrigger.batch(".sec-head, .starts li, .slots li, .intro-detail > *, .assess, .calc, .www > div, .ns li, .cities li, .way li, .c-grid > *", {
    start: "top 90%", once: true,
    onEnter: (els) => gsap.from(els, { y: 20, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.05, clearProps: "all" }),
  });
}
