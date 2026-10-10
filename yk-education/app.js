// YK Education — the parts that change: the topic order that follows the school, the subject finder, the enrolment message. Language helpers are in ds.js; dragging uses SortableJS, the pen marks use Rough Notation, motion uses GSAP.

/* the demonstration: five topics of Year 11 Mathematics Advanced, in three made-up school orders */
const TOPICS = [["Functions", "関数"], ["Trigonometric Functions", "三角関数"], ["Calculus", "微積分"], ["Exponential and Logarithmic Functions", "指数・対数関数"], ["Statistical Analysis", "統計"]];
const SCHOOLS = [[["School A", "A校"], [0, 1, 2, 3, 4]], [["School B", "B校"], [0, 2, 1, 4, 3]], [["School C", "C校"], [3, 0, 4, 1, 2]]];
let school = 0, order = SCHOOLS[0][1].slice(), timer, touched = false, sortable = null, notes = [];
function blocks(id, ord) { $(id).innerHTML = ord.map((k, i) => `<li data-t="${k}" class="c${k}"><i>${i + 1}</i><span>${t(TOPICS[k])}</span></li>`).join(""); }
function chips() { $(".schools").innerHTML = SCHOOLS.map((s, i) => `<button type="button" class="sch" role="radio" aria-checked="${i === school}" data-school="${i}">${t(s[0])}</button>`).join(""); }
/* move the cards to a new order, each one sliding from where it was */
function move(id, ord) {
  const row = $(id), before = new Map($$("li", row).map((el) => [el.dataset.t, el.getBoundingClientRect()]));
  ord.forEach((k, i) => { const el = $(`li[data-t="${k}"]`, row); row.appendChild(el); $("i", el).textContent = i + 1; });
  if (reduce || !window.gsap) return;
  $$("li", row).forEach((el) => { const p = before.get(el.dataset.t), q = el.getBoundingClientRect(), dx = p.left - q.left, dy = p.top - q.top; if (dx || dy) gsap.fromTo(el, { x: dx, y: dy }, { x: 0, y: 0, duration: .55, ease: "power3.out", clearProps: "transform" }); });
}
/* the left column can be dragged (SortableJS); the right column then follows */
function drag() {
  if (!window.Sortable) return; if (sortable) sortable.destroy();
  sortable = Sortable.create($("#r-school"), { animation: reduce ? 0 : 200, delay: 120, delayOnTouchOnly: true, ghostClass: "ghost", onEnd() {
    touched = true; order = $$("#r-school li").map((el) => +el.dataset.t); $$("#r-school li").forEach((el, i) => { $("i", el).textContent = i + 1; });
    school = SCHOOLS.findIndex((s) => s[1].join() === order.join()); chips(); move("#r-yk", order);
  } });
}
function seq(first) {
  chips();
  if (first) { blocks("#r-school", order); blocks("#r-yk", order); drag(); return; }
  move("#r-school", order); clearTimeout(timer); timer = setTimeout(() => move("#r-yk", order), reduce ? 0 : 380);
}

