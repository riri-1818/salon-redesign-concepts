// Akki & Hisae Artcraft：光を当てる・3点・文字盤・こよみ・口コミ・フォーム。言語と時刻は ds.js。
document.documentElement.classList.add("js");
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");

const WD = [["Sun", "日"], ["Mon", "月"], ["Tue", "火"], ["Wed", "水"], ["Thu", "木"], ["Fri", "金"], ["Sat", "土"]];
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const PRICE = 130;

// シドニーの「いま」を "YYYY-MM-DD HH:MM" で
function nowSyd() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Sydney", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day} ${p.hour === "24" ? "00" : p.hour}:${p.minute}`;
}
const wday = (ymd) => { const [y, m, d] = ymd.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); };
function fDate(ymd, long) {
  const [, m, d] = ymd.split("-").map(Number), w = wday(ymd);
  if (lang === "ja") return `${m}月${d}日（${WD[w][1]}）`;
  return long ? `${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][w]} ${d} ${MONTH[m - 1]}` : `${WD[w][0]} ${d} ${MO[m - 1]}`;
}
function fTime(hm) {
  if (lang === "ja") return hm;
  const [h, mi] = hm.split(":").map(Number);
  return `${h % 12 || 12}${mi ? ":" + String(mi).padStart(2, "0") : ""} ${h < 12 ? "am" : "pm"}`;
}
const upcoming = () => { const n = nowSyd(); return SESSIONS.filter((s) => s > n); };


// ---------- ヘッダーのメニュー ----------
const menuB = $(".menu-b"), sheet = $("#sheet");
menuB.addEventListener("click", () => { const o = menuB.getAttribute("aria-expanded") !== "true"; menuB.setAttribute("aria-expanded", o); sheet.hidden = !o; });
sheet.addEventListener("click", (e) => { if (e.target.closest("a")) { menuB.setAttribute("aria-expanded", "false"); sheet.hidden = true; } });

// ---------- 1 光を当てる ----------
(function lens() {
  const disc = $("#lens .lens-disc");
  let tx = 35, ty = 30, x = 35, y = 30, a = 0, last = 0, t0 = performance.now();
  const set = () => { disc.style.setProperty("--lx", x.toFixed(1) + "%"); disc.style.setProperty("--ly", y.toFixed(1) + "%"); disc.style.setProperty("--a", a.toFixed(0)); };
  if (reduce) { set(); return; }
  const move = (e) => { const r = disc.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width) * 100; ty = ((e.clientY - r.top) / r.height) * 100; last = performance.now(); };
  disc.addEventListener("pointermove", move);
  disc.addEventListener("pointerdown", move);
  let on = true;
  new IntersectionObserver(([e]) => (on = e.isIntersecting)).observe(disc);
  (function tick(now) {
    if (on) {
      if (now - last > 2200) { const s = (now - t0) / 1000; tx = 50 + 30 * Math.sin(s * 0.45); ty = 46 + 26 * Math.sin(s * 0.31 + 1.2); }
      x += (tx - x) * 0.08; y += (ty - y) * 0.08; a = (a + 0.25 + Math.abs(tx - x) * 0.05) % 360;
      set();
    }
    requestAnimationFrame(tick);
  })(t0);
})();

function renderNext() {
  const n = upcoming()[0], el = $("#next-class");
  if (!n) { el.innerHTML = t(["New dates are added regularly.", "日程は随時追加しています。"]); return; }
  const [d, h] = n.split(" ");
  el.innerHTML = t([`Next class: <b>${fDate(d)}, ${fTime(h)}</b>`, `次の回：<b>${fDate(d)} ${fTime(h)}</b>`]);
}
onRender(renderNext);

// ---------- 3 持ち帰る3点 ----------
let piece = 0;
const chips = $("#chips"), img = $("#stage-img");
function renderPieces(swap) {
  chips.innerHTML = PIECES.map((p, i) => `<button class="chip" type="button" role="tab" aria-selected="${i === piece}" data-i="${i}"><i aria-hidden="true"></i>${t(p.name)}</button>`).join("");
  const p = PIECES[piece];
  $("#stage-text").innerHTML = `<span class="stage-n" aria-hidden="true">${p.n}</span><h3>${t(p.name)}</h3><p>${t(p.body)}</p>`;
  if (swap && !reduce && window.gsap) {
    gsap.timeline().to(img, { opacity: 0, scale: 1.04, duration: 0.2, ease: "power1.in" })
      .add(() => { img.src = p.img; img.alt = t(p.alt); })
      .to(img, { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out", clearProps: "transform" });
    gsap.from("#stage-text > *", { y: 14, opacity: 0, duration: 0.45, stagger: 0.06, ease: "power2.out", clearProps: "all" });
  } else { img.src = p.img; img.alt = t(p.alt); }
}
chips.addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (!b || +b.dataset.i === piece) return; piece = +b.dataset.i; renderPieces(true); chips.querySelector(`[data-i="${piece}"]`).focus(); });
chips.addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  piece = (piece + (e.key === "ArrowRight" ? 1 : PIECES.length - 1)) % PIECES.length; renderPieces(true); chips.querySelector(`[data-i="${piece}"]`).focus();
});
onRender(() => renderPieces(false));

