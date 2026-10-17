// Hiscoes Gym（試作 v2）：緑の幕・いま開いているか・会員の選び方・プログラムの棚・スクワッシュの早見・体験の申し込み
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap, anim = !!G && !RM;
  if (G && window.ScrollTrigger) G.registerPlugin(ScrollTrigger);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const JOIN = "https://hiscoes.gymmasteronline.com/portal/signup";

  // ---------- いま開いているか ----------
  const HRS = [[360, 1320], [360, 1320], [360, 1320], [360, 1320], [360, 1260], [420, 1140], [480, 1140]]; // 月〜日
  const t12 = (m) => { const h = Math.floor(m / 60); return `${((h + 11) % 12) + 1}${h < 12 ? "am" : "pm"}`; };
  function tick() {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const d = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday.slice(0, 3)), m = (+p.hour % 24) * 60 + +p.minute;
    const [o, c] = HRS[d], open = m >= o && m < c;
    const nd = (d + 1) % 7;
    $("#now-t").textContent = open ? `Open now · until ${t12(c)}` : m < o ? `Opens today ${t12(o)}` : `Opens tomorrow ${t12(HRS[nd][0])}`;
    $("#now-s .dot").classList.toggle("off", !open);
    $$("#hours [data-d]").forEach((r) => r.classList.toggle("today", r.dataset.d.split(",").map(Number).includes(d)));
  }
  tick(); setInterval(tick, 60000);

  // ---------- 会員の選び方 ----------
  const BASE = [["gym", "Gym Access"], ["classic", "All Classic Classes"], ["squash", "Squash Court Hire"], ["squash", "Beginner Squash Coaching"], ["gym", "Personalised Strength Program"], ["gym", "Nutrition Consult"]];
  const PLUS = [["team", "Unlimited Team Training"], ["team", "Unlimited Reformer Pilates"], ["sauna", "Private Infrared Sauna"]];
  const PLANS = [
    { id: "classic", name: "Classic", price: 32, note: "Normally 12 months commitment – just 6 months!", has: ["gym", "classic", "squash"], extra: false, cta: "Join here" },
    { id: "results", name: "Results", price: 50, note: "", has: ["gym", "classic", "squash", "team", "sauna"], extra: true, cta: "Join here" },
    { id: "premium", name: "Premium", price: 84, note: "Recommended", has: ["gym", "classic", "squash", "team", "sauna"], extra: true, cta: "2 week trial", flag: "Recommended" },
  ];
  const plans = $("#plans");
  plans.innerHTML = PLANS.map((p) => `<article class="plan" data-p="${p.id}">${p.flag ? `<span class="plan__flag">${p.flag}</span>` : ""}<h3>${p.name}</h3><p class="plan__p">$${p.price}<small>per week</small></p><p class="plan__n">${p.id === "classic" ? p.note : ""}</p>
    <ul>${(p.extra ? PLUS : []).map(([, t]) => `<li>${t}</li>`).join("")}${!p.extra ? PLUS.map(([, t]) => `<li class="no">${t}</li>`).join("") : ""}${BASE.map(([, t]) => `<li>${t}</li>`).join("")}</ul>
    <a class="btn ${p.id === "premium" ? "btn--k" : "btn--line"}" href="${JOIN}" target="_blank" rel="noopener">Go to join page <span aria-hidden="true">&nearr;</span></a></article>`).join("");
  function choose() {
    const want = $$("#want input:checked").map((i) => i.value);
    let best = null;
    PLANS.forEach((p) => {
      const ok = want.every((w) => p.has.includes(w));
      const el = $(`[data-p="${p.id}"]`, plans);
      el.classList.toggle("is-out", !ok);
      if (ok && !best) best = p.id;
    });
    $$(".plan", plans).forEach((el) => {
      const on = el.dataset.p === best;
      el.classList.toggle("is-best", on);
      let tag = $(".plan__fit", el);
      if (on && !tag) { el.querySelector(".plan__n").insertAdjacentHTML("afterend", '<p class="fine plan__fit" style="margin:-6px 0 12px;color:#141414;font-weight:600">Covers everything you ticked, for the lowest price</p>'); if (anim) G.from(el, { scale: 0.98, duration: 0.3, clearProps: "all" }); }
      if (!on && tag) tag.remove();
    });
  }
  $$("#want input").forEach((i) => i.addEventListener("change", choose));
  choose();

  // ---------- プログラムの棚 ----------
  $$("#ptabs button").forEach((b) => b.addEventListener("click", () => {
    $$("#ptabs button").forEach((x) => x.setAttribute("aria-selected", x === b));
    $$(".shelf").forEach((s) => (s.hidden = s.dataset.s !== b.dataset.s));
    if (anim) G.from(`.shelf[data-s="${b.dataset.s}"] .pg`, { opacity: 0, x: 16, duration: 0.3, stagger: 0.04, clearProps: "all" });
  }));

  // ---------- スクワッシュの早見（今のサイトの FAQ から） ----------
  const SQ = {
    new: ["Beginner coaching", "Come along to our beginner training sessions on either 5.45pm Tuesdays, or 11am on Saturdays. Free group coaching for beginners is included in your membership."],
    area: ["Club practice", "Come along to our club practice Monday nights from 8pm or Saturday afternoons from midday and meet some players of a similar level. Free for Hiscoes members, $25 non-members."],
    team: ["Pennant teams", "Hiscoes has teams of various level who play in the Sydney Pennant competition."],
    comp: ["Friday Round Robin", "Come along to our Friday night Round Robin to get in some gameplay practice."],
  };
  function sq(k) {
    $$("#sq button").forEach((b) => b.setAttribute("aria-checked", b.dataset.k === k));
    $("#sq-a").innerHTML = `<b>${SQ[k][0]}</b><p>${SQ[k][1]}</p>`;
    if (anim) G.from("#sq-a > *", { opacity: 0, y: 8, duration: 0.3, stagger: 0.05, clearProps: "all" });
  }
  $$("#sq button").forEach((b) => b.addEventListener("click", () => sq(b.dataset.k)));
  sq("new");

  // ---------- 体験の申し込み ----------
  $("#tform").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, d = Object.fromEntries(new FormData(f)), ints = $$("#t-int input:checked").map((i) => i.value);
    const bad = ["name", "email"].filter((k) => !String(d[k] || "").trim() || (k === "email" && !/^\S+@\S+\.\S+$/.test(d[k])));
    $$("input,textarea", f).forEach((i) => i.removeAttribute("aria-invalid"));
    bad.forEach((k) => f.elements[k].setAttribute("aria-invalid", "true"));
    $("#t-err").hidden = !bad.length;
    if (bad.length) { f.elements[bad[0]].focus(); return; }
    const body = ["Hi Hiscoes,", "", "I'd like to book a 3-day trial.", ints.length ? `Most interested in: ${ints.join(", ")}` : "", d.msg || "", "", `Name: ${d.name}`, `Email: ${d.email}`, d.phone ? `Phone: ${d.phone}` : ""].filter((x, i, a) => x !== "" || (i > 0 && a[i - 1] !== "")).join("\n");
    location.href = `mailto:info@hiscoes.com.au?subject=${encodeURIComponent("3-day trial request")}&body=${encodeURIComponent(body)}`;
  });

  // ---------- 案内の印・メニュー ----------
  const here = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) $$("#pnav a").forEach((a) => a.classList.toggle("is-here", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-40% 0px -55% 0px" });
  ["join", "programs", "squash", "gym", "trial", "contact"].forEach((id) => here.observe(document.getElementById(id)));
  const mb = $(".menu-btn"), pillar = $("#pillar");
  mb.addEventListener("click", () => { const o = mb.getAttribute("aria-expanded") !== "true"; pillar.style.setProperty("--navtop", Math.round(pillar.getBoundingClientRect().bottom) + "px"); mb.setAttribute("aria-expanded", o); pillar.classList.toggle("is-open", o); });
  const closeMenu = () => { mb.setAttribute("aria-expanded", "false"); pillar.classList.remove("is-open"); };
  $$("#pnav a, .pillar__cta a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("click", (e) => { if (pillar.classList.contains("is-open") && !pillar.contains(e.target)) closeMenu(); }, true);
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  let sy0 = 0; mb.addEventListener("click", () => { sy0 = scrollY; });
  addEventListener("scroll", () => { if (pillar.classList.contains("is-open") && Math.abs(scrollY - sy0) > 40) closeMenu(); }, { passive: true });

  // ---------- 幕開けと動き ----------
  const root = document.documentElement;
  function reveals() {
    if (!anim) return;
    G.timeline().from(".hero__h", { opacity: 0, y: 30, duration: 0.5, clearProps: "all" }).from(".hero__p", { opacity: 0, y: 14, duration: 0.4, clearProps: "all" }, 0.15).from(".hero__stats li", { opacity: 0, y: 16, duration: 0.35, stagger: 0.07, clearProps: "all" }, 0.25);
    if (!window.ScrollTrigger) return;
    G.from(".plan", { opacity: 0, y: 26, duration: 0.45, stagger: 0.1, clearProps: "all", scrollTrigger: { trigger: "#plans", start: "top 85%", once: true } });
    G.from(".gym__grid figure", { opacity: 0, scale: 0.94, duration: 0.5, stagger: 0.07, clearProps: "all", scrollTrigger: { trigger: ".gym__grid", start: "top 85%", once: true } });
  }
  if (root.classList.contains("op") && anim) {
    G.timeline({ onComplete: () => { root.classList.remove("op"); reveals(); } })
      .fromTo(".opening", { scaleX: 1 }, { scaleX: 0, duration: 0.7, ease: "power3.inOut", delay: 0.2 })
      .add(() => { $("main").style.visibility = "visible"; $(".pillar__in").style.visibility = "visible"; }, 0.2)
      .from(".est", { rotation: -180, scale: 0.4, duration: 0.6, ease: "back.out(1.6)", clearProps: "all" }, 0.4)
      .add(() => { $("main").style.visibility = ""; $(".pillar__in").style.visibility = ""; });
  } else { root.classList.remove("op"); }
})();
