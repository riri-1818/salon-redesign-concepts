// Koko Hair — 動きの部分。「動きを減らす」設定の人には、動かさずに全部表示する。
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search).get("lang");
let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
const t = (pair) => pair[lang === "ja" ? 1 : 0];

/* ---------- 2つのサロン（現サイトの各店舗ページより） ---------- */
const DAYS = [["Mon", "月"], ["Tue", "火"], ["Wed", "水"], ["Thu", "木"], ["Fri", "金"], ["Sat", "土"], ["Sun", "日"]];
const SALONS = [
  { name: "Five Dock", brand: "Koko Hair Artistry", photo: "img/fd-front.jpg", alt: ["The Five Dock shopfront", "Five Dock 店の外観"],
    text: ["Japanese-trained stylists combine trusted skills with a personal touch, in a friendly and relaxing atmosphere.", "日本で経験を積んだスタイリストが、落ち着いた雰囲気のなかで丁寧に仕上げます。"],
    hours: [[9, 17], null, [9, 17], [9, 17], [9, 17], [9, 17], [9, 17]],
    addr: "70 Great North Road<br>Five Dock NSW 2046", tel: ["0403 663 796", "+61403663796"], map: "https://www.google.com/maps/search/?api=1&query=Koko+Hair+Artistry+70+Great+North+Road+Five+Dock",
    park: ["Public car park on Thompson Lane, just across the street. Two hours Monday to Saturday, free all day Sunday.", "向かいの Thompson Lane に公共駐車場。月〜土は2時間、日曜は終日無料。"] },
  { name: "Neutral Bay", brand: "koko TOKYO", photo: "img/nb-front.jpg", alt: ["The Neutral Bay shopfront with koko TOKYO signs", "koko TOKYO の看板がある Neutral Bay 店の外観"],
    text: ["Led by experienced stylists trained in Japan, in a warm, welcoming space where you can relax.", "日本で経験を積んだスタイリストが率いる、あたたかい雰囲気のサロンです。"],
    hours: [[11, 19], null, null, [11, 19], [11, 19], [9, 17], [9, 17]],
    addr: "Shop 2, 115 Military Rd<br>Neutral Bay NSW 2089", addrNote: ["Entrance from 40 Bydown St", "入口は 40 Bydown St 側"], tel: ["0432 368 872", "+61432368872"], map: "https://www.google.com/maps/search/?api=1&query=Koko+Tokyo+115+Military+Rd+Neutral+Bay" },
];
let salon = 0;
try { salon = +localStorage.getItem("koko-salon") || 0; } catch (e) {}

function sydney() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { d: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday), h: (+p.hour % 24) + +p.minute / 60 };
}
function showSalon(animate = true) {
  const s = SALONS[salon], now = sydney(), card = $(".salon-card");
  const fill = () => {
    $("#s-photo").src = s.photo; $("#s-photo").alt = t(s.alt);
    $("#s-brand").textContent = s.brand; $("#s-name").textContent = s.name; $("#s-text").textContent = t(s.text);
    $("#s-days").innerHTML = DAYS.map((d, i) => { const h = s.hours[i]; return `<li class="${h ? "" : "shut"}${i === now.d ? " today" : ""}"><b>${t(d)}</b><span>${h ? `${h[0]}:00<br>${h[1]}:00` : (lang === "ja" ? "定休" : "Closed")}</span></li>`; }).join("");
    const h = s.hours[now.d], open = h && now.h >= h[0] && now.h < h[1];
    $("#s-status").innerHTML = `<i class="${open ? "on" : ""}"></i>` + (open ? (lang === "ja" ? `ただいま営業中（${h[1]}:00 まで）` : `Open now, until ${h[1]}:00`) : (lang === "ja" ? "ただいま営業時間外。オンライン予約はいつでも受け付けています。" : "Closed right now. Online booking is open any time."));
    $("#s-addr").innerHTML = s.addr + (s.addrNote ? `<small>${t(s.addrNote)}</small>` : "");
    $("#s-tel").textContent = s.tel[0]; $("#s-tel").href = "tel:" + s.tel[1]; $("#s-map").href = s.map;
    $("#s-park-wrap").hidden = !s.park; if (s.park) $("#s-park").textContent = t(s.park);
    $("#d-tel").href = "tel:" + s.tel[1]; $("#d-map").href = s.map;
  };
  $$(".switch button").forEach((b, i) => b.setAttribute("aria-selected", i === salon)); $(".switch").dataset.i = salon;
  $$(".pane").forEach((p, i) => p.classList.toggle("on", i === salon));
  if (reduce || !animate) { fill(); return; }
  card.classList.add("swap"); setTimeout(() => { fill(); card.classList.remove("swap"); }, 220);
}
function pick(i) { salon = i; try { localStorage.setItem("koko-salon", i); } catch (e) {} showSalon(); }
$(".switch").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) pick(+b.dataset.i); });
$$(".pane").forEach((p) => p.addEventListener("click", () => pick(+p.dataset.salon)));

