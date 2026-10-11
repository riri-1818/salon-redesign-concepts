// Azuki Bakery（ご提案用の試作）。文言・営業時間・連絡先は、いまのサイト（2026-10-11 取得）にあるものだけ。英語のみ。
lang = "en";
const S = [
  { n: "Newtown", full: "Azuki Bakery Newtown", img: "newtown", alt: "The Azuki shopfront on Enmore Road, with tables on the footpath", addr: ["3/63-71 Enmore Rd,", "Newtown, 2042"], tel: ["(02) 8542 9317", "+61285429317"], mail: "azuki.bakery@gmail.com",
    h: [[540, 960], null, [540, 1020], [540, 1020], [540, 1080], [540, 1080], [540, 1020]], rows: [["Monday", "9:00 – 16:00", [0]], ["Tuesday", "Closed", [1]], ["Wed, Thursday", "9:00 – 17:00", [2, 3]], ["Fri, Saturday", "9:00 – 18:00", [4, 5]], ["Sunday", "9:00 – 17:00", [6]]],
    notes: ["From Monday, 11 May 2026, we will begin opening on Mondays. Our trading hours will be 9:00 am – 4:00 pm."], order: "https://azuki-bakery.square.site/", map: "Azuki+Bakery+63-71+Enmore+Rd+Newtown+NSW+2042" },
  { n: "Wolli Creek", full: "Azuki Bakery Wollicreek", img: "wolli", alt: "The Wolli Creek store seen from the street, with seating outside", addr: ["Shop 1/9-11 Arncliffe St", "Wolli Creek, NSW 2205"], tel: ["(02) 8385 1939", "+61283851939"], mail: "azuki@bakerywollicreek.com",
    h: [[450, 900], null, [450, 1020], [450, 1020], [450, 1020], [450, 960], [450, 960]], rows: [["Monday", "7:30 – 15:00", [0]], ["Tuesday", "Closed", [1]], ["Wed – Friday", "7:30 – 17:00", [2, 3, 4]], ["Sat, Sunday", "7:30 – 16:00", [5, 6]]],
    notes: ["Coffee last order at 16:00 (Wed – Friday).", "More seating (indoors and out!), more products and more street parking."], order: "http://azuki-bakery-wollicreek.square.site/", map: "Azuki+Bakery+Wolli+Creek+9-11+Arncliffe+St+Wolli+Creek+NSW+2205" },
];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let cur = 0, subj = "Newtown Store";
const f = (x) => `${Math.floor(x / 60) % 12 || 12}${x % 60 ? ":" + String(x % 60).padStart(2, "0") : ""}${x < 720 ? "am" : "pm"}`;
function status(s) {
  const { d, m } = sydney(), h = s.h[d];
  if (h && m >= h[0] && m < h[1]) return [true, `Open now, until ${f(h[1])}`];
  if (h && m < h[0]) return [false, `Opens today at ${f(h[0])}`];
  let k = (d + 1) % 7; while (!s.h[k]) k = (k + 1) % 7;
  return [false, `Closed now. Opens ${DAYS[k]} at ${f(s.h[k][0])}`];
}
function now() {
  $("#now").innerHTML = S.map((s, i) => { const [on, txt] = status(s); return `<li class="${on ? "on" : "off"}"><span class="dot" aria-hidden="true"></span><b>${s.n}</b><span>${txt}</span><a class="btn btn--s" href="${s.order}" target="_blank" rel="noopener">Go to the pre-order page</a><a class="more" href="#stores" data-store="${i}">Hours and address</a></li>`; }).join("");
  const open = S.findIndex((s) => status(s)[0]), s = S[open < 0 ? cur : open];
  $("#dock").innerHTML = `<a class="dock-main" href="${s.order}" target="_blank" rel="noopener">Pre-order: ${s.n}</a><a href="#stores">Hours</a><a href="tel:${s.tel[1]}">Call</a>`;
}
function two() {
  const d = sydney().d;
  $("#two").innerHTML = S.map((s, i) => { const [on, txt] = status(s); return `<article class="store${i === cur ? " is-cur" : ""}" id="store-${i}"><img src="img/${s.img}.jpg" width="1200" height="800" alt="${s.alt}"><div class="s-b"><p class="s-st ${on ? "on" : "off"}"><span class="dot" aria-hidden="true"></span>${txt}</p><h3>${s.full}</h3>
    <table class="hrs"><caption class="sr">Opening hours</caption>${s.rows.map((r) => `<tr class="${r[2].includes(d) ? "is-today" : ""}"><th>${r[0]}</th><td>${r[1]}</td></tr>`).join("")}</table>
    ${s.notes.map((n) => `<p class="note">${n}</p>`).join("")}
    <dl><div><dt>Address</dt><dd>${s.addr.join("<br>")}<br><a href="https://www.google.com/maps/search/?api=1&amp;query=${s.map}" target="_blank" rel="noopener">Get directions</a></dd></div><div><dt>Phone</dt><dd><a href="tel:${s.tel[1]}">${s.tel[0]}</a></dd></div><div><dt>Email</dt><dd><a href="mailto:${s.mail}">${s.mail}</a></dd></div></dl>
    <a class="btn" href="${s.order}" target="_blank" rel="noopener">Go to the ${s.n} pre-order page</a></div></article>`; }).join("");
  $$(".pick [data-store]").forEach((b) => b.setAttribute("aria-selected", +b.dataset.store === cur));
}
function to() { $$("#f-subj button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.subj === subj)); $("#f-to").textContent = `This opens your email app with the message filled in, addressed to ${subj === "Wollicreek Store" ? S[1].mail : S[0].mail}.`; }
document.addEventListener("click", (e) => {
  const st = e.target.closest("[data-store]"); if (st) { cur = +st.dataset.store; two(); return; }
  const sb = e.target.closest("[data-subj]"); if (sb) { subj = sb.dataset.subj; to(); }
});
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim(), err = $("#f-err");
  if (!v("#f-name") || !/^\S+@\S+\.\S+$/.test(v("#f-mail"))) { err.textContent = "Please enter your name and a valid email address."; err.hidden = false; $("#f-done").hidden = true; return; }
  err.hidden = true; $("#f-done").hidden = false;
  location.href = `mailto:${subj === "Wollicreek Store" ? S[1].mail : S[0].mail}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(`Name: ${v("#f-name")}\nEmail: ${v("#f-mail")}\nContact number: ${v("#f-tel") || "-"}\n\n${v("#f-msg")}`)}`;
});
now(); two(); to(); setInterval(() => { now(); two(); }, 60000);

if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".hero h1", { yPercent: 40, opacity: 0, duration: 0.8, ease: "power3.out", clearProps: "all" });
  gsap.from(".kicker, .lead", { y: 18, opacity: 0, duration: 0.6, stagger: 0.1, delay: 0.2, ease: "power2.out", clearProps: "all" });
  gsap.from(".hero-pic", { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "power3.out", delay: 0.1, clearProps: "clipPath" });
  gsap.from(".hero-pic img", { scale: 1.15, duration: 1.6, ease: "power2.out", clearProps: "transform" });
  gsap.from(".now li", { y: 30, opacity: 0, duration: 0.6, stagger: 0.12, delay: 0.6, ease: "back.out(1.4)", clearProps: "all" });
  gsap.from(".strip li", { x: 60, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power2.out", clearProps: "all", scrollTrigger: { trigger: ".strip", start: "top 88%", once: true } });
  ScrollTrigger.batch(".sec-head, .store, .team, .about-text > *, .form, .follow", {
    start: "top 90%", once: true,
    onEnter: (els) => gsap.from(els, { y: 22, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.05, clearProps: "all" }),
  });
}
