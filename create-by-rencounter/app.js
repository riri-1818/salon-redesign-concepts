// CREATE by ReNCOUNTER — the parts that change: the six squares, the stylist and the prices that follow. Language and Sydney-time helpers are in ds.js; motion uses GSAP (ScrollTrigger, Draggable, Inertia).

/* six squares, one letter each, in the same order as the logo */
const CELLS = [["C", "salon", ["The salon", "サロンの中"]], ["R", "shelf", ["The shelf of small things", "小物を並べた棚"]], ["E", "flowers", ["Dried flowers", "ドライフラワー"]], ["A", "pour", ["At the basin", "シャンプー台"]], ["T", "balm", ["IMA, our own products", "自分たちのプロダクト IMA"]], ["E", "petals", ["Dried rose petals", "バラの花びら"]]];
/* stylists (words from the Stylists page; request fees from the Menu & Price page) */
const PEOPLE = [
  { k: 3, n: "Hide", img: "hide", role: ["Director", "ディレクター"], say: ["“When your hair truly fits who you are, everyday life feels a little brighter.”", "「髪が本当にその人に合っていると、毎日が少し明るくなります。」"] },
  { k: 2, n: "Akane", img: "akane", role: ["Top Stylist", "トップスタイリスト"], say: ["“I cherish every encounter and always keep a heart full of gratitude.”", "「ひとつひとつの出会いを大切に、感謝の気持ちを忘れずにいます。」"] },
  { k: 1, n: "Yuzuru", img: "yuzuru", role: ["Top Stylist", "トップスタイリスト"], say: ["“After more than 10 years of experience as a hairdresser in Tokyo, I moved to Australia.”", "「東京で10年以上、美容師をしてきました。さらに成長したくて、オーストラリアに来ました。」"] },
];
const RANKS = [[["No request", "指名なし"], 0], [["Yuzuru or other stylists", "Yuzuru・ほかのスタイリスト"], 10], [["Akane", "Akane"], 20], [["Hide", "Hide"], 30]];
/* menu (from the Menu & Price page). A number is one price, [a,b,c,d] is no request / +$10 / +$20 / +$30, {f} is "from". */
const F = (n) => ({ f: n });
const MENU = [
  { n: ["Haircut", "カット"], rows: [["Lady’s Cut with wash", "レディースカット（シャンプーつき）", [80, 90, 100, 110]], ["Lady’s Cut no wash", "レディースカット（シャンプーなし）", [70, 80, 90, 100]], ["Men’s Cut", "メンズカット", 75], ["Men’s Cut no wash", "メンズカット（シャンプーなし）", 65], ["Girls 6–12", "女の子（6〜12歳）", [50, 55, 60, 65]], ["Girls 13–18", "女の子（13〜18歳）", [60, 65, 70, 75]], ["Boys 6–12", "男の子（6〜12歳）", 50], ["Boys 13–18", "男の子（13〜18歳）", 60], ["Under 5, boys & girls", "5歳以下", 40]] },
  { n: ["Colour", "カラー"], rows: [["Retouch Colour only", "リタッチカラー", F(120)], ["Retouch Colour + Cut", "リタッチカラー＋カット", F(160)], ["Full Colour only", "フルカラー", F(150)], ["Full Colour + Cut", "フルカラー＋カット", F(190)], ["Toner / Gloss", "トナー／グロス", F(70)], ["Design Colour", "デザインカラー", F(150)], ["Herbal Colour only", "ハーブカラー", F(150)], ["Herbal Colour + Cut", "ハーブカラー＋カット", F(200)]] },
  { n: ["Foils, balayage and bleach", "ホイル・バレイヤージュ・ブリーチ"], rows: [["1/3 Foils + Cut", "ホイル（1/3）＋カット", F(180)], ["1/2 Foils + Cut", "ホイル（1/2）＋カット", F(210)], ["Full Foils + Cut", "ホイル（全体）＋カット", F(240)], ["Balayage + Cut", "バレイヤージュ＋カット", F(240)], ["Full Bleach + Cut", "フルブリーチ＋カット", F(260)], ["Bleach Retouch + Cut", "ブリーチリタッチ＋カット", F(220)], ["Colour Correction", "カラーの修正", { s: ["Consultation required", "要カウンセリング"] }]] },
  { n: ["Perm and straight", "パーマ・ストレート"], rows: [["Perm + Cut", "パーマ＋カット", F(180)], ["Digital Perm + Cut", "デジタルパーマ＋カット", F(260)], ["Japanese Straightening + Cut", "縮毛矯正＋カット", F(320)], ["Keratin / Smoothing Treatment only", "ケラチントリートメント", F(250)], ["Keratin / Smoothing Treatment + Cut", "ケラチントリートメント＋カット", F(300)], ["Point Perm + Cut", "ポイントパーマ＋カット", F(150)], ["Fringe Straight", "前髪ストレート", F(130)], ["Top Straight", "トップストレート", F(250)]] },
  { n: ["Treatment and styling", "トリートメント・スタイリング"], rows: [["Shampoo & Blow Dry", "シャンプー＆ブロー", 65], ["Up Style", "アップスタイル", F(90)], ["Quick Treatment", "クイックトリートメント", F(35)], ["Premium Treatment", "プレミアムトリートメント", F(90)]] },
];
const GOODS = [
  ["IMA Hair Treatment Balm", ["A treatment balm with plant-derived ingredients, gentle on both hair and scalp.", "髪にも頭皮にもやさしい、植物由来のトリートメントバームです。"], "p-balm", ["From $15.00", "$15.00〜"]],
  ["IMA Herbal Retreat Reset Mist", ["Reset your hair and mind naturally.", "朝の髪と気持ちを、自然にリセットするミストです。"], "p-mist", ["$27.00", "$27.00"]],
  ["IMA Herbal Retreat Hinoki Bath Salt", ["A bath salt with the calm scent of Hinoki.", "ヒノキの落ち着いた香りのバスソルトです。"], "p-hinoki", ["", ""]],
  ["IMA Herbal Retreat Floral Balance Bath Salt", ["A bath salt with calendula, rose, lavender and peppermint.", "カレンデュラ、ローズ、ラベンダー、ペパーミントのバスソルトです。"], "p-floral", ["", ""]],
  ["ISSOU shampoo, treatment and gel", ["Cleanse, condition and hydrate.", "洗う・整える・うるおすの3ステップ。"], "p-issou", ["$36.95, $39.95, $58.00", "$36.95・$39.95・$58.00"]],
];
const HOURS = [[["Monday and Tuesday", "月・火"], null], [["Wednesday to Friday", "水〜金"], [600, 1080, "10am to 6pm", "10:00〜18:00"]], [["Saturday and Sunday", "土・日"], [600, 1020, "10am to 5pm", "10:00〜17:00"]]];
const DAY_L = [["Monday", "月曜"], ["Tuesday", "火曜"], ["Wednesday", "水曜"], ["Thursday", "木曜"], ["Friday", "金曜"], ["Saturday", "土曜"], ["Sunday", "日曜"]];

