// Dance Worx Academy のデータ。いまのサイト（INFO・Plans & Pricing・All Products、2026-10-16 取得）のとおり。
const AGES = [
  { id: "cc", name: "Curious Cuties", ages: "3-6 years", text: "Developing gross motor skills in tune with music appreciation. This incorporates counting music and putting steps to beats as well as training them to recall a sequence of simple movement combinations." },
  { id: "jr", name: "Juniors", ages: "7-11 years", text: "Establishing the foundations of movements within the variety of styles and distinguishing the technique for each. This involves technical exercises for each style and intermediate levels of movement combinations." },
  { id: "tn", name: "Teens", ages: "12-16 years", text: "Developing the style specific movements with more attention to finer details in steps and choreography. At this level, students will learn to explore movement in combination with expression and how various sequences can have particular meanings. Students will also learn to interpret movement with music and read other performances for interpretation and comment." },
  { id: "ad", name: "Adults", ages: "Adults", text: "" },
  { id: "pv", name: "Private Lesson", ages: "All ages", text: "1 on 1 tuition for students of all ages whom develop a further interest and enjoyment in a certain style of Dance. Taught by myself, or one of my highly experienced staff members, to expand their knowledge and technique." },
];
const STYLES = ["Jazz", "Hip-hop", "Ballet", "Acrobatics", "Tap", "Contemporary", "Lyrical", "Musical Theatre"];
// Uniform Requirements（いまのサイトに書かれている踊りだけ）
const UNIFORM = {
  _all: "Dance Worx T-Shirt mandatory uniform, worn in all classes except for ballet.",
  Ballet: "Hair in a tidy bun, leotard and ballet shoes.",
  Jazz: "Hair in a neat ponytail. Shorts, tights and Dance Worx T-Shirt with jazz shoes.",
  Tap: "Hair in a neat ponytail. Shorts, tights, pants and Dance Worx T-Shirt paired with tap shoes.",
  "Hip-hop": "Hair in a neat ponytail. Shorts, tights, pants and Dance Worx T-Shirt paired with jazz shoes or sneakers.",
};
const PLANS = {
  rec: [
    { k: "1", name: "Recreational 1", price: 230, note: "1 Class per week + Costume Levy $30 per term" },
    { k: "2", name: "Recreational 2", price: 400, note: "2 classes per week + Costume Levy $30" },
    { k: "3", name: "Recreational 3", price: 570, note: "3 Class per week + Costume Levy $30 per term" },
    { k: "4", name: "Recreational 4", price: 700, note: "4 Class per week + Costume Levy $30 per term" },
    { k: "u", name: "Recreational Unlimited", price: 780, note: "Unlimited class per week only one class + Costume Levy $30" },
  ],
  elite: [
    { k: "1", age: "cj", name: "Elite Package 1 (CC/JUNIOR)", price: 390, note: "Access to all classes per week (1 Type)" },
    { k: "1", age: "tn", name: "Elite Package 1 (Teen)", price: 440, note: "Access to all classes 1 style of dance per week" },
    { k: "2", age: "cj", name: "Elite Package 2 (CC/JUNIOR)", price: 660, note: "Access to all classes for 2 styles of dance per week" },
    { k: "2", age: "tn", name: "Elite Package 2 (Teen)", price: 710, note: "Access to all classes 2 styles dance per week" },
    { k: "3", age: "cj", name: "Elite Package 3 (CC/JUNIOR)", price: 860, note: "Access to all classes 3 styles dance per week" },
    { k: "3", age: "tn", name: "Elite Package 3 (Teen)", price: 910, note: "Access to all classes 3 styles dance per" },
    { k: "4", age: "cj", name: "Elite Package 4 (CC/JUNIOR)", price: 1060, note: "Access to all classes 4 styles dance per week" },
    { k: "4", age: "tn", name: "Elite Package 4 (Teens)", price: 1110, note: "Access to all classes 4 styles dance per week" },
    { k: "u", age: "cc", name: "Elite Unlimited CC", price: 1250, note: "Access to all classes per week" },
    { k: "u", age: "jr", name: "Elite Unlimited (Junior)", price: 1300, note: "Access to all classes" },
    { k: "u", age: "tn", name: "Elite Unlimited (Teen)", price: 1350, note: "Access to all classes" },
  ],
  priv: [
    { k: "60", name: "Private Session - 1 Hour", price: 80, note: "One on one session. Valid for 7 days" },
    { k: "45", name: "Private Session - 45 minutes", price: 65, note: "Valid for 7 days" },
    { k: "30", name: "Private Session - 30 minutes", price: 50, note: "Valid for 7 days" },
  ],
};
// Term Dates 2026（Term 2 の終わりは、いまのサイトでは「4 July 2025」。2026 の誤記と見て 2026 で描く）
const TERMS = [["Term 1", "2026-02-02", "2026-04-04"], ["Term 2", "2026-04-22", "2026-07-04"], ["Term 3", "2026-07-21", "2026-09-26"], ["Term 4", "2026-10-13", "2026-12-19"]];
const EVENTS = [["Afternoon of Music (12 and under)", "2026-11-28"], ["Afternoon of Music", "2026-11-29"], ["End of year concert", "2026-12-11"]];
const PRODUCTS = [
  { id: "aom12", name: "Afternoon of Music - 12 and under", price: "$0.00", img: null, day: "28", when: "1pm Saturday", text: "Date: 1pm 28 November 2026. Location: Casablanca / 3A Bells Road, Oatlands NSW 2117. Ticket: $50. Children 12 and under are free." },
  { id: "aom", name: "Afternoon of Music", price: "$50.00", img: null, day: "29", when: "1pm Sunday", text: "Date: 1pm 29 November 2026. Location: Casablanca / 3A Bells Road, Oatlands NSW 2117. Ticket: $50. Children 12 and under are free." },
  { id: "track", name: "PRE-ORDER DW Tracksuit Set", price: "$119.00", img: "p-hoodie", text: "Zipped Hoodie and Zipped Jacket. 80% Cotton, 20% Polyester. Weave/Blend: Fleece. Dance Worx Embroidered Logo.", sizes: true },
  { id: "tee", name: "Dance Worx T-Shirt", price: "$35.00", img: "p-tshirt", text: "Dance Worx T-Shirt - mandatory uniform.", sizes: true, pickup: true },
  { id: "ballet", name: "Ballet Shoes", price: "$35.00", img: "p-ballet", text: "", pickup: true },
  { id: "jazz", name: "Jazz Shoes", price: "$60.00", img: "p-jazz", text: "", pickup: true, best: true },
  { id: "hair", name: "Hair Pin & Net Set", price: "$10.00", img: "p-hair", text: "", pickup: true },
];
const SIZES = ["4", "6", "8", "10", "12", "14"];
