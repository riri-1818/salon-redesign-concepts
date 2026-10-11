// Nails by Miho（ご提案用の試作）。文言と料金は、いまのサイト（2026-10-11 取得）にあるものだけ。
const SETS = [
  ["s1", ["Deep red nails with white marble art and fine gold lines", "深い赤に、白い大理石の模様と細い金の線"], [[28, 46], [62, 40], [74, 62]]],
  ["s2", ["Blue-grey ombre with gold crescent moons and gold flakes", "青みのグレーのグラデーションに、金の三日月と箔"], [[22, 34], [58, 62], [80, 56]]],
  ["s3", ["Pastel flowers painted on a sheer base", "透ける下地に描いた、パステルの花"], [[28, 34], [66, 30], [14, 72]]],
  ["s4", ["Terracotta red with marbled accent nails", "テラコッタの赤に、大理石模様のアクセント"], [[30, 30], [62, 50], [18, 40]]],
];
const WALL = [
  ["g2", "tall", ["Sheer peach marble with gold leaf", "透けるピーチの大理石模様に金箔"]],
  ["g1", "", ["Fine line art on a milky base", "ミルキーな下地に、細い線のアート"]],
  ["g4", "", ["Florals, a mirror finish and line work in one set", "花とミラーと線のアートを一つのセットに"]],
  ["g3", "sq", ["Teal with a white and gold ombre", "ティールブルーに、白と金のグラデーション"]],
  ["g7", "", ["Bold painted flowers with grey French tips", "大きな花の手描きと、グレーのフレンチ"]],
  ["g5", "tall", ["Soft nude with small hand-painted motifs", "やわらかなヌードに、小さな手描きのモチーフ"]],
  ["g6", "", ["Lilac with painted flowers", "ライラックに花の手描き"]],
  ["g8", "", ["Black with fine white lines and blue stones", "黒に、細い白の線と青いストーン"]],
  ["g9", "", ["Nude with small gold studs", "ヌードに小さな金のスタッズ"]],
  ["g10", "", ["A natural nude finish", "自然なヌードの仕上げ"]],
];
const SBC = ["Shape, Buff, Cuticle Care", "形を整える・表面を磨く・甘皮のケア"];
const DELUX = ["Shape, Buff, Cuticle Care, Callus Exfoliation, Massage", "形を整える・表面を磨く・甘皮のケア・角質のケア・マッサージ"];
const HALF = ["If replacing full set with colour or custom design, 50% off removal", "カラーやデザインでフルセットを付け替える場合、オフは50%引き"];
const GROUPS = [
  ["mani", ["Manicure", "マニキュア"], [
    ["Ladiposh", SBC, 60, 90], ["Shellac", SBC, 45, 55], ["Manicure", ["Shape, Buff, Cuticle Care (No Polish)", "形を整える・表面を磨く・甘皮のケア（カラーなし）"], 30, 50]]],
  ["pedi", ["Pedicure", "ペディキュア"], [
    ["Ladiposh Basic", SBC, 60, 95], ["Ladiposh Delux", DELUX, 75, 115], ["Shellac Basic", SBC, 50, 60], ["Shellac Delux", DELUX, 60, 95],
    ["Callus Removal", ["Removed with dremel machine", "専用のマシンで角質を取り除きます"], 15, 20]]],
  ["ext", ["Extensions", "長さ出し"], [
    ["Ladiposh Builder Gel", ["One colour coating", "ワンカラー"], 90, 160], ["Ladiposh Builder Gel", ["Custom design. Pricing varies depending on design", "デザイン。料金はデザインによって変わります"], 120, 160, 1],
    ["Acrylic", ["One colour coating", "ワンカラー"], 90, 160], ["Acrylic", ["Custom design. Pricing varies depending on design", "デザイン。料金はデザインによって変わります"], 120, 160, 1],
    ["Nail Art", ["Custom design", "デザイン"], 60, 80]]],
  ["rem", ["Removals", "オフ"], [["Soft Gel", HALF, 30, 35], ["Hard Gel", HALF, 45, 45], ["Shellac", HALF, 20, 25]]],
];
const HOURS = [[540, 1260], [540, 1260], [540, 1260], [540, 1260], [540, 1260], [540, 1260], null]; // 月〜日
const DAYS = [["Monday", "月曜"], ["Tuesday", "火曜"], ["Wednesday", "水曜"], ["Thursday", "木曜"], ["Friday", "金曜"], ["Saturday", "土曜"], ["Sunday", "日曜"]];
let tab = "mani", cur = 0, picked = [], auto = null;

