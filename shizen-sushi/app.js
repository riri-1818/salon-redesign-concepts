// Shizen sushi & more：のれん／食べ方の3択／品書きのしぼり込み／セットの中身。品名・説明・料金は今のメニュー画像の原文。
lang = "en";
// [品名, 料金(null=market price), ヴィーガン, 添え書き, 写真]
const MENU = [
  ["rolls", "Sushi signature rolls", "", [
    ["tempura", 22.8, 0, "prawn tempura, avocado, cucumber, spicy sauce", "r_tempura"], ["tiger", 22.8, 0, "chicken, avocado, cucumber, carrot, cheese", "r_tiger"],
    ["salmon paradise", 22.8, 0, "salmon, grilled salmon, avocado", "r_paradise"], ["philadelphia", 22.8, 0, "salmon tempura, cucumber, cream cheese, spicy sauce", "r_phila"],
    ["ocean", 22.8, 0, "salmon, cooked tuna, avocado, cucumber", "r_ocean"], ["volcano", 22.8, 0, "grilled salmon, fish stick, egg, avocado, cucumber, spicy sauce", "r_volcano"]]],
  ["sets", "Sets", "", [
    ["salmon bento", 36, 0, "roll 8, nigiri 2, sashimi 2", "", [["roll", 8], ["nigiri", 2], ["sashimi", 2]]],
    ["omakase chef’s special", 42, 0, "roll 4pc, nigiri 5pc, sashimi 4pc, with miso soup", "omakase", [["roll", 4], ["nigiri", 5], ["sashimi", 4], ["miso soup", 1]]]]],
  ["nigiri", "Sushi nigiri", "", [
    ["catch of the day", null, 0, ""], ["salmon", 8, 0, "2pc"], ["grilled salmon", 8, 0, "2pc"], ["salmon belly", 8, 0, "2pc"], ["grilled salmon belly", 8, 0, "2pc"], ["tiger prawn", 12, 0, "2pc"],
    ["scallop", 12, 0, "2pc"], ["grilled scallop", 12, 0, "2pc"], ["tempura tiger prawn", 12, 0, "2pc"], ["wagyu beef", 9.5, 0, "2pc"], ["eel nigiri", 12, 0, ""], ["grilled salmon scallop", 9, 0, "2pc"],
    ["spicy salmon avocado inari", 8, 0, "1pc"], ["salmon avocado inari", 8, 0, "1pc"], ["vegetarian inari", 8, 1, "1pc"]]],
  ["hand", "Hand rolls", "made to order", [
    ["salmon", 8, 0, ""], ["eel", 11, 0, ""], ["cooked tuna", 7, 0, ""], ["teriyaki salmon", 8, 0, ""], ["teriyaki chicken", 7, 0, ""], ["tempura tiger prawn", 8, 0, ""], ["vegetarian", 7, 1, ""], ["california", 7, 0, ""], ["wagyu beef", 8, 0, ""]]],
  ["starters", "Starters", "", [
    ["miso soup", 4.5, 0, ""], ["steamed edamame", 8, 1, ""], ["spicy edamame", 9, 1, ""], ["agedashi eggplant", 15, 1, ""], ["agedashi tofu", 15, 1, ""], ["sashimi set", 29, 0, "salmon 4pc & scallop 4pc"],
    ["salmon sashimi", 15, 0, "4pc"], ["scallop sashimi", 16, 0, ""], ["tiger prawn tempura", 15, 0, "3pc"], ["seaweed salad", 7, 0, ""], ["tofu seaweed salad", 17, 0, ""], ["sashimi salad", 21, 0, ""],
    ["salmon carpaccio", 22, 0, ""], ["karaage", 16, 0, "4pc"]]],
  ["mains", "Mains", "", [
    ["miso grilled chicken", 23, 0, "", "m_chicken"], ["teriyaki chicken", 23, 0, ""], ["miso grilled salmon", 31, 0, "", "m_salmon"], ["teriyaki salmon", 31, 0, ""],
    ["chicken nanban", 26, 0, "sweet and sour crispy chicken with tartar sauce", "m_nanban"], ["crispy karaage chicken", 23, 0, "", "m_karaage"],
    ["wagyu beef BBQ", 28, 0, "", "m_wagyu"], ["yuzu wagyu beef", 28, 0, ""], ["premium wagyu beef", 33, 0, ""], ["tempura mix", 32, 0, "", "m_tempura"]]],
  ["gyoza", "Gyoza", "", [["pork gyoza", 12, 0, "5 pc", "gyoza"], ["vegetable gyoza", 12, 1, "5 pc"]]],
  ["poke", "Poke bowls", "", [["spicy salmon poke bowl", 22, 0, "", "poke"], ["salmon poke bowl", 22, 0, ""], ["wagyu beef poke bowl", 22, 0, ""], ["tofu poke bowl", 22, 1, ""]]],
  ["curry", "Japanese curry", "", [["chicken katsu curry", 24, 0, "", "curry"], ["tempura prawn curry", 24, 0, ""], ["wagyu beef curry", 24, 0, ""], ["vegetarian curry", 24, 1, "tofu or vegetable tempura"]]],
  ["udon", "Udon noodles", "", [["tempura prawn udon", 21, 0, "", "udon"], ["wagyu beef udon", 21, 0, ""], ["karaage udon", 21, 0, ""], ["vegetable udon", 21, 1, "tofu or vegetable tempura"], ["plain udon", 16, 1, ""]]],
];
const F = { cat: "all", price: "any", vegan: false };
const LEAF = '<svg class="leaf" viewBox="0 0 24 24" role="img" aria-label="vegan"><path d="M4 20c0-9 6-15 16-16-1 10-7 16-16 16Zm0 0c3-5 6-8 11-11"/></svg>';
const money = (p) => (p === null ? "market price" : "$" + (Number.isInteger(p) ? p : p.toFixed(2)));
const band = (p) => (p === null ? "" : p < 10 ? "a" : p <= 20 ? "b" : "c");
const ok = (d) => (!F.vegan || d[2]) && (F.price === "any" || band(d[1]) === F.price);
const pic = (n, alt, w) => `<img src="img/${n}.jpg" alt="${alt}" width="${w}" height="${Math.round(w * 0.5)}">`;