/* subjects (course names from the enrolment form and the year pages) */
const YEARS = [["Years 7–10", "7〜10年生"], ["Years 11–12 (HSC)", "11〜12年生（HSC）"]], SUBS = [["Maths", "数学"], ["English", "英語"], ["Japanese", "日本語"]];
const JUNIOR = ["Most of the content in the junior years is a prerequisite for the senior years. The individualised lesson plan targets the student’s knowledge gaps and builds a strong foundation for Years 11 and 12.", "7〜10年生で習う内容は、11・12年生の土台になります。分からないところを一つずつ埋めて、しっかりした基礎を作ります。"];
const SENIOR = ["Receive a customised learning program and get trained on exam-style questions for the HSC. Work through the YK material with your tutor and gain a strong understanding of the NSW syllabus.", "一人ひとりのプログラムで、HSC の試験形式の問題に取り組みます。YK の教材を講師と進めながら、NSW 州のシラバスを理解します。"];
const FIND = [
  [{ b: JUNIOR, c: [["Year 7–9 Maths, 1 hour per week", "7〜9年生の数学（週1時間）"], ["Year 10 Mathematics, 2 hours per week", "10年生の数学（週2時間）"]], o: "Year 7-10 Maths" }, { b: JUNIOR, c: [["Year 7–10 English", "7〜10年生の英語"]], o: "Year 7-10 English" }, { b: JUNIOR, c: [["Year 7–10 Japanese", "7〜10年生の日本語"]], o: "Year 7-10 Japanese" }],
  [{ b: SENIOR, c: [["Standard Mathematics", "Standard Mathematics"], ["Advanced Mathematics", "Advanced Mathematics"], ["Extension Mathematics", "Extension Mathematics"]], o: "Year 11-12 Advance Mathematics" }, { b: SENIOR, c: [["Standard English", "Standard English"], ["Advanced English", "Advanced English"]], o: "Year 11-12 Advance English" }, { b: SENIOR, c: [["Beginners Japanese", "Japanese Beginners"], ["Continuers Japanese", "Japanese Continuers"], ["Extension Japanese", "Japanese Extension"]], o: "Year 11-12 Continuers Japanese" }],
];
const OPTIONS = ["Year 7-10 Maths", "Year 7-10 English", "Year 7-10 Japanese", "Year 11-12 Standard Mathematics", "Year 11-12 Advance Mathematics", "Year 11-12 Extension Mathematics", "Year 11-12 Standard English", "Year 11-12 Advance English", "Year 11-12 Beginner Japanese", "Year 11-12 Continuers Japanese", "Year 11-12 Extension Japanese"];
const KINDS = [["I’d like to book a consultation and trial lesson", "無料相談と体験レッスンを予約したい"], ["I’d like to chat about my child or myself", "子ども（自分）のことを相談したい"], ["I’d like to know more about the program, including pricing", "プログラムと料金について知りたい"]];
let fy = 1, fs = 0, sub = "", kind = 0;
const titleOf = (y, x) => lang === "ja" ? `${YEARS[y][1]}の${SUBS[x][1]}` : `${SUBS[x][0]}, ${YEARS[y][0]}`;
/* year by subject, as a small timetable. The number is how many courses are listed for that square. */
function finder() {
  $("#matrix").innerHTML = "<span></span>" + SUBS.map((x) => `<span class="mh">${t(x)}</span>`).join("") + YEARS.map((y, yi) => `<span class="mr">${t(y)}</span>` + SUBS.map((x, si) => { const f = FIND[yi][si]; return `<button type="button" class="mc" aria-pressed="${yi === fy && si === fs}" data-y="${yi}" data-s="${si}" aria-label="${titleOf(yi, si)}"><b>${f.c.length}</b><span>${f.c.length === 1 ? t(["course", "コース"]) : t(["courses", "コース"])}</span><ul>${f.c.map((k) => `<li>${t(k)}</li>`).join("")}</ul></button>`; }).join("")).join("");
  const f = FIND[fy][fs];
  $("#f-title").textContent = titleOf(fy, fs); $("#f-body").textContent = t(f.b); $("#f-courses").innerHTML = f.c.map((k) => `<li>${t(k)}</li>`).join("");
}
function form() {
  $("#a-kind").innerHTML = KINDS.map((k, i) => `<option value="${i}"${i === kind ? " selected" : ""}>${t(k)}</option>`).join("");
  $("#a-sub").innerHTML = `<option value="">${t(["Please choose", "選んでください"])}</option>` + OPTIONS.map((o) => `<option${o === sub ? " selected" : ""}>${o}</option>`).join("");
}
/* voices (as published on the current site, without names) */
const QUOTES = [
  [["“Very rarely do you find a service as professional and yet so friendly as YK Tutoring.”", "「これほどプロフェッショナルで、しかも親しみやすい塾は、なかなかありません。」"], ["Parent (English)", "保護者（英語）"]],
  [["“I got a full mark for my prelim Advanced Maths exam! Hard work really pays off, thanks to my tutors.”", "「Advanced Maths の校内試験で満点を取りました。努力は報われると実感しています。講師の皆さんのおかげです。」"], ["Student (HSC English and Maths)", "生徒（HSC 英語・数学）"]],
  [["“Real care is shown for the welfare of all students. We receive follow up telephone calls on progress too.”", "「生徒一人ひとりのことを、本当に気にかけてくれます。進み具合を電話で知らせてくれるのも助かります。」"], ["Parent (Maths, English, Japanese)", "保護者（数学・英語・日本語）"]],
  [["“The marks were so poor we did not know what to do, but thanks to the tutors’ firm encouragement they went up visibly.”", "「どうにもならないほど成績が悪かったのですが、先生方の叱咤激励のお陰で目に見えて成績があがりました。」"], ["Parent (Year 12 Maths and English)", "保護者（12年生 数学・英語）"]],
];
const RESULTS = [["Year 10 Barker College", "5.3 Course Maths クラス1位・学年10位"], ["Year 10 Chatswood High School", "English 学年1位"], ["Year 11 Willoughby Girls High School", "Advanced Maths 学年1位（100点）"], ["Year 11 Sydney Grammar School", "Advanced Maths 学年1位"], ["Year 11 Chatswood High School", "EALD 学年1位"], ["Year 11 Sydney Grammar School", "Extension 1 Maths 学年3位"], ["Year 12 Turramurra High School", "Advanced Maths 学年1位"], ["Year 12 Willoughby Girls High School", "Standard Maths 学年1位"], ["Year 12 Turramurra High School", "Standard English 学年3位"]];
function rest() {
  $("#quotes").innerHTML = QUOTES.map((x) => `<blockquote><p>${t(x[0])}</p><footer>${t(x[1])}</footer></blockquote>`).join("");
  $("#results-list").innerHTML = RESULTS.map((r) => `<li><span>${r[0]}</span><b>${r[1]}</b></li>`).join("");
}
document.addEventListener("click", (e) => {
  const s = e.target.closest("[data-school]"); if (s) { touched = true; school = +s.dataset.school; order = SCHOOLS[school][1].slice(); seq(false); return; }
  const m = e.target.closest(".mc"); if (m) { fy = +m.dataset.y; fs = +m.dataset.s; finder(); if (window.gsap && !reduce) gsap.from(".f-out > *", { y: 12, opacity: 0, duration: .35, stagger: .05, ease: "power2.out", clearProps: "transform,opacity" }); return; }
  if (e.target.closest("#f-ask")) { sub = FIND[fy][fs].o; form(); }
});
$("#a-sub").addEventListener("change", (e) => { sub = e.target.value; }); $("#a-kind").addEventListener("change", (e) => { kind = +e.target.value; });
$("#ask").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#a-name").value.trim(), sc = $("#a-school").value.trim(), msg = $("#a-msg").value.trim(), err = $("#ask-err");
  if (!name && !msg) { err.textContent = t(["Please enter the student’s name or a message.", "生徒の名前か、メッセージを入力してください。"]); err.hidden = false; $("#a-name").focus(); return; } err.hidden = true;
  const body = [KINDS[kind][0], sub && "Year and subject: " + sub, name && "Student: " + name, sc && "School: " + sc, msg && "\n" + msg].filter(Boolean).join("\n");
  location.href = `mailto:hello@ykeducation.com.au?subject=${encodeURIComponent(t(["Enquiry", "お問い合わせ"]) + (sub ? ": " + sub : ""))}&body=${encodeURIComponent(body)}`;
});
/* pen marks (Rough Notation): a highlighter on the key words of the headline, an underline on “free consultation” */
function marks() {
  notes.forEach((n) => n.remove()); notes = [];
  if (!window.RoughNotation) return;
  document.documentElement.classList.add("rn");
  const hl = $("h1 .hl"), ul = $("#enrol .ul");
  if (hl) { const n = RoughNotation.annotate(hl, { type: "highlight", color: "#ffd84a", animate: !reduce, animationDuration: 700, multiline: true, iterations: 1 }); notes.push(n); n.show(); }
  if (ul) { const n = RoughNotation.annotate(ul, { type: "underline", color: "#cf1259", strokeWidth: 3, padding: 3, animate: !reduce, animationDuration: 600, iterations: 2 }); notes.push(n);
    if (!("IntersectionObserver" in window)) n.show(); else { const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setTimeout(() => n.show(), reduce ? 0 : 650); io.disconnect(); } }, { rootMargin: "0px 0px -15% 0px" }); io.observe(ul); } }
}
let ready = false;
onRender(() => { seq(true); finder(); form(); rest(); if (ready) setTimeout(marks, 60); });
applyLang();
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(() => { ready = true; marks(); }, reduce ? 0 : 1000));

