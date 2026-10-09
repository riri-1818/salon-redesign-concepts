// YK Education — the parts that change: the topic order that follows the school, the subject finder, the enrolment message. (Shared helpers are in ds.js.)

/* the demonstration: five topics of Year 11 Mathematics Advanced, in three made-up school orders */
const TOPICS = [["Functions", "関数"], ["Trigonometric Functions", "三角関数"], ["Calculus", "微積分"], ["Exponential and Logarithmic Functions", "指数・対数関数"], ["Statistical Analysis", "統計"]];
const SCHOOLS = [[["School A", "A校"], [0, 1, 2, 3, 4]], [["School B", "B校"], [0, 2, 1, 4, 3]], [["School C", "C校"], [3, 0, 4, 1, 2]]];
let school = 0, timer, touched = false;
function blocks(id, order) { $(id).innerHTML = order.map((k, i) => `<li data-t="${k}" class="c${k}"><i>${i + 1}</i><span>${t(TOPICS[k])}</span></li>`).join(""); }
function move(id, order) {
  const row = $(id), before = new Map($$("li", row).map((el) => [el.dataset.t, el.getBoundingClientRect()]));
  order.forEach((k, i) => { const el = $(`li[data-t="${k}"]`, row); row.appendChild(el); $("i", el).textContent = i + 1; });
  if (reduce) return;
  $$("li", row).forEach((el) => { const a = before.get(el.dataset.t), b = el.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top; if (!dx && !dy) return; el.style.transition = "none"; el.style.transform = `translate(${dx}px, ${dy}px)`; requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transition = ""; el.style.transform = ""; })); });
}
function seq(first) {
  $(".schools").innerHTML = SCHOOLS.map((s, i) => `<button type="button" class="chip" role="radio" aria-checked="${i === school}" data-school="${i}">${t(s[0])}</button>`).join("");
  const order = SCHOOLS[school][1];
  if (first) { blocks("#r-school", order); blocks("#r-yk", order); return; }
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
function finder() {
  $("#f-year").innerHTML = YEARS.map((y, i) => `<button type="button" class="chip" role="radio" aria-checked="${i === fy}" data-y="${i}">${t(y)}</button>`).join("");
  $("#f-sub").innerHTML = SUBS.map((s, i) => `<button type="button" class="chip" role="radio" aria-checked="${i === fs}" data-s="${i}">${t(s)}</button>`).join("");
  const f = FIND[fy][fs];
  $("#f-title").textContent = lang === "ja" ? `${YEARS[fy][1]}の${SUBS[fs][1]}` : `${SUBS[fs][0]}, ${YEARS[fy][0]}`;
  $("#f-body").textContent = t(f.b); $("#f-courses").innerHTML = f.c.map((c) => `<li>${t(c)}</li>`).join("");
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
  $("#quotes").innerHTML = QUOTES.map((x) => `<blockquote class="card"><p>${t(x[0])}</p><footer class="note">${t(x[1])}</footer></blockquote>`).join("");
  $("#results-list").innerHTML = RESULTS.map((r) => `<li><span>${r[0]}</span><b>${r[1]}</b></li>`).join("");
}
document.addEventListener("click", (e) => {
  const s = e.target.closest("[data-school]"); if (s) { touched = true; school = +s.dataset.school; seq(false); return; }
  const y = e.target.closest("[data-y]"); if (y) { fy = +y.dataset.y; finder(); return; }
  const b = e.target.closest("[data-s]"); if (b) { fs = +b.dataset.s; finder(); return; }
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
onRender(() => { seq(true); finder(); form(); rest(); });
start(".head, .steps > li, .hours > *, .finder > *, .yuna > *, .quotes > *, .results, .fees > *, .qa, .enrol > *");
/* show once that the rows can move: School B, then back to School A (stops as soon as the visitor chooses) */
if (!reduce) { setTimeout(() => { if (!touched) { school = 1; seq(false); } }, 2200); setTimeout(() => { if (!touched) { school = 0; seq(false); } }, 5200); }
