// 部品のための事実（今のサイトの各ページから。2026-10-18 取得）
const VIEWS = [
  ["kids", "Kids & juniors", "Tennis for children from 3, Hot Shots, squads and junior competition."],
  ["adults", "Adults", "Lessons, clinics, Cardio Tennis, Tennis Anyone?, UTR competition and corporate days."],
  ["swim", "Swim school", "AUSTswim and Swim Australia approved learn to swim, from 4 months to adults."],
  ["holidays", "Holiday camps", "Tennis, multi skills and swimming camps, and vacation care, every school holidays."],
  ["care", "OOSH & schools", "Before & after school care, vacation care and school programs."],
  ["courts", "Court hire", "Four synthetic grass floodlit courts, open daily 7am till 11pm."],
  ["club", "Club & membership", "About us, our team, membership, events, galleries and joining the team."],
  ["shop", "Pro shop", "Racquets, balls, accessories, active wear and gift certificates."],
  ["info", "Info & policies", "Office hours, how to find us, policies, code of conduct and privacy."],
];
// 誰が・何を → 関係するページ
const PICK = {
  age: [["3-5", "3 to 5"], ["5-12", "5 to 12"], ["teen", "Teens"], ["adult", "Adults"]],
  want: [["learn", "Learn tennis"], ["play", "Play & compete"], ["swim", "Swim"], ["holiday", "School holidays"], ["fit", "Get fit"]],
  map: {
    "3-5|learn": ["gross-motor-skills-prep-tennis-camp-3-5-", "prep-explore", "ctc-tennis-hot-shots-explore"],
    "5-12|learn": ["ctc-tennis-hot-shots-junior-development-", "red-explore", "junior-tennis-coaching", "private-and-semi-private-tennis-lessons"],
    "teen|learn": ["junior-tennis-coaching", "development-squads", "private-and-semi-private-tennis-lessons"],
    "adult|learn": ["adults-tennis-lessons", "adult-group-lessons", "adult-tennis-clinics", "private-and-semi-private-tennis-lessons"],
    "3-5|play": ["ctc-tennis-hot-shots-explore", "junior-weekly-comp"],
    "5-12|play": ["junior-weekly-comp", "junior-development-pathway", "tournaments"],
    "teen|play": ["performance-squads", "tournaments", "utrs-ctc", "whats-your-itn"],
    "adult|play": ["tennis-anyone", "adult-competition-utr", "adult-tennis-tournaments", "tennis-court-hire"],
    "3-5|swim": ["learn-swim", "swim-school-fees"], "5-12|swim": ["learn-swim", "swim-school-fees", "intensive-swimming-holiday-program-curre"],
    "teen|swim": ["learn-swim", "swim-school-fees"], "adult|swim": ["learn-swim", "swim-school-fees"],
    "3-5|holiday": ["gross-motor-skills-prep-tennis-camp-3-5-", "holiday-programs", "term-dates"],
    "5-12|holiday": ["holiday-programs", "ctc-tennis-hot-shots-camp", "holiday-multi-skills-fitness-camps", "vacation-care", "term-dates"],
    "teen|holiday": ["high-performance-tennis-camps", "holiday-programs", "term-dates"], "adult|holiday": ["adult-tennis-clinics", "term-dates"],
    "3-5|fit": ["gross-motor-skills-prep-tennis-camp-3-5-"], "5-12|fit": ["junior-fitness", "holiday-multi-skills-fitness-camps"],
    "teen|fit": ["junior-fitness", "tennis-fitness"], "adult|fit": ["tennis-fitness", "tennis-anyone"],
  },
};
const RATES = { mem: { day: 19, eve: 25, we: 25 }, casual: 27, racquet: 10, machine: 60 };
const MEMBERSHIP = [["Adults", 103], ["Children under 18", 50], ["Pensioners/Seniors", 62], ["Students", 62], ["Family (based on a family of 4)", 205]];
// 2026年の学期と休暇キャンプ（Term Dates のページから）
const TERMS = [
  ["camp", "Summer holiday camps", "2026-01-12", "2026-01-30"], ["term", "Swim & tennis Term 1", "2026-02-02", "2026-04-02"],
  ["camp", "Autumn holiday camps", "2026-04-07", "2026-04-21"], ["term", "Swim & tennis Term 2", "2026-04-20", "2026-07-05"],
  ["camp", "Winter holiday camps", "2026-07-06", "2026-07-20"], ["term", "Swim & tennis Term 3", "2026-07-20", "2026-09-27"],
  ["camp", "Spring holiday camps", "2026-09-28", "2026-10-12"], ["term", "Swim & tennis Term 4", "2026-10-12", "2026-12-17"],
];
const SWIM = [["Parent & Baby", "Per class (30 min)", "$243 (9 week term) · $270 (10 week term) · $297 (11 week term)"],
  ["Pre-school & School age · Marlin, Teen Beginner & Adult", "Per class (45 min)", "$365 (9 week term) · $390 (10 week term) · $415 (11 week term)"],
  ["Private tuition, one on one", "Per lesson (30 min)", "$73 per person/per lesson"], ["Private tuition, one on one", "Per lesson (60 min)", "$125 per person/per lesson"],
  ["One on two (semi private)", "Per lesson", "$52 per person/per lesson"]];
