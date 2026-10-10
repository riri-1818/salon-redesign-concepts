// WARAKU Healthcare & Massage — the parts that change: who is in, treatments and prices, the booking message. Language and Sydney-time helpers are in ds.js; motion uses GSAP, the therapist strip uses Embla.

/* weekly roster, Monday to Sunday, exactly as on the current booking page */
const ROSTER = {
  lemon: [["Norie", "Rie", "Jun"], ["Rie", "(Alisa)", "(Norie)"], ["Norie", "Alisa"], ["Rie", "Alisa"], ["Rie", "Chitose"], ["Rie", "Norie", "Alisa"], ["Saki", "Rie", "Alisa"]],
  archer: [["Tom", "Saki"], ["Tom"], ["Tom", "Saki"], ["Tom", "Saki"], ["Tom"], ["Tom", "Saki"], []],
};
const DAYS = [["Mon", "月"], ["Tue", "火"], ["Wed", "水"], ["Thu", "木"], ["Fri", "金"], ["Sat", "土"], ["Sun", "日"]];
const DAYS_L = [["Monday", "月曜"], ["Tuesday", "火曜"], ["Wednesday", "水曜"], ["Thursday", "木曜"], ["Friday", "金曜"], ["Saturday", "土曜"], ["Sunday", "日曜"]];
const ROOM = { lemon: ["Lemon Grove room", "Lemon Grove の治療室"], archer: ["Archer Street room", "Archer Street の治療室"] };

