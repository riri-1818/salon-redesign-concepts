// RaRa Ramen（新サイト案 v2）：店舗の切り替え（ページをまたいで覚える）・赤い幕・物語の行・Find your bowl・メニュー
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap, anim = !!G && !RM;
  if (G) { if (window.ScrollTrigger) G.registerPlugin(ScrollTrigger); if (window.Flip) G.registerPlugin(Flip); if (window.SplitText) G.registerPlugin(SplitText); }
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page, up = document.body.dataset.up || "";
  const EXT = '<svg class="ext" aria-hidden="true"><use href="#ext"/></svg>';
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };

  // ---------- 店舗の切り替え ----------
  let loc = store.get("rara-loc") === "randwick" ? "randwick" : "redfern";
  function applyLoc(first) {
    $$(".loc button").forEach((b) => b.setAttribute("aria-checked", b.dataset.loc === loc));
    $$("[data-href]").forEach((a) => { a.href = LOC[a.dataset.l || loc][a.dataset.href]; });
    $$("[data-card]").forEach((c) => c.classList.toggle("is-mine", c.dataset.card === loc));
    // 店舗ページ・予約ページは、選んだ店を先に
    ["#places", "#bookings"].forEach((sel) => {
      const box = $(sel); if (!box) return;
      const items = [...box.children], mine = items.find((x) => (x.dataset.place || x.dataset.l) === loc);
      const state = !first && anim && window.Flip ? Flip.getState(items) : null;
      items.forEach((x) => x.classList.toggle("is-mine", x === mine));
      if (mine && box.firstElementChild !== mine) box.prepend(mine);
      if (state) Flip.from(state, { duration: 0.5, ease: "power2.inOut" });
    });
    $$(".mi").forEach((m) => m.classList.toggle("is-elsewhere", m.dataset.at !== "both" && m.dataset.at !== loc));
    $$("[data-locname]").forEach((s) => (s.textContent = LOC[loc].name));
  }
  $$(".loc button").forEach((b) => b.addEventListener("click", () => { loc = b.dataset.loc; store.set("rara-loc", loc); applyLoc(false); }));

  // ---------- メニュー（スマホ） ----------
  const mb = $(".menu-btn"), nav = $("#nav");
  mb.addEventListener("click", () => {
    const o = mb.getAttribute("aria-expanded") !== "true";
    nav.style.setProperty("--navtop", Math.round($(".top").getBoundingClientRect().bottom) + "px");
    mb.setAttribute("aria-expanded", o); nav.classList.toggle("is-open", o);
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape") { mb.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); } });

  // ---------- Find your bowl ----------
  const find = (n) => MENU.find((m) => m.name.startsWith(n));
  const TREE = {
    pork: { dish: "Tonkotsu", pic: "crate.jpg" },
    chicken: { dish: "Tori Paitan", pic: "bowl.webp" },
    vegan: { q: [["Nutty, sweet miso", "Vegan Soy Miso"], ["Salt (shio), with grilled tomato", "Vegan Soy Shio"]], pic: "steam.jpg" },
    maze: { q: [["Coal grilled pork belly", "Pork Chashu Mazesoba"], ["Coal grilled chicken", "Chicken Chashu Mazesoba"], ["Karaage and truffle mayo", "Chicken Karaage Mazesoba"]], pic: "lift.jpg" },
    rice: { q: [["Pork chashu", "Pork Chashu Rice Bowl"], ["Chicken chashu", "Chicken Chashu Rice Bowl"]], pic: "ricebowl.jpg" },
  };
  const fa = $("#f-a"), fb = $("#f-b"), out = $("#f-out");
  function result(name, pic) {
    const m = find(name);
    out.innerHTML = `<div class="bowl"><figure class="bowl__ph"><img src="${up}img/${pic}" alt="From the RaRa kitchen"></figure><div class="bowl__in">
      <p class="bowl__k">Try the</p><h3 class="bowl__n">${m.name}</h3><p class="bowl__d">${m.desc}</p><p class="bowl__p">$${m.price}</p>
      <a class="btn btn--red" href="${LOC[loc].order}" data-href="order" target="_blank" rel="noopener">Go to order page ${EXT}</a>
      <a class="txtlink bowl__more" href="${up}menu/">See the full menu</a></div></div>`;
    if (anim) G.from(out.firstChild, { opacity: 0, x: 24, duration: 0.45, ease: "power3.out", clearProps: "all" });
  }
  if (fa) {
    $$("button", fa).forEach((b) => b.addEventListener("click", () => {
      $$("button", fa).forEach((x) => x.setAttribute("aria-checked", x === b));
      const t = TREE[b.dataset.a];
      fb.innerHTML = ""; fb.hidden = !t.q; $("#f-step2").hidden = !t.q;
      if (!t.q) return result(t.dish, t.pic);
      t.q.forEach(([label, dish]) => {
        const c = document.createElement("button");
        c.type = "button"; c.setAttribute("role", "radio"); c.setAttribute("aria-checked", "false"); c.textContent = label;
        c.addEventListener("click", () => { $$("button", fb).forEach((x) => x.setAttribute("aria-checked", x === c)); result(dish, t.pic); });
        fb.appendChild(c);
      });
      out.innerHTML = `<p class="finder__hint">One more choice&hellip;</p>`;
      if (anim) G.from(fb.children, { opacity: 0, y: 10, duration: 0.3, stagger: 0.05, clearProps: "all" });
    }));
  }

  // ---------- メニューのページ ----------
  const menu = $("#menu");
  if (menu) {
    const CATS = [...new Set(MENU.map((m) => m.cat))];
    const cats = $("#cats");
    CATS.forEach((c, i) => {
      const id = "c-" + c.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "");
      cats.insertAdjacentHTML("beforeend", `<a href="#${id}">${c}</a>`);
      const items = MENU.filter((m) => m.cat === c);
      const lis = items.map((m) => {
        const tags = (m.tags || []).map((t) => `<span class="tag tag--${t === "Vegan" ? "v" : t === "GF" ? "gf" : "k"}">${t}</span>`);
        if (m.at !== "both") tags.push(`<span class="tag tag--only">${LOC[m.at].name} only</span>`);
        return `<li class="mi" data-at="${m.at}"><h3>${m.name}</h3><p class="mi__p">${m.was ? `<s>$${m.was}</s>` : ""}$${m.price}</p><p class="mi__d">${m.desc}</p>${tags.length ? `<p class="mi__tags">${tags.join("")}</p>` : ""}</li>`;
      }).join("");
      menu.insertAdjacentHTML("beforeend", `<section class="mcat" id="${id}"><h2>${c} <small>${items.length} items</small></h2><ul class="mlist">${lis}</ul></section>`);
    });
    const spy = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      $$("a", cats).forEach((a) => { const on = a.getAttribute("href") === "#" + e.target.id; a.classList.toggle("is-on", on); if (on) a.scrollIntoView({ block: "nearest", inline: "nearest" }); });
    }), { rootMargin: "-30% 0px -60% 0px" });
    $$(".mcat").forEach((s) => spy.observe(s));
  }

  applyLoc(true);

  // ---------- 動き ----------
  function heroIn() {
    if (!anim || page !== "home") return;
    G.timeline()
      .from(".hero__img", { scale: 1.08, duration: 1.2, ease: "power2.out", clearProps: "transform" }, 0)
      .from(".hero__h span", { yPercent: 60, opacity: 0, duration: 0.55, stagger: 0.1, ease: "power3.out", clearProps: "all" }, 0.1)
      .from(".kicker--y", { opacity: 0, duration: 0.4, clearProps: "all" }, 0.1)
      .from(".lcard", { y: 30, opacity: 0, duration: 0.5, stagger: 0.08, clearProps: "all" }, 0.35);
  }
  function reveals() {
    if (!anim || !window.ScrollTrigger) return;
    // 物語：行ごとに
    $$("[data-lines]").forEach((p) => {
      let targets = [p];
      if (window.SplitText) targets = SplitText.create(p, { type: "lines", linesClass: "line" }).lines;
      G.from(targets, { opacity: 0, y: 18, duration: 0.5, stagger: 0.07, ease: "power2.out", clearProps: "opacity,transform", scrollTrigger: { trigger: p, start: "top 85%", once: true } });
    });
    // 写真の誌面：横から拭うように
    $$(".sp img").forEach((im, i) => G.fromTo(im, { clipPath: i % 2 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0%)", duration: 0.6, ease: "power2.out", clearProps: "clipPath", scrollTrigger: { trigger: im, start: "top 88%", once: true } }));
    if ($(".five__bowl")) G.from(".five__bowl", { scale: 0.9, opacity: 0, duration: 0.6, ease: "power3.out", clearProps: "all", scrollTrigger: { trigger: ".five", start: "top 75%", once: true } });
    if ($(".seven__char")) G.from(".seven__char", { rotation: -8, y: 30, opacity: 0, duration: 0.6, ease: "back.out(1.6)", clearProps: "all", scrollTrigger: { trigger: ".seven", start: "top 80%", once: true } });
    if (menu) G.from(".mcat", { opacity: 0, y: 16, duration: 0.4, stagger: 0.06, clearProps: "all" });
    if ($(".bk")) G.from(".bk, .place", { opacity: 0, y: 20, duration: 0.45, stagger: 0.1, clearProps: "all" });
  }
  function opening(done) {
    const root = document.documentElement;
    if (!root.classList.contains("op") || !anim) { root.classList.remove("op"); return done(); }
    try { sessionStorage.setItem("rara-op", "1"); } catch (e) {}
    G.timeline({ onComplete: () => { root.classList.remove("op"); done(); } })
      .from(".op__in img", { y: 30, opacity: 0, duration: 0.4, stagger: 0.12, ease: "power3.out" })
      .to(".opening", { yPercent: -100, duration: 0.55, ease: "power3.inOut" }, 0.85)
      .add(() => { $(".top").style.visibility = "visible"; $(".hero").style.visibility = "visible"; }, 0.85);
  }
  opening(() => { $(".top").style.visibility = ""; if ($(".hero")) $(".hero").style.visibility = ""; heroIn(); reveals(); });
})();
