// Miss Moss Makeup のデータ。いまのサイト（Home・Pricing・Alexandria・Contact・Terms & Conditions 2024、2026-10-16 取得）のとおり。綴りの誤りだけ直した。
const PREP = "Skin is expertly prepped using Charlotte Tilbury Magic Serum and Charlotte Tilbury Dream Cream to deeply hydrate, smooth and create the perfect luminous base. Reviving under-eye patches are applied to Brighten & refresh, ensuring your makeup sits flawlessly and photographs beautifully.";
const MENU = [
  { id: "mh", name: "Makeup & Hair", img: "p-mh", studio: 295, mobile: 360, text: [PREP], inc: "Prices include false lashes", bridal: true, mins: [90, 120] },
  { id: "mu", name: "Makeup Only", img: "p-mu", studio: 175, mobile: 245, text: [PREP], inc: "Includes lashes", bridal: true, mins: [45, 60] },
  { id: "hair", name: "Hair Only", img: "p-hair", studio: 145, mobile: 210, text: ["Choose from a voluminous bouncy blowout to a timeless, elegant up style – each look tailored to complement your features, outfit and occasion.", "Your hair is professionally prepped using high quality, salon-grade products to ensure shine, hold and longevity."], inc: "Includes hair padding", bridal: true, mins: [45, 60] },
  { id: "lesson", name: "Makeup Lesson", img: "p-lesson", studio: 300, mobile: null, text: ["Elevate your skills and master your own glam with a personalised 1:1 makeup lesson. Spend 1.5 hours learning professional techniques tailored specifically for your face, features and everyday routine – so you can feel confident recreating flawless looks on your own."], inc: "1.5 hours · Studio only" },
  { id: "mhl", name: "Makeup & Hair Lesson", img: "p-mhl", studio: 450, mobile: null, text: ["Unlock the secrets to effortlessly styling your own hair and makeup with a personalised 2.5 hour lesson designed just for you. Learn easy practical tips and pro techniques that you can recreate at home."], inc: "2.5 hours · Studio only" },
];
const TERMS = [
  "Cancellations up to 4 months prior to your wedding day will result in loss of holding deposit.",
  "Any reduction in numbers for bridal party or event makeup/hair after deposit has been paid to secure the date and time required will be non-refundable.",
  "Makeup and hair trials are an additional fee and not included as part of the quote.",
  "4 person minimum for both makeup and hair is required for mobile bookings in rural locations.",
  "Early morning fee applies for bookings before 6am.",
  "No refunds on makeup and/or hair trial after service has been performed.",
  "No refunds on makeup and/or hair service.",
  "Payment via EFT is required 5 days before wedding (to allow clearance) or by cash or card (2% surcharge) on the day.",
  "Force majeure – allows Miss Moss Makeup to suspend or terminate the performance of its obligations when certain circumstances beyond their control arise, making performance inadvisable, commercially impracticable, illegal, or impossible.",
];
const WORDS = [
  { who: "Mia Berry", text: "Greer did a fantastic job on my hair and makeup for my wedding day and made me feel like a superstar! She also did my mum and sisters hair and makeup and my two little nieces hair. Everyone had something different and looked amazing. The whole day was relaxing and she was just another one of the girls and so easy going. I would highly recommend Greer! Thanks Greer for sharing my day with me! x" },
  { who: "Stephanie Radnan", text: "Greer, Thank you so much for my amazing hair and makeup! You were an angel – the makeup lasted the WHOLE night even through all the sun, dancing and sweat!" },
  { who: "Lauren Yon", text: "Greer you did such an amazing job, THANKYOU so so much. You made us not only look fab but also feel amazing. You knew exactly how to make me look and feel my best, without myself even knowing. I had complete faith in you to work your magic, and you delivered beyond my expectations. It was such a pleasure to work with you as part of my wedding day. I can’t wait for another excuse to get my hair and make up done with you again sometime soon!" },
];
const BA = 25, WED = 24, EV = 25;
const BOOKING = "https://outlook.office365.com/owa/calendar/MissMossMakeup2@missmossmakeup.com.au/bookings/";
const WSZ=[[600,900],[640,640],[640,640],[600,900],[900,900],[640,799],[900,889],[900,600],[900,900],[512,341],[600,900],[600,900],[900,600],[640,640],[900,900],[600,900],[709,709],[640,640],[640,418],[720,900],[900,600],[640,640],[900,599],[900,900]];
const ESZ=[[760,760],[760,760],[730,760],[756,760],[608,760],[760,760],[608,760],[760,760],[608,760],[760,760],[608,760],[570,760],[757,757],[608,760],[608,760],[689,760],[690,760],[608,760],[530,625],[760,760],[570,760],[760,760],[427,760],[640,640],[570,760]];
