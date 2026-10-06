// Kaneko Japanese Academy — interaction. With "reduce motion" on, everything is simply shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* hero: a sheet of genkō yōshi (manuscript paper) that writes itself */
const LINE = "日本で話されている日本語を、学ぶ。";
const cells = $("#cells"); const N = 40;
cells.innerHTML = Array.from({ length: N }, (_, i) => `<i>${LINE[i] ? `<b style="--d:${400 + i * 110}ms">${LINE[i]}</b>` : ""}</i>`).join("");

/* courses (text from the Our Courses page) */
const COURSES = [
  { tab: "HSC & NSW high school", title: "HSC and NSW high school Japanese", body: "Our main speciality, for Years 7 to 12. We tutor all relevant aspects of Japanese, as well as study and exam technique, and prepare students for the HSC from the moment they begin lessons with us.", dur: "1 hour · 1½ hours · 2 hours", syl: "Beginners · Continuers · Extension · Japanese in Context" },
  { tab: "IB Japanese", title: "International Baccalaureate (IB) Japanese", body: "Our second speciality: the Diploma Programme and Middle Years Programme. We also teach students whose IB school does not offer Japanese, working closely with the school’s language department.", dur: "Please ask", syl: "DP Language Acquisition · MYP · PYP" },
  { tab: "Primary school", title: "Primary school Japanese", body: "For Years 1 to 6. A fun and engaging way to build a solid foundation, so students have a head start for Japanese in high school.", dur: "1 hour · 1½ hours", syl: "Kindergarten to Year 6" },
  { tab: "Other states", title: "VCE, QCE, WACE, SACE and TCE", body: "We also tutor high school students in other Australian states, Years 7 to 12, online.", dur: "Please ask", syl: "VIC · QLD · WA · SA · TAS" },
];
/* the nine features (shortened from the Complete Immersion Teaching System page) */
const NINE = [
  ["一", "Lessons designed and taught by Gloria Kaneko", "Gloria designs and runs all the lessons personally, and delivers the teaching portions herself."],
  ["二", "One-on-one time with a native Japanese-speaking assistant tutor", "Each student is allocated a native-speaking support tutor whenever possible, for part or all of each lesson. Only native-speaking tutors are used."],
  ["三", "A different assistant tutor each lesson", "Students meet a different tutor each lesson when possible, to hear a wider variety of Japanese accents and speech patterns."],
  ["四", "Recording and listening back", "Students are recorded speaking during lessons and listen back, to correct grammar and pronunciation and build confidence."],
  ["五", "Past exam papers and listening passages", "Past HSC, Trials and IB exam papers and listening audio are used in lessons to test students and prepare them for exams."],
  ["六", "Exam strategy", "How to study and prepare, and how to approach exams based on the school’s marking style, using the student’s own marked papers."],
  ["七", "Consultation with high school teachers", "Regular contact with high school Japanese teachers keeps lessons up to date with the curriculum."],
  ["八", "Japanese arts, culture and lifestyle", "Photos, multimedia and The Student Lounge (our private student website) bring in culture, current events, music, manga and anime."],
  ["九", "Study and learning resources", "Notes, books, learning articles, and vocabulary and kana trainers in The Student Lounge."],
];
/* results (headlines from the Student Feedback page; first names as published there) */
const R = [
  ["Qing", "98% in the HSC", "Top in NSW", "state"], ["Michelle", "98% in Beginners", "2nd in NSW", "state"], ["Karyn", "99% in Beginners", "2nd in NSW", "state"], ["Rachel", "99% in Beginners", "2nd in NSW", "state"], ["Faye", "98% (2U), 49/50 (3U)", "2nd in NSW", "state"], ["Isabella", "96% (2U), 49/50 (3U)", "3rd in NSW", "state"], ["Karina", "98% in Beginners", "4th in NSW", "state"], ["Jessica", "98% (2U), 49/50 (3U)", "5th in NSW", "state"], ["Crystal", "98% (2U), 47/50 (3U)", "6th in NSW", "state"],
  ["Oliver", "Band 7", "Japanese Ab Initio (IB)", "ib"], ["Hermaan", "High Band 6", "Japanese SL (IB)", "ib"], ["Jamie", "Grade 6", "IB Diploma", "ib"],
  ["Jackson", "70% → 94%", "in the HSC, in 8 months", "jump"], ["Joy", "63% → 98%", "in 9 months", "jump"], ["Joo Won", "50% → 96%", "in 6 lessons", "jump"], ["Sarah", "60% → 92%", "in 6 months", "jump"], ["Edward", "69% → 96%", "in the HSC Trials, after 6 months", "jump"], ["Jina", "75% → 94%", "in the HSC Trials, in 4 months", "jump"],
  ["Megan", "97%", "Continuers", "hsc"], ["Tina", "95%", "Continuers", "hsc"], ["Kevin", "96%", "Beginners", "hsc"], ["James", "95% (2U), 47/50 (3U)", "in the HSC", "hsc"],
];
const FILTERS = [["all", "All"], ["state", "Placed in NSW"], ["jump", "Big improvements"], ["ib", "IB"]];
let course = 0, open = 0, filter = "all";
function showCourse(a = true) { const c = COURSES[course]; $(".pick").innerHTML = COURSES.map((x, i) => `<button type="button" role="tab" aria-selected="${i === course}" data-i="${i}">${x.tab}</button>`).join(""); $("#c-title").textContent = c.title; $("#c-body").textContent = c.body; $("#c-dur").textContent = c.dur; $("#c-syl").textContent = c.syl; if (a && !reduce) { const el = $(".course"); el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); } }
function showNine() { $("#nine").innerHTML = NINE.map((n, i) => `<li class="${i === open ? "open" : ""}"><button type="button" aria-expanded="${i === open}" data-i="${i}"><i>${n[0]}</i><b>${n[1]}</b></button><p>${n[2]}</p></li>`).join(""); }
function showWall(a = true) { $(".filters").innerHTML = FILTERS.map(([k, l]) => `<button type="button" role="tab" aria-selected="${k === filter}" data-k="${k}">${l}</button>`).join(""); $("#wall").innerHTML = R.filter((r) => filter === "all" || r[3] === filter).map((r, i) => `<li class="t-${r[3]}" style="--d:${i * 30}ms"><b>${r[1]}</b><span>${r[2]}</span><em>${r[0]}</em></li>`).join(""); if (a && !reduce) { const l = $("#wall"); l.classList.remove("flow"); void l.offsetWidth; l.classList.add("flow"); } }
$(".pick").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { course = +b.dataset.i; showCourse(); } });
$("#nine").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { open = open === +b.dataset.i ? -1 : +b.dataset.i; showNine(); } });
$(".filters").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { filter = b.dataset.k; showWall(); } });
showCourse(false); showNine(); showWall(false);
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else { const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" }); $$(".sec-head, .pick, .course, .nine, .kyoshin > div, .k-art, .filters, .wall, .g-main, .history li, .contact").forEach((el) => { el.classList.add("rv"); io.observe(el); }); }
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
