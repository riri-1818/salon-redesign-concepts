// Nihongo-Juku：文を作ると授業プランが組まれる／画面の切り替え／今日のことば／申込みフォーム。文言と料金は今のサイトの原文。
lang = "en";
const YUKO = ["Ms. Yuko Martens", "“She teaches group lessons, JLPT, HSC preparation and adult private lessons.”"];
const C = {
  hsc: { say: "prepare for the HSC", name: "HSC preparation support course", sub: "Beginner and Continuers only", form: "Hsc",
    text: ["Our HSC examination preparation course provides past exam papers for practice. These papers also show the marking guidelines. All our Nihongo-Juku teachers are native speakers of Japanese and experienced in the HSC teaching program. Therefore our Nihongo-Juku teachers are ready to discover each student’s weaknesses, so they can guide each on how best to prepare for the exam."],
    skills: ["Improving speaking skills", "Writing skill", "Reading skill", "Preparation for you need"],
    where: [["Online", 80, "Private online lesson"], ["In person", 100, "Private face to face lesson"]], wnote: "In-person lessons are held at a location designated by the teacher.", len: "1 hour",
    teacher: YUKO, review: ["Haley Chacos, November 2021", "I have had a great experience with lovely people who are excellent at teaching all aspects of HSC Japanese, would definitely recommend this company."] },
  jlpt: { say: "pass the JLPT", name: "JLPT Preparation Course", sub: "in the home-office", form: "JLPT",
    text: ["The curriculum focuses on grammar for each level. First, we will identify the weak points and pursue them thoroughly. After that, sample questions and listening practice will be given. Finally, students will try their hand at past questions."],
    skills: ["Listening skill", "Reading skill"],
    where: [["Home office, Sydney Olympic Park", 100, "Private face to face lesson"]], mins: [60, 75, 90], mnote: "Students will need a minimum of six months to complete the course. Starting anytime at your convenience.",
    teacher: YUKO, review: ["Yan Liao, August 2021", "i have been learning Japanese with Nihongo-Juku Inoue-sensei for half year, She is professional teacher with passionate, specially the class preparation she did is helping me improve a lot in the grammar part, and she always very patient to listen to my choppy speaking during the class. highly recommend Nihongo-Juku to anyone who wish to learn Japanese here."] },
  talk: { say: "hold a conversation", name: "Adult Classes", sub: "in the home-office", form: "Adult",
    text: ["This course is a regular conversation class. Students will progress to new grammar, vocabulary and conversation examples with textbook references. Students will gradually learn kana characters and are introduced to kanji. They will be able to experience the joy of Japanese conversation without stress. They will be enabled to have a conversation with Japanese people."],
    where: [["Online", 0, "Private online lesson"], ["Private lesson in the office", 0, "Private face to face lesson"]], mins: [60, 75, 90],
    teacher: ["Kiyoka Inoue", "“Currently, she teaches beginner and intermediate learners at Nihongo-Juku.”"], review: ["Harry Price, November 2021", "I have been a student at Nihongo-Juku for a few months now and have been extremely pleased with the progress I have made utilising their private tutoring. Yuko Sensee is a fantastic and pleasant teacher who has made the process all the more enjoyable"] },
  busy: { say: "study around my work", name: "Flexible Online course for Busy Adults", sub: "", form: "Adult",
    text: ["Our online classes are designed for adults who need flexibility. Study anytime, anywhere, while maintaining a regular lesson schedule that works for you and your teacher.", "To support your learning, we share teacher materials so you can review anytime. Zoom sessions are also recorded and provided along with the materials, giving you full access for thorough review."],
    skills: ["Improving speaking skills", "Strengthening reading skills", "Personalized preparation as needed"],
    where: [["Online", 70, "Private online lesson"]], len: "Lesson times are arranged directly with your teacher", mnote: "New students begin with a 5-lesson package (first package only). For continuing students, 10-lesson or 20-lesson packages are available.",
    teacher: ["Kumi Tanaka", "“She is based in Melbourne and teaches Japanese online to students at Nihongo Juku.”"], review: ["Emily Tarran, August 2021", "I have found the teachers very accommodating and have styled my lessons to suit my needs. Plus they do online lessons which has been very helpful during lockdown."] },
  child: { say: "have my child learn", name: "Child Education Course", sub: "private lesson in the home-office", form: "Children",
    text: ["The course is open to ages 9 to 11. For children who do not have a Japanese background, we offer during each one-hour class, an introduction to Japanese culture and the written kana characters. We will teach students to express what they want to say using simple grammar. Games are also incorporated to guide students brightly through the content.", "We also teach Japanese as a mother tongue language."],
    where: [["Home office, Sydney Olympic Park", 100, "Private face to face lesson"]], len: "One-hour class", mnote: "Depending on the child’s level, we may ask the child to learn together with his or her parent.",
    teacher: ["Ms. Yuko Martens", "“She also focuses upon child education in the North Sydney area.”"], review: ["Sunhee Kim, May 2021", "My daughter has been learning Japanese for two years with Yuko-sensei. She enjoys learning Japanese thanks to the wonderful teacher. The teacher Yuko sensei is a great teacher with a warm heart. Also I like that she has a lot of teaching experience."] },
};
let goal = "hsc", wi = 0, mi = 0, shown = { v: 80 }, autoMsg = "";
const money = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
const chip = (k, i, on, label) => `<button type="button" data-${k}="${i}" aria-pressed="${on}">${label}</button>`;