// ---------- 5 2時間の文字盤 ----------
let step = 0;
function renderSteps() {
  $("#steps").innerHTML = STEPS.map((s, i) => `<li data-i="${i}" class="${i === step ? "on" : ""}"><h3>${t(s.t)}</h3><p>${t(s.d)}</p></li>`).join("");
  const g = $("#ticks"); let h = "";
  STEPS.forEach((s, i) => {
    const ang = ((i * 60 - 90) * Math.PI) / 180, mid = (((i + 0.5) * 60 - 90) * Math.PI) / 180;
    h += `<line class="tick" x1="${100 + 80 * Math.cos(ang)}" y1="${100 + 80 * Math.sin(ang)}" x2="${100 + 96 * Math.cos(ang)}" y2="${100 + 96 * Math.sin(ang)}"/>`;
    h += `<text class="tick-l${i <= step ? " on" : ""}" x="${100 + 70 * Math.cos(mid)}" y="${100 + 70 * Math.sin(mid) + 2.5}" text-anchor="middle">${String(i + 1).padStart(2, "0")}</text>`;
  });
  g.innerHTML = h;
  setStep(step);
}
function setStep(i) {
  step = i;
  $("#needle").style.setProperty("--r", (i + 1) * 60 + "deg");
  $("#dial-prog").style.strokeDasharray = `${((i + 1) / STEPS.length) * 100} 100`;
  $("#dial-step").textContent = `${i + 1} / ${STEPS.length}`;
  $$("#steps li").forEach((li, k) => li.classList.toggle("on", k === i));
  $$(".tick-l").forEach((tl, k) => tl.classList.toggle("on", k <= i));
}
onRender(renderSteps);
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setStep(+e.target.dataset.i); }), { rootMargin: "-45% 0px -45% 0px" });
  onRender(() => { io.disconnect(); $$("#steps li").forEach((li) => io.observe(li)); });
}

// ---------- 6 詩 ----------
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("lit"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -18% 0px" });
  $$("#poem p:not(.poem-last)").forEach((p, i) => { p.style.animationDelay = (i % 2) * 0.15 + "s"; io.observe(p); });
}

