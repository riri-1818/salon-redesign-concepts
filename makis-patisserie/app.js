// Maki’s Patisserie（ご提案用の試作）。文言・料金・配達の決まりは、いまのサイト（2026-10-11 取得）にあるものだけ。
const R3 = (a, b, c) => [["S", "15cm", a, 15], ["M", "19cm", b, 19], ["L", "23cm", c, 23]];
const SQ = (a, b, c) => [["S", "14cm x 14cm", a, 14, 14], ["M", "17cm x 17cm", b, 17, 17], ["L", "21cm x 21cm", c, 21, 21]];
const SERVES = { S: ["4–6 people", "4〜6人分"], M: ["6–8 people", "6〜8人分"], L: ["10–12 people", "10〜12人分"] };
// [id, 名前, 説明, 形, 選択肢, 写真]
const CAKES = [
  ["straw", ["Strawberry Shortcake", "いちごのショートケーキ"], ["Japanese classic. Moist vanilla sponge with juicy strawberries and diplomat cream, topped with whipped cream and pistachio.", "日本の定番。しっとりしたバニラのスポンジに、みずみずしいいちごとディプロマットクリーム。上にホイップクリームとピスタチオをのせています。"], "round", R3(60, 74, 89), "c-straw"],
  ["cheese", ["Uji Matcha Cheesecake", "宇治抹茶のチーズケーキ"], ["Creamy baked matcha (green tea) cheesecake.", "なめらかに焼き上げた、抹茶のベイクドチーズケーキ。"], "square", SQ(65, 80, 94), ""],
  ["matcha", ["Uji Matcha Shortcake", "宇治抹茶のショートケーキ"], ["Matcha sponge with red bean cream. Topped with matcha cream and seasonal fruits.", "抹茶のスポンジに、あずきのクリーム。上に抹茶クリームと季節のフルーツをのせています。"], "round", R3(65, 80, 94), "c-matcha"],
  ["opera", ["Uji Matcha Opera", "宇治抹茶のオペラ"], ["Layers of Matcha joconde biscuit, Matcha buttercream and chocolate ganache covered in a matcha chocolate glaze. Topped with matcha macaroon.", "抹茶のジョコンド生地、抹茶のバタークリーム、チョコレートガナッシュを重ね、抹茶チョコレートのグラサージュで包みました。上に抹茶のマカロンをのせています。"], "rect", [["S", "11cm x 14cm", 71, 14, 11], ["M", "14cm x 17cm", 91, 17, 14], ["L", "17cm x 21cm", 106, 21, 17]], "c-opera"],
  ["choco", ["Choconama", "チョコ生"], ["Chocolate sponge with light chocolate cream. Topped with milk chocolate shavings. (Can add strawberries with extra cost)", "チョコレートのスポンジに、軽いチョコレートクリーム。上にミルクチョコレートを削ってのせています。（追加料金でいちごを入れられます）"], "round", R3(60, 74, 89), ""],
  ["ganache", ["Chocolate Ganache", "チョコレートガナッシュ"], ["Chocolate indulgence. Chocolate sponge with rich smooth chocolate ganache.", "チョコレートを存分に。チョコレートのスポンジに、濃厚でなめらかなガナッシュ。"], "round", R3(63, 77, 92), ""],
  ["durian", ["Durian Fudge", "ドリアンファッジ"], ["Creamy rich durian fudge with coconut sponge. Must try for durian lovers.", "クリーミーで濃厚なドリアンのファッジと、ココナッツのスポンジ。ドリアン好きの方はぜひ。"], "round", R3(0, 92, 115).slice(1), "c-durian"],
  ["tart", ["Chestnut Tart (Mont Blanc Tart)", "栗のタルト（モンブランタルト）"], ["Using handmade chestnut and paste during season. Rich chestnut cream with creamy custard, whipped cream and sponge on tart shell with almond frangipane.", "旬の時期は、手作りの栗とペーストを使います。アーモンドのフランジパーヌを焼き込んだタルトに、濃厚な栗のクリーム、カスタード、ホイップクリーム、スポンジを重ねています。"], "round", [["S", "15cm", 65, 15, 0, ["3–5 people", "3〜5人分"]], ["M", "19cm", 86, 19], ["L", "23cm", 100, 23]], "c-tart"],
  ["mont", ["Chestnut Shortcake (Mont Blanc Shortcake)", "栗のショートケーキ（モンブランショート）"], ["Using handmade chestnut and paste during season. Layers of fluffy sponge and chestnut whipped cream, topped with light chestnut cream.", "旬の時期は、手作りの栗とペーストを使います。ふわふわのスポンジと栗のホイップクリームを重ね、上に軽い栗のクリームを絞っています。"], "square", SQ(65, 86, 100), "c-mont"],
  ["roll", ["Roll cake (Swiss Roll)", "ロールケーキ"], ["", ""], "opt", [[["Earl Grey Milk Tea", "アールグレイミルクティー"], "", 39], [["Uji Matcha", "宇治抹茶"], "", 42], [["Hojicha", "ほうじ茶"], "", 42], [["Durian", "ドリアン"], "", 51]], "c-roll"],
  ["choux", ["Choux a la creme (cookie top)", "シュークリーム（クッキー生地）"], ["Minimum order: 5 choux for each filling.", "味ごとに5個からのご注文です。"], "each", [[["Custard", "カスタード"], "", 5.8], [["Durian", "ドリアン"], "", 6.8], [["Chestnut", "栗"], "", 6.8]], ""],
];
const ZONES = [
  [15, "0 – 10 km", ["Auburn, Parramatta, Strathfield, Burwood, Olympic Park, Rhodes, Bankstown, Merrylands"], "2127, 2128, 2134, 2135, 2136, 2137, 2138, 2140, 2141, 2142, 2143, 2144, 2145, 2146, 2150, 2151, 2160, 2161, 2162, 2163, 2190, 2191, 2197, 2198, 2199, 2200"],
  [20, "10 – 15 km", ["Inner West (Ashfield, Newtown, Leichhardt, Earlwood), Ryde, Eastwood, Epping, Fairfield, Cabramatta, Baulkham Hills"], "2038, 2039, 2040, 2041, 2042, 2045, 2046, 2048, 2049, 2050, 2110, 2111, 2112, 2113, 2114, 2115, 2116, 2117, 2118, 2119, 2121, 2122, 2125, 2130, 2131, 2132, 2133, 2147, 2152, 2153, 2164, 2165, 2166, 2167, 2168, 2176, 2177, 2192, 2193, 2194, 2195, 2196, 2204, 2206, 2207"],
  [25, "15 – 20 km", ["Sydney CBD, Surry Hills, Pyrmont, Alexandria, Chatswood, Lane Cove, Pennant Hills, Blacktown, Liverpool, Hurstville"], "2000, 2007, 2008, 2009, 2010, 2011, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2037, 2043, 2044, 2047, 2060, 2061, 2062, 2063, 2064, 2065, 2066, 2067, 2068, 2069, 2120, 2126, 2148, 2154, 2155, 2170, 2171, 2203, 2205, 2208, 2209, 2210, 2211, 2212, 2213, 2214, 2216, 2217, 2218, 2220, 2221, 2222, 2223"],
];
const DAYS = [["Monday", "月曜"], ["Tuesday", "火曜"], ["Wednesday", "水曜"], ["Thursday", "木曜"], ["Friday", "金曜"], ["Saturday", "土曜"], ["Sunday", "日曜"]];
const DELIV = [null, null, ["10:00 AM – 2:00 PM", "10:00〜2:00"], ["10:00 AM – 2:00 PM", "10:00〜2:00"], ["10:00 AM – 2:00 PM", "10:00〜2:00"], ["3:00 PM – 5:30 PM", "午後3:00〜5:30"], null]; // 月〜日
const SHOP = [null, null, null, null, [660, 1080], [660, 1080], [660, 1080]]; // 金〜日 11am–6pm、月〜木は予約のみ
const GALLERY = [
  ["c-opera", ["Uji Matcha Opera Cake", "宇治抹茶のオペラ"], ["A multi-layered pastry featuring alternating layers of matcha joconde sponge, matcha buttercream, and dark chocolate ganache, coated in a smooth matcha glaze and topped with a single matcha macaron.", "抹茶のジョコンド生地、抹茶のバタークリーム、ダークチョコレートのガナッシュを交互に重ね、なめらかな抹茶のグラサージュで包み、抹茶のマカロンを一つのせました。"]],
  ["c-tart", ["Chestnut Tart", "栗のタルト"], ["A French style tart baked with almond frangipane. Filled with chestnut cream, sponge and custard. Elegantly wrapped in fine ribbons of piped chestnut paste and finished with sweet glazed chestnuts (macaron instead of chestnut when out of season).", "アーモンドのフランジパーヌを焼き込んだフランス風のタルト。栗のクリーム、スポンジ、カスタードを詰め、細く絞った栗のペーストで包み、つやのある甘い栗で仕上げています（旬でない時期は、栗の代わりにマカロン）。"]],
  ["c-durian", ["Durian Fudge Cake", "ドリアンファッジケーキ"], ["Creamy durian fudge and coconut sponge cake.", "クリーミーなドリアンのファッジと、ココナッツのスポンジ。"]],
  ["c-straw", ["Strawberry Shortcake", "いちごのショートケーキ"], ["Signature whole Japanese strawberry shortcake with fresh cream, layers of light sponge, and fresh strawberries.", "生クリーム、軽いスポンジ、いちごを重ねた、看板のホールのショートケーキ。"]],
  ["c-matcha", ["Uji Matcha Shortcake", "宇治抹茶のショートケーキ"], ["Premium Japanese Uji matcha shortcake layered with fresh cream.", "上質な宇治抹茶のショートケーキ。生クリームと重ねています。"]],
  ["c-mont", ["Chestnut Shortcake (Mont Blanc)", "栗のショートケーキ（モンブラン）"], ["Delicate piped chestnut puree, light cream, and soft sponge layers, a winter special.", "繊細に絞った栗のピュレ、軽いクリーム、やわらかなスポンジ。冬の特別なケーキです。"]],
  ["c-mousse", ["Uji Matcha Mousse", "宇治抹茶のムース"], ["Layered Uji matcha mousse dessert with smooth green tea cream layers and a glossy finish.", "なめらかな抹茶クリームを重ね、つやよく仕上げた宇治抹茶のムース。"]],
  ["c-small", ["Small Mont Blanc (Chestnut)", "小さなモンブラン（栗）"], ["Individual Japanese Mont Blanc chestnut tart with intricate chestnut puree piping and a whole glazed chestnut on top, a winter dessert special.", "細かく絞った栗のピュレに、つやのある栗をまるごと一つのせた、一人分のモンブランタルト。冬の特別なデザートです。"]],
  ["c-roll", ["Uji Matcha Swiss Roll", "宇治抹茶のロールケーキ"], ["A perfect spiral of green tea sponge and rich cream filling.", "抹茶のスポンジと濃厚なクリームが、きれいな渦を描きます。"]],
];
const ABOUT = {
  en: ["Hi there and welcome to my site.",
    "My name is Maki and I have always had a love of cakes since I was a child back in Japan and my mother used to bake sweets and other baked treats whenever my friends would come over. On the days where she had something on, she would leave some of her baked treats to welcome me home. This always filled my heart with warmth and is one of my treasured memories.",
    "Since then, I have always tried to share that feeling of warmth and happiness as much as I can. I believe smiles pass on from one another and are contagious. I’ve tried my best to recapture this feeling by hand making everything whenever possible.",
    "Regardless of how troublesome the process is, I have always used real ingredients and don’t believe in compromising on ingredients. I put all my love and care into all the cakes I make and to do that, I make my cakes made to order.",
    "I’ve always worked in hospitality but my formal education begun in Australia with the completion of TAFE’s certificate IV for commercial cooking after which I moved back to Japan to complete a patisserie course and worked at a few patisseries before my return to Australia. Interspersed amongst this was a trip to Paris where I had the privilege of attending a few master classes to broaden my horizons and improve on my techniques.",
    "If you would like to try one of my recipes, please have a look at my <a href='https://www.sbs.com.au/food/article/move-over-fruitcake-heres-the-japanese-christmas-cake/hgsx0kjnt' target='_blank' rel='noopener'>strawberry shortcake recipe on SBS Food</a>. If you are interested in learning a little more about me, you can listen to a short interview on this <a href='https://www.sbs.com.au/language/japanese/en/podcast-episode/why-maki-insists-on-custom-made-cakes/wqx1t707g' target='_blank' rel='noopener'>SBS podcast (Japanese language only)</a>.",
    "Please have a look at my menu and feel free to send me an email to order@makispatisserie.com if you have any questions or to place an order. I look forward to being able to help you share smiles with your family and friends."],
  ja: ["Maki’s Patisserie のウェブサイトへお越しいただき、どうもありがとうございます。",
    "私のケーキ作りの原点は、母親が作ってくれた手作りスイーツにあります。",
    "私が小さい頃、友達が遊びに来る度に母親がスイーツを焼いて作ってくれたり、母親が用事で家を空けている時も、家に帰ると手作りのスイーツが私を出迎えてくれました。嬉しくて心がホッコリしたあの想いは、今でもとても大切な思い出です。",
    "そんな経験から、私も皆さんに心がホッコリして幸せになってもらえるよう、ケーキを1つずつ丁寧に作らせていただいております。",
    "「笑顔は笑顔を呼ぶ！」そう信じて、一人でも多くの人を笑顔に出来るよう美味しいケーキ作りを目指しています。",
    "どんなに大変で時間がかかろうとも、出来る限り手作りし、材料にはとことんこだわって厳選したものを使用しています。1つずつ丁寧にケーキを作れるよう、私のお店ではオーダーメイドという形を取らせていただいております。",
    "ずっと飲食の仕事をしてきましたが、本格的に学び始めたのはオーストラリアです。TAFE（州立の職業訓練校）で調理の Certificate IV を修了したあと日本へ戻り、製菓のコースを修了して、いくつかのパティスリーで働きました。その間にパリを訪れ、マスタークラスに参加して技術と視野を広げる機会にも恵まれました。",
    "私のレシピを試してみたい方は、<a href='https://www.sbs.com.au/food/article/move-over-fruitcake-heres-the-japanese-christmas-cake/hgsx0kjnt' target='_blank' rel='noopener'>SBS Food に載っているいちごのショートケーキのレシピ</a>（英語）をご覧ください。私のことをもう少し知りたい方は、<a href='https://www.sbs.com.au/language/japanese/en/podcast-episode/why-maki-insists-on-custom-made-cakes/wqx1t707g' target='_blank' rel='noopener'>SBS のポッドキャストの短いインタビュー</a>（日本語）をお聞きいただけます。",
    "皆様が大切な人、ご家族やお友達と笑顔で過ごせるきっかけが作れることを心より楽しみにしています。 Maki"],
};
const S = { cake: "", opt: -1, n: 5, how: "pickup" };
const money = (v) => "$" + (Number.isInteger(v) ? v : v.toFixed(2));
const cakeOf = (id) => CAKES.find((c) => c[0] === id);
const optName = (c, o) => (c[3] === "opt" || c[3] === "each" ? t(o[0]) : `${o[0]} (${o[1]})`);
const serves = (o) => (o[5] ? t(o[5]) : t(SERVES[o[0]]));

