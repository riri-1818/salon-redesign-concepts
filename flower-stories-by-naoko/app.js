// Flower Stories by Naoko — interaction. With "reduce motion" on, everything is simply shown.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Services (wording from the current site)
const WORK = [
  { tab: "Weddings & celebrations", img: "img/wall.jpg", alt: "A wall of garden roses, protea and trailing amaranthus", title: "Weddings, private parties and celebrations", body: "Botanical styling for weddings, milestone birthdays and anniversaries.", list: ["Centrepieces", "Entryway displays", "Botanical styling"] },
  { tab: "Corporate & brand events", img: "img/desk-wide.jpg", alt: "Orange anthurium and banksia on a reception desk", title: "Corporate and brand activations", body: "Florals that elevate launches and company celebrations.", list: ["Statement entrances", "Media walls", "Bar arrangements", "Branded palettes"] },
  { tab: "Ikebana workshops", img: "img/ikebana.jpg", alt: "Cream anthurium and bare branches in a low vessel", title: "Ikebana workshops", body: "Hands-on ikebana experiences.", list: ["Retreats", "Workshops", "Private guest events"] },
];
// Enquiry types, with the questions listed under "Event Inquiry" on the current site
const EVENT_Q = ["Event type, date and venue name", "Guest count / table count", "Estimated floral budget", "Message or concept vision (theme, colours and atmosphere)"];
const TYPES = [
  { n: "A wedding or celebration", sub: "Wedding / celebration enquiry", q: EVENT_Q },
  { n: "A corporate or brand event", sub: "Corporate event enquiry", q: EVENT_Q },
  { n: "Weekly ikebana for our space", sub: "Weekly ikebana enquiry", q: ["Your business and suburb", "The space (boutique, restaurant, office)", "Your message"] },
  { n: "An ikebana workshop", sub: "Ikebana workshop enquiry", q: ["Type of event (retreat, workshop, private guests)", "Preferred date and number of guests", "Your message"] },
];
let work = 0, type = 0;
function showWork(animate = true) {
  const w = WORK[work];
  $(".stems").innerHTML = WORK.map((x, i) => `<button type="button" role="tab" aria-selected="${i === work}" data-i="${i}"><i style="--h:${[100, 62, 80][i]}%"></i><span>${x.tab}</span></button>`).join("");
  const img = $("#w-img"); img.src = w.img; img.alt = w.alt; $("#w-title").textContent = w.title; $("#w-body").textContent = w.body; $("#w-list").innerHTML = w.list.map((l) => `<li>${l}</li>`).join(""); $("#w-link").dataset.pick = [0, 1, 3][work];
  if (animate && !reduce) { const el = $(".panel"); el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); }
}
function showType(animate = true) {
  const x = TYPES[type];
  $(".types").innerHTML = TYPES.map((y, i) => `<button type="button" role="radio" aria-checked="${i === type}" data-i="${i}">${y.n}</button>`).join("");
  $("#l-sub").textContent = "Subject: " + x.sub; $("#l-q").innerHTML = x.q.map((q, i) => `<li style="--d:${i * 70}ms">${q}</li>`).join("");
  $("#l-send").href = "mailto:hello@flowerstoriesbynaoko.com?subject=" + encodeURIComponent(x.sub) + "&body=" + encodeURIComponent("Hello Naoko,\n\n" + x.q.map((q) => q + ":\n").join("\n") + "\nThank you,\n");
  if (animate && !reduce) { const el = $(".letter"); el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); }
}
$(".stems").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { work = +b.dataset.i; showWork(); } });
$(".types").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { type = +b.dataset.i; showType(); } });
document.addEventListener("click", (e) => { const a = e.target.closest("[data-pick]"); if (a) { type = +a.dataset.pick; showType(false); } });
showWork(false); showType(false);
if (reduce || !("IntersectionObserver" in window)) document.documentElement.classList.add("no-motion");
else { const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" }); $$(".idea p, .sec-head, .stems, .panel, .three li, .weekly figure, .weekly > div, .form, .direct").forEach((el) => { el.classList.add("rv"); io.observe(el); }); }
requestAnimationFrame(() => document.documentElement.classList.add("ready"));
