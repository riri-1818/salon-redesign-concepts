// Hay Tattoo（試作 v2）：画面の切り替え・ロゴの幕開け・フラッシュの壁（Flip）・作家の画面・予約メモ・アフターケアの帯
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap, anim = !!G && !RM;
  if (G && window.Flip) G.registerPlugin(Flip);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ALL = ARTISTS.flatMap((a) => a.works.map(([f, w, h]) => ({ a: a.id, name: a.name, f, w, h })));
  const byId = Object.fromEntries(ARTISTS.map((a) => [a.id, a]));

  // ---------- 画面 ----------
  const VIEWS = ["home", "flash", "artists", "book", "info"];
  let cur = null;
  function route() {
    const id = location.hash.replace(/^#\/?/, "") || "home";
    show(VIEWS.includes(id) ? id : "home");
  }
  function show(id) {
    if (id === cur) return;
    const next = $("#v-" + id), prev = cur && $("#v-" + cur);
    const dir = cur ? Math.sign(VIEWS.indexOf(id) - VIEWS.indexOf(cur)) || 1 : 0;
    cur = id;
    $$(".view").forEach((v) => v.classList.toggle("is-on", v === next));
    loadImgs(next);
    window.scrollTo(0, 0);
    if (prev && anim) G.fromTo(next, { opacity: 0, x: 30 * dir }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out", clearProps: "all" });
    $$("#nav a").forEach((a) => a.classList.toggle("is-on", a.getAttribute("href") === "#/" + id));
    $(".hd-cta").classList.toggle("is-on", id === "book");
    document.title = `Hay Tattoo | ${next.dataset.title}`;
    if (id === "info") careIn();
  }
  addEventListener("hashchange", route);
  function loadImgs(root) { $$("img[data-src]", root).forEach((im) => { im.src = im.dataset.src; im.removeAttribute("data-src"); }); }

  // ---------- いま開いているか（毎日 11–19） ----------
  function openNow() {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const m = (+p.hour % 24) * 60 + +p.minute, el = $("#open-now");
    const open = m >= 660 && m < 1140;
    el.textContent = open ? "Open now · until 7pm" : m < 660 ? "Opens today 11am" : "Opens tomorrow 11am";
    el.classList.toggle("is-open", open);
  }
  openNow(); setInterval(openNow, 60000);

  // ---------- トップ：小さな壁・作家 ----------
  const pick = [0, 5, 8, 15, 20, 30, 36, 40, 44, 52, 54, 57];
  $("#wall-mini").innerHTML = pick.map((i) => ALL[i]).filter(Boolean).map((w) => `<a href="#/flash" data-open="${ALL.indexOf(w)}" aria-label="${w.name}’s design"><img src="img/t/${w.f}" alt=""></a>`).join("");
  $("#crew").innerHTML = ARTISTS.map((a) => `<li><a class="cm" href="#/artists" data-artist="${a.id}"><figure><img src="img/p-${a.id}.jpg" width="700" height="700" alt="${a.name}" loading="lazy"></figure><span><b>${a.name}</b><small>${a.works.length} designs</small></span></a></li>`).join("");

  // ---------- フラッシュの壁 ----------
  const wall = $("#wall"), chips = $("#flash-chips");
  chips.innerHTML = `<button type="button" role="tab" aria-selected="true" data-a="">All<small>${ALL.length}</small></button>` + ARTISTS.map((a) => `<button type="button" role="tab" aria-selected="false" data-a="${a.id}">${a.name}<small>${a.works.length}</small></button>`).join("");
  wall.innerHTML = ALL.map((w, i) => `<button type="button" data-i="${i}" data-a="${w.a}" data-name="${w.name}" aria-label="Design by ${w.name}"><img data-src="img/t/${w.f}" width="${w.w}" height="${w.h}" alt="Flash design by ${w.name}"></button>`).join("");
  let filter = "";
  $$("button", chips).forEach((b) => b.addEventListener("click", () => setFilter(b.dataset.a)));
  function setFilter(a) {
    filter = a;
    $$("button", chips).forEach((x) => x.setAttribute("aria-selected", x.dataset.a === a));
    const items = $$("button", wall);
    const state = anim && window.Flip ? Flip.getState(items) : null;
    items.forEach((b) => (b.hidden = !!a && b.dataset.a !== a));
    if (state) Flip.from(state, { duration: 0.45, ease: "power2.inOut", absolute: true, onEnter: (els) => G.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.3 }), onLeave: (els) => G.to(els, { opacity: 0, duration: 0.2 }) });
  }
  $$("button", wall).forEach((b) => b.addEventListener("click", () => openLb(+b.dataset.i, filter)));

  // ---------- 拡大 ----------
  const lb = $("#lb");
  let set = [], si = 0;
  function openLb(i, a) {
    set = ALL.map((w, k) => k).filter((k) => !a || ALL[k].a === a);
    si = Math.max(0, set.indexOf(i));
    fillLb(); if (!lb.open) lb.showModal();
  }
  function fillLb() {
    const w = ALL[set[si]];
    $("#lb-img").src = `img/f/${w.f}`; $("#lb-img").alt = `Flash design by ${w.name}`;
    $("#lb-a").textContent = `${w.name} · ${si + 1} / ${set.length}`;
    $("#lb-book").dataset.artist = w.a; $("#lb-book").dataset.design = `${w.name}’s flash (${w.f.replace(".jpg", "")})`;
    if (anim) G.fromTo("#lb-img", { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.25, clearProps: "all" });
  }
  $$("[data-lb]").forEach((b) => b.addEventListener("click", () => { si = (si + +b.dataset.lb + set.length) % set.length; fillLb(); }));
  $("#lb-x").addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") { si = (si + 1) % set.length; fillLb(); } if (e.key === "ArrowLeft") { si = (si - 1 + set.length) % set.length; fillLb(); } });
  $("#lb-book").addEventListener("click", (e) => { lb.close(); bookWith(e.currentTarget.dataset.artist, e.currentTarget.dataset.design); });
  $$("[data-open]").forEach((a) => a.addEventListener("click", () => setTimeout(() => openLb(+a.dataset.open, ""), 60)));

  // ---------- 作家 ----------
  let curA = ARTISTS[0].id;
  $("#artist-tabs").innerHTML = ARTISTS.map((a) => `<button type="button" role="tab" aria-selected="false" data-a="${a.id}">${a.name}</button>`).join("");
  function artist(id) {
    curA = id; const a = byId[id];
    $$("#artist-tabs button").forEach((b) => b.setAttribute("aria-selected", b.dataset.a === id));
    $("#ar-img").src = `img/p-${id}.jpg`; $("#ar-img").alt = a.name;
    $("#ar-n").textContent = a.name;
    $("#ar-c").textContent = `${a.works.length} designs on our site. More of ${a.name}’s work is on Instagram.`;
    $("#ar-ig").href = `https://www.instagram.com/${a.ig}/`; $("#ar-ig").textContent = `@${a.ig}`;
    $("#ar-works").innerHTML = a.works.map(([f, w, h]) => `<button type="button" data-i="${ALL.findIndex((x) => x.f === f)}" aria-label="Design by ${a.name}"><img data-src="img/t/${f}" width="${w}" height="${h}" alt="Flash design by ${a.name}"></button>`).join("");
    $$("#ar-works button").forEach((b) => b.addEventListener("click", () => openLb(+b.dataset.i, id)));
    if (cur === "artists") loadImgs($("#v-artists"));
    if (anim) G.from(["#ar-n", "#ar-works button"], { opacity: 0, y: 14, duration: 0.35, stagger: 0.03, clearProps: "all" });
  }
  $$("#artist-tabs button").forEach((b) => b.addEventListener("click", () => artist(b.dataset.a)));
  $$("[data-artist]").forEach((a) => a.addEventListener("click", () => artist(a.dataset.artist)));
  $("#ar-book").addEventListener("click", () => bookWith(curA, ""));
  artist(curA);

  // ---------- 予約メモ ----------
  const PLACES = ["Forearm", "Upper arm", "Wrist", "Hand", "Shoulder", "Back", "Chest", "Ribs", "Hip", "Thigh", "Calf", "Ankle", "Neck"];
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Any day"];
  $("#b-artist").innerHTML = `<label><input type="radio" name="artist" value="" checked><span>Any artist</span></label>` + ARTISTS.map((a) => `<label><input type="radio" name="artist" value="${a.id}"><span>${a.name}</span></label>`).join("");
  $("#b-place").innerHTML = PLACES.map((p) => `<label><input type="radio" name="place" value="${p}"><span>${p}</span></label>`).join("");
  $("#b-day").innerHTML = DAYS.map((d) => `<label><input type="checkbox" name="day" value="${d}"><span>${d}</span></label>`).join("");
  const ruler = $("#ruler");
  ruler.innerHTML = "<i></i>" + [2, 10, 20, 30, 40].map((n) => `<span style="left:${((n - 2) / 38) * 100}%">${n}</span>`).join("");
  let design = "";
  const form = $("#bform");
  function message() {
    const d = new FormData(form), a = d.get("artist"), place = d.get("placeOther") || d.get("place") || "", days = d.getAll("day");
    const size = $("#b-size").value;
    $("#b-size-out").textContent = size;
    $("i", ruler).style.width = ((size - 2) / 38) * 100 + "%";
    const lines = [
      "Hi Hay Tattoo,", "", "I'd like to book a tattoo.", "",
      `Artist: ${a ? byId[a].name : "Any artist"}`,
      `Size: about ${size} cm`,
      `Placement: ${place || "(not sure yet)"}`,
      design ? `Design: ${design}` : null,
      `Idea: ${d.get("idea") || "(please describe your idea)"}`,
      `Day preference: ${days.length ? days.join(", ") : "(any)"}`,
      "", "I'll attach some reference pictures.", "", `Thanks, ${d.get("name") || ""}`,
    ].filter((x) => x !== null);
    $("#msg-t").textContent = lines.join("\n");
    $("#ref-d").hidden = !design; $("#ref-d").textContent = design ? `Design picked from the flash: ${design}` : "";
    return lines.join("\n");
  }
  form.addEventListener("input", message);
  form.addEventListener("change", message);
  function valid() {
    const bad = ["idea", "name"].filter((k) => !String(form.elements[k].value).trim());
    $$("input,textarea", form).forEach((i) => i.removeAttribute("aria-invalid"));
    bad.forEach((k) => form.elements[k].setAttribute("aria-invalid", "true"));
    $("#b-err").hidden = !bad.length;
    if (bad.length) form.elements[bad[0]].focus();
    return !bad.length;
  }
  $("#send-mail").addEventListener("click", () => { if (!valid()) return; location.href = `mailto:haytattoo.syd@gmail.com?subject=${encodeURIComponent("Booking request")}&body=${encodeURIComponent(message())}`; });
  $("#send-ig").addEventListener("click", async () => {
    if (!valid()) return;
    try { await navigator.clipboard.writeText(message()); $("#msg-fine").textContent = "Copied. Paste it into a DM to @hay_tattoo, then attach your reference pictures."; } catch (e) { $("#msg-fine").textContent = "Select the message above and copy it, then send it to @hay_tattoo."; }
    window.open("https://www.instagram.com/hay_tattoo/", "_blank", "noopener");
  });
  function bookWith(a, dsg) {
    const r = form.querySelector(`input[name="artist"][value="${a || ""}"]`); if (r) r.checked = true;
    design = dsg || ""; message();
  }
  message();

  // ---------- アフターケアの帯 ----------
  function careIn() { if (anim) G.from(".care__bar", { scaleX: 0, duration: 0.6, stagger: 0.12, ease: "power2.out", delay: 0.2, clearProps: "transform" }); }

  // ---------- メニュー（スマホ） ----------
  const mb = $(".menu-btn"), nav = $("#nav");
  mb.addEventListener("click", () => { const o = mb.getAttribute("aria-expanded") !== "true"; nav.style.setProperty("--navtop", Math.round($(".top").getBoundingClientRect().bottom) + "px"); mb.setAttribute("aria-expanded", o); nav.classList.toggle("is-open", o); });
  $$("#nav a").forEach((a) => a.addEventListener("click", () => { mb.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }));

  // ---------- 幕開け ----------
  route();
  const root = document.documentElement;
  if (root.classList.contains("op") && anim) {
    G.timeline({ onComplete: () => { root.classList.remove("op"); homeIn(); } })
      .fromTo(".opening img", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 0.7, ease: "power2.inOut" })
      .to(".opening", { opacity: 0, duration: 0.35 }, 1.0);
  } else { root.classList.remove("op"); }
  function homeIn() {
    if (!anim || cur !== "home") return;
    G.timeline()
      .from(".hero__h", { opacity: 0, y: 30, duration: 0.5, clearProps: "all" })
      .from(".hero__p, .hero__act", { opacity: 0, y: 14, duration: 0.4, stagger: 0.08, clearProps: "all" }, 0.15)
      .from(".wall-mini a", { opacity: 0, y: 30, duration: 0.4, stagger: 0.04, clearProps: "all" }, 0.1);
  }
})();