/* therapists (names, titles and words from the Therapists page) */
const PEOPLE = {
  Tom: { q: ["Bachelor of Acupuncture in Japan / Diploma of Remedial Massage and Shiatsu / TFH (Touch For Health Practitioner) / Sound Therapist", "鍼灸学士（日本）／Diploma of Remedial Massage and Shiatsu／TFH（Touch For Health プラクティショナー）／サウンドセラピスト"], bio: [["My name is Tom, and I am an experienced practitioner of Acupuncture with over 25 years of training in this ancient healing art. After completing my studies in Japan, I moved to Perth in 2004, where I spent 4.5 years practicing Acupuncture and deepening my knowledge of this field. Eventually, I felt drawn to explore other parts of Australia, and in 2008, I relocated to Sydney. Since then, I have continued to work with patients from all walks of life, helping them to achieve greater physical, emotional, and spiritual balance through the use of Acupuncture and other complementary modalities. I am passionate about the power of Acupuncture to promote health and well-being, and I look forward to sharing my expertise with you.", "Tom です。鍼の世界で25年以上、経験を積んできました。日本で学んだあと、2004年にパースへ移り、4年半、鍼の施術をしながら知識を深めました。その後、オーストラリアのほかの土地も見てみたいと思い、2008年にシドニーへ移りました。それ以来、さまざまな方に、鍼とそのほかの補完的な施術を通して、体・気持ち・心のバランスを整えるお手伝いを続けています。鍼が持つ、健康を支える力を信じています。皆さまにお会いできるのを楽しみにしています。"]], full: "Motohiro Wada (Tom)", img: "tom", role: ["Acupuncture & Shiatsu Practitioner", "鍼・指圧"], say: ["“I am an experienced practitioner of Acupuncture with over 25 years of training in this ancient healing art.”", "「鍼の世界で25年以上、経験を積んできました。」"] },
  Saki: { bio: [["I have more than 15 years’ experience working in the field of acupuncture and osteopathy in Japan. The treatment method I employ is quite unique, employing Remedial Massage, TP, Shiatsu and Japanese Osteopathy to help relieve muscular pain. My technique can effectively transform your posture, increasing ROM (range of motion).", "日本で15年以上、鍼と整体にたずさわってきました。リメディアル・マッサージ、トリガーポイント、指圧、日本の整体を組み合わせた独自の方法で、筋肉の痛みをやわらげます。姿勢を変え、関節の動く範囲（可動域）を広げることができます。"], ["I have been playing a variety of sports since I was young: swimming, track and field, baseball and rugby. Now, I enjoy running, yoga and tennis. As well as playing sports, I enjoy watching them, and I am familiar with the physical problems and sports injuries experienced by athletes.", "子どものころから、水泳、陸上、野球、ラグビーと、いろいろなスポーツをしてきました。今は、ランニング、ヨガ、テニスを楽しんでいます。観るのも好きで、スポーツをする人の体の悩みやケガのことをよく知っています。"]], full: "Yoshinori Sakiyama (Saki)", img: "saki", role: ["Shiatsu Practitioner", "指圧"], say: ["“I have more than 15 years’ experience working in the field of acupuncture and osteopathy in Japan.”", "「日本で15年以上、鍼と整体にたずさわってきました。」"] },
  Rie: { bio: [["I am a qualified remedial massage therapist. Having experienced shoulder stiffness since childhood, I truly understand how it feels to live with body pain and discomfort. To maintain my own well-being, I regularly receive massages and take care of my body. My goal is to help clients relieve tension, reduce pain, and improve their overall physical condition so they can live more comfortably.", "リメディアル・マッサージの資格を持っています。子どものころから肩こりに悩んできたので、体の痛みや不調のつらさがよく分かります。自分でも定期的にマッサージを受けて、体を整えています。こりをほぐし、痛みを減らし、体全体の調子を整えて、毎日を楽に過ごしていただくことが目標です。"], ["Services offered: Remedial Massage, which combines pressure point therapy with oil massage to release muscle tightness and enhance relaxation. Pressure point massage (oil-free), which targets deep muscle tension and stiffness through precise pressure techniques. Stretching, which improves flexibility, posture, and range of motion for better mobility.", "行っている施術：リメディアル・マッサージ（ツボへの圧とオイルマッサージを組み合わせて、筋肉のこわばりをゆるめ、リラックスを深めます）。オイルを使わない指圧マッサージ（正確な圧で、深いこりに働きかけます）。ストレッチ（柔軟性、姿勢、可動域をよくして、動きやすい体にします）。"], ["I am available Thursday to Tuesday, working almost every day. If you are experiencing body discomfort or pain, feel free to reach out!", "木曜から火曜まで、ほぼ毎日います。体の不調や痛みがあるときは、お気軽にご連絡ください。"]], full: "Rie Sugiura (Rie)", img: "rie", role: ["Remedial Massage Practitioner", "リメディアル・マッサージ"], say: ["“Having experienced shoulder stiffness since childhood, I truly understand how it feels to live with body pain and discomfort.”", "「子どものころから肩こりに悩んできたので、体の痛みや不調のつらさがよく分かります。」"] },
  Norie: { bio: [["I am a qualified specialist in remedial massage and facial dry needling, graduating in specialist courses in Sydney in 2012. I am also trained in traditional Thai massage practice, having completed courses in this modality in Phuket, Thailand in 2014.", "リメディアル・マッサージと美顔鍼の資格を持っています。2012年にシドニーで専門のコースを修了しました。2014年にはタイのプーケットで、タイ古式マッサージのコースも修了しています。"], ["I am Japanese and come from Hokkaido, which is in the northernmost part of Japan. I am a registered nurse and I love helping my patients and enjoy caring for their physical and emotional well being. I understand the emotional needs of being a parent, having two of my own school-aged children.", "日本のいちばん北にある、北海道の出身です。看護師の資格を持っていて、体と心の両方をケアすることが、何よりのやりがいです。学校に通う2人の子どもがいるので、親としての気持ちもよく分かります。"], ["My hobbies include snowboarding, ice skating and yoga. See you soon!", "趣味は、スノーボード、アイススケート、ヨガです。お会いできるのを楽しみにしています。"]], full: "Norie (Nori)", img: "norie", role: ["Remedial Massage & Facial Dry Needling Practitioner", "リメディアル・マッサージ、美顔鍼"], say: ["“I am a registered nurse and I love helping my patients and enjoy caring for their physical and emotional well being.”", "「看護師の資格を持っています。体と心の両方をケアすることが、何よりのやりがいです。」"] },
  Alisa: { bio: [["I’m originally from Gunma Prefecture, Japan. From a young age, I was deeply involved in basketball, achieving the remarkable milestone of competing at the national level. However, after experiencing a sports-related injury myself, I became inspired to pursue a career in medical and rehabilitation in Japan. I dedicated myself to study and worked passionately for eight years in a hospital setting in Tokyo, specializing in supporting patients through their rehabilitation journeys. I was deeply committed to enhancing my patients’ health and improving their overall quality of life (QOL).", "群馬県の出身です。子どものころからバスケットボールに打ちこみ、全国大会に出場しました。自分がスポーツでケガをしたことをきっかけに、日本で医療とリハビリの道に進みました。東京の病院で8年間、リハビリを専門に、患者さんの回復を支えてきました。健康を取り戻し、生活の質（QOL）を高めることに力を注いできました。"], ["Today, as a Remedial massage therapist, my focus is on listening to your body’s needs and helping you achieve optimal comfort and wellbeing! I look forward to meeting you and working together to help you feel your best every day.", "今は、リメディアル・マッサージのセラピストとして、体の声に耳を傾け、いちばん楽な状態に近づけることを大切にしています。毎日を気持ちよく過ごせるように、一緒に取り組んでいきましょう。"]], full: "Azusa Shimoyama (Alisa)", img: "alisa", role: ["Remedial Massage Practitioner", "リメディアル・マッサージ"], say: ["“My focus is on listening to your body’s needs and helping you achieve optimal comfort and wellbeing!”", "「体の声に耳を傾けて、いちばん楽な状態に近づけます。」"] },
  Jun: { bio: [["Hello! My name is Jun, a Stretch Master. I have 3 years of experience as a Stretching Trainer in Japan and 2 years as a Stretch and Massage Therapist here in Australia, a total of 5 years in the industry. My main techniques include myofascial release, trigger point pressure massage, and stretching, which help to relieve muscle tension, improve range of motion, and enhance flexibility.", "こんにちは。ストレッチ・マスターの Jun です。日本でストレッチ・トレーナーとして3年、オーストラリアでストレッチとマッサージのセラピストとして2年、合わせて5年の経験があります。筋膜リリース、トリガーポイント、ストレッチを組み合わせて、筋肉の緊張をゆるめ、可動域を広げ、柔軟性を高めます。"], ["I especially recommend my treatments for those who are active with weight training or sports, as well as for those who don’t usually exercise. Because I move your muscles for you during the session, your body will feel like it’s just had a light workout afterward! I currently work on Mondays only, and I look forward to seeing you soon :)", "ウエイトトレーニングやスポーツをしている方はもちろん、ふだん運動をしない方にもおすすめです。施術の中でこちらが筋肉を動かすので、終わったあとは、軽く運動をしたような感覚になります。今は月曜だけ出勤しています。お会いできるのを楽しみにしています。"]], full: "Jun Mori (Jun)", img: "jun", role: ["Remedial Massage Practitioner", "リメディアル・マッサージ"], say: ["“My main techniques include myofascial release, trigger point pressure massage, and stretching.”", "「筋膜リリース、トリガーポイント、ストレッチを組み合わせて施術します。」"] },
  Chitose: { full: "Chitose", img: "", role: ["Lemon Grove room", "Lemon Grove の治療室"], say: ["", ""] },
};

