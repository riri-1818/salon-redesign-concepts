// WJLC：画面の切り替え／講座と分割払いの早見／卒業生の声の検索／申込み。各ページの本文は p/*.html（今のサイトの原文、_pitch/gen.py が作る）。
lang = "ja";
const BY = Object.fromEntries(ROUTES.map((r) => [r.slug, r]));
const yen = (n) => "A$" + n.toLocaleString("en-AU");
// 講座・授業料・期間・分割は、講座案内の表と申込みフォームの表から
const COURSES = [
  { id: "t1", no: 4, name: "420時間総合講座", sub: "一般通信＋マスター通信", fee: 1740, term: "半年〜約1年", inst: [1, 2, 3, 4, 5, 10], pace: [["1日3時間", "約半年"], ["1日1時間30分", "約1年"]], note: "約20万円。最初から最後まで全て通信講座で、半年で修了できます。半年より短い期間で修了することはできません。", page: "japanese_language_teacher_trainingcourse_420hrs_general_lecture" },
  { id: "t2", no: 5, name: "420時間総合講座", sub: "一般通学＋マスター通信", fee: 1740, term: "通学2週間＋通信", inst: [1, 2, 3, 4, 5, 10], commute: true, note: "前半をシドニー教室の2週間短期集中講座で、後半のマスター講座を通信で学びます。", page: "japanese_language_teacher_trainingcourse_420hrs_general_lecture" },
  { id: "gc", no: 1, name: "一般講座", sub: "通信", fee: 990, term: "10週間", inst: [1, 2, 3, 5], note: "時間も場所も制限されず世界中どこにいても学習できます。一般通学講座の内容を約2ヶ月で習得。", page: "japanese_language_teacher_trainingcourse_general_correspondence_course" },
  { id: "gs", no: 2, name: "一般講座", sub: "通学", fee: 990, term: "2週間", inst: [1, 2, 3, 5], commute: true, note: "オーストラリア・シドニー教室の2週間短期集中講座。英語を使った間接教授法と、日本語だけの直接法を学びます。", page: "japanese_language_teacher_trainingcourse_general_commuter_courses" },
  { id: "ms", no: 3, name: "マスター講座", sub: "通信のみ", fee: 850, term: "5ヶ月 / 10ヶ月", inst: [1, 2, 5], pace: [["1日3時間", "約4ヶ月"], ["1日1時間30分", "約8ヶ月"]], note: "一般講座のあとに、日本語教育をより幅広く且つ深く学習する講座です。", page: "japanese_language_teacher_trainingcourse_420hrs_general_lecture" },
];
const DATES = [["2026-10-19", "2026年度 10月19日～10月30日"], ["2027-01-11", "2027年度 1月11日～1月22日"], ["2027-04-05", "2027年度 4月5日～4月16日"], ["2027-07-19", "2027年度 7月19日～7月30日"], ["2027-11-08", "2027年度 11月8日～11月9日"]];
const KAI = { 1: "なし", 2: "二回", 3: "三回", 4: "四回", 5: "五回", 10: "十回" };
const P = { c: "t1", n: 1, pace: 0 };
const course = () => COURSES.find((c) => c.id === P.c);
const chip = (attr, val, on, label) => `<button type="button" data-${attr}="${val}" aria-pressed="${on}">${label}</button>`;

