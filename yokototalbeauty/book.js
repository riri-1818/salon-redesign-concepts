// 詳細ページ用：言語の切り替え（トップで選んだ言語を ?lang= で受け取る）と、ページ間の移動で言語を引き継ぐ
(() => {
  const q = new URLSearchParams(location.search).get("lang");
  let lang = q === "ja" || q === "en" ? q : (navigator.language || "").startsWith("ja") ? "ja" : "en";
  const apply = () => {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-en]").forEach((el) => { el.innerHTML = el.dataset[lang]; });
    document.querySelectorAll(".lang").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));
    document.title = (document.querySelector(".doc-head h1") || {}).textContent + " — yokototalbeauty";
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".lang"); if (b) { lang = b.dataset.lang; apply(); history.replaceState(null, "", "?lang=" + lang); return; }
    const a = e.target.closest("a[href]"); if (!a) return;
    const h = a.getAttribute("href"); if (/^(https?:|tel:|mailto:|#)/.test(h)) return;
    const [path, hash] = h.split("#"); a.href = path.split("?")[0] + "?lang=" + lang + (hash ? "#" + hash : "");
  });
  apply();
})();
