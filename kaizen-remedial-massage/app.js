// Kaizen Remedial Massage Therapy — the parts that change: the price builder and where Shizuka is today. Language helpers are in ds.js; motion uses GSAP (ScrollTrigger, SplitText).

/* pricing, as on the current home page: 60 min $170, 90 min $240, $20 surcharges, weekend surcharge applies */
const OPT = {
  len: [[["60 minutes", "60分"], 170], [["90 minutes", "90分"], 240]],
  first: [[["No", "いいえ"], 0], [["Yes, my first visit", "はい、はじめてです"], 20]],
  time: [[["9am to 5:30pm", "9:00〜17:30"], 0], [["Before hours (9am)", "9:00 より前"], 20], [["After hours (5:30pm~)", "17:30 以降"], 20]],
  day: [[["Weekday", "平日"], 0], [["Weekend", "週末"], 0]],
};
const pick = { len: 0, first: 0, time: 0, day: 0 };
let asked = false, shown = 170, topic = null;
function calc(bump) {
  for (const k of Object.keys(OPT)) $("#o-" + k).innerHTML = OPT[k].map((o, i) => `<button type="button" class="opt" role="radio" aria-checked="${i === pick[k]}" data-k="${k}" data-i="${i}">${t(o[0])}</button>`).join("");
  const lines = [[t(["Remedial massage, ", "リメディアル・マッサージ "]) + t(OPT.len[pick.len][0]), OPT.len[pick.len][1]]];
  if (pick.first) lines.push([t(["First visit", "初回の追加料金"]), 20]);
  if (pick.time) lines.push([t([OPT.time[pick.time][0][0], "時間外（" + OPT.time[pick.time][0][1] + "）"]), 20]);
  const total = lines.reduce((a, l) => a + l[1], 0);
  $("#b-lines").innerHTML = lines.map((l, i) => `<li><span>${l[0]}</span><b>${i ? "+ " : ""}$${l[1]}</b></li>`).join("") + (pick.day ? `<li><span>${t(["Weekend surcharge", "週末の追加料金"])}</span><b>${t(["applies", "あり"])}</b></li>` : "");
  /* the total counts up or down to the new amount */
  const el = $("#b-total"), tail = pick.day ? " +" : "", o = { v: shown };
  if (bump && window.gsap && !reduce) { gsap.killTweensOf(el); gsap.to(o, { v: total, duration: .55, ease: "power3.out", onUpdate: () => { el.textContent = "$" + Math.round(o.v) + tail; }, onComplete: () => { el.textContent = "$" + total + tail; } }); gsap.from("#b-lines li:last-child", { y: -10, opacity: 0, duration: .3, clearProps: "transform,opacity" }); }
  else el.textContent = "$" + total + tail;
  shown = total;
  $("#b-note").textContent = pick.day ? t(["A weekend surcharge is added to this total. Please ask us for the amount.", "週末は、この合計に追加料金がかかります。金額はお問い合わせください。"]) : t(["Cupping therapy can be paired with your massage. Please tell us when you book.", "カッピングは、マッサージと組み合わせて受けられます。ご予約のときにお伝えください。"]);
  chosenLine();
}
function summary() { return `${t(OPT.len[pick.len][0])}${pick.first ? t([", first visit", "、初回"]) : ""}${pick.time ? t([", ", "、"]) + t(OPT.time[pick.time][0]) : ""}${pick.day ? t([", weekend", "、週末"]) : ""}（$${shown}${pick.day ? " +" : ""}）`.replace("（", lang === "en" ? " (" : "（").replace("）", lang === "en" ? ")" : "）"); }
function chosenLine() { $("#chosen").textContent = asked ? t(["About: ", "ご用件："]) + summary() : topic ? t(["About: ", "ご用件："]) + t(topic) : ""; }
function today() {
  const d = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short" }).format(new Date());
  const where = d === "Mon" || d === "Fri" ? "Bondi Junction" : d === "Tue" || d === "Thu" ? "Potts Point" : "";
  const i = ["Mon", "Tue", "Wed", "Thu", "Fri"].indexOf(d); $$(".wk").forEach((w) => [...w.children].forEach((li, k) => li.classList.toggle("now", k === i)));
  $("#today").textContent = where ? t([`Today, Shizuka is in ${where}.`, `今日、Shizuka は ${where} にいます。`]) : t(["Shizuka is in Bondi Junction on Mondays and Fridays, and in Potts Point on Tuesdays and Thursdays.", "Shizuka は、月・金は Bondi Junction、火・木は Potts Point にいます。"]);
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-k]"); if (b) { pick[b.dataset.k] = +b.dataset.i; calc(true); return; }
  if (e.target.closest("#b-ask")) { asked = true; topic = null; chosenLine(); return; }
  const tp = e.target.closest("[data-topic-en]"); if (tp) { asked = false; topic = [tp.dataset.topicEn, tp.dataset.topicJa]; chosenLine(); }
});
$("#ask").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#a-name").value.trim(), msg = $("#a-msg").value.trim(), err = $("#ask-err");
  if (!msg) { err.textContent = t(["Please write your message.", "お問い合わせの内容を入力してください。"]); err.hidden = false; $("#a-msg").focus(); return; } err.hidden = true;
  const about = $("#chosen").textContent;
  location.href = `mailto:hello@kaizenrmt.com.au?subject=${encodeURIComponent(t(["Enquiry", "お問い合わせ"]))}&body=${encodeURIComponent((about ? about + "\n\n" : "") + msg + "\n\n" + name)}`;
});
$("#sub").addEventListener("submit", (e) => {
  e.preventDefault();
  const mail = $("#s-mail").value.trim(), err = $("#sub-err");
  if (!/^\S+@\S+\.\S+$/.test(mail)) { err.textContent = t(["Please enter your email address.", "メールアドレスを入力してください。"]); err.hidden = false; $("#s-mail").focus(); return; } err.hidden = true;
  location.href = `mailto:hello@kaizenrmt.com.au?subject=${encodeURIComponent(t(["Subscribe to promotions", "キャンペーンのお知らせを登録"]))}&body=${encodeURIComponent(t(["Please add this address to your promotions list: ", "このアドレスを、お知らせの送り先に登録してください："]) + mail)}`;
});
onRender(() => { calc(false); today(); });
applyLang();

