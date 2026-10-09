// CREATE by ReNCOUNTER — interaction. With "reduce motion" on, everything is simply shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (p) => p[lang === "en" ? 0 : 1];

/* the shelf: six cubbies, one letter each, like the logo */
const CELLS = [["C", "salon", ["The salon", "サロン"]], ["R", "shelf", ["The shelf of small things", "小さなものを並べた棚"]], ["E", "flowers", ["Dried flowers", "ドライフラワー"]], ["A", "pour", ["At the basin", "シャンプー台"]], ["T", "balm", ["IMA, our own products", "自分たちのプロダクト IMA"]], ["E", "petals", ["Dried rose petals", "バラのドライフラワー"]]];
/* stylists (words from the Stylists page; request fees from the Menu & Price page) */
const PEOPLE = [
  { k: 3, n: "Hide", img: "hide", role: ["Director", "ディレクター"], say: ["“When your hair truly fits who you are, everyday life feels a little brighter.”", "「髪がその人に本当に合っていると、毎日が少し明るくなります。」"] },
  { k: 2, n: "Akane", img: "akane", role: ["Top Stylist", "トップスタイリスト"], say: ["“I cherish every encounter and always keep a heart full of gratitude.”", "「ひとつひとつの出会いを大切に、いつも感謝の気持ちを持っています。」"] },
  { k: 1, n: "Yuzuru", img: "yuzuru", role: ["Top Stylist", "トップスタイリスト"], say: ["“After more than 10 years of experience as a hairdresser in Tokyo, I moved to Australia.”", "「東京で10年以上、美容師として経験を積んでから、オーストラリアに来ました。」"] },
];
const RANKS = [[["No request", "指名なし"], 0], [["Yuzuru / other stylists", "Yuzuru／ほかのスタイリスト"], 10], [["Akane", "Akane"], 20], [["Hide", "Hide"], 30]];
/* menu (from the Menu & Price page). A number is a fixed price, [a,b,c,d] is no request / +$10 / +$20 / +$30, {f} is "from" */
const F = (n) => ({ f: n });
const MENU = [
  { n: ["Haircut", "カット"], rows: [["Lady’s Cut with wash", "レディースカット（シャンプーあり）", [80, 90, 100, 110]], ["Lady’s Cut no wash", "レディースカット（シャンプーなし）", [70, 80, 90, 100]], ["Men’s Cut", "メンズカット", 75], ["Men’s Cut no wash", "メンズカット（シャンプーなし）", 65], ["Girls 6–12", "女の子 6〜12歳", [50, 55, 60, 65]], ["Girls 13–18", "女の子 13〜18歳", [60, 65, 70, 75]], ["Boys 6–12", "男の子 6〜12歳", 50], ["Boys 13–18", "男の子 13〜18歳", 60], ["Under 5, boys & girls", "5歳以下", 40]] },
  { n: ["Colour", "カラー"], rows: [["Retouch Colour only", "リタッチカラーのみ", F(120)], ["Retouch Colour + Cut", "リタッチカラー＋カット", F(160)], ["Full Colour only", "フルカラーのみ", F(150)], ["Full Colour + Cut", "フルカラー＋カット", F(190)], ["Toner / Gloss", "トナー／グロス", F(70)], ["Design Colour", "デザインカラー", F(150)], ["Herbal Colour only", "ハーブカラーのみ", F(150)], ["Herbal Colour + Cut", "ハーブカラー＋カット", F(200)]] },
  { n: ["Foils, balayage & bleach", "ホイル・バレイヤージュ・ブリーチ"], rows: [["1/3 Foils + Cut", "ホイル 1/3＋カット", F(180)], ["1/2 Foils + Cut", "ホイル 1/2＋カット", F(210)], ["Full Foils + Cut", "フルホイル＋カット", F(240)], ["Balayage + Cut", "バレイヤージュ＋カット", F(240)], ["Full Bleach + Cut", "フルブリーチ＋カット", F(260)], ["Bleach Retouch + Cut", "ブリーチリタッチ＋カット", F(220)], ["Colour Correction", "カラー修正", { s: ["Consultation required", "要カウンセリング"] }]] },
  { n: ["Perm & straight", "パーマ・ストレート"], rows: [["Perm + Cut", "パーマ＋カット", F(180)], ["Digital Perm + Cut", "デジタルパーマ＋カット", F(260)], ["Japanese Straightening + Cut", "縮毛矯正＋カット", F(320)], ["Keratin / Smoothing Treatment only", "ケラチン／スムージングのみ", F(250)], ["Keratin / Smoothing Treatment + Cut", "ケラチン／スムージング＋カット", F(300)], ["Point Perm + Cut", "ポイントパーマ＋カット", F(150)], ["Fringe Straight", "前髪ストレート", F(130)], ["Top Straight", "トップストレート", F(250)]] },
  { n: ["Treatment & styling", "トリートメント・スタイリング"], rows: [["Shampoo & Blow Dry", "シャンプー＆ブロー", 65], ["Up Style", "アップスタイル", F(90)], ["Quick Treatment", "クイックトリートメント", F(35)], ["Premium Treatment", "プレミアムトリートメント", F(90)]] },
];
const GOODS = [
  ["IMA Hair Treatment Balm", ["smooth & shine", "smooth & shine"], "p-balm", ["from $15.00", "$15.00 から"]],
  ["IMA Herbal Retreat Reset Mist", ["Reset your hair and mind naturally.", "髪と心を、自然にリセット。"], "p-mist", ["$27.00", "$27.00"]],
  ["IMA Herbal Retreat Hinoki Bath Salt", ["The calm scent of Hinoki.", "ヒノキの落ち着いた香り。"], "p-hinoki", ["", ""]],
  ["IMA Herbal Retreat Floral Balance Bath Salt", ["Calendula, rose, lavender and peppermint.", "カレンデュラ、ローズ、ラベンダー、ペパーミント。"], "p-floral", ["", ""]],
  ["ISSOU shampoo, treatment & gel", ["Cleanse. Condition. Hydrate.", "洗う。整える。うるおす。"], "p-issou", ["$36.95 · $39.95 · $58.00", "$36.95 ・ $39.95 ・ $58.00"]],
];
const HOURS = [[["Mon – Tue", "月・火"], null], [["Wed – Fri", "水〜金"], [600, 1080, "10am – 6pm", "10:00 – 18:00"]], [["Sat – Sun", "土・日"], [600, 1020, "10am – 5pm", "10:00 – 17:00"]]];

