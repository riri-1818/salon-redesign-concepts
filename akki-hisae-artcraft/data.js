// 中身はすべて ClassBento の公開ページ（2026-10-24 15:30 取得）から。[英語, 日本語]
const ASOF = ["Dates as of 24 Oct 2026. You will see the latest seats when you book.", "日程は2026年10月24日時点のものです。最新の空席は、予約ページで確かめられます。"];

// 予約は ClassBento。管理画面の予約部品（Widgets）の埋め込みコードを CB_EMBED にそのまま貼ると、
// 下のこよみが ClassBento の予約カレンダーに替わる（サイト経由の予約は手数料が安い）。空のあいだは予約ページへ進む
const CB_EMBED = ``;
const CB_URL = "https://classbento.com.au/w/k6gn";

// 開催日（シドニー時間）
const SESSIONS = [
  "2026-10-29 18:00", "2026-10-30 11:00", "2026-10-30 14:30", "2026-10-30 18:00", "2026-11-01 18:00", "2026-11-02 18:00",
  "2026-11-05 18:00", "2026-11-06 18:00", "2026-11-07 18:00", "2026-11-08 18:00", "2026-11-09 18:00", "2026-11-12 18:00",
  "2026-11-13 18:00", "2026-11-14 18:00", "2026-11-15 18:00", "2026-11-16 18:00", "2026-11-19 18:00", "2026-11-20 11:00",
  "2026-11-20 14:30", "2026-11-20 18:00", "2026-11-21 11:00",
];

const PIECES = [
  { key: "glass", img: "img/wineglass.jpg", n: "01",
    name: ["Modern Raden wine glass", "螺鈿のワイングラス"],
    alt: ["Cherry blossoms in shell on the black foot of a wine glass", "ワイングラスの黒い脚に入れた、貝の桜"],
    body: ["The shell sits under the foot of the glass, so the pattern catches the light every time you lift it.", "貝の模様は、グラスの脚の裏に入れます。グラスを持ち上げるたびに光ります。"] },
  { key: "tumbler", img: "img/whale.jpg", n: "02",
    name: ["Modern Raden tumbler", "螺鈿のタンブラー"],
    alt: ["Two whales in shell at the bottom of a tumbler", "タンブラーの底に、貝の鯨が2頭"],
    body: ["A pattern of your own design in the base of a tumbler: flowers, waves, a whale, or Mt Fuji under the moon.", "タンブラーの底に、自分で考えた図案を入れます。花、波、鯨、月と富士山など、自由に選べます。"] },
  { key: "marker", img: "img/marker.jpg", n: "03",
    name: ["Wine marker", "ワインマーカー"],
    alt: ["A round black wine marker with shell cherry blossoms", "貝の桜が入った、丸く黒いワインマーカー"],
    body: ["Choose a wine marker, a key holder or a fridge magnet.", "ワインマーカー、キーホルダー、冷蔵庫のマグネットから選べます。"] },
];

// 2時間の流れ（順番はページの説明と口コミから組んだもの。確認リストに記載）
const STEPS = [
  { t: ["The story", "話を聞く"], d: ["The history, meaning and stories behind raden.", "まずは、螺鈿の歴史や意味、その背景にある話から。"] },
  { t: ["The shells", "貝を知る"], d: ["Genuine shell sheets from Japan: abalone and turban shell, with their natural rainbow layers.", "日本から取り寄せた、本物の貝のシートを使います。鮑（あわび）や夜光貝の、虹色の層を見ます。"] },
  { t: ["Your design", "図案を決める"], d: ["Come up with your own design. One guest chose “Go-en” (ご縁, connection).", "自分の図案を考えます。「ご縁」をテーマにした方もいました。"] },
  { t: ["Cut by hand", "手で切る"], d: ["Cut the shell pieces by hand. Every step is explained and shown first.", "貝は自分の手で切り出します。どの工程も、先にやって見せます。"] },
  { t: ["Set and finish", "はめて仕上げる"], d: ["UV resin and black acrylic paint are used instead of lacquer, so it is finished on the day.", "漆のかわりに UVレジンと黒のアクリル絵の具を使うので、その日のうちに仕上がります。"] },
  { t: ["Take it home", "持ち帰る"], d: ["Three finished pieces, ready to use. No waiting, no shipping.", "完成した3点を、そのまま使えます。完成を待つ必要も、配送もありません。"] },
];

// 口コミ（ClassBento の確認済みの口コミ。原文のまま）
const REVIEWS = [
  { n: "Tiahna Davis", m: "Sep 2026", q: "What an amazing experience! Akki was a fantastic instructor, and made the experience fun and informative. It was lovely to learn about Japanese culture in such a unique and immersive way. The class is so relaxing and will leave you in zen mode for the rest of the day." },
  { n: "Emiko Fukami", m: "Sep 2026", q: "I’m Japanese, but this was actually my first time learning about Raden in such detail. We started with its history and then learned about the different types of shells used, which I found really fascinating. I was a little worried about cutting the shell pieces because I’m not very good at delicate handwork, but everything was explained and demonstrated so carefully that I really enjoyed the process. I especially loved coming up with my own design! As I was visiting Australia, I chose “Go-en” (ご縁 – connection) as the theme for my piece. Next time, I’d love to try creating something with flowers or fireworks. I would definitely love to join another workshop! Thank you so much for such a wonderful experience and a lovely memory! ^^" },
  { n: "Ella Chan", m: "Aug 2026", q: "I booked this class as a birthday gift for my best friend, and we had a wonderful time! Akki san & Hisae san are lovely, respectful and helpful teachers. This is a very special experience that highlights beautiful Japanese culture and art. I recommend this activity if you’re looking for a unique creative experience, with items you can treasure forever!" },
  { n: "Ayako Suzuki", m: "Sep 2026", q: "Fantastic! I knew about Raden, because I’m Japanese. But I never imagined I would have such a wonderful experience of Raden art!!! Cutting out delicate seashells is difficult, but it’s a fun when I manage to cut them into the exact shape I wanted. It was moving to watch the inlaid work stand out more clearly as the process unfolded. Thank you Akki-san, Hisae-san, I loved to do it" },
  { n: "Evelyn Mike", m: "Mar 2026", q: "My husband and I love Japanese art and wanted to learn a new craft so this Raden workshop was perfect! The philosophical approach was lovely and Akki and Hisae were excellent teachers. We made such beautiful pieces in just 2 hours and had a wonderful time doing it! Highly recommend!!" },
  { n: "Hirokazu Mashimo", m: "Mar 2026", q: "Akki and Hisae’s Raden workshop is a really authentic Japanese cultural experience. It was such a pleasure to be able to create the beauty of this art ourselves with the help of such skilled sensei. It was very fulfilling!" },
  { n: "Winona Widarto", m: "Feb 2026", q: "Akki and Hisae were very rich in knowledge with Raden Art, as well as other traditional Japanese art. It was interesting and fun. We made 3 artworks with Raden Art ((1) Wine Glass, (2) Glass, and (3) magnet/ pendant/ wine glass identifier of my choice) and I am able to take the 3 artworks home on the same day." },
  { n: "K.ida", m: "Jan 2026", q: "I had such a great time at this workshop! Watching ordinary shells transform into stunning, shiny glass art was so satisfying. The final pieces look gorgeous and make perfect gifts. The teacher couple was warm, fun, and made the class super enjoyable. Highly recommend this workshop—I can’t wait to go again!" },
  { n: "Joanne Heather", m: "Jun 2026", q: "Today I enjoying myself to learn from the teacher is very good & so calm to relax with interputer sign language, it was so Beautiful art craft with shells, I love it" },
];