const dur = (m) => lang === "en" ? (m >= 60 ? `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`) : (m >= 60 ? `${Math.floor(m / 60)}時間${m % 60 ? `${m % 60}分` : ""}` : `${m}分`);
const clock = (m) => { const h = Math.floor(m / 60), mm = String(m % 60).padStart(2, "0"); return lang === "en" ? `${h % 12 || 12}:${mm}${h < 12 ? "am" : "pm"}` : `${h}:${mm}`; };
const key = (g, i) => `${g}-${i}`;

// ---------- レンズ ----------
const scope = $("#scope"), lens = $("#lens"), Z = 2.3;
function place(px, py) {            // px, py は 0〜1
  const w = scope.clientWidth, h = scope.clientHeight, r = lens.offsetWidth / 2;
  px = Math.min(1, Math.max(0, px)); py = Math.min(1, Math.max(0, py));
  lens.style.transform = `translate(${px * w - r}px, ${py * h - r}px)`;
  lens.style.backgroundSize = `${w * Z}px ${h * Z}px`;
  lens.style.backgroundPosition = `${-(px * w * Z - r)}px ${-(py * h * Z - r)}px`;
  scope._p = [px, py];
}
function drift() {
  if (auto) auto.kill();
  const pts = SETS[cur][2], o = { x: pts[0][0] / 100, y: pts[0][1] / 100 };
  place(o.x, o.y);
  if (reduce || !window.gsap) return;
  auto = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 2.6, ease: "sine.inOut", onUpdate: () => place(o.x, o.y) } });
  pts.slice(1).forEach((p) => auto.to(o, { x: p[0] / 100, y: p[1] / 100 }, ">0.5"));
}
function setPhoto(i, user) {
  cur = i; const s = SETS[i];
  $("#sc-img").src = `img/${s[0]}.jpg`; scope.setAttribute("aria-label", t(s[1]));
  lens.style.backgroundImage = `url(img/${s[0]}.jpg)`;
  const big = new Image(); big.onload = () => { if (cur === i) lens.style.backgroundImage = `url(img/${s[0]}z.jpg)`; }; big.src = `img/${s[0]}z.jpg`;
  $$("#picks button").forEach((b, k) => b.setAttribute("aria-pressed", k === i));
  if (user && scope._p) { if (auto) auto.kill(); place(...scope._p); } else drift();
}
function picks() {
  $("#picks").innerHTML = SETS.map((s, i) => `<button type="button" data-pick="${i}" aria-pressed="${i === cur}" aria-label="${t(s[1])}"><img src="img/${s[0]}t.jpg" width="240" height="160" alt=""></button>`).join("");
  scope.setAttribute("aria-label", t(SETS[cur][1]));
}
function move(e) {
  const b = scope.getBoundingClientRect();
  if (auto) { auto.kill(); auto = null; }
  place((e.clientX - b.left) / b.width, (e.clientY - b.top) / b.height);
}
scope.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" || e.buttons || e.pointerType === "touch") move(e); });
scope.addEventListener("pointerdown", move);
addEventListener("resize", () => scope._p && place(...scope._p));

