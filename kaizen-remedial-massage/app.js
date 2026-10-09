// Kaizen Remedial Massage Therapy — the parts that change: the price builder and where Shizuka is today. (Shared helpers are in ds.js.)

/* pricing, as on the current home page: 60 min $170, 90 min $240, $20 surcharges, weekend surcharge applies */
const OPT = {
  len: [[["60 minutes", "60分"], 170], [["90 minutes", "90分"], 240]],
  first: [[["No", "いいえ"], 0], [["Yes, my first visit", "はい、はじめてです"], 20]],
  time: [[["9am to 5:30pm", "9:00〜17:30"], 0], [["Before hours (9am)", "9:00 より前"], 20], [["After hours (5:30pm~)", "17:30 以降"], 20]],
  day: [[["Weekday", "平日"], 0], [["Weekend", "週末"], 0]],
};
const pick = { len: 0, first: 0, time: 0, day: 0 };
let asked = false;
function calc(bump) {
  for (const k of Object.keys(OPT)) $("#o-" + k).innerHTML = OPT[k].map((o, i) => `<button type="button" class="chip" role="radio" aria-checked="${i === pick[k]}" data-k="${k}" data-i="${i}">${t(o[0])}</button>`).join("");
  const lines = [[t(["Remedial massage, ", "リメディアル・マッサージ "]) + t(OPT.len[pick.len][0]), OPT.len[pick.len][1]]];
  if (pick.first) lines.push([t(["First visit", "初回の追加料金"]), 20]);
  if (pick.time) lines.push([t([OPT.time[pick.time][0][0], "時間外（" + OPT.time[pick.time][0][1] + "）"]), 20]);
  const total = lines.reduce((a, l) => a + l[1], 0);
  $("#b-lines").innerHTML = lines.map((l, i) => `<li><span>${l[0]}</span><b>${i ? "+ " : ""}$${l[1]}</b></li>`).join("") + (pick.day ? `<li><span>${t(["Weekend surcharge", "週末の追加料金"])}</span><b>${t(["applies", "あり"])}</b></li>` : "");
  const el = $("#b-total"); el.textContent = "$" + total + (pick.day ? " +" : "");
  if (bump && !reduce) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
  $("#b-note").textContent = pick.day ? t(["A weekend surcharge is added to this total. Please ask us for the amount.", "週末は、この合計に追加料金がかかります。金額はお問い合わせください。"]) : t(["Cupping therapy can be paired with your massage. Please tell us when you book.", "カッピングは、マッサージと組み合わせて受けられます。ご予約のときにお伝えください。"]);
  chosenLine();
}
function summary() { return `${t(OPT.len[pick.len][0])}${pick.first ? t([", first visit", "、初回"]) : ""}${pick.time ? t([", ", "、"]) + t(OPT.time[pick.time][0]) : ""}${pick.day ? t([", weekend", "、週末"]) : ""}（${$("#b-total").textContent}）`.replace("（", lang === "en" ? " (" : "（").replace("）", lang === "en" ? ")" : "）"); }
function chosenLine() { $("#chosen").textContent = asked ? t(["About: ", "ご用件："]) + summary() : ""; }
function today() {
  const d = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short" }).format(new Date());
  const where = d === "Mon" || d === "Fri" ? "Bondi Junction" : d === "Tue" || d === "Thu" ? "Potts Point" : "";
  $("#today").textContent = where ? t([`Today, Shizuka is in ${where}.`, `今日、Shizuka は ${where} にいます。`]) : t(["Shizuka is in Bondi Junction on Mondays and Fridays, and in Potts Point on Tuesdays and Thursdays.", "Shizuka は、月・金は Bondi Junction、火・木は Potts Point にいます。"]);
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-k]"); if (b) { pick[b.dataset.k] = +b.dataset.i; calc(true); return; }
  if (e.target.closest("#b-ask")) { asked = true; chosenLine(); }
});
$("#ask").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#a-name").value.trim(), msg = $("#a-msg").value.trim(), err = $("#ask-err");
  if (!msg) { err.textContent = t(["Please write your message.", "お問い合わせの内容を入力してください。"]); err.hidden = false; $("#a-msg").focus(); return; } err.hidden = true;
  const about = $("#chosen").textContent;
  location.href = `mailto:hello@kaizenrmt.com.au?subject=${encodeURIComponent(t(["Enquiry", "お問い合わせ"]))}&body=${encodeURIComponent((about ? about + "\n\n" : "") + msg + "\n\n" + name)}`;
});
onRender(() => { calc(false); today(); });
start(".head, .values > li, .care > *, .calc > *, .members > li, .rooms > *, .know > div, .reach > *");