/* treatments and prices (from the Service page) */
const MENU = [
  { id: "rem", more: [["Remedial Massage focuses on manipulating the soft tissues of the body, relieving pain as well as making you relaxed. This massage applies various advanced remedial techniques, such as deep tissue massage, trigger point therapy, myofascial release and/or lymphatic drainage. The therapist will select which techniques are suitable to solve your problems.", "体のやわらかい組織に働きかけて、痛みをやわらげ、リラックスへ導きます。ディープティシュー、トリガーポイント、筋膜リリース、リンパドレナージュなどの手技の中から、お悩みに合うものをセラピストが選びます。"]], room: "lemon", n: ["Remedial Massage", "リメディアル・マッサージ"], d: ["For those who have symptoms of pain or discomfort. The therapist chooses from deep tissue massage, trigger point therapy, myofascial release and lymphatic drainage.", "痛みや不調がある方に。ディープティシュー、トリガーポイント、筋膜リリース、リンパドレナージュなどから、セラピストが合う手技を選びます。"],
    rows: [[["30 minutes", "30分"], 75], [["45 minutes", "45分"], 105], [["60 minutes", "60分"], 125], [["75 minutes", "75分"], 165], [["90 minutes", "90分"], 200]], note: ["October special: $10 off the 90-minute remedial massage.", "10月のスペシャル：90分のリメディアル・マッサージが $10 引きです。"] },
  { id: "aro", more: [["The essential oils are carefully selected depending on your preference and your conditions. This treatment will give you deeper relaxation and stress relief than normal Remedial Massage.", "エッセンシャルオイルは、お好みと体調に合わせて丁寧に選びます。通常のリメディアル・マッサージよりも、深いリラックスとストレスの解消が得られます。"]], room: "lemon", n: ["Aromatic Remedial Massage", "アロマ・マッサージ"], d: ["A remedial massage with a blend of massage oil and essential oils, selected for your preference and condition.", "マッサージオイルにエッセンシャルオイルを混ぜて行います。香りは、お好みと体調に合わせて選びます。"],
    rows: [[["60 minutes", "60分"], 135], [["75 minutes", "75分"], 175], [["90 minutes", "90分"], 210]] },
  { id: "fdn", more: [["Facial dry needling is a very safe method of restoring a youthful appearance and natural beauty to your face without the risks associated with more invasive cosmetic surgery. Start the process of restoring beauty to your facial skin today!", "美顔鍼は、体への負担が大きい美容手術のようなリスクなしに、若々しさと自然な美しさを取り戻す、とても安全な方法です。お顔の肌の美しさを取り戻す一歩を、今日から始めませんか。"]], room: "lemon", n: ["Facial Dry Needling", "美顔鍼"], d: ["Japanese-style facial dry needling, combined with remedial massage techniques. Available Mondays, Wednesdays and Saturdays. Health fund rebates are available.", "日本式の美顔鍼（フェイシャル・ドライニードリング）です。リメディアル・マッサージの手技も組み合わせます。月・水・土に受けられます。保険の払い戻しの対象です。"],
    rows: [[["Basic, 40 minutes", "ベーシック 40分"], 115], [["60 minutes, with remedial massage", "60分（マッサージつき）"], 140], [["80 minutes, with remedial massage", "80分（マッサージつき）"], 180], [["Basic, 5-visit package", "ベーシック 5回券"], 550]], days: [0, 2, 5] },
  { id: "acu", more: [["Chinese Medicine has 5,000 years of history. Acupuncture was transmitted to Japan about 1,400 years ago and developed in Japanese culture. Acupuncture helps boost your vital energy (Ki) and assists to naturally release pains and symptoms. So, with no fear and no pain, you feel totally relaxed during and after Japanese acupuncture treatments, while improving your health. Japanese acupuncture is gentle enough to treat children, but effective.", "中国医学には5,000年の歴史があります。鍼は約1,400年前に日本に伝わり、日本の文化の中で発展してきました。鍼は、生命のエネルギー（気）を高め、痛みや症状が自然にやわらぐのを助けます。こわさも痛みもなく、施術の間もあとも深くリラックスしながら、体調を整えられます。日本式の鍼は、お子さまにも使えるほどやさしく、それでいて効果があります。"], ["For those who want to fix more serious problems, we recommend acupuncture treatment.", "より深い不調を整えたい方には、鍼をおすすめします。"], ["Many health practitioners may recommend acupuncture as an adjunct treatment that may assist with IVF treatment. There is continuing research about how acupuncture can assist with the effectiveness of IVF treatment and you should consult your treating practitioner/s about how acupuncture may be able to help you.", "IVF（体外受精）を助ける補助的な施術として、鍼をすすめる医療従事者は少なくありません。鍼が IVF にどう役立つかについては、研究が続けられています。ご自身の場合にどう役立つかは、担当の先生にご相談ください。"]], room: "archer", n: ["Acupuncture", "鍼"], d: ["Japanese style acupuncture, with hair-fine needles and the gentle method of Meridian Therapy. From 60 minutes.", "髪の毛ほどの細い鍼を使う、日本式の鍼です。やさしい刺激で、経絡に働きかけます。60分から。"],
    rows: [[["Initial treatment", "初回"], 160], [["Subsequent visit", "2回目から"], 150]] },
  { id: "shi", more: [["A well trained therapist applies pressure on your acupoints. When your acupoints are stimulated, you will feel a satisfying burn in your acupoints. Those who prefer firm pressure will especially like it. Those who don’t like firm pressure also can enjoy our treatment as our therapists can adjust the strength according to your preference.", "経験を積んだセラピストが、ツボを押します。ツボが刺激されると、じんわりと心地よい響きを感じます。しっかりした圧がお好きな方には、とくに喜ばれます。強い圧が苦手な方も、お好みに合わせて強さを調整しますので、安心して受けていただけます。"]], room: "archer", n: ["Shiatsu Massage", "指圧"], d: ["Pressure on your acupoints, adjusted to your preference. This massage can be applied through your clothing.", "ツボを指で押す施術です。強さはお好みに合わせます。服を着たまま受けられます。"],
    rows: [[["Initial visit, 60 minutes", "初回 60分"], 160], [["Subsequent visit, 60 minutes", "2回目から 60分"], 150]] },
  { id: "snd", more: [["We provide a very unique Sound Therapy. The beautiful harmonic overtones reach inside of your body and brain. The wonderful vibration will resonate with your brainwaves and bring them to a θ (theta) wave condition. It means you will get a similar status to meditation and improve your sleep. It will help to calm your emotion and relax your body and mind!", "WARAKU ならではのサウンドセラピーです。美しい倍音が、体と脳の奥まで届きます。心地よい振動が脳波と共鳴し、θ（シータ）波の状態へ導きます。瞑想に近い状態になり、眠りの質がよくなります。気持ちが落ち着き、体も心もゆるみます。"]], room: "archer", n: ["Sound Therapy", "サウンドセラピー"], d: ["Using a Japanese healing sound instrument called the Singing Ring.", "シンギング・リンという日本の楽器の、音と響きを使います。"],
    rows: [[["Harmonic Sound Drainage, 60 minutes", "Harmonic Sound Drainage 60分"], 150], [["3 Type Wayuruveda, 90 minutes", "3 Type Wayuruveda 90分"], 230]] },
];
const TIMES = [["any time", "時間はいつでも"], ["morning", "午前"], ["around midday", "お昼ごろ"], ["afternoon", "午後"]];