function dish(d, photo) {
  const set = d[5] ? `<span class="pcs" aria-hidden="true">${d[5].map(([k, n], i) => `<span class="pc-g"><i class="pc-n">${n}</i>${Array.from({ length: n }, () => `<i class="pc k${i}"></i>`).join("")}<i class="pc-l">${k}</i></span>`).join("")}</span>` : "";
  return `<li class="dish${photo && d[4] ? " ph" : ""}">${photo && d[4] ? pic(d[4], d[0], 150) : ""}<span class="d-n">${d[0]}${d[2] ? LEAF : ""}</span><span class="d-p">${money(d[1])}</span>${d[3] ? `<span class="d-s">${d[3]}</span>` : ""}${set}</li>`;
}
function render(moved) {
  let n = 0;
  const html = MENU.filter((s) => F.cat === "all" || s[0] === F.cat).map(([id, name, sub, list]) => {
    const show = list.filter(ok); n += show.length;
    if (!show.length) return "";
    const cls = id === "rolls" ? " cards" : id === "sets" ? " sets" : "";
    return `<section class="sec${cls}" id="s-${id}"><h3>${name}${sub ? ` <small>(${sub})</small>` : ""}</h3><ul>${show.map((d) => dish(d, true)).join("")}</ul></section>`;
  }).join("");
  $("#board").innerHTML = html; $("#none").hidden = n > 0;
  $("#m-n").textContent = n; $("#m-w").textContent = n === 1 ? "dish" : "dishes";
  $$("#f-cat button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cat === F.cat));
  $$("#f-price button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.price === F.price));
  $("#f-vegan").setAttribute("aria-pressed", F.vegan);
  if (moved && window.gsap && !reduce) {
    gsap.fromTo("#board .sec", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.32, stagger: 0.04, ease: "power2.out", clearProps: "all" });
    gsap.fromTo("#m-n", { scale: 1.25 }, { scale: 1, duration: 0.3, ease: "power2.out", clearProps: "transform" });
    gsap.fromTo("#board .pc", { scale: 0 }, { scale: 1, duration: 0.25, stagger: 0.02, ease: "back.out(2)", clearProps: "transform" });
  }
}
$("#f-cat").innerHTML = `<button type="button" data-cat="all" aria-pressed="true">Everything</button>` + MENU.map(([id, name]) => `<button type="button" data-cat="${id}" aria-pressed="false">${name}</button>`).join("");
$("#v-n").textContent = `(${MENU.reduce((a, s) => a + s[3].filter((d) => d[2]).length, 0)})`;

// 食べ方の3択
function how(k, moved) {
  $$(".how-t button").forEach((b) => { const on = b.dataset.how === k; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
  $$(".how-p").forEach((p) => { p.hidden = p.id !== "p-" + k; });
  if (moved && window.gsap && !reduce) gsap.fromTo("#p-" + k + " > *", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out", clearProps: "all" });
}
$(".how-t").addEventListener("keydown", (e) => {
  const t = $$(".how-t button"), i = t.indexOf(document.activeElement);
  if (i < 0 || !["ArrowRight", "ArrowLeft"].includes(e.key)) return;
  const n = t[(i + (e.key === "ArrowRight" ? 1 : t.length - 1)) % t.length]; n.focus(); how(n.dataset.how, true);
});

// のれん：開く（文字を押すと、もう一度くぐる）
function noren(again) {
  const e = $("#entry");
  if (reduce || !window.gsap) { e.classList.add("open"); return; }
  const tl = gsap.timeline({ onComplete: () => e.classList.add("open") });
  if (again) { e.classList.remove("open"); scrollTo({ top: 0, behavior: "smooth" }); tl.to("#cur-l", { xPercent: 0, duration: 0.45, ease: "power2.inOut" }, 0).to("#cur-r", { xPercent: 0, duration: 0.45, ease: "power2.inOut" }, 0); }
  tl.to("#cur-l", { xPercent: -100, skewY: -1.5, duration: 0.95, ease: "power3.inOut" }, again ? 0.6 : 0.5)
    .to("#cur-r", { xPercent: 100, skewY: 1.5, duration: 0.95, ease: "power3.inOut" }, "<0.06")
    .to(".cur", { skewY: 0, duration: 0.5, ease: "elastic.out(1, .6)" }, ">-0.2")
    .fromTo(".in-l > *, .shots figure", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power2.out", clearProps: "opacity,transform" }, again ? 0.9 : 0.8);
}

document.addEventListener("click", (e) => {
  const h = e.target.closest("[data-how]"); if (h) { how(h.dataset.how, true); return; }
  const c = e.target.closest("[data-cat]"); if (c) { F.cat = c.dataset.cat; render(true); return; }
  const p = e.target.closest("[data-price]"); if (p) { F.price = p.dataset.price; render(true); return; }
  if (e.target.closest("#f-vegan")) { F.vegan = !F.vegan; render(true); return; }
  if (e.target.closest("#reset")) { F.cat = "all"; F.price = "any"; F.vegan = false; render(true); return; }
  if (e.target.closest("#again")) noren(true);
});
const mailOk = (v) => /^\S+@\S+\.\S+$/.test(v);
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim(), err = $("#f-err");
  if (!v("#f-name") || !mailOk(v("#f-mail"))) { err.textContent = "Please enter your name and a valid email address."; err.hidden = false; $("#f-ok").hidden = true; return; }
  err.hidden = true; $("#f-ok").hidden = false;
  location.href = `mailto:shizen.sushisydney@gmail.com?subject=${encodeURIComponent(v("#f-sub") || "Message from the website")}&body=${encodeURIComponent(`Name: ${v("#f-name")}\nEmail: ${v("#f-mail")}\n\n${v("#f-msg")}`)}`;
});
$("#news").addEventListener("submit", (e) => {
  e.preventDefault();
  const err = $("#n-err"), bad = !$("#n-name").value.trim() || !mailOk($("#n-mail").value.trim());
  err.textContent = bad ? "Please enter your name and a valid email address." : ""; err.hidden = !bad; $("#n-ok").hidden = bad;
});

render(false); how("in", false);
start(".ab, .platter, .gram-g li, #form, #news");
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => noren(false)); else noren(false);