/* motion (GSAP). Everything is visible without it. */
if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  /* the line at the top of the page fills as you read: one step at a time */
  gsap.to("#prog", { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: .3 } });
  const split = new SplitText("#h1", { type: "lines", linesClass: "ln" });
  const inner = split.lines.map((l) => { l.style.overflow = "hidden"; const d = document.createElement("div"); d.innerHTML = l.innerHTML; l.innerHTML = ""; l.appendChild(d); return d; });
  gsap.timeline({ defaults: { ease: "power4.out" } })
    .from(inner, { yPercent: 110, duration: .9, stagger: .1, onComplete: () => split.revert() })
    .from(".place, .lead, .today, .btns", { y: 18, opacity: 0, duration: .5, stagger: .08, clearProps: "transform,opacity" }, .35)
    .from(".hero-photo img", { scale: 1.18, duration: 1.6, ease: "power2.out", clearProps: "transform" }, 0);
  gsap.fromTo(".care-photo img", { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: "none", scrollTrigger: { trigger: ".care", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".values h3", { xPercent: -8, opacity: 0, duration: .7, stagger: .12, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".values", start: "top 82%", once: true } });
  gsap.from(".strip img", { scale: 1.15, opacity: 0, duration: .7, stagger: .08, ease: "power2.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".strip", start: "top 88%", once: true } });
  gsap.from(".wk li", { scale: .5, opacity: 0, duration: .35, stagger: .05, ease: "back.out(2)", clearProps: "transform,opacity", scrollTrigger: { trigger: ".rooms", start: "top 80%", once: true } });
  gsap.fromTo(".f-word", { xPercent: -4 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".foot", start: "top bottom", end: "bottom bottom", scrub: true } });
  ScrollTrigger.batch(".who-head > *, .values p, .care-body > .label, .care-body > h2, .kinds li, .cost-head > *, .opts > *, .bill, .team-head > *, .members li, .where-head > *, .rooms article, .know > div, .reach > *, .vision > *, .vals-h, .gift, .supp h2, .logos li, .terms-head > *, .acc details, .jobs-head > *, .jobs-cols > div", { start: "top 90%", once: true, onEnter: (els) => gsap.from(els, { y: 28, opacity: 0, duration: .55, stagger: .06, ease: "power2.out", clearProps: "transform,opacity" }) });
}
