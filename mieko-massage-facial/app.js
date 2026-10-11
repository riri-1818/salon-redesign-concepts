// MIEKO Massage + Facial（ご提案用の試作）。文章と料金は、いまのサイト（2026-10-11 取得）の原文のまま。英語のみ。
lang = "en";
const CATS = [["all", "Everything"], ["face", "Face and jaw"], ["pain", "Pain and posture"], ["lymph", "Lymph, gut and detox"], ["head", "Head and scalp"], ["whole", "Whole body and rest"], ["preg", "Pregnancy"], ["add", "Add-ons and consultation"]];
let cat = "all";
function chips() {
  $("#chips").innerHTML = CATS.map((c) => `<button type="button" data-cat-f="${c[0]}" aria-pressed="${c[0] === cat}">${c[1]}<i>${c[0] === "all" ? $$("#list .svc").length : $$(`#list .svc[data-cat="${c[0]}"]`).length}</i></button>`).join("");
  const show = $$("#list .svc").filter((li) => { const on = cat === "all" || li.dataset.cat === cat; li.hidden = !on; return on; });
  if (window.gsap && !reduce) gsap.from(show, { y: 12, opacity: 0, duration: 0.35, stagger: 0.03, ease: "power2.out", clearProps: "all" });
}
document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-cat-f]"); if (c) { cat = c.dataset.catF; chips(); return; }
  const tp = e.target.closest("[data-topic]"); if (tp) { $("#f-topic").value = tp.dataset.topic; }
});
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim(), err = $("#f-err");
  if (!v("#f-name") || !/^\S+@\S+\.\S+$/.test(v("#f-mail")) || !v("#f-msg")) { err.textContent = "Please enter your name, a valid email address and a message."; err.hidden = false; $("#f-done").hidden = true; return; }
  err.hidden = true; $("#f-done").hidden = false;
  location.href = `mailto:miekomassage@gmail.com?subject=${encodeURIComponent(v("#f-topic") || "Enquiry")}&body=${encodeURIComponent(`Name: ${v("#f-name")}\nEmail: ${v("#f-mail")}${$("#f-news").checked ? "\nPlease add me to the mailing list." : ""}\n\n${v("#f-msg")}`)}`;
});
chips();

if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  // 「body, face and mind become one」：離れていた言葉が、ひとつに寄ってくる
  const tl = gsap.timeline({ defaults: { duration: 1.1, ease: "power3.out" } });
  tl.from(".w1", { x: -60, opacity: 0 }, 0).from(".w2", { x: 70, opacity: 0 }, 0.12).from(".w3", { x: -40, opacity: 0 }, 0.24).from(".w4", { y: 30, opacity: 0 }, 0.5)
    .from(".one em", { letterSpacing: "0.5em", duration: 1.4, ease: "power2.out", clearProps: "letterSpacing" }, 0.6)
    .from(".hero-art", { opacity: 0, scale: 1.04, duration: 1.6, ease: "power2.out", clearProps: "all" }, 0)
    .from(".eyebrow, .lead, .btns, .three-w, .spec li", { y: 16, opacity: 0, duration: 0.6, stagger: 0.05, clearProps: "all" }, 0.7);
  gsap.to(".hero-art img", { yPercent: -6, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  ScrollTrigger.batch(".sec-head, .svc, .pay > div, .b-head, .b-what, .b-ben, .qa details, .why li, .f-pic, .f-text, .people li, .quotes li, .press li, .goods li, .fulls details, .form, .facts > div", {
    start: "top 92%", once: true,
    onEnter: (els) => gsap.from(els, { y: 20, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.04, clearProps: "all" }),
  });
}