let rank = 0, prev = 0, chosen = "", open = 0, timer, drag = null;
const NOW = sydney(), hoursOf = (d) => d < 2 ? null : d < 5 ? HOURS[1][1] : HOURS[2][1];
function openNow() {
  const h = hoursOf(NOW.d), on = h && NOW.m >= h[0] && NOW.m < h[1]; $("#dot").classList.toggle("on", !!on);
  let txt;
  if (on) txt = t([`Open now, until ${h[2].split(" to ")[1]}`, `ただいま営業中です（${h[3].split("〜")[1]} まで）`]);
  else if (h && NOW.m < h[0]) txt = t(["Opens today at 10am", "本日は 10:00 から営業します"]);
  else { let i = 1; while (!hoursOf((NOW.d + i) % 7)) i++; const nm = DAY_L[(NOW.d + i) % 7]; txt = h ? (i === 1 ? t(["Closed for today. Opens tomorrow at 10am", "本日の営業は終了しました。明日は 10:00 からです"]) : t([`Closed for today. Opens ${nm[0]} at 10am`, `本日の営業は終了しました。次は${nm[1]} 10:00 からです`])) : t([`Closed today. Opens ${nm[0]} at 10am`, `本日は定休日です。次は${nm[1]} 10:00 からです`]); }
  $("#open").textContent = txt;
  $("#hours").innerHTML = HOURS.map((r) => `${t(r[0])}${t(["：", "　"])}${r[1] ? t([r[1][2], r[1][3]]) : t(["closed", "定休日"])}`).join("<br>").replace(/：/g, ": ");
}
/* six letters, each a window onto one photo. The chosen letter opens its photo on the stage. */
function shelf() {
  $("#shelf").innerHTML = CELLS.map((c, i) => `<button type="button" class="ltr" data-cell="${i}" aria-pressed="${i === open}" aria-label="${c[0]}: ${t(c[2])}" style="background-image:url(img/${c[1]}.jpg)">${c[0]}</button>`).join("");
  $("#st-l").textContent = CELLS[open][0]; $("#st-cap").textContent = t(CELLS[open][2]);
}
function show(i, wipe) {
  const a = $("#st-a"), b = $("#st-b"), src = `url(img/${CELLS[i][1]}.jpg)`, el = $$(".ltr")[i];
  open = i; $$(".ltr").forEach((l, k) => l.setAttribute("aria-pressed", k === i));
  $("#st-l").textContent = CELLS[i][0]; $("#st-cap").textContent = t(CELLS[i][2]);
  if (!wipe || !window.gsap || reduce) { a.style.backgroundImage = src; b.style.backgroundImage = "none"; return; }
  const r = $("#stage").getBoundingClientRect(), lr = el.getBoundingClientRect(), x = Math.max(0, Math.min(100, (lr.left + lr.width / 2 - r.left) / r.width * 100));
  gsap.killTweensOf(b); if (b.style.backgroundImage && b.style.backgroundImage !== "none") a.style.backgroundImage = b.style.backgroundImage;
  b.style.backgroundImage = src;
  gsap.fromTo(b, { clipPath: `circle(0% at ${x}% 0%)` }, { clipPath: `circle(150% at ${x}% 0%)`, duration: 1.05, ease: "power3.inOut" });
}
function people() {
  $("#people").innerHTML = PEOPLE.map((p) => `<li class="${rank === p.k ? "on" : ""}"><figure><img loading="lazy" src="img/${p.img}.jpg" width="600" height="600" alt=""></figure><div><h3>${p.n}</h3><p class="role">${t(p.role)}${t([", request fee +$", "・指名料 +$"])}${RANKS[p.k][1]}</p><p class="say">${t(p.say)}</p><button type="button" class="pick" data-rank="${p.k}" aria-pressed="${rank === p.k}">${rank === p.k ? t([p.n + " is chosen", p.n + " を選択中"]) : t(["Choose " + p.n, p.n + " を選ぶ"])}</button></div></li>`).join("");
}
function price(v) { return typeof v === "number" ? `<b>$${v}</b>` : Array.isArray(v) ? `<b class="moves" data-from="${v[prev]}" data-to="${v[rank]}">$${v[rank]}</b>` : v.f ? `<b>${t(["from $" + v.f, "$" + v.f + "〜"])}</b>` : `<b class="txt">${t(v.s)}</b>`; }
function menu(bump) {
  $("#p-title").textContent = rank ? t([`Prices with ${rank === 1 ? "Yuzuru or another stylist" : RANKS[rank][0][0]}`, `${rank === 1 ? "Yuzuru・ほかのスタイリスト" : RANKS[rank][0][1]} を指名したときの料金`]) : t(["Prices without a stylist request", "指名なしの料金"]);
  $("#ranks").innerHTML = RANKS.map((r, i) => `<button type="button" class="rank" role="radio" aria-checked="${i === rank}" data-rank="${i}">${t(r[0])}${r[1] ? "（+$" + r[1] + "）" : ""}</button>`).join("");
  $("#cols").innerHTML = MENU.map((g) => `<div class="grp"><h3>${t(g.n)}</h3><ul class="rows">${g.rows.map((r) => `<li><span>${t(r)}</span>${price(r[2])}<a href="#ask" data-ask="${r[0]}" aria-label="${t(["Ask about", "問い合わせる"])}: ${t(r)}">${t(["Ask", "質問"])}</a></li>`).join("")}</ul></div>`).join("");
  /* the prices that depend on the stylist count up or down to the new amount */
  if (bump && window.gsap && !reduce) $$(".moves").forEach((el) => { const o = { v: +el.dataset.from }; gsap.to(o, { v: +el.dataset.to, duration: .5, ease: "power2.out", onUpdate: () => { el.textContent = "$" + Math.round(o.v); } }); });
}
function goods() {
  $("#goods").innerHTML = GOODS.map((g) => `<li><img loading="lazy" src="img/${g[2]}.jpg" width="560" height="560" alt="" draggable="false"><h3>${g[0]}</h3><p>${t(g[1])}</p>${t(g[3]) ? `<p class="pr">${t(g[3])}</p>` : ""}<a href="#ask" data-ask="${g[0]}">${t(["Ask about this", "問い合わせる"])}</a></li>`).join("");
  $("#g-prev").setAttribute("aria-label", t(["Previous products", "前のプロダクト"])); $("#g-next").setAttribute("aria-label", t(["Next products", "次のプロダクト"]));
  strip();
}
/* the product shelf: drag it sideways (GSAP Draggable with inertia), or use the arrows */
const minX = () => Math.min(0, $("#g-view").clientWidth - $("#goods").scrollWidth);
function strip() {
  if (!window.Draggable) return;
  $("#g-view").classList.add("drag"); $("#g-view").scrollLeft = 0;
  if (drag) drag.kill(); gsap.set("#goods", { x: 0 });
  drag = Draggable.create("#goods", { type: "x", inertia: true, bounds: { minX: minX(), maxX: 0 }, edgeResistance: .85, dragClickables: false })[0];
}
function slide(dir) {
  const view = $("#g-view");
  if (!drag) { view.scrollBy({ left: dir * 340, behavior: "smooth" }); return; }
  const x = Math.max(minX(), Math.min(0, gsap.getProperty("#goods", "x") - dir * Math.min(view.clientWidth * .8, 736)));
  gsap.to("#goods", { x, duration: reduce ? 0 : .7, ease: "power3.out", onUpdate: () => drag.update() });
}
addEventListener("resize", () => { if (drag) { drag.applyBounds({ minX: minX(), maxX: 0 }); } });
function chosenLine() { const who = rank > 1 ? RANKS[rank][0][0] : rank === 1 ? "Yuzuru" : ""; $("#chosen").textContent = chosen || who ? t(["About: ", "ご用件："]) + [chosen, who && t(["with " + who, who + " さん希望"])].filter(Boolean).join(t([", ", "、"])) : ""; }
document.addEventListener("click", (e) => {
  const c = e.target.closest(".ltr"); if (c) { clearInterval(timer); if (+c.dataset.cell !== open) show(+c.dataset.cell, true); return; }
  const r = e.target.closest("[data-rank]"); if (r) { const v = +r.dataset.rank; prev = rank; rank = v === rank && r.closest("#people") ? 0 : v; people(); menu(true); chosenLine(); return; }
  if (e.target.id === "g-prev") { slide(-1); return; } if (e.target.id === "g-next") { slide(1); return; }
  const a = e.target.closest("[data-ask]"); if (a) { chosen = a.dataset.ask; chosenLine(); }
});
$("#ask").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#a-name").value.trim(), msg = $("#a-msg").value.trim(), err = $("#ask-err");
  if (!msg) { err.textContent = t(["Please write your message.", "お問い合わせの内容を入力してください。"]); err.hidden = false; $("#a-msg").focus(); return; } err.hidden = true;
  const about = $("#chosen").textContent;
  location.href = `mailto:rencounter2012@gmail.com?subject=${encodeURIComponent(t(["Enquiry", "お問い合わせ"]) + (chosen ? ": " + chosen : ""))}&body=${encodeURIComponent((about ? about + "\n\n" : "") + msg + "\n\n" + name)}`;
});
onRender(() => { openNow(); shelf(); people(); prev = rank; menu(false); goods(); chosenLine(); });
applyLang(); show(0, false);