// ---------- 7 日程のこよみ ----------
let picked = null, slot = null, askDate = null;
const byDay = SESSIONS.reduce((o, s) => { const [d, h] = s.split(" "); (o[d] = o[d] || []).push(h); return o; }, {});
function renderCal() {
  const now = nowSyd(), today = now.slice(0, 10);
  const months = [...new Set(SESSIONS.map((s) => s.slice(0, 7)))];
  if (!picked || !byDay[picked] || picked < today) picked = Object.keys(byDay).find((d) => d >= today) || null;
  $("#cal").innerHTML = months.map((ym) => {
    const [y, m] = ym.split("-").map(Number), n = new Date(Date.UTC(y, m, 0)).getUTCDate(), lead = (wday(`${ym}-01`) + 6) % 7;
    let cells = "<span></span>".repeat(lead);
    for (let d = 1; d <= n; d++) {
      const ds = `${ym}-${String(d).padStart(2, "0")}`, cls = (ds < today ? " past" : "") + (ds === today ? " today" : "");
      if (byDay[ds] && ds >= today) {
        const lab = `${fDate(ds, true)}, ${byDay[ds].map(fTime).join(" / ")}`;
        cells += `<button class="d${cls}" type="button" data-d="${ds}" aria-pressed="${ds === picked}" aria-label="${esc(lab)}">${d}</button>`;
      } else cells += `<span class="d${cls}">${d}</span>`;
    }
    const wk = [1, 2, 3, 4, 5, 6, 0].map((w) => `<span>${t(WD[w])}</span>`).join("");
    return `<div class="month"><h3>${t([MONTH[m - 1], `${m}月`])}<small>${y}</small></h3><div class="wk">${wk}</div><div class="days">${cells}</div></div>`;
  }).join("");
  renderDay();
  $("#asof").textContent = t(ASOF);
}
function renderDay() {
  const el = $("#day");
  if (!picked) { el.innerHTML = `<p>${t(["New dates are added regularly. Please ask us below.", "日程は随時追加しています。下のフォームからお問い合わせください。"])}</p>`; return; }
  const times = byDay[picked];
  if (!times.includes(slot)) slot = times[0];
  el.innerHTML = `<p class="lbl">${t(["Selected date", "選んだ日"])}</p><h3>${fDate(picked, true)}</h3>
    <div class="times" role="group" aria-label="${t(["Time", "時間"])}">${times.map((h) => { const [hh, mm] = h.split(":").map(Number), e = `${String(hh + 2).padStart(2, "0")}:${String(mm).padStart(2, "0")}`; return `<button class="slot" type="button" data-h="${h}" aria-pressed="${h === slot}"><b>${fTime(h)}</b><span>${t([`until ${fTime(e)} · 2 hours`, `${fTime(e)} まで · 2時間`])}</span></button>`; }).join("")}</div>
    <div class="day-acts"><a class="btn btn--ink" href="${CB_URL}" target="_blank" rel="noopener">${t(["Book on ClassBento ↗", "予約ページへ進む ↗"])}</a>
    <button class="btn btn--line" type="button" id="ask-this">${t(["Ask about this date", "この日について質問する"])}</button></div>`;
}
$("#cal").addEventListener("click", (e) => {
  const b = e.target.closest("button.d"); if (!b) return;
  picked = b.dataset.d;
  $$("#cal button.d").forEach((x) => x.setAttribute("aria-pressed", x === b));
  renderDay();
  if (!reduce && window.gsap) gsap.from("#day > *", { y: 10, opacity: 0, duration: 0.35, stagger: 0.04, ease: "power2.out", clearProps: "all" });
});
function toForm(kind) {
  $(`input[name="kind"][value="${kind}"]`).checked = true; renderPick();
  $("#ask").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  setTimeout(() => $('input[name="name"]').focus({ preventScroll: true }), reduce ? 0 : 700);
}
$("#day").addEventListener("click", (e) => {
  const sl = e.target.closest(".slot");
  if (sl) { slot = sl.dataset.h; $$("#day .slot").forEach((x) => x.setAttribute("aria-pressed", x === sl)); return; }
  if (e.target.closest("#ask-this")) { askDate = picked; toForm("other"); }
});
onRender(renderCal);
// ClassBento の予約部品があれば、こよみと入れ替える（貼ったコードの script も動かす）
if (CB_EMBED.trim()) {
  const cb = $("#cb");
  cb.innerHTML = CB_EMBED;
  cb.querySelectorAll("script").forEach((old) => { const s = document.createElement("script"); [...old.attributes].forEach((a) => s.setAttribute(a.name, a.value)); s.text = old.textContent; old.replaceWith(s); });
  cb.hidden = false; $(".cal-wrap").hidden = true; $("#asof").hidden = true;
} else $("#cb-note").hidden = false;

// ---------- 8 口コミ ----------
let embla = null;
function renderReviews() {
  $("#rv-track").innerHTML = REVIEWS.map((r) => `<article class="card${r.q.length > 420 ? " long" : ""}"><q lang="en">${esc(r.q)}</q><footer><b>${esc(r.n)}</b><span>${lang === "ja" ? `${r.m.slice(-4)}年${MO.indexOf(r.m.slice(0, 3)) + 1}月に参加` : "Attended " + r.m}</span></footer></article>`).join("");
  if (embla) embla.reInit();
}
onRender(renderReviews);
function rvState() {
  if (!embla) return;
  $("#rv-prev").disabled = !embla.canScrollPrev(); $("#rv-next").disabled = !embla.canScrollNext();
  $("#rv-count").textContent = `${embla.selectedScrollSnap() + 1} / ${embla.scrollSnapList().length}`;
}

