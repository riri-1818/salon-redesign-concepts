// yokototalbeauty — the parts that change: the four parts of the face, their prices, the touch-up slider. Language helpers are in ds.js; the photo viewer and the reviews use Swiper, motion uses GSAP.

/* treatments and prices (from the service pages of the current site). A string price is shown as written. */
const PARTS = [
  { id: "brows", w: ["Brows", "眉"], img: "brows", pos: "80% 60%", cap: ["Brows by Yoko, from the gallery", "Yoko が手がけた眉（ギャラリーより）"],
    lead: ["Created strand by strand, in a shape that is balanced with your facial structure.", "一本ずつ描いて、骨格に合う形に整えます。"],
    groups: [{ n: ["Eyebrow cosmetic tattoo", "眉のアートメイク"], rows: [["Microblading", "マイクロブレーディング", 770], ["Powder Brow / Shading", "パウダーブロウ（シェーディング）", 770], ["Microblading & Shading Combination", "コンビネーション", 850], ["Nano Brow", "ナノブロウ", 990]] }] },
  { id: "eyes", w: ["Eyes", "目もと"], img: "lashes", pos: "50% 50%", cap: ["Eyelash extensions by Yoko, from the gallery", "Yoko が手がけたまつ毛エクステ（ギャラリーより）"],
    lead: ["Eyelash extensions from classic to 4D, the Yumi Lash Lift, and eyeliner tattoo.", "クラシックから 4D までのまつ毛エクステ、Yumi ラッシュリフト、アイラインのアートメイク。"],
    groups: [{ n: ["Eyelashes", "まつ毛"], rows: [["Yumi Lash Lift", "Yumi ラッシュリフト", 120], ["Single full classic set", "シングル（クラシック）フルセット", 120], ["Single & 2D glamour set", "シングル＋2D グラマーセット", 130], ["Full 2D-3D set", "2D-3D フルセット", 130], ["Full 4D set", "4D フルセット", 155], ["Eyelash removal", "エクステのオフ", 25]] },
      { n: ["Infill", "リペア（付け足し）"], rows: [["Single, 2 weeks", "シングル・2週間", 80], ["Single, 3 weeks", "シングル・3週間", 90], ["2D-3D, 2 weeks", "2D-3D・2週間", 80], ["2D-3D, 3 weeks", "2D-3D・3週間", 100], ["4D", "4D", "+$30"]] },
      { n: ["Eyeliner cosmetic tattoo", "アイラインのアートメイク"], rows: [["Lower", "下まぶた", 330], ["Upper with Lash Enhance", "上まぶた（ラッシュエンハンス）", 550], ["Upper / Lower (Combo)", "上下", 770], ["Upper Thick (Wing)", "上まぶた・太め（ウイング）", 880], ["Smokey Eyeliner", "スモーキーアイライン", 880]] }] },
  { id: "lips", w: ["Lips", "リップ"], img: "lips", pos: "50% 50%", cap: ["Lip blush by Yoko, from the gallery", "Yoko が手がけたリップ（ギャラリーより）"],
    lead: ["Lip blush, for lips that look refreshed and defined.", "唇の色と輪郭を、自然に整えます。"],
    groups: [{ n: ["Lip blush tattoo", "リップのアートメイク"], rows: [["Lip Line", "リップライン", 330], ["Full Lip", "フルリップ", 880], ["Touch-up, 12 months", "リタッチ（12か月）", 330]] }] },
  { id: "hair", w: ["Hairline", "ヘアライン"], img: "hairline", pos: "50% 60%", cap: ["Hairline by Yoko, from the gallery", "Yoko が手がけたヘアライン（ギャラリーより）"],
    lead: ["Hairline and scalp micropigmentation, for the temple, the hairline and thinning areas. For men and women.", "生えぎわと頭皮のアートメイクです。こめかみ、生えぎわ、薄くなった部分に。男性も女性も受けられます。"],
    groups: [{ n: ["Hairline", "生えぎわ"], rows: [["Thinning / Balding Spot", "薄くなった部分", 440], ["Temple Infill", "こめかみ", 550], ["Hairline Part", "生えぎわ（一部）", 660], ["Full Hairline", "生えぎわ（全体）", 880]] },
      { n: ["Scalp Micropigmentation (SMP)", "頭皮のアートメイク（SMP）"], rows: [["Bald Patches", "脱毛している部分", "$1,485+"], ["Half Head", "頭の半分", 2200], ["Widows Peak", "M字の部分", 2475], ["Scar Treatment", "傷あと", 2750], ["Repair", "修正", 2750], ["Full Head", "頭全体", 4400]] }] },
];
const MORE = [["Teeth whitening, 1 person, single session", "ホワイトニング（1名・1回）", 240], ["Cosmetic tattoo removal", "アートメイクの除去", 250]];
const TOUCH = [[6, ["under 6 months", "6か月未満"], 330], [12, ["6 to 12 months", "6〜12か月"], 385], [24, ["12 to 24 months", "12〜24か月"], 495], [999, ["over 24 months", "24か月より先"], 550]];
const QUOTES = [
  [["“She designed my brows based on the golden ratio that suited my facial structure perfectly, and I absolutely love the result.”", "「眉毛は自分の骨格に合わせた黄金比でとても綺麗にデザインしてくださり、大満足です。」"], "Erika Yamao"],
  [["“I’ve been going to her for 6 years for permanent eyeliner, facials and microblading. She is a true artist.”", "「アイライン、フェイシャル、マイクロブレーディングで6年通っています。本物のアーティストです。」"], "Esra H"],
  [["“Her craft is like artwork and she does it in the gentlest way possible.”", "「技術はまるで作品のよう。それでいて、とてもやさしく施術してくれます。」"], "Yee Cheng"],
  [["“Yoko is an artist. Her work is so careful and precise.”", "「Yoko さんはアーティストです。仕事がとても丁寧で、正確です。」"], "Elizabeth Hastings"],
];
const COURSES = ["Nano Eyebrow Course", "Eyebrow Microblading / Combination Course", "Eyebrow Microblading / Nanofeather Course", "Ombre / Powder Brow Course", "Lip Blush Tattoo Course", "Eyeliner Tattoo Course", "Hairline Microblading Course", "Hyaluron Pen Course", "Eyelash Extension Course", "Keratin Lash Lift Course", "Teeth Whitening Course", "Scalp Micropigmentation Course"];