// ---------- メニュー ----------
function tabs() {
  $("#tabs").innerHTML = GROUPS.map((g) => `<button type="button" role="tab" data-tab="${g[0]}" aria-selected="${g[0] === tab}">${t(g[1])}<i>${g[2].length}</i></button>`).join("");
}
function rows(animate) {
  const g = GROUPS.find((x) => x[0] === tab);
  $("#rows").innerHTML = g[2].map((s, i) => {
    const on = picked.includes(key(g[0], i));
    return `<li class="row${on ? " is-on" : ""}"><div class="r-name"><h3>${s[0]}</h3><p>${t(s[1])}</p></div>
      <div class="r-bar"><span style="--w:${(s[2] / 120) * 100}%"></span></div>
      <p class="r-time">${dur(s[2])}</p><p class="r-price">${s[4] && lang === "en" ? "<small>from </small>" : ""}$${s[3]}${s[4] && lang === "ja" ? "<small>〜</small>" : ""}</p>
      <button class="add" type="button" data-add="${key(g[0], i)}" aria-pressed="${on}">${on ? t(["Added", "追加済み"]) : t(["Add to request", "予約に入れる"])}</button></li>`;
  }).join("");
  $("#rm-note").hidden = tab !== "rem";
  if (animate && window.gsap && !reduce) gsap.from("#rows .r-bar span", { scaleX: 0, duration: 0.5, ease: "power2.out", stagger: 0.05, clearProps: "transform" });
}
function find(k) { const [g, i] = k.split("-"); const G = GROUPS.find((x) => x[0] === g); return [G, G[2][+i]]; }
function chosen() {
  const el = $("#chosen");
  if (!picked.length) { el.innerHTML = ""; el.hidden = true; return; }
  const items = picked.map(find), mins = items.reduce((a, [, s]) => a + s[2], 0);
  el.hidden = false;
  el.innerHTML = `<p><b>${t(["Your request", "選んだメニュー"])}</b>${items.map(([G, s]) => `<span>${t(G[1])}: ${s[0]}${s[1] === SBC || s[1] === DELUX || s[1] === HALF ? "" : `（${t(s[1]).split(".")[0].split("。")[0]}）`}</span>`).join("")}<em>${t(["About ", "目安 "])}${dur(mins)}</em></p><a class="btn btn--s" href="#book">${t(["Continue to booking", "予約の入力へ進む"])}</a>`;
  $("#f-svc").value = items.map(([G, s]) => `${G[1][0]}: ${s[0]}${s[1] === SBC || s[1] === DELUX || s[1] === HALF ? "" : ` (${s[1][0].split(".")[0]})`} / ${s[2]} min / $${s[3]}${s[4] ? "+" : ""}`).join("\n");
}
function wall() {
  $("#wall").innerHTML = WALL.map((w) => `<li class="${w[1]}"><figure><img src="img/${w[0]}.jpg" alt="${t(w[2])}" loading="lazy"><figcaption>${t(w[2])}</figcaption></figure></li>`).join("");
}
function hours() {
  const { d, m } = sydney(), h = HOURS[d];
  $("#hours").innerHTML = `<span class="h-row${d < 6 ? " is-today" : ""}">${t(["Mon–Sat", "月〜土"])}　${clock(540)} – ${clock(1260)}</span><span class="h-row${d === 6 ? " is-today" : ""}">${t(["Sunday", "日曜"])}　${t(["Closed", "定休日"])}</span>`;
  let s;
  if (h && m >= h[0] && m < h[1]) s = t([`Open now, until ${clock(h[1])}`, `ただいま営業中です（${clock(h[1])} まで）`]);
  else if (h && m < h[0]) s = t([`Opens today at ${clock(h[0])}`, `本日は ${clock(h[0])} から営業します`]);
  else { let k = (d + 1) % 7; while (!HOURS[k]) k = (k + 1) % 7; s = t([`Closed now. Opens ${DAYS[k][0]} at ${clock(HOURS[k][0])}`, `ただいま営業時間外です。次は${DAYS[k][1]}の ${clock(HOURS[k][0])} から`]); }
  $("#today").textContent = s;
}
function form() {
  $$("[data-ph-en]").forEach((el) => { el.placeholder = el.dataset[lang === "en" ? "phEn" : "phJa"]; });
  const sel = $("#f-time"), v = sel.value;
  sel.innerHTML = `<option value="">${t(["Any time", "いつでも"])}</option>` + Array.from({ length: 12 }, (_, i) => 540 + i * 60).map((m) => `<option value="${clock(m)}">${clock(m)}</option>`).join("");
  sel.value = v; if (sel.selectedIndex < 0) sel.selectedIndex = 0;
}