let rank = 0, chosen = "", open = -1, timer;
function sydney() { const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value])); return { d: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday), m: (+p.hour % 24) * 60 + +p.minute }; }
const NOW = sydney(), hoursOf = (d) => d < 2 ? null : d < 5 ? HOURS[1][1] : HOURS[2][1];
function openNow() {
  const h = hoursOf(NOW.d), on = h && NOW.m >= h[0] && NOW.m < h[1]; $("#dot").classList.toggle("on", !!on);
  let txt;
  if (on) txt = t([`Open now, until ${h[2].split(" – ")[1]}.`, `ただいま営業中。${h[3].split(" – ")[1]} まで。`]);
  else if (h && NOW.m < h[0]) txt = t(["Opens today at 10am.", "本日 10:00 から営業します。"]);
  else { let i = 1; while (!hoursOf((NOW.d + i) % 7)) i++; const d = (NOW.d + i) % 7, name = [["Monday", "月曜"], ["Tuesday", "火曜"], ["Wednesday", "水曜"], ["Thursday", "木曜"], ["Friday", "金曜"], ["Saturday", "土曜"], ["Sunday", "日曜"]][d]; txt = i === 1 ? t(["Opens tomorrow at 10am.", "明日 10:00 から営業します。"]) : t([`Closed today. Opens ${name[0]} at 10am.`, `本日は定休日です。${name[1]} 10:00 から営業します。`]); }
  $("#open").textContent = txt;
  $("#hours").innerHTML = HOURS.map((r, i) => { const today = (i === 0 && NOW.d < 2) || (i === 1 && NOW.d >= 2 && NOW.d < 5) || (i === 2 && NOW.d >= 5); return `<tr class="${today ? "today" : ""}"><th>${t(r[0])}</th><td>${r[1] ? t([r[1][2], r[1][3]]) : t(["Closed", "定休日"])}</td></tr>`; }).join("");
}
function shelf() {
  $("#shelf").innerHTML = CELLS.map((c, i) => `<button type="button" class="cell${i === open ? " open" : ""}" data-i="${i}" style="--i:${i}" aria-pressed="${i === open}"><img src="img/${c[1]}.jpg" width="640" height="640" alt="${t(c[2])}"${i > 2 ? ' loading="lazy"' : ""}><b aria-hidden="true">${c[0]}</b><span>${t(c[2])}</span></button>`).join("");
}
function setOpen(i) { open = i; $$(".cell").forEach((el, k) => { el.classList.toggle("open", k === open); el.setAttribute("aria-pressed", k === open); }); }
function cycle() { if (reduce) return; let k = 0; timer = setInterval(() => { setOpen(k % 6); k++; }, 2600); }
function people() {
  $("#people").innerHTML = PEOPLE.map((p) => `<li class="${rank === p.k ? "on" : ""}"><img loading="lazy" src="img/${p.img}.jpg" width="600" height="600" alt="${p.n}"><div><h3>${p.n}</h3><p class="role">${t(p.role)} · ${t(["request fee", "指名料"])} +$${RANKS[p.k][1]}</p><p class="say">${t(p.say)}</p><button type="button" class="pick" data-rank="${p.k}" aria-pressed="${rank === p.k}">${rank === p.k ? t(["Chosen", "選択中"]) : t(["Choose " + p.n, p.n + " を選ぶ"])}</button></div></li>`).join("");
}
function price(v) { return typeof v === "number" ? `<b>$${v}</b>` : Array.isArray(v) ? `<b class="moves">$${v[rank]}</b>` : v.f ? `<b><i>${t(["from", ""])}</i> $${v.f}${t(["", " <i>から</i>"])}</b>` : `<b class="txt">${t(v.s)}</b>`; }
function menu(bump) {
  $("#p-title").textContent = rank ? t([`Prices with ${rank === 1 ? "Yuzuru or another stylist" : RANKS[rank][0][0]}.`, `${rank === 1 ? "Yuzuru／ほかのスタイリスト" : RANKS[rank][0][1]} の料金。`]) : t(["Prices without a stylist request.", "指名なしの料金。"]);
  $("#ranks").innerHTML = RANKS.map((r, i) => `<button type="button" role="radio" aria-checked="${i === rank}" data-rank="${i}">${t(r[0])}<i>${r[1] ? "+$" + r[1] : t(["base", "基本"])}</i></button>`).join("");
  $("#cols").innerHTML = MENU.map((g) => `<div class="grp"><h3>${t(g.n)}</h3><ul>${g.rows.map((r) => `<li><span>${t(r)}</span>${price(r[2])}<a href="#ask" data-ask="${r[0]}" aria-label="${t(["Ask about", "問い合わせ："])} ${t(r)}">${t(["Ask", "質問"])}</a></li>`).join("")}</ul></div>`).join("");
  if (bump && !reduce) $$(".moves").forEach((b) => { b.classList.add("bump"); });
}
function goods() { $("#goods").innerHTML = GOODS.map((g) => `<li><img loading="lazy" src="img/${g[2]}.jpg" width="560" height="560" alt=""><h3>${g[0]}</h3><p>${t(g[1])}</p><p class="cost">${t(g[3])}</p><a class="link" href="#ask" data-ask="${g[0]}">${t(["Ask about this →", "問い合わせる →"])}</a></li>`).join(""); }
function chosenLine() { const who = rank > 1 ? RANKS[rank][0][0] : rank === 1 ? "Yuzuru" : ""; $("#chosen").textContent = chosen || who ? t(["About: ", "ご用件："]) + [chosen, who && t(["with " + who, who + " さん希望"])].filter(Boolean).join(t([", ", "、"])) : ""; }
document.addEventListener("click", (e) => {
  const c = e.target.closest(".cell"); if (c) { clearInterval(timer); setOpen(open === +c.dataset.i ? -1 : +c.dataset.i); return; }
  const r = e.target.closest("[data-rank]"); if (r) { rank = +r.dataset.rank === rank && r.classList.contains("pick") ? 0 : +r.dataset.rank; people(); menu(true); chosenLine(); return; }
  const a = e.target.closest("[data-ask]"); if (a) { chosen = a.dataset.ask; chosenLine(); }
});
$("#ask").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#a-name").value.trim(), msg = $("#a-msg").value.trim(), err = $("#ask-err");
  if (!msg) { err.textContent = t(["Please write your message first.", "メッセージをご記入ください。"]); err.hidden = false; $("#a-msg").focus(); return; } err.hidden = true;
  const about = $("#chosen").textContent;
  location.href = `mailto:rencounter2012@gmail.com?subject=${encodeURIComponent(t(["Enquiry", "お問い合わせ"]) + (chosen ? ": " + chosen : ""))}&body=${encodeURIComponent((about ? about + "\n\n" : "") + msg + "\n\n" + (name || t(["(your name)", "（お名前）"])))}`;
});
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-en]").forEach((el) => { el.alt = lang === "en" ? el.dataset.altEn : el.dataset.altJa; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  openNow(); shelf(); people(); menu(false); goods(); chosenLine();
}
$(".lang").addEventListener("click", () => { lang = lang === "en" ? "ja" : "en"; applyLang(); });
applyLang();
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
  $$(".sec-head, .people, .cols, .row-wrap, .spa, .front, .v-info, .ask").forEach((el) => { el.classList.add("rv"); io.observe(el); });
  setTimeout(cycle, 1800);
}
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
