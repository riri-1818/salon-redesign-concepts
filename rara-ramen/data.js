// RaRa Ramen のメニュー。両店の Square 注文ページ（rara-randwick.square.site・shop-co-109353.square.site、2026-10-16 取得）のとおり。at＝取り扱い店。綴りだけ直した（ceoliac・Children's Kid's・Paitan-）。
const MENU = [
 {
  "cat": "Snacks",
  "name": "Pork Gyoza",
  "desc": "Pork Dumplings, steamed and pan fried. Garnished with sliced shallots and served with our house made soy vinegar dipping sauce. *May contain tree nuts*",
  "price": "11.90",
  "at": "both"
 },
 {
  "cat": "Snacks",
  "name": "Sanshō chilli chicken gyoza",
  "desc": "5 Chicken dumplings, steamed and pan fried. Garnished with sliced shallots and served with our house made sansho chilli oil and soy & vinegar dipping sauce. *May contain tree nuts*",
  "price": "12.90",
  "at": "both"
 },
 {
  "cat": "Snacks",
  "name": "Chicken Karaage",
  "desc": "Housemade shio tare seasoned crispy fried chicken, topped with a lemon wedge and a side serving of Japanese mayonnaise. ** Note this is a GF dish but not coeliac safe, due to soy sauce in the seasoning.",
  "price": "14.90",
  "at": "both",
  "tags": [
   "GF"
  ]
 },
 {
  "cat": "Snacks",
  "name": "Housemade Seasonal Japanese Pickles",
  "desc": "Pickled cucumber and daikon. Slightly sweet and sharp made from the addition of Japanese rice vinegar.",
  "price": "9.80",
  "at": "both"
 },
 {
  "cat": "Snacks",
  "name": "Vegan Gluten-Free Gyoza",
  "desc": "5 Vegetable gluten free dumplings, steamed and pan fried. Garnished with sliced shallots and served with our house made gluten free soy vinegar dipping sauce. *May contain sesame*",
  "price": "13.90",
  "at": "redfern",
  "tags": [
   "Vegan",
   "GF"
  ]
 },
 {
  "cat": "Ramen",
  "name": "Tonkotsu",
  "desc": "House made Tonkotsu broth with shio tare. Topped with 2 coal grilled chashu (braised pork belly), seasoned bamboo, half ajitsuke tamago (seasoned egg), shallots, shredded black fungus, and our Hakata noodles. Note: our seasoned eggs contain: fish, soy, mushroom.",
  "price": "24.50",
  "at": "both"
 },
 {
  "cat": "Ramen",
  "name": "Tori Paitan – Chicken Ramen",
  "desc": "Tori Paitan (the cool chicken cousin of Tonkotsu), a creamy, silky. Served with our thin hakata noodles, topped with half ajitsuke tamago (seasoned egg), shallots, coal grilled chicken chashu, grilled corn and served with a wedge of lemon and sancho pepper. Note: our seasoned eggs contain: fish, soy, mushroom.",
  "price": "24.90",
  "at": "both"
 },
 {
  "cat": "Ramen",
  "name": "Vegan Soy Miso",
  "desc": "Soy based broth with a complex nutty and sweet miso Tare. Topped with grilled seasoned tofu, charred sweet corn, purple cabbage, bean sprouts, pickled bamboo shoots, shallots & black fungus. Served with house made thin hakata noodles. ** Add an egg to make it vegetarian",
  "price": "23.90",
  "at": "both",
  "tags": [
   "Vegan"
  ]
 },
 {
  "cat": "Ramen",
  "name": "Vegan Soy Shio",
  "desc": "Soy based broth with speciality Shio (salt) tare served with grilled tomato seasoned with black pepper, seasoned bamboo (menma), black fungus, shallots and chilli jam. All served on a bed of our vegan handmade hakata noodles.",
  "price": "22.90",
  "at": "both",
  "tags": [
   "Vegan"
  ]
 },
 {
  "cat": "Mazesoba & Rice Bowls",
  "name": "Pork Chashu Mazesoba",
  "desc": "Soupless ramen with our thicker noodles and shoyu tare. Diced coal grilled pork belly chashu, half ajitsuke tamago (seasoned egg), shallots, blanched bean sprouts and wombok, fried onion and garlic, a drizzle of chilli oil, chilli jam, mayonnaise and mackerel bonito seasoning. \"Maze\" means mix. So please mix well before eating. Note: our seasoned eggs contain: fish, soy, mushroom.",
  "price": "25.50",
  "at": "both"
 },
 {
  "cat": "Mazesoba & Rice Bowls",
  "name": "Chicken Chashu Mazesoba",
  "desc": "Soupless ramen with our thicker noodles and Shoyu Tare. Diced coal grilled chicken chashu, onsen egg, menma, shallots, blanched bean sprouts and wombok, fried onion, a drizzle of chilli oil, chilli jam, mayonnaise and mackerel bonito seasoning. \"Maze\" means mix. So please mix well before enjoying.",
  "price": "24.90",
  "at": "both"
 },
 {
  "cat": "Mazesoba & Rice Bowls",
  "name": "Chicken Karaage Mazesoba with Truffle Mayonnaise",
  "desc": "Thick chewy noodles tossed with shoyu tare and truffle oil. Topped with crunchy chicken karaage, seaweed, blanched bean sprouts & Chinese cabbage, house made truffle mayonnaise, onsen egg, red onion, corn and parmesan cheese. Maze means mix. So please mix before you enjoy.",
  "price": "25.90",
  "at": "both"
 },
 {
  "cat": "Mazesoba & Rice Bowls",
  "name": "Pork Chashu Rice Bowl",
  "desc": "Marinated grilled free range pork belly served on a bed of rice and accompanied by onsen egg (63 degree sous vide egg), shallots, pickled ginger, shredded seaweed, mayonnaise and chilli jam.",
  "price": "21.90",
  "at": "both"
 },
 {
  "cat": "Mazesoba & Rice Bowls",
  "name": "Chicken Chashu Rice Bowl",
  "desc": "Marinated diced grilled chicken chashu, served on a bed of rice and accompanied by onsen egg (63 degree sous vide egg), shallots, pickled ginger, shredded seaweed, mayonnaise and chilli jam.",
  "price": "21.90",
  "at": "both"
 },
 {
  "cat": "Mazesoba & Rice Bowls",
  "name": "Kid's Chicken Mazesoba",
  "desc": "Mazesoba noodles served with charcoal chicken, sweet corn, half ajitsuke tamago (seasoned egg) and nori topped with toasted seaweed, mayonnaise and a sprinkle of parmesan cheese. This dish does not contain broth. For 12 years and under. Note: our seasoned eggs contain: fish, soy, mushroom.",
  "price": "14.50",
  "at": "randwick",
  "tags": [
   "Kids"
  ]
 },
 {
  "cat": "Non-Alcoholic Drinks",
  "name": "Coke Can",
  "desc": "An ice cold coca-cola can. 375Ml.",
  "price": "4.00",
  "at": "both"
 },
 {
  "cat": "Non-Alcoholic Drinks",
  "name": "Coke No Sugar Can",
  "desc": "Ice cold coca-cola (No Sugar) can. 375Ml",
  "price": "4.00",
  "at": "both"
 },
 {
  "cat": "Non-Alcoholic Drinks",
  "name": "Green Iced Tea",
  "desc": "Life is Sweeter without Sugar® Oi Ocha (oh-ee oh-cha) is Japan's No.1 green tea brand and means \"Tea, please!\". Enjoy this canned green tea produced by Ito En, Japan's foremost tea purveyor",
  "price": "4.50",
  "at": "both"
 },
 {
  "cat": "Non-Alcoholic Drinks",
  "name": "Pokka Sparkling Fuji Apple",
  "desc": "A lightly carbonated sparkling fuji apple juice.",
  "price": "5.10",
  "at": "both"
 },
 {
  "cat": "Non-Alcoholic Drinks",
  "name": "Calpis",
  "desc": "This Japanese beverage has a light, somewhat milky, and slightly acidic flavor, similar to plain or vanilla flavored yogurt or Yakult",
  "price": "5.00",
  "at": "both"
 },
 {
  "cat": "Non-Alcoholic Drinks",
  "name": "Lychee Aloe Vera Drink",
  "desc": "Juicy & refreshing lychee taste will satisfy your thirst. The texture of aloe vera is fun in your mouth.",
  "price": "5.50",
  "at": "both"
 },
 {
  "cat": "Non-Alcoholic Drinks",
  "name": "Lychee Iced Tea",
  "desc": "With the sweetness of lychee, this Pokka ice tea is served over ice.",
  "price": "4.50",
  "at": "both"
 },
 {
  "cat": "Non-Alcoholic Drinks",
  "name": "Ramune Japanese Lemonade",
  "desc": "A refreshing lemonade flavoured Japanese soda.",
  "price": "5.80",
  "at": "both"
 },
 {
  "cat": "Non-Alcoholic Drinks",
  "name": "Sparkling Water bottle",
  "desc": "330ml sparkling water",
  "price": "4.50",
  "at": "redfern"
 },
 {
  "cat": "Merch",
  "name": "RaRa Print Tote Black",
  "desc": "RaRa Tote made from a heavier weight cotton canvas. Suitable for all your goods and includes an internal pocket. Artwork by Julian Wenger. Size: 36 x 40 x 12cm (Gusset) Internal Pocket: 20cm x 14cm Handles: 65 x 3.5cm",
  "price": "35.00",
  "at": "both",
  "was": "39.00"
 },
 {
  "cat": "Merch",
  "name": "RaRa Anniversary Black T-shirt",
  "desc": "To celebrate 7 years of RaRa, we have collaborated with artist Julian Wenger to release a limited run of t-shirts. Julian worked at RaRa in the first year of our Redfern store and was part of the reason we are here today along with the rest of our team. IG @Julian.wenger_art",
  "price": "40.00",
  "at": "both"
 },
 {
  "cat": "Merch",
  "name": "RaRa Anniversary White T-shirt",
  "desc": "To celebrate 7 years of RaRa, we have collaborated with artist Julian Wenger to release a limited run of t-shirts. Julian worked at RaRa in the first year of our Redfern store and was part of the reason we are here today along with the rest of our team. IG @Julian.wenger_art",
  "price": "40.00",
  "at": "both"
 },
 {
  "cat": "Merch",
  "name": "RaRa Print Tote Orange",
  "desc": "RaRa Goods Tote made from a heavier weight cotton canvas. Suitable for all your goods and includes an internal pocket. Art work by Julian Wenger. Size: 36 x 40 x 12cm (Gusset) Internal Pocket: 20cm x 14cm Handles: 65 x 3.5cm",
  "price": "35.00",
  "at": "redfern",
  "was": "39.00"
 }
];
const LOC = {
  redfern: { name: "Redfern", addr: "66b Regent St, Redfern NSW 2016", map: "https://www.google.com/maps/place/RaRa+Redfern/@-33.8925548,151.2001534,15z/data=!4m5!3m4!1s0x0:0x32151e2e63b8dc09!8m2!3d-33.8925548!4d151.2001534", book: "https://www.sevenrooms.com/explore/rararamenredfern/reservations/create/search?venues=rararamenrandwick%2Crararamenredfern", order: "https://shop-co-109353.square.site/s/order", since: "Since 2018" },
  randwick: { name: "Randwick", addr: "Shop 1/162-164 Barker St, Randwick NSW 2031", map: "https://www.google.com/maps/place/RaRa+Ramen+Randwick/@-33.9212707,151.2361445,17z/data=!3m1!4b1!4m5!3m4!1s0x6b12b3a183a1613b:0x1e1dbbcb117595aa!8m2!3d-33.9212707!4d151.2383332", book: "https://www.sevenrooms.com/explore/rararamenrandwick/reservations/create/search?venues=rararamenrandwick%2Crararamenredfern", order: "https://rara-randwick.square.site", since: "" },
};
const GIFT = "https://squareup.com/gift/MLXWAFBR4KHT8/order";
