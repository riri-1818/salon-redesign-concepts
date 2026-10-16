// Miss Moss Makeup（試作 v2）：素顔から仕上がりへの幕開け・章をめくる・目次と写真・メニューと見積もり・ビフォーアフター・結婚式とイベント・当日の段取り・問い合わせ
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap;
  if (G && window.Draggable) G.registerPlugin(Draggable);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad2 = (n) => String(n).padStart(2, "0");
  const anim = !!G && !RM;

  // ---------- 章 ----------
  const CH = $$(".ch").map((c) => c.id.slice(2));
  let cur = null;
  const enter = {};   // 章を開いたときの動き

  function route() {
    const id = (location.hash.replace(/^#\/?/, "") || "hello");
    go(CH.includes(id) ? id : "hello");
  }
  function go(id) {
    if (id === cur) return;
    const next = $("#v-" + id), prev = cur && $("#v-" + cur);
    const dir = cur ? Math.sign(CH.indexOf(id) - CH.indexOf(cur)) || 1 : 0;
    cur = id;
    window.scrollTo(0, 0);
    next.classList.add("is-on");
    $$("img[data-src]", next).forEach((im) => { im.src = im.dataset.src; im.removeAttribute("data-src"); });
    if (prev) {
      prev.classList.remove("is-on");
      if (anim) {
        prev.classList.add("is-leaving"); prev.inert = true;
        G.to(prev, { xPercent: -6 * dir, opacity: 0, duration: 0.35, ease: "power2.in", onComplete: () => { prev.classList.remove("is-leaving"); prev.inert = false; G.set(prev, { clearProps: "all" }); } });
        G.fromTo(next, { xPercent: 8 * dir, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.5, delay: 0.12, ease: "power3.out", clearProps: "all" });
      }
    }
    const i = CH.indexOf(id);
    $$("#tabs a").forEach((a) => a.classList.toggle("is-on", a.getAttribute("href") === "#/" + id));
    $(".hd-cta").classList.toggle("is-on", id === "enquire");
    $("#pg-now").innerHTML = `<i>${next.dataset.n}</i> ${next.dataset.name}`;
    $('[data-go="-1"]').disabled = i === 0;
    $('[data-go="1"]').disabled = i === CH.length - 1;
    document.title = `Miss Moss Makeup | ${next.dataset.title}`;
    if (enter[id]) enter[id]();
  }
  $$("[data-go]").forEach((b) => b.addEventListener("click", () => { const i = CH.indexOf(cur) + +b.dataset.go; if (CH[i]) location.hash = "#/" + CH[i]; }));
  addEventListener("hashchange", route);
  const tabs = $("#tabs"), pgNow = $("#pg-now");
  const menuOpen = (o) => { if (o) tabs.style.top = Math.round($(".top").getBoundingClientRect().bottom) + "px"; pgNow.setAttribute("aria-expanded", o); tabs.classList.toggle("is-open", o); };
  pgNow.addEventListener("click", () => menuOpen(pgNow.getAttribute("aria-expanded") !== "true"));
  $$("a", tabs).forEach((a) => a.addEventListener("click", () => menuOpen(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape") menuOpen(false); });

  // ---------- 幕開け ----------
  function opening(done) {
    const root = document.documentElement;
    if (!root.classList.contains("op") || !anim) { root.classList.remove("op"); return done(); }
    G.timeline({ onComplete: () => { root.classList.remove("op"); done(); } })
      .to(".op__a", { clipPath: "inset(0 0% 0 0)", duration: 0.75, ease: "power2.inOut" }, 0.15)
      .fromTo(".op__line", { left: "0%" }, { left: "100%", duration: 0.75, ease: "power2.inOut" }, 0.15)
      .to(".op__logo", { opacity: 1, duration: 0.3 }, 0.75)
      .to(".opening", { opacity: 0, duration: 0.35 }, 1.25);
  }

  // ---------- I：目次と写真 ----------
  const CAP = { "p-mh": "Makeup & hair, from The menu", "ba/05a": "An after, from Before & After", "wed/w04": "A bride, from the Weddings gallery", "ev/e08": "From the Events gallery", studio: "The studio in Alexandria", greer2: "Greer with one of her brides", greer: "Greer at work in the Alexandria studio" };
  const pic = $("#cover-pic"), cap = $("#cover-cap");
  let shown = "greer", want = "greer";
  function showPic(k) {
    want = k;
    if (k === shown) return;
    const img = new Image();
    img.className = "cover__img"; img.alt = ""; img.src = `img/${k}.jpg`;
    img.decode().catch(() => {}).then(() => {
      if (want !== k) return;
      const old = $$(".cover__img", pic);
      img.style.cssText = "position:absolute;top:0;left:0";
      pic.insertBefore(img, cap);
      shown = k; cap.textContent = CAP[k] || "";
      const done = () => { old.forEach((o) => o.remove()); img.style.cssText = ""; };
      if (anim) G.fromTo(img, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.5, ease: "power3.out", onComplete: done });
      else done();
    });
  }
  $$("#toc a").forEach((a) => {
    a.addEventListener("mouseenter", () => showPic(a.dataset.pic));
    a.addEventListener("focus", () => showPic(a.dataset.pic));
  });
  $("#toc").addEventListener("mouseleave", () => showPic("greer"));
  // 写真を先に読んでおく
  setTimeout(() => $$("#toc a").forEach((a) => { new Image().src = `img/${a.dataset.pic}.jpg`; }), 1800);

  // 口コミ
  const stage = $("#words"), wnav = $("#words-nav");
  WORDS.forEach((w, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "tab"); b.textContent = w.who;
    b.addEventListener("click", () => word(i));
    wnav.appendChild(b);
  });
  function word(i) {
    $$("button", wnav).forEach((b, k) => b.setAttribute("aria-selected", k === i));
    stage.innerHTML = `<blockquote class="words__q">&ldquo;${WORDS[i].text}&rdquo;<cite>${WORDS[i].who}</cite></blockquote>`;
    if (anim) G.from(stage.firstChild, { opacity: 0, y: 10, duration: 0.4, clearProps: "all" });
  }
  word(0);

  // ---------- II：メニュー ----------
  const menu = $("#menu");
  MENU.forEach((m) => {
    const d = document.createElement("article");
    d.className = "dish";
    d.innerHTML = `<div class="dish__ph"><img data-src="img/${m.img}.jpg" alt=""></div><div>
      <h3>${m.name}</h3>
      ${m.mobile ? `<p class="dish__p"><span>Studio</span><b>$${m.studio}</b></p><p class="dish__p"><span>Mobile service (from)</span><b>$${m.mobile}</b></p>` : `<p class="dish__p"><span>Studio only</span><b>$${m.studio}</b></p>`}
      ${m.text.map((t) => `<p class="dish__t">${t}</p>`).join("")}
      <p class="dish__inc">${m.inc}</p>${m.bridal ? `<p class="fine">*For bridal, please use the online enquiry form</p>` : ""}
      <div class="dish__act"><a class="btn btn--line" href="${BOOKING}" target="_blank" rel="noopener">Go to booking page <span aria-hidden="true">&nearr;</span></a><button type="button" class="txtlink linkbtn" data-price="${m.id}">Price for a group</button></div></div>`;
    menu.appendChild(d);
  });
  $$("[data-price]").forEach((b) => b.addEventListener("click", () => { q.svc = b.dataset.price; renderQ(); $("#quote").scrollIntoView({ behavior: anim ? "smooth" : "auto", block: "start" }); }));
  enter.menu = () => { if (anim) G.from(".dish", { opacity: 0, y: 18, duration: 0.45, stagger: 0.07, delay: 0.25, clearProps: "all" }); };

  // 見積もり
  const q = { svc: "mh", where: "studio", ppl: 1, pay: "cash", shown: 295 };
  const qsvc = $("#q-svc");
  MENU.forEach((m) => { const b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "radio"); b.dataset.svc = m.id; b.textContent = m.name; b.addEventListener("click", () => { q.svc = m.id; renderQ(); }); qsvc.appendChild(b); });
  $$("[data-where]").forEach((b) => b.addEventListener("click", () => { q.where = b.dataset.where; renderQ(); }));
  $$("[data-pay]").forEach((b) => b.addEventListener("click", () => { q.pay = b.dataset.pay; renderQ(); }));
  $$("[data-ppl]").forEach((b) => b.addEventListener("click", () => { q.ppl = Math.max(1, Math.min(12, q.ppl + +b.dataset.ppl)); renderQ(); }));
  $("#q-book").href = BOOKING;
  function renderQ() {
    const m = MENU.find((x) => x.id === q.svc);
    if (!m.mobile) q.where = "studio";
    $$("[data-svc]").forEach((b) => b.setAttribute("aria-checked", b.dataset.svc === q.svc));
    $$("[data-where]").forEach((b) => { b.setAttribute("aria-checked", b.dataset.where === q.where); b.disabled = b.dataset.where === "mobile" && !m.mobile; });
    $$("[data-pay]").forEach((b) => b.setAttribute("aria-checked", b.dataset.pay === q.pay));
    $("#q-ppl").textContent = q.ppl;
    $('[data-ppl="-1"]').disabled = q.ppl <= 1; $('[data-ppl="1"]').disabled = q.ppl >= 12;
    const each = q.where === "studio" ? m.studio : m.mobile, base = each * q.ppl, tot = Math.round(base * (q.pay === "card" ? 1.02 : 1) * 100) / 100;
    $("#q-sum").textContent = `${q.ppl} × ${m.name.toLowerCase()} ${q.where === "studio" ? "at the Alexandria studio" : "with the mobile service"}, $${each} each${q.pay === "card" ? ", plus the 2% card surcharge" : ""}`;
    $("#q-from").style.visibility = q.where === "mobile" ? "visible" : "hidden";
    const notes = [];
    if (!m.mobile) notes.push("Lessons are held at the studio only.");
    if (q.where === "mobile") notes.push("Mobile prices are “from”. A 4 person minimum for both makeup and hair is required for mobile bookings in rural locations.");
    if (m.bridal) notes.push('Booking for a wedding? Please use the <a class="txtlink" href="#/enquire" data-topic="Wedding">enquiry form</a> for a personalised quote.');
    if (q.ppl > 1) notes.push("Holding deposits are required for group bookings.");
    notes.push("Early morning fee applies for bookings before 6am.");
    $("#q-notes").innerHTML = notes.map((n) => `<li>${n}</li>`).join("");
    $$("#q-notes [data-topic]").forEach(topicLink);
    const el = $("#q-tot"), fmt = (v) => (Number.isInteger(tot) ? Math.round(v).toLocaleString("en-AU") : v.toFixed(2));
    if (anim) G.to(q, { shown: tot, duration: 0.45, ease: "power2.out", onUpdate: () => (el.textContent = fmt(q.shown)) });
    else el.textContent = fmt(tot);
  }
  renderQ();
  $("#terms-list").innerHTML = TERMS.map((t) => `<li>${t}</li>`).join("");

  // ---------- III：ビフォーアフター ----------
  const cmp = $("#cmp"), range = $("#cmp-range"), thumbs = $("#thumbs");
  let bi = 0;
  const setX = (v) => cmp.style.setProperty("--x", v + "%");
  range.addEventListener("input", () => setX(range.value));
  for (let i = 1; i <= BA; i++) {
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "option"); b.setAttribute("aria-label", `Face ${i}`);
    b.innerHTML = `<img src="img/ba/${pad2(i)}t.jpg" width="120" height="240" alt="">`;
    b.addEventListener("click", () => face(i - 1, true));
    thumbs.appendChild(b);
  }
  function face(i, sweep) {
    bi = (i + BA) % BA;
    const n = pad2(bi + 1), a = new Image(), b = new Image();
    a.src = `img/ba/${n}a.jpg`; b.src = `img/ba/${n}b.jpg`;
    Promise.all([a.decode(), b.decode()].map((p) => p.catch(() => {}))).then(() => {
      $("#cmp-b").src = b.src; $("#cmp-ai").src = a.src;
      $("#ba-n").textContent = n;
      $$("button", thumbs).forEach((t, k) => t.setAttribute("aria-selected", k === bi));
      if (sweep) sweepLine();
    });
  }
  function sweepLine() {
    if (!anim) { range.value = 50; setX(50); return; }
    const o = { v: 88 };
    G.timeline().to(o, { v: 18, duration: 0.9, ease: "power2.inOut", onUpdate: () => { range.value = o.v; setX(o.v); } })
      .to(o, { v: 50, duration: 0.5, ease: "power2.out", onUpdate: () => { range.value = o.v; setX(o.v); } });
  }
  $$("[data-ba]").forEach((b) => b.addEventListener("click", () => face(bi + +b.dataset.ba, true)));
  face(0, false);
  enter["before-after"] = () => setTimeout(sweepLine, anim ? 450 : 0);

  // ---------- IV：結婚式 ----------
  const wed = $("#wed"), lb = $("#lb");
  let li = 0;
  for (let i = 1; i <= WED; i++) {
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label", `View wedding photo ${i}`);
    b.innerHTML = `<img data-src="img/wed/w${pad2(i)}.jpg" width="${WSZ[i - 1][0]}" height="${WSZ[i - 1][1]}" alt="Wedding makeup and hair by Miss Moss">`;
    b.addEventListener("click", () => { lbShow(i - 1); lb.showModal(); });
    wed.appendChild(b);
  }
  function lbShow(i) {
    li = (i + WED) % WED;
    $("#lb-img").src = `img/wed/w${pad2(li + 1)}.jpg`; $("#lb-img").alt = `Wedding photo ${li + 1}`;
    $("#lb-n").textContent = `${li + 1} / ${WED}`;
    if (anim) G.fromTo("#lb-img", { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.3, clearProps: "all" });
  }
  $$("[data-lb]").forEach((b) => b.addEventListener("click", () => lbShow(li + +b.dataset.lb)));
  $("#lb-x").addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") lbShow(li + 1); if (e.key === "ArrowLeft") lbShow(li - 1); });
  enter.weddings = () => { if (anim) G.from("#wed button", { opacity: 0, y: 24, duration: 0.5, stagger: 0.03, delay: 0.25, clearProps: "all" }); };

  // ---------- V：イベント（横に送る帯） ----------
  const reel = $("#reel"), view = $("#reel-view");
  for (let i = 1; i <= EV; i++) {
    const f = document.createElement("figure");
    f.innerHTML = `<img data-src="img/ev/e${pad2(i)}.jpg" width="${ESZ[i - 1][0]}" height="${ESZ[i - 1][1]}" alt="Event makeup and hair by Miss Moss">`;
    reel.appendChild(f);
  }
  let drag = null;
  const minX = () => Math.min(0, view.clientWidth - reel.scrollWidth);
  enter.events = () => {
    if (G && window.Draggable && !drag) drag = Draggable.create(reel, { type: "x", bounds: { minX: minX(), maxX: 0 }, edgeResistance: 0.85, onPress() { this.applyBounds({ minX: minX(), maxX: 0 }); } })[0];
    if (anim) G.from("#reel figure", { opacity: 0, x: 40, duration: 0.5, stagger: 0.04, delay: 0.25, clearProps: "opacity" });
  };
  $$("[data-reel]").forEach((b) => b.addEventListener("click", () => {
    const x = G ? G.getProperty(reel, "x") : 0;
    const nx = Math.max(minX(), Math.min(0, x - +b.dataset.reel * view.clientWidth * 0.8));
    if (G) G.to(reel, { x: nx, duration: anim ? 0.6 : 0, ease: "power2.out", onComplete: () => drag && drag.update() });
  }));

  // ---------- VI：当日の段取り ----------
  let dur = [90, 120];
  const tfmt = (m) => { m = ((m % 1440) + 1440) % 1440; const h = Math.floor(m / 60), mm = m % 60; return `${((h + 11) % 12) + 1}:${pad2(mm)}${h < 12 ? "am" : "pm"}`; };
  function plan() {
    const [h, m] = ($("#pl-time").value || "16:00").split(":").map(Number), ready = h * 60 + m;
    const s1 = ready - dur[1], s2 = ready - dur[0];
    $("#pl-from").textContent = tfmt(s1); $("#pl-to").textContent = tfmt(s2);
    const span = 150, L = (t) => ((t - (ready - span)) / span) * 100;
    const fill = $("#pl-fill");
    if (anim) G.to(fill, { left: L(s1) + "%", width: 100 - L(s1) + "%", duration: 0.5, ease: "power2.out" });
    else { fill.style.left = L(s1) + "%"; fill.style.width = 100 - L(s1) + "%"; }
    const ls = $("#pl-lab-s"), le = $("#pl-lab-e");
    ls.style.left = L(s1) + "%"; ls.textContent = "Start " + tfmt(s1);
    le.style.left = "100%"; le.style.transform = "translateX(-100%)"; le.textContent = "Ready " + tfmt(ready);
    $("#pl-note").textContent = dur[0] === 90 ? "Please allow approximately 1.5 – 2 hours for combined makeup and hair." : "For hair only or makeup only appointments please allow 45 mins – 1 hour.";
    $("#pl-warn").hidden = s1 >= 360;
  }
  $$("[data-dur]").forEach((b) => b.addEventListener("click", () => {
    dur = b.dataset.dur.split(",").map(Number);
    $$("[data-dur]").forEach((x) => x.setAttribute("aria-checked", x === b));
    plan();
  }));
  $("#pl-time").addEventListener("input", plan);
  plan();

  // ---------- VII：問い合わせ ----------
  function topicLink(a) {
    a.addEventListener("click", () => { const r = $(`#topics input[value="${a.dataset.topic}"]`); if (r) r.checked = true; });
  }
  $$("[data-topic]").forEach(topicLink);
  $$("[data-open]").forEach((a) => a.addEventListener("click", () => setTimeout(() => { const d = document.getElementById(a.dataset.open); d.open = true; d.scrollIntoView({ block: "start" }); }, 80)));
  $("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, d = Object.fromEntries(new FormData(f));
    const bad = ["name", "email", "phone"].filter((k) => !String(d[k] || "").trim() || (k === "email" && !/^\S+@\S+\.\S+$/.test(d[k])));
    $$("input", f).forEach((i) => i.removeAttribute("aria-invalid"));
    bad.forEach((k) => f.elements[k].setAttribute("aria-invalid", "true"));
    $("#form-err").hidden = !bad.length;
    if (bad.length) { f.elements[bad[0]].focus(); return; }
    const lines = ["Hi Greer,", "", d.msg || `I'd like to enquire about ${d.topic.toLowerCase()}.`, "", `Service: ${d.topic}`, `Studio or mobile: ${d.where}`];
    if (d.date) lines.push(`Date: ${d.date}`);
    if (d.ppl) lines.push(`Number of people: ${d.ppl}`);
    lines.push(`Name: ${d.name}`, `Email: ${d.email}`, `Phone: ${d.phone}`);
    location.href = `mailto:greer@missmossmakeup.com.au?subject=${encodeURIComponent("Makeup & Hair Enquiry: " + d.topic)}&body=${encodeURIComponent(lines.join("\n"))}`;
  });

  route();
  opening(() => {
    if (anim && cur === "hello") G.timeline()
      .from(".cover__h, .cover__p", { opacity: 0, y: 20, duration: 0.5, stagger: 0.08, clearProps: "all" })
      .from("#toc li", { opacity: 0, x: -16, duration: 0.4, stagger: 0.06, clearProps: "all" }, 0.2)
      .from(".cover__pic", { opacity: 0, duration: 0.5, clearProps: "all" }, 0.1);
  });
})();