let cur = 0, asked = "", view = null, said = null;
const money = (v) => typeof v === "number" ? "$" + v.toLocaleString("en-AU") : v;
const row = (r) => `<li><span>${t(r)}</span><b>${money(r[2])}</b><a href="#ask" data-ask="${r[0]}" aria-label="${t(["Ask about", "質問する"])}: ${t(r)}">${t(["Ask", "質問する"])}</a></li>`;
/* the four big words are the index; the photo and the prices follow the chosen word */
function panel(move) {
  const f = PARTS[cur];
  $("#index").innerHTML = PARTS.map((p, i) => `<button type="button" class="word" role="tab" aria-selected="${i === cur}" data-part="${i}">${t(p.w)}</button>`).join("");
  $("#p-cap").textContent = t(f.cap); $("#p-lead").textContent = t(f.lead);
  $("#p-groups").innerHTML = f.groups.map((g) => `<div class="grp"><h3>${t(g.n)}</h3><ul class="rows">${g.rows.map(row).join("")}</ul></div>`).join("");
  $("#touch").hidden = f.id !== "brows"; touch();
  $$("#view-list img").forEach((im, i) => { im.alt = t(PARTS[i].cap); });
  if (move && window.gsap && !reduce) gsap.from("#p-lead, #p-groups .grp, #touch:not([hidden])", { y: 20, opacity: 0, duration: .45, stagger: .07, ease: "power2.out", clearProps: "transform,opacity" });
}
function touch() {
  const m = +$("#months").value, b = TOUCH.find((x) => m < x[0]);
  $("#t-when").textContent = t([`${m} month${m === 1 ? "" : "s"} ago (${b[1][0]})`, `${m}か月前（${b[1][1]}）`]); $("#t-price").textContent = "$" + b[2];
  $("#months").style.setProperty("--p", ((m - 1) / 29 * 100) + "%");
}
function count() { if (said) { $("#q-count").textContent = `${said.activeIndex + 1} / ${QUOTES.length}`; } }
function rest() {
  $("#more").innerHTML = MORE.map(row).join("") + `<li><span>${t(["Plasma skin tightening, Hyaluron Pen", "プラズマ・スキンタイトニング、ヒアルロンペン"])}</span><b></b><a href="#ask" data-ask="Other treatments">${t(["Ask", "質問する"])}</a></li>`;
  $("#quotes").innerHTML = QUOTES.map((x) => `<blockquote class="swiper-slide"><p>${t(x[0])}</p><footer>${x[1]}</footer></blockquote>`).join("");
  $("#c-list").innerHTML = COURSES.map((c) => `<li>${c}</li>`).join("");
  const opts = [...PARTS.flatMap((f) => f.groups.flatMap((g) => g.rows.map((r) => [r[0], t(r)]))), ...MORE.map((r) => [r[0], t(r)]), ["Other treatments", t(["Other treatments", "そのほかのメニュー"])], ["Courses", t(["Courses", "技術コース"])]];
  $("#a-what").innerHTML = `<option value="">${t(["Please choose", "選んでください"])}</option>` + opts.map((o) => `<option value="${o[0]}"${o[0] === asked ? " selected" : ""}>${o[1]}</option>`).join("");
  $("#q-prev").setAttribute("aria-label", t(["Previous review", "前のレビュー"])); $("#q-next").setAttribute("aria-label", t(["Next review", "次のレビュー"]));
  if (said) { said.update(); count(); }
}
$("#view-list").innerHTML = PARTS.map((f) => `<div class="swiper-slide"><img src="img/${f.img}.jpg" width="1000" height="1000" alt="" style="object-position:${f.pos}"></div>`).join("");
document.addEventListener("click", (e) => {
  const p = e.target.closest("[data-part]"); if (p) { const i = +p.dataset.part; if (view) view.slideTo(i); else { cur = i; panel(true); } return; }
  const a = e.target.closest("[data-ask]"); if (a) { asked = a.dataset.ask; $("#a-what").value = asked; }
});
$("#months").addEventListener("input", touch);
$("#a-what").addEventListener("change", (e) => { asked = e.target.value; });
$("#ask").addEventListener("submit", (e) => {
  e.preventDefault();
  const what = $("#a-what").value, name = $("#a-name").value.trim(), msg = $("#a-msg").value.trim(), err = $("#ask-err");
  if (!msg) { err.textContent = t(["Please write your question.", "ご質問を入力してください。"]); err.hidden = false; $("#a-msg").focus(); return; } err.hidden = true;
  location.href = `mailto:yoko@yokototalbeauty.com.au?subject=${encodeURIComponent(t(["Question", "ご質問"]) + (what ? `: ${what}` : ""))}&body=${encodeURIComponent(msg + "\n\n" + name)}`;
});
onRender(() => { panel(false); rest(); });
applyLang();