function nextDate() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" }));
  const d = DATES.find(([s]) => new Date(s + "T09:00:00") > now); if (!d) return null;
  return [d[1], Math.ceil((new Date(d[0] + "T00:00:00") - now) / 864e5)];
}
function planner(moved) {
  const c = course(); if (!c.inst.includes(P.n)) P.n = 1; if (!c.pace) P.pace = 0;
  const nd = nextDate(), each = c.fee / P.n;
  const html = `<div class="pl-c" role="group" aria-label="講座">${COURSES.map((x) => `<button type="button" data-course="${x.id}" aria-pressed="${x.id === P.c}"><b>${x.name}</b><small>${x.sub}</small><i>${yen(x.fee)}</i></button>`).join("")}</div>
    <div class="pl-d"><div class="pl-l">
      <h3>${c.name}<small>（${c.sub}）</small></h3><p class="pl-note">${c.note}</p>
      <dl><div><dt>期間</dt><dd>${c.pace ? `<span class="chips" role="group" aria-label="1日の学習時間">${c.pace.map((p, i) => chip("pace", i, i === P.pace, p[0])).join("")}</span><b class="pl-term">${c.pace[P.pace][1]}で修了</b>` : `<b class="pl-term">${c.term}</b>`}</dd></div>
      ${c.commute ? `<div><dt>通学の日程</dt><dd>${nd ? `<b>次は ${nd[0].replace(/^\d+年度 /, "")}</b>（あと${nd[1]}日）` : ""}<span class="pl-dates">${DATES.map((d) => d[1]).join("／")}</span></dd></div>` : ""}
      <div><dt>分割払い</dt><dd><span class="chips" role="group" aria-label="分割回数">${c.inst.map((n) => chip("inst", n, n === P.n, n === 1 ? "一括" : n + "回")).join("")}</span><span class="pl-fine">分割払いでも授業料は同じです。</span></dd></div></dl>
    </div><div class="pl-r"><p class="pl-k">${P.n === 1 ? "授業料" : `1回あたり（× ${P.n}回）`}</p><p class="pl-fee"><b class="pl-n">${yen(each)}</b></p>
      <p class="pl-sum">${P.n === 1 ? (c.fee === 1740 ? "総額（約20万円）" : "総額") : `総額 ${yen(c.fee)}`}・教材費、本校からの郵送料を含む</p>
      <a class="btn" href="#/apply">この内容で申し込む <span aria-hidden="true">→</span></a><a class="link" href="#/p/${c.page}">この講座を詳しく見る</a></div></div>`;
  $$("[data-planner]").forEach((el) => { el.innerHTML = html; });
  if (moved && window.gsap && !reduce) gsap.fromTo(".pl-n", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out", clearProps: "all" });
  if ($("#f-course")) formSync();
}

// 卒業生の声
const REG = [["japanese-domestic", "日本国内"], ["oceania", "オセアニア"], ["asian", "アジア"], ["usa", "南北アメリカ"], ["europe", "ヨーロッパ・中東・アフリカ"]];
const VO = { reg: "oceania", q: "", n: 20, data: {} };
const total = ROUTES.filter((r) => r.kind === "voices").reduce((a, r) => a + r.n, 0);
const count = (k) => (BY["voices_of_graduates_" + k.replace(/-/g, "_")] || {}).n || 0;
async function load(k) { if (!VO.data[k]) VO.data[k] = await (await fetch(`voices/${k}.json`)).json(); return VO.data[k]; }
const card = (v, short) => `<article class="vo"><h3>${v.h || (v.b[0] || "").slice(0, 44) + "…"}</h3>${v.w ? `<p class="vo-w">${v.w}</p>` : ""}${short ? `<p>${(v.b.join(" ")).slice(0, 150)}…</p>` : v.b.map((x) => `<p>${x}</p>`).join("")}</article>`;
async function voices(reset) {
  if (reset) VO.n = 20;
  $("#vo-reg").innerHTML = chip("reg", "all", VO.reg === "all", `すべて <i>${total}</i>`) + REG.map(([k, n]) => chip("reg", k, k === VO.reg, `${n} <i>${count(k)}</i>`)).join("");
  const keys = VO.reg === "all" ? REG.map((r) => r[0]) : [VO.reg]; $("#vo-list").setAttribute("aria-busy", "true");
  let list = (await Promise.all(keys.map(load))).flat(); const q = VO.q.trim().toLowerCase();
  if (q) list = list.filter((v) => (v.h + v.w + v.b.join("")).toLowerCase().includes(q));
  $("#vo-count").textContent = q ? `「${VO.q.trim()}」を含む声：${list.length}件` : `${VO.reg === "all" ? "すべての地域" : REG.find((r) => r[0] === VO.reg)[1]}：${list.length}件`;
  $("#vo-list").innerHTML = list.slice(0, VO.n).map((v) => card(v)).join("") || '<p class="none">当てはまる声がありません。ことばを変えてお試しください。</p>';
  $("#vo-list").removeAttribute("aria-busy"); $("#vo-more").hidden = list.length <= VO.n;
  if (reset && window.gsap && !reduce) gsap.fromTo("#vo-list .vo", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: "power2.out", clearProps: "all" });
}
async function teaser() {
  $("#v-total").textContent = total;
  $("#vt-r").innerHTML = REG.map(([k, n]) => `<a class="btn ghost" href="#/voices/${k}">${n} <i>${count(k)}件</i></a>`).join("");
  try { const v = await load("oceania"); $("#vt").innerHTML = v.slice(0, 3).map((x) => card(x, true)).join(""); } catch (e) {}
}