const NOW = sydney();
let day = NOW.d, picked = null, kind = "rem";
const state = { treat: "rem", len: 2, day: 0, time: 0, who: "" };
const clean = (n) => n.replace(/[()]/g, "");
const menuOf = (id) => MENU.find((x) => x.id === id);

const KINDS = { lemon: ["Remedial massage, facial dry needling", "リメディアル・マッサージ、美顔鍼"], archer: ["Acupuncture, shiatsu", "鍼、指圧"] };
function openNow() {
  const on = NOW.m >= 570 && NOW.m < 1080;
  $("#dot").classList.toggle("on", on);
  $("#open").textContent = on ? t(["Open now, until 6:00pm", "ただいま営業中です（18:00 まで）"]) : NOW.m < 570 ? t(["Opens today at 9:30am", "本日は 9:30 から営業します"]) : t(["Closed for today. Opens tomorrow at 9:30am", "本日の営業は終了しました。明日は 9:30 からです"]);
}
/* the weekly roster: one column per day on a wide screen, one day at a time on a phone */
function board() {
  $("#b-title").textContent = day === NOW.d ? t([`Who is in today, ${DAYS_L[day][0]}`, `今日（${DAYS_L[day][1]}）の担当`]) : t([`Who is in on ${DAYS_L[day][0]}`, `${DAYS_L[day][1]}の担当`]);
  const head = DAYS.map((d, i) => `<button type="button" class="day" aria-pressed="${i === day}" data-day="${i}" aria-label="${t(DAYS_L[i])}">${i === NOW.d ? `<i>${t(["Today", "今日"])}</i>` : ""}${t(d)}</button>`).join("");
  const row = (r) => `<div class="rlabel"><b>${t(ROOM[r])}</b><span>${t(KINDS[r])}</span></div>` + ROSTER[r].map((names, i) => `<div class="cell${i === day ? " on" : ""}">${names.length ? names.map((n) => `<button type="button" class="name" aria-pressed="${picked === clean(n) && i === day}" data-n="${clean(n)}" data-d="${i}">${n}</button>`).join("") : `<span class="none">${t(["Not listed. Please call.", "記載なし。お電話でどうぞ。"])}</span>`}</div>`).join("");
  $("#week").innerHTML = `<div class="corner"></div>${head}${row("lemon")}${row("archer")}`;
  $("#b-note").hidden = !ROSTER.lemon[day].concat(ROSTER.archer[day]).some((n) => n.includes("("));
  who();
}
function daysOf(n) {
  return ["lemon", "archer"].map((r) => { const ds = DAYS.filter((_, i) => ROSTER[r][i].some((x) => clean(x) === n)).map((d) => t(d)); return ds.length ? t([`${ds.join(", ")} at the ${ROOM[r][0]}`, `${ds.join("・")}（${ROOM[r][1]}）`]) : ""; }).filter(Boolean).join(t(["; ", "、"]));
}
function who() {
  const el = $("#who"); if (!picked) { el.innerHTML = ""; return; }
  const p = PEOPLE[picked];
  el.innerHTML = `<div class="who-card">${p.img ? `<img src="img/${p.img}.jpg" width="300" height="300" alt="">` : "<span></span>"}<div><h3>${p.full}</h3><p class="role">${t(p.role)}</p>${t(p.say) ? `<p class="say">${t(p.say)}</p>` : ""}<p class="in">${t(["In on ", "出勤："])}${daysOf(picked)}</p></div><a href="#book" data-who="${picked}">${t(["Book with " + picked, picked + " さんで予約する"])}</a></div>`;
}
function todayLines() {
  for (const r of ["lemon", "archer"]) { const n = ROSTER[r][NOW.d]; $("#t-" + r).textContent = n.length ? t(["In today: ", "今日の担当："]) + n.join(t([", ", "、"])) : t(["Please call to ask who is in today.", "今日の担当は、お電話でお問い合わせください。"]); }
}
/* treatments: a list that opens, grouped by room */
function menu() {
  $("#list").innerHTML = ["lemon", "archer"].map((r) => `<h3 class="room-h">${t(ROOM[r])}</h3>` + MENU.filter((m) => m.room === r).map((m) => {
    const open = m.id === kind, from = Math.min(...m.rows.map((x) => x[1]));
    return `<div class="item${open ? " open" : ""}"><button type="button" class="item-h" aria-expanded="${open}" data-kind="${m.id}"><span class="nm">${t(m.n)}</span><span class="from">${t(["from $" + from, "$" + from + "〜"])}</span><i class="pm"></i></button><div class="item-b"><div><div class="item-in"><p>${t(m.d)}</p>${(m.more || []).map((x) => `<p>${t(x)}</p>`).join("")}${m.note ? `<p class="special">${t(m.note)}</p>` : ""}<ul class="rows">${m.rows.map((x, i) => `<li><span>${t(x[0])}</span><b>$${x[1]}</b><a href="#book" data-treat="${m.id}" data-len="${i}" aria-label="${t(["Book", "予約する"])}: ${t(m.n)} ${t(x[0])}">${t(["Book", "予約する"])}</a></li>`).join("")}</ul></div></div></div></div>`;
  }).join("")).join("");
}
let embla = null;
function staff() {
  $("#staff").innerHTML = ["Tom", "Saki", "Rie", "Norie", "Alisa", "Jun"].map((k) => { const p = PEOPLE[k]; return `<li><img loading="lazy" src="img/${p.img}.jpg" width="300" height="300" alt="" draggable="false"><h3>${p.full}</h3><p class="role">${t(p.role)}</p>${p.q ? `<p class="role">${t(p.q)}</p>` : ""}<p class="say">${t(p.say)}</p><p class="in">${t(["In on ", "出勤："])}${daysOf(k)}</p><details class="bio"><summary>${t(["Read the full introduction", "紹介を全部読む"])}</summary>${p.bio.map((x) => `<p>${t(x)}</p>`).join("")}</details></li>`; }).join("");
  for (const b of $$(".arrows button")) b.setAttribute("aria-label", t([b.dataset.labelEn, b.dataset.labelJa]));
  if (!window.EmblaCarousel) return;
  if (embla) embla.destroy();
  embla = EmblaCarousel($("#embla"), { align: "start", containScroll: "trimSnaps", dragFree: true });
  const sync = () => { $("#s-prev").disabled = !embla.canScrollPrev(); $("#s-next").disabled = !embla.canScrollNext(); };
  embla.on("select", sync).on("reInit", sync).on("settle", sync); sync();
}