/* motion (GSAP). Everything is visible without it. */
if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".ltr", { y: 60, opacity: 0, duration: .9, stagger: .07, ease: "power4.out", clearProps: "transform,opacity" });
  gsap.from("#stage", { clipPath: "inset(0 0 100% 0)", duration: 1.1, delay: .35, ease: "power3.inOut", clearProps: "clipPath" });
  gsap.from(".hero-copy > *", { y: 20, opacity: 0, duration: .55, stagger: .07, delay: .5, ease: "power2.out", clearProps: "transform,opacity" });
  /* the letters open one at a time, at an even pace, until the visitor chooses one */
  setTimeout(() => { timer = setInterval(() => { if (!document.hidden) show((open + 1) % 6, true); }, 3400); }, 2200);
  gsap.from(".people figure", { clipPath: "inset(100% 0 0 0)", duration: .9, stagger: .12, ease: "power3.inOut", clearProps: "clipPath", scrollTrigger: { trigger: "#people", start: "top 82%", once: true } });
  gsap.from(".goods li", { x: 80, opacity: 0, duration: .7, stagger: .08, ease: "power3.out", clearProps: "opacity", scrollTrigger: { trigger: "#g-view", start: "top 85%", once: true }, onComplete: () => { gsap.set(".goods li", { clearProps: "transform" }); } });
  gsap.fromTo(".front img", { yPercent: -7, scale: 1.16 }, { yPercent: 7, scale: 1.16, ease: "none", scrollTrigger: { trigger: ".front", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.fromTo(".f-word", { xPercent: -6 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".foot", start: "top bottom", end: "bottom bottom", scrub: true } });
  ScrollTrigger.batch(".rate > h2, .people li > div, .p-title, .grp, .made-head > *, .spa, .visit > div > *, .form", { start: "top 92%", once: true, onEnter: (els) => gsap.from(els, { y: 26, opacity: 0, duration: .55, stagger: .05, ease: "power2.out", clearProps: "transform,opacity" }) });
}
