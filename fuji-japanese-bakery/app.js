// Fuji Japanese Bakery（ご提案用の試作）。商品・料金・文章は、いまのサイト（2026-10-11 取得）にあるものだけ。商品データは data.js。
const LEAD_EN = { 3: "Japanese-style cakes: not too sweet, and soft in the mouth. Enjoy the combination of sponge, fresh cream, fruit and chocolate.", 4: "Made by a pastry chef who trained in German confectionery in Kobe, to suit everyone’s taste.", 5: "Never forgetting the Japanese heart, we make pure, handmade Japanese sweets with care so that you can enjoy them even overseas.", 6: "Using our craftsmen’s many years of experience and skill, we make something special just for you, to your request. Please feel free to ask us about anything." };
const HOURS = [[480, 990], [480, 990], [480, 990], [480, 990], [480, 990], [480, 960], null]; // 月〜金 8:00–16:30、土 8:00–16:00、日・祝 休み
const DAYS = [["Monday", "月曜"], ["Tuesday", "火曜"], ["Wednesday", "水曜"], ["Thursday", "木曜"], ["Friday", "金曜"], ["Saturday", "土曜"], ["Sunday", "日曜"]];
const SIZES = [["r15", ["Round, dia. 15cm", "丸型 直径15cm"], "4-6", 1], ["r18", ["Round, dia. 18cm", "丸型 直径18cm"], "6-8", 1], ["r21", ["Round, dia. 21cm", "丸型 直径21cm"], "8-10", 1], ["r24", ["Round, dia. 24cm", "丸型 直径24cm"], "12-16", 0],
  ["q16", ["Rectangle, 16 x 32cm", "長方形 16 x 32cm"], "16-20", 0], ["q24", ["Rectangle, 24 x 32cm", "長方形 24 x 32cm"], "24-30", 0], ["r32", ["Round, dia. 32cm", "丸型 直径32cm"], "30-35", 0], ["s32", ["Square, 32 x 32cm", "正方形 32 x 32cm"], "35-40", 0]];
const FLAV = [["FRUITS", "FRUITS"], ["STRAWBERRY", "STRAWBERRY"], ["CHOCOLATE", "CHOCOLATE"], ["CHOCOLATE STRAWBERRY", "CHOCOLATE STRAWBERRY"]];
const DECO = [["Usual", "通常"], ["Sp.1", "Sp.1"], ["Sp.2", "Sp.2"]];
// PRICE[サイズ][種類][仕上げ]
const PRICE = { r15: [[46, 51, 61], [48, 53, 63], [48, 53, 63], [50, 55, 65]], r18: [[56, 61, 71], [58, 63, 73], [58, 63, 73], [60, 65, 75]], r21: [[66, 71, 81], [68, 73, 83], [68, 73, 83], [70, 75, 85]], r24: [[76, 81, 91], [78, 83, 93], [78, 83, 93], [80, 85, 95]],
  q16: [[93, 98, 108], [95, 100, 110], [95, 100, 110], [97, 105, 115]], q24: [[138, 143, 153], [140, 145, 155], [140, 145, 155], [142, 150, 160]], r32: [[163, 168, 178], [165, 170, 180], [165, 170, 180], [167, 180, 190]], s32: [[183, 188, 198], [185, 190, 200], [185, 190, 200], [187, 195, 205]] };