function grid() {
  $("#grid").innerHTML = CAKES.map((c) => {
    const whole = c[3] !== "opt" && c[3] !== "each";
    const pic = c[5] ? `<img src="img/${c[5]}.jpg" width="720" height="540" alt="${t(c[1])}" loading="lazy">` : `<div class="nophoto" aria-hidden="true">${outline(c, -1)}</div>`;
    return `<li class="card${S.cake === c[0] ? " is-on" : ""}" id="k-${c[0]}"><figure>${pic}</figure><div class="card-b"><h3>${t(c[1])}</h3>${t(c[2]) ? `<p>${t(c[2])}</p>` : ""}
      <div class="sizes">${c[4].map((o, i) => `<button type="button" class="size" data-cake="${c[0]}" data-opt="${i}" aria-pressed="${S.cake === c[0] && S.opt === i}"><b>${whole ? o[0] : t(o[0])}</b>${whole ? `<i>${o[1]}</i>` : ""}<span>${money(o[2])}${c[3] === "each" ? t([" each", "／個"]) : ""}</span></button>`).join("")}</div></div></li>`;
  }).join("");
}
// 実寸の比で描くサイズの図（1cm = 10）。k は選んだサイズ（-1 なら全サイズを線だけで）
function outline(c, k) {
  const big = Math.max(...c[4].map((o) => o[3] || 0)); if (!big) return "";
  const shapes = c[4].map((o, i) => {
    const on = i === k, cls = on ? "on" : "";
    if (c[3] === "round") return `<circle class="${cls}" cx="130" cy="130" r="${o[3] * 5}"/>`;
    const w = o[3] * 10, h = o[4] * 10; return `<rect class="${cls}" x="${130 - w / 2}" y="${130 - h / 2}" width="${w}" height="${h}" rx="3"/>`;
  }).reverse().join("");
  return `<svg viewBox="0 0 260 260" role="img" aria-label="${t(["Sizes drawn to scale", "実際の比率で描いたサイズ"])}">${shapes}</svg>`;
}
function selectCake() {
  const sel = $("#o-cake"), c = cakeOf(S.cake);
  sel.innerHTML = `<option value="">${t(["Choose a cake", "ケーキを選ぶ"])}</option>` + CAKES.map((x) => `<option value="${x[0]}"${x[0] === S.cake ? " selected" : ""}>${t(x[1])}</option>`).join("");
  $("#o-size").innerHTML = c ? c[4].map((o, i) => `<button type="button" class="chip" data-cake="${c[0]}" data-opt="${i}" aria-pressed="${S.opt === i}">${optName(c, o)}　${money(o[2])}</button>`).join("") : "";
  $("#o-qty").hidden = !(c && c[3] === "each"); $("#o-n").textContent = S.n;
}
function sydDate(add = 0) { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" })); d.setDate(d.getDate() + add); return d; }
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
function dayInfo() {
  const v = $("#o-date").value; if (!v) return null;
  const [y, m, d] = v.split("-").map(Number), dt = new Date(y, m - 1, d), wd = (dt.getDay() + 6) % 7;
  const today = sydDate(); today.setHours(0, 0, 0, 0);
  return { wd, gap: Math.round((dt - today) / 86400000), label: lang === "en" ? `${DAYS[wd][0]} ${d}/${m}/${y}` : `${y}年${m}月${d}日（${DAYS[wd][1]}）` };
}
function zoneOf(pc) { const i = ZONES.findIndex((z) => z[3].split(", ").includes(pc)); return i; }
function slip() {
  const c = cakeOf(S.cake), o = c && c[4][S.opt], di = dayInfo(), lines = [];
  let total = 0, ready = !!o;
  $("#scale").innerHTML = c && o && o[3] ? `${outline(c, S.opt)}<p><b>${o[1]}</b><span>${serves(o)}</span></p>` : "";
  $("#scale").hidden = !(c && o && o[3]);
  if (c) {
    const each = c[3] === "each", price = o ? o[2] * (each ? S.n : 1) : 0; total += price;
    lines.push([t(["Cake", "ケーキ"]), `${t(c[1])}${o ? `<br>${optName(c, o)}${each ? ` × ${S.n}` : ""}` : ""}`, o ? money(price) : t(["choose a size", "サイズを選ぶ"])]);
  } else lines.push([t(["Cake", "ケーキ"]), t(["Not chosen yet", "まだ選んでいません"]), ""]);
  if ($("#o-plaque").checked) { total += 3; lines.push([t(["Plaque", "プレート"]), esc($("#o-msg").value) || t(["Message plaque", "メッセージプレート"]), "$3"]); }
  let note = "";
  if (di) {
    lines.push([t(["Day", "日にち"]), di.label, ""]);
    if (di.gap < 0) note = t(["That day has passed. Please choose another day.", "過ぎた日付です。別の日を選んでください。"]);
    else if (di.gap < 3) note = t(["Less than 3 days away. Please contact me and I will do my best to accommodate your request.", "3日以内のご注文です。ご連絡いただければ、できる限りお応えします。"]);
    else note = t(["3 days’ notice or more. Thank you.", "3日以上前のご注文です。ありがとうございます。"]);
  }
  $("#o-daynote").textContent = note;
  if (S.how === "pickup") {
    const h = di && SHOP[di.wd];
    lines.push([t(["Pick-up", "受け取り"]), `139 Parramatta Rd, Auburn${di ? `<br>${h ? t(["Friday to Sunday: 11am–6pm", "金〜日曜：午前11時〜午後6時"]) : t(["Monday to Thursday: by appointment only", "月〜木曜：予約制"])}` : ""}`, t(["Free", "無料"])]);
  } else {
    const pc = $("#o-post").value.trim(), z = /^\d{4}$/.test(pc) ? zoneOf(pc) : -2, zel = $("#o-zone");
    let ztxt = "", fee = "";
    if (z >= 0) {
      total += ZONES[z][0]; fee = money(ZONES[z][0]);
      ztxt = t([`Zone ${z + 1}: delivery is $${ZONES[z][0]} (${ZONES[z][1]} from Auburn).`, `ゾーン${z + 1}：配達料金は $${ZONES[z][0]} です（Auburn から ${ZONES[z][1]}）。`]);
    } else if (z === -1) ztxt = t(["This postcode is outside our delivery zones (over 20 km). Pick-up from Auburn is available.", "この郵便番号は配達エリアの外です（20km超）。Auburn での受け取りをご利用ください。"]);
    else ztxt = t(["Enter your 4-digit postcode to see the fee.", "4桁の郵便番号を入れると、料金が分かります。"]);
    let win = "";
    if (di) win = DELIV[di.wd] ? t([`Delivery window on ${DAYS[di.wd][0]}: ${DELIV[di.wd][0]}`, `${DAYS[di.wd][1]}の配達時間：${DELIV[di.wd][1]}`]) : t([`No delivery on ${DAYS[di.wd][0]}. Delivery runs Wednesday to Saturday; Sunday to Tuesday is collection only.`, `${DAYS[di.wd][1]}は配達がありません。配達は水〜土曜で、日〜火曜は受け取りのみです。`]);
    zel.innerHTML = `${ztxt}${win ? `<br>${win}` : ""}`; zel.className = "zone" + (z >= 0 ? " ok" : z === -1 ? " out" : "");
    lines.push([t(["Delivery", "配達"]), z >= 0 ? `${t(["Postcode", "郵便番号"])} ${pc}・${t(["Zone", "ゾーン"])} ${z + 1}${win ? `<br>${win}` : ""}` : t(["Postcode needed", "郵便番号を入れてください"]), fee]);
  }
  $("#s-lines").innerHTML = lines.map((l) => `<div><dt>${l[0]}</dt><dd>${l[1]}</dd><dd class="amt">${l[2]}</dd></div>`).join("");
  $("#s-total").textContent = ready ? money(total) : "—";
  $("#dock-main").textContent = ready ? `${t(["Order slip", "注文票"])}  ${money(total)}` : t(["Start an order", "注文を始める"]);
  return { c, o, di, total };
}
function week() {
  const now = sydney();
  $("#week").innerHTML = DAYS.map((d, i) => `<li class="${DELIV[i] ? "on" : "off"}${i === now.d ? " today" : ""}"><b>${lang === "en" ? d[0].slice(0, 3) : d[1].slice(0, 1)}</b><span>${DELIV[i] ? t(DELIV[i]) : t(["Collection only", "受け取りのみ"])}</span></li>`).join("");
  $("#zones").innerHTML = ZONES.map((z, i) => `<li><p class="z-h"><b>${t(["Zone", "ゾーン"])} ${i + 1}</b><span>${z[1]}</span><em>$${z[0]}</em></p><p>${z[2][0]}</p><details><summary>${t(["Eligible postcodes", "対象の郵便番号"])}</summary><p>${z[3]}</p></details></li>`).join("")
    + `<li><p class="z-h"><b>${t(["Outer", "エリア外"])}</b><span>${t(["Over 20 km", "20km 超"])}</span><em>${t(["Pick-up only", "受け取りのみ"])}</em></p><p>${t(["In-store collection from 139 Parramatta Rd, Auburn", "139 Parramatta Rd, Auburn での受け取り"])}</p></li>`;
}
function reel() { $("#reel").innerHTML = GALLERY.map((g) => `<li><figure><img src="img/${g[0]}.jpg" width="720" height="540" alt="${t(g[1])}"><figcaption><b>${t(g[1])}</b><span>${t(g[2])}</span></figcaption></figure></li>`).join(""); }
function about() { $("#about-text").innerHTML = `<p class="tag">${t(["About me", "私について"])}</p>` + ABOUT[lang].map((p, i) => `<p${i === 0 ? ' class="first"' : ""}>${p}</p>`).join(""); }
function hours() {
  const { d, m } = sydney(), h = SHOP[d];
  $("#hours").innerHTML = `<span class="h${d < 4 ? " is-today" : ""}">${t(["Monday – Thursday: by appointment only", "月〜木曜：予約制"])}</span><span class="h${d >= 4 ? " is-today" : ""}">${t(["Friday – Sunday: 11am–6pm", "金〜日曜：午前11時〜午後6時"])}</span>`;
  $("#today").textContent = h ? (m >= h[0] && m < h[1] ? t(["Open for collection now, until 6pm", "ただいま受け取りの時間です（午後6時まで）"]) : m < h[0] ? t(["Collection today from 11am to 6pm", "本日の受け取りは午前11時〜午後6時です"]) : t(["Collection has finished for today", "本日の受け取りは終わりました"])) : t(["Today is by appointment only", "本日は予約制です"]);
}

document.addEventListener("click", (e) => {
  const s = e.target.closest("[data-cake]");
  if (s) { S.cake = s.dataset.cake; S.opt = +s.dataset.opt; grid(); selectCake(); slip(); if (s.classList.contains("size") && window.gsap && !reduce) gsap.fromTo("#slip", { rotate: -1.2 }, { rotate: 0, duration: 0.5, ease: "elastic.out(1, .5)" }); return; }
  const q = e.target.closest("[data-q]"); if (q) { S.n = Math.max(5, S.n + +q.dataset.q); selectCake(); slip(); return; }
  const h = e.target.closest("[data-how]");
  if (h) { S.how = h.dataset.how; $$("[data-how]").forEach((b) => b.setAttribute("aria-pressed", b === h)); $("#o-deliv").hidden = S.how !== "delivery"; slip(); }
});
$("#o-cake").addEventListener("change", (e) => { S.cake = e.target.value; S.opt = -1; grid(); selectCake(); slip(); });
$("#o-plaque").addEventListener("change", (e) => { $("#o-msg-wrap").hidden = !e.target.checked; slip(); });
["#o-msg", "#o-date", "#o-post"].forEach((id) => $(id).addEventListener("input", slip));
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const { c, o, di, total } = slip(), err = $("#o-err"), v = (id) => $(id).value.trim();
  let msg = "";
  if (!c || !o) msg = t(["Please choose a cake and a size.", "ケーキとサイズを選んでください。"]);
  else if (!di || di.gap < 0) msg = t(["Please choose the day you need the cake.", "ケーキが必要な日を選んでください。"]);
  else if (S.how === "delivery" && zoneOf(v("#o-post")) < 0) msg = t(["Please enter a postcode inside the delivery zones, or choose pick-up.", "配達エリア内の郵便番号を入れるか、受け取りを選んでください。"]);
  else if (!v("#o-name") || !v("#o-tel")) msg = t(["Please enter your name and phone number.", "お名前と電話番号をご入力ください。"]);
  if (msg) { err.textContent = msg; err.hidden = false; $("#o-done").hidden = true; return; }
  err.hidden = true;
  const en = (p) => p[0], each = c[3] === "each", whole = c[3] !== "opt" && !each, z = zoneOf(v("#o-post"));
  const body = [`Cake: ${en(c[1])}`, `${whole ? "Size" : "Flavour"}: ${whole ? `${o[0]} (${o[1]})` : en(o[0])}${each ? ` x ${S.n}` : ""}`,
    $("#o-plaque").checked ? `Message plaque: ${v("#o-msg") || "(message to follow)"}` : "", `Day: ${$("#o-date").value} (${DAYS[di.wd][0]})`,
    S.how === "pickup" ? "Pick-up at 139 Parramatta Rd, Auburn" : `Delivery to postcode ${v("#o-post")} (Zone ${z + 1}, $${ZONES[z][0]})`, `Estimate: ${money(total)}`, `Name: ${v("#o-name")}`, `Phone: ${v("#o-tel")}`, "", v("#o-note")].filter((x, i) => x || i > 7).join("\n");
  $("#o-done").hidden = false;
  location.href = `mailto:order@makispatisserie.com?subject=${encodeURIComponent("Cake order")}&body=${encodeURIComponent(body)}`;
});

$("#o-date").min = iso(sydDate());
onRender(grid); onRender(selectCake); onRender(week); onRender(reel); onRender(about); onRender(hours); onRender(slip);
applyLang();
setInterval(hours, 60000);

if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".hero-copy > *", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.08, clearProps: "all" });
  gsap.from(".hero-pic img", { scale: 1.08, duration: 1.2, ease: "power2.out", clearProps: "transform" });
  gsap.from(".slip-note", { y: -30, rotate: -12, opacity: 0, duration: 0.7, ease: "back.out(1.5)", delay: 0.6, clearProps: "all" });
  ScrollTrigger.batch(".sec-head, .card, .form fieldset, .slip, .d-block, .qa details, .me, .about-text, .facts > div", {
    start: "top 90%", once: true,
    onEnter: (els) => gsap.from(els, { y: 22, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.05, clearProps: "all" }),
  });
}