/* Swiper: the photo fades to the chosen part (and can be swiped); the reviews are a strip you can drag */
if (window.Swiper) {
  view = new Swiper("#view", { effect: "fade", fadeEffect: { crossFade: true }, speed: reduce ? 0 : 700, on: { slideChange(s) { cur = s.activeIndex; panel(true); } } });
  said = new Swiper("#said", { slidesPerView: "auto", spaceBetween: 16, speed: reduce ? 0 : 500, grabCursor: true, breakpoints: { 900: { spaceBetween: 28 } }, navigation: { prevEl: "#q-prev", nextEl: "#q-next", disabledClass: "is-off" }, on: { slideChange: count } });
  count();
}
/* motion (GSAP). Photos open like a page being uncovered; nothing is hidden without it. */
if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  const open = (fig, delay = 0, trigger) => { const o = trigger ? { scrollTrigger: { trigger, start: "top 80%", once: true } } : {}; gsap.from(fig, { clipPath: "inset(100% 0 0 0)", duration: 1.1, delay, ease: "power3.inOut", clearProps: "clipPath", ...o }); gsap.from(fig.querySelector("img"), { scale: 1.25, duration: 1.6, delay, ease: "power2.out", clearProps: "transform", ...o }); };
  open($(".c-a .clip")); open($(".c-b .clip"), .25);
  gsap.from(".hero-copy > *", { y: 22, opacity: 0, duration: .6, stagger: .08, ease: "power2.out", clearProps: "transform,opacity" });
  gsap.to(".c-b", { yPercent: -16, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.from(".word", { yPercent: 60, opacity: 0, duration: .7, stagger: .08, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: "#index", start: "top 88%", once: true } });
  open($("#view"), 0, "#view"); open($(".about .clip"), 0, ".about figure");
  ScrollTrigger.batch(".h-small, .also, .about-copy > *, .said-head > *, #quotes blockquote, .courses > div > *, .c-list li, .visit > div > *, .form", { start: "top 92%", once: true, onEnter: (els) => gsap.from(els, { y: 24, opacity: 0, duration: .55, stagger: .05, ease: "power2.out", clearProps: "transform,opacity" }) });
}
