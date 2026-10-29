// 商品の元データ（data.js）に、スタッフ画面で足した・直した分を重ねる。
// 試作ではこのブラウザの中に保存。本番では両方とも Square の商品データになり、スタッフ画面の保存は Square に書き込む。
const Menu = (() => {
  const KEY = "lode-staff-edits";
  const slug = (s) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const blank = () => ({ added: [], changed: {} });
  function load() { try { return { ...blank(), ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return blank(); } }
  function save(e) { try { localStorage.setItem(KEY, JSON.stringify(e)); return true; } catch { return false; } }

  // hidden（サイトに出さない）も含めた全部。スタッフ画面用
  function allFood() {
    const e = load();
    const base = FOOD.map((f) => ({ ...f, id: slug(f.name) }));
    return [...base, ...e.added].map((f) => ({ ...f, ...(e.changed[f.id] || {}) }));
  }
  const food = () => allFood().filter((f) => !f.hidden);
  const drinks = () => DRINKS.map((d) => ({ ...d, id: slug(d.name) }));

  // その店での値段。その店に無ければ null。飲み物は [小, 大]
  function priceAt(item, sid) {
    if (item.only && !item.only.includes(sid)) return null;
    if (item.not && item.not.includes(sid)) return null;
    return (item.at && item.at[sid]) ?? item.price;
  }
  const money = (n) => "$" + Number(n).toFixed(2);

  function change(id, patch) { const e = load(); e.changed[id] = { ...(e.changed[id] || {}), ...patch }; return save(e); }
  function add(item) { const e = load(); item.id = slug(item.name) + "-" + Date.now().toString(36); e.added.push(item); return save(e) ? item : null; }
  function remove(id) { const e = load(); e.added = e.added.filter((f) => f.id !== id); delete e.changed[id]; return save(e); }
  function reset() { try { localStorage.removeItem(KEY); } catch {} }
  const isAdded = (id) => load().added.some((f) => f.id === id);

  return { food, allFood, drinks, priceAt, money, change, add, remove, reset, isAdded, slug };
})();
