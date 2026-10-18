// ツアーとレンタルの料金・内容（今のサイトの各ページから。2026-10-18 取得）
const INCL = ["Super comfortable bicycle (child bikes, baby seats, and trail alongs available)", "Custom, shiny red Bonza helmets", "Bicycle mounted bags for small items (camera, wallet, etc.)", "Secure bag storage (while you are out on the tour)", "Fun, entertaining guide knowledgeable in the city and surrounds"];
const TOURS = [
  { id: "classic", name: "Sydney Classic Tour", tag: "Sydney’s most popular bike tour", fit: "Great for anyone that can ride a bike!",
    lede: "An easy ride to all of Sydney’s iconic sites, including a brief ride on the bridge and stop at a historic Sydney pub.",
    desc: "The Sydney Classic is our most popular guided bike tour. It’s an easy ride through parks, along the harbour, and past all of Sydney’s iconic sites. You’ll get to ride on the world famous Sydney Harbour Bridge and relax in one of Sydney’s oldest pubs…it’s the one tour in Sydney that shows a little bit of everything along the way!",
    p: { a: 149, c: 129, f: 449, x: 109 }, dur: "4 Hours", hrs: 4, meet: "10:30am", extra: [],
    stops: ["Sydney Opera House", "Sydney Harbour Bridge", "Circular Quay", "Observatory Hill", "Historic pub stop", "Barangaroo", "Darling Harbour", "Chinatown", "ANZAC Memorial", "Hyde Park", "Mrs Macquarie’s Chair"] },
  { id: "highlights", name: "Sydney Highlights Tour", tag: "A quick introduction to Sydney on a bike", fit: "Great for those short on time or families with small children.",
    lede: "A quick trip past all the must-see sites in Sydney with a route that couldn’t be any easier of a ride.",
    desc: "If you prefer to just see Sydney’s highlights, and want do so in the shortest time possible, then this ride’s for you! The guided tour will do a quick loop of Sydney, taking in just the absolute, must-see areas of the city. There’s no better way to get your bearings and a quick feel for the city than the Sydney Highlights Tour.",
    p: { a: 119, c: 99, f: 349, x: 79 }, dur: "2½ Hours", hrs: 2.5, meet: "2:30pm (Apr 1st – Sep 30th) · 3:30pm (Oct 1st – Mar 31st)", extra: [],
    stops: ["Sydney Opera House", "Circular Quay", "Barangaroo", "Darling Harbour", "Chinatown", "ANZAC Memorial", "Hyde Park", "Mrs Macquarie’s Chair"] },
  { id: "bridge", name: "Sydney Harbour Bridge Ride", tag: "Conquer the bridge on a bike", fit: "Great for those with a little extra time or looking for a longer ride.",
    lede: "A longer ride that adds some hidden gems in North Sydney with the rest of Sydney’s icons, including a gourmet picnic lunch on Observatory Hill.",
    desc: "You’ve seen it – you may have climbed it – but have you ridden over it yet?? Head out over the fantastic Sydney Harbour Bridge, and take in its amazing views on a breathtaking 2.5 km stretch of easy harbour-side riding. You’ll enjoy a gourmet sandwich as a picnic lunch before finishing your tour on a ride around Sydney’s iconic sites.",
    p: { a: 189, c: 169, f: 579, x: 149 }, dur: "5 Hours", hrs: 5, meet: "10:30am", extra: ["Lunch and beverage are included on this tour"],
    stops: ["Sydney Opera House", "Sydney Harbour Bridge", "Circular Quay", "Observatory Hill", "Streets of Kirribilli", "Luna Park", "Lavendar Bay", "Barangaroo", "Darling Harbour", "Chinatown", "ANZAC Memorial", "Hyde Park", "Mrs Macquarie’s Chair"] },
  { id: "manly", name: "Manly Beach & Sunset Cruise", tag: "A bike tour and harbour cruise all in one", fit: "Great for those that want to get out of the city and don’t mind a big hill!",
    lede: "A unique view of Sydney from the Manly ferry followed by a scenic ride along iconic Manly Beach and stunning views from North Head.",
    desc: "Enjoy stunning views of Sydney Harbour and its beautiful skyline on the ferry to and from Manly. We’ll pedal along famous Manly Beach, and after powering through a couple good hills, we’ll breathe the cool ocean air atop North Head’s coastal cliffs. After taking in the best views of the harbour, and possibly seeing whales, we’ll finish with the sun setting over Sydney.",
    p: { a: 199, c: 179, f: 599, x: 149 }, dur: "4 hours", hrs: 4, meet: "2:30pm (Apr 1st – Sep 30th) · 3:30pm (Oct 1st – Mar 31st)", extra: ["Return ferry trip to Manly"], min: 2,
    stops: ["Sydney ferry sunset", "Manly Wharf", "Manly Beach", "Shelley Beach", "Coastal ride", "Coastal cliffs", "St. Patrick’s Seminary", "North Head critters", "North Head wildlife"] },
  { id: "nye", name: "NYE Victory Lap Tour", tag: "An ode to the year that was on a bike", fit: "New Year’s Eve only, once a year.",
    lede: "This tour only happens one time a year, on New Year’s Eve! The route is based on our Sydney Highlights Tour route, finishing in plenty of time to get your spot for Sydney’s world famous fireworks!",
    desc: "NEW YEAR’S EVE ONLY – This tour only happens one time a year, on New Year’s Eve! It is a celebration of the year that was with the last lap of the year for Bonza’s bicycle tours. The route is based on our Sydney Highlights Tour route – a great city loop and orientation around the city – finishing in plenty of time to get your spot for Sydney’s world famous fireworks!",
    p: { a: 119, c: 99, f: 349, x: 79 }, dur: "2½ Hours", hrs: 2.5, meet: "10:30am, 31 December only", extra: [],
    note: "Please Note: This tour DOES NOT include riding past the Sydney Harbour Bridge, Sydney Opera House, and Royal Botanic Gardens or a stop at a pub.",
    stops: [] },
];
const EBIKE = 40;
const HIRE = { rows: [["1 hour", 20, 69], ["4 hours", 35, 119], ["24 hours", 50, 159]], extraDay: [20, 69] };
const FLEET = [["trek-mens", "TREK Men’s Hybrid"], ["trek-womens", "TREK Women’s Hybrid"], ["tagalong", "Children’s Tandem Tagalong"], ["kids-20", "Small (20\") Children’s Bike"], ["kids-24", "Large (24\") Children’s Bike"], ["kiddicarrier", "Kiddicarrier"]];
