// 今のサイトの料金表・FAQ・時間割（いずれも画像で載っているもの）を、原文どおりに文字に起こしたもの。2026-10-20 取得
const LOCS = [
  { id: "chatswood", name: "Chatswood", state: "Sydney, NSW", venue: "Equinox Martial Arts Academy", addr: "Unit 18, 390 Eastern Valley Way, Chatswood NSW",
    venue2: "Club Pilates, Roseville", addr2: "Unit 16, 390 Eastern Valley Way, Chatswood NSW", img: "class.jpg",
    tag: "Home of the Punchin’ Parkos",
    text: "Our Chatswood HQ has been operating for 10 years and is home to KOPD’s most developed program. It is a large, vibrant and supportive community offering Parkinson’s-specific boxing, strength, balance and Pilates Reformer classes.",
    more: ["KOPD Chatswood is our original location and the headquarters of Knock Out Parkinson’s Disease.", "Now based out of Equinox Martial Arts Academy & Club Pilates, brand new facilities - this is where the program continues to evolve.", "Led by Accredited Exercise Physiologists and Coaches, our Chatswood branch offers the most comprehensive and established program specifically designed for people with Parkinson’s.", "It’s more than just a training space — it’s the home of our community and the hub of our mission to change lives through exercise, empowerment, and connection."],
    offers: ["boxing", "reformer"], phone: "0400 396 339",
    reformer: ["The newest class at KOPD designed & coached by experienced Exercise Physiologists specialising in Parkinson's. Train in a supported environment while challenging stability, coordination, and movement quality. The result is a powerful combination of resistance, control, and confidence-building movement that helps people with Parkinson’s move better, feel stronger, and stay active.", "Limited spots — register now to secure your place."],
    times: [["Wednesday", "11:30am – 12:30pm", "Reformer for Parkinson’s", "Club Pilates"], ["Friday", "1:30 – 2:30pm", "Reformer for Parkinson’s", "Club Pilates"]],
    timesNote: "Boxing, strength and balance class times at Chatswood: please ask us and we will send the current timetable." },
  { id: "gladesville", name: "Gladesville", state: "Sydney, NSW", venue: "PTJ Muay Thai Gym", addr: "1f/28-30 Buffalo Rd, Gladesville NSW 2111", img: "low-punch.jpg",
    tag: "Our newest Sydney branch",
    text: "Our Gladesville location brings KOPD’s Parkinson’s-specific exercise program to the Inner West/Ryde area. Supported by local partnerships with Concord Hospital Movement Disorder Clinic & the Breakfast Point Men's Shed.",
    more: ["Our newest KOPD branch, located in Gladesville, is dedicated to growing a strong, supportive community for people living with Parkinson’s in Sydney’s Inner West.", "Hosted at PTJ Muay Thai Gym and backed by local partnerships, this branch offers our signature non-contact, Exercise Physiologist-led boxing sessions designed to improve strength, coordination, and confidence.", "Whether you're newly diagnosed or have been managing Parkinson’s for years, KOPD Gladesville is here to help you move better, feel better, and connect with others"],
    offers: ["boxing"], times: [["Monday", "1:30 – 2:30pm", "Boxing", "PTJ Muay Thai Gym"]] },
  { id: "hobart", name: "Hobart", state: "Hobart, Tas", venue: "Hybrid Training Centre", addr: "121 Argyle Street, Hobart TAS 7000", img: "boxer-back.jpg",
    tag: "KOPD in Tasmania",
    text: "Our Hobart location extends KOPD’s mission into Tasmania, providing a welcoming space for people with Parkinson’s to build strength, confidence, connection and independence through targeted exercise.",
    more: ["KOPD is excited to bring our life-changing program to Hobart, Tasmania!", "Operating out of the Hybrid Training Centre, we’re starting with our flagship Boxing classes.", "Designed specifically for individuals with Parkinson’s Disease, these evidence-based sessions aim to improve strength, coordination, and confidence in a supportive environment.", "Fill out the form below to join the community."],
    offers: ["boxing"], times: [], timesNote: "Ask us for the Hobart class times and pricing.",
    coach: ["Christopher Drummond", "Director & Head Striking Coach of HTC. Professional Muay Thai, Boxing, & MMA Fighter."] },
];
// Chatswood の料金（KOPD Pricing の画像から）
const PRICE_CHAT = {
  kopd: [["1 Class", "1 KOPD class per week", 45], ["All Boxing Classes", "Unlimited KOPD Boxing classes", 80]],
  reformer: [["1 Class", "1 Reformer class per week", 45], ["2 Classes", "2 Reformer classes per week", 80]],
  combo: [["1 x Boxing class + 1 x Reformer class", 80], ["All Boxing classes + 1 x Reformer class", 110], ["All Boxing classes + 2 x Reformer classes", 130]],
  addon: 30,
};
const PRICE_GLAD = [["Gladesville", "Single weekly option", "1 Session", "1 class per week at Gladesville", 45], ["Crossover", "For clients wanting access across both locations", "All Boxing Classes", "Access to all boxing classes in both Chatswood and Gladesville", 80]];
const FAQ = [
  ["How do I sign up?", "Click ‘Get Started’ in the top right corner of our website to begin. You’ll be taken through a quick and simple registration process, and our team will reach out to help you get started."],
  ["Is this program suitable for me?", "Absolutely. KOPD is designed for people living with Parkinson’s at all stages, levels of fitness, function, and exercise experience. Our classes are led by Accredited Exercise Physiologists who tailor the program to meet your individual needs. Your level will be assessed before or during your first session to make sure the program is safe, appropriate, and the right fit for you."],
  ["Do I need any experience?", "No experience is required. Many KOPD participants had never boxed or exercised regularly before starting. All you need is clearance from your GP or Neurologist via a short medical form we’ll send you during registration."],
  ["Is this a contact boxing program?", "No. KOPD is a non-contact program. You’ll be punching bags, focus pads, and completing mobility, strength, balance, and coordination drills — not sparring or fighting. The goal is to improve movement, function, strength, balance, confidence, and quality of life in a safe and empowering environment."],
  ["Does exercise actually help Parkinson’s?", "Yes — and the research strongly supports it. Structured exercise can help improve or maintain motor function, mobility, strength, balance, walking capacity, and quality of life. Exercise is a key part of long-term Parkinson’s management."],
  ["Can a carer or family member participate?", "Yes. We offer a Corner Pass, which allows one carer or family member to join selected KOPD sessions for free. The Corner Pass applies to KOPD Boxing, Strength & Conditioning, and Balance. It does not apply to Reformer Pilates."],
  ["What should I bring?", "Bring comfortable workout clothes, a reusable water bottle, a towel, and boxing gloves and wraps if you already have them. If you don’t have gloves or wraps, we’ll help you get sorted."],
  ["Where are you located?", "KOPD currently operates from the following official locations: Chatswood, Gladesville, and Hobart. Information on how to find each location is listed on each site’s individual page on this website."],
  ["What does it cost?", "Your first class is free — you can observe, participate, or simply meet the team with no pressure and no charge. Each location has its own pricing structure based on the services available at that site. Pricing information for each location is listed on the individual location pages of this website."],
  ["Can I use NDIS or Home Care Package funding?", "Yes. KOPD and ATHOS services can be accessed through NDIS, Home Care Packages, and other support arrangements, depending on your funding type, goals, and plan. Our team can provide invoices and supporting information where appropriate, and we can help you understand how KOPD may fit within your broader exercise, therapy, or support plan."],
  ["Can I pause my weekly plan?", "Yes. KOPD access can be paused temporarily if you are away or unable to attend for a period of 2 weeks or more. We require at least 1 week’s notice before the pause begins. You can pause for a maximum of 12 weeks per calendar year."],
  ["How do I cancel?", "If you need to cancel your KOPD access indefinitely, we require 2 weeks’ notice. Please contact the team directly so we can process the cancellation and confirm your final date."],
  ["Still have questions?", "We’d love to help. Email us at info@kopd.com.au"],
];
const VOICES = [
  ["Linda Bateman", "I am so grateful to have found KOPD! I have Parkinson's, I am also a retired physiotherapist, I have noticed an increase in strength, coordination and balance in a few weeks! Look no further there's nothing not to like about KOPD."],
  ["Rick Hall", "I have attended KOPD for a number of years and always found them to be professional and helpful. The exercises are always varied and extremely helpful to my physical and mental condition."],
  ["Dana Meng", "I'm soooo happy that we found KOPD! My mum has Parkinson's and joined the team this March. Within 2 months, I've noticed my mum has more energy, less tired, and become bubbly (like before). There is obvious improvement in almost all aspects!!!"],
];
// 記事の話題（題名から分類。分け方は試作でつけたもの）
const TOPICS = [["move", "Moving & balance", /walk|balance|fall|standing|cueing|stretch|hiit|interva?il|rt$|resistance|swim/i], ["daily", "Daily life", /driv|employ|adapt|music|sleep|libido/i], ["body", "Symptoms & health", /tremor|pain|pneumonia|hypertension|apathy|fava/i]];