/* ---------- 言語 ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
  $$("[data-alt-en]").forEach((el) => { el.alt = lang === "ja" ? el.dataset.altJa : el.dataset.altEn; });
  $$(".lang span").forEach((s, i) => s.classList.toggle("on", (i === 0) === (lang === "en")));
  document.title = lang === "ja" ? "Koko Hair｜Five Dock と Neutral Bay の日系ヘアサロン" : "Koko Hair | Japanese hair salons in Five Dock and Neutral Bay";
  showSalon(false);
}
$(".lang").addEventListener("click", () => { lang = lang === "ja" ? "en" : "ja"; applyLang(); });

/* ---------- ビフォーアフター：写真の上で左右に動かす ---------- */
$$(".ba").forEach((ba) => {
  const input = $("input", ba), set = (v) => { ba.style.setProperty("--pos", v + "%"); };
  input.addEventListener("input", () => { set(input.value); ba.classList.add("touched"); $(".drag-hint").classList.add("gone"); });
  // 縦スクロールを邪魔しないよう、横に動かしたときだけ追いかける
  let drag = false, sx = 0, sy = 0, decided = false;
  const at = (e) => { const r = ba.getBoundingClientRect(); input.value = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)); input.dispatchEvent(new Event("input")); };
  ba.addEventListener("pointerdown", (e) => { drag = true; decided = e.pointerType === "mouse"; sx = e.clientX; sy = e.clientY; if (decided) { ba.setPointerCapture(e.pointerId); at(e); } });
  ba.addEventListener("pointermove", (e) => { if (!drag) return; if (!decided) { const dx = Math.abs(e.clientX - sx), dy = Math.abs(e.clientY - sy); if (dx < 6 && dy < 6) return; if (dy > dx) { drag = false; return; } decided = true; ba.setPointerCapture(e.pointerId); } at(e); });
  ["pointerup", "pointercancel"].forEach((n) => ba.addEventListener(n, () => { drag = false; }));
  set(50);
});
// 画面に入ったとき、いちど左右に動いて「動かせる」ことを見せる
function demo(ba) {
  if (reduce || ba.classList.contains("touched")) return;
  const input = $("input", ba), t0 = performance.now();
  const step = (now) => { if (ba.classList.contains("touched")) return; const k = Math.min(1, (now - t0) / 1600); input.value = 50 + Math.sin(k * Math.PI * 2) * 26; ba.style.setProperty("--pos", input.value + "%"); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
/* 料金の数字を数え上げる */
function countUp(el, to) { if (reduce) return; const t0 = performance.now(); const step = (now) => { const k = Math.min(1, (now - t0) / 700), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }

/* ---------- 画面に入ったら現れる ---------- */
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; e.target.classList.add("in"); io.unobserve(e.target);
    if (e.target.classList.contains("ba")) demo(e.target); if (e.target.classList.contains("price")) countUp($("#price-n"), 190); }), { rootMargin: "0px 0px -12% 0px" });
  $$(".kicker, h2, .sub, .switch, .salon-card, .ba, .faq, .treat-photo, .ticks li, blockquote, .price, .close figure, .tels").forEach((el) => { if (el.closest(".hero")) return; el.classList.add("rv"); io.observe(el); });
}
addEventListener("scroll", () => $(".top").classList.toggle("stuck", scrollY > 8), { passive: true });
applyLang();
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
