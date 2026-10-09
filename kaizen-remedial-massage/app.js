// Kaizen Remedial Massage Therapy — interaction. With "reduce motion" on, everything is simply shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (p) => p[lang === "en" ? 0 : 1];

/* pricing, as on the current home page: 60 min $170, 90 min $240, $20 surcharges, weekend surcharge applies */
const OPT = {
  len: [[["60 minutes", "60分"], 170], [["90 minutes", "90分"], 240]],
  first: [[["No", "いいえ"], 0], [["Yes, my first visit", "はい、はじめて"], 20]],
  time: [[["9am to 5:30pm", "9:00〜17:30"], 0], [["Before hours (9am)", "9:00 より前"], 20], [["After hours (5:30pm~)", "17:30 以降"], 20]],
  day: [[["Weekday", "平日"], 0], [["Weekend", "週末"], 0]],
};
const pick = { len: 0, first: 0, time: 0, day: 0 };
let asked = false;
function calc(bump) {
  for (const k of Object.keys(OPT)) $("#o-" + k).innerHTML = OPT[k].map((o, i) => `<button type="button" role="radio" aria-checked="${i === pick[k]}" data-k="${k}" data-i="${i}">${t(o[0])}</button>`).join("");
  const lines = [[t(["Remedial massage, ", "リメディアル・マッサージ "]) + t(OPT.len[pick.len][0]), OPT.len[pick.len][1]]];
  if (pick.first) lines.push([t(["First visit", "はじめてのご来店"]), 20]);
  if (pick.time) lines.push([t(OPT.time[pick.time][0]), 20]);
  const total = lines.reduce((a, l) => a + l[1], 0);
  $("#b-lines").innerHTML = lines.map((l, i) => `<li><span>${l[0]}</span><b>${i ? "+ " : ""}$${l[1]}</b></li>`).join("") + (pick.day ? `<li class="plus"><span>${t(["Weekend surcharge", "週末の追加料金"])}</span><b>${t(["applies", "あり"])}</b></li>` : "");
  const el = $("#b-total"); el.textContent = "$" + total + (pick.day ? " +" : "");
  if (bump && !reduce) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
  $("#b-note").textContent = pick.day ? t(["A weekend surcharge applies on top of this. Please ask for the amount.", "週末は、これに追加料金がかかります。金額はおたずねください。"]) : t(["Cupping therapy can be paired with your massage. Please ask when you book.", "カッピングを組み合わせられます。ご予約のときにおたずねください。"]);
  chosenLine();
}
function summary() { return `${t(OPT.len[pick.len][0])}${pick.first ? t([", first visit", "、はじめて"]) : ""}${pick.time ? ", " + t(OPT.time[pick.time][0]) : ""}${pick.day ? t([", weekend", "、週末"]) : ""} · ${$("#b-total").textContent}`; }
function chosenLine() { $("#chosen").textContent = asked ? t(["About: ", "ご用件："]) + summary() : ""; }
function today() {
  const d = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short" }).format(new Date());
  const where = d === "Mon" || d === "Fri" ? "Bondi Junction" : d === "Tue" || d === "Thu" ? "Potts Point" : "";
  $("#today").textContent = where ? t([`Today, Shizuka is in ${where}.`, `今日、Shizuka は ${where} にいます。`]) : t(["Shizuka is in Bondi Junction on Mondays and Fridays, and in Potts Point on Tuesdays and Thursdays.", "Shizuka は、月・金は Bondi Junction、火・木は Potts Point にいます。"]);
}
/* "one massage at a time": twelve marks, filled one by one */
function tally() { $("#tally").innerHTML = Array.from({ length: 12 }, (_, i) => `<i style="--i:${i}"></i>`).join(""); }
document.addEventListener("click", (e) => {
  const b = e.target.closest(".seg button"); if (b) { pick[b.dataset.k] = +b.dataset.i; calc(true); return; }
  if (e.target.closest("#b-ask")) { asked = true; chosenLine(); }
});
$("#ask").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#a-name").value.trim(), msg = $("#a-msg").value.trim(), err = $("#ask-err");
  if (!msg) { err.textContent = t(["Please write your message first.", "メッセージをご記入ください。"]); err.hidden = false; $("#a-msg").focus(); return; } err.hidden = true;
  const about = $("#chosen").textContent;
  location.href = `mailto:hello@kaizenrmt.com.au?subject=${encodeURIComponent(t(["Enquiry", "お問い合わせ"]))}&body=${encodeURIComponent((about ? about + "\n\n" : "") + msg + "\n\n" + (name || t(["(your name)", "（お名前）"])))}`;
});
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-en]").forEach((el) => { el.alt = lang === "en" ? el.dataset.altEn : el.dataset.altJa; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  calc(false); today();
}
$(".lang").addEventListener("click", () => { lang = lang === "en" ? "ja" : "en"; applyLang(); });
tally(); applyLang();
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
  $$(".why-grid > div, .values li, .sec-head, .care-grid figure, .kinds li, .calc, .members li, .rooms > *, .know > div, .r-copy, .ask").forEach((el) => { el.classList.add("rv"); io.observe(el); });
}
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