// 申込みフォーム
const PREF = "海外 北海道 青森県 岩手県 宮城県 秋田県 山形県 福島県 茨城県 栃木県 群馬県 埼玉県 千葉県 東京都 神奈川県 新潟県 富山県 石川県 福井県 山梨県 長野県 岐阜県 静岡県 愛知県 三重県 滋賀県 京都府 大阪府 兵庫県 奈良県 和歌山県 鳥取県 島根県 岡山県 広島県 山口県 徳島県 香川県 愛媛県 高知県 福岡県 佐賀県 長崎県 熊本県 大分県 宮崎県 鹿児島県 沖縄県".split(" ");
function formSync() {
  const c = course(), again = P.c === "re";
  $("#f-course").innerHTML = [...COURSES].sort((a, b) => a.no - b.no).map((x) => `<label class="radio"><input type="radio" name="course" value="${x.id}"${x.id === P.c ? " checked" : ""}><span>${x.no}: ${x.name} ${yen(x.fee)} - ”${x.sub}”</span></label>`).join("") + `<label class="radio"><input type="radio" name="course" value="re"${again ? " checked" : ""}><span>6: 有料の修了証書再発送</span></label>`;
  $("#f-period-w").hidden = again || !c.commute;
  const inst = again ? [1] : c.inst;
  $("#f-inst").innerHTML = inst.map((n) => `<option value="${n}"${n === P.n ? " selected" : ""}>${KAI[n]}${n > 1 ? `（× ${n}回　${yen(c.fee / n)}）` : ""}</option>`).join("");
  $("#sum").innerHTML = again ? "<h2>お申し込み内容</h2><p>有料の修了証書再発送</p>" : `<h2>お申し込み内容</h2><p class="s-n">${c.name}<small>（${c.sub}）</small></p><dl><div><dt>授業料</dt><dd>${yen(c.fee)}</dd></div><div><dt>期間</dt><dd>${c.pace ? c.pace[P.pace][1] + "（" + c.pace[P.pace][0] + "の学習）" : c.term}</dd></div><div><dt>お支払い</dt><dd>${P.n === 1 ? "一括" : `${P.n}回（1回 ${yen(c.fee / P.n)}）`}</dd></div></dl><p class="fine">教材費、本校からの郵送料を含みます。</p><a class="link" href="#/p/japanese_language_teacher_trainingcourse">講座案内に戻る</a>`;
}
function forms() {
  $("#f-pref").insertAdjacentHTML("beforeend", PREF.map((p) => `<option>${p}</option>`).join(""));
  $("#f-period").insertAdjacentHTML("beforeend", DATES.map((d) => `<option>${d[1]}</option>`).join(""));
  $("#form").addEventListener("change", (e) => {
    if (e.target.name === "course") { if (e.target.value === "re") { P.c = "re"; formSync(); } else { P.c = e.target.value; planner(false); } }
    if (e.target.id === "f-inst") { P.n = +e.target.value; planner(false); }
  });
  const v = (id) => $(id).value.trim(), ok = (m) => /^\S+@\S+\.\S+$/.test(m);
  $("#form").addEventListener("submit", (e) => {
    e.preventDefault(); const err = $("#f-err"); let msg = "";
    if (["#f-name", "#f-roma", "#f-birth", "#f-sex", "#f-country", "#f-pref", "#f-addr", "#f-tel", "#f-pay"].some((id) => !v(id))) msg = "＊の付いた項目をすべてご入力ください。";
    else if (!ok(v("#f-mail"))) msg = "メールアドレスをご確認ください。";
    else if (v("#f-mail") !== v("#f-mail2")) msg = "確認用のメールアドレスが一致していません。";
    else if (!$("#f-agree").checked) msg = "WJLC規約への同意が必要です。";
    err.textContent = msg; err.hidden = !msg; $("#f-ok").hidden = !!msg; if (msg) return;
    const c = P.c === "re" ? null : course(), body = [`受講講座：${c ? `${c.no}: ${c.name} ${yen(c.fee)} - ${c.sub}` : "6: 有料の修了証書再発送"}`, c && c.commute ? `通学期間：${v("#f-period") || "-"}` : "", `氏名：${v("#f-name")}`, `お名前（ローマ字）：${v("#f-roma")}`, `生年月日：${v("#f-birth")}`, `性別：${v("#f-sex")}`, `E-メール：${v("#f-mail")}`, `郵便番号：${v("#f-zip") || "-"}`, `国名：${v("#f-country")}`, `都道府県：${v("#f-pref")}`, `ご住所：${v("#f-addr")}`, `電話番号：${v("#f-tel")}`, `お支払方法：${v("#f-pay")}`, `分割回数：${KAI[+v("#f-inst")]}`, `この講座を知ったきっかけ：${v("#f-how") || "-"}`, "WJLC規約に同意します"].filter(Boolean).join("\n");
    location.href = `mailto:customer@wjlc.net?subject=${encodeURIComponent("受講お申し込み")}&body=${encodeURIComponent(body)}`;
  });
  $("#eform").addEventListener("submit", (e) => {
    e.preventDefault(); const err = $("#e-err"); let msg = "";
    if (["#e-name", "#e-kana", "#e-tel", "#e-msg"].some((id) => !v(id))) msg = "＊の付いた項目をすべてご入力ください。"; else if (!ok(v("#e-mail"))) msg = "メールアドレスをご確認ください。";
    err.textContent = msg; err.hidden = !msg; $("#e-ok").hidden = !!msg; if (msg) return;
    location.href = `mailto:customer@wjlc.net?subject=${encodeURIComponent("お問い合わせ")}&body=${encodeURIComponent(`氏名：${v("#e-name")}\nふりがな：${v("#e-kana")}\nメールアドレス：${v("#e-mail")}\n電話番号：${v("#e-tel")}\n\n${v("#e-msg")}`)}`;
  });
}