const PARTNERS = [
  ["Lucky Mart", "2 Wilkes Ave, Artarmon NSW 2064", "02-9413-2200", ["Mon-Sat 9:30-18:30", "Sun 10:30-17:30"], ["Facebook", "https://www.facebook.com/luckymart.artarmon"]],
  [["Tokyo Mart", "東京マート"], "Shop 27, Northbridge Plaza 113 Sailors Bay Rd. NORTHBRIDGE NSW 2063", "TEL 02-9958-6860 / FAX 02-9967-3152", ["Mon.-Wed., Fri. 9:00-17:30", "Thu. 9:00-18:30", "Sat. 9:00-18:00", "Sun. 10:00-16:00"], ["www.junpacific.com", "http://www.junpacific.com/"]],
  [["Ume-ya", "夢屋 Ume-ya"], "Shop 2, 34-48 Alexander St. CROWS NEST NSW 2065", "TEL 02-9439-3784 / FAX 02-9439-3786", ["Mon. closed", "Thu.-Sat. 11:00-20:00", "Sun. 13:00-20:00"], ["www.umeya.com.au", "http://www.umeya.com.au/"]],
  ["G’day Tokyo Grocery", "Shop 2/178 Military Rd, Neutral Bay NSW 2089", "TEL 0405 305 308", ["7 days 10:00-18:00"], ["Facebook", "https://www.facebook.com/Gday-Tokyo-Grocery-101677954789693/"]],
];
let cat = 2, sub = "", tray = {}, C = { size: "r18", flav: 1, deco: 0 }, open = false;
const num = (p) => parseFloat(String(p).replace(/[^0-9.]/g, "")) || 0;
const money = (v) => "$" + v.toFixed(2);
const clock = (m) => { const h = Math.floor(m / 60), mm = String(m % 60).padStart(2, "0"); return lang === "en" ? `${h % 12 || 12}:${mm}${h < 12 ? "am" : "pm"}` : `${h}:${mm}`; };
const key = (c, i) => `${c}-${i}`;
const itemOf = (k) => { const [c, i] = k.split("-"); return DATA.find((d) => d.k === +c).items[+i]; };

