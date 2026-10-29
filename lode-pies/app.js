// Lode Pies & Pastries（試作 v3）：ロゴの4文字・いま開いている Lode・店ごとのメニュー（Flip）・サイトの中で注文（カゴ→受け取り→支払い）・今週の箱・飲み物
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const G = window.gsap, anim = !!G && !RM;
  if (G) { if (window.Flip) G.registerPlugin(Flip); if (window.ScrollTrigger) G.registerPlugin(ScrollTrigger); }
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const money = Menu.money;
  const store = (id) => STORES.find((s) => s.id === id);
  const get = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  // ---------- シドニーの時刻 ----------
  function sydney() {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const h = +p.hour % 24, m = +p.minute, d = SHORT.indexOf(p.weekday.slice(0, 3));
    return { d, min: h * 60 + m, y: +p.year, mo: +p.month, day: +p.day, label: `${p.weekday} ${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")}${h < 12 ? "am" : "pm"}` };
  }
  const t12 = (m) => { const h = Math.floor(m / 60), mm = m % 60; return `${((h + 11) % 12) + 1}${mm ? ":" + String(mm).padStart(2, "0") : ""}${h < 12 ? "am" : "pm"}`; };
  function status(s, now) {
    const today = s.hours[now.d];
    if (today && now.min >= today[0] && now.min < today[1]) return { k: 0, cls: "pill--open", txt: `Open · until ${t12(today[1])}` };
    if (today && now.min < today[0]) return { k: 1, cls: "pill--soon", txt: `Opens ${t12(today[0])}` };
    for (let i = 1; i <= 7; i++) {
      const d = (now.d + i) % 7, h = s.hours[d];
      if (h) return { k: 2, cls: "", txt: `Opens ${i === 1 ? "tomorrow" : SHORT[d]} ${t12(h[0])}` };
    }
    return { k: 3, cls: "", txt: "Closed" };
  }

  // ---------- 状態：受け取りの店・カゴ ----------
  let sid = get("lode-store", null);
  if (!store(sid)) { const now = sydney(); sid = STORES.map((s) => ({ s, k: status(s, now).k })).sort((a, b) => a.k - b.k)[0].s.id; }
  let bag = get("lode-bag", []); // { k: "f:<id>" | "d:<id>:<size>", q }

  // 品の情報（カゴの1行）。その店に無ければ price は null
  function line(k) {
    const [t, id, sz] = k.split(":");
    if (t === "f") {
      const f = Menu.allFood().find((x) => x.id === id);
      if (!f || f.hidden) return null;
      const p = Menu.priceAt(f, sid);
      return { name: f.name, sub: f.g === "box" ? "Pre-order" : "", price: f.soldOut ? null : p, why: f.soldOut ? "Sold out" : p == null ? `Not at ${store(sid).name}` : "", img: f.img };
    }
    const d = Menu.drinks().find((x) => x.id === id);
    if (!d) return null;
    const p = Menu.priceAt(d, sid);
    const two = d.price.length > 1;
    return { name: d.name === "Brew" ? "Cold Brew" : d.name, sub: two ? (+sz ? "Large" : "Small") : "", price: p ? p[Math.min(+sz, p.length - 1)] : null, why: p ? "" : `Not at ${store(sid).name}` };
  }
  const count = () => bag.reduce((n, b) => n + b.q, 0);
  const total = () => bag.reduce((n, b) => { const l = line(b.k); return n + (l && l.price != null ? l.price * b.q : 0); }, 0);
  function addToBag(k, q = 1, name = "") {
    const b = bag.find((x) => x.k === k);
    if (b) b.q += q; else bag.push({ k, q });
    saveBag(); toast(`Added ${q > 1 ? q + " × " : ""}${name} to your bag`);
    if (anim) G.fromTo("#bag-n", { scale: 1.6 }, { scale: 1, duration: 0.4, ease: "back.out(3)" });
  }
  function saveBag() { bag = bag.filter((b) => b.q > 0); put("lode-bag", bag); paintBag(); }
  function paintBag() {
    const n = count();
    $("#bag-n").textContent = n;
    $("#bagbar").hidden = !n;
    $("#bagbar-t").textContent = `View bag · ${n} item${n === 1 ? "" : "s"}`;
    $("#bagbar-p").textContent = money(total());
    $$(".pc__add").forEach((b) => { const q = (bag.find((x) => x.k === b.dataset.k) || {}).q || 0; b.dataset.n = q || ""; });
  }
  let tt;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2200); }

  function setStore(id) {
    sid = id; put("lode-store", sid);
    renderPick(); renderCase(); renderDrinks(); paintBag();
    if ($("#bag").open) renderBag();
  }

  // ---------- いま開いている Lode ----------
  const list = $("#store-list");
  let openId = null;
  function renderStores(first) {
    const now = sydney();
    $("#now-clock").textContent = now.label;
    const rows = STORES.map((s) => ({ s, st: status(s, now) })).sort((a, b) => a.st.k - b.st.k);
    const state = !first && anim && window.Flip ? Flip.getState($$(".st", list)) : null;
    rows.forEach(({ s, st }) => {
      let li = $(`[data-id="${s.id}"]`, list);
      if (!li) {
        li = document.createElement("li");
        li.className = "st"; li.dataset.id = s.id;
        const week = DAYS.map((d, i) => `<dt data-d="${i}">${d}</dt><dd data-d="${i}">${s.hours[i] ? `${t12(s.hours[i][0])} – ${t12(s.hours[i][1])}` : "Closed"}</dd>`).join("");
        li.innerHTML = `<button type="button" class="st__btn" aria-expanded="false"><span class="st__n">${s.name}</span><span class="st__a">${s.short}${s.phone ? " · " + s.phone : ""}</span><span class="st__s"><span class="pill"></span>${s.sourdough ? '<span class="tag">Sourdough daily</span>' : ""}</span></button>
          <div class="st__more"><dl class="week">${week}</dl><div class="st__act"><button type="button" class="st__order">Order for pick-up here</button><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Lode Pies " + s.addr)}" target="_blank" rel="noopener">Get directions <span aria-hidden="true">&nearr;</span></a></div><p class="fine" style="grid-column:1/-1;color:#bfa9a5;margin:0">${s.addr}</p></div>`;
        $(".st__btn", li).addEventListener("click", () => toggle(s.id));
        $(".st__order", li).addEventListener("click", () => { setStore(s.id); $("#case").scrollIntoView({ behavior: RM ? "auto" : "smooth" }); });
      }
      const pill = $(".pill", li);
      pill.className = "pill " + st.cls; pill.textContent = st.txt;
      $$(".week [data-d]", li).forEach((e) => e.classList.toggle("today", +e.dataset.d === now.d));
      list.appendChild(li);
    });
    if (state) Flip.from(state, { duration: 0.4, ease: "power2.inOut" });
  }
  function toggle(id) {
    openId = openId === id ? null : id;
    $$(".st", list).forEach((li) => {
      const on = li.dataset.id === openId;
      li.classList.toggle("is-open", on);
      $(".st__btn", li).setAttribute("aria-expanded", on);
      if (on && anim) G.from($(".st__more", li), { opacity: 0, y: -8, duration: 0.3, clearProps: "all" });
    });
  }
  renderStores(true);
  setInterval(() => renderStores(false), 60000);
  STORES.forEach((s) => $("#f-store").insertAdjacentHTML("beforeend", `<option>${s.name}</option>`));

  // ---------- 受け取りの店（メニューの上） ----------
  function renderPick() {
    const now = sydney();
    $("#pick-opts").innerHTML = STORES.map((s) => { const st = status(s, now); return `<button type="button" role="radio" aria-checked="${s.id === sid}" data-s="${s.id}">${s.name}<small class="${st.k === 0 ? "is-open" : ""}">${st.k === 0 ? "Open now" : st.txt.replace("Opens ", "Opens ")}</small></button>`; }).join("");
    $$("#pick-opts button").forEach((b) => b.addEventListener("click", () => setStore(b.dataset.s)));
  }

  // ---------- ショーケース（店ごとのメニュー） ----------
  const GN = { pies: "Pies & rolls", pastry: "Croissant & co", sweet: "Sweet", box: "Pre-order" };
  const tray = $("#tray");
  let tab = "all";
  const photo = (f) => f.img ? `<img src="${f.img.startsWith("data:") ? f.img : `img/${f.img}.jpg`}" alt="${esc(f.name)}" loading="lazy">` : `<span class="pc__type">${esc(f.name)}</span>`;
  const inTab = (g) => tab === "all" || g === tab || (tab === "sweet" && g === "box");
  function renderCase() {
    const items = Menu.food().filter((f) => Menu.priceAt(f, sid) != null);
    tray.innerHTML = "";
    items.forEach((f) => {
      const li = document.createElement("li");
      li.dataset.g = f.g; li.hidden = !inTab(f.g);
      const p = Menu.priceAt(f, sid);
      const k = "f:" + f.id;
      li.innerHTML = `<div class="pc${f.g === "box" ? " pc--box" : ""}${f.soldOut ? " is-out" : ""}"><button type="button" class="pc__hit"><span class="pc__ph">${photo(f)}${f.isNew ? '<span class="pc__new">New</span>' : ""}</span><span class="pc__b"><span class="pc__n">${esc(f.name)}</span><span class="pc__p">${f.soldOut ? "Sold out" : money(p)}</span><span class="pc__d">${esc(f.desc)}</span></span></button>${f.soldOut ? "" : `<button type="button" class="pc__add" data-k="${k}" aria-label="Add ${esc(f.name)} to bag">+</button>`}</div>`;
      $(".pc__hit", li).addEventListener("click", () => openDrawer(f));
      const add = $(".pc__add", li);
      if (add) add.addEventListener("click", () => addToBag(k, 1, f.name));
      tray.appendChild(li);
    });
    $("#n-all").textContent = items.length;
    const only = Menu.food().filter((f) => f.only && !f.only.includes(sid)).length;
    $("#case-fine").textContent = `Menu and prices for pick-up at ${store(sid).name}.` + (only ? " Some items are only at other stores." : "") + " Pay here and collect in store.";
    paintBag();
  }
  $$(".tabs button").forEach((b) => b.addEventListener("click", () => {
    tab = b.dataset.g;
    $$(".tabs button").forEach((x) => x.setAttribute("aria-selected", x === b));
    const items = $$("li", tray);
    const state = anim && window.Flip ? Flip.getState(items) : null;
    items.forEach((li) => (li.hidden = !inTab(li.dataset.g)));
    if (state) Flip.from(state, { duration: 0.45, ease: "power2.inOut", absolute: true, onEnter: (els) => G.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35 }), onLeave: (els) => G.to(els, { opacity: 0, scale: 0.9, duration: 0.25 }) });
  }));

  // 引き出し：個数を選んでカゴへ
  const drawer = $("#drawer");
  let lastFocus = null, drItem = null, drQ = 1;
  function paintDrawer() {
    const p = Menu.priceAt(drItem, sid);
    $("#dr-q").textContent = drQ;
    $("#dr-add").textContent = drItem.soldOut ? "Sold out" : `Add to bag · ${money(p * drQ)}`;
    $("#dr-add").disabled = !!drItem.soldOut;
  }
  function openDrawer(f) {
    drItem = f; drQ = 1;
    lastFocus = document.activeElement;
    $("#dr-ph").innerHTML = photo(f);
    $("#dr-g").textContent = GN[f.g]; $("#dr-n").textContent = f.name; $("#dr-d").textContent = f.desc;
    $("#dr-p").textContent = f.soldOut ? "Sold out" : money(Menu.priceAt(f, sid));
    $("#dr-note").textContent = `Pick-up at ${store(sid).name}.` + (f.g === "box" ? " Choose your pick-up day at checkout." : "");
    paintDrawer();
    drawer.showModal(); $("#dr-x").focus();
    if (anim) G.from(".drawer__in", { xPercent: 100, duration: 0.4, ease: "power3.out", clearProps: "transform" });
  }
  $$("#dr-buy [data-q]").forEach((b) => b.addEventListener("click", () => { drQ = Math.max(1, Math.min(20, drQ + +b.dataset.q)); paintDrawer(); }));
  $("#dr-add").addEventListener("click", () => { addToBag("f:" + drItem.id, drQ, drItem.name); drawer.close(); });
  drawer.addEventListener("close", () => { if (lastFocus) lastFocus.focus(); });
  $("#dr-x").addEventListener("click", () => drawer.close());
  drawer.addEventListener("click", (e) => { if (e.target === drawer) drawer.close(); });

  // 今週の箱
  $("#box-add").addEventListener("click", () => { const f = Menu.food().find((x) => x.name === "Celebration Pastry Box"); if (f) addToBag("f:" + f.id, 1, f.name); });

  // ---------- 飲み物 ----------
  const iced = (d) => /atcha|Iced|Ice coffee|Brew/.test(d.name);
  function dli(d) {
    const p = Menu.priceAt(d, sid);
    const nm = d.name === "Brew" ? "Cold Brew" : d.name;
    const pr = p ? p.map(money).join(" – ") : "Not here";
    const adds = p ? `<span class="dadd">${p.map((x, i) => `<button type="button" class="pc__add pc__add--s" data-k="d:${d.id}:${i}" aria-label="Add ${p.length > 1 ? (i ? "large " : "small ") : ""}${esc(nm)}, ${money(x)}">${p.length > 1 ? (i ? "L" : "S") : "+"}</button>`).join("")}</span>` : "";
    const sum = `<summary${d.desc ? "" : ' tabindex="-1"'}><b>${esc(nm)}</b><i>${pr}</i></summary>`;
    return `<li class="${d.desc ? "" : "nodesc"}${p ? "" : " is-off"}"><details>${sum}${d.desc ? `<p>${esc(d.desc)}</p>` : ""}</details>${adds}</li>`;
  }
  function renderDrinks() {
    const ds = Menu.drinks();
    $("#d-coffee").innerHTML = ds.filter((d) => !iced(d)).map(dli).join("");
    $("#d-iced").innerHTML = ds.filter(iced).map(dli).join("");
    $$(".nodesc summary").forEach((s) => s.addEventListener("click", (e) => e.preventDefault()));
    $$(".dadd .pc__add").forEach((b) => b.addEventListener("click", () => { const l = line(b.dataset.k); addToBag(b.dataset.k, 1, (l.sub ? l.sub.toLowerCase() + " " : "") + l.name); }));
    paintBag();
  }

  // ---------- カゴ：受け取り・連絡先・支払い ----------
  const bagEl = $("#bag"), bagIn = $("#bag-in");
  let form = get("lode-checkout", {}), day = null, slot = null;
  // 受け取りできる日（今日から7日、店が開いていて時間が残っている日）と時間（15分おき）
  function days() {
    const now = sydney(), s = store(sid), out = [];
    for (let i = 0; i < 7; i++) {
      const wd = (now.d + i) % 7, h = s.hours[wd];
      if (!h) continue;
      const from = i === 0 ? Math.max(h[0], Math.ceil((now.min + 20) / 15) * 15) : h[0];
      const times = []; for (let t = from; t <= h[1] - 15; t += 15) times.push(t);
      if (!times.length) continue;
      const dt = new Date(Date.UTC(now.y, now.mo - 1, now.day + i));
      out.push({ i, label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : `${SHORT[wd]} ${dt.getUTCDate()} ${MON[dt.getUTCMonth()]}`, times });
    }
    return out;
  }
  function renderBag() {
    const ds = days();
    if (!ds.some((d) => d.i === day)) day = ds[0] ? ds[0].i : null;
    const times = (ds.find((d) => d.i === day) || { times: [] }).times;
    if (!times.includes(slot)) slot = times[0] ?? null;
    const lines = bag.map((b) => ({ b, l: line(b.k) })).filter((x) => x.l);
    const bad = lines.filter((x) => x.l.price == null);
    const hasPre = lines.some((x) => x.l.sub === "Pre-order");
    const rows = lines.map(({ b, l }) => `<li class="bl${l.price == null ? " is-bad" : ""}"><div><b>${esc(l.name)}</b>${l.sub ? `<small>${l.sub}</small>` : ""}${l.why ? `<em>${l.why}</em>` : ""}</div>
      <div class="qty qty--s"><button type="button" data-k="${b.k}" data-d="-1" aria-label="One less ${esc(l.name)}">&minus;</button><output>${b.q}</output><button type="button" data-k="${b.k}" data-d="1" aria-label="One more ${esc(l.name)}"${l.price == null ? " disabled" : ""}>+</button></div>
      <span class="bl__p">${l.price == null ? "—" : money(l.price * b.q)}</span></li>`).join("");
    bagIn.innerHTML = `
      <div class="bag__top"><h2 id="bag-h">Your bag</h2><button type="button" class="drawer__x" id="bag-x" aria-label="Close">&times;</button></div>
      ${lines.length ? `<form class="bag__form" id="co" novalidate>
        <section class="bag__sec"><ul class="bls">${rows}</ul>${bad.length ? `<p class="err">Some items aren't available at ${store(sid).name}. Remove them or choose another store.</p>` : ""}</section>
        <section class="bag__sec"><h3><span>1</span>Pick-up</h3>
          <label class="fld"><span>Store</span><select name="store" id="co-store">${STORES.map((s) => `<option value="${s.id}"${s.id === sid ? " selected" : ""}>${s.name} · ${s.short}</option>`).join("")}</select></label>
          ${ds.length ? `<div class="two"><label class="fld"><span>Day</span><select id="co-day">${ds.map((d) => `<option value="${d.i}"${d.i === day ? " selected" : ""}>${d.label}</option>`).join("")}</select></label>
          <label class="fld"><span>Time</span><select id="co-time">${times.map((t) => `<option value="${t}"${t === slot ? " selected" : ""}>${t12(t)}</option>`).join("")}</select></label></div>` : `<p class="err">No pick-up times this week at this store.</p>`}
          ${hasPre ? `<p class="fine">Pre-order items are made for the day you choose.</p>` : ""}
        </section>
        <section class="bag__sec"><h3><span>2</span>Your details</h3>
          <label class="fld"><span>Name *</span><input name="name" autocomplete="name" required value="${esc(form.name)}"></label>
          <div class="two"><label class="fld"><span>Mobile *</span><input name="phone" type="tel" autocomplete="tel" required value="${esc(form.phone)}"></label>
          <label class="fld"><span>Email *</span><input name="email" type="email" autocomplete="email" required value="${esc(form.email)}"></label></div>
          <label class="fld"><span>Note for the store</span><input name="note" placeholder="e.g. Please heat the pie" value="${esc(form.note)}"></label>
        </section>
        <section class="bag__sec"><h3><span>3</span>Payment</h3>
          <div class="card"><label class="fld"><span>Card number</span><input name="card" inputmode="numeric" autocomplete="off" placeholder="1234 5678 9012 3456"></label>
          <div class="two"><label class="fld"><span>Expiry</span><input name="exp" inputmode="numeric" autocomplete="off" placeholder="MM / YY"></label><label class="fld"><span>CVC</span><input name="cvc" inputmode="numeric" autocomplete="off" placeholder="123"></label></div></div>
          <p class="demo"><b>Sample only, no money is taken.</b> On the live site, this card form is run by Square, the same as your current online orders. <button type="button" class="linkbtn" id="co-fill">Fill in a test card</button></p>
        </section>
        <p class="err" id="co-err" role="alert" hidden></p>
        <div class="bag__pay"><div><small>Total</small><b>${money(total())}</b></div><button class="btn btn--ink" type="submit"${bad.length || !ds.length ? " disabled" : ""}>Place order</button></div>
      </form>` : `<div class="bag__empty"><p>Your bag is empty.</p><button type="button" class="btn btn--ink" id="bag-menu">See the menu</button></div>`}`;
    $("#bag-x").addEventListener("click", () => bagEl.close());
    const em = $("#bag-menu"); if (em) em.addEventListener("click", () => { bagEl.close(); $("#case").scrollIntoView({ behavior: RM ? "auto" : "smooth" }); });
    if (!lines.length) return;
    $$(".bls [data-d]", bagIn).forEach((b) => b.addEventListener("click", () => { const x = bag.find((y) => y.k === b.dataset.k); x.q += +b.dataset.d; saveBag(); renderBag(); }));
    $("#co-store").addEventListener("change", (e) => setStore(e.target.value));
    const cd = $("#co-day"); if (cd) cd.addEventListener("change", (e) => { day = +e.target.value; renderBag(); });
    const ct = $("#co-time"); if (ct) ct.addEventListener("change", (e) => { slot = +e.target.value; });
    const co = $("#co");
    co.addEventListener("input", () => { const d = Object.fromEntries(new FormData(co)); form = { name: d.name, phone: d.phone, email: d.email, note: d.note }; put("lode-checkout", form); });
    $("#co-fill").addEventListener("click", () => { co.elements.card.value = "4111 1111 1111 1111"; co.elements.exp.value = "12 / 29"; co.elements.cvc.value = "123"; });
    co.addEventListener("submit", (e) => { e.preventDefault(); place(co); });
  }
  function place(co) {
    const d = Object.fromEntries(new FormData(co));
    const bad = [];
    if (!String(d.name).trim()) bad.push("name");
    if (String(d.phone).replace(/\D/g, "").length < 8) bad.push("phone");
    if (!/^\S+@\S+\.\S+$/.test(d.email)) bad.push("email");
    if (String(d.card).replace(/\D/g, "").length < 12) bad.push("card");
    if (!/\d{2}\s*\/?\s*\d{2}/.test(d.exp)) bad.push("exp");
    if (!/^\d{3,4}$/.test(String(d.cvc).trim())) bad.push("cvc");
    $$("input", co).forEach((i) => i.removeAttribute("aria-invalid"));
    bad.forEach((k) => co.elements[k].setAttribute("aria-invalid", "true"));
    const err = $("#co-err");
    err.hidden = !bad.length; err.textContent = "Please check the fields in red.";
    if (bad.length) { co.elements[bad[0]].focus(); return; }
    const s = store(sid), dl = days().find((x) => x.i === day);
    const items = bag.map((b) => ({ b, l: line(b.k) })).filter((x) => x.l);
    const no = "LD-" + String(Math.floor(1000 + Math.random() * 9000));
    bagIn.innerHTML = `<div class="bag__top"><h2 id="bag-h">Order placed</h2><button type="button" class="drawer__x" id="bag-x" aria-label="Close">&times;</button></div>
      <div class="done"><p class="done__no">${no}</p>
        <p class="done__when">Pick up <b>${dl.label.toLowerCase() === "today" ? "today" : dl.label} at ${t12(slot)}</b><br>${s.name}, ${s.addr}</p>
        <ul class="bls">${items.map(({ b, l }) => `<li class="bl"><div><b>${b.q} × ${esc(l.name)}</b>${l.sub ? `<small>${l.sub}</small>` : ""}</div><span></span><span class="bl__p">${money(l.price * b.q)}</span></li>`).join("")}</ul>
        <p class="done__tot">Paid <b>${money(total())}</b></p>
        <p class="demo"><b>What happens on the live site:</b> the payment goes through Square, the order appears on the store's Square device like your online orders today, and ${esc(d.name.split(" ")[0])} gets a receipt by email.</p>
        <button type="button" class="btn btn--ink" id="done-ok">Back to the menu</button></div>`;
    bag = []; saveBag();
    $("#bag-x").addEventListener("click", () => bagEl.close());
    $("#done-ok").addEventListener("click", () => bagEl.close());
    if (anim) G.from(".done > *", { opacity: 0, y: 14, duration: 0.4, stagger: 0.07 });
  }
  function openBag() { renderBag(); bagEl.showModal(); if (anim) G.from(".bag__in", { xPercent: 100, duration: 0.4, ease: "power3.out", clearProps: "transform" }); }
  $("#bag-open").addEventListener("click", openBag);
  $("#bagbar").addEventListener("click", openBag);
  bagEl.addEventListener("click", (e) => { if (e.target === bagEl) bagEl.close(); });

  renderPick(); renderCase(); renderDrinks(); paintBag();
  // スタッフ画面で直したら、開いているこのページにもすぐ出す
  addEventListener("storage", (e) => { if (e.key === "lode-staff-edits") { renderCase(); paintBag(); } });

  // ---------- メニュー（スマホ）・いまの場所 ----------
  const mb = $(".menu-btn"), nav = $("#nav");
  mb.addEventListener("click", () => {
    const o = mb.getAttribute("aria-expanded") !== "true";
    nav.style.setProperty("--navtop", Math.round($(".top").getBoundingClientRect().bottom) + "px");
    mb.setAttribute("aria-expanded", o); nav.classList.toggle("is-open", o);
  });
  $$("#nav a").forEach((a) => a.addEventListener("click", () => { mb.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }));
  const here = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) $$("#nav a").forEach((a) => a.classList.toggle("is-here", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  ["case", "box", "drinks", "contact"].forEach((id) => here.observe(document.getElementById(id)));

  // ---------- フォーム ----------
  $("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, d = Object.fromEntries(new FormData(f));
    const bad = ["name", "email", "msg"].filter((k) => !String(d[k] || "").trim() || (k === "email" && !/^\S+@\S+\.\S+$/.test(d[k])));
    $$("input,textarea", f).forEach((i) => i.removeAttribute("aria-invalid"));
    bad.forEach((k) => f.elements[k].setAttribute("aria-invalid", "true"));
    $("#f-err").hidden = !bad.length;
    if (bad.length) { f.elements[bad[0]].focus(); return; }
    const body = [`Hi Lode team,`, ``, d.msg, ``, d.store ? `Store: ${d.store}` : "", `Name: ${d.name}`, `Email: ${d.email}`].filter((x) => x !== "").join("\n");
    location.href = `mailto:hello@lodepies.com?subject=${encodeURIComponent("Hello from the website" + (d.store ? " (" + d.store + ")" : ""))}&body=${encodeURIComponent(body)}`;
  });
  $("#loop").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#loop-e").value.trim();
    $("#loop-msg").textContent = /^\S+@\S+\.\S+$/.test(v) ? "Thanks! In the live site this signs you up to the Lode newsletter." : "Please enter your email address.";
  });

  // ---------- 動き ----------
  function opening(done) {
    const root = document.documentElement;
    if (!root.classList.contains("op") || !anim) { root.classList.remove("op"); return done(); }
    G.timeline({ onComplete: () => { root.classList.remove("op"); done(); } })
      .from(".q1", { x: "-60vw", y: "-40vh", duration: 0.6, ease: "power3.out" }, 0)
      .from(".q2", { x: "60vw", y: "-40vh", duration: 0.6, ease: "power3.out" }, 0.08)
      .from(".q3", { x: "-60vw", y: "40vh", duration: 0.6, ease: "power3.out" }, 0.16)
      .from(".q4", { x: "60vw", y: "40vh", duration: 0.6, ease: "power3.out" }, 0.24)
      .to(".opening", { yPercent: -100, duration: 0.5, ease: "power3.inOut" }, 1.0);
  }
  function reveals() {
    if (!anim) return;
    G.timeline()
      .from(".hero__h, .hero__p", { opacity: 0, y: 20, duration: 0.5, stagger: 0.08, clearProps: "all" })
      .from(".st", { opacity: 0, x: 24, duration: 0.35, stagger: 0.07, clearProps: "all" }, 0.15)
      .from(".hero__ph", { opacity: 0, duration: 0.5, clearProps: "all" }, 0.3);
    if (!window.ScrollTrigger) return;
    G.from("#tray li", { opacity: 0, y: 26, duration: 0.45, stagger: 0.04, clearProps: "all", scrollTrigger: { trigger: "#tray", start: "top 85%", once: true } });
    G.from("#box-list li", { opacity: 0, x: -20, duration: 0.4, stagger: 0.15, clearProps: "all", scrollTrigger: { trigger: "#box", start: "top 75%", once: true } });
    G.from(".gal__grid img", { opacity: 0, y: 30, rotation: (i) => (i % 2 ? 3 : -3), duration: 0.5, stagger: 0.06, clearProps: "all", scrollTrigger: { trigger: ".gal", start: "top 80%", once: true } });
  }
  opening(reveals);
})();