/* booking request: the choices become a message */
function nextDays() {
  const m = menuOf(state.treat), out = [];
  for (let i = 0; i < 7; i++) {
    const dt = new Date(Date.now() + i * 864e5), d = (NOW.d + i) % 7;
    if (m.days && !m.days.includes(d)) continue;
    const f = new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-AU", { timeZone: "Australia/Sydney", day: "numeric", month: "long" }).format(dt);
    out.push({ d, label: lang === "ja" ? `${f}（${DAYS[d][1]}）` : `${DAYS_L[d][0]} ${f}` });
  }
  return out;
}
function form() {
  const m = menuOf(state.treat); if (state.len >= m.rows.length) state.len = 0;
  const ds = nextDays(); if (state.day >= ds.length) state.day = 0;
  $("#f-treat").innerHTML = ["lemon", "archer"].map((r) => `<optgroup label="${t(ROOM[r])}">${MENU.filter((x) => x.room === r).map((x) => `<option value="${x.id}"${x.id === state.treat ? " selected" : ""}>${t(x.n)}</option>`).join("")}</optgroup>`).join("");
  $("#f-len").innerHTML = m.rows.map((r, i) => `<option value="${i}"${i === state.len ? " selected" : ""}>${t(r[0])}（$${r[1]}）</option>`).join("");
  $("#f-day").innerHTML = ds.map((d, i) => `<option value="${i}"${i === state.day ? " selected" : ""}>${d.label}</option>`).join("");
  $("#f-time").innerHTML = TIMES.map((x, i) => `<option value="${i}"${i === state.time ? " selected" : ""}>${t(x).replace(/^./, (c) => c.toUpperCase())}</option>`).join("");
  slip();
}
function slip() {
  const m = menuOf(state.treat), row = m.rows[state.len], d = nextDays()[state.day], name = $("#f-name").value.trim();
  const inThat = ROSTER[m.room][d.d].map(clean), who = state.who && inThat.includes(state.who) ? state.who : "";
  const msg = lang === "ja"
    ? `こんにちは。WARAKU（${ROOM[m.room][1]}）の予約をお願いします。\nメニュー：${m.n[1]} ${row[0][1]}（$${row[1]}）\n希望日：${d.label} ${TIMES[state.time][1]}${who ? `\nセラピスト：${who} さん希望` : ""}\n名前：${name}`
    : `Hello, I would like to book at WARAKU (${ROOM[m.room][0]}).\nTreatment: ${m.n[0]}, ${row[0][0]} ($${row[1]})\nDay: ${d.label}, ${TIMES[state.time][0]}${who ? `\nTherapist: ${who}` : ""}\nName: ${name}`;
  $("#slip-msg").textContent = msg;
  const body = encodeURIComponent(msg);
  const to = m.id === "fdn" ? { sms: ["+61407351496", "0407 351 496"], mail: "noriewaraku@gmail.com" } : m.room === "lemon" ? { sms: ["+61449569107", "0449 569 107"], tel: ["+61294103413", "02 9410 3413"] } : { tel: ["+61294102258", "02 9410 2258"] };
  $("#slip-to").textContent = m.id === "fdn" ? t(["Facial dry needling is booked by text or email.", "美顔鍼のご予約は、SMS かメールで承ります。"]) : m.room === "archer" ? t(["The Archer Street room takes bookings by phone.", "Archer Street の治療室のご予約は、お電話で承ります。"]) : t(["The Lemon Grove room takes bookings by phone or text.", "Lemon Grove の治療室のご予約は、お電話か SMS で承ります。"]);
  $("#slip-go").innerHTML = (to.sms ? `<a class="btn" href="sms:${to.sms[0]}?&body=${body}">${t(["Text to ", "SMS で送る "])}${to.sms[1]}</a>` : "") + (to.mail ? `<a class="btn btn--line" href="mailto:${to.mail}?subject=${encodeURIComponent(t(["Booking request", "予約リクエスト"]))}&body=${body}">${t(["Send by email", "メールで送る"])}</a>` : "") + (to.tel ? `<a class="btn${to.sms ? " btn--line" : ""}" href="tel:${to.tel[0]}">${t(["Call ", "電話する "])}${to.tel[1]}</a>` : "") + `<button type="button" class="btn btn--line" id="copy">${t(["Copy the message", "メッセージをコピー"])}</button>`;
}
$("#req").addEventListener("change", (e) => { const id = e.target.id; if (id === "f-treat") { state.treat = e.target.value; state.len = 0; state.day = 0; } if (id === "f-len") state.len = +e.target.value; if (id === "f-day") state.day = +e.target.value; if (id === "f-time") state.time = +e.target.value; form(); });
$("#f-name").addEventListener("input", slip);
$("#req").addEventListener("submit", (e) => e.preventDefault());
document.addEventListener("click", (e) => {
  const d = e.target.closest("[data-day]"); if (d) { day = +d.dataset.day; picked = null; board(); drop(); return; }
  const n = e.target.closest(".name"); if (n) { const same = picked === n.dataset.n && day === +n.dataset.d; day = +n.dataset.d; picked = same ? null : n.dataset.n; board(); if (picked && window.gsap && !reduce) gsap.from(".who-card", { y: 16, opacity: 0, duration: .4, ease: "power2.out" }); return; }
  const k = e.target.closest("[data-kind]"); if (k) { kind = kind === k.dataset.kind ? "" : k.dataset.kind; for (const it of $$(".item")) { const on = it.firstElementChild.dataset.kind === kind; it.classList.toggle("open", on); it.firstElementChild.setAttribute("aria-expanded", on); } return; }
  if (e.target.id === "s-prev" && embla) { embla.scrollPrev(); return; }
  if (e.target.id === "s-next" && embla) { embla.scrollNext(); return; }
  const a = e.target.closest("[data-treat]"); if (a) { state.treat = a.dataset.treat; state.len = +a.dataset.len; state.day = 0; form(); return; }
  const w = e.target.closest("[data-who]");
  if (w) { state.who = w.dataset.who; const inRoom = (r) => ROSTER[r].some((x) => x.map(clean).includes(state.who)); if (!inRoom(menuOf(state.treat).room)) { state.treat = inRoom("lemon") ? "rem" : "acu"; state.len = 0; } const i = nextDays().findIndex((x) => ROSTER[menuOf(state.treat).room][x.d].map(clean).includes(state.who)); state.day = Math.max(0, i); form(); return; }
  if (e.target.id === "copy") { const b = e.target; (navigator.clipboard ? navigator.clipboard.writeText($("#slip-msg").textContent) : Promise.reject()).then(() => { b.textContent = t(["Copied", "コピーしました"]); }).catch(() => { const r = document.createRange(); r.selectNodeContents($("#slip-msg")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = t(["Selected. Please copy.", "選択しました。コピーしてください"]); }); }
});
onRender(() => { openNow(); board(); todayLines(); menu(); staff(); form(); });
applyLang();

/* motion (GSAP). Everything is visible without it, and it is skipped when reduced motion is on. */
function drop() { if (window.gsap && !reduce) gsap.from(".cell.on .name", { y: -10, opacity: 0, duration: .35, stagger: .05, ease: "power2.out", clearProps: "all" }); }
if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const split = new SplitText("#h1", { type: "lines", linesClass: "ln" });
  const inner = split.lines.map((l) => { const s = document.createElement("div"); s.innerHTML = l.innerHTML; l.innerHTML = ""; l.appendChild(s); return s; });
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(inner, { yPercent: 105, duration: .8, stagger: .12, onComplete: () => split.revert() })
    .from(".since, .hero-side > *", { y: 14, opacity: 0, duration: .5, stagger: .07 }, .25)
    .from(".slab-head > *", { y: 14, opacity: 0, duration: .5, stagger: .06 }, .45)
    .from(".day", { y: 18, opacity: 0, duration: .45, stagger: .04 }, .55)
    .from(".cell.on .name, .rlabel", { opacity: 0, y: 10, duration: .4, stagger: .03, clearProps: "all" }, .8);
  ScrollTrigger.batch(".rail-title, .item, .room-h, .facts > div, .req > *, .three li, .newslist li, .prose > *", { start: "top 90%", once: true, onEnter: (els) => gsap.from(els, { y: 24, opacity: 0, duration: .55, stagger: .06, ease: "power2.out", clearProps: "transform,opacity" }) });
  /* the walk from the station: the line is drawn, then each stop appears */
  const route = $(".route");
  gsap.timeline({ scrollTrigger: { trigger: route, start: "top 78%", once: true } })
    .fromTo(route, { "--draw": 0 }, { "--draw": 1, duration: 1.1, ease: "power2.inOut" })
    .from(".stn, .stop", { opacity: 0, y: 20, duration: .5, stagger: .22, ease: "power2.out", clearProps: "transform,opacity" }, .1)
    .from(".stop img", { scale: 1.12, duration: 1.2, stagger: .22, ease: "power2.out", clearProps: "transform" }, .1);
  gsap.from(".staff li", { scrollTrigger: { trigger: "#embla", start: "top 85%", once: true }, x: 60, opacity: 0, duration: .6, stagger: .07, ease: "power2.out", clearProps: "transform,opacity" });
}
