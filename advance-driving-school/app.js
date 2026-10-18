// Advance Driving School（試作 v2）：5章を横に送る・進み具合の L/P プレート・時間数で料金とログブック・予約メール
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap, anim = !!G && !RM;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  if (/[?&]all\b/.test(location.search)) document.documentElement.classList.add("all");   // 撮影用：全章を縦に並べる
  const chs = $$(".ch"), tabs = $$("#tabs a"), road = $(".road"), plate = $("#plate");
  const IDS = chs.map((c) => c.id);
  let cur = -1;

  // ---------- 章を送る ----------
  function go(i, first) {
    i = (i + chs.length) % chs.length;
    if (i === cur) return;
    const old = chs[cur], nu = chs[i], dir = i > cur ? 1 : -1;
    const show = () => {
      if (old) old.classList.remove("is-on");
      nu.classList.add("is-on");
      if (!first) window.scrollTo({ top: 0, behavior: "auto" });
      if (anim && !first) G.fromTo(nu.firstElementChild, { x: 40 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: "power2.out", clearProps: "transform,opacity" });
      enter(i);
    };
    if (anim && old && !first) G.to(old.firstElementChild, { x: -30 * dir, opacity: 0, duration: 0.15, ease: "power1.in", onComplete: () => { G.set(old.firstElementChild, { clearProps: "transform,opacity" }); show(); } });
    else show();
    cur = i;
    tabs.forEach((t, k) => t.setAttribute("aria-current", k === i));
    document.body.classList.remove("st-l", "st-r", "st-g");
    document.body.classList.add(i < 2 ? "st-l" : i < 4 ? "st-r" : "st-g");
    road.style.setProperty("--p", ((i + 1) / chs.length) * 100 + "%");
    plate.textContent = i < 2 ? "L" : "P";
    if (!first) history.replaceState(null, "", "#" + IDS[i]);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-go]");
    if (!a) return;
    e.preventDefault();
    if (a.hasAttribute("data-gift")) prefill("", "I would like to ask about a gift voucher (prepaid driving lessons).");
    go(+a.dataset.go);
  });
  addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, select") || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "ArrowRight") go(cur + 1);
    if (e.key === "ArrowLeft") go(cur - 1);
  });
  addEventListener("hashchange", () => { const k = IDS.indexOf(location.hash.slice(1)); if (k >= 0) go(k); });

  // 章に入ったときの動き
  const done = new Set();
  function enter(i) {
    if (i === 0 && !done.has(0)) {
      done.add(0);
      const el = $(".count"), to = +el.dataset.to;
      if (anim) { const o = { v: 1985 }; G.to(o, { v: 1985 + to, duration: 1, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v) - 1985) }); }
    }
    if (i === 3) fillLog(true);
  }

  // ---------- 創業からの年数 ----------
  const year = +new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", year: "numeric" }).format(new Date());
  $(".count").dataset.to = year - 1985; $(".count").textContent = year - 1985;

  // ---------- 時間数で料金とログブック ----------
  let H = 1;
  $("#hrs").innerHTML = Array.from({ length: 10 }, (_, k) => `<button type="button" aria-pressed="${k === 0}" data-h="${k + 1}">${k + 1}<small>${k ? "hours" : "hour"}</small></button>`).join("");
  const grid = $("#grid");
  grid.innerHTML = "<i></i>".repeat(30);
  function plan(h) {
    if (h === 10) return { t: 850, how: "Current special: 10 lessons for $850" };
    const d = Math.floor(h / 2), s = h % 2;
    const parts = [];
    if (d) parts.push(`${d} × Double Time (2 hour lesson, $175)`);
    if (s) parts.push(`${s} × Structured Lesson ($95)`);
    return { t: d * 175 + s * 95, how: parts.join(" + ") };
  }
  const tot = $("#tot"), shown = { v: 95 };
  function render() {
    const p = plan(H), save = H * 95 - p.t;
    if (anim) G.to(shown, { v: p.t, duration: 0.4, ease: "power2.out", overwrite: true, onUpdate: () => (tot.textContent = Math.round(shown.v)) });
    else tot.textContent = p.t;
    $("#how").textContent = p.how;
    const sv = $("#save"); sv.hidden = save <= 0; sv.textContent = `You save $${save} compared with single hours`;
    $("#logn").textContent = `${H * 3} hours`;
    fillLog(false);
  }
  function fillLog(fromZero) {
    const cells = $$("i", grid), n = H * 3;
    if (anim && fromZero) {
      cells.forEach((c) => c.classList.remove("on"));
      cells.slice(0, n).forEach((c, k) => setTimeout(() => c.classList.add("on"), 120 + k * 25));
    } else cells.forEach((c, k) => c.classList.toggle("on", k < n));
  }
  $("#hrs").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    H = +b.dataset.h;
    $$("#hrs button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    render();
  });
  $("#take").addEventListener("click", () => {
    const p = plan(H);
    prefill(`${H} ${H > 1 ? "hours" : "hour"}: ${p.how}${H === 10 ? "" : ` = $${p.t}`}`, "");
    go(4);
  });
  render();

  // ---------- 予約フォーム ----------
  const sel = $("#sel"), msg = $("#msg");
  function prefill(choice, text) {
    sel.hidden = !choice; sel.textContent = choice ? `Your choice: ${choice}` : "";
    sel.dataset.v = choice;
    if (text && !msg.value.trim()) msg.value = text;
  }
  $("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, err = $("#err");
    const first = f.first.value.trim(), phone = f.phone.value.trim();
    const miss = [!first && "your first name", !phone && "a contact number"].filter(Boolean);
    if (miss.length) { err.textContent = `Please add ${miss.join(" and ")}.`; err.hidden = false; return; }
    err.hidden = true;
    const lines = [
      sel.dataset.v ? `Lessons: ${sel.dataset.v}` : "",
      `Name: ${first} ${f.last.value.trim()}`.trim(),
      `Contact number: ${phone}`,
      f.email.value.trim() ? `Email: ${f.email.value.trim()}` : "",
      f.addr.value.trim() ? `Pick-up address: ${f.addr.value.trim()}` : "",
      f.date.value ? `Preferred date: ${f.date.value}` : "",
      f.time.value ? `Preferred time: ${f.time.value}` : "",
      `Transmission: ${f.tr.value}`,
      msg.value.trim() ? `\n${msg.value.trim()}` : "",
    ].filter(Boolean).join("\n");
    location.href = `mailto:enquiries@advancedrivingschool.com.au?subject=${encodeURIComponent("Booking a driving lesson: " + first)}&body=${encodeURIComponent(lines)}`;
  });

  // ---------- はじめ ----------
  const k = IDS.indexOf(location.hash.slice(1));
  go(k >= 0 ? k : 0, true);
})();