function plan(moved) {
  const c = C[goal], w = c.where[wi], mins = c.mins ? c.mins[mi] : 60;
  $$("#goals button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.goal === goal));
  $("#p-name").textContent = c.name; $("#p-sub").textContent = c.sub; $("#p-sub").hidden = !c.sub;
  $("#p-text").innerHTML = c.text.map((x) => `<p>${x}</p>`).join("") + (c.skills ? `<ul class="skills">${c.skills.map((s) => `<li>${s}</li>`).join("")}</ul>` : "");
  $("#p-where").innerHTML = c.where.length > 1 ? c.where.map((x, i) => chip("wi", i, i === wi, x[0])).join("") : `<span class="fixed">${w[0]}</span>`;
  $("#p-wnote").textContent = c.wnote || ""; $("#p-wnote").hidden = !c.wnote;
  $("#p-mins").innerHTML = c.mins ? c.mins.map((m, i) => chip("mi", i, i === mi, `${m} minutes`)).join("") : `<span class="fixed">${c.len}</span>`;
  $("#p-mnote").textContent = c.mnote || ""; $("#p-mnote").hidden = !c.mnote;
  const fee = $("#p-fee"), rate = w[1];
  if (rate) {
    const to = rate * mins / 60;
    $("#p-per").textContent = c.mins && mins !== 60 ? `for ${mins} minutes, per person` : "for one hour, per person";
    $("#p-fnote").textContent = c.mins && mins !== 60 ? `Worked out from ${money(rate)} an hour. Please confirm the fee with the school.` : ""; $("#p-fnote").hidden = !(c.mins && mins !== 60);
    if (moved && window.gsap && !reduce) gsap.to(shown, { v: to, duration: 0.45, ease: "power2.out", overwrite: true, onUpdate: () => { fee.textContent = money(Math.round(shown.v)); }, onComplete: () => { fee.textContent = money(to); } });
    else { shown.v = to; fee.textContent = money(to); }
  } else {
    if (window.gsap) gsap.killTweensOf(shown);
    fee.textContent = "Ask"; $("#p-per").textContent = "Please ask the school for the fee."; $("#p-fnote").hidden = true;
  }
  $("#p-tn").textContent = c.teacher[0]; $("#p-tq").textContent = c.teacher[1];
  $("#p-rev").textContent = c.review[1]; $("#p-revn").textContent = c.review[0];
  const a = $("#p-apply"); a.dataset.apply = c.form; a.dataset.method = w[2];
  a.dataset.msg = `Lesson plan: ${c.name}, ${w[0]}${c.mins ? `, ${mins} minutes a class` : ""}.`;
}
function say(first) {
  const el = $("#goal-t"), b = $("#blank"), txt = C[goal].say;
  const draw = () => { b.classList.remove("on"); void b.offsetWidth; b.classList.add("on"); };
  if (first || reduce || !window.gsap) { el.textContent = txt; draw(); return; }
  gsap.timeline({ overwrite: true }).to(el, { yPercent: -45, opacity: 0, duration: 0.16, ease: "power2.in" })
    .add(() => { el.textContent = txt; draw(); }).fromTo(el, { yPercent: 45, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3, ease: "power3.out" });
  gsap.fromTo("#plan", { y: 10 }, { y: 0, duration: 0.4, ease: "power2.out", clearProps: "transform" });
}

// 今日のことば（見た画面の数だけ、花丸のうずまきが伸びる）
const seen = new Set();
function words() {
  const n = seen.size; $("#w-n").textContent = n;
  $(".hana .h1").style.strokeDashoffset = 1 - n / 5;
  $("#words").classList.toggle("done", n >= 5);
}

// 画面の切り替え
const VIEWS = ["home", "courses", "teachers", "jp", "apply", "terms"];
const TITLES = { home: "Private Japanese lessons in Sydney and online", courses: "Courses and pricing", teachers: "Our teachers", jp: "日本語", apply: "Contact and application", terms: "Privacy, terms and conditions" };
let pending = null;
function route(first) {
  const k = location.hash.replace(/^#\/?/, ""), id = VIEWS.includes(k) ? k : "home", v = $("#v-" + id);
  $$(".view").forEach((x) => { x.hidden = x !== v; });
  $$(".tabs a").forEach((a) => (a.dataset.view === id ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
  document.title = `Nihongo-Juku | ${TITLES[id]}`;
  if (v.dataset.w) { seen.add(v.dataset.w); words(); }
  if (id === "apply" && pending && "apply" in pending) {
    kind("apply"); $("#f-course").value = pending.apply || ""; if (pending.method) $("#f-method").value = pending.method;
    const m = $("#f-msg"); if (pending.msg && (!m.value || m.value === autoMsg)) { m.value = pending.msg; autoMsg = pending.msg; }
  }
  if (!first) {
    scrollTo(0, 0);
    if (window.gsap && !reduce) gsap.fromTo(v, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", clearProps: "all" });
  }
  if (id === "terms" && pending && pending.open) { const d = $("#" + pending.open); if (d) { d.open = true; requestAnimationFrame(() => d.scrollIntoView({ block: "start" })); } }
  pending = null;
}
addEventListener("hashchange", () => route(false));

function kind(k) {
  $$(".seg button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.kind === k));
  $("#f-app").hidden = k !== "apply"; $("#form").dataset.kind = k;
}
document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-goal]"); if (g) { if (g.dataset.goal !== goal) { goal = g.dataset.goal; wi = 0; mi = 0; plan(true); say(false); } return; }
  const w = e.target.closest("[data-wi]"); if (w) { wi = +w.dataset.wi; plan(true); return; }
  const m = e.target.closest("[data-mi]"); if (m) { mi = +m.dataset.mi; plan(true); return; }
  const s = e.target.closest("[data-kind]"); if (s) { kind(s.dataset.kind); return; }
  const a = e.target.closest("a[data-view]");
  if (a) {
    if ("apply" in a.dataset) pending = { apply: a.dataset.apply, method: a.dataset.method || "", msg: a.dataset.msg || "" };
    else if (a.dataset.open) pending = { open: a.dataset.open };
    if (a.getAttribute("href") === (location.hash || "#/")) { e.preventDefault(); route(false); }
  }
});
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim(), err = $("#f-err"), app = $("#form").dataset.kind === "apply";
  if (!v("#f-name") || !/^\S+@\S+\.\S+$/.test(v("#f-mail")) || !v("#f-tel")) { err.textContent = "Please enter your name, a valid email address and a contact number."; err.hidden = false; $("#f-done").hidden = true; return; }
  err.hidden = true; $("#f-done").hidden = false;
  const lines = [`Name: ${v("#f-name")}`, `Email: ${v("#f-mail")}`, `Contact Number: ${v("#f-tel")}`];
  if (app) lines.push(`Course: ${v("#f-course") || "-"}`, `Method: ${v("#f-method") || "-"}`, `How did you find us: ${v("#f-found") || "-"}`);
  lines.push("", "Comments:", v("#f-msg"));
  location.href = `mailto:info@nihongojuku.com.au?subject=${encodeURIComponent(app ? "Application for Japanese Course" : "Inquiry")}&body=${encodeURIComponent(lines.join("\n"))}`;
});

kind("apply"); plan(false); route(true); say(true);
start(".notes li, .rev, .course, .teacher, .gal figure");