// 各ページ（原文の断片を読み込む）
const GROUP = { aboutus: "WJLCについて", "what-is-a-japanese-teacher": "日本語教師とは", features: "講座の特徴", "japanese-language-teacher-trainingcourse": "講座案内", "voices-of-graduates": "卒業生の声", faq: "よくある質問", "how-to-apply-for-each-course": "お申し込みについて", notification: "お知らせ" };
const grp = (r) => r.path.split("/")[0];
const href = (r) => (r.kind === "voices" ? `#/voices/${r.path.split("/")[1]}` : r.slug === "voices_of_graduates" ? "#/voices" : /online_application_form$/.test(r.slug) ? "#/apply" : r.slug === "enquiry" ? "#/enquiry" : r.slug === "sitemap" ? "#/all" : `#/p/${r.slug}`);
function faq(body) {   // 「太字の質問＋答え」を、開閉できる形にする
  let cur = null;
  [...body.children].forEach((el) => {
    const s = [...el.querySelectorAll(":scope > strong")].map((x) => x.textContent).join("").trim().length, q = el.tagName === "P" && s && s >= el.textContent.trim().length - 2 && /[。.？?]$|か$/.test(el.textContent.trim());
    if (q) { cur = document.createElement("details"); cur.className = "qa"; cur.innerHTML = `<summary>${el.textContent.trim()}</summary><div></div>`; el.replaceWith(cur); }
    else if (/^H[2-4]$/.test(el.tagName)) cur = null;
    else if (cur) cur.lastElementChild.appendChild(el);
  });
}
async function page(slug, jump) {
  const r = BY[slug]; if (!r) { location.hash = "#/all"; return; }
  const g = grp(r), sibs = ROUTES.filter((x) => grp(x) === g && (g !== "notification" || true));
  $("#pg-title").textContent = r.title; $("#pg-date").hidden = !r.date; $("#pg-date").textContent = r.date ? `更新日時: ${r.date}` : "";
  $("#pg-crumb").innerHTML = `<a href="#/">トップ</a>${GROUP[g] && sibs[0] !== r ? ` / <a href="${href(sibs[0])}">${GROUP[g]}</a>` : ""}`;
  $("#pg-nav").innerHTML = sibs.length > 1 ? `<p>${GROUP[g] || "関連ページ"}</p><ul>${sibs.map((x) => `<li><a href="${href(x)}"${x === r ? ' aria-current="page"' : ""}>${x.title}</a></li>`).join("")}</ul>` : "";
  $("#pg-nav").hidden = sibs.length < 2; $("#pg-plan").hidden = g !== "japanese-language-teacher-trainingcourse"; $("#faq-s").hidden = slug !== "faq";
  const body = $("#pg-body"); body.setAttribute("aria-busy", "true");
  try { body.innerHTML = r.len ? await (await fetch(`p/${slug}.html`)).text() : ""; } catch (e) { body.innerHTML = "<p>ページを読み込めませんでした。</p>"; }
  if (/notification_of_completion/.test(slug)) body.innerHTML = '<p>お振り込みが完了しましたら、お問い合わせフォームからお知らせください。</p><p><a class="link" href="#/enquiry">お問い合わせフォームへ</a></p>';
  $$("table", body).forEach((t) => { const w = document.createElement("div"); w.className = "tw"; t.replaceWith(w); w.appendChild(t); });
  if (slug === "faq") { faq(body); $("#faq-q").value = ""; }
  body.removeAttribute("aria-busy");
  if (jump && document.getElementById(jump)) document.getElementById(jump).scrollIntoView({ block: "start" });
}