/* motion (GSAP). Everything is visible without it. */
if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".hero-copy > *", { y: 22, opacity: 0, duration: .55, stagger: .07, ease: "power2.out", clearProps: "transform,opacity" });
  gsap.from(".seq", { y: 40, opacity: 0, rotate: 3, duration: .7, delay: .15, ease: "back.out(1.4)", clearProps: "transform,opacity" });
  gsap.from(".blocks li", { scale: .8, opacity: 0, duration: .4, stagger: .04, delay: .45, ease: "back.out(2)", clearProps: "transform,opacity" });
  /* show once that the rows can move: School B, then back to School A (stops as soon as the visitor chooses) */
  setTimeout(() => { if (!touched) { school = 1; order = SCHOOLS[1][1].slice(); seq(false); } }, 2400);
  setTimeout(() => { if (!touched) { school = 0; order = SCHOOLS[0][1].slice(); seq(false); } }, 5400);
  const pop = (sel, trigger, vars = {}) => gsap.from(sel, { y: 30, opacity: 0, scale: .94, duration: .5, stagger: .1, ease: "back.out(1.6)", clearProps: "transform,opacity", scrollTrigger: { trigger, start: "top 85%", once: true }, ...vars });
  pop(".steps li", ".steps"); pop(".mc", "#matrix", { stagger: .05 }); pop(".quotes blockquote", ".quotes"); pop(".fees > div", ".fees", { stagger: .07 }); pop(".qa details", ".qa", { stagger: .06 });
  gsap.from(".half", { scaleX: 0, duration: .7, stagger: .35, ease: "power3.out", clearProps: "transform", scrollTrigger: { trigger: ".bar", start: "top 82%", once: true } });
  gsap.from(".half > *", { opacity: 0, duration: .4, stagger: .08, delay: .35, clearProps: "opacity", scrollTrigger: { trigger: ".bar", start: "top 82%", once: true } });
  gsap.from(".yuna figure", { rotate: 6, y: 40, opacity: 0, duration: .7, ease: "back.out(1.4)", clearProps: "transform,opacity", scrollTrigger: { trigger: ".yuna", start: "top 80%", once: true } });
  ScrollTrigger.batch(".sec-head > *, .f-out, .y-copy > *, .res, .fees-h, .e-info > figure, .facts, .form, .twoh > .fine", { start: "top 92%", once: true, onEnter: (els) => gsap.from(els, { y: 22, opacity: 0, duration: .5, stagger: .05, ease: "power2.out", clearProps: "transform,opacity" }) });
}