function tabs() {
  $("#tabs").innerHTML = DATA.map((d) => `<button type="button" role="tab" data-cat="${d.k}" aria-selected="${d.k === cat}">${t(d.n)}<i>${d.items.length}</i></button>`).join("");
  const d = DATA.find((x) => x.k === cat), lead = lang === "en" ? (d.lead[0] || LEAD_EN[cat] || "") : d.lead[1];
  $("#cat-lead").textContent = lead; $("#cat-lead").hidden = !lead;
  $("#subs").innerHTML = `<button type="button" data-sub="" aria-pressed="${sub === ""}">${t(["All", "すべて"])}</button>` + d.subs.map((s) => `<button type="button" data-sub="${s[0]}" aria-pressed="${sub === s[0]}">${lang === "en" ? s[1] : s[2]}</button>`).join("");
}
function rack(animate) {
  const d = DATA.find((x) => x.k === cat);
  $("#rack").innerHTML = d.items.map((x, i) => [x, i]).filter(([x]) => !sub || x[4] === sub).map(([x, i]) => {
    const k = key(cat, i), n = tray[k] || 0;
    return `<li class="item${n ? " is-on" : ""}"><img src="img/p/${x[0]}" alt="" width="150" height="113" loading="lazy"><div class="i-b"><h3>${esc(t(x[1]))}</h3><p class="i-price">${x[5] ? `<em>${t(["Special", "特価"])}</em>` : ""}${x[2] || `<small>${t(["Please ask", "お尋ねください"])}</small>`}</p>${t(x[3]) ? `<p class="i-txt">${esc(t(x[3]))}</p>` : ""}</div>
      <div class="i-act">${n ? `<button type="button" data-step="-1" data-k="${k}" aria-label="${t(["One fewer", "1つ減らす"])}">−</button><output>${n}</output><button type="button" data-step="1" data-k="${k}" aria-label="${t(["One more", "1つ増やす"])}">＋</button>` : `<button type="button" class="add" data-step="1" data-k="${k}">${t(["Put on the tray", "トレーにのせる"])}</button>`}</div></li>`;
  }).join("");
  if (animate && window.gsap && !reduce) gsap.from("#rack .item", { y: 14, opacity: 0, duration: 0.35, stagger: 0.02, ease: "power2.out", clearProps: "all" });
}
function trayUI() {
  const ks = Object.keys(tray), el = $("#tray");
  el.hidden = !ks.length; document.body.classList.toggle("has-tray", !!ks.length);
  if (!ks.length) { open = false; $("#tray-panel").hidden = true; return; }
  let total = 0, count = 0, ask = 0;
  $("#tray-list").innerHTML = ks.map((k) => { const x = itemOf(k), n = tray[k], p = num(x[2]); total += p * n; count += n; if (!p) ask++; return `<li><span>${esc(t(x[1]))}</span><i>× ${n}</i><b>${p ? money(p * n) : "—"}</b></li>`; }).join("");
  $("#tray-sum").textContent = t([`${count} on the tray · ${money(total)}`, `トレーに ${count} 点 · ${money(total)}`]);
  $("#tray-total").textContent = money(total);
  $("#tray-note").textContent = (ask ? t(["Items marked “—” have no listed price, so please ask on the phone. ", "「—」の商品は料金の記載がないので、お電話でお尋ねください。"]) : "") + t(["Orders are taken in store and by phone. Popular and seasonal items can be reserved or put aside.", "ご注文は店頭とお電話で承っています。人気商品や季節限定の商品は、予約・取り置きもできます。"]);
  $("#tray-panel").hidden = !open; $("#tray-bar").setAttribute("aria-expanded", open); $(".t-open").textContent = open ? t(["Close", "閉じる"]) : t(["Show", "見る"]);
}
function cake() {
  const opt = (id, arr, cur, name) => { $(id).innerHTML = arr.map((a, i) => { const v = name === "size" ? a[0] : i, lab = name === "size" ? `${t(a[1])}<small>${a[2]} ${t(["people", "人分"])}</small>` : t(a); return `<button type="button" data-c="${name}" data-v="${v}" aria-pressed="${String(cur) === String(v)}">${lab}</button>`; }).join(""); };
  opt("#c-size", SIZES, C.size, "size"); opt("#c-flav", FLAV, C.flav, "flav"); opt("#c-deco", DECO, C.deco, "deco");
  const s = SIZES.find((x) => x[0] === C.size), p = PRICE[C.size][C.flav][C.deco];
  $("#c-out-size").textContent = `${t(s[1])} · ${s[2]} ${t(["people", "人分"])} · ${t(FLAV[C.flav])} · ${t(DECO[C.deco])}`;
  const el = $("#c-out-price"), from = +el.dataset.v || p; el.dataset.v = p;
  if (window.gsap && !reduce && from !== p) { const o = { v: from }; gsap.to(o, { v: p, duration: 0.4, ease: "power2.out", onUpdate: () => { el.textContent = "$" + Math.round(o.v); } }); } else el.textContent = "$" + p;
  $("#c-out-note").textContent = s[3] ? t(["Standard cake: please order at least 2 days before the pick-up day.", "定型内ケーキ：お引き渡し日の２日前までにお申し込みください。"]) : t(["Large cake: please order as early as you can.", "大型ケーキ：なるだけお早めにお申し込みください。"]);
  $("#c-table").innerHTML = `<thead><tr><th>${t(["1 whole / $", "1ホール/$"])}</th>${FLAV.map((f) => `<th colspan="3">${t(f)}</th>`).join("")}</tr><tr><th></th>${FLAV.map(() => DECO.map((d) => `<th>${t(d)}</th>`).join("")).join("")}</tr></thead><tbody>${SIZES.map((z) => `<tr><th>${t(z[1])}<small>${z[2]} people</small></th>${PRICE[z[0]].map((f) => f.map((v) => `<td>$${v}</td>`).join("")).join("")}</tr>`).join("")}</tbody>`;
}
function partners() {
  $("#partners").innerHTML = PARTNERS.map((p) => `<li><h3>${Array.isArray(p[0]) ? t(p[0]) : p[0]}</h3><p>${p[1]}</p><p>${p[2]}</p><p class="p-h">${p[3].join("<br>")}</p><a href="${p[4][1]}" target="_blank" rel="noopener">${p[4][0]}</a></li>`).join("");
}
function hours() {
  const { d, m } = sydney(), h = HOURS[d];
  $("#hours").innerHTML = `<span class="${d < 5 ? "is-today" : ""}">${t(["Mon – Fri", "月〜金"])}　8:00am – 4:30pm</span><span class="${d === 5 ? "is-today" : ""}">${t(["Sat", "土"])}　8:00am – 4:00pm</span><span class="${d === 6 ? "is-today" : ""}">${t(["Sun & public holidays: closed", "日曜・祝日：休み"])}</span>`;
  let s;
  if (h && m >= h[0] && m < h[1]) s = t([`Open now, until ${clock(h[1])}`, `ただいま営業中です（${clock(h[1])} まで）`]);
  else if (h && m < h[0]) s = t([`Opens today at ${clock(h[0])}`, `本日は ${clock(h[0])} に開きます`]);
  else { let k = (d + 1) % 7; while (!HOURS[k]) k = (k + 1) % 7; s = t([`Closed now. Opens ${DAYS[k][0]} at ${clock(HOURS[k][0])}`, `ただいま閉まっています。次は${DAYS[k][1]}の ${clock(HOURS[k][0])} から`]); }
  $("#today").textContent = s;
}
document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-cat]"); if (c) { cat = +c.dataset.cat; sub = ""; tabs(); rack(true); return; }
  const s = e.target.closest("[data-sub]"); if (s) { sub = s.dataset.sub; tabs(); rack(true); return; }
  const st = e.target.closest("[data-step]");
  if (st) { const k = st.dataset.k, n = (tray[k] || 0) + +st.dataset.step; if (n > 0) tray[k] = n; else delete tray[k]; rack(false); trayUI();
    if (+st.dataset.step > 0 && window.gsap && !reduce) gsap.fromTo(".t-ico", { rotate: -18, scale: 1.25 }, { rotate: 0, scale: 1, duration: 0.5, ease: "elastic.out(1, .45)" }); return; }
  if (e.target.closest("#tray-bar")) { open = !open; trayUI(); return; }
  if (e.target.closest("#tray-clear")) { tray = {}; open = false; rack(false); trayUI(); return; }
  const cb = e.target.closest("[data-c]"); if (cb) { C[cb.dataset.c] = cb.dataset.c === "size" ? cb.dataset.v : +cb.dataset.v; cake(); }
});
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim(), err = $("#f-err");
  if (!v("#f-name") || !/^\S+@\S+\.\S+$/.test(v("#f-mail")) || !v("#f-msg")) { err.textContent = t(["Please fill in all three fields. The e-mail address must be a valid one.", "すべての項目にご記入ください。メールアドレスは半角英数でご入力ください。"]); err.hidden = false; $("#f-done").hidden = true; return; }
  err.hidden = true; $("#f-done").hidden = false;
});
onRender(tabs); onRender(() => rack(false)); onRender(trayUI); onRender(cake); onRender(partners); onRender(hours);
applyLang();
setInterval(hours, 60000);

if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".since", { scale: 0.4, rotate: -20, opacity: 0, duration: 0.7, ease: "back.out(1.8)", clearProps: "all" });
  gsap.from(".hero h1, .lead, .btns, .window, .shopinfo > div", { y: 22, opacity: 0, duration: 0.55, stagger: 0.07, ease: "power2.out", delay: 0.15, clearProps: "all" });
  ScrollTrigger.batch(".sec-head, .finder, .sp-notes li, .cake-info dl > div, .examples li, .st, .outline > div, .partners li, .how, .form", {
    start: "top 90%", once: true,
    onEnter: (els) => gsap.from(els, { y: 20, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.05, clearProps: "all" }),
  });
}