document.addEventListener("click", (e) => {
  const p = e.target.closest("[data-pick]"); if (p) return setPhoto(+p.dataset.pick, true);
  const tb = e.target.closest("[data-tab]"); if (tb) { tab = tb.dataset.tab; tabs(); rows(true); return; }
  const go = e.target.closest("[data-go]"); if (go) { tab = go.dataset.go; tabs(); rows(true); }
  const tp = e.target.closest("[data-topic]"); if (tp) { $("#f-svc").value = tp.dataset.topic; }
  const a = e.target.closest("[data-add]");
  if (a) { const k = a.dataset.add; picked = picked.includes(k) ? picked.filter((x) => x !== k) : [...picked, k]; rows(false); chosen(); }
});
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim(), err = $("#f-err");
  if (!v("#f-name") || (!v("#f-mail") && !v("#f-tel"))) {
    err.textContent = t(["Please enter your name, and an email or a phone number.", "お名前と、メールか電話番号のどちらかをご入力ください。"]); err.hidden = false; $("#f-done").hidden = true;
    (v("#f-name") ? $("#f-mail") : $("#f-name")).focus(); return;
  }
  err.hidden = true;
  const body = [`Service:\n${v("#f-svc") || "-"}`, `Preferred day: ${v("#f-day") || "-"}`, `Preferred time: ${v("#f-time") || "Any time"}`, `Name: ${v("#f-name")}`, `Email: ${v("#f-mail") || "-"}`, `Phone: ${v("#f-tel") || "-"}`, "", v("#f-msg")].join("\n");
  $("#f-done").hidden = false;
  location.href = `mailto:miho@nailsbymiho.com.au?subject=${encodeURIComponent("Booking request")}&body=${encodeURIComponent(body)}`;
});

onRender(picks); onRender(tabs); onRender(() => rows(false)); onRender(chosen); onRender(wall); onRender(hours); onRender(form);
applyLang();
setPhoto(0);
setInterval(hours, 60000);

if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".hero-head > *", { y: 18, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.08, clearProps: "all" });
  gsap.from(".scope", { clipPath: "inset(0 50% 0 50%)", duration: 0.9, ease: "power3.out", delay: 0.15, clearProps: "clipPath" });
  gsap.from(".lens", { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(1.6)", delay: 0.9 });
  ScrollTrigger.batch(".sec-head, .w-text, .three li, .lp-text, .lp-pics, .portrait, .about-text, .wall li, .form, .visit, .svc-more > *", {
    start: "top 88%", once: true,
    onEnter: (els) => gsap.from(els, { y: 22, opacity: 0, duration: 0.55, ease: "power2.out", stagger: 0.06, clearProps: "all" }),
  });
  ScrollTrigger.create({ trigger: "#rows", start: "top 85%", once: true, onEnter: () => gsap.from("#rows .r-bar span", { scaleX: 0, duration: 0.6, ease: "power2.out", stagger: 0.07, clearProps: "transform" }) });
  gsap.to(".lp-a", { yPercent: -8, ease: "none", scrollTrigger: { trigger: ".ladiposh", start: "top bottom", end: "bottom top", scrub: true } });
}