// ---------- 11 予約・お問い合わせ ----------
const kindNow = () => $('input[name="kind"]:checked').value;
function renderPick() {
  const kind = kindNow();
  $("#pick").hidden = !(kind === "other" && askDate);
  if (askDate) {
    $("#pick-v").textContent = fDate(askDate, true);
    $("#pick-x").textContent = t(["Change", "変更する"]);
  }
  $("#guests-f").hidden = !(kind === "private" || kind === "gift");
  $(".send").textContent = kind === "gift" ? t(["Request a gift voucher", "ギフト券を申し込む"]) : t(["Send", "送る"]);
}
$("#pick-x").addEventListener("click", () => { $("#dates").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });
$(".kinds").addEventListener("change", () => { renderGuests(); renderPick(); });
$("#gift-go").addEventListener("click", () => toForm("gift"));
let guests = 2;
function renderGuests() {
  $$("#guests button").forEach((b, i) => b.setAttribute("aria-pressed", i + 1 === guests));
  const gift = kindNow() === "gift";
  $("#g-total").innerHTML = guests <= 4
    ? t([`<b>$${guests * PRICE}</b> for ${guests} ${guests === 1 ? "guest" : "guests"} ($${PRICE} each)`, `${guests}名で <b>$${guests * PRICE}</b>（1名 $${PRICE}）`])
    : gift ? t(["For 5 or more, we will reply with the details.", "5名以上の場合は、内容を確認してご返信します。"])
    : t(["Classes are for 1 to 4 guests. For a larger group, ask us about a private class.", "1回の定員は1〜4名です。5名以上は貸切でご相談ください。"]);
}
$("#guests").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  guests = [...b.parentNode.children].indexOf(b) + 1;
  renderGuests(); renderPick();
});
onRender(() => { renderPick(); renderGuests(); });
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target, bad = [f.name, f.email].filter((x) => !x.value.trim() || (x.type === "email" && !/^\S+@\S+\.\S+$/.test(x.value)));
  [f.name, f.email].forEach((x) => x.classList.toggle("bad", bad.includes(x)));
  const out = $("#form-out");
  out.setAttribute("role", bad.length ? "alert" : "status");
  if (bad.length) { out.classList.remove("ok"); out.textContent = t(["Please add your name and a valid email.", "お名前とメールアドレスを入力してください。"]); bad[0].focus(); return; }
  out.classList.add("ok");
  out.textContent = t(["Thank you. This is a design sample, so nothing was sent.", "ありがとうございます。ご提案用の試作のため、送信はされていません。"]);
});

// ---------- 見出しのしるし（いま見ている場所） ----------
if ("IntersectionObserver" in window) {
  const links = $$(".nav a");
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-40% 0px -55% 0px" });
  $$("main section[id]").forEach((sec) => io.observe(sec));
}

// ---------- 現れる動き ----------
if (!reduce && "IntersectionObserver" in window) {
  $$(".what-head, .what-body > *, .pieces-head, .special-list > li, .flow-text > .lbl, .flow-text > h2, .dates-head > *, .month, .t-text > *, .addr, .ask-head > *").forEach((el) => el.classList.add("rise"));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$(".rise, .curtain").forEach((el, i) => { el.style.transitionDelay = (el.classList.contains("rise") ? (i % 3) * 0.06 : 0) + "s"; io.observe(el); });
} else $$(".curtain").forEach((el) => el.classList.add("in"));

applyLang();

// ---------- ライブラリを使う部分（defer の後） ----------
window.addEventListener("DOMContentLoaded", () => {
  if (window.EmblaCarousel) {
    embla = EmblaCarousel($("#rv-view"), { align: "start", containScroll: "trimSnaps", dragFree: false });
    $("#rv-prev").addEventListener("click", () => embla.scrollPrev());
    $("#rv-next").addEventListener("click", () => embla.scrollNext());
    embla.on("select", rvState); embla.on("reInit", rvState); rvState();
  }
  if (!reduce && window.gsap) {
    // 5.0 を数え上げる
    const s = $("#score"), o = { v: 0 };
    new IntersectionObserver(([e], ob) => { if (!e.isIntersecting) return; ob.disconnect(); gsap.to(o, { v: 5, duration: 1.1, ease: "power2.out", onUpdate: () => (s.textContent = o.v.toFixed(1)) }); }, { rootMargin: "0px 0px -20% 0px" }).observe(s);
    // 駅の線が伸びる
    const st = $(".stations");
    st.style.setProperty("--line", 0);
    new IntersectionObserver(([e], ob) => { if (!e.isIntersecting) return; ob.disconnect(); gsap.to(st, { "--line": 1, duration: 0.9, ease: "power2.out" }); gsap.from(".stations li", { x: -10, opacity: 0, duration: 0.4, stagger: 0.12, ease: "power2.out", clearProps: "all" }); }, { rootMargin: "0px 0px -15% 0px" }).observe(st);
  }
});