// 画面の切り替え
const VIEWS = ["home", "voices", "apply", "enquiry", "all", "page"];
let first = true, lastRoute = "";
async function route() {
  const [_, a = "", b = ""] = location.hash.replace(/^#/, "").split("/");
  if (!location.hash.startsWith("#/")) { if (lastRoute) return; }
  let v = "home"; if (["voices", "apply", "enquiry", "all"].includes(a)) v = a; else if (a === "p" && b) v = "page";
  if (a === "p" && BY[b] && href(BY[b]) !== `#/p/${b}`) { location.replace(href(BY[b])); return; }
  $$(".view").forEach((x) => { x.hidden = x.id !== "v-" + v; });
  const g = v === "voices" ? "voices-of-graduates" : v === "page" && BY[b] ? grp(BY[b]) : "";
  $$(".nav a").forEach((x) => (x.dataset.nav === g ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current")));
  if (v === "voices") { if (b && (b === "all" || REG.some((r) => r[0] === b))) VO.reg = b; VO.q = ""; $("#vo-q").value = ""; await voices(true); }
  if (v === "page") await page(b);
  if (v === "apply") formSync();
  document.title = (v === "page" && BY[b] ? BY[b].title + "｜" : v === "voices" ? "卒業・在校生の声｜" : v === "apply" ? "お申し込み｜" : v === "enquiry" ? "お問い合わせ｜" : "") + "WJLC 日本語教師養成講座";
  if (!first && lastRoute !== location.hash) { scrollTo(0, 0); if (window.gsap && !reduce) gsap.fromTo("#v-" + v, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", overwrite: true, clearProps: "all" }); }
  first = false; lastRoute = location.hash;
}
addEventListener("hashchange", route);

document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-course]"); if (c) { P.c = c.dataset.course; planner(true); return; }
  const i = e.target.closest("[data-inst]"); if (i) { P.n = +i.dataset.inst; planner(true); return; }
  const p = e.target.closest("[data-pace]"); if (p) { P.pace = +p.dataset.pace; planner(true); return; }
  const r = e.target.closest("[data-reg]"); if (r) { VO.reg = r.dataset.reg; history.replaceState(null, "", `#/voices/${VO.reg}`); lastRoute = location.hash; voices(true); return; }
  if (e.target.closest("#vo-more")) { VO.n += 20; voices(false); return; }
  const j = e.target.closest("a[data-jump]"); if (j) { const t = document.getElementById(j.dataset.jump); if (t && j.getAttribute("href") === "#") { e.preventDefault(); t.scrollIntoView({ block: "start" }); if (t.tagName === "DETAILS") t.open = true; } return; }
  if (e.target.closest("#play")) $("#video").innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/8zZyCXJabG4?autoplay=1&rel=0" title="WJLC 日本語教師養成講座" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
});
let tq; $("#vo-q").addEventListener("input", (e) => { clearTimeout(tq); tq = setTimeout(() => { VO.q = e.target.value; voices(true); }, 220); });
$("#faq-q").addEventListener("input", (e) => { const q = e.target.value.trim().toLowerCase(); $$("#pg-body .qa").forEach((d) => { const hit = !q || d.textContent.toLowerCase().includes(q); d.hidden = !hit; d.open = !!q && hit; }); });

// すべてのページ
$("#all").innerHTML = Object.entries(ROUTES.reduce((a, r) => { (a[grp(r)] = a[grp(r)] || []).push(r); return a; }, {})).map(([g, rs]) => `<section><h2>${GROUP[g] || rs[0].title}</h2><ul>${rs.map((r) => `<li><a href="${href(r)}">${r.title}${r.n ? `（${r.n}件）` : ""}</a></li>`).join("")}</ul></section>`).join("") + '<section><h2>フォーム</h2><ul><li><a href="#/apply">オンラインお申し込みフォーム</a></li><li><a href="#/enquiry">お問い合わせ</a></li></ul></section>';
const pol = ROUTES.find((r) => r.title === "サイトポリシー"); if (pol) $("#policy-l").innerHTML = `<a href="#/p/${pol.slug}">サイトポリシー</a>`;

planner(false); forms(); formSync(); route(); teaser();
start(".read-l li, .feat li, .news li");
// 数字が数え上がる・言葉が入れ替わる
const TICK = ["英語を使って日本語を教える", "住んでいる場所がそのまま学びの場に", "世界中どこからでも受講可能な通信講座", "日本語を通して世界と繋がる", "オンライン講師として在宅ワーク", "半年で修了 高い修了率"];
if (window.gsap && !reduce) {
  $$("[data-count]").forEach((el) => { const to = +el.dataset.count, o = { v: Math.round(to * 0.6) }, fmt = (n) => (el.dataset.fmt ? Math.round(n).toLocaleString("en-AU") : String(Math.round(n))); gsap.to(o, { v: to, duration: 1.1, ease: "power2.out", delay: 0.2, onUpdate: () => { el.textContent = fmt(o.v); }, onComplete: () => { el.textContent = fmt(to); } }); });
  gsap.fromTo(".hero-in > *", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power2.out", clearProps: "all" });
  let ti = 0; setInterval(() => { ti = (ti + 1) % TICK.length; gsap.to("#tick", { yPercent: -60, opacity: 0, duration: 0.25, ease: "power2.in", onComplete: () => { $("#tick").textContent = TICK[ti]; gsap.fromTo("#tick", { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: "power3.out" }); } }); }, 2800);
}
